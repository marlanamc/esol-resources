/**
 * Exercise Generators for Gerunds & Infinitives Pattern Discovery Game
 * Creates 6 types of exercises for each pattern group
 */

import type {
  GIExercise,
  GIExerciseType,
  GerundInfinitiveGroup,
  GerundInfinitivePattern,
  PatternPerformance,
  ErrorToken,
  SortingItem,
} from '@/types/gerund-infinitive';
import { GI_GROUPS } from '@/data/gerund-infinitive-groups';

// ---------------------------------------------------------------------------
// MAIN GENERATORS
// ---------------------------------------------------------------------------

/**
 * Generate a round of exercises for a group (Round 1 — patterns wide first).
 * Returns ~10 exercises mixing all 6 types.
 */
export function generateExercises(
  group: GerundInfinitiveGroup,
  count = 10,
  hideExplanations = false,
  includePatternSorting = true
): GIExercise[] {
  const allPatterns = getAllPatterns(group);
  if (allPatterns.length === 0) return [];

  const isPrepositionChoiceGroup = group.id === 'group-1b';
  const isComboGroup = group.id === 'group-1d';
  const nonSortingTypes: GIExerciseType[] = isComboGroup
    ? ['combo-challenge', 'combo-challenge', 'combo-challenge']
    : isPrepositionChoiceGroup
    ? ['preposition-choice', 'error-correction', 'preposition-choice']
    : [
        'pattern-choice',
        'sentence-completion',
        'rule-application',
        'error-correction',
      ];

  const plannedTypes: GIExerciseType[] = [];
  // Pattern sorting requires meta-awareness of all patterns — only at mastery (difficulty 3)
  if (count > 0 && includePatternSorting && !isPrepositionChoiceGroup && group.difficulty === 3) {
    plannedTypes.push('pattern-sorting');
  }

  // For groups with meaning-distinction patterns (6b), include that type
  const hasMeaningChange = allPatterns.some(p => p.category === 'meaning-change');
  if (hasMeaningChange) plannedTypes.push('meaning-distinction');

  for (let i = plannedTypes.length; i < count; i++) {
    plannedTypes.push(nonSortingTypes[i % nonSortingTypes.length]);
  }

  const shuffledTypes = shuffleArray(plannedTypes).slice(0, count);
  const patternPool = shuffleArray([...allPatterns]);

  const exercises: GIExercise[] = [];
  for (let i = 0; i < count; i++) {
    const type = shuffledTypes[i];
    const pattern = patternPool[i % patternPool.length];
    const ex = createExercise(type, group, pattern, hideExplanations);
    if (ex) exercises.push(ex);
  }

  return exercises;
}

/**
 * Generate targeted Round 2 exercises focusing on patterns the student missed.
 */
export function generateTargetedRound2Exercises(
  group: GerundInfinitiveGroup,
  patternStats: Record<string, PatternPerformance> = {},
  count = 8,
  hideExplanations = false
): GIExercise[] {
  const allPatterns = getAllPatterns(group);
  const prioritized = [...allPatterns].sort((a, b) => {
    const aStats = patternStats[a.id];
    const bStats = patternStats[b.id];
    const aScore = (aStats?.round1Misses ?? 0) * 4 + (aStats?.misses ?? 0) * 2 - (aStats?.correct ?? 0);
    const bScore = (bStats?.round1Misses ?? 0) * 4 + (bStats?.misses ?? 0) * 2 - (bStats?.correct ?? 0);
    return bScore - aScore;
  });

  // Build targeted pattern list — repeat missed ones
  const selectedPatterns: GerundInfinitivePattern[] = [];
  while (selectedPatterns.length < count && prioritized.length > 0) {
    const p = prioritized[selectedPatterns.length % prioritized.length];
    selectedPatterns.push(p);
    if ((patternStats[p.id]?.round1Misses ?? 0) > 0 && selectedPatterns.length < count) {
      selectedPatterns.push(p);
    }
  }

  const isPrepositionChoiceGroup = group.id === 'group-1b';
  const isComboGroup = group.id === 'group-1d';
  const plan: GIExerciseType[] = isComboGroup
    ? ['combo-challenge', 'combo-challenge', 'combo-challenge', 'combo-challenge', 'combo-challenge', 'combo-challenge', 'combo-challenge', 'combo-challenge']
    : isPrepositionChoiceGroup
    ? ['preposition-choice', 'error-correction', 'preposition-choice', 'error-correction', 'preposition-choice', 'error-correction', 'preposition-choice', 'preposition-choice']
    : [
        'pattern-choice',
        'sentence-completion',
        'pattern-choice',
        'error-correction',
        'sentence-completion',
        'pattern-choice',
        'sentence-completion',
        'rule-application',
      ];

  return selectedPatterns.slice(0, count).map((pattern, index) => {
    const type = plan[index] ?? (isComboGroup ? 'combo-challenge' : isPrepositionChoiceGroup ? 'preposition-choice' : 'pattern-choice');
    return createExercise(type, group, pattern, hideExplanations)
      ?? (isComboGroup
        ? createComboChallengeExercise(group, pattern, hideExplanations)
        : pattern.category === 'preposition-choice'
        ? createPrepositionChoiceExercise(group, pattern, hideExplanations)
        : createPatternChoiceExercise(group, pattern, hideExplanations));
  });
}

