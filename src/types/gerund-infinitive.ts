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
  | 'purpose'          // Infinitive showing purpose (I study to learn)
  | 'suggestion'       // Social suggestion phrases (How about, What about, Have you tried, Have you thought of)
  | 'purpose-contrast'; // use X for + gerund vs use X to + infinitive

// Individual pattern within a group
export interface GerundInfinitivePattern {
  id: string;                    // e.g., "prep-in", "verb-enjoy", "adj-happy"
  /** Cue before the blank in most categories. For `purpose`, this is often an internal bucket label; walkthrough UI prefers the last word before `___` when showing examples. */
  trigger: string;
  correctForm: VerbForm;         // Which form to use
  category: PatternCategory;
  examples: PatternExample[];
  commonError?: string;          // Common mistake (e.g., "interested FOR/AT")
  errorExplanation?: string;     // Detailed explanation of why students make this error
  memoryTrick?: string;          // Memory aid for this specific pattern
  correctPreposition?: string;   // For preposition-choice: which preposition (in, at, for, etc.)
  // Personal response fields
  question?: string;             // Personal question (e.g., "How do you stay healthy?")
  patternHint?: string;          // Pattern hint for personal questions
  exampleAnswer?: string;        // Example answer for personal questions
  requiredPattern?: RegExp;      // Validation pattern for personal questions
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
  difficulty: 1 | 2 | 3;         // 1=foundation, 2=core-verbs/development, 3=mastery
  phase?: 'foundation' | 'core-verbs' | 'development' | 'mastery'; // Optional phase for UI organization
  prerequisite: string | null;   // ID of prerequisite group
  patterns: GerundInfinitivePattern[];
  memoryTrick?: string;          // Group-level memory trick (e.g., "PREP = ING")
  icon?: string;                 // Emoji icon for the group
  /** 1–2 short sentences: why this pattern exists in English (optional; Foundation often sets this). */
  bigPicture?: string;
  // Checkpoint-specific fields
  isCheckpoint?: boolean;        // True if this is a review checkpoint
  reviewsGroups?: string[];      // For checkpoints: IDs of groups to review
}

// Exercise types for the game
export type GIExerciseType =
  | 'pattern-choice'        // Choose gerund or infinitive to complete sentence
  | 'rule-application'      // Identify what comes before the blank
  | 'pattern-identifier'    // Identify what part of speech comes before the highlighted word
  | 'sentence-completion'   // Complete real-world sentences
  | 'pattern-sorting'       // Sort phrases into gerund/infinitive buckets
  | 'error-correction'      // Find and fix common errors
  | 'meaning-distinction'   // For stop/remember/try - choose based on meaning
  | 'preposition-choice'   // Choose correct preposition (interested ___ learning → in)
  | 'combo-challenge'       // Choose BOTH preposition AND verb form (interested ___ ___ → in learning)
  // New variety types
  | 'match-pair'           // Match trigger + verb form (card matching)
  | 'drag-order'            // Drag sentence chunks into correct order
  | 'dialogue-completion'   // Complete two blanks in a conversation
  | 'scenario-choice'      // Real-world scenario + complete the sentence
  | 'chain-sentences'       // 2–3 related sentences with blanks (narrative)
  | 'memory-match'          // Flip cards to match trigger + form (mastery/checkpoints)
  | 'rapid-fire'            // Quick succession of questions, no next (mastery/checkpoints)
  | 'personal-response';    // Personal questions requiring typed answers with pattern validation

// For match-pair and memory-match exercises
export interface MatchPair {
  trigger: string;   // e.g. "interested in", "want"
  form: string;      // e.g. "learning", "to learn"
}

// For drag-order exercises
export interface DragChunk {
  text: string;
  order: number;
}

// For dialogue-completion exercises
export interface DialogueLine {
  speaker: string;   // e.g. "A", "B"
  text: string;      // With ___ for blank
  correctAnswer: string;
}

// For chain-sentences exercises
export interface ChainSentence {
  prompt: string;       // Sentence with ___
  correctAnswer: string;
}

// For rapid-fire: lightweight item to avoid circular ref
export interface RapidFireItem {
  prompt: string;
  correctAnswer: string | string[];
  options?: string[];
}

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
  triggerText?: string;                  // Exact trigger phrase before the blank when available
  showPattern: boolean;                  // Whether to show pattern hint
  difficulty?: 1 | 2 | 3;
  // New variety types
  matchPairs?: MatchPair[];              // match-pair, memory-match
  dragChunks?: string[];                 // drag-order (shuffled chunks)
  dialogueLines?: DialogueLine[];        // dialogue-completion
  scenario?: string;                     // scenario-choice (e.g. "Job interview")
  chainSentences?: ChainSentence[];     // chain-sentences
  rapidFireItems?: RapidFireItem[];    // rapid-fire (quick succession)
  // Personal response fields
  question?: string;                     // personal-response: The question (e.g., "How do you stay healthy?")
  patternHint?: string;                  // personal-response: Pattern hint (e.g., "by + gerund")
  exampleAnswer?: string;                // personal-response: Example answer
  requiredPattern?: RegExp;              // personal-response: Pattern regex for validation
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
export const GI_MASTERY_THRESHOLD = 90;  // 90% accuracy for mastery in Round 2
export const GI_ROUND1_SIZE = 10;        // Exercises in Round 1
export const GI_ROUND2_SIZE = 8;         // Exercises in Round 2 (targeted)
export const GI_CHECKPOINT_SIZE = 10;    // Exercises in Checkpoint Reviews
export const GI_REVIEW_SIZE = 12;        // Exercises in Mixed Review
export const GI_FINAL_SIZE = 20;         // Exercises in Final Challenge
export const GI_REVIEW_UNLOCK_GROUPS = 5; // Groups needed to unlock Review
export const GI_ADAPTIVE_HINT_STREAK = 5; // Streak needed to hide hints
