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

The `config.toml` is divided into sections:

### General Options

| Option | Description | Default |
|--------|-------------|---------|
| `aur_helper` | The AUR helper to use (e.g. `yay`, `paru`, `aura`) | `"yay"` |
| `theme_name` | The active theme name | `"Default"` |

### Settings Section (`[settings]`)

| Option | Description | Default |
|--------|-------------|---------|
| `search_debounce_ms` | Delay before search triggers after typing | `200` |
| `auto_update_check` | Check for new TRX versions on startup | `true` |
| `auto_cleanup` | Automatically clean up package caches | `false` |
| `default_tab` | Tab to open on startup (`Search`, `Installed`, `Updates`, `Settings`) | `"Search"` |
| `max_search_results` | Maximum results to display | `50` |
| `enabled_managers` | List of package managers to use | `["pacman", "yay", "brew", "apt"]` |
| `border_style` | Style of UI borders (`Plain`, `Rounded`, `Double`, `Thick`) | `"Rounded"` |
| `spinner_type` | Style of loading spinner (`Dots`, `Bars`, `Pulse`, `Classic`) | `"Dots"` |

### Keybindings Section (`[keys]`)

All keys are configurable:

| Option | Default |
|--------|---------|
| `quit` | `"q"` |
| `install` | `"i"` |
| `remove` | `"x"` |
| `search_edit` | `"e"` |
| `toggle_select` | `" "` |
| `tab_next` | `"Tab"` |
| `tab_prev` | `"BackTab"` |
| `system_upgrade` | `"U"` |
| `refresh_db` | `"R"` |
| `help` | `"?"` |

---

## Themes

TRX comes with several built-in themes:

- `Default`
- `Nord`
- `Dracula`
- `OneDark`
- `Gruvbox`
- `Solarized`
- `Custom`

### Custom Theme

When `theme_name = "Custom"` is set, TRX looks for a `[custom_theme]` section:

```toml
[custom_theme]
border_color = "blue"
highlight_color = "yellow"
success_color = "green"
error_color = "red"
text_primary = "white"
text_secondary = "cyan"
```

Colors can be standard names (e.g. `"blue"`) or hex codes (e.g. `"#81A1C1"`).
