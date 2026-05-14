import { C } from "./tokens";

export function TrxLogo({
  size = 32,
  variant = "dark",
}: {
  size?: number;
  /** `light`: white pill + dark wordmark (header / footer on dark chrome). */
  variant?: "dark" | "light";
}) {
  const gap = Math.round(size * 0.3);
  const fontSize = Math.round(size * 0.5);

  const iconFill = variant === "light" ? "#ebebeb" : C.surface2;
  const stroke = variant === "light" ? "#141414" : C.text;
  const promptBar = variant === "light" ? "#3d3d3d" : C.text2;
  const wordmark = variant === "light" ? "#141414" : C.text;

  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="32" height="32" rx="7" fill={iconFill} />
      <path d="M9 12L14 16L9 20" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="16" y="19" width="7" height="1.8" rx="0.9" fill={promptBar} />
    </svg>
  );

  const label = (
    <span
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: `${fontSize}px`,
        fontWeight: "600",
        color: wordmark,
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}
    >
      trx
    </span>
  );

  if (variant === "light") {
    const padX = Math.max(6, Math.round(size * 0.22));
    const padY = Math.max(4, Math.round(size * 0.12));
    return (
      <span
        className="inline-flex shrink-0 items-center rounded-xl border border-black/8 bg-white shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(0,0,0,0.06)]"
        style={{ gap: `${gap}px`, padding: `${padY}px ${padX}px`, textDecoration: "none" }}
      >
        {svg}
        {label}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: `${gap}px`, textDecoration: "none" }}>
      {svg}
      {label}
    </span>
  );
}
