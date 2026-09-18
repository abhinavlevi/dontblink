"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BOTS } from "@/data/bots";
import { Navigation } from "@/components/Navigation";
import { BotEyes } from "@/components/BotEyes";
import { ChevronRight, Flame, Cpu, Eye, Zap, Crosshair } from "lucide-react";

export default function StoryPage() {
  return (
    <div className="min-h-dvh w-full bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-between relative z-10 py-2 sm:py-4">
        {/* TOP HEADER GRID */}
        <div className="grid grid-cols-12 items-start pt-2 mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="col-span-12 md:col-span-8 space-y-1 sm:space-y-2 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                THE LORE & ROSTER
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3 h-3 text-orange-600" />
                OPTICAL SENTINEL INTEL
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              MEET THE BOTS <br />
              <span className="text-orange-600">DON'T BLINK FIRST</span>
            </h1>
          </div>
        </div>

        {/* GAMEPLAY OVERVIEW BANNER */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 text-white border border-zinc-800 font-mono shadow-xl relative overflow-hidden z-20">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase mb-1">
            <Eye className="w-4 h-4" />
            <span>HOW THIS WORKS (NO FLUFF)</span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 font-sans font-medium leading-relaxed max-w-3xl">
            You're locked in a face-to-face optical staring contest against AI bots. 
            Your camera tracks your face in real-time. If you blink, twitch your eyelids, or look away—you lose. 
            Use <span className="text-orange-400 font-mono font-bold">Spacebar</span> or tap the bot eyes to trigger a distraction cheat, but watch out for their EMP counter-jams and strobe flashbangs.
          </p>
        </div>

        {/* BOT DOSSIER GRID (Responsive 1/2/3 Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-20">
          {BOTS.map((bot, index) => (
            <motion.article
              key={bot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="p-4 sm:p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl space-y-4 flex flex-col justify-between hover:border-orange-500/60 transition-all group"
            >
              <div className="space-y-3">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px]">
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-200/90 border border-zinc-300 font-bold text-zinc-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-600" />
                    LVL: {bot.difficulty}
                  </span>
                  <span className="text-zinc-600 font-bold tracking-wider">
                    BLINK TIMER: {(bot.minBlinkMs / 1000).toFixed(0)}s -{" "}
                    {(bot.maxBlinkMs / 1000).toFixed(0)}s
                  </span>
                </div>

                {/* Interactive Bot Preview Stage */}
                <div className="py-4 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 shadow-inner relative overflow-hidden group-hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08)_0%,transparent_75%)]" />
                  <div className="scale-75 sm:scale-85 transform transition-transform group-hover:scale-95 duration-200">
                    <BotEyes
                      type={bot.eyeType}
                      isBlinking={false}
                      pupilPos={{ x: 0, y: 0 }}
                      theme="dark"
                    />
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-0.5">
                  <h2 className="text-lg sm:text-xl font-black text-zinc-900 uppercase tracking-tight">
                    {bot.name}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-bold text-orange-600 tracking-wide uppercase">
                    {bot.tagline}
                  </p>
                </div>

                {/* Lore & Threat Level Summary */}
                <div className="p-3 sm:p-3.5 rounded-md bg-white/80 border border-zinc-300/80 text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed font-medium space-y-2">
                  <p className="text-zinc-900 font-sans">
                    {bot.chapterText}
                  </p>
                  <div className="pt-2 border-t border-zinc-300/60 font-mono text-[9px] text-zinc-500 uppercase flex items-center justify-between">
                    <span>STARE STAMINA: HIGH</span>
                    <span className="text-orange-600 font-bold flex items-center gap-1">
                      <Crosshair className="w-3 h-3" /> NO BLINK
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Challenge CTA Button */}
              <Link
                href={`/arena/${bot.id}`}
                className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-md bg-orange-600 text-white hover:bg-orange-500 text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] group-hover:shadow-md"
              >
                <span>CHALLENGE {bot.name}</span>
                <ChevronRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 sm:py-4 text-center text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-500 z-10">
        EyeBattle Engine &bull; Optical Warfare Module v2.6.0
      </footer>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex flex-col justify-between py-10 px-6 pointer-events-none opacity-[0.22] z-0 select-none overflow-hidden">
        <span className="text-[100px] sm:text-[160px] xl:text-[210px] font-black tracking-tighter text-white leading-none pl-2 sm:pl-4 uppercase">
          EYE
        </span>
        <span className="text-[100px] sm:text-[160px] xl:text-[210px] font-black tracking-tighter text-white leading-none text-right pr-2 sm:pr-4 uppercase">
          BATTLE
        </span>
      </div>
    </div>
  );
}