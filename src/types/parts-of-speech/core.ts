// Core part-of-speech word/group types and display constants.

/**
 * Type definitions for the Parts of Speech Pattern Discovery Game
 * Teaches all 8 parts of speech through discovery-based learning
 */

export type POSPhase =
  | 'foundation'
  | 'sentence-roles'
  | 'modifiers'
  | 'connectors'
  | 'application-bridge';

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
