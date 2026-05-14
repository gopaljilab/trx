"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\{}[]|!?@#$-=+";

/** Deterministic placeholder so SSR and the first client render match (avoids hydration errors). */
function deterministicScramble(text: string): string {
  return text
    .split("")
    .map((c, i) =>
      c === " "
        ? " "
        : SCRAMBLE_CHARS[(i * 17 + c.charCodeAt(0) * 31) % SCRAMBLE_CHARS.length]!
    )
    .join("");
}

interface ScrambleTextProps {
  text: string;
  /** Duration of the scramble animation in ms */
  duration?: number;
  /** Extra delay after the element enters the viewport */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrambleText({
  text,
  duration = 650,
  delay = 0,
  className,
  style,
}: ScrambleTextProps) {
  // Start with a deterministic “scramble” so server HTML matches the client; randomness only runs after mount in rAF.
  const [display, setDisplay] = useState(() => deterministicScramble(text));

  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const startScramble = () => {
      timerRef.current = setTimeout(() => {
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Reveal characters left → right using eased progress
          const revealCount = Math.floor(
            (1 - Math.pow(1 - progress, 2)) * text.length
          );

          setDisplay(
            text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i < revealCount) return char;
                return SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ]!;
              })
              .join("")
          );

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          }
        };

        rafRef.current = requestAnimationFrame(animate);
      }, delay);
    };

    // Trigger only when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          startScramble();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, duration, delay]);

  return (
    <span ref={containerRef} className={className} style={style}>
      {display}
    </span>
  );
}
