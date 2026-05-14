import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ButtonClickSound } from "@/components/landing/ButtonClickSound";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "A blazing-fast TUI package manager written in Rust. Fuzzy search, install, and manage packages across macOS, Arch Linux, and Debian/Ubuntu, without leaving your terminal.";

export const metadata: Metadata = {
  metadataBase: new URL("https://trx.pidev.tech"),
  title: "TRX - Terminal Package Manager",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "https://trx.pidev.tech",
    title: "TRX - Terminal Package Manager",
    description: DESCRIPTION,
    siteName: "TRX",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TRX Terminal Package Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRX - Terminal Package Manager",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TRX",
  operatingSystem: "macOS, Linux",
  applicationCategory: "DeveloperApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: "https://trx.pidev.tech",
  description: DESCRIPTION,
  codeRepository: "https://github.com/pie-314/trx",
  programmingLanguage: "Rust",
  license: "MIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ButtonClickSound />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
