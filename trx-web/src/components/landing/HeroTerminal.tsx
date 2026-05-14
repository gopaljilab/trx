"use client";

import { useEffect, useRef, useState } from "react";
import { insetWell, raisedCrispPanel, RAISED_BORDER, RAISED_GRAD, RAISED_SHADOW } from "@/app/landing-material";
import { C, S } from "./tokens";
import { MX } from "./matrix-tokens";
import { DEMOS, type DemoPkg } from "./demo-data";

export function HeroTerminal() {
  const [demoIdx, setDemoIdx]      = useState(0);
  const [displayQuery, setDisplay] = useState("");
  const [selectedRow, setSelRow]   = useState(0);
  const [cursorVis, setCursorVis]  = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursorVis(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  const charIdxRef = useRef(0);
  const demoIdxRef = useRef(0);
  const selRowRef  = useRef(0);
  const phaseRef   = useRef<"typing" | "browsing" | "deleting">("typing");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const demo = DEMOS[demoIdxRef.current]!;
      if (phaseRef.current === "typing") {
        if (charIdxRef.current < demo.query.length) {
          charIdxRef.current++;
          setDisplay(demo.query.slice(0, charIdxRef.current));
          t = setTimeout(tick, 90 + Math.random() * 70);
        } else { phaseRef.current = "browsing"; t = setTimeout(tick, 900); }
      } else if (phaseRef.current === "browsing") {
        if (selRowRef.current < demo.packages.length - 1) {
          selRowRef.current++;
          setSelRow(selRowRef.current);
          t = setTimeout(tick, 520);
        } else { phaseRef.current = "deleting"; t = setTimeout(tick, 1100); }
      } else {
        if (charIdxRef.current > 0) {
          charIdxRef.current--;
          setDisplay(demo.query.slice(0, charIdxRef.current));
          t = setTimeout(tick, 48);
        } else {
          demoIdxRef.current = (demoIdxRef.current + 1) % DEMOS.length;
          selRowRef.current  = 0;
          phaseRef.current   = "typing";
          setDemoIdx(demoIdxRef.current);
          setSelRow(0);
          t = setTimeout(tick, 500);
        }
      }
    };
    t = setTimeout(tick, 1600);
    return () => clearTimeout(t);
  }, []);

  const demo   = DEMOS[demoIdx]!;
  const detail = demo.detail;
  const selPkg = demo.packages[selectedRow] ?? demo.packages[0]!;

  const statusCol = (s: DemoPkg["status"]) =>
    s === "installed" ? C.installed : s === "aur" ? C.aur : C.available;

  const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono), 'Courier New', monospace" };

  return (
    <div className={raisedCrispPanel("w-full select-none overflow-hidden")}>

      {/* ── Title bar ── */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-gradient-to-b from-[#242424] to-[#1a1a1a] px-3 py-2.5 shadow-[0_1px_0_#ffffff28_inset] sm:px-4">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a4040]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#7a6a40]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3d6b40]" />
        </div>
        <div className="flex flex-1 justify-center">
          <span style={{ ...mono, color: C.text3, fontSize: "12px" }}>trx-cli</span>
        </div>
        {/* Tabs — hidden on mobile */}
        <div className="hidden gap-0.5 sm:flex">
          {["Search", "Installed", "Updates"].map((tab, i) => (
            <span key={tab} style={{
              ...mono, fontSize: "11px", padding: "3px 10px", borderRadius: "5px",
              background: i === 0 ? C.surface3 : "transparent",
              color: i === 0 ? C.text : C.text3,
              boxShadow: i === 0 ? S.ring : "none",
            }}>{tab}</span>
          ))}
        </div>
      </div>

      {/* ── Three-panel body ── */}
      {/*
        Mobile  (<sm):  package list only
        sm–lg:          sidebar + package list
        lg+:            sidebar + package list + detail
      */}
      <div className="flex min-h-[360px] bg-[#101010] sm:min-h-[420px]">

        {/* Sidebar — sm+ only */}
        <div className="hidden w-[160px] shrink-0 flex-col border-r border-white/[0.05] bg-[#0e0e0e] py-3 shadow-[inset_-6px_0_12px_-8px_rgba(0,0,0,0.45)] sm:flex sm:w-[180px]">
          {[
            { label: "Search",    active: true },
            { label: "Installed", active: false },
            { label: "Updates",   active: false },
          ].map(item => (
            <div key={item.label} style={{
              ...mono, fontSize: "12.5px", padding: "5px 14px",
              color: item.active ? C.text : C.text2,
              background: item.active ? C.surface3 : "transparent",
              borderLeft: `2px solid ${item.active ? C.text3 : "transparent"}`,
            }}>{item.label}</div>
          ))}
          <div style={{ ...mono, fontSize: "10px", color: C.text3, padding: "14px 14px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Managers
          </div>
          {["pacman", "aur", "brew"].map(m => (
            <div key={m} style={{ ...mono, fontSize: "12.5px", padding: "4px 14px", color: C.text3 }}>{m}</div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ ...mono, fontSize: "10px", color: C.text3, padding: "0 14px 10px" }}>50,342 packages</div>
        </div>

        {/* Package list */}
        <div className="flex flex-1 flex-col border-r border-white/[0.05] bg-[#0c0c0c]">

          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.05] px-3 py-2.5 sm:px-3.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ ...mono, fontSize: "13px", color: C.text }}>{displayQuery}</span>
            <span style={{
              display: "inline-block", width: "6px", height: "13px",
              background: MX.emeraldText, borderRadius: "1px",
              opacity: cursorVis ? 1 : 0, transition: "opacity 0.05s",
            }} />
            {/* Results count — hidden on xs */}
            <span className="ml-auto hidden sm:inline" style={{ ...mono, fontSize: "11px", color: C.text3 }}>
              {demo.packages.length} results
            </span>
          </div>

          {/* Column headers — hidden on mobile, show version+status only on sm+ */}
          <div className="hidden border-b border-white/[0.04] px-3.5 py-1 sm:flex">
            <span style={{ ...mono, fontSize: "10px", color: C.text3, flex: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Package</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Version</span>
            <span style={{ ...mono, fontSize: "10px", color: C.text3, width: "72px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</span>
          </div>

          {/* Package rows */}
          {demo.packages.map((pkg, i) => (
            <div key={`${demoIdx}-${pkg.name}`} style={{
              display: "flex", alignItems: "center",
              padding: "7px 12px",
              background: i === selectedRow ? MX.emeraldSubtle : "transparent",
              borderLeft: `2px solid ${i === selectedRow ? MX.emeraldBright : "transparent"}`,
              transition: "background 0.15s",
            }}>
              <span style={{ color: pkg.checked ? C.installed : C.surface3, fontSize: "8px", marginRight: "8px", flexShrink: 0 }}>●</span>
              <span style={{ ...mono, fontSize: "13px", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: i === selectedRow ? C.text : C.text2, fontWeight: i === selectedRow ? "500" : "400" }}>
                {pkg.name}
              </span>
              {/* Version + status — hidden on xs */}
              <span className="hidden sm:inline" style={{ ...mono, fontSize: "12px", color: C.text3, width: "72px", flexShrink: 0 }}>{pkg.version}</span>
              <span className="hidden sm:inline" style={{ ...mono, fontSize: "11.5px", color: statusCol(pkg.status), width: "72px", flexShrink: 0 }}>{pkg.status}</span>
            </div>
          ))}
        </div>

        {/* Detail panel — lg+ only */}
        <div className="hidden w-[240px] shrink-0 flex-col gap-3.5 bg-[#101010] p-4 lg:flex lg:w-[260px]">
          <div>
            <div style={{ ...mono, fontSize: "14px", color: C.text, fontWeight: "600", marginBottom: "4px" }}>{selPkg.name}</div>
            <div style={{ ...mono, fontSize: "11.5px", color: C.text2, lineHeight: "1.6" }}>{detail.desc}</div>
          </div>
          <div className="border-b border-white/[0.05] pb-3.5">
            {[
              { label: "Version",  value: detail.version },
              { label: "Size",     value: detail.size },
              { label: "Provider", value: selPkg.status === "installed" ? "pacman" : selPkg.status },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ ...mono, fontSize: "11.5px", color: C.text3 }}>{row.label}</span>
                <span style={{ ...mono, fontSize: "11.5px", color: C.text2 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ ...mono, fontSize: "10px", color: C.text3, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Dependencies</div>
            <div style={{ ...mono, fontSize: "11.5px", color: C.text2, lineHeight: "1.7" }}>
              {detail.deps.split(", ").map(dep => (
                <span key={dep} className="mb-1 mr-1.5 inline-block">
                  <span className={[RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, "inline-block rounded px-1.5 py-0.5"].join(" ")} style={mono}>{dep}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-auto flex gap-1.5">
            <button type="button" className={[RAISED_GRAD, RAISED_BORDER, RAISED_SHADOW, "flex-1 cursor-pointer rounded-md border-none py-1.5 font-mono text-xs font-medium text-[#ebebeb] transition hover:brightness-105 active:scale-[0.98]"].join(" ")} style={mono}>Install</button>
            <button type="button" className={[insetWell("rounded-md"), "cursor-pointer border-none px-2.5 py-1.5 font-mono text-xs text-[#878787] transition hover:text-[#ebebeb]"].join(" ")} style={mono}>Remove</button>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center gap-3 border-t border-white/[0.06] bg-gradient-to-b from-[#1c1c1c] to-[#161616] px-3 py-1 shadow-[0_-1px_0_#ffffff14_inset] sm:px-4" style={{ ...mono, fontSize: "11px" }}>
        <span style={{ color: C.text, fontWeight: "700", letterSpacing: "0.04em", flexShrink: 0 }}>NORMAL</span>
        {/* Keybindings — hidden on mobile */}
        <span className="hidden min-w-0 truncate sm:block" style={{ color: C.text3 }}>
          e:search · space:select · i:install · x:remove · U:upgrade · tab:switch
        </span>
        <span className="ml-auto shrink-0" style={{ color: C.text3 }}>
          {demo.packages.filter(p => p.checked).length} selected · {demo.packages.length} shown
        </span>
      </div>
    </div>
  );
}
