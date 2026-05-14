"use client";

import { useEffect, useRef, useState } from "react";
import { insetDisc, insetWell } from "@/app/landing-material";
import { C } from "./tokens";
import { MX } from "./matrix-tokens";
import { CopyIconButton } from "./CopyIconButton";

export function Step({ num, title, code }: { num: string; title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleCopy = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      timerRef.current = setTimeout(() => { setCopied(false); timerRef.current = null; }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className={insetDisc("flex h-8 w-8 shrink-0 items-center justify-center font-mono text-xs font-semibold")} style={{ color: MX.emeraldText }}>
          {num}
        </div>
        <h3
          className="min-w-0 flex-1 leading-snug tracking-tight [font-family:var(--font-geist-sans)]"
          style={{ color: C.text, fontSize: "15px", fontWeight: "600", margin: 0, letterSpacing: "-0.015em" }}
        >
          {title}
        </h3>
      </div>
      <div className={insetWell("flex items-center gap-2 rounded-md py-0.5 pl-3.5 pr-2 font-mono text-[12px] text-[#878787]")}>
        <div className="min-w-0 flex-1 break-words leading-none">
          <span style={{ color: MX.emeraldText, userSelect: "none" }}>$ </span>
          {code}
        </div>
        <CopyIconButton compact copied={copied} onCopy={handleCopy} idleLabel={`Copy command: ${title}`} />
      </div>
    </div>
  );
}
