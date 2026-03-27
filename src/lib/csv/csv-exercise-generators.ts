/**
 * CSV-Based Exercise Generators for Gerunds & Infinitives Pattern Game
 * Uses sentences from gerund_inf_sentences.csv for variety and anti-repetition
 */

import type {
  GIExercise,
  GIExerciseType,
  GerundInfinitiveGroup,
  PatternPerformance,
  ErrorToken,
} from '@/types/gerund-infinitive';
import type { CSVSentence, PatternGroupId } from '@/lib/csv/gerund-infinitive-csv';
import {
  isSubjectPositionSentence,
} from '@/lib/csv/gerund-infinitive-csv';
import {
  SelectionContext,
  createSelectionContext,
  selectSentences,
  selectTargetedSentences,
} from '@/lib/sentence-selection';

// ---------------------------------------------------------------------------
// MAPPING: Game Group ID → CSV Pattern Group
// ---------------------------------------------------------------------------

const GROUP_TO_CSV_PATTERN: Record<string, PatternGroupId[]> = {
  'group-0a': ['gerund_after_verb', 'go_gerund'],
  'group-0b': ['infinitive_after_verb', 'infinitive_purpose'],
  'group-1': ['preposition_gerund'],
  'group-1a': ['preposition_gerund'],
  'group-2c': ['gerund_after_verb', 'infinitive_after_verb'],  // Mixed Verb Challenge - uses CSV 3rd person forms
  'group-3a': ['adjective_infinitive'],
  'group-3b': ['noun_infinitive'],
  'group-4': ['go_gerund'],
  'group-5': ['gerund_subject'],  // Subject Gerunds - sentence-initial blanks
  // For mixed groups, list multiple pattern groups
};

/**
 * Get CSV pattern groups for a game group
 */
function getCSVPatternsForGroup(groupId: string): PatternGroupId[] {
  return GROUP_TO_CSV_PATTERN[groupId] || [];
}

// ---------------------------------------------------------------------------
// CSV-BASED EXERCISE GENERATION
// ---------------------------------------------------------------------------

/**
 * Generate exercises from CSV data for a game group
 * This is the main entry point for CSV-based exercise generation
 */
export function generateCSVExercises(
  group: GerundInfinitiveGroup,
  count: number = 10,
  hideExplanations: boolean = false,
  difficulty: 'round1' | 'round2' | undefined = undefined,
  context: SelectionContext = createSelectionContext()
): { exercises: GIExercise[]; updatedContext: SelectionContext } {
  const csvPatternGroups = getCSVPatternsForGroup(group.id);

  // If no CSV mapping, return empty (will fall back to hardcoded)
  if (csvPatternGroups.length === 0) {
    return { exercises: [], updatedContext: context };
  }

  const exercises: GIExercise[] = [];
  let currentContext = context;

  // Select sentences from CSV
  const sentencesPerGroup = Math.ceil(count / csvPatternGroups.length);
  const allSentences: CSVSentence[] = [];

  for (const patternGroup of csvPatternGroups) {
    const result = selectSentences(
      patternGroup,
      sentencesPerGroup,
      currentContext,
      difficulty
    );
    allSentences.push(...result.sentences);
    currentContext = result.updatedContext;
  }

  // Shuffle and trim to exact count
  const shuffled = shuffleArray(allSentences).slice(0, count);

  // Generate exercises from sentences
  const exerciseTypes = getExerciseTypesForGroup(group.id, count);

  for (let i = 0; i < shuffled.length; i++) {
    const sentence = shuffled[i];
    const type = exerciseTypes[i % exerciseTypes.length];
    const exercise = createExerciseFromCSV(
      type,
      sentence,
      group.id,
      hideExplanations
    );
    if (exercise) {
      exercises.push(exercise);
    }
  }

  return { exercises, updatedContext: currentContext };
}

/**
 * Generate targeted Round 2 exercises from CSV (prioritizing missed verbs)
 */
