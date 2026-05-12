# TRX runtime flows (UI → managers)

This document traces how the TUI in [`src/ui/app.rs`](../src/ui/app.rs) drives package search and install, through the [`PackageManager`](../src/managers/mod.rs) trait into backend modules.

## Search (Search tab)

1. **Input mode** — Press `e` to enter `InputMode::Editing` ([`src/ui/input.rs`](../src/ui/input.rs)). Typing calls `enter_char` / `delete_char`, which set `pending_search = true` and refresh `last_input_time` for debouncing.

2. **Debounce** — Each frame on the Search tab, `check_and_execute_search` runs ([`src/ui/app.rs`](../src/ui/app.rs)). After **50 ms** without new keystrokes, if the trimmed query is non-empty and differs from `last_search_query`, it:
   - sets `loading = true`,
   - clones `result_tx` and `manager` (`Arc<Box<dyn PackageManager>>`),
   - spawns a **std::thread** that calls `manager.search(&query)` and sends `(query, Vec<Package>)` on `result_tx`.

3. **Backend search** — `manager` comes from `get_system_manager` in [`src/managers/mod.rs`](../src/managers/mod.rs) (e.g. macOS → `BrewManager`, Linux with `pacman` → `ArchManager`, with `apt` → `AptManager`). Example (**Arch**): [`ArchManager::search`](../src/managers/arch.rs) merges `pacman::search_pacman` and `yay::search_aur`, sorts by fuzzy `score`, truncates to 50. **Pacman** path runs `pacman -Ss` and parses lines via [`parse_alternating_lines`](../src/managers/mod.rs), which applies [`crate::fuzzy::fuzzy_match`](../src/fuzzy/mod.rs) to package names.

4. **Apply results** — Main loop `try_recv`s on `result_rx`. If the tag matches the current tab (Search: `q == self.input.trim()`), it replaces `packages`, rebuilds `checked` from `selected_names`, resets selection, clears `loading`, and may call `trigger_details_fetch` for the first row.

5. **Details (sidebar)** — Moving selection or changing row calls `trigger_details_fetch`, which spawns another thread calling `manager.get_details(&pkg.name, &pkg.provider)` and sends `DetailsState` on `details_tx`.

## Install

1. **Selection** — In Normal mode, `Space` toggles the current row in `checked` and adds/removes the package **name** in `selected_names` ([`src/ui/app.rs`](../src/ui/app.rs)).

2. **Key `i`** — Calls `run_command`, which no-ops if `selected_names` is empty; otherwise `self.manager.install(terminal, &self.selected_names)` with the live ratatui `DefaultTerminal`.

3. **Backend install** — Each `PackageManager` runs the appropriate system commands, typically after leaving the alternate screen via [`execute_external_command`](../src/main.rs) (or equivalent in the manager). **Arch** ([`ArchManager::install`](../src/managers/arch.rs)): names starting with `aur/` go to `yay::aur_install`; others to `pacman::pacman_install`.

4. **Post-install** — UI refreshes `installed_packages` from `manager.get_installed()`. If the current tab is Installed, it reloads `get_installed_details()`.

## Related keys (same `run` loop)

| Key | Behavior |
|-----|----------|
| `Tab` | Cycles Search → Installed → Updates; Installed/Updates spawn threads for `get_installed_details` / `get_updates` with sentinel keys `__INSTALLED__` / `__UPDATES__` on the same `result_rx` channel. |
| `x` | Remove: filters `selected_names` to installed only, then `manager.remove`. |
| `U` | `system_upgrade`. |
| `R` | `refresh_databases`. |

## Concurrency model

Search, list loads, and details use **OS threads + `std::sync::mpsc`**, not async crates. The main loop polls keyboard input with a short timeout, redraws each iteration, and non-blockingly drains result channels.
