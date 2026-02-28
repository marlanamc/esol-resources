/**
 * Exercise Generators for Irregular Verbs Game
 * Creates varied exercises across 5 types for each verb group
 */

import type { VerbExercise, ExerciseType, VerbGroup, IrregularVerb } from '@/types/irregular-verbs';
import { VERB_GROUPS } from '@/data/irregular-verbs-groups';

/**
 * Generate a round of exercises for a group
 * Returns a mix of exercise types for variety
 */
export function generateExercises(
  group: VerbGroup,
  count: number = 10,
  hideExplanations: boolean = false
): VerbExercise[] {
  const exercises: VerbExercise[] = [];
  const nonPatternTypes: ExerciseType[] = [
    'fill-in-blank',
    'multiple-choice',
    'sentence-completion',
    'speed-matching'
  ];
  const plannedTypes: ExerciseType[] = [];

  if (count > 0) {
    // Keep pattern-recognition to one question per round.
    plannedTypes.push('pattern-sorting');
  }

  for (let i = plannedTypes.length; i < count; i++) {
    plannedTypes.push(nonPatternTypes[(i - 1) % nonPatternTypes.length]);
  }

  // Create a shuffled verb pool to avoid repeats
  const verbPool = shuffleArray([...group.verbs]);
  const shuffledTypes = shuffleArray(plannedTypes);

  for (let i = 0; i < count; i++) {
    const type = shuffledTypes[i];
    const verbIndex = i % verbPool.length;
    const verb = verbPool[verbIndex];

    const exercise = createExercise(type, group, verb, hideExplanations);
    if (exercise) {
      exercises.push(exercise);
    }
  }

  return exercises;
}

/**
 * Create a single exercise based on type
 */
function createExercise(
  type: ExerciseType,
  group: VerbGroup,
  verb: IrregularVerb,
  hideExplanations: boolean
): VerbExercise | null {
  switch (type) {
    case 'fill-in-blank':
      return createFillInBlankExercise(verb, group, hideExplanations);
    case 'multiple-choice':
      return createMultipleChoiceExercise(verb, group, hideExplanations);
    case 'sentence-completion':
      return createSentenceCompletionExercise(verb, group, hideExplanations);
    case 'pattern-sorting':
      return createPatternSortingExercise(verb, group, hideExplanations);
    case 'speed-matching':
      return createSpeedMatchingExercise(verb, group, hideExplanations);
    default:
      return null;
  }
}

/**
 * EXERCISE TYPE 1: FILL-IN-BLANK
 * Show V1 (base), student fills in V2/V3
 * Example: "cut → ____ → ____"
 * Uses V1/V2/V3 terminology for consistency
 */
function createFillInBlankExercise(
  verb: IrregularVerb,
  group: VerbGroup,
  hideExplanations: boolean
): VerbExercise {
  // Randomly decide which forms to show/hide
  const showWhat = Math.random();
  let prompt: string;
  let correctAnswer: string | string[];

  if (showWhat < 0.33) {
    // Show V1, fill V2 and V3
    prompt = `${verb.base} → ____ → ____`;
    correctAnswer = [verb.past, verb.pastParticiple];
  } else if (showWhat < 0.66) {
    // Show V1 and V2, fill V3
    prompt = `${verb.base} → ${verb.past} → ____`;
    correctAnswer = verb.pastParticiple;
  } else {
    // Show V1 and V3, fill V2
    prompt = `${verb.base} → ____ → ${verb.pastParticiple}`;
    correctAnswer = verb.past;
  }

  return {
    id: `fill-${verb.base}-${Date.now()}`,
    type: 'fill-in-blank',
    groupId: group.id,
    prompt: `Complete the verb forms (V1 → V2 → V3): ${prompt}`,
    verb,
    correctAnswer,
    showPattern: !hideExplanations,
    sentenceContext: undefined
  };
}

/**
 * EXERCISE TYPE 2: MULTIPLE CHOICE
 * Choose correct form from 4 options
 * Uses V1/V2/V3 terminology
 */
