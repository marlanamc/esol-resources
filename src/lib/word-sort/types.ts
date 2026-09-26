import type { PartOfSpeech, POSSwipeSortCard } from '@/types/parts-of-speech';

export type WordSortTarget = 'verb' | 'noun' | 'pronoun' | 'article';
export type WordSortLevel = 'words' | 'sentences' | 'challenge';
export interface WordSortConfig { target: WordSortTarget }
export const WORD_SORT_LEVELS = ['words', 'sentences', 'challenge'] as const;
export const WORD_SORT_THRESHOLDS = { words: 70, sentences: 75, challenge: 80 } as const;
export const WORD_SORT_LABELS = { words: 'Words', sentences: 'Sentences', challenge: 'Challenge' } as const;
export const WORD_SORT_ACTIVITIES: Record<string, WordSortConfig> = {
  'parts-of-speech-word-sort-guided': { target: 'verb' },
  'parts-of-speech-word-sort-nouns-guided': { target: 'noun' },
  'parts-of-speech-word-sort-pronouns-guided': { target: 'pronoun' },
  'parts-of-speech-word-sort-articles-guided': { target: 'article' },
};
export const WORD_SORT_GROUPS = { verb: 'pos-1-verbs', noun: 'pos-2-nouns', pronoun: 'pos-3-pronouns', article: 'pos-4-articles' } as const;
export interface ReviewCard {
  cardId: string;
  leftBucket: PartOfSpeech;
  rightBucket: PartOfSpeech;
}
export interface SortResponse extends ReviewCard { chosen: PartOfSpeech }
export interface WordSortAttempt {
  id: string;
  level: WordSortLevel;
  review: boolean;
  responses: SortResponse[];
}
export interface WordSortLevelProgress {
  attempts: number;
  bestAccuracy: number;
  lastAccuracy: number;
  passed: boolean;
  pendingReview: ReviewCard[];
  recentCardIds: string[];
}
export interface WordSortProgress {
  version: 1;
  levels: Record<WordSortLevel, WordSortLevelProgress>;
  processedAttemptIds: string[];
}
export interface WordSortDeck {
  leftBucket: PartOfSpeech;
  rightBucket: PartOfSpeech;
  cards: POSSwipeSortCard[];
}
