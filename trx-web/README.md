<div align="center">

<img src="../assets/logo.svg" width="320" alt="TRX" />

**Landing page for TRX, a keyboard-first TUI for every package manager.**

Built with Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript

<br/>
<br/>

![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Arch%20%7C%20Debian-blue?style=flat)
![Branch](https://img.shields.io/badge/Branch-redesign-purple?style=flat)

</div>

---

## About

`trx-web` is the marketing site for [`trx`](../README.md), a terminal UI built on top of your existing package manager. It gives you a unified, keyboard-first interface for searching, inspecting, and managing packages, whether you're on macOS with Homebrew, Arch with Pacman + AUR, or Debian/Ubuntu with APT.

The site is a fully static Next.js app with no runtime connection to the Rust binary.

---

## What's on the Page

| Section      | Description                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**     | `trx` wordmark + dino logo, headline, animated install command with copy button, platform compatibility card (macOS · Arch · Debian), CTA buttons |
| **Features** | Bento grid: Fuzzy Search, Multi-Manager, Batch Operations, Zero Runtime (`<50ms`)                                                                 |
| **Install**  | 3-step guide (install → launch → search & install) with animated SVG flow connectors and copy-able commands                                       |
| **Footer**   | Link columns (Product, Resources, Project) + copyright                                                                                            |

**Install command (same as the site):**

```bash
curl -fsSL https://trx.pidev.tech/install.sh | sh
```

---

## Design

The current `redesign` branch applies a full dark-mode redesign:

- **Background:** `#111111` with subtle leather noise texture
- **Cards:** `#1c1c1c` with `rgba(255,255,255,0.07)` ring shadow + inset top highlight
- **Inner panels:** `#252525`
- **Primary accent:** Indigo gradient (`#8B7FF7 → #6B5EE0`)
- **Typography:** Geist Sans + Geist Mono (via `next/font/google`)
- **Animations:** `motion/react` (Motion 12): scroll-reveal, animated SVG flow connectors, rotating conic-gradient command box border
- **Platform support:** macOS (Apple), Arch Based OS (Arch Linux), Debian Based (Debian)

---

## Stack

| Layer           | Choice                                |
| --------------- | ------------------------------------- |
| Framework       | Next.js 16 (App Router)               |
| UI              | React 19                              |
| Styling         | Tailwind CSS 4 + inline styles        |
| Animation       | Motion 12 (`motion/react`)            |
| Icons           | `react-icons` (Lucide + Simple Icons) |
| Language        | TypeScript                            |
| Package manager | Bun                                   |

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
│   ├── app/
│   │   ├── page.tsx           # full landing page (features + install sections)
│   │   ├── layout.tsx         # root layout, fonts (Geist Sans/Mono), metadata
│   │   ├── globals.css        # Tailwind import
│   │   └── icon.svg           # favicon
│   └── components/landing/
│       ├── TrxHeroRedesign.tsx  # hero section (logo, headline, command box, CTAs)
│       ├── LandingHeader.tsx    # sticky top nav
│       ├── LandingCTA.tsx       # CTA banner
│       ├── LandingFooterLight.tsx # footer with link columns
│       ├── TrxLogo.tsx          # trx pill logo component
│       └── dino-path.ts         # SVG path data for the dino logo
├── public/                    # static assets served at /
└── package.json
```

---

## Links

- [TRX root README](../README.md)
- [Live site](https://trx.pidev.tech)
- [Next.js docs](https://nextjs.org/docs)
