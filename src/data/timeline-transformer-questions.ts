import type { SentenceTransformerQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Sentence Transformer questions for the "Transformer" challenge mode.
 *
 * Students see a sentence in Tense A with its timeline, then rewrite it in
 * Tense B by filling in the verb blanks.
 *
 * Authoring rule: the target sentence must be a natural example of the target
 * tense. If that means adding a time reference, duration phrase, or result clue,
 * author that context directly into targetSentence instead of forcing a
 * word-for-word tense swap.
 *
 * verbBlanks: each entry maps a 0-based word index in the targetSentence
 * (split by spaces) to a list of accepted answers.
 */
export const TIMELINE_TRANSFORMER_QUESTIONS: SentenceTransformerQuestion[] = [
  {
    id: "trans-ps-pc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "She cooked dinner.",
    targetSentence: "She was cooking dinner when I called.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-pc-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("pastContinuous", "trans-ps-pc-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["was cooking"] }],
    hint: 'Use "was/were + -ing" and add a past reference point like "when I called".',
    explanation:
      "Past Continuous sounds most natural when we show the action in progress at a past moment. The added clause gives that in-progress frame.",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-ps-pc-02",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "They played football.",
    targetSentence: "They were playing football when it started to rain.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-pc-02-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("pastContinuous", "trans-ps-pc-02-target"),
    verbBlanks: [{ index: 1, validAnswers: ["were playing"] }],
    hint: 'Use "were" because the subject is plural, and show the action in progress with a past interrupting event.',
    explanation:
      "Past Continuous (were + -ing) works best when the action is the background around another past event.",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-prs-prsc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "He reads the newspaper every morning.",
    targetSentence: "He is reading the newspaper right now.",
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-prsc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prs-prsc-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["is reading"] }],
    hint: "Use am/is/are + -ing for what is happening right now.",
    explanation:
      "Present Simple (reads) shows a habit. Present Continuous (is reading) shows an action happening at this exact moment.",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "I visited Boston last summer.",
    targetSentence: "I have visited Boston, so I know the city well.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-ps-pp-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have visited"] }],
    hint: 'Use "have/has + past participle", remove the closed past time, and add a present result if needed.',
    explanation:
      "Present Perfect works when the past experience matters now. The added result clause makes that current relevance clear.",
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-ps-pp-02",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "She finished the report yesterday.",
    targetSentence: "She has finished the report, so we can send it now.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-pp-02-source", [
      { position: 60 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-ps-pp-02-target",
      [{ position: 60 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has finished"] }],
    hint: 'Use "has" (3rd person singular) + past participle, and shift the sentence toward a present result.',
    explanation:
      "Present Perfect is stronger when the sentence highlights what is true now because of the finished action.",
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-pp-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Perfect",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "I have worked here for five years.",
    targetSentence: "I have been working here for five years, so this place feels like home.",
    sourceElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-pp-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-pp-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have been working"] }],
    hint: 'Add "been" and change the verb to -ing form when the sentence highlights the ongoing process.',
    explanation:
      "Present Perfect Continuous emphasises duration and ongoing activity. The extra clause keeps the focus on the lived, continuing experience.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-ps-ppf-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Perfect",
    sourceSentence: "He left before I arrived.",
    targetSentence: "He had left before I arrived.",
    sourceElements: [
      ...buildCanonicalTimelineElements("pastSimple", "trans-ps-ppf-01-source-a", [
        { position: 30 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "trans-ps-ppf-01-source-b", [
        { position: 65 },
      ]),
    ],
    targetElements: buildCanonicalTimelineElements("pastPerfect", "trans-ps-ppf-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["had left"] }],
    hint: 'Use "had + past participle" for the event that happened first.',
    explanation:
      'Past Perfect (had + p.p.) signals the earlier of two past events. "He left" happened before "I arrived".',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-fs-fc-01",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Future Continuous",
    sourceSentence: "I will work tomorrow.",
    targetSentence: "I will be working at this time tomorrow, so I cannot answer the phone.",
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fs-fc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureContinuous",
      "trans-fs-fc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["will be working"] }],
    hint: 'Use "will be + -ing" to show an action in progress at a specific future moment.',
    explanation:
      "Future Continuous is most natural when the sentence names a future viewpoint and treats the action as already in progress then.",
    difficulty: 2,
    tenseCategory: "continuous",
  },
  {
    id: "trans-prsc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "She is studying English.",
    targetSentence: "She has been studying English for two years.",
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prsc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-prsc-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has been studying"] }],
    hint: 'Use "has/have been + -ing" and add a duration phrase like "for two years".',
    explanation:
      "Present Perfect Continuous looks back from now and shows how long the activity has been going on. The timeline reaches from past all the way to now.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-ps-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Perfect Continuous",
    sourceSentence: "He was tired because he ran for an hour.",
    targetSentence: "He was tired because he had been running for an hour.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-ppc-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "pastPerfectContinuous",
      "trans-ps-ppc-01-target",
      [{ position: 50 }, { position: 30 }]
    ),
    verbBlanks: [{ index: 5, validAnswers: ["had been running"] }],
    hint: 'Use "had been + -ing" to show a continuous activity that led up to a past result.',
    explanation:
      "Past Perfect Continuous (had been + -ing) explains the cause of a past state by showing an ongoing activity that was still happening before that moment.",
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-pp-ppf-01",
    type: "sentence-transformer",
    sourceTense: "Present Perfect",
    targetTense: "Past Perfect",
    sourceSentence: "By the time Ana arrived, Carlos has finished cooking.",
    targetSentence: "By the time Ana arrived, Carlos had finished cooking.",
    sourceElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-pp-ppf-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastPerfect",
      "trans-pp-ppf-01-target",
      [{ position: 40 }, { position: 55 }]
    ),
    verbBlanks: [{ index: 6, validAnswers: ["had finished"] }],
    hint: '"By the time" + past event = Past Perfect for the earlier action.',
    explanation:
      "When both reference points are in the past, use Past Perfect (had + p.p.) — not Present Perfect — for the earlier one.",
    difficulty: 3,
    tenseCategory: "perfect",
  },
  {
    id: "trans-prs-prsc-02",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "They clean the classroom every afternoon.",
    targetSentence: "They are cleaning the classroom right now.",
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-prsc-02-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prs-prsc-02-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["are cleaning"] }],
    hint: 'Use "am/is/are + -ing" to shift from a routine to an action happening now.',
    explanation:
      'The source sentence describes a regular habit. Adding "right now" changes the meaning to an action in progress, so Present Continuous fits.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-prs-pp-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Perfect",
    sourceSentence: "We know that restaurant well.",
    targetSentence: "We have eaten at that restaurant many times.",
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-pp-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-prs-pp-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have eaten"] }],
    hint: 'Use "have/has + past participle" when past experience explains present knowledge.',
    explanation:
      "The target sentence rewrites the idea as life experience connected to now. Present Perfect works because those past visits matter in the present.",
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-pc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Past Continuous",
    targetTense: "Past Perfect Continuous",
    sourceSentence: "They were waiting outside.",
    targetSentence: "They had been waiting outside for an hour before the doors opened.",
    sourceElements: buildCanonicalTimelineElements(
      "pastContinuous",
      "trans-pc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastPerfectContinuous",
      "trans-pc-ppc-01-target",
      [{ position: 50 }, { position: 35 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["had been waiting"] }],
    hint: 'Add "had been + -ing" and a later past reference point to show duration before another past event.',
    explanation:
      "Past Continuous only describes the background action. Past Perfect Continuous adds the idea that the waiting started earlier and continued up to another past moment.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-fs-fpf-01",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Future Perfect",
    sourceSentence: "She will submit the application next week.",
    targetSentence: "By next Friday, she will have submitted the application.",
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fs-fpf-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "futurePerfect",
      "trans-fs-fpf-01-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 4, validAnswers: ["will have submitted"] }],
    hint: 'Use "will have + past participle" when the action will be complete before a future deadline.',
    explanation:
      'Future Perfect does more than predict the event. It places the speaker at a later future point and shows the action as already completed by then.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-ps-ppf-02",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Perfect",
    sourceSentence: "The movie started before we found our seats.",
    targetSentence: "The movie had started before we found our seats.",
    sourceElements: [
      ...buildCanonicalTimelineElements("pastSimple", "trans-ps-ppf-02-source-a", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "trans-ps-ppf-02-source-b", [
        { position: 65 },
      ]),
    ],
    targetElements: buildCanonicalTimelineElements(
      "pastPerfect",
      "trans-ps-ppf-02-target",
      [{ position: 35 }, { position: 55 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["had started"] }],
    hint: 'Use "had + past participle" for the earlier action in a two-event past sequence.',
    explanation:
      "Both events happened in the past, but the start came first. Past Perfect makes that sequence explicit and easier to read.",
    difficulty: 2,
    tenseCategory: "perfect",
  },
];
