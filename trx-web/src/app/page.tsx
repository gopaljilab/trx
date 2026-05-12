"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  SCENE,
  raisedPanel,
  raisedCrispPanel,
  insetWell,
  insetDisc,
  poppingBtn,
  raisedGhostBtn,
  raisedPill,
  raisedTopBar,
  FOCUS_RING,
  RAISED_GRAD,
  RAISED_BORDER,
  RAISED_SHADOW,
} from "./landing-material";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
  bg:        "#0b0b0b",
  surface:   "#111111",
  surface2:  "#171717",
  surface3:  "#1e1e1e",
  text:      "#ebebeb",
  text2:     "#878787",
  text3:     "#505050",
  // functional, kept very muted
  installed: "#5d9960",
  aur:       "#5b7d9e",
  available: "#616161",
  /** List row focus / selection accent */
  selection: "#555FBB",
  selectionFill: "rgba(85, 95, 187, 0.18)",
};

// Shadows used as borders / elevation (demo terminal chrome)
const S = {
  ring: "0 0 0 1px rgba(255,255,255,0.06)",
};

const MAX_W = "1280px";

/** Horizontal inset for main sections below the hero (hero keeps 40px). */
const SECTION_PAD_X = "24px";

/** Vertical padding (top + bottom) for post-hero section containers. */
const SECTION_PAD_Y = "48px";

/** Official one-liner installer (curl + shell). */
const HERO_QUICK_INSTALL = "curl -fsSL https://trx.pidev.tech/install.sh | sh";

// ─── Animation helpers ────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1] as const;

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const staggerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.42, ease, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function StaggerInView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerVariants}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface DemoPkg {
  name: string;
  version: string;
  status: "installed" | "available" | "aur";
  checked?: boolean;
}
interface Demo {
  query: string;
  packages: DemoPkg[];
  detail: { desc: string; deps: string; size: string; version: string };
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMOS: Demo[] = [
  {
    query: "neovim",
    packages: [
      { name: "neovim",          version: "0.10.0", status: "installed", checked: true },
      { name: "neovim-nightly",  version: "0.11.0", status: "aur" },
      { name: "vim",             version: "9.1.0",  status: "available" },
      { name: "neovide",         version: "0.13.0", status: "aur" },
      { name: "vimb",            version: "0.5.1",  status: "aur" },
    ],
    detail: { desc: "Vim-based text editor with extensible Lua API", deps: "libuv, msgpack, tree-sitter", size: "18.2 MB", version: "0.10.0" },
  },
  {
    query: "ripgrep",
    packages: [
      { name: "ripgrep",     version: "14.1.0", status: "installed", checked: true },
      { name: "ripgrep-all", version: "0.9.6",  status: "aur" },
      { name: "grep",        version: "3.11",   status: "available" },
      { name: "ugrep",       version: "6.2",    status: "available" },
    ],
    detail: { desc: "Fast line-oriented search tool built in Rust", deps: "pcre2", size: "4.1 MB", version: "14.1.0" },
  },
  {
    query: "git",
    packages: [
      { name: "git",       version: "2.44.0", status: "installed", checked: true },
      { name: "git-delta", version: "0.17.0", status: "available" },
      { name: "lazygit",   version: "0.41.0", status: "available" },
      { name: "gitui",     version: "0.26.0", status: "aur" },
      { name: "gitoxide",  version: "0.36.0", status: "aur" },
    ],
    detail: { desc: "Distributed version control system", deps: "curl, openssl, zlib", size: "36.8 MB", version: "2.44.0" },
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────
// Icon: rounded square with a terminal prompt chevron + cursor
// Wordmark: "trx" beside it

function TrxLogo({ size = 32 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.3) + "px", textDecoration: "none" }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill={C.surface2} />
        <path d="M9 12L14 16L9 20" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="16" y="19" width="7" height="1.8" rx="0.9" fill={C.text2}/>
      </svg>
      <span style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: Math.round(size * 0.5) + "px",
        fontWeight: "600",
        color: C.text,
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}>trx</span>
    </span>
  );
}

// ─── Wide hero terminal (3-panel) ─────────────────────────────────────────────

