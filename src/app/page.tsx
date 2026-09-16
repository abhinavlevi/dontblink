"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BOTS } from "@/data/bots";
import { BotEyes } from "@/components/BotEyes";
import { Navigation } from "@/components/Navigation";
import {
  Play,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Shield,
  Users,
  Eye,
  Camera,
  Flame,
  Zap,
  BookOpen,
  X,
} from "lucide-react";

export default function HomePage() {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [selectedBotId, setSelectedBotId] = useState<string>(BOTS[0]?.id || "");
  const [highScore, setHighScore] = useState<string>("0.00");
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  const activeBotIndex = BOTS.findIndex((b) => b.id === selectedBotId);
  const selectedBot = BOTS[activeBotIndex] || BOTS[0];

  // Pupil movement tracks mouse cursor to simulate real-time opponent eye movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setPupilPos({
        x: Math.max(-18, Math.min(18, deltaX * 18)),
        y: Math.max(-18, Math.min(18, deltaY * 18)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch best record for selected bot from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const score = localStorage.getItem(`staring_high_score_${selectedBot.id}`) || "0";
      setHighScore(parseFloat(score).toFixed(2));
    }
  }, [selectedBot.id]);

  const handlePrev = () => {
    const nextIndex = (activeBotIndex - 1 + BOTS.length) % BOTS.length;
    setSelectedBotId(BOTS[nextIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (activeBotIndex + 1) % BOTS.length;
    setSelectedBotId(BOTS[nextIndex].id);
  };

  return (
    <div className="h-screen w-screen bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white overflow-hidden font-sans select-none relative">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <Navigation />

      {/* 2. MAIN ARENA HERO */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 flex flex-col justify-between relative z-10 py-2">
        
        {/* Top Header Grid */}
        <div className="grid grid-cols-12 items-start pt-2">
          
          {/* Left Game Headline */}
          <div className="col-span-12 lg:col-span-5 space-y-2 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider">
                STAGE [{activeBotIndex + 1}/{BOTS.length}]
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                Optical Warfare Arena
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              THE ULTIMATE <br />
              <span className="text-orange-600">DON'T BLINK</span> <br />
              CHALLENGE
            </h1>
          </div>

          {/* Right Selected Opponent Stat & Story Trigger */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 text-right space-y-2 z-20 self-start pt-1">
            <div className="text-3xl xl:text-4xl font-black text-zinc-900 flex items-center justify-end gap-1.5 tracking-tight font-mono">
              <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
              <span>{highScore}s</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <p className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
                BEST TIME &bull; {selectedBot.name}
              </p>
              <button
                onClick={() => setStoryModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[9px] font-mono font-bold uppercase flex items-center gap-1 hover:bg-zinc-800 transition-all shadow-sm"
              >
                <BookOpen className="w-3 h-3 text-orange-500" />
                Read Story
              </button>
            </div>
          </div>
        </div>

        {/* CENTER CONSOLE: BOT SELECTOR & RETRO DISPLAY */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="pointer-events-auto w-full max-w-lg relative">
            
            {/* Carousel Navigation Buttons */}
            <div className="absolute -top-9 right-0 flex items-center gap-1 z-30">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-md border border-zinc-400/60 bg-white/80 text-zinc-700 hover:bg-white transition-all shadow-sm active:scale-95"
                aria-label="Previous Bot"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-md border border-zinc-400/60 bg-white/80 text-zinc-700 hover:bg-white transition-all shadow-sm active:scale-95"
                aria-label="Next Bot"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Retro Monitor Console */}
            <div className="p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBot.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Bot Switcher Tabs */}
                  <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {BOTS.map((bot) => {
                      const isSelected = bot.id === selectedBotId;
                      return (
                        <button
                          key={bot.id}
                          onClick={() => setSelectedBotId(bot.id)}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-orange-600 text-white shadow-sm"
                              : "bg-white/70 text-zinc-700 border border-zinc-300/60 hover:bg-white"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white animate-ping" : "bg-zinc-400"
                            }`}
                          />
                          {bot.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bot Level & High Score Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 px-0.5">
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-200/90 border border-zinc-300 font-bold text-zinc-800 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-600" />
                      DIFFICULTY: {selectedBot.difficulty}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-zinc-800">
                      <Trophy className="w-3 h-3 text-orange-500" />
                      RECORD: {highScore}s
                    </span>
                  </div>

                  {/* Interactive Eye Display Frame */}
                  <div className="py-8 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[150px] shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                    <BotEyes
                      type={selectedBot.eyeType}
                      isBlinking={false}
                      pupilPos={pupilPos}
                      theme="dark"
                    />
                  </div>

                  {/* Selected Bot Details */}
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase flex items-center gap-2">
                      <span>{selectedBot.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500 font-normal">
                        [BOT #{activeBotIndex + 1}]
                      </span>
                    </h2>
                    <p className="text-[11px] text-zinc-600 font-medium leading-normal">
                      {selectedBot.tagline}
                    </p>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/arena/${selectedBot.id}`}
                      className="py-2.5 px-4 rounded-md font-bold text-[11px] bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-between shadow-sm active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        START BOT DUEL
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                    </Link>

                    <Link
                      href="/pvp"
                      className="py-2.5 px-4 rounded-md font-bold text-[11px] bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300 transition-all flex items-center justify-between shadow-sm active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-orange-600" />
                        1v1 REAL PLAYER
                      </span>
                      <Shield className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Feature Callouts */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <div className="p-2 rounded-md bg-[#b8b8be]/40 hover:bg-white border border-zinc-400/40 text-zinc-700 flex flex-col items-center gap-1 cursor-default transition-all shadow-sm">
            <Camera className="w-4 h-4 text-orange-600" />
            <span className="text-[8px] font-mono font-bold uppercase text-center leading-tight">
              AI Face<br />Detection
            </span>
          </div>
          <div className="p-2 rounded-md bg-[#b8b8be]/40 hover:bg-white border border-zinc-400/40 text-zinc-700 flex flex-col items-center gap-1 cursor-default transition-all shadow-sm">
            <Eye className="w-4 h-4 text-orange-600" />
            <span className="text-[8px] font-mono font-bold uppercase text-center leading-tight">
              Realtime<br />Blink Detection
            </span>
          </div>
        </div>

        {/* Bottom Game Rules & Quick Actions */}
        <div className="w-full flex flex-col gap-4 z-20 pb-4">
          
          {/* Objective Statement */}
          <div className="self-end max-w-xs text-right">
            <p className="text-[11px] font-mono text-zinc-600 leading-relaxed uppercase">
              // Objective: Hold your gaze into the camera sensor. First to blink loses.
            </p>
          </div>

          {/* Rules & Action Bar */}
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-4">
            
            {/* Rules Summary */}
            <div className="space-y-3 max-w-md">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                  How To Play
                </span>
                <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">
                  Enable your camera, lock eyes with your opponent, and hold your blink as long as you can to set a new record time.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Link
                  href={`/arena/${selectedBot.id}`}
                  className="px-6 py-2.5 rounded-md bg-orange-600 text-white text-[11px] font-extrabold shadow-md hover:bg-orange-500 transition-all uppercase tracking-wider"
                >
                  Play vs Bot
                </Link>
                <button
                  onClick={() => setStoryModalOpen(true)}
                  className="px-6 py-2.5 rounded-md bg-[#b8b8be]/50 hover:bg-white text-zinc-800 text-[11px] font-extrabold transition-all border border-zinc-400/40 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                  Bot Backstory
                </button>
              </div>
            </div>

            {/* Scroll/Status Indicator */}
            <div className="flex flex-col items-center gap-1 text-zinc-500">
              <div className="w-4 h-6 rounded-md border border-zinc-500 flex items-start justify-center p-1">
                <div className="w-1 h-1.5 bg-orange-600 rounded-sm animate-bounce" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-tight uppercase">
                Select Opponent
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. STORY MODAL OVERLAY */}
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
              <div className="flex items-center justify-between border-b border-zinc-300 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-zinc-900">
                    {selectedBot.name} &bull; Origin Story
                  </span>
                </div>
                <button
                  onClick={() => setStoryModalOpen(false)}
                  className="p-1 rounded-md bg-white/70 border border-zinc-300 text-zinc-700 hover:bg-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-zinc-700 font-sans text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <p className="font-bold text-zinc-900 text-sm">
                  {selectedBot.tagline}
                </p>
                <p className="text-zinc-800">
                  {selectedBot.chapterText}
                </p>
                <div className="p-3 bg-white/70 border border-zinc-300 rounded-md space-y-1 font-mono text-[10px]">
                  <span className="font-bold text-zinc-900 block uppercase">Combat Telemetry:</span>
                  <span>Shutter Window: {selectedBot.minBlinkMs / 1000}s - {selectedBot.maxBlinkMs / 1000}s</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  ARCHIVE ID: {selectedBot.id.toUpperCase()}
                </span>
                <button
                  onClick={() => setStoryModalOpen(false)}
                  className="px-4 py-1.5 rounded-md bg-orange-600 text-white font-mono font-bold text-[10px] uppercase shadow-sm hover:bg-orange-500 transition-all"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. BACKGROUND TYPOGRAPHY WATERMARK */}
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