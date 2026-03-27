import type { ContextTenseQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Context-Based Tense Picker questions for the "In Context" challenge mode.
 *
 * Students read a scenario with a blank and choose the tense that fits.
 * contextClues lists the words/phrases in the scenario that signal the answer.
 */
export const TIMELINE_CONTEXT_QUESTIONS: ContextTenseQuestion[] = [
  {
    id: "ctx-01",
    type: "context-tense-picker",
    scenario: "Look at Maria right now! She ___ (work) on her laptop at the café.",
    blankVerb: "work",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "works",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is working",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-01-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has worked",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["right now", "Look at"],
    explanation:
      '"Right now" and "Look at" tell us the action is happening at this exact moment. Present Continuous (is working) is used for actions in progress at the moment of speaking.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-02",
    type: "context-tense-picker",
    scenario:
      "Carlos always ___ (drink) coffee before his morning class. It's his daily routine.",
    blankVerb: "drink",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "drinks",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-02-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is drinking",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-02-b"),
        isCorrect: false,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "drank",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-02-c", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["always", "daily routine"],
    explanation:
      '"Always" and "daily routine" signal a habit. Present Simple is used for habits and regular routines.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-03",
    type: "context-tense-picker",
    scenario:
      "I was in the kitchen when I smelled something burning. The soup ___ (boil) over on the stove.",
    blankVerb: "boil",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "boiled",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-03-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was boiling",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-03-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has boiled",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-03-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["was in", "when I smelled"],
    explanation:
      'The story describes a scene in the past ("was in the kitchen"). The boiling was an ongoing background action when the smelling happened — Past Continuous.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-04",
    type: "context-tense-picker",
    scenario:
      "When Ana arrived at the party, most guests ___ (already leave). The place was nearly empty.",
    blankVerb: "leave",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "left",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-04-a", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "were leaving",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-04-b", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had already left",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-04-c", [
          { position: 40 },
          { position: 50 },
        ]),
        isCorrect: true,
      },
    ],
    contextClues: ["already", "When Ana arrived"],
    explanation:
      '"Already" + "When [past event]" = the leaving happened BEFORE Ana arrived. Past Perfect (had left) shows the earlier of two past events.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-05",
    type: "context-tense-picker",
    scenario:
      "I can't come to the cinema tonight. I ___ (see) that film twice already.",
    blankVerb: "see",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "saw",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-05-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have seen",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-05-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been seeing",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-05-c",
          [{ position: 50 }]
        ),
        isCorrect: false,
      },
    ],
    contextClues: ["already", "twice", "I can't come"],
    explanation:
      '"Twice already" counts past experiences that are relevant now (explaining the decision). Present Perfect is used for life experiences relevant to the present.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-06",
    type: "context-tense-picker",
    scenario:
      "Look how tired she is! She ___ (study) for six hours straight. She needs a break.",
    blankVerb: "study",
    options: [
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has studied",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-06-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been studying",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-06-b",
          [{ position: 50 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was studying",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-06-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["for six hours", "Look how tired she is"],
    explanation:
      '"For six hours" (duration up to now) + visible result (tired) = Present Perfect Continuous. It explains the current state by describing an ongoing activity.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-07",
    type: "context-tense-picker",
    scenario:
      "Don't call Ricardo at 3 p.m. He ___ (have) his English class then.",
    blankVerb: "have",
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will have",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-07-a"),
        isCorrect: false,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be having",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-07-b", [
          { position: 50 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Present Simple",
        conjugatedVerb: "has",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-07-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["at 3 p.m.", "then"],
    explanation:
      '"At 3 p.m." names a specific future moment when the action will be in progress. Future Continuous (will be + -ing) is used for actions in progress at a future point.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-08",
    type: "context-tense-picker",
    scenario:
      "By the end of next month, we ___ (finish) the renovation project.",
    blankVerb: "finish",
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will finish",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-08-a", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be finishing",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-08-b"),
        isCorrect: false,
      },
      {
        tenseName: "Future Perfect",
        conjugatedVerb: "will have finished",
        elements: buildCanonicalTimelineElements("futurePerfect", "ctx-08-c", [
          { position: 65 },
        ]),
        isCorrect: true,
      },
    ],
    contextClues: ["By the end of next month"],
    explanation:
      '"By + future time" signals a deadline before which something will be completed. Future Perfect (will have + p.p.) is used for actions completed before a future point.',
    difficulty: 3,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-09",
    type: "context-tense-picker",
    scenario:
      "The children in the park ___ (play) on the swings since this morning. Their nanny looks exhausted.",
    blankVerb: "play",
    options: [
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "were playing",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-09-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been playing",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-09-b",
          [{ position: 50 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have played",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-09-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["since this morning", "looks exhausted"],
    explanation:
      '"Since this morning" = duration from a past start point to now. Plus the exhaustion is a present result. Present Perfect Continuous fits: started in past, still continuing, causing a present visible effect.',
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-10",
    type: "context-tense-picker",
    scenario:
      "She finally got the promotion she ___ (work) so hard for all year.",
    blankVerb: "work",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "worked",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-10-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect Continuous",
        conjugatedVerb: "had been working",
        elements: buildCanonicalTimelineElements(
          "pastPerfectContinuous",
          "ctx-10-b",
          [{ position: 50 }, { position: 40 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been working",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-10-c",
          [{ position: 50 }]
        ),
        isCorrect: false,
      },
    ],
    contextClues: ["finally got", "so hard for all year"],
    explanation:
      '"Finally got" puts us in the past. The working happened continuously before the promotion — earlier past leading up to a later past event. Past Perfect Continuous (had been working) is correct.',
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  },
];
