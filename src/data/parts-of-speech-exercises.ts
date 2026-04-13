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
  POSPhase,
  PartOfSpeech,
  POSSortingItem,
  PhotoSortItem,
  WordFamilyMember,
} from '@/types/parts-of-speech';
import {
  PHOTO_SORT_DISTRACTOR_BANK,
  buildPhotoGalleryFromWords,
} from '@/data/pos-photos';
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

function getPatternWordVariants(pattern: POSPattern): string[] {
  const raw = pattern.word.trim();
  if (!raw) return [];

  const seen = new Set<string>();
  const variants: string[] = [];
  const addVariant = (value: string) => {
    const candidate = value.trim();
    if (!candidate) return;
    const key = normalize(candidate);
    if (seen.has(key)) return;
    seen.add(key);
    variants.push(candidate);
  };

  const parentheticalMatch = raw.match(/^([^()]+)\(([^)]+)\)$/);
  if (parentheticalMatch) {
    addVariant(parentheticalMatch[1]);
    parentheticalMatch[2]
      .split('/')
      .map(part => part.trim())
      .forEach(addVariant);
    return variants;
  }

  raw
    .split('/')
    .map(part => part.trim())
    .forEach(addVariant);

  return variants.length ? variants : [raw];
}

function getPatternBaseWord(pattern: POSPattern): string {
  return getPatternWordVariants(pattern)[0] ?? pattern.word.trim();
}

function getPatternChoiceWord(pattern: POSPattern): string {
  const exampleWithBlank = pattern.examples.find(example => example.blank && example.blank.length > 0);
  if (exampleWithBlank?.blank) return exampleWithBlank.blank;
  const exampleWithHighlight = pattern.examples.find(example => example.highlightWord);
  if (exampleWithHighlight?.highlightWord) return exampleWithHighlight.highlightWord;
  return getPatternBaseWord(pattern);
}

function getPatternDisplayWord(pattern: POSPattern): string {
  return pattern.word.trim();
}

function toPOSLabel(pos: PartOfSpeech): string {
  return pos === 'article'
    ? 'Article'
    : pos === 'adjective'
      ? 'Adjective'
      : pos === 'adverb'
        ? 'Adverb'
        : pos.charAt(0).toUpperCase() + pos.slice(1);
}

function inferCommonErrorFromPOS(pattern: POSPattern): string | null {
  if (pattern.commonError) return pattern.commonError;

  switch (pattern.partOfSpeech) {
    case 'article':
      return 'Articles and determiners are tricky. "A" before consonant sounds, "an" before vowel sounds, and "the" for specific items.';
    case 'noun':
      return 'Many words can be nouns or verbs. Watch context closely to place the word correctly.';
    case 'verb':
      return `When this word changes meaning with tense, think carefully about whether it is acting as a ${toPOSLabel(pattern.partOfSpeech)} here.`;
    case 'adjective':
      return 'Adjectives describe nouns, usually before them. Be careful not to switch to adverb form.';
    case 'adverb':
      return 'Adverbs usually describe how, when, or where — many end with -ly.';
    case 'preposition':
      return 'Prepositions connect a word to another part of the sentence. Position is the big clue.';
    case 'conjunction':
      return 'Conjunctions connect words and clauses. They are often small function words, not content words.';
    case 'pronoun':
      return 'Subject and object pronouns are common to mix up. Check placement in the sentence.';
    default:
      return null;
  }
}

