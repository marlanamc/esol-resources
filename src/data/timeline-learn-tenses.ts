import type { TenseCategory, TimelineElement } from '@/types/activity';

export type LearnTensesFamilyId =
  | 'simple'
  | 'continuous'
  | 'perfect'
  | 'perfect-continuous'
  | 'used-to';

export type LearnTensesTimeSlot = 'past' | 'present' | 'future';

export interface LearnTensesCard {
  id: string;
  timeSlot: LearnTensesTimeSlot;
  tenseName: string;
  shortMeaning: string;
  formulas: {
    affirmative: string;
    negative: string;
    question: string;
  };
  examples: {
    affirmative: { sentence: string; verbPhrase: string };
    negative: { sentence: string; verbPhrase: string };
    question: { sentence: string; verbPhrase: string };
  };
  timelineElements: TimelineElement[];
}

export interface LearnTensesFamilyLesson {
  id: LearnTensesFamilyId;
  title: string;
  badge: string;
  intro: string;
  helper: string;
  cards: LearnTensesCard[];
}

export const LEARN_TENSES_FAMILY_ORDER: LearnTensesFamilyId[] = [
  'simple',
  'continuous',
  'perfect',
  'perfect-continuous',
  'used-to',
];

export const LEARN_TENSES_LESSONS: Record<LearnTensesFamilyId, LearnTensesFamilyLesson> = {
  simple: {
    id: 'simple',
    title: 'Simple Tenses',
    badge: 'Simple',
    intro: 'Simple tenses show habits, facts, and single finished or planned events.',
    helper: 'Use these for routines, facts, and one clear action at a past or future time.',
    cards: [
      {
        id: 'simple-past',
        timeSlot: 'past',
        tenseName: 'Past Simple',
        shortMeaning: 'A finished action at one past moment.',
        formulas: {
          affirmative: 'subject + V2',
          negative: 'subject + did + not + V1',
          question: 'Did + subject + V1?',
        },
        examples: {
          affirmative: { sentence: 'I cooked dinner last night.', verbPhrase: 'cooked' },
          negative: { sentence: 'I did not cook dinner last night.', verbPhrase: 'did not cook' },
          question: { sentence: 'Did you cook dinner last night?', verbPhrase: 'Did you cook' },
        },
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
      },
      {
        id: 'simple-present',
        timeSlot: 'present',
        tenseName: 'Present Simple',
        shortMeaning: 'A habit, routine, or fact that is true now.',
        formulas: {
          affirmative: 'subject + V1 / V1-3rd',
          negative: 'subject + do(es) + not + V1',
          question: 'Do(es) + subject + V1?',
        },
        examples: {
          affirmative: { sentence: 'She takes the bus every morning.', verbPhrase: 'takes' },
          negative: { sentence: 'She does not take the bus on Sundays.', verbPhrase: 'does not take' },
          question: { sentence: 'Does she take the bus every morning?', verbPhrase: 'Does she take' },
        },
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
      },
      {
        id: 'simple-future',
        timeSlot: 'future',
        tenseName: 'Future Simple',
        shortMeaning: 'One future action or decision.',
        formulas: {
          affirmative: 'subject + will + V1',
          negative: 'subject + will + not + V1',
          question: 'Will + subject + V1?',
        },
        examples: {
          affirmative: { sentence: 'We will visit the library tomorrow.', verbPhrase: 'will visit' },
          negative: { sentence: 'We will not visit the library on Friday.', verbPhrase: 'will not visit' },
          question: { sentence: 'Will you visit the library tomorrow?', verbPhrase: 'Will you visit' },
        },
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
      },
    ],
  },
  continuous: {
    id: 'continuous',
    title: 'Continuous Tenses',
    badge: 'Continuous',
    intro: 'Continuous tenses show actions in progress at a specific time.',
    helper: 'Use these when you want learners to picture an action happening around that moment.',
    cards: [
      {
        id: 'continuous-past',
        timeSlot: 'past',
        tenseName: 'Past Continuous',
        shortMeaning: 'An action that was in progress in the past.',
        formulas: {
          affirmative: 'subject + was/were + V1-ing',
          negative: 'subject + was/were + not + V1-ing',
          question: 'Was/Were + subject + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'I was cooking when the phone rang.', verbPhrase: 'was cooking' },
          negative: { sentence: 'I was not sleeping at 10 p.m.', verbPhrase: 'was not sleeping' },
          question: { sentence: 'Were they waiting when you arrived?', verbPhrase: 'Were they waiting' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'past', position: 30 }],
      },
      {
        id: 'continuous-present',
        timeSlot: 'present',
        tenseName: 'Present Continuous',
        shortMeaning: 'An action happening right now.',
        formulas: {
          affirmative: 'subject + am/is/are + V1-ing',
          negative: 'subject + am/is/are + not + V1-ing',
          question: 'Am/Is/Are + subject + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'I am washing the dishes right now.', verbPhrase: 'am washing' },
          negative: { sentence: 'I am not driving right now.', verbPhrase: 'am not driving' },
          question: { sentence: 'Are they working right now?', verbPhrase: 'Are they working' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
      },
      {
        id: 'continuous-present-near-future',
        timeSlot: 'present',
        tenseName: 'Present Continuous (Near Future)',
        shortMeaning: 'A fixed plan or arrangement happening soon.',
        formulas: {
          affirmative: 'subject + am/is/are + V1-ing',
          negative: 'subject + am/is/are + not + V1-ing',
          question: 'Am/Is/Are + subject + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'I am visiting my grandma next week.', verbPhrase: 'am visiting' },
          negative: { sentence: 'I am not working this Saturday.', verbPhrase: 'am not working' },
          question: { sentence: 'Are you coming to the party tonight?', verbPhrase: 'Are you coming' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60 }],
      },
      {
        id: 'continuous-future',
        timeSlot: 'future',
        tenseName: 'Future Continuous',
        shortMeaning: 'An action that will be in progress later.',
        formulas: {
          affirmative: 'subject + will be + V1-ing',
          negative: 'subject + will not be + V1-ing',
          question: 'Will + subject + be + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'I will be working at 8 tomorrow.', verbPhrase: 'will be working' },
          negative: { sentence: 'I will not be working on Sunday morning.', verbPhrase: 'will not be working' },
          question: { sentence: 'Will she be traveling next week?', verbPhrase: 'Will she be traveling' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60 }],
      },
    ],
  },
  perfect: {
    id: 'perfect',
    title: 'Perfect Tenses',
    badge: 'Perfect',
    intro: 'Perfect tenses connect one time to another: past to now, or earlier time to a later reference point.',
    helper: 'Use these to show what was already finished before now, or before another past or future point.',
    cards: [
      {
        id: 'perfect-past',
        timeSlot: 'past',
        tenseName: 'Past Perfect',
        shortMeaning: 'The earlier of two past actions.',
        formulas: {
          affirmative: 'subject + had + V3',
          negative: 'subject + had + not + V3',
          question: 'Had + subject + V3?',
        },
        examples: {
          affirmative: { sentence: 'She had left before the meeting started.', verbPhrase: 'had left' },
          negative: { sentence: 'She had not left before the meeting started.', verbPhrase: 'had not left' },
          question: { sentence: 'Had she left before the meeting started?', verbPhrase: 'Had she left' },
        },
        timelineElements: [
          { id: 'e1', type: 'arc', zone: 'past-earlier', position: 30 },
          { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
        ],
      },
      {
        id: 'perfect-present',
        timeSlot: 'present',
        tenseName: 'Present Perfect',
        shortMeaning: 'A past action that still matters now.',
        formulas: {
          affirmative: 'subject + have/has + V3',
          negative: 'subject + have/has + not + V3',
          question: 'Have/Has + subject + V3?',
        },
        examples: {
          affirmative: { sentence: 'I have finished my homework already.', verbPhrase: 'have finished' },
          negative: { sentence: 'I have not finished my homework yet.', verbPhrase: 'have not finished' },
          question: { sentence: 'Have you finished your homework yet?', verbPhrase: 'Have you finished' },
        },
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
      },
      {
        id: 'perfect-future',
        timeSlot: 'future',
        tenseName: 'Future Perfect',
        shortMeaning: 'Something finished by a future deadline.',
        formulas: {
          affirmative: 'subject + will + have + V3',
          negative: 'subject + will + not + have + V3',
          question: 'Will + subject + have + V3?',
        },
        examples: {
          affirmative: { sentence: 'She will have finished the report by noon.', verbPhrase: 'will have finished' },
          negative: { sentence: 'She will not have finished the report by noon.', verbPhrase: 'will not have finished' },
          question: { sentence: 'Will she have finished the report by noon?', verbPhrase: 'Will she have finished' },
        },
        timelineElements: [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
      },
    ],
  },
  'perfect-continuous': {
    id: 'perfect-continuous',
    title: 'Perfect Continuous Tenses',
    badge: 'Perfect Continuous',
    intro: 'Perfect continuous tenses focus on duration across time: how long something has been going on.',
    helper: 'Use these when the length of the action matters, not just the fact that it happened.',
    cards: [
      {
        id: 'perfect-continuous-past',
        timeSlot: 'past',
        tenseName: 'Past Perfect Continuous',
        shortMeaning: 'How long something had been happening before a past moment.',
        formulas: {
          affirmative: 'subject + had + been + V1-ing',
          negative: 'subject + had + not + been + V1-ing',
          question: 'Had + subject + been + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'They had been playing for hours before dinner.', verbPhrase: 'had been playing' },
          negative: { sentence: 'They had not been playing for long before dinner.', verbPhrase: 'had not been playing' },
          question: { sentence: 'Had they been playing for hours before dinner?', verbPhrase: 'Had they been playing' },
        },
        timelineElements: [
          { id: 'e1', type: 'solid-to-point', zone: 'past-earlier', position: 20 },
          { id: 'e2', type: 'single-dot', zone: 'past-later', position: 60 },
        ],
      },
      {
        id: 'perfect-continuous-present',
        timeSlot: 'present',
        tenseName: 'Present Perfect Continuous',
        shortMeaning: 'How long something has been happening until now.',
        formulas: {
          affirmative: 'subject + have/has + been + V1-ing',
          negative: 'subject + have/has + not + been + V1-ing',
          question: 'Have/Has + subject + been + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'I have been living here for two years.', verbPhrase: 'have been living' },
          negative: { sentence: 'I have not been sleeping well lately.', verbPhrase: 'have not been sleeping' },
          question: { sentence: 'Have you been working here long?', verbPhrase: 'Have you been working' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
      },
      {
        id: 'perfect-continuous-future',
        timeSlot: 'future',
        tenseName: 'Future Perfect Continuous',
        shortMeaning: 'How long something will have been happening by a future time.',
        formulas: {
          affirmative: 'subject + will have been + V1-ing',
          negative: 'subject + will not have been + V1-ing',
          question: 'Will + subject + have been + V1-ing?',
        },
        examples: {
          affirmative: { sentence: 'By June, I will have been working here for a year.', verbPhrase: 'will have been working' },
          negative: { sentence: 'By June, I will not have been living here for long.', verbPhrase: 'will not have been living' },
          question: { sentence: 'Will you have been teaching here for a year by June?', verbPhrase: 'Will you have been teaching' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-to-point', zone: 'future', position: 50 }],
      },
    ],
  },
  'used-to': {
    id: 'used-to',
    title: 'Used To, Be Used To, Get Used To',
    badge: 'Used To',
    intro: 'Three expressions with "used to" — they look similar but mean very different things.',
    helper: 'Focus on the difference: past habit that ended, current familiarity, or the process of adapting.',
    cards: [
      {
        id: 'used-to-past-habit',
        timeSlot: 'past',
        tenseName: 'Used to (Past Habit)',
        shortMeaning: 'A repeated action or state that was true in the past — but no longer is.',
        formulas: {
          affirmative: 'subject + used to + V1',
          negative: 'subject + did not + use to + V1',
          question: 'Did + subject + use to + V1?',
        },
        examples: {
          affirmative: { sentence: 'I used to walk to school every day.', verbPhrase: 'used to walk' },
          negative: { sentence: 'I did not use to drink coffee.', verbPhrase: 'did not use to drink' },
          question: { sentence: 'Did you use to live near here?', verbPhrase: 'Did you use to live' },
        },
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'past', position: 40 }],
      },
      {
        id: 'be-used-to-present',
        timeSlot: 'present',
        tenseName: 'Be Used to (Current Familiarity)',
        shortMeaning: 'Already accustomed to something — it feels normal now.',
        formulas: {
          affirmative: 'subject + am/is/are + used to + V1-ing / noun',
          negative: 'subject + am/is/are + not + used to + V1-ing / noun',
          question: 'Am/Is/Are + subject + used to + V1-ing / noun?',
        },
        examples: {
          affirmative: { sentence: 'I am used to waking up early.', verbPhrase: 'am used to waking' },
          negative: { sentence: 'She is not used to the cold weather yet.', verbPhrase: 'is not used to' },
          question: { sentence: 'Are you used to working nights?', verbPhrase: 'Are you used to' },
        },
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
      },
      {
        id: 'get-used-to-present',
        timeSlot: 'present',
        tenseName: 'Get Used to (Becoming Accustomed)',
        shortMeaning: 'The process of adapting — not there yet, but it is getting easier.',
        formulas: {
          affirmative: 'subject + am/is/are + getting used to + V1-ing / noun',
          negative: 'subject + am/is/are + not + getting used to + V1-ing / noun',
          question: 'Am/Is/Are + subject + getting used to + V1-ing / noun?',
        },
        examples: {
          affirmative: { sentence: 'I am getting used to the new schedule.', verbPhrase: 'am getting used to' },
          negative: { sentence: 'He is not getting used to the long commute.', verbPhrase: 'is not getting used to' },
          question: { sentence: 'Are you getting used to life in the city?', verbPhrase: 'Are you getting used to' },
        },
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
      },
    ],
  },
};

export function getLearnTensesFamilySequence(
  selectedCategories: TenseCategory[]
): LearnTensesFamilyId[] {
  if (selectedCategories.length === 1) {
    const selected = selectedCategories[0];
    if (selected && selected !== 'mixed') {
      return [selected];
    }
  }

  return LEARN_TENSES_FAMILY_ORDER;
}
