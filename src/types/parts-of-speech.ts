/**
 * Type definitions for the Parts of Speech Pattern Discovery Game
 * Teaches all 8 parts of speech through discovery-based learning
 */

// The 8 parts of speech
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'article';

// Fine-grained categories within each POS
export type POSCategory =
  // Noun categories
  | 'noun-person'
  | 'noun-place'
  | 'noun-thing'
  | 'noun-idea'
  | 'noun-gerund'        // Verb used as noun (swimming, working)
  // Verb categories
  | 'verb-action'
  | 'verb-state'
  | 'verb-helping'
  | 'verb-linking'
  // Pronoun categories
  | 'pronoun-subject'
  | 'pronoun-object'
  | 'pronoun-possessive'
  // Article/determiner categories
  | 'article-definite'
  | 'article-indefinite'
  | 'article-demonstrative'  // this, that, these, those
  | 'article-quantity'       // some, any, many, much, few
  // Adjective categories
  | 'adjective-descriptive'
  | 'adjective-quantity'
  | 'adjective-opinion'
  | 'adjective-after-be'     // The food is delicious.
  // Adverb categories
  | 'adverb-manner'          // slowly, carefully, well
  | 'adverb-frequency'       // always, usually, sometimes, never
  | 'adverb-degree'          // very, quite, really, too
  | 'adverb-time'            // yesterday, soon, still, already
  // Preposition categories
  | 'preposition-location'   // in, on, at, near, between
  | 'preposition-time'       // at, on, in, during, before, after
  | 'preposition-direction'  // to, from, into, out of, toward
  | 'preposition-collocation' // good at, interested in, afraid of
  // Conjunction categories
  | 'conjunction-coordinating'    // and, but, or, so, yet
  | 'conjunction-subordinating'   // when, because, although, if, until
  | 'conjunction-correlative'     // both...and, either...or, not only...but also
  // Application Bridge categories
  | 'bridge-verb-to-gerund'       // Verb transforms into gerund noun
  | 'bridge-prep-plus-noun'       // Preposition needs noun/gerund
  | 'bridge-adj-plus-infinitive'; // Adjective + infinitive pattern

// Grammatical role a word plays in a sentence
export type GrammaticalRole =
  | 'subject'
  | 'verb'
  | 'direct-object'
  | 'indirect-object'
  | 'modifier'
  | 'complement'
  | 'connector';

// A single word form in a word family
export interface WordFamilyMember {
  word: string;
  partOfSpeech: PartOfSpeech;
  usage: string;             // e.g., "I have a lot of work." (noun form)
}

// One contextual example sentence
export interface POSExample {
  sentence: string;          // Full sentence, may contain ___ for blank
  blank?: string;            // Correct fill-in if sentence has ___
  highlightWord: string;     // The word to highlight/underline
  role?: GrammaticalRole;    // The grammatical role of the highlighted word
  context?: string;          // Real-world context label (e.g., "Jobs in East Boston")
  explanation?: string;      // Why this word is this POS in this sentence
}

// Individual pattern (word + its POS info)
export interface POSPattern {
  id: string;                        // e.g., "verb-action-work", "noun-place-school"
  word: string;                      // The example word (e.g., "work", "school")
  partOfSpeech: PartOfSpeech;
  category: POSCategory;
  examples: POSExample[];            // 3-5 contextual sentences
  memoryTrick?: string;              // Memory aid
  commonError?: string;              // Common mistake (e.g., "Using as wrong POS")
  errorExplanation?: string;
  wordFamily?: WordFamilyMember[];   // Related forms (work/worker/working)
}

// Photo entry for the visual gallery in walkthroughs
export interface POSPhotoEntry {
  imageUrl: string;           // e.g. "https://images.unsplash.com/photo-xxx?w=400&q=80&auto=format&fit=crop"
  word: string;               // e.g. "doctor"
  partOfSpeech: PartOfSpeech;
  subcategoryLabel?: string;  // e.g. "Person", "Place", "Action"
  altText: string;
}

// Group of related patterns
export interface POSGroup {
  id: string;                        // e.g., "pos-1-verbs-intro", "pos-checkpoint-1"
  title: string;                     // e.g., "What is a Verb?"
  shortTitle: string;                // e.g., "Verbs" (for cards)
  pattern: string;                   // Rule explanation
  patternExample: string;            // Visual example
  colorClass: string;                // Tailwind color classes
  difficulty: 1 | 2 | 3;
  phase: POSPhase;
  prerequisite: string | null;       // ID of prerequisite group
  patterns: POSPattern[];
  maxRounds: 3 | 4 | 5;             // How many rounds this group has (3 = simpler, 5 = complex)
  memoryTrick?: string;              // Group-level memory trick
  icon?: string;                     // Emoji icon
  isCheckpoint?: boolean;
  reviewsGroups?: string[];          // For checkpoints: IDs of groups reviewed
  photoGallery?: POSPhotoEntry[];    // Visual anchors shown in the walkthrough intro
}