/**
 * Generate mixed review exercises across multiple groups.
 */
export function generateMixedReviewExercises(
  groups: GerundInfinitiveGroup[],
  patternStatsByid: Record<string, PatternPerformance> = {},
  count = 12,
  hideExplanations = false
): GIExercise[] {
  const pool = groups.flatMap(group =>
    group.patterns.map(pattern => ({ group, pattern }))
  );

  const prioritized = pool.sort(({ pattern: a }, { pattern: b }) => {
    const aStats = patternStatsByid[a.id];
    const bStats = patternStatsByid[b.id];
    const aScore = (aStats?.round2Misses ?? 0) * 4 + (aStats?.misses ?? 0) * 2 - (aStats?.correct ?? 0);
    const bScore = (bStats?.round2Misses ?? 0) * 4 + (bStats?.misses ?? 0) * 2 - (bStats?.correct ?? 0);
    return bScore - aScore;
  });

  return shuffleArray(prioritized).slice(0, count).map(({ group, pattern }, index) => {
    const isComboGroup = group.id === 'group-1d';
    const isPrepositionChoice = pattern.category === 'preposition-choice' && !isComboGroup;
    const type: GIExerciseType = isComboGroup
      ? 'combo-challenge'
      : isPrepositionChoice
      ? (index % 2 === 0 ? 'preposition-choice' : 'error-correction')
      : index % 3 === 0
        ? 'sentence-completion'
        : index % 2 === 0
          ? 'error-correction'
          : 'pattern-choice';
    return createExercise(type, group, pattern, hideExplanations)
      ?? (isComboGroup
        ? createComboChallengeExercise(group, pattern, hideExplanations)
        : isPrepositionChoice
        ? createPrepositionChoiceExercise(group, pattern, hideExplanations)
        : createPatternChoiceExercise(group, pattern, hideExplanations));
  });
}

/**
 * Generate checkpoint review exercises.
 * Pulls patterns from multiple previously-learned groups with adaptive difficulty.
 * @param reviewGroups - Groups to pull patterns from
 * @param patternStats - Performance stats for prioritizing weak patterns
 * @param count - Number of exercises (default 10)
 * @param currentStreak - Current correct streak (for adaptive hints)
 */
export function generateCheckpointExercises(
  reviewGroups: GerundInfinitiveGroup[],
  patternStats: Record<string, PatternPerformance> = {},
  count = 10,
  currentStreak = 0
): GIExercise[] {
  // Pool all patterns from review groups
  const pool = reviewGroups.flatMap(group =>
    group.patterns.map(pattern => ({ group, pattern }))
  );

  if (pool.length === 0) return [];

  // Prioritize patterns where student struggled
  const prioritized = [...pool].sort(({ pattern: a }, { pattern: b }) => {
    const aStats = patternStats[a.id];
    const bStats = patternStats[b.id];
    // Higher score = more struggling = higher priority
    const aScore = (aStats?.round1Misses ?? 0) * 3 + (aStats?.misses ?? 0) * 2 - (aStats?.correct ?? 0);
    const bScore = (bStats?.round1Misses ?? 0) * 3 + (bStats?.misses ?? 0) * 2 - (bStats?.correct ?? 0);
    return bScore - aScore;
  });

  // Take top strugglers first, then shuffle the rest
  const topStrugglers = prioritized.slice(0, Math.ceil(count * 0.4));
  const others = shuffleArray(prioritized.slice(Math.ceil(count * 0.4)));
  const selected = [...topStrugglers, ...others].slice(0, count);

  // Adaptive hints: hide explanations if streak is 5+
  const hideExplanations = currentStreak >= 5;

  // Vary exercise types for engagement
  const exerciseTypes: GIExerciseType[] = [
    'pattern-choice', 'sentence-completion', 'pattern-choice',
    'error-correction', 'sentence-completion', 'rule-application',
    'pattern-choice', 'error-correction', 'sentence-completion', 'pattern-choice'
  ];

  return selected.map(({ group, pattern }, index) => {
    const isComboGroup = group.id === 'group-1d';
    const isPrepositionChoice = pattern.category === 'preposition-choice' && !isComboGroup;

    let type: GIExerciseType;
    if (isComboGroup) {
      type = 'combo-challenge';
    } else if (isPrepositionChoice) {
      type = index % 2 === 0 ? 'preposition-choice' : 'error-correction';
    } else {
      type = exerciseTypes[index % exerciseTypes.length];
    }

    return createExercise(type, group, pattern, hideExplanations)
      ?? (isComboGroup
        ? createComboChallengeExercise(group, pattern, hideExplanations)
        : isPrepositionChoice
        ? createPrepositionChoiceExercise(group, pattern, hideExplanations)
        : createPatternChoiceExercise(group, pattern, hideExplanations));
  });
}

