"use client";

import React from "react";
import { motion, Transition } from "framer-motion";

export type EyeStyle =
  | "cute"
  | "sharp"
  | "cosmic"
  | "cyborg"
  | "anime"
  | "happy"
  | "glitch"
  | "pixel"
  | "hypno"
  | "glowing"
  | "devil"
  | "cyclops"
  | "argus";

interface EyeProps {
  type: EyeStyle;
  isBlinking: boolean;
  pupilPos: { x: number; y: number };
  theme?: "light" | "dark";
}

export const BotEyes: React.FC<EyeProps> = ({
  type,
  isBlinking,
  pupilPos,
  theme = "dark",
}) => {
  const containerBg =
    theme === "light"
      ? "bg-white/80 border-zinc-300 shadow-md"
      : "bg-zinc-900/90 border-zinc-800 shadow-xl";

  const springConfig: Transition = {
    type: "spring" as const,
    stiffness: 260,
    damping: 22,
  };

  switch (type) {
    // -------------------------------------------------------------
    // 1. CYCLOPS (Single Centered Heavy Lens - MONOLITH)
    // -------------------------------------------------------------
    case "cyclops":
      return (
        <div className={`p-4 sm:p-6 rounded-lg border transition-all duration-300 ${containerBg}`}>
          <motion.div
            className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-md bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-md bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_#10b981]"
              animate={{ x: pupilPos.x * 1.1, y: pupilPos.y * 1.1 }}
              transition={springConfig}
            >
              <div className="w-3 h-7 sm:w-5 sm:h-10 rounded-sm bg-black flex items-center justify-center">
                <div className="w-1 h-2.5 sm:w-1.5 sm:h-3 rounded-sm bg-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      );

    // -------------------------------------------------------------
    // 2. DEVIL (Triple Optical Array - CHRONOS-V)
    // -------------------------------------------------------------
    case "devil":
      return (
        <div className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg} shadow-[0_0_30px_rgba(225,29,72,0.2)]`}>
          <motion.div
            className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-md bg-rose-950 border-2 border-rose-500 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(244,63,94,0.3)]"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-rose-500 flex items-center justify-center shadow-[0_0_10px_#f43f5e]"
              animate={{ x: pupilPos.x * 0.6, y: pupilPos.y * 0.6 }}
              transition={springConfig}
            >
              <div className="w-1 h-2.5 sm:h-3 bg-black rounded-sm" />
            </motion.div>
          </motion.div>

          <div className="flex gap-2 sm:gap-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-md bg-rose-950 border-2 border-rose-500 flex items-center justify-center overflow-hidden"
                animate={{ scaleY: isBlinking ? 0.05 : 1 }}
                transition={{ duration: 0.08 }}
              >
                <motion.div
                  className="w-4 h-4 sm:w-6 sm:h-6 rounded-sm bg-rose-600 flex items-center justify-center shadow-[0_0_12px_#e11d48]"
                  animate={{ x: pupilPos.x * 0.8, y: pupilPos.y * 0.8 }}
                  transition={springConfig}
                >
                  <div className="w-1 sm:w-1.5 h-3 sm:h-4 bg-black rounded-sm" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 3. ARGUS (4-Quad Grid Sensors - PANOPTIC)
    // -------------------------------------------------------------
    case "argus":
      return (
        <div className={`grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg} shadow-[0_0_30px_rgba(14,165,233,0.2)]`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-md bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center overflow-hidden"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-4 h-4 sm:w-6 sm:h-6 rounded-sm bg-cyan-400 flex items-center justify-center shadow-[0_0_10px_#22d3ee]"
                animate={{ x: pupilPos.x * 0.7, y: pupilPos.y * 0.7 }}
                transition={springConfig}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-zinc-950" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // -------------------------------------------------------------
    // 4. HAPPY / VEX-01 (Playful Prototype Drone)
    // -------------------------------------------------------------
    case "happy":
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-amber-500/10 flex items-center justify-center overflow-hidden border-2 border-orange-500 shadow-md"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm bg-orange-600 flex items-center justify-center relative shadow-inner"
                animate={{ x: pupilPos.x, y: pupilPos.y }}
                transition={springConfig}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-white absolute top-0.5 left-0.5 sm:top-1 sm:left-1" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // -------------------------------------------------------------
    // 5. PIXEL / CRT-89 (Retro Arcade Mainframe)
    // -------------------------------------------------------------
    case "pixel":
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 border-2 border-fuchsia-500 rounded-lg transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-12 h-12 sm:w-16 sm:h-16 bg-fuchsia-500 border-2 border-black flex items-center justify-center overflow-hidden rounded-sm"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-4 h-4 sm:w-6 sm:h-6 bg-black border border-white rounded-none"
                animate={{ x: pupilPos.x * 0.6, y: pupilPos.y * 0.6 }}
                transition={{ type: "tween" }}
              />
            </motion.div>
          ))}
        </div>
      );

    // -------------------------------------------------------------
    // 6. CYBORG (Asymmetric Tactical Aperture)
    // -------------------------------------------------------------
    case "cyborg":
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg} shadow-[0_0_25px_rgba(234,179,8,0.2)]`}>
          <motion.div
            className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-zinc-950 border-2 border-yellow-500 flex items-center justify-center overflow-hidden"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_10px_#eab308]"
              animate={{ x: pupilPos.x, y: pupilPos.y }}
              transition={springConfig}
            >
              <div className="w-2 h-2 bg-black rounded-full" />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-zinc-950 border-2 border-rose-600 flex items-center justify-center overflow-hidden"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-6 h-1 sm:w-8 sm:h-1.5 bg-rose-600 shadow-[0_0_12px_#e11d48]"
              animate={{ x: pupilPos.x * 0.7, y: pupilPos.y * 0.7 }}
              transition={springConfig}
            />
          </motion.div>
        </div>
      );

    // -------------------------------------------------------------
    // 7. GLITCH (Intermittent Digital Distortion)
    // -------------------------------------------------------------
    case "glitch":
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg border-2 border-indigo-500/80 transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-12 h-12 sm:w-16 sm:h-16 bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center overflow-hidden rounded-sm"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-5 h-5 sm:w-7 sm:h-7 bg-indigo-400 border border-white flex items-center justify-center shadow-[0_0_10px_#818cf8]"
                animate={{ x: pupilPos.x + (i % 2 === 0 ? 1 : -1), y: pupilPos.y }}
                transition={springConfig}
              >
                <div className="w-1.5 h-1.5 bg-black" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // -------------------------------------------------------------
    // 8. HYPNO (Concentric Swirl / Target Aperture)
    // -------------------------------------------------------------
    case "hypno":
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-zinc-950 border-2 border-lime-400 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-lime-400 border-dashed flex items-center justify-center"
                animate={{ rotate: 360, x: pupilPos.x * 0.5, y: pupilPos.y * 0.5 }}
                transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" } }}
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // -------------------------------------------------------------
    // 9. CUTE / SHARP / GLOWING / ANIME / COSMIC (Default Fallback)
    // -------------------------------------------------------------
    case "cute":
    case "sharp":
    case "anime":
    case "glowing":
    case "cosmic":
    default:
      return (
        <div className={`flex gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg border transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-gradient-to-tr from-purple-950 via-indigo-950 to-black p-1 flex items-center justify-center overflow-hidden border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-sm bg-purple-500/30 border border-purple-300 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_#c084fc]"
                animate={{ x: pupilPos.x, y: pupilPos.y }}
                transition={springConfig}
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm bg-white shadow-[0_0_10px_#fff]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );
  }
};