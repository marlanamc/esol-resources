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
      sentence: 'I am studying right now.',
      correctElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
      tenseName: 'Present Continuous',
      explanation: 'Lines show actions in progress.',
      difficulty: 1,
      tenseCategory: 'continuous',
      sentenceForm: 'affirmative',
    },
    {
      type: 'sentence-to-timeline',
      id: 'tut-all-3',
      sentence: 'I finished before you arrived.',
      correctElements: [
        { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
        { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
      ],
      tenseName: 'Past Perfect + Past Simple',
      explanation: 'Arcs link two moments in time.',
      difficulty: 1,
      tenseCategory: 'perfect',
      sentenceForm: 'affirmative',
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
  'tut-all-3': 'Check the "2 stamps needed" chip! You need a dot AND an arc.',
};

export const TUTORIAL_COMPLETED_KEY = 'timeline-tenses-tutorial-completed-v2';
export const CATEGORY_TUTORIAL_KEY_PREFIX = 'timeline-tutorial-completed-';
