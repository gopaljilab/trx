# Debian / Ubuntu — APT

The APT backend is implemented in `src/managers/apt.rs` as `AptManager` (a zero-size struct, since APT requires no runtime state).

---

## Search

`AptManager::search` calls `apt-cache search <query>`, which outputs one package per line in `name - description` format:

```
ripgrep - recursively searches directories for a regex pattern
```

The name is extracted, fuzzy-scored against the query, and packages with score ≤ 0.01 are dropped. Note that `apt-cache search` does not return version numbers, so `Package::version` is empty for search results.

---

## Installed Packages

`get_installed` runs `dpkg-query -W -f='${Package}\n'` and returns a `HashSet<String>`.

---

## Package Details

`get_details` runs `apt-cache show <pkg>` and parses the colon-separated RFC 822-style output into a `HashMap<String, String>`. Keys include `Package`, `Version`, `Description`, `Depends`, `Homepage`, and others.

---

## Install / Remove

| Operation | Command |
|-----------|---------|
| Install | `sudo apt install <packages>` |
| Remove | `sudo apt remove <packages>` |

Both operations hand control of the terminal to the interactive APT output via `execute_external_command`.

---

## System Upgrade & Refresh

| Key | Command |
|-----|---------|
| `U` | `sudo apt upgrade` |
| `R` | `sudo apt update` |

---

## Updates

`get_updates` parses the output of `apt list --upgradable` to build a list of packages with newer versions available.
