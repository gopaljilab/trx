"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\{}[]|!?$@-=+";

export function MatrixRain({
  opacity = 0.75,
  speed = 0.35,
}: {
  opacity?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 13;
    let drops: number[] = [];
    let cols = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const setup = () => {
      // Fixed canvas = viewport dimensions, not parent
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, () =>
        Math.random() > 0.4
          ? Math.random() * (canvas.height / FONT_SIZE)
          : -Math.floor(Math.random() * 60)
      );
    };

    const draw = () => {
      // Erase 8% of every pixel's alpha per frame → fading trail on transparent canvas
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.92;
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.fillStyle = "#52B788";

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * FONT_SIZE;
        if (y >= 0 && y < canvas.height + FONT_SIZE) {
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)]!, i * FONT_SIZE, y);
        }
        drops[i] += speed;
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = -Math.floor(Math.random() * 40);
        }
      }

      ctx.globalAlpha = 1;
    };

    setup();
    intervalId = setInterval(draw, 50);

    const handleResize = () => {
      clearInterval(intervalId);
      setup();
      intervalId = setInterval(draw, 50);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
