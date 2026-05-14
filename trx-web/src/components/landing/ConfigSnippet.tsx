"use client";

import { insetWell } from "@/app/landing-material";
import { C } from "./tokens";

export function ConfigSnippet() {
  const code = `[general]
theme = "dark"
max_results = 100

[pacman]
enabled = true
sudo = true

[brew]
enabled = true`;

  return (
    <div className={insetWell("p-4 font-mono text-[12.5px] leading-relaxed")}>
      <div className="flex flex-col gap-0.5">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-4 select-none text-right text-white/10">{i + 1}</span>
            <span style={{ 
              color: line.startsWith("[") ? C.selection : line.includes("=") ? C.text2 : C.text3 
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
