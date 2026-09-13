"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, RefreshCw, Share2, Flame, Trophy, Zap } from "lucide-react";
import confetti from "canvas-confetti";

export default function StaringContest() {
  const [gameState, setGameState] = useState<"idle" | "holding" | "lost">("idle");
  const [time, setTime] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [lossReason, setLossReason] = useState<string>("");
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const failTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("staring_high_score");
    if (saved) setHighScore(parseFloat(saved));
  }, []);

  const startHolding = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default scroll behavior on touch devices
    if (e.type === "touchstart") e.preventDefault();
    if (gameState === "holding" || gameState === "lost") return;

    setGameState("holding");
    setTime(0);
    setIsNewRecord(false);
    startTimeRef.current = performance.now();

    const updateTimer = () => {
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      setTime(elapsed);
      animFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);

    // Dynamic fake blink trigger: shrinks maximum survival window each round
    const minTime = Math.max(0.8, 6 - round * 0.8);
    const maxTime = Math.max(2.5, 12 - round * 1.2);
    const randomFailDelay = (Math.random() * (maxTime - minTime) + minTime) * 1000;

    failTimeoutRef.current = setTimeout(() => {
      triggerLoss("YOU BLINKED! Micro-eye twitch detected.");
    }, randomFailDelay);
  };

  const stopHolding = () => {
    if (gameState === "holding") {
      triggerLoss("YOU LET GO! Keep your finger firmly pressed!");
    }
  };

  const triggerLoss = (reason: string) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (failTimeoutRef.current) clearTimeout(failTimeoutRef.current);

    setGameState("lost");
    setLossReason(reason);

    const finalTime = (performance.now() - startTimeRef.current) / 1000;
    setTime(finalTime);

    if (finalTime > highScore) {
      setHighScore(finalTime);
      setIsNewRecord(true);
      localStorage.setItem("staring_high_score", finalTime.toString());
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetGame = () => {
    setGameState("idle");
    setTime(0);
    setIsNewRecord(false);
    setRound((r) => r + 1);
  };

  const shareScore = () => {
    const text = `I survived ${time.toFixed(2)}s in the Staring Contest (Round ${round})! Can you beat me? 👁️🔥`;
    if (navigator.share) {
      navigator.share({ title: "Staring Contest", text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-6 select-none transition-colors duration-150 overflow-hidden cursor-pointer ${
        gameState === "lost"
          ? "bg-red-600 text-white"
          : gameState === "holding"
          ? "bg-zinc-950 text-red-500"
          : "bg-black text-white"
      }`}
      onMouseDown={startHolding}
      onMouseUp={stopHolding}
      onTouchStart={startHolding}
      onTouchEnd={stopHolding}
    >
      {/* Background Visual Effects during hold */}
      {gameState === "holding" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-transparent to-transparent pointer-events-none animate-pulse" />
      )}

      {/* Header Info */}
      <header className="w-full max-w-md flex justify-between items-center z-10 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase opacity-80 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
          <Flame className="w-4 h-4 text-orange-500" /> Round {round}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase opacity-80 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
          <Trophy className="w-4 h-4 text-yellow-500" /> Best: {highScore.toFixed(2)}s
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="inline-block p-5 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl"
              >
                <Eye className="w-16 h-16 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                  Don't Blink.
                </h1>
                <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xs mx-auto">
                  Hold your finger on the screen. Do not close your eyes. Do not let go.
                </p>
              </div>
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm tracking-wide uppercase animate-bounce">
                  <Zap className="w-4 h-4 fill-current" /> Press & Hold Anywhere
                </span>
              </div>
            </motion.div>
          )}

          {gameState === "holding" && (
            <motion.div
              key="holding"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <EyeOff className="w-14 h-14 mx-auto animate-pulse text-red-500" />
              <div className="text-7xl md:text-8xl font-mono font-black tracking-tighter">
                {time.toFixed(2)}
                <span className="text-2xl font-sans ml-1 text-red-400">s</span>
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-red-500/80 font-bold animate-pulse">
                STARE AT THE CENTER
              </p>
            </motion.div>
          )}

          {gameState === "lost" && (
            <motion.div
              key="lost"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1.15, 1], opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="space-y-5"
            >
              {isNewRecord && (
                <span className="inline-block px-3 py-1 bg-yellow-400 text-black font-extrabold text-xs tracking-widest uppercase rounded-full">
                  🎉 New Best Record!
                </span>
              )}
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic">
                YOU LOST.
              </h1>
              <div className="text-5xl font-mono font-black">
                {time.toFixed(2)}s
              </div>
              <p className="text-sm font-semibold opacity-90 max-w-xs mx-auto">
                {lossReason}
              </p>

              <div className="flex gap-3 justify-center pt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareScore();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-zinc-900 transition-transform active:scale-95 shadow-lg text-sm border border-zinc-800"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="z-10 pb-4 text-xs font-mono tracking-widest uppercase text-zinc-600 font-medium">
        {gameState === "holding" ? "RELEASE = INSTANT LOSS" : "STRICT OPHTHALMIC ALGORITHM v1.0"}
      </footer>
    </div>
  );
}