function dedupeWordFamilyMembers(members: WordFamilyMember[]): WordFamilyMember[] {
  const seen = new Set<string>();
  const out: WordFamilyMember[] = [];

  for (const member of members) {
    const key = `${member.partOfSpeech}:${member.word.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(member);
  }

  return out;
}

const NOUN_VERB_BLACKLIST = new Set<string>([
  'money',
  'time',
  'water',
  'music',
  'language',
  'information',
  'weather',
  'traffic',
  'homework',
  'furniture',
  'evidence',
  'feedback',
  'advice',
  'research',
  'knowledge',
  'education',
  'coffee',
  'software',
]);

const nounCanActAsVerb = (noun: string): boolean => !NOUN_VERB_BLACKLIST.has(noun);

function buildFallbackWordFamily(pattern: POSPattern): WordFamilyMember[] {
  const base = getPatternBaseWord(pattern);
  const lower = base.toLowerCase();
  const suffixCandidates: WordFamilyMember[] = [];

  const add = (word: string, partOfSpeech: PartOfSpeech, usage: string) => {
    const cleaned = word.trim();
    if (cleaned && cleaned.length >= 2 && cleaned !== base) {
      suffixCandidates.push({ word: cleaned, partOfSpeech, usage });
    }
  };

  const pastSimple = (verb: string): string => {
    if (verb.endsWith('ie')) return `${verb.slice(0, -2)}ied`;
    if (verb.endsWith('e')) return `${verb}d`;
    if (verb.endsWith('y') && verb.length > 1 && !/[aeiou]y$/.test(verb)) {
      return `${verb.slice(0, -1)}ied`;
    }
    if (/(s|x|z|ch|sh)$/.test(verb)) return `${verb}ed`;
    return `${verb}ed`;
  };

  const gerund = (verb: string): string => {
    if (verb.endsWith('ie')) return `${verb.slice(0, -2)}ying`;
    if (verb.endsWith('e')) return `${verb.slice(0, -1)}ing`;
    if (verb.length > 1 && /([bcdfghjklmnpqrstvwxyz])\1$/.test(verb)) return `${verb}ing`;
    if (/(s|x|z|ch|sh)$/.test(verb)) return `${verb}ing`;
    return `${verb}ing`;
  };

  const thirdPerson = (verb: string): string => {
    if (verb.endsWith('y') && verb.length > 1 && !/[aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ies`;
    if (/(s|x|z|ch|sh)$/.test(verb)) return `${verb}es`;
    return `${verb}s`;
  };

  if (pattern.partOfSpeech === 'verb') {
    if (lower.length > 2) {
      const verbGerund = gerund(lower);
      const verbPast = pastSimple(lower);
      const verbThird = thirdPerson(lower);
      const agent = lower.endsWith('e') ? `${lower.slice(0, -1)}er` : `${lower}er`;
      add(verbGerund, 'verb', `They are ${verbGerund} during group work.`);
      add(verbPast, 'verb', `She ${verbPast} at the office yesterday.`);
      add(agent, 'noun', `A ${agent} can be very helpful in real-life situations.`);
      add(verbThird, 'verb', `They ${verbThird} after class.`);
    }
  }

  if (pattern.partOfSpeech === 'noun') {
    if (nounCanActAsVerb(lower)) {
      add(lower, 'verb', `Could you ${lower} this sentence before class starts?`);
      if (lower.length > 3) {
        const verbPast = pastSimple(lower);
        add(verbPast, 'verb', `They ${verbPast} this plan after the meeting.`);
      }
    }
  }

  if (pattern.partOfSpeech === 'adjective') {
    if (!lower.endsWith('ly')) add(`${lower}ly`, 'adverb', `She explained it ${lower}ly.`);
    if (lower.length > 2) add(`${lower}ness`, 'noun', `The ${lower}ness of this task is important.`);
  }

  if (pattern.partOfSpeech === 'adverb') {
    const adjective = lower.endsWith('ly') && lower.length > 2 ? lower.slice(0, -2) : null;
    if (adjective) add(adjective, 'adjective', `The adverb "${lower}" often relates to "${adjective}".`);
  }

  return dedupeWordFamilyMembers(suffixCandidates);
}

function getPatternWordFamily(pattern: POSPattern): WordFamilyMember[] {
  return dedupeWordFamilyMembers([
    ...(pattern.wordFamily ?? []),
    ...(pattern.wordFamily?.length ? [] : buildFallbackWordFamily(pattern)),
  ]);
}

type ExampleTracker = Map<string, Set<number>>;

interface ExampleSelectionOptions {
  requireBlank?: boolean;
  requireRole?: boolean;
  preferredIndex?: number;
}

function createExampleTracker(): ExampleTracker {
  return new Map();
}

