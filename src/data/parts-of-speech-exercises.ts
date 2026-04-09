/**
 * Exercise generation for the Parts of Speech Pattern Discovery Game.
 * Generates a mix of exercise types from group pattern data.
 */

import type {
  POSExercise,
  POSExerciseType,
  POSGroup,
  POSPattern,
  POSRoundMode,
  PartOfSpeech,
  POSSortingItem,
} from '@/types/parts-of-speech';
import {
  ALL_POS_GROUPS,
  getPOSGroup,
} from '@/data/parts-of-speech-groups';
import {
  POS_ROUND1_SIZE,
  POS_ROUND2_SIZE,
  POS_ROUND3_SIZE,
  POS_ROUND4_SIZE,
  POS_ROUND5_SIZE,
  POS_CHECKPOINT_SIZE,
} from '@/types/parts-of-speech';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function validatePOSAnswer(exercise: POSExercise, userAnswer: string): boolean {
  const correct = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];
  return correct.some(c => normalize(c) === normalize(userAnswer));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Map POS to simple labels used in answer options
const POS_OPTION_LABELS: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'article',
];

// Fallback cloze distractors: one or two common words per POS from the game's East Boston vocabulary.
// Used when a group's sibling patterns can't supply enough cross-POS distractors (e.g., all-verb groups).
const CLOZE_DISTRACTOR_BANK: { word: string; partOfSpeech: PartOfSpeech }[] = [
  { word: 'doctor',    partOfSpeech: 'noun' },
  { word: 'school',    partOfSpeech: 'noun' },
  { word: 'walks',     partOfSpeech: 'verb' },
  { word: 'has',       partOfSpeech: 'verb' },
  { word: 'quickly',   partOfSpeech: 'adverb' },
  { word: 'always',    partOfSpeech: 'adverb' },
  { word: 'healthy',   partOfSpeech: 'adjective' },
  { word: 'bilingual', partOfSpeech: 'adjective' },
  { word: 'in',        partOfSpeech: 'preposition' },
  { word: 'at',        partOfSpeech: 'preposition' },
  { word: 'and',       partOfSpeech: 'conjunction' },
  { word: 'but',       partOfSpeech: 'conjunction' },
  { word: 'she',       partOfSpeech: 'pronoun' },
  { word: 'they',      partOfSpeech: 'pronoun' },
  { word: 'the',       partOfSpeech: 'article' },
  { word: 'a',         partOfSpeech: 'article' },
];

function getPOSOptions(correct: PartOfSpeech, count = 4): string[] {
  const distractors = POS_OPTION_LABELS.filter(p => p !== correct);
  return shuffle([correct, ...pickRandom(distractors, count - 1)]);
}

let exerciseCounter = 0;
function nextId(groupId: string, type: string): string {
  return `${groupId}-${type}-${++exerciseCounter}`;
}

// ─── Individual exercise factories ───────────────────────────────────────────