/**
 * Generate final challenge exercises (all patterns, no hints, increased variety).
 */
export function generateFinalChallengeExercises(
  passedGroups: GerundInfinitiveGroup[],
  count = 20,
): GIExercise[] {
  const pool = passedGroups.flatMap(group =>
    group.patterns.map(pattern => ({ group, pattern }))
  );

  const types: GIExerciseType[] = [
    'pattern-choice', 'error-correction', 'sentence-completion',
    'pattern-sorting', 'meaning-distinction', 'rule-application', 'preposition-choice', 'combo-challenge',
  ];

  return shuffleArray(pool).slice(0, count).map(({ group, pattern }, index) => {
    const isComboGroup = group.id === 'group-1d';
    // For combo group patterns, always use combo-challenge
    const type = isComboGroup ? 'combo-challenge' : types[index % types.length];
    return createExercise(type, group, pattern, /* hideExplanations */ true)
      ?? (isComboGroup
        ? createComboChallengeExercise(group, pattern, true)
        : pattern.category === 'preposition-choice'
        ? createPrepositionChoiceExercise(group, pattern, true)
        : createPatternChoiceExercise(group, pattern, true));
  });
}

// ---------------------------------------------------------------------------
// EXERCISE CREATION DISPATCH
// ---------------------------------------------------------------------------

function createExercise(
  type: GIExerciseType,
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise | null {
  // Skip error-correction for patterns where both forms are valid
  // (would create a "wrong" answer that's actually correct)
  const skipErrorCorrection = pattern.correctForm === 'both' || pattern.category === 'meaning-change';

  // Skip pattern-sorting for "both-ok" patterns (can't sort to one bucket)
  const skipPatternSorting = pattern.correctForm === 'both';

  // For preposition-choice patterns, only preposition-choice and error-correction apply
  const isPrepositionChoicePattern = pattern.category === 'preposition-choice';

  switch (type) {
    case 'preposition-choice':
      if (!isPrepositionChoicePattern) return null;
      return createPrepositionChoiceExercise(group, pattern, hideExplanations);
    case 'pattern-choice':
      if (isPrepositionChoicePattern) return createPrepositionChoiceExercise(group, pattern, hideExplanations);
      return createPatternChoiceExercise(group, pattern, hideExplanations);
    case 'rule-application':
      if (isPrepositionChoicePattern) return createPrepositionChoiceExercise(group, pattern, hideExplanations);
      return createRuleApplicationExercise(group, pattern, hideExplanations);
    case 'sentence-completion':
      if (isPrepositionChoicePattern) return createPrepositionChoiceExercise(group, pattern, hideExplanations);
      return createSentenceCompletionExercise(group, pattern, hideExplanations);
    case 'pattern-sorting':
      if (skipPatternSorting) return createPatternChoiceExercise(group, pattern, hideExplanations);
      return createPatternSortingExercise(group, pattern, hideExplanations);
    case 'error-correction':
      if (isPrepositionChoicePattern) return createPrepositionErrorCorrectionExercise(group, pattern, hideExplanations);
      if (skipErrorCorrection) return createSentenceCompletionExercise(group, pattern, hideExplanations);
      return createErrorCorrectionExercise(group, pattern, hideExplanations);
    case 'meaning-distinction':
      if (pattern.category !== 'meaning-change') return null;
      return createMeaningDistinctionExercise(group, pattern, hideExplanations);
    case 'combo-challenge':
      return createComboChallengeExercise(group, pattern, hideExplanations);
    default: return null;
  }
}

// ---------------------------------------------------------------------------
// PREPOSITION CHOICE (GROUP 1B)
// ---------------------------------------------------------------------------

const PREPOSITION_OPTIONS = ['in', 'at', 'for', 'of', 'about', 'to', 'from', 'with'];

function createPrepositionChoiceExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const correctPreposition = pattern.correctPreposition ?? example.blank;
  const distractors = PREPOSITION_OPTIONS.filter(p => p !== correctPreposition);
  const options = shuffleArray([correctPreposition, ...distractors.slice(0, 3)]);

  return {
    id: `prep-choice-${pattern.id}-${Date.now()}`,
    type: 'preposition-choice',
    groupId: group.id,
    patternId: pattern.id,
    prompt: example.sentence,
    correctAnswer: correctPreposition,
    options,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
  };
}

function createPrepositionErrorCorrectionExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const correctPreposition = pattern.correctPreposition ?? example.blank;
  const wrongPreposition = pickRandom(PREPOSITION_OPTIONS.filter(p => p !== correctPreposition));
  const erroneousSentence = example.sentence.replace('___', wrongPreposition);
  const tokens = tokenizeSentence(erroneousSentence, wrongPreposition);

  return {
    id: `prep-error-${pattern.id}-${Date.now()}`,
    type: 'error-correction',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Find and click the incorrect preposition in this sentence.`,
    correctAnswer: correctPreposition,
    errorTokens: tokens,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
  };
}

// ---------------------------------------------------------------------------
// COMBO CHALLENGE (GROUP 1D) - preposition + gerund together
// Two types:
// Type A: Same gerund, different prepositions (+ base verb hint)
// Type B: Different gerunds with their correct prepositions (no hint - harder!)
// ---------------------------------------------------------------------------

// Common verbs for generating distractors
const COMBO_DISTRACTOR_VERBS = ['learn', 'work', 'help', 'wait', 'make', 'start', 'go', 'take', 'see', 'meet', 'finish', 'try'];

function createComboChallengeExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const correctPreposition = pattern.correctPreposition ?? 'in';

  // Extract the base verb from the sentence (e.g., "learn" from "(learn)")
  const baseVerbMatch = example.sentence.match(/\((\w+)\)/);
  const baseVerb = baseVerbMatch ? baseVerbMatch[1] : 'do';
  const gerundForm = gerundFrom(baseVerb);
  const correctAnswer = `${correctPreposition} ${gerundForm}`;

  // Clean up the prompt to show blanks without the base verb hint
  const cleanPrompt = example.sentence.replace(/\((\w+)\)/, '');

  // Randomly pick between Type A (50%) and Type B (50%)
  const useTypeB = Math.random() > 0.5;

  if (useTypeB) {
    // TYPE B: All different gerunds - no base verb hint, must know both parts
    // Get other patterns from the group for realistic distractors
    const otherPatterns = group.patterns.filter(p => p.id !== pattern.id);
    const shuffledOthers = shuffleArray(otherPatterns).slice(0, 3);

    // Generate distractor options using other adjective+preposition combos with different verbs
    const distractorVerbs = shuffleArray(
      COMBO_DISTRACTOR_VERBS.filter(v => v !== baseVerb)
    ).slice(0, 3);

    const distractors = shuffledOthers.map((p, i) => {
      const prep = p.correctPreposition ?? 'in';
      const verb = gerundFrom(distractorVerbs[i] || 'doing');
      return `${prep} ${verb}`;
    });

    // If we don't have enough other patterns, fill with wrong prepositions
    while (distractors.length < 3) {
      const wrongPrep = pickRandom(PREPOSITION_OPTIONS.filter(p => p !== correctPreposition));
      const wrongVerb = gerundFrom(pickRandom(distractorVerbs));
      distractors.push(`${wrongPrep} ${wrongVerb}`);
    }

    const options = shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);

    return {
      id: `combo-b-${pattern.id}-${Date.now()}`,
      type: 'combo-challenge',
      groupId: group.id,
      patternId: pattern.id,
      prompt: cleanPrompt,
      correctAnswer,
      options,
      // No baseVerb hint for Type B - they must figure it out!
      showPattern: !hideExplanations,
      realWorldContext: example.context,
    };
  } else {
    // TYPE A: Same gerund, different prepositions (original behavior with base verb hint)
    const wrongPrepositions = shuffleArray(
      PREPOSITION_OPTIONS.filter(p => p !== correctPreposition)
    ).slice(0, 3);

    const options = shuffleArray([
      correctAnswer,
      `${wrongPrepositions[0]} ${gerundForm}`,
      `${wrongPrepositions[1]} ${gerundForm}`,
      `${wrongPrepositions[2]} ${gerundForm}`,
    ]);

    return {
      id: `combo-a-${pattern.id}-${Date.now()}`,
      type: 'combo-challenge',
      groupId: group.id,
      patternId: pattern.id,
      prompt: cleanPrompt,
      correctAnswer,
      options,
      baseVerb, // Show base verb hint for Type A
      showPattern: !hideExplanations,
      realWorldContext: example.context,
    };
  }
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE 1: PATTERN CHOICE
// ---------------------------------------------------------------------------

function createPatternChoiceExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const sentence = example.sentence;
  const correctAnswer = example.blank;

  // Build alternative options
  const isGerund = pattern.correctForm === 'gerund';
  const isBoth = pattern.correctForm === 'both';

  let options: string[];
  if (isBoth) {
    // For "both OK", show both forms as acceptable — we display the gerund
    const gerundForm = correctAnswer.split(' / ')[0];
    const infinitiveForm = correctAnswer.split(' / ')[1] ?? ('to ' + gerundForm.replace(/ing$/, ''));
    options = [gerundForm, infinitiveForm];
  } else {
    // Create distractor from alternate form
    const distractor = isGerund
      ? 'to ' + baseFrom(correctAnswer)
      : gerundFrom(correctAnswer.replace(/^to /, ''));
    options = shuffleArray([correctAnswer, distractor]);
  }

  return {
    id: `choice-${pattern.id}-${Date.now()}`,
    type: 'pattern-choice',
    groupId: group.id,
    patternId: pattern.id,
    prompt: sentence,
    correctAnswer: isBoth ? correctAnswer.split(' / ')[0] : correctAnswer,
    options,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
  };
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE 2: RULE APPLICATION
// ---------------------------------------------------------------------------

function createRuleApplicationExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);

  // Ask what comes BEFORE the blank — what category of word triggers the pattern
  const categoryLabel = getCategoryLabel(pattern.category);
  const otherCategories = OTHER_CATEGORIES.filter(c => c !== categoryLabel);
  const distractors = shuffleArray(otherCategories).slice(0, 3);
  const options = shuffleArray([categoryLabel, ...distractors]);

  return {
    id: `rule-${pattern.id}-${Date.now()}`,
    type: 'rule-application',
    groupId: group.id,
    patternId: pattern.id,
    prompt: example.sentence,
    correctAnswer: categoryLabel,
    options,
    highlightedWord: example.blank,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
  };
}

const OTHER_CATEGORIES = [
  'preposition',
  'verb',
  'adjective',
  'noun',
  'GO + activity',
  'subject position',
  'both-form verb',
  'TO preposition trap',
];

function getCategoryLabel(category: GerundInfinitivePattern['category']): string {
  const map: Record<string, string> = {
    'preposition': 'preposition',
    'verb-gerund': 'verb',
    'verb-infinitive': 'verb',
    'adjective': 'adjective',
    'noun': 'noun',
    'go-activity': 'GO + activity',
    'subject': 'subject position',
    'both-ok': 'verb',
    'meaning-change': 'verb',
    'to-preposition': 'TO preposition trap',
  };
  return map[category] ?? category;
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE 3: SENTENCE COMPLETION
// ---------------------------------------------------------------------------

function createSentenceCompletionExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const baseVerb = baseFrom(example.blank);

  return {
    id: `sentence-${pattern.id}-${Date.now()}`,
    type: 'sentence-completion',
    groupId: group.id,
    patternId: pattern.id,
    prompt: example.sentence.includes('___')
      ? example.sentence
      : example.sentence,
    correctAnswer: example.blank,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
    baseVerb,
  };
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE 4: PATTERN SORTING
// ---------------------------------------------------------------------------

function createPatternSortingExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  // Filter out "both-ok" patterns - they can't be sorted to just one bucket
  const sortableGroupPatterns = group.patterns.filter(p => p.correctForm !== 'both');
  const thisGroupItems: SortingItem[] = sortableGroupPatterns.slice(0, 3).map(p => ({
    phrase: p.trigger,
    correctBucket: p.correctForm === 'infinitive' ? 'infinitive' : 'gerund',
    explanation: p.memoryTrick,
  }));

  // Also filter "both-ok" from distractors
  const otherGroupPatterns = GI_GROUPS
    .filter(g => g.id !== group.id)
    .flatMap(g => g.patterns)
    .filter(p => p.correctForm !== 'both');
  const distractorItems: SortingItem[] = shuffleArray(otherGroupPatterns)
    .slice(0, 2)
    .map(p => ({
      phrase: p.trigger,
      correctBucket: p.correctForm === 'infinitive' ? 'infinitive' : 'gerund',
    }));

  const allItems = shuffleArray([...thisGroupItems, ...distractorItems]).slice(0, 5);

  return {
    id: `sort-${pattern.id}-${Date.now()}`,
    type: 'pattern-sorting',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Sort each trigger word or phrase: does it need Gerund (-ing) or Infinitive (to + verb)?`,
    correctAnswer: pattern.correctForm === 'infinitive' ? 'infinitive' : 'gerund',
    options: allItems.map(i => i.phrase),
    sortingItems: allItems,
    showPattern: !hideExplanations,
  };
}

