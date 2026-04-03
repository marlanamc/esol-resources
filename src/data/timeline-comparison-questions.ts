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
 * These items now foreground one prompt at a time so students must read the time
 * meaning carefully, then choose the timeline that actually matches it.
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
];