function makePatternChoice(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise {
  const example = pickRandom(pattern.examples, 1)[0];
  const sentence = example.blank
    ? example.sentence.replace('___', `__${example.blank}__`)
    : example.sentence;

  return {
    id: nextId(group.id, 'pc'),
    type: 'pattern-choice',
    groupId: group.id,
    patternId: pattern.id,
    prompt: sentence,
    highlightedWord: example.highlightWord,
    correctAnswer: pattern.partOfSpeech,
    options: getPOSOptions(pattern.partOfSpeech),
    explanation: example.explanation,
    showPattern,
    realWorldContext: example.context,
  };
}

function makeSentenceCompletion(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const examplesWithBlanks = pattern.examples.filter(e => e.blank);
  if (!examplesWithBlanks.length) return null;
  const example = pickRandom(examplesWithBlanks, 1)[0];
  const correctWord = example.blank!;
  const correctPOS = pattern.partOfSpeech;

  // Collect cross-POS distractors from sibling patterns (max 1 per wrong POS)
  const usedPOS = new Set<PartOfSpeech>([correctPOS]);
  const distractors: { word: string; partOfSpeech: PartOfSpeech }[] = [];
  for (const p of group.patterns) {
    if (p.id === pattern.id) continue;
    if (usedPOS.has(p.partOfSpeech)) continue;
    distractors.push({ word: p.word.split('/')[0].trim(), partOfSpeech: p.partOfSpeech });
    usedPOS.add(p.partOfSpeech);
    if (distractors.length === 3) break;
  }

  // Pad from fallback bank if needed
  if (distractors.length < 3) {
    for (const entry of CLOZE_DISTRACTOR_BANK) {
      if (distractors.length === 3) break;
      if (usedPOS.has(entry.partOfSpeech)) continue;
      if (entry.word === correctWord) continue;
      distractors.push(entry);
      usedPOS.add(entry.partOfSpeech);
    }
  }

  // Shuffle correct + distractors together, keeping word and POS in sync
  const tuples = shuffle([
    { word: correctWord, pos: correctPOS },
    ...distractors.slice(0, 3).map(d => ({ word: d.word, pos: d.partOfSpeech })),
  ]);

  return {
    id: nextId(group.id, 'sc'),
    type: 'sentence-completion',
    groupId: group.id,
    patternId: pattern.id,
    prompt: example.sentence,
    correctAnswer: correctWord,
    options: tuples.map(t => t.word),
    optionPOS: tuples.map(t => t.pos),
    completionMode: 'choice',
    showPattern,
    realWorldContext: example.context,
  };
}

function makeOddOneOut(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const targetPOS = pattern.partOfSpeech;
  const samePOSWords = new Set<string>();
  const diffPOSWords = new Array<{word: string; pos: PartOfSpeech}>();

  samePOSWords.add(pattern.word.split('/')[0].trim());

  for (const p of group.patterns) {
    const word = p.word.split('/')[0].trim();
    if (p.partOfSpeech === targetPOS) {
      samePOSWords.add(word);
    } else {
      diffPOSWords.push({word, pos: p.partOfSpeech});
    }
  }

  for (const entry of CLOZE_DISTRACTOR_BANK) {
    if (entry.partOfSpeech === targetPOS) {
      samePOSWords.add(entry.word);
    } else {
      diffPOSWords.push({word: entry.word, pos: entry.partOfSpeech});
    }
  }

  const majorityArr = Array.from(samePOSWords);
  if (majorityArr.length < 3 || diffPOSWords.length === 0) return null;

  const selectedMajority = pickRandom(majorityArr, 3);
  const intruder = pickRandom(diffPOSWords, 1)[0];

  const items = shuffle([
    ...selectedMajority.map(w => ({ word: w, partOfSpeech: targetPOS, isIntruder: false })),
    { word: intruder.word, partOfSpeech: intruder.pos, isIntruder: true },
  ]);

  return {
    id: nextId(group.id, 'ooo'),
    type: 'odd-one-out',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Find the word that belongs to a different part of speech.`,
    correctAnswer: intruder.word,
    oddOneOutData: {
      items,
      intruderWord: intruder.word,
      intruderPOS: intruder.pos,
      majorityPOS: targetPOS,
    },
    showPattern,
  };
}

// Maps POSCategory to a human-readable subcategory bucket label for intra-POS sorting
const SUBCATEGORY_LABELS: Partial<Record<string, string>> = {
  'verb-action':    'Action Verb',
  'verb-state':     'State Verb',
  'verb-helping':   'Helping Verb',
  'verb-linking':   'Linking Verb',
  'noun-person':    'Person',
  'noun-place':     'Place',
  'noun-thing':     'Thing',
  'noun-idea':      'Idea or Concept',
  'pronoun-subject':    'Subject (I / we)',
  'pronoun-object':     'Object (me / them)',
  'pronoun-possessive': 'Possessive (my / their)',
  'adjective-descriptive': 'Describes look or feel',
  'adjective-quantity':    'How many or how much',
  'adjective-opinion':     'Personal opinion',
  'adverb-manner':     'How? (manner)',
  'adverb-frequency':  'How often?',
  'adverb-time':       'When?',
  'preposition-location':  'Where?',
  'preposition-time':      'When? (time)',
  'preposition-direction': 'Which way?',
  'conjunction-coordinating':   'Joining (and, but, or)',
  'conjunction-subordinating':  'Explaining (because, when)',
};

/**
 * Intra-POS subcategory sorting: sorts words within the SAME POS into meaningful sub-groups.
 * Example: verb group → "Action Verb" vs "State Verb" buckets.
 * Generated when makePatternSorting returns null (i.e., all patterns share the same POS).
 */
function makeSubcategorySorting(
  group: POSGroup,
  patterns: POSPattern[],
  showPattern: boolean,
): POSExercise | null {
  // Only useful when all patterns share one POS (otherwise use makePatternSorting)
  const distinctPOS = [...new Set(patterns.map(p => p.partOfSpeech))];
  if (distinctPOS.length > 1) return null;

  // Collect subcategory labels for each pattern
  const items: POSSortingItem[] = [];
  for (const p of patterns) {
    const bucket = SUBCATEGORY_LABELS[p.category];
    if (!bucket) continue;
    const example = p.examples[0];
    if (!example) continue;
    items.push({
      phrase: p.word.split('/')[0].trim(),
      correctBucket: bucket,
      explanation: example.explanation,
    });
  }

  const distinctBuckets = [...new Set(items.map(i => i.correctBucket))];
  // Need at least 2 different subcategory labels and 4+ items to make it worthwhile
  if (distinctBuckets.length < 2 || items.length < 4) return null;

  return {
    id: nextId(group.id, 'ss'),
    type: 'pattern-sorting',
    groupId: group.id,
    patternId: patterns[0].id,
    prompt: `Sort these ${distinctPOS[0]}s into the right type:`,
    correctAnswer: items.map(i => i.correctBucket),
    sortingItems: shuffle(items),
    showPattern,
  };
}

function makePatternSorting(
  group: POSGroup,
  patterns: POSPattern[],
  showPattern: boolean,
): POSExercise | null {
  // Need at least 2 different POS in the group
  const distinctPOS = [...new Set(patterns.map(p => p.partOfSpeech))];
  if (distinctPOS.length < 2) return null;

  const items: POSSortingItem[] = patterns.flatMap(p =>
    p.examples.slice(0, 1).map(e => ({
      phrase: e.highlightWord,
      correctBucket: p.partOfSpeech,
      explanation: e.explanation,
    })),
  ).slice(0, 6);

  if (items.length < 4) return null;

  return {
    id: nextId(group.id, 'ps'),
    type: 'pattern-sorting',
    groupId: group.id,
    patternId: patterns[0].id,
    prompt: `Sort these words into the correct part of speech:`,
    correctAnswer: items.map(i => i.correctBucket),
    sortingItems: items,
    showPattern,
  };
}

function makeWordFamilyBuilder(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  if (!pattern.wordFamily || pattern.wordFamily.length < 2) return null;
  
  const baseWord = pattern.word.split('/')[0].trim();
  const nodes = pattern.wordFamily.map(m => ({
    word: m.word,
    partOfSpeech: m.partOfSpeech,
    isCorrect: false
  }));

  if (!nodes.find(n => n.word === baseWord)) {
    nodes.push({ word: baseWord, partOfSpeech: pattern.partOfSpeech, isCorrect: false });
  }

  const distinctPOS = [...new Set(nodes.map(n => n.partOfSpeech))];
  if (distinctPOS.length < 2) return null;

  return {
    id: nextId(group.id, 'wfb'),
    type: 'word-family',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Match the related words to their correct part of speech.`,
    correctAnswer: nodes.map(n => n.word),
    wordFamilyData: {
      baseWord,
      basePOS: pattern.partOfSpeech,
      nodes: shuffle(nodes),
    },
    showPattern,
  };
}

function makeMadLibs(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const example = pattern.examples[0];
  if (!example || !example.blank) return null;

  const parts = example.sentence.split('___');
  if (parts.length < 2) return null;

  const builtParts = [];
  builtParts.push({ text: parts[0], isBlank: false });
  builtParts.push({ text: '', isBlank: true, requiredPOS: pattern.partOfSpeech, correctWord: example.blank });
  builtParts.push({ text: parts[1], isBlank: false });

  const numDistractors = 3;
  const wordBank = [...builtParts.filter(p => p.isBlank).map(p => ({ word: p.correctWord as string, partOfSpeech: p.requiredPOS as PartOfSpeech }))];
  for (const entry of shuffle(CLOZE_DISTRACTOR_BANK)) {
    if (wordBank.length >= 1 + numDistractors) break;
    if (wordBank.some(w => w.word === entry.word)) continue;
    wordBank.push({ word: entry.word, partOfSpeech: entry.partOfSpeech });
  }

  return {
    id: nextId(group.id, 'ml'),
    type: 'mad-libs',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Fill in the missing words to complete the sentence!`,
    correctAnswer: example.blank,
    madLibsData: {
      sentenceParts: builtParts,
      wordBank: shuffle(wordBank),
    },
    showPattern,
    realWorldContext: example.context,
  };
}

function makePOSTagging(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const example = pattern.examples.find(e => e.role);
  if (!example) return null;

  // Build tokens from the sentence
  const sentence = example.blank
    ? example.sentence.replace('___', example.blank)
    : example.sentence;
  const words = sentence.split(' ');

  const tokens = words.map(word => {
    const clean = word.replace(/[.,!?']/g, '');
    const isTarget = normalize(clean) === normalize(example.highlightWord.split(' ')[0]);
    return {
      word,
      correctPOS: pattern.partOfSpeech,
      isTarget,
      isPunctuation: /^[.,!?]$/.test(word),
    };
  });

  return {
    id: nextId(group.id, 'pt'),
    type: 'pos-tagging',
    groupId: group.id,
    patternId: pattern.id,
    prompt: 'Tap the highlighted word and select its part of speech.',
    correctAnswer: pattern.partOfSpeech,
    highlightedWord: example.highlightWord,
    taggingTokens: tokens,
    options: getPOSOptions(pattern.partOfSpeech),
    showPattern,
    realWorldContext: example.context,
  };
}

function makeWordTransform(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  if (!pattern.wordFamily || pattern.wordFamily.length < 2) return null;
  const baseWord = pattern.word.split('/')[0].trim();
  // Prefer a family member with a different surface form (avoids work(verb) → work(noun))
  const target = pattern.wordFamily.find(m => m.word !== baseWord) ?? pattern.wordFamily[0];
  // If the only option is the same word, skip (zero-derivation isn't a useful transformation exercise)
  if (target.word === baseWord) return null;

  // Build candidate pool: other wordFamily members + base word
  const candidatePool: string[] = [];
  for (const member of pattern.wordFamily) {
    if (member.word !== target.word && !candidatePool.includes(member.word)) {
      candidatePool.push(member.word);
    }
  }
  if (baseWord !== target.word && !candidatePool.includes(baseWord)) {
    candidatePool.push(baseWord);
  }

  // Pad with morphological variants if we don't have 3 distractors
  if (candidatePool.length < 3) {
    const allKnown = new Set([target.word, ...candidatePool]);
    const suffixes = ['ed', 'ing', 's', 'er', 'ly'];
    const root = baseWord.replace(/e$/, ''); // simple stem for suffix attachment
    for (const suffix of suffixes) {
      if (candidatePool.length >= 3) break;
      const variant = root + suffix;
      if (!allKnown.has(variant)) {
        candidatePool.push(variant);
        allKnown.add(variant);
      }
    }
  }

  const distractors = pickRandom(candidatePool, 3);

  const tuples = shuffle([
    { word: target.word },
    ...distractors.map(w => ({ word: w })),
  ]);

  return {
    id: nextId(group.id, 'wt'),
    type: 'word-transform',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Change "${baseWord}" (${pattern.partOfSpeech}) to a ${target.partOfSpeech}.`,
    correctAnswer: target.word,
    options: tuples.map(t => t.word),
    wordTransform: {
      fromWord: baseWord,
      fromPOS: pattern.partOfSpeech,
      toPOS: target.partOfSpeech,
      correctAnswer: target.word,
      hint: target.usage,
    },
    showPattern,
  };
}

function makeFunctionMatch(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const example = pattern.examples.find(e => e.role);
  if (!example?.role) return null;

  const allRoles = ['subject', 'verb', 'direct-object', 'modifier', 'connector'] as const;
  const distractors = allRoles.filter(r => r !== example.role);

  return {
    id: nextId(group.id, 'fm'),
    type: 'function-match',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `What is the grammatical role of "${example.highlightWord}"?`,
    correctAnswer: example.role,
    highlightedWord: example.highlightWord,
    functionMatch: {
      sentence: example.blank
        ? example.sentence.replace('___', example.blank)
        : example.sentence,
      targetWord: example.highlightWord,
      correctFunction: example.role as 'subject' | 'verb' | 'direct-object' | 'modifier' | 'connector',
      distractors: pickRandom([...distractors], 3) as ('subject' | 'verb' | 'direct-object' | 'modifier' | 'connector')[],
    },
    options: shuffle([example.role, ...pickRandom([...distractors], 3)]),
    showPattern,
    realWorldContext: example.context,
  };
}

// ─── Round generator ──────────────────────────────────────────────────────────

type ExerciseFactory = (
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
) => POSExercise | null;

const FACTORY_MAP: Record<POSExerciseType, ExerciseFactory | null> = {
  'pattern-choice': makePatternChoice,
  'sentence-completion': makeSentenceCompletion,
  'odd-one-out': makeOddOneOut,
  'pos-tagging': makePOSTagging,
  'word-transform': makeWordTransform,
  'function-match': makeFunctionMatch,
  'pattern-sorting': null, // multi-pattern, handled separately
  'word-family': makeWordFamilyBuilder,
  'mad-libs': makeMadLibs,
  'minimal-pair': null,    // handled separately
  'sentence-builder': null, // handled separately
};

/**
 * Generate exercises for a Round 1 (introduction)
 */
export function generateRound1Exercises(group: POSGroup): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  const exercises: POSExercise[] = [];
  const patterns = group.patterns;
  if (!patterns.length) return exercises;

  // Per pattern: 1 pattern-choice + 1 sentence-completion or pos-tagging
  for (const pattern of patterns) {
    exercises.push(makePatternChoice(group, pattern, true));

    const sc = makeSentenceCompletion(group, pattern, true);
    if (sc) exercises.push(sc);
    else {
      const pt = makePOSTagging(group, pattern, true);
      if (pt) exercises.push(pt);
    }
  }

  // Add a sorting exercise: cross-POS sort if mixed, else intra-POS subcategory sort
  const sort = makePatternSorting(group, patterns, true) ?? makeSubcategorySorting(group, patterns, true);
  if (sort) exercises.push(sort);

  // Add a word-transform if any pattern has wordFamily
  for (const pattern of patterns) {
    const wt = makeWordTransform(group, pattern, true);
    if (wt) { exercises.push(wt); break; }
  }

  return shuffle(exercises).slice(0, POS_ROUND1_SIZE);
}

