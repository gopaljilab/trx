# Usage

Start TRX by simply running:

```bash
trx
```

TRX will detect your system's package manager automatically and open the TUI.

---

## Tabs

TRX has three tabs, cycled with `Tab` / `Shift+Tab`:

| Tab | Description |
|-----|-------------|
| **Search** | Fuzzy-search all available packages |
| **Installed** | Browse packages currently installed on the system |
| **Updates** | Packages with a newer version available |
| **Settings** | Configure TRX, themes, and backends in-app |

---

## Keybindings

### Global

| Key | Action |
|-----|--------|
| `Tab` | Switch to next tab |
| `Shift+Tab` | Switch to previous tab |
| `?` | Toggle help overlay |
| `q` / `Esc` | Quit TRX (or exit current mode) |

### Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `h` / `l` | Scroll details (in Search/Installed/Updates) or change values (in Settings) |
| `Home` / `End` | Jump to top or bottom of list |

### Package Operations (Search/Installed/Updates Tabs)

| Key | Action |
|-----|--------|
| `Space` | Toggle package selection |
| `i` | Install all selected packages |
| `x` | Remove all selected packages |
| `U` | Full system upgrade |
| `R` | Refresh package databases |

### Search Tab

| Key | Action |
|-----|--------|
| `e` | Enter search / editing mode |
| `Esc` | Exit search mode (return to normal navigation) |

### Settings Tab

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Toggle boolean settings or enter editing for values |
| `h` / `l` | Cycle through themes, border styles, and spinners |
| `k` / `j` | Navigate through settings options |

---

## Mouse Support

TRX features full mouse support for a hybrid workflow:

- **Tabs**: Click on a tab name to switch to it.
- **Scrolling**: Use the scroll wheel to navigate package lists or the details panel.
- **Selection**: Click a package in the list to select it; click the checkbox area to toggle its selection for operations.
- **Settings**: Click any setting to focus it; click the value area to toggle or edit.

---

## Workflow Example

1. Press `e` to enter search mode.
2. Type a package name (e.g. `ripgrep`). Results appear within **50 ms** as you type.
3. Use `↓` / `j` to move through results. The details panel on the right updates automatically.
4. Press `Space` to select one or more packages.
5. Press `i` to install the selection.

---

## Command-line Options

TRX accepts a small set of flags when called from the command line (before the TUI starts):

```
trx [OPTIONS]

Options:
  -v, --version    Print version information
  -h, --help       Print help information
```
