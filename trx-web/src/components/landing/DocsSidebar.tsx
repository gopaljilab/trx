"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "./tokens";
import { Book, Terminal, Settings, Layers, Zap, ChevronRight, Home, Search } from "lucide-react";

const LINKS = [
  { title: "Overview", href: "/docs", icon: Home },
  { title: "Getting Started", href: "/docs/getting-started", icon: Book },
  { title: "Commands", href: "/docs/commands", icon: Terminal },
  { title: "Configuration", href: "/docs/configuration", icon: Settings },
  { title: "Architecture", href: "/docs/architecture", icon: Layers },
  { title: "Performance", href: "/docs/performance", icon: Zap },
];

export function DocsSidebar() {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const filteredLinks = LINKS.filter(link => 
    link.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      
      {/* Search Filter */}
      <div className="relative group">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-selection transition-colors" />
        <input 
          type="text" 
          placeholder="Filter guides..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-selection/50 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-white/20 uppercase">
          Guides & Reference
        </div>
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`
                group flex items-center justify-between px-3 py-2 rounded-lg transition-all
                ${active ? "bg-selection/10 border border-selection/20 shadow-[0_0_12px_rgba(85,95,187,0.1)]" : "hover:bg-white/5"}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={active ? "text-selection" : "text-white/30 group-hover:text-white/60"} style={{ color: active ? C.selection : undefined }} />
                <span className={`text-[14px] font-medium ${active ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                  {link.title}
                </span>
              </div>
              {active && <ChevronRight size={14} className="text-selection/40" style={{ color: `${C.selection}44` }} />}
            </Link>
          );
        })}

        {filteredLinks.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-[12px] text-white/20">No results for "{filter}"</p>
          </div>
        )}
      </div>

      {/* External Links */}
      <div className="flex flex-col gap-1 mt-4">
        <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-white/20 uppercase">
          Resources
        </div>
        <a 
          href="https://github.com/pie-314/trx" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-white/60 hover:text-white"
        >
          <Terminal size={16} className="text-white/30 group-hover:text-white/60" />
          <span className="text-[14px] font-medium">Source Code</span>
        </a>
        <a 
          href="https://github.com/pie-314/trx/issues" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-white/60 hover:text-white"
        >
          <Settings size={16} className="text-white/30 group-hover:text-white/60" />
          <span className="text-[14px] font-medium">Report Issue</span>
        </a>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-4">
        <div className="px-3 py-3 rounded-xl bg-selection/5 border border-selection/10 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Current Version</span>
            <span className="text-[12px] font-mono font-bold text-selection" style={{ color: C.selection }}>v0.1.0-stable</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-selection animate-pulse shadow-[0_0_8px_rgba(85,95,187,0.5)]" style={{ backgroundColor: C.selection }} />
        </div>
        
        <p className="px-3 text-[11px] text-white/20 leading-relaxed">
          TRX is open source and community maintained.
        </p>
      </div>

    </aside>
  );
}
