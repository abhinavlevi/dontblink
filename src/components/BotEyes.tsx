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

  // FIX: Typed explicitly as Transition with "as const" for type safety
  const springConfig: Transition = {
    type: "spring" as const,
    stiffness: 240,
    damping: 20,
  };

  switch (type) {
    // Single Big Eye (Cyclops style) - MONOLITH
    case "cyclops":
      return (
        <div className={`p-6 rounded-lg border transition-all duration-300 ${containerBg}`}>
          <motion.div
            className="relative w-28 h-28 rounded-md bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-14 h-14 rounded-md bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_#10b981]"
              animate={{ x: pupilPos.x * 1.2, y: pupilPos.y * 1.2 }}
              transition={springConfig}
            >
              <div className="w-5 h-10 rounded-sm bg-black flex items-center justify-center">
                <div className="w-1.5 h-3 rounded-sm bg-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      );

    // 3 Devil Eyes - KRONOS
    case "devil":
      return (
        <div className={`flex flex-col items-center gap-2 p-5 rounded-lg border transition-all duration-300 ${containerBg} shadow-[0_0_30px_rgba(225,29,72,0.2)]`}>
          {/* Top Center Third Eye */}
          <motion.div
            className="relative w-11 h-11 rounded-md bg-rose-950 border-2 border-rose-500 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(244,63,94,0.3)]"
            animate={{ scaleY: isBlinking ? 0.05 : 1 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              className="w-4 h-4 rounded-sm bg-rose-500 flex items-center justify-center shadow-[0_0_10px_#f43f5e]"
              animate={{ x: pupilPos.x * 0.6, y: pupilPos.y * 0.6 }}
              transition={springConfig}
            >
              <div className="w-1 h-3 bg-black rounded-sm" />
            </motion.div>
          </motion.div>

          {/* Bottom Pair */}
          <div className="flex gap-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="relative w-14 h-14 rounded-md bg-rose-950 border-2 border-rose-500 flex items-center justify-center overflow-hidden"
                animate={{ scaleY: isBlinking ? 0.05 : 1 }}
                transition={{ duration: 0.08 }}
              >
                <motion.div
                  className="w-6 h-6 rounded-sm bg-rose-600 flex items-center justify-center shadow-[0_0_12px_#e11d48]"
                  animate={{ x: pupilPos.x * 0.8, y: pupilPos.y * 0.8 }}
                  transition={springConfig}
                >
                  <div className="w-1.5 h-4 bg-black rounded-sm" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    // 4 Eye Grid Array - QUADRA
    case "argus":
      return (
        <div className={`grid grid-cols-2 gap-3 p-5 rounded-lg border transition-all duration-300 ${containerBg} shadow-[0_0_30px_rgba(14,165,233,0.2)]`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="relative w-14 h-14 rounded-md bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center overflow-hidden"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-6 h-6 rounded-sm bg-cyan-400 flex items-center justify-center shadow-[0_0_10px_#22d3ee]"
                animate={{ x: pupilPos.x * 0.7, y: pupilPos.y * 0.7 }}
                transition={springConfig}
              >
                <div className="w-2 h-2 rounded-sm bg-zinc-950" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // VEX-01: Glitch / Prototype Eye
    case "happy":
      return (
        <div className={`flex gap-5 p-5 rounded-lg border transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-16 h-16 rounded-md bg-amber-500/10 flex items-center justify-center overflow-hidden border-2 border-orange-500 shadow-md"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-7 h-7 rounded-sm bg-orange-600 flex items-center justify-center relative shadow-inner"
                animate={{ x: pupilPos.x, y: pupilPos.y }}
                transition={springConfig}
              >
                <div className="w-2 h-2 rounded-sm bg-white absolute top-1 left-1" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );

    // Retro Pixel Eye - CRT-89
    case "pixel":
      return (
        <div className={`flex gap-5 p-5 border-2 border-fuchsia-500 rounded-lg transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-16 h-16 bg-fuchsia-500 border-2 border-black flex items-center justify-center overflow-hidden rounded-sm"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-6 h-6 bg-black border border-white rounded-none"
                animate={{ x: pupilPos.x * 0.6, y: pupilPos.y * 0.6 }}
                transition={{ type: "just" }}
              />
            </motion.div>
          ))}
        </div>
      );

    // Cosmic Void Eye - NULL VOID
    case "cosmic":
    default:
      return (
        <div className={`flex gap-5 p-5 rounded-lg border transition-all duration-300 ${containerBg}`}>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="relative w-16 h-16 rounded-md bg-gradient-to-tr from-purple-950 via-indigo-950 to-black p-1 flex items-center justify-center overflow-hidden border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.08 }}
            >
              <motion.div
                className="w-8 h-8 rounded-sm bg-purple-500/30 border border-purple-300 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_#c084fc]"
                animate={{ x: pupilPos.x, y: pupilPos.y }}
                transition={springConfig}
              >
                <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-[0_0_10px_#fff]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      );
  }
};