"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { insetWell, raisedGhostBtn, raisedPanel, SCENE } from "./landing-material";
import { C, SECTION_PAD_X, SECTION_PAD_Y } from "@/components/landing/tokens";
import { ease, itemVariants } from "@/components/landing/animations";
import { Container } from "@/components/landing/Container";
import { FadeUp, StaggerInView } from "@/components/landing/motion-primitives";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { HeroCurlInstall } from "@/components/landing/HeroCurlInstall";
import { HeroTerminal } from "@/components/landing/HeroTerminal";
import { IconApple, IconArch, IconBox, IconGithub, IconLayers, IconLinux, IconSearch, IconZap } from "@/components/landing/icons";
import { Label } from "@/components/landing/Label";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { PlatformBadge } from "@/components/landing/PlatformBadge";
import { Step } from "@/components/landing/Step";
import { StepFlowConnector } from "@/components/landing/StepFlowConnector";

export default function Home() {
  return (
    <div className={`${SCENE} min-h-screen overflow-x-hidden text-[#ebebeb]`}>
      <LandingHeader />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "80px", position: "relative", zIndex: 1 }}>
        <Container style={{ padding: "80px 40px 64px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "48px", marginBottom: "56px", flexWrap: "wrap" }}>

            {/* Left: headline + description + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0 }}
              style={{ maxWidth: "520px" }}
            >
              <h1 style={{ fontSize: "clamp(26px, 3vw, 44px)", fontWeight: "700", lineHeight: "1.12", letterSpacing: "-0.03em", color: C.text, fontFamily: "var(--font-geist-sans)", marginBottom: "16px" }}>
                The package manager<br />
                <span style={{ whiteSpace: "nowrap" }}>for the terminal generation.</span>
              </h1>
              <p style={{ color: C.text2, fontSize: "14px", lineHeight: "1.6", fontFamily: "var(--font-geist-sans)", maxWidth: "400px", margin: 0 }}>
                Fast, keyboard-driven, and cross-platform. Search 50,000+ packages in under 50ms and install them without leaving your terminal.
              </p>
              <div className="mb-4 mt-4 flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.installed }} />
                <span style={{ color: C.text2, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>Written in pure Rust</span>
                <span style={{ color: C.text3, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>· no async runtime</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg bg-[#0d0d0d] p-px shadow-[0_0.5px_0_#ffffff50,0_2px_6px_#00000090_inset]">
                  <Link
                    href="/#install"
                    className="inline-flex h-8 items-center justify-center rounded-[7px] px-3 text-sm font-medium leading-none text-[#878787] no-underline outline-none transition-colors hover:text-[#ebebeb] focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] [font-family:var(--font-geist-sans)]"
                  >
                    Get started
                  </Link>
                </div>
                <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
                  <a href="https://github.com/pie-314/trx" target="_blank" rel="noopener noreferrer" className={[raisedGhostBtn(), "no-underline"].join(" ")}>
                    <IconGithub size={13} /> View source
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: curl install */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.12 }}
              style={{ paddingBottom: "2px", flexShrink: 0, maxWidth: "420px", width: "100%" }}
            >
              <HeroCurlInstall />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.22 }}>
            <HeroTerminal />
          </motion.div>
        </Container>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{ marginBottom: "36px" }}>
            <Label>Features</Label>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700", letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)", lineHeight: "1.15", color: C.text, maxWidth: "440px" }}>
              Built for speed.<br />Designed for focus.
            </h2>
          </FadeUp>
          <StaggerInView style={{ display: "grid", alignItems: "stretch", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: "12px" }}>
            <motion.div className="h-full" variants={itemVariants}><FeatureCard icon={<IconSearch />} title="Fuzzy Search" desc="50ms debounced live search across all packages. Scoring-based fuzzy matching finds what you mean, not just exact strings." /></motion.div>
            <motion.div className="h-full" variants={itemVariants}><FeatureCard icon={<IconBox />} title="Multi-Manager" desc="One interface for Homebrew, Pacman, AUR via yay, and APT. Auto-detected at launch; no config required." /></motion.div>
            <motion.div className="h-full" variants={itemVariants}><FeatureCard icon={<IconLayers />} title="Batch Operations" desc="Select multiple packages with Space, then install or remove in one shot. No repeated confirmations." /></motion.div>
            <motion.div className="h-full" variants={itemVariants}><FeatureCard icon={<IconZap />} title="Zero Runtime" desc="Pure Rust, no async runtime. Concurrent search via OS threads and mpsc channels. Cold starts in milliseconds." /></motion.div>
          </StaggerInView>
        </Container>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="install" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{ marginBottom: "36px" }}>
            <Label>Get started</Label>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700", letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)", lineHeight: "1.15", color: C.text, maxWidth: "440px" }}>
              Up and running<br />in 30 seconds.
            </h2>
          </FadeUp>

          <div className={raisedPanel("p-8 sm:p-12")}>
            <StaggerInView style={{ display: "flex", gap: "48px", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "56px" }}>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}><Step num="01" title="Install TRX" code="cargo install trx" /></motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } } }}><StepFlowConnector phase={0} /></motion.div>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}><Step num="02" title="Launch" code="trx" /></motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.3 } } }}><StepFlowConnector phase={1} /></motion.div>
              <motion.div variants={itemVariants} style={{ flex: 1, minWidth: "190px" }}><Step num="03" title="Search and install" code="e, type, space, i" /></motion.div>
            </StaggerInView>

            <FadeUp>
              <div className={raisedPanel("grid gap-3 p-5 sm:p-6 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]")}>
                <div style={{ gridColumn: "1 / -1", marginBottom: "2px" }}>
                  <span style={{ color: C.text2, fontSize: "12px", fontWeight: "600", fontFamily: "var(--font-geist-sans)", letterSpacing: "-0.01em" }}>Keyboard shortcuts</span>
                </div>
                {[
                  { key: "e", desc: "Search mode" },
                  { key: "space", desc: "Toggle select" },
                  { key: "i", desc: "Install" },
                  { key: "x", desc: "Remove" },
                  { key: "U", desc: "System upgrade" },
                  { key: "R", desc: "Refresh databases" },
                  { key: "Tab", desc: "Switch tab" },
                  { key: "q", desc: "Quit" },
                ].map(({ key, desc }) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <kbd className={insetWell("min-w-[2rem] shrink-0 rounded-md px-2 py-1 text-center font-mono text-[11px] text-[#c4c4c4]")}>{key}</kbd>
                    <span style={{ color: C.text2, fontSize: "13px", fontFamily: "var(--font-geist-sans)" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* ── PLATFORMS ────────────────────────────────────────────────────────── */}
      <section id="platforms" style={{ position: "relative", zIndex: 1 }}>
        <Container style={{ padding: `${SECTION_PAD_Y} ${SECTION_PAD_X}` }}>
          <FadeUp style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginBottom: "32px" }}>
            <div>
              <Label>Platforms</Label>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700", letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)", lineHeight: "1.15", color: C.text, margin: 0 }}>
                Works everywhere<br />you work.
              </h2>
            </div>
            <p style={{ color: C.text2, fontSize: "14px", fontFamily: "var(--font-geist-sans)", maxWidth: "280px", lineHeight: "1.65", margin: 0 }}>
              Package manager auto-detected at launch. Zero configuration. Just run <code style={{ fontFamily: "var(--font-geist-mono)", color: C.text3 }}>trx</code>.
            </p>
          </FadeUp>
          <StaggerInView style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <motion.div variants={itemVariants}><PlatformBadge icon={<IconApple />} name="macOS" manager="via Homebrew (brew)" /></motion.div>
            <motion.div variants={itemVariants}><PlatformBadge icon={<IconArch />} name="Arch Linux" manager="via Pacman + AUR (yay)" /></motion.div>
            <motion.div variants={itemVariants}><PlatformBadge icon={<IconLinux />} name="Debian / Ubuntu" manager="via APT (apt)" /></motion.div>
          </StaggerInView>
        </Container>
      </section>

      <LandingFooter />
    </div>
  );
}
