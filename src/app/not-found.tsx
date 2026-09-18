"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, ShieldAlert, Bot, Home } from "lucide-react";

export default function NotFound() {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  // Interactive Cursor Eye Mirroring for 404
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setPupilPos({
        x: Math.max(-16, Math.min(16, deltaX * 16)),
        y: Math.max(-16, Math.min(16, deltaY * 16)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-dvh w-full bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-between relative z-10 py-4 sm:py-6">
        
        {/* Header Banner */}
        <div className="grid grid-cols-12 items-start pt-2 gap-2 sm:gap-0">
          <div className="col-span-12 md:col-span-6 space-y-1 sm:space-y-2 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                ERROR 404
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                TARGET VECTOR MISSING
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              SIGNAL LOST <br />
              <span className="text-orange-600">SECTOR UNKNOWN</span>
            </h1>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8 text-left md:text-right space-y-0.5 sm:space-y-1 z-20 pt-1">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-zinc-900 flex items-center md:justify-end gap-1.5 tracking-tight font-mono">
              <ShieldAlert className="w-5 h-5 text-orange-600" />
              <span>OUT OF BOUNDS</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              OPTICAL FEED DISCONNECTED
            </p>
          </div>
        </div>

        {/* Center 404 Interactive Eye Console */}
        <div className="my-auto py-8 flex items-center justify-center z-20">
          <div className="w-full max-w-lg relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative space-y-5 font-mono"
            >
              {/* Card Header Status */}
              <div className="flex items-center justify-between text-[10px] border-b border-zinc-300 pb-3">
                <span className="uppercase tracking-wider px-2.5 py-1 rounded-sm bg-zinc-900 text-white font-bold flex items-center gap-1.5 shadow-sm">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                  STATUS: ROUTE NOT FOUND
                </span>
                <span className="font-bold text-zinc-600 uppercase">
                  ERROR CODE: 0x404
                </span>
              </div>

              {/* Interactive Eyes Display */}
              <div className="py-8 sm:py-10 flex flex-col justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[150px] shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.12)_0%,transparent_75%)]" />

                <div className="flex gap-4 z-10">
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-orange-600/10 flex items-center justify-center overflow-hidden border-2 border-orange-500 shadow-md"
                    >
                      <motion.div
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-orange-600 flex items-center justify-center relative shadow-inner"
                        animate={{ x: pupilPos.x, y: pupilPos.y }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <div className="w-2 h-2 rounded-sm bg-white absolute top-0.5 left-0.5" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <span className="z-10 mt-3 text-[10px] text-orange-400 font-bold uppercase tracking-widest bg-orange-950/80 px-2.5 py-0.5 rounded border border-orange-800/80">
                  SEARCHING FOR TARGET SIGNAL...
                </span>
              </div>

              {/* Message Details */}
              <div className="p-3 bg-white/80 border border-zinc-300 rounded-md space-y-1 text-center">
                <span className="text-[10px] font-bold text-zinc-900 uppercase block">
                  YOU WANDERED OFF THE ARENA GRID
                </span>
                <p className="text-[10px] text-zinc-600 font-sans leading-normal">
                  The requested URL does not exist or has been recalibrated. Return to the main roster to engage a bot.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/"
                  className="py-2.5 px-3 rounded-md font-extrabold text-[11px] bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-300 transition-all flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
                >
                  <Bot className="w-3.5 h-3.5 text-zinc-600" />
                  <span>BOT ROSTER</span>
                </Link>

                <Link
                  href="/"
                  className="py-2.5 px-3 rounded-md font-extrabold text-[11px] bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] uppercase tracking-wider"
                >
                  <Home className="w-3.5 h-3.5 fill-current" />
                  <span>RETURN HOME</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="w-full flex flex-col gap-4 z-20 pb-2 sm:pb-4">
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-3 sm:pt-4">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                Navigation Hint
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed font-medium">
                Move your cursor around the screen to test the optical tracking, or tap "Return Home" to start a battle.
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