/**
 * Generate exercises for Round 2 (targeted review of misses)
 */
export function generateRound2Exercises(
  group: POSGroup,
  missedPatternIds: string[],
): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  const patterns = missedPatternIds.length
    ? group.patterns.filter(p => missedPatternIds.includes(p.id))
    : group.patterns;

  const exercises: POSExercise[] = [];

  for (const pattern of patterns) {
    // Use harder exercise types in round 2
    const fm = makeFunctionMatch(group, pattern, false);
    if (fm) exercises.push(fm);

    const pt = makePOSTagging(group, pattern, false);
    if (pt) exercises.push(pt);

    const ooo = makeOddOneOut(group, pattern, false);
    if (ooo) exercises.push(ooo);
  }

  // Add mad-libs for mastery (where we used rapid-fire)
  for (const pattern of patterns) {
    const ml = makeMadLibs(group, pattern, false);
    if (ml) { exercises.push(ml); break; }
  }

  return shuffle(exercises).slice(0, POS_ROUND2_SIZE);
}

/**
 * Generate exercises for a checkpoint (mixed review)
 */
export function generateCheckpointExercises(group: POSGroup): POSExercise[] {
  if (!group.reviewsGroups?.length) return [];

  const reviewGroups = group.reviewsGroups
    .map(id => ALL_POS_GROUPS.find(g => g.id === id))
    .filter((g): g is POSGroup => !!g && !g.isCheckpoint);

  const exercises: POSExercise[] = [];

  for (const rg of reviewGroups) {
    for (const pattern of rg.patterns.slice(0, 2)) {
      exercises.push(makePatternChoice(rg, pattern, false));

      const ml = makeMadLibs(rg, pattern, false);
      if (ml) exercises.push(ml);
    }

    const wfb = makeWordFamilyBuilder(rg, rg.patterns[0], false);
    if (wfb) exercises.push(wfb);
  }

  return shuffle(exercises).slice(0, POS_CHECKPOINT_SIZE);
}

