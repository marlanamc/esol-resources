"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, LayoutGrid, X } from "lucide-react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { VocabWordImage } from "./VocabWordImage";
import { AudioButton, GlassCard, PrimaryActionButton, ProgressBar } from "./level1-ui";
import type { VocabTheme } from "@/data/public-level1-vocab";

interface WordListActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

/**
 * "Learn Words" — one card at a time. Big audio button, image, simple
 * meaning. Spanish + example collapse behind a "More" toggle on small
 * screens to reduce scroll.
 */
export function WordListActivityWrapper({ theme, unitSlug }: WordListActivityWrapperProps) {
  const { viewWordList } = useVocabProgress(unitSlug, theme.id);
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const cards = theme.cards;
  const card = cards[index];
  const total = cards.length;
  const isLast = index === total - 1;

  // Reset "more" toggle when moving to a new word.
  useEffect(() => {
    setShowMore(false);
  }, [index]);

  // Mark the activity as viewed/completed when the learner reaches the
  // end of the deck. Avoids triggering on every navigation.
  useEffect(() => {
    if (isLast && !completed) {
      viewWordList();
      setCompleted(true);
    }
  }, [isLast, completed, viewWordList]);

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a6b62] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded"
          >
            {showAll ? <X size={14} /> : <LayoutGrid size={14} />}
            {showAll ? "Close" : "See All"}
          </button>
          <span className="text-xs uppercase tracking-[0.16em] text-[#0a6b62]">Learn Words</span>
        </div>
      </div>
      <ProgressBar value={(index + 1) / total} />

      {/* All-words grid */}
      {showAll ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {cards.map((c, i) => (
            <button
              key={c.term}
              type="button"
              onClick={() => { setIndex(i); setShowAll(false); }}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-center transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                i === index
                  ? "border-[#0a6b62] bg-emerald-50/80 ring-1 ring-[#0a6b62]/30"
                  : "border-white/70 bg-white/70 hover:bg-white"
              }`}
            >
              {c.imageUrl ? (
                <div className="w-full overflow-hidden rounded-xl">
                  <VocabWordImage src={c.imageUrl} alt={c.term} variant="tile" />
                </div>
              ) : (
                <div className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  💬
                </div>
              )}
              <span className="text-xs font-semibold leading-tight text-slate-800">{c.term}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Word card */}
      <GlassCard raised className="p-5 sm:p-6">
        {/* Header row: word + audio */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {card.term}
          </h2>
          <AudioButton term={card.term} size="lg" />
        </div>

        {/* Image */}
        {card.imageUrl ? (
          <div className="mt-4 overflow-hidden rounded-2xl">
            <VocabWordImage src={card.imageUrl} alt={card.term} variant="banner" />
          </div>
        ) : null}

        {/* Simple meaning — always shown */}
        <p className="mt-4 text-lg leading-relaxed text-slate-800 sm:text-xl">
          {card.englishDefinition}
        </p>

        {/* More toggle */}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0a6b62] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded"
          aria-expanded={showMore}
        >
          {showMore ? "Hide details" : "More"}
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showMore ? (
          <div className="mt-3 space-y-3">
            <div className="rounded-2xl bg-white/60 p-3">
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

      {/* Next */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded px-2 py-1"
        >
          ← Back
        </button>

        <PrimaryActionButton onClick={goNext} showArrow={!isLast}>
          {isLast ? "Start Over" : "Next Word"}
        </PrimaryActionButton>
      </div>
    </div>
  );
}

export default WordListActivityWrapper;
