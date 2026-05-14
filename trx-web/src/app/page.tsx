"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { lightOutlineBtn, raisedGhostBtn, raisedPanel, SCENE } from "./landing-material";
import { C } from "@/components/landing/tokens";
import { MX } from "@/components/landing/matrix-tokens";
import { ease, itemVariants } from "@/components/landing/animations";
import { Container } from "@/components/landing/Container";
import { FadeUp, StaggerInView } from "@/components/landing/motion-primitives";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { HeroCurlInstall } from "@/components/landing/HeroCurlInstall";
import { HeroTerminal } from "@/components/landing/HeroTerminal";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { GlitchHeading } from "@/components/landing/GlitchHeading";
import { IconApple, IconArch, IconBox, IconGithub, IconLayers, IconLinux, IconSearch, IconZap } from "@/components/landing/icons";
import { Label } from "@/components/landing/Label";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { PlatformBadge } from "@/components/landing/PlatformBadge";
import { Step } from "@/components/landing/Step";
import { StepFlowConnector } from "@/components/landing/StepFlowConnector";
import { onSamePageHashLinkClick } from "@/components/landing/smooth-hash-nav";

export default function Home() {
  const pathname = usePathname();
  const installHref = "/#install";
  return (
    <div className={`${SCENE} min-h-screen overflow-x-hidden text-[#ebebeb]`}>
      <MatrixRain opacity={0.75} speed={0.35} />
      <LandingHeader />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "80px", position: "relative", zIndex: 1 }}>
        <Container className="py-10 sm:py-16 lg:py-20" style={{ position: "relative", zIndex: 1 }}>

          {/* Headline row: left copy + right curl install */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-8 sm:mb-14 sm:gap-10">

            {/* Left: headline + description + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0 }}
              style={{ maxWidth: "520px", width: "100%" }}
            >
              <GlitchHeading
                className="mx-reveal"
                style={{ fontSize: "clamp(26px, 3vw, 44px)", fontWeight: "700", lineHeight: "1.12", letterSpacing: "-0.03em", color: C.text, fontFamily: "var(--font-geist-sans)", marginBottom: "16px" }}
              >
                The package manager<br />
                <span style={{ whiteSpace: "nowrap" }}>for the terminal generation.</span>
              </GlitchHeading>
              <p style={{ color: C.text2, fontSize: "14px", lineHeight: "1.6", fontFamily: "var(--font-geist-sans)", maxWidth: "400px", margin: 0 }}>
                Fast, keyboard-driven, and cross-platform. Search 50,000+ packages in under 50ms and install them without leaving your terminal.
              </p>
              <div className="mb-4 mt-4 flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: MX.emeraldText }} />
                <span style={{ color: C.text2, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>Written in pure Rust</span>
                <span style={{ color: C.text3, fontSize: "13.5px", fontFamily: "var(--font-geist-sans)" }}>· no async runtime</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
                  <Link
                    href={installHref}
                    onClick={(e) => onSamePageHashLinkClick(e, installHref, pathname)}
                    className={[lightOutlineBtn(), "[font-family:var(--font-geist-sans)]"].join(" ")}
                  >
                    Get started
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
                  <a
                    href="https://github.com/pie-314/trx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[raisedGhostBtn(), "no-underline", "[font-family:var(--font-geist-sans)]"].join(" ")}
                  >
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
              style={{ maxWidth: "420px", width: "100%", paddingBottom: "2px" }}
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
        <Container className="py-12 sm:py-16 lg:py-20">
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
        <Container className="py-12 sm:py-16 lg:py-20">
          <FadeUp style={{ marginBottom: "36px" }}>
            <Label>Get started</Label>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700", letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)", lineHeight: "1.15", color: C.text, maxWidth: "440px" }}>
              Up and running<br />in 30 seconds.
            </h2>
          </FadeUp>

          <div className={raisedPanel("p-6 sm:p-8 md:p-12")}>
            <StaggerInView className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8 lg:gap-12">
              <motion.div variants={itemVariants} className="flex-1 min-w-0"><Step num="01" title="Install TRX" code="cargo install trx-cli" /></motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } } }} className="hidden sm:flex"><StepFlowConnector phase={0} /></motion.div>
              <motion.div variants={itemVariants} className="flex-1 min-w-0"><Step num="02" title="Launch" code="trx" /></motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.3 } } }} className="hidden sm:flex"><StepFlowConnector phase={1} /></motion.div>
              <motion.div variants={itemVariants} className="flex-1 min-w-0"><Step num="03" title="Search and install" code="e, type, space, i" /></motion.div>
            </StaggerInView>
          </div>
        </Container>
      </section>

      {/* ── PLATFORMS ────────────────────────────────────────────────────────── */}
      <section id="platforms" style={{ position: "relative", zIndex: 1 }}>
        <Container className="py-12 sm:py-16 lg:py-20">
          <FadeUp style={{ marginBottom: "32px" }}>
            <Label>Platforms</Label>
            <div className="mt-3 flex flex-col justify-between  gap-4 sm:flex-row sm:items-end sm:gap-14">
              <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: "700", letterSpacing: "-0.03em", fontFamily: "var(--font-geist-sans)", lineHeight: "1.15", color: C.text, margin: 0 }}>
                Works everywhere<br />you work.
              </h2>
              <p style={{ color: C.text2, fontSize: "14px", fontFamily: "var(--font-geist-sans)", maxWidth: "280px", lineHeight: "1.65", margin: 0, flexShrink: 0 }}>
                Package manager auto-detected at launch. Zero configuration. Just run <code style={{ fontFamily: "var(--font-geist-mono)", color: C.text3 }}>trx-cli</code>.
              </p>
            </div>
          </FadeUp>
          <StaggerInView style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
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
