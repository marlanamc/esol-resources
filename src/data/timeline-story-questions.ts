import type { StoryBuilderQuestion } from "@/types/activity";
import { buildCanonicalTimelineElements } from "./timeline-challenge-stamp-canon";

/**
 * Story Builder questions for the "Story Builder" challenge mode.
 *
 * Students complete a multi-sentence narrative, one tense at a time.
 * After each sentence, the timeline grows with new elements.
 * blanks: index is the 0-based word position in the sentence template split by spaces.
 * "___ (verb)" in the template marks where inputs appear.
 */
export const TIMELINE_STORY_QUESTIONS: StoryBuilderQuestion[] = [
  {
    id: "story-01",
    type: "story-builder",
    storyTitle: "Nina's Morning Commute",
    storyPrompt: "Tell the story of Nina's morning before she gets on the bus.",
    sentences: [
      {
        template: "Nina ___ (wake) up at 7 a.m.",
        targetTense: "Past Simple",
        elements: buildCanonicalTimelineElements("pastSimple", "story-01-s1", [
          { position: 20 },
        ]),
        blanks: [{ index: 1, validAnswers: ["woke"] }],
        contextHint: "A completed action at a specific time → Past Simple.",
      },
      {
        template: "While she ___ (shower), her phone ___ (ring).",
        targetTense: "Past Continuous + Past Simple",
        elements: [
          ...buildCanonicalTimelineElements("pastContinuous", "story-01-s2-a", [
            { position: 35 },
          ]),
          ...buildCanonicalTimelineElements("pastSimple", "story-01-s2-b", [
            { position: 50 },
          ]),
        ],
        blanks: [
          { index: 2, validAnswers: ["was showering"] },
          { index: 6, validAnswers: ["rang"] },
        ],
        contextHint:
          '"While" + ongoing action = Past Continuous. The interruption = Past Simple.',
      },
      {
        template: "By 8 a.m., she ___ (already finish) breakfast.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-01-s3", [
          { position: 40 },
          { position: 55 },
        ]),
        blanks: [{ index: 4, validAnswers: ["had already finished"] }],
        contextHint: '"By 8 a.m." = completed before a past reference point → Past Perfect.',
      },
      {
        template: "At 8:10, she ___ (walk) to the bus stop with her backpack.",
        targetTense: "Past Continuous",
        elements: buildCanonicalTimelineElements("pastContinuous", "story-01-s4", [
          { position: 70 },
        ]),
        blanks: [{ index: 3, validAnswers: ["was walking"] }],
        contextHint: "A specific moment in the past with an action in progress → Past Continuous.",
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("pastSimple", "story-01-full-a", [
        { position: 20 },
      ]),
      ...buildCanonicalTimelineElements("pastContinuous", "story-01-full-b", [
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "story-01-full-c", [
        { position: 50 },
      ]),
      ...buildCanonicalTimelineElements("pastPerfect", "story-01-full-d", [
        { position: 40 },
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("pastContinuous", "story-01-full-e", [
        { position: 70 },
      ]),
    ],
    difficulty: 2,
    tenseCategory: "mixed",
  },
  {
    id: "story-02",
    type: "story-builder",
    storyTitle: "Jordan's Interview Day",
    storyPrompt: "Follow Jordan through the timeline of a high-stakes interview day.",
    sentences: [
      {
        template: "Before the interview, Jordan ___ (prepare) for two weeks.",
        targetTense: "Past Perfect Continuous",
        elements: buildCanonicalTimelineElements(
          "pastPerfectContinuous",
          "story-02-s1",
          [{ position: 50 }, { position: 35 }]
        ),
        blanks: [{ index: 4, validAnswers: ["had been preparing"] }],
        contextHint:
          'Duration ("for two weeks") leading up to a past event → Past Perfect Continuous.',
      },
      {
        template: "When he arrived, the interviewer ___ (already start) without him.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-02-s2", [
          { position: 30 },
          { position: 50 },
        ]),
        blanks: [{ index: 5, validAnswers: ["had already started"] }],
        contextHint:
          '"Already" + "when he arrived" = the starting happened before the arriving → Past Perfect.',
      },
      {
        template: "At that moment, Jordan ___ (wait) in the lobby and ___ (feel) nervous.",
        targetTense: "Past Continuous",
        elements: buildCanonicalTimelineElements("pastContinuous", "story-02-s3"),
        blanks: [
          { index: 4, validAnswers: ["was waiting"] },
          { index: 10, validAnswers: ["was feeling"] },
        ],
        contextHint: '"At that moment" keeps the narration in the past and shows two actions in progress.',
      },
      {
        template: "By the end of the day, Jordan ___ (receive) an offer.",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-02-s4", [
          { position: 65 },
        ]),
        blanks: [{ index: 7, validAnswers: ["will have received"] }],
        contextHint: '"By the end of the day" = future deadline → Future Perfect.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("pastPerfectContinuous", "story-02-full-a", [
        { position: 50 },
        { position: 35 },
      ]),
      ...buildCanonicalTimelineElements("pastPerfect", "story-02-full-b", [
        { position: 30 },
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("pastContinuous", "story-02-full-c"),
      ...buildCanonicalTimelineElements("futurePerfect", "story-02-full-d", [
        { position: 65 },
      ]),
    ],
    difficulty: 3,
    tenseCategory: "mixed",
  },
  {
    id: "story-03",
    type: "story-builder",
    storyTitle: "Tasha at the Market",
    storyPrompt: "Describe Tasha's Saturday at the neighborhood market.",
    sentences: [
      {
        template: "Every Saturday, Tasha and her friends ___ (visit) the market together.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-03-s1"
        ),
        blanks: [{ index: 6, validAnswers: ["visit"] }],
        contextHint: '"Every Saturday" = regular habit → Present Simple.',
      },
      {
        template: "Right now, they ___ (browse) the produce stands near the entrance.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-03-s2"),
        blanks: [{ index: 3, validAnswers: ["are browsing"] }],
        contextHint: '"Right now" = ongoing action at this moment → Present Continuous.',
      },
      {
        template: "So far today, Tasha ___ (buy) three bags of fresh fruit.",
        targetTense: "Present Perfect",
        elements: buildCanonicalTimelineElements("presentPerfect", "story-03-s3"),
        blanks: [{ index: 4, validAnswers: ["has bought"] }],
        contextHint: '"So far today" = completed actions with present relevance → Present Perfect.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-03-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-03-full-b"),
      ...buildCanonicalTimelineElements("presentPerfect", "story-03-full-c"),
    ],
    difficulty: 1,
    tenseCategory: "mixed",
  },
];