// ─── New factory: sentence-builder ───────────────────────────────────────────

/**
 * Builds a sentence-builder exercise from a pattern example.
 * Pre-fills context words and leaves the target POS slot(s) for the student.
 * Requires a pattern with at least one example that has a `role` so we know
 * which slot to leave empty. Falls back gracefully if data is insufficient.
 */
function makeSentenceBuilder(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  // Prefer an example with both a blank and a role so we can build meaningful slots
  const example = pattern.examples.find(e => e.blank && e.role) ?? pattern.examples.find(e => e.blank);
  if (!example?.blank) return null;

  const sentence = example.sentence.replace('___', example.blank);
  const words = sentence.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
  if (words.length < 3) return null;

  const targetWord = example.blank;
  const targetPOS = pattern.partOfSpeech;

  // Build slots: pre-fill everything except the target word
  const slots = words.map((w, i) => ({
    id: `slot-${i}`,
    partOfSpeech: normalize(w) === normalize(targetWord) ? targetPOS : ('noun' as PartOfSpeech),
    correctWord: w,
    isProvided: normalize(w) !== normalize(targetWord),
  }));

  // Collect distractor words from the distractor bank (same length as target ± 3 chars)
  const distractors = CLOZE_DISTRACTOR_BANK
    .filter(d => d.partOfSpeech !== targetPOS && d.word !== targetWord)
    .slice(0, 3)
    .map(d => d.word);

  // Word bank: correct word + distractors
  const wordBank = shuffle([targetWord, ...distractors]);

  return {
    id: nextId(group.id, 'sb'),
    type: 'sentence-builder',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Build the sentence — drag the correct ${targetPOS} into the blank.`,
    correctAnswer: targetWord,
    builderSlots: slots,
    options: wordBank,
    showPattern,
    realWorldContext: example.context,
    explanation: example.explanation,
  };
}

// ─── New factory: minimal-pair ────────────────────────────────────────────────

/**
 * Builds a minimal-pair exercise from a pattern's wordFamily.
 * Shows two sentences where the same root word appears in different POS roles
 * (e.g. "I pay the RENT" vs "I RENT an apartment") and asks which POS it is in sentence 1.
 * Requires a wordFamily with at least one member of a different POS AND a usage example.
 */
function makeMinimalPair(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  if (!pattern.wordFamily || pattern.wordFamily.length < 1) return null;

  const baseWord = pattern.word.split('/')[0].trim();
  const basePOS = pattern.partOfSpeech;
  const baseExample = pattern.examples.find(e => e.blank) ?? pattern.examples[0];
  if (!baseExample) return null;

  // Find a family member with a different POS that has a usage sentence
  const altMember = pattern.wordFamily.find(m => m.partOfSpeech !== basePOS && m.usage);
  if (!altMember) return null;

  const sentence1 = baseExample.blank
    ? baseExample.sentence.replace('___', baseExample.blank)
    : baseExample.sentence;
  const sentence2 = altMember.usage;

  return {
    id: nextId(group.id, 'mp'),
    type: 'minimal-pair',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Both sentences use "${baseWord}" — but differently. What part of speech is it in Sentence 1?`,
    correctAnswer: basePOS,
    options: getPOSOptions(basePOS, 4),
    minimalPair: {
      sentence1,
      sentence2,
      changedWord1: baseExample.highlightWord,
      changedWord2: altMember.word,
      pos1: basePOS,
      pos2: altMember.partOfSpeech,
      question: `What part of speech is "${baseExample.highlightWord}" in Sentence 1?`,
      correctAnswer: basePOS,
    },
    showPattern,
    realWorldContext: baseExample.context,
    explanation: `In Sentence 1, "${baseExample.highlightWord}" is a ${basePOS}. In Sentence 2, "${altMember.word}" is a ${altMember.partOfSpeech}.`,
  };
}

