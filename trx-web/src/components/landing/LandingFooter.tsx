import Link from "next/link";
import { FOCUS_RING, raisedTopBar } from "@/app/landing-material";
import { C } from "./tokens";
import { TrxLogo } from "./TrxLogo";

const linkClass = [
  "text-[12.5px] text-[#505050] no-underline transition-colors hover:text-[#878787] sm:text-[13px]",
  "[font-family:var(--font-geist-sans)]",
  FOCUS_RING,
].join(" ");

export function LandingFooter() {
  return (
    <footer className="relative z-10 pb-0 pt-5 sm:pt-6">
      <div className="mx-auto box-border max-w-[1280px] px-4 sm:px-10">
        <div className={raisedTopBar("px-4 py-3 sm:px-6 sm:py-3.5")}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-8">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <TrxLogo size={22} variant="light" />
              <p
                className="min-w-0 text-[12px] leading-snug sm:text-[13px]"
                style={{ color: C.text3, fontFamily: "var(--font-geist-sans)", margin: 0 }}
              >
                A fast TUI package manager written in Rust.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end sm:gap-x-5">
              {[
                { label: "GitHub", href: "https://github.com/pie-314/trx", external: true },
                { label: "Issues", href: "https://github.com/pie-314/trx/issues", external: true },
                { label: "Docs", href: "/", external: false },
              ].map(link =>
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )
              )}
              <span
                className="hidden h-3 w-px shrink-0 bg-white/10 sm:block"
                aria-hidden
              />
              <span style={{ color: C.text3, fontSize: "12px", fontFamily: "var(--font-geist-mono)" }}>MIT · 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
