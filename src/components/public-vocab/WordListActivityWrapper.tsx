"use client";

import { useEffect } from "react";
import { getVocabAudioUrl } from "@/lib/vocab-audio-url";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import { VocabWordImage } from "./VocabWordImage";
import type { VocabTheme } from "@/data/public-level1-vocab";

interface WordListActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

/**
 * Word list activity with audio playback and progress tracking
 */
export function WordListActivityWrapper({
  theme,
  unitSlug,
}: WordListActivityWrapperProps) {
  const { viewWordList } = useVocabProgress(unitSlug, theme.id);

  // Mark word list as viewed on mount
  useEffect(() => {
    viewWordList();
  }, [viewWordList]);

  const playAudio = (term: string) => {
    const audioUrl = getVocabAudioUrl(term);
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      // Silently handle audio errors
    });
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface-base)] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">Word List</h2>
          <p className="mt-2 text-sm font-medium text-text-muted">{theme.cards.length} words</p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {theme.cards.map((card, index) => (
            <div
              key={index}
              className="group relative flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm transition-all hover:border-[var(--tone-vocabulary-accent)]/30 hover:shadow-md"
            >
              {/* Number Badge */}
              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--tone-vocabulary-accent)]/10 text-xs font-bold text-[var(--tone-vocabulary-accent)]">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Term with Audio Button */}
              <div className="flex items-start justify-between gap-3 mb-4 pr-8">
                <h3 className="font-display text-2xl font-bold text-text flex-1">{card.term}</h3>
                <button
                  onClick={() => playAudio(card.term)}
                  className="mt-1 flex-shrink-0 rounded-lg bg-[var(--tone-vocabulary-accent)]/10 p-2 text-[var(--tone-vocabulary-accent-strong)] transition hover:bg-[var(--tone-vocabulary-accent)]/20 hover:scale-105"
                  aria-label={`Play pronunciation for ${card.term}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H3v6h3l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                    <path d="M18.07 5.93a9 9 0 010 12.73" />
                  </svg>
                </button>
              </div>

              {/* Illustration image (concrete nouns only — abstract words will have no image) */}
              {card.imageUrl && (
                <div className="mb-4">
                  <VocabWordImage src={card.imageUrl} alt={card.term} variant="banner" />
                </div>
              )}

              {/* Definitions and Example */}
              <div className="space-y-3">
                {/* English Definition */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-1">English</p>
                  <p className="text-sm leading-relaxed text-text">
                    {card.englishDefinition}
                  </p>
                </div>

                {/* Spanish Definition */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-1">Español</p>
                  <p className="text-sm leading-relaxed italic text-text">
                    {card.spanishDefinition}
                  </p>
                </div>

                {/* Example */}
                <div className="border-t border-[var(--color-border-subtle)] pt-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-1">Example</p>
                  <p className="text-sm italic text-text-muted">
                    "{card.example}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WordListActivityWrapper;
