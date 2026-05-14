"use client";

import { motion } from "motion/react";
import { C } from "./tokens";

const DATA = [
  { name: "TRX", value: 50, color: C.selection, label: "50ms" },
  { name: "Others", value: 450, color: "#333", label: "450ms+" },
];

export function PerformanceChart() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-5">
        {DATA.map((item, i) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span style={{ color: C.text }}>{item.name}</span>
              <span style={{ color: item.color }}>{item.label}</span>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / 500) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-sans)" }}>
        * Latency measured during a search of 50,000 packages on macOS (M2 Max).
      </p>
    </div>
  );
}
