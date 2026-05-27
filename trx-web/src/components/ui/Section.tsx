export function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ background: "transparent", padding: "80px 16px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
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

export function SectionHeading({
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
