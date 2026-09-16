"use client";

import React from "react";
import Link from "next/link";
import { BOTS } from "@/data/bots";
import { Navigation } from "@/components/Navigation";
import { ChevronRight, Flame, BookOpen } from "lucide-react";

export default function StoryPage() {
  return (
    <div className="min-h-screen w-screen bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden pb-6">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 flex flex-col justify-between relative z-10 py-2">
        
        {/* Top Header Grid */}
        <div className="grid grid-cols-12 items-start pt-2 mb-6">
          <div className="col-span-12 lg:col-span-6 space-y-2 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                ARCHIVE DOSSIER
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                Optical Intelligence Logs
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              SENTINEL <br />
              <span className="text-orange-600">ORIGIN LORE</span>
            </h1>
          </div>
        </div>

        {/* Bot Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
          {BOTS.map((bot) => (
            <article
              key={bot.id}
              className="p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-200/90 border border-zinc-300 font-bold text-zinc-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-600" />
                    LVL: {bot.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    SHUTTER: {(bot.minBlinkMs / 1000).toFixed(0)}s - {(bot.maxBlinkMs / 1000).toFixed(0)}s
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
                    {bot.name}
                  </h2>
                  <p className="text-[11px] font-bold text-orange-600 tracking-wide uppercase">
                    {bot.tagline}
                  </p>
                </div>

                {/* Lore Body Text */}
                <div className="p-3.5 rounded-md bg-white/70 border border-zinc-300/80 text-[11px] text-zinc-700 leading-relaxed font-medium">
                  {bot.chapterText}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/arena/${bot.id}`}
                className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-md bg-orange-600 text-white hover:bg-orange-500 text-[11px] font-mono font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
              >
                <span>CHALLENGE {bot.name}</span>
                <ChevronRight className="w-4 h-4 opacity-80" />
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] font-mono tracking-widest uppercase text-zinc-500 z-10">
        EyeBattle Engine &bull; Optical Warfare Module v2.6.0
      </footer>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex flex-col justify-between py-10 px-6 pointer-events-none opacity-[0.22] z-0 select-none overflow-hidden">
        <span className="text-[160px] xl:text-[210px] font-black tracking-tighter text-white leading-none pl-4 uppercase">
          EYE
        </span>
        <span className="text-[160px] xl:text-[210px] font-black tracking-tighter text-white leading-none text-right pr-4 uppercase">
          BATTLE
        </span>
      </div>
    </div>
  );
}