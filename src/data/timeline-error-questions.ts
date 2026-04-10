import type { ErrorCorrectionQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Error Correction questions for the "Fix It" challenge mode.
 *
 * Each question shows a sentence + timeline where one of them is wrong.
 * Students identify which is wrong, then fix it.
 *
 * ─── AUTHORING RULES ───────────────────────────────────────────────────────
 *
 * 1. ERROR TYPES — set via errorLocation:
 *    - "sentence": the sentence uses the wrong tense; the timeline is correct.
 *      Students type the corrected verb (matched against verbBlanks).
 *    - "timeline": the timeline doesn't match the sentence; the sentence is correct.
 *      Students identify the mismatch; no typing required.
 *
 * 2. REAL STUDENT MISTAKES — incorrectSentence should reflect errors that
 *    actual ESOL learners produce, not random wrong answers.
 *    ✅  "She is working here for three years."  (confusion: continuous vs. perfect-continuous)
 *    ❌  "She will work here for three years."  (no common learner confusion)
 *
 * 3. SAME VERB — incorrectSentence and correctSentence must use the same base
 *    verb. Only the tense form changes.
 *    ✅  "I have seen that film last Friday." → "I saw that film last Friday."
 *    ❌  Changing any word other than the verb form
 *
 * 4. commonMistakeExplanation — explain the specific rule that was broken, not
 *    just what the correct answer is. Name the time marker or structural clue.
 *    ✅  '"Last Friday" is a specific past time — Present Perfect can't be used with it.'
 *
 * 5. incorrectTense / correctTense — use the full display name for both
 *    (e.g., "Present Perfect Continuous", not "ppc"). Used in feedback UI.
 *
 * ───────────────────────────────────────────────────────────────────────────
 */
export const TIMELINE_ERROR_QUESTIONS: ErrorCorrectionQuestion[] = [
  {
    id: "err-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "She is working here for three years.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-s-01-incorrect"),
    correctSentence: "She has been working here for three years.",
    realLifeDialogue: {
      lineA: 'A: "Does Maya still work at that clinic?"',
      lineB: 'B: "Yes, she has been working there for three years."',
    },
    correctElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "err-s-01-correct",
      [{ position: 50 }]
    ),
    incorrectTense: "Present Continuous",
    correctTense: "Present Perfect Continuous",
    commonMistakeExplanation:
      `"For three years" shows duration from the past to now — not just what's happening right now. "Is working" has no past dimension; "has been working" does.`,
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "err-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "I have seen that film last Friday.",
    incorrectElements: buildCanonicalTimelineElements("presentPerfect", "err-s-02-incorrect"),
    correctSentence: "I saw that film last Friday.",
    correctElements: buildCanonicalTimelineElements("pastSimple", "err-s-02-correct", [
      { position: 50 },
    ]),
    incorrectTense: "Present Perfect",
    correctTense: "Past Simple",
    commonMistakeExplanation:
      `"Last Friday" is a specific past time marker. Present Perfect cannot be used with specific past times — it becomes Past Simple.`,
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-s-03",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "When I arrived, she already left.",
    incorrectElements: [
      ...buildCanonicalTimelineElements("pastSimple", "err-s-03-incorrect-a"),
      ...buildCanonicalTimelineElements("pastSimple", "err-s-03-incorrect-b", [
        { position: 65 },
      ]),
    ],
    correctSentence: "When I arrived, she had already left.",
    correctElements: buildCanonicalTimelineElements("pastPerfect", "err-s-03-correct", [
      { position: 30 },
      { position: 55 },
    ]),
    incorrectTense: "Past Simple",
    correctTense: "Past Perfect",
    commonMistakeExplanation:
      `"Already" + "when" shows the leaving happened before the arriving. The earlier past action needs Past Perfect (had left), not Past Simple.`,
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-s-04",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "He worked at 9 a.m. yesterday, so I didn't call.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-s-04-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "He was working at 9 a.m. yesterday, so I didn't call.",
    acceptedCorrections: ["was working"],
    correctElements: buildCanonicalTimelineElements("pastContinuous", "err-s-04-correct"),
    incorrectTense: "Past Simple",
    correctTense: "Past Continuous",
    commonMistakeExplanation:
      `"At 9 a.m. yesterday" points to an action in progress at a specific past moment. Past Simple sounds like a finished event, but Past Continuous shows the background action at that time.`,
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-s-05",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "By this time next year, I finish my degree.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-s-05-incorrect", [
      { position: 70 },
    ]),
    correctSentence: "By this time next year, I will have finished my degree.",
    correctElements: buildCanonicalTimelineElements("futurePerfect", "err-s-05-correct", [
      { position: 70 },
    ]),
    incorrectTense: "Present Simple (used incorrectly for future)",
    correctTense: "Future Perfect",
    commonMistakeExplanation:
      `"By this time next year" sets a future deadline. The action will be completed before that deadline — Future Perfect (will have finished) is required.`,
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-s-06",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "The students study when the fire alarm rang.",
    incorrectElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-06-incorrect"
    ),
    correctSentence: "The students were studying when the fire alarm rang.",
    correctElements: [
      ...buildCanonicalTimelineElements("pastContinuous", "err-s-06-correct-a"),
      ...buildCanonicalTimelineElements("pastSimple", "err-s-06-correct-b", [
        { position: 75 },
      ]),
    ],
    incorrectTense: "Present Simple",
    correctTense: "Past Continuous",
    commonMistakeExplanation:
      `"When the alarm rang" tells us we're in the past. The studying was ongoing (background) when the alarm happened — Past Continuous (were studying).`,
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "err-t-01",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "I have lived in Revere for five years.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-01-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "I have lived in Revere for five years.",
    correctElements: buildCanonicalTimelineElements("presentPerfect", "err-t-01-correct"),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Present Perfect",
    commonMistakeExplanation:
      "Present Perfect requires the arc connecting past to NOW. A single dot in the past would mean Past Simple — but the action is still continuing (I still live there).",
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "err-t-02",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "She was reading a book all afternoon.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-02-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "She was reading a book all afternoon.",
    correctElements: buildCanonicalTimelineElements("pastContinuous", "err-t-02-correct"),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Past Continuous",
    commonMistakeExplanation:
      '"All afternoon" means the reading was extended over time — a duration. Past Continuous needs a duration line (solid-line), not a single dot.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-t-03",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence:
      "They had been working on the project for months before the deadline.",
    incorrectElements: buildCanonicalTimelineElements("pastContinuous", "err-t-03-incorrect"),
    correctSentence:
      "They had been working on the project for months before the deadline.",
    correctElements: buildCanonicalTimelineElements(
      "pastPerfectContinuous",
      "err-t-03-correct",
      [{ position: 50 }, { position: 35 }]
    ),
    incorrectTense: "Past Continuous (wrong)",
    correctTense: "Past Perfect Continuous",
    commonMistakeExplanation:
      "Past Perfect Continuous needs the split-past layout: duration leading to a recent past reference point. A plain past-zone duration does not match that meaning.",
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "err-s-07",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Right now, the baby sleeps in the stroller.",
    incorrectElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-07-incorrect"
    ),
    correctSentence: "Right now, the baby is sleeping in the stroller.",
    acceptedCorrections: ["is sleeping"],
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-s-07-correct"),
    incorrectTense: "Present Simple",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      '"Right now" points to an action in progress at the moment of speaking. Present Simple sounds habitual, but the sentence needs Present Continuous.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-s-08",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "We have finished the meeting an hour ago.",
    incorrectElements: buildCanonicalTimelineElements("presentPerfect", "err-s-08-incorrect"),
    correctSentence: "We finished the meeting an hour ago.",
    acceptedCorrections: ["finished"],
    correctElements: buildCanonicalTimelineElements("pastSimple", "err-s-08-correct", [
      { position: 50 },
    ]),
    incorrectTense: "Present Perfect",
    correctTense: "Past Simple",
    commonMistakeExplanation:
      '"An hour ago" is a finished past time marker. That closes the event in the past, so Present Perfect is not natural here.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-s-09",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "By next Monday, they will finish the mural.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-s-09-incorrect", [
      { position: 65 },
    ]),
    correctSentence: "By next Monday, they will have finished the mural.",
    acceptedCorrections: ["will have finished"],
    correctElements: buildCanonicalTimelineElements("futurePerfect", "err-s-09-correct", [
      { position: 65 },
    ]),
    incorrectTense: "Future Simple",
    correctTense: "Future Perfect",
    commonMistakeExplanation:
      '"By next Monday" sets a deadline before a future point. Future Perfect shows the mural as complete by that point, not merely happening sometime then.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-t-04",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "At noon tomorrow, I will be meeting the principal.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-t-04-incorrect", [
      { position: 60 },
    ]),
    correctSentence: "At noon tomorrow, I will be meeting the principal.",
    correctElements: buildCanonicalTimelineElements("futureContinuous", "err-t-04-correct", [
      { position: 60 },
    ]),
    incorrectTense: "Future Simple (wrong)",
    correctTense: "Future Continuous",
    commonMistakeExplanation:
      'The sentence focuses on a specific future moment and shows the meeting in progress then. The correct timeline needs a future duration shape, not a single future dot.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "err-t-05",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "She has been teaching at this school since 2021.",
    incorrectElements: buildCanonicalTimelineElements("presentPerfect", "err-t-05-incorrect"),
    correctSentence: "She has been teaching at this school since 2021.",
    correctElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "err-t-05-correct",
      [{ position: 50 }]
    ),
    incorrectTense: "Present Perfect (wrong)",
    correctTense: "Present Perfect Continuous",
    commonMistakeExplanation:
      '"Since 2021" emphasizes an ongoing activity from the past to now. The timeline needs the continuing action shape of Present Perfect Continuous, not only a completed-result arc.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "err-s-10",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Every Saturday, we are clean the apartment together.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-s-10-incorrect"),
    correctSentence: "Every Saturday, we clean the apartment together.",
    acceptedCorrections: ["clean"],
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-10-correct"
    ),
    incorrectTense: "Present Continuous",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Every Saturday" shows a routine. The sentence needs Present Simple for a repeated habit, not a present-in-progress form.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-s-11",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Tomorrow morning, the clinic is open at 8 for walk-ins.",
    incorrectElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-11-incorrect"
    ),
    correctSentence: "Tomorrow morning, the clinic will open at 8 for walk-ins.",
    acceptedCorrections: ["will open"],
    correctElements: buildCanonicalTimelineElements("futureSimple", "err-s-11-correct", [
      { position: 60 },
    ]),
    incorrectTense: "Present Simple",
    correctTense: "Future Simple",
    commonMistakeExplanation:
      'Because the sentence is making a plain future statement about tomorrow morning, "will open" is the cleaner target tense in this challenge set.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-t-06",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "My brother drives to Worcester every weekday.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-06-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "My brother drives to Worcester every weekday.",
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-t-06-correct"
    ),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'A routine like "every weekday" needs the repeated-habit timeline, not one finished past dot. The meaning is habitual, not completed.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-s-12",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Right now, the receptionist helps a patient on the phone.",
    incorrectElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-12-incorrect"
    ),
    correctSentence: "Right now, the receptionist is helping a patient on the phone.",
    acceptedCorrections: ["is helping"],
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-s-12-correct"),
    incorrectTense: "Present Simple",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      '"Right now" points to an action happening at this moment. The sentence needs Present Continuous, not a habitual simple form.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-s-13",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "By the time we get to the station, the train will leave.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-s-13-incorrect", [
      { position: 60 },
    ]),
    correctSentence: "By the time we get to the station, the train will have left.",
    acceptedCorrections: ["will have left"],
    correctElements: buildCanonicalTimelineElements("futurePerfect", "err-s-13-correct", [
      { position: 65 },
    ]),
    incorrectTense: "Future Simple",
    correctTense: "Future Perfect",
    commonMistakeExplanation:
      '"By the time" introduces a later reference point. The leaving must be complete before that point, so Future Perfect is required.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-t-07",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "At 6 tomorrow morning, we will be waiting at the airport.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-t-07-incorrect", [
      { position: 60 },
    ]),
    correctSentence: "At 6 tomorrow morning, we will be waiting at the airport.",
    correctElements: buildCanonicalTimelineElements("futureContinuous", "err-t-07-correct", [
      { position: 60 },
    ]),
    incorrectTense: "Future Simple (wrong)",
    correctTense: "Future Continuous",
    commonMistakeExplanation:
      'The sentence focuses on a specific future moment with an action in progress. The timeline should show future duration, not one finished future event.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "err-s-14",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Why you are waiting outside the pharmacy right now?",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-s-14-incorrect"),
    correctSentence: "Why are you waiting outside the pharmacy right now?",
    acceptedCorrections: ["are you waiting", "why are you waiting outside the pharmacy right now?"],
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-s-14-correct"),
    incorrectTense: "Present Continuous question form (wrong order)",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      "The tense is correct, but English questions need auxiliary inversion. In Present Continuous questions, the auxiliary comes before the subject: 'Why are you waiting...?'",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-s-15",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "She didn't has her blood test yet.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-s-15-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "She hasn't had her blood test yet.",
    acceptedCorrections: ["hasn't had", "has not had"],
    correctElements: buildCanonicalTimelineElements("presentPerfect", "err-s-15-correct"),
    incorrectTense: "Past Simple / wrong auxiliary",
    correctTense: "Present Perfect",
    commonMistakeExplanation:
      '"Yet" in a negative sentence usually calls for Present Perfect when the action is still unfinished now. The correct form is "hasn\'t had," not "didn\'t has."',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-s-16",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Why you are sad right now?",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-s-16-incorrect"),
    correctSentence: "Why are you sad right now?",
    acceptedCorrections: ["are you sad", "why are you sad right now?"],
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-s-16-correct"),
    incorrectTense: "Question word order (wrong)",
    correctTense: "Present question form",
    commonMistakeExplanation:
      "In English questions, the auxiliary comes before the subject. We say 'Why are you sad?' not 'Why you are sad?'",
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-s-17",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "He doesn't goes to class on Friday.",
    incorrectElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-17-incorrect"
    ),
    correctSentence: "He doesn't go to class on Friday.",
    acceptedCorrections: ["go", "doesn't go", "does not go"],
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-s-17-correct"
    ),
    incorrectTense: "Present Simple negative form (wrong verb form)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'After "doesn\'t," use the base verb. The correct form is "doesn\'t go," not "doesn\'t goes."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Texting & Phone
  // ============================================================
  {
    id: "err-text-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "I have texted her 10 minutes ago.",
    incorrectElements: buildCanonicalTimelineElements("presentPerfect", "err-text-s-01-incorrect"),
    correctSentence: "I texted her 10 minutes ago.",
    acceptedCorrections: ["texted"],
    realLifeDialogue: {
      lineA: 'A: "When did you text Maria?"',
      lineB: 'B: "I texted her 10 minutes ago."',
    },
    correctElements: buildCanonicalTimelineElements("pastSimple", "err-text-s-01-correct", [
      { position: 50 },
    ]),
    incorrectTense: "Present Perfect",
    correctTense: "Past Simple",
    commonMistakeExplanation:
      '"10 minutes ago" is a specific past time marker. Present Perfect cannot be used with specific past times — use Past Simple.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Food & Restaurants
  // ============================================================
  {
    id: "err-food-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "We are wait for our food for 30 minutes.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-food-s-01-incorrect"),
    correctSentence: "We have been waiting for our food for 30 minutes.",
    acceptedCorrections: ["have been waiting"],
    realLifeDialogue: {
      lineA: 'A: "Where is our order?"',
      lineB: 'B: "I don\'t know. We have been waiting for 30 minutes!"',
    },
    correctElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "err-food-s-01-correct",
      [{ position: 50 }]
    ),
    incorrectTense: "Present Continuous (malformed)",
    correctTense: "Present Perfect Continuous",
    commonMistakeExplanation:
      '"For 30 minutes" shows duration from the past to now. Use Present Perfect Continuous (have been waiting), not Present Continuous.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "err-food-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "The restaurant is close at 10 p.m. every night.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-food-s-02-incorrect"),
    correctSentence: "The restaurant closes at 10 p.m. every night.",
    acceptedCorrections: ["closes"],
    realLifeDialogue: {
      lineA: 'A: "How late is the restaurant open?"',
      lineB: 'B: "It closes at 10 p.m. every night."',
    },
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-food-s-02-correct"
    ),
    incorrectTense: "Present Continuous (wrong use)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Every night" signals a regular schedule. Schedules and routines use Present Simple, not Present Continuous.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Grocery Shopping
  // ============================================================
  {
    id: "err-shop-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "I always am buying organic vegetables.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-shop-s-01-incorrect"),
    correctSentence: "I always buy organic vegetables.",
    acceptedCorrections: ["buy", "always buy"],
    realLifeDialogue: {
      lineA: 'A: "Do you buy organic food?"',
      lineB: 'B: "Yes, I always buy organic vegetables."',
    },
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-shop-s-01-correct"
    ),
    incorrectTense: "Present Continuous (wrong word order and tense)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Always" with a habit needs Present Simple. The correct form is "I always buy," not "I always am buying."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Transportation
  // ============================================================
  {
    id: "err-transit-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "The bus already left when I arrived at the stop.",
    incorrectElements: [
      ...buildCanonicalTimelineElements("pastSimple", "err-transit-s-01-incorrect-a", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "err-transit-s-01-incorrect-b", [
        { position: 65 },
      ]),
    ],
    correctSentence: "The bus had already left when I arrived at the stop.",
    acceptedCorrections: ["had already left", "had left"],
    realLifeDialogue: {
      lineA: 'A: "Did you catch the bus?"',
      lineB: 'B: "No, it had already left when I got there."',
    },
    correctElements: buildCanonicalTimelineElements("pastPerfect", "err-transit-s-01-correct", [
      { position: 30 },
      { position: 55 },
    ]),
    incorrectTense: "Past Simple",
    correctTense: "Past Perfect",
    commonMistakeExplanation:
      '"Already" + "when" shows one past event happened before another. Use Past Perfect (had left) for the earlier action.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-transit-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "At 7 a.m., I will drive to work.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-transit-s-02-incorrect", [
      { position: 60 },
    ]),
    correctSentence: "At 7 a.m., I will be driving to work.",
    acceptedCorrections: ["will be driving"],
    realLifeDialogue: {
      lineA: 'A: "Can I call you at 7 tomorrow?"',
      lineB: 'B: "I\'ll be driving then. Call me after 8."',
    },
    correctElements: buildCanonicalTimelineElements("futureContinuous", "err-transit-s-02-correct", [
      { position: 60 },
    ]),
    incorrectTense: "Future Simple",
    correctTense: "Future Continuous",
    commonMistakeExplanation:
      '"At 7 a.m." names a specific future moment. The action will be in progress at that time, so Future Continuous is more natural.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Family at Home
  // ============================================================
  {
    id: "err-home-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "My kids is doing their homework right now.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-home-s-01-incorrect"),
    correctSentence: "My kids are doing their homework right now.",
    acceptedCorrections: ["are doing", "are"],
    realLifeDialogue: {
      lineA: 'A: "Can the kids come out to play?"',
      lineB: 'B: "Not yet. They are doing their homework."',
    },
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-home-s-01-correct"),
    incorrectTense: "Present Continuous (subject-verb agreement error)",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      '"Kids" is plural, so use "are," not "is." The correct form is "My kids are doing," not "My kids is doing."',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-home-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "We are live in this apartment for three years.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-home-s-02-incorrect"),
    correctSentence: "We have been living in this apartment for three years.",
    acceptedCorrections: ["have been living"],
    realLifeDialogue: {
      lineA: 'A: "How long have you lived here?"',
      lineB: 'B: "We have been living here for three years."',
    },
    correctElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "err-home-s-02-correct",
      [{ position: 50 }]
    ),
    incorrectTense: "Present Continuous (malformed)",
    correctTense: "Present Perfect Continuous",
    commonMistakeExplanation:
      '"For three years" shows duration from the past to now. Use Present Perfect Continuous (have been living), and fix the verb form to "-ing."',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Question/Negative Form Errors
  // ============================================================
  {
    id: "err-form-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Does she has a doctor appointment today?",
    incorrectElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-form-s-01-incorrect"),
    correctSentence: "Does she have a doctor appointment today?",
    acceptedCorrections: ["have", "does she have"],
    realLifeDialogue: {
      lineA: 'A: "Does she have an appointment today?"',
      lineB: 'B: "Yes, at 2 p.m."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-form-s-01-correct"),
    incorrectTense: "Present Simple question (wrong verb form)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'After "does," use the base verb. The correct form is "Does she have," not "Does she has."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-form-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Where you are going right now?",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-form-s-02-incorrect"),
    correctSentence: "Where are you going right now?",
    acceptedCorrections: ["are you going", "where are you going"],
    realLifeDialogue: {
      lineA: 'A: "Where are you going?"',
      lineB: 'B: "To the store. Need anything?"',
    },
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-form-s-02-correct"),
    incorrectTense: "Present Continuous question (wrong word order)",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      'In English questions, the auxiliary comes before the subject. Say "Where are you going?" not "Where you are going?"',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "err-form-s-03",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "She don't work on Saturdays.",
    incorrectElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-form-s-03-incorrect"),
    correctSentence: "She doesn't work on Saturdays.",
    acceptedCorrections: ["doesn't work", "doesn't", "does not work"],
    realLifeDialogue: {
      lineA: 'A: "Is Rosa working this Saturday?"',
      lineB: 'B: "No, she doesn\'t work on Saturdays."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-form-s-03-correct"),
    incorrectTense: "Present Simple negative (wrong auxiliary)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'Third person singular (she/he/it) uses "doesn\'t," not "don\'t." The correct form is "She doesn\'t work."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-form-s-04",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Why you are waiting outside the store?",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-form-s-04-incorrect"),
    correctSentence: "Why are you waiting outside the store?",
    acceptedCorrections: ["are you waiting", "why are you waiting"],
    realLifeDialogue: {
      lineA: 'A: "Why are you waiting outside?"',
      lineB: 'B: "The store doesn\'t open until 9."',
    },
    correctElements: buildCanonicalTimelineElements("presentContinuous", "err-form-s-04-correct"),
    incorrectTense: "Present Continuous question (wrong word order)",
    correctTense: "Present Continuous",
    commonMistakeExplanation:
      'In questions, the auxiliary "are" must come before the subject "you." Say "Why are you waiting?" not "Why you are waiting?"',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Timeline Errors
  // ============================================================
  {
    id: "err-t-08",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "She has been waiting for the doctor for an hour.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-08-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "She has been waiting for the doctor for an hour.",
    correctElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "err-t-08-correct",
      [{ position: 50 }]
    ),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Present Perfect Continuous",
    commonMistakeExplanation:
      'Present Perfect Continuous needs a duration line reaching to NOW. A single past dot does not show "for an hour" continuing to the present.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "err-t-09",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "We will be flying to Miami at this time tomorrow.",
    incorrectElements: buildCanonicalTimelineElements("futureSimple", "err-t-09-incorrect", [
      { position: 60 },
    ]),
    correctSentence: "We will be flying to Miami at this time tomorrow.",
    correctElements: buildCanonicalTimelineElements("futureContinuous", "err-t-09-correct", [
      { position: 60 },
    ]),
    incorrectTense: "Future Simple (wrong)",
    correctTense: "Future Continuous",
    commonMistakeExplanation:
      'Future Continuous needs a duration shape in the future zone to show the flight in progress. A single dot represents a completed event, not an ongoing one.',
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "err-t-10",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "They had finished dinner before the guests arrived.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-10-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "They had finished dinner before the guests arrived.",
    correctElements: buildCanonicalTimelineElements("pastPerfect", "err-t-10-correct", [
      { position: 30 },
      { position: 55 },
    ]),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Past Perfect",
    commonMistakeExplanation:
      'Past Perfect needs an arc connecting an earlier past moment to a later past reference point. A single past dot does not show the "before" relationship.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "err-t-11",
    type: "error-correction",
    errorLocation: "timeline",
    incorrectSentence: "I take the bus to work every day.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-t-11-incorrect", [
      { position: 50 },
    ]),
    correctSentence: "I take the bus to work every day.",
    correctElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "err-t-11-correct"
    ),
    incorrectTense: "Past Simple (wrong)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Every day" describes a habit. The timeline should show repeated dots (habit pattern), not a single past event dot.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // DO / DOES / DID — Common "to be" substitution errors
  // ============================================================
  {
    id: "err-do-s-01",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "She is work every day.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-do-s-01-incorrect"),
    correctSentence: "She works every day.",
    realLifeDialogue: {
      lineA: 'A: "What does Ana do for work?"',
      lineB: 'B: "She works at a school every day."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-do-s-01-correct"),
    incorrectTense: "Present Continuous (wrong)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'Present Simple uses do/does, not "is/are." "She is work" mixes a to-be verb with a base verb — you need either "She is working" (right now) or "She works" (habit/routine).',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-do-s-02",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "They are not go to the gym on Sundays.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-do-s-02-incorrect"),
    correctSentence: "They don't go to the gym on Sundays.",
    realLifeDialogue: {
      lineA: 'A: "Do they exercise on weekends?"',
      lineB: 'B: "No, they don\'t go to the gym on Sundays."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-do-s-02-correct"),
    incorrectTense: "Present Continuous (wrong)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      'Negative Present Simple uses "don\'t / doesn\'t," not "am not / are not." "Are not go" combines a to-be verb with a base verb — use "don\'t go" for a routine that doesn\'t happen.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-do-s-03",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "He is not understand the question.",
    incorrectElements: buildCanonicalTimelineElements("presentContinuous", "err-do-s-03-incorrect"),
    correctSentence: "He doesn't understand the question.",
    realLifeDialogue: {
      lineA: 'A: "Can Carlos answer?"',
      lineB: 'B: "No, he doesn\'t understand the question."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-do-s-03-correct"),
    incorrectTense: "Present Continuous (wrong)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Understand" is a state verb — it describes a mental state, not an action in progress. State verbs (understand, know, like, need, want) almost never use continuous forms. Use "doesn\'t understand."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-do-s-04",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Did you went to the store yesterday?",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-do-s-04-incorrect", [
      { position: 40 },
    ]),
    correctSentence: "Did you go to the store yesterday?",
    realLifeDialogue: {
      lineA: 'A: "Did you go to the store yesterday?"',
      lineB: 'B: "Yes, I went after work."',
    },
    correctElements: buildCanonicalTimelineElements("pastSimple", "err-do-s-04-correct", [
      { position: 40 },
    ]),
    incorrectTense: "Past Simple (wrong form)",
    correctTense: "Past Simple",
    commonMistakeExplanation:
      'When you use "did" to form a question, the main verb goes back to its base form — not past tense. "Did you went" doubles the past marking. Correct: "Did you go?"',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-do-s-05",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "I didn't went to class last Monday.",
    incorrectElements: buildCanonicalTimelineElements("pastSimple", "err-do-s-05-incorrect", [
      { position: 40 },
    ]),
    correctSentence: "I didn't go to class last Monday.",
    realLifeDialogue: {
      lineA: 'A: "Were you at class on Monday?"',
      lineB: 'B: "No, I didn\'t go. I was sick."',
    },
    correctElements: buildCanonicalTimelineElements("pastSimple", "err-do-s-05-correct", [
      { position: 40 },
    ]),
    incorrectTense: "Past Simple (wrong form)",
    correctTense: "Past Simple",
    commonMistakeExplanation:
      '"Didn\'t" already carries the past meaning — the main verb after it stays in base form. "Didn\'t went" double-marks the past. Correct: "didn\'t go."',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "err-do-s-06",
    type: "error-correction",
    errorLocation: "sentence",
    incorrectSentence: "Does she knows the answer?",
    incorrectElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-do-s-06-incorrect"),
    correctSentence: "Does she know the answer?",
    realLifeDialogue: {
      lineA: 'A: "Does she know the answer?"',
      lineB: 'B: "I think so — she studied all night."',
    },
    correctElements: buildCanonicalTimelineElements("presentSimpleHabit", "err-do-s-06-correct"),
    incorrectTense: "Present Simple (wrong form)",
    correctTense: "Present Simple",
    commonMistakeExplanation:
      '"Does" already adds the third-person -s. The main verb after does/do stays in base form — never add -s again. "Does she know," not "does she knows."',
    difficulty: 1,
    tenseCategory: "simple",
  },
];
