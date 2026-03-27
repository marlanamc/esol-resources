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
      "Past Perfect Continuous needs the split-past layout: duration leading to a later past reference point. A plain past-zone duration does not match that meaning.",
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  },
];
