"use client";

import { useState, useEffect, useRef } from "react";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
  bg:        "#0b0b0b",
  surface:   "#111111",
  surface2:  "#171717",
  surface3:  "#1e1e1e",
  text:      "#ebebeb",
  text2:     "#878787",
  text3:     "#505050",
  // functional — kept very muted
  installed: "#5d9960",
  aur:       "#5b7d9e",
  available: "#616161",
};

// Shadows used as borders / elevation
const S = {
  ring:     "0 0 0 1px rgba(255,255,255,0.06)",
  card:     "0 0 0 1px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.5)",
  elevated: "0 0 0 1px rgba(255,255,255,0.07), 0 12px 40px rgba(0,0,0,0.6)",
  hero:     "0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)",
  nav:      "0 1px 0 rgba(255,255,255,0.05)",
};

const MAX_W = "1280px";

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
    <div style={{
      boxShadow: S.hero,
      borderRadius: "10px",
      overflow: "hidden",
      width: "100%",
      userSelect: "none",
    }}>
      {/* Title bar */}
      <div style={{
        background: C.surface2,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7a4040" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7a6a40" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d6b40" }} />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ ...mono, color: C.text3, fontSize: "12px" }}>trx</span>
        </div>
        {/* Tab bar */}
        <div style={{ display: "flex", gap: "2px" }}>
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
      <div style={{ display: "flex", background: C.surface, minHeight: "320px" }}>

        {/* Sidebar */}
        <div style={{
          width: "180px", flexShrink: 0,
          boxShadow: "1px 0 0 rgba(255,255,255,0.04)",
          padding: "12px 0",
          display: "flex", flexDirection: "column",
        }}>
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

        {/* Package list */}
        <div style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          boxShadow: "1px 0 0 rgba(255,255,255,0.04)",
        }}>
          {/* Search input row */}
          <div style={{
            padding: "10px 14px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
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
          <div style={{
            display: "flex", padding: "4px 14px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
          }}>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, flex: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Package</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Version</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</span>
          </div>

          {/* Rows */}
          {demo.packages.map((pkg, i) => (
            <div key={`${demoIdx}-${pkg.name}`} style={{
              display: "flex", alignItems: "center",
              padding: "7px 14px",
              background: i === selectedRow ? C.surface2 : "transparent",
              borderLeft: `2px solid ${i === selectedRow ? C.text3 : "transparent"}`,
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

        {/* Detail panel */}
        <div style={{
          width: "260px", flexShrink: 0,
          padding: "14px 16px",
          display: "flex", flexDirection: "column", gap: "14px",
          background: C.surface,
        }}>
          <div>
            <div style={{ ...mono, fontSize: "14px", color: C.text, fontWeight: "600", marginBottom: "4px" }}>
              {selPkg.name}
            </div>
            <div style={{ ...mono, fontSize: "11.5px", color: C.text2, lineHeight: "1.6" }}>
              {detail.desc}
            </div>
          </div>

          <div style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04)", paddingBottom: "14px" }}>
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
                <span key={dep} style={{ display: "inline-block", marginRight: "6px", marginBottom: "3px" }}>
                  <span style={{
                    background: C.surface2, padding: "1px 6px", borderRadius: "4px",
                    boxShadow: S.ring,
                  }}>{dep}</span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "6px" }}>
            <button style={{
              flex: 1, padding: "6px 0", borderRadius: "5px",
              background: C.surface3, boxShadow: S.ring,
              color: C.text, ...mono, fontSize: "12px",
              border: "none", cursor: "pointer",
            }}>Install</button>
            <button style={{
              padding: "6px 10px", borderRadius: "5px",
              background: "transparent", boxShadow: S.ring,
              color: C.text2, ...mono, fontSize: "12px",
              border: "none", cursor: "pointer",
            }}>Remove</button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        background: C.surface2,
        padding: "4px 16px",
        display: "flex", alignItems: "center",
        ...mono, fontSize: "11px",
        boxShadow: "0 -1px 0 rgba(255,255,255,0.04)",
      }}>
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
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.surface2 : C.surface,
        boxShadow: hov ? S.elevated : S.card,
        borderRadius: "10px",
        padding: "24px",
        transition: "background 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
    >
      <div style={{ color: C.text2, marginBottom: "14px" }}>{icon}</div>
      <h3 style={{
        color: C.text, fontSize: "14px", fontWeight: "600",
        marginBottom: "7px", fontFamily: "var(--font-geist-sans)",
        letterSpacing: "-0.01em",
      }}>{title}</h3>
      <p style={{
        color: C.text2, fontSize: "13.5px", lineHeight: "1.65",
        fontFamily: "var(--font-geist-sans)", margin: 0,
      }}>{desc}</p>
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

// ─── Step ─────────────────────────────────────────────────────────────────────

function Step({ num, title, code }: { num: string; title: string; code: string }) {
  return (
    <div style={{ flex: 1, minWidth: "190px" }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "50%",
        boxShadow: S.ring, background: C.surface2,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.text2, fontFamily: "var(--font-geist-mono)",
        fontSize: "12px", fontWeight: "600", marginBottom: "16px",
      }}>{num}</div>
      <h3 style={{
        color: C.text, fontSize: "15px", fontWeight: "600",
        marginBottom: "10px", fontFamily: "var(--font-geist-sans)",
        letterSpacing: "-0.015em",
      }}>{title}</h3>
      <div style={{
        background: C.surface, boxShadow: S.card, borderRadius: "7px",
        padding: "10px 14px",
        fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: C.text2,
      }}>
        <span style={{ color: C.text3, userSelect: "none" }}>$ </span>{code}
      </div>
    </div>
  );
}

// ─── Platform badge ───────────────────────────────────────────────────────────

function PlatformBadge({ icon, name, manager }: { icon: React.ReactNode; name: string; manager: string }) {
  return (
    <div style={{
      background: C.surface, boxShadow: S.card, borderRadius: "10px",
      padding: "20px 22px", display: "flex", alignItems: "center", gap: "16px",
    }}>
      <span style={{ color: C.text2, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          color: C.text, fontWeight: "600", fontSize: "14px",
          fontFamily: "var(--font-geist-sans)", marginBottom: "3px",
        }}>{name}</div>
        <div style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)" }}>
          {manager}
        </div>
      </div>
      <span style={{
        background: C.surface2, boxShadow: S.ring,
        color: C.text2, padding: "3px 10px", borderRadius: "999px",
        fontSize: "11px", fontWeight: "500",
        fontFamily: "var(--font-geist-sans)", flexShrink: 0,
      }}>Supported</span>
    </div>
  );
}

