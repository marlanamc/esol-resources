import type {
  TenseCategory,
  TenseComparisonPromptType,
  TenseComparisonQuestion,
} from "@/types/activity";
import {
  buildCanonicalTimelineElements,
  type TimelineStampCanonName,
} from "./timeline-challenge-stamp-canon";

type TimelineOverride = Parameters<typeof buildCanonicalTimelineElements>[2];

interface ComparisonConfig {
  id: string;
  promptType?: TenseComparisonPromptType;
  promptText: string;
  correctOption: "A" | "B";
  tenseA: string;
  tenseB: string;
  canonA: TimelineStampCanonName;
  canonB: TimelineStampCanonName;
  optionA: string;
  optionB: string;
  confusionExplanation: string;
  keyDifference: string;
  realLifeDialogue?: TenseComparisonQuestion["realLifeDialogue"];
  difficulty: 1 | 2 | 3;
  tenseCategory: TenseCategory;
  overridesA?: TimelineOverride;
  overridesB?: TimelineOverride;
  elementsA?: TenseComparisonQuestion["elementsA"];
  elementsB?: TenseComparisonQuestion["elementsB"];
}

function createComparisonQuestion(config: ComparisonConfig): TenseComparisonQuestion {
  return {
    id: config.id,
    type: "tense-comparison",
    promptType: config.promptType ?? "sentence-to-timeline",
    promptText: config.promptText,
    correctOption: config.correctOption,
    tenseA: config.tenseA,
    tenseB: config.tenseB,
    elementsA:
      config.elementsA ??
      buildCanonicalTimelineElements(config.canonA, `${config.id}-a`, config.overridesA),
    elementsB:
      config.elementsB ??
      buildCanonicalTimelineElements(config.canonB, `${config.id}-b`, config.overridesB),
    optionA: { sentence: config.optionA },
    optionB: { sentence: config.optionB },
    confusionExplanation: config.confusionExplanation,
    keyDifference: config.keyDifference,
    realLifeDialogue: config.realLifeDialogue,
    difficulty: config.difficulty,
    tenseCategory: config.tenseCategory,
  };
}

/**
 * Tense Comparison questions for the "Spot the Difference" challenge mode.
 *
 * Students see one sentence (or timeline) and pick the timeline (or sentence)
 * that correctly matches its tense meaning.
 *
 * ─── AUTHORING RULES ───────────────────────────────────────────────────────
 *
 * 1. PROMPT TYPES — set via promptType (default: "sentence-to-timeline"):
 *    - "sentence-to-timeline": student reads a sentence, picks the matching timeline
 *    - "timeline-to-sentence": student reads a timeline, picks the matching sentence
 *    Mix both types across the question bank to vary the direction of reasoning.
 *
 * 2. MEANINGFUL CONTRAST — optionA and optionB must represent genuinely
 *    confusable tenses, not obviously different ones.
 *    ✅  Present Perfect vs. Past Simple (both describe past events)
 *    ❌  Present Perfect vs. Future Simple (no real confusion between these)
 *
 * 3. confusionExplanation — one sentence describing WHY students mix up the
 *    two options. Focus on the surface similarity, not the correct answer.
 *    ✅  "Both describe past eating, but only one keeps the result connected to now."
 *    ❌  "Present Perfect uses have/has." (that's grammar explanation, not confusion)
 *
 * 4. keyDifference — the deciding rule students should walk away with.
 *    Name the signal word or structural clue that separates the two tenses.
 *    ✅  '"Already/just/yet" without a finished time → Present Perfect.'
 *
 * 5. correctOption — must be "A" or "B". Double-check this matches canonA/canonB.
 *
 * ───────────────────────────────────────────────────────────────────────────
 */
