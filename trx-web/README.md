<div align="center">

<img src="../assets/logo.svg" width="180" alt="TRX" />

<br/>
<br/>

**Landing page for TRX, the terminal package manager.**

Built with Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript

<br/>
<br/>

![Rust](https://img.shields.io/badge/Rust-1.70%2B-orange?style=flat&logo=rust)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Arch%20%7C%20Debian-blue?style=flat)

</div>

---

## Preview

<!-- Drop a screenshot or screen recording of the landing page here -->

> **To add a screenshot:**
> 1. Save the image to `../assets/web-preview.png`
> 2. Replace this block with: `![Landing page](../assets/web-preview.png)`
>
> **To embed a video:**
> ```html
> <video src="../assets/web-demo.mp4" controls width="720" />
> ```

---

## About

`trx-web` is the marketing and landing site that lives alongside the [`trx`](../README.md) CLI in this monorepo. It is a fully static Next.js site with no runtime connection to the Rust binary.

**What the site covers:**

- Hero section with an animated live-demo terminal mockup (3-panel TUI layout)
- Feature overview: fuzzy search, multi-manager, batch operations, zero overhead
- Step-by-step install guide with keyboard shortcut reference
- Platform support badges: macOS, Arch Linux, Debian/Ubuntu

**Not implemented yet:**

- Web UI that talks to a running `trx` process
- Docs site, changelog, or release notes page

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 + inline styles |
| Language | TypeScript |
| Package manager | Bun |

> See [AGENTS.md](./AGENTS.md) for important Next.js 16 API caveats before editing.

---

## Getting Started

```bash
# from the trx-web/ directory
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
trx-web/
├── src/
│   └── app/
│       ├── page.tsx      # full landing page (single file)
│       ├── layout.tsx    # root layout + metadata
│       ├── globals.css   # Tailwind import
│       └── icon.svg      # favicon (auto-detected by Next.js)
├── public/               # static assets served at /
└── package.json
```

---

## Assets

Shared project assets (logo, screenshots, demo gif) live in [`../assets/`](../assets/) at the monorepo root:

| File | Description |
|------|-------------|
| `assets/logo.svg` | TRX logo (icon + wordmark, light on transparent) |
| `assets/trx-preview.gif` | Terminal demo recording |

---

## Links

- [TRX root README](../README.md)
- [Next.js docs](https://nextjs.org/docs)
