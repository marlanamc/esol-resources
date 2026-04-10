import type { ContextTenseQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Context-Based Tense Picker questions for the "In Context" challenge mode.
 *
 * Students read a real-world scenario containing a blank, then choose which
 * conjugated verb (and its tense) fits the context.
 *
 * ─── AUTHORING RULES ───────────────────────────────────────────────────────
 *
 * 1. SIGNAL WORDS IN SCENARIO — every scenario must contain at least one
 *    explicit context clue that points to the correct tense. List those clues
 *    in contextClues so the feedback screen can highlight them.
 *    ✅  "Look at Maria right now! She ___ (work)..."  → clues: ["right now", "Look at"]
 *    ❌  "Maria ___ (work) on her laptop."  (no clue — any tense could fit)
 *
 * 2. EXACTLY ONE isCorrect: true — the options array must have exactly one
 *    correct answer. All other options should be genuinely plausible given the
 *    verb (i.e., grammatically possible tenses for that verb, just wrong here).
 *
 * 3. THREE OPTIONS — always provide exactly 3 options. Pick the two wrong tenses
 *    that students most commonly confuse with the correct one.
 *
 * 4. blankVerb — the base (infinitive) form shown in parentheses in the scenario.
 *    This is displayed as a hint so students know which verb to conjugate.
 *
 * 5. explanation — explain why the correct tense fits AND briefly why the
 *    distractors don't. Name the specific clue word(s).
 *
 * ───────────────────────────────────────────────────────────────────────────
 */
export const TIMELINE_CONTEXT_QUESTIONS: ContextTenseQuestion[] = [
  {
    id: "ctx-01",
    type: "context-tense-picker",
    scenario: "Look at Maria right now! She ___ (work) on her laptop at the café.",
    blankVerb: "work",
    realLifeDialogue: {
      lineA: 'A: "Can Maria talk right now?"',
      lineB: 'B: "Not yet. She is working on her laptop at the café."',
    },
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
      '"Finally got" puts us in the past. The working happened continuously before the promotion — earlier past leading up to a recent past event. Past Perfect Continuous (had been working) is correct.',
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
  // ============================================================
  // NEW EVERYDAY CONTENT - Texting & Phone
  // ============================================================
  {
    id: "ctx-text-01",
    type: "context-tense-picker",
    scenario:
      "Right now, Maria ___ (text) her sister about tonight's dinner plans.",
    blankVerb: "text",
    realLifeDialogue: {
      lineA: 'A: "Is Maria ready to go?"',
      lineB: 'B: "Not yet. She is texting her sister about dinner."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "texts",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-text-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is texting",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-text-01-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has texted",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-text-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Right now"],
    explanation:
      '"Right now" tells us the action is happening at this exact moment. Present Continuous (is texting) is used for actions in progress.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-text-02",
    type: "context-tense-picker",
    scenario:
      "I ___ (not hear) from Carlos yet. Maybe I should call him again.",
    blankVerb: "hear",
    realLifeDialogue: {
      lineA: 'A: "Did Carlos text you back?"',
      lineB: 'B: "No, I haven\'t heard from him yet."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did not hear",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-text-02-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have not heard",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-text-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "am not hearing",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-text-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["yet", "Maybe I should call"],
    explanation:
      '"Yet" in a negative sentence signals Present Perfect. The expected call hasn\'t happened up to now, and the situation is still open.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Food & Restaurants
  // ============================================================
  {
    id: "ctx-food-01",
    type: "context-tense-picker",
    scenario:
      "We ___ (wait) for our table for thirty minutes already. This restaurant is so busy!",
    blankVerb: "wait",
    realLifeDialogue: {
      lineA: 'A: "How long have you been here?"',
      lineB: 'B: "We have been waiting for thirty minutes already!"',
    },
    options: [
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are waiting",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-food-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been waiting",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-food-01-b",
          [{ position: 50 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "were waiting",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-food-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["for thirty minutes", "already"],
    explanation:
      '"For thirty minutes already" shows duration from the past up to now. Present Perfect Continuous describes an ongoing action that started before and continues to the present.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-food-02",
    type: "context-tense-picker",
    scenario:
      "The chef ___ (prepare) our order right now in the kitchen. The food will be out soon.",
    blankVerb: "prepare",
    realLifeDialogue: {
      lineA: 'A: "Where\'s our food?"',
      lineB: 'B: "The chef is preparing it right now."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "prepares",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-food-02-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is preparing",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-food-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has prepared",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-food-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["right now", "will be out soon"],
    explanation:
      '"Right now" signals an action in progress at this moment. Present Continuous is the natural choice.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-food-03",
    type: "context-tense-picker",
    scenario:
      "By the time the dessert came, we ___ (already finish) the main course.",
    blankVerb: "finish",
    realLifeDialogue: {
      lineA: 'A: "Were you still eating when the dessert arrived?"',
      lineB: 'B: "No, we had already finished by then."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "already finished",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-food-03-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had already finished",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-food-03-b", [
          { position: 35 },
          { position: 55 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have already finished",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-food-03-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["By the time", "already"],
    explanation:
      '"By the time the dessert came" establishes a past reference point. The finishing happened before that moment, so Past Perfect is needed.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Grocery Shopping
  // ============================================================
  {
    id: "ctx-shop-01",
    type: "context-tense-picker",
    scenario:
      "Right now, the cashier ___ (scan) the items and putting them in bags.",
    blankVerb: "scan",
    realLifeDialogue: {
      lineA: 'A: "Are you almost done at the store?"',
      lineB: 'B: "Almost! The cashier is scanning my items now."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "scans",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-shop-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is scanning",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-shop-01-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has scanned",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-shop-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Right now", "putting"],
    explanation:
      '"Right now" and the parallel "-ing" form "putting" show actions happening at this moment. Present Continuous fits.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-shop-02",
    type: "context-tense-picker",
    scenario:
      "I ___ (not buy) milk yet, so we need to stop at the store on the way home.",
    blankVerb: "buy",
    realLifeDialogue: {
      lineA: 'A: "Do we have milk at home?"',
      lineB: 'B: "No, I haven\'t bought milk yet."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did not buy",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-shop-02-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have not bought",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-shop-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "am not buying",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-shop-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["yet", "need to stop"],
    explanation:
      '"Yet" in a negative statement typically signals Present Perfect. The shopping hasn\'t happened but is still expected.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Transportation
  // ============================================================
  {
    id: "ctx-transit-01",
    type: "context-tense-picker",
    scenario:
      "At 8 a.m. tomorrow, I ___ (ride) the bus to work like every other day.",
    blankVerb: "ride",
    realLifeDialogue: {
      lineA: 'A: "Can I call you at 8 tomorrow morning?"',
      lineB: 'B: "I\'ll be on the bus then. Call me after 9."',
    },
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will ride",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-transit-01-a", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Future Continuous",
        conjugatedVerb: "will be riding",
        elements: buildCanonicalTimelineElements("futureContinuous", "ctx-transit-01-b", [
          { position: 60 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "am riding",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-transit-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["At 8 a.m. tomorrow"],
    explanation:
      '"At 8 a.m. tomorrow" names a specific future moment when the action will be in progress. Future Continuous is the best fit.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "ctx-transit-02",
    type: "context-tense-picker",
    scenario:
      "The train ___ (just leave), so we need to wait fifteen minutes for the next one.",
    blankVerb: "leave",
    realLifeDialogue: {
      lineA: 'A: "Did we miss the train?"',
      lineB: 'B: "Yeah, it has just left. The next one is in 15 minutes."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "just left",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-transit-02-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has just left",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-transit-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is just leaving",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-transit-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["just", "so we need to wait"],
    explanation:
      '"Just" with a very recent action that affects now is typical Present Perfect usage. The train leaving means we must wait now.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-transit-03",
    type: "context-tense-picker",
    scenario:
      "While I ___ (stand) on the platform, my phone rang with a message from my boss.",
    blankVerb: "stand",
    realLifeDialogue: {
      lineA: 'A: "When did your boss call?"',
      lineB: 'B: "While I was standing on the platform waiting for the train."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "stood",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-transit-03-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was standing",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-transit-03-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have stood",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-transit-03-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["While", "rang"],
    explanation:
      '"While" introduces a background action that was in progress when another action (the phone ringing) interrupted it. Past Continuous is correct.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Weather
  // ============================================================
  {
    id: "ctx-weather-01",
    type: "context-tense-picker",
    scenario:
      "It ___ (rain) since early this morning. The streets are flooded, and traffic is terrible.",
    blankVerb: "rain",
    realLifeDialogue: {
      lineA: 'A: "Why is traffic so bad today?"',
      lineB: 'B: "It has been raining since this morning. Everything is flooded."',
    },
    options: [
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is raining",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-weather-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been raining",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-weather-01-b",
          [{ position: 50 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was raining",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-weather-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["since early this morning", "are flooded"],
    explanation:
      '"Since this morning" shows duration from a past starting point to now. The visible result (flooded streets) confirms Present Perfect Continuous.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-weather-02",
    type: "context-tense-picker",
    scenario:
      "When I left the house this morning, it ___ (snow) heavily. I almost couldn't see the road.",
    blankVerb: "snow",
    realLifeDialogue: {
      lineA: 'A: "How was the drive this morning?"',
      lineB: 'B: "Scary! It was snowing so hard I could barely see."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "snowed",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-weather-02-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was snowing",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-weather-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has snowed",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-weather-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["When I left", "heavily"],
    explanation:
      '"When I left" provides a past moment. The snow was the background action in progress at that time, so Past Continuous is correct.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Work/Job
  // ============================================================
  {
    id: "ctx-work-01",
    type: "context-tense-picker",
    scenario:
      "Before my boss arrived at the meeting, I ___ (already send) the report to everyone on the team.",
    blankVerb: "send",
    realLifeDialogue: {
      lineA: 'A: "Did your boss see the report?"',
      lineB: 'B: "Yes, I had already sent it before she got there."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "already sent",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-work-01-a", [
          { position: 50 },
        ]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had already sent",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-work-01-b", [
          { position: 35 },
          { position: 55 },
        ]),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have already sent",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-work-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Before", "arrived", "already"],
    explanation:
      '"Before my boss arrived" sets a past reference point. The sending happened even earlier, so Past Perfect is needed.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-work-02",
    type: "context-tense-picker",
    scenario:
      "Every Friday, our team ___ (have) a meeting at 2 p.m. to discuss the week's progress.",
    blankVerb: "have",
    realLifeDialogue: {
      lineA: 'A: "Are you free Friday afternoon?"',
      lineB: 'B: "No, we have a team meeting every Friday at 2."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "has",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-work-02-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is having",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-work-02-b"),
        isCorrect: false,
      },
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will have",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-work-02-c", [
          { position: 60 },
        ]),
        isCorrect: false,
      },
    ],
    contextClues: ["Every Friday"],
    explanation:
      '"Every Friday" signals a regular routine or schedule. Present Simple is used for habits and fixed schedules.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Family at Home
  // ============================================================
  {
    id: "ctx-home-01",
    type: "context-tense-picker",
    scenario:
      "Every Sunday, my grandmother ___ (make) a big breakfast for everyone in the family.",
    blankVerb: "make",
    realLifeDialogue: {
      lineA: 'A: "What does your family do on Sundays?"',
      lineB: 'B: "My grandmother always makes a big breakfast for everyone."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "makes",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-home-01-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is making",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-home-01-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has made",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-home-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Every Sunday"],
    explanation:
      '"Every Sunday" indicates a repeated family tradition. Present Simple is used for regular habits and routines.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-home-02",
    type: "context-tense-picker",
    scenario:
      "Right now, the baby ___ (sleep), so please keep your voice down.",
    blankVerb: "sleep",
    realLifeDialogue: {
      lineA: 'A: "Can I turn on the TV?"',
      lineB: 'B: "Shh! The baby is sleeping right now."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "sleeps",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-home-02-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is sleeping",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-home-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has slept",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-home-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Right now", "please keep your voice down"],
    explanation:
      '"Right now" shows the action is happening at this moment. Present Continuous describes the temporary current state.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Health/Doctor
  // ============================================================
  {
    id: "ctx-health-01",
    type: "context-tense-picker",
    scenario:
      "I ___ (take) this medicine for two weeks now, and I finally feel better.",
    blankVerb: "take",
    realLifeDialogue: {
      lineA: 'A: "How long have you been on this medication?"',
      lineB: 'B: "I have been taking it for two weeks, and it\'s really helping."',
    },
    options: [
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "am taking",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-health-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been taking",
        elements: buildCanonicalTimelineElements(
          "presentPerfectContinuous",
          "ctx-health-01-b",
          [{ position: 50 }]
        ),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was taking",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-health-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["for two weeks now", "finally feel better"],
    explanation:
      '"For two weeks now" shows duration from the past up to now. The present result (feeling better) confirms Present Perfect Continuous.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-health-02",
    type: "context-tense-picker",
    scenario:
      "The pharmacist ___ (fill) my prescription right now. It should be ready in ten minutes.",
    blankVerb: "fill",
    realLifeDialogue: {
      lineA: 'A: "Is your medicine ready?"',
      lineB: 'B: "Not yet. The pharmacist is filling it right now."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "fills",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-health-02-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is filling",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-health-02-b"),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has filled",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-health-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["right now", "should be ready in ten minutes"],
    explanation:
      '"Right now" signals an action in progress at this moment. Present Continuous is the correct choice.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // SIMPLE — extra questions
  // ============================================================
  {
    id: "ctx-simple-01",
    type: "context-tense-picker",
    scenario: "My boss always ___ (send) emails on Sunday nights. It drives everyone crazy.",
    blankVerb: "send",
    realLifeDialogue: {
      lineA: 'A: "Did you see that email?"',
      lineB: 'B: "Of course — he always sends them on Sunday nights."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "sends",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-01-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is sending",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-simple-01-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has sent",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-simple-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["always", "on Sunday nights"],
    explanation:
      '"Always" and a fixed time ("Sunday nights") describe a repeated habit. Present Simple is used for routines. Present Continuous would mean it\'s happening right now; Present Perfect would focus on past results.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-02",
    type: "context-tense-picker",
    scenario: "I ___ (miss) the bus this morning because I woke up late.",
    blankVerb: "miss",
    realLifeDialogue: {
      lineA: 'A: "Why were you late to class?"',
      lineB: 'B: "I missed the bus this morning."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "missed",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-simple-02-a", [{ position: 35 }]),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have missed",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-simple-02-b"),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was missing",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-simple-02-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["this morning", "woke up late"],
    explanation:
      '"This morning" is a specific finished time — the event is over and closed. Past Simple is used for completed actions at a specific past time. "Have missed" connects to the present; "was missing" implies an ongoing background action.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-03",
    type: "context-tense-picker",
    scenario: "When Ana was a child, she ___ (walk) to school every day with her older brother.",
    blankVerb: "walk",
    realLifeDialogue: {
      lineA: 'A: "Did you grow up nearby?"',
      lineB: 'B: "Yes — I walked to school every day when I was little."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "walked",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-simple-03-a", [{ position: 35 }]),
        isCorrect: true,
      },
      {
        tenseName: "Present Simple",
        conjugatedVerb: "walks",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-03-b"),
        isCorrect: false,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was walking",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-simple-03-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["When Ana was a child", "every day"],
    explanation:
      '"When Ana was a child" sets the whole story in the past. A repeated past habit uses Past Simple — not Past Continuous, which describes a background action in progress at one past moment.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-04",
    type: "context-tense-picker",
    scenario: "Don't worry — I ___ (be) at the appointment on time. I already booked a cab.",
    blankVerb: "be",
    realLifeDialogue: {
      lineA: 'A: "Are you sure you can make it by 9?"',
      lineB: 'B: "I will be there on time — I already have a cab."',
    },
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will be",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-simple-04-a", [{ position: 65 }]),
        isCorrect: true,
      },
      {
        tenseName: "Present Simple",
        conjugatedVerb: "am",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-04-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "am being",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-simple-04-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["Don't worry", "I already booked"],
    explanation:
      'The speaker is making a promise about a future event. Future Simple ("will be") is used for promises and decisions made at the moment of speaking.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-05",
    type: "context-tense-picker",
    scenario: "He never ___ (eat) breakfast. He says he's not hungry in the morning.",
    blankVerb: "eat",
    realLifeDialogue: {
      lineA: 'A: "Should we wait for Tomás to eat?"',
      lineB: 'B: "No — he never eats breakfast."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "eats",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-05-a"),
        isCorrect: true,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is eating",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-simple-05-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has eaten",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-simple-05-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["never", "He says he's not hungry in the morning"],
    explanation:
      '"Never" with a general statement about a person\'s habits calls for Present Simple. Present Continuous would mean he\'s not eating right now; Present Perfect would describe a life experience.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-06",
    type: "context-tense-picker",
    scenario: "The dentist ___ (call) me last Tuesday to reschedule my appointment.",
    blankVerb: "call",
    realLifeDialogue: {
      lineA: 'A: "When did you find out about the change?"',
      lineB: 'B: "The dentist called me last Tuesday."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "called",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-simple-06-a", [{ position: 40 }]),
        isCorrect: true,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has called",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-simple-06-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Simple",
        conjugatedVerb: "calls",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-06-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["last Tuesday"],
    explanation:
      '"Last Tuesday" is a specific, finished past time — the event is closed. Past Simple is always used with specific past time markers. Present Perfect cannot be used with "last Tuesday."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "ctx-simple-07",
    type: "context-tense-picker",
    scenario: "Don't throw that charger away — I think you ___ (need) it later.",
    blankVerb: "need",
    realLifeDialogue: {
      lineA: 'A: "Should I keep this old charger?"',
      lineB: 'B: "Yes — I think you will need it later."',
    },
    options: [
      {
        tenseName: "Future Simple",
        conjugatedVerb: "will need",
        elements: buildCanonicalTimelineElements("futureSimple", "ctx-simple-07-a", [{ position: 65 }]),
        isCorrect: true,
      },
      {
        tenseName: "Present Simple",
        conjugatedVerb: "need",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-simple-07-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have needed",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-simple-07-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["later", "I think"],
    explanation:
      '"Later" points to the future. "I think" introduces a prediction. Future Simple ("will need") is used for predictions and opinions about what will happen.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // PERFECT — extra questions
  // ============================================================
  {
    id: "ctx-perf-01",
    type: "context-tense-picker",
    scenario: "I can't find my keys. I think I ___ (leave) them at the office.",
    blankVerb: "leave",
    realLifeDialogue: {
      lineA: 'A: "What are you looking for?"',
      lineB: 'B: "My keys — I think I have left them at the office."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "left",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-perf-01-a", [{ position: 40 }]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have left",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-perf-01-b"),
        isCorrect: true,
      },
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was leaving",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-perf-01-c"),
        isCorrect: false,
      },
    ],
    contextClues: ["I can't find", "I think"],
    explanation:
      'The missing keys are a problem right now — the past action has a present consequence. Present Perfect connects a past event to the current situation. Past Simple would just report an event without that present relevance.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "ctx-perf-02",
    type: "context-tense-picker",
    scenario: "When we arrived at the restaurant, our table ___ (already/give) away to someone else.",
    blankVerb: "give",
    realLifeDialogue: {
      lineA: 'A: "What happened at the restaurant?"',
      lineB: 'B: "When we arrived, our table had already been given away."',
    },
    options: [
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has already been given",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-perf-02-a"),
        isCorrect: false,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "was already given",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-perf-02-b", [{ position: 40 }]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect",
        conjugatedVerb: "had already been given",
        elements: buildCanonicalTimelineElements("pastPerfect", "ctx-perf-02-c", [{ position: 35 }, { position: 55 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["When we arrived", "already"],
    explanation:
      '"When we arrived" sets a past reference point. The table being given away happened before that moment — Past Perfect shows one past event completed before another past event.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  // ============================================================
  // PERFECT CONTINUOUS — extra questions
  // ============================================================
  {
    id: "ctx-ppc-01",
    type: "context-tense-picker",
    scenario: "You look exhausted! How long ___ (you/study) for this exam?",
    blankVerb: "study",
    realLifeDialogue: {
      lineA: 'A: "You look exhausted! How long have you been studying?"',
      lineB: 'B: "Since seven this morning — I can\'t stop now."',
    },
    options: [
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are you studying",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-ppc-01-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have you been studying",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-01-b", [{ position: 50 }]),
        isCorrect: true,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "did you study",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-ppc-01-c", [{ position: 40 }]),
        isCorrect: false,
      },
    ],
    contextClues: ["How long", "You look exhausted"],
    explanation:
      '"How long" asks about the duration of an activity that started in the past and is still ongoing. Present Perfect Continuous is used for this. Present Continuous only asks about right now; Past Simple implies the studying is over.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-02",
    type: "context-tense-picker",
    scenario: "The baby ___ (cry) for the past hour. I don't know what's wrong.",
    blankVerb: "cry",
    realLifeDialogue: {
      lineA: 'A: "Is everything okay?"',
      lineB: 'B: "The baby has been crying for the past hour — I\'m so tired."',
    },
    options: [
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is crying",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-ppc-02-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "has cried",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-ppc-02-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been crying",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-02-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["for the past hour"],
    explanation:
      '"For the past hour" shows an ongoing activity that started in the past and is still happening. Present Perfect Continuous expresses this duration. "Is crying" only describes this moment; "has cried" treats it as a completed event.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-03",
    type: "context-tense-picker",
    scenario: "My neighbor ___ (renovate) his kitchen since last month. The noise is constant.",
    blankVerb: "renovate",
    realLifeDialogue: {
      lineA: 'A: "What\'s all that noise next door?"',
      lineB: 'B: "My neighbor has been renovating his kitchen since last month."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "renovates",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-ppc-03-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is renovating",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-ppc-03-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been renovating",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-03-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["since last month"],
    explanation:
      '"Since last month" marks the start of an ongoing activity. Present Perfect Continuous connects that past start to the present. "Is renovating" only captures this moment without the history.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-04",
    type: "context-tense-picker",
    scenario: "We ___ (wait) for the plumber since nine this morning. He still hasn't shown up.",
    blankVerb: "wait",
    realLifeDialogue: {
      lineA: 'A: "Is the plumber there yet?"',
      lineB: 'B: "No — we have been waiting since nine this morning!"',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "waited",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-ppc-04-a", [{ position: 40 }]),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "are waiting",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-ppc-04-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been waiting",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-04-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["since nine this morning", "still hasn't shown up"],
    explanation:
      '"Since nine this morning" and "still hasn\'t shown up" both confirm the waiting is ongoing from the past to now. Present Perfect Continuous is the only tense that captures that continuous duration.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-05",
    type: "context-tense-picker",
    scenario: "My sister ___ (train) for a half-marathon for the past three months. She runs every morning.",
    blankVerb: "train",
    realLifeDialogue: {
      lineA: 'A: "Is your sister still running every day?"',
      lineB: 'B: "Yes — she has been training for a half-marathon for three months."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "trains",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-ppc-05-a"),
        isCorrect: false,
      },
      {
        tenseName: "Past Simple",
        conjugatedVerb: "trained",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-ppc-05-b", [{ position: 40 }]),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been training",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-05-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["for the past three months"],
    explanation:
      '"For the past three months" shows an activity in progress from a point in the past up to now. Present Perfect Continuous expresses this ongoing effort. Past Simple would mean the training is finished.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-06",
    type: "context-tense-picker",
    scenario: "The construction crew ___ (work) on this road all week. It should be done by Friday.",
    blankVerb: "work",
    realLifeDialogue: {
      lineA: 'A: "Is the road still blocked?"',
      lineB: 'B: "Yes — they have been working on it all week."',
    },
    options: [
      {
        tenseName: "Past Simple",
        conjugatedVerb: "worked",
        elements: buildCanonicalTimelineElements("pastSimple", "ctx-ppc-06-a", [{ position: 40 }]),
        isCorrect: false,
      },
      {
        tenseName: "Present Continuous",
        conjugatedVerb: "is working",
        elements: buildCanonicalTimelineElements("presentContinuous", "ctx-ppc-06-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been working",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-06-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["all week"],
    explanation:
      '"All week" shows the activity has been ongoing since the start of the week and is still continuing. Present Perfect Continuous captures that unbroken duration up to now.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-07",
    type: "context-tense-picker",
    scenario: "She was out of breath when she got home because she ___ (run) for thirty minutes.",
    blankVerb: "run",
    realLifeDialogue: {
      lineA: 'A: "Why was she so out of breath?"',
      lineB: 'B: "She had been running for thirty minutes before she got home."',
    },
    options: [
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was running",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-ppc-07-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been running",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-07-b", [{ position: 50 }]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect Continuous",
        conjugatedVerb: "had been running",
        elements: buildCanonicalTimelineElements("pastPerfectContinuous", "ctx-ppc-07-c", [{ position: 35 }, { position: 55 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["was out of breath", "when she got home", "for thirty minutes"],
    explanation:
      'Everything is in the past. She got home (past reference point) and the running happened for thirty minutes before that — leading up to her arrival. Past Perfect Continuous shows an ongoing past activity that caused a result at another past moment.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-08",
    type: "context-tense-picker",
    scenario: "By the time the doctor saw her, she ___ (feel) sick for three days.",
    blankVerb: "feel",
    realLifeDialogue: {
      lineA: 'A: "How long had she been sick before seeing the doctor?"',
      lineB: 'B: "She had been feeling sick for three days by the time she went in."',
    },
    options: [
      {
        tenseName: "Past Continuous",
        conjugatedVerb: "was feeling",
        elements: buildCanonicalTimelineElements("pastContinuous", "ctx-ppc-08-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "has been feeling",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-08-b", [{ position: 50 }]),
        isCorrect: false,
      },
      {
        tenseName: "Past Perfect Continuous",
        conjugatedVerb: "had been feeling",
        elements: buildCanonicalTimelineElements("pastPerfectContinuous", "ctx-ppc-08-c", [{ position: 35 }, { position: 55 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["By the time the doctor saw her", "for three days"],
    explanation:
      '"By the time the doctor saw her" sets a past reference point. The illness lasted three days leading up to that visit — Past Perfect Continuous shows an ongoing activity that continued right up to another past moment.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "ctx-ppc-09",
    type: "context-tense-picker",
    scenario: "I ___ (take) the same bus route to work for five years. I know every stop by heart.",
    blankVerb: "take",
    realLifeDialogue: {
      lineA: 'A: "Do you know this neighborhood well?"',
      lineB: 'B: "Very well — I have been taking the same bus route for five years."',
    },
    options: [
      {
        tenseName: "Present Simple",
        conjugatedVerb: "take",
        elements: buildCanonicalTimelineElements("presentSimpleHabit", "ctx-ppc-09-a"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect",
        conjugatedVerb: "have taken",
        elements: buildCanonicalTimelineElements("presentPerfect", "ctx-ppc-09-b"),
        isCorrect: false,
      },
      {
        tenseName: "Present Perfect Continuous",
        conjugatedVerb: "have been taking",
        elements: buildCanonicalTimelineElements("presentPerfectContinuous", "ctx-ppc-09-c", [{ position: 50 }]),
        isCorrect: true,
      },
    ],
    contextClues: ["for five years"],
    explanation:
      '"For five years" shows an activity that started in the past and is still happening now — the route is ongoing. Present Perfect Continuous emphasises the unbroken continuity. "Take" (habit) misses the duration; "have taken" sounds like a count of trips rather than a continuous activity.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
];
