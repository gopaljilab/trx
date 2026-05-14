# macOS — Homebrew

The Homebrew backend is implemented in `src/managers/brew.rs` as `BrewManager` (a zero-size struct).

---

## Search

`BrewManager::search` calls `brew search <query>`, which returns one formula or cask name per line. Because `brew search` does not return descriptions or versions, both fields are left empty in the initial search results — they are populated lazily when the user selects a package and `get_details` is called.

---

## Installed Packages

`get_installed` calls `brew list --formula` and returns a `HashSet<String>` of formula names.

> **Note:** Casks (`brew list --cask`) are not yet included in the installed list. This is a known limitation tracked in the roadmap.

---

## Package Details

`get_details` calls `brew info --json=v2 <pkg>` and parses the JSON response. Key fields surfaced in the TUI sidebar include:

- `name`
- `desc`
- `homepage`
- `versions.stable`
- `installed` (list of installed versions)

---

## Install / Remove

| Operation | Command |
|-----------|---------|
| Install | `brew install <packages>` |
| Remove | `brew uninstall <packages>` |

Both hand control of the terminal to Homebrew's output via `execute_external_command`.

---

## System Upgrade & Refresh

| Key | Command |
|-----|---------|
| `U` | `brew upgrade` |
| `R` | `brew update` |

---

## Updates

`get_updates` runs `brew outdated --formula` and constructs a list of formulas with newer versions available.
