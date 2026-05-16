# Concurrency Model

TRX deliberately avoids an async runtime. All background work is done with **OS threads** and **`std::sync::mpsc` channels**. This keeps the dependency tree small, makes the code easy to reason about, and avoids the overhead of an executor in a single-user TUI.

---

## Channel Architecture

Two channels flow into the main event loop:

| Channel | Producer | Consumer | Payload |
|---------|----------|----------|---------|
| `result_rx` | Search / list-load threads | `App::run` | `(String, Vec<Package>)` — a tag plus a list of packages |
| `details_rx` | Details-fetch threads | `App::run` | `DetailsState` |

The tag in `result_rx` lets the event loop distinguish between results for **Search**, **Installed** (`"__INSTALLED__"`), and **Updates** (`"__UPDATES__"`). Stale results (where the tag no longer matches the current UI state) are discarded.

---

## Search Flow

```
User types a character
        │
   (50 ms debounce)
        │
   App spawns OS thread
        │
        ▼
   PackageManager::search(&query)   ← runs system command, parses output, scores results
        │
   result_tx.send((query, packages))
        │
   Main loop: result_rx.try_recv()
        │
   App updates packages list + triggers details fetch
```

The **50 ms debounce** is implemented in `input.rs` / `app.rs`: `last_input_time` is refreshed on every keystroke. `check_and_execute_search` is called each frame and only fires a thread when `Instant::now() - last_input_time >= 50ms` and the query has changed.

---

## Details Fetch Flow

Whenever the selected row changes (navigation or new search results), `trigger_details_fetch` spawns a thread that calls `PackageManager::get_details`. Results arrive on `details_rx` and update the sidebar.

A global `DETAILS_CACHE` (`Arc<Mutex<HashMap<String, HashMap<String, String>>>>`) prevents redundant system calls for packages that have been inspected before.

---

## External Command Execution

When the user triggers an install (`i`), remove (`x`), upgrade (`U`), or refresh (`R`), TRX must hand control of the terminal to the package manager's interactive output. This is handled by `execute_external_command` in `main.rs`:

1. **Disable raw mode** — so the child process receives normal terminal I/O.
2. **Leave alternate screen** — the TUI disappears; the package manager's output is printed normally.
3. **Run the command** — via `std::process::Command`.
4. **Wait for Enter** — the user can review the output.
5. **Re-enter alternate screen and raw mode** — TRX redraws the TUI.

---

## Thread Safety

`manager` is wrapped in `Arc<Box<dyn PackageManager>>` (where `PackageManager: Send + Sync`). Cloning the `Arc` into a spawned thread is the only synchronisation needed for backend calls.
