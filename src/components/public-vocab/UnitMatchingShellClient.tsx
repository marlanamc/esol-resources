"use client";

import { useState } from "react";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { GlassCard } from "./level1-ui";
import { UnitMatchingActivityWrapper } from "./UnitMatchingActivityWrapper";

interface UnitMatchingShellClientProps {
  unit: PublicLevel1VocabularyUnit;
}

const ACCENT = "#a855a8";

/**
 * Wraps the unit-level matching game with a Look / Listen mode toggle.
 * The toggle owns state and forwards it to the game; the instruction
 * strip swaps copy to match. Switching modes remounts the game (key
 * change inside UnitMatchingActivityWrapper) so a new run starts cleanly.
 */
export function UnitMatchingShellClient({ unit }: UnitMatchingShellClientProps) {
  const [audioMatchMode, setAudioMatchMode] = useState(false);

  return (
    <>
      {/* Mode toggle */}
      <div className="mb-3 flex justify-center">
        <div
          role="tablist"
          aria-label="Game mode"
          className="inline-flex items-center gap-1 rounded-full bg-white/85 backdrop-blur-xl border border-white/70 p-1 shadow-[0_4px_12px_-6px_rgba(20,60,70,0.18)]"
        >
          <ModePill
            active={!audioMatchMode}
            onClick={() => setAudioMatchMode(false)}
            icon="👁️"
            label="Look"
          />
          <ModePill
            active={audioMatchMode}
            onClick={() => setAudioMatchMode(true)}
            icon="🎧"
            label="Listen"
          />
        </div>
      </div>

      {/* Instructions */}
      <GlassCard
        className="mb-4 p-4"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,168,0.10), rgba(255,255,255,0.85))",
        }}
      >
        <ol className="flex items-center justify-around gap-2 text-sm font-semibold text-slate-700 sm:text-base">
          <li className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: ACCENT }}
              aria-hidden
            >
              1
            </span>
            <span>{audioMatchMode ? "Tap a sound" : "Tap a picture"}</span>
          </li>
          <li aria-hidden className="text-slate-400">
            →
          </li>
          <li className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: ACCENT }}
              aria-hidden
            >
              2
            </span>
            <span>{audioMatchMode ? "Tap the picture" : "Tap the word"}</span>
          </li>
        </ol>
      </GlassCard>

      <UnitMatchingActivityWrapper unit={unit} audioMatchMode={audioMatchMode} />
    </>
  );
}

function ModePill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/60 ${
        active
          ? "text-white shadow-[0_4px_10px_-4px_rgba(168,85,168,0.5)]"
          : "text-slate-700 hover:bg-white/70"
      }`}
      style={active ? { background: ACCENT } : undefined}
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
