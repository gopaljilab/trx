"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { SiApple, SiArchlinux, SiUbuntu } from "react-icons/si"; // used in bento MultiManagerVisual
import { LuSearch, LuBox, LuLayers, LuZap } from "react-icons/lu";
import { LuCheck, LuCopy } from "react-icons/lu";
import { TrxHeroRedesign } from "@/components/landing/TrxHeroRedesign";
import { LandingFooterLight } from "@/components/landing/LandingFooterLight";

// ─── Design tokens ────────────────────────────────────────────────────────────
const LEATHER_NOISE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E";
const BG = "#111111";
const CARD = "#1c1c1c";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Scroll-reveal wrapper ───────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, transform: reducedMotion ? "translateY(0)" : "translateY(18px)" }}
      animate={inView ? { opacity: 1, transform: "translateY(0)" } : {}}
      transition={{ duration: 0.4, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        background: "transparent",
        padding: "80px 16px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-geist-sans)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#777",
        marginBottom: 14,
      }}
    >
      {children}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          color: "#F5F5F5",
          margin: "0 0 12px",
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 15,
            color: "#888",
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.6,
            maxWidth: 420,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Bento shared card shell ──────────────────────────────────────────────────
const CARD_STYLE: React.CSSProperties = {
  background: CARD,
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 0 rgba(255,255,255,0.06)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
};

