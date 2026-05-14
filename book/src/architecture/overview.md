# Architecture Overview

TRX is split into a small set of focused modules. Each module has a single responsibility and communicates with the others through well-defined interfaces.

```
src/
├── main.rs          # Entry point, terminal setup, execute_external_command helper
├── config.rs        # TOML configuration loading
├── updater.rs       # GitHub release polling and binary self-replacement
├── ui/
│   ├── mod.rs
│   ├── app.rs       # App state, event loop, channel polling
│   ├── draw.rs      # ratatui rendering logic
│   └── input.rs     # InputMode enum, character-level editing, debounce state
├── managers/
│   ├── mod.rs       # PackageManager trait, Package struct, parse_alternating_lines, DETAILS_CACHE
│   ├── arch.rs      # ArchManager — delegates to pacman.rs and yay.rs
│   ├── pacman.rs    # Pacman system-call wrapper
│   ├── yay.rs       # yay/AUR system-call wrapper
│   ├── apt.rs       # AptManager
│   └── brew.rs      # BrewManager
└── fuzzy/
    └── mod.rs       # Scoring-based fuzzy match engine
```

---

## Key Data Structures

### `Package`

Defined in `src/managers/mod.rs`, this is the universal package representation passed through all layers of the application:

```rust
pub struct Package {
    pub provider: String,    // e.g. "pacman", "aur", "apt", "brew"
    pub name: String,        // full name, possibly prefixed: "core/ripgrep"
    pub version: String,
    pub description: String,
    pub score: f64,          // fuzzy match score used for ranking
}
```

### `App`

Defined in `src/ui/app.rs`. Holds all runtime state:

- `input` — current search string
- `current_tab` — which of the three tabs is active
- `packages` — the currently displayed list
- `checked` / `selected_names` — multi-selection state
- `installed_packages` — `HashSet<String>` fetched once on startup
- `details_state` — sidebar content (`Empty | Loading | Success | Error`)
- `loading` — drives the spinner in the header
- `manager` — `Arc<Box<dyn PackageManager>>` shared across spawned threads

---

## Module Interactions

```
keyboard event
      │
      ▼
  App::run() ──── spawns thread ──► PackageManager::search()
      │                                     │
      │◄── result_rx (mpsc) ◄───────────────┘
      │
      ▼
  draw_ui() (ratatui frame render)
```

The event loop in `App::run` does three things every iteration:

1. **Poll keyboard** — via `crossterm::event::poll` with a short timeout so the loop never blocks long.
2. **Drain channels** — `try_recv` on `result_rx` and `details_rx` (non-blocking).
3. **Render** — call `draw_ui` to produce the next terminal frame.

---

## Startup Sequence

1. Parse CLI flags (`--version`, `--help`).
2. Call `updater::check_for_updates()` — if a newer release exists, self-update and exit.
3. Initialise the ratatui terminal (`ratatui::init`).
4. Load `Config` from the TOML file (or write defaults).
5. Call `managers::get_system_manager(&config)` to select the correct backend.
6. Create the `mpsc` channels and construct `App`.
7. Enter `App::run()` — the main event loop.
8. On exit, restore the terminal (`ratatui::restore`).
