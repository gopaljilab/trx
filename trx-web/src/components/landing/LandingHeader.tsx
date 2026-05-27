"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { IconGithub } from "./icons";
import { onSamePageHashLinkClick } from "./smooth-hash-nav";
import { TrxLogo } from "./TrxLogo";

const NAV_LINKS = [
  { label: "Features",  href: "/#features"  },
  { label: "Install",   href: "/#install"   },
];

export function LandingHeader() {
  const pathname = usePathname();
  const installHref = "/#install";

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className="mx-auto box-border max-w-[1280px] px-6 pt-4 pb-0 sm:px-10">
        <div className="flex min-h-[52px] w-full items-center gap-2 sm:gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <TrxLogo size={26} variant="light" />
          </Link>

          {/* Nav links */}
          <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 sm:flex sm:ml-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => onSamePageHashLinkClick(e, href, pathname)}
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#888",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  padding: "5px 10px",
                  borderRadius: 8,
                  transition: "color 0.15s ease",
                }}
                className="hover:!text-[#111]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 sm:hidden" />

          {/* Right buttons */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            {/* GitHub - ghost outline */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="hidden sm:inline-block"
            >
              <a
                href="https://github.com/pie-314/trx"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#FFFFFF",
                  color: "#333",
                  fontSize: 13.5,
                  fontWeight: 500,
                  fontFamily: "var(--font-geist-sans)",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.04)",
                  transition: "background 0.15s ease",
                }}
              >
                <IconGithub className="shrink-0" size={13} />
                GitHub
              </a>
            </motion.div>

            {/* Install - dark pill */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="inline-block"
            >
              <Link
                href={installHref}
                onClick={(e) => onSamePageHashLinkClick(e, installHref, pathname)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "7px 16px",
                  borderRadius: 10,
                  background: "linear-gradient(to bottom, #8B7FF7, #6B5EE0)",
                  border: "1px solid rgba(107,94,224,0.5)",
                  color: "#FFFFFF",
                  fontSize: 13.5,
                  fontWeight: 600,
                  fontFamily: "var(--font-geist-sans)",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 2px 8px rgba(107,94,224,0.35)",
                }}
              >
                Install
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
