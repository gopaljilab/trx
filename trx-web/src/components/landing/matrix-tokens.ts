/**
 * Matrix theme overlay tokens — JS mirror of matrix-theme.css custom properties.
 * Import alongside the base C/S tokens. These extend, never replace, them.
 *
 * Usage:
 *   import { MX } from "@/components/landing/matrix-tokens";
 *   style={{ color: MX.emeraldText, borderColor: MX.border }}
 */

export const MX = {
  // ── Emerald accent scale ────────────────────────────────────
  // Only `emeraldText` is safe for typographic content (WCAG AA).
  // The deeper values (#1F4A3A, #2D6B54) are decorative only.

  /** Darkest emerald — tight fills, almost invisible on black */
  emeraldDeep:   "#162E25",
  /** Primary accent fill — not for text */
  emerald:       "#1F4A3A",
  /** Mid emerald — 1px borders, subtle separators */
  emeraldMid:    "#2D6B54",
  /** Bright emerald — hover borders, halos */
  emeraldBright: "#3D8F6E",
  /** Text-safe emerald — WCAG AA: ~7.9:1 on #0b0b0b, ~7.0:1 on #111111 */
  emeraldText:   "#52B788",

  // ── rgba fills ──────────────────────────────────────────────
  /** Subtle emerald tint for hover/active backgrounds */
  emeraldSubtle: "rgba(31, 74, 58, 0.10)",
  /** Ambient glow haze */
  emeraldGlow:   "rgba(31, 74, 58, 0.20)",

  // ── Secondary accents ───────────────────────────────────────
  /** Deep desaturated teal */
  teal:          "#1A3A3F",
  /** Cool gunmetal surface accent */
  gunmetal:      "#1C2428",

  // ── 1px border values ───────────────────────────────────────
  border:        "rgba(45, 107, 84, 0.25)",
  borderMid:     "rgba(61, 143, 110, 0.38)",
  borderBright:  "rgba(82, 183, 136, 0.55)",

  // ── Focus glow (box-shadow value) ───────────────────────────
  focusShadow: [
    "0 0 0 2px rgba(31, 74, 58, 0.55)",
    "0 0 0 4px rgba(31, 74, 58, 0.22)",
    "0 0 16px rgba(31, 74, 58, 0.28)",
  ].join(", "),

  // ── Terminal prefix strings ──────────────────────────────────
  prefix: {
    section: "//",
    status:  ">",
    command: "$",
  },
} as const;

export type MXToken = typeof MX;