// ---------------------------------------------------------------------------
// EXERCISE TYPE 5: ERROR CORRECTION
// ---------------------------------------------------------------------------

function createErrorCorrectionExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  // Build a sentence that has a deliberate error (wrong form)
  const example = pickRandom(pattern.examples);
  const correctForm = example.blank;
  const isGerund = pattern.correctForm === 'gerund' || pattern.correctForm === 'both';

  // Create the erroneous form
  const wrongForm = isGerund
    ? 'to ' + baseFrom(correctForm)
    : gerundFrom(correctForm.replace(/^to /, ''));

  // Build the erroneous sentence and tokenize
  const erroneousSentence = example.sentence.replace('___', wrongForm);
  const tokens = tokenizeSentence(erroneousSentence, wrongForm);

  return {
    id: `error-${pattern.id}-${Date.now()}`,
    type: 'error-correction',
    groupId: group.id,
    patternId: pattern.id,
    prompt: `Find and click the incorrect word form in this sentence.`,
    correctAnswer: correctForm,
    errorTokens: tokens,
    showPattern: !hideExplanations,
    realWorldContext: example.context,
  };
}

function tokenizeSentence(sentence: string, errorText: string): ErrorToken[] {
  const normalizedSentence = sentence.toLowerCase();
  const normalizedError = errorText.toLowerCase();
  const errorIndex = normalizedSentence.indexOf(normalizedError);

  if (errorIndex === -1) {
    // Fallback if exact phrase not found (e.g. punctuation attached)
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

  // Add the error as a single combined token
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

// ---------------------------------------------------------------------------
// EXERCISE TYPE 6: MEANING DISTINCTION
// ---------------------------------------------------------------------------

function createMeaningDistinctionExercise(
  group: GerundInfinitiveGroup,
  pattern: GerundInfinitivePattern,
  hideExplanations: boolean
): GIExercise {
  const example = pickRandom(pattern.examples);
  const isGerundPattern = pattern.correctForm === 'gerund';

  const gerundLabel = 'gerund (-ing)';
  const infinitiveLabel = 'infinitive (to + verb)';
  const options = shuffleArray([gerundLabel, infinitiveLabel]);

  const explanation = example.explanation ?? pattern.memoryTrick ?? '';

  return {
    id: `meaning-${pattern.id}-${Date.now()}`,
    type: 'meaning-distinction',
    groupId: group.id,
    patternId: pattern.id,
    prompt: example.sentence,
    correctAnswer: isGerundPattern ? gerundLabel : infinitiveLabel,
    options,
    showPattern: !hideExplanations,
    meaningContext: {
      verb: (pattern.trigger.includes('stop') ? 'stop'
        : pattern.trigger.includes('remember') ? 'remember'
        : 'try') as 'stop' | 'remember' | 'try',
      gerundMeaning: isGerundPattern ? explanation : '',
      infinitiveMeaning: !isGerundPattern ? explanation : '',
      scenario: 'past',
    },
  };
}

// ---------------------------------------------------------------------------
// VALIDATE & FEEDBACK
// ---------------------------------------------------------------------------

export function validateAnswer(
  exercise: GIExercise,
  userAnswer: string | string[]
): boolean {
  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const normalize = (v: string) => v.trim().toLowerCase();
  const normalizedCorrect = correctAnswers.map(normalize);

  const normalizedUser = Array.isArray(userAnswer)
    ? normalize(userAnswer.find(p => p.trim().length > 0) ?? '')
    : normalize(userAnswer);

  return normalizedCorrect.some(c => {
    if (normalizedUser === c) return true;
    // For "both-ok" patterns allow either gerund or infinitive alternative
    if (c.includes(' / ')) {
      return c.split(' / ').map(normalize).includes(normalizedUser);
    }
    return false;
  });
}

export function getExerciseFeedback(exercise: GIExercise, correct: boolean): string {
  if (correct) {
    const feedbacks = ['✓ Correct!', '✓ Perfect!', '✓ Great!', '✓ Excellent!', '✓ You got it!'];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }

  const correct_answers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];
  return `Correct: ${correct_answers.join(' or ')}`;
}

export function getExerciseTypeLabel(type: GIExerciseType): string {
  const labels: Record<GIExerciseType, string> = {
    'pattern-choice': 'Pattern Choice',
    'rule-application': 'What Comes Before?',
    'sentence-completion': 'Complete the Sentence',
    'pattern-sorting': 'Pattern Sorting',
    'error-correction': 'Error Correction',
    'meaning-distinction': 'Meaning Distinction',
    'preposition-choice': 'Choose the Preposition',
    'combo-challenge': 'Combo Challenge',
  };
  return labels[type];
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function getAllPatterns(group: GerundInfinitiveGroup): GerundInfinitivePattern[] {
  return group.patterns;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Overrides for gerunds/infinitives where heuristic gets base form wrong */
const BASE_FROM_OVERRIDES: Record<string, string> = {
  // -it/-id verbs (edit, visit, etc. — heuristic wrongly adds 'e')
  editing: 'edit', visiting: 'visit', limiting: 'limit', omitting: 'omit',
  permitting: 'permit', submitting: 'submit', committing: 'commit',
  auditing: 'audit', crediting: 'credit', exhibiting: 'exhibit',
  inhibiting: 'inhibit', eliciting: 'elicit', orbiting: 'orbit',
  inheriting: 'inherit', benefitting: 'benefit', benefiting: 'benefit', profiting: 'profit',
  depositing: 'deposit', inhabiting: 'inhabit', prohibiting: 'prohibit',
  // -elp/-ork/-ait (help, work, wait — heuristic wrongly adds 'e')
  helping: 'help', working: 'work', waiting: 'wait',
  // -ying verbs (fly, try, study — ying heuristic wrongly returns -ie)
  buying: 'buy', saying: 'say', playing: 'play',
  flying: 'fly', trying: 'try', studying: 'study', crying: 'cry', drying: 'dry',
  // double-consonant stems that aren't CVC-doubled (tell, meet, attend, call, add, fall, sell)
  telling: 'tell', meeting: 'meet', attending: 'attend', calling: 'call',
  adding: 'add', falling: 'fall', selling: 'sell', filling: 'fill', pulling: 'pull',
  spelling: 'spell', killing: 'kill', rolling: 'roll', passing: 'pass', missing: 'miss',
  kissing: 'kiss', pressing: 'press', guessing: 'guess', blessing: 'bless',
  // double vowel stems (see, fee — heuristic wrongly shortens)
  seeing: 'see', agreeing: 'agree', fleeing: 'flee', freeing: 'free',
  // silent-e verbs where heuristic fails to restore 'e'
  changing: 'change', dancing: 'dance', raising: 'raise', pursuing: 'pursue',
  managing: 'manage', arranging: 'arrange', encouraging: 'encourage', exchanging: 'exchange',
  judging: 'judge', forcing: 'force', reducing: 'reduce', producing: 'produce',
  introducing: 'introduce', replacing: 'replace', placing: 'place', racing: 'race',
  facing: 'face', tracing: 'trace', spacing: 'space', pacing: 'pace',
  // -el/-al/-ol verbs (travel, cancel, etc. — heuristic wrongly adds 'e')
  traveling: 'travel', travelling: 'travel', starting: 'start',
  canceling: 'cancel', cancelling: 'cancel', modeling: 'model', modelling: 'model',
  labeling: 'label', labelling: 'label', leveling: 'level', levelling: 'level',
  totaling: 'total', totalling: 'total', signaling: 'signal', signalling: 'signal',
  channeling: 'channel', channelling: 'channel', counseling: 'counsel', counselling: 'counsel',
  // Multi-syllable -en verbs (listen, open, etc. — heuristic wrongly adds 'e')
  listening: 'listen', opening: 'open', happening: 'happen',
  softening: 'soften', hardening: 'harden', widening: 'widen',
  deepening: 'deepen', strengthening: 'strengthen', lengthening: 'lengthen',
  threatening: 'threaten', frightening: 'frighten', enlightening: 'enlighten',
  // Multi-syllable -er verbs (remember, offer, etc. — heuristic wrongly adds 'e')
  remembering: 'remember', offering: 'offer', entering: 'enter',
  covering: 'cover', answering: 'answer', considering: 'consider',
  delivering: 'deliver', discovering: 'discover', recovering: 'recover',
  registering: 'register', whispering: 'whisper', wandering: 'wander',
  wondering: 'wonder', differing: 'differ', suffering: 'suffer',
  murdering: 'murder', rendering: 'render', surrendering: 'surrender',
  triggering: 'trigger', lingering: 'linger', conquering: 'conquer',
  gathering: 'gather', bothering: 'bother', weathering: 'weather',
  // Other multi-syllable verbs
  focusing: 'focus', focussing: 'focus', developing: 'develop', worshiping: 'worship',
  budgeting: 'budget', targeting: 'target', marketing: 'market',
  pocketing: 'pocket', rocketing: 'rocket', bracketing: 'bracket',
};

/** Convert a gerund (walking) to base form (walk) */
function baseFrom(gerund: string): string {
  const lower = gerund.toLowerCase();
  if (BASE_FROM_OVERRIDES[lower]) return BASE_FROM_OVERRIDES[lower];
  if (gerund.startsWith('to ')) return gerund.slice(3);
  if (gerund.endsWith('ing')) {
    const stem = gerund.slice(0, -3);
    const vowels = 'aeiou';

    // 1. Double consonant (running -> run, swimming -> swim)
    if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
      return stem.slice(0, -1);
    }

    // 2. ying -> ie (lying -> lie, tying -> tie, BUT NOT buying -> buy)
    if (gerund.endsWith('ying')) {
      // Only change to 'ie' if it's a very short stem (ly, ty, dy) or has a consonant before 'y'
      const prevChar = stem.length >= 2 ? stem[stem.length - 2] : '';
      if (!vowels.includes(prevChar)) {
        return stem.slice(0, -1) + 'ie';
      }
    }

    // 3. Handle silent 'e' restoration (solving -> solve, making -> make)
    if (stem.length >= 2) {
      const last = stem[stem.length - 1];
      const prev = stem[stem.length - 2];
      
      // Verbs ending in 'y', 'w', 'x' don't use silent 'e' after a vowel (buy, low, fix)
      if (['y', 'w', 'x'].includes(last)) return stem;

      // Verbs ending in 'v' always have 'e' in English
      if (last === 'v') return stem + 'e';

      if (vowels.includes(prev) && !vowels.includes(last)) {
        // Check if there's a second vowel before (read, mean, feel -> no 'e')
        if (stem.length >= 3) {
          const prevPrev = stem[stem.length - 3];
          if (!vowels.includes(prevPrev)) {
            // [consonant][vowel][consonant]ing -> likely dropped an 'e'
            if (stem.length > 3 || !['ing', 'ong', 'ung'].some(end => stem.endsWith(end))) {
              return stem + 'e';
            }
          }
        } else {
          return stem + 'e';
        }
      }
    }
    return stem;
  }
  return gerund;
}


/**
 * Overrides for gerunds where CVC heuristic wrongly doubles the final consonant.
 * Multi-syllable words with stress NOT on the final syllable don't double.
 */
const GERUND_FROM_OVERRIDES: Record<string, string> = {
  // Multi-syllable words ending in -er (stress not on final syllable)
  remember: 'remembering', offer: 'offering', enter: 'entering',
  cover: 'covering', answer: 'answering', consider: 'considering',
  deliver: 'delivering', discover: 'discovering', recover: 'recovering',
  register: 'registering', whisper: 'whispering', wander: 'wandering',
  wonder: 'wondering', differ: 'differing', suffer: 'suffering',
  murder: 'murdering', render: 'rendering', surrender: 'surrendering',
  trigger: 'triggering', linger: 'lingering', conquer: 'conquering',
  gather: 'gathering', bother: 'bothering', weather: 'weathering',

  // Multi-syllable words ending in -en (stress not on final syllable)
  listen: 'listening', open: 'opening', happen: 'happening',
  soften: 'softening', harden: 'hardening', widen: 'widening',
  deepen: 'deepening', strengthen: 'strengthening', lengthen: 'lengthening',
  threaten: 'threatening', frighten: 'frightening', enlighten: 'enlightening',

  // Multi-syllable words ending in -it (stress not on final syllable)
  visit: 'visiting', limit: 'limiting', credit: 'crediting',
  edit: 'editing', audit: 'auditing', profit: 'profiting',
  exhibit: 'exhibiting', inhabit: 'inhabiting', prohibit: 'prohibiting',
  deposit: 'depositing', inherit: 'inheriting', benefit: 'benefiting',

  // Multi-syllable words ending in -el/-al/-ol (stress not on final syllable)
  travel: 'traveling', cancel: 'canceling', model: 'modeling',
  label: 'labeling', level: 'leveling', total: 'totaling',
  signal: 'signaling', channel: 'channeling', counsel: 'counseling',

  // Other multi-syllable words (stress not on final syllable)
  focus: 'focusing', develop: 'developing', worship: 'worshiping',
  budget: 'budgeting', target: 'targeting', market: 'marketing',
  pocket: 'pocketing', rocket: 'rocketing', bracket: 'bracketing',
};

/** Build gerund from base form */
function gerundFrom(base: string): string {
  const lower = base.toLowerCase();
  if (GERUND_FROM_OVERRIDES[lower]) return GERUND_FROM_OVERRIDES[lower];
  if (base.endsWith('e') && !base.endsWith('ee')) return base.slice(0, -1) + 'ing';
  if (base.endsWith('ie')) return base.slice(0, -2) + 'ying';
  // CVC doubling (run → running), but NOT for final -y/-w (buy → buying, not buyying)
  // This rule is only reliable for single-syllable words; multi-syllable words are in overrides
  const vowels = 'aeiou';
  const len = base.length;
  const last = base[len - 1];
  if (
    len >= 3 &&
    len <= 4 && // Only apply to short (likely single-syllable) words
    !['y', 'w', 'x'].includes(last) &&
    !vowels.includes(last) &&
    vowels.includes(base[len - 2]) &&
    !vowels.includes(base[len - 3])
  ) {
    return base + last + 'ing';
  }
  return base + 'ing';
}
