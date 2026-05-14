"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANDING_UI_SOUND_CLASS } from "@/app/landing-material";
import { onSamePageHashLinkClick } from "./smooth-hash-nav";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={(e) => onSamePageHashLinkClick(e, href, pathname)}
      className={[
        LANDING_UI_SOUND_CLASS,
        "rounded-md px-1 py-0.5 text-sm font-medium text-[#878787] outline-none transition-colors",
        "hover:text-[#ebebeb]",
        "focus-visible:ring-2 focus-visible:ring-[#555fbb]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]",
        "shrink-0 [font-family:var(--font-geist-sans)] sm:text-[14px]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