export type POSPhase =
  | 'foundation'
  | 'sentence-roles'
  | 'modifiers'
  | 'connectors'
  | 'application-bridge';

// ─── Exercise types ──────────────────────────────────────────────────────────

export type POSExerciseType =
  // Shared with gerund game (adapted)
  | 'pattern-choice'        // Choose the POS of a highlighted word
  | 'pattern-sorting'       // Sort words into POS buckets
  | 'sentence-completion'   // Fill in the blank with correct word
  | 'error-correction'      // Spot a common error and pick the correct form
  | 'odd-one-out'           // Find the word that is a different POS
  | 'contrast-pair'         // Compare two POS options for the same sentence context
  | 'word-family'           // Build word derivatives
  | 'mad-libs'              // Fill blanks using POS hints
  // POS-specific new types
  | 'pos-tagging'           // Tap words in a sentence to label their POS
  | 'sentence-builder'      // Drag words from bins to build a sentence
  | 'word-transform'        // Transform word between POS (work → worker)
  | 'function-match'        // Match highlighted word to its grammatical function
  | 'minimal-pair'          // Compare two sentences, identify what POS changed
  | 'photo-sort'            // Drag photos into POS bins
  | 'swipe-sort'            // Swipe each word/phrase left or right into a POS
  | 'sentence-diagram';     // Tap each chunk of a sentence and label its grammatical role

// photo-sort: one image card in the 2×2 grid
export interface PhotoSortItem {
  id: string;
  word: string;
  imageUrl: string;
  partOfSpeech: PartOfSpeech;
  subcategoryLabel?: string;
  altText: string;
}

// photo-sort exercise data
export interface POSPhotoSortData {
  items: PhotoSortItem[];      // always 4 items
  targetPOS: PartOfSpeech;
  multiSelect: boolean;        // true = tap ALL matching, false = tap THE one
  correctIds: string[];
}

// ─── Exercise-specific data structures ───────────────────────────────────────

// pos-tagging: students tap each word and select its POS
export interface TaggingToken {
  word: string;
  correctPOS: PartOfSpeech;
  isTarget: boolean;         // Should the student tag this word?
  isPunctuation?: boolean;   // Skip punctuation tokens
}

// sentence-builder: students drag words from bins to build a sentence
export interface BuilderSlot {
  id: string;
  partOfSpeech?: PartOfSpeech;
  correctWord: string;
  isProvided: boolean;       // Pre-filled (true) vs student fills (false)
}

// word-transform: change a word from one POS form to another
export interface WordTransformData {
  fromWord: string;
  fromPOS: PartOfSpeech;
  toPOS: PartOfSpeech;
  correctAnswer: string;
  hint?: string;             // e.g., "Add -ly to the adjective"
}

// function-match: identify the grammatical function of a highlighted word
export interface FunctionMatchData {
  sentence: string;
  targetWord: string;
  correctFunction: GrammaticalRole;
  distractors: GrammaticalRole[];
}

// minimal-pair: two sentences differing in one word's POS
export interface MinimalPairData {
  sentence1: string;
  sentence2: string;
  changedWord1: string;      // The word in sentence 1
  changedWord2: string;      // The word in sentence 2 (different POS)
  pos1: PartOfSpeech;
  pos2: PartOfSpeech;
  question: string;          // What to ask ("What part of speech is 'hard' in sentence 1?")
  correctAnswer: string;
}

// error-correction: pick the correct form to fix a targeted error
export interface POSErrorCorrectionData {
  sentence: string;
  prompt: string;
  correctWord: string;
  wrongWords: string[];          // Distractors to show in options
  commonError: string;           // The learner-facing error reminder
  explanation?: string;
}

// contrast-pair: choose the best-fit word when two close options are offered
export interface POSContrastPairData {
  sentence: string;
  prompt: string;
  correctWord: string;
  distractorWord: string;
  targetPOS: PartOfSpeech;
  distractorPOS: PartOfSpeech;
  explanation?: string;
}

// pattern-sorting bucket
export interface POSSortingItem {
  phrase: string;            // e.g., "run quickly"
  correctBucket: string; // PartOfSpeech for cross-POS sorting, or subcategory label for intra-POS sorting
  explanation?: string;
}

// swipe-sort: binary (or ternary) Tinder-style sorter
export interface POSSwipeSortCard {
  id: string;
  word: string;
  correctBucket: PartOfSpeech;
}

export interface POSSwipeSortData {
  leftBucket: PartOfSpeech;
  rightBucket: PartOfSpeech;
  cards: POSSwipeSortCard[];
}