// ─── Round 3: Connect (words in sentence context, no hints) ──────────────────

/**
 * Round 3 — Connect: students see the target word in full sentence context.
 * Core types: pos-tagging (tap & label) + function-match (grammatical role).
 * No pattern hints. Builds understanding of how POS works in real sentences.
 */
export function generateRound3Exercises(group: POSGroup): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  const exercises: POSExercise[] = [];

  for (const pattern of group.patterns) {
    // pos-tagging: tap the highlighted word and select its POS
    const pt = makePOSTagging(group, pattern, false);
    if (pt) exercises.push(pt);
    else {
      // Fallback: pattern-choice with a different example than Round 1 used
      exercises.push(makePatternChoice(group, pattern, false));
    }

    // function-match: what role does this word play? (subject / verb / modifier / etc.)
    const fm = makeFunctionMatch(group, pattern, false);
    if (fm) exercises.push(fm);
  }

  // Add odd-one-out at group level (cross-POS recognition under pressure)
  for (const pattern of group.patterns) {
    const ooo = makeOddOneOut(group, pattern, false);
    if (ooo) { exercises.push(ooo); break; }
  }

  return shuffle(exercises).slice(0, POS_ROUND3_SIZE);
}

// ─── Round 4: Build (production — using the language) ────────────────────────

