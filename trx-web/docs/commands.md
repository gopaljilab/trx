# Commands Reference

TRX is built for keyboard speed. This reference covers all available keybindings, search filters, and CLI flags.

## Navigation & Selection

| Key | Action |
| :--- | :--- |
| `j` / `Down` | Move selection down |
| `k` / `Up` | Move selection up |
| `g` / `Home` | Jump to top of list |
| `G` / `End` | Jump to bottom of list |
| `Space` | Toggle selection for current package |
| `v` | Select all visible packages |
| `V` | Clear all selections |

## Search & Filters

TRX search is fuzzy by default. You can narrow results using specific prefixes:

### Manager Prefixes
- `b:pkname` - Filter by **Homebrew**
- `p:pkname` - Filter by **Pacman**
- `a:pkname` - Filter by **AUR** (requires `yay` or `paru`)
- `d:pkname` - Filter by **APT** (Debian/Ubuntu)

### Status Prefixes
- `is:installed` - Show only installed packages
- `is:updateable` - Show only packages with available updates
- `is:selected` - Show only packages in your current queue

## Operations

| Key | Action |
| :--- | :--- |
| `i` | **Install** all selected packages |
| `x` | **Remove** all selected packages |
| `u` | **Update** current package |
| `U` | **Upgrade** all selected packages |
| `r` | **Refresh** manager databases |
| `Enter` | Open package details view |

## Tabs & Views

- `Tab` / `Shift+Tab`: Cycle through **Search**, **Installed**, and **Updates** tabs.
- `1`, `2`, `3`: Jump directly to a specific tab.
- `?`: Toggle help overlay.

## CLI Options

```bash
# General help
trx --help

# Specific config file
trx --config ~/my-trx-config.toml

# Force-refresh on startup
trx --refresh

# Non-interactive search (output to stdout)
trx search "ripgrep"
```

---

**Next Steps:**
- See the [Configuration](./configuration.md) options
- Understand the [Architecture](./architecture.md)
