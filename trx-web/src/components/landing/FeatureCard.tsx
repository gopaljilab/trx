"use client";

import { insetWell, raisedPanel } from "@/app/landing-material";
import { C } from "./tokens";
import { ScrambleText } from "./ScrambleText";

export function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className={[
        "group flex h-full cursor-default flex-col p-6 transition-[filter,box-shadow] duration-200",
        raisedPanel("hover:brightness-[1.03] hover:shadow-[0_1px_0.5px_#ffffff1a_inset,0_1px_1px_#ffffff38_inset,0_14px_18px_-10px_#00000078,0_24px_32px_-14px_#00000068,0_0px_8px_0px_#00000068]"),
      ].join(" ")}
    >
      <div className={insetWell("mb-3.5 flex w-full items-center gap-3 px-3 py-2.5")}>
        <span className="shrink-0 text-[#878787] transition-colors duration-200 group-hover:text-[#ebebeb]">
          {icon}
        </span>
        <h3
          className="min-w-0 flex-1 font-semibold leading-snug tracking-tight text-[#ebebeb] [font-family:var(--font-geist-sans)]"
          style={{ fontSize: "14px", margin: 0 }}
        >
          <ScrambleText text={title} duration={700} />
        </h3>
      </div>
      <p
        className="min-h-0 flex-1"
        style={{ color: C.text2, fontSize: "13.5px", lineHeight: "1.65", fontFamily: "var(--font-geist-sans)", margin: 0 }}
      >
        {desc}
      </p>
    </div>
  );
}