function selectPatternExample(
  pattern: POSPattern,
  tracker?: ExampleTracker,
  options: ExampleSelectionOptions = {},
) {
  const candidates = pattern.examples
    .map((example, index) => ({ example, index }))
    .filter(({ example }) => {
      if (options.requireBlank && !example.blank) return false;
      if (options.requireRole && !example.role) return false;
      return true;
    });

  if (!candidates.length) return null;

  const used = tracker?.get(pattern.id) ?? new Set<number>();
  const pool = candidates.filter(({ index }) => !used.has(index));
  const source = pool.length ? pool : candidates;
  const picked = options.preferredIndex !== undefined
    ? source[options.preferredIndex % source.length]
    : pickRandom(source, 1)[0];

  if (tracker) {
    const nextUsed = tracker.get(pattern.id) ?? new Set<number>();
    nextUsed.add(picked.index);
    tracker.set(pattern.id, nextUsed);
  }

  return picked;
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

// Maps each POS to its most commonly confused counterpart — used for graduated Round 1 2-choice questions
const POS_CONFUSION_MAP: Record<PartOfSpeech, PartOfSpeech> = {
  noun:        'verb',
  verb:        'noun',
  adjective:   'adverb',
  adverb:      'adjective',
  preposition: 'conjunction',
  conjunction: 'preposition',
  pronoun:     'noun',
  article:     'adjective',
};

function getPOSOptions(correct: PartOfSpeech, count = 4): string[] {
  if (count === 2) {
    const foil = POS_CONFUSION_MAP[correct];
    return shuffle([correct, foil]);
  }
  if (count === 3) {
    const foil = POS_CONFUSION_MAP[correct];
    const others = POS_OPTION_LABELS.filter(p => p !== correct && p !== foil);
    return shuffle([correct, foil, pickRandom(others, 1)[0]]);
  }
  const distractors = POS_OPTION_LABELS.filter(p => p !== correct);
  return shuffle([correct, ...pickRandom(distractors, count - 1)]);
}

function toOptions(correct: string, wrongAnswers: string[], maxChoices = 4): string[] {
  const candidates = [correct, ...wrongAnswers]
    .map(w => w.trim())
    .filter(Boolean);
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const value of candidates) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(value);
    if (unique.length >= maxChoices) break;
  }
  return shuffle(unique).slice(0, maxChoices);
}

