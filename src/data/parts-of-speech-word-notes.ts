import type { PartOfSpeech } from '@/types/parts-of-speech';

/**
 * Words that are genuinely more than one part of speech.
 *
 * Swipe-sort decks are assembled at runtime from a frequency word bank, and
 * that bank files each word under exactly one part of speech. Several of the
 * most common words belong under two, so a learner who picks the other correct
 * answer was right and would still have been marked wrong.
 *
 * `accepts` makes every listed bucket count as correct. `note` replaces the
 * generic category definition in the correction panel, so the moment teaches
 * the double meaning instead of scolding.
 *
 * Keyed by lowercase word. Words absent from this map are unambiguous as far
 * as these decks are concerned and fall back to POS_DEFINITIONS.
 *
 * Learner-facing copy: keep each note to one or two short sentences.
 */
export interface POSWordNote {
  accepts: PartOfSpeech[];
  note: string;
}

export const POS_WORD_NOTES: Record<string, POSWordNote> = {
  // ── Noun / verb ──────────────────────────────────────────────────────────
  time: { accepts: ['noun', 'verb'], note: '"Time" is usually a Noun. You can also time a race.' },
  way: { accepts: ['noun', 'adverb'], note: '"Way" is usually a Noun, as in "the way home".' },
  hand: { accepts: ['noun', 'verb'], note: '"Hand" is usually a Noun. You can also hand someone a book.' },
  part: { accepts: ['noun', 'verb'], note: '"Part" is usually a Noun, as in "part of the story".' },
  work: { accepts: ['noun', 'verb'], note: '"Work" can be a Noun or a Verb. Both are correct.' },
  place: { accepts: ['noun', 'verb'], note: '"Place" is usually a Noun. You can also place something on a table.' },
  water: { accepts: ['noun', 'verb'], note: '"Water" is usually a Noun. You can also water a plant.' },
  help: { accepts: ['noun', 'verb'], note: '"Help" can be a Noun or a Verb. Both are correct.' },
  play: { accepts: ['noun', 'verb'], note: '"Play" is usually a Verb. A play at the theater is a Noun.' },
  run: { accepts: ['noun', 'verb'], note: '"Run" is usually a Verb. You can also go for a run.' },
  need: { accepts: ['noun', 'verb'], note: '"Need" can be a Noun or a Verb. Both are correct.' },
  end: { accepts: ['noun', 'verb'], note: '"End" can be a Noun or a Verb. Both are correct.' },
  use: { accepts: ['noun', 'verb'], note: '"Use" can be a Noun or a Verb. Both are correct.' },
  change: { accepts: ['noun', 'verb'], note: '"Change" can be a Noun or a Verb. Both are correct.' },
  answer: { accepts: ['noun', 'verb'], note: '"Answer" can be a Noun or a Verb. Both are correct.' },
  study: { accepts: ['noun', 'verb'], note: '"Study" can be a Noun or a Verb. Both are correct.' },
  point: { accepts: ['noun', 'verb'], note: '"Point" can be a Noun or a Verb. Both are correct.' },
  order: { accepts: ['noun', 'verb'], note: '"Order" can be a Noun or a Verb. Both are correct.' },
  turn: { accepts: ['noun', 'verb'], note: '"Turn" can be a Noun or a Verb. Both are correct.' },
  call: { accepts: ['noun', 'verb'], note: '"Call" can be a Noun or a Verb. Both are correct.' },
  look: { accepts: ['noun', 'verb'], note: '"Look" is usually a Verb. You can also take a look.' },

  // ── Adjective / other ────────────────────────────────────────────────────
  right: { accepts: ['adjective', 'adverb', 'noun'], note: '"Right" is usually an Adjective, as in "the right answer".' },
  last: { accepts: ['adjective', 'verb', 'adverb'], note: '"Last" is usually an Adjective. A movie can also last two hours.' },
  long: { accepts: ['adjective', 'adverb'], note: '"Long" is usually an Adjective, as in "a long day".' },
  little: { accepts: ['adjective', 'adverb'], note: '"Little" is usually an Adjective, as in "a little dog".' },
  own: { accepts: ['adjective', 'verb'], note: '"Own" is usually an Adjective, as in "my own room". You can also own a car.' },
  other: { accepts: ['adjective', 'pronoun'], note: '"Other" is usually an Adjective, as in "the other day".' },
  well: { accepts: ['adverb', 'adjective'], note: '"Well" is usually an Adverb, as in "she sings well".' },
  fast: { accepts: ['adjective', 'adverb'], note: '"Fast" can be an Adjective or an Adverb. Both are correct.' },
  hard: { accepts: ['adjective', 'adverb'], note: '"Hard" can be an Adjective or an Adverb. Both are correct.' },
  early: { accepts: ['adjective', 'adverb'], note: '"Early" can be an Adjective or an Adverb. Both are correct.' },

  // ── Article / pronoun / conjunction / preposition overlaps ───────────────
  that: { accepts: ['article', 'pronoun', 'conjunction'], note: '"That" has several jobs. Here it points to a noun, like "that book".' },
  this: { accepts: ['article', 'pronoun'], note: '"This" points to a noun, like "this book". Alone it can replace one.' },
  these: { accepts: ['article', 'pronoun'], note: '"These" points to nouns, like "these books". Alone it can replace them.' },
  those: { accepts: ['article', 'pronoun'], note: '"Those" points to nouns, like "those books". Alone it can replace them.' },
  some: { accepts: ['article', 'pronoun'], note: '"Some" points to a noun, like "some water". Alone it can replace one.' },
  any: { accepts: ['article', 'pronoun'], note: '"Any" points to a noun, like "any day". Alone it can replace one.' },
  each: { accepts: ['article', 'pronoun'], note: '"Each" points to a noun, like "each student". Alone it can replace one.' },
  few: { accepts: ['article', 'adjective'], note: '"Few" points to a noun, like "a few days".' },
  her: { accepts: ['pronoun', 'article'], note: '"Her" is a Pronoun. It can also show who owns something: "her book".' },
  since: { accepts: ['conjunction', 'preposition'], note: '"Since" can join two parts of a sentence or come before a time.' },
  before: { accepts: ['preposition', 'conjunction'], note: '"Before" usually comes before a noun or a time.' },
  after: { accepts: ['preposition', 'conjunction'], note: '"After" usually comes before a noun or a time.' },
  while: { accepts: ['conjunction', 'noun'], note: '"While" joins two parts of a sentence: "while I cook".' },
  so: { accepts: ['conjunction', 'adverb'], note: '"So" usually joins two parts of a sentence: "I was tired, so I slept."' },
  as: { accepts: ['conjunction', 'preposition', 'adverb'], note: '"As" has several jobs. It often joins parts of a sentence.' },
  like: { accepts: ['verb', 'preposition'], note: '"Like" is usually a Verb. It can also mean "similar to".' },
  just: { accepts: ['adverb', 'adjective'], note: '"Just" is usually an Adverb, as in "I just arrived".' },
  still: { accepts: ['adverb', 'adjective'], note: '"Still" is usually an Adverb, as in "he is still here".' },
  about: { accepts: ['preposition', 'adverb'], note: '"About" is usually a Preposition, as in "a book about cats".' },
  around: { accepts: ['preposition', 'adverb'], note: '"Around" can be a Preposition or an Adverb. Both are correct.' },
  down: { accepts: ['preposition', 'adverb'], note: '"Down" can be a Preposition or an Adverb. Both are correct.' },
  up: { accepts: ['preposition', 'adverb'], note: '"Up" can be a Preposition or an Adverb. Both are correct.' },
  over: { accepts: ['preposition', 'adverb'], note: '"Over" can be a Preposition or an Adverb. Both are correct.' },
  out: { accepts: ['preposition', 'adverb'], note: '"Out" can be a Preposition or an Adverb. Both are correct.' },
  off: { accepts: ['preposition', 'adverb'], note: '"Off" can be a Preposition or an Adverb. Both are correct.' },
};

/** Look up a note by word. Case- and whitespace-insensitive. */
export function getWordNote(word: string): POSWordNote | undefined {
  return POS_WORD_NOTES[word.trim().toLowerCase()];
}