export function generateCSVRound2Exercises(
  group: GerundInfinitiveGroup,
  patternStats: Record<string, PatternPerformance> = {},
  count: number = 8,
  hideExplanations: boolean = false,
  context: SelectionContext = createSelectionContext()
): { exercises: GIExercise[]; updatedContext: SelectionContext } {
  const csvPatternGroups = getCSVPatternsForGroup(group.id);

  if (csvPatternGroups.length === 0) {
    return { exercises: [], updatedContext: context };
  }

  // Extract missed verbs from pattern stats
  const missedVerbs: string[] = [];
  for (const [patternId, stats] of Object.entries(patternStats)) {
    if ((stats.round1Misses ?? 0) > 0 || (stats.misses ?? 0) > 0) {
      // Extract verb from pattern ID if possible
      const verbMatch = patternId.match(/verb-(\w+)/);
      if (verbMatch) missedVerbs.push(verbMatch[1]);
    }
  }

  const exercises: GIExercise[] = [];
  let currentContext = context;

  // Get targeted sentences prioritizing missed verbs
  for (const patternGroup of csvPatternGroups) {
    const result = selectTargetedSentences(
      patternGroup,
      Math.ceil(count / csvPatternGroups.length),
      currentContext,
      missedVerbs
    );

    for (const sentence of result.sentences) {
      const type = getExerciseTypeForRound2(exercises.length);
      const exercise = createExerciseFromCSV(
        type,
        sentence,
        group.id,
        hideExplanations
      );
      if (exercise) exercises.push(exercise);
    }

    currentContext = result.updatedContext;
  }

  return {
    exercises: exercises.slice(0, count),
    updatedContext: currentContext,
  };
}

// ---------------------------------------------------------------------------
// EXERCISE CREATION FROM CSV SENTENCE
// ---------------------------------------------------------------------------

/**
 * Create an exercise from a CSV sentence
 */
