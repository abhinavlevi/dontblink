"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BOTS } from "@/data/bots";
import { BotEyes } from "@/components/BotEyes";
import { Navigation } from "@/components/Navigation";
import {
  Camera,
  MousePointer,
  Play,
  RefreshCw,
  Trophy,
  Award,
  AlertTriangle,
  Flame,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const botId = params.botId as string;

  const bot = BOTS.find((b) => b.id === botId) || BOTS[0];

  const [gameState, setGameState] = useState<"idle" | "playing" | "lost">("idle");
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [time, setTime] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lossReason, setLossReason] = useState<string>("");
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [botIsBlinking, setBotIsBlinking] = useState<boolean>(false);
  const [pupilPos, setPupilPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const botBlinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // FIX FOR WASM CRASH: Keep track of last processed video timestamp
  const lastVideoTimeRef = useRef<number>(-1);

  // Mouse tracking for fallback when camera is off
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cameraActive) return;
      const deltaX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setPupilPos({
        x: Math.max(-18, Math.min(18, deltaX * 18)),
        y: Math.max(-18, Math.min(18, deltaY * 18)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cameraActive]);

  useEffect(() => {
    const saved = localStorage.getItem(`staring_high_score_${bot.id}`);
    if (saved) setHighScore(parseFloat(saved));
  }, [bot.id]);

  // Init MediaPipe with GPU -> CPU fallback
  useEffect(() => {
    let active = true;
    const initVision = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        let landmarker;
        try {
          landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          });
        } catch {
          // Fallback to CPU if GPU delegate fails
          landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          });
        }

        if (active) faceLandmarkerRef.current = landmarker;
      } catch (err) {
        console.error("Vision model initialization error:", err);
      }
    };

    initVision();
    return () => {
      active = false;
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch {
      setCameraActive(false);
    }
  };

  const triggerWin = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (botBlinkTimeoutRef.current) clearTimeout(botBlinkTimeoutRef.current);

    const finalTime = (performance.now() - startTimeRef.current) / 1000;
    setTime(finalTime);
    setGameState("lost");
    setLossReason(`${bot.name} blinked first! VICTORY IS YOURS! 🎉`);
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
  }, [bot]);

  const triggerLoss = useCallback(
    (reason: string) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (botBlinkTimeoutRef.current) clearTimeout(botBlinkTimeoutRef.current);

      setGameState("lost");
      setLossReason(reason);

      const finalTime = (performance.now() - startTimeRef.current) / 1000;
      setTime(finalTime);

      if (finalTime > highScore) {
        setHighScore(finalTime);
        setIsNewRecord(true);
        localStorage.setItem(`staring_high_score_${bot.id}`, finalTime.toString());
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    },
    [highScore, bot]
  );

  const scheduleNextBotBlink = useCallback(() => {
    if (botBlinkTimeoutRef.current) clearTimeout(botBlinkTimeoutRef.current);

    const randomMs = Math.floor(
      Math.random() * (bot.maxBlinkMs - bot.minBlinkMs) + bot.minBlinkMs
    );

    botBlinkTimeoutRef.current = setTimeout(() => {
      if (gameStateRef.current === "playing") {
        setBotIsBlinking(true);
        triggerWin();
      }
    }, randomMs);
  }, [bot, triggerWin]);

  const calculateEAR = (landmarks: { x: number; y: number; z: number }[], indices: number[]) => {
    const [p1, p2, p3, p4, p5, p6] = indices.map((idx) => landmarks[idx]);
    const v1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const v2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);
    const h = Math.hypot(p1.x - p4.x, p1.y - p4.y);
    return (v1 + v2) / (2.0 * h);
  };

  // Safe frame process loop preventing WASM crash
  const processFrame = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    setTime(elapsed);

    if (
      cameraActive &&
      videoRef.current &&
      faceLandmarkerRef.current &&
      videoRef.current.readyState >= 2
    ) {
      // FIX FOR WASM CRASH: Only process frame if video playback time has advanced
      if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = videoRef.current.currentTime;

        try {
          const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, now);

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const nose = landmarks[1];
            setPupilPos({ x: (0.5 - nose.x) * 35, y: (nose.y - 0.5) * 35 });

            const leftEAR = calculateEAR(landmarks, [33, 160, 158, 133, 153, 144]);
            const rightEAR = calculateEAR(landmarks, [362, 385, 387, 263, 373, 380]);

            if ((leftEAR + rightEAR) / 2 < 0.2) {
              triggerLoss(`${bot.name} detected your eye blink!`);
              return;
            }
          } else {
            triggerLoss("Face lost! Stay visible in front of camera.");
            return;
          }
        } catch (err) {
          console.error("Frame detection error:", err);
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [cameraActive, bot, triggerLoss]);

  useEffect(() => {
    if (gameState === "playing") animFrameRef.current = requestAnimationFrame(processFrame);
    else if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, processFrame]);

  const startGame = () => {
    if (!cameraActive) startCamera();
    setBotIsBlinking(false);
    setGameState("playing");
    setTime(0);
    setIsNewRecord(false);
    startTimeRef.current = performance.now();
    scheduleNextBotBlink();
  };

  return (
    <div className="h-screen w-screen bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white overflow-hidden font-sans select-none relative">
      <video ref={videoRef} className="hidden" playsInline muted />
      <Navigation />

      {/* MAIN ARENA CONTENT */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 flex flex-col justify-between relative z-10 py-2">
        
        {/* Top Header Grid */}
        <div className="grid grid-cols-12 items-start pt-2">
          
          {/* Left Game Headline */}
          <div className="col-span-12 lg:col-span-5 space-y-2 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider">
                ARENA MATCH
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                Target Lock Mode
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              ENGAGING <br />
              <span className="text-orange-600">{bot.name}</span>
            </h1>
          </div>

          {/* Right Selected Opponent High Score */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 text-right space-y-1 z-20 self-start pt-1">
            <div className="text-3xl xl:text-4xl font-black text-zinc-900 flex items-center justify-end gap-1.5 tracking-tight font-mono">
              <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
              <span>{highScore.toFixed(2)}s</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              PERSONAL BEST RECORD
            </p>
          </div>
        </div>

        {/* CENTER CONSOLE: MATCH STAGE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="pointer-events-auto w-full max-w-lg relative">
            <div className="p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative">
              <AnimatePresence mode="wait">
                
                {/* IDLE */}
                {gameState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 px-0.5">
                      <span className="uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-200/90 border border-zinc-300 font-bold text-zinc-800 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-600" />
                        DIFFICULTY: {bot.difficulty}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-zinc-800">
                        <Trophy className="w-3 h-3 text-orange-500" />
                        BEST: {highScore.toFixed(2)}s
                      </span>
                    </div>

                    <div className="py-8 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[150px] shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                      <BotEyes type={bot.eyeType} isBlinking={false} pupilPos={pupilPos} theme="dark" />
                    </div>

                    <div className="space-y-0.5">
                      <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase">
                        {bot.name}
                      </h2>
                      <p className="text-[11px] text-zinc-600 font-medium leading-normal">
                        {bot.tagline}
                      </p>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={startGame}
                        className="w-full py-3 rounded-md font-bold text-[11px] bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] uppercase tracking-wider font-mono"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        START MATCH NOW
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PLAYING */}
                {gameState === "playing" && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-orange-600 font-bold tracking-wider uppercase px-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                        TRACKING ACTIVE
                      </span>
                      <span className="text-zinc-600">{bot.name}</span>
                    </div>

                    <div className="py-8 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[150px] shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                      <BotEyes type={bot.eyeType} isBlinking={botIsBlinking} pupilPos={pupilPos} theme="dark" />
                    </div>

                    <div className="p-3 bg-white/70 border border-zinc-300 rounded-md space-y-0.5 text-center">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase block">
                        STARE DURATION
                      </span>
                      <span className="text-5xl font-mono font-black text-zinc-900 tracking-tight">
                        {time.toFixed(2)}s
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* CONCLUDED */}
                {gameState === "lost" && (
                  <motion.div
                    key="lost"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    {isNewRecord && (
                      <span className="px-2.5 py-1 bg-amber-500 text-white font-mono font-bold text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1 w-max shadow-sm">
                        <Award className="w-3.5 h-3.5" /> NEW RECORD TIME
                      </span>
                    )}

                    <div className="py-8 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[150px] shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                      <BotEyes type={bot.eyeType} isBlinking={true} pupilPos={pupilPos} theme="dark" />
                    </div>

                    <div className="p-3 bg-white/80 border border-zinc-300 rounded-md text-[11px] font-mono text-zinc-800 flex items-center gap-2 shadow-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>{lossReason}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => router.push("/")}
                        className="py-2.5 px-4 rounded-md font-bold text-[11px] bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300 transition-all font-mono uppercase shadow-sm"
                      >
                        ROSTER
                      </button>
                      <button
                        onClick={() => {
                          setGameState("idle");
                          setTime(0);
                        }}
                        className="py-2.5 px-4 rounded-md font-bold text-[11px] bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] font-mono uppercase"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> REMATCH
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Feature Callouts */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <div className="p-2 rounded-md bg-[#b8b8be]/40 hover:bg-white border border-zinc-400/40 text-zinc-700 flex flex-col items-center gap-1 cursor-default transition-all shadow-sm">
            <Camera className="w-4 h-4 text-orange-600" />
            <span className="text-[8px] font-mono font-bold uppercase text-center leading-tight">
              Optical<br />Sensor
            </span>
          </div>
          <div className="p-2 rounded-md bg-[#b8b8be]/40 hover:bg-white border border-zinc-400/40 text-zinc-700 flex flex-col items-center gap-1 cursor-default transition-all shadow-sm">
            <MousePointer className="w-4 h-4 text-orange-600" />
            <span className="text-[8px] font-mono font-bold uppercase text-center leading-tight">
              Tracking<br />Enabled
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col gap-4 z-20 pb-4">
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                Target Lock Status
              </span>
              <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">
                Hold direct eye contact with {bot.name}. Blinking your eyes will immediately forfeit the round.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* GIANT BACKGROUND WATERMARK */}
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