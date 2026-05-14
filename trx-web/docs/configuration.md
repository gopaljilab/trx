# Configuration Guide

TRX follows the XDG Base Directory Specification for its configuration.

## File Locations

- **Linux:** `~/.config/trx/config.toml`
- **macOS:** `~/Library/Application Support/trx/config.toml`
- **Custom:** Use `trx --config <path>` to override.

## Global Options

```toml
[general]
# "dark" (default) or "light"
theme = "dark"

# Max number of packages to show in the list
max_results = 200

# How often to check for manager updates (in minutes)
refresh_interval = 60

# Default manager to prioritize in search
default_manager = "brew"
```

## Manager Configurations

Each manager can be toggled and configured with specific behaviors.

### Pacman (Arch Linux)
```toml
[pacman]
enabled = true
sudo = true        # Use sudo for install/remove
use_yay = true     # Enable AUR support via yay
use_paru = false   # Enable AUR support via paru
```

### Homebrew (macOS / Linux)
```toml
[brew]
enabled = true
auto_update = false # Run 'brew update' on startup
```

### APT (Debian / Ubuntu)
```toml
[apt]
enabled = true
sudo = true
```

## UI & Themes

You can customize the appearance of TRX to match your terminal theme.

```toml
[ui]
# Show manager icons (Brew, Pacman, etc.)
show_icons = true

# The prompt character in the search bar
prompt = "❯"

# Custom colors (Hex)
selection_bg = "#555FBB"
selection_fg = "#FFFFFF"
accent_color = "#52B788"

# Border style: "plain", "rounded", "double", "thick"
border_style = "rounded"
```

## Advanced: Custom Commands

If you use a non-standard manager or wrapper, you can define custom commands:

```toml
[custom.my-pkg]
enabled = true
search_cmd = "my-pkg search {query}"
install_cmd = "my-pkg install {name}"
remove_cmd = "my-pkg remove {name}"
```

---

**Next Steps:**
- Learn about the [Architecture](./architecture.md)
- Check out the [Performance](./performance.md) benchmarks
