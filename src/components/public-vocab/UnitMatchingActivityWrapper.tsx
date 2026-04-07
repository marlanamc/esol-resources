"use client";

import { useMemo } from "react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { ImageWordMatchingGame, type ImageWordPair } from "@/components/public-vocab/ImageWordMatchingGame";

interface UnitMatchingActivityWrapperProps {
  unit: PublicLevel1VocabularyUnit;
}

export function UnitMatchingActivityWrapper({ unit }: UnitMatchingActivityWrapperProps) {
  // Use a special key for unit-level matching progress, or just pick the first theme's tracker
  // For now, we'll mark the whole unit matching as complete when done
  const { completeMatching } = useVocabProgress(unit.slug, "unit-review");

  const pairs: ImageWordPair[] = useMemo(() => {
    let n = 0;
    const out: ImageWordPair[] = [];
    
    // Aggregating cards from the themes if they exist, or individual categories
    const themes = unit.themes || [];
    
    for (const theme of themes) {
      for (const card of theme.cards) {
        if (card.isConcrete && card.imageUrl) {
          n += 1;
          out.push({ 
            id: n, 
            term: card.term, 
            imageUrl: card.imageUrl
          });
        }
      }
    }
    
    return out;
  }, [unit]);

  const pairSignature = `${unit.slug}:unit-review:${pairs.length}`;

  if (pairs.length < 2) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🖼️</span>
        </div>
        <h3 className="text-lg font-medium text-text">Not enough pictures yet</h3>
        <p className="mt-2 text-text-muted max-w-xs mx-auto text-sm">
          We are still adding clear photos for this unit's review game. Try another unit!
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-text mb-1">Unit Review</h2>
          <p className="text-text-muted text-sm">Match the picture to the word</p>
        </div>
        
        <ImageWordMatchingGame
          pairs={pairs}
          pairSignature={pairSignature}
          onComplete={completeMatching}
        />
      </div>
    </div>
  );
}