// ─── Nav link ─────────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? C.text : C.text2, fontSize: "14px",
        textDecoration: "none", fontFamily: "var(--font-geist-sans)",
        transition: "color 0.15s",
      }}
    >{children}</a>
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
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, overflowX: "hidden" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "56px",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "rgba(11,11,11,0.82)",
        boxShadow: S.nav,
      }}>
        <Container style={{
          height: "100%", display: "flex", alignItems: "center", padding: "0 40px",
        }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <TrxLogo size={26} />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: "28px", marginLeft: "48px" }}>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#install">Install</NavLink>
            <NavLink href="#platforms">Platforms</NavLink>
          </nav>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              style={{
                color: C.text2, fontSize: "14px", textDecoration: "none",
                fontFamily: "var(--font-geist-sans)", padding: "5px 12px",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <IconGithub size={13} /> GitHub
            </a>
            <a href="#install"
              style={{
                background: C.text, color: C.bg,
                padding: "6px 14px", borderRadius: "7px",
                fontSize: "13px", fontWeight: "600", textDecoration: "none",
                fontFamily: "var(--font-geist-sans)",
              }}
            >Install</a>
          </div>
        </Container>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "56px", position: "relative", zIndex: 1 }}>
        <Container style={{ padding: "80px 40px 64px" }}>

          {/* Text row — headline left, callout right (Linear style) */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "48px",
            marginBottom: "56px",
            flexWrap: "wrap",
          }}>
            {/* Left: headline + desc */}
            <div style={{ maxWidth: "520px" }}>
              <h1 style={{
                fontSize: "clamp(26px, 3vw, 44px)",
                fontWeight: "700",
                lineHeight: "1.12",
                letterSpacing: "-0.03em",
                color: C.text,
                fontFamily: "var(--font-geist-sans)",
                marginBottom: "16px",
              }}>
                The package manager<br />for the terminal generation.
              </h1>
              <p style={{
                color: C.text2,
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "var(--font-geist-sans)",
                maxWidth: "400px",
              }}>
                Fast, keyboard-driven, and cross-platform. Search 50,000+ packages
                in under 50ms and install them without leaving your terminal.
              </p>
            </div>

            {/* Right: callout + CTA (aligned to bottom of text block) */}
            <div style={{ paddingBottom: "4px", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "14px",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.installed }} />
                <span style={{ color: C.text2, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>
                  Written in pure Rust
                </span>
                <span style={{ color: C.text3, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>
                  · cargo install trx →
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <a href="#install" style={{
                  background: C.text, color: C.bg,
                  padding: "9px 18px", borderRadius: "7px",
                  fontSize: "14px", fontWeight: "600", textDecoration: "none",
                  fontFamily: "var(--font-geist-sans)",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}>
                  Get started
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
                  background: C.surface, boxShadow: S.ring,
                  color: C.text2,
                  padding: "9px 18px", borderRadius: "7px",
                  fontSize: "14px", fontWeight: "500", textDecoration: "none",
                  fontFamily: "var(--font-geist-sans)",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}>
                  <IconGithub size={13} /> View source
                </a>
              </div>
            </div>
          </div>

          {/* Wide terminal mockup */}
          <HeroTerminal />
        </Container>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: "96px 40px" }}>
          <div style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.05)", marginBottom: "72px" }} />

          <div style={{ marginBottom: "48px" }}>
            <Label>Features</Label>
            <h2 style={{
              fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700",
              letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)",
              lineHeight: "1.15", color: C.text, maxWidth: "440px",
            }}>
              Built for speed.<br />Designed for focus.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: "12px" }}>
            <FeatureCard
              icon={<IconSearch />}
              title="Fuzzy Search"
              desc="50ms debounced live search across all packages. Scoring-based fuzzy matching finds what you mean, not just exact strings."
            />
            <FeatureCard
              icon={<IconBox />}
              title="Multi-Manager"
              desc="One interface for Homebrew, Pacman, AUR via yay, and APT. Auto-detected at launch — no config required."
            />
            <FeatureCard
              icon={<IconLayers />}
              title="Batch Operations"
              desc="Select multiple packages with Space, then install or remove in one shot. No repeated confirmations."
            />
            <FeatureCard
              icon={<IconZap />}
              title="Zero Runtime"
              desc="Pure Rust, no async runtime. Concurrent search via OS threads and mpsc channels. Cold starts in milliseconds."
            />
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="install" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04)" }} />
        <div style={{ background: C.surface }}>
          <Container style={{ padding: "96px 40px" }}>
            <div style={{ marginBottom: "52px" }}>
              <Label>Get started</Label>
              <h2 style={{
                fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700",
                letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)",
                lineHeight: "1.15", color: C.text,
              }}>
                Up and running<br />in 30 seconds.
              </h2>
            </div>

            <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "56px" }}>
              <Step num="01" title="Install TRX" code="cargo install trx" />
              <div style={{ alignSelf: "center", paddingTop: "18px", color: C.text3, fontSize: "18px", flexShrink: 0 }}>→</div>
              <Step num="02" title="Launch" code="trx" />
              <div style={{ alignSelf: "center", paddingTop: "18px", color: C.text3, fontSize: "18px", flexShrink: 0 }}>→</div>
              <Step num="03" title="Search and install" code="e → type → space → i" />
            </div>

            {/* Keybindings */}
            <div style={{
              background: C.surface2, boxShadow: S.card, borderRadius: "10px",
              padding: "22px 26px",
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px",
            }}>
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
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <kbd style={{
                    background: C.surface3, boxShadow: `${S.ring}, 0 2px 0 rgba(255,255,255,0.04)`,
                    borderRadius: "5px", padding: "3px 8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: C.text2,
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>{key}</kbd>
                  <span style={{ color: C.text2, fontSize: "13px", fontFamily: "var(--font-geist-sans)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </Container>
        </div>
        <div style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04)" }} />
      </section>

      {/* ── PLATFORMS ──────────────────────────────────────────────────────── */}
      <section id="platforms" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: "96px 40px" }}>
          <div style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04)", marginBottom: "72px" }} />

          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginBottom: "48px",
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
            <PlatformBadge icon={<IconApple />}  name="macOS"           manager="via Homebrew (brew)" />
            <PlatformBadge icon={<IconArch />}   name="Arch Linux"      manager="via Pacman + AUR (yay)" />
            <PlatformBadge icon={<IconLinux />}  name="Debian / Ubuntu" manager="via APT (apt)" />
          </div>
        </Container>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{
        background: C.surface,
        boxShadow: "0 -1px 0 rgba(255,255,255,0.04)",
        position: "relative", zIndex: 1,
      }}>
        <Container style={{
          padding: "40px 40px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "24px",
        }}>
          <div>
            <div style={{ marginBottom: "10px" }}>
              <TrxLogo size={24} />
            </div>
            <p style={{
              color: C.text3, fontSize: "13px",
              fontFamily: "var(--font-geist-sans)", maxWidth: "240px",
              lineHeight: "1.6", margin: 0,
            }}>
              A fast TUI package manager written in Rust.
            </p>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "Issues", href: "https://github.com" },
              { label: "Docs",   href: "#" },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{
                  color: C.text3, fontSize: "13px", textDecoration: "none",
                  fontFamily: "var(--font-geist-sans)", transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text2)}
                onMouseLeave={e => (e.currentTarget.style.color = C.text3)}
              >{link.label}</a>
            ))}
          </div>

          <div style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)" }}>
            MIT · 2025
          </div>
        </Container>
      </footer>

    </div>
  );
}
