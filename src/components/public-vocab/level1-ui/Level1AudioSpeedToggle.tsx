"use client";

import { Gauge, Turtle } from "lucide-react";
import { useLevel1AudioSpeedOptional } from "./Level1AudioSpeedContext";
import type { Level1VocabAudioSpeed } from "@/lib/level1-vocab-audio";

const OPTIONS: Array<{
  value: Level1VocabAudioSpeed;
  label: string;
  labelEs: string;
  Icon: typeof Gauge;
}> = [
  { value: "normal", label: "Normal", labelEs: "Normal", Icon: Gauge },
  { value: "slow", label: "Slow", labelEs: "Lento", Icon: Turtle },
];

export function Level1AudioSpeedToggle() {
  const ctx = useLevel1AudioSpeedOptional();
  if (!ctx) return null;

  const { speed, setSpeed } = ctx;
  const slowActive = speed === "slow";

  return (
    <div
      role="group"
      aria-label="Audio playback speed"
      className="relative inline-grid w-[9.25rem] grid-cols-2 rounded-full border-2 border-[#0a6b62]/25 bg-slate-200/95 p-1 shadow-inner sm:w-[11.5rem]"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-1 w-[calc(50%-0.375rem)] rounded-full bg-[#0a6b62] shadow-md transition-[left] duration-200 ease-out ${
          slowActive ? "left-[calc(50%+0.125rem)]" : "left-1"
        }`}
      />
      {OPTIONS.map((option) => {
        const active = speed === option.value;
        const Icon = option.Icon;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-current={active ? "true" : undefined}
            onClick={() => setSpeed(option.value)}
            className={`relative z-10 flex min-h-9 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:min-h-10 ${
              active ? "!text-white" : "text-slate-700 hover:text-[#0a6b62]"
            }`}
          >
            <Icon
              size={14}
              strokeWidth={2.4}
              aria-hidden
              className={`shrink-0 ${active ? "!text-white" : ""}`}
            />
            <span
              className={`text-[10px] font-bold leading-none tracking-wide sm:text-[11px] ${
                active ? "!text-white" : ""
              }`}
            >
              {option.label}
            </span>
            <span
              className={`hidden text-[9px] font-semibold leading-none sm:block ${
                active ? "!text-white/90" : "opacity-90"
              }`}
            >
              {option.labelEs}
            </span>
          </button>
        );
      })}
    </div>
  );
}
