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
  const [totalCount, setTotalCount] = useState<number | null>(null); // Start null to avoid flash
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch count & calculate total sum cleanly behind loading state
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
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      setSubmitted(true);
      setErrorMessage("You have already upvoted from this device.");
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
      setErrorMessage("This email has already been used to upvote!");
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white overflow-hidden font-sans select-none relative">
      <Navigation />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 flex flex-col justify-between relative z-10 py-2">
        <div className="grid grid-cols-12 items-start pt-2">
          <div className="col-span-12 lg:col-span-6 space-y-2 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider uppercase">
                EXPERIMENTAL FEATURE
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                Side Project Sandbox
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              CHALLENGE A FRIEND <br />
              <span className="text-orange-600">1V1 REALTIME STARE</span>
            </h1>
          </div>

          {/* Stat Display with Smooth Fade-in */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 text-right space-y-1 z-20 self-start pt-1">
            <div className="text-3xl xl:text-4xl font-black text-zinc-900 flex items-center justify-end gap-1.5 tracking-tight font-mono h-10">
              <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
              {isLoading || totalCount === null ? (
                <span className="w-16 h-7 bg-zinc-400/30 rounded animate-pulse" />
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
            <p className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              VERIFIED VOTES & WAITLIST REQUESTS
            </p>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="pointer-events-auto w-full max-w-lg relative">
            <div className="p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-300 pb-2.5">
                <span className="uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-900 text-white font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-orange-500" />
                  STATUS: IN DEVELOPMENT
                </span>
                <span className="font-bold text-zinc-600">
                  PEER-TO-PEER WEBCAM LINK
                </span>
              </div>

              <div className="py-6 px-4 flex flex-col items-center justify-center bg-[#18181b] rounded-lg border border-zinc-800 text-center space-y-3 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08)_0%,transparent_75%)]" />
                <div className="flex items-center gap-4 text-white z-10">
                  <div className="w-12 h-12 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Smile className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500">VS</span>
                  <div className="w-12 h-12 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-orange-500" />
                  </div>
                </div>

                <div className="z-10 space-y-0.5">
                  <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                    Shareable Room Links
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium max-w-xs leading-normal">
                    Generate a quick link, send it to a friend, and let the face trackers decide who blinks first.
                  </p>
                </div>
              </div>

              {/* Spam-Proof Form */}
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
                        <label className="text-[10px] font-mono font-bold text-zinc-800 uppercase block">
                          Enter Email To Upvote & Priority Access
                        </label>
                        <span className="text-[9px] font-mono text-orange-600 font-bold uppercase flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> 1 Vote / Email
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          placeholder="Your email address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 rounded-md bg-white border border-zinc-300 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 focus:outline-none focus:border-orange-600 transition-all shadow-sm disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-[11px] uppercase rounded-md shadow-sm transition-all flex items-center gap-1 active:scale-95 shrink-0 disabled:opacity-50"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>{isSubmitting ? "Verifying..." : "Upvote"}</span>
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
                      <span>Upvote Registered!</span>
                    </div>
                    {errorMessage ? (
                      <span className="text-zinc-600 text-[10px]">{errorMessage}</span>
                    ) : (
                      <span className="text-zinc-600 text-[10px]">
                        I'll send a notification as soon as 1v1 room links go live.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span>DATABASE VERIFIED VOTES</span>
                <span className="font-bold text-zinc-800">SPAM PROTECTED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 z-20 pb-4">
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-4">
            <div className="space-y-1 max-w-md">
              <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                Singleplayer Arena Available
              </span>
              <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">
                Try out your eye endurance against singleplayer sentinel bots in the meantime.
              </p>
            </div>

            <Link
              href="/"
              className="px-6 py-2.5 rounded-md bg-orange-600 text-white text-[11px] font-extrabold shadow-md hover:bg-orange-500 transition-all uppercase tracking-wider"
            >
              Play Singleplayer Bots
            </Link>
          </div>
        </div>
      </main>

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