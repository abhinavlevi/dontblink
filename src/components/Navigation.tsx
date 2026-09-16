"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Menu,
  X,
  Trophy,
  Shield,
  Eye,
  Camera,
  Users,
  BookOpen,
  Zap,
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  return (
    <>
      <header className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-8 pt-5 pb-2 z-40">
        
        {/* Left Brand Identifier */}
        {isHome ? (
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white/70 border border-zinc-300 backdrop-blur-md shadow-sm hover:bg-white transition-all"
            >
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <span className="bg-orange-600 rounded-[1px]"></span>
                <span className="bg-orange-600 rounded-[1px]"></span>
                <span className="bg-orange-600 rounded-[1px]"></span>
                <span className="bg-orange-600 rounded-[1px]"></span>
              </div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-900 font-extrabold">
                EyeBattle
              </span>
            </Link>
          </div>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-md bg-white/70 border border-zinc-300 hover:bg-white transition-all text-zinc-800 shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-orange-600" /> Back to Arena
          </Link>
        )}

        {/* Center Live Tracker Status Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1 rounded-md bg-white/60 border border-zinc-300 text-[10px] font-mono text-zinc-700 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Camera className="w-3 h-3 text-orange-600" />
            OPTICAL SENSOR READY
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-800 font-bold uppercase">Eye Tracker v2.6</span>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2">
          
          {/* HIGHLY VISIBLE "LORE / STORY" BUTTON */}
          <button
            onClick={() => setStoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono font-extrabold tracking-wider uppercase rounded-md bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900 transition-all shadow-md active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>Story & Lore</span>
          </button>

          <Link
            href="/pvp"
            className={`px-3.5 py-1.5 text-[11px] font-mono font-bold tracking-wider uppercase rounded-md border transition-all shadow-sm ${
              pathname === "/pvp"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white/70 border-zinc-300 text-zinc-800 hover:bg-white"
            }`}
          >
            1v1 Arena
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-1.5 rounded-md bg-white/70 border border-zinc-300 text-zinc-800 hover:bg-white transition-all active:scale-95 shadow-sm"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-zinc-900" />
            ) : (
              <Menu className="w-4 h-4 text-zinc-900" />
            )}
          </button>
        </div>
      </header>

      {/* STORY & LORE MODAL */}
      <AnimatePresence>
        {storyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-[#dcdce2] border border-zinc-300 rounded-xl p-6 shadow-2xl relative space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-300 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-zinc-900">
                    The EyeBattle Chronicle
                  </span>
                </div>
                <button
                  onClick={() => setStoryModalOpen(false)}
                  className="p-1 rounded-md bg-white/70 border border-zinc-300 text-zinc-700 hover:bg-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story Content */}
              <div className="space-y-3 text-zinc-700 font-sans text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <p className="font-bold text-zinc-900">
                  In 2026, humanity entered the era of Optical Warfare.
                </p>
                <p>
                  As AI ocular units reached hyper-real shutter speeds, traditional digital battles evolved into a raw test of biological vs. synthetic endurance: <strong className="text-zinc-900">The EyeBattle Arena</strong>.
                </p>
                <p>
                  Competitors align their optical gaze against a roster of six autonomous sentinels—ranging from uncalibrated prototype units like <strong className="text-orange-600">VEX-01</strong> to infinite deep-space sentinels like <strong className="text-orange-600">NULL VOID</strong>.
                </p>
                <div className="p-3 bg-white/70 border border-zinc-300 rounded-md space-y-1 font-mono text-[10px]">
                  <span className="font-bold text-zinc-900 block uppercase">Arena Rule #1:</span>
                  <span>Keep your pupils locked on the focal sensor. The first entity to trigger an eyelid micro-twitch forfeits the match.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  ARCHIVE REF: OPT-2026-STORY
                </span>
                <button
                  onClick={() => setStoryModalOpen(false)}
                  className="px-4 py-1.5 rounded-md bg-orange-600 text-white font-mono font-bold text-[10px] uppercase shadow-sm hover:bg-orange-500 transition-all"
                >
                  Close Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-4 top-16 z-50 p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-2xl max-w-sm mx-auto space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-300/80 pb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                Game Navigation
              </span>
              <span className="text-[10px] font-mono text-emerald-600 uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setStoryModalOpen(true);
                }}
                className="p-2.5 rounded-md flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider bg-zinc-900 text-white"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                  Read Game Lore
                </span>
                <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-60" />
              </button>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-md flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                  pathname === "/"
                    ? "bg-orange-600 text-white"
                    : "bg-white/60 text-zinc-700 hover:bg-white border border-zinc-300/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Bot Challenge
                </span>
                <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-60" />
              </Link>

              <Link
                href="/pvp"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-md flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                  pathname === "/pvp"
                    ? "bg-orange-600 text-white"
                    : "bg-white/60 text-zinc-700 hover:bg-white border border-zinc-300/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  1v1 Player Duel
                </span>
                <Shield className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-md flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                  pathname === "/leaderboard"
                    ? "bg-orange-600 text-white"
                    : "bg-white/60 text-zinc-700 hover:bg-white border border-zinc-300/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Global Leaderboard
                </span>
                <Zap className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </nav>

            <div className="pt-2 border-t border-zinc-300/80 flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase">
              <span>EyeBattle Engine v2.6.0</span>
              <span className="text-zinc-700 font-bold">Optical Module</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}