function createMultipleChoiceExercise(
  verb: IrregularVerb,
  group: VerbGroup,
  hideExplanations: boolean
): VerbExercise {
  // Randomly ask about V2 or V3
  const askAboutV2 = Math.random() > 0.5;
  const correctForm = askAboutV2 ? verb.past : verb.pastParticiple;
  const question = askAboutV2
    ? `What is the V2 form of "${verb.base}"?`
    : `What is the V3 form of "${verb.base}"?`;

  // Generate distractors
  const distractors = generateDistractors(verb, correctForm, 3);
  const options = shuffleArray([correctForm, ...distractors]);

  return {
    id: `choice-${verb.base}-${askAboutV2 ? 'v2' : 'v3'}-${Date.now()}`,
    type: 'multiple-choice',
    groupId: group.id,
    prompt: question,
    verb,
    correctAnswer: correctForm,
    options,
    showPattern: !hideExplanations
  };
}

/**
 * EXERCISE TYPE 3: SENTENCE COMPLETION
 * Complete sentence with correct verb form
 */
function createSentenceCompletionExercise(
  verb: IrregularVerb,
  group: VerbGroup,
  hideExplanations: boolean
): VerbExercise {
  const verbContexts: Record<string, { past: string; participle: string }> = {
    be: { past: 'Yesterday, I _____ very tired after work.', participle: 'I have _____ very busy this week.' },
    begin: { past: 'The class _____ at 9:00 this morning.', participle: 'The movie has _____ already.' },
    bite: { past: 'The dog _____ my shoe yesterday.', participle: 'He has never _____ his nails.' },
    blow: { past: 'The wind _____ all night.', participle: 'The candles have _____ out.' },
    break: { past: 'I _____ my glasses last year.', participle: 'She has _____ her phone again.' },
    bring: { past: 'She _____ snacks to class yesterday.', participle: 'I have _____ my homework with me.' },
    build: { past: 'They _____ a new bridge here.', participle: 'The company has _____ three offices.' },
    buy: { past: 'We _____ groceries after work.', participle: 'He has _____ a new laptop.' },
    catch: { past: 'I _____ the last bus home.', participle: 'She has _____ a cold.' },
    choose: { past: 'He _____ the blue shirt.', participle: 'They have _____ a new team leader.' },
    cost: { past: 'That trip _____ too much money.', participle: 'This project has _____ us a lot.' },
    cut: { past: 'I _____ my finger while cooking.', participle: 'She has _____ the paper into strips.' },
    deal: { past: 'We _____ with that problem yesterday.', participle: 'He has _____ with this before.' },
    do: { past: 'I _____ my chores last night.', participle: 'They have _____ a great job.' },
    drink: { past: 'She _____ coffee this morning.', participle: 'I have never _____ soda.' },
    drive: { past: 'He _____ to school yesterday.', participle: 'She has _____ in heavy snow before.' },
    eat: { past: 'We _____ dinner at six.', participle: 'I have already _____ lunch.' },
    fall: { past: 'He _____ on the ice last winter.', participle: 'Many leaves have _____ from the tree.' },
    feel: { past: 'I _____ better after resting.', participle: 'She has _____ this way before.' },
    fight: { past: 'The teams _____ hard for the win.', participle: 'They have _____ about this issue before.' },
    find: { past: 'I _____ my keys under the couch.', participle: 'She has _____ a better solution.' },
    fly: { past: 'They _____ to Chicago last week.', participle: 'I have never _____ first class.' },
    get: { past: 'We _____ home very late.', participle: 'He has _____ much stronger.' },
    give: { past: 'She _____ me good advice.', participle: 'They have _____ us extra time.' },
    go: { past: 'I _____ to bed early last night.', participle: 'He has _____ to Mexico twice.' },
    grow: { past: 'The plant _____ quickly in summer.', participle: 'Our team has _____ a lot this year.' },
    have: { past: 'I _____ a headache yesterday.', participle: 'We have _____ this conversation already.' },
    hear: { past: 'I _____ a strange noise last night.', participle: 'She has _____ that story before.' },
    hit: { past: 'The ball _____ the window.', participle: 'He has _____ that target before.' },
    hold: { past: 'She _____ the door open for me.', participle: 'They have _____ this event for years.' },
    hurt: { past: 'I _____ my back at the gym.', participle: 'He has _____ his ankle before.' },
    keep: { past: 'We _____ the receipt for records.', participle: 'She has _____ all your messages.' },
    know: { past: 'I _____ the answer yesterday.', participle: 'They have _____ each other for years.' },
    lead: { past: 'She _____ the meeting yesterday.', participle: 'He has _____ this team since 2024.' },
    learn: { past: 'I _____ a lot in that class.', participle: 'She has _____ English for two years.' },
    leave: { past: 'We _____ the office at 5:00.', participle: 'They have _____ already.' },
    let: { past: 'My teacher _____ us leave early.', participle: 'He has _____ this happen too many times.' },
    make: { past: 'I _____ pasta for dinner.', participle: 'She has _____ a big decision.' },
    mean: { past: 'I _____ to call you yesterday.', participle: 'That has _____ a lot to me.' },
    meet: { past: 'We _____ our new neighbor yesterday.', participle: 'I have _____ her before.' },
    pay: { past: 'He _____ the bill yesterday.', participle: 'We have _____ for the tickets.' },
    put: { past: 'I _____ the books on the shelf.', participle: 'She has _____ her phone away.' },
    quit: { past: 'He _____ his job last month.', participle: 'She has _____ smoking.' },
    ring: { past: 'The bell _____ at noon.', participle: 'My phone has _____ three times.' },
    ride: { past: 'I _____ my bike to school.', participle: 'They have _____ that roller coaster before.' },
    say: { past: 'She _____ hello to everyone.', participle: 'I have already _____ what I think.' },
    see: { past: 'We _____ a rainbow after the storm.', participle: 'I have _____ that movie twice.' },
    sell: { past: 'They _____ their old car.', participle: 'He has _____ all the tickets.' },
    send: { past: 'I _____ the email this morning.', participle: 'She has _____ the package already.' },
    set: { past: 'He _____ the alarm for 6:00.', participle: 'They have _____ clear goals.' },
    shake: { past: 'I _____ hands with the principal.', participle: 'She has _____ that bottle already.' },
    shine: { past: 'The sun _____ all day.', participle: 'His work has _____ this semester.' },
    shoot: { past: 'The player _____ from long range.', participle: 'She has _____ many photos.' },
    shut: {
      past: 'She _____ the door hard when she was angry.',
      participle: 'She has _____ the door hard before leaving.'
    },
    sing: { past: 'They _____ at the school concert.', participle: 'She has _____ in that choir for years.' },
    sink: { past: 'The boat _____ in the storm.', participle: 'The sun has _____ below the horizon.' },
    sit: { past: 'We _____ near the front yesterday.', participle: 'I have _____ here since 8:00.' },
    sleep: { past: 'I _____ very well last night.', participle: 'He has _____ only four hours.' },
    speak: { past: 'She _____ with the manager yesterday.', participle: 'I have _____ to him already.' },
    spend: { past: 'We _____ the weekend at home.', participle: 'They have _____ too much money lately.' },
    spell: { past: 'He _____ the word correctly.', participle: 'She has _____ her name for you.' },
    steal: { past: 'Someone _____ my bike last year.', participle: 'They have _____ important files.' },
    swear: { past: 'He _____ he was telling the truth.', participle: 'She has _____ to keep it secret.' },
    sweep: { past: 'I _____ the kitchen floor.', participle: 'They have _____ the hallway already.' },
    swim: { past: 'We _____ in the lake yesterday.', participle: 'I have _____ in colder water.' },
    take: { past: 'She _____ a taxi to work.', participle: 'He has _____ the test twice.' },
    teach: { past: 'They _____ us useful phrases.', participle: 'She has _____ ESL for 10 years.' },
    tear: { past: 'I _____ the paper by accident.', participle: 'The bag has _____ at the corner.' },
    tell: { past: 'He _____ me the good news.', participle: 'I have _____ you many times.' },
    think: { past: 'I _____ about your idea all day.', participle: 'She has _____ about changing jobs.' },
    throw: { past: 'He _____ the ball too hard.', participle: 'They have _____ everything away.' },
    understand: { past: 'I _____ the lesson yesterday.', participle: 'We have _____ the instructions now.' },
    wake: { past: 'I _____ up at 5:30.', participle: 'She has _____ up early all week.' },
    weep: { past: 'She _____ during the sad movie.', participle: 'He has _____ over that loss before.' },
    win: { past: 'Our team _____ the final game.', participle: 'They have _____ three times this year.' },
    write: { past: 'I _____ a letter last night.', participle: 'She has _____ three reports today.' }
  };

  const askPast = Math.random() > 0.5;
  const context = verbContexts[verb.base];
  const template = askPast
    ? {
        template: `${context?.past ?? `Use V2 (past): I _____ yesterday.`} (${verb.base})`,
        answer: verb.past
      }
    : {
        template: `${context?.participle ?? `Use V3 (past participle): I have _____ before.`} (${verb.base})`,
        answer: verb.pastParticiple
      };

  return {
    id: `sentence-${verb.base}-${Date.now()}`,
    type: 'sentence-completion',
    groupId: group.id,
    prompt: template.template,
    verb,
    correctAnswer: template.answer,
    showPattern: !hideExplanations,
    sentenceContext: template.template
  };
}