/**
 * Round 4 — Build: students actively use the target POS in sentences.
 * Core types: sentence-builder + mad-libs + minimal-pair (for wordFamily patterns).
 * No hints. Activates the two previously-stubbed exercise types.
 */
export function generateRound4Exercises(group: POSGroup): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  const exercises: POSExercise[] = [];

  for (const pattern of group.patterns) {
    // sentence-builder: drag words to fill the slot (primary)
    const sb = makeSentenceBuilder(group, pattern, false);
    if (sb) exercises.push(sb);
    else {
      // Fallback to mad-libs (same concept, simpler interaction)
      const ml = makeMadLibs(group, pattern, false);
      if (ml) exercises.push(ml);
    }

    // minimal-pair: same root word, different POS (great for verbs, nouns with wordFamily)
    const mp = makeMinimalPair(group, pattern, false);
    if (mp) exercises.push(mp);
  }

  // Word-family builder at group level (match all forms of a word to their POS)
  for (const pattern of group.patterns) {
    const wfb = makeWordFamilyBuilder(group, pattern, false);
    if (wfb) { exercises.push(wfb); break; }
  }

  // Word-transform: change a word from one POS to another
  for (const pattern of group.patterns) {
    const wt = makeWordTransform(group, pattern, false);
    if (wt) { exercises.push(wt); break; }
  }

  return shuffle(exercises).slice(0, POS_ROUND4_SIZE);
}