// Returns which exercise types are available for a given phase × round.
// Harder types are unlocked progressively so the game gets more complex as students advance.
function getAvailableExerciseTypes(phase: POSPhase, round: number): POSExerciseType[] {
  const base: POSExerciseType[] = ['pattern-choice', 'sentence-completion', 'odd-one-out'];
  if (phase === 'foundation') {
    if (round === 1) return ['photo-sort', 'pattern-choice'];
    return [...base, 'photo-sort', 'error-correction', 'contrast-pair'];
  }
  if (phase === 'sentence-roles') {
    // Round 1: basics only. Round 2+: add sentence-level recognition.
    return round === 1
      ? base
      : [...base, 'photo-sort', 'pos-tagging', 'word-family', 'error-correction', 'contrast-pair'];
  }
  if (phase === 'modifiers') {
    // Minimal-pair and word-transform unlock in Round 2 for modifiers.
    return round === 1
      ? [...base, 'pos-tagging']
      : [...base, 'photo-sort', 'pos-tagging', 'word-family', 'minimal-pair', 'word-transform', 'error-correction', 'contrast-pair'];
  }
  if (phase === 'connectors') {
    // Function-match and mad-libs unlock in Round 2 for connectors.
    return round === 1
      ? [...base, 'pos-tagging', 'function-match']
      : [...base, 'photo-sort', 'pos-tagging', 'word-family', 'minimal-pair', 'word-transform', 'function-match', 'mad-libs', 'error-correction', 'contrast-pair'];
  }
  // application-bridge: all types from Round 1
  return [
    'pattern-choice', 'sentence-completion', 'odd-one-out',
    'pos-tagging', 'word-family', 'minimal-pair',
    'photo-sort', 'word-transform', 'function-match', 'mad-libs', 'sentence-builder',
    'error-correction', 'contrast-pair',
  ] as POSExerciseType[];
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
  tracker?: ExampleTracker,
): POSExercise {
  const selection = selectPatternExample(pattern, tracker) ?? { example: pattern.examples[0], index: 0 };
  const example = selection.example;
  // Fill the blank cleanly — no __ markers. highlightedWord handles the visual highlight.
  const sentence = example.blank
    ? example.sentence.replace('___', example.blank)
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
  tracker?: ExampleTracker,
): POSExercise | null {
  const selection = selectPatternExample(pattern, tracker, { requireBlank: true });
  if (!selection) return null;
  const example = selection.example;
  const correctWord = example.blank!;
  const correctPOS = pattern.partOfSpeech;

  // Collect cross-POS distractors from sibling patterns (max 1 per wrong POS)
  const usedPOS = new Set<PartOfSpeech>([correctPOS]);
  const distractors: { word: string; partOfSpeech: PartOfSpeech }[] = [];
  for (const p of group.patterns) {
    if (p.id === pattern.id) continue;
    if (usedPOS.has(p.partOfSpeech)) continue;
    distractors.push({ word: getPatternChoiceWord(p), partOfSpeech: p.partOfSpeech });
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

  samePOSWords.add(getPatternDisplayWord(pattern));

  for (const p of group.patterns) {
    const word = getPatternDisplayWord(p);
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
      phrase: getPatternDisplayWord(p),
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
  _tracker?: ExampleTracker,
): POSExercise | null {
  const family = getPatternWordFamily(pattern);
  if (family.length < 2) return null;
  
  const baseWord = getPatternBaseWord(pattern);
  const nodes = family.map(m => ({
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
  tracker?: ExampleTracker,
): POSExercise | null {
  const selection = selectPatternExample(pattern, tracker, { requireBlank: true, preferredIndex: 0 });
  const example = selection?.example;
  if (!example?.blank) return null;

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
  tracker?: ExampleTracker,
): POSExercise | null {
  const selection = selectPatternExample(pattern, tracker, { requireRole: true });
  const example = selection?.example;
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
  _tracker?: ExampleTracker,
): POSExercise | null {
  const family = getPatternWordFamily(pattern);
  if (family.length < 2) return null;
  const baseWord = getPatternBaseWord(pattern);
  // Prefer a family member with a different surface form (avoids work(verb) → work(noun))
  const target = family.find(m => m.word !== baseWord) ?? family[0];
  // If the only option is the same word, skip (zero-derivation isn't a useful transformation exercise)
  if (target.word === baseWord) return null;

  // Build candidate pool: other wordFamily members + base word
  const candidatePool: string[] = [];
  for (const member of family) {
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
  tracker?: ExampleTracker,
): POSExercise | null {
  const selection = selectPatternExample(pattern, tracker, { requireRole: true, preferredIndex: 1 });
  const example = selection?.example;
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

// ─── Photo sort factory ───────────────────────────────────────────────────────

function makePhotoSort(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
): POSExercise | null {
  const gallery = group.photoGallery ?? buildPhotoGalleryFromWords(
    group.patterns.map(p => getPatternBaseWord(p)),
    pattern.partOfSpeech,
  );
  if (!gallery || gallery.length < 2) return null;

  const targetPOS = pattern.partOfSpeech;

  // Correct items: photos from the group gallery matching the target POS
  const correctPhotos = gallery.filter(p => p.partOfSpeech === targetPOS);
  if (correctPhotos.length === 0) return null;

  // Pick 1 correct item for simplicity (single-select) in Round 1
  const correctPhoto = pickRandom(correctPhotos, 1)[0];

  // Distractors: photos of different POS from the distractor bank
  const distractors = PHOTO_SORT_DISTRACTOR_BANK
    .filter(p => p.partOfSpeech !== targetPOS)
    .slice(0, 3);

  if (distractors.length < 3) return null;

  const correctItem: PhotoSortItem = {
    id: `ps-correct-${correctPhoto.word}`,
    word: correctPhoto.word,
    imageUrl: correctPhoto.imageUrl,
    partOfSpeech: correctPhoto.partOfSpeech,
    subcategoryLabel: correctPhoto.subcategoryLabel,
    altText: correctPhoto.altText,
  };

  const distractorItems: PhotoSortItem[] = shuffle(distractors).slice(0, 3).map((d, i) => ({
    id: `ps-distractor-${i}-${d.word}`,
    word: d.word,
    imageUrl: d.imageUrl,
    partOfSpeech: d.partOfSpeech,
    subcategoryLabel: d.subcategoryLabel,
    altText: d.altText,
  }));

  const allItems = shuffle([correctItem, ...distractorItems]);

  return {
    id: nextId(group.id, 'photo'),
    type: 'photo-sort',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Which photo shows a ${targetPOS}?`,
    correctAnswer: correctItem.id,
    photoSortData: {
      items: allItems,
      targetPOS,
      multiSelect: false,
      correctIds: [correctItem.id],
    },
    showPattern,
  };
}

function getErrorCorrectionWrongWords(
  group: POSGroup,
  pattern: POSPattern,
  correctWord: string,
): string[] {
  const wrongWords: string[] = [];
  const seen = new Set<string>([normalize(correctWord)]);

  const addWrong = (word: string) => {
    const candidate = word.trim();
    if (!candidate) return;
    const key = normalize(candidate);
    if (seen.has(key)) return;
    seen.add(key);
    wrongWords.push(candidate);
  };

  const family = getPatternWordFamily(pattern);
  if (family.length) {
    const sameFamilyDifferentPOS = family.filter(m => m.partOfSpeech !== pattern.partOfSpeech);
    for (const member of sameFamilyDifferentPOS) {
      addWrong(member.word);
      if (wrongWords.length >= 3) break;
    }
  }

  const groupedForms = getPatternWordVariants(pattern);
  for (const form of groupedForms) {
    if (!form || normalize(form) === normalize(correctWord)) continue;
    addWrong(form);
    if (wrongWords.length >= 3) break;
  }

  // Use sibling patterns as near-collision distractors (same lesson context).
  for (const sibling of group.patterns) {
    if (sibling.id === pattern.id) continue;
    addWrong(getPatternChoiceWord(sibling));
    if (wrongWords.length >= 3) break;
  }

  // Fallback to global distractor bank (prefer not same POS).
  for (const bankItem of shuffle(CLOZE_DISTRACTOR_BANK)) {
    if (bankItem.partOfSpeech === pattern.partOfSpeech) continue;
    addWrong(bankItem.word);
    if (wrongWords.length >= 3) break;
  }

  return wrongWords;
}

function pickContrastNeighborPattern(group: POSGroup, pattern: POSPattern): POSPattern | null {
  const siblings = group.patterns.filter(p => p.id !== pattern.id);
  if (!siblings.length) return null;

  const differentPOS = siblings.filter(p => p.partOfSpeech !== pattern.partOfSpeech);
  const pool = (differentPOS.length ? differentPOS : siblings);
  const correctWord = getPatternChoiceWord(pattern).toLowerCase();

  for (const candidate of shuffle(pool)) {
    if (normalize(getPatternChoiceWord(candidate)) !== correctWord) {
      return candidate;
    }
  }
  return pool[0] ?? null;
}

function makeErrorCorrectionExercise(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
  tracker?: ExampleTracker,
): POSExercise | null {
  const commonError = inferCommonErrorFromPOS(pattern);
  if (!commonError) return null;

  const selection = selectPatternExample(pattern, tracker, { requireBlank: true }) ?? selectPatternExample(pattern, tracker);
  if (!selection) return null;
  const example = selection.example;
  const sentence = example.blank ? example.sentence.replace('___', example.blank) : example.sentence;
  const correctWord = example.blank ? example.blank : getPatternChoiceWord(pattern);

  const wrongWords = getErrorCorrectionWrongWords(group, pattern, correctWord);
  if (!wrongWords.length) return null;

  return {
    id: nextId(group.id, 'ec'),
    type: 'error-correction',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `A common mistake for this part of speech: ${commonError}`,
    correctAnswer: correctWord,
    options: toOptions(correctWord, wrongWords, 4),
    errorCorrection: {
      sentence,
      prompt: `Many learners make this mistake. Pick the best option to complete this sentence.`,
      correctWord,
      wrongWords,
      commonError,
      explanation: pattern.errorExplanation ?? `In this context, the correct word is "${correctWord}".`,
    },
    explanation: pattern.errorExplanation,
    showPattern,
    realWorldContext: example.context,
  };
}

function makeContrastPairExercise(
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
  tracker?: ExampleTracker,
): POSExercise | null {
  const selection = selectPatternExample(pattern, tracker, { requireBlank: true }) ?? selectPatternExample(pattern, tracker);
  if (!selection) return null;
  const example = selection.example;
  const sentence = example.blank ? example.sentence.replace('___', example.blank) : example.sentence;

  const contrastPattern = pickContrastNeighborPattern(group, pattern);
  if (!contrastPattern) return null;

  const correctWord = example.blank ? example.blank : getPatternChoiceWord(pattern);
  const contrastWord = getPatternChoiceWord(contrastPattern);
  if (normalize(correctWord) === normalize(contrastWord)) return null;

  const explanation = pattern.word !== contrastPattern.word
    ? `Use ${correctWord} for a ${pattern.partOfSpeech} use here; ${contrastWord} is a ${contrastPattern.partOfSpeech} option.`
    : `Compare the surrounding options: one option is better for the target part of speech.`;

  return {
    id: nextId(group.id, 'cp'),
    type: 'contrast-pair',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Which word better fits the sentence?`,
    correctAnswer: correctWord,
    options: shuffle([correctWord, contrastWord]),
    contrastPair: {
      sentence,
      prompt: `Both "${correctWord}" and "${contrastWord}" are close options. Which one is the correct fit here?`,
      correctWord,
      distractorWord: contrastWord,
      targetPOS: pattern.partOfSpeech,
      distractorPOS: contrastPattern.partOfSpeech,
      explanation,
    },
    explanation,
    showPattern,
    realWorldContext: example.context,
  };
}

// ─── Round generator ──────────────────────────────────────────────────────────

type ExerciseFactory = (
  group: POSGroup,
  pattern: POSPattern,
  showPattern: boolean,
  tracker?: ExampleTracker,
) => POSExercise | null;

const FACTORY_MAP: Record<POSExerciseType, ExerciseFactory | null> = {
  'pattern-choice': makePatternChoice,
  'sentence-completion': makeSentenceCompletion,
  'odd-one-out': makeOddOneOut,
  'pos-tagging': makePOSTagging,
  'word-transform': makeWordTransform,
  'function-match': makeFunctionMatch,
  'error-correction': makeErrorCorrectionExercise,
  'contrast-pair': makeContrastPairExercise,
  'pattern-sorting': null, // multi-pattern, handled separately
  'word-family': makeWordFamilyBuilder,
  'mad-libs': makeMadLibs,
  'minimal-pair': null,    // handled separately
  'sentence-builder': null, // handled separately
  'photo-sort': makePhotoSort, // photo-based visual recognition
};

/**
 * Generate exercises for Round 1 (introduction).
 *
 * Foundation phase:
 *  - Starts with photo-sort exercises (concrete visual anchor)
 *  - Uses graduated difficulty: Q1-2 = 2 choices, Q3-4 = 3 choices, Q5-6 = 4 choices
 *  - Limited to 6 questions (less intimidating for first attempt)
 *
 * Other phases: standard 8-question mix with phase-appropriate exercise types.
 */
export function generateRound1Exercises(group: POSGroup): POSExercise[] {
  if (group.isCheckpoint) return generateCheckpointExercises(group);

  const exercises: POSExercise[] = [];
  const tracker = createExampleTracker();
  const patterns = group.patterns;
  if (!patterns.length) return exercises;

  const isFoundation = group.phase === 'foundation';
  const roundSize = isFoundation ? 6 : POS_ROUND1_SIZE;

  if (isFoundation) {
    // Foundation Round 1: start with photo-sort exercises, then graduated pattern-choice
    // 1. Photo sort exercises (up to 2, one per pattern that has gallery photos)
    for (const pattern of patterns.slice(0, 2)) {
      const ps = makePhotoSort(group, pattern, true);
      if (ps) exercises.push(ps);
    }

    // 2. Pattern choice with graduated options — built with all 4 options first, graduation applied after slicing
    for (const pattern of patterns) {
      exercises.push(makePatternChoice(group, pattern, true, tracker));
    }

    // Shuffle and slice, then apply graduation
    const sliced = shuffle(exercises).slice(0, roundSize);
    return sliced.map((ex, i) => {
      if (ex.type !== 'pattern-choice') return ex;
      const choiceCount = i < 2 ? 2 : i < 4 ? 3 : 4;
      return {
        ...ex,
        choiceCount,
        options: getPOSOptions(ex.correctAnswer as PartOfSpeech, choiceCount),
      };
    });
  }

  // Non-foundation phases: mix gated by phase/round
  const available = getAvailableExerciseTypes(group.phase, 1);

  for (const pattern of patterns) {
    // Always include a pattern-choice as the baseline recognition exercise
    exercises.push(makePatternChoice(group, pattern, true, tracker));

    // Add sentence-completion (cloze) where data allows
    if (available.includes('sentence-completion')) {
      const sc = makeSentenceCompletion(group, pattern, true, tracker);
      if (sc) exercises.push(sc);
    }

    // POS-tagging: tap the word in context (sentence-roles and beyond)
    if (available.includes('pos-tagging')) {
      const pt = makePOSTagging(group, pattern, true, tracker);
      if (pt) exercises.push(pt);
    }

    // Function-match: connectors phase and above
    if (available.includes('function-match')) {
      const fm = makeFunctionMatch(group, pattern, true, tracker);
      if (fm) exercises.push(fm);
    }

    if (available.includes('error-correction')) {
      const ec = makeErrorCorrectionExercise(group, pattern, true, tracker);
      if (ec) exercises.push(ec);
    }

    if (available.includes('contrast-pair')) {
      const cp = makeContrastPairExercise(group, pattern, true, tracker);
      if (cp) exercises.push(cp);
    }

    // Sentence-builder: application-bridge phase
    if (available.includes('sentence-builder')) {
      const sb = makeSentenceBuilder(group, pattern, true, tracker);
      if (sb) exercises.push(sb);
    }
  }

  // Sorting exercise as a round-out (cross-POS or intra-POS subcategory)
  const sort = makePatternSorting(group, patterns, true) ?? makeSubcategorySorting(group, patterns, true);
  if (sort) exercises.push(sort);

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
  const tracker = createExampleTracker();
  const available = getAvailableExerciseTypes(group.phase, 2);
  let photoSortCount = 0;

  for (const pattern of patterns) {
    if (available.includes('photo-sort') && photoSortCount < 1) {
      const ps = makePhotoSort(group, pattern, false);
      if (ps) {
        exercises.push(ps);
        photoSortCount += 1;
      }
    }

    if (available.includes('function-match')) {
      const fm = makeFunctionMatch(group, pattern, false, tracker);
      if (fm) exercises.push(fm);
    }

    if (available.includes('pos-tagging')) {
      const pt = makePOSTagging(group, pattern, false, tracker);
      if (pt) exercises.push(pt);
    }

    if (available.includes('error-correction')) {
      const ec = makeErrorCorrectionExercise(group, pattern, false, tracker);
      if (ec) exercises.push(ec);
    }

    if (available.includes('contrast-pair')) {
      const cp = makeContrastPairExercise(group, pattern, false, tracker);
      if (cp) exercises.push(cp);
    }

    if (available.includes('odd-one-out')) {
      const ooo = makeOddOneOut(group, pattern, false);
      if (ooo) exercises.push(ooo);
    }
  }

  // Add mad-libs for mastery (where we used rapid-fire)
  for (const pattern of patterns) {
    const ml = makeMadLibs(group, pattern, false, tracker);
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
  const tracker = createExampleTracker();

  for (const rg of reviewGroups) {
    for (const pattern of rg.patterns.slice(0, 2)) {
      exercises.push(makePatternChoice(rg, pattern, false, tracker));

      const ml = makeMadLibs(rg, pattern, false, tracker);
      if (ml) exercises.push(ml);
    }

    const wfb = makeWordFamilyBuilder(rg, rg.patterns[0], false, tracker);
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
  tracker?: ExampleTracker,
): POSExercise | null {
  // Prefer an example with both a blank and a role so we can build meaningful slots
  const selection = selectPatternExample(pattern, tracker, { requireBlank: true, requireRole: true })
    ?? selectPatternExample(pattern, tracker, { requireBlank: true });
  const example = selection?.example;
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
  tracker?: ExampleTracker,
): POSExercise | null {
  const family = getPatternWordFamily(pattern);
  if (!family.length) return null;

  const baseWord = getPatternBaseWord(pattern);
  const basePOS = pattern.partOfSpeech;
  const selection = selectPatternExample(pattern, tracker, { requireBlank: true, preferredIndex: 2 })
    ?? selectPatternExample(pattern, tracker);
  const baseExample = selection?.example;
  if (!baseExample) return null;

  // Find a family member with a different POS that has a usage sentence
  const altMember = family.find(m => m.partOfSpeech !== basePOS && m.usage);
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
  const tracker = createExampleTracker();
  const available = getAvailableExerciseTypes(group.phase, 3);
  let photoSortCount = 0;

  for (const pattern of group.patterns) {
    if (available.includes('photo-sort') && photoSortCount < 1) {
      const ps = makePhotoSort(group, pattern, false);
      if (ps) {
        exercises.push(ps);
        photoSortCount += 1;
      }
    }

    if (available.includes('pos-tagging')) {
      const pt = makePOSTagging(group, pattern, false, tracker);
      if (pt) exercises.push(pt);
      else {
        // Fallback: pattern-choice with a different example than Round 1 used
        exercises.push(makePatternChoice(group, pattern, false, tracker));
      }
    }

    if (available.includes('function-match')) {
      const fm = makeFunctionMatch(group, pattern, false, tracker);
      if (fm) exercises.push(fm);
    }

    if (available.includes('error-correction')) {
      const ec = makeErrorCorrectionExercise(group, pattern, false, tracker);
      if (ec) exercises.push(ec);
    }

    if (available.includes('contrast-pair')) {
      const cp = makeContrastPairExercise(group, pattern, false, tracker);
      if (cp) exercises.push(cp);
    }
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
  const tracker = createExampleTracker();
  let photoSortCount = 0;

  for (const pattern of group.patterns) {
    if (photoSortCount < 1) {
      const ps = makePhotoSort(group, pattern, false);
      if (ps) {
        exercises.push(ps);
        photoSortCount += 1;
      }
    }

    // sentence-builder: drag words to fill the slot (primary)
    const sb = makeSentenceBuilder(group, pattern, false, tracker);
    if (sb) exercises.push(sb);
    else {
      // Fallback to mad-libs (same concept, simpler interaction)
      const ml = makeMadLibs(group, pattern, false, tracker);
      if (ml) exercises.push(ml);
    }

    // minimal-pair: same root word, different POS (great for verbs, nouns with wordFamily)
    const mp = makeMinimalPair(group, pattern, false, tracker);
    if (mp) exercises.push(mp);
  }

  // Word-family builder at group level (match all forms of a word to their POS)
  for (const pattern of group.patterns) {
    const wfb = makeWordFamilyBuilder(group, pattern, false, tracker);
    if (wfb) { exercises.push(wfb); break; }
  }

  // Word-transform: change a word from one POS to another
  for (const pattern of group.patterns) {
    const wt = makeWordTransform(group, pattern, false, tracker);
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
  const tracker = createExampleTracker();
  let photoSortCount = 0;

  for (const pattern of targetPatterns) {
    if (photoSortCount < 2) {
      const ps = makePhotoSort(group, pattern, false);
      if (ps) {
        exercises.push(ps);
        photoSortCount += 1;
      }
    }

    // sentence-completion (cloze) is the hardest — primary type for R5
    const sc = makeSentenceCompletion(group, pattern, false, tracker);
    if (sc) exercises.push(sc);
    else {
      // Fallback: pattern-choice with a harder example (3rd example if available)
      const selection = selectPatternExample(pattern, tracker, { preferredIndex: 2 })
        ?? selectPatternExample(pattern, tracker)
        ?? { example: pattern.examples[0], index: 0 };
      const ex = selection.example;
      const sentence = ex.blank ? ex.sentence.replace('___', ex.blank) : ex.sentence;
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
    const fm = makeFunctionMatch(group, pattern, false, tracker);
    if (fm) exercises.push(fm);
  }

  // Odd-one-out (cross-POS recognition)
  for (const pattern of targetPatterns) {
    const ooo = makeOddOneOut(group, pattern, false);
    if (ooo) { exercises.push(ooo); break; }
  }

  // Mad-libs as a final production exercise
  for (const pattern of targetPatterns) {
    const ml = makeMadLibs(group, pattern, false, tracker);
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
