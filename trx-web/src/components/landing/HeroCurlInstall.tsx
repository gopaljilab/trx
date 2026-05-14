"use client";

import { useEffect, useRef, useState } from "react";
import { LIGHT_COMMAND_ROW } from "@/app/landing-material";
import { HERO_QUICK_INSTALL } from "./tokens";
import { CopyIconButton } from "./CopyIconButton";

export function HeroCurlInstall() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleCopy = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    try {
      await navigator.clipboard.writeText(HERO_QUICK_INSTALL);
      setCopied(true);
      timerRef.current = setTimeout(() => { setCopied(false); timerRef.current = null; }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <p
        className="text-[12px] font-medium leading-snug text-[#878787] [font-family:var(--font-geist-sans)]"
        style={{ letterSpacing: "-0.01em" }}
      >
        Quick install: paste in your terminal:
      </p>
      <div className={LIGHT_COMMAND_ROW}>
        <div className="min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap pr-0.5">
          {HERO_QUICK_INSTALL}
        </div>
        <CopyIconButton tone="light" copied={copied} onCopy={handleCopy} idleLabel="Copy quick install command" />
      </div>
    </div>
  );
}