/**
 * EXERCISE TYPE 4: PATTERN SORTING
 * Sort verbs into correct pattern groups
 * Uses V1/V2/V3 terminology
 */
function createPatternSortingExercise(
  verb: IrregularVerb,
  group: VerbGroup,
  hideExplanations: boolean
): VerbExercise {
  // Get 3-4 random other groups to create distractor options
  const otherGroups = VERB_GROUPS.filter(g => g.id !== group.id);
  const selectedGroups = shuffleArray(otherGroups).slice(0, 3);
  const allGroups = shuffleArray([group, ...selectedGroups]);

  const groupOptions = allGroups.map(g => ({
    id: g.id,
    title: g.title,
    pattern: g.patternExample
  }));

  return {
    id: `sort-${verb.base}-${Date.now()}`,
    type: 'pattern-sorting',
    groupId: group.id,
    prompt: `Which pattern group does "${verb.base} (V1) → ${verb.past} (V2) → ${verb.pastParticiple} (V3)" belong to?`,
    verb,
    correctAnswer: group.id,
    options: groupOptions.map(g => g.id),
    showPattern: !hideExplanations
  };
}

/**
 * EXERCISE TYPE 5: SPEED MATCHING
 * Match V1 to V2/V3 (timed)
 * Uses V1/V2/V3 terminology
 */
