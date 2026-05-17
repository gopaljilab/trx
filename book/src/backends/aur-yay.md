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

`search_aur` calls the **AUR RPC API** (`v5`) directly via `reqwest`. This avoids spawning a subprocess for searching the AUR, significantly improving performance. Packages receive the provider string `"aur"`.

---

## Package Details

`aur_details` also uses the **AUR RPC API** (`info` type) to fetch detailed package metadata. The response JSON is mapped to TRX's internal detail structure, including fields like `Maintainer`, `URL`, `Votes`, and `Popularity`.

---

## Install

`aur_install` runs the configured `<helper> -S <packages> --needed` via `execute_external_command`. It strips any provider prefixes (like `aur/`) before calling the helper.

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
