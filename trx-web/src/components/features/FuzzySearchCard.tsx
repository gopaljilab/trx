import { LuSearch } from "react-icons/lu";
import { CARD_STYLE, IconSquare, CardTitle, CardDesc } from "./shared";

const SEARCH_ROWS = [
  { pkg: "nginx",       bold: "ngin", rest: "x",       ver: "1.24.0", active: true  },
  { pkg: "nginx-full",  bold: "ngin", rest: "x-full",  ver: "1.24.0", active: false },
  { pkg: "nginx-proxy", bold: "ngin", rest: "x-proxy", ver: "2.1.0",  active: false },
];

export function FuzzySearchCard() {
  return (
    <div style={CARD_STYLE}>
      <div className="bento-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconSquare icon={<LuSearch size={20} />} bg="rgba(148,163,184,0.70)" color="#FFFFFF" ring="rgba(148,163,184,0.50)" />
            <CardTitle>Fuzzy Search</CardTitle>
          </div>
          <CardDesc>
            50ms debounced live search across all packages. Scoring-based fuzzy matching finds what you mean, not just exact strings.
          </CardDesc>
        </div>

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
              <span style={{ width: 3, height: r.active ? 14 : undefined, borderRadius: 2, background: r.active ? "#D4D4D4" : undefined, flexShrink: 0 }} />
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
