"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { getVocabAudioUrl } from "@/lib/vocab-audio-url";

interface AudioButtonProps {
  term: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

const ICON_SIZE = { sm: 18, md: 22, lg: 26 };

export function AudioButton({ term, size = "md", label, showLabel = false, className = "" }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const audio = new Audio(getVocabAudioUrl(term));
    audio.currentTime = 0;
    setPlaying(true);
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("error", () => setPlaying(false));
    void audio.play().catch(() => setPlaying(false));
  };

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={play}
        aria-label={label ?? `Play pronunciation for ${term}`}
        className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/85 backdrop-blur border border-white/80 shadow-[0_4px_12px_-4px_rgba(20,60,70,0.20)] text-[#0a6b62] hover:bg-white active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${playing ? "ring-2 ring-emerald-300" : ""} ${className}`}
      >
        <Volume2 size={ICON_SIZE[size]} strokeWidth={2.2} aria-hidden />
        <span className="text-xs font-semibold">Hear</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label ?? `Play pronunciation for ${term}`}
      className={`inline-flex items-center justify-center rounded-full bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_4px_12px_-4px_rgba(20,60,70,0.25)] text-[#0a6b62] transition-all hover:bg-white hover:scale-[1.04] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${SIZE_CLASS[size]} ${playing ? "ring-2 ring-emerald-300" : ""} ${className}`}
    >
      <Volume2 size={ICON_SIZE[size]} strokeWidth={2.2} aria-hidden />
    </button>
  );
}
