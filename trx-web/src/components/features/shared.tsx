export const CARD = "#1c1c1c";

export const CARD_STYLE: React.CSSProperties = {
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

export function IconSquare({
  icon,
  bg,
  color,
  ring,
}: {
  icon: React.ReactNode;
  bg: string;
  color: string;
  ring?: string;
}) {
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

export function CardTitle({ children }: { children: React.ReactNode }) {
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

export function CardDesc({ children }: { children: React.ReactNode }) {
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
