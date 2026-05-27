"use client";

import { FadeUp } from "@/components/ui/FadeUp";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/Section";
import { FuzzySearchCard } from "./FuzzySearchCard";
import { MultiManagerCard } from "./MultiManagerCard";
import { BatchOpsCard } from "./BatchOpsCard";
import { ZeroRuntimeCard } from "./ZeroRuntimeCard";

export function Features() {
  return (
    <Section id="features">
      <FadeUp>
        <SectionLabel>Features</SectionLabel>
        <SectionHeading>
          Built for speed.<br />Designed for focus.
        </SectionHeading>
      </FadeUp>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .bento-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bento-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; flex: 1; }
        @media (max-width: 900px) { .bento-inner { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .bento-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="bento-grid">
        <FadeUp delay={0}    style={{ height: "100%" }}><FuzzySearchCard /></FadeUp>
        <FadeUp delay={0.07} style={{ height: "100%" }}><MultiManagerCard /></FadeUp>
        <FadeUp delay={0.12} style={{ height: "100%" }}><BatchOpsCard /></FadeUp>
        <FadeUp delay={0.17} style={{ height: "100%" }}><ZeroRuntimeCard /></FadeUp>
      </div>
    </Section>
  );
}
