import type { TimelineTensesQuestion } from '@/types/activity';

/**
 * Question bank for the Timeline Tenses activity.
 *
 * Question Types:
 * 1. sentence-to-timeline: Student draws timeline elements from a sentence
 * 2. timeline-to-verb: Student fills in verbs based on a pre-drawn timeline
 *
 * Each question includes:
 * - Multiple valid answers where grammatically appropriate
 * - Nuance explanations to teach subtle differences
 * - Difficulty ratings (1-3)
 * - Tense category for filtering
 */

export const TIMELINE_TENSES_QUESTIONS: TimelineTensesQuestion[] = [
  // ============================================================================
  // SIMPLE TENSES
  // ============================================================================

  // Type 1: Sentence to Timeline - Present Simple (Habit/Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-1',
    sentence: 'I live in Revere now.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple can show a present fact or situation. The repeated dots at NOW represent a truth that is true now, not one finished event.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Type 1: Sentence to Timeline - Past Simple
  {
    type: 'sentence-to-timeline',
    id: 'ps-past-1',
    sentence: 'I moved to Chelsea in 2022.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple describes a completed action at a specific point in the past. A single dot in the past zone shows this finished event.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Type 1: Sentence to Timeline - Future Simple
  {
    type: 'sentence-to-timeline',
    id: 'fs-1',
    sentence: 'I will live in the U.S. in 2027.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple',
    explanation:
      'Future Simple describes a future fact or plan at a specific future point. A single dot in the future zone shows that reference point.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Type 2: Timeline to Verb - Past Simple
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 30, verbLabel: 'move' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'move' },
    ],
    sentenceTemplate: 'I ___[move]___ to Chelsea in 2022, and I ___[move]___ to Revere in 2024.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'move',
        validAnswers: [
          {
            answer: 'moved',
            tenseName: 'Past Simple',
            nuance: 'The move to Chelsea is one finished past event on the timeline.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'move',
        validAnswers: [
          {
            answer: 'moved',
            tenseName: 'Past Simple',
            nuance: 'The move to Revere is a second finished past event on the timeline.',
          },
        ],
      },
    ],
    scenario: 'Talking about where you have lived',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Type 1: Sentence to Timeline - Present Simple daily routines
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-bus-1',
    sentence: 'My kids take the bus every morning.',
    correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple often shows a routine. The repeated dots at NOW show something that happens again and again.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-dinner-1',
    sentence: 'We eat dinner at 6:00 every day.',
    correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
    tenseName: 'Present Simple',
    explanation:
      'A repeated daily action uses Present Simple. Multiple dots at NOW show the routine clearly.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-shop-1',
    sentence: 'I buy groceries on Saturdays.',
    correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple can describe a regular weekly habit. The repeated dots show that it happens many times.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'ps-past-cook-1',
    sentence: 'I cooked rice last night.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 45 }],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple shows one finished action in the past. A single dot marks that completed moment.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'ps-past-rain-1',
    sentence: 'It rained this morning.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 35 }],
    tenseName: 'Past Simple',
    explanation:
      'A finished event earlier today still uses Past Simple. One dot in the past zone shows that completed event.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'fs-call-1',
    sentence: 'I will call my sister tonight.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 35 }],
    tenseName: 'Future Simple',
    explanation:
      'Future Simple shows one planned or expected moment in the future. A single dot in the future marks that time.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'fs-library-1',
    sentence: 'We will visit the library tomorrow.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 45 }],
    tenseName: 'Future Simple',
    explanation:
      'A single future visit is one future point on the timeline, so it uses one dot in the future zone.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-routine-1',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 40, verbLabel: 'drink' },
      { id: 'e2', type: 'multiple-dots', zone: 'present', position: 60, verbLabel: 'take' },
    ],
    sentenceTemplate: 'Every morning, I ___[drink]___ coffee and my son ___[take]___ the bus to school.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'drink',
        validAnswers: [
          {
            answer: 'drink',
            tenseName: 'Present Simple',
            nuance: 'A morning routine uses Present Simple.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'take',
        validAnswers: [
          {
            answer: 'takes',
            tenseName: 'Present Simple',
            nuance: 'A third-person singular routine needs the -s form.',
          },
        ],
      },
    ],
    scenario: 'Talking about a family morning routine',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-past-home-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 35, verbLabel: 'wash' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'cook' },
    ],
    sentenceTemplate: 'Yesterday, I ___[wash]___ the dishes and ___[cook]___ dinner.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'wash',
        validAnswers: [
          {
            answer: 'washed',
            tenseName: 'Past Simple',
            nuance: 'This is one finished action yesterday.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'cook',
        validAnswers: [
          {
            answer: 'cooked',
            tenseName: 'Past Simple',
            nuance: 'This is a second finished past action.',
          },
        ],
      },
    ],
    scenario: 'Talking about chores at home',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'timeline-to-verb',
    id: 'fs-verb-evening-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 35, verbLabel: 'call' },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 70, verbLabel: 'pack' },
    ],
    sentenceTemplate: 'Tonight, I ___[call]___ my sister and ___[pack]___ my lunch for tomorrow.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'call',
        validAnswers: [
          {
            answer: 'will call',
            tenseName: 'Future Simple',
            nuance: 'This is one planned future action.',
          },
          {
            answer: "'ll call",
            tenseName: 'Future Simple',
            nuance: 'The contracted future form is also correct.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'pack',
        validAnswers: [
          {
            answer: 'will pack',
            tenseName: 'Future Simple',
            nuance: 'This is another planned future action later on the timeline.',
          },
          {
            answer: "'ll pack",
            tenseName: 'Future Simple',
            nuance: 'The contracted future form is also correct.',
          },
        ],
      },
    ],
    scenario: 'Planning your evening at home',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // CONTINUOUS TENSES
  // ============================================================================

  // Type 1: Present Continuous
  {
    type: 'sentence-to-timeline',
    id: 'pc-1',
    sentence: 'I am studying English right now.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation:
      'Present Continuous shows an action happening right now. A solid line at the NOW marker represents the ongoing activity.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'pc-homework-1',
    sentence: 'My daughter is doing homework right now.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation:
      'Present Continuous shows something happening at this moment. The solid line at NOW marks that ongoing action.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'pc-bus-1',
    sentence: 'We are waiting for the bus right now.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation:
      'An action in progress now uses Present Continuous. A solid line at NOW shows that it is happening now.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  {
    type: 'timeline-to-verb',
    id: 'pc-verb-cook-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'present', position: 50, verbLabel: 'cook' },
    ],
    sentenceTemplate: 'I ___[cook]___ dinner right now.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'cook',
        validAnswers: [
          {
            answer: 'am cooking',
            tenseName: 'Present Continuous',
            nuance: 'The action is happening now, so use Present Continuous.',
          },
          {
            answer: "'m cooking",
            tenseName: 'Present Continuous',
            nuance: 'The contracted present continuous form is also correct.',
          },
        ],
      },
    ],
    scenario: 'Talking about what is happening in the kitchen now',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Type 1: Past Continuous
  {
    type: 'sentence-to-timeline',
    id: 'pc-past-1',
    sentence: 'I was living in El Salvador when I decided to move.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation:
      'Past Continuous (was living) shows a longer action in progress. Past Simple (decided) shows the shorter interrupting action. The line represents the ongoing background, and the dot represents the interruption.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // Type 2: Past Continuous interruption
  {
    type: 'timeline-to-verb',
    id: 'pc-interrupt-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'live' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'decide' },
    ],
    sentenceTemplate: 'I ___[live]___ in El Salvador when I ___[decide]___ to move.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'was living',
            tenseName: 'Past Continuous',
            nuance: 'Shows the longer background action that was in progress at that past moment.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'decide',
        validAnswers: [
          {
            answer: 'decided',
            tenseName: 'Past Simple',
            nuance: 'The decision is the shorter past action that happened during the longer situation.',
          },
        ],
      },
    ],
    scenario: 'Thinking about moving to the U.S.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Type 1: Future Continuous
  {
    type: 'sentence-to-timeline',
    id: 'fc-1',
    sentence: 'Next year, I will be living in the U.S.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60 }],
    tenseName: 'Future Continuous',
    explanation:
      'Future Continuous describes an action that will be in progress at a specific future time. The solid line in the future shows the ongoing nature.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Type 2: Future Continuous
  {
    type: 'timeline-to-verb',
    id: 'fc-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'future', position: 60, verbLabel: 'live' },
    ],
    sentenceTemplate: 'Next year, I ___[live]___ in the U.S.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'will be living',
            tenseName: 'Future Continuous',
            nuance: 'An action in progress at a specific future time',
          },
          {
            answer: "'ll be living",
            tenseName: 'Future Continuous',
            nuance: 'Contracted form - equally correct',
          },
        ],
      },
    ],
    scenario: 'Looking ahead to next year',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // PERFECT TENSES
  // ============================================================================

  // Type 1: Present Perfect
  {
    type: 'sentence-to-timeline',
    id: 'pp-1',
    sentence: 'I have lived in Revere since 2024.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect',
    explanation:
      'Present Perfect connects a past action to the present. The arc shows that the action started in the past and continues to NOW.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Type 2: Present Perfect
  {
    type: 'timeline-to-verb',
    id: 'pp-verb-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'live' },
    ],
    sentenceTemplate: 'I ___[live]___ in Revere since 2024.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'have lived',
            tenseName: 'Present Perfect',
            nuance: 'Connects the past to now - still living there',
          },
          {
            answer: "'ve lived",
            tenseName: 'Present Perfect',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Talking about where you live',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Type 1: Past Perfect
  {
    type: 'sentence-to-timeline',
    id: 'pperf-1',
    sentence: 'I had lived in Chelsea before I moved to Revere.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      'Past Perfect shows an earlier past action (had lived), and Past Simple shows the later past action (moved). The arc represents the first action, and the dot represents the second reference point.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Type 1: Future Perfect
  {
    type: 'sentence-to-timeline',
    id: 'fp-1',
    sentence: 'By 2027, I will have finished school.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect',
    explanation:
      'Future Perfect describes an action that will be completed by a specific future point. The dashed arc shows the action spanning from now to that future completion point.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Type 2: Future Perfect
  {
    type: 'timeline-to-verb',
    id: 'fp-verb-1',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 70, verbLabel: 'finish' },
    ],
    sentenceTemplate: 'By 2027, I ___[finish]___ school.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'finish',
        validAnswers: [
          {
            answer: 'will have finished',
            tenseName: 'Future Perfect',
            nuance: 'The action will be finished by that future point',
          },
          {
            answer: "'ll have finished",
            tenseName: 'Future Perfect',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Planning your school timeline',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // PERFECT CONTINUOUS TENSES
  // ============================================================================

  // Type 1: Present Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'ppc-1',
    sentence: 'I have been living in Revere for 2 years.',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous',
    explanation:
      'Present Perfect Continuous emphasizes the duration of an action that started in the past and continues to the present. The thick line connecting to NOW shows the ongoing duration reaching the present moment.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Type 2: Present Perfect Continuous
  {
    type: 'timeline-to-verb',
    id: 'ppc-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-to-now', zone: 'past', position: 40, verbLabel: 'live' },
    ],
    sentenceTemplate: 'I ___[live]___ in Revere for 2 years.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'have been living',
            tenseName: 'Present Perfect Continuous',
            nuance: 'This tense emphasizes the duration of a situation that started in the past and continues now.',
          },
          {
            answer: "'ve been living",
            tenseName: 'Present Perfect Continuous',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Talking about life in Revere',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Type 1: Past Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'ppfc-1',
    sentence: 'I had been living in El Salvador before 2022.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 20 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 60 },
    ],
    tenseName: 'Past Perfect Continuous',
    explanation:
      'Past Perfect Continuous shows the duration of an action that was happening before another past point. The thick line connecting to the reference dot shows the duration leading up to that past moment.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Type 1: Future Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'fpc-1',
    sentence: 'By 2027, I will have been living in the U.S. for 5 years.',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'future', position: 50 }],
    tenseName: 'Future Perfect Continuous',
    explanation:
      'Future Perfect Continuous describes the duration of an action up to a specific future point. The dashed line shows the ongoing duration extending into the future.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Type 2: Future Perfect Continuous
  {
    type: 'timeline-to-verb',
    id: 'fpc-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-to-now', zone: 'future', position: 60, verbLabel: 'live' },
    ],
    sentenceTemplate: 'By 2027, I ___[live]___ in the U.S. for 5 years.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'will have been living',
            tenseName: 'Future Perfect Continuous',
            nuance: 'Emphasizes the duration up to that future point',
          },
          {
            answer: "'ll have been living",
            tenseName: 'Future Perfect Continuous',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Projecting your timeline into 2027',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // MIXED TENSES
  // ============================================================================

  // Type 2: Mixed - Future plans using different forms
  {
    type: 'timeline-to-verb',
    id: 'mixed-future-1',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'live' },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 60, verbLabel: 'live' },
    ],
    sentenceTemplate: 'I ___[live]___ in Revere now, but in 2027 I ___[live]___ in California.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'live',
            tenseName: 'Present Simple',
            nuance: 'The first blank states the present fact on the timeline.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'will live',
            tenseName: 'Future Simple',
            nuance: 'The second blank points to a future fact on the timeline.',
          },
          {
            answer: "'ll live",
            tenseName: 'Future Simple',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Comparing now and 2027',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // Type 2: Mixed - Reporting past events
  {
    type: 'timeline-to-verb',
    id: 'mixed-past-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'live' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'move' },
    ],
    sentenceTemplate: 'I ___[live]___ in Chelsea before I ___[move]___ to Revere.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'had lived',
            tenseName: 'Past Perfect',
            nuance: 'The earlier past living situation happened before the move to Revere.',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'move',
        validAnswers: [
          {
            answer: 'moved',
            tenseName: 'Past Simple',
            nuance: 'The move to Revere is the later past reference point.',
          },
        ],
      },
    ],
    scenario: 'Describing the sequence of where you lived',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // Type 2: Mixed - Life changes
  {
    type: 'timeline-to-verb',
    id: 'mixed-life-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'live' },
      { id: 'e2', type: 'solid-to-now', zone: 'future', position: 60, verbLabel: 'live' },
    ],
    sentenceTemplate: 'I ___[live]___ in the U.S. since 2022, and by 2027 I ___[live]___ here for 5 years.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'have lived',
            tenseName: 'Present Perfect',
            nuance: 'Connects the past to the present',
          },
          {
            answer: "'ve lived",
            tenseName: 'Present Perfect',
            nuance: 'Contracted form',
          },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'live',
        validAnswers: [
          {
            answer: 'will have been living',
            tenseName: 'Future Perfect Continuous',
            nuance: 'The second blank measures duration up to the future point of 2027.',
          },
          {
            answer: "'ll have been living",
            tenseName: 'Future Perfect Continuous',
            nuance: 'Contracted form',
          },
        ],
      },
    ],
    scenario: 'Linking the present timeline to 2027',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // NEGATIVE SENTENCES - Type 1: Sentence to Timeline
  // ============================================================================

  // Present Simple Negative (Habit/Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-neg-1',
    sentence: "She doesn't cook breakfast every day.",
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Negative)',
    explanation:
      'Even in the negative, Present Simple shows habits and routines. The repeated dots represent an action that regularly does NOT happen.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Present Simple Negative (Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-fact-neg-1',
    sentence: "Water doesn't boil at 50 degrees.",
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Negative)',
    explanation:
      'Present Simple Negative can state facts that are always NOT true. The repeated dots show a timeless truth.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Past Simple Negative
  {
    type: 'sentence-to-timeline',
    id: 'ps-past-neg-1',
    sentence: "I didn't finish my homework yesterday.",
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple (Negative)',
    explanation:
      'Past Simple Negative describes something that did NOT happen at a specific point in the past. The single dot still marks that past moment.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Future Simple Negative
  {
    type: 'sentence-to-timeline',
    id: 'fs-neg-1',
    sentence: "I won't go to the party tomorrow.",
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple (Negative)',
    explanation:
      'Future Simple Negative describes an action that will NOT happen at a future point. The single dot marks that future moment.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Present Continuous Negative
  {
    type: 'sentence-to-timeline',
    id: 'pc-neg-1',
    sentence: "I'm not working right now.",
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous (Negative)',
    explanation:
      'Present Continuous Negative shows an action NOT happening at this moment. The solid line still represents the current time period.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'negative',
  },

  // Past Continuous Negative (with interruption)
  {
    type: 'sentence-to-timeline',
    id: 'pc-past-neg-1',
    sentence: "She wasn't listening when I explained the rules.",
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous (Negative) + Past Simple',
    explanation:
      'Past Continuous Negative shows an ongoing action that was NOT happening. The line shows what she was NOT doing, and the dot marks the moment of explanation.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'negative',
  },

  // Present Perfect Negative
  {
    type: 'sentence-to-timeline',
    id: 'pp-neg-1',
    sentence: "I haven't seen that movie yet.",
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Negative)',
    explanation:
      'Present Perfect Negative connects the past to the present - the action has NOT happened up to now. The arc shows this connection from past to NOW.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Present Perfect Negative (experience)
  {
    type: 'sentence-to-timeline',
    id: 'pp-exp-neg-1',
    sentence: 'She has never traveled abroad.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Negative)',
    explanation:
      '"Never" with Present Perfect shows an experience that has NOT occurred at any point from the past up to now. The arc connects past to present.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Future Perfect Negative
  {
    type: 'sentence-to-timeline',
    id: 'fp-neg-1',
    sentence: "By December, I won't have saved enough money.",
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect (Negative)',
    explanation:
      'Future Perfect Negative describes something that will NOT be completed by a specific future point. The dashed arc spans from now to that deadline.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Present Perfect Continuous Negative
  {
    type: 'sentence-to-timeline',
    id: 'ppc-neg-1',
    sentence: "I haven't been sleeping well lately.",
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous (Negative)',
    explanation:
      'Present Perfect Continuous Negative emphasizes that an ongoing action has NOT been happening well. The thick line connecting to NOW shows the duration reaching the present.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'negative',
  },

  // ============================================================================
  // QUESTION FORMS - Type 1: Sentence to Timeline
  // ============================================================================

  // Present Simple Question (Habit/Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-habit-q-1',
    sentence: 'Do you exercise every morning?',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Question)',
    explanation:
      'Present Simple questions ask about habits and routines. The repeated dots show this is asking about a regular pattern.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Present Simple Question (Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-fact-q-1',
    sentence: 'Does the sun rise in the east?',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Question)',
    explanation:
      'Questions about general facts use Present Simple. The repeated dots show this is a timeless truth.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Past Simple Question
  {
    type: 'sentence-to-timeline',
    id: 'ps-past-q-1',
    sentence: 'Did you finish your homework yesterday?',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple (Question)',
    explanation:
      'Past Simple questions ask about completed actions at a specific past time. The single dot marks that moment in the past.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Future Simple Question
  {
    type: 'sentence-to-timeline',
    id: 'fs-q-1',
    sentence: 'Will you come to the party tomorrow?',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple (Question)',
    explanation:
      'Future Simple questions ask about actions at a specific future time. The single dot marks that future moment.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Present Continuous Question
  {
    type: 'sentence-to-timeline',
    id: 'pc-q-1',
    sentence: 'Are you studying right now?',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous (Question)',
    explanation:
      'Present Continuous questions ask about actions happening at this moment. The solid line represents the current ongoing time.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'question',
  },

  // Past Continuous Question (with interruption)
  {
    type: 'sentence-to-timeline',
    id: 'pc-past-q-1',
    sentence: 'Were you sleeping when I called?',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous (Question) + Past Simple',
    explanation:
      'This question asks about an ongoing action at a specific past moment. The line shows the potential ongoing action, and the dot marks when the call happened.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'question',
  },

  // Present Perfect Question
  {
    type: 'sentence-to-timeline',
    id: 'pp-q-1',
    sentence: 'Have you ever visited Mexico?',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Question)',
    explanation:
      'Present Perfect questions ask about experiences or actions connected to the present. The arc shows the connection from past to NOW.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Present Perfect Question (completion)
  {
    type: 'sentence-to-timeline',
    id: 'pp-exp-q-1',
    sentence: 'Has she finished her work?',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Question)',
    explanation:
      'This question asks about an action that may have been completed before now, with relevance to the present moment.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Future Perfect Question
  {
    type: 'sentence-to-timeline',
    id: 'fp-q-1',
    sentence: 'Will you have finished the project by Friday?',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect (Question)',
    explanation:
      'Future Perfect questions ask whether something will be completed by a future deadline. The dashed arc spans from now to that point.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Present Perfect Continuous Question
  {
    type: 'sentence-to-timeline',
    id: 'ppc-q-1',
    sentence: 'Have you been waiting long?',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous (Question)',
    explanation:
      'This question asks about the duration of an action that started in the past and continues to now. The solid line shows that duration.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'question',
  },

  // ============================================================================
  // ADDITIONAL POSITIVE VARIATIONS - Type 1: Sentence to Timeline
  // ============================================================================

  // Present Simple (Fact)
  {
    type: 'sentence-to-timeline',
    id: 'ps-fact-1',
    sentence: 'The sun rises in the east.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple states general facts and truths. The repeated dots show this is a timeless pattern.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Present Simple (Scheduled future)
  {
    type: 'sentence-to-timeline',
    id: 'ps-schedule-1',
    sentence: 'The train leaves at 9am tomorrow.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Present Simple (Scheduled Future)',
    explanation:
      'Present Simple can describe fixed schedules and timetables in the future. The single dot marks that scheduled future moment.',
    difficulty: 2,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Present Continuous (Future arrangement)
  {
    type: 'sentence-to-timeline',
    id: 'pc-future-1',
    sentence: "I'm meeting my friend tomorrow.",
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Present Continuous (Future Arrangement)',
    explanation:
      'Present Continuous can describe planned arrangements in the future. The single dot marks the planned event.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Present Continuous (Temporary/repeated annoyance)
  {
    type: 'sentence-to-timeline',
    id: 'pc-temp-1',
    sentence: 'She is always complaining about work.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Continuous (Repeated Action)',
    explanation:
      '"Always" with Present Continuous shows a repeated action, often expressing annoyance. The repeated dots show this ongoing pattern.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Present Perfect (Recent completion)
  {
    type: 'sentence-to-timeline',
    id: 'pp-recent-1',
    sentence: 'I have just finished my homework.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect',
    explanation:
      '"Just" with Present Perfect emphasizes a very recent completion. The arc connects this recent past action to the present moment.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Present Perfect (Result in present)
  {
    type: 'sentence-to-timeline',
    id: 'pp-result-1',
    sentence: 'She has lost her keys.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect',
    explanation:
      'Present Perfect describes a past action with a present result. She lost the keys at some point, and the result (no keys) affects now.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect (sequence)
  {
    type: 'sentence-to-timeline',
    id: 'pperf-2',
    sentence: 'By the time she arrived, he had already left.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      'Past Perfect (had left) shows the earlier action, and Past Simple (arrived) shows the later reference point. The arc marks his departure, the dot marks her arrival.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Future Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'fpc-2',
    sentence: 'Next month, I will have been working here for a year.',
    correctElements: [{ id: 'e1', type: 'solid-to-point', zone: 'future', position: 50 }],
    tenseName: 'Future Perfect Continuous',
    explanation:
      'Future Perfect Continuous describes duration up to a specific future point. Use a duration arc (ongoing link) to show the action reaching that future reference moment.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // NEGATIVE SENTENCES - Type 2: Timeline to Verb
  // ============================================================================

  // Past Simple Negative
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 50, verbLabel: 'not/eat' },
    ],
    sentenceTemplate: 'She ___[not/eat]___ breakfast yesterday.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/eat',
        validAnswers: [
          { answer: "didn't eat", tenseName: 'Past Simple (Negative)', nuance: 'The action did not happen at that past time' },
          { answer: 'did not eat', tenseName: 'Past Simple (Negative)', nuance: 'Full form - equally correct' },
        ],
      },
    ],
    scenario: 'Talking about missed meals',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Present Simple Negative
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-neg-2',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'not/go' },
    ],
    sentenceTemplate: 'They ___[not/go]___ to school on Sundays.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/go',
        validAnswers: [
          { answer: "don't go", tenseName: 'Present Simple (Negative)', nuance: 'A regular negative habit' },
          { answer: 'do not go', tenseName: 'Present Simple (Negative)', nuance: 'Full form' },
        ],
      },
    ],
    scenario: 'Talking about weekly routines',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Past Continuous Negative
  {
    type: 'timeline-to-verb',
    id: 'pc-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'not/sleep' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'call' },
    ],
    sentenceTemplate: 'I ___[not/sleep]___ when you ___[call]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/sleep',
        validAnswers: [
          { answer: "wasn't sleeping", tenseName: 'Past Continuous (Negative)', nuance: 'Shows I was NOT in the middle of sleeping' },
          { answer: 'was not sleeping', tenseName: 'Past Continuous (Negative)', nuance: 'Full form' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'call',
        validAnswers: [
          { answer: 'called', tenseName: 'Past Simple', nuance: 'The interrupting action' },
        ],
      },
    ],
    scenario: 'Late night phone call',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'negative',
  },

  // Future Continuous Negative
  {
    type: 'timeline-to-verb',
    id: 'fc-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'future', position: 60, verbLabel: 'not/study' },
    ],
    sentenceTemplate: 'At 8pm tomorrow, I ___[not/study]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/study',
        validAnswers: [
          { answer: "won't be studying", tenseName: 'Future Continuous (Negative)', nuance: 'Will NOT be in the middle of studying at that time' },
          { answer: 'will not be studying', tenseName: 'Future Continuous (Negative)', nuance: 'Full form' },
        ],
      },
    ],
    scenario: 'Planning your evening',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'negative',
  },

  // Present Perfect Negative
  {
    type: 'timeline-to-verb',
    id: 'pp-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'not/see' },
    ],
    sentenceTemplate: 'I ___[not/see]___ that movie yet.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/see',
        validAnswers: [
          { answer: "haven't seen", tenseName: 'Present Perfect (Negative)', nuance: 'The experience has not happened up to now' },
          { answer: 'have not seen', tenseName: 'Present Perfect (Negative)', nuance: 'Full form' },
        ],
      },
    ],
    scenario: 'Discussing movies',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Past Perfect Negative
  {
    type: 'timeline-to-verb',
    id: 'pperf-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'not/finish' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'She ___[not/finish]___ before he ___[arrive]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/finish',
        validAnswers: [
          { answer: "hadn't finished", tenseName: 'Past Perfect (Negative)', nuance: 'Had NOT completed before the reference point' },
          { answer: 'had not finished', tenseName: 'Past Perfect (Negative)', nuance: 'Full form' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [
          { answer: 'arrived', tenseName: 'Past Simple', nuance: 'The later past reference point' },
        ],
      },
    ],
    scenario: 'Describing sequence of events',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Future Perfect Negative
  {
    type: 'timeline-to-verb',
    id: 'fp-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 70, verbLabel: 'not/finish' },
    ],
    sentenceTemplate: 'By tomorrow, I ___[not/finish]___ the report.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/finish',
        validAnswers: [
          { answer: "won't have finished", tenseName: 'Future Perfect (Negative)', nuance: 'Will NOT be complete by that deadline' },
          { answer: 'will not have finished', tenseName: 'Future Perfect (Negative)', nuance: 'Full form' },
        ],
      },
    ],
    scenario: 'Work deadline stress',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Future Perfect Continuous Negative
  {
    type: 'timeline-to-verb',
    id: 'fpc-verb-neg-1',
    timelineElements: [
      { id: 'e1', type: 'solid-to-now', zone: 'future', position: 60, verbLabel: 'not/work' },
    ],
    sentenceTemplate: 'By next year, I ___[not/work]___ here for very long.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/work',
        validAnswers: [
          { answer: "won't have been working", tenseName: 'Future Perfect Continuous (Negative)', nuance: 'Emphasizes the short duration up to that point' },
          { answer: 'will not have been working', tenseName: 'Future Perfect Continuous (Negative)', nuance: 'Full form' },
        ],
      },
    ],
    scenario: 'New job discussion',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'negative',
  },

  // ============================================================================
  // QUESTION FORMS - Type 2: Timeline to Verb
  // ============================================================================

  // Past Simple Question
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 50, verbLabel: 'you/eat' },
    ],
    sentenceTemplate: '___[you/eat]___ breakfast yesterday?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/eat',
        validAnswers: [
          { answer: 'Did you eat', tenseName: 'Past Simple (Question)', nuance: 'Asking about a completed past action' },
        ],
      },
    ],
    scenario: 'Checking on a friend',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Present Simple Question
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-q-2',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'she/work' },
    ],
    sentenceTemplate: '___[she/work]___ here?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'she/work',
        validAnswers: [
          { answer: 'Does she work', tenseName: 'Present Simple (Question)', nuance: 'Asking about a regular situation' },
        ],
      },
    ],
    scenario: 'Asking about a colleague',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // Past Continuous Question
  {
    type: 'timeline-to-verb',
    id: 'pc-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'you/work' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'call' },
    ],
    sentenceTemplate: '___[you/work]___ when I ___[call]___?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/work',
        validAnswers: [
          { answer: 'Were you working', tenseName: 'Past Continuous (Question)', nuance: 'Asking about an ongoing action at that past moment' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'call',
        validAnswers: [
          { answer: 'called', tenseName: 'Past Simple', nuance: 'The interrupting action' },
        ],
      },
    ],
    scenario: 'Checking about a phone call',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'question',
  },

  // Future Continuous Question
  {
    type: 'timeline-to-verb',
    id: 'fc-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'future', position: 60, verbLabel: 'you/study' },
    ],
    sentenceTemplate: '___[you/study]___ at 8pm tomorrow?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/study',
        validAnswers: [
          { answer: 'Will you be studying', tenseName: 'Future Continuous (Question)', nuance: 'Asking about an action in progress at a future time' },
        ],
      },
    ],
    scenario: 'Making plans',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'question',
  },

  // Present Perfect Question
  {
    type: 'timeline-to-verb',
    id: 'pp-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'you/visit' },
    ],
    sentenceTemplate: '___[you/visit]___ Paris?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/visit',
        validAnswers: [
          { answer: 'Have you visited', tenseName: 'Present Perfect (Question)', nuance: 'Asking about life experience up to now' },
          { answer: 'Have you ever visited', tenseName: 'Present Perfect (Question)', nuance: 'Adding "ever" for emphasis on life experience' },
        ],
      },
    ],
    scenario: 'Travel conversation',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Past Perfect Question
  {
    type: 'timeline-to-verb',
    id: 'pperf-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'she/leave' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: '___[she/leave]___ before you ___[arrive]___?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'she/leave',
        validAnswers: [
          { answer: 'Had she left', tenseName: 'Past Perfect (Question)', nuance: 'Asking if action was completed before reference point' },
          { answer: 'Had she already left', tenseName: 'Past Perfect (Question)', nuance: 'Adding "already" for emphasis' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [
          { answer: 'arrived', tenseName: 'Past Simple', nuance: 'The later past reference point' },
        ],
      },
    ],
    scenario: 'Asking about timing',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Future Perfect Question
  {
    type: 'timeline-to-verb',
    id: 'fp-verb-q-1',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 70, verbLabel: 'you/finish' },
    ],
    sentenceTemplate: '___[you/finish]___ the project by Friday?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/finish',
        validAnswers: [
          { answer: 'Will you have finished', tenseName: 'Future Perfect (Question)', nuance: 'Asking if task will be complete by deadline' },
        ],
      },
    ],
    scenario: 'Project deadline check',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Mixed Future Question
  {
    type: 'timeline-to-verb',
    id: 'mixed-q-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 40, verbLabel: 'you/go' },
    ],
    sentenceTemplate: '___[you/go]___ to work tomorrow?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/go',
        validAnswers: [
          { answer: 'Will you go', tenseName: 'Future Simple (Question)', nuance: 'Asking about a decision or prediction' },
        ],
      },
    ],
    scenario: 'Work schedule discussion',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'question',
  },

  // ============================================================================
  // ADDITIONAL POSITIVE VARIATIONS - Type 2: Timeline to Verb
  // ============================================================================

  // Present Simple (Fact)
  {
    type: 'timeline-to-verb',
    id: 'ps-verb-2',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'boil' },
    ],
    sentenceTemplate: 'Water ___[boil]___ at 100 degrees Celsius.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'boil',
        validAnswers: [
          { answer: 'boils', tenseName: 'Present Simple', nuance: 'A scientific fact - always true' },
        ],
      },
    ],
    scenario: 'Science class',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Present Continuous (current action)
  {
    type: 'timeline-to-verb',
    id: 'pc-verb-2',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'present', position: 50, verbLabel: 'sleep' },
    ],
    sentenceTemplate: 'Look! The baby ___[sleep]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'sleep',
        validAnswers: [
          { answer: 'is sleeping', tenseName: 'Present Continuous', nuance: 'Action happening right now' },
          { answer: "'s sleeping", tenseName: 'Present Continuous', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Watching a baby',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Present Perfect (recent with already)
  {
    type: 'timeline-to-verb',
    id: 'pp-verb-2',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'already/eat' },
    ],
    sentenceTemplate: 'She ___[already/eat]___ dinner.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'already/eat',
        validAnswers: [
          { answer: 'has already eaten', tenseName: 'Present Perfect', nuance: 'Completed before now, with present relevance' },
          { answer: "'s already eaten", tenseName: 'Present Perfect', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Dinner plans',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect (sequence)
  {
    type: 'timeline-to-verb',
    id: 'pperf-verb-2',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'leave' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'By the time I ___[arrive]___, they ___[leave]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'arrive',
        validAnswers: [
          { answer: 'arrived', tenseName: 'Past Simple', nuance: 'The reference point in the past' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'leave',
        validAnswers: [
          { answer: 'had left', tenseName: 'Past Perfect', nuance: 'Completed before the arrival' },
          { answer: 'had already left', tenseName: 'Past Perfect', nuance: 'Emphasis on completion before reference point' },
        ],
      },
    ],
    scenario: 'Arriving late to a party',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Mixed Past (while + interruption)
  {
    type: 'timeline-to-verb',
    id: 'mixed-past-2',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'cook' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'ring' },
    ],
    sentenceTemplate: 'While I ___[cook]___, the phone ___[ring]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'cook',
        validAnswers: [
          { answer: 'was cooking', tenseName: 'Past Continuous', nuance: 'The ongoing background action' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'ring',
        validAnswers: [
          { answer: 'rang', tenseName: 'Past Simple', nuance: 'The interrupting action' },
        ],
      },
    ],
    scenario: 'Kitchen interruption',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // Mixed Life (present perfect + continuous)
  {
    type: 'timeline-to-verb',
    id: 'mixed-life-2',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'study' },
      { id: 'e2', type: 'solid-line', zone: 'present', position: 50, verbLabel: 'still/learn' },
    ],
    sentenceTemplate: 'I ___[study]___ English since 2020, and I ___[still/learn]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'study',
        validAnswers: [
          { answer: 'have studied', tenseName: 'Present Perfect', nuance: 'Action from past continuing to now' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'still/learn',
        validAnswers: [
          { answer: 'am still learning', tenseName: 'Present Continuous', nuance: 'Current ongoing action' },
          { answer: "'m still learning", tenseName: 'Present Continuous', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'English learning journey',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // EVERYDAY SCENARIOS - SIMPLE TENSES
  // ============================================================================

  // Shopping - Present Simple
  {
    type: 'sentence-to-timeline',
    id: 'everyday-shop-1',
    sentence: 'I usually buy groceries on Saturdays.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple with "usually" describes a regular shopping routine. The repeated dots show this weekly pattern.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Health - Past Simple
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-1',
    sentence: 'I visited the doctor last week.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple describes a completed doctor visit at a specific time. The single dot marks that past appointment.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Family - Future Simple
  {
    type: 'sentence-to-timeline',
    id: 'everyday-family-1',
    sentence: 'We will celebrate my birthday next month.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple',
    explanation:
      'Future Simple describes a planned celebration at a specific future time. The single dot marks that upcoming event.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Work - Present Simple Negative
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-neg-1',
    sentence: "My boss doesn't work on weekends.",
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Negative)',
    explanation:
      'Present Simple Negative shows a regular pattern of NOT working. The repeated dots represent this ongoing routine.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Food - Past Simple Question
  {
    type: 'sentence-to-timeline',
    id: 'everyday-food-q-1',
    sentence: 'Did you cook dinner last night?',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple (Question)',
    explanation:
      'Past Simple questions ask about completed actions. The single dot marks that specific past evening.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // ============================================================================
  // EVERYDAY SCENARIOS - CONTINUOUS TENSES
  // ============================================================================

  // Work - Present Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-cont-1',
    sentence: 'My colleagues are having a meeting right now.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation:
      'Present Continuous shows the meeting happening at this very moment. The solid line represents the ongoing activity.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Health - Past Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-cont-1',
    sentence: 'I was feeling sick when I woke up this morning.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation:
      'Past Continuous (was feeling) shows the ongoing state, and Past Simple (woke up) marks the moment of waking. The line is the background situation.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Family - Future Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-family-cont-1',
    sentence: 'This time next year, my daughter will be attending university.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60 }],
    tenseName: 'Future Continuous',
    explanation:
      'Future Continuous describes an ongoing activity at a specific future time. The solid line shows her ongoing university attendance.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // Shopping - Present Continuous Negative
  {
    type: 'sentence-to-timeline',
    id: 'everyday-shop-neg-1',
    sentence: "I'm not buying anything today.",
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous (Negative)',
    explanation:
      'Present Continuous Negative shows what is NOT happening right now. The solid line still represents the current time period.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'negative',
  },

  // Work - Future Continuous Question
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-q-1',
    sentence: 'Will you be working late tonight?',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 50 }],
    tenseName: 'Future Continuous (Question)',
    explanation:
      'This question asks about an ongoing action at a specific future time. The solid line shows the future work period.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'question',
  },

  // ============================================================================
  // EVERYDAY SCENARIOS - PERFECT TENSES
  // ============================================================================

  // Health - Present Perfect
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-perf-1',
    sentence: 'I have had this headache since this morning.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect',
    explanation:
      'Present Perfect connects a past situation to the present. The arc shows the headache started in the past and continues now.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Shopping - Present Perfect
  {
    type: 'sentence-to-timeline',
    id: 'everyday-shop-perf-1',
    sentence: 'I have already bought everything on my list.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect',
    explanation:
      '"Already" with Present Perfect shows completed shopping with present relevance. The arc connects the purchase to now.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Work - Past Perfect
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-perf-1',
    sentence: 'When I arrived at the office, the meeting had already started.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      'Past Perfect (had started) shows the earlier action, Past Simple (arrived) shows the reference point. The meeting started before arrival.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Family - Future Perfect
  {
    type: 'sentence-to-timeline',
    id: 'everyday-family-perf-1',
    sentence: 'By the time the kids come home, I will have prepared dinner.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect',
    explanation:
      'Future Perfect describes an action completed before a future point. The dashed arc spans from now to when dinner is ready.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Health - Present Perfect Negative
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-neg-1',
    sentence: "She hasn't felt well for days.",
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Negative)',
    explanation:
      'Present Perfect Negative shows a condition that has NOT changed up to now. The arc connects the past unwell state to the present.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Shopping - Present Perfect Question
  {
    type: 'sentence-to-timeline',
    id: 'everyday-shop-q-1',
    sentence: 'Have you ever tried this brand before?',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
    tenseName: 'Present Perfect (Question)',
    explanation:
      '"Ever" with Present Perfect asks about life experience. The arc connects any past experience to the present conversation.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // ============================================================================
  // EVERYDAY SCENARIOS - PERFECT CONTINUOUS TENSES
  // ============================================================================

  // Work - Present Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-ppc-1',
    sentence: 'I have been working on this project for three months.',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous',
    explanation:
      'Present Perfect Continuous emphasizes the duration of ongoing work. The thick line connecting to NOW shows three months of effort reaching the present.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Health - Present Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-ppc-1',
    sentence: 'She has been exercising regularly since January.',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous',
    explanation:
      'Present Perfect Continuous shows the duration of a habit that started in the past and continues now. The thick line connecting to NOW shows the ongoing exercise routine.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Family - Past Perfect Continuous
  {
    type: 'sentence-to-timeline',
    id: 'everyday-family-ppc-1',
    sentence: 'The children had been playing for hours before dinner.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 20 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 60 },
    ],
    tenseName: 'Past Perfect Continuous',
    explanation:
      'Past Perfect Continuous shows duration of an action before another past point. The thick line connecting to the reference dot shows hours of playing before dinner.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Work - Present Perfect Continuous Negative
  {
    type: 'sentence-to-timeline',
    id: 'everyday-work-ppc-neg-1',
    sentence: "He hasn't been coming to work regularly.",
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous (Negative)',
    explanation:
      'Present Perfect Continuous Negative shows an ongoing pattern of absence. The thick line connecting to NOW shows the duration of irregular attendance reaching the present.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'negative',
  },

  // Health - Present Perfect Continuous Question
  {
    type: 'sentence-to-timeline',
    id: 'everyday-health-ppc-q-1',
    sentence: 'How long have you been feeling tired?',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous (Question)',
    explanation:
      'This question asks about the duration of an ongoing condition. The solid line shows the period of tiredness leading up to now.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'question',
  },

  // ============================================================================
  // TYPE 2: TIMELINE TO VERB - EVERYDAY SCENARIOS
  // ============================================================================

  // Shopping
  {
    type: 'timeline-to-verb',
    id: 'everyday-shop-verb-1',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'shop' },
    ],
    sentenceTemplate: 'My mother ___[shop]___ at the same supermarket every week.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'shop',
        validAnswers: [
          { answer: 'shops', tenseName: 'Present Simple', nuance: 'A regular weekly habit' },
        ],
      },
    ],
    scenario: 'Family shopping habits',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Health
  {
    type: 'timeline-to-verb',
    id: 'everyday-health-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-to-now', zone: 'past', position: 40, verbLabel: 'take' },
    ],
    sentenceTemplate: 'I ___[take]___ medicine for a week now.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'take',
        validAnswers: [
          { answer: 'have been taking', tenseName: 'Present Perfect Continuous', nuance: 'Ongoing action from past to now' },
          { answer: "'ve been taking", tenseName: 'Present Perfect Continuous', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Doctor follow-up',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Work
  {
    type: 'timeline-to-verb',
    id: 'everyday-work-verb-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 30, verbLabel: 'send' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'receive' },
    ],
    sentenceTemplate: 'I ___[send]___ the email, but I never ___[receive]___ a reply.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'send',
        validAnswers: [
          { answer: 'sent', tenseName: 'Past Simple', nuance: 'Completed past action' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'receive',
        validAnswers: [
          { answer: 'received', tenseName: 'Past Simple', nuance: 'Another completed past action (that did not happen)' },
        ],
      },
    ],
    scenario: 'Office communication',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Family
  {
    type: 'timeline-to-verb',
    id: 'everyday-family-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 30, verbLabel: 'wait' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'We ___[wait]___ for an hour when our relatives finally ___[arrive]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'wait',
        validAnswers: [
          { answer: 'had been waiting', tenseName: 'Past Perfect Continuous', nuance: 'Duration before the reference point' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [
          { answer: 'arrived', tenseName: 'Past Simple', nuance: 'The moment they came' },
        ],
      },
    ],
    scenario: 'Family gathering',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // MIXED TENSES - NEGATIVES AND QUESTIONS (Gap Coverage)
  // ============================================================================

  // Mixed - Negative
  {
    type: 'timeline-to-verb',
    id: 'mixed-neg-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'not/see' },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 60, verbLabel: 'see' },
    ],
    sentenceTemplate: 'I ___[not/see]___ him in years, but I ___[see]___ him next week.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'not/see',
        validAnswers: [
          { answer: "haven't seen", tenseName: 'Present Perfect (Negative)', nuance: 'No contact from past to now' },
          { answer: 'have not seen', tenseName: 'Present Perfect (Negative)', nuance: 'Full form' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'see',
        validAnswers: [
          { answer: 'will see', tenseName: 'Future Simple', nuance: 'Planned future meeting' },
          { answer: "'ll see", tenseName: 'Future Simple', nuance: 'Contracted form' },
          { answer: 'am going to see', tenseName: 'Be Going To', nuance: 'Planned intention' },
        ],
      },
    ],
    scenario: 'Reconnecting with an old friend',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'negative',
  },

  // Mixed - Question
  {
    type: 'timeline-to-verb',
    id: 'mixed-q-2',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'you/do' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'call' },
    ],
    sentenceTemplate: 'What ___[you/do]___ when I ___[call]___?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/do',
        validAnswers: [
          { answer: 'were you doing', tenseName: 'Past Continuous (Question)', nuance: 'Asking about ongoing action at that moment' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'call',
        validAnswers: [
          { answer: 'called', tenseName: 'Past Simple', nuance: 'The interrupting moment' },
        ],
      },
    ],
    scenario: 'Curious about your activities',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'question',
  },

  // Mixed - Complex Question
  {
    type: 'sentence-to-timeline',
    id: 'mixed-complex-q-1',
    sentence: 'Have you decided what you will study next year?',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 60 },
    ],
    tenseName: 'Present Perfect + Future Simple',
    explanation:
      'Present Perfect (Have you decided) asks about a decision made before now, and Future Simple (will study) refers to the future plan. The arc shows the decision connecting to now, the dot marks the future study.',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'question',
  },

  // ============================================================================
  // ADVANCED LEVEL 3 QUESTIONS - MORE COMPLEX TENSE COMBINATIONS
  // ============================================================================

  // Past Perfect Continuous + Past Simple
  {
    type: 'sentence-to-timeline',
    id: 'adv-combo-1',
    sentence: 'I had been sleeping when the fire alarm went off.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 20 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 60 },
    ],
    tenseName: 'Past Perfect Continuous + Past Simple',
    explanation:
      'Past Perfect Continuous (had been sleeping) shows an ongoing action before another past event. Past Simple (went off) marks the interruption. The thick line connecting to the reference dot shows the sleeping duration before the alarm.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  // Future Perfect + Future Simple
  {
    type: 'sentence-to-timeline',
    id: 'adv-combo-2',
    sentence: 'By the time you arrive, we will have eaten dinner.',
    correctElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 70 },
    ],
    tenseName: 'Future Perfect + Simple Future Reference',
    explanation:
      'Future Perfect (will have eaten) shows completion before a future point. The arrival is the reference. The dashed arc spans to the dinner completion, the dot marks arrival.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Complex timeline with three elements
  {
    type: 'timeline-to-verb',
    id: 'adv-three-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 20, verbLabel: 'start' },
      { id: 'e2', type: 'solid-line', zone: 'past', position: 50, verbLabel: 'work' },
      { id: 'e3', type: 'single-dot', zone: 'past', position: 80, verbLabel: 'quit' },
    ],
    sentenceTemplate: 'She ___[start]___ in 2020, ___[work]___ there for 3 years, then ___[quit]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'start',
        validAnswers: [
          { answer: 'started', tenseName: 'Past Simple', nuance: 'The beginning point' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'work',
        validAnswers: [
          { 
            answer: 'worked', 
            tenseName: 'Past Simple', 
            nuance: 'A completed duration in the past (treated as a finished fact).' 
          },
          {
            answer: 'was working',
            tenseName: 'Past Continuous',
            nuance: 'Focuses on the ongoing process of working throughout that time.'
          },
        ],
      },
      {
        id: 'b3',
        baseVerb: 'quit',
        validAnswers: [
          { answer: 'quit', tenseName: 'Past Simple', nuance: 'The ending point' },
        ],
      },
    ],
    scenario: 'Job history',
    difficulty: 2,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // BEGINNER LEVEL 1 - MORE SIMPLE SENTENCES
  // ============================================================================

  // Simple everyday habits
  {
    type: 'sentence-to-timeline',
    id: 'beg-habit-1',
    sentence: 'I drink coffee every morning.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple describes daily habits. The repeated dots show this happens every day.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'beg-habit-2',
    sentence: 'She walks to school.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple shows a regular routine. Walking to school is her usual habit.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Simple past events
  {
    type: 'sentence-to-timeline',
    id: 'beg-past-1',
    sentence: 'I ate lunch at 12:00.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple describes a completed action. The single dot marks when lunch happened.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'beg-past-2',
    sentence: 'They played soccer yesterday.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple shows a finished game. The dot marks yesterday in the past zone.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Simple future plans
  {
    type: 'sentence-to-timeline',
    id: 'beg-future-1',
    sentence: 'I will call you later.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple',
    explanation:
      'Future Simple describes a future action. The dot marks the planned phone call.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'beg-future-2',
    sentence: 'She will help you tomorrow.',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
    tenseName: 'Future Simple',
    explanation:
      'Future Simple shows a future plan to help. The dot marks tomorrow in the future zone.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // Simple negatives for beginners
  {
    type: 'sentence-to-timeline',
    id: 'beg-neg-1',
    sentence: "I don't like spicy food.",
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Negative)',
    explanation:
      'Present Simple Negative shows a permanent preference. This is always true for this person.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'beg-neg-2',
    sentence: "He didn't come to class today.",
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple (Negative)',
    explanation:
      'Past Simple Negative shows something that did NOT happen. The dot marks today (which is now in the past).',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'negative',
  },

  // Simple questions for beginners
  {
    type: 'sentence-to-timeline',
    id: 'beg-q-1',
    sentence: 'Do you speak English?',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple (Question)',
    explanation:
      'Present Simple questions ask about abilities or habits. This asks about a general skill.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  {
    type: 'sentence-to-timeline',
    id: 'beg-q-2',
    sentence: 'Did you sleep well?',
    correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
    tenseName: 'Past Simple (Question)',
    explanation:
      'Past Simple questions ask about completed actions. This asks about last night.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'question',
  },

  // ============================================================================
  // TYPE 2: BEGINNER TIMELINE TO VERB
  // ============================================================================

  {
    type: 'timeline-to-verb',
    id: 'beg-verb-1',
    timelineElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50, verbLabel: 'eat' },
    ],
    sentenceTemplate: 'I ___[eat]___ breakfast every day.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'eat',
        validAnswers: [
          { answer: 'eat', tenseName: 'Present Simple', nuance: 'A daily routine' },
        ],
      },
    ],
    scenario: 'Morning routine',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'timeline-to-verb',
    id: 'beg-verb-2',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 40, verbLabel: 'watch' },
    ],
    sentenceTemplate: 'We ___[watch]___ a movie last night.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'watch',
        validAnswers: [
          { answer: 'watched', tenseName: 'Past Simple', nuance: 'Completed action' },
        ],
      },
    ],
    scenario: 'Evening entertainment',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'timeline-to-verb',
    id: 'beg-verb-3',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 50, verbLabel: 'go' },
    ],
    sentenceTemplate: 'They ___[go]___ to the beach tomorrow.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'go',
        validAnswers: [
          { answer: 'will go', tenseName: 'Future Simple', nuance: 'Future plan' },
          { answer: "'ll go", tenseName: 'Future Simple', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Weekend plans',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // TRANSPORTATION AND TRAVEL SCENARIOS
  // ============================================================================

  {
    type: 'sentence-to-timeline',
    id: 'travel-1',
    sentence: 'The bus arrives at 3pm every day.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple describes scheduled transportation. The repeated dots show this daily schedule.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'travel-2',
    sentence: 'We were driving to Boston when the car broke down.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation:
      'Past Continuous (were driving) shows the ongoing journey. Past Simple (broke down) marks the interruption. The line is the trip, the dot is the breakdown.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'travel-3',
    sentence: 'By 6pm, the flight will have landed.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect',
    explanation:
      'Future Perfect shows the flight completing before a deadline. The dashed arc spans from now to when the plane lands.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  {
    type: 'timeline-to-verb',
    id: 'travel-verb-1',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'future', position: 60, verbLabel: 'fly' },
    ],
    sentenceTemplate: 'This time tomorrow, I ___[fly]___ to New York.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'fly',
        validAnswers: [
          { answer: 'will be flying', tenseName: 'Future Continuous', nuance: 'Action in progress at a future time' },
          { answer: "'ll be flying", tenseName: 'Future Continuous', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Travel plans',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // SCHOOL AND EDUCATION SCENARIOS
  // ============================================================================

  {
    type: 'sentence-to-timeline',
    id: 'school-1',
    sentence: 'The students are taking a test right now.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation:
      'Present Continuous shows the test happening at this moment. The solid line represents the ongoing exam.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'school-2',
    sentence: 'She has studied English for five years.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 40 }],
    tenseName: 'Present Perfect',
    explanation:
      'Present Perfect connects past studies to the present. The arc shows five years of learning continuing to now.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'school-3',
    sentence: 'By May, they will have completed the course.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect',
    explanation:
      'Future Perfect describes completing the course before May. The dashed arc spans from now to graduation.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  {
    type: 'timeline-to-verb',
    id: 'school-verb-1',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 40, verbLabel: 'learn' },
    ],
    sentenceTemplate: 'She ___[learn]___ so much since she started this class.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'learn',
        validAnswers: [
          { answer: 'has learned', tenseName: 'Present Perfect', nuance: 'Growth from past to now' },
          { answer: 'has learnt', tenseName: 'Present Perfect', nuance: 'British spelling' },
          { answer: "'s learned", tenseName: 'Present Perfect', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Progress in class',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // WEATHER AND NATURE SCENARIOS
  // ============================================================================

  {
    type: 'sentence-to-timeline',
    id: 'weather-1',
    sentence: 'It rains a lot in Seattle.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple describes general weather patterns. The repeated dots show this regular occurrence.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'weather-2',
    sentence: 'It was raining when I left the house.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation:
      'Past Continuous (was raining) shows ongoing weather. Past Simple (left) marks the action during the rain. The line is the rain, the dot is leaving.',
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },

  {
    type: 'sentence-to-timeline',
    id: 'weather-3',
    sentence: 'It has been snowing all day.',
    correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
    tenseName: 'Present Perfect Continuous',
    explanation:
      'Present Perfect Continuous emphasizes the duration of snowfall. The thick line connecting to NOW shows snow continuing from morning to the present moment.',
    difficulty: 2,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },

  {
    type: 'timeline-to-verb',
    id: 'weather-verb-1',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 50, verbLabel: 'rain' },
    ],
    sentenceTemplate: 'The weather report says it ___[rain]___ tomorrow.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'rain',
        validAnswers: [
          { answer: 'will rain', tenseName: 'Future Simple', nuance: 'Weather prediction' },
          { answer: "'ll rain", tenseName: 'Future Simple', nuance: 'Contracted form' },
          { answer: 'is going to rain', tenseName: 'Be Going To', nuance: 'Prediction based on evidence' },
        ],
      },
    ],
    scenario: 'Weather forecast',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  // New variety question: Study
  {
    type: 'sentence-to-timeline',
    id: 'pc-study-1',
    sentence: 'I am studying English at the library.',
    correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
    tenseName: 'Present Continuous',
    explanation: 'Studying at the library is an action that is happening right now.',
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  // New variety question: Work
  {
    type: 'sentence-to-timeline',
    id: 'ps-work-1',
    sentence: 'He works at the hospital.',
    correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
    tenseName: 'Present Simple (Habit/Fact)',
    explanation: 'Working at the hospital is a fact or permanent situation.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  // New variety question: Cook
  {
    type: 'sentence-to-timeline',
    id: 'pp-cook-1',
    sentence: 'I have cooked dinner already.',
    correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 60 }],
    tenseName: 'Present Perfect',
    explanation: 'The dinner is cooked and the result is relevant to now.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },
  // New variety question: Watch (Mixed)
  {
    type: 'sentence-to-timeline',
    id: 'pc-past-watch-1',
    sentence: 'I was watching a movie when you called.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation: 'Watching the movie was the longer ongoing action (line) interrupted by the call (dot).',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Interrupted Action (Eat + Ring)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-interrupted-1',
    sentence: 'I was eating when the phone rang.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation: 'Eating is the ongoing background action, and ringing is the sudden interruption.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Past Perfect Sequence (Leave + Arrive)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-sequence-1',
    sentence: 'She had already left before we arrived.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation: 'She left (earlier past) before we arrived (later past).',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Future Perfect + Sequence (Finish + Come)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-future-1',
    sentence: 'I will have finished my homework by the time you come over.',
    correctElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 70 },
    ],
    tenseName: 'Future Perfect + Context',
    explanation: 'Finishing the homework links NOW to a future moment BEFORE the friend arrives.',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Parallel Actions (Study + Play)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-parallel-1',
    sentence: 'While I was studying, they were playing games.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 40, verbLabel: 'study' },
      { id: 'e2', type: 'solid-line', zone: 'past', position: 60, verbLabel: 'play' },
    ],
    tenseName: '2 x Past Continuous',
    explanation: 'Two actions were happening at the same time in the past.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Past Sequence (Open + Run)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-past-seq-1',
    sentence: 'He opened the door and ran outside.',
    correctElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Simple Sequence',
    explanation: 'Two completed momentary actions happening one after another in the past.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Future Time Clause (Arrives + Eat)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-future-time-1',
    sentence: 'As soon as she arrives, we will eat dinner.',
    correctElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 70 },
    ],
    tenseName: 'Time Clause (Future context)',
    explanation: 'Both actions happen in the future! "Arrives" is the required first condition for the later "will eat".',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Present Perfect Result (Lose + Can't)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-perfect-result-1',
    sentence: "I have lost my passport, so I can't travel.",
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 50 },
      { id: 'e2', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Perfect + Present Simple',
    explanation: 'An action from the past ("have lost") officially links to a factual result playing out right now ("can\'t travel").',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Change of State (Live + Live)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-change-state-1',
    sentence: 'I was living in New York, but now I live in Tokyo.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 50 },
      { id: 'e2', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Past Continuous + Present Simple',
    explanation: 'A temporary situation in the past ("was living") is being contrasted with a permanent fact right now ("live").',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Past Perfect Continuous Interrupted
  {
    type: 'sentence-to-timeline',
    id: 'mixed-ppc-interrupted-1',
    sentence: 'I had been driving for hours when I finally saw the sign.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect Continuous + Past Simple',
    explanation: 'A long continuous duration in the earlier past ("had been driving") progressing up until it was specifically interrupted by a moment ("saw").',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // Mixed: Past Continuous Interrupted (Negative)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-pc-neg-1',
    sentence: 'I wasn\'t sleeping when you called.',
    correctElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 50 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 50 },
    ],
    tenseName: 'Past Continuous + Past Simple',
    explanation: 'A negative continuous state in the past that was interrupted by a specific moment.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'negative',
  },
  // Mixed: Past Perfect Sequence (Negative)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-sequence-neg-1',
    sentence: 'She hadn\'t studied before she took the test.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 50 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 20 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation: 'A lack of an action in the earlier past ("hadn\'t studied") leading up to an event in the later past ("took").',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'negative',
  },
  // Mixed: Present Perfect Result (Negative)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-perf-result-neg-1',
    sentence: 'I haven\'t finished my work, so I can\'t leave yet.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past', position: 50 },
      { id: 'e2', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Perfect + Present Simple',
    explanation: 'An incomplete action spanning from the past to now ("haven\'t finished") restricting a current factual state ("can\'t leave").',
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'negative',
  },
  // Mixed: Future Time Clause (Question)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-future-time-q-1',
    sentence: 'Will you call me when you land?',
    correctElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 50 },
    ],
    tenseName: 'Future Simple + Present Simple',
    explanation: 'A question about two sequential momentary events in the future (the landing, and then the call).',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'question',
  },
  // Mixed: Past Simple Sequence (Question)
  {
    type: 'sentence-to-timeline',
    id: 'mixed-past-seq-q-1',
    sentence: 'Did he lock the door before he left?',
    correctElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
    ],
    tenseName: 'Past Simple + Past Simple',
    explanation: 'A question asking to confirm the chronological order of two specific moments in the past.',
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'question',
  },
  // New PPC - Build the Timeline
  {
    type: 'sentence-to-timeline',
    id: 'ppc-past-3',
    sentence: 'I had been waiting for the bus for 30 minutes when it finally arrived.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 40 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect Continuous + Past Simple',
    explanation: 'Wait (duration up to a point) and arrival (moment in later past).',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New PPC - Build the Timeline
  {
    type: 'sentence-to-timeline',
    id: 'ppc-past-4',
    sentence: 'They had been working on the project for months before the deadline was changed.',
    correctElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 80 },
    ],
    tenseName: 'Past Perfect Continuous + Past Simple',
    explanation: 'Work (duration up to a point) and change (moment in later past).',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New FPC - Build the Timeline
  {
    type: 'sentence-to-timeline',
    id: 'fpc-3',
    sentence: 'Next month, I will have been living in this city for ten years.',
    correctElements: [{ id: 'e1', type: 'solid-to-point', zone: 'future', position: 70 }],
    tenseName: 'Future Perfect Continuous',
    explanation: 'Living (duration) up to a specific moment in the future.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New FPC - Build the Timeline
  {
    type: 'sentence-to-timeline',
    id: 'fpc-4',
    sentence: 'By 5:00 PM, she will have been studying for six hours straight.',
    correctElements: [{ id: 'e1', type: 'solid-to-point', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect Continuous',
    explanation: 'Study (duration) up to a future point in time.',
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New PPC - Read the Timeline
  {
    type: 'timeline-to-verb',
    id: 'ppc-past-read-2',
    timelineElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past', position: 40, verbLabel: 'teach' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'retire' },
    ],
    sentenceTemplate: 'We ___[teach]___ at that school for 5 years when the principal ___[retire]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'teach',
        validAnswers: [
          { answer: 'had been teaching', tenseName: 'Past Perfect Continuous', nuance: 'Correct Past Perfect Continuous' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'retire',
        validAnswers: [{ answer: 'retired', tenseName: 'Past Simple', nuance: 'Correct Past Simple' }],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New PPC - Read the Timeline
  {
    type: 'timeline-to-verb',
    id: 'ppc-past-read-3',
    timelineElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'past', position: 30, verbLabel: 'wait' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 80, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'I ___[wait]___ for the bus for 30 minutes when it finally ___[arrive]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'wait',
        validAnswers: [
          { answer: 'had been waiting', tenseName: 'Past Perfect Continuous', nuance: 'Correct Past Perfect Continuous' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [{ answer: 'arrived', tenseName: 'Past Simple', nuance: 'Correct Past Simple' }],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New FPC - Read the Timeline
  {
    type: 'timeline-to-verb',
    id: 'fpc-read-2',
    timelineElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'future', position: 70, verbLabel: 'travel' },
    ],
    sentenceTemplate: 'By next summer, they ___[travel]___ for three months.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'travel',
        validAnswers: [
          { answer: 'will have been traveling', tenseName: 'Future Perfect Continuous', nuance: 'Correct Future Perfect Continuous' },
        ],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // New FPC - Read the Timeline
  {
    type: 'timeline-to-verb',
    id: 'fpc-read-3',
    timelineElements: [
      { id: 'e1', type: 'solid-to-point', zone: 'future', position: 80, verbLabel: 'climb' },
    ],
    sentenceTemplate: 'By the time we reach the summit, we ___[climb]___ for eight hours.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'climb',
        validAnswers: [
          { answer: 'will have been climbing', tenseName: 'Future Perfect Continuous', nuance: 'Correct Future Perfect Continuous' },
        ],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
  // READ: Continuous (Present)
  {
    type: 'timeline-to-verb',
    id: 'pc-read-3',
    timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50, verbLabel: 'cook' }],
    sentenceTemplate: 'Look! My father ___[cook]___ dinner right now.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'cook',
        validAnswers: [{ answer: 'is cooking', tenseName: 'Present Continuous', nuance: 'Action happening right now' }],
      },
    ],
    difficulty: 1,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  // READ: Continuous (Past)
  {
    type: 'timeline-to-verb',
    id: 'pc-read-4',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 30, verbLabel: 'sleep' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'The baby ___[sleep]___ when the package ___[arrive]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'sleep',
        validAnswers: [{ answer: 'was sleeping', tenseName: 'Past Continuous', nuance: 'Ongoing action interrupted' }],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [{ answer: 'arrived', tenseName: 'Past Simple', nuance: 'Shorter interrupting action' }],
      },
    ],
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  // READ: Mixed (Interrupted)
  {
    type: 'timeline-to-verb',
    id: 'mixed-read-2',
    timelineElements: [
      { id: 'e1', type: 'solid-line', zone: 'past', position: 40, verbLabel: 'drive' },
      { id: 'e2', type: 'single-dot', zone: 'past', position: 60, verbLabel: 'see' },
    ],
    sentenceTemplate: 'While I ___[drive]___ to work, I ___[see]___ a deer.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'drive',
        validAnswers: [{ answer: 'was driving', tenseName: 'Past Continuous', nuance: 'Longer action in progress' }],
      },
      {
        id: 'b2',
        baseVerb: 'see',
        validAnswers: [{ answer: 'saw', tenseName: 'Past Simple', nuance: 'Momentary action in the past' }],
      },
    ],
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // READ: Mixed (Sequence)
  {
    type: 'timeline-to-verb',
    id: 'mixed-read-3',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'past-earlier', position: 30, verbLabel: 'finish' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'go' },
    ],
    sentenceTemplate: 'After she ___[finish]___ the test, she ___[go]___ home.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'finish',
        validAnswers: [
          { answer: 'finished', tenseName: 'Past Simple', nuance: 'Also correct in sequential context' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'go',
        validAnswers: [{ answer: 'went', tenseName: 'Past Simple', nuance: 'Later of two past actions' }],
      },
    ],
    difficulty: 3,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },
  // READ: Perfect (Past)
  {
    type: 'timeline-to-verb',
    id: 'perf-read-5',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'read' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'watch' },
    ],
    sentenceTemplate: 'He ___[read]___ the book before he ___[watch]___ the movie.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'read',
        validAnswers: [{ answer: 'had read', tenseName: 'Past Perfect', nuance: 'Action completed before another past event' }],
      },
      {
        id: 'b2',
        baseVerb: 'watch',
        validAnswers: [{ answer: 'watched', tenseName: 'Past Simple', nuance: 'Second action in the past' }],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },
  // READ: Perfect (Future)
  {
    type: 'timeline-to-verb',
    id: 'perf-read-6',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 70, verbLabel: 'graduate' },
    ],
    sentenceTemplate: 'By next June, I ___[graduate]___ from college.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'graduate',
        validAnswers: [{ answer: 'will have graduated', tenseName: 'Future Perfect', nuance: 'Action completed by a future time' }],
      },
    ],
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },
  // READ: Continuous (Future 2)
  {
    type: 'timeline-to-verb',
    id: 'pc-future-read-3',
    timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60, verbLabel: 'study' }],
    sentenceTemplate: 'At this time tomorrow, I ___[study]___ in the library.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'study',
        validAnswers: [{ answer: 'will be studying', tenseName: 'Future Continuous', nuance: 'Action in progress in the future' }],
      },
    ],
    difficulty: 2,
    tenseCategory: 'continuous',
    sentenceForm: 'affirmative',
  },
  // READ: Mixed (Future Sequence)
  {
    type: 'timeline-to-verb',
    id: 'mixed-read-4',
    timelineElements: [
      { id: 'e1', type: 'single-dot', zone: 'future', position: 40, verbLabel: 'arrive' },
      { id: 'e2', type: 'single-dot', zone: 'future', position: 80, verbLabel: 'call' },
    ],
    sentenceTemplate: 'When they ___[arrive]___ tomorrow, I ___[call]___ you.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'arrive',
        validAnswers: [{ answer: 'arrive', tenseName: 'Present Simple', nuance: 'Simple Present for future in time clause' }],
      },
      {
        id: 'b2',
        baseVerb: 'call',
        validAnswers: [{ answer: 'will call', tenseName: 'Future Simple', nuance: 'Simple Future for main clause' }],
      },
    ],
    difficulty: 2,
    tenseCategory: 'mixed',
    sentenceForm: 'affirmative',
  },

  // ============================================================================
  // PAST PERFECT - EXPANDED QUESTION BANK
  // ============================================================================

  // Past Perfect Affirmative - everyday scenario
  {
    type: 'sentence-to-timeline',
    id: 'pperf-eat-1',
    sentence: 'I had eaten dinner before the movie started.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      'Eating dinner (Past Perfect) happened before the movie started (Past Simple reference point). The arc marks the earlier action, the dot marks when the movie began.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect Affirmative - "never...before" pattern
  {
    type: 'sentence-to-timeline',
    id: 'pperf-snow-1',
    sentence: 'She had never seen snow before she moved to Boston.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      '"Had never seen" describes an experience that never occurred up to a past point. The arc covers the whole earlier past, and the dot marks when she moved.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect Affirmative - academic context
  {
    type: 'sentence-to-timeline',
    id: 'pperf-grad-1',
    sentence: 'He had already graduated before she started college.',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect + Past Simple',
    explanation:
      '"Already" emphasizes that the graduation (Past Perfect) was complete before she started college (Past Simple). The arc is earlier; the dot is later.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect Negative - social context
  {
    type: 'sentence-to-timeline',
    id: 'pperf-neg-2',
    sentence: "I hadn't met her before the party.",
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect (Negative) + Past Simple',
    explanation:
      '"Hadn\'t met" means the meeting had NOT happened before that party. The arc (earlier past action that didn\'t happen) and dot (the party) show the sequence.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Past Perfect Negative - academic context
  {
    type: 'sentence-to-timeline',
    id: 'pperf-neg-3',
    sentence: "They hadn't studied the chapter before the test began.",
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect (Negative) + Past Simple',
    explanation:
      'The studying had NOT been completed before the test started. The arc represents the incomplete earlier action, and the dot marks when the test began.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Past Perfect Question - experience
  {
    type: 'sentence-to-timeline',
    id: 'pperf-q-2',
    sentence: 'Had you ever tried sushi before you came to the US?',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect (Question) + Past Simple',
    explanation:
      'This asks about an experience that may have occurred before a past reference point. The arc covers the earlier past and the dot marks when you came to the US.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Past Perfect Question - event sequence
  {
    type: 'sentence-to-timeline',
    id: 'pperf-q-3',
    sentence: 'Had she called you before she left the office?',
    correctElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
    ],
    tenseName: 'Past Perfect (Question) + Past Simple',
    explanation:
      'Asking whether the call happened before she left. The arc marks the possible earlier call, the dot marks when she left the office.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Past Perfect - Timeline to Verb (affirmative)
  {
    type: 'timeline-to-verb',
    id: 'pperf-verb-3',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'already/eat' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'arrive' },
    ],
    sentenceTemplate: 'She ___[already/eat]___ when he ___[arrive]___.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'already/eat',
        validAnswers: [
          { answer: 'had already eaten', tenseName: 'Past Perfect', nuance: 'Completed before the reference point' },
          { answer: 'had eaten', tenseName: 'Past Perfect', nuance: 'Without "already" — still correct' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'arrive',
        validAnswers: [
          { answer: 'arrived', tenseName: 'Past Simple', nuance: 'The reference point in the past' },
        ],
      },
    ],
    scenario: 'Coming home late',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Past Perfect - Timeline to Verb (question form)
  {
    type: 'timeline-to-verb',
    id: 'pperf-verb-4',
    timelineElements: [
      { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30, verbLabel: 'finish' },
      { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70, verbLabel: 'storm hits' },
    ],
    sentenceTemplate: '___[you/finish]___ the work before the storm ___[hit]___?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'you/finish',
        validAnswers: [
          { answer: 'Had you finished', tenseName: 'Past Perfect (Question)', nuance: 'Inverted question — Had + subject + past participle' },
        ],
      },
      {
        id: 'b2',
        baseVerb: 'hit',
        validAnswers: [
          { answer: 'hit', tenseName: 'Past Simple', nuance: 'Irregular verb — hit/hit/hit' },
        ],
      },
    ],
    scenario: 'Weather emergency',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // ============================================================================
  // FUTURE PERFECT - EXPANDED QUESTION BANK
  // ============================================================================

  // Future Perfect Affirmative - academic milestone
  {
    type: 'sentence-to-timeline',
    id: 'fp-2',
    sentence: 'She will have graduated by next summer.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect',
    explanation:
      'Future Perfect describes an action that will be complete before a specific future point. The dashed arc shows the action spanning from now to the graduation deadline.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Future Perfect Affirmative - savings goal
  {
    type: 'sentence-to-timeline',
    id: 'fp-3',
    sentence: 'They will have saved enough money by December.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 65 }],
    tenseName: 'Future Perfect',
    explanation:
      '"By December" is the future deadline. The dashed arc shows that saving will be complete by that specific future point.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Future Perfect Affirmative - long-term goal
  {
    type: 'sentence-to-timeline',
    id: 'fp-4',
    sentence: 'By 2030, scientists will have developed new treatments for the disease.',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 75 }],
    tenseName: 'Future Perfect',
    explanation:
      'A far future deadline (2030) with a task that will be completed by then. The dashed arc spans from now to that future point.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Future Perfect Negative - not done in time
  {
    type: 'sentence-to-timeline',
    id: 'fp-neg-2',
    sentence: "I won't have saved enough money by the end of the month.",
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }],
    tenseName: 'Future Perfect (Negative)',
    explanation:
      'Future Perfect Negative says the task will NOT be finished by the deadline. The dashed arc still marks the future span — the negative is in the verb, not the timeline shape.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Future Perfect Negative - timing issue
  {
    type: 'sentence-to-timeline',
    id: 'fp-neg-3',
    sentence: "They won't have arrived before sunset.",
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect (Negative)',
    explanation:
      '"Sunset" is the future deadline. The negative predicts the arrival will NOT be complete before that point. The dashed arc shows the future span.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'negative',
  },

  // Future Perfect Question - deadline check
  {
    type: 'sentence-to-timeline',
    id: 'fp-q-2',
    sentence: 'Will you have finished the test by noon?',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }],
    tenseName: 'Future Perfect (Question)',
    explanation:
      'Asking whether the test will be complete by a future time. "By noon" is the deadline and the dashed arc spans from now to that future point.',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Future Perfect Question - planning
  {
    type: 'sentence-to-timeline',
    id: 'fp-q-3',
    sentence: 'Will she have moved into her new apartment by next month?',
    correctElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
    tenseName: 'Future Perfect (Question)',
    explanation:
      'Asking if the move will be completed before a future point. The dashed arc shows the question is about a future span with a deadline.',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },

  // Future Perfect - Timeline to Verb (affirmative)
  {
    type: 'timeline-to-verb',
    id: 'fp-verb-2',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 60, verbLabel: 'leave' },
    ],
    sentenceTemplate: 'By the time you wake up, I ___[leave]___ for work.',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'leave',
        validAnswers: [
          { answer: 'will have left', tenseName: 'Future Perfect', nuance: 'The departure will be complete before waking up' },
          { answer: "'ll have left", tenseName: 'Future Perfect', nuance: 'Contracted form' },
        ],
      },
    ],
    scenario: 'Early morning schedule',
    difficulty: 2,
    tenseCategory: 'perfect',
    sentenceForm: 'affirmative',
  },

  // Future Perfect - Timeline to Verb (question form)
  {
    type: 'timeline-to-verb',
    id: 'fp-verb-3',
    timelineElements: [
      { id: 'e1', type: 'arc-dashed', zone: 'future', position: 65, verbLabel: 'finish' },
    ],
    sentenceTemplate: '___[finish]___ the project before the client meeting?',
    blanks: [
      {
        id: 'b1',
        baseVerb: 'finish',
        validAnswers: [
          { answer: 'Will you have finished', tenseName: 'Future Perfect (Question)', nuance: 'Will + subject + have + past participle' },
          { answer: 'Will she have finished', tenseName: 'Future Perfect (Question)', nuance: 'Third-person alternative' },
        ],
      },
    ],
    scenario: 'Work deadline',
    difficulty: 3,
    tenseCategory: 'perfect',
    sentenceForm: 'question',
  },
];
