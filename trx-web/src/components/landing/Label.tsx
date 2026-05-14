import { MX } from "./matrix-tokens";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      color: MX.emeraldText,
      fontFamily: "var(--font-geist-mono)",
      fontSize: "11px",
      letterSpacing: "0.1em",
      marginBottom: "12px",
      textTransform: "uppercase",
      fontWeight: "500",
    }}>
      <span style={{ opacity: 0.45 }}>// </span>{children}
    </p>
  );
}
