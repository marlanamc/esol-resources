// Exercise type union and per-exercise data payloads.


import type { GrammaticalRole, PartOfSpeech } from "./core";
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
