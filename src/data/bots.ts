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
    tagline: "The Prototype Glitch",
    story: "An uncalibrated maintenance unit operating on erratic power spikes and unbuffered visual logic.",
    chapterText:
      "Engineered during the early automated industrial era, VEX-01 was built for high-speed assembly inspection. Though its mechanical shutter is aging and prone to erratic micro-stutters, its unstable power core gives human competitors a fair baseline opening in the arena.",
    difficulty: "Easy",
    accentColor: "from-amber-500 via-orange-500 to-amber-600",
    eyeType: "happy",
    minBlinkMs: 5000,
    maxBlinkMs: 18000,
  },
  {
    id: "poly",
    name: "MONOLITH",
    tagline: "The Focal Sentinel",
    story: "Wields a single high-density quartz lens designed to bypass atmospheric distortion and glare.",
    chapterText:
      "MONOLITH surrendered all secondary sensory apparatuses to house a singular, heavy-duty optical aperture. Built as an orbital boundary guard, its central lens locks onto targets with pinpoint precision, immune to environmental glare and visual distraction.",
    difficulty: "Medium",
    accentColor: "from-emerald-400 via-teal-500 to-cyan-600",
    eyeType: "cyclops",
    minBlinkMs: 8000,
    maxBlinkMs: 35000,
  },
  {
    id: "byte",
    name: "CRT-89",
    tagline: "The Arcade Phantom",
    story: "A legacy arcade AI locking target focus at 60Hz phosphor refresh rates.",
    chapterText:
      "Rescued from a decommissioned cyber-arcade cabinet in Tokyo, CRT-89 runs on vintage vacuum-tube hardware and cathode-ray logic. Its pixelated ocular array refreshes every 16.6 milliseconds, rendering human optical fatigue virtually imperceptible to its code.",
    difficulty: "Medium",
    accentColor: "from-fuchsia-500 via-pink-500 to-rose-600",
    eyeType: "pixel",
    minBlinkMs: 10000,
    maxBlinkMs: 45000,
  },
  {
    id: "argus",
    name: "QUADRA",
    tagline: "The Synchronized Array",
    story: "Combines 4 quad-focal sensors into a single persistent tracking mesh.",
    chapterText:
      "Deployed for high-security vault surveillance, QUADRA processes four distinct optical streams simultaneously. If one aperture recalibrates, the remaining three maintain an unbroken visual lock. Defeating QUADRA requires outlasting an entire neural array.",
    difficulty: "Hard",
    accentColor: "from-cyan-400 via-blue-500 to-indigo-600",
    eyeType: "argus",
    minBlinkMs: 15000,
    maxBlinkMs: 75000,
  },
  {
    id: "azazel",
    name: "KRONOS",
    tagline: "The Temporal Predictor",
    story: "Equipped with a third infernal lens that calculates human eye twitch latency.",
    chapterText:
      "KRONOS operates on predictive neural telemetry. Its central third optic does not merely observe—it models micro-muscle spasms around your eyelids up to 250 milliseconds before a blink occurs, adjusting its own shutter timing preemptively.",
    difficulty: "Hard",
    accentColor: "from-red-500 via-rose-600 to-orange-700",
    eyeType: "devil",
    minBlinkMs: 20000,
    maxBlinkMs: 110000,
  },
  {
    id: "void",
    name: "NULL VOID",
    tagline: "The Event Horizon",
    story: "Forged in the deep space vacuum. Has maintained absolute visual lock since initial boot.",
    chapterText:
      "Suspended beyond atmospheric pressure and solar interference, NULL VOID represents pure optical stillness. Operating without moisture, dust, or organic strain, it gazes continuously through the arena grid without pulsing a single frame.",
    difficulty: "Impossible",
    accentColor: "from-[#8B5CF6] via-[#6366F1] to-[#0F172A]",
    eyeType: "cosmic",
    minBlinkMs: 50000,
    maxBlinkMs: 300000,
  },
];