"use client";

import { FOCUS_RING, RAISED_BORDER, RAISED_GRAD, RAISED_SHADOW } from "@/app/landing-material";
import { IconCheck, IconClipboard } from "./icons";

const LIGHT_CHROME =
  "border border-black/8 bg-[#f3f3f3] text-[#5a5a5a] shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#e8e8e8] hover:text-[#141414]";

const LIGHT_FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function CopyIconButton({
  copied,
  onCopy,
  idleLabel,
  copiedLabel = "Copied",
  compact = false,
  iconSize: iconSizeProp,
  tone = "dark",
}: {
  copied: boolean;
  onCopy: () => void | Promise<void>;
  idleLabel: string;
  copiedLabel?: string;
  compact?: boolean;
  iconSize?: number;
  /** `light`: for use on white / light command strips */
  tone?: "dark" | "light";
}) {
  const iconSize = iconSizeProp ?? (compact ? 10 : 11);
  const sizeClass = compact ? "h-6 w-6" : "h-7 w-7";
  const chrome =
    tone === "light"
      ? [LIGHT_CHROME, LIGHT_FOCUS, "active:scale-[0.97]"].join(" ")
      : [RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, FOCUS_RING].join(" ");
  const textTone =
    tone === "light"
      ? ""
      : "text-[#878787] hover:text-[#ebebeb] hover:brightness-105";
  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      aria-label={copied ? copiedLabel : idleLabel}
      className={[
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-0 transition",
        "[&_svg]:block [&_svg]:shrink-0",
        sizeClass,
        "active:scale-[0.97]",
        textTone,
        chrome,
      ].join(" ")}
    >
      {copied
        ? <IconCheck size={iconSize} />
        : <IconClipboard size={iconSize} />
      }
    </button>
  );
}
