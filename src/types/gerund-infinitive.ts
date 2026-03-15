/**
 * Type definitions for the Gerunds & Infinitives Pattern Discovery Game
 * Organizes patterns by groups for pattern-first learning before rules
 */

// The form that follows the trigger word
export type VerbForm = 'gerund' | 'infinitive' | 'both';

// Categories of patterns
export type PatternCategory =
  | 'preposition'      // After prepositions → gerund (interested in learning)
  | 'verb-gerund'      // Verbs that take gerund (enjoy, finish, avoid)
  | 'verb-infinitive'  // Verbs that take infinitive (want, hope, plan)
  | 'adjective'        // Adjective + infinitive (happy to help)
  | 'noun'             // Noun + infinitive (ability to speak)
  | 'go-activity'      // GO + gerund (go swimming)
  | 'subject'          // Gerund as subject (Swimming is fun)
  | 'both-ok'          // Verbs that take both with same meaning (begin, start)
  | 'meaning-change'   // Verbs where form changes meaning (stop, remember, try)
  | 'to-preposition'   // "TO" as preposition trap (look forward to + gerund)
  | 'preposition-choice' // Choose correct preposition (interested in vs good at)
  | 'purpose';         // Infinitive showing purpose (I study to learn)

// Individual pattern within a group
export interface GerundInfinitivePattern {
  id: string;                    // e.g., "prep-in", "verb-enjoy", "adj-happy"
  trigger: string;               // The word/phrase before the verb (e.g., "interested in", "enjoy", "happy")
  correctForm: VerbForm;         // Which form to use
  category: PatternCategory;
  examples: PatternExample[];
  commonError?: string;          // Common mistake (e.g., "interested FOR/AT")
  errorExplanation?: string;     // Detailed explanation of why students make this error
  memoryTrick?: string;          // Memory aid for this specific pattern
  correctPreposition?: string;   // For preposition-choice: which preposition (in, at, for, etc.)
}

export interface PatternExample {
  sentence: string;              // Full sentence with blank or highlighted form
  blank: string;                 // The correct answer for the blank
  context?: string;              // Real-world context (e.g., "Job interview")
  explanation?: string;          // Why this form is used
}

// Pattern group (equivalent to VerbGroup in irregular verbs)
export interface GerundInfinitiveGroup {
  id: string;                    // e.g., "group-1", "group-2a", "checkpoint-1"
  title: string;                 // e.g., "After Preposition = Gerund"
  shortTitle: string;            // e.g., "Prepositions" (for cards)
  pattern: string;               // Rule explanation
  patternExample: string;        // Visual example "interested in learning"
  colorClass: string;            // Tailwind color classes
  difficulty: 1 | 2 | 3;         // 1=foundation, 2=development, 3=mastery
  prerequisite: string | null;   // ID of prerequisite group
  patterns: GerundInfinitivePattern[];
  memoryTrick?: string;          // Group-level memory trick (e.g., "PREP = ING")
  icon?: string;                 // Emoji icon for the group
  // Checkpoint-specific fields
  isCheckpoint?: boolean;        // True if this is a review checkpoint
  reviewsGroups?: string[];      // For checkpoints: IDs of groups to review
}

// Exercise types for the game
export type GIExerciseType =
  | 'pattern-choice'        // Choose gerund or infinitive to complete sentence
  | 'rule-application'      // Identify what comes before the blank
  | 'sentence-completion'   // Complete real-world sentences
  | 'pattern-sorting'       // Sort phrases into gerund/infinitive buckets
  | 'error-correction'      // Find and fix common errors
  | 'meaning-distinction'   // For stop/remember/try - choose based on meaning
  | 'preposition-choice'    // Choose correct preposition (interested ___ learning → in)
  | 'combo-challenge';      // Choose BOTH preposition AND verb form (interested ___ ___ → in learning)

// Individual exercise
export interface GIExercise {
  id: string;
  type: GIExerciseType;
  groupId: string;
  patternId: string;
  prompt: string;                        // Question text or sentence
  correctAnswer: string | string[];      // Accepted answer(s)
  options?: string[];                    // For choice-based exercises
  errorTokens?: ErrorToken[];            // For error-correction exercises
  meaningContext?: MeaningContext;       // For meaning-distinction exercises
  sortingItems?: SortingItem[];          // For pattern-sorting exercises
  realWorldContext?: string;             // Context like "Job interview"
  baseVerb?: string;                     // Base form hint (e.g., "be")
  highlightedWord?: string;              // For rule-application: the gerund/infinitive to highlight
  showPattern: boolean;                  // Whether to show pattern hint
  difficulty?: 1 | 2 | 3;
}

