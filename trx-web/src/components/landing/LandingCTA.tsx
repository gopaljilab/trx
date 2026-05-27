"use client";

import Link from "next/link";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function LandingCTA() {
  return (
    <section
      style={{
        background: "transparent",
        padding: "0 16px 0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "#1c1c1c",
          borderRadius: 24,
          padding: "88px 24px 96px",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 0 rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle top-edge highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            pointerEvents: "none",
          }}
        />

        <h2
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#F5F5F5",
            margin: "0 0 16px",
            maxWidth: 640,
          }}
        >
          Manage packages at the<br />speed of thought
        </h2>

        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(14px, 1.8vw, 16px)",
            color: "#888",
            lineHeight: 1.65,
            margin: "0 0 40px",
            maxWidth: 420,
            letterSpacing: "-0.01em",
          }}
        >
          trx puts 50,000+ packages at your fingertips. Search, install, and manage — all from a keyboard-driven terminal interface.
        </p>

        <Link
          href="#install"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 10,
            background: "linear-gradient(to bottom, #8B7FF7, #6B5EE0)",
            border: "1px solid rgba(107,94,224,0.5)",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-geist-sans)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 2px 8px rgba(107,94,224,0.35)",
            transition: "background 0.15s ease",
          }}
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  );
}