// ─── Round 5: Master (full fluency, hardest mix) ──────────────────────────────

/**
 * Round 5 — Master: every exercise type at maximum difficulty, no hints.
 * Core types: sentence-completion (cloze) + mixed hard types.
 * The student needs 90% to earn the mastery badge.
 */
export function generateRound5Exercises(
  group: POSGroup,
  missedPatternIds?: string[],
): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  // Weight toward missed patterns if available
  const targetPatterns = missedPatternIds?.length
    ? [
        ...group.patterns.filter(p => missedPatternIds.includes(p.id)),
        ...group.patterns.filter(p => !missedPatternIds.includes(p.id)),
      ]
    : group.patterns;

  const exercises: POSExercise[] = [];

  for (const pattern of targetPatterns) {
    // sentence-completion (cloze) is the hardest — primary type for R5
    const sc = makeSentenceCompletion(group, pattern, false);
    if (sc) exercises.push(sc);
    else {
      // Fallback: pattern-choice with a harder example (3rd example if available)
      const ex = pattern.examples[2] ?? pattern.examples[0];
      const sentence = ex.blank ? ex.sentence.replace('___', `__${ex.blank}__`) : ex.sentence;
      exercises.push({
        id: nextId(group.id, 'pc-r5'),
        type: 'pattern-choice',
        groupId: group.id,
        patternId: pattern.id,
        prompt: sentence,
        highlightedWord: ex.highlightWord,
        correctAnswer: pattern.partOfSpeech,
        options: getPOSOptions(pattern.partOfSpeech),
        explanation: ex.explanation,
        showPattern: false,
        realWorldContext: ex.context,
      });
    }

    // function-match: role identification at full difficulty
    const fm = makeFunctionMatch(group, pattern, false);
    if (fm) exercises.push(fm);
  }

  // Odd-one-out (cross-POS recognition)
  for (const pattern of targetPatterns) {
    const ooo = makeOddOneOut(group, pattern, false);
    if (ooo) { exercises.push(ooo); break; }
  }

  // Mad-libs as a final production exercise
  for (const pattern of targetPatterns) {
    const ml = makeMadLibs(group, pattern, false);
    if (ml) { exercises.push(ml); break; }
  }

  return shuffle(exercises).slice(0, POS_ROUND5_SIZE);
}

/**
 * Main entry point: generate exercises for a group + round
 */
export function generatePOSExercises(
  groupId: string,
  roundMode: POSRoundMode,
  missedPatternIds?: string[],
): POSExercise[] {
  const group = getPOSGroup(groupId);
  if (!group) return [];

  switch (roundMode) {
    case 'round1':
      return generateRound1Exercises(group);
    case 'round2':
      return generateRound2Exercises(group, missedPatternIds ?? []);
    case 'round3':
      return generateRound3Exercises(group);
    case 'round4':
      return generateRound4Exercises(group);
    case 'round5':
      return generateRound5Exercises(group, missedPatternIds);
    case 'review':
    case 'final':
      return generateCheckpointExercises(group);
    default:
      return generateRound1Exercises(group);
  }
}
