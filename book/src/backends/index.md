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

`get_system_manager` in `src/managers/mod.rs` selects backends based on system availability and user configuration:

1. Checks for installed package managers (`brew`, `pacman`, `apt`).
2. Filters based on `enabled_managers` in `config.toml`.
3. If multiple managers are enabled and available, returns a `CombinedManager`.
4. The `CombinedManager` multiplexes search, install, and update commands across all active backends.

---

## Shared Utilities

### `SEARCH_CACHE` & `DETAILS_CACHE`

TRX uses global thread-safe caches for both search results and package details to ensure the UI remains snappy even when navigating back and forth.

---

## Supported Backends

| Backend | Source file | Platform |
|---------|------------|----------|
| [Pacman](./pacman.md) | `src/managers/pacman.rs` | Arch Linux |
| [AUR / yay](./aur-yay.md) | `src/managers/yay.rs` | Arch Linux |
| [APT](./apt.md) | `src/managers/apt.rs` | Debian / Ubuntu |
| [Homebrew](./homebrew.md) | `src/managers/brew.rs` | macOS |
