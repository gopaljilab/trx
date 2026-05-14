"use client";

import { useEffect, useRef, useState } from "react";

function rng(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function sign() { return Math.random() > 0.5 ? 1 : -1; }

/* ── Fixed layer counts ─────────────────────────────────── */
// Always render the same DOM nodes — CSS transitions do the work.

const N_TEXT = 5;
const N_BAR  = 4;

/* ── Types ──────────────────────────────────────────────── */

interface TextLayer {
  color: string;
  x: number;
  y: number;
  skewX: number;
  top: number;
  bottom: number;
  opacity: number;
}

interface BarLayer {
  top: number;
  height: number;
  color: string;
  opacity: number;
}

interface GlitchState {
  active: boolean;
  mainOpacity: number;
  mainFilter?: string;
  text: TextLayer[];
  bars: BarLayer[];
}

/* ── Idle: all layers invisible ─────────────────────────── */

const makeIdleText = (): TextLayer[] =>
  Array.from({ length: N_TEXT }, () => ({
    color: "#52B788", x: 0, y: 0, skewX: 0,
    top: 0, bottom: 100, opacity: 0,
  }));

const makeIdleBars = (): BarLayer[] =>
  Array.from({ length: N_BAR }, () => ({
    top: 50, height: 2, color: "#0a0a0a", opacity: 0,
  }));

const IDLE: GlitchState = {
  active: false,
  mainOpacity: 1,
  text: makeIdleText(),
  bars: makeIdleBars(),
};

/* ── Frame generator ─────────────────────────────────────── */

function nextFrame(): GlitchState {
  const text: TextLayer[] = [];

  // 0 — Primary emerald slice
  const eTop = rng(0, 45);
  text.push({
    color: "#52B788",
    x: rng(18, 48) * sign(),
    y: rng(-4, 4),
    skewX: rng(-5, 5),
    top: eTop,
    bottom: Math.min(100, eTop + rng(25, 60)),
    opacity: rng(0.85, 1),
  });

  // 1 — Crimson slice, opposite direction
  const cTop = rng(0, 55);
  text.push({
    color: "#ff4040",
    x: rng(14, 40) * -sign(),
    y: rng(-4, 4),
    skewX: rng(-3, 3),
    top: cTop,
    bottom: Math.min(100, cTop + rng(20, 55)),
    opacity: rng(0.60, 0.92),
  });

  // 2 — Secondary emerald (75 % active)
  const e2Top = rng(0, 60);
  text.push({
    color: "#2D6B54",
    x: rng(24, 55) * sign(),
    y: rng(-3, 3),
    skewX: rng(-7, 7),
    top: e2Top,
    bottom: Math.min(100, e2Top + rng(12, 40)),
    opacity: Math.random() > 0.25 ? rng(0.55, 0.88) : 0,
  });

  // 3 — White overexposure (50 % active)
  const wTop = rng(0, 65);
  text.push({
    color: "#ffffff",
    x: rng(8, 24) * sign(),
    y: rng(-2, 2),
    skewX: 0,
    top: wTop,
    bottom: Math.min(100, wTop + rng(8, 30)),
    opacity: Math.random() > 0.50 ? rng(0.45, 0.85) : 0,
  });

  // 4 — Extra crimson or white burst (45 % active)
  const c2Top = rng(10, 70);
  text.push({
    color: Math.random() > 0.5 ? "#cc2222" : "#ffffff",
    x: rng(35, 65) * sign(),
    y: 0,
    skewX: rng(-8, 8),
    top: c2Top,
    bottom: Math.min(100, c2Top + rng(8, 25)),
    opacity: Math.random() > 0.55 ? rng(0.35, 0.70) : 0,
  });

  // Bars — first 2 are emerald scan lines, last 2 are black dropouts
  const bars: BarLayer[] = Array.from({ length: N_BAR }, (_, i) => {
    const isScan   = i < 2;
    const active   = Math.random() > (isScan ? 0.30 : 0.50);
    return {
      top:    rng(4, 90),
      height: rng(1.5, isScan ? 5 : 10),
      color:  isScan
        ? `rgba(52, 183, 136, ${rng(0.18, 0.40)})`
        : "#0a0a0a",
      opacity: active ? 1 : 0,
    };
  });

  return {
    active:      true,
    mainOpacity: Math.random() > 0.82 ? 0 : 1,
    mainFilter:  Math.random() > 0.72 ? `blur(${rng(0.2, 0.7)}px)` : undefined,
    text,
    bars,
  };
}

/* ── Component ──────────────────────────────────────────── */

export function GlitchHeading({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [state, setState] = useState<GlitchState>(IDLE);
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(null!);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        const burstMs = rng(500, 950);
        let elapsed   = 0;
        const TICK    = 40; // 25 fps — lets CSS transitions breathe

        intervalRef.current = setInterval(() => {
          elapsed += TICK;
          if (elapsed >= burstMs) {
            clearInterval(intervalRef.current);
            setState(IDLE);
            schedule();
          } else {
            setState(nextFrame());
          }
        }, TICK);
      }, rng(800, 2000));
    };

    schedule();
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* ── Real heading ── */}
      <h1
        className={className}
        style={{
          ...style,
          opacity:    state.active ? 0 : 1,
          filter:     state.mainFilter,
          transition: "opacity 60ms ease, filter 60ms ease",
        }}
      >
        {children}
      </h1>

      {/* ── Text glitch layers (always rendered, opacity controls visibility) ── */}
      {state.text.map((layer, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            ...style,
            position:   "absolute",
            inset:      0,
            margin:     0,
            color:      layer.color,
            transform:  `translate(${layer.x}px, ${layer.y}px) skewX(${layer.skewX}deg)`,
            clipPath:   `inset(${layer.top}% 0 ${100 - layer.bottom}% 0)`,
            opacity:    layer.opacity,
            transition: "transform 90ms ease-out, clip-path 70ms ease-out, opacity 55ms ease, color 55ms ease",
            pointerEvents: "none",
            userSelect:    "none",
          }}
        >
          {children}
        </div>
      ))}

      {/* ── Bar layers (always rendered) ── */}
      {state.bars.map((bar, i) => (
        <div
          key={`b${i}`}
          aria-hidden
          style={{
            position:   "absolute",
            left:       0,
            right:      0,
            top:        `${bar.top}%`,
            height:     `${bar.height}%`,
            background: bar.color,
            opacity:    bar.opacity,
            transition: "opacity 45ms ease, top 90ms ease-out, height 80ms ease-out",
            pointerEvents: "none",
            zIndex:     2,
          }}
        />
      ))}
    </div>
  );
}
