"use client";

import { useState, useRef, useEffect } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

export function StepCard({
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
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 20,
        background: "#1c1c1c",
        borderRadius: 20,
        padding: "24px 24px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: badgeBg, border: "2px solid #FFFFFF",
          boxShadow: `0 0 0 1px ${badgeRing ?? "rgba(255,255,255,0.08)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-geist-sans)", fontSize: 15, fontWeight: 700,
          color: badgeColor, letterSpacing: "-0.02em", flexShrink: 0,
        }}
      >
        {num}
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.03em", margin: "0 0 5px", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "#888", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.5 }}>
          {desc}
        </p>
      </div>
      <div
        className="step-cmd"
        style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(13,13,13,0.6)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.05)", borderLeft: `2.5px solid ${cmdAccent}`,
          borderRadius: 12, padding: "10px 10px 10px 16px", flexShrink: 0,
          boxShadow: "0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13.5, color: "rgba(255,255,255,0.25)", fontWeight: 600, userSelect: "none", flexShrink: 0 }}>
          $
        </span>
        <code style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#E5E5E5", letterSpacing: "-0.015em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {code}
        </code>
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy"}
          style={{
            flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)",
            background: copied ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
            color: copied ? "#4ade80" : "#737373",
            cursor: "pointer", transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#d4d4d4"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; } }}
          onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.color = "#737373"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; } }}
        >
          {copied ? <LuCheck size={12} strokeWidth={2.5} /> : <LuCopy size={12} />}
        </button>
      </div>
    </div>
  );
}
