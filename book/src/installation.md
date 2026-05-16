# Installation

## One-liner (Recommended)

The quickest way to install TRX on any supported platform:

```bash
curl -fsSL https://trx.pidev.tech/install.sh | sh
```

This script detects your OS and architecture, downloads the appropriate pre-built binary from GitHub Releases, and places it in `/usr/local/bin`.

---

## Cargo

If you have a Rust toolchain installed, you can install directly from [crates.io](https://crates.io/crates/trx-cli):

```bash
cargo install trx-cli
```

The binary is named `trx`.

---

## Build from Source

```bash
git clone https://github.com/pie-314/trx.git
cd trx
cargo build --release
sudo cp target/release/trx /usr/local/bin/
```

**Requirements:**
- Rust **1.70** or later (`rustup` is the easiest way to get it)
- A terminal with **Unicode** and **truecolor** support (most modern terminals qualify)
- The package manager for your platform must be installed and available on `$PATH`

---

## Self-updating

TRX checks the [GitHub Releases API](https://api.github.com/repos/pie-314/trx/releases/latest) on every startup. If a newer version is found, it downloads and replaces the running binary automatically, then exits with a prompt to restart.

Supported auto-update targets:

| OS | Architecture |
|----|-------------|
| Linux | x86\_64 |
| macOS | x86\_64 |
| macOS | aarch64 (Apple Silicon) |

---

## Verify Installation

```bash
trx --version
trx --help
```
