import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TRX - Terminal Package Manager",
    short_name: "TRX",
    description: "A blazing-fast TUI package manager written in Rust. Fuzzy search, install, and manage packages across macOS, Arch Linux, and Debian/Ubuntu.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
