"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FadeUp({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, transform: reducedMotion ? "translateY(0)" : "translateY(18px)" }}
      animate={inView ? { opacity: 1, transform: "translateY(0)" } : {}}
      transition={{ duration: 0.4, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