// sentence-diagram: tap-to-label the grammatical role of each chunk
export interface POSDiagramChunk {
  id: string;
  text: string;
  correctRole: GrammaticalRole | null; // null = punctuation / non-target; auto-labeled
  isTarget: boolean;                    // only targets are labeled by the student
}

export interface POSDiagramData {
  sentence: string;
  chunks: POSDiagramChunk[];
  roles: GrammaticalRole[]; // which roles to offer (e.g. subject, verb, direct-object)
}

// odd-one-out item
export interface POSOddOneOutData {
  items: { word: string; partOfSpeech: PartOfSpeech; isIntruder: boolean }[];
  intruderWord: string;
  intruderPOS: PartOfSpeech;
  majorityPOS: PartOfSpeech;
}

// word-family node
export interface POSWordFamilyData {
  baseWord: string;
  basePOS: PartOfSpeech;
  nodes: { word: string; partOfSpeech: PartOfSpeech; isCorrect: boolean }[];
}

// mad-libs data
export interface POSMadLibsData {
  sentenceParts: { text: string; isBlank: boolean; requiredPOS?: PartOfSpeech; correctWord?: string }[];
  wordBank: { word: string; partOfSpeech: PartOfSpeech }[];
}

// ─── Main Exercise interface ──────────────────────────────────────────────────

export interface POSExercise {
  id: string;
  type: POSExerciseType;
  groupId: string;
  patternId: string;
  prompt: string;                          // Question text or sentence
  correctAnswer: string | string[];
  options?: string[];                      // For choice-based types
  optionPOS?: PartOfSpeech[];              // Parallel to options[]; POS for each choice (for feedback)
  completionMode?: 'choice' | 'text';     // sentence-completion: 'choice' = POS-diverse multiple choice
  explanation?: string;                    // Pedagogical explanation surfaced in feedback
  difficulty?: 1 | 2 | 3;
  showPattern: boolean;                    // Whether to show pattern hint
  realWorldContext?: string;               // Context label for the sentence
  highlightedWord?: string;               // Word to highlight in sentence
  choiceCount?: number;                     // graduated Round 1: display only N options (2, 3, or 4)
  // Type-specific fields
  taggingTokens?: TaggingToken[];          // pos-tagging
  builderSlots?: BuilderSlot[];           // sentence-builder
  wordTransform?: WordTransformData;       // word-transform
  functionMatch?: FunctionMatchData;       // function-match
  minimalPair?: MinimalPairData;           // minimal-pair
  sortingItems?: POSSortingItem[];         // pattern-sorting
  oddOneOutData?: POSOddOneOutData;        // odd-one-out
  wordFamilyData?: POSWordFamilyData;      // word-family
  madLibsData?: POSMadLibsData;            // mad-libs
  photoSortData?: POSPhotoSortData;        // photo-sort
  errorCorrection?: POSErrorCorrectionData; // error-correction
  contrastPair?: POSContrastPairData;      // contrast-pair
  swipeSortData?: POSSwipeSortData;        // swipe-sort
  diagramData?: POSDiagramData;            // sentence-diagram
}

// ─── Progress tracking ────────────────────────────────────────────────────────

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
export interface PartsOfSpeechContent {
  type: 'parts-of-speech';
  groupId?: string;
  roundMode?: POSRoundModeOverride;
  courseMapPreset?: boolean;
  courseMapTitle?: string;
  courseMapDirections?: string;
  exerciseTypes?: POSExerciseType[];
  roundSize?: number;
  roundOverrides?: POSPhaseRoundOverridesMap;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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
export const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  pronoun: 'Pronoun',
  article: 'Article',
};

// Short definitions shown in exercises
export const POS_DEFINITIONS: Record<PartOfSpeech, string> = {
  noun: 'A person, place, thing, or idea',
  verb: 'An action or state of being',
  adjective: 'Describes a noun',
  adverb: 'Describes a verb, adjective, or other adverb',
  preposition: 'Shows relationships between words (time, place, direction)',
  conjunction: 'Joins words, phrases, or clauses together',
  pronoun: 'Replaces a noun (I, you, he, she, it, we, they)',
  article: 'Specifies a noun (a, an, the, this, some)',
};

// Color classes per POS for consistent visual coding
export const POS_COLORS: Record<PartOfSpeech, string> = {
  noun: 'bg-blue-100 text-blue-800 border-blue-300',
  verb: 'bg-red-100 text-red-800 border-red-300',
  adjective: 'bg-amber-100 text-amber-800 border-amber-300',
  adverb: 'bg-purple-100 text-purple-800 border-purple-300',
  preposition: 'bg-teal-100 text-teal-800 border-teal-300',
  conjunction: 'bg-orange-100 text-orange-800 border-orange-300',
  pronoun: 'bg-green-100 text-green-800 border-green-300',
  article: 'bg-gray-100 text-gray-800 border-gray-300',
};
