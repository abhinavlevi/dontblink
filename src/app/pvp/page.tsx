"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { getGameStats, registerForGameBeta } from "@/lib/supabase";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Flame,
  Globe,
  Smile,
  Lock,
  AlertCircle,
  Swords,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";

const GAME_SLUG = "eyebattle-pvp";
const BASE_REQUEST_COUNT = 173;
const LOCAL_STORAGE_KEY = `upvoted_${GAME_SLUG}`;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function PvPPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadStats() {
      const dbCount = await getGameStats(GAME_SLUG);
      setTotalCount(BASE_REQUEST_COUNT + dbCount);
      setIsLoading(false);
    }
    loadStats();

    if (typeof window !== "undefined") {
      const hasUpvotedLocally = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (hasUpvotedLocally) {
        setSubmitted(true);
      }
    }
  }, []);

  const handleUpvoteAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage("Enter a real email bro, no cap.");
      return;
    }

    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      setSubmitted(true);
      setErrorMessage("You already voted from this device!");
      return;
    }

    setIsSubmitting(true);

    const result = await registerForGameBeta(GAME_SLUG, cleanEmail);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setTotalCount((prev) => (prev !== null ? prev + 1 : BASE_REQUEST_COUNT + 1));
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (result.reason === "already_voted") {
      setSubmitted(true);
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      setErrorMessage("This email is already on the list!");
    } else {
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-between relative z-10 py-2">
        
        {/* TOP HEADER GRID */}
        <div className="grid grid-cols-12 items-start pt-2 gap-2 sm:gap-0">
          <div className="col-span-12 md:col-span-6 space-y-1 sm:space-y-2 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                1V1 MULTIPLAYER
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                STARE DOWN YOUR FRIENDS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              CHALLENGE A FRIEND <br />
              <span className="text-orange-600">WHO BLINKS FIRST?</span>
            </h1>
          </div>

          {/* Stat Display */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 text-left md:text-right space-y-0.5 sm:space-y-1 z-20 pt-1">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-zinc-900 flex items-center md:justify-end gap-1.5 tracking-tight font-mono h-8 sm:h-10">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 fill-orange-600" />
              {isLoading || totalCount === null ? (
                <span className="w-16 h-6 sm:h-7 bg-zinc-400/30 rounded animate-pulse" />
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {totalCount}
                </motion.span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              PLAYERS READY FOR 1V1 DUELS
            </p>
          </div>
        </div>

        {/* CENTER CONSOLE CARD */}
        <div className="my-auto py-6 sm:py-8 flex items-center justify-center z-20">
          <div className="w-full max-w-lg relative">
            <div className="p-4 sm:p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative space-y-3 sm:space-y-4">
              
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono border-b border-zinc-300 pb-2 sm:pb-2.5">
                <span className="uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-900 text-white font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-orange-500" />
                  BUILDING IT NOW
                </span>
                <span className="font-bold text-zinc-700 hidden sm:inline">
                  DIRECT WEBCAM ROOM LINKS
                </span>
              </div>

              {/* Graphic Banner */}
              <div className="py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center justify-center bg-[#18181b] rounded-lg border border-zinc-800 text-center space-y-2 sm:space-y-3 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08)_0%,transparent_75%)]" />
                <div className="flex items-center gap-3 sm:gap-4 text-white z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500">VS</span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  </div>
                </div>

                <div className="z-10 space-y-0.5 max-w-xs">
                  <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                    SEND A LINK, START A STARE DOWN
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans font-medium leading-normal">
                    Generate a quick link, send it to your friend, and see who has the real unblinking aura.
                  </p>
                </div>
              </div>

              {/* Waitlist Form */}
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleUpvoteAndRegister}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-800 uppercase block">
                          Drop your email for early invite access
                        </label>
                        <span className="text-[8px] sm:text-[9px] font-mono text-orange-600 font-bold uppercase flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> 1 Vote / Person
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          required
                          placeholder="your.email@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 rounded-md bg-white border border-zinc-300 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 focus:outline-none focus:border-orange-600 transition-all shadow-sm disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2.5 sm:py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-[11px] uppercase rounded-md shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 shrink-0 disabled:opacity-50"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>{isSubmitting ? "Submitting..." : "Get Access"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {errorMessage && (
                        <p className="text-[10px] font-mono text-rose-600 flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-md text-emerald-900 flex flex-col gap-1 font-mono text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You're on the list!</span>
                    </div>
                    <span className="text-zinc-600 text-[10px]">
                      We'll drop an email in your inbox as soon as 1v1 room links go live.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-zinc-600">
                <span>VERIFIED COMMUNITY REQUESTS</span>
                <span className="font-bold text-zinc-800">NO SPAM GUARANTEED</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="w-full flex flex-col gap-4 z-20 pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-zinc-400/30 pt-3 sm:pt-4 gap-3 sm:gap-0">
            <div className="space-y-0.5 sm:space-y-1 max-w-md">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                Practice Mode Ready
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed font-medium">
                Train your optical lock against AI bots while we wrap up the 1v1 multiplayer release.
              </p>
            </div>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-md bg-orange-600 text-white text-[11px] font-extrabold shadow-md hover:bg-orange-500 transition-all uppercase tracking-wider text-center"
            >
              Play vs AI Bots
            </Link>
          </div>
        </div>
      </main>

      {/* BACKGROUND WATERMARK */}
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