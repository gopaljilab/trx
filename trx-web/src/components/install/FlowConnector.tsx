"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FlowConnector({
  delay,
  accent = "#a5b4fc",
  side,
}: {
  delay: number;
  accent?: string;
  side: "right" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const isRight = side === "right";
  const ex = isRight ? 6 : 54;
  const ax = isRight ? 54 : 6;
  const path = `M${ex} 8 C${ex} 32,${ax} 32,${ax} 48 C${ax} 64,${ex} 64,${ex} 88`;
  const arrow = `M${ex - 4} 84 L${ex} 92 L${ex + 4} 84`;

  return (
    <div ref={ref} aria-hidden style={{ height: 96, position: "relative", overflow: "visible", zIndex: 1 }}>
      <svg
        style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0, overflow: "visible", pointerEvents: "none" }}
        width={60} height={96} viewBox="0 0 60 96" fill="none"
      >
        <motion.path d={path} stroke={accent} strokeOpacity={0.12} strokeWidth={1.5} strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.05, ease: "easeInOut" }} />
        <motion.path d={path} stroke={accent} strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="7 5" strokeLinecap="round" fill="none"
          initial={{ opacity: 0, strokeDashoffset: 0 }} animate={inView ? { opacity: 1, strokeDashoffset: [0, -12] } : { opacity: 0 }}
          transition={{ opacity: { duration: 0.3, delay: delay + 0.65 }, strokeDashoffset: { duration: 1.8, delay: delay + 0.65, repeat: Infinity, ease: "linear" } }} />
        <motion.circle cx={ex} cy={8} r={11} fill={accent}
          initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: [0, 0.18, 0.08, 0.18, 0.08], scale: [0.6, 1, 1, 1, 1] } : {}}
          transition={{ duration: 2.6, delay, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx={ex} cy={8} r={4.5} fill={accent}
          initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.28, delay, ease: EASE }} />
        <motion.path d={arrow} stroke={accent} strokeOpacity={0.65} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: delay + 0.72, ease: "easeOut" }} />
      </svg>
    </div>
  );
}
