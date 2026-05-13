"use client";

import { FOCUS_RING, RAISED_BORDER, RAISED_GRAD, RAISED_SHADOW } from "@/app/landing-material";
import { IconCheck, IconClipboard } from "./icons";

export function CopyIconButton({
  copied,
  onCopy,
  idleLabel,
  copiedLabel = "Copied",
  compact = false,
  iconSize: iconSizeProp,
}: {
  copied: boolean;
  onCopy: () => void | Promise<void>;
  idleLabel: string;
  copiedLabel?: string;
  compact?: boolean;
  iconSize?: number;
}) {
  const iconSize = iconSizeProp ?? (compact ? 10 : 11);
  const sizeClass = compact ? "h-6 w-6" : "h-7 w-7";
  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      aria-label={copied ? copiedLabel : idleLabel}
      className={[
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-none p-0 text-[#878787] transition",
        "[&_svg]:block [&_svg]:shrink-0",
        sizeClass,
        "hover:text-[#ebebeb] hover:brightness-105 active:scale-[0.97]",
        RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, FOCUS_RING,
      ].join(" ")}
    >
      {copied
        ? <IconCheck size={iconSize} />
        : <IconClipboard size={iconSize} />
      }
    </button>
  );
}