function createExerciseFromCSV(
  type: GIExerciseType,
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise | null {
  switch (type) {
    case 'pattern-choice':
      return createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
    case 'swipe-choice': {
      const ex = createSwipeChoiceFromCSV(sentence, groupId, hideExplanations);
      return ex ?? createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
    }
    case 'pattern-identifier': {
      const ex = createPatternIdentifierFromCSV(sentence, groupId, hideExplanations);
      return ex ?? createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
    }
    case 'sentence-completion':
      return createSentenceCompletionFromCSV(sentence, groupId, hideExplanations);
    case 'error-correction':
      return createErrorCorrectionFromCSV(sentence, groupId, hideExplanations);
    case 'drag-order': {
      const ex = createDragOrderFromCSV(sentence, groupId, hideExplanations);
      return ex ?? createSentenceCompletionFromCSV(sentence, groupId, hideExplanations);
    }
    case 'scenario-choice': {
      const ex = createScenarioChoiceFromCSV(sentence, groupId, hideExplanations);
      return ex ?? createSentenceCompletionFromCSV(sentence, groupId, hideExplanations);
    }
    case 'match-pair':
    case 'dialogue-completion':
    case 'chain-sentences':
    case 'memory-match':
    case 'rapid-fire':
      // Multi-sentence types: fall back to pattern-choice for single-sentence flow
      return createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
    default:
      return createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
  }
}

/**
 * Pattern Choice Exercise from CSV
 * Shows sentence with blank, student chooses correct form
 */
function createPatternChoiceFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise {
  const correctAnswer = sentence.wordToBlank;
  const isSubject = isSubjectPositionSentence(sentence);

  // Generate smart distractors based on pattern
  const options = generateSmartOptions(sentence, isSubject);

  // Create prompt with blank
  const prompt = createPromptWithBlank(sentence);

  return {
    id: `csv-choice-${sentence.id}-${Date.now()}`,
    type: 'pattern-choice',
    groupId,
    patternId: `csv-${sentence.patternGroup}-${sentence.verb}`,
    prompt,
    correctAnswer: correctAnswer,
    options,
    showPattern: !hideExplanations,
    realWorldContext: sentence.topic,
    // For subject-position, indicate capital answer expected
    isSubjectPosition: isSubject,
  } as GIExercise & { isSubjectPosition?: boolean };
}

/**
 * Sentence Completion Exercise from CSV
 * Shows sentence with blank and base verb hint, student types answer
 */
function createSentenceCompletionFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise {
  const correctAnswer = sentence.wordToBlank;
  const isSubject = isSubjectPositionSentence(sentence);
  const prompt = createPromptWithBlank(sentence);

  // Hint = base form of the verb in the blank. Prefer CSV baseVerbForm to avoid misspellings.
  let baseVerbForHint: string;

  if (sentence.baseVerbForm) {
    baseVerbForHint = sentence.baseVerbForm;
  } else if (correctAnswer.startsWith('to ')) {
    baseVerbForHint = correctAnswer.slice(3);
  } else if (correctAnswer.includes('ing') && sentence.otherOption.startsWith('to ')) {
    baseVerbForHint = sentence.otherOption.slice(3);
  } else {
    baseVerbForHint = sentence.verb;
  }

  return {
    id: `csv-sentence-${sentence.id}-${Date.now()}`,
    type: 'sentence-completion',
    groupId,
    patternId: `csv-${sentence.patternGroup}-${sentence.verb}`,
    prompt,
    correctAnswer,
    showPattern: !hideExplanations,
    realWorldContext: sentence.topic,
    baseVerb: baseVerbForHint,
    isSubjectPosition: isSubject,
  } as GIExercise & { isSubjectPosition?: boolean };
}

/**
 * Error Correction Exercise from CSV
 * Shows sentence with wrong form, student identifies and corrects
 */
function createErrorCorrectionFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise {
  const correctForm = sentence.wordToBlank;
  const wrongForm = sentence.otherOption; // Use the "Other Option" as the error

  // Build erroneous sentence by replacing correct with wrong
  const erroneousSentence = sentence.sentence.replace(
    new RegExp(`\\b${escapeRegExp(correctForm)}\\b`, 'i'),
    wrongForm
  );

  // If replacement didn't work (sentence already has blank), use alternate approach
  const finalSentence = erroneousSentence !== sentence.sentence
    ? erroneousSentence
    : sentence.sentence.replace('___', wrongForm);

  const tokens = tokenizeSentence(finalSentence, wrongForm);

  return {
    id: `csv-error-${sentence.id}-${Date.now()}`,
    type: 'error-correction',
    groupId,
    patternId: `csv-${sentence.patternGroup}-${sentence.verb}`,
    prompt: 'Find and click the incorrect word form in this sentence.',
    correctAnswer: correctForm,
    errorTokens: tokens,
    showPattern: !hideExplanations,
    realWorldContext: sentence.topic,
  };
}

/**
 * Swipe Choice Exercise from CSV (levels 1–2 only)
 * Same as pattern-choice but swipe left=gerund, right=infinitive UX
 */
function createSwipeChoiceFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise {
  const ex = createPatternChoiceFromCSV(sentence, groupId, hideExplanations);
  return { ...ex, type: 'swipe-choice' };
}

/**
 * Drag Order Exercise from CSV
 * Splits sentence into chunks for tap-to-order
 */
function createDragOrderFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise | null {
  const blank = sentence.wordToBlank;
  let chunks: string[];

  if (sentence.sentence.includes('___')) {
    const [before, after] = sentence.sentence.split('___');
    const beforeChunks = (before ?? '').trim().split(/\s+/).filter(Boolean);
    const afterChunks = (after ?? '').trim().split(/\s+/).filter(Boolean);
    chunks = [...beforeChunks, blank, ...afterChunks].filter(Boolean);
  } else {
    const full = sentence.sentence.replace(/\.$/, '');
    const idx = full.toLowerCase().indexOf(blank.toLowerCase());
    if (idx === -1) return null;

    const before = full.slice(0, idx).trim();
    const after = full.slice(idx + blank.length).trim();
    const beforeChunks = before ? before.split(/\s+/).filter(Boolean) : [];
    const afterChunks = after ? after.split(/\s+/).filter(Boolean) : [];
    chunks = [...beforeChunks, blank, ...afterChunks].filter(Boolean);
  }
  if (chunks.length < 3) return null;

  return {
    id: `csv-drag-${sentence.id}-${Date.now()}`,
    type: 'drag-order',
    groupId,
    patternId: `csv-${sentence.patternGroup}-${sentence.verb}`,
    prompt: 'Tap chunks in order to build the sentence.',
    correctAnswer: sentence.wordToBlank,
    dragChunks: chunks,
    showPattern: !hideExplanations,
    realWorldContext: sentence.topic,
  };
}

const TOPIC_TO_SCENARIO: Record<string, string> = {
  work: 'At work',
  school: 'At school',
  home: 'At home',
  health: 'Health & wellness',
  transportation: 'Getting around',
  daily_life: 'Daily life',
  relationships: 'With friends & family',
  money: 'Money & finances',
  social: 'Social situations',
};

/**
 * Scenario Choice Exercise from CSV
 * Real-world context + sentence completion
 */
function createScenarioChoiceFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise {
  const ex = createSentenceCompletionFromCSV(sentence, groupId, hideExplanations);
  const scenario = TOPIC_TO_SCENARIO[sentence.topic] ?? sentence.topic.replace(/_/g, ' ');
  return { ...ex, type: 'scenario-choice', scenario };
}

/** Parts of speech only (what comes before the blank in pattern-identifier) */
const PATTERN_GROUP_TO_CATEGORY_LABEL: Record<PatternGroupId, string> = {
  gerund_after_verb: 'verb',
  infinitive_after_verb: 'verb',
  gerund_subject: 'noun',
  infinitive_purpose: 'verb', // fallback; actual word is often noun (store, taxi) or adverb (early, late)
  go_gerund: 'verb',
  preposition_gerund: 'preposition',
  adjective_infinitive: 'adjective',
  noun_infinitive: 'noun',
};

const PATTERN_IDENTIFIER_OPTIONS = ['verb', 'noun', 'preposition', 'adjective', 'adverb'];

/** Common adverbs that often appear before infinitives (e.g. "left early to avoid") */
const COMMON_ADVERBS_BEFORE_INFINITIVE = new Set([
  'early', 'late', 'quickly', 'slowly', 'carefully', 'quietly', 'suddenly',
  'immediately', 'finally', 'sometimes', 'often', 'always', 'never',
  'here', 'there', 'today', 'tomorrow', 'yesterday', 'soon', 'well',
]);

/** Pronouns (function as nouns) - e.g. "She asked me to call" */
const PRONOUNS = new Set(['me', 'you', 'him', 'her', 'us', 'them', 'it', 'someone', 'anyone']);

/** Common nouns that appear before infinitives of purpose (e.g. "went to the store to buy") */
const COMMON_NOUNS_BEFORE_PURPOSE = new Set([
  'store', 'taxi', 'window', 'notebook', 'money', 'light', 'office', 'snacks', 'workshop',
  'homework', 'trip', 'bus', 'instructions', 'account', 'forms', 'class', 'report',
  'writing', 'medicine', 'meeting', 'lights', 'restaurant', 'rent', 'interview',
  'team', 'app', 'bottom', 'students', 'son', 'landlord', 'printer', 'light',
]);

/**
 * Get the part of speech for the word immediately before the blank in the prompt.
 * Uses the actual word, not just the pattern group, so "She went to the store ___ buy"
 * correctly returns "noun" (store), not "verb".
 */
function getPartOfSpeechBeforeBlank(sentence: CSVSentence): string | null {
  const prompt = createPromptWithBlank(sentence);
  const blankIndex = prompt.indexOf('___');
  if (blankIndex <= 0) return null;
  const beforeBlank = prompt.slice(0, blankIndex).trim();
  const words = beforeBlank.split(/\s+/);
  const wordBefore = words[words.length - 1]?.toLowerCase().replace(/[.,!?;:]$/, '');
  if (!wordBefore) return null;
  if (COMMON_ADVERBS_BEFORE_INFINITIVE.has(wordBefore)) return 'adverb';
  if (PRONOUNS.has(wordBefore)) return 'noun';
  if (COMMON_NOUNS_BEFORE_PURPOSE.has(wordBefore)) return 'noun';
  // For infinitive_purpose, the word before is often a noun (object of "to" in "went to the X")
  // If the word matches the trigger verb (e.g. "went" for "go"), it's a verb
  if (sentence.patternGroup === 'infinitive_purpose' && sentence.verb) {
    const verbLower = sentence.verb.toLowerCase();
    if (wordBefore === verbLower || wordBefore === verbLower + 'ed' || wordBefore === verbLower + 's') return 'verb';
    // Otherwise it's typically a noun (store, taxi, window, etc.)
    return 'noun';
  }
  return null;
}

/**
 * Pattern Identifier Exercise from CSV
 * Student identifies what part of speech comes before the highlighted word (verb, preposition, etc.)
 */
function createPatternIdentifierFromCSV(
  sentence: CSVSentence,
  groupId: string,
  hideExplanations: boolean
): GIExercise | null {
  // Subject position has nothing meaningful "before" the gerund in the sentence
  if (sentence.patternGroup === 'gerund_subject') return null;

  // Use actual word before blank when it's an adverb (e.g. "She left early to avoid" → adverb)
  const adverbBefore = getPartOfSpeechBeforeBlank(sentence);
  const categoryLabel = adverbBefore ?? PATTERN_GROUP_TO_CATEGORY_LABEL[sentence.patternGroup];
  const otherCategories = PATTERN_IDENTIFIER_OPTIONS.filter(c => c !== categoryLabel);
  const distractors = shuffleArray(otherCategories).slice(0, 3);
  const options = shuffleArray([categoryLabel, ...distractors]);
  const prompt = createPromptWithBlank(sentence);

  return {
    id: `csv-pattern-id-${sentence.id}-${Date.now()}`,
    type: 'pattern-identifier',
    groupId,
    patternId: `csv-${sentence.patternGroup}-${sentence.verb}`,
    prompt,
    correctAnswer: categoryLabel,
    options,
    highlightedWord: sentence.wordToBlank,
    showPattern: !hideExplanations,
    realWorldContext: sentence.topic,
  };
}

// ---------------------------------------------------------------------------
// SMART OPTION GENERATION
// ---------------------------------------------------------------------------

/**
 * Generate smart answer options based on pattern type
 * Uses CSV "Other Option" as primary distractor, adds pattern-specific extras
 * Prefers BaseVerbForm & ThirdPersonSingular from CSV to avoid misspellings (e.g. sightsees, birdwatches)
 */
function generateSmartOptions(sentence: CSVSentence, _isSubject: boolean): string[] {
  const correct = sentence.wordToBlank;

  // Use CSV baseVerbForm/thirdPersonSingular when available (avoids derivation errors)
  let baseVerb: string;
  let thirdPerson: string;

  if (sentence.baseVerbForm && sentence.thirdPersonSingular) {
    baseVerb = sentence.baseVerbForm;
    thirdPerson = sentence.thirdPersonSingular;
  } else {
    // Fallback: derive from correct answer
    if (correct.includes('ing')) {
      baseVerb = baseFromGerund(correct);
    } else if (correct.startsWith('to ')) {
      baseVerb = correct.slice(3);
    } else {
      baseVerb = sentence.verb;
    }
    thirdPerson = getThirdPersonSingular(baseVerb);
  }

  // Use correct & otherOption from CSV (exact spelling) + base + 3rd person
  const options: string[] = [
    correct,
    sentence.otherOption,
    baseVerb,
    thirdPerson,
  ];

  // Handle special case for subject gerunds (capitalized)
  if (_isSubject && correct.charAt(0) === correct.charAt(0).toUpperCase()) {
    // Capitalize first letter of gerunds only (not infinitives starting with "to")
    const capitalizedOptions = options.map(opt => {
      // Don't capitalize infinitives (starting with "to ")
      if (opt.toLowerCase().startsWith('to ')) {
        return opt.toLowerCase(); // Ensure infinitives are lowercase
      }
      // Capitalize gerunds and base verb forms
      return opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase();
    });
    const uniqueOptions = [...new Set(capitalizedOptions)];
    return shuffleArray(uniqueOptions.slice(0, 4));
  }

  // Remove duplicates, ensure we have 4, shuffle
  const uniqueOptions = [...new Set(options)];
  return shuffleArray(uniqueOptions.slice(0, 4));
}

/**
 * Create a prompt with blank marker from CSV sentence
 */
function createPromptWithBlank(sentence: CSVSentence): string {
  // If sentence already has blank marker, use as-is
  if (sentence.sentence.includes('___')) {
    return sentence.sentence;
  }

  // Otherwise, replace the correct answer with a blank
  const correctAnswer = sentence.wordToBlank;
  const escaped = escapeRegExp(correctAnswer);

  // Try to replace the word (case-insensitive for subject gerunds)
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  const replaced = sentence.sentence.replace(regex, '___');

  // If replacement worked, return it
  if (replaced !== sentence.sentence) {
    return replaced;
  }

  // Fallback: the sentence might already be structured with the answer
  return sentence.sentence;
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE SELECTION
// ---------------------------------------------------------------------------

/**
 * Get exercise types for a group
 */
function getExerciseTypesForGroup(groupId: string, count: number): GIExerciseType[] {
  // Levels 1–2 only: include swipe-choice (group-0a, group-0b)
  const swipeTypes: GIExerciseType[] = [
    'swipe-choice',
    'pattern-choice',
    'sentence-completion',
    'swipe-choice',
    'pattern-identifier',
    'error-correction',
  ];

  // Default mix for most groups
  // Note: match-pair, dialogue-completion, chain-sentences, memory-match, rapid-fire
  // require multi-sentence data and are not yet supported in CSV flow
  const defaultTypes: GIExerciseType[] = [
    'pattern-choice',
    'sentence-completion',
    'pattern-choice',
    'drag-order',
    'error-correction',
    'scenario-choice',
    'swipe-choice',
    'pattern-identifier',
  ];

  if (groupId === 'group-0a' || groupId === 'group-0b') {
    const types: GIExerciseType[] = [];
    for (let i = 0; i < count; i++) {
      types.push(swipeTypes[i % swipeTypes.length]);
    }
    return types;
  }

  // All other groups use the default varied exercise type mix
  const types: GIExerciseType[] = [];
  for (let i = 0; i < count; i++) {
    types.push(defaultTypes[i % defaultTypes.length]);
  }
  return types;
}

/**
 * Get exercise type for Round 2 (harder round)
 */
function getExerciseTypeForRound2(index: number): GIExerciseType {
  const round2Types: GIExerciseType[] = [
    'pattern-choice',
    'pattern-identifier',
    'sentence-completion',
    'error-correction',
    'sentence-completion',
  ];
  return round2Types[index % round2Types.length];
}

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Irregular verb 3rd person singular forms
 * Used when generating the 4th distractor option
 */
const IRREGULAR_THIRD_PERSON: Record<string, string> = {
  'be': 'is',
  'have': 'has',
  'do': 'does',
  'go': 'goes',
  'say': 'says',
  'see': 'sees',
  'get': 'gets',
  'make': 'makes',
  'take': 'takes',
  'come': 'comes',
  'give': 'gives',
  'find': 'finds',
  'tell': 'tells',
  'ask': 'asks',
  'work': 'works',
  'call': 'calls',
  'try': 'tries',
  'feel': 'feels',
  'become': 'becomes',
  'leave': 'leaves',
  'put': 'puts',
  'mean': 'means',
  'keep': 'keeps',
  'let': 'lets',
  'begin': 'begins',
  'seem': 'seems',
  'help': 'helps',
  'talk': 'talks',
  'turn': 'turns',
  'start': 'starts',
  'show': 'shows',
  'hear': 'hears',
  'play': 'plays',
  'run': 'runs',
  'move': 'moves',
  'like': 'likes',
  'live': 'lives',
  'believe': 'believes',
  'hold': 'holds',
  'bring': 'brings',
  'happen': 'happens',
  'write': 'writes',
  'provide': 'provides',
  'sit': 'sits',
  'stand': 'stands',
  'lose': 'loses',
  'pay': 'pays',
  'meet': 'meets',
  'include': 'includes',
  'continue': 'continues',
  'set': 'sets',
  'learn': 'learns',
  'change': 'changes',
  'lead': 'leads',
  'understand': 'understands',
  'watch': 'watches',
  'follow': 'follows',
  'stop': 'stops',
  'create': 'creates',
  'speak': 'speaks',
  'read': 'reads',
  'allow': 'allows',
  'add': 'adds',
  'spend': 'spends',
  'grow': 'grows',
  'open': 'opens',
  'walk': 'walks',
  'win': 'wins',
  'offer': 'offers',
  'remember': 'remembers',
  'love': 'loves',
  'consider': 'considers',
  'appear': 'appears',
  'buy': 'buys',
  'wait': 'waits',
  'serve': 'serves',
  'die': 'dies',
  'send': 'sends',
  'expect': 'expects',
  'build': 'builds',
  'stay': 'stays',
  'fall': 'falls',
  'cut': 'cuts',
  'reach': 'reaches',
  'kill': 'kills',
  'remain': 'remains',
  'suggest': 'suggests',
  'raise': 'raises',
  'pass': 'passes',
  'sell': 'sells',
  'require': 'requires',
  'report': 'reports',
  'decide': 'decides',
  'explain': 'explains',
  'hope': 'hopes',
  'develop': 'develops',
  'carry': 'carries',
  'break': 'breaks',
  'receive': 'receives',
  'agree': 'agrees',
  'support': 'supports',
  'hit': 'hits',
  'produce': 'produces',
  'eat': 'eats',
  'cover': 'covers',
  'catch': 'catches',
  'draw': 'draws',
  'choose': 'chooses',
  'compare': 'compares',
  'jump': 'jumps',
  'pick': 'picks',
  'cook': 'cooks',
  'finish': 'finishes',
  'prefer': 'prefers',
  'match': 'matches',
  'hate': 'hates',
  'miss': 'misses',
  'avoid': 'avoids',
  'admit': 'admits',
  'practice': 'practices',
  'discuss': 'discusses',
  'enjoy': 'enjoys',
  'imagine': 'imagines',
  'mind': 'minds',
  'postpone': 'postpones',
  'quit': 'quits',
  'recommend': 'recommends',
  'resist': 'resists',
  'risk': 'risks',
  'attempt': 'attempts',
  'manage': 'manages',
  'plan': 'plans',
  'promise': 'promises',
  'refuse': 'refuses',
  'want': 'wants',
  'advise': 'advises',
  'apply': 'applies',
  'visit': 'visits',
  'text': 'texts',
  'sign': 'signs',
  'use': 'uses',
  'solve': 'solves',
  'know': 'knows',
  'drink': 'drinks',
  'drive': 'drives',
  'fly': 'flies',
  'swim': 'swims',
  'hike': 'hikes',
  'camp': 'camps',
  'shop': 'shops',
  'fish': 'fishes',
  'dance': 'dances',
  'jog': 'jogs',
  'exercise': 'exercises',
  'relax': 'relaxes',
};

/**
 * Get 3rd person singular form of a verb
 * Handles irregular verbs correctly
 */
function getThirdPersonSingular(verb: string): string {
  const lower = verb.toLowerCase();

  // Check irregular verbs first
  if (IRREGULAR_THIRD_PERSON[lower]) {
    return IRREGULAR_THIRD_PERSON[lower];
  }

  // Regular verbs: apply standard rules
  if (verb.endsWith('y')) {
    return verb.slice(0, -1) + 'ies';
  }
  if (verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('z') || verb.endsWith('ch') || verb.endsWith('sh')) {
    return verb + 'es';
  }

  // Default: just add 's'
  return verb + 's';
}

/**
 * Tokenize sentence for error correction, marking the error
 */
function tokenizeSentence(sentence: string, errorText: string): ErrorToken[] {
  const normalizedSentence = sentence.toLowerCase();
  const normalizedError = errorText.toLowerCase();
  const errorIndex = normalizedSentence.indexOf(normalizedError);

  if (errorIndex === -1) {
    // Fallback: split by words
    const words = sentence.split(/(\s+)/);
    let errorAssigned = false;
    return words.map(word => {
      const stripped = word.replace(/[.,!?;:]$/, '');
      const isError = !errorAssigned && stripped.toLowerCase() === errorText.toLowerCase();
      if (isError) errorAssigned = true;
      return { text: word, isError };
    });
  }

  const tokens: ErrorToken[] = [];
  const before = sentence.slice(0, errorIndex);
  const core = sentence.slice(errorIndex, errorIndex + errorText.length);
  const after = sentence.slice(errorIndex + errorText.length);

  // Add "before" tokens
  if (before) {
    const parts = before.split(/(\s+)/);
    parts.forEach(text => {
      if (text) tokens.push({ text, isError: false });
    });
  }

  // Add the error as a single token
  tokens.push({ text: core, isError: true });

  // Add "after" tokens
  if (after) {
    const parts = after.split(/(\s+)/);
    parts.forEach(text => {
      if (text) tokens.push({ text, isError: false });
    });
  }

  return tokens;
}

/**
 * Stems that are already the base form (no silent 'e').
 * baseFromGerund must not add 'e' to these (e.g. eating→eat, cooking→cook).
 */
const BASE_STEMS_NO_SILENT_E = new Set([
  'eat', 'sit', 'hit', 'put', 'get', 'set', 'let', 'bet', 'met', 'cut', 'run',
  'win', 'begin', 'quit', 'fit', 'bit', 'knit', 'spit', 'split', 'omit',
  'admit', 'commit', 'permit', 'transmit', 'submit', 'lit', 'wit', 'pit',
  'cook', 'look', 'book', 'hook', 'shook', 'walk', 'talk', 'work', 'ask', 'risk',
  'pick', 'check', 'lock', 'block', 'sink', 'drink', 'think', 'thank', 'link',
]);

/**
 * Extract base verb from gerund form
 * Handles common verb transformations: running→run, making→make, lying→lie, etc.
 */
function baseFromGerund(gerund: string): string {
  const lower = gerund.toLowerCase();

  // Handle infinitive form (shouldn't happen but just in case)
  if (lower.startsWith('to ')) {
    return lower.slice(3);
  }

  // Not a gerund, return as-is
  if (!lower.endsWith('ing')) {
    return lower;
  }

  const stem = lower.slice(0, -3);
  const vowels = 'aeiou';

  // 1. Double consonant only (running → run, swimming → swim); not double vowel (sightseeing → sightsee)
  const last = stem[stem.length - 1];
  if (stem.length > 2 && last === stem[stem.length - 2] && !vowels.includes(last)) {
    return stem.slice(0, -1);
  }

  // 2. ying → ie (lying → lie, tying → tie, BUT NOT buying → buy)
  if (lower.endsWith('ying')) {
    const prevChar = stem.length >= 2 ? stem[stem.length - 2] : '';
    if (!vowels.includes(prevChar)) {
      return stem.slice(0, -1) + 'ie';
    }
  }

  // 3. Handle silent 'e' restoration (solving → solve, making → make)
  // Do NOT add 'e' for stems that are already the base form (eat, sit, hit, etc.)
  if (stem.length >= 2) {
    const last = stem[stem.length - 1];
    const prev = stem[stem.length - 2];

    // Verbs ending in 'y', 'w', 'x' don't use silent 'e' after a vowel
    if (['y', 'w', 'x'].includes(last)) return stem;

    // Stems that are already base forms (eating→eat, sitting→sit, not eate/sitte)
    if (BASE_STEMS_NO_SILENT_E.has(stem)) return stem;

    // Common consonants that take silent 'e'
    if (!vowels.includes(last) && vowels.includes(prev)) {
      return stem + 'e';
    }
  }

  return stem;
}

/**
 * Escape string for use in RegExp
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ---------------------------------------------------------------------------
// EXPORTS FOR USE IN MAIN EXERCISE GENERATORS
// ---------------------------------------------------------------------------

export {
  createSelectionContext,
  type SelectionContext,
};