function HeroTerminal() {
  const [demoIdx, setDemoIdx]       = useState(0);
  const [displayQuery, setDisplay]  = useState("");
  const [selectedRow, setSelRow]    = useState(0);
  const [cursorVis, setCursorVis]   = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursorVis(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  const charIdxRef = useRef(0);
  const demoIdxRef = useRef(0);
  const selRowRef  = useRef(0);
  const phaseRef   = useRef<"typing" | "browsing" | "deleting">("typing");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const demo = DEMOS[demoIdxRef.current]!;
      if (phaseRef.current === "typing") {
        if (charIdxRef.current < demo.query.length) {
          charIdxRef.current++;
          setDisplay(demo.query.slice(0, charIdxRef.current));
          t = setTimeout(tick, 90 + Math.random() * 70);
        } else { phaseRef.current = "browsing"; t = setTimeout(tick, 900); }
      } else if (phaseRef.current === "browsing") {
        if (selRowRef.current < demo.packages.length - 1) {
          selRowRef.current++;
          setSelRow(selRowRef.current);
          t = setTimeout(tick, 520);
        } else { phaseRef.current = "deleting"; t = setTimeout(tick, 1100); }
      } else {
        if (charIdxRef.current > 0) {
          charIdxRef.current--;
          setDisplay(demo.query.slice(0, charIdxRef.current));
          t = setTimeout(tick, 48);
        } else {
          demoIdxRef.current = (demoIdxRef.current + 1) % DEMOS.length;
          selRowRef.current  = 0;
          phaseRef.current   = "typing";
          setDemoIdx(demoIdxRef.current);
          setSelRow(0);
          t = setTimeout(tick, 500);
        }
      }
    };
    t = setTimeout(tick, 1600);
    return () => clearTimeout(t);
  }, []);

  const demo      = DEMOS[demoIdx]!;
  const detail    = demo.detail;
  const selPkg    = demo.packages[selectedRow] ?? demo.packages[0]!;

  const statusCol = (s: DemoPkg["status"]) =>
    s === "installed" ? C.installed : s === "aur" ? C.aur : C.available;

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
  };

  return (
    <div className={raisedCrispPanel("w-full select-none overflow-hidden")}>
      {/* Title bar — raised strip */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-gradient-to-b from-[#242424] to-[#1a1a1a] px-4 py-2.5 shadow-[0_1px_0_#ffffff28_inset]">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a4040]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a6a40]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3d6b40]" />
        </div>
        <div className="flex flex-1 justify-center">
          <span style={{ ...mono, color: C.text3, fontSize: "12px" }}>trx</span>
        </div>
        <div className="flex gap-0.5">
          {["Search", "Installed", "Updates"].map((tab, i) => (
            <span key={tab} style={{
              ...mono, fontSize: "11px",
              padding: "3px 10px", borderRadius: "5px",
              background: i === 0 ? C.surface3 : "transparent",
              color: i === 0 ? C.text : C.text3,
              boxShadow: i === 0 ? S.ring : "none",
            }}>{tab}</span>
          ))}
        </div>
      </div>

      {/* Three-panel body */}
      <div className="flex min-h-[420px] bg-[#101010]">

        {/* Sidebar — inset-adjacent */}
        <div
          className="flex w-[180px] shrink-0 flex-col border-r border-white/[0.05] bg-[#0e0e0e] py-3 shadow-[inset_-6px_0_12px_-8px_rgba(0,0,0,0.45)]"
        >
          {[
            { label: "Search",    active: true  },
            { label: "Installed", active: false },
            { label: "Updates",   active: false },
          ].map(item => (
            <div key={item.label} style={{
              ...mono, fontSize: "12.5px",
              padding: "5px 14px",
              color: item.active ? C.text : C.text2,
              background: item.active ? C.surface3 : "transparent",
              borderLeft: `2px solid ${item.active ? C.text3 : "transparent"}`,
            }}>{item.label}</div>
          ))}

          <div style={{ ...mono, fontSize: "10px", color: C.text3, padding: "14px 14px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Managers
          </div>
          {["pacman", "aur", "brew"].map(m => (
            <div key={m} style={{
              ...mono, fontSize: "12.5px", padding: "4px 14px", color: C.text3,
            }}>{m}</div>
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ ...mono, fontSize: "10px", color: C.text3, padding: "0 14px 10px" }}>
            50,342 packages
          </div>
        </div>

        {/* Package list — inset track */}
        <div className="flex flex-1 flex-col border-r border-white/[0.05] bg-[#0c0c0c]">
          <div className="flex items-center gap-2 border-b border-white/[0.05] px-3.5 py-2.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ ...mono, fontSize: "13px", color: C.text }}>
              {displayQuery}
            </span>
            <span style={{
              display: "inline-block", width: "6px", height: "13px",
              background: C.text2, borderRadius: "1px",
              opacity: cursorVis ? 1 : 0, transition: "opacity 0.05s",
            }} />
            <span style={{ ...mono, fontSize: "11px", color: C.text3, marginLeft: "auto" }}>
              {demo.packages.length} results
            </span>
          </div>

          {/* Column headers */}
          <div className="flex px-3.5 py-1 border-b border-white/[0.04]">
            <span style={{ ...mono, fontSize: "10px", color: C.text3, flex: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Package</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Version</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</span>
          </div>

          {/* Rows */}
          {demo.packages.map((pkg, i) => (
            <div key={`${demoIdx}-${pkg.name}`} style={{
              display: "flex", alignItems: "center",
              padding: "7px 14px",
              background: i === selectedRow ? C.selectionFill : "transparent",
              borderLeft: `2px solid ${i === selectedRow ? C.selection : "transparent"}`,
              transition: "background 0.15s",
            }}>
              <span style={{ color: pkg.checked ? C.installed : C.surface3, fontSize: "8px", marginRight: "8px", flexShrink: 0 }}>●</span>
              <span style={{
                ...mono, fontSize: "13px", flex: 1,
                color: i === selectedRow ? C.text : C.text2,
                fontWeight: i === selectedRow ? "500" : "400",
              }}>{pkg.name}</span>
              <span style={{ ...mono, fontSize: "12px", color: C.text3, width: "72px" }}>{pkg.version}</span>
              <span style={{ ...mono, fontSize: "11.5px", color: statusCol(pkg.status), width: "72px" }}>{pkg.status}</span>
            </div>
          ))}
        </div>

        {/* Detail panel — on shell */}
        <div className="flex w-[260px] shrink-0 flex-col gap-3.5 bg-[#101010] p-4">
          <div>
            <div style={{ ...mono, fontSize: "14px", color: C.text, fontWeight: "600", marginBottom: "4px" }}>
              {selPkg.name}
            </div>
            <div style={{ ...mono, fontSize: "11.5px", color: C.text2, lineHeight: "1.6" }}>
              {detail.desc}
            </div>
          </div>

          <div className="border-b border-white/[0.05] pb-3.5">
            {[
              { label: "Version",  value: detail.version },
              { label: "Size",     value: detail.size    },
              { label: "Provider", value: selPkg.status === "installed" ? "pacman" : selPkg.status },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ ...mono, fontSize: "11.5px", color: C.text3 }}>{row.label}</span>
                <span style={{ ...mono, fontSize: "11.5px", color: C.text2 }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ ...mono, fontSize: "10px", color: C.text3, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Dependencies
            </div>
            <div style={{ ...mono, fontSize: "11.5px", color: C.text2, lineHeight: "1.7" }}>
              {detail.deps.split(", ").map(dep => (
                <span key={dep} className="mb-1 mr-1.5 inline-block">
                  <span
                    className={[RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, "inline-block rounded px-1.5 py-0.5"].join(" ")}
                    style={mono}
                  >
                    {dep}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-1.5">
            <button
              type="button"
              className={[RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, "flex-1 cursor-pointer rounded-md border-none py-1.5 font-mono text-xs font-medium text-[#ebebeb] transition hover:brightness-105 active:scale-[0.98]"].join(" ")}
              style={mono}
            >
              Install
            </button>
            <button
              type="button"
              className={[insetWell("rounded-md"), "cursor-pointer border-none px-2.5 py-1.5 font-mono text-xs text-[#878787] transition hover:text-[#ebebeb]"].join(" ")}
              style={mono}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center border-t border-white/[0.06] bg-gradient-to-b from-[#1c1c1c] to-[#161616] px-4 py-1 shadow-[0_-1px_0_#ffffff14_inset]"
        style={{ ...mono, fontSize: "11px" }}
      >
        <span style={{ color: C.text, fontWeight: "700", marginRight: "16px", letterSpacing: "0.04em" }}>NORMAL</span>
        <span style={{ color: C.text3 }}>e:search · space:select · i:install · x:remove · U:upgrade · tab:switch</span>
        <span style={{ marginLeft: "auto", color: C.text3 }}>
          {demo.packages.filter(p => p.checked).length} selected · {demo.packages.length} shown
        </span>
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className={[
        "group flex h-full cursor-default flex-col p-6 transition-[filter,box-shadow] duration-200",
        raisedPanel(
          "hover:brightness-[1.03] hover:shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff38_inset,0_14px_18px_-10px_#00000078,0_24px_32px_-14px_#00000068,0_0px_8px_0px_#00000068]",
        ),
      ].join(" ")}
    >
      <div
        className={insetWell(
          "mb-3.5 flex w-full items-center gap-3 px-3 py-2.5",
        )}
      >
        <span className="shrink-0 text-[#878787] transition-colors duration-200 group-hover:text-[#ebebeb]">
          {icon}
        </span>
        <h3
          className="min-w-0 flex-1 font-semibold leading-snug tracking-tight text-[#ebebeb] [font-family:var(--font-geist-sans)]"
          style={{ fontSize: "14px", margin: 0 }}
        >
          {title}
        </h3>
      </div>
      <p
        className="min-h-0 flex-1"
        style={{
          color: C.text2, fontSize: "13.5px", lineHeight: "1.65",
          fontFamily: "var(--font-geist-sans)", margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconLayers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconGithub = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

// Platform SVG icons (no emojis)
const IconApple = () => (
  <svg width="22" height="22" viewBox="0 0 814 1000" fill="currentColor">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.6-155.5-127.4C46 790.7 0 663 0 541.8c0-207.1 135.4-316.7 268.8-316.7 34.9 0 103.4 26.7 141.9 26.7 36.7 0 117.7-30.9 163.9-30.9 42.5 0 135.4 5 198.3 72.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);
const IconArch = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L3 19.5h3.3l1.5-3.6h8.4l1.5 3.6H21L12 0zm0 6.5l3.3 7.5H8.7L12 6.5z"/>
  </svg>
);
const IconLinux = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 0C9.24 0 8 3.25 8 5c0 1.37.56 2.86 1.73 4.14C9.13 10.35 8 11.89 8 14c0 2.5 1.5 5 1.5 5H11v1H8v2h8v-2h-3v-1h1.5S16 16.5 16 14c0-2.11-1.13-3.65-1.73-4.86C15.44 7.86 16 6.37 16 5c0-1.75-1.24-5-3.5-5zm0 2c1.38 0 1.5 2.25 1.5 3s-.87 1.5-1.5 1.5S11 5.75 11 5s.12-3 1.5-3zm-2 10c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
  </svg>
);

const IconClipboard = ({ size = 14, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={["block shrink-0", className].filter(Boolean).join(" ")}
  >
    <rect x="9" y="2" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = ({ size = 14, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={["block shrink-0", className].filter(Boolean).join(" ")}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function CopyIconButton({
  copied,
  onCopy,
  idleLabel,
  copiedLabel = "Copied",
  compact = false,
  iconSize: iconSizeProp,
}: {
  copied: boolean;
  onCopy: () => void | Promise<void>;
  idleLabel: string;
  copiedLabel?: string;
  /** Smaller hit area + icons (e.g. install step command rows). */
  compact?: boolean;
  iconSize?: number;
}) {
  const iconSize = iconSizeProp ?? (compact ? 10 : 11);
  const sizeClass = compact ? "h-6 w-6" : "h-7 w-7";
  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      aria-label={copied ? copiedLabel : idleLabel}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-md border-none p-0 text-[#878787] transition",
        "[&_svg]:block [&_svg]:shrink-0",
        sizeClass,
        "hover:text-[#ebebeb] hover:brightness-105 active:scale-[0.97]",
        RAISED_GRAD,
        RAISED_BORDER,
        RAISED_SHADOW,
        FOCUS_RING,
      ].join(" ")}
    >
      {copied ? (
        <IconCheck size={iconSize} />
      ) : (
        <IconClipboard size={iconSize} className="translate-x-px translate-y-px" />
      )}
    </button>
  );
}

// ─── Step flow (SVG, no arrow glyphs) ─────────────────────────────────────────

const STEP_BEAM_DURATION_S = 1.55;
/** Dash + gap length (user units); must match strokeDashoffset loop magnitude. */
const STEP_BEAM_DASH_PERIOD = 40;

function StepFlowConnector({ phase = 0 }: { phase?: 0 | 1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const beamDelay = 0.42 + phase * (STEP_BEAM_DURATION_S / 2);

  return (
    <div
      ref={ref}
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.9,
      }}
      aria-hidden
    >
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden>
        <line
          x1="4"
          y1="12"
          x2="44"
          y2="12"
          stroke={C.selection}
          strokeOpacity={0.22}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.line
          x1="4"
          y1="12"
          x2="44"
          y2="12"
          stroke={C.selection}
          strokeOpacity={0.42}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.55, ease, delay: 0.2 }}
        />
        <motion.line
          x1="4"
          y1="12"
          x2="44"
          y2="12"
          stroke={C.selection}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="12 28"
          vectorEffect="non-scaling-stroke"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={
            inView
              ? { strokeDashoffset: -STEP_BEAM_DASH_PERIOD, opacity: 1 }
              : {}
          }
          transition={{
            opacity: { duration: 0.2, delay: beamDelay },
            strokeDashoffset: {
              duration: STEP_BEAM_DURATION_S,
              repeat: Infinity,
              ease: "linear",
              delay: beamDelay,
            },
          }}
        />
      </svg>
    </div>
  );
}

// ─── Step ─────────────────────────────────────────────────────────────────────

function Step({ num, title, code }: { num: string; title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      copiedTimerRef.current = setTimeout(() => {
        setCopied(false);
        copiedTimerRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={insetDisc(
            "flex h-8 w-8 shrink-0 items-center justify-center font-mono text-xs font-semibold text-[#878787]",
          )}
        >
          {num}
        </div>
        <h3
          className="min-w-0 flex-1 leading-snug tracking-tight [font-family:var(--font-geist-sans)]"
          style={{
            color: C.text, fontSize: "15px", fontWeight: "600",
            margin: 0, letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h3>
      </div>
      <div
        className={insetWell(
          "flex items-center gap-2 rounded-md py-0.5 pl-3.5 pr-2 font-mono text-[12px] text-[#878787]",
        )}
      >
        <div className="min-w-0 flex-1 break-words leading-none">
          <span style={{ color: C.text3, userSelect: "none" }}>$ </span>
          {code}
        </div>
        <CopyIconButton
          compact
          copied={copied}
          onCopy={handleCopy}
          idleLabel={`Copy command: ${title}`}
        />
      </div>
    </div>
  );
}

function HeroCurlInstall() {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }
    try {
      await navigator.clipboard.writeText(HERO_QUICK_INSTALL);
      setCopied(true);
      copiedTimerRef.current = setTimeout(() => {
        setCopied(false);
        copiedTimerRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <p
        className="text-[12px] font-medium leading-snug text-[#878787] [font-family:var(--font-geist-sans)]"
        style={{ letterSpacing: "-0.01em" }}
      >
        Quick install — paste in your terminal:
      </p>
      <div
        className={insetWell(
          "inline-flex w-full items-center gap-2 rounded-lg py-1 pl-3 pr-1.5 font-mono text-[12px] text-[#c4c4c4]",
        )}
      >
        <div className="min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap pr-0.5">
          {HERO_QUICK_INSTALL}
        </div>
        <CopyIconButton
          copied={copied}
          onCopy={handleCopy}
          idleLabel="Copy quick install command"
        />
      </div>
    </div>
  );
}

// ─── Platform badge ───────────────────────────────────────────────────────────

function PlatformBadge({ icon, name, manager }: { icon: React.ReactNode; name: string; manager: string }) {
  return (
    <div className={raisedPanel("flex items-center gap-4 p-5 sm:p-5")}>
      <span className={`inline-flex shrink-0 p-2 text-[#878787] ${insetWell()}`}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          color: C.text, fontWeight: "600", fontSize: "14px",
          fontFamily: "var(--font-geist-sans)", marginBottom: "3px",
        }}>{name}</div>
        <div style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)" }}>
          {manager}
        </div>
      </div>
      <span className={raisedPill("text-[#878787]")}>Supported</span>
    </div>
  );
}

// ─── Nav link (header chrome: compact, on-shell hover) ───────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        "rounded-md px-1 py-0.5 text-sm font-medium text-[#878787] outline-none transition-colors",
        "hover:text-[#ebebeb]",
        "focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]",
        "shrink-0 [font-family:var(--font-geist-sans)] sm:text-[14px]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      color: C.text3, fontFamily: "var(--font-geist-mono)",
      fontSize: "11px", letterSpacing: "0.1em", marginBottom: "12px",
      textTransform: "uppercase", fontWeight: "500",
    }}>{children}</p>
  );
}

// ─── Shared container ─────────────────────────────────────────────────────────

function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: "0 40px", ...style }}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className={`${SCENE} min-h-screen overflow-x-hidden text-[#ebebeb]`}>

      {/* ── HEADER (skeuomorphic: scene strip + raised shell + inset / raised controls) ─ */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-transparent">
        <div className="mx-auto box-border max-w-[1280px] px-4 pb-2 pt-2.5 sm:px-10">
          <div
            className={[
              "flex min-h-[52px] w-full items-center gap-2 sm:gap-3",
              "rounded-2xl border border-white/[0.05]",
              "bg-gradient-to-b from-[#202020] to-[#191919]",
              "shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff35_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060]",
              "px-2 py-1.5 sm:px-3",
            ].join(" ")}
          >
            <div className="shrink-0 rounded-xl bg-[#0c0c0c] p-1 shadow-[0_0.5px_0_#ffffff40,0_2px_6px_#00000090_inset]">
              <Link
                href="/"
                className="flex rounded-lg outline-none ring-offset-2 ring-offset-[#191919] focus-visible:ring-2 focus-visible:ring-[#555fbb]/45"
              >
                <TrxLogo size={26} />
              </Link>
            </div>

            <nav className="ml-3 flex min-w-0 flex-1 items-center gap-4 sm:ml-6 sm:gap-7">
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#install">Install</NavLink>
              <NavLink href="/#platforms">Platforms</NavLink>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
              <div className="rounded-lg bg-[#0d0d0d] px-1 py-px shadow-[0_0.5px_0_#ffffff50,0_2px_6px_#00000090_inset]">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-[#878787] outline-none transition-colors",
                    "hover:text-[#ebebeb]",
                    "focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]",
                    "[font-family:var(--font-geist-sans)]",
                  ].join(" ")}
                >
                  <IconGithub size={13} /> GitHub
                </a>
              </div>

              <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/#install"
                  className={[
                    "rounded-lg border border-white/[0.06]",
                    "bg-gradient-to-b from-[#202020] to-[#191919]",
                    "px-3.5 py-1.5 text-sm font-semibold text-[#ebebeb] no-underline outline-none transition-transform",
                    "shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff35_inset,0_12px_14px_-10px_#00000078,0_22px_28px_-14px_#00000062,0_2px_8px_0_#00000068]",
                    "hover:brightness-[1.06]",
                    "focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]",
                    "[font-family:var(--font-geist-sans)]",
                  ].join(" ")}
                >
                  Install
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "80px", position: "relative", zIndex: 1 }}>
        <Container style={{ padding: "80px 40px 64px" }}>
          {/* Hero intro — two-column: headline/desc/CTAs left, curl command right */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "48px", marginBottom: "56px", flexWrap: "wrap" }}>

            {/* Left: headline + description + pill + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0 }}
              style={{ maxWidth: "520px" }}
            >
              <h1 style={{
                fontSize: "clamp(26px, 3vw, 44px)",
                fontWeight: "700",
                lineHeight: "1.12",
                letterSpacing: "-0.03em",
                color: C.text,
                fontFamily: "var(--font-geist-sans)",
                marginBottom: "16px",
              }}>
                The package manager
                <br />
                <span style={{ whiteSpace: "nowrap" }}>for the terminal generation.</span>
              </h1>
              <p style={{
                color: C.text2,
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "var(--font-geist-sans)",
                maxWidth: "400px",
                margin: 0,
              }}>
                Fast, keyboard-driven, and cross-platform. Search 50,000+ packages
                in under 50ms and install them without leaving your terminal.
              </p>
              <div className="mb-4 mt-4 flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.installed }} />
                <span style={{ color: C.text2, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>
                  Written in pure Rust
                </span>
                <span style={{ color: C.text3, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>
                  · no async runtime
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg bg-[#0d0d0d] p-px shadow-[0_0.5px_0_#ffffff50,0_2px_6px_#00000090_inset]">
                  <Link
                    href="/#install"
                    className={[
                      "inline-flex h-8 items-center justify-center rounded-[7px] px-3 text-sm font-medium leading-none text-[#878787] no-underline outline-none transition-colors",
                      "hover:text-[#ebebeb]",
                      "focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]",
                      "[font-family:var(--font-geist-sans)]",
                    ].join(" ")}
                  >
                    Get started
                  </Link>
                </div>
                <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[raisedGhostBtn(), "no-underline"].join(" ")}
                  >
                    <IconGithub size={13} /> View source
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: curl install command */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.12 }}
              style={{ paddingBottom: "2px", flexShrink: 0, maxWidth: "420px", width: "100%" }}
            >
              <HeroCurlInstall />
            </motion.div>

          </div>

          {/* Wide terminal mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.22 }}
          >
            <HeroTerminal />
          </motion.div>
        </Container>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{ marginBottom: "36px" }}>
            <Label>Features</Label>
            <h2 style={{
              fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700",
              letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)",
              lineHeight: "1.15", color: C.text, maxWidth: "440px",
            }}>
              Built for speed.<br />Designed for focus.
            </h2>
          </FadeUp>

          <StaggerInView style={{ display: "grid", alignItems: "stretch", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: "12px" }}>
            <motion.div className="h-full" variants={itemVariants}>
              <FeatureCard
                icon={<IconSearch />}
                title="Fuzzy Search"
                desc="50ms debounced live search across all packages. Scoring-based fuzzy matching finds what you mean, not just exact strings."
              />
            </motion.div>
            <motion.div className="h-full" variants={itemVariants}>
              <FeatureCard
                icon={<IconBox />}
                title="Multi-Manager"
                desc="One interface for Homebrew, Pacman, AUR via yay, and APT. Auto-detected at launch; no config required."
              />
            </motion.div>
            <motion.div className="h-full" variants={itemVariants}>
              <FeatureCard
                icon={<IconLayers />}
                title="Batch Operations"
                desc="Select multiple packages with Space, then install or remove in one shot. No repeated confirmations."
              />
            </motion.div>
            <motion.div className="h-full" variants={itemVariants}>
              <FeatureCard
                icon={<IconZap />}
                title="Zero Runtime"
                desc="Pure Rust, no async runtime. Concurrent search via OS threads and mpsc channels. Cold starts in milliseconds."
              />
            </motion.div>
          </StaggerInView>
        </Container>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="install" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{ marginBottom: "36px" }}>
            <Label>Get started</Label>
            <h2 style={{
              fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700",
              letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)",
              lineHeight: "1.15", color: C.text, maxWidth: "440px",
            }}>
              Up and running<br />in 30 seconds.
            </h2>
          </FadeUp>

          <div className={raisedPanel("p-6 sm:p-8")}>
            <StaggerInView style={{ display: "flex", gap: "40px", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "36px" }}>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}>
                <Step num="01" title="Install TRX" code="cargo install trx" />
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } } }}>
                <StepFlowConnector phase={0} />
              </motion.div>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}>
                <Step num="02" title="Launch" code="trx" />
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.3 } } }}>
                <StepFlowConnector phase={1} />
              </motion.div>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}>
                <Step num="03" title="Search and install" code="e, type, space, i" />
              </motion.div>
            </StaggerInView>

            {/* Keybindings */}
            <FadeUp>
            <div
              className={raisedPanel(
                "grid gap-3 p-5 sm:p-6 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]",
              )}
            >
              <div style={{ gridColumn: "1 / -1", marginBottom: "2px" }}>
                <span style={{
                  color: C.text2, fontSize: "12px", fontWeight: "600",
                  fontFamily: "var(--font-geist-sans)", letterSpacing: "-0.01em",
                }}>Keyboard shortcuts</span>
              </div>
              {[
                { key: "e",       desc: "Search mode" },
                { key: "space",   desc: "Toggle select" },
                { key: "i",       desc: "Install" },
                { key: "x",       desc: "Remove" },
                { key: "U",       desc: "System upgrade" },
                { key: "R",       desc: "Refresh databases" },
                { key: "Tab",     desc: "Switch tab" },
                { key: "q",       desc: "Quit" },
              ].map(({ key, desc }) => (
                <div key={key} className="flex items-center gap-2.5">
                  <kbd
                    className={insetWell(
                      "min-w-[2rem] shrink-0 rounded-md px-2 py-1 text-center font-mono text-[11px] text-[#c4c4c4]",
                    )}
                  >
                    {key}
                  </kbd>
                  <span style={{ color: C.text2, fontSize: "13px", fontFamily: "var(--font-geist-sans)" }}>{desc}</span>
                </div>
              ))}
            </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* ── PLATFORMS ──────────────────────────────────────────────────────── */}
      <section id="platforms" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginBottom: "32px",
          }}>
            <div>
              <Label>Platforms</Label>
              <h2 style={{
                fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700",
                letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)",
                lineHeight: "1.15", color: C.text, margin: 0,
              }}>
                Works everywhere<br />you work.
              </h2>
            </div>
            <p style={{
              color: C.text2, fontSize: "14px", fontFamily: "var(--font-geist-sans)",
              maxWidth: "280px", lineHeight: "1.65", margin: 0,
            }}>
              Package manager auto-detected at launch. Zero configuration. Just run <code style={{ fontFamily: "var(--font-geist-mono)", color: C.text3 }}>trx</code>.
            </p>
          </FadeUp>

          <StaggerInView style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <motion.div variants={itemVariants}>
              <PlatformBadge icon={<IconApple />}  name="macOS"           manager="via Homebrew (brew)" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <PlatformBadge icon={<IconArch />}   name="Arch Linux"      manager="via Pacman + AUR (yay)" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <PlatformBadge icon={<IconLinux />}  name="Debian / Ubuntu" manager="via APT (apt)" />
            </motion.div>
          </StaggerInView>
        </Container>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className={`relative z-10 ${SCENE} pb-0 pt-10`}>
        <div className="mx-auto box-border max-w-[1280px] px-4 sm:px-10">
          <div className={raisedTopBar("px-5 py-9 sm:px-10")}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              <div>
                <TrxLogo size={24} />
                <p style={{
                  color: C.text3, fontSize: "13px",
                  fontFamily: "var(--font-geist-sans)", maxWidth: "240px",
                  lineHeight: "1.6", margin: "8px 0 0",
                }}>
                  A fast TUI package manager written in Rust.
                </p>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { label: "GitHub", href: "https://github.com", external: true },
                  { label: "Issues", href: "https://github.com", external: true },
                  { label: "Docs", href: "/", external: false },
                ].map(link =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={[
                        "text-[13px] text-[#505050] no-underline transition-colors hover:text-[#878787]",
                        "[font-family:var(--font-geist-sans)]",
                        FOCUS_RING,
                      ].join(" ")}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={[
                        "text-[13px] text-[#505050] no-underline transition-colors hover:text-[#878787]",
                        "[font-family:var(--font-geist-sans)]",
                        FOCUS_RING,
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              <div style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)" }}>
                MIT · 2026
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
