"use client";

export function PixelGrid() {
  return (
    <div 
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
  );
}
