# Introduction

<div align="center">
  <img src="https://raw.githubusercontent.com/pie-314/trx/main/assets/logo.svg" width="160" alt="TRX logo" />
</div>

**TRX** is a fast, keyboard-driven terminal UI (TUI) package manager written in Rust. It gives you a unified, keyboard-first interface for searching, inspecting, and managing packages — whether you're on macOS with Homebrew, Arch Linux with Pacman + AUR, or Debian/Ubuntu with APT.

> Search 50,000+ packages in under 50 ms. Install, remove, and update without leaving your terminal.

No daemon. No config file required. Just run `trx`.

---

## Highlights

| Feature | Detail |
|---------|--------|
| **Speed** | Fuzzy search with sub-50 ms results |
| **Keyboard-first** | Vim-inspired navigation; no mouse needed |
| **Unified interface** | Same keybindings across all package managers |
| **Non-blocking** | All I/O on OS threads — UI never freezes |
| **Self-updating** | Checks GitHub releases on startup |
| **Themes** | Built-in Nord, Dracula, Gruvbox, and Custom themes |
| **Mouse Support** | Full navigation and interaction via mouse |
| **Extensible** | Pluggable backend trait — add a new PM in one file |

---

## Supported Platforms

| Package Manager | Platform | Status |
|-----------------|----------|--------|
| Pacman | Arch Linux | ✅ Implemented |
| yay (AUR) | Arch Linux | ✅ Implemented |
| APT | Debian / Ubuntu | ✅ Implemented |
| Homebrew | macOS | ✅ Implemented |
| dnf / yum | Fedora / RHEL | 🔜 Planned |
| zypper | openSUSE | 🔜 Planned |
| winget / scoop | Windows | 🔜 Planned |

---

## Quick Links

- [Installation](./installation.md) — get TRX running in 30 seconds
- [Usage](./usage.md) — keybindings and daily workflow
- [Web Version](https://trx.sh) — try the interactive demo on the web
- [Architecture](./architecture/overview.md) — how TRX is structured internally
- [Adding a Backend](./backends/new-backend.md) — extend TRX to support a new package manager
