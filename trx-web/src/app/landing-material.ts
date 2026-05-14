/**
 * Skeuomorphic landing chrome: Tailwind class fragments (join with spaces).
 * Matches dark skeuomorphic skill: top-lit raised shells, inset cavities, popping CTAs.
 */

export const SCENE = "bg-[#0f0f0f]";

export const RAISED_GRAD = "bg-gradient-to-b from-[#202020] to-[#191919]";

export const RAISED_BORDER = "border border-white/5";

/** Default raised shell (soft top highlight + black lift) */
export const RAISED_SHADOW =
  "shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff35_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060]";

/** Crisp raised; use sparingly (hero terminal frame) */
export const RAISED_CRISP_SHADOW =
  "shadow-[0_0.5px_0px_#ffffff1a_inset,0_1px_0.5px_#ffffff25_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060]";

export const INSET_BG = "bg-[#0d0d0d]";

export const INSET_SHADOW =
  "shadow-[0_0.5px_0_#ffffff50,0_2px_6px_#00000090_inset]";

/** Stronger lift for primary actions */
export const POP_SHADOW =
  "shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff35_inset,0_12px_14px_-10px_#00000078,0_22px_28px_-14px_#00000062,0_2px_8px_0_#00000068]";

export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]";

/** Focus ring on dark page / header (white controls sit on dark bg) */
export const FOCUS_RING_ON_DARK =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

/**
 * Light “terminal line” row: white field, dark text, hairline border.
 * Used for quick-install curl + install flow step commands.
 */
export const LIGHT_COMMAND_ROW =
  "flex w-full min-w-0 items-center gap-2 rounded-lg border border-black/8 bg-white py-1 pl-3 pr-1.5 font-mono text-[12px] text-[#1a1a1a] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(0,0,0,0.06)]";

/** Secondary CTA / link chip: same chrome as {@link LIGHT_COMMAND_ROW} (sans mono). */
export function lightOutlineBtn(extra?: string) {
  return [
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-black/8 bg-white px-3 text-sm font-medium leading-none text-[#1a1a1a] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_2px_rgba(0,0,0,0.06)]",
    "no-underline transition-colors hover:bg-[#f6f6f6] hover:text-[#0a0a0a] active:scale-[0.97]",
    FOCUS_RING_ON_DARK,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function raisedPanel(extra?: string) {
  return ["rounded-2xl", RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, extra].filter(Boolean).join(" ");
}

export function raisedCrispPanel(extra?: string) {
  return ["rounded-2xl", RAISED_GRAD, RAISED_BORDER, RAISED_CRISP_SHADOW, extra].filter(Boolean).join(" ");
}

export function insetWell(extra?: string) {
  return ["rounded-lg", INSET_BG, INSET_SHADOW, extra].filter(Boolean).join(" ");
}

/** Circular / squircle inset (step numbers) */
export function insetDisc(extra?: string) {
  return ["rounded-full", INSET_BG, INSET_SHADOW, extra].filter(Boolean).join(" ");
}

/** Footer or full-width top-lit raised strip */
export function raisedTopBar(extra?: string) {
  return [
    "rounded-t-3xl rounded-b-none",
    RAISED_GRAD,
    RAISED_BORDER,
    RAISED_SHADOW,
    "border-t border-white/[0.08]",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Primary CTA: same gradient as shells, stronger shadow */
export function poppingBtn(extra?: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    RAISED_GRAD,
    RAISED_BORDER,
    POP_SHADOW,
    "px-4 py-2.5 text-sm text-[#ebebeb]",
    "transition-transform hover:brightness-[1.06] active:scale-[0.97]",
    FOCUS_RING,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Secondary control on shell (raised, softer) */
export function raisedGhostBtn(extra?: string) {
  return [
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg font-medium leading-none",
    RAISED_GRAD,
    RAISED_BORDER,
    RAISED_SHADOW,
    "px-3 text-sm text-[#878787]",
    "transition-transform hover:text-[#ebebeb] hover:brightness-[1.04] active:scale-[0.97]",
    FOCUS_RING,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Small raised pill (e.g. Supported tag) */
export function raisedPill(extra?: string) {
  return [
    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-[#878787]",
    RAISED_GRAD,
    RAISED_BORDER,
    RAISED_SHADOW,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
