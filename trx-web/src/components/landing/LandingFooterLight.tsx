import Link from "next/link";
import { TrxLogo } from "./TrxLogo";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Install",  href: "/#install"  },
      { label: "Changelog", href: "https://github.com/pie-314/trx/releases", external: true },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "GitHub",      href: "https://github.com/pie-314/trx",          external: true },
      { label: "Issues",      href: "https://github.com/pie-314/trx/issues",   external: true },
      { label: "Releases",    href: "https://github.com/pie-314/trx/releases", external: true },
      { label: "Discussions", href: "https://github.com/pie-314/trx/discussions", external: true },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Source Code",  href: "https://github.com/pie-314/trx",                               external: true },
      { label: "MIT License",  href: "https://github.com/pie-314/trx/blob/main/LICENSE",             external: true },
      { label: "Contributing", href: "https://github.com/pie-314/trx/blob/main/CONTRIBUTING.md",     external: true },
      { label: "Contact",      href: "https://github.com/pie-314/trx/issues",                        external: true },
    ],
  },
];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-sans)",
  fontSize: 14,
  color: "#888",
  textDecoration: "none",
  letterSpacing: "-0.01em",
  lineHeight: 1,
  display: "block",
};

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</a>;
  }
  return <Link href={href} style={linkStyle}>{label}</Link>;
}

export function LandingFooterLight() {
  return (
    <footer
      style={{
        background: "transparent",
        padding: "0 16px 0",
        position: "relative",
      }}
    >
      {/* ── Footer card ── */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "#1c1c1c",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 0 rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: "40px 40px 32px",
        }}
      >
        {/* Top row: logo+desc + link columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(200px, 1fr) repeat(3, auto)",
            gap: "40px 64px",
            marginBottom: 40,
            alignItems: "start",
          }}
          className="footer-grid"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
            <TrxLogo size={26} variant="light" />
            <p
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                color: "#888",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 260,
                letterSpacing: "-0.01em",
              }}
            >
              A blazing-fast TUI package manager written in Rust. Search, install, and manage packages without leaving your terminal.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#F5F5F5",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {col.heading}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {col.links.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: "#777",
              letterSpacing: "-0.01em",
            }}
          >
            © 2026 trx. MIT License
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { label: "Terms of Use",   href: "https://github.com/pie-314/trx/blob/main/LICENSE" },
              { label: "Privacy Policy", href: "https://github.com/pie-314/trx" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  color: "#888",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,255,255,0.15)",
                  letterSpacing: "-0.01em",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom padding ── */}
      <div style={{ height: 24 }} />

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px 24px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
