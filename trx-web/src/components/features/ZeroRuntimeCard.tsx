import { LuZap } from "react-icons/lu";
import { CARD_STYLE, IconSquare, CardTitle, CardDesc } from "./shared";

const TAGS = ["Pure Rust", "No async runtime", "OS threads", "mpsc channels"];

export function ZeroRuntimeCard() {
  return (
    <div style={CARD_STYLE}>
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
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "#666", letterSpacing: "-0.01em", marginTop: 6, whiteSpace: "nowrap" }}>
            cold start · search · install
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
        {TAGS.map((tag) => (
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
