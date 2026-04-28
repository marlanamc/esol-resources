/**
 * Shared design tokens for the Level 1 public vocab redesign.
 * Liquid-glass / iOS-inspired. Light-mode only (ForceThemeLight is active).
 */

export type ModeKey = "learn" | "cards" | "quiz" | "game";

export const MODE_TOKENS: Record<
  ModeKey,
  {
    label: string;
    description: string;
    icon: string;
    accent: string; // primary action color
    accentSoft: string; // soft tint for backgrounds
    accentStrong: string; // for text on light tints
    ring: string; // tailwind ring color class
  }
> = {
  learn: {
    label: "Learn Words",
    description: "See and hear words",
    icon: "📖",
    accent: "#0f9b8e",
    accentSoft: "rgba(15, 155, 142, 0.10)",
    accentStrong: "#0a6b62",
    ring: "ring-emerald-300/60",
  },
  cards: {
    label: "Practice Cards",
    description: "Review with flashcards",
    icon: "🎴",
    accent: "#e07a3b",
    accentSoft: "rgba(224, 122, 59, 0.10)",
    accentStrong: "#a04f1a",
    ring: "ring-orange-300/60",
  },
  quiz: {
    label: "Quiz",
    description: "Pick the correct word",
    icon: "✅",
    accent: "#3b82c4",
    accentSoft: "rgba(59, 130, 196, 0.10)",
    accentStrong: "#1f5a8c",
    ring: "ring-sky-300/60",
  },
  game: {
    label: "Game",
    description: "Match pictures and words",
    icon: "🎮",
    accent: "#a855a8",
    accentSoft: "rgba(168, 85, 168, 0.10)",
    accentStrong: "#763473",
    ring: "ring-fuchsia-300/60",
  },
};

// Page background gradient — soft warm-cool blend, no harsh white.
export const PAGE_BG =
  "bg-[linear-gradient(180deg,#fdf9f0_0%,#f4f7f5_55%,#eef4f3_100%)]";

// Standard glass card surface — translucent white with cool border + subtle blur.
export const GLASS_SURFACE =
  "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_24px_-12px_rgba(20,60,70,0.18)]";

export const GLASS_SURFACE_RAISED =
  "bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_18px_40px_-18px_rgba(20,60,70,0.30)]";