// For error-correction exercises
export interface ErrorToken {
  text: string;
  isError: boolean;
  correction?: string;                   // What it should be
}

// For meaning-distinction exercises (stop/remember/try)
export interface MeaningContext {
  verb: 'stop' | 'remember' | 'try';
  gerundMeaning: string;                 // e.g., "quit the habit"
  infinitiveMeaning: string;             // e.g., "pause to do something"
  scenario: 'past' | 'future' | 'experiment' | 'effort' | 'quit' | 'pause';
}

// For pattern-sorting exercises
export interface SortingItem {
  phrase: string;                        // e.g., "interested in ___"
  correctBucket: 'gerund' | 'infinitive';
  explanation?: string;
}

// Performance tracking for individual patterns
export interface PatternPerformance {
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

// Round progress tracking (same structure as irregular verbs)
export type GIRoundMode = 'round1' | 'round2' | 'review' | 'final';
export type GIGroupStage = 'not-started' | 'passed' | 'mastered';

export interface GIRoundProgress {
  attempts: number;
  bestAccuracy: number;
  lastAccuracy: number;
  lastAttemptDate?: string;
  passed: boolean;
}

// Group progress (equivalent to GroupProgress in irregular verbs)
export interface GIGroupProgress {
  completed: boolean;
  accuracy: number;                      // 0-100
  exercisesCompleted?: number;
  correctAnswers?: number;
  lastAttemptDate?: string;
  attempts: number;
  unlockedAt?: string;
  locked?: boolean;
  streak?: number;
  unlocked?: boolean;                    // Newly unlocked flag
  stage?: GIGroupStage;
  round1?: GIRoundProgress;
  round2?: GIRoundProgress;
  patternStats?: Record<string, PatternPerformance>;
  reviewDue?: boolean;
}

// User preferences
export interface GIUserPreferences {
  userId: string;
  hideExplanations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Activity content type for database
export interface GerundInfinitiveContent {
  type: 'gerund-infinitive';
  groupId?: string;                      // Specific group or null for all
  exerciseTypes?: GIExerciseType[];      // Limit exercise types
  roundSize?: number;                    // Exercises per round (default: 10)
}

// Exercise answer tracking
export interface GIExerciseAnswer {
  exerciseId: string;
  patternId: string;
  userAnswer: string | string[];
  correct: boolean;
  timestamp: number;
}

// Game state
export type GIGamePhase = 'selection' | 'intro' | 'exercise' | 'results';

export interface GIGameState {
  phase: GIGamePhase;
  currentGroup: GerundInfinitiveGroup | null;
  roundMode: GIRoundMode;
  exercises: GIExercise[];
  currentIndex: number;
  answers: GIExerciseAnswer[];
  categoryData: Record<string, GIGroupProgress>;
  hideExplanations: boolean;
  streak: number;
  totalPoints: number;
}

// Round results
export interface GIRoundResults {
  groupId: string;
  roundMode: GIRoundMode;
  exercisesCompleted: number;
  correctAnswers: number;
  accuracy: number;                      // 0-100
  completed: boolean;                    // true if accuracy >= 80%
  streak: number;
  bestStreak: number;
  pointsAwarded: number;
  unlocked?: boolean;                    // true if next group unlocked
  newAchievements?: string[];
  updatedCategoryData?: Record<string, GIGroupProgress>;
  missedPatternIds?: string[];
  nextStep?: 'round2' | 'selection' | 'next-group' | 'review' | 'final' | 'finish';
  masteryAchieved?: boolean;
  reviewDue?: boolean;
}

// Constants
export const GI_UNLOCK_THRESHOLD = 80;   // 80% accuracy to unlock next group
export const GI_MASTERY_THRESHOLD = 85;  // 85% accuracy for mastery in Round 2
export const GI_ROUND1_SIZE = 10;        // Exercises in Round 1
export const GI_ROUND2_SIZE = 8;         // Exercises in Round 2 (targeted)
export const GI_CHECKPOINT_SIZE = 10;    // Exercises in Checkpoint Reviews
export const GI_REVIEW_SIZE = 12;        // Exercises in Mixed Review
export const GI_FINAL_SIZE = 20;         // Exercises in Final Challenge
export const GI_REVIEW_UNLOCK_GROUPS = 5; // Groups needed to unlock Review
export const GI_ADAPTIVE_HINT_STREAK = 5; // Streak needed to hide hints
