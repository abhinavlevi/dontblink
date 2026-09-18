export type EyeStyle = "happy" | "cyclops" | "argus" | "devil" | "pixel" | "cosmic";

export interface BotProfile {
  id: string;
  name: string;
  tagline: string;
  story: string;
  chapterText: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Impossible";
  accentColor: string;
  eyeType: EyeStyle;
  minBlinkMs: number;
  maxBlinkMs: number;
}

export const BOTS: BotProfile[] = [
  {
    id: "barnaby",
    name: "VEX-01",
    tagline: "The Uncalibrated Anomaly",
    story: "An rusty old factory drone with a broken eye shutter. Easy warm-up match.",
    chapterText:
      "VEX-01 was salvaged from a dusty warehouse scrap heap. Its optical shutter is super glitchy and stutters every few seconds. If you can't out-stare this rusty box, you might need to check your sleep schedule.",
    difficulty: "Easy",
    accentColor: "from-amber-500 via-orange-500 to-amber-600",
    eyeType: "happy",
    minBlinkMs: 50000,
    maxBlinkMs: 69000,
  },
  {
    id: "poly",
    name: "MONOLITH",
    tagline: "The Deep-Space Aperture",
    story: "A giant single-eyed space guard that does not know how to blink.",
    chapterText:
      "Built for deep space perimeter watch, MONOLITH has one massive central quartz lens. It has zero chill, zero emotion, and won't blink for minutes. You actually have to lock in for this one.",
    difficulty: "Medium",
    accentColor: "from-emerald-400 via-teal-500 to-cyan-600",
    eyeType: "cyclops",
    minBlinkMs: 125000,
    maxBlinkMs: 240000,
  },
  {
    id: "byte",
    name: "CRT-89",
    tagline: "The Neon Phantom",
    story: "A retro arcade machine running on 60Hz phosphor refresh loops.",
    chapterText:
      "Rescued from the basement of an abandoned 90s cyber arcade, CRT-89 runs on retro code and high-voltage screen tubes. It thinks human eye fatigue is hilarious and will spam optical glitches to make you blink.",
    difficulty: "Medium",
    accentColor: "from-fuchsia-500 via-pink-500 to-rose-600",
    eyeType: "pixel",
    minBlinkMs: 250000,
    maxBlinkMs: 420000,
  },
  {
    id: "argus",
    name: "PANOPTIC",
    tagline: "The Multi-Threaded Stalker",
    story: "Uses a 4-eye camera grid array so it never loses sight of your pupils.",
    chapterText:
      "PANOPTIC doesn't rely on just two eyes. It runs four separate optical cameras at once. Even if one eye goes down for diagnostics, the other three keep an unbroken lock on your face. Out-staring a 4-eye hivemind is a genuine flex.",
    difficulty: "Hard",
    accentColor: "from-cyan-400 via-blue-500 to-indigo-600",
    eyeType: "argus",
    minBlinkMs: 400000,
    maxBlinkMs: 520000,
  },
  {
    id: "azazel",
    name: "CHRONOS-V",
    tagline: "The Temporal Predictor",
    story: "Equipped with a third eye sensor that predicts your eye twitches before you blink.",
    chapterText:
      "CHRONOS-V is built with a third telemetry lens that calculates micro-muscle twitches around your eyelids. It literally predicts when you're about to blink before your brain even knows it. Main character energy required to win.",
    difficulty: "Hard",
    accentColor: "from-red-500 via-rose-600 to-orange-700",
    eyeType: "devil",
    minBlinkMs: 500000,
    maxBlinkMs: 650000,
  },
  {
    id: "void",
    name: "OMEGA NULL",
    tagline: "The Event Horizon",
    story: "A cosmic final boss with infinite ocular endurance and maximum aura.",
    chapterText:
      "Forged at the edge of the universe, OMEGA NULL doesn't need eyelid moisture or cooling breaks. It has maintained an unbroken gaze since initial boot-up. Defeating OMEGA NULL gives you ultimate arena aura.",
    difficulty: "Impossible",
    accentColor: "from-[#8B5CF6] via-[#6366F1] to-[#0F172A]",
    eyeType: "cosmic",
    minBlinkMs: 680000,
    maxBlinkMs: 800000,
  },
];