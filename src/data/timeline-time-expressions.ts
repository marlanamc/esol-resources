import type { TimelineElement } from '@/types/activity';

export interface TimeSignalExample {
  sentence: string;
  verbPhrase: string;
}

export interface TimeSignalEntry {
  word: string;
  meaning: string;
  exampleSentence: string;
  verbPhrase: string;
  commonExamples?: TimeSignalExample[];
  timelineElements: TimelineElement[];
  notes?: string;
  quizDistractors?: TimelineElement[][];
}

export interface ProductionOption {
  conjugated: string;
  tenseName: string;
  isCorrect: boolean;
}

export interface ProductionExercise {
  id: string;
  sentence: string;     // includes "______" where the verb goes, e.g. "I ______ breakfast already."
  verbBase: string;     // base form shown in parens, e.g. "eat"
  timeSignal: string;   // word(s) to highlight, e.g. "already"
  options: ProductionOption[];
  explanation: string;
}

export interface TimeSignalGroup {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  tone: string;
  iconBg: string;
  activeBg: string;
  border: string;
  expressions: TimeSignalEntry[];
  productionExercises?: ProductionExercise[];
}

const TIME_SIGNAL_GROUPS_RAW: TimeSignalGroup[] = [
  {
    id: 'completion',
    label: 'Completion Markers',
    shortLabel: 'Completion',
    description: 'Show whether an action is done, not done yet, or ever experienced.',
    color: 'orange',
    tone: 'text-[#c44a28] dark:text-[#f7a37f]',
    iconBg: 'bg-[#fff7ed] dark:bg-[#c44a28]/18',
    activeBg: 'bg-[#c44a28]',
    border: 'border-[#c44a28]/20 dark:border-[#f7a37f]/30',
    expressions: [
      {
        word: 'already',
        meaning: 'The action happened sooner than expected — before the current moment.',
        exampleSentence: 'I have already eaten breakfast.',
        verbPhrase: 'have already eaten',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 60 }],
        notes: '"Already" usually goes between the auxiliary and the main verb: "I have already eaten." It can also go at the end: "I\'ve eaten already." Both are correct.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 60 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
        ],
      },
      {
        word: 'just',
        meaning: 'The action happened very recently — moments or a short time ago.',
        exampleSentence: 'She has just left the building.',
        verbPhrase: 'has just left',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 75 }],
        notes: '"Just" sits very close to NOW on the arc — the action is barely in the past.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 30 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'yet',
        meaning: 'The action was expected but has not happened — used in negatives and questions.',
        exampleSentence: "I haven't finished my homework yet.",
        verbPhrase: "haven't finished",
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        notes: '"Yet" goes at the END of the sentence. Use it only in negatives or questions.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 50 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'ever',
        meaning: 'At any point in your life — used in questions about life experience.',
        exampleSentence: 'Have you ever tried sushi?',
        verbPhrase: 'tried',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 40 }],
        notes: '"Ever" is mainly used in questions. "Never" is its negative form.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 40 }],
        ],
      },
      {
        word: 'never',
        meaning: 'Not at any point in time — zero life experience of something.',
        exampleSentence: 'I have never been to Japan.',
        verbPhrase: 'have never been',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 40 }],
        notes: '"Never" replaces "not" — don\'t use both: ✗ "I haven\'t never been."',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
        ],
      },
      {
        word: 'still',
        meaning: 'Something expected to finish has not finished — often used in negatives. In positive sentences, it means the action is continuing.',
        exampleSentence: "She still hasn't replied to my message.",
        verbPhrase: "hasn't replied",
        commonExamples: [
          { sentence: "She still hasn't replied to my message.", verbPhrase: "hasn't replied" },
          { sentence: 'He is still sleeping.', verbPhrase: 'is sleeping' },
        ],
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        notes: '"Still" in a negative sentence expresses surprise or frustration: "She still hasn\'t replied." In a positive sentence it means the action continues: "He is still sleeping."',
        quizDistractors: [
          [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'recently',
        meaning: 'The action happened at some point in the recent past — no exact date given.',
        exampleSentence: 'I have recently started going to the gym.',
        verbPhrase: 'have recently started',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 65 }],
        notes: '"Recently" is unspecified — we don\'t say exactly when. This is why Present Perfect, not Past Simple, is used.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 65 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 40 }],
        ],
      },
      {
        word: 'lately',
        meaning: 'In the recent period leading up to NOW — a vague window of recent time.',
        exampleSentence: "I haven't been sleeping well lately.",
        verbPhrase: "haven't been sleeping",
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 55 }],
        notes: '"Lately" always points toward the present — use it with Present Perfect or Present Perfect Continuous, never Past Simple.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 55 }],
        ],
      },
      {
        word: 'this week / this month / this year',
        meaning: 'Refers to the current unfinished period, so the time still connects to NOW.',
        exampleSentence: 'I have had three meetings this week.',
        verbPhrase: 'have had',
        commonExamples: [
          { sentence: 'I have had three meetings this week.', verbPhrase: 'have had' },
          { sentence: 'She has traveled a lot this year.', verbPhrase: 'has traveled' },
          { sentence: 'We have made good progress this month.', verbPhrase: 'have made' },
        ],
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 55 }],
        notes: 'These periods are not finished yet, so they usually take Present Perfect, not Past Simple. Exception: if the period is already finished ("this morning" when it is now afternoon), use Past Simple: "I had coffee this morning." The period must still be open for Present Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 55 }],
        ],
      },
      {
        word: 'so far',
        meaning: 'Shows the result up to this point without naming a finished time.',
        exampleSentence: 'We have raised $500 so far.',
        verbPhrase: 'have raised',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        notes: '"So far" means up to now, so the result stays connected to the present and fits Present Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 35 }],
        ],
      },
      {
        word: 'up to now',
        meaning: 'Shows the situation from earlier time until this moment, with the result still relevant now.',
        exampleSentence: 'Up to now, I have enjoyed the course.',
        verbPhrase: 'have enjoyed',
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        notes: '"Up to now" works like "so far" but sounds a little more formal. It still points to Present Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 50 }],
        ],
      },
    ],
  },

  {
    id: 'duration',
    label: 'Duration Markers',
    shortLabel: 'Duration',
    description: 'Show how long something has been happening — from a start point to NOW.',
    color: 'purple',
    tone: 'text-[#7d3fa6] dark:text-[#d8a8f0]',
    iconBg: 'bg-[#f5f0fa] dark:bg-[#7d3fa6]/18',
    activeBg: 'bg-[#7d3fa6]',
    border: 'border-[#7d3fa6]/20 dark:border-[#d8a8f0]/30',
    expressions: [
      {
        word: 'for',
        meaning: 'Shows how long — from a past point up to now. Pairs with Present Perfect for the result, or Present Perfect Continuous to emphasize the activity is still in progress.',
        exampleSentence: 'I have lived here for three years.',
        verbPhrase: 'have lived',
        commonExamples: [
          { sentence: 'I have lived here for three years.', verbPhrase: 'have lived' },
          { sentence: 'They have known each other for a long time.', verbPhrase: 'have known' },
          { sentence: 'She has been studying for two hours.', verbPhrase: 'has been studying' },
          { sentence: 'I have been waiting for a long time.', verbPhrase: 'have been waiting' },
        ],
        timelineElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
        notes: '"For" answers "How long?" — use it with a measurement: for 2 days, for a month. With Present Perfect: "I have lived here for three years" (result). With Present Perfect Continuous: "She has been studying for two hours" (activity still in progress).',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 30 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 35 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 35 }],
        ],
      },
      {
        word: 'since',
        meaning: 'Shows the starting point of something that continues to NOW.',
        exampleSentence: 'He has worked here since 2018.',
        verbPhrase: 'has worked',
        commonExamples: [
          { sentence: 'He has worked here since 2018.', verbPhrase: 'has worked' },
          { sentence: 'I have lived in Boston since June.', verbPhrase: 'have lived' },
          { sentence: 'She has felt better since Monday.', verbPhrase: 'has felt' },
        ],
        timelineElements: [{ id: 'e1', type: 'arc', zone: 'past', position: 30 }],
        notes: '"Since" answers "Since when?" — use it with a point in time: since Monday, since 2020.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 30 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 30 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
        ],
      },
      {
        word: 'for a while',
        meaning: 'An unspecified period of time — longer than a moment, shorter than forever. The activity has been ongoing.',
        exampleSentence: 'I have been waiting here for a while.',
        verbPhrase: 'have been waiting',
        timelineElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 35 }],
        notes: '"For a while" is vague — no exact measurement. It still signals duration reaching NOW, so Perfect Continuous fits naturally.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 35 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 35 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'all day / all morning / all week',
        meaning: 'Shows an activity filling the whole period up to now, with duration still connected to the present.',
        exampleSentence: 'She has been working all morning.',
        verbPhrase: 'has been working',
        timelineElements: [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 25 }],
        notes: 'These phrases stress the full stretch of time up to NOW, so Present Perfect Continuous is the natural match.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 25 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 25 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        ],
      },
    ],
  },

  {
    id: 'sequence',
    label: 'Sequence Markers',
    shortLabel: 'Sequence',
    description: 'Show the ORDER of two events — which happened first, which happened after.',
    color: 'teal',
    tone: 'text-[#268a82] dark:text-[#79d8cf]',
    iconBg: 'bg-[#edf5f4] dark:bg-[#268a82]/18',
    activeBg: 'bg-[#268a82]',
    border: 'border-[#268a82]/20 dark:border-[#79d8cf]/30',
    expressions: [
      {
        word: 'before',
        meaning: 'The first event happened earlier — then the second event came after.',
        exampleSentence: 'She had eaten before he arrived.',
        verbPhrase: 'had eaten',
        timelineElements: [
          { id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 },
          { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
        ],
        notes: 'Use Past Perfect for the FIRST event (the one that happened before).',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 30 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'after',
        meaning: 'The second event happened later — something else came first.',
        exampleSentence: 'After he had finished work, he called me.',
        verbPhrase: 'had finished',
        timelineElements: [
          { id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 },
          { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
        ],
        notes: 'The clause with "after" describes the earlier event — often Past Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 30 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'future', position: 60 }],
        ],
      },
      {
        word: 'by the time',
        meaning: 'One action will be complete before another future moment arrives.',
        exampleSentence: 'I will have finished by the time you arrive.',
        verbPhrase: 'will have finished',
        commonExamples: [
          { sentence: 'I will have finished by the time you arrive.', verbPhrase: 'will have finished' },
          { sentence: 'By the time they get here, we will have eaten.', verbPhrase: 'will have eaten' },
          { sentence: 'She will have left by the time the meeting starts.', verbPhrase: 'will have left' },
        ],
        timelineElements: [
          { id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 },
          { id: 'e2', type: 'single-dot', zone: 'future', position: 75 },
        ],
        notes: '"By the time" triggers Future Perfect — the action completes BEFORE the future reference point.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 60 }],
        ],
      },
      {
        word: 'as soon as',
        meaning: 'The second event happens immediately after the first — no gap.',
        exampleSentence: 'As soon as she arrives, we will start.',
        verbPhrase: 'arrives',
        timelineElements: [
          { id: 'e1', type: 'single-dot', zone: 'future', position: 40 },
          { id: 'e2', type: 'single-dot', zone: 'future', position: 65 },
        ],
        notes: 'Use Present Simple after "as soon as" — not Future Simple — even when talking about the future.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 }],
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }, { id: 'e2', type: 'single-dot', zone: 'future', position: 75 }],
        ],
      },
      {
        word: 'once',
        meaning: 'Introduces the point after an earlier action has been completed.',
        exampleSentence: 'Once she had finished dinner, she went out.',
        verbPhrase: 'had finished',
        timelineElements: [
          { id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 },
          { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 },
        ],
        notes: '"Once" here means "after / when something is done" — not "one time." Example: "Once she finished, she left." This is a different use from "I go to the gym once a week."',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'until / till',
        meaning: 'Shows an activity continuing up to a specific stopping point in the past.',
        exampleSentence: 'We waited until the bus arrived.',
        verbPhrase: 'waited',
        timelineElements: [
          { id: 'e1', type: 'solid-line', zone: 'past', position: 35 },
          { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
        ],
        notes: '"Until / till" marks the endpoint: the activity continues, then stops at that named past moment.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 35 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        ],
      },
    ],
  },

  {
    id: 'interruption',
    label: 'Interruption Markers',
    shortLabel: 'Interruption',
    description: 'Show a background action that was happening when something else cut in.',
    color: 'amber',
    tone: 'text-[#b56e1a] dark:text-[#f0be76]',
    iconBg: 'bg-[#f5f0e8] dark:bg-[#b56e1a]/18',
    activeBg: 'bg-[#b56e1a]',
    border: 'border-[#b56e1a]/20 dark:border-[#f0be76]/30',
    expressions: [
      {
        word: 'when',
        meaning: 'Introduces the interrupting moment — the short event that broke the longer action.',
        exampleSentence: 'I was cooking when the phone rang.',
        verbPhrase: 'was cooking',
        commonExamples: [
          { sentence: 'I was cooking when the phone rang.', verbPhrase: 'was cooking' },
          { sentence: 'They were walking home when it started to rain.', verbPhrase: 'were walking' },
          { sentence: 'She was sleeping when the alarm went off.', verbPhrase: 'was sleeping' },
        ],
        timelineElements: [
          { id: 'e1', type: 'solid-line', zone: 'past', position: 30 },
          { id: 'e2', type: 'single-dot', zone: 'past', position: 70 },
        ],
        notes: '"When" + Past Simple = the interruption. "Was/were + -ing" = the background action. Note: "when" has other uses too — "When I arrived, she left" uses two Past Simples in order, not an interruption. This group focuses only on the interruption pattern.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 30 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 40 }, { id: 'e2', type: 'solid-line', zone: 'past', position: 60 }],
        ],
      },
      {
        word: 'while',
        meaning: 'Shows two things happening at the same time — two parallel ongoing actions.',
        exampleSentence: 'While I was studying, they were playing games.',
        verbPhrase: 'was studying',
        timelineElements: [
          { id: 'e1', type: 'solid-line', zone: 'past', position: 35 },
          { id: 'e2', type: 'solid-line', zone: 'past', position: 60 },
        ],
        notes: '"While" = two actions running side by side. Both verbs use Past Continuous.',
        quizDistractors: [
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 30 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 35 }, { id: 'e2', type: 'single-dot', zone: 'past', position: 60 }],
          [{ id: 'e1', type: 'arc', zone: 'past-earlier', position: 40 }, { id: 'e2', type: 'single-dot', zone: 'past-later', position: 70 }],
        ],
      },
    ],
  },

  {
    id: 'frequency',
    label: 'Frequency Markers',
    shortLabel: 'Frequency',
    description: 'Show repeated habits and routines, usually in the present but sometimes in other time frames when the context is clear.',
    color: 'indigo',
    tone: 'text-[#4338ca] dark:text-[#9ea8ff]',
    iconBg: 'bg-[#eef2ff] dark:bg-[#4338ca]/18',
    activeBg: 'bg-[#4338ca]',
    border: 'border-[#4338ca]/20 dark:border-[#9ea8ff]/30',
    expressions: [
      {
        word: 'always',
        meaning: 'The habit happens every time or nearly every time.',
        exampleSentence: 'She always drinks coffee before class.',
        verbPhrase: 'drinks',
        commonExamples: [
          { sentence: 'She always drinks coffee before class.', verbPhrase: 'drinks' },
          { sentence: 'He always checks his email in the morning.', verbPhrase: 'checks' },
          { sentence: 'We always eat dinner together on Fridays.', verbPhrase: 'eat' },
        ],
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: '"Always" often marks a Present Simple routine, but frequency words are not limited to one tense. Context can shift them into past or perfect forms too: "While I was living in Japan, I always tried something new on Fridays."',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 60 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'usually',
        meaning: 'The habit happens most of the time, but not 100 percent.',
        exampleSentence: 'I usually walk to school.',
        verbPhrase: 'walk',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: '"Usually" commonly fits Present Simple for normal patterns, but it can also appear with past patterns when the sentence clearly refers to an earlier period.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 35 }],
        ],
      },
      {
        word: 'often',
        meaning: 'The action happens many times as part of a repeated routine.',
        exampleSentence: 'They often visit their grandparents on Sundays.',
        verbPhrase: 'visit',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: '"Often" shows repetition. In this timeline set it usually points to a present habit, but a fuller sentence can place it in the past too: "I often tried sushi while I was living in Japan."',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 40 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 45 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'sometimes',
        meaning: 'The habit happens on some occasions, but not regularly every time.',
        exampleSentence: 'He sometimes cooks dinner for the family.',
        verbPhrase: 'cooks',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: '"Sometimes" still describes repetition, but the time frame depends on the rest of the sentence, not on "sometimes" alone.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 45 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 30 }],
        ],
      },
      {
        word: 'rarely / hardly ever',
        meaning: 'The habit happens only a small number of times.',
        exampleSentence: 'We rarely eat out during the week.',
        verbPhrase: 'eat out',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: 'These still show repeated habit dots, but the meaning is very low frequency. Compare with "never" in Completion, which means zero experience.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'every day / every week',
        meaning: 'The action repeats on a regular schedule as a habit.',
        exampleSentence: 'He studies English every day.',
        verbPhrase: 'studies',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        notes: '"Every day / every week" marks routine repetition, so Present Simple is the default choice, but longer contexts can support other tenses: "She has been calling her mother every day this week."',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 30 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 40 }],
        ],
      },
    ],
  },

  {
    id: 'past-habits',
    label: 'Past Habits',
    shortLabel: 'Past Habits',
    description: 'Show repeated actions or states that were true before, but are not true now.',
    color: 'rose',
    tone: 'text-[#a54f67] dark:text-[#f2a6b7]',
    iconBg: 'bg-[#fff1f4] dark:bg-[#a54f67]/18',
    activeBg: 'bg-[#a54f67]',
    border: 'border-[#a54f67]/20 dark:border-[#f2a6b7]/30',
    expressions: [
      {
        word: 'used to',
        meaning: 'Shows a past habit or state that was true before, but is not true now.',
        exampleSentence: 'I used to play football every weekend.',
        verbPhrase: 'used to play',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'past', position: 50 }],
        notes: '"Used to" contrasts the past with the present: the habit or state has stopped. Compare: "I used to play football" (not true now) vs. "I play football" (still true now).',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'would',
        meaning: 'Shows a repeated past habit, especially in storytelling or description.',
        exampleSentence: 'He would walk to work every day before he got a car.',
        verbPhrase: 'would walk',
        timelineElements: [{ id: 'e1', type: 'multiple-dots', zone: 'past', position: 50 }],
        notes: '"Would" for past habits works with repeated actions, not states: "He would walk to work" is fine, but not "I would know her well." It often appears in stories about the past.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
        ],
      },
    ],
  },

  {
    id: 'ongoing-action',
    label: 'Ongoing Action Markers',
    shortLabel: 'Ongoing',
    description: 'Show something happening now or during the current period.',
    color: 'sky',
    tone: 'text-[#0f8ea8] dark:text-[#78d9ec]',
    iconBg: 'bg-[#edfafe] dark:bg-[#0f8ea8]/18',
    activeBg: 'bg-[#0f8ea8]',
    border: 'border-[#0f8ea8]/20 dark:border-[#78d9ec]/30',
    expressions: [
      {
        word: 'at the moment',
        meaning: 'Shows an action happening right now, at this exact time.',
        exampleSentence: 'I am studying at the moment.',
        verbPhrase: 'am studying',
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        notes: 'This points to a temporary action happening now. Contrast with a habit: "I study every morning" describes routine, not the current moment.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 35 }],
        ],
      },
      {
        word: 'right now',
        meaning: 'Shows an action happening immediately now.',
        exampleSentence: 'She is working right now.',
        verbPhrase: 'is working',
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        notes: '"Right now" is very close in meaning to "at the moment," but sounds more informal in everyday speech.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 50 }],
        ],
      },
      {
        word: 'currently',
        meaning: 'Shows something happening now or during the current phase.',
        exampleSentence: 'He is currently looking for a new job.',
        verbPhrase: 'is currently looking',
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        notes: '"Currently" is slightly more formal. It often describes a current project, situation, or phase, not only what is happening this second.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 45 }],
        ],
      },
      {
        word: 'these days / nowadays',
        meaning: 'Shows a current trend, temporary pattern, or modern habit around the present time.',
        exampleSentence: 'People are using apps more and more these days.',
        verbPhrase: 'are using',
        timelineElements: [{ id: 'e1', type: 'solid-line', zone: 'present', position: 50 }],
        notes: 'These phrases often signal a change or trend around the present. They can take Present Continuous for a developing change, or Present Simple for a general modern fact.',
        quizDistractors: [
          [{ id: 'e1', type: 'multiple-dots', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 40 }],
        ],
      },
    ],
  },

  {
    id: 'point-in-time',
    label: 'Point-in-Time Markers',
    shortLabel: 'Point in Time',
    description: 'Pin an action to a specific finished moment in the past.',
    color: 'green',
    tone: 'text-[#3d8e42] dark:text-[#86d78a]',
    iconBg: 'bg-[#eef4ec] dark:bg-[#3d8e42]/18',
    activeBg: 'bg-[#3d8e42]',
    border: 'border-[#3d8e42]/20 dark:border-[#86d78a]/30',
    expressions: [
      {
        word: 'yesterday',
        meaning: 'A specific completed past day — the action is finished and time is named.',
        exampleSentence: 'I called my mother yesterday.',
        verbPhrase: 'called',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 70 }],
        notes: '"Yesterday" is a named time → use Past Simple, NOT Present Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 70 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 70 }],
        ],
      },
      {
        word: 'last week / last year',
        meaning: 'A specific completed past period — finished, named, not connected to now.',
        exampleSentence: 'We moved apartments last month.',
        verbPhrase: 'moved',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 55 }],
        notes: '"Last ___" always signals Past Simple. Never say "I have moved last month."',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 55 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'ago',
        meaning: 'Counts backwards from NOW to a specific moment — that moment is finished.',
        exampleSentence: 'She graduated two years ago.',
        verbPhrase: 'graduated',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 40 }],
        notes: '"Two years ago" = a specific point in the past → Past Simple only.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 40 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 40 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'in [year]',
        meaning: 'A specific past year — the action was completed in that year.',
        exampleSentence: 'I started this job in 2021.',
        verbPhrase: 'started',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 45 }],
        notes: '"In 2021" and "in March" both name a finished past time, so use Past Simple, not Present Perfect.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 45 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 45 }],
        ],
      },
      {
        word: 'at [time]',
        meaning: 'Pins the action to a specific clock time in the past.',
        exampleSentence: 'The meeting started at 9:00.',
        verbPhrase: 'started',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 65 }],
        notes: 'A named clock time is a finished past point, so Past Simple is the normal tense.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 65 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 65 }],
        ],
      },
      {
        word: 'on [day / date]',
        meaning: 'Pins the action to a named past day or date.',
        exampleSentence: 'We met on Tuesday.',
        verbPhrase: 'met',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'past', position: 60 }],
        notes: 'A specific day or date is a finished time reference, so Past Simple is the correct match.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc', zone: 'past', position: 60 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-to-now', zone: 'past', position: 35 }],
        ],
      },
    ],
  },

  {
    id: 'future-reference',
    label: 'Future Markers',
    shortLabel: 'Future',
    description: 'Anchor an action to a future moment or deadline.',
    color: 'blue',
    tone: 'text-[#2563eb] dark:text-[#7cb2ff]',
    iconBg: 'bg-[#eff6ff] dark:bg-[#2563eb]/18',
    activeBg: 'bg-[#2563eb]',
    border: 'border-[#2563eb]/20 dark:border-[#7cb2ff]/30',
    expressions: [
      {
        word: 'tomorrow',
        meaning: 'A specific future day — one event planned or expected ahead.',
        exampleSentence: 'I will call you tomorrow.',
        verbPhrase: 'will call',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 30 }],
        notes: '"Tomorrow" is a named future moment → use Future Simple or Present Continuous (plan).',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 30 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
        ],
      },
      {
        word: 'next week / next year',
        meaning: 'A future period or time reference — an event planned or predicted ahead.',
        exampleSentence: 'She is visiting her family next month.',
        verbPhrase: 'is visiting',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 45 }],
        notes: 'Present Continuous here = a fixed, arranged plan in the future (same as "going to").',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 45 }],
        ],
      },
      {
        word: 'by [deadline]',
        meaning: 'An action will be complete before a future point — sets a deadline.',
        exampleSentence: 'I will have finished the report by Friday.',
        verbPhrase: 'will have finished',
        timelineElements: [
          { id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 },
          { id: 'e2', type: 'single-dot', zone: 'future', position: 70 },
        ],
        notes: '"By Friday" triggers Future Perfect — the completion happens BEFORE the deadline.',
        quizDistractors: [
          [{ id: 'e1', type: 'single-dot', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 55 }],
          [{ id: 'e1', type: 'arc', zone: 'past', position: 50 }],
        ],
      },
      {
        word: 'soon / later',
        meaning: 'An unspecified future time — no exact point, just ahead of NOW.',
        exampleSentence: 'He will call you soon.',
        verbPhrase: 'will call',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 35 }],
        notes: '"Soon" and "later" are vague — they don\'t require a specific tense but typically pair with Future Simple.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 35 }],
        ],
      },
      {
        word: 'in [X] days / in two weeks',
        meaning: 'Counts forward from NOW to a later future point.',
        exampleSentence: 'I will see you in two weeks.',
        verbPhrase: 'will see',
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 40 }],
        notes: 'This is a countdown from now to a future point. It usually takes Future Simple, unlike "by," which sets a completion deadline.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }, { id: 'e2', type: 'single-dot', zone: 'future', position: 70 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 40 }],
        ],
      },
      {
        word: 'going to',
        meaning: 'Shows a plan or intention already decided before NOW — the speaker has committed to it.',
        exampleSentence: 'I am going to study tonight.',
        verbPhrase: 'am going to study',
        commonExamples: [
          { sentence: 'I am going to study tonight.', verbPhrase: 'am going to study' },
          { sentence: 'She is going to visit her parents next week.', verbPhrase: 'is going to visit' },
          { sentence: 'We are going to move to a new apartment.', verbPhrase: 'are going to move' },
        ],
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 35 }],
        notes: '"Going to" shows a plan already decided. Contrast with "will," which often shows a decision made at the moment of speaking: "It\'s cold — I\'ll close the window."',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 55 }, { id: 'e2', type: 'single-dot', zone: 'future', position: 75 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'future', position: 35 }],
        ],
      },
      {
        word: 'tonight / this evening',
        meaning: 'Names a near-future time later today.',
        exampleSentence: 'We are meeting tonight.',
        verbPhrase: 'are meeting',
        commonExamples: [
          { sentence: 'We are meeting tonight.', verbPhrase: 'are meeting' },
          { sentence: 'I will call you this evening.', verbPhrase: 'will call' },
          { sentence: 'They are coming over tonight.', verbPhrase: 'are coming' },
        ],
        timelineElements: [{ id: 'e1', type: 'single-dot', zone: 'future', position: 25 }],
        notes: 'These are named near-future moments, so Future Simple or Present Continuous for arrangements both work naturally.',
        quizDistractors: [
          [{ id: 'e1', type: 'arc-dashed', zone: 'future', position: 60 }],
          [{ id: 'e1', type: 'multiple-dots', zone: 'present', position: 50 }],
          [{ id: 'e1', type: 'solid-line', zone: 'past', position: 25 }],
        ],
      },
    ],
  },
];

