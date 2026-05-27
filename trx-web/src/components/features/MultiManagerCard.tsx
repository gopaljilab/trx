import { SiApple, SiArchlinux, SiDebian } from "react-icons/si";
import { LuBox } from "react-icons/lu";
import { CARD_STYLE, IconSquare, CardTitle, CardDesc } from "./shared";

const PLATFORMS = [
  { icon: <SiApple size={18} />,     name: "macOS",         sub: "Homebrew",     iconBg: "#F0EFEE", iconColor: "#333",     iconRing: "rgba(51,51,51,0.12)"   },
  { icon: <SiArchlinux size={18} />, name: "Arch Based OS", sub: "Pacman + AUR", iconBg: "#EEF2FF", iconColor: "#4F46E5", iconRing: "rgba(79,70,229,0.15)"  },
  { icon: <SiDebian size={18} />,    name: "Debian Based",  sub: "APT",          iconBg: "#FFF0F3", iconColor: "#D70751", iconRing: "rgba(215,7,81,0.15)"   },
];

export function MultiManagerCard() {
  return (
    <div style={CARD_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <IconSquare icon={<LuBox size={20} />} bg="rgba(16,185,129,0.70)" color="#FFFFFF" ring="rgba(5,150,105,0.50)" />
        <CardTitle>Multi-Manager</CardTitle>
      </div>
      <CardDesc>
        One interface for Homebrew, Pacman, AUR via yay, and APT. Auto-detected at launch; no config required.
      </CardDesc>
      <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 24, flexWrap: "wrap" }}>
        {PLATFORMS.map((p) => (
          <div
            key={p.name}
            style={{
              flex: "1 1 0",
              minWidth: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              background: "#252525",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: p.iconBg, border: "2px solid #FFFFFF",
                boxShadow: `0 0 0 1px ${p.iconRing}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: p.iconColor,
              }}
            >
              {p.icon}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600, color: "#F5F5F5", letterSpacing: "-0.02em" }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11.5, color: "#777", marginTop: 1 }}>
                {p.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
