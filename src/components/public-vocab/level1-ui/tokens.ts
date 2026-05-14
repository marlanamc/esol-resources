/**
 * Shared design tokens for the Level 1 public vocab redesign.
 * Liquid-glass / iOS-inspired. Light-mode only (ForceThemeLight is active).
 */

export type ModeKey = "learn" | "cards" | "quiz" | "game";

export const MODE_TOKENS: Record<
  ModeKey,
  {
    label: string;
    labelEs: string;
    description: string;
    icon: string;
    accent: string; // primary action color
    accentSoft: string; // soft tint for backgrounds
    accentStrong: string; // for text on light tints
    ring: string; // tailwind ring color class
  }
> = {
  learn: {
    label: "See the Words",
    labelEs: "Ver las palabras",
    description: "Look, listen, learn",
    icon: "📖",
    accent: "#F0A23A",
    accentSoft: "rgba(240, 162, 58, 0.12)",
    accentStrong: "#8C5E08",
    ring: "ring-amber-300/60",
  },
  cards: {
    label: "Flashcards",
    labelEs: "Tarjetas",
    description: "Flip and remember",
    icon: "🎴",
    accent: "#E05A78",
    accentSoft: "rgba(224, 90, 120, 0.10)",
    accentStrong: "#9E2942",
    ring: "ring-rose-300/60",
  },
  quiz: {
    label: "Fill in the Blank",
    labelEs: "Completa la frase",
    description: "Pick the right word",
    icon: "✏️",
    accent: "#7C5FD9",
    accentSoft: "rgba(124, 95, 217, 0.10)",
    accentStrong: "#4D3697",
    ring: "ring-violet-300/60",
  },
  game: {
    label: "Match Pictures",
    labelEs: "Une los dibujos",
    description: "A picture matching game",
    icon: "🧩",
    accent: "#36B260",
    accentSoft: "rgba(54, 178, 96, 0.10)",
    accentStrong: "#1E6E3A",
    ring: "ring-green-300/60",
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
