# Getting Started with TRX

TRX is a high-performance package manager interface designed for terminal power users. This guide covers installation, initial setup, and basic concepts.

## Prerequisites

- **Rust Toolchain:** TRX is written in pure Rust. Ensure you have `cargo` installed (via [rustup.rs](https://rustup.rs/)).
- **Operating System:**
  - **macOS:** Intel or Apple Silicon.
  - **Linux:** Arch (native yay/pacman support), Debian/Ubuntu (APT support), Fedora (DNF support coming soon).
  - **Windows:** WSL2 is recommended.

## Installation

### Method 1: Cargo (Recommended)

Install the binary directly from crates.io:

```bash
cargo install trx-cli
```

### Method 2: Shell Script

A convenient one-liner for Linux and macOS:

```bash
curl -fsSL https://trx.pidev.tech/install.sh | sh
```

### Method 3: From Source

If you want the absolute latest features:

```bash
git clone https://github.com/pie-314/trx.git
cd trx
cargo install --path .
```

## Initial Configuration

On first run, TRX will create a default configuration file.

```bash
trx
```

TRX will scan your system for supported package managers. If it finds `brew`, `pacman`, or `apt`, it will automatically enable them and begin indexing.

## Core Concepts

### 1. The Index
Unlike traditional managers that query the web for every search, TRX maintains a lightning-fast local index of available packages. This is why search results appear in under 50ms.

### 2. Multi-Manager View
TRX aggregates packages from all detected managers into a single list. You can see at a glance if a package is available in Homebrew, the AUR, or your system's native repo.

### 3. Selection Queue
Instead of installing packages one-by-one, you add them to a **Selection Queue** using `Space`. Once you've queued everything you need, one command (`i`) installs them all.

---

**Next Steps:**
- Learn the [Global Keybindings](./commands.md)
- Customize your [Configuration](./configuration.md)
