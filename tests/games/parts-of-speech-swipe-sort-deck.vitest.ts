import { describe, expect, it } from 'vitest';
import {
  isAccepted,
  isAlternate,
  recordCard,
  summarize,
  type DeckState,
} from '@/components/games/PartsOfSpeechGame/exercises/swipeSortDeck';
import type { POSSwipeSortCard, PartOfSpeech } from '@/types/parts-of-speech';

const card = (
  word: string,
  correctBucket: PartOfSpeech,
  alsoAccepts?: PartOfSpeech[],
): POSSwipeSortCard => ({ id: `c-${word}`, word, correctBucket, alsoAccepts });

/** Play a whole deck: each entry is the bucket the learner chose for that card. */
const play = (cards: POSSwipeSortCard[], chosen: PartOfSpeech[]): DeckState =>
  cards.reduce<DeckState>((state, c, i) => recordCard(state, c, chosen[i]), []);

describe('isAccepted', () => {
  it('accepts the deck bucket', () => {
    expect(isAccepted(card('run', 'verb'), 'verb')).toBe(true);
  });

  it('rejects the other bucket when the word is unambiguous', () => {
    expect(isAccepted(card('run', 'verb'), 'noun')).toBe(false);
  });

  it('accepts either bucket for an ambiguous word, in both directions', () => {
    const work = card('work', 'verb', ['noun']);
    expect(isAccepted(work, 'verb')).toBe(true);
    expect(isAccepted(work, 'noun')).toBe(true);
  });

  it('still rejects a bucket that is not listed', () => {
    expect(isAccepted(card('work', 'verb', ['noun']), 'adjective')).toBe(false);
  });
});

describe('isAlternate', () => {
  it('flags an accepted choice that was not the deck bucket', () => {
    expect(isAlternate(card('work', 'verb', ['noun']), 'noun')).toBe(true);
  });

  it('does not flag the deck bucket itself', () => {
    expect(isAlternate(card('work', 'verb', ['noun']), 'verb')).toBe(false);
  });

  it('does not flag a plain wrong answer', () => {
    expect(isAlternate(card('run', 'verb'), 'noun')).toBe(false);
  });
});

describe('recordCard', () => {
  it('is idempotent for the same card, so a double-tap cannot inflate the deck', () => {
    const c = card('run', 'verb');
    const once = recordCard([], c, 'verb');
    const twice = recordCard(once, c, 'noun');
    expect(twice).toHaveLength(1);
    expect(twice[0].chosen).toBe('verb');
  });

  it('keeps distinct cards that share a word', () => {
    const a: POSSwipeSortCard = { id: 'a', word: 'run', correctBucket: 'verb' };
    const b: POSSwipeSortCard = { id: 'b', word: 'run', correctBucket: 'noun' };
    expect(recordCard(recordCard([], a, 'verb'), b, 'verb')).toHaveLength(2);
  });
});

describe('summarize', () => {
  const six = [
    card('run', 'verb'),
    card('jump', 'verb'),
    card('dog', 'noun'),
    card('table', 'noun'),
    card('eat', 'verb'),
    card('chair', 'noun'),
  ];

  it('counts correct cards and lists the missed words in order', () => {
    const state = play(six, ['verb', 'noun', 'noun', 'verb', 'verb', 'noun']);
    const result = summarize(state, six.length);
    expect(result.cardsTotal).toBe(6);
    expect(result.cardsCorrect).toBe(4);
    expect(result.missedWords).toEqual(['jump', 'table']);
  });

  it('reports a perfect deck with no missed words', () => {
    const state = play(six, ['verb', 'verb', 'noun', 'noun', 'verb', 'noun']);
    const result = summarize(state, six.length);
    expect(result.cardsCorrect).toBe(6);
    expect(result.missedWords).toEqual([]);
    expect(result.pass).toBe(true);
  });

  // The 70% line decides whether a round awards points, so pin both sides of it.
  it('fails at 4 of 6 (0.667)', () => {
    const state = play(six, ['verb', 'noun', 'noun', 'verb', 'verb', 'noun']);
    expect(summarize(state, six.length).pass).toBe(false);
  });

  it('passes at 5 of 6 (0.833)', () => {
    const state = play(six, ['verb', 'verb', 'noun', 'verb', 'verb', 'noun']);
    const result = summarize(state, six.length);
    expect(result.cardsCorrect).toBe(5);
    expect(result.pass).toBe(true);
  });

  it('passes exactly at the 0.7 boundary (7 of 10)', () => {
    const ten = Array.from({ length: 10 }, (_, i) => card(`w${i}`, 'verb'));
    const chosen: PartOfSpeech[] = [
      ...Array<PartOfSpeech>(7).fill('verb'),
      ...Array<PartOfSpeech>(3).fill('noun'),
    ];
    expect(summarize(play(ten, chosen), 10).pass).toBe(true);
  });

  it('never counts an ambiguous word as missed, whichever bucket was chosen', () => {
    const cards = [card('work', 'verb', ['noun']), card('run', 'verb')];
    const result = summarize(play(cards, ['noun', 'verb']), cards.length);
    expect(result.cardsCorrect).toBe(2);
    expect(result.missedWords).toEqual([]);
    expect(result.pass).toBe(true);
  });

  it('treats an unfinished deck as missing those cards', () => {
    const state = play(six.slice(0, 3), ['verb', 'verb', 'noun']);
    const result = summarize(state, six.length);
    expect(result.cardsCorrect).toBe(3);
    expect(result.cardsTotal).toBe(6);
    expect(result.pass).toBe(false);
  });

  it('does not pass an empty deck', () => {
    expect(summarize([], 0).pass).toBe(false);
  });
});

/**
 * Mirrors the weighting in computeRoundResults (usePartsOfSpeechGameState).
 * That function is not exported, so this pins the arithmetic the round depends
 * on: a deck must contribute its cards, not one boolean.
 */
describe('round accuracy weighting', () => {
  const weigh = (results: { correct: boolean; detail?: { cardsTotal: number; cardsCorrect: number } }[]) => {
    const total = results.reduce((n, r) => n + (r.detail?.cardsTotal ?? 1), 0);
    const correct = results.reduce(
      (n, r) => n + (r.detail ? r.detail.cardsCorrect : r.correct ? 1 : 0),
      0,
    );
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  it('scores a round by cards rather than by decks', () => {
    // 14 of 18 cards. Deck-level scoring saw 2 of 3 passes and called it 67%.
    const round = [
      { correct: true, detail: { cardsTotal: 6, cardsCorrect: 6 } },
      { correct: false, detail: { cardsTotal: 6, cardsCorrect: 3 } },
      { correct: true, detail: { cardsTotal: 6, cardsCorrect: 5 } },
    ];
    expect(weigh(round)).toBe(78);
  });

  it('separates a near-perfect deck from a perfect one', () => {
    const five = [{ correct: true, detail: { cardsTotal: 6, cardsCorrect: 5 } }];
    const six = [{ correct: true, detail: { cardsTotal: 6, cardsCorrect: 6 } }];
    expect(weigh(five)).toBe(83);
    expect(weigh(six)).toBe(100);
  });

  it('still counts single-item exercises as one item each', () => {
    expect(weigh([{ correct: true }, { correct: false }, { correct: true }])).toBe(67);
  });

  it('mixes detailed and plain outcomes in one round', () => {
    // 5 of 6 cards, plus one plain wrong answer = 5 of 7.
    expect(weigh([{ correct: true, detail: { cardsTotal: 6, cardsCorrect: 5 } }, { correct: false }])).toBe(71);
  });
});
