"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { insetWell } from "@/app/landing-material";

export function DocCodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = children?.toString() || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={insetWell("relative my-8 p-6 group")}>
      <button 
        onClick={handleCopy}
        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} className="text-selection" /> : <Copy size={14} />}
      </button>
      <code className="text-[14px] font-mono leading-relaxed block text-white/80 whitespace-pre overflow-x-auto">
        {children}
      </code>
    </div>
  );
}
