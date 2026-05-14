# Architecture Overview

TRX is a modern TUI (Terminal User Interface) application built with a focus on high concurrency and low latency. It is designed to be a thin, fast orchestration layer over multiple system package managers.

## Core Modules

### 1. The Core (Rust)
The application is built in Rust to leverage its safe concurrency and performance.
- **`trx-core`**: Handles the internal state, indexing logic, and fuzzy search algorithms.
- **`trx-ui`**: Manages the TUI rendering loop using `ratatui`.
- **`trx-managers`**: A modular interface for interacting with external tools (brew, pacman, apt, etc.).

### 2. Concurrency Model
TRX uses a **Threaded-Worker** model instead of an async runtime.
- **Main Thread:** Handles user input and UI rendering (60 FPS).
- **Worker Threads:** Each detected package manager gets its own worker thread.
- **Communication:** Workers send package updates to the Main thread via lock-free `mpsc` channels.

## Data Flow

1.  **Probe:** On startup, the `ManagerRegistry` identifies available binaries in `$PATH`.
2.  **Stream:** Each manager spawns a process (e.g., `brew search ""`) and streams its output to a parser.
3.  **Index:** Parsed packages are inserted into a concurrent `RadixTree` or `HashMap` for fast lookup.
4.  **Render:** The UI thread reads the current search query and pulls the best matches from the index.

## Performance Optimization

### The Fuzzy Matcher
We use a custom implementation of the Smith-Waterman algorithm, optimized for short strings (package names). It prioritizes:
- Prefix matches
- Character proximity
- Acronym matches (e.g., `rg` for `ripgrep`)

### UI Layer
Rendering is "Immediate Mode" styled. Only the differences between frames are sent to the terminal buffer, minimizing IO overhead and preventing flickering even on slow ssh connections.

## Security

- **Sandboxed Execution:** TRX never executes package manager commands with higher privileges than necessary.
- **Sudo Management:** If an operation requires `sudo`, TRX delegates the password prompt to the system's native handler or a secure TUI prompt.
- **Memory Safety:** Rust's borrow checker ensures that data corruption and buffer overflows—common in C-based CLI tools—are impossible.

---

**Next Steps:**
- Read the [Performance](./performance.md) benchmarks
- Learn how to [Get Started](./getting-started.md)
