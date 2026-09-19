import type { POSAnswerDetail, POSSwipeSortCard, PartOfSpeech } from '@/types/parts-of-speech';

/**
 * Deck bookkeeping for the swipe-sort exercise, kept out of the component so it
 * can be tested. The component owns animation and layout; correctness, the pass
 * threshold, and the missed-word list live here.
 */

export interface SwipeSortResult {
  card: POSSwipeSortCard;
  chosen: PartOfSpeech;
  correct: boolean;
  /** True when `chosen` was accepted via `alsoAccepts` rather than being the deck's intended bucket. */
  alternate: boolean;
}

export type DeckState = SwipeSortResult[];

/** A deck passes at 70%, matching the round thresholds in POS_ROUND_THRESHOLDS. */
export const SWIPE_SORT_PASS_RATIO = 0.7;

export function isAccepted(card: POSSwipeSortCard, chosen: PartOfSpeech): boolean {
  return chosen === card.correctBucket || (card.alsoAccepts?.includes(chosen) ?? false);
}

/** True when the choice was right, but not the bucket this deck was sorting for. */
export function isAlternate(card: POSSwipeSortCard, chosen: PartOfSpeech): boolean {
  return chosen !== card.correctBucket && isAccepted(card, chosen);
}

/**
 * Append one card's outcome. Idempotent per card id: a fast double-tap on a
 * phone can outrun the component's animation guard, and recording the same card
 * twice would inflate both the deck total and the round accuracy that decides
 * whether points are awarded.
 */
export function recordCard(state: DeckState, card: POSSwipeSortCard, chosen: PartOfSpeech): DeckState {
  if (state.some(r => r.card.id === card.id)) return state;
  return [
    ...state,
    { card, chosen, correct: isAccepted(card, chosen), alternate: isAlternate(card, chosen) },
  ];
}

export function summarize(state: DeckState, total: number): POSAnswerDetail & { pass: boolean } {
  const cardsCorrect = state.filter(r => r.correct).length;
  const missedWords = state.filter(r => !r.correct).map(r => r.card.word);
  return {
    cardsTotal: total,
    cardsCorrect,
    missedWords,
    pass: total > 0 && cardsCorrect / total >= SWIPE_SORT_PASS_RATIO,
  };
}
