import { C } from "@/lib/tokens";
import { DINO_PATH } from "@/components/hero/dino-path";

export function TrxLogo({
  size = 32,
  variant = "dark",
}: {
  size?: number;
  variant?: "dark" | "light";
}) {
  const gap = Math.round(size * 0.3);
  const fontSize = Math.round(size * 0.5);

  const iconFill = variant === "light" ? "#ebebeb" : C.surface2;
  const stroke = variant === "light" ? "#141414" : C.text;
  const wordmark = variant === "light" ? "#141414" : C.text;

  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="32" height="32" rx="7" fill={iconFill} />
      <svg x="6" y="7.5" width="20" height="17" viewBox="220 260 580 500">
        <path d={DINO_PATH} fill={stroke} fillRule="evenodd" />
      </svg>
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
