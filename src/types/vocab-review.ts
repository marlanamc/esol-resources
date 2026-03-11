export type VocabReviewRating = "again" | "hard" | "good" | "easy";

export type VocabReviewFilterGroup = "all" | "month" | "week";

export interface VocabReviewFilter {
  key: string;
  label: string;
  shortLabel: string;
  group: VocabReviewFilterGroup;
  unitNumber: number | null;
  dueCount: number;
  newCount: number;
  totalCount: number;
}

export interface VocabReviewCard {
  id: string;
  term: string;
  definition: string;
  example: string | null;
  audioPath: string | null;
  sourceKeys: string[];
  sourceLabels: string[];
  unitNumbers: number[];
  topics: string[];
  sortOrder: number;
  step: number | null;
  dueAt: string | null;
  lastRating: VocabReviewRating | null;
  isNew: boolean;
  isDue: boolean;
}

export interface VocabReviewSummary {
  dueCount: number;
  newCount: number;
  totalCount: number;
  filters: VocabReviewFilter[];
  updatedAt: string;
}

export interface VocabReviewQueue {
  source: string;
  sourceLabel: string;
  cards: VocabReviewCard[];
  hasMore: boolean;
  totalCount: number;
  dueCount: number;
  newCount: number;
  limit: number;
}

export interface VocabReviewSubmissionResult {
  ok: true;
  cardId: string;
  rating: VocabReviewRating;
  step: number;
  dueAt: string;
  shouldRepeatInSession: boolean;
}
