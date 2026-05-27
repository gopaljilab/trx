import { LuLayers, LuCheck } from "react-icons/lu";
import { CARD_STYLE, IconSquare, CardTitle, CardDesc } from "./shared";

const BATCH_PKGS = [
  { name: "nginx", ver: "1.24.0" },
  { name: "curl",  ver: "8.0.1"  },
  { name: "git",   ver: "2.44.0" },
];

export function BatchOpsCard() {
  return (
    <div style={CARD_STYLE}>
      <div className="bento-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconSquare icon={<LuLayers size={20} />} bg="rgba(249,115,22,0.70)" color="#FFFFFF" ring="rgba(234,88,12,0.50)" />
            <CardTitle>Batch Operations</CardTitle>
          </div>
          <CardDesc>
            Select multiple packages with Space, then install or remove in one shot. No repeated confirmations.
          </CardDesc>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#252525", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.05)" }}>
            {BATCH_PKGS.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                  borderBottom: i < BATCH_PKGS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                }}
              >
                <div
                  style={{
                    width: 17, height: 17, borderRadius: 5,
                    background: "#333", border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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
