import type { PartOfSpeech } from '@/types/parts-of-speech';
import { cardsFor, contrastsFor, getWordSortCard } from './content';
import { WORD_SORT_GROUPS, WORD_SORT_LEVELS, WORD_SORT_THRESHOLDS } from './types';
import type { ReviewCard, WordSortAttempt, WordSortDeck, WordSortLevel, WordSortLevelProgress, WordSortProgress, WordSortTarget } from './types';

const MAX_PROCESSED_ATTEMPT_IDS = 50;
const blankLevel =(): WordSortLevelProgress => ({ attempts: 0, bestAccuracy: 0, lastAccuracy: 0, passed: false, pendingReview: [], recentCardIds: [] });
export const reviewKey = (card: ReviewCard) => `${card.cardId}|${card.leftBucket}|${card.rightBucket}`;
const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
export function parseWordSortCategoryData(value: unknown): Record<string, unknown> {
  if (typeof value !== 'string') return object(value);
  try { return object(JSON.parse(value)); } catch { return {}; }
}
export function readWordSortProgress(categoryData: unknown, target: WordSortTarget, completed = false): WordSortProgress {
  const category = parseWordSortCategoryData(categoryData);
  const saved = object(category.wordSort);
  const levels = object(saved.levels);
  const result: WordSortProgress = { version: 1, levels: { words: blankLevel(), sentences: blankLevel(), challenge: blankLevel() }, processedAttemptIds: [] };
  if (saved.version === 1) {
    for (const level of WORD_SORT_LEVELS) {
      const entry = object(levels[level]);
      const pending = Array.isArray(entry.pendingReview) ? entry.pendingReview : [];
      const validPending = pending.filter((item): item is ReviewCard => {
        const ref = object(item);
        const card = typeof ref.cardId === 'string' ? getWordSortCard(ref.cardId) : undefined;
        return !!card && validPair(target, level, ref.leftBucket, ref.rightBucket) &&
          [ref.leftBucket, ref.rightBucket].includes(card.correctBucket) &&
          cardsFor(card.correctBucket, level).some(candidate => candidate.id === card.id);
      });
      result.levels[level] = {
        attempts: Math.floor(number(entry.attempts)), bestAccuracy: Math.min(100, number(entry.bestAccuracy)),
        lastAccuracy: Math.min(100, number(entry.lastAccuracy)), passed: entry.passed === true,
        pendingReview: [...new Map(validPending.map(ref => [reviewKey(ref), ref])).values()],
        recentCardIds: Array.isArray(entry.recentCardIds) ? entry.recentCardIds.filter((id): id is string => typeof id === 'string') : [],
      };
    }
    result.processedAttemptIds = Array.isArray(saved.processedAttemptIds) ? saved.processedAttemptIds.filter((id): id is string => typeof id === 'string') : [];
  }
  const legacy = object(category[WORD_SORT_GROUPS[target]]);
  const round = object(legacy.round1);
  if (completed || legacy.completed === true || round.passed === true || number(legacy.highestRoundPassed) >= 1) {
    result.levels.words.passed = true;
    result.levels.words.bestAccuracy = Math.max(result.levels.words.bestAccuracy, Math.min(100, number(round.bestAccuracy || legacy.accuracy)));
  }
  return result;
}
export function isWordSortLevelUnlocked(progress: WordSortProgress, level: WordSortLevel): boolean {
  const index = WORD_SORT_LEVELS.indexOf(level);
  return index === 0 || progress.levels[WORD_SORT_LEVELS[index - 1]].passed;
}
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function buildWordSortDecks(target: WordSortTarget, level: WordSortLevel, recent: string[] = [], random: () => number = Math.random): WordSortDeck[] {
  const used = new Set<string>();
  const recentSet = new Set(recent);
  const contrasts = shuffle(contrastsFor(target, level), random);
  const take = (pos: PartOfSpeech) => {
    const articleRepeat = level === 'words' && pos === 'article';
    const pool = shuffle(cardsFor(pos, level).filter(card => articleRepeat || !used.has(card.id)), random);
    pool.sort((a, b) => Number(recentSet.has(a.id)) - Number(recentSet.has(b.id)));
    const chosen = pool.slice(0, 3);
    if (chosen.length !== 3) throw new Error('Not enough cards for this level.');
    chosen.forEach(card => used.add(card.id));
    return chosen;
  };
  return Array.from({ length: 3 }, (_, index) => {
    const contrast = contrasts[index % contrasts.length];
    return { leftBucket: contrast, rightBucket: target, cards: shuffle([...take(contrast), ...take(target)], random) };
  });
}
export function buildWordSortReview(refs: ReviewCard[], random: () => number = Math.random): WordSortDeck[] {
  const decks: WordSortDeck[] = [];
  // Shuffle all queued cards, then group adjacent matching buckets into short decks.
  for (const ref of shuffle(refs, random)) {
    const card = getWordSortCard(ref.cardId);
    if (!card) continue;
    const last = decks.at(-1);
    if (last && last.leftBucket === ref.leftBucket && last.rightBucket === ref.rightBucket && last.cards.length < 6) last.cards.push(card);
    else decks.push({ leftBucket: ref.leftBucket, rightBucket: ref.rightBucket, cards: [card] });
  }
  return decks;
}
function validPair(target: WordSortTarget, level: WordSortLevel, left: unknown, right: unknown): boolean {
  return right === target && contrastsFor(target, level).includes(left as PartOfSpeech);
}
export function applyWordSortAttempt(progress: WordSortProgress, target: WordSortTarget, input: unknown): { progress: WordSortProgress; accuracy: number; passed: boolean; duplicate: boolean } {
  const attempt = object(input);
  if (typeof attempt.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(attempt.id) ||
    !WORD_SORT_LEVELS.includes(attempt.level as WordSortLevel) || typeof attempt.review !== 'boolean') throw new Error('Invalid Word Sort attempt.');
  const level = attempt.level as WordSortLevel;
  const previous = progress.levels[level];
  if (progress.processedAttemptIds.includes(attempt.id)) return { progress, accuracy: previous.lastAccuracy, passed: previous.passed, duplicate: true };
  if (!isWordSortLevelUnlocked(progress, level)) throw new Error('Pass the previous level first.');
  if (!Array.isArray(attempt.responses) || !attempt.responses.length || attempt.responses.length > 512) throw new Error('Invalid card responses.');
  const refs = new Set<string>();
  const seen = new Set<string>();
  const queue = new Map(previous.pendingReview.map(ref => [reviewKey(ref), ref]));
  const missed: ReviewCard[] = [];
  let correct = 0;
  for (const raw of attempt.responses) {
    const response = object(raw);
    const card = typeof response.cardId === 'string' ? getWordSortCard(response.cardId) : undefined;
    if (!card || !validPair(target, level, response.leftBucket, response.rightBucket) ||
      ![response.leftBucket, response.rightBucket].includes(card.correctBucket) ||
      ![response.leftBucket, response.rightBucket].includes(response.chosen) ||
      !cardsFor(card.correctBucket, level).some(candidate => candidate.id === card.id)) throw new Error('This card does not belong to this level.');
    const ref: ReviewCard = { cardId: card.id, leftBucket: response.leftBucket as PartOfSpeech, rightBucket: target };
    const key = reviewKey(ref);
    if (attempt.review) {
      if (refs.has(key) || !queue.has(key)) throw new Error('Review cards have changed. Reload and try again.');
    } else if (seen.has(card.id) && !(level === 'words' && card.correctBucket === 'article')) throw new Error('Repeated card in attempt.');
    refs.add(key); seen.add(card.id);
    const accepted = response.chosen === card.correctBucket || (!card.sentence && card.alsoAccepts?.includes(response.chosen as PartOfSpeech));
    if (accepted) { correct++; queue.delete(key); }
    else missed.push(ref);
  }
  if (!attempt.review) {
    if (attempt.responses.length !== 18) throw new Error('Complete all three decks before saving.');
    for (let offset = 0; offset < 18; offset += 6) {
      const deck = attempt.responses.slice(offset, offset + 6) as WordSortAttempt['responses'];
      if (new Set(deck.map(ref => ref.cardId)).size !== 6 ||
        deck.some(ref => ref.leftBucket !== deck[0].leftBucket) ||
        deck.filter(ref => getWordSortCard(ref.cardId)?.correctBucket === target).length !== 3) throw new Error('Each deck must have three cards per category.');
    }
  } else if (refs.size !== previous.pendingReview.length) throw new Error('Complete all queued review cards before saving.');
  missed.forEach(ref => queue.set(reviewKey(ref), ref));
  const accuracy = Math.round(correct / attempt.responses.length * 100);
  const passed = correct / attempt.responses.length * 100 >= WORD_SORT_THRESHOLDS[level];
  const updated: WordSortLevelProgress = attempt.review
    ? { ...previous, pendingReview: [...queue.values()] }
    : { attempts: previous.attempts + 1, bestAccuracy: Math.max(previous.bestAccuracy, accuracy), lastAccuracy: accuracy,
      passed: previous.passed || passed, pendingReview: [...queue.values()], recentCardIds: [...seen] };
  // Only the latest attempt is ever retried, so a short window of IDs is enough
  // to block duplicate saves without growing the saved progress forever.
  const processedAttemptIds = [...progress.processedAttemptIds, attempt.id].slice(-MAX_PROCESSED_ATTEMPT_IDS);
  return { progress: { ...progress, levels: { ...progress.levels, [level]: updated }, processedAttemptIds }, accuracy, passed, duplicate: false };
}