function createSpeedMatchingExercise(
  verb: IrregularVerb,
  group: VerbGroup,
  hideExplanations: boolean
): VerbExercise {
  // Create 4 verb matches: correct + 3 distractors
  const otherVerbs = shuffleArray(group.verbs.filter(v => v.base !== verb.base)).slice(0, 3);
  const correctForms = `${verb.past} / ${verb.pastParticiple}`;
  const verbMatches = shuffleArray([
    {
      base: verb.base,
      forms: correctForms,
      correct: true
    },
    ...otherVerbs.map(v => ({
      base: v.base,
      forms: `${v.past} / ${v.pastParticiple}`,
      correct: false
    }))
  ]);

  return {
    id: `speed-${verb.base}-${Date.now()}`,
    type: 'speed-matching',
    groupId: group.id,
    prompt: `Match V1 "${verb.base}" to its V2/V3 forms`,
    verb,
    correctAnswer: correctForms,
    options: verbMatches.map(vm => vm.forms),
    showPattern: !hideExplanations
  };
}

/**
 * Generate realistic distractor answers for multiple choice
 * Uses common English learner mistakes
 */
function generateDistractors(
  verb: IrregularVerb,
  correctForm: string,
  count: number = 3
): string[] {
  const distractors: string[] = [];

  // Common mistake 1: Regular past tense (-ed)
  const regularForm = verb.base.endsWith('e')
    ? verb.base + 'd'
    : verb.base.endsWith('y')
      ? verb.base.slice(0, -1) + 'ied'
      : verb.base + 'ed';

  if (regularForm !== correctForm) {
    distractors.push(regularForm);
  }

  // Common mistake 2: Confuse past with participle
  if (distractors.length < count) {
    const otherForm = correctForm === verb.past ? verb.pastParticiple : verb.past;
    if (otherForm !== correctForm) {
      distractors.push(otherForm);
    }
  }

  // Common mistake 3: Common mispronunciation patterns
  const mistakePatterns = [
    correctForm.slice(0, -1), // Drop last letter
    correctForm + 's', // Add s
    correctForm.replace(/[aeiou]/, ''), // Remove vowel
    verb.base.toUpperCase() === verb.base ? verb.base.toLowerCase() : verb.base // Case change
  ];

  for (const pattern of mistakePatterns) {
    if (
      distractors.length < count &&
      pattern !== correctForm &&
      pattern !== verb.base
    ) {
      distractors.push(pattern);
    }
  }

  return distractors.slice(0, count);
}

