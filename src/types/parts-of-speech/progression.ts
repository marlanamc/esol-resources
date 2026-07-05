// Game phases, rounds, progression state, and tuning constants.


import type { POSGroup, POSPhase } from "./core";
import type { POSExercise, POSExerciseType } from "./exercises";

// ─── Exercise types ──────────────────────────────────────────────────────────

export interface POSPatternPerformance {
  patternId: string;
  seen: number;
  correct: number;
  misses: number;
  round1Misses: number;
  round2Misses: number;
  lastSeenAt?: string;
  lastMissedAt?: string;
  needsReview?: boolean;
}

export type POSRoundMode = 'round1' | 'round2' | 'round3' | 'round4' | 'round5' | 'review' | 'final';
export type POSGroupStage = 'not-started' | 'in-progress' | 'passed' | 'mastered';

export interface POSRoundProgress {
  attempts: number;
  bestAccuracy: number;
  lastAccuracy: number;
  lastAttemptDate?: string;
  passed: boolean;
}

// Per-round pass thresholds (index = round number - 1)
// Round 1: 70%, Round 2: 75%, Round 3: 80%, Round 4: 85%, Round 5: 90%
export const POS_ROUND_THRESHOLDS = [70, 75, 80, 85, 90] as const;

// Human-readable labels for each round
export const POS_ROUND_LABELS: Record<string, { name: string; verb: string }> = {
  round1: { name: 'Round 1 · Notice',  verb: 'Discover' },
  round2: { name: 'Round 2 · Sort',    verb: 'Group' },
  round3: { name: 'Round 3 · Connect', verb: 'See in context' },
  round4: { name: 'Round 4 · Build',   verb: 'Use it' },
  round5: { name: 'Round 5 · Master',  verb: 'Full fluency' },
};

export interface POSGroupProgress {
  completed: boolean;
  accuracy: number;                        // 0-100
  exercisesCompleted?: number;
  correctAnswers?: number;
  lastAttemptDate?: string;
  attempts: number;
  unlockedAt?: string;
  locked?: boolean;
  unlocked?: boolean;                      // Newly unlocked flag
  stage?: POSGroupStage;
  highestRoundPassed?: 0 | 1 | 2 | 3 | 4 | 5;  // Highest round number passed (0 = none)
  round1?: POSRoundProgress;
  round2?: POSRoundProgress;
  round3?: POSRoundProgress;
  round4?: POSRoundProgress;
  round5?: POSRoundProgress;
  patternStats?: Record<string, POSPatternPerformance>;
  reviewDue?: boolean;
}

// ─── Game state ───────────────────────────────────────────────────────────────

export type POSGamePhase = 'selection' | 'intro' | 'exercise' | 'results';

export interface POSExerciseAnswer {
  exerciseId: string;
  patternId: string;
  userAnswer: string | string[];
  correct: boolean;
  timestamp: number;
}

export interface POSGameState {
  phase: POSGamePhase;
  currentGroup: POSGroup | null;
  roundMode: POSRoundMode;
  exercises: POSExercise[];
  currentIndex: number;
  answers: POSExerciseAnswer[];
  categoryData: Record<string, POSGroupProgress>;
  hideExplanations: boolean;
  streak: number;
  totalPoints: number;
}

export interface POSRoundResults {
  groupId: string;
  roundMode: POSRoundMode;
  exercisesCompleted: number;
  correctAnswers: number;
  accuracy: number;
  completed: boolean;
  streak: number;
  bestStreak: number;
  pointsAwarded: number;
  unlocked?: boolean;
  newAchievements?: string[];
  updatedCategoryData?: Record<string, POSGroupProgress>;
  missedPatternIds?: string[];
  nextStep?: 'round2' | 'round3' | 'round4' | 'round5' | 'selection' | 'next-group' | 'review' | 'final' | 'finish';
  masteryAchieved?: boolean;
}

export interface POSRoundOverride {
  roundSize?: number;
  exerciseTypes?: POSExerciseType[];
}

export type POSRoundModeOverride = Exclude<POSRoundMode, 'review' | 'final'>;
export type POSRoundOverrideByMode = Partial<Record<POSRoundModeOverride, POSRoundOverride>>;

export interface POSPhaseRoundOverrides {
  /** Override for all rounds in this phase unless a round-specific override is provided. */
  roundSize?: number;
  exerciseTypes?: POSExerciseType[];
  /** Optional per-round overrides for stricter control and CSV-driven tuning. */
  rounds?: POSRoundOverrideByMode;
}

export type POSPhaseRoundOverridesMap = Partial<Record<POSPhase, POSPhaseRoundOverrides>>;

// Activity content type for database

export const POS_UNLOCK_THRESHOLD = 70;    // Round 1 pass = unlock next group
export const POS_MASTERY_THRESHOLD = 90;   // Round 5 (or maxRounds) pass = mastered
export const POS_ROUND1_SIZE = 8;
export const POS_ROUND2_SIZE = 8;
export const POS_ROUND3_SIZE = 8;
export const POS_ROUND4_SIZE = 8;
export const POS_ROUND5_SIZE = 10;
export const POS_CHECKPOINT_SIZE = 10;
export const POS_REVIEW_SIZE = 12;
export const POS_FINAL_SIZE = 20;
export const POS_REVIEW_UNLOCK_GROUPS = 5;
export const POS_ADAPTIVE_HINT_STREAK = 5;

// Display labels for parts of speech
