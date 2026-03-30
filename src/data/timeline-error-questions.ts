import type { ErrorCorrectionQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Error Correction questions for the "Fix It" challenge mode.
 *
 * Each question presents either:
 *  - A sentence with the wrong tense ("sentence" errorLocation)
 *  - A timeline that doesn't match the sentence ("timeline" errorLocation)
 *
 * Students first identify where the error is, then type the corrected verb
 * (sentence errors) or view the correct timeline (timeline errors).
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
];
