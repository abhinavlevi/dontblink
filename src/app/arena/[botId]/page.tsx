"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BOTS, BotProfile } from "@/data/bots";
import { BotEyes } from "@/components/BotEyes";
import { Navigation } from "@/components/Navigation";
import { VictoryState, DefeatState } from "@/components/ArenaResults";
import {
  Play,
  Trophy,
  Flame,
  Zap,
  GripHorizontal,
  VideoOff,
  Eye,
  EyeOff,
  ZapOff,
  ShieldAlert,
  Crosshair,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Synthesized Sound Effects via Web Audio API
const playSoundEffect = (type: "warning" | "flashbang" | "glitch" | "emp") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "warning") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "flashbang") {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === "glitch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.setValueAtTime(500, ctx.currentTime + 0.04);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "emp") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // Audio Context fail silent
  }
};

export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const botId = params.botId as string;

  const bot: BotProfile = BOTS.find((b) => b.id === botId) || BOTS[0];

  const [gameState, setGameState] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");
  const gameStateRef = useRef(gameState);

  const isGameActiveRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [time, setTime] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lossReason, setLossReason] = useState<string>("");
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [botIsBlinking, setBotIsBlinking] = useState<boolean>(false);
  const [pupilPos, setPupilPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Gameplay Hazard States
  const [cheatCooldown, setCheatCooldown] = useState<boolean>(false);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const [flashbangActive, setFlashbangActive] = useState<boolean>(false);
  const [flashWarning, setFlashWarning] = useState<boolean>(false);
  const [empJammed, setEmpJammed] = useState<boolean>(false);
  const [battlePhase, setBattlePhase] = useState<1 | 2 | 3>(1);

  // Camera & Stream States
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [hideCamPreview, setHideCamPreview] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] =
    useState<string>("");
  const [isRequestingCamera, setIsRequestingCamera] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const botBlinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hazardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lastVideoTimeRef = useRef<number>(-1);
  const lastTimestampRef = useRef<number>(0);

  // Fallback pupil positioning on idle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cameraActive || gameState === "playing") return;
      const deltaX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const deltaY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setPupilPos({
        x: Math.max(-18, Math.min(18, deltaX * 18)),
        y: Math.max(-18, Math.min(18, deltaY * 18)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cameraActive, gameState]);

  useEffect(() => {
    const saved = localStorage.getItem(`staring_high_score_${bot.id}`);
    if (saved) setHighScore(parseFloat(saved));
  }, [bot.id]);

  // Init MediaPipe Vision Task
  useEffect(() => {
    let active = true;
    const initVision = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
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

  const requestCameraAccess = async (): Promise<boolean> => {
    setIsRequestingCamera(true);
    setCameraPermissionError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setIsRequestingCamera(false);
      return true;
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraActive(false);
      setIsRequestingCamera(false);
      setCameraPermissionError(
        "Camera permission denied! Turn on your webcam in browser settings to play.",
      );
      return false;
    }
  };

  const handleVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  const stopGameLoop = useCallback(() => {
    isGameActiveRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (botBlinkTimeoutRef.current) clearTimeout(botBlinkTimeoutRef.current);
    if (hazardTimeoutRef.current) clearTimeout(hazardTimeoutRef.current);
    setFlashbangActive(false);
    setFlashWarning(false);
  }, []);

  const triggerWin = useCallback(() => {
    stopGameLoop();

    const finalTime = (performance.now() - startTimeRef.current) / 1000;
    setTime(finalTime);
    setGameState("won");

    if (finalTime > highScore) {
      setHighScore(finalTime);
      setIsNewRecord(true);
      localStorage.setItem(
        `staring_high_score_${bot.id}`,
        finalTime.toString(),
      );
    }

    confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
  }, [bot, highScore, stopGameLoop]);

  const triggerLoss = useCallback(
    (reason: string) => {
      stopGameLoop();

      const finalTime = (performance.now() - startTimeRef.current) / 1000;
      setTime(finalTime);
      setGameState("lost");
      setLossReason(reason);

      if (finalTime > highScore) {
        setHighScore(finalTime);
        setIsNewRecord(true);
        localStorage.setItem(
          `staring_high_score_${bot.id}`,
          finalTime.toString(),
        );
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    },
    [highScore, bot, stopGameLoop],
  );

  // FIXED: Explicitly recalculates random interval using current bot prop
  const scheduleNextBotBlink = useCallback(() => {
    if (botBlinkTimeoutRef.current) clearTimeout(botBlinkTimeoutRef.current);

    const min = Number(bot.minBlinkMs) || 5000;
    const max = Number(bot.maxBlinkMs) || 10000;

    const randomMs = Math.floor(Math.random() * (max - min) + min);

    botBlinkTimeoutRef.current = setTimeout(() => {
      if (isGameActiveRef.current) {
        setBotIsBlinking(true);
        triggerWin();
      }
    }, randomMs);
  }, [bot.minBlinkMs, bot.maxBlinkMs, triggerWin]);

  const scheduleBotHazard = useCallback(() => {
    if (hazardTimeoutRef.current) clearTimeout(hazardTimeoutRef.current);
    const hazardMs = Math.floor(Math.random() * 6000 + 5000);

    hazardTimeoutRef.current = setTimeout(() => {
      if (isGameActiveRef.current) {
        setFlashWarning(true);
        playSoundEffect("warning");

        setTimeout(() => {
          if (isGameActiveRef.current) {
            setFlashWarning(false);
            setFlashbangActive(true);
            playSoundEffect("flashbang");

            setTimeout(() => {
              setFlashbangActive(false);
              scheduleBotHazard();
            }, 380);
          }
        }, 750);
      }
    }, hazardMs);
  }, []);

  const triggerPlayerCheat = useCallback(() => {
    if (gameStateRef.current !== "playing" || cheatCooldown || empJammed)
      return;

    setCheatCooldown(true);

    const randomCooldownMs = Math.floor(Math.random() * 4700 + 2500);
    const empThreshold = Math.random() * 0.15 + 0.2;
    const counterRoll = Math.random();

    if (counterRoll < empThreshold) {
      const empDurationMs = Math.floor(Math.random() * 8000 + 5000);
      setEmpJammed(true);
      playSoundEffect("emp");
      setTimeout(() => setEmpJammed(false), empDurationMs);
      setTimeout(() => setCheatCooldown(false), empDurationMs);
      return;
    }

    playSoundEffect("glitch");

    const winThreshold = battlePhase === 3 ? 0.05 : 0.1;
    const roll = Math.random();

    if (roll < winThreshold) {
      setBotIsBlinking(true);
      triggerWin();
    } else {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 450);
      setTimeout(() => setCheatCooldown(false), randomCooldownMs);
    }
  }, [cheatCooldown, empJammed, battlePhase, triggerWin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState === "playing") {
        e.preventDefault();
        triggerPlayerCheat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, triggerPlayerCheat]);

  const calculateEAR = (
    landmarks: { x: number; y: number; z: number }[],
    indices: number[],
  ) => {
    const [p1, p2, p3, p4, p5, p6] = indices.map((idx) => landmarks[idx]);
    const v1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const v2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);
    const h = Math.hypot(p1.x - p4.x, p1.y - p4.y);
    return (v1 + v2) / (2.0 * h);
  };

  const processFrame = useCallback(() => {
    if (!isGameActiveRef.current || isProcessingRef.current) return;

    isProcessingRef.current = true;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    setTime(elapsed);

    if (elapsed > 20 && battlePhase !== 3) setBattlePhase(3);
    else if (elapsed > 10 && elapsed <= 20 && battlePhase !== 2)
      setBattlePhase(2);

    const video = videoRef.current;

    if (
      cameraActive &&
      video &&
      faceLandmarkerRef.current &&
      video.readyState >= 2 &&
      !video.paused &&
      !video.ended
    ) {
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        try {
          const videoTimestampMs = Math.max(
            Math.floor(video.currentTime * 1000),
            lastTimestampRef.current + 1,
          );
          lastTimestampRef.current = videoTimestampMs;

          const results = faceLandmarkerRef.current.detectForVideo(
            video,
            videoTimestampMs,
          );

          if (
            isGameActiveRef.current &&
            results?.faceLandmarks &&
            results.faceLandmarks.length > 0
          ) {
            const landmarks = results.faceLandmarks[0];

            const nose = landmarks[1];
            const jitter = battlePhase === 3 ? (Math.random() - 0.5) * 6 : 0;
            const targetX = Math.max(
              -22,
              Math.min(22, (0.5 - nose.x) * 42 + jitter),
            );
            const targetY = Math.max(
              -22,
              Math.min(22, (nose.y - 0.5) * 42 + jitter),
            );
            setPupilPos({ x: targetX, y: targetY });

            const leftEAR = calculateEAR(
              landmarks,
              [33, 160, 158, 133, 153, 144],
            );
            const rightEAR = calculateEAR(
              landmarks,
              [362, 385, 387, 263, 373, 380],
            );

            if ((leftEAR + rightEAR) / 2 < 0.2) {
              isProcessingRef.current = false;
              triggerLoss("You blinked first!");
              return;
            }
          } else if (isGameActiveRef.current) {
            isProcessingRef.current = false;
            triggerLoss("Face lost! Stay centered in front of the camera.");
            return;
          }
        } catch (err) {
          // Suppress WASM exceptions
        }
      }
    }

    isProcessingRef.current = false;

    if (isGameActiveRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }
  }, [cameraActive, bot, battlePhase, triggerLoss]);

  useEffect(() => {
    if (gameState === "playing") {
      isGameActiveRef.current = true;
      animFrameRef.current = requestAnimationFrame(processFrame);
    } else {
      stopGameLoop();
    }

    return () => {
      stopGameLoop();
    };
  }, [gameState, processFrame, stopGameLoop]);

  const startGame = async () => {
    let ready = cameraActive;
    if (!ready) {
      ready = await requestCameraAccess();
    }

    if (!ready) return;

    isGameActiveRef.current = true;
    isProcessingRef.current = false;
    lastTimestampRef.current = 0;
    lastVideoTimeRef.current = -1;
    setBotIsBlinking(false);
    setCheatCooldown(false);
    setGlitchActive(false);
    setEmpJammed(false);
    setBattlePhase(1);
    setGameState("playing");
    setTime(0);
    setIsNewRecord(false);
    setPupilPos({ x: 0, y: 0 });
    startTimeRef.current = performance.now();
    scheduleNextBotBlink();
    scheduleBotHazard();
  };

  return (
    <div
      ref={containerRef}
      className="min-h-dvh w-full bg-[#d0d0d5] text-zinc-900 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans select-none relative overflow-x-hidden"
    >
      <Navigation />

      {/* FLASHBANG OVERLAY */}
      <AnimatePresence>
        {flashbangActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-between relative z-10 py-2">
        
        {/* HEADER GRID */}
        <div className="grid grid-cols-12 items-start pt-2 gap-2 sm:gap-0">
          <div className="col-span-12 md:col-span-6 space-y-1 sm:space-y-2 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-sm bg-orange-600 text-white font-bold tracking-wider">
                1V1 BOT MATCH
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                LIVE EYE TRACKING
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-zinc-900 leading-[0.98] uppercase">
              FACING <br />
              <span className="text-orange-600">{bot.name}</span>
            </h1>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8 text-left md:text-right space-y-0.5 sm:space-y-1 z-20 pt-1">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-zinc-900 flex items-center md:justify-end gap-1.5 tracking-tight font-mono">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 fill-orange-600" />
              <span>{highScore.toFixed(2)}s</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-600 tracking-wider uppercase font-semibold">
              YOUR BEST TIME
            </p>
          </div>
        </div>

        {/* CENTER CONSOLE STAGE */}
        <div className="my-auto py-6 sm:py-8 flex items-center justify-center z-20">
          <div className="w-full max-w-lg relative">
            <div className="p-4 sm:p-5 rounded-xl bg-[#dcdce2]/95 border border-zinc-300 shadow-xl relative">
              <AnimatePresence mode="wait">
                
                {/* IDLE STATE */}
                {gameState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3 sm:space-y-4"
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

                    <div className="py-6 sm:py-8 flex justify-center items-center bg-[#18181b] rounded-lg border border-zinc-800 min-h-[130px] sm:min-h-[150px] shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                      <BotEyes
                        type={bot.eyeType}
                        isBlinking={false}
                        pupilPos={pupilPos}
                        theme="dark"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight uppercase">
                        {bot.name}
                      </h2>
                      <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium leading-normal">
                        {bot.tagline}
                      </p>
                    </div>

                    {cameraPermissionError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-md text-[10px] font-mono text-rose-700 flex items-center gap-2">
                        <VideoOff className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{cameraPermissionError}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={startGame}
                        disabled={isRequestingCamera}
                        className="w-full py-3 rounded-md font-bold text-[11px] bg-orange-600 text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] uppercase tracking-wider font-mono disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isRequestingCamera
                          ? "TURNING ON WEBCAM..."
                          : "START STARE DOWN"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PLAYING STATE */}
                {gameState === "playing" && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3 sm:space-y-4 font-mono"
                  >
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-0.5">
                      <span className="flex items-center gap-1.5 text-orange-600">
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                        PHASE {battlePhase}:{" "}
                        {battlePhase === 1
                          ? "LOCK-IN"
                          : battlePhase === 2
                            ? "SPEED-UP"
                            : "MAX FOCUS"}
                      </span>
                      {flashWarning ? (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white animate-bounce flex items-center gap-1">
                          <ZapOff className="w-3 h-3" /> FLASH INCOMING!
                        </span>
                      ) : empJammed ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                          <ShieldAlert className="w-3 h-3" /> ACTION BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                          EYES LOCKED
                        </span>
                      )}
                    </div>

                    <div
                      onClick={triggerPlayerCheat}
                      className={`py-6 sm:py-8 flex justify-center items-center bg-[#18181b] rounded-lg border-2 min-h-[130px] sm:min-h-[150px] shadow-inner relative overflow-hidden cursor-pointer transition-all ${
                        glitchActive
                          ? "border-rose-500 scale-98 brightness-150"
                          : empJammed
                            ? "border-amber-500/60"
                            : "border-zinc-800 hover:border-orange-500/50"
                      }`}
                      title="Tap or press Spacebar to fake out the bot"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
                      <BotEyes
                        type={bot.eyeType}
                        isBlinking={botIsBlinking}
                        pupilPos={pupilPos}
                        theme="dark"
                      />
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/70 border border-zinc-300 rounded-md space-y-0.5 text-center">
                      <span className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase block">
                        TIMER
                      </span>
                      <span className="text-4xl sm:text-5xl font-mono font-black text-zinc-900 tracking-tight">
                        {time.toFixed(2)}s
                      </span>
                    </div>

                    {/* DISTRACT ACTION BUTTON */}
                    <button
                      onClick={triggerPlayerCheat}
                      disabled={cheatCooldown || empJammed}
                      className={`w-full py-2.5 rounded-md font-bold text-[9px] sm:text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                        empJammed
                          ? "bg-amber-500/20 text-amber-800 border border-amber-500/40 cursor-not-allowed"
                          : cheatCooldown
                            ? "bg-zinc-300 text-zinc-500 border border-zinc-400 cursor-not-allowed"
                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>
                        {empJammed
                          ? "BOT COUNTERED YOUR FAKE!"
                          : cheatCooldown
                            ? "RECHARGING..."
                            : "TRY FAKE-OUT (SPACEBAR / TAP)"}
                      </span>
                    </button>
                  </motion.div>
                )}

                {/* WON RESULT STATE */}
                {gameState === "won" && (
                  <motion.div
                    key="won"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VictoryState
                      bot={bot}
                      time={time}
                      highScore={highScore}
                      isNewRecord={isNewRecord}
                      lossReason={lossReason}
                      pupilPos={pupilPos}
                      onRematch={() => {
                        setGameState("idle");
                        setTime(0);
                      }}
                      onSelectBot={() => router.push("/")}
                    />
                  </motion.div>
                )}

                {/* LOST RESULT STATE */}
                {gameState === "lost" && (
                  <motion.div
                    key="lost"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DefeatState
                      bot={bot}
                      time={time}
                      highScore={highScore}
                      isNewRecord={isNewRecord}
                      lossReason={lossReason}
                      pupilPos={pupilPos}
                      onRematch={() => {
                        setGameState("idle");
                        setTime(0);
                      }}
                      onSelectBot={() => router.push("/")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* DRAGGABLE USER CAMERA PREVIEW */}
        {cameraActive && (
          <motion.div
            drag={gameState === "playing" ? false : true}
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            whileDrag={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 bg-[#18181b] border-2 border-orange-600 rounded-lg p-1.5 shadow-2xl transition-all touch-none select-none ${
              gameState === "playing"
                ? "cursor-default"
                : "cursor-grab active:cursor-grabbing"
            } ${hideCamPreview ? "w-24 sm:w-28" : "w-32 sm:w-40 md:w-44"}`}
          >
            <div className="flex items-center justify-between px-1 pb-1 text-[8px] sm:text-[9px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 font-bold text-orange-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                YOU
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHideCamPreview(!hideCamPreview)}
                  className="hover:text-white transition-colors p-0.5"
                  title={
                    hideCamPreview ? "Show Camera" : "Hide Camera"
                  }
                >
                  {hideCamPreview ? (
                    <Eye className="w-3 h-3 text-orange-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-zinc-400" />
                  )}
                </button>
                {gameState === "playing" ? (
                  <span
                    title="Camera locked during match"
                    className="flex items-center"
                  >
                    <Lock className="w-3 h-3 text-orange-500" />
                  </span>
                ) : (
                  <GripHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </div>
            </div>

            {!hideCamPreview && (
              <div className="w-full h-20 sm:h-28 bg-black rounded overflow-hidden border border-zinc-800 relative">
                <video
                  ref={handleVideoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100 pointer-events-none"
                />
                <div className="absolute bottom-0.5 left-0.5 px-1 rounded bg-black/60 text-[7px] sm:text-[8px] font-mono text-zinc-300 pointer-events-none">
                  {gameState === "playing" ? "LOCKED" : "DRAG ME"}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* FOOTER HINT */}
        <div className="w-full flex flex-col gap-4 z-20 pb-2 sm:pb-4">
          <div className="flex items-end justify-between border-t border-zinc-400/30 pt-3 sm:pt-4">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                HOW TO PLAY
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed font-medium">
                Keep your eyes open and look directly at {bot.name}. Use Spacebar or tap the screen to try a fake-out, but watch out for flashes!
              </p>
            </div>
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