const TIME_SIGNAL_PRODUCTION_BY_GROUP: Record<string, ProductionExercise[]> = {
  frequency: [
    {
      id: 'frequency-1',
      sentence: 'She always ______ coffee before class.',
      verbBase: 'drink',
      timeSignal: 'always',
      options: [
        { conjugated: 'drinks', tenseName: 'Present Simple', isCorrect: true },
        { conjugated: 'is drinking', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'has drunk', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'drank', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"Always" signals a repeated present habit, so Present Simple is the best choice.',
    },
    {
      id: 'frequency-2',
      sentence: 'While I was living in Japan, I often ______ sushi after work.',
      verbBase: 'try',
      timeSignal: 'often',
      options: [
        { conjugated: 'tried', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'try', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'was trying', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'have tried', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Often" shows repetition, but the past context "while I was living in Japan" makes Past Simple the best choice here.',
    },
    {
      id: 'frequency-3',
      sentence: 'He sometimes ______ dinner for the family when his partner works late.',
      verbBase: 'cook',
      timeSignal: 'sometimes',
      options: [
        { conjugated: 'cooks', tenseName: 'Present Simple', isCorrect: true },
        { conjugated: 'is cooking', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'cooked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'has cooked', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Sometimes" still describes a repeated present habit, even if it is not frequent.',
    },
    {
      id: 'frequency-4',
      sentence: 'During my first winter in Boston, we rarely ______ out after 9 PM.',
      verbBase: 'go',
      timeSignal: 'rarely',
      options: [
        { conjugated: 'went', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'go', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'were going', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'have gone', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Rarely" marks frequency, but "during my first winter in Boston" places the whole sentence in the past, so Past Simple fits best.',
    },
    {
      id: 'frequency-5',
      sentence: 'She ______ her mother every day this week.',
      verbBase: 'call',
      timeSignal: 'every day',
      options: [
        { conjugated: 'has called', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'calls', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'called', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'is calling', tenseName: 'Present Continuous', isCorrect: false },
      ],
      explanation: '"Every day" shows repetition, but "this week" is an unfinished period connected to now, so Present Perfect is the best match.',
    },
  ],
  'past-habits': [
    {
      id: 'past-habits-1',
      sentence: 'When I was young, I ______ football every weekend.',
      verbBase: 'play',
      timeSignal: 'When I was young',
      options: [
        { conjugated: 'used to play', tenseName: 'Used To', isCorrect: true },
        { conjugated: 'was playing', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'play', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'had played', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'A repeated habit in the past that is no longer true is a classic use of "used to."',
    },
    {
      id: 'past-habits-2',
      sentence: 'Before he got a car, he ______ to work every day.',
      verbBase: 'walk',
      timeSignal: 'every day',
      options: [
        { conjugated: 'would walk', tenseName: 'Would (habitual)', isCorrect: true },
        { conjugated: 'walks', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'was walking', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'has walked', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Would" can describe repeated past actions in stories or descriptions of the past.',
    },
    {
      id: 'past-habits-3',
      sentence: 'We ______ in a small apartment, but now we own a house.',
      verbBase: 'live',
      timeSignal: 'but now',
      options: [
        { conjugated: 'used to live', tenseName: 'Used To', isCorrect: true },
        { conjugated: 'live', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'were living', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'had lived', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'The contrast with "now" shows the earlier state is no longer true, so "used to" works best.',
    },
    {
      id: 'past-habits-4',
      sentence: 'Every summer, my grandfather ______ us stories after dinner.',
      verbBase: 'tell',
      timeSignal: 'Every summer',
      options: [
        { conjugated: 'would tell', tenseName: 'Would (habitual)', isCorrect: true },
        { conjugated: 'tells', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'was telling', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'has told', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Would" is natural here because it describes a repeated past action in a narrative way.',
    },
    {
      id: 'past-habits-5',
      sentence: 'I ______ scared of dogs, but I am not anymore.',
      verbBase: 'be',
      timeSignal: 'but I am not anymore',
      options: [
        { conjugated: 'used to be', tenseName: 'Used To', isCorrect: true },
        { conjugated: 'would be', tenseName: 'Would', isCorrect: false },
        { conjugated: 'am', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'had been', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Used to" can describe past states, but "would" usually cannot.',
    },
  ],
  'point-in-time': [
    {
      id: 'point-1',
      sentence: 'I ______ my mother yesterday.',
      verbBase: 'call',
      timeSignal: 'yesterday',
      options: [
        { conjugated: 'called', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'have called', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'was calling', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'call', tenseName: 'Present Simple', isCorrect: false },
      ],
      explanation: '"Yesterday" is a finished past time, so Past Simple is required.',
    },
    {
      id: 'point-2',
      sentence: 'We ______ apartments last month after the rent went up.',
      verbBase: 'move',
      timeSignal: 'last month',
      options: [
        { conjugated: 'moved', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'have moved', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'were moving', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'move', tenseName: 'Present Simple', isCorrect: false },
      ],
      explanation: '"Last month" names a completed past period, so Past Simple fits.',
    },
    {
      id: 'point-3',
      sentence: 'She ______ two years ago.',
      verbBase: 'graduate',
      timeSignal: 'two years ago',
      options: [
        { conjugated: 'graduated', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'has graduated', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'was graduating', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'graduates', tenseName: 'Present Simple', isCorrect: false },
      ],
      explanation: '"Ago" counts back to a finished past point, so use Past Simple.',
    },
    {
      id: 'point-4',
      sentence: 'The meeting ______ at 9:00.',
      verbBase: 'start',
      timeSignal: 'at 9:00',
      options: [
        { conjugated: 'started', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'has started', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'starts', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'was starting', tenseName: 'Past Continuous', isCorrect: false },
      ],
      explanation: 'A specific clock time in the past calls for Past Simple.',
    },
    {
      id: 'point-5',
      sentence: 'We ______ on Tuesday.',
      verbBase: 'meet',
      timeSignal: 'on Tuesday',
      options: [
        { conjugated: 'met', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'have met', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'meet', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'were meeting', tenseName: 'Past Continuous', isCorrect: false },
      ],
      explanation: 'A named day or date is a finished past reference, so Past Simple is correct.',
    },
  ],
  'ongoing-action': [
    {
      id: 'ongoing-1',
      sentence: 'I ______ at the moment, so I cannot talk.',
      verbBase: 'study',
      timeSignal: 'at the moment',
      options: [
        { conjugated: 'am studying', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'study', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'have studied', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'studied', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"At the moment" shows something happening now, so Present Continuous fits best.',
    },
    {
      id: 'ongoing-2',
      sentence: 'She ______ right now, so she cannot come to the phone.',
      verbBase: 'work',
      timeSignal: 'right now',
      options: [
        { conjugated: 'is working', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'works', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'has worked', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'worked', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"Right now" is an immediate-now marker, so Present Continuous is the natural form.',
    },
    {
      id: 'ongoing-3',
      sentence: 'He ______ for a new job currently.',
      verbBase: 'look',
      timeSignal: 'currently',
      options: [
        { conjugated: 'is looking', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'looks', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'looked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'has looked', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Currently" often describes an ongoing present situation or phase, so Present Continuous works well.',
    },
    {
      id: 'ongoing-4',
      sentence: 'People ______ apps more and more these days.',
      verbBase: 'use',
      timeSignal: 'these days',
      options: [
        { conjugated: 'are using', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'use', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'used', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have used', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"These days" often highlights a changing trend around the present, which fits Present Continuous well.',
    },
    {
      id: 'ongoing-5',
      sentence: 'I ______ on a temporary project nowadays.',
      verbBase: 'work',
      timeSignal: 'nowadays',
      options: [
        { conjugated: 'am working', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'work', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'worked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have worked', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Nowadays" can describe a temporary present pattern or trend, so Present Continuous is a strong choice here.',
    },
  ],
  'future-reference': [
    {
      id: 'future-1',
      sentence: 'She ______ her family next month.',
      verbBase: 'visit',
      timeSignal: 'next month',
      options: [
        { conjugated: 'is visiting', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'visits', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'will have visited', tenseName: 'Future Perfect', isCorrect: false },
        { conjugated: 'visited', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: 'A fixed future arrangement with a named future time often uses Present Continuous.',
    },
    {
      id: 'future-2',
      sentence: 'I ______ you tomorrow.',
      verbBase: 'call',
      timeSignal: 'tomorrow',
      options: [
        { conjugated: 'will call', tenseName: 'Future Simple', isCorrect: true },
        { conjugated: 'call', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'called', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have called', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Tomorrow" points to a future moment, and Future Simple is the clearest default choice here.',
    },
    {
      id: 'future-3',
      sentence: 'I ______ the report by Friday.',
      verbBase: 'finish',
      timeSignal: 'by Friday',
      options: [
        { conjugated: 'will have finished', tenseName: 'Future Perfect', isCorrect: true },
        { conjugated: 'will finish', tenseName: 'Future Simple', isCorrect: false },
        { conjugated: 'am finishing', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'finished', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"By Friday" sets a deadline before a future point, so Future Perfect is best.',
    },
    {
      id: 'future-4',
      sentence: 'He ______ you soon.',
      verbBase: 'call',
      timeSignal: 'soon',
      options: [
        { conjugated: 'will call', tenseName: 'Future Simple', isCorrect: true },
        { conjugated: 'calls', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'is calling', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'called', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"Soon" is a vague future marker, so Future Simple is the usual choice.',
    },
    {
      id: 'future-5',
      sentence: 'We ______ tonight to talk about the lease.',
      verbBase: 'meet',
      timeSignal: 'tonight',
      options: [
        { conjugated: 'are meeting', tenseName: 'Present Continuous', isCorrect: true },
        { conjugated: 'meet', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'met', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have met', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: '"Tonight" often introduces a planned arrangement, so Present Continuous is very natural.',
    },
  ],
  completion: [
    {
      id: 'completion-1',
      sentence: 'I ______ breakfast already.',
      verbBase: 'eat',
      timeSignal: 'already',
      options: [
        { conjugated: 'have already eaten', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'already ate', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'am eating', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had already eaten', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Already" commonly signals Present Perfect because the action is complete before now.',
    },
    {
      id: 'completion-2',
      sentence: 'She ______ the building just.',
      verbBase: 'leave',
      timeSignal: 'just',
      options: [
        { conjugated: 'has just left', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'left', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'is leaving', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had left', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Just" means very recently, so Present Perfect is the intended choice here.',
    },
    {
      id: 'completion-3',
      sentence: 'I ______ my homework yet.',
      verbBase: 'finish',
      timeSignal: 'yet',
      options: [
        { conjugated: "haven't finished", tenseName: 'Present Perfect Negative', isCorrect: true },
        { conjugated: "didn't finish", tenseName: 'Past Simple Negative', isCorrect: false },
        { conjugated: "am not finishing", tenseName: 'Present Continuous Negative', isCorrect: false },
        { conjugated: "hadn't finished", tenseName: 'Past Perfect Negative', isCorrect: false },
      ],
      explanation: '"Yet" in negatives typically goes with Present Perfect: "I haven\'t finished yet."',
    },
    {
      id: 'completion-4',
      sentence: 'Have you ever ______ sushi with sea urchin on top?',
      verbBase: 'try',
      timeSignal: 'ever',
      options: [
        { conjugated: 'tried', tenseName: 'Present Perfect Question', isCorrect: true },
        { conjugated: 'try', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'were trying', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'had tried', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Ever" in life-experience questions usually appears with Present Perfect.',
    },
    {
      id: 'completion-5',
      sentence: 'We ______ $500 so far.',
      verbBase: 'raise',
      timeSignal: 'so far',
      options: [
        { conjugated: 'have raised', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'raised', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'are raising', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had raised', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"So far" means up to now, so the result is still connected to the present.',
    },
  ],
  duration: [
    {
      id: 'duration-1',
      sentence: 'He ______ here since 2018.',
      verbBase: 'work',
      timeSignal: 'since 2018',
      options: [
        { conjugated: 'has worked', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'worked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'is working', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had worked', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Since" gives a starting point that continues to now, so Present Perfect fits.',
    },
    {
      id: 'duration-2',
      sentence: 'She ______ for two hours for tomorrow\'s exam.',
      verbBase: 'study',
      timeSignal: 'for two hours',
      options: [
        { conjugated: 'has been studying', tenseName: 'Present Perfect Continuous', isCorrect: true },
        { conjugated: 'studied', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'is studying', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had studied', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'Here the duration stresses the ongoing activity, so Present Perfect Continuous is best.',
    },
    {
      id: 'duration-3',
      sentence: 'I ______ here for three years.',
      verbBase: 'live',
      timeSignal: 'for three years',
      options: [
        { conjugated: 'have lived', tenseName: 'Present Perfect', isCorrect: true },
        { conjugated: 'lived', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'am living', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had lived', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"For three years" describes a duration up to now, so Present Perfect works naturally.',
    },
    {
      id: 'duration-4',
      sentence: 'They ______ all morning.',
      verbBase: 'wait',
      timeSignal: 'all morning',
      options: [
        { conjugated: 'have been waiting', tenseName: 'Present Perfect Continuous', isCorrect: true },
        { conjugated: 'waited', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'are waiting', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'had waited', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"All morning" emphasizes the stretch of activity up to now, so Present Perfect Continuous fits.',
    },
    {
      id: 'duration-5',
      sentence: 'We ______ for a while.',
      verbBase: 'wait',
      timeSignal: 'for a while',
      options: [
        { conjugated: 'have been waiting', tenseName: 'Present Perfect Continuous', isCorrect: true },
        { conjugated: 'waited', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'wait', tenseName: 'Present Simple', isCorrect: false },
        { conjugated: 'had waited', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"For a while" signals an ongoing duration leading up to now.',
    },
  ],
  interruption: [
    {
      id: 'interruption-1',
      sentence: 'I ______ dinner when the smoke alarm rang.',
      verbBase: 'cook',
      timeSignal: 'when',
      options: [
        { conjugated: 'was cooking', tenseName: 'Past Continuous', isCorrect: true },
        { conjugated: 'cooked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have been cooking', tenseName: 'Present Perfect Continuous', isCorrect: false },
        { conjugated: 'had cooked', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'The long background action takes Past Continuous when a short event interrupts it.',
    },
    {
      id: 'interruption-2',
      sentence: 'They ______ home when it started to rain.',
      verbBase: 'walk',
      timeSignal: 'when',
      options: [
        { conjugated: 'were walking', tenseName: 'Past Continuous', isCorrect: true },
        { conjugated: 'walked', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have walked', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'had walked', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'The ongoing action in progress before the interruption uses Past Continuous.',
    },
    {
      id: 'interruption-3',
      sentence: 'She ______ when the alarm went off.',
      verbBase: 'sleep',
      timeSignal: 'when',
      options: [
        { conjugated: 'was sleeping', tenseName: 'Past Continuous', isCorrect: true },
        { conjugated: 'slept', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'has slept', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'had slept', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"When" introduces the interrupting short event, so the background action takes Past Continuous.',
    },
    {
      id: 'interruption-4',
      sentence: 'While I ______, they were playing games.',
      verbBase: 'study',
      timeSignal: 'While',
      options: [
        { conjugated: 'was studying', tenseName: 'Past Continuous', isCorrect: true },
        { conjugated: 'studied', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have studied', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'had studied', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"While" often links two simultaneous background actions, both in Past Continuous.',
    },
    {
      id: 'interruption-5',
      sentence: 'We ______ dinner when the lights went out.',
      verbBase: 'eat',
      timeSignal: 'when',
      options: [
        { conjugated: 'were eating', tenseName: 'Past Continuous', isCorrect: true },
        { conjugated: 'ate', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'have eaten', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'had eaten', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: 'The background action already in progress takes Past Continuous.',
    },
  ],
  sequence: [
    {
      id: 'sequence-1',
      sentence: 'She ______ before he arrived.',
      verbBase: 'eat',
      timeSignal: 'before',
      options: [
        { conjugated: 'had eaten', tenseName: 'Past Perfect', isCorrect: true },
        { conjugated: 'ate', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'was eating', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'has eaten', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: 'The earlier of two past actions takes Past Perfect.',
    },
    {
      id: 'sequence-2',
      sentence: 'After he ______ work, he called me from the parking lot.',
      verbBase: 'finish',
      timeSignal: 'After',
      options: [
        { conjugated: 'had finished', tenseName: 'Past Perfect', isCorrect: true },
        { conjugated: 'finished', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'was finishing', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'has finished', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: 'The action completed first is marked with Past Perfect.',
    },
    {
      id: 'sequence-3',
      sentence: 'I ______ by the time you arrive.',
      verbBase: 'finish',
      timeSignal: 'by the time',
      options: [
        { conjugated: 'will have finished', tenseName: 'Future Perfect', isCorrect: true },
        { conjugated: 'will finish', tenseName: 'Future Simple', isCorrect: false },
        { conjugated: 'am finishing', tenseName: 'Present Continuous', isCorrect: false },
        { conjugated: 'finished', tenseName: 'Past Simple', isCorrect: false },
      ],
      explanation: '"By the time" here sets a future reference point, so Future Perfect is the target form.',
    },
    {
      id: 'sequence-4',
      sentence: 'Once she ______ dinner, she went out.',
      verbBase: 'finish',
      timeSignal: 'Once',
      options: [
        { conjugated: 'had finished', tenseName: 'Past Perfect', isCorrect: true },
        { conjugated: 'finished', tenseName: 'Past Simple', isCorrect: false },
        { conjugated: 'was finishing', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'has finished', tenseName: 'Present Perfect', isCorrect: false },
      ],
      explanation: 'This "once" means "after / when finished," so the earlier past action takes Past Perfect.',
    },
    {
      id: 'sequence-5',
      sentence: 'We ______ until the bus arrived.',
      verbBase: 'wait',
      timeSignal: 'until',
      options: [
        { conjugated: 'waited', tenseName: 'Past Simple', isCorrect: true },
        { conjugated: 'were waiting', tenseName: 'Past Continuous', isCorrect: false },
        { conjugated: 'have waited', tenseName: 'Present Perfect', isCorrect: false },
        { conjugated: 'had waited', tenseName: 'Past Perfect', isCorrect: false },
      ],
      explanation: '"Until" here shows an activity continuing up to a past endpoint, which fits Past Simple.',
    },
  ],
};

const TIME_SIGNAL_GROUP_ORDER = [
  'frequency',
  'past-habits',
  'point-in-time',
  'ongoing-action',
  'future-reference',
  'completion',
  'duration',
  'interruption',
  'sequence',
] as const;

const TIME_SIGNAL_GROUP_ORDER_INDEX = new Map<string, number>(
  TIME_SIGNAL_GROUP_ORDER.map((id, index) => [id, index])
);

export const TIME_SIGNAL_GROUPS: TimeSignalGroup[] = TIME_SIGNAL_GROUPS_RAW
  .map((group) => ({
    ...group,
    productionExercises: TIME_SIGNAL_PRODUCTION_BY_GROUP[group.id] ?? group.productionExercises,
  }))
  .sort((a, b) => {
    const aIndex = TIME_SIGNAL_GROUP_ORDER_INDEX.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = TIME_SIGNAL_GROUP_ORDER_INDEX.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });

export function getTimeSignalGroupById(id: string): TimeSignalGroup | undefined {
  return TIME_SIGNAL_GROUPS.find((g) => g.id === id);
}

/** Flatten all expressions across all groups for quiz pool building. */
export function getAllTimeSignalEntries(): Array<TimeSignalEntry & { groupId: string }> {
  return TIME_SIGNAL_GROUPS.flatMap((group) =>
    group.expressions.map((entry) => ({ ...entry, groupId: group.id }))
  );
}

export function getAllTimeSignalProductionExercises(): ProductionExercise[] {
  return TIME_SIGNAL_GROUPS.flatMap((group) => group.productionExercises ?? []);
}
