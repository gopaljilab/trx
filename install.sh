#!/bin/sh

set -e

# Detect OS and Architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

if [ "$OS" = "Linux" ]; then
    OS="linux"
elif [ "$OS" = "Darwin" ]; then
    OS="macos"
else
    echo "Unsupported OS: $OS"
    exit 1
fi

if [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; then
    ARCH="x86_64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    if [ "$OS" = "macos" ]; then
        ARCH="arm64"
    else
        echo "Unsupported Architecture: $ARCH on $OS"
        exit 1
    fi
else
    echo "Unsupported Architecture: $ARCH"
    exit 1
fi

ASSET_NAME="trx-${OS}-${ARCH}"
API_URL="https://api.github.com/repos/pie-314/trx/releases/latest"

echo "Fetching latest release information..."
DOWNLOAD_URL=$(curl -s $API_URL | grep "browser_download_url.*$ASSET_NAME" | cut -d '"' -f 4)

if [ -z "$DOWNLOAD_URL" ]; then
    echo "Could not find a download url for $ASSET_NAME"
    exit 1
fi

# Define installation path
INSTALL_DIR="$HOME/.local/bin"
if [ ! -d "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR"
fi

BIN_PATH="$INSTALL_DIR/trx"

# Check if old version exists and remove it
if [ -f "$BIN_PATH" ]; then
    echo "Existing installation found at $BIN_PATH."
    echo "Removing old version to perform a fresh install..."
    rm -f "$BIN_PATH"
fi

# Also check common global path just in case (directory may not exist on macOS)
if [ -d "/usr/local/bin" ] && [ -f "/usr/local/bin/trx" ]; then
    echo "Existing global installation found at /usr/local/bin/trx."
    echo "Removing old global version..."
    sudo rm -f "/usr/local/bin/trx" || echo "Failed to remove /usr/local/bin/trx. Continuing..."
fi

echo "Downloading $ASSET_NAME..."
curl -L -o /tmp/trx_bin "$DOWNLOAD_URL"

echo "Installing to $BIN_PATH..."
mv /tmp/trx_bin "$BIN_PATH"
chmod +x "$BIN_PATH"

echo "Installation complete!"
echo "Make sure $INSTALL_DIR is in your PATH."
echo "Run 'trx' to get started."
