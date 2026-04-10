import type { SentenceTransformerQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Sentence Transformer questions for the "Transformer" challenge mode.
 *
 * Students see a sentence in Tense A with its timeline, then rewrite it in
 * Tense B by filling in the verb blanks.
 *
 * ─── AUTHORING RULES ───────────────────────────────────────────────────────
 *
 * 1. SAME BASE VERB — the main verb must be identical in both sentences.
 *    Students are learning tense transformation, not vocabulary substitution.
 *    ✅  "She cooked dinner."  →  "She was cooking dinner when I called."
 *    ❌  "We know that restaurant."  →  "We have eaten there many times."
 *        (know ≠ eat — this looks arbitrary and confuses students)
 *
 * 2. SAME SUBJECT & OBJECT — only the tense machinery should change.
 *    You MAY add or remove time references, duration phrases, or result clues
 *    to make the target tense sound natural, but keep who is doing what.
 *    ✅  "She cooked dinner."  →  "She was cooking dinner when I called."
 *    ❌  "She is not eating now."  →  "She does not eat meat."
 *        (different object/meaning — use "She does not eat in the mornings.")
 *
 * 3. NATURAL ENGLISH — the target sentence should sound like something a real
 *    person would say. Add a time reference or context phrase if needed.
 *
 * 4. verbBlanks — each entry maps a 0-based word index in targetSentence
 *    (split by spaces) to a list of accepted answers. Double-check the index
 *    after any wording changes.
 *
 * ───────────────────────────────────────────────────────────────────────────
 */
export const TIMELINE_TRANSFORMER_QUESTIONS: SentenceTransformerQuestion[] = [
  {
    id: "trans-ps-pc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "She cooked dinner.",
    targetSentence: "She was cooking dinner when I called.",
    realLifeDialogue: {
      lineA: 'A: "Why didn\'t she answer the phone?"',
      lineB: 'B: "She was cooking dinner when I called."',
    },
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
    sourceSentence: "We eat at that restaurant often.",
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
    hint: 'Use "have/has + past participle" to describe repeated past experiences that are still relevant.',
    explanation:
      "The source sentence describes a current habit. Present Perfect rewrites it as repeated past experience — both use the same verb (eat/eaten), but the tense shifts the focus from routine to accumulated experience.",
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
    hint: 'Add "had been + -ing" and a recent past reference point to show duration before another past event.',
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
  {
    id: "trans-prsc-prs-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Simple",
    sourceSentence: "She is wearing scrubs today.",
    targetSentence: "She wears scrubs at work every day.",
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prsc-prs-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prsc-prs-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["wears"] }],
    hint: 'Shift from a temporary action now to a regular routine with the base simple form.',
    explanation:
      "The source sentence describes today's temporary situation. The target sentence rewrites it as a general routine, so Present Simple is the natural choice.",
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-ps-prs-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Simple",
    sourceSentence: "He cooked dinner for the family last night.",
    targetSentence: "He cooks dinner for the family every Friday.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-ps-prs-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-ps-prs-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["cooks"] }],
    hint: 'Replace the finished past event with a habitual meaning and use Present Simple.',
    explanation:
      "A single completed event becomes a repeated routine in the target sentence. That shift in meaning is what makes Present Simple work.",
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-fc-fs-01",
    type: "sentence-transformer",
    sourceTense: "Future Continuous",
    targetTense: "Future Simple",
    sourceSentence: "At 9 tonight, we will be driving to Hartford.",
    targetSentence: "We will drive to Hartford tonight.",
    sourceElements: buildCanonicalTimelineElements(
      "futureContinuous",
      "trans-fc-fs-01-source",
      [{ position: 55 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fc-fs-01-target",
      [{ position: 55 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["will drive"] }],
    hint: 'Use plain "will + base verb" when you are simply stating the future plan instead of focusing on progress at a future moment.',
    explanation:
      "Future Continuous zooms in on the action as it happens at a future point. Future Simple pulls back and states the trip as a simple future event.",
    difficulty: 2,
    tenseCategory: "simple",
  },
  {
    id: "trans-work-prs-prsc-03",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "Mina answers customer emails every afternoon.",
    targetSentence: "Mina is answering customer emails right now.",
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-work-prs-prsc-03-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-work-prs-prsc-03-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["is answering"] }],
    hint: 'Change the routine into an action happening now with "is + -ing".',
    explanation:
      "The source sentence describes a workplace routine. The target sentence shifts to the same action in progress at the moment of speaking.",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-home-ps-pp-03",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "Dad fixed the sink yesterday.",
    targetSentence: "Dad has fixed the sink, so we can use it now.",
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-home-ps-pp-03-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-home-ps-pp-03-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has fixed"] }],
    hint: 'Remove the closed past time and add a present result to support Present Perfect.',
    explanation:
      "The rewritten sentence keeps the home-repair idea but shifts the focus to the result that matters now.",
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-travel-fs-fpf-02",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Future Perfect",
    sourceSentence: "We will check in at the hotel tomorrow evening.",
    targetSentence: "By tomorrow evening, we will have checked in at the hotel.",
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-travel-fs-fpf-02-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "futurePerfect",
      "trans-travel-fs-fpf-02-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 4, validAnswers: ["will have checked"] }],
    hint: 'Use "will have + past participle" to show the action completed before a future point.',
    explanation:
      "Future Perfect turns the hotel check-in into a completed step by a future deadline rather than just a future event.",
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-health-neg-prsc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "He is not sleeping well.",
    targetSentence: "He has not been sleeping well for the past few days.",
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-health-neg-prsc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-health-neg-prsc-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has not been sleeping", "hasn't been sleeping"] }],
    hint: 'Keep the negative meaning and add duration with "has not been + -ing".',
    explanation:
      "The target sentence turns a current negative situation into an ongoing recent problem that started before now and continues to the present.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-question-ps-ppf-03",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Perfect",
    sourceSentence: "Who called the nurse before the clinic opened?",
    targetSentence: "Who had called the nurse before the clinic opened?",
    sourceElements: [
      ...buildCanonicalTimelineElements("pastSimple", "trans-question-ps-ppf-03-source-a", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "trans-question-ps-ppf-03-source-b", [
        { position: 65 },
      ]),
    ],
    targetElements: buildCanonicalTimelineElements(
      "pastPerfect",
      "trans-question-ps-ppf-03-target",
      [{ position: 35 }, { position: 55 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["had called"] }],
    hint: 'In this question pattern, "had + past participle" stays together after "who".',
    explanation:
      "This keeps the interrogative form while clearly marking the phone call as the earlier past action.",
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-beginner-neg-prsc-prs-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Simple",
    sourceSentence: "She is not eating now.",
    targetSentence: "She does not eat in the mornings.",
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-beginner-neg-prsc-prs-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-beginner-neg-prsc-prs-01-target"
    ),
    verbBlanks: [{ index: 3, validAnswers: ["eat"] }],
    hint: 'Use the base verb after "does not" in Present Simple.',
    explanation:
      "The source sentence is a negative action happening right now. The target sentence states a general habit, so Present Simple is the better fit. Only the tense changes — the verb (eat) stays the same.",
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-beginner-question-prs-prsc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "Why do you run every day?",
    targetSentence: "Why are you running now?",
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-beginner-question-prs-prsc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-beginner-question-prs-prsc-01-target"
    ),
    verbBlanks: [{ index: 3, validAnswers: ["running"] }],
    hint: 'Keep the question form and use "are + -ing" for the action happening now.',
    explanation:
      "The first question asks about a habit. The second question asks about something happening at this moment, so Present Continuous is correct.",
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Texting & Phone
  // ============================================================
  {
    id: "trans-text-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "I called her yesterday.",
    targetSentence: "I have called her three times this week already.",
    realLifeDialogue: {
      lineA: 'A: "Have you talked to Maria?"',
      lineB: 'B: "Yes, I have called her three times this week already."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-text-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("presentPerfect", "trans-text-ps-pp-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["have called"] }],
    hint: 'Remove the specific past time and use "have + past participle" when counting experiences up to now.',
    explanation:
      'Present Perfect works when counting actions or experiences that matter now. "This week already" connects the calls to the present.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-text-prs-prc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "She checks her phone every few minutes.",
    targetSentence: "She is checking her phone right now.",
    realLifeDialogue: {
      lineA: 'A: "Is Aisha paying attention?"',
      lineB: 'B: "No, she is checking her phone right now."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-text-prs-prc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-text-prs-prc-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["is checking"] }],
    hint: 'Use "is + -ing" to shift from a habit to an action happening at this moment.',
    explanation:
      'The source sentence describes a habit. Adding "right now" shifts the meaning to an action in progress, which needs Present Continuous.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Food & Restaurants
  // ============================================================
  {
    id: "trans-food-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "We ate at that restaurant last month.",
    targetSentence: "We have eaten at that restaurant many times.",
    realLifeDialogue: {
      lineA: 'A: "Do you know that place?"',
      lineB: 'B: "Yes, we have eaten there many times."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-food-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("presentPerfect", "trans-food-ps-pp-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["have eaten"] }],
    hint: 'Replace the closed past time with life experience using "have + past participle."',
    explanation:
      'Present Perfect describes life experiences connected to now. "Many times" counts past experiences without closing them off.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-food-prs-prc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "The chef prepares fresh bread every morning.",
    targetSentence: "The chef is preparing fresh bread right now.",
    realLifeDialogue: {
      lineA: 'A: "Is the bread fresh?"',
      lineB: 'B: "Yes! The chef is preparing a new batch right now."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-food-prs-prc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-food-prs-prc-01-target"
    ),
    verbBlanks: [{ index: 2, validAnswers: ["is preparing"] }],
    hint: 'Use "is + -ing" to show the action happening at this moment.',
    explanation:
      'The source describes a daily routine. The target focuses on now, so Present Continuous is correct.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-food-ps-pc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "They ordered pizza.",
    targetSentence: "They were ordering pizza when the delivery app crashed.",
    realLifeDialogue: {
      lineA: 'A: "What happened with your dinner order?"',
      lineB: 'B: "We were ordering pizza when the app crashed!"',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-food-ps-pc-01-source", [
      { position: 50 },
    ]),
    targetElements: [
      ...buildCanonicalTimelineElements("pastContinuous", "trans-food-ps-pc-01-target-a"),
      ...buildCanonicalTimelineElements("pastSimple", "trans-food-ps-pc-01-target-b", [
        { position: 70 },
      ]),
    ],
    verbBlanks: [{ index: 1, validAnswers: ["were ordering"] }],
    hint: 'Use "were + -ing" and add an interrupting event to show the action in progress.',
    explanation:
      'Past Continuous shows an action in progress when another event happened. The added clause provides that interruption.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Grocery Shopping
  // ============================================================
  {
    id: "trans-shop-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "I bought groceries yesterday.",
    targetSentence: "I have already bought groceries this week.",
    realLifeDialogue: {
      lineA: 'A: "Should I stop at the store?"',
      lineB: 'B: "No need. I have already bought groceries this week."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-shop-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("presentPerfect", "trans-shop-ps-pp-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["have already bought"] }],
    hint: 'Replace the closed past time with "already" and "this week" for present relevance.',
    explanation:
      'Present Perfect connects past actions to now. "Already" + "this week" shows the shopping affects the present (no need to go again).',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-shop-prc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "She is shopping for dinner.",
    targetSentence: "She has been shopping for two hours already.",
    realLifeDialogue: {
      lineA: 'A: "Is your mom still at the store?"',
      lineB: 'B: "Yes, she has been shopping for two hours already!"',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-shop-prc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-shop-prc-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has been shopping"] }],
    hint: 'Add "has been + -ing" and a duration to show how long the shopping has been going on.',
    explanation:
      'Present Perfect Continuous emphasizes the duration of an ongoing action. "For two hours" measures the time from start to now.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Transportation
  // ============================================================
  {
    id: "trans-transit-prs-prc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "The bus comes every 15 minutes.",
    targetSentence: "The bus is coming down the street right now.",
    realLifeDialogue: {
      lineA: 'A: "Where is the bus?"',
      lineB: 'B: "Look! It is coming down the street right now."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-transit-prs-prc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-transit-prs-prc-01-target"
    ),
    verbBlanks: [{ index: 2, validAnswers: ["is coming"] }],
    hint: 'Use "is + -ing" to show the bus approaching at this moment.',
    explanation:
      'The source describes a schedule. The target shows a specific bus arriving now, so Present Continuous is correct.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-transit-ps-ppf-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Perfect",
    sourceSentence: "The flight left before we arrived.",
    targetSentence: "The flight had left before we arrived.",
    realLifeDialogue: {
      lineA: 'A: "Did you catch your flight?"',
      lineB: 'B: "No, it had left before we got there."',
    },
    sourceElements: [
      ...buildCanonicalTimelineElements("pastSimple", "trans-transit-ps-ppf-01-source-a", [
        { position: 30 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "trans-transit-ps-ppf-01-source-b", [
        { position: 65 },
      ]),
    ],
    targetElements: buildCanonicalTimelineElements("pastPerfect", "trans-transit-ps-ppf-01-target"),
    verbBlanks: [{ index: 2, validAnswers: ["had left"] }],
    hint: 'Use "had + past participle" for the action that happened first.',
    explanation:
      'Past Perfect clearly marks the earlier of two past events. The flight leaving happened before our arriving.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  {
    id: "trans-transit-prc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "I am waiting for the train.",
    targetSentence: "I have been waiting for the train for 20 minutes.",
    realLifeDialogue: {
      lineA: 'A: "Are you still at the station?"',
      lineB: 'B: "Yes, I have been waiting for 20 minutes!"',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-transit-prc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-transit-prc-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have been waiting"] }],
    hint: 'Add "have been + -ing" and a duration to emphasize how long you have waited.',
    explanation:
      'Present Perfect Continuous shows duration from the past up to now. The added time phrase emphasizes frustration with the wait.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Weather
  // ============================================================
  {
    id: "trans-weather-ps-pc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "It rained yesterday.",
    targetSentence: "It was raining when I left for work.",
    realLifeDialogue: {
      lineA: 'A: "Did you get wet yesterday?"',
      lineB: 'B: "Yes! It was raining when I left for work."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-weather-ps-pc-01-source", [
      { position: 50 },
    ]),
    targetElements: [
      ...buildCanonicalTimelineElements("pastContinuous", "trans-weather-ps-pc-01-target-a"),
      ...buildCanonicalTimelineElements("pastSimple", "trans-weather-ps-pc-01-target-b", [
        { position: 70 },
      ]),
    ],
    verbBlanks: [{ index: 1, validAnswers: ["was raining"] }],
    hint: 'Use "was + -ing" and add a specific moment to show the rain as background.',
    explanation:
      'Past Continuous shows an action in progress at a past moment. The added clause provides that reference point.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-weather-prc-ppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "It is snowing outside.",
    targetSentence: "It has been snowing since midnight.",
    realLifeDialogue: {
      lineA: 'A: "How long has it been snowing?"',
      lineB: 'B: "It has been snowing since midnight. Look at all that snow!"',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-weather-prc-ppc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-weather-prc-ppc-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has been snowing"] }],
    hint: 'Add "has been + -ing" and "since" to show duration from a starting point.',
    explanation:
      '"Since midnight" gives a specific starting point. Present Perfect Continuous connects that start to the present moment.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Work/Job
  // ============================================================
  {
    id: "trans-work-prs-prc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "She answers emails every morning.",
    targetSentence: "She is answering emails right now.",
    realLifeDialogue: {
      lineA: 'A: "Can I talk to Rosa?"',
      lineB: 'B: "She is answering emails right now. Can I take a message?"',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-work-prs-prc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-work-prs-prc-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["is answering"] }],
    hint: 'Use "is + -ing" to shift from a routine to a current action.',
    explanation:
      'The source describes a daily work routine. The target shows the same action happening now.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-work-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "I finished the project last week.",
    targetSentence: "I have finished the project, so we can present it now.",
    realLifeDialogue: {
      lineA: 'A: "Is the project ready?"',
      lineB: 'B: "Yes, I have finished it. We can present anytime."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-work-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements("presentPerfect", "trans-work-ps-pp-01-target"),
    verbBlanks: [{ index: 1, validAnswers: ["have finished"] }],
    hint: 'Remove the past time and add a present result to support Present Perfect.',
    explanation:
      'Present Perfect connects the completion to now. The added clause shows the present consequence.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Family at Home
  // ============================================================
  {
    id: "trans-home-ps-pc-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Past Continuous",
    sourceSentence: "Mom cooked dinner.",
    targetSentence: "Mom was cooking dinner when Dad called.",
    realLifeDialogue: {
      lineA: 'A: "What was your mom doing when your dad called?"',
      lineB: 'B: "She was cooking dinner."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-home-ps-pc-01-source", [
      { position: 50 },
    ]),
    targetElements: [
      ...buildCanonicalTimelineElements("pastContinuous", "trans-home-ps-pc-01-target-a"),
      ...buildCanonicalTimelineElements("pastSimple", "trans-home-ps-pc-01-target-b", [
        { position: 70 },
      ]),
    ],
    verbBlanks: [{ index: 1, validAnswers: ["was cooking"] }],
    hint: 'Use "was + -ing" and add an interrupting event.',
    explanation:
      'Past Continuous shows an action in progress when another event happened. The phone call provides that interruption.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  {
    id: "trans-home-fs-fpf-01",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Future Perfect",
    sourceSentence: "I will pay the rent tomorrow.",
    targetSentence: "By Friday, I will have paid the rent.",
    realLifeDialogue: {
      lineA: 'A: "When will you pay the rent?"',
      lineB: 'B: "Don\'t worry. By Friday, I will have paid it."',
    },
    sourceElements: buildCanonicalTimelineElements("futureSimple", "trans-home-fs-fpf-01-source"),
    targetElements: buildCanonicalTimelineElements("futurePerfect", "trans-home-fs-fpf-01-target", [
      { position: 65 },
    ]),
    verbBlanks: [{ index: 4, validAnswers: ["will have paid"] }],
    hint: 'Use "will have + past participle" with "by" to show completion before a deadline.',
    explanation:
      'Future Perfect shows the action as complete before a future point. "By Friday" sets that deadline.',
    difficulty: 2,
    tenseCategory: "perfect",
  },
  // ============================================================
  // NEW EVERYDAY CONTENT - Health/Doctor
  // ============================================================
  {
    id: "trans-health-ps-pp-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Perfect",
    sourceSentence: "I took my medicine this morning.",
    targetSentence: "I have taken my medicine already today.",
    realLifeDialogue: {
      lineA: 'A: "Did you remember your pills?"',
      lineB: 'B: "Yes, I have taken them already."',
    },
    sourceElements: buildCanonicalTimelineElements("pastSimple", "trans-health-ps-pp-01-source", [
      { position: 50 },
    ]),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-health-ps-pp-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have taken"] }],
    hint: 'Use "have + past participle" with "already" to show the action is complete and relevant now.',
    explanation:
      'Present Perfect with "already" shows completion with present relevance — no need to take the medicine again.',
    difficulty: 1,
    tenseCategory: "perfect",
  },
  {
    id: "trans-health-prs-prc-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Continuous",
    sourceSentence: "He exercises every morning.",
    targetSentence: "He is exercising in the gym right now.",
    realLifeDialogue: {
      lineA: 'A: "Where is your brother?"',
      lineB: 'B: "He is exercising in the gym right now."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-health-prs-prc-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-health-prs-prc-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["is exercising"] }],
    hint: 'Use "is + -ing" to show the action happening at this moment.',
    explanation:
      'The source describes a health routine. The target shows the same action in progress now.',
    difficulty: 1,
    tenseCategory: "continuous",
  },
  // ============================================================
  // SIMPLE — extra questions to fill out the category pool
  // ============================================================
  {
    id: "trans-prs-ps-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Past Simple",
    sourceSentence: "They play soccer on weekends.",
    targetSentence: "They played soccer last weekend.",
    realLifeDialogue: {
      lineA: 'A: "Did they play soccer recently?"',
      lineB: 'B: "Yes, they played last weekend."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-ps-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-prs-ps-01-target",
      [{ position: 40 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["played"] }],
    hint: 'Add a specific past time and use the past form of the verb.',
    explanation:
      'The source describes a habit. The target describes one completed event in the past — same verb, just in its past form.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-ps-fs-01",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Future Simple",
    sourceSentence: "She studied for the exam all night.",
    targetSentence: "She will study for the exam all night.",
    realLifeDialogue: {
      lineA: 'A: "Is she ready for the test tomorrow?"',
      lineB: 'B: "She will study for the exam all night."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-ps-fs-01-source",
      [{ position: 40 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-ps-fs-01-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["will study"] }],
    hint: 'Use "will + base verb" to move the same action into the future.',
    explanation:
      'The base verb stays the same (study). Only the time changes — "will" moves it forward to the future.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-fs-prs-01",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Present Simple",
    sourceSentence: "I will call you every day.",
    targetSentence: "I call you every day.",
    realLifeDialogue: {
      lineA: 'A: "Do you two stay in touch?"',
      lineB: 'B: "Yes, I call you every day."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fs-prs-01-source",
      [{ position: 65 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-fs-prs-01-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["call"] }],
    hint: 'Drop "will" and use the base verb to describe a routine that already happens.',
    explanation:
      'A future plan becomes an established routine. Remove "will" and use Present Simple — the verb itself does not change.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-prs-fs-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Future Simple",
    sourceSentence: "My mom picks me up from school every day.",
    targetSentence: "My mom will pick me up from school tomorrow.",
    realLifeDialogue: {
      lineA: 'A: "How are you getting home today?"',
      lineB: 'B: "My mom will pick me up after school."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-fs-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-prs-fs-01-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["will pick"] }],
    hint: 'Add "will" before the base verb to move a routine into a specific future event.',
    explanation:
      'The source describes an everyday habit. The target moves the same action to a specific future moment — add "will" and keep the base verb unchanged.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-fs-ps-01",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Past Simple",
    sourceSentence: "She will present her report next Friday.",
    targetSentence: "She presented her report last Friday.",
    realLifeDialogue: {
      lineA: 'A: "Did the presentation go well?"',
      lineB: 'B: "Yes — she presented her report last Friday and it went great."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fs-ps-01-source",
      [{ position: 65 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-fs-ps-01-target",
      [{ position: 35 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["presented"] }],
    hint: 'Remove "will" and use the past form of the verb to move the event into the finished past.',
    explanation:
      'Future Simple describes what will happen. Past Simple reports what already happened — drop "will" and change the verb to its past form.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-prs-ps-02",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Past Simple",
    sourceSentence: "The kids finish school at 3 p.m. every afternoon.",
    targetSentence: "The kids finished school at 3 p.m. yesterday.",
    realLifeDialogue: {
      lineA: 'A: "When did the kids get home?"',
      lineB: 'B: "They finished school at 3 p.m. yesterday."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-ps-02-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-prs-ps-02-target",
      [{ position: 40 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["finished"] }],
    hint: 'Change the verb to its past form to move a routine into a single completed past event.',
    explanation:
      'A daily routine (Present Simple) becomes one specific completed event (Past Simple). Only the verb form changes — nothing else.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-ps-prs-02",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Present Simple",
    sourceSentence: "The pharmacy closed at 6 p.m. when I was a student.",
    targetSentence: "The pharmacy closes at 6 p.m. every day.",
    realLifeDialogue: {
      lineA: 'A: "What time does the pharmacy close?"',
      lineB: 'B: "It closes at 6 p.m. every day."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-ps-prs-02-source",
      [{ position: 40 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-ps-prs-02-target"
    ),
    verbBlanks: [{ index: 2, validAnswers: ["closes"] }],
    hint: 'Use the base verb (+ -s for third person) to turn a past event into a current routine.',
    explanation:
      'A completed past situation becomes a current, ongoing fact. Present Simple uses the base verb — add -s for third person singular.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-ps-fs-02",
    type: "sentence-transformer",
    sourceTense: "Past Simple",
    targetTense: "Future Simple",
    sourceSentence: "The manager approved the budget last quarter.",
    targetSentence: "The manager will approve the budget next quarter.",
    realLifeDialogue: {
      lineA: 'A: "Has the budget been approved yet?"',
      lineB: 'B: "Not yet — the manager will approve it next quarter."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-ps-fs-02-source",
      [{ position: 40 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-ps-fs-02-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["will approve"] }],
    hint: 'Replace the past verb form with "will + base verb" to move the action into the future.',
    explanation:
      'Past Simple reports a completed event. Future Simple predicts or plans the same action in the future — use "will" and return the verb to its base form.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-prs-fs-neg-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Future Simple",
    sourceSentence: "He doesn't work on weekends.",
    targetSentence: "He won't work this weekend.",
    realLifeDialogue: {
      lineA: 'A: "Can we call him on Saturday?"',
      lineB: 'B: "He won\'t work this weekend, so yes."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-fs-neg-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-prs-fs-neg-01-target",
      [{ position: 65 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["won't work", "will not work"] }],
    hint: 'Replace "doesn\'t" with "won\'t" to shift a negative habit into a specific future.',
    explanation:
      'Negative Present Simple uses "doesn\'t + base verb." Negative Future Simple uses "won\'t + base verb." The main verb stays the same.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-prs-ps-neg-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Past Simple",
    sourceSentence: "She doesn't drive to work.",
    targetSentence: "She didn't drive to work last week.",
    realLifeDialogue: {
      lineA: 'A: "Did she take the bus last week?"',
      lineB: 'B: "Yes — she didn\'t drive to work at all last week."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-ps-neg-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastSimple",
      "trans-prs-ps-neg-01-target",
      [{ position: 40 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["didn't drive", "did not drive"] }],
    hint: 'Replace "doesn\'t" with "didn\'t" to move a negative routine into the finished past.',
    explanation:
      'Negative Present Simple uses "doesn\'t + base verb." Negative Past Simple uses "didn\'t + base verb." The main verb stays in base form — only the auxiliary changes.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  {
    id: "trans-fs-prs-02",
    type: "sentence-transformer",
    sourceTense: "Future Simple",
    targetTense: "Present Simple",
    sourceSentence: "I will visit my grandmother every Sunday when I move back home.",
    targetSentence: "I visit my grandmother every Sunday.",
    realLifeDialogue: {
      lineA: 'A: "Do you see your grandmother often?"',
      lineB: 'B: "Yes — I visit her every Sunday."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "futureSimple",
      "trans-fs-prs-02-source",
      [{ position: 65 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-fs-prs-02-target"
    ),
    verbBlanks: [{ index: 1, validAnswers: ["visit"] }],
    hint: 'Drop "will" and use the base verb — the future plan has become a current habit.',
    explanation:
      'A future intention becomes an established present routine. Drop "will" and use Present Simple — the base verb stays the same.',
    difficulty: 1,
    tenseCategory: "simple",
  },
  // ============================================================
  // PERFECT CONTINUOUS — extra questions
  // ============================================================
  {
    id: "trans-prc-ppc-new-01",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "She is teaching English at the community center.",
    targetSentence: "She has been teaching English at the community center for two years.",
    realLifeDialogue: {
      lineA: 'A: "Does she have teaching experience?"',
      lineB: 'B: "Yes — she has been teaching at the community center for two years."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prc-ppc-new-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-prc-ppc-new-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has been teaching"] }],
    hint: 'Add "has been" before the -ing verb and include a duration to show how long.',
    explanation:
      '"Is teaching" describes right now. "Has been teaching for two years" shows the activity started in the past and is still ongoing — adding the duration makes it Present Perfect Continuous.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-pp-ppc-new-01",
    type: "sentence-transformer",
    sourceTense: "Present Perfect",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "He has fixed computers for clients since he was a teenager.",
    targetSentence: "He has been fixing computers for clients since he was a teenager.",
    realLifeDialogue: {
      lineA: 'A: "How long has he done this kind of work?"',
      lineB: 'B: "He has been fixing computers since he was a teenager."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-pp-ppc-new-01-source",
      [{ position: 50 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-pp-ppc-new-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["has been fixing"] }],
    hint: 'Add "been" and change the verb to -ing to shift the focus from results to ongoing process.',
    explanation:
      '"Has fixed" focuses on the result or count of completions. "Has been fixing" emphasises the continuous, unbroken activity over time — same verb, just add "been" and -ing.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-ppc-pppc-01",
    type: "sentence-transformer",
    sourceTense: "Present Perfect Continuous",
    targetTense: "Past Perfect Continuous",
    sourceSentence: "She has been managing that team for three years.",
    targetSentence: "She had been managing that team for three years before her promotion.",
    realLifeDialogue: {
      lineA: 'A: "Had she led a team before the promotion?"',
      lineB: 'B: "Yes — she had been managing that team for three years."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-ppc-pppc-01-source",
      [{ position: 50 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastPerfectContinuous",
      "trans-ppc-pppc-01-target",
      [{ position: 35 }, { position: 55 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["had been managing"] }],
    hint: 'Change "has/have been" to "had been" to move the whole activity into the past.',
    explanation:
      '"Has been managing" runs from the past up to now. "Had been managing" shifts the same ongoing activity entirely into the past — everything before a specific past moment.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-prs-ppc-new-01",
    type: "sentence-transformer",
    sourceTense: "Present Simple",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "My brother runs every morning before work.",
    targetSentence: "My brother has been running every morning for the past year.",
    realLifeDialogue: {
      lineA: 'A: "Is your brother still into running?"',
      lineB: 'B: "Yes — he has been running every morning for the past year."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentSimpleHabit",
      "trans-prs-ppc-new-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-prs-ppc-new-01-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["has been running"] }],
    hint: 'Add "has been" and -ing, plus a duration phrase, to show the habit has been going on since a past point.',
    explanation:
      'Present Simple describes a current habit with no start point. Present Perfect Continuous adds duration ("for the past year") — it tells us when the habit began and that it\'s still continuing.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-pc-ppc-new-01",
    type: "sentence-transformer",
    sourceTense: "Past Continuous",
    targetTense: "Past Perfect Continuous",
    sourceSentence: "They were arguing about the budget.",
    targetSentence: "They had been arguing about the budget for an hour before the meeting ended.",
    realLifeDialogue: {
      lineA: 'A: "What happened in that meeting?"',
      lineB: 'B: "They had been arguing about the budget for an hour before it ended."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "pastContinuous",
      "trans-pc-ppc-new-01-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "pastPerfectContinuous",
      "trans-pc-ppc-new-01-target",
      [{ position: 35 }, { position: 60 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["had been arguing"] }],
    hint: 'Change "were" to "had been" to show the activity was already going on before another past event.',
    explanation:
      'Past Continuous describes a background action at a past moment. Past Perfect Continuous adds the idea that the arguing started even earlier and continued up to another past event.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-prc-ppc-new-02",
    type: "sentence-transformer",
    sourceTense: "Present Continuous",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "The team is preparing for the presentation.",
    targetSentence: "The team has been preparing for the presentation all week.",
    realLifeDialogue: {
      lineA: 'A: "Are they ready?"',
      lineB: 'B: "Almost — the team has been preparing all week."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentContinuous",
      "trans-prc-ppc-new-02-source"
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-prc-ppc-new-02-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 2, validAnswers: ["has been preparing"] }],
    hint: 'Replace "is" with "has been" to add the duration from past to present.',
    explanation:
      '"Is preparing" only describes this moment. "Has been preparing all week" shows the activity started earlier in the week and has continued up to now.',
    difficulty: 1,
    tenseCategory: "perfect-continuous",
  },
  {
    id: "trans-pp-ppc-new-02",
    type: "sentence-transformer",
    sourceTense: "Present Perfect",
    targetTense: "Present Perfect Continuous",
    sourceSentence: "I have learned a lot at this job.",
    targetSentence: "I have been learning a lot at this job since I started.",
    realLifeDialogue: {
      lineA: 'A: "Do you like working there?"',
      lineB: 'B: "Yes — I have been learning so much since I started."',
    },
    sourceElements: buildCanonicalTimelineElements(
      "presentPerfect",
      "trans-pp-ppc-new-02-source",
      [{ position: 50 }]
    ),
    targetElements: buildCanonicalTimelineElements(
      "presentPerfectContinuous",
      "trans-pp-ppc-new-02-target",
      [{ position: 50 }]
    ),
    verbBlanks: [{ index: 1, validAnswers: ["have been learning"] }],
    hint: 'Add "been" and the -ing form to shift the focus from achievements to ongoing growth.',
    explanation:
      '"Have learned" describes completed results — knowledge gained. "Have been learning" emphasises the ongoing, continuous process of growing. Add "been" and change to -ing.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  },
];