// ─── Colored icon square ──────────────────────────────────────────────────────
function IconSquare({ icon, bg, color, ring }: { icon: React.ReactNode; bg: string; color: string; ring?: string }) {
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        background: bg,
        border: "2px solid #FFFFFF",
        boxShadow: `0 0 0 1px ${ring ?? "rgba(0,0,0,0.08)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  );
}

// ─── Card title ───────────────────────────────────────────────────────────────
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: 17,
        fontWeight: 700,
        color: "#F5F5F5",
        letterSpacing: "-0.03em",
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h3>
  );
}

// ─── Card description ─────────────────────────────────────────────────────────
function CardDesc({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13.5,
        color: "#888",
        lineHeight: 1.65,
        margin: 0,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </p>
  );
}

// ─── Card 1: Fuzzy Search ─────────────────────────────────────────────────────
const SEARCH_ROWS = [
  { pkg: "nginx",       bold: "ngin", rest: "x",      ver: "1.24.0", active: true  },
  { pkg: "nginx-full",  bold: "ngin", rest: "x-full", ver: "1.24.0", active: false },
  { pkg: "nginx-proxy", bold: "ngin", rest: "x-proxy",ver: "2.1.0",  active: false },
];

function FuzzySearchCard() {
  return (
    <div style={CARD_STYLE}>
      <div className="bento-inner">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconSquare icon={<LuSearch size={20} />} bg="rgba(148,163,184,0.70)" color="#FFFFFF" ring="rgba(148,163,184,0.50)" />
            <CardTitle>Fuzzy Search</CardTitle>
          </div>
          <CardDesc>
            50ms debounced live search across all packages. Scoring-based fuzzy matching finds what you mean, not just exact strings.
          </CardDesc>
        </div>

        {/* Right: search panel */}
        <div
          style={{
            background: "#252525",
            borderRadius: 14,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "#1e1e1e",
            }}
          >
            <LuSearch size={12} color="#555" />
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12.5, color: "#D4D4D4" }}>ngin</span>
            <span style={{ display: "inline-block", width: 1.5, height: 13, background: "#D4D4D4", borderRadius: 1, animation: "blink 1.1s step-end infinite" }} />
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#666" }}>3 results</span>
          </div>
          {/* Results */}
          {SEARCH_ROWS.map((r, i) => (
            <div
              key={r.pkg}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 14px",
                borderBottom: i < SEARCH_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                background: r.active ? "rgba(255,255,255,0.06)" : "transparent",
              }}
            >
              {r.active && <span style={{ width: 3, height: 14, borderRadius: 2, background: "#D4D4D4", flexShrink: 0 }} />}
              {!r.active && <span style={{ width: 3, flexShrink: 0 }} />}
              <span style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 12.5, color: "#888" }}>
                <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{r.bold}</span>{r.rest}
              </span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11.5, color: "#666" }}>{r.ver}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card 2: Multi-Manager ────────────────────────────────────────────────────
const PLATFORMS = [
  { icon: <SiApple size={18} />,    name: "macOS",      sub: "Homebrew",    iconBg: "#F0EFEE", iconColor: "#333",     iconRing: "rgba(51,51,51,0.12)"    },
  { icon: <SiArchlinux size={18} />,name: "Arch Linux",  sub: "Pacman + AUR",iconBg: "#EEF2FF", iconColor: "#4F46E5", iconRing: "rgba(79,70,229,0.15)"   },
  { icon: <SiUbuntu size={18} />,   name: "Ubuntu",      sub: "APT",         iconBg: "#FFF3EE", iconColor: "#EA580C", iconRing: "rgba(234,88,12,0.15)"   },
];

function MultiManagerCard() {
  return (
    <div style={CARD_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <IconSquare icon={<LuBox size={20} />} bg="rgba(16,185,129,0.70)" color="#FFFFFF" ring="rgba(5,150,105,0.50)" />
        <CardTitle>Multi-Manager</CardTitle>
      </div>
      <CardDesc>
        One interface for Homebrew, Pacman, AUR via yay, and APT. Auto-detected at launch; no config required.
      </CardDesc>

      {/* Platform chips — horizontal row */}
      <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 24, flexWrap: "wrap" }}>
        {PLATFORMS.map((p) => (
          <div
            key={p.name}
            style={{
              flex: "1 1 0",
              minWidth: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              background: "#252525",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: p.iconBg,
                border: "2px solid #FFFFFF",
                boxShadow: `0 0 0 1px ${p.iconRing}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: p.iconColor,
              }}
            >
              {p.icon}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600, color: "#F5F5F5", letterSpacing: "-0.02em" }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11.5, color: "#777", marginTop: 1 }}>
                {p.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card 3: Batch Operations ─────────────────────────────────────────────────
const BATCH_PKGS = [
  { name: "nginx", ver: "1.24.0" },
  { name: "curl",  ver: "8.0.1"  },
  { name: "git",   ver: "2.44.0" },
];

function BatchOpsCard() {
  return (
    <div style={CARD_STYLE}>
      <div className="bento-inner">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconSquare icon={<LuLayers size={20} />} bg="rgba(249,115,22,0.70)" color="#FFFFFF" ring="rgba(234,88,12,0.50)" />
            <CardTitle>Batch Operations</CardTitle>
          </div>
          <CardDesc>
            Select multiple packages with Space, then install or remove in one shot. No repeated confirmations.
          </CardDesc>
        </div>

        {/* Right: checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              background: "#252525",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {BATCH_PKGS.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 14px",
                  borderBottom: i < BATCH_PKGS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                }}
              >
                <div
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 5,
                    background: "#333",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LuCheck size={10} color="#FFF" strokeWidth={3} />
                </div>
                <span style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 12.5, color: "#D4D4D4" }}>{p.name}</span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11.5, color: "#666" }}>{p.ver}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "11px 16px",
              background: "linear-gradient(to bottom, #8B7FF7, #6B5EE0)",
              border: "1px solid rgba(107,94,224,0.5)",
              borderRadius: 10,
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13.5,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              textAlign: "center",
              whiteSpace: "nowrap",
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2)",
            }}
          >
            Install 3 packages →
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card 4: Zero Runtime ─────────────────────────────────────────────────────
function ZeroRuntimeCard() {
  return (
    <div style={CARD_STYLE}>
      {/* Top: icon+title on left, stat on right */}
      <div className="bento-inner" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconSquare icon={<LuZap size={20} />} bg="rgba(124,58,237,0.70)" color="#FFFFFF" ring="rgba(124,58,237,0.50)" />
            <CardTitle>Zero Runtime</CardTitle>
          </div>
          <CardDesc>
            Pure Rust, no async runtime. Concurrent search via OS threads and mpsc channels. Cold starts in milliseconds.
          </CardDesc>
        </div>

        {/* Stat */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
          <div
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(44px, 5.5vw, 68px)",
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: "#F5F5F5",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            &lt;50ms
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12,
              color: "#666",
              letterSpacing: "-0.01em",
              marginTop: 6,
              whiteSpace: "nowrap",
            }}
          >
            cold start · search · install
          </div>
        </div>
      </div>

      {/* Bottom tags — full width */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
        {["Pure Rust", "No async runtime", "OS threads", "mpsc channels"].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#888",
              background: "#252525",
              borderRadius: 999,
              padding: "5px 13px",
              letterSpacing: "-0.01em",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Full bento features grid ─────────────────────────────────────────────────
function BentoFeatures() {
  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .bento-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
          flex: 1;
        }
        @media (max-width: 900px) {
          .bento-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .bento-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bento-grid">
        <FadeUp delay={0}    style={{ height: "100%" }}><FuzzySearchCard /></FadeUp>
        <FadeUp delay={0.07} style={{ height: "100%" }}><MultiManagerCard /></FadeUp>
        <FadeUp delay={0.12} style={{ height: "100%" }}><BatchOpsCard /></FadeUp>
        <FadeUp delay={0.17} style={{ height: "100%" }}><ZeroRuntimeCard /></FadeUp>
      </div>
    </>
  );
}

// ─── Install steps ────────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Install trx",        desc: "Install trx using Cargo.",               code: "cargo install trx-cli", badgeBg: "rgba(96,165,250,0.65)",  badgeColor: "#e0eaff", badgeRing: "rgba(96,165,250,0.45)",  cmdAccent: "#60a5fa" },
  { num: "02", title: "Launch",             desc: "Start the trx CLI.",                      code: "trx",                   badgeBg: "rgba(52,211,153,0.65)",  badgeColor: "#d1fae5", badgeRing: "rgba(52,211,153,0.45)",  cmdAccent: "#34d399" },
  { num: "03", title: "Search and install", desc: "Search and install packages in a flash.", code: "e, type, space, i",     badgeBg: "rgba(167,139,250,0.65)", badgeColor: "#ede9fe", badgeRing: "rgba(167,139,250,0.45)", cmdAccent: "#a78bfa" },
];

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({
  num, title, desc, code, badgeBg, badgeColor, badgeRing, cmdAccent,
}: {
  num: string; title: string; desc: string; code: string;
  badgeBg: string; badgeColor: string; badgeRing?: string; cmdAccent: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleCopy = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  };

  return (
    <div
      className="step-card"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 20,
        background: CARD,
        borderRadius: 20,
        padding: "24px 24px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Badge */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: badgeBg,
          border: "2px solid #FFFFFF",
          boxShadow: `0 0 0 1px ${badgeRing ?? "rgba(255,255,255,0.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 15,
          fontWeight: 700,
          color: badgeColor,
          letterSpacing: "-0.02em",
          flexShrink: 0,
        }}
      >
        {num}
      </div>

      {/* Title + desc */}
      <div>
        <h3
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            fontWeight: 700,
            color: "#F5F5F5",
            letterSpacing: "-0.03em",
            margin: "0 0 5px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            color: "#888",
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Command box */}
      <div
        className="step-cmd"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(13, 13, 13, 0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderLeft: `2.5px solid ${cmdAccent}`,
          borderRadius: 12,
          padding: "10px 10px 10px 16px",
          flexShrink: 0,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.02)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13.5,
            color: "rgba(255, 255, 255, 0.25)",
            fontWeight: 600,
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          $
        </span>
        <code
          style={{
            flex: 1,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            color: "#E5E5E5",
            letterSpacing: "-0.015em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {code}
        </code>
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy"}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.05)",
            background: copied ? "rgba(34, 197, 94, 0.08)" : "rgba(255,255,255,0.02)",
            color: copied ? "#4ade80" : "#737373",
            cursor: "pointer",
            transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#d4d4d4";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.color = "#737373";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
            }
          }}
        >
          {copied ? <LuCheck size={12} strokeWidth={2.5} /> : <LuCopy size={12} />}
        </button>
      </div>
    </div>
  );
}

// ─── SVG flow connector (side-exit S-curve, flowing dashes) ──────────────────
function FlowConnector({
  delay,
  accent = "#a5b4fc",
  side,
}: {
  delay: number;
  accent?: string;
  side: "right" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const isRight = side === "right";

  const ex = isRight ? 6 : 54;   // x that touches the card edge
  const ax = isRight ? 54 : 6;   // x at the outward apex
  const path = `M${ex} 8 C${ex} 32,${ax} 32,${ax} 48 C${ax} 64,${ex} 64,${ex} 88`;
  const arrow = `M${ex - 4} 84 L${ex} 92 L${ex + 4} 84`;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ height: 48, position: "relative", overflow: "visible" }}
    >
      <svg
        style={{
          position: "absolute",
          ...(isRight ? { left: "100%" } : { right: "100%" }),
          top: -20,
          overflow: "visible",
          pointerEvents: "none",
        }}
        width={60}
        height={96}
        viewBox="0 0 60 96"
        fill="none"
      >
        {/* 1 — Ghost track: draws in once, stays as subtle rail */}
        <motion.path
          d={path}
          stroke={accent} strokeOpacity={0.12} strokeWidth={1.5}
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.05, ease: "easeInOut" }}
        />

        {/* 2 — Flowing dashes: fade in then continuously march */}
        <motion.path
          d={path}
          stroke={accent} strokeOpacity={0.6} strokeWidth={1.5}
          strokeDasharray="7 5" strokeLinecap="round" fill="none"
          initial={{ opacity: 0, strokeDashoffset: 0 }}
          animate={inView ? {
            opacity: 1,
            strokeDashoffset: [0, -12],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 0.3, delay: delay + 0.65 },
            strokeDashoffset: {
              duration: 1.8,
              delay: delay + 0.65,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* 3 — Halo: pulses continuously */}
        <motion.circle
          cx={ex} cy={8} r={11} fill={accent}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? {
            opacity: [0, 0.18, 0.08, 0.18, 0.08],
            scale:   [0.6, 1,    1,    1,    1   ],
          } : {}}
          transition={{ duration: 2.6, delay, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 4 — Solid dot */}
        <motion.circle
          cx={ex} cy={8} r={4.5} fill={accent}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.28, delay, ease: EASE }}
        />

        {/* 5 — Arrowhead fades in after track is drawn */}
        <motion.path
          d={arrow}
          stroke={accent} strokeOpacity={0.65} strokeWidth={1.5}
          fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: delay + 0.72, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: BG, backgroundImage: `url("${LEATHER_NOISE}")`, backgroundSize: "256px 256px" }} className="min-h-screen overflow-x-hidden">
      <TrxHeroRedesign />

      {/* ── FEATURES (bento) ─────────────────────────────────────────────────── */}
      <Section id="features">
        <FadeUp>
          <SectionLabel>Features</SectionLabel>
          <SectionHeading>
            Built for speed.<br />Designed for focus.
          </SectionHeading>
        </FadeUp>
        <BentoFeatures />
      </Section>

      {/* ── INSTALL ──────────────────────────────────────────────────────────── */}
      <Section id="install">
        {/* Heading — full width, top of section, like other sections */}
        <FadeUp style={{ marginBottom: 60 }}>
          <SectionLabel>Get started</SectionLabel>
          <SectionHeading sub="Up and running in under a minute. Copy any command to get started.">
            Up and running<br />in 30 seconds.
          </SectionHeading>

        </FadeUp>

        {/* Cards column — centered, connectors on outer sides */}
        <div style={{ maxWidth: 740, margin: "0 auto", position: "relative" }}>
          <FadeUp delay={0}><StepCard {...STEPS[0]} /></FadeUp>

          <FlowConnector side="right" delay={0.15} accent="#a5b4fc" />

          <FadeUp delay={0.1}><StepCard {...STEPS[1]} /></FadeUp>

          <FlowConnector side="left" delay={0.35} accent="#a5b4fc" />

          <FadeUp delay={0.2}><StepCard {...STEPS[2]} /></FadeUp>
        </div>

        <style>{`
          .step-cmd { min-width: 200px; max-width: 340px; }
          @media (max-width: 560px) {
            .step-card { grid-template-columns: auto 1fr !important; grid-template-rows: auto auto; }
            .step-cmd { min-width: 0; max-width: 100%; width: 100%; grid-column: 1 / -1; margin-top: 12px; }
          }
        `}</style>
      </Section>

      {/* ── FOOTER (with embedded CTA) ───────────────────────────────────────── */}
      <LandingFooterLight />
    </div>
  );
}
