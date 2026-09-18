"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import {
  Trophy,
  Lock,
  Flame,
  ArrowRight,
  Zap,
  Swords,
  Eye,
  ShieldAlert,
} from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="min-h-dvh w-full bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-between relative z-10 py-4 sm:py-6">
        {/* Header Grid */}
        <div className="grid grid-cols-12 items-start pt-2 gap-2 sm:gap-0">
          <div className="col-span-12 md:col-span-6 space-y-1 sm:space-y-2 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                HALL OF FAME
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                GLOBAL RANKINGS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              LEADERBOARD <br />
              <span className="text-orange-600">IN THE WORKS</span>
            </h1>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8 text-left md:text-right space-y-0.5 sm:space-y-1 z-20 pt-1">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-zinc-900 flex items-center md:justify-end gap-1.5 tracking-tight font-mono">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>PRE-SEASON</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              UNRANKED WARM-UP
            </p>
          </div>
        </div>

        {/* Center Console Card */}
        <div className="my-auto py-8 flex items-center justify-center z-20">
          <div className="w-full max-w-lg relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative space-y-5 font-mono"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] border-b border-zinc-300 pb-3">
                <span className="uppercase tracking-wider px-2.5 py-1 rounded-sm bg-zinc-900 text-white font-bold flex items-center gap-1.5 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-orange-500" />
                  STATUS: COMING SOON
                </span>
                <span className="font-bold text-zinc-700 flex items-center gap-1 uppercase">
                  <Swords className="w-3.5 h-3.5 text-orange-600" />
                  DROPPING WITH 1V1 MODE
                </span>
              </div>

              {/* Meme/Gameplay Graphic Card */}
              <div className="py-7 px-4 flex flex-col items-center justify-center bg-[#18181b] rounded-lg border border-zinc-800 text-center space-y-3 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.12)_0%,transparent_75%)]" />

                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-orange-500 shadow-md z-10">
                  <Eye className="w-6 h-6 stroke-[2.5]" />
                </div>

                <div className="z-10 space-y-1.5 max-w-xs">
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    WORK IN PROGRESS
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans font-medium leading-relaxed">
                    Global leaderboards are coming live alongside real-time 1v1 PvP. Get ready to prove you don't blink under pressure.
                  </p>
                </div>
              </div>

              {/* Clear Gameplay Cards */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-3 bg-white/80 border border-zinc-300 rounded-md space-y-1">
                  <span className="font-bold text-zinc-900 uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" /> SINGLEPLAYER
                  </span>
                  <p className="text-[10px] text-zinc-600 font-sans leading-normal">
                    Practice against bots like VEX-01 and MONOLITH. Best times are saved locally on your browser.
                  </p>
                </div>

                <div className="p-3 bg-white/80 border border-zinc-300 rounded-md space-y-1">
                  <span className="font-bold text-zinc-900 uppercase flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-orange-600" /> MULTIPLAYER
                  </span>
                  <p className="text-[10px] text-zinc-600 font-sans leading-normal">
                    Face off against real opponents in live stare-downs and fight for the top rank on the global ladder.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-zinc-300">
                <Link
                  href="/"
                  className="w-full py-3 rounded-md font-bold text-[11px] bg-orange-600 hover:bg-orange-500 text-white transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider active:scale-[0.98]"
                >
                  <span>PRACTICE VS BOTS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="w-full flex flex-col gap-4 z-20 pb-2 sm:pb-4">
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-3 sm:pt-4">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                Target Lock Status
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed font-medium">
                Lock in your gaze in singleplayer mode to train your optical sensors before 1v1 PvP launches.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Watermark Background */}
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