import { describe, expect, it } from 'vitest';
import { cardsFor, getWordSortCard, WORD_SORT_CONTEXT_CARDS } from '@/lib/word-sort/content';
import { applyWordSortAttempt, buildWordSortDecks, buildWordSortReview, isWordSortLevelUnlocked, readWordSortProgress, reviewKey } from '@/lib/word-sort/progression';
import { WORD_SORT_LEVELS, WORD_SORT_GROUPS } from '@/lib/word-sort/types';
import type { WordSortAttempt, WordSortLevel, WordSortTarget } from '@/lib/word-sort/types';
import { isAccepted } from '@/components/games/PartsOfSpeechGame/exercises/swipeSortDeck';
import { randomUUID } from 'node:crypto';

const targets: WordSortTarget[] = ['verb', 'noun', 'pronoun', 'article'];
function unlocked(target: WordSortTarget) {
  const progress = readWordSortProgress(null, target);
  progress.levels.words.passed = true;
  progress.levels.sentences.passed = true;
  return progress;
}
function attempt(target: WordSortTarget, level: WordSortLevel): WordSortAttempt {
  return { id: randomUUID(), level, review: false, responses: buildWordSortDecks(target, level).flatMap(deck => deck.cards.map(card => ({ cardId: card.id, leftBucket: deck.leftBucket, rightBucket: deck.rightBucket, chosen: card.correctBucket }))) };
}
function incorrect(input: WordSortAttempt, count: number) {
  let changed = 0;
  for (const response of input.responses) {
    const card = getWordSortCard(response.cardId)!;
    const other = response.chosen === response.leftBucket ? response.rightBucket : response.leftBucket;
    if (!card.alsoAccepts?.includes(other) && changed < count) { response.chosen = other; changed++; }
  }
  expect(changed).toBe(count);
  return input;
}

describe.each(targets)('Word Sort %s', target => {
  it.each(WORD_SORT_LEVELS)('%s generates three balanced decks without duplicate context cards', level => {
    for (let i = 0; i < 30; i++) {
      const decks = buildWordSortDecks(target, level);
      expect(decks).toHaveLength(3);
      const ids = decks.flatMap(deck => deck.cards).filter(card => !(level === 'words' && card.correctBucket === 'article')).map(card => card.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const deck of decks) {
        expect(deck.cards).toHaveLength(6);
        expect(new Set(deck.cards.map(card => card.id)).size).toBe(6);
        expect(deck.rightBucket).toBe(target);
        expect(deck.cards.filter(card => card.correctBucket === target)).toHaveLength(3);
        for (const card of deck.cards) {
          expect([deck.leftBucket, deck.rightBucket]).toContain(card.correctBucket);
          expect(card.explanation).toBeTruthy();
          if (level !== 'words') {
            expect(card.sentence!.slice(card.targetSpan!.start, card.targetSpan!.end)).toBe(card.word);
            expect(card.alsoAccepts).toBeUndefined();
          }
        }
      }
    }
  });
  it.each(WORD_SORT_LEVELS)('%s scores each card and counts a save only once', level => {
    const input = attempt(target, level);
    const result = applyWordSortAttempt(unlocked(target), target, input);
    expect(result.accuracy).toBe(100);
    expect(result.progress.levels[level].attempts).toBe(1);
    expect(applyWordSortAttempt(result.progress, target, input).progress).toEqual(result.progress);
  });
  it('uses fresh target cards before repeating the previous attempt', () => {
    const first = buildWordSortDecks(target, 'challenge').flatMap(deck => deck.cards).filter(card => card.correctBucket === target).map(card => card.id);
    const second = buildWordSortDecks(target, 'challenge', first).flatMap(deck => deck.cards).filter(card => card.correctBucket === target).map(card => card.id);
    const pool = cardsFor(target, 'challenge');
    expect(second.filter(id => !first.includes(id))).toHaveLength(pool.length - first.length);
  });
});

