"use client";

import { useEffect, useState } from "react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { VocabWordImage } from "./VocabWordImage";
import { AudioButton, GlassCard, ProgressBar } from "./level1-ui";
import type { VocabTheme } from "@/data/public-level1-vocab";

interface FlashcardsActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

/**
 * "Practice Cards" — front shows image + word + audio. The "Show Meaning"
 * button reveals meaning, Spanish, and example below the front (no flip
 * metaphor). Big stacked controls for low-digital-literacy learners.
 */
export function FlashcardsActivityWrapper({
  theme,
  unitSlug,
}: FlashcardsActivityWrapperProps) {
  const { studyFlashcard } = useVocabProgress(unitSlug, theme.id);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cards = theme.cards;
  const card = cards[index];
  const total = cards.length;
  const isLast = index === total - 1;

  // Reset reveal on card change.
  useEffect(() => {
    setRevealed(false);
  }, [index]);

  // Track each card the learner views.
  useEffect(() => {
    if (card) {
      studyFlashcard(card.term, total);
    }
    // run on index change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!card) return null;

  const goNext = () => {
    if (isLast) {
      setIndex(0);
      return;
    }
    setIndex((v) => v + 1);
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>
          {index + 1} of {total}
        </span>
        <span className="text-xs uppercase tracking-[0.16em] text-[#a04f1a]">Practice Cards</span>
      </div>
      <ProgressBar value={(index + 1) / total} accent="#e07a3b" />

      {/* Front card */}
      <GlassCard raised className="p-5 sm:p-6 text-center">
        {card.imageUrl ? (
          <div className="overflow-hidden rounded-2xl">
            <VocabWordImage src={card.imageUrl} alt={card.term} variant="banner" />
          </div>
        ) : (
          <div className="mx-auto flex h-40 w-full items-center justify-center rounded-2xl bg-orange-50/70 ring-1 ring-orange-200/60">
            <span className="text-5xl" aria-hidden>
              💬
            </span>
          </div>
        )}

        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {card.term}
        </h2>

        {revealed ? (
          <div className="mt-5 space-y-3 text-left">
            <div className="rounded-2xl bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Meaning
              </p>
              <p className="mt-0.5 text-base leading-relaxed text-slate-800">
                {card.englishDefinition}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Español
              </p>
              <p className="mt-0.5 text-base leading-relaxed text-slate-800">
                {card.spanishDefinition}
              </p>
            </div>
            {card.example ? (
              <div className="rounded-2xl bg-amber-50/70 p-3 ring-1 ring-amber-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                  Example
                </p>
                <p className="mt-0.5 text-base italic leading-relaxed text-slate-800">
                  &ldquo;{card.example}&rdquo;
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </GlassCard>

      {/* Big bottom controls: Hear / Show Meaning / Next */}
      <div className="grid grid-cols-3 gap-3">
        <AudioButton term={card.term} size="lg" label={`Hear ${card.term}`} showLabel />

        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-pressed={revealed}
          className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/85 backdrop-blur border border-white/80 shadow-[0_4px_12px_-4px_rgba(20,60,70,0.20)] text-[#a04f1a] hover:bg-white active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
        >
          <span aria-hidden className="text-xl leading-none">
            👁️
          </span>
          <span className="text-xs font-semibold">
            {revealed ? "Hide" : "Show Meaning"}
          </span>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#e07a3b] text-white shadow-[0_8px_18px_-8px_rgba(224,122,59,0.6)] hover:bg-[#cc6a2e] active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
        >
          <span aria-hidden className="text-xl leading-none">
            →
          </span>
          <span className="text-xs font-semibold">{isLast ? "Restart" : "Next"}</span>
        </button>
      </div>

    </div>
  );
}

export default FlashcardsActivityWrapper;
