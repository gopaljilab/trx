# Configuration

TRX reads a single TOML configuration file on startup. If the file does not exist, it is created automatically with default values.

---

## Location

The config file follows the [XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) convention via the [`directories`](https://crates.io/crates/directories) crate:

| Platform | Path |
|----------|------|
| Linux | `$XDG_CONFIG_HOME/trx/config.toml` (usually `~/.config/trx/config.toml`) |
| macOS | `~/Library/Application Support/trx/config.toml` |
| Windows | `%APPDATA%\trx\config.toml` |

---

## Options

```toml
# ~/.config/trx/config.toml

# The AUR helper to use on Arch Linux systems.
# Any helper with yay-compatible CLI flags works (e.g. "paru", "aura").
# Default: "yay"
aur_helper = "yay"
```

---

## Future Options

The following options are planned for future releases:

- **Keybindings** — remap any key to a different action
- **Theme** — colour scheme selection (dark / light / custom)
- **Search limit** — maximum number of results per tab
- **Metadata cache TTL** — how long `DETAILS_CACHE` entries remain valid

See the [Roadmap](./roadmap.md) for status.