/**
 * Validate a student's answer
 */
export function validateAnswer(
  exercise: VerbExercise,
  userAnswer: string | string[]
): boolean {
  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const normalize = (value: string) => value.trim().toLowerCase();
  const normalizedCorrect = correctAnswers.map(normalize);

  const matchesSingleAnswer = (userValue: string, correctValue: string): boolean => {
    if (userValue === correctValue) return true;

    // Allow alternatives for "was/were" style answers.
    if (correctValue.includes('/')) {
      const options = correctValue.split('/').map(o => o.trim());
      return options.some(opt => userValue === opt);
    }

    return false;
  };

  // Multi-part answer (e.g., V2 and V3 in separate inputs).
  if (normalizedCorrect.length > 1) {
    const userParts = Array.isArray(userAnswer)
      ? userAnswer.map(normalize).filter(Boolean)
      : userAnswer.split(/\s+/).map(normalize).filter(Boolean);

    if (userParts.length !== normalizedCorrect.length) {
      return false;
    }

    return normalizedCorrect.every((correctPart, index) =>
      matchesSingleAnswer(userParts[index], correctPart)
    );
  }

  // Single answer case.
  const normalizedUser = Array.isArray(userAnswer)
    ? normalize(userAnswer.find(part => part.trim().length > 0) ?? '')
    : normalize(userAnswer);

  // Check if answer matches any correct answer
  return normalizedCorrect.some(correct => matchesSingleAnswer(normalizedUser, correct));
}

/**
 * Get feedback for an exercise answer
 */
export function getExerciseFeedback(
  exercise: VerbExercise,
  correct: boolean
): string {
  if (correct) {
    const feedbacks = [
      '✓ Correct!',
      '✓ Perfect!',
      '✓ Great job!',
      '✓ Excellent!',
      '✓ You got it!'
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  } else {
    const correct_answers = Array.isArray(exercise.correctAnswer)
      ? exercise.correctAnswer
      : [exercise.correctAnswer];

    return `The correct answer is: ${correct_answers.join(' or ')}`;
  }
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

/**
 * Get exercise type description for UI
 */
export function getExerciseTypeLabel(type: ExerciseType): string {
  const labels: Record<ExerciseType, string> = {
    'fill-in-blank': 'Fill in the Blank',
    'multiple-choice': 'Multiple Choice',
    'sentence-completion': 'Sentence Completion',
    'pattern-sorting': 'Pattern Sorting',
    'speed-matching': 'Speed Match'
  };
  return labels[type];
}
