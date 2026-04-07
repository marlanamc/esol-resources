"use client";

import { useMemo } from "react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { VocabTheme } from "@/data/public-level1-vocab";
import { ImageWordMatchingGame, type ImageWordPair } from "@/components/public-vocab/ImageWordMatchingGame";

interface MatchingActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

const MATCHING_EXCLUDED_CATEGORIES = new Set([
  // Grammar words with no visual referent
  "Pronouns",
  "Possessive Adjectives",
  "Contractions",
  "Prepositions (Location)",
  "Prepositions of Location",
  "Adverbs of Frequency",
  "Adverbs of Location",
  // Abstract concepts that can't be unambiguously pictured
  "Personal Information",
  "Numbers",
  "Time of Day",
  "Days and Months",
  "Routines",
  "Adjectives",
  "Civic Vocabulary",
  "Community Services / Needs",
  "Messages",
  "Quantifiers",
  "Shopping & Finance",
  "Workforce Terminology",
  "Strengths",
  "Strength Adjectives",
  "Symptoms",
  "Illness",
  "Exercise",
  "Other Medical",
  "Food Groups",
  "Other Wellness",
  "Housing & Rental",
  "Other",
]);

export function MatchingActivityWrapper({ theme, unitSlug }: MatchingActivityWrapperProps) {
  const { completeMatching } = useVocabProgress(unitSlug, theme.id);

  const pairs: ImageWordPair[] = useMemo(() => {
    let n = 0;
    const out: ImageWordPair[] = [];
    for (const card of theme.cards) {
      if (!card.imageUrl) continue;
      if (MATCHING_EXCLUDED_CATEGORIES.has(card.category)) continue;
      n += 1;
      out.push({ id: n, term: card.term, imageUrl: card.imageUrl });
    }
    return out;
  }, [theme.cards]);

  const pairSignature = `${theme.id}:${pairs.map((p) => p.term).join("|")}`;

  return (
    <div className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <ImageWordMatchingGame
          pairs={pairs}
          pairSignature={pairSignature}
          onComplete={completeMatching}
        />
      </div>
    </div>
  );
}
