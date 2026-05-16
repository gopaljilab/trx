# Package Manager Backends

TRX abstracts all package manager interaction behind the `PackageManager` trait defined in `src/managers/mod.rs`. The correct backend is selected at runtime in `get_system_manager`.

---

## `PackageManager` Trait

```rust
pub trait PackageManager: Send + Sync {
    fn name(&self) -> &str;

    fn search(&self, query: &str) -> Vec<Package>;
    fn get_installed(&self) -> HashSet<String>;
    fn get_installed_details(&self) -> Vec<Package>;
    fn get_updates(&self) -> Vec<Package>;
    fn get_details(&self, pkg: &str, provider: &str) -> Option<HashMap<String, String>>;

    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;

    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;

    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;

    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;
}
```

`terminal` is passed into mutating operations so that the backend can call `execute_external_command` — which temporarily hands the terminal back to the underlying package manager's interactive output.

---

## Backend Selection

`get_system_manager` in `src/managers/mod.rs` uses a simple priority order:

1. `OS == "macos"` → `BrewManager`
2. `pacman --version` succeeds → `ArchManager` (Pacman + optional AUR helper)
3. `apt --version` succeeds → `AptManager`
4. Fallback → `ArchManager` (with default `yay` AUR helper)

---

## Shared Utilities

### `parse_alternating_lines`

Many package manager CLI tools output results in alternating-line format:

```
<name> <version> [flags...]
    <description>
<name> <version> ...
    <description>
```

`parse_alternating_lines` parses this format, calls `fuzzy_match` on each package name, drops scores ≤ 0.01, and returns results sorted by score.

### `DETAILS_CACHE`

A global `Arc<Mutex<HashMap<String, HashMap<String, String>>>>` used by all backends to cache detail lookups (the `get_details` call). This avoids repeated subprocess invocations when the user scrolls back to a previously inspected package.

---

## Supported Backends

| Backend | Source file | Platform |
|---------|------------|----------|
| [Pacman](./pacman.md) | `src/managers/pacman.rs` | Arch Linux |
| [AUR / yay](./aur-yay.md) | `src/managers/yay.rs` | Arch Linux |
| [APT](./apt.md) | `src/managers/apt.rs` | Debian / Ubuntu |
| [Homebrew](./homebrew.md) | `src/managers/brew.rs` | macOS |
