# Arch Linux — Pacman

The Pacman backend is implemented across two files:

- `src/managers/pacman.rs` — low-level wrappers around the `pacman` CLI
- `src/managers/arch.rs` — `ArchManager` struct that implements `PackageManager` by composing Pacman and the AUR helper

---

## `ArchManager`

`ArchManager` is constructed with an `aur_helper` string (default: `"yay"`, configurable in `config.toml`):

```rust
pub struct ArchManager {
    pub aur_helper: String,
}
```

It implements `PackageManager` by delegating to `pacman::*` and `yay::*` functions.

---

## Search

`ArchManager::search` merges results from both `pacman -Ss` and the AUR helper, sorts by fuzzy score, and truncates to **50 results**:

```rust
fn search(&self, query: &str) -> Vec<Package> {
    let mut all = pacman::search_pacman(query);
    all.extend(yay::search_aur(query, &self.aur_helper));
    all.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(Equal));
    all.truncate(50);
    all
}
```

`search_pacman` calls `pacman -Ss <query>` and parses the alternating-line output via `parse_alternating_lines`.

---

## Package Details

`pacman_info` first tries `pacman -Si <pkg>` (remote package info), then falls back to `pacman -Qi <pkg>` (locally installed info). The colon-separated key-value output is parsed into a `HashMap<String, String>`.

Results are cached in `DETAILS_CACHE` to avoid repeated subprocess calls.

---

## Installed Packages

`get_installed_packages()` runs `pacman -Q` and returns a `HashSet<String>` of package names. `get_installed_packages_details()` runs `pacman -Q` and constructs `Package` structs from the name-version pairs.

---

## Updates

`get_updates()` runs `pacman -Qu` to list packages with newer versions available and returns them as `Vec<Package>`.

---

## Install / Remove

```
pacman -S <packages>   # install
pacman -Rns <packages> # remove with unused dependencies
```

Both require `sudo` and hand control of the terminal to the interactive pacman output via `execute_external_command`.

---

## System Upgrade & Refresh

| Key | Command |
|-----|---------|
| `U` | `sudo pacman -Syu` |
| `R` | `sudo pacman -Sy` |
