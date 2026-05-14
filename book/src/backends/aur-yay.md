# Arch Linux — AUR (yay)

The AUR backend in `src/managers/yay.rs` wraps an AUR helper (default: **yay**) using the same interface as the Pacman backend. The AUR helper is configurable — see [Configuration](../configuration.md).

---

## AUR Helper Configuration

The helper name is read from `Config::aur_helper` (default: `"yay"`). Any helper that accepts yay-compatible CLI flags should work:

```toml
# ~/.config/trx/config.toml
aur_helper = "paru"
```

---

## Search

`search_aur` calls `<helper> -Ss <query>` and parses the alternating-line output via `parse_alternating_lines`. Packages receive the provider string `"aur"`.

---

## Package Details

`aur_details` runs `<helper> -Si <pkg>` and parses the colon-separated output into a `HashMap`. The `Maintainer`, `URL`, `Votes`, and `Popularity` fields typically appear in AUR results.

---

## Install

`aur_install` runs `<helper> -S <packages>` via `execute_external_command`, handing control of the terminal to the helper's interactive output (which typically presents a PKGBUILD review step).

---

## Provider Routing

When the user selects packages for install, `ArchManager::install` inspects each package name:

```rust
for name in pkgs {
    if name.starts_with("aur/") {
        yay::aur_install(terminal, &[name])?;
    } else {
        pacman::pacman_install(terminal, &[name])?;
    }
}
```

Packages prefixed with `aur/` go to the AUR helper; all others go to pacman.
