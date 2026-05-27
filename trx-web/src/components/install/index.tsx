"use client";

import { FadeUp } from "@/components/ui/FadeUp";
import { Section, SectionLabel, SectionHeading } from "@/components/ui/Section";
import { StepCard } from "./StepCard";
import { FlowConnector } from "./FlowConnector";

const STEPS = [
  { num: "01", title: "Install trx",        desc: "Install trx using Cargo.",               code: "cargo install trx-cli", badgeBg: "rgba(96,165,250,0.65)",  badgeColor: "#e0eaff", badgeRing: "rgba(96,165,250,0.45)",  cmdAccent: "#60a5fa" },
  { num: "02", title: "Launch",             desc: "Start the trx CLI.",                      code: "trx",                   badgeBg: "rgba(52,211,153,0.65)",  badgeColor: "#d1fae5", badgeRing: "rgba(52,211,153,0.45)",  cmdAccent: "#34d399" },
  { num: "03", title: "Search and install", desc: "Search and install packages in a flash.", code: "e, type, space, i",     badgeBg: "rgba(167,139,250,0.65)", badgeColor: "#ede9fe", badgeRing: "rgba(167,139,250,0.45)", cmdAccent: "#a78bfa" },
];

export function InstallSteps() {
  return (
    <Section id="install">
      <FadeUp style={{ marginBottom: 60 }}>
        <SectionLabel>Get started</SectionLabel>
        <SectionHeading sub="Up and running in under a minute. Copy any command to get started.">
          Up and running<br />in 30 seconds.
        </SectionHeading>
      </FadeUp>

      <div style={{ maxWidth: 740, margin: "0 auto", position: "relative" }}>
        <FadeUp delay={0}><StepCard {...STEPS[0]} /></FadeUp>
        <FlowConnector side="right" delay={0.15} accent="#a5b4fc" />
        <FadeUp delay={0.1}><StepCard {...STEPS[1]} /></FadeUp>
        <FlowConnector side="left" delay={0.35} accent="#a5b4fc" />
        <FadeUp delay={0.2}><StepCard {...STEPS[2]} /></FadeUp>
      </div>

      <style>{`
        .step-cmd { min-width: 200px; max-width: 340px; }
        @media (max-width: 560px) {
          .step-card { grid-template-columns: auto 1fr !important; grid-template-rows: auto auto; }
          .step-cmd { min-width: 0; max-width: 100%; width: 100%; grid-column: 1 / -1; margin-top: 12px; }
        }
      `}</style>
    </Section>
  );
}
