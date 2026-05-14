import { insetWell, raisedPanel, raisedPill } from "@/app/landing-material";
import { C } from "./tokens";

export function PlatformBadge({ icon, name, manager }: { icon: React.ReactNode; name: string; manager: string }) {
  return (
    <div className={raisedPanel("flex items-center gap-4 p-5")}>
      <span className={`inline-flex shrink-0 p-2 text-[#878787] ${insetWell()}`}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: C.text, fontWeight: "600", fontSize: "14px", fontFamily: "var(--font-geist-sans)", marginBottom: "3px" }}>
          {name}
        </div>
        <div style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {manager}
        </div>
      </div>
      <span className={raisedPill("shrink-0 text-[#878787]")}>Supported</span>
    </div>
  );
}
