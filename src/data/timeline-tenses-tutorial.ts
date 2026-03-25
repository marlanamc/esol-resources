import type { SentenceToTimelineQuestion } from '@/types/activity';

/**
 * Tutorial questions for the "Build the Timeline" mode.
 * These are shown to first-time users to teach the core concepts
 * before they start the real practice.
 */
export const TIMELINE_TUTORIAL_QUESTIONS: SentenceToTimelineQuestion[] = [
  {
    type: 'sentence-to-timeline',
    id: 'tutorial-1',
    sentence: 'I live in Boston now.',
    correctElements: [
      { id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 },
    ],
    tenseName: 'Present Simple',
    explanation:
      'Present Simple shows a current fact or situation. The dots at NOW mean "this is true right now."',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'tutorial-2',
    sentence: 'I moved here in 2022.',
    correctElements: [
      { id: 'e1', type: 'single-dot', zone: 'past', position: 50 },
    ],
    tenseName: 'Past Simple',
    explanation:
      'Past Simple shows a completed event. One dot in the PAST zone marks when it happened.',
    difficulty: 1,
    tenseCategory: 'simple',
    sentenceForm: 'affirmative',
  },
  {
    type: 'sentence-to-timeline',
    id: 'tutorial-3',
    sentence: 'I have been living here for 2 years.',
    correctElements: [
      { id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 },
    ],
    tenseName: 'Present Perfect Continuous',
    explanation:
      'This shows duration connecting to the present. The thick line reaches NOW because the action is still happening.',
    difficulty: 1,
    tenseCategory: 'perfect-continuous',
    sentenceForm: 'affirmative',
  },
];

/**
 * Teaching hints shown above each tutorial question.
 * These provide extra guidance specific to each step.
 */
export const TUTORIAL_HINTS: Record<string, string> = {
  'tutorial-1':
    'Look at the word "now" in the sentence. Where should this go on the timeline?',
  'tutorial-2':
    'This is a single completed event in the past. What shape represents one moment in time?',
  'tutorial-3':
    'This action started in the past and continues to the present. What element shows duration connecting to NOW?',
};

/** localStorage key for tracking tutorial completion */
export const TUTORIAL_COMPLETED_KEY = 'timeline-tenses-tutorial-completed-v1';