it('has stable, unique content IDs and valid, short context spans', () => {
  expect(new Set(WORD_SORT_CONTEXT_CARDS.map(card => card.id)).size).toBe(WORD_SORT_CONTEXT_CARDS.length);
  for (const card of WORD_SORT_CONTEXT_CARDS) {
    expect(card.sentence!.length).toBeLessThan(90);
    expect(card.sentence!.slice(card.targetSpan!.start, card.targetSpan!.end)).toBe(card.word);
  }
});
it.each([['words', 13, 12], ['sentences', 14, 13], ['challenge', 15, 14]] as const)('%s applies its exact pass threshold', (level, passing, failing) => {
  const progress = unlocked('pronoun');
  progress.levels[level].passed = false;
  expect(applyWordSortAttempt(progress, 'pronoun', incorrect(attempt('pronoun', level), 18 - passing)).passed).toBe(true);
  expect(applyWordSortAttempt(progress, 'pronoun', incorrect(attempt('pronoun', level), 18 - failing)).passed).toBe(false);
});
it('unlocks levels sequentially and never revokes a passed level', () => {
  const fresh = readWordSortProgress(null, 'verb');
  expect(isWordSortLevelUnlocked(fresh, 'sentences')).toBe(false);
  expect(() => applyWordSortAttempt(fresh, 'verb', attempt('verb', 'challenge'))).toThrow('previous');
  const passed = applyWordSortAttempt(fresh, 'verb', attempt('verb', 'words')).progress;
  expect(isWordSortLevelUnlocked(passed, 'sentences')).toBe(true);
  const failing = attempt('verb', 'words');
  failing.responses = buildWordSortDecks('verb', 'words', [], () => 0).flatMap(deck => deck.cards.map(card => ({ cardId: card.id, leftBucket: deck.leftBucket, rightBucket: deck.rightBucket, chosen: card.correctBucket })));
  const failed = applyWordSortAttempt(passed, 'verb', incorrect(failing, 6)).progress;
  expect(failed.levels.words.passed).toBe(true);
  expect(failed.levels.words.bestAccuracy).toBe(100);
});
it('reviews exact cards once, retains unresolved mistakes, and leaves scores and unlocks alone', () => {
  const first = applyWordSortAttempt(unlocked('verb'), 'verb', incorrect(attempt('verb', 'challenge'), 4)).progress;
  const pending = first.levels.challenge.pendingReview;
  const decks = buildWordSortReview(pending);
  expect(decks.flatMap(deck => deck.cards)).toHaveLength(4);
  const review: WordSortAttempt = { id: randomUUID(), level: 'challenge', review: true, responses: pending.map(ref => ({ ...ref, chosen: getWordSortCard(ref.cardId)!.correctBucket })) };
  incorrect(review, 1);
  const result = applyWordSortAttempt(first, 'verb', review);
  expect(result.progress.levels.challenge.pendingReview).toHaveLength(1);
  expect(result.progress.levels.challenge).toMatchObject({ attempts: 1, lastAccuracy: first.levels.challenge.lastAccuracy, bestAccuracy: first.levels.challenge.bestAccuracy, passed: first.levels.challenge.passed });
  expect(new Set(pending.map(reviewKey)).size).toBe(pending.length);
});
it('keeps a bounded window of processed attempt IDs that still blocks the latest retry', () => {
  let progress = readWordSortProgress(null, 'verb');
  let last = attempt('verb', 'words');
  for (let i = 0; i < 60; i++) {
    last = attempt('verb', 'words');
    progress = applyWordSortAttempt(progress, 'verb', last).progress;
  }
  expect(progress.processedAttemptIds).toHaveLength(50);
  expect(applyWordSortAttempt(progress, 'verb', last).duplicate).toBe(true);
});
it('only treats everyday noun/verb words as two-answer cards', () => {
  expect(getWordSortCard('word:noun:bus')!.alsoAccepts ?? []).not.toContain('verb');
  expect(getWordSortCard('word:verb:go')!.alsoAccepts ?? []).not.toContain('noun');
  expect(getWordSortCard('word:noun:water')!.alsoAccepts).toContain('verb');
});
it('does not accept a word-level alternate answer in a sentence', () => {
  expect(isAccepted(getWordSortCard('context:verb:work')!, 'noun')).toBe(false);
  expect(isAccepted(getWordSortCard('word:verb:work')!, 'noun')).toBe(true);
});
it('restores legacy completion without inventing extension passes', () => {
  const legacy = readWordSortProgress({ [WORD_SORT_GROUPS.noun]: { completed: true, accuracy: 89, round1: { passed: true, bestAccuracy: 89 } } }, 'noun');
  expect(legacy.levels.words.passed).toBe(true);
  expect(legacy.levels.words.bestAccuracy).toBe(89);
  expect(legacy.levels.sentences.passed).toBe(false);
  expect(legacy.levels.challenge.passed).toBe(false);
  expect(readWordSortProgress('{}', 'article', true).levels.words.passed).toBe(true);
  expect(readWordSortProgress('broken json', 'article').levels.words.passed).toBe(false);
});
it('rejects malformed, incomplete, repeated, and out-of-level cards', () => {
  const progress = unlocked('verb');
  expect(() => applyWordSortAttempt(progress, 'verb', {})).toThrow();
  const input = attempt('verb', 'challenge');
  expect(() => applyWordSortAttempt(progress, 'verb', { ...input, responses: input.responses.slice(1) })).toThrow();
  input.responses[0].cardId = 'not-a-card';
  expect(() => applyWordSortAttempt(progress, 'verb', input)).toThrow();
  const repeated = attempt('verb', 'challenge');
  repeated.responses[1] = repeated.responses[0];
  expect(() => applyWordSortAttempt(progress, 'verb', repeated)).toThrow();
});
