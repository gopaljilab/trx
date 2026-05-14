"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PixelGrid } from "@/components/landing/PixelGrid";
import { Container } from "@/components/landing/Container";
import { DocsSidebar } from "@/components/landing/DocsSidebar";
import { SCENE } from "@/app/landing-material";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${SCENE} min-h-screen overflow-x-hidden text-[#ebebeb]`}>
      <PixelGrid />
      <LandingHeader />
      
      <main style={{ paddingTop: "120px", position: "relative", zIndex: 1 }}>
        <Container className="py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <DocsSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </Container>
      </main>

      <LandingFooter />
    </div>
  );
}
