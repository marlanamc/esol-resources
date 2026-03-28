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
  {
    id: "ctx-11",
    type: "context-tense-picker",
    scenario:
      "Listen! Someone ___ (knock) on the classroom door right now.",
    blankVerb: "knock",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "knocks",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-11-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is knocking",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-11-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has knocked",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-11-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Listen!", "right now"],
    explanation:
      'The speaker notices the sound at this moment. "Listen!" and "right now" point to an action happening now, so Present Continuous is correct.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-12",
    type: "context-tense-picker",
    scenario:
      "We ___ (not finish) dinner yet, so please wait a few more minutes.",
    blankVerb: "finish",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did not finish",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-12-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have not finished",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-12-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are not finishing",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-12-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["yet", "please wait"],
    explanation:
      '"Yet" commonly appears with Present Perfect in unfinished situations connected to now. The dinner is still not finished at this present moment.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-13",
    type: "context-tense-picker",
    scenario:
      "At 8 o'clock last night, my parents ___ (drive) home from the airport.",
    blankVerb: "drive",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "drove",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-13-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "were driving",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-13-b"),
        isCorrect: true,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had driven",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-13-c", [
          { position: 35 },
          { position: 50 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["At 8 o'clock last night"],
    explanation:
      "A specific moment in the past often calls for Past Continuous when the action was in progress at that time. The driving was happening at 8 o'clock.",
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-14",
    type: "context-tense-picker",
    scenario:
      "By the time the teacher checked the homework, several students ___ (already leave) the room.",
    blankVerb: "leave",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "already left",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-14-a", [
          { position: 45 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had already left",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-14-b", [
          { position: 35 },
          { position: 55 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Past Perfect Continuous",
        conjugatedVerb: "had been leaving",
        elements: buildCanonicalTimelineElements(
          "pastPerfectContinuous",
          "ctx-14-c",
          [{ position: 50 }, { position: 35 }]
        ),
        isCorrect: false,
      },
    ],
    contextClues: ["By the time", "already"],
    explanation:
      'The leaving happened before the teacher checked. Past Perfect is the cleanest way to show that earlier completed past action.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-15",
    type: "context-tense-picker",
    scenario:
      "This time next week, I ___ (sit) on the beach instead of answering emails.",
    blankVerb: "sit",
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will sit",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-15-a", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be sitting",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-15-b", [
          { position: 60 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Future Perfect",
        conjugatedVerb: "will have sat",
        elements: buildCanonicalTimelineElements("futurePerfect", "ctx-15-c", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["This time next week"],
    explanation:
      'The sentence imagines a future moment and describes what will be in progress then. That is the classic use of Future Continuous.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-16",
    type: "context-tense-picker",
    scenario:
      "Every evening after dinner, my grandfather ___ (watch) the local news.",
    blankVerb: "watch",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "watches",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-16-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is watching",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-16-b"),
        isCorrect: false,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "watched",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-16-c", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["Every evening"],
    explanation:
      '"Every evening" signals a repeated routine. Present Simple is the standard tense for regular habits and schedules.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-17",
    type: "context-tense-picker",
    scenario:
      "Yesterday after lunch, I ___ (drop) my keys under the bus seat.",
    blankVerb: "drop",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "dropped",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-17-a", [
          { position: 50 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was dropping",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-17-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have dropped",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-17-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Yesterday after lunch"],
    explanation:
      'A finished past time marker like "yesterday after lunch" calls for Past Simple. The dropping happened once at a closed moment in the past.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-18",
    type: "context-tense-picker",
    scenario:
      "I think the doctor ___ (call) with the test results later this afternoon.",
    blankVerb: "call",
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will call",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-18-a", [
          { position: 60 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be calling",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-18-b", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Future Perfect",
        conjugatedVerb: "will have called",
        elements: buildCanonicalTimelineElements("futurePerfect", "ctx-18-c", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["I think", "later this afternoon"],
    explanation:
      'The speaker is making a straightforward prediction about a future event. Future Simple is the most natural choice for that kind of prediction.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-19",
    type: "context-tense-picker",
    scenario:
      "Right now, the mechanic ___ (check) the brakes on our car in the garage.",
    blankVerb: "check",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "checks",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-19-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is checking",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-19-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has checked",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-19-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Right now"],
    explanation:
      '"Right now" signals an action in progress. The mechanic is in the middle of the inspection, so Present Continuous is the best choice.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-20",
    type: "context-tense-picker",
    scenario:
      "We can serve dinner now because Mom ___ (set) the table already.",
    blankVerb: "set",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "set",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-20-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has set",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-20-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been setting",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-20-c",
          [{ position: 50 }]
        ),
        isCorrect: false,
      },
    ],
    contextClues: ["now", "already"],
    explanation:
      'The result matters in the present because dinner can happen now. Present Perfect fits a completed action with a current result.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-21",
    type: "context-tense-picker",
    scenario:
      "By the time our flight lands tonight, the hotel shuttle ___ (arrive) at the airport.",
    blankVerb: "arrive",
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will arrive",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-21-a", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Future Perfect",
        conjugatedVerb: "will have arrived",
        elements: buildCanonicalTimelineElements("futurePerfect", "ctx-21-b", [
          { position: 65 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be arriving",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-21-c", [
          { position: 65 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["By the time", "tonight"],
    explanation:
      'The shuttle must be there before a later future event, the flight landing. Future Perfect shows that earlier completion clearly.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-22",
    type: "context-tense-picker",
    scenario:
      "Why ___ you ___ (wait) outside the clinic right now instead of going in?",
    blankVerb: "wait",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "do / wait",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-22-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are / waiting",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-22-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have / waited",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-22-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Why", "right now"],
    explanation:
      'The speaker is asking about an action happening at this moment. Present Continuous is used for actions in progress, including question forms.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-23",
    type: "context-tense-picker",
    scenario:
      "The social worker ___ (not call) us back yet, so we still do not know the appointment time.",
    blankVerb: "call",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did not call",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-23-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has not called",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-23-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is not calling",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-23-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["yet", "still do not know"],
    explanation:
      'The expected call has not happened up to now, and the result still matters. Negative Present Perfect is the natural choice with "yet".',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-24",
    type: "context-tense-picker",
    scenario:
      "Why ___ you ___ (cry) right now?",
    blankVerb: "cry",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "do / cry",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-24-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are / crying",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-24-b"),
        isCorrect: true,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did / cry",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-24-c", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["Why", "right now"],
    explanation:
      'This is a question about something happening at this moment, so Present Continuous is the correct form.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-25",
    type: "context-tense-picker",
    scenario:
      "I ___ (not know) the answer yet.",
    blankVerb: "know",
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "do not know",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-25-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have not known",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-25-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Simple (stative)",
        conjugatedVerb: "do not know",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-25-c"),
        isCorrect: true,
      },
    ],
    contextClues: ["yet"],
    explanation:
      'With a stative verb like "know," English usually uses Present Simple, even in a negative sentence.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-26",
    type: "context-tense-picker",
    scenario:
      "Did they ___ (eat) breakfast this morning?",
    blankVerb: "eat",
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "eat",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-26-a", [
          { position: 50 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have eaten",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-26-b"),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "were eating",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-26-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Did", "this morning"],
    explanation:
      'This is a simple past question with a finished time. After "did," use the base verb form: "eat."',
    difficulty: 1,
    tenseCategory: "simple",
  },
];
