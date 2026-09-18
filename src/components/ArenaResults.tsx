"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BotEyes } from "@/components/BotEyes";
import {
  Trophy,
  Award,
  RefreshCw,
  Crown,
  Zap,
  Users,
  CheckCircle2,
  Skull,
  ShieldAlert,
  Flame,
  AlertTriangle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BotProfile } from "@/data/bots";

interface ResultProps {
  bot: BotProfile;
  time: number;
  highScore: number;
  isNewRecord: boolean;
  lossReason: string;
  pupilPos: { x: number; y: number };
  onRematch: () => void;
  onSelectBot: () => void;
}

export function VictoryState({
  bot,
  time,
  isNewRecord,
  pupilPos,
  onRematch,
  onSelectBot,
}: ResultProps) {
  useEffect(() => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10b981", "#34d399", "#f59e0b", "#10b981"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10b981", "#34d399", "#f59e0b", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="space-y-3 sm:space-y-4 font-mono select-none"
    >
      {/* HERO VICTORY BANNER */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-2.5 sm:p-3.5 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.25)_0%,transparent_70%)]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 fill-emerald-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  BIG DUB
                </span>
                {isNewRecord && (
                  <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-amber-300 uppercase bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/50 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> NEW BEST TIME!
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl xl:text-2xl font-black text-white tracking-tight uppercase leading-none pt-1 drop-shadow-sm">
                YOU COOKED {bot.name}!
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0">
            <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest">
              BOT STATUS
            </span>
            <span className="text-xs font-black text-emerald-100 uppercase bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-400/60 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              FOLDED
            </span>
          </div>
        </div>
      </div>

      {/* DEFEATED BOT EYES STAGE */}
      <div className="py-4 sm:py-6 px-3 sm:px-4 flex flex-col justify-center items-center bg-[#121215] rounded-xl border-2 border-emerald-500/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />

        <div className="absolute top-2 left-2 z-20">
          <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/90 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
            <Skull className="w-3 h-3 text-emerald-400" /> BOT EYES BLINKED
          </span>
        </div>

        <div className="z-10 scale-90 sm:scale-100 transition-transform duration-300">
          <BotEyes
            type={bot.eyeType}
            isBlinking={true}
            pupilPos={pupilPos}
            theme="dark"
          />
        </div>

        <span className="z-10 mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-emerald-300 font-extrabold uppercase tracking-widest bg-emerald-950/90 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-emerald-500/50 shadow-md">
          {bot.name} BLINKED AT {time.toFixed(2)}s
        </span>
      </div>

      {/* SCORECARD */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8 p-2.5 sm:p-3 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-900/10 border border-emerald-500/40 rounded-lg space-y-0.5 shadow-sm">
          <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-emerald-800 uppercase block">
            STARE TIME
          </span>
          <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-emerald-950 tracking-tight flex items-center gap-1.5 font-mono">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 fill-emerald-600 animate-pulse" />
            <span>{time.toFixed(2)}s</span>
          </div>
        </div>

        <div className="col-span-4 p-2.5 sm:p-3 bg-white/90 border border-zinc-300 rounded-lg flex flex-col justify-center items-center text-center shadow-sm">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">
            RESULT
          </span>
          <span className="text-xs sm:text-sm font-black text-emerald-600 uppercase font-mono">
            AURA +1000
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-2 pt-0.5 sm:pt-1">
        <button
          onClick={onSelectBot}
          className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-black text-[11px] sm:text-xs bg-white text-zinc-900 hover:bg-zinc-100 border-2 border-zinc-300 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-[0.98] uppercase tracking-wider"
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />
          <span>ROSTER</span>
        </button>
        <button
          onClick={onRematch}
          className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-black text-[11px] sm:text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-emerald-500/25 active:scale-[0.98] uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>RUN IT BACK</span>
        </button>
      </div>
    </motion.div>
  );
}

export function DefeatState({
  bot,
  time,
  highScore,
  isNewRecord,
  lossReason,
  pupilPos,
  onRematch,
  onSelectBot,
}: ResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="space-y-3 sm:space-y-4 font-mono select-none"
    >
      {/* HERO DEFEAT BANNER */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-rose-950 via-rose-900 to-zinc-900 p-2.5 sm:p-3.5 border-2 border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.3)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.25)_0%,transparent_70%)]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-rose-300 uppercase bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-500/50">
                  YOU GOT COOKED
                </span>
                {isNewRecord && (
                  <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-amber-300 uppercase bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/50 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> NEW BEST TIME!
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl xl:text-2xl font-black text-white tracking-tight uppercase leading-none pt-1 drop-shadow-sm">
                YOU BLINKED FIRST!
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* BOT EYES STAGE */}
      <div className="py-4 sm:py-6 px-3 sm:px-4 flex flex-col justify-center items-center bg-[#121215] rounded-xl border-2 border-rose-600/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.18)_0%,transparent_70%)]" />

        <div className="absolute top-2 left-2 z-20">
          <span className="text-[8px] sm:text-[9px] font-bold text-rose-400 uppercase tracking-wider bg-rose-950/90 px-1.5 sm:px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />{" "}
            {bot.name} DIDN'T EVEN FLINCH
          </span>
        </div>

        <div className="z-10 scale-90 sm:scale-100 transition-transform duration-300">
          <BotEyes
            type={bot.eyeType}
            isBlinking={false}
            pupilPos={pupilPos}
            theme="dark"
          />
        </div>

        <span className="z-10 mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-rose-300 font-extrabold uppercase tracking-widest bg-rose-950/90 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-rose-500/50 shadow-md">
          SURVIVED FOR {time.toFixed(2)}s
        </span>
      </div>

      {/* REASON BREAKDOWN CARD */}
      <div className="p-3 sm:p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-1.5 sm:space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-rose-900 font-extrabold text-[10px] sm:text-xs uppercase">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
          <span>
            {lossReason || "You blinked!"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-rose-500/20 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-bold text-zinc-700">
            <span>YOUR TIME:</span>
            <span className="text-rose-600 font-black text-xs sm:text-sm font-mono">
              {time.toFixed(2)}s
            </span>
          </div>

          <div className="flex items-center gap-1 font-bold text-zinc-600">
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            <span>BEST: {highScore.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-2 pt-0.5 sm:pt-1">
        <button
          onClick={onSelectBot}
          className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-black text-[11px] sm:text-xs bg-white text-zinc-900 hover:bg-zinc-100 border-2 border-zinc-300 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-[0.98] uppercase tracking-wider"
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />
          <span>ROSTER</span>
        </button>
        <button
          onClick={onRematch}
          className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-black text-[11px] sm:text-xs bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-orange-500/25 active:scale-[0.98] uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    </motion.div>
  );
}