"use client";

import { useMemo } from "react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { ImageWordMatchingGame, type ImageWordPair } from "@/components/public-vocab/ImageWordMatchingGame";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";

interface UnitMatchingActivityWrapperProps {
  unit: PublicLevel1VocabularyUnit;
  audioMatchMode?: boolean;
}

export function UnitMatchingActivityWrapper({
  unit,
  audioMatchMode = false,
}: UnitMatchingActivityWrapperProps) {
  const { completeMatching } = useVocabProgress(unit.slug, "unit-review");

  const { imageBackedCards, eligibleCards, hasPlayableUnitMatching } = useMemo(
    () => getUnitMatchingAvailability(unit),
    [unit]
  );

  const pairs: ImageWordPair[] = useMemo(() => {
    let n = 0;
    const out: ImageWordPair[] = [];

    for (const card of eligibleCards) {
      n += 1;
      out.push({
        id: n,
        term: card.term,
        imageUrl: card.imageUrl!,
      });
    }

    return out;
  }, [eligibleCards]);

  const pairSignature = `${unit.slug}:unit-review:${pairs.length}`;

  if (!hasPlayableUnitMatching) {
    const noImageBackedCards = imageBackedCards.length < 2;

    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🖼️</span>
        </div>
        <h3 className="text-lg font-medium text-text">
          {noImageBackedCards ? "No image-backed cards yet" : "Unit matching is temporarily unavailable"}
        </h3>
        <p className="mt-2 text-text-muted max-w-xs mx-auto text-sm">
          {noImageBackedCards
            ? "This unit does not have enough image-backed words yet for the review game. Try another unit for now."
            : "This unit has picture cards, but too few currently pass the matching filter. Try another unit while we loosen the set."}
        </p>
      </div>
    );
  }

  return (
    <ImageWordMatchingGame
      key={audioMatchMode ? "listen" : "look"}
      pairs={pairs}
      pairSignature={pairSignature}
      onComplete={completeMatching}
      audioMatchMode={audioMatchMode}
    />
  );
}
