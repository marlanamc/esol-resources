"use client";

import { useEffect } from "react";
import FlashcardCarousel from "@/components/games/FlashcardCarousel";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { VocabTheme } from "@/data/public-level1-vocab";

interface FlashcardsActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

/**
 * Wraps FlashcardCarousel with progress tracking
 * Marks the flashcard activity as completed when component mounts
 */
export function FlashcardsActivityWrapper({
  theme,
  unitSlug,
}: FlashcardsActivityWrapperProps) {
  const { completeActivity } = useVocabProgress(unitSlug, theme.id);

  // Mark flashcards as completed on mount (tracking that they viewed this activity)
  useEffect(() => {
    completeActivity("flashcards", { completed: true });
  }, [completeActivity]);

  // Transform theme cards to flashcard format
  const flashcards = theme.cards.map((card, index) => ({
    id: `${theme.id}-${index}`,
    term: card.term,
    definition: `${card.englishDefinition}\n\nEspañol: ${card.spanishDefinition}`,
    example: card.example,
    imageUrl: card.imageUrl,
  }));

  return <FlashcardCarousel cards={flashcards} />;
}

export default FlashcardsActivityWrapper;
