"use client";

import { useLevel1AudioSpeedOptional } from "./Level1AudioSpeedContext";
import type { Level1VocabAudioSpeed } from "@/lib/level1-vocab-audio";

const OPTIONS: Array<{ value: Level1VocabAudioSpeed; label: string; labelEs: string }> = [
  { value: "normal", label: "Normal", labelEs: "Normal" },
  { value: "slow", label: "Slow", labelEs: "Lento" },
];

export function Level1AudioSpeedToggle() {
  const ctx = useLevel1AudioSpeedOptional();
  if (!ctx) return null;

  const { speed, setSpeed } = ctx;

  return (
    <div
      role="group"
      aria-label="Audio playback speed"
      className="inline-flex rounded-full border border-white/70 bg-white/80 p-0.5 shadow-sm backdrop-blur-md"
    >
      {OPTIONS.map((option) => {
        const active = speed === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setSpeed(option.value)}
            className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:px-3 sm:text-xs ${
              active
                ? "bg-[#0a6b62] text-white shadow-sm"
                : "text-slate-600 hover:bg-white/90 hover:text-[#0a6b62]"
            }`}
          >
            <span className="sm:hidden">{option.label}</span>
            <span className="hidden sm:inline">
              {option.label} / {option.labelEs}
            </span>
          </button>
        );
      })}
    </div>
  );
}
