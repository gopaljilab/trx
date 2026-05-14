import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { C } from "@/components/landing/tokens";
import { insetWell, raisedPanel } from "@/app/landing-material";
import Link from "next/link";
import { ArrowRight, Book, Terminal, Settings, Layers, Zap } from "lucide-react";

const QUICK_LINKS = [
  { title: "Getting Started", href: "/docs/getting-started", icon: Book, desc: "Install TRX and take your first steps." },
  { title: "Commands", href: "/docs/commands", icon: Terminal, desc: "CLI keybindings and flags." },
  { title: "Configuration", href: "/docs/configuration", icon: Settings, desc: "Customize TRX to fit your workflow." },
  { title: "Architecture", href: "/docs/architecture", icon: Layers, desc: "Internal design and tech stack." },
  { title: "Performance", href: "/docs/performance", icon: Zap, desc: "Why TRX is blazingly fast." },
];

export default async function DocsOverview() {
  const filePath = path.join(process.cwd(), "docs", "README.md");
  const content = fs.readFileSync(filePath, "utf8");

  return (
    <div className="flex flex-col gap-12">
      <section className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
                {children}
              </h1>
            ),
            p: ({ children }) => (
              <p className="text-white/70 leading-relaxed mb-6 text-lg">
                {children}
              </p>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold tracking-widest text-white/20 uppercase mt-12 mb-6 border-none">
                {children}
              </h2>
            ),
            ul: ({ children }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose mb-16 mt-12">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href}>
                      <div className={raisedPanel("p-8 h-full flex flex-col gap-5 group hover:border-selection/30 transition-all cursor-pointer relative overflow-hidden")}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-selection/5 rounded-bl-full -mr-12 -mt-12 transition-colors group-hover:bg-selection/10" style={{ backgroundColor: `${C.selection}0D` }} />
                        
                        <div className="p-3 rounded-xl bg-white/5 text-selection w-fit shadow-inner" style={{ color: C.selection }}>
                          <Icon size={24} />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-selection transition-colors">{link.title}</h3>
                          <p className="text-[14px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{link.desc}</p>
                        </div>

                        <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] font-bold tracking-widest text-selection uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" style={{ color: C.selection }}>
                          Explore Guide <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ),
            li: () => null, // Hide the list since we render cards
          }}
        >
          {content}
        </ReactMarkdown>
      </section>
      
      <div className="p-8 rounded-2xl bg-selection/5 border border-selection/10 flex flex-col gap-4 items-center text-center">
         <h3 className="text-xl font-bold text-white">Need more help?</h3>
         <p className="text-white/60 max-w-md">
            If you can't find what you're looking for, feel free to open an issue on GitHub or join our community.
         </p>
         <div className="flex gap-4 mt-2">
            <a href="https://github.com/pie-314/trx/issues" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-selection hover:underline" style={{ color: C.selection }}>
               Open an Issue
            </a>
            <span className="text-white/10">|</span>
            <a href="https://github.com/pie-314/trx" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-selection hover:underline" style={{ color: C.selection }}>
               View Repository
            </a>
         </div>
      </div>
    </div>
  );
}
