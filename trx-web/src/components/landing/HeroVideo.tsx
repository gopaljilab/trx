"use client";

import { useEffect, useRef, useState } from "react";
import { raisedCrispPanel } from "@/app/landing-material";
import { C } from "./tokens";
import { MX } from "./matrix-tokens";

/* ── Icons ─────────────────────────────────────────────── */

function IconPlay({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function IconPause({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function IconVolume({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconFullscreen({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/* ── Placeholder ────────────────────────────────────────── */

function Placeholder() {
  const mono: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        width: "100%",
        height: "100%",
        minHeight: "420px",
        position: "relative",
        overflow: "hidden",
        background: "#080808",
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(45,107,84,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,107,84,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Play button ring */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: `1px solid ${MX.borderBright}`,
            background: "rgba(31,74,58,0.12)",
            boxShadow: `0 0 32px rgba(31,74,58,0.25), 0 0 64px rgba(31,74,58,0.10), inset 0 0 20px rgba(31,74,58,0.08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: MX.emeraldText,
          }}
        >
          <IconPlay size={24} />
        </div>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              ...mono,
              fontSize: "13px",
              color: C.text2,
              letterSpacing: "0.02em",
            }}
          >
            Terminal walkthrough
          </span>
          <span
            style={{
              ...mono,
              fontSize: "11px",
              color: C.text3,
              letterSpacing: "0.04em",
            }}
          >
            // video coming soon
          </span>
        </div>

        {/* Fake waveform */}
        <div style={{ display: "flex", alignItems: "center", gap: "3px", opacity: 0.35 }}>
          {[12, 20, 8, 28, 16, 24, 10, 22, 14, 30, 8, 18, 26, 12, 20, 8, 28, 16, 24, 10].map((h, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: `${h}px`,
                borderRadius: "2px",
                background: MX.emeraldText,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */

interface HeroVideoProps {
  /** Path or URL to the video file. Omit to show the placeholder. */
  src?: string;
  /** Optional poster image shown before playback. */
  poster?: string;
}

export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrub]   = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => { if (!scrubbing) setCurrent(v.currentTime); };
    const onMeta = () => setDuration(v.duration);
    const onEnd  = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, [scrubbing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else         { v.play();  setPlaying(true);  }
  };

  const seekTo = (clientX: number) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setCurrent(pct * duration);
  };

  const progress = duration ? current / duration : 0;

  return (
    <div className={raisedCrispPanel("w-full select-none overflow-hidden")}>
      {/* ── Title bar — identical to HeroTerminal ── */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-gradient-to-b from-[#242424] to-[#1a1a1a] px-4 py-2.5 shadow-[0_1px_0_#ffffff28_inset]">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a4040]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a6a40]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3d6b40]" />
        </div>
        <div className="flex flex-1 justify-center">
          <span style={{ ...mono, color: C.text3, fontSize: "12px" }}>
            trx-cli — demo.mp4
          </span>
        </div>
        <div style={{ width: "80px" }} /> {/* balance the traffic lights */}
      </div>

      {/* ── Video / placeholder ── */}
      {src ? (
        <div
          className="relative bg-black"
          style={{ minHeight: "420px", cursor: "pointer" }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
          />
          {/* Big play overlay when paused */}
          {!playing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.30)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: `1px solid ${MX.borderBright}`,
                  background: "rgba(31,74,58,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: MX.emeraldText,
                  boxShadow: `0 0 24px rgba(31,74,58,0.30)`,
                }}
              >
                <IconPlay size={22} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Placeholder />
      )}

      {/* ── Controls bar — same height feel as HeroTerminal status bar ── */}
      <div
        className="flex items-center gap-3 border-t border-white/[0.06] bg-gradient-to-b from-[#1c1c1c] to-[#161616] px-4 py-2 shadow-[0_-1px_0_#ffffff14_inset]"
        style={{ ...mono, fontSize: "11px" }}
      >
        {/* Play / pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={!src}
          style={{
            background: "none",
            border: "none",
            cursor: src ? "pointer" : "default",
            color: src ? C.text2 : C.text3,
            padding: "2px",
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
        >
          {playing ? <IconPause size={13} /> : <IconPlay size={13} />}
        </button>

        {/* Current time */}
        <span style={{ color: C.text3, minWidth: "32px" }}>
          {fmtTime(current)}
        </span>

        {/* Progress bar */}
        <div
          ref={barRef}
          style={{
            flex: 1,
            height: "3px",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.08)",
            cursor: src ? "pointer" : "default",
            position: "relative",
          }}
          onMouseDown={e => {
            if (!src) return;
            setScrub(true);
            seekTo(e.clientX);
          }}
          onMouseMove={e => {
            if (!scrubbing) return;
            seekTo(e.clientX);
          }}
          onMouseUp={() => setScrub(false)}
          onMouseLeave={() => setScrub(false)}
        >
          {/* Filled portion */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress * 100}%`,
              borderRadius: "2px",
              background: MX.emeraldText,
              transition: scrubbing ? "none" : "width 0.25s linear",
            }}
          />
          {/* Scrub handle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${progress * 100}%`,
              transform: "translate(-50%, -50%)",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: MX.emeraldText,
              boxShadow: `0 0 6px ${MX.emeraldText}`,
              opacity: src ? 1 : 0,
            }}
          />
        </div>

        {/* Duration */}
        <span style={{ color: C.text3, minWidth: "32px", textAlign: "right" }}>
          {duration ? fmtTime(duration) : "--:--"}
        </span>

        {/* Volume */}
        <button
          type="button"
          disabled={!src}
          style={{
            background: "none",
            border: "none",
            cursor: src ? "pointer" : "default",
            color: src ? C.text3 : "rgba(255,255,255,0.12)",
            padding: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconVolume size={13} />
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          disabled={!src}
          onClick={() => videoRef.current?.requestFullscreen?.()}
          style={{
            background: "none",
            border: "none",
            cursor: src ? "pointer" : "default",
            color: src ? C.text3 : "rgba(255,255,255,0.12)",
            padding: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconFullscreen size={13} />
        </button>
      </div>
    </div>
  );
}
