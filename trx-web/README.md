# trx-web

Web frontend living alongside the **TRX** Rust TUI package manager in the parent repository. See the [root README](../README.md) for what TRX does.

## Purpose in this monorepo

- **Today**: A standard [Next.js](https://nextjs.org) 16 App Router scaffold (default home in `src/app/page.tsx`). It exists as a place to grow a web experience **without** changing the core CLI/TUI binary.
- **Integration with the Rust `trx` binary**: **None** at present. There is no HTTP API, IPC, or shared crate between `trx-web` and `src/`. Running `next dev` does not invoke `cargo run`; any future link would need an explicit design (for example, a local REST or WebSocket service wrapping package-manager calls, or a read-only marketing/docs site with no backend).

## Possible directions (not implemented)

- **Marketing or docs site** for TRX (static pages, download links).
- **Remote or local UI** that talks to a future TRX daemon or OS-specific adapter (would be new work in both Rust and Next.js).
- **Developer dashboard** for telemetry or release metadata (orthogonal to package management).

## Stack

- Next.js 16, React 19, Tailwind CSS 4, TypeScript. React Compiler is enabled in `next.config.ts`. Agent note: see [AGENTS.md](./AGENTS.md) for Next.js version caveats.

## Getting Started

From this directory:

```bash
bun dev
# or: npm run dev / pnpm dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Edit [`src/app/page.tsx`](src/app/page.tsx) to change the home page.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying)
