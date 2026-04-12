import type { SentenceToTimelineQuestion, TenseCategory } from '@/types/activity';

/**
 * Categorized tutorial questions for "Build the Timeline" mode.
 */
export const CATEGORIZED_TUTORIAL_QUESTIONS: Record<TenseCategory | 'all', SentenceToTimelineQuestion[]> = {
  'simple': [
    {
      type: 'sentence-to-timeline',
      id: 'tut-simple-1',
      sentence: 'I live in Boston now.',
      correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
      tenseName: 'Present Simple',
      explanation: 'Present Simple shows a current fact or habit. Use multiple dots at NOW.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-simple-2',
      sentence: 'I moved here in 2022.',
      correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
      tenseName: 'Past Simple',
      explanation: 'Past Simple shows a completed event. Use one dot in the PAST.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-simple-3',
      sentence: 'I will live in the U.S. in 2027.',
      correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
      tenseName: 'Future Simple',
      explanation: 'Future Simple shows a future point. Use one dot in the FUTURE.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
  ],
  'continuous': [
    {
      type: 'sentence-to-timeline',
      id: 'tut-cont-1',
      sentence: 'I am studying English right now.',
      correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
      tenseName: 'Present Continuous',
      explanation: 'Continuous tenses show actions in progress. Use a solid line at NOW.',
      difficulty: 1,
      tenseCategory: 'continuous',
      sentenceForm: 'affirmative',
    },
  ],
  'perfect': [
    {
      type: 'sentence-to-timeline',
      id: 'tut-perf-1',
      sentence: 'I have lived in Revere since 2024.',
      correctElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
      tenseName: 'Present Perfect',
      explanation: 'Perfect tenses connect the past to now. Use a solid arc from the past to NOW.',
      difficulty: 1,
      tenseCategory: 'perfect',
      sentenceForm: 'affirmative',
    },
  ],
  'perfect-continuous': [
    {
      type: 'sentence-to-timeline',
      id: 'tut-perfcont-1',
      sentence: 'I have been living here for 2 years.',
      correctElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
      tenseName: 'Present Perfect Continuous',
      explanation: 'Perfect Continuous shows ongoing duration reaching NOW. Use a dashed arc.',
      difficulty: 1,
      tenseCategory: 'perfect-continuous',
      sentenceForm: 'affirmative',
    },
  ],
  'mixed': [
    {
      type: 'sentence-to-timeline',
      id: 'tut-mixed-1',
      sentence: 'I move to Boston tomorrow.',
      correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 20 }],
      tenseName: 'Future Simple',
      explanation: 'Mixed practice covers all categories. Pay attention to time markers like "tomorrow".',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
  ],
  'all': [
    // Combined set for first-time general intro
    {
      type: 'sentence-to-timeline',
      id: 'tut-all-1',
      sentence: 'I live in Boston now.',
      correctElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
      tenseName: 'Present Simple',
      explanation: 'Dots show habits or facts.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-all-2',
      sentence: 'I moved here last year.',
      correctElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 45 }],
      tenseName: 'Past Simple',
      explanation: 'One dot in the past shows one finished action.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-all-3',
      sentence: 'I will call my family tonight.',
      correctElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 35 }],
      tenseName: 'Future Simple',
      explanation: 'One dot in the future shows one future plan or action.',
      difficulty: 1,
      tenseCategory: 'simple',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-all-4',
      sentence: 'I am cooking right now.',
      correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
      tenseName: 'Present Continuous',
      explanation: 'Lines show actions in progress right now.',
      difficulty: 1,
      tenseCategory: 'continuous',
      sentenceForm: 'affirmative',
    },
  ],
  'used-to': [
    {
      type: 'sentence-to-timeline' as const,
      id: 'tut-usedto-1',
      sentence: 'I used to walk to school every day.',
      correctElements: [{ id: 'e1', type: 'multiple-dots' as const, zone: 'past' as const, position: 40 }],
      tenseName: 'Used to (Past Habit)',
      explanation: '"Used to" shows a repeated past habit that no longer happens. Use repeated dots in the PAST zone.',
      difficulty: 3 as const,
      tenseCategory: 'used-to' as const,
      sentenceForm: 'affirmative' as const,
    },
  ],
};

// Also keep the flat version for easier indexing if needed, but categorized is better
export const TIMELINE_TUTORIAL_QUESTIONS = Object.values(CATEGORIZED_TUTORIAL_QUESTIONS).flat();

export const TUTORIAL_HINTS: Record<string, string> = {
  'tut-simple-1': 'Look at the word "now". Use the habit/fact (dots) stamp on NOW.',
  'tut-simple-2': 'This was a single moment in the past. Use the single dot stamp.',
  'tut-simple-3': 'One moment in the future. Use the single dot stamp.',
  'tut-cont-1': 'The action is happening "right now". Use the duration line stamp.',
  'tut-perf-1': 'This connects the past to now. Use the solid link arc.',
  'tut-perfcont-1': 'Ongoing action reaching now. Use the dashed ongoing link arc.',
  'tut-all-3': 'This is one planned future action, so use one dot in the future.',
  'tut-all-4': 'The action is happening now, so use the duration line stamp.',
};

export const TUTORIAL_COMPLETED_KEY = 'timeline-tenses-tutorial-completed-v2';
export const CATEGORY_TUTORIAL_KEY_PREFIX = 'timeline-tutorial-completed-';