export const TIMELINE_COMPARISON_QUESTIONS: TenseComparisonQuestion[] = [
  createComparisonQuestion({
    id: "comp-pp-ps-01",
    promptText: "I have already eaten.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "I have already eaten.",
    optionB: "I ate at noon.",
    confusionExplanation:
      "Both describe past eating, but only one keeps the result connected to now.",
    keyDifference:
      '"Already/just/yet" without a finished past time usually points to Present Perfect. A clock or calendar time points to Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "Do you want lunch now?"',
      lineB: 'B: "No thanks. I have already eaten."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-pp-ps-02",
    promptText: "She has lost her keys.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Present Perfect",
    canonA: "pastSimple",
    canonB: "presentPerfect",
    optionA: "She lost her keys yesterday.",
    optionB: "She has lost her keys.",
    confusionExplanation:
      "Learners often hear the same event and miss whether the speaker means a finished past moment or a problem that matters now.",
    keyDifference:
      'A specific finished time like "yesterday" closes the event. Without that time marker, the lost keys still matter now, so Present Perfect fits.',
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-pp-ps-03",
    promptText: "We saw that movie last summer.",
    correctOption: "B",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "We have seen that movie three times.",
    optionB: "We saw that movie last summer.",
    confusionExplanation:
      "Both can describe experience, but only one includes a finished past time.",
    keyDifference:
      'Counted life experience with no finished date leans toward Present Perfect. "Last summer" makes it Past Simple.',
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-pc-ppc-01",
    promptText: "She was studying when he called.",
    correctOption: "A",
    tenseA: "Past Continuous",
    tenseB: "Past Perfect Continuous",
    canonA: "pastContinuous",
    canonB: "pastPerfectContinuous",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-pc-ppc-01-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-pc-ppc-01-a-dot", [
        { position: 80 },
      ]),
    ],
    optionA: "She was studying when he called.",
    optionB: "She had been studying for two hours when he called.",
    confusionExplanation:
      "Both show an action in progress before a past event, so students need the duration clue to separate them.",
    keyDifference:
      'Past Continuous shows background in progress. Past Perfect Continuous adds an earlier start and often includes "for/since" duration before the past event.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-pc-ppc-02",
    promptText: "She had been studying for two hours when he called.",
    correctOption: "B",
    tenseA: "Past Continuous",
    tenseB: "Past Perfect Continuous",
    canonA: "pastContinuous",
    canonB: "pastPerfectContinuous",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-pc-ppc-02-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-pc-ppc-02-a-dot", [
        { position: 75 },
      ]),
    ],
    optionA: "She was studying when he called.",
    optionB: "She had been studying for two hours when he called.",
    confusionExplanation:
      'The action is in progress in both sentences, but "for two hours" changes the timeline.',
    keyDifference:
      'A measured duration before another past action signals Past Perfect Continuous, not just Past Continuous.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-pc-ppc-03",
    promptText: "He had been waiting for thirty minutes when the bus arrived.",
    correctOption: "B",
    tenseA: "Past Continuous",
    tenseB: "Past Perfect Continuous",
    canonA: "pastContinuous",
    canonB: "pastPerfectContinuous",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-pc-ppc-03-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-pc-ppc-03-a-dot", [
        { position: 70 },
      ]),
    ],
    optionA: "He was waiting when the bus arrived.",
    optionB: "He had been waiting for thirty minutes when the bus arrived.",
    confusionExplanation:
      "Students often notice the interruption but miss the extra duration meaning.",
    keyDifference:
      'If the waiting started earlier and lasted up to the arrival, use Past Perfect Continuous. If it only describes the background moment, use Past Continuous.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-prsc-ppc-01",
    promptText: "I am making dinner right now.",
    correctOption: "A",
    tenseA: "Present Continuous",
    tenseB: "Present Perfect Continuous",
    canonA: "presentContinuous",
    canonB: "presentPerfectContinuous",
    optionA: "I am making dinner right now.",
    optionB: "I have been making dinner since 5:30.",
    confusionExplanation:
      "Both use an -ing form and both can be true now, but only one looks back to an earlier start.",
    keyDifference:
      'Present Continuous focuses on now. Present Perfect Continuous means the action started before now and is still continuing.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-prsc-ppc-02",
    promptText: "I have been making dinner since 5:30.",
    correctOption: "B",
    tenseA: "Present Continuous",
    tenseB: "Present Perfect Continuous",
    canonA: "presentContinuous",
    canonB: "presentPerfectContinuous",
    optionA: "I am making dinner right now.",
    optionB: "I have been making dinner since 5:30.",
    confusionExplanation:
      'The action is happening now in both options, so the word "since" has to do the real work.',
    keyDifference:
      '"Since" and "for" show duration from the past up to now, which makes Present Perfect Continuous the better match.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-prsc-ppc-03",
    promptText: "She has been waiting for the bus for twenty minutes.",
    correctOption: "B",
    tenseA: "Present Continuous",
    tenseB: "Present Perfect Continuous",
    canonA: "presentContinuous",
    canonB: "presentPerfectContinuous",
    optionA: "She is waiting for the bus.",
    optionB: "She has been waiting for the bus for twenty minutes.",
    confusionExplanation:
      "The topic is identical, so the only difference is whether the speaker includes duration.",
    keyDifference:
      "Duration up to now needs Present Perfect Continuous. A simple description of the current moment uses Present Continuous.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-ps-pc-01",
    promptText: "It rained last night.",
    correctOption: "A",
    tenseA: "Past Simple",
    tenseB: "Past Continuous",
    canonA: "pastSimple",
    canonB: "pastContinuous",
    optionA: "It rained last night.",
    optionB: "It was raining when I left.",
    confusionExplanation:
      "Both are about the past, but one is a completed event and the other is background in progress.",
    keyDifference:
      "Past Simple treats the rain as a finished event. Past Continuous shows the rain as the background around another action.",
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-ps-pc-02",
    promptText: "It was raining when I left.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Past Continuous",
    canonA: "pastSimple",
    canonB: "pastContinuous",
    optionA: "It rained last night.",
    optionB: "It was raining when I left.",
    confusionExplanation:
      "Students often hear the same verb and miss whether it is the main event or the background.",
    keyDifference:
      "If another past action cuts into the scene, Past Continuous usually draws the background timeline.",
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-ps-pc-03",
    promptText: "They were watching a movie when the lights went out.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Past Continuous",
    canonA: "pastSimple",
    canonB: "pastContinuous",
    elementsA: [
      ...buildCanonicalTimelineElements("pastSimple", "comp-ps-pc-03-a-1", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "comp-ps-pc-03-a-2", [
        { position: 75 },
      ]),
    ],
    elementsB: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-ps-pc-03-b"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-ps-pc-03-b-dot", [
        { position: 75 },
      ]),
    ],
    optionA: "They watched a movie and then went home.",
    optionB: "They were watching a movie when the lights went out.",
    confusionExplanation:
      "Both mention two past actions, but the timeline changes depending on whether the actions are sequential or interruptive.",
    keyDifference:
      "Two completed actions in order use Past Simple. An action in progress interrupted by a shorter event uses Past Continuous plus Past Simple.",
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-fs-fc-01",
    promptText: "I will call you tonight.",
    correctOption: "A",
    tenseA: "Future Simple",
    tenseB: "Future Continuous",
    canonA: "futureSimple",
    canonB: "futureContinuous",
    optionA: "I will call you tonight.",
    optionB: "I will be working at 8 tonight.",
    confusionExplanation:
      "Both look forward, but one predicts a single future event and the other shows an action in progress at a future moment.",
    keyDifference:
      "Future Simple marks the event itself. Future Continuous shows what will be in progress at that future time.",
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-fs-fc-02",
    promptText: "I will be working at 8 tonight.",
    correctOption: "B",
    tenseA: "Future Simple",
    tenseB: "Future Continuous",
    canonA: "futureSimple",
    canonB: "futureContinuous",
    optionA: "I will call you tonight.",
    optionB: "I will be working at 8 tonight.",
    confusionExplanation:
      'Students often treat all "will" forms the same and ignore the future reference point.',
    keyDifference:
      'A named future moment like "at 8 tonight" often signals Future Continuous if the action is already in progress then.',
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-fs-fc-03",
    promptText: "At this time next week, she will be flying to Chicago.",
    correctOption: "B",
    tenseA: "Future Simple",
    tenseB: "Future Continuous",
    canonA: "futureSimple",
    canonB: "futureContinuous",
    optionA: "She will fly to Chicago next week.",
    optionB: "At this time next week, she will be flying to Chicago.",
    confusionExplanation:
      "Both refer to next week, so students need to decide whether the sentence means one event or an action in progress at a future point.",
    keyDifference:
      '"At this time next week" creates a future viewpoint. That viewpoint makes Future Continuous the better fit.',
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-pp-ppc-01",
    promptText: "I have cleaned the kitchen.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Present Perfect Continuous",
    canonA: "presentPerfect",
    canonB: "presentPerfectContinuous",
    optionA: "I have cleaned the kitchen.",
    optionB: "I have been cleaning the kitchen all morning.",
    confusionExplanation:
      "Both connect the past to now, but one emphasizes the finished result and the other emphasizes the process.",
    keyDifference:
      "Present Perfect highlights completion or result. Present Perfect Continuous highlights duration, effort, or an unfinished activity.",
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-pp-ppc-02",
    promptText: "I have been cleaning the kitchen all morning.",
    correctOption: "B",
    tenseA: "Present Perfect",
    tenseB: "Present Perfect Continuous",
    canonA: "presentPerfect",
    canonB: "presentPerfectContinuous",
    optionA: "I have cleaned the kitchen.",
    optionB: "I have been cleaning the kitchen all morning.",
    confusionExplanation:
      "The topic is the same, so the student has to focus on result versus duration.",
    keyDifference:
      '"All morning" points to duration and process, so Present Perfect Continuous is the better match.',
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-pp-ppc-03",
    promptText: "She has written three emails.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Present Perfect Continuous",
    canonA: "presentPerfect",
    canonB: "presentPerfectContinuous",
    optionA: "She has written three emails.",
    optionB: "She has been writing emails since 9.",
    confusionExplanation:
      "Both can be true in the same situation, but only one counts completed results.",
    keyDifference:
      "If the speaker counts finished output, Present Perfect fits better. If the speaker highlights the ongoing activity, use Present Perfect Continuous.",
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-ppf-ps-01",
    promptText: "By the time we arrived, the meeting had started.",
    correctOption: "A",
    tenseA: "Past Perfect",
    tenseB: "Past Simple",
    canonA: "pastPerfect",
    canonB: "pastSimple",
    optionA: "By the time we arrived, the meeting had started.",
    optionB: "The meeting started at 9.",
    confusionExplanation:
      "Both are about a past starting point, but one event is positioned before another past event.",
    keyDifference:
      "Past Perfect goes further back from a past reference point. Past Simple just states the past event itself.",
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-ppf-ps-02",
    promptText: "The meeting started at 9.",
    correctOption: "B",
    tenseA: "Past Perfect",
    tenseB: "Past Simple",
    canonA: "pastPerfect",
    canonB: "pastSimple",
    optionA: "By the time we arrived, the meeting had started.",
    optionB: "The meeting started at 9.",
    confusionExplanation:
      "Learners often overuse Past Perfect even when there is only one clear past event to report.",
    keyDifference:
      "If there is no recent past reference point to compare against, Past Simple is usually enough.",
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-ppf-ps-03",
    promptText: "She finished the course and then got the job.",
    correctOption: "B",
    tenseA: "Past Perfect",
    tenseB: "Past Simple",
    canonA: "pastPerfect",
    canonB: "pastSimple",
    elementsB: [
      ...buildCanonicalTimelineElements("pastSimple", "comp-ppf-ps-03-b-1", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "comp-ppf-ps-03-b-2", [
        { position: 70 },
      ]),
    ],
    optionA: "She got the job because she had finished the course.",
    optionB: "She finished the course and then got the job.",
    confusionExplanation:
      "Both mention the same two events, but one uses Past Perfect because one event is background to the other.",
    keyDifference:
      "Past Perfect packages the earlier event as prior background. Two events told in simple sequence can stay in Past Simple.",
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fpf-fs-01",
    promptText: "By Friday, I will have finished the report.",
    correctOption: "A",
    tenseA: "Future Perfect",
    tenseB: "Future Simple",
    canonA: "futurePerfect",
    canonB: "futureSimple",
    optionA: "By Friday, I will have finished the report.",
    optionB: "I will finish the report on Friday.",
    confusionExplanation:
      "Both point to Friday, but one means completed before the deadline and the other means the action happens that day.",
    keyDifference:
      '"By + future time" looks back from a future deadline, so Future Perfect fits. "On + day" names when the event happens, so Future Simple fits.',
    difficulty: 3,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fpf-fs-02",
    promptText: "I will finish the report on Friday.",
    correctOption: "B",
    tenseA: "Future Perfect",
    tenseB: "Future Simple",
    canonA: "futurePerfect",
    canonB: "futureSimple",
    optionA: "By Friday, I will have finished the report.",
    optionB: "I will finish the report on Friday.",
    confusionExplanation:
      "Students often memorize the deadline word and miss whether the completion is before the point or at the point.",
    keyDifference:
      '"On Friday" gives the event date. "By Friday" gives the deadline before which the action will be complete.',
    difficulty: 3,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fpf-fs-03",
    promptText: "By 2030, she will have graduated.",
    correctOption: "A",
    tenseA: "Future Perfect",
    tenseB: "Future Simple",
    canonA: "futurePerfect",
    canonB: "futureSimple",
    optionA: "By 2030, she will have graduated.",
    optionB: "She will graduate next year.",
    confusionExplanation:
      "Both describe a future graduation, but only one uses a future point as the viewpoint.",
    keyDifference:
      "Future Perfect looks back from a later future deadline. Future Simple just predicts the event.",
    difficulty: 3,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fpf-fc-01",
    promptText: "By 6 p.m., she will have written the email.",
    correctOption: "A",
    tenseA: "Future Perfect",
    tenseB: "Future Continuous",
    canonA: "futurePerfect",
    canonB: "futureContinuous",
    optionA: "By 6 p.m., she will have written the email.",
    optionB: "At 6 p.m., she will be writing the email.",
    confusionExplanation:
      "Both focus on 6 p.m., but one means the task is complete before that point and the other means the task is still in progress then.",
    keyDifference:
      '"By 6 p.m." means complete before the deadline. "At 6 p.m." means that is the moment when the action is in progress.',
    difficulty: 3,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fpf-fc-02",
    promptText: "At 6 p.m., she will be writing the email.",
    correctOption: "B",
    tenseA: "Future Perfect",
    tenseB: "Future Continuous",
    canonA: "futurePerfect",
    canonB: "futureContinuous",
    optionA: "By 6 p.m., she will have written the email.",
    optionB: "At 6 p.m., she will be writing the email.",
    confusionExplanation:
      "The deadline and the future viewpoint are close together, so the preposition does the real meaning work.",
    keyDifference:
      'Future Continuous shows what is happening at that future moment. Future Perfect shows what is already complete by that moment.',
    difficulty: 3,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-ppf-ppc-01",
    promptText: "He had been working there for ten years before he retired.",
    correctOption: "B",
    tenseA: "Past Perfect",
    tenseB: "Past Perfect Continuous",
    canonA: "pastPerfect",
    canonB: "pastPerfectContinuous",
    optionA: "He had worked there before he retired.",
    optionB: "He had been working there for ten years before he retired.",
    confusionExplanation:
      "Both place the job before retirement, but only one highlights duration leading up to the retirement point.",
    keyDifference:
      "Past Perfect states the earlier completed fact. Past Perfect Continuous emphasizes how long that earlier activity had been happening.",
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-ppf-ppc-02",
    promptText: "She had finished the project before the client arrived.",
    correctOption: "A",
    tenseA: "Past Perfect",
    tenseB: "Past Perfect Continuous",
    canonA: "pastPerfect",
    canonB: "pastPerfectContinuous",
    optionA: "She had finished the project before the client arrived.",
    optionB: "She had been working on the project before the client arrived.",
    confusionExplanation:
      "Students often confuse a completed earlier result with an earlier activity that was still in progress.",
    keyDifference:
      "Finished result before another past event points to Past Perfect. Earlier duration or ongoing effort points to Past Perfect Continuous.",
    difficulty: 3,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-prs-prsc-01",
    promptText: "He usually takes the train to work.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Present Continuous",
    canonA: "presentSimpleHabit",
    canonB: "presentContinuous",
    optionA: "He usually takes the train to work.",
    optionB: "He is taking the train today because his car is in the shop.",
    confusionExplanation:
      "Both sentences describe the same action, but only one shows a routine instead of a temporary situation.",
    keyDifference:
      'Words like "usually" and routine habits point to Present Simple. A temporary action happening around now points to Present Continuous.',
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-prs-prsc-02",
    promptText: "He is taking the train today because his car is in the shop.",
    correctOption: "B",
    tenseA: "Present Simple",
    tenseB: "Present Continuous",
    canonA: "presentSimpleHabit",
    canonB: "presentContinuous",
    optionA: "He takes the train to work every day.",
    optionB: "He is taking the train today because his car is in the shop.",
    confusionExplanation:
      "Students may focus on the repeated action and miss the temporary reason that changes the tense choice.",
    keyDifference:
      '"Today" plus a temporary reason makes the action current and temporary, so Present Continuous fits better than a general habit.',
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-pp-ppc-01",
    promptText: "I have written three emails this morning.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Present Perfect Continuous",
    canonA: "presentPerfect",
    canonB: "presentPerfectContinuous",
    optionA: "I have written three emails this morning.",
    optionB: "I have been writing emails all morning.",
    confusionExplanation:
      "Both connect past work to now, but one counts finished results and the other emphasizes duration and activity.",
    keyDifference:
      "Present Perfect is better for completed results or totals. Present Perfect Continuous is better for ongoing duration or repeated effort.",
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-pp-ppc-02",
    promptText: "I have been writing emails all morning.",
    correctOption: "B",
    tenseA: "Present Perfect",
    tenseB: "Present Perfect Continuous",
    canonA: "presentPerfect",
    canonB: "presentPerfectContinuous",
    optionA: "I have written six emails this morning.",
    optionB: "I have been writing emails all morning.",
    confusionExplanation:
      'The sentences are close in meaning, so students need to notice that "all morning" stresses the ongoing process.',
    keyDifference:
      'Duration expressions like "all morning" usually push the meaning toward Present Perfect Continuous unless the sentence is clearly counting finished results.',
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-ps-ppf-01",
    promptText: "By the time we reached the station, the train had left.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Past Perfect",
    canonA: "pastSimple",
    canonB: "pastPerfect",
    optionA: "By the time we reached the station, the train left.",
    optionB: "By the time we reached the station, the train had left.",
    confusionExplanation:
      "Both mention two past events, but only one clearly marks which event happened first.",
    keyDifference:
      'When one past event happened before another past event, Past Perfect marks the earlier action. Plain Past Simple alone can blur that order.',
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-fc-fs-01",
    promptText: "At 10 tomorrow, we will be flying over the ocean.",
    correctOption: "A",
    tenseA: "Future Continuous",
    tenseB: "Future Simple",
    canonA: "futureContinuous",
    canonB: "futureSimple",
    optionA: "At 10 tomorrow, we will be flying over the ocean.",
    optionB: "We will fly to Miami tomorrow morning.",
    confusionExplanation:
      "Both refer to tomorrow, but only one zooms in on a specific future moment and shows the action in progress then.",
    keyDifference:
      'Future Continuous shows an action in progress at a specific future time. Future Simple simply states or predicts the future action.',
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-prs-ps-01",
    promptText: "My aunt walks to the library every Saturday.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "My aunt walks to the library every Saturday.",
    optionB: "My aunt walked to the library last Saturday.",
    confusionExplanation:
      "Both sentences describe the same kind of action, but only one is a regular habit and the other is a finished past event.",
    keyDifference:
      'Repeated routine markers like "every Saturday" point to Present Simple. A finished time like "last Saturday" points to Past Simple.',
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-prs-ps-02",
    promptText: "My aunt walked to the library last Saturday.",
    correctOption: "B",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "My aunt walks to the library every Saturday.",
    optionB: "My aunt walked to the library last Saturday.",
    confusionExplanation:
      "Students may focus on the repeated action word and miss the closed past time that changes the tense meaning.",
    keyDifference:
      'A closed past time frame makes the action a finished past event, so Past Simple is the correct match.',
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-fs-fpf-04",
    promptText: "The nurse will call you tomorrow afternoon.",
    correctOption: "B",
    tenseA: "Future Perfect",
    tenseB: "Future Simple",
    canonA: "futurePerfect",
    canonB: "futureSimple",
    optionA: "By tomorrow afternoon, the nurse will have called you.",
    optionB: "The nurse will call you tomorrow afternoon.",
    confusionExplanation:
      "Both point to tomorrow afternoon, but one names the event time and the other treats it as a deadline already passed by then.",
    keyDifference:
      '"Will call tomorrow afternoon" schedules the event. "Will have called by tomorrow afternoon" means the call is complete before that future point.',
    difficulty: 2,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-work-prsc-prs-01",
    promptText: "Luis is covering the front desk this week.",
    correctOption: "A",
    tenseA: "Present Continuous",
    tenseB: "Present Simple",
    canonA: "presentContinuous",
    canonB: "presentSimpleHabit",
    optionA: "Luis is covering the front desk this week.",
    optionB: "Luis covers the front desk every Monday.",
    confusionExplanation:
      "Both describe the same job task, but one is a temporary arrangement and the other is a regular duty.",
    keyDifference:
      '"This week" suggests a temporary present situation, which fits Present Continuous. A repeated schedule like "every Monday" fits Present Simple.',
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-home-pp-ps-01",
    promptText: "We have already cleaned the kitchen.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "We have already cleaned the kitchen.",
    optionB: "We cleaned the kitchen after breakfast.",
    confusionExplanation:
      "Both describe the same home chore, but only one leaves the result connected to the present moment.",
    keyDifference:
      '"Already" without a closed past time keeps the result relevant now, so Present Perfect fits better than Past Simple.',
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-travel-fc-fs-02",
    promptText: "At 7 tomorrow, they will be boarding the train.",
    correctOption: "A",
    tenseA: "Future Continuous",
    tenseB: "Future Simple",
    canonA: "futureContinuous",
    canonB: "futureSimple",
    optionA: "At 7 tomorrow, they will be boarding the train.",
    optionB: "They will board the train tomorrow morning.",
    confusionExplanation:
      "Both refer to the trip tomorrow, but one focuses on a future moment in progress and the other simply states the event.",
    keyDifference:
      'Future Continuous shows what will be happening at a specific future time. Future Simple just announces the future action.',
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-health-neg-pp-ps-01",
    promptText: "She hasn't taken the medicine yet.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "She hasn't taken the medicine yet.",
    optionB: "She didn't take the medicine last night.",
    confusionExplanation:
      "Both are negative, but only one describes an unfinished situation connected to now.",
    keyDifference:
      '"Yet" in a negative sentence usually points to Present Perfect because the expected action is still open now. A closed time like "last night" makes it Past Simple.',
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-question-pc-ps-01",
    promptText: "What were the nurses doing when the lights went out?",
    correctOption: "A",
    tenseA: "Past Continuous",
    tenseB: "Past Simple",
    canonA: "pastContinuous",
    canonB: "pastSimple",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-question-pc-ps-01-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-question-pc-ps-01-a-dot", [
        { position: 75 },
      ]),
    ],
    optionA: "What were the nurses doing when the lights went out?",
    optionB: "What did the nurses do when the lights went out?",
    confusionExplanation:
      "Both are questions about the same past event, but one asks about the background action in progress and the other asks about a finished action.",
    keyDifference:
      'Past Continuous asks about the action already in progress at that past moment. Past Simple asks about one completed action.',
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Texting & Phone
  // ============================================================
  createComparisonQuestion({
    id: "comp-text-pp-ps-01",
    promptText: "I have already texted her about the party.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "I have already texted her about the party.",
    optionB: "I texted her about the party at noon.",
    confusionExplanation:
      "Both describe sending a text, but one keeps the action connected to now while the other closes the event at a specific past time.",
    keyDifference:
      '"Already" without a clock time keeps the result relevant now. "At noon" closes the event in the past.',
    realLifeDialogue: {
      lineA: 'A: "Should I text Maria about the party?"',
      lineB: 'B: "No need. I have already texted her."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-text-prc-prs-01",
    promptText: "He is texting his mom right now.",
    correctOption: "A",
    tenseA: "Present Continuous",
    tenseB: "Present Simple",
    canonA: "presentContinuous",
    canonB: "presentSimpleHabit",
    optionA: "He is texting his mom right now.",
    optionB: "He texts his mom every day.",
    confusionExplanation:
      "Both describe the same action, but one is happening at this moment and the other is a regular routine.",
    keyDifference:
      '"Right now" signals an action in progress. "Every day" signals a repeated habit.',
    realLifeDialogue: {
      lineA: 'A: "Is Kevin busy?"',
      lineB: 'B: "Yeah, he is texting his mom right now."',
    },
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Food & Restaurants
  // ============================================================
  createComparisonQuestion({
    id: "comp-food-pp-ps-01",
    promptText: "We have already ordered our food.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "We have already ordered our food.",
    optionB: "We ordered our food five minutes ago.",
    confusionExplanation:
      "Both describe ordering, but one keeps the result relevant now and the other places the action at a specific past moment.",
    keyDifference:
      '"Already" without a time marker means the action affects now. "Five minutes ago" closes the event in the past.',
    realLifeDialogue: {
      lineA: 'A: "Are you ready to order?"',
      lineB: 'B: "Thanks, but we have already ordered."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-food-pc-ps-01",
    promptText: "The waiter was bringing our food when the power went out.",
    correctOption: "A",
    tenseA: "Past Continuous",
    tenseB: "Past Simple",
    canonA: "pastContinuous",
    canonB: "pastSimple",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-food-pc-ps-01-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-food-pc-ps-01-a-dot", [
        { position: 75 },
      ]),
    ],
    optionA: "The waiter was bringing our food when the power went out.",
    optionB: "The waiter brought our food at 7 p.m.",
    confusionExplanation:
      "Both describe the waiter's action, but one shows it in progress when interrupted and the other shows it as completed.",
    keyDifference:
      '"When + interruption" needs Past Continuous for the background action. A specific time for a completed event uses Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "What happened at the restaurant?"',
      lineB: 'B: "The waiter was bringing our food when the power went out!"',
    },
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-food-prc-prs-01",
    promptText: "I am eating healthier this month.",
    correctOption: "A",
    tenseA: "Present Continuous",
    tenseB: "Present Simple",
    canonA: "presentContinuous",
    canonB: "presentSimpleHabit",
    optionA: "I am eating healthier this month.",
    optionB: "I eat vegetables every day.",
    confusionExplanation:
      "Both describe eating habits, but one is a temporary change and the other is a permanent routine.",
    keyDifference:
      '"This month" suggests a temporary situation, which fits Present Continuous. "Every day" suggests a regular habit, which fits Present Simple.',
    realLifeDialogue: {
      lineA: 'A: "Want some pizza?"',
      lineB: 'B: "No thanks. I am eating healthier this month."',
    },
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Grocery Shopping
  // ============================================================
  createComparisonQuestion({
    id: "comp-shop-pp-ps-01",
    promptText: "I have already bought milk.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "I have already bought milk.",
    optionB: "I bought milk yesterday.",
    confusionExplanation:
      "Both describe buying milk, but one has current relevance and the other is a closed past event.",
    keyDifference:
      '"Already" without a finished time means the action matters now (no need to buy more). "Yesterday" closes the event.',
    realLifeDialogue: {
      lineA: 'A: "Should I get milk at the store?"',
      lineB: 'B: "No, I have already bought some."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-shop-fpf-fs-01",
    promptText: "By 9 p.m., the store will have closed.",
    correctOption: "A",
    tenseA: "Future Perfect",
    tenseB: "Future Simple",
    canonA: "futurePerfect",
    canonB: "futureSimple",
    optionA: "By 9 p.m., the store will have closed.",
    optionB: "The store will close at 9 p.m.",
    confusionExplanation:
      "Both refer to 9 p.m., but one means the closing is complete before that point and the other means it happens at that exact time.",
    keyDifference:
      '"By 9 p.m." = complete before that time (Future Perfect). "At 9 p.m." = the action happens at that time (Future Simple).',
    realLifeDialogue: {
      lineA: 'A: "Can we go to the store at 9?"',
      lineB: 'B: "No, by 9 p.m. the store will have closed."',
    },
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Transportation
  // ============================================================
  createComparisonQuestion({
    id: "comp-transit-pp-ps-01",
    promptText: "The bus has already left.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "The bus has already left.",
    optionB: "The bus left five minutes ago.",
    confusionExplanation:
      "Both describe the bus leaving, but one connects to now (we missed it) and the other gives a specific past time.",
    keyDifference:
      '"Already" without a time marker keeps the result relevant now. "Five minutes ago" is a specific past time.',
    realLifeDialogue: {
      lineA: 'A: "Did we make it in time?"',
      lineB: 'B: "No, the bus has already left."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-transit-fc-fs-01",
    promptText: "At this time tomorrow, I will be driving to work.",
    correctOption: "A",
    tenseA: "Future Continuous",
    tenseB: "Future Simple",
    canonA: "futureContinuous",
    canonB: "futureSimple",
    optionA: "At this time tomorrow, I will be driving to work.",
    optionB: "I will drive to work tomorrow.",
    confusionExplanation:
      "Both describe driving tomorrow, but one focuses on the action in progress at a future moment.",
    keyDifference:
      '"At this time tomorrow" imagines a future viewpoint with an action in progress — Future Continuous. Future Simple just states the plan.',
    realLifeDialogue: {
      lineA: 'A: "Can I call you at 8 tomorrow?"',
      lineB: 'B: "I\'ll be driving then. Call me after 9."',
    },
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-transit-ppf-ps-01",
    promptText: "The train had already left when we arrived at the station.",
    correctOption: "A",
    tenseA: "Past Perfect",
    tenseB: "Past Simple",
    canonA: "pastPerfect",
    canonB: "pastSimple",
    optionA: "The train had already left when we arrived at the station.",
    optionB: "The train left at 9 a.m.",
    confusionExplanation:
      "Both describe the train leaving, but one positions the leaving before another past event.",
    keyDifference:
      '"When we arrived" creates a past reference point. The earlier action (leaving) takes Past Perfect.',
    realLifeDialogue: {
      lineA: 'A: "Did you catch the train?"',
      lineB: 'B: "No, it had already left when we got there."',
    },
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Weather
  // ============================================================
  createComparisonQuestion({
    id: "comp-weather-ppc-prc-01",
    promptText: "It has been raining all day.",
    correctOption: "A",
    tenseA: "Present Perfect Continuous",
    tenseB: "Present Continuous",
    canonA: "presentPerfectContinuous",
    canonB: "presentContinuous",
    optionA: "It has been raining all day.",
    optionB: "It is raining right now.",
    confusionExplanation:
      "Both describe rain, but one emphasizes duration from the past to now and the other focuses only on now.",
    keyDifference:
      '"All day" shows duration from the past up to now — Present Perfect Continuous. "Right now" focuses only on the present moment — Present Continuous.',
    realLifeDialogue: {
      lineA: 'A: "Why are the streets so flooded?"',
      lineB: 'B: "It has been raining all day!"',
    },
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-weather-pc-ps-01",
    promptText: "It was snowing when I woke up.",
    correctOption: "A",
    tenseA: "Past Continuous",
    tenseB: "Past Simple",
    canonA: "pastContinuous",
    canonB: "pastSimple",
    elementsA: [
      ...buildCanonicalTimelineElements("pastContinuous", "comp-weather-pc-ps-01-a"),
      ...buildCanonicalTimelineElements("pastSimple", "comp-weather-pc-ps-01-a-dot", [
        { position: 70 },
      ]),
    ],
    optionA: "It was snowing when I woke up.",
    optionB: "It snowed last night.",
    confusionExplanation:
      "Both describe snow in the past, but one shows the snow as background to another action.",
    keyDifference:
      '"When I woke up" provides a past moment. The snow was the ongoing background — Past Continuous. "Last night" is a completed event — Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "What was the weather like this morning?"',
      lineB: 'B: "It was snowing when I woke up."',
    },
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Work/Job
  // ============================================================
  createComparisonQuestion({
    id: "comp-work-pp-ps-01",
    promptText: "I have already finished my shift.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "I have already finished my shift.",
    optionB: "I finished my shift at 5 p.m.",
    confusionExplanation:
      "Both describe finishing work, but one has current relevance (I'm free now) and the other gives a specific past time.",
    keyDifference:
      '"Already" without a time means the result matters now. "At 5 p.m." closes the event at a specific past time.',
    realLifeDialogue: {
      lineA: 'A: "Are you still at work?"',
      lineB: 'B: "No, I have already finished my shift."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-work-ppc-prc-01",
    promptText: "He has been working overtime all week.",
    correctOption: "A",
    tenseA: "Present Perfect Continuous",
    tenseB: "Present Continuous",
    canonA: "presentPerfectContinuous",
    canonB: "presentContinuous",
    optionA: "He has been working overtime all week.",
    optionB: "He is working overtime tonight.",
    confusionExplanation:
      "Both describe overtime, but one emphasizes duration up to now and the other focuses on a current or near-future action.",
    keyDifference:
      '"All week" shows duration from the past to now — Present Perfect Continuous. "Tonight" focuses on a specific present/near-future time.',
    realLifeDialogue: {
      lineA: 'A: "Why is Carlos so tired?"',
      lineB: 'B: "He has been working overtime all week."',
    },
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Family at Home
  // ============================================================
  createComparisonQuestion({
    id: "comp-home-prc-prs-01",
    promptText: "The kids are doing homework right now.",
    correctOption: "A",
    tenseA: "Present Continuous",
    tenseB: "Present Simple",
    canonA: "presentContinuous",
    canonB: "presentSimpleHabit",
    optionA: "The kids are doing homework right now.",
    optionB: "The kids do homework every afternoon.",
    confusionExplanation:
      "Both describe homework, but one is happening at this moment and the other is a daily routine.",
    keyDifference:
      '"Right now" = action in progress at this moment (Present Continuous). "Every afternoon" = regular habit (Present Simple).',
    realLifeDialogue: {
      lineA: 'A: "Can the kids come play?"',
      lineB: 'B: "Not yet. They are doing homework right now."',
    },
    difficulty: 1,
    tenseCategory: "continuous",
  }),
  createComparisonQuestion({
    id: "comp-home-ppf-ps-01",
    promptText: "Mom had already made dinner when I got home.",
    correctOption: "A",
    tenseA: "Past Perfect",
    tenseB: "Past Simple",
    canonA: "pastPerfect",
    canonB: "pastSimple",
    optionA: "Mom had already made dinner when I got home.",
    optionB: "Mom made dinner at 6 p.m.",
    confusionExplanation:
      "Both describe making dinner, but one positions the cooking before another past event.",
    keyDifference:
      '"When I got home" creates a past reference point. The earlier action (cooking) takes Past Perfect.',
    realLifeDialogue: {
      lineA: 'A: "Did you help cook dinner?"',
      lineB: 'B: "No, Mom had already made it when I got home."',
    },
    difficulty: 2,
    tenseCategory: "perfect",
  }),
  // ============================================================
  // NEW EVERYDAY CONTENT - Health/Doctor
  // ============================================================
  createComparisonQuestion({
    id: "comp-health-pp-ps-02",
    promptText: "She has already taken her medicine.",
    correctOption: "A",
    tenseA: "Present Perfect",
    tenseB: "Past Simple",
    canonA: "presentPerfect",
    canonB: "pastSimple",
    optionA: "She has already taken her medicine.",
    optionB: "She took her medicine an hour ago.",
    confusionExplanation:
      "Both describe taking medicine, but one has current relevance (no need to remind her) and the other gives a specific past time.",
    keyDifference:
      '"Already" keeps the result relevant now — no need to take it again. "An hour ago" closes the event in the past.',
    realLifeDialogue: {
      lineA: 'A: "Should I remind Grandma to take her pills?"',
      lineB: 'B: "No need. She has already taken them."',
    },
    difficulty: 1,
    tenseCategory: "perfect",
  }),
  createComparisonQuestion({
    id: "comp-health-fc-fs-01",
    promptText: "At 3 p.m., the doctor will be examining patients.",
    correctOption: "A",
    tenseA: "Future Continuous",
    tenseB: "Future Simple",
    canonA: "futureContinuous",
    canonB: "futureSimple",
    optionA: "At 3 p.m., the doctor will be examining patients.",
    optionB: "The doctor will see you at 3 p.m.",
    confusionExplanation:
      "Both refer to 3 p.m., but one shows an action in progress at that future time and the other schedules an appointment.",
    keyDifference:
      '"At 3 p.m." + action in progress = Future Continuous. A scheduled event at a specific time can use Future Simple.',
    realLifeDialogue: {
      lineA: 'A: "Can I call the doctor at 3?"',
      lineB: 'B: "She\'ll be busy. At 3 p.m. she will be examining patients."',
    },
    difficulty: 2,
    tenseCategory: "continuous",
  }),
  // ============================================================
  // SIMPLE — extra questions
  // ============================================================
  createComparisonQuestion({
    id: "comp-simple-01",
    promptText: "She teaches yoga at the gym on Monday evenings.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "She teaches yoga at the gym on Monday evenings.",
    optionB: "She taught yoga at the gym last Monday evening.",
    confusionExplanation:
      "Both sentences use the same verb and setting — the only difference is whether the routine is current or finished.",
    keyDifference:
      '"Monday evenings" (repeated plural) signals an ongoing routine → Present Simple. "Last Monday evening" (specific finished time) closes the event → Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "Does she still teach yoga?"',
      lineB: 'B: "Yes — she teaches every Monday evening."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-02",
    promptText: "He walked to school every day as a child.",
    correctOption: "B",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "He walks to work every day.",
    optionB: "He walked to school every day as a child.",
    confusionExplanation:
      "Both describe a regular habit with the same verb — students may miss the time frame that closes one in the past.",
    keyDifference:
      '"As a child" closes the habit in a finished period → Past Simple. No time marker means the habit is current → Present Simple.',
    realLifeDialogue: {
      lineA: 'A: "Did he grow up nearby?"',
      lineB: 'B: "Yes — he walked to school every day as a child."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-03",
    promptText: "I will call my mom tonight.",
    correctOption: "A",
    tenseA: "Future Simple",
    tenseB: "Present Simple",
    canonA: "futureSimple",
    canonB: "presentSimpleHabit",
    optionA: "I will call my mom tonight.",
    optionB: "I call my mom every Sunday.",
    confusionExplanation:
      "Both involve calling mom — but one is a specific future intention and the other is a weekly habit.",
    keyDifference:
      '"Tonight" + "will" = a specific future plan. "Every Sunday" = a recurring routine → Present Simple.',
    realLifeDialogue: {
      lineA: 'A: "Are you going to call your mom?"',
      lineB: 'B: "Yes — I will call her tonight."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-04",
    promptText: "The pharmacy opens at 8 a.m. every day.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Future Simple",
    canonA: "presentSimpleHabit",
    canonB: "futureSimple",
    optionA: "The pharmacy opens at 8 a.m. every day.",
    optionB: "The new pharmacy will open next month.",
    confusionExplanation:
      "Both describe a pharmacy opening — but one is a daily fact and the other is a future event.",
    keyDifference:
      '"Every day" = a current scheduled fact → Present Simple (even though it\'s future each day). "Next month" + "will" = an upcoming event → Future Simple.',
    realLifeDialogue: {
      lineA: 'A: "What time does the pharmacy open?"',
      lineB: 'B: "It opens at 8 every morning."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-05",
    promptText: "The school cafeteria doesn't serve breakfast.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "The school cafeteria doesn't serve breakfast.",
    optionB: "The school cafeteria didn't serve breakfast last year.",
    confusionExplanation:
      "Both are negatives about the same fact — students need to notice whether it is still true now or was true in the past.",
    keyDifference:
      'No time marker = the fact is current → Present Simple. "Last year" closes it in a finished period → Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "Can we eat breakfast at school?"',
      lineB: 'B: "No — the cafeteria doesn\'t serve breakfast."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-06",
    promptText: "The train leaves at 6:15 every evening.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Future Simple",
    canonA: "presentSimpleHabit",
    canonB: "futureSimple",
    optionA: "The train leaves at 6:15 every evening.",
    optionB: "The train will leave at 6:15 this evening.",
    confusionExplanation:
      "Both mention 6:15 — the difference is whether this is a fixed timetable or a specific upcoming departure.",
    keyDifference:
      'Timetables and schedules use Present Simple even for future times. "Will leave this evening" focuses on one specific upcoming departure.',
    realLifeDialogue: {
      lineA: 'A: "When does the train leave?"',
      lineB: 'B: "It leaves at 6:15 every evening."',
    },
    difficulty: 2,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-07",
    promptText: "I missed the meeting yesterday.",
    correctOption: "A",
    tenseA: "Past Simple",
    tenseB: "Future Simple",
    canonA: "pastSimple",
    canonB: "futureSimple",
    optionA: "I missed the meeting yesterday.",
    optionB: "I will miss the meeting tomorrow.",
    confusionExplanation:
      "Same verb, same situation — only the time marker and tense change.",
    keyDifference:
      '"Yesterday" = a completed past event → Past Simple. "Tomorrow" + "will" = a future event or warning → Future Simple.',
    realLifeDialogue: {
      lineA: 'A: "Were you at the meeting?"',
      lineB: 'B: "No — I missed it yesterday."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-08",
    promptText: "My landlord fixes small problems in the apartment himself.",
    correctOption: "A",
    tenseA: "Present Simple",
    tenseB: "Past Simple",
    canonA: "presentSimpleHabit",
    canonB: "pastSimple",
    optionA: "My landlord fixes small problems in the apartment himself.",
    optionB: "My landlord fixed the broken pipe last week.",
    confusionExplanation:
      "Both describe the landlord fixing things — the difference is a general habit versus one specific completed event.",
    keyDifference:
      'No time marker = a current habit or general truth → Present Simple. "Last week" = one specific completed event → Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "Is your landlord helpful?"',
      lineB: 'B: "Yes — he fixes small problems himself."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-09",
    promptText: "He will retire next year.",
    correctOption: "A",
    tenseA: "Future Simple",
    tenseB: "Present Simple",
    canonA: "futureSimple",
    canonB: "presentSimpleHabit",
    optionA: "He will retire next year.",
    optionB: "He retires at 65 according to company policy.",
    confusionExplanation:
      "Both describe retirement — one is a personal plan and the other is a company rule.",
    keyDifference:
      '"Next year" + "will" = a specific future plan. A company rule or general policy uses Present Simple with no "will."',
    realLifeDialogue: {
      lineA: 'A: "Is Mr. Lim leaving soon?"',
      lineB: 'B: "Yes — he will retire next year."',
    },
    difficulty: 2,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-10",
    promptText: "She lived in Chicago when she was a student.",
    correctOption: "A",
    tenseA: "Past Simple",
    tenseB: "Present Simple",
    canonA: "pastSimple",
    canonB: "presentSimpleHabit",
    optionA: "She lived in Chicago when she was a student.",
    optionB: "She lives in Chicago with her family.",
    confusionExplanation:
      "Same verb, same city — students must notice whether the situation is closed in the past or true right now.",
    keyDifference:
      '"When she was a student" closes the situation in a finished period → Past Simple. No time marker = currently true → Present Simple.',
    realLifeDialogue: {
      lineA: 'A: "Where did she go to university?"',
      lineB: 'B: "She lived in Chicago when she was a student."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  createComparisonQuestion({
    id: "comp-simple-11",
    promptText: "The manager will announce the results tomorrow morning.",
    correctOption: "A",
    tenseA: "Future Simple",
    tenseB: "Present Simple",
    canonA: "futureSimple",
    canonB: "presentSimpleHabit",
    optionA: "The manager will announce the results tomorrow morning.",
    optionB: "The manager announces the results every quarter.",
    confusionExplanation:
      "Both describe the manager announcing results — the difference is a one-time upcoming event versus a regular pattern.",
    keyDifference:
      '"Tomorrow morning" + "will" = one specific upcoming event → Future Simple. "Every quarter" = a recurring routine → Present Simple.',
    realLifeDialogue: {
      lineA: 'A: "When do we find out?"',
      lineB: 'B: "The manager will announce the results tomorrow morning."',
    },
    difficulty: 1,
    tenseCategory: "simple",
  }),
  // ============================================================
  // PERFECT CONTINUOUS — extra questions
  // ============================================================
  createComparisonQuestion({
    id: "comp-ppc-ps-01",
    promptText: "She has been trying to sleep for hours, but the baby keeps crying.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Present Perfect Continuous",
    canonA: "pastSimple",
    canonB: "presentPerfectContinuous",
    optionA: "She tried to sleep but the baby kept crying.",
    optionB: "She has been trying to sleep for hours, but the baby keeps crying.",
    confusionExplanation:
      "Same scenario — exhausted parent, crying baby — but one closes the story as a finished memory and the other keeps it alive right now.",
    keyDifference:
      '"Has been trying…keeps crying" = the situation is still happening now, unresolved. Past Simple closes the scene — it\'s over.',
    realLifeDialogue: {
      lineA: 'A: "How is she doing?"',
      lineB: 'B: "Not great — she has been trying to sleep for hours but the baby keeps crying."',
    },
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-ppc-pppc-01",
    promptText: "He has been waiting at the clinic all morning.",
    correctOption: "B",
    tenseA: "Past Perfect Continuous",
    tenseB: "Present Perfect Continuous",
    canonA: "pastPerfectContinuous",
    canonB: "presentPerfectContinuous",
    optionA: "He had been waiting at the clinic all morning before they finally called his name.",
    optionB: "He has been waiting at the clinic all morning.",
    confusionExplanation:
      "Both describe a long wait at the clinic — the difference is whether the waiting is still going on or ended at a past moment.",
    keyDifference:
      '"Has been waiting" = still there, still waiting now → Present Perfect Continuous. "Had been waiting…before they called" = the wait ended at a past point → Past Perfect Continuous.',
    realLifeDialogue: {
      lineA: 'A: "Is your dad still at the clinic?"',
      lineB: 'B: "Yes — he has been waiting there all morning."',
    },
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
  createComparisonQuestion({
    id: "comp-ppc-ps-02",
    promptText: "He has been looking for a new job for six months.",
    correctOption: "B",
    tenseA: "Past Simple",
    tenseB: "Present Perfect Continuous",
    canonA: "pastSimple",
    canonB: "presentPerfectContinuous",
    optionA: "He looked for a job for six months and finally found one.",
    optionB: "He has been looking for a new job for six months.",
    confusionExplanation:
      "Both describe six months of job searching — but one ends with success and the other is still ongoing.",
    keyDifference:
      '"Has been looking" = still searching, no result yet → Present Perfect Continuous. "Looked…and found" = the search is over, story closed → Past Simple.',
    realLifeDialogue: {
      lineA: 'A: "Any luck with the job search?"',
      lineB: 'B: "Not yet — he has been looking for six months."',
    },
    difficulty: 2,
    tenseCategory: "perfect-continuous",
  }),
];
