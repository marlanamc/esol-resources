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
    realLifeDialogue: {
      lineA: 'A: "Why was Nina late getting out the door?"',
      lineB: 'B: "Her whole morning was rushed before she got on the bus."',
    },
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
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-02-s4", [
          { position: 30 },
          { position: 65 },
        ]),
        blanks: [{ index: 7, validAnswers: ["had received"] }],
        contextHint: 'The story is set in the past. "By the end of the day" = a deadline that already passed → Past Perfect.',
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
      ...buildCanonicalTimelineElements("pastPerfect", "story-02-full-d", [
        { position: 30 },
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
  {
    id: "story-04",
    type: "story-builder",
    storyTitle: "Luis's Science Fair",
    storyPrompt: "Follow Luis from his preparation to the end of the science fair.",
    sentences: [
      {
        template: "For three nights before the fair, Luis ___ (build) his model volcano.",
        targetTense: "Past Perfect Continuous",
        elements: buildCanonicalTimelineElements(
          "pastPerfectContinuous",
          "story-04-s1",
          [{ position: 45 }, { position: 30 }]
        ),
        blanks: [{ index: 7, validAnswers: ["had been building"] }],
        contextHint:
          'A duration leading up to a later past event points to Past Perfect Continuous.',
      },
      {
        template: "When the judges arrived, he ___ (explain) the experiment to a small crowd.",
        targetTense: "Past Continuous",
        elements: [
          ...buildCanonicalTimelineElements("pastContinuous", "story-04-s2-a", [
            { position: 55 },
          ]),
          ...buildCanonicalTimelineElements("pastSimple", "story-04-s2-b", [
            { position: 60 },
          ]),
        ],
        blanks: [{ index: 5, validAnswers: ["was explaining"] }],
        contextHint:
          '"When the judges arrived" gives a past interruption, so the background action takes Past Continuous.',
      },
      {
        template: "By lunchtime, Luis ___ (win) first prize for his project.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-04-s3", [
          { position: 30 },
          { position: 65 },
        ]),
        blanks: [{ index: 3, validAnswers: ["had won"] }],
        contextHint:
          'The story is set in the past. "By lunchtime" = a deadline that already passed in the story → Past Perfect.',
      },
      {
        template: "Right now, his family ___ (celebrate) the news at his favorite restaurant.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-04-s4"),
        blanks: [{ index: 4, validAnswers: ["is celebrating", "are celebrating"] }],
        contextHint: '"Right now" means the celebration is happening at this moment.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("pastPerfectContinuous", "story-04-full-a", [
        { position: 45 },
        { position: 30 },
      ]),
      ...buildCanonicalTimelineElements("pastContinuous", "story-04-full-b", [
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "story-04-full-c", [
        { position: 60 },
      ]),
      ...buildCanonicalTimelineElements("pastPerfect", "story-04-full-d", [
        { position: 30 },
        { position: 65 },
      ]),
      ...buildCanonicalTimelineElements("presentContinuous", "story-04-full-e"),
    ],
    difficulty: 3,
    tenseCategory: "mixed",
  },
  {
    id: "story-05",
    type: "story-builder",
    storyTitle: "Maya's Community Garden",
    storyPrompt: "Build Maya's story across her usual garden routine and today's progress.",
    sentences: [
      {
        template: "Before summer starts each year, Maya ___ (plant) tomatoes with her neighbors.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-05-s1"
        ),
        blanks: [{ index: 6, validAnswers: ["plants"] }],
        contextHint:
          'A repeated seasonal routine can still use Present Simple, and "before" provides the explicit time cue this story bank expects.',
      },
      {
        template: "Right now, she ___ (work) in the garden after school this week.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-05-s2"),
        blanks: [{ index: 3, validAnswers: ["is working"] }],
        contextHint:
          'A temporary arrangement around the present, even with repeated actions, can take Present Continuous.',
      },
      {
        template: "So far today, Maya and her brother ___ (fill) six new flower beds.",
        targetTense: "Present Perfect",
        elements: buildCanonicalTimelineElements("presentPerfect", "story-05-s3"),
        blanks: [{ index: 7, validAnswers: ["have filled"] }],
        contextHint:
          '"So far" counts completed results connected to now, so Present Perfect fits.',
      },
      {
        template: "By the end of the month, they ___ (create) a space for the whole neighborhood.",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-05-s4", [
          { position: 70 },
        ]),
        blanks: [{ index: 7, validAnswers: ["will have created"] }],
        contextHint:
          '"By the end of the month" gives a future completion point, which calls for Future Perfect.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-05-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-05-full-b"),
      ...buildCanonicalTimelineElements("presentPerfect", "story-05-full-c"),
      ...buildCanonicalTimelineElements("futurePerfect", "story-05-full-d", [
        { position: 70 },
      ]),
    ],
    difficulty: 2,
    tenseCategory: "mixed",
  },
  {
    id: "story-06",
    type: "story-builder",
    storyTitle: "Omar's Family Trip",
    storyPrompt: "Track Omar's family from their usual travel habits to tomorrow's departure.",
    sentences: [
      {
        template: "Every summer, Omar's family ___ (drive) to Maine before school starts again.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-06-s1"
        ),
        blanks: [{ index: 4, validAnswers: ["drives"] }],
        contextHint:
          'A repeated family routine takes Present Simple, and "before" keeps the time cue explicit.',
      },
      {
        template: "Right now, Omar ___ (pack) snacks while his sister checks the map.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-06-s2"),
        blanks: [{ index: 3, validAnswers: ["is packing"] }],
        contextHint: '"Right now" shows the action is happening at this moment.',
      },
      {
        template: "When they left last year, they ___ (forget) the hotel reservation at home.",
        targetTense: "Past Simple",
        elements: buildCanonicalTimelineElements("pastSimple", "story-06-s3", [
          { position: 50 },
        ]),
        blanks: [{ index: 6, validAnswers: ["forgot"] }],
        contextHint:
          'A finished event with "last year" and "when" takes Past Simple.',
      },
      {
        template: "By noon tomorrow, they ___ (reach) the first rest stop on the highway.",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-06-s4", [
          { position: 70 },
        ]),
        blanks: [{ index: 4, validAnswers: ["will have reached"] }],
        contextHint:
          '"By noon tomorrow" gives a future deadline, which makes Future Perfect the right fit.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-06-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-06-full-b"),
      ...buildCanonicalTimelineElements("pastSimple", "story-06-full-c", [
        { position: 50 },
      ]),
      ...buildCanonicalTimelineElements("futurePerfect", "story-06-full-d", [
        { position: 70 },
      ]),
    ],
    difficulty: 2,
    tenseCategory: "mixed",
  },
  {
    id: "story-07",
    type: "story-builder",
    storyTitle: "Rosa's Busy Shift",
    storyPrompt: "Follow Rosa through a fast workplace shift at the bakery.",
    sentences: [
      {
        template: "Every morning before sunrise, Rosa ___ (unlock) the bakery for the first customers.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-07-s1"
        ),
        blanks: [{ index: 5, validAnswers: ["unlocks"] }],
        contextHint:
          'A repeated work routine uses Present Simple, and "before" provides the time cue.',
      },
      {
        template: "Right now, she ___ (decorate) cupcakes while the ovens stay warm.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-07-s2"),
        blanks: [{ index: 3, validAnswers: ["is decorating"] }],
        contextHint: '"Right now" marks the action as in progress.',
      },
      {
        template: "When the delivery truck arrived earlier, Rosa ___ (already prepare) the bread shelves.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-07-s3", [
          { position: 35 },
          { position: 55 },
        ]),
        blanks: [{ index: 7, validAnswers: ["had already prepared"] }],
        contextHint:
          '"Already" plus a later past event points to Past Perfect for the earlier completed action.',
      },
      {
        template: "By noon, the bakery ___ (sell) most of the fresh rolls.",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-07-s4", [
          { position: 70 },
        ]),
        blanks: [{ index: 4, validAnswers: ["will have sold"] }],
        contextHint:
          '"By noon" gives a future completion point, so use Future Perfect.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-07-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-07-full-b"),
      ...buildCanonicalTimelineElements("pastPerfect", "story-07-full-c", [
        { position: 35 },
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("futurePerfect", "story-07-full-d", [
        { position: 70 },
      ]),
    ],
    difficulty: 2,
    tenseCategory: "mixed",
  },
  {
    id: "story-08",
    type: "story-builder",
    storyTitle: "Elena's Appointment Day",
    storyPrompt: "Build Elena's travel-and-appointment day from home to the clinic.",
    sentences: [
      {
        template: "Before breakfast on checkup days, Elena ___ (drink) a glass of water and reviews her notes.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-08-s1"
        ),
        blanks: [{ index: 6, validAnswers: ["drinks"] }],
        contextHint:
          'A usual health routine takes Present Simple, and "before" keeps the cue explicit.',
      },
      {
        template: "Right now, she ___ (wait) for the bus outside the pharmacy.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-08-s2"),
        blanks: [{ index: 3, validAnswers: ["is waiting"] }],
        contextHint: '"Right now" means the action is happening at this moment.',
      },
      {
        template: "When Elena arrived last month, the nurse ___ (already print) her forms.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-08-s3", [
          { position: 35 },
          { position: 55 },
        ]),
        blanks: [{ index: 7, validAnswers: ["had already printed"] }],
        contextHint:
          '"Already" before another past event signals Past Perfect.',
      },
      {
        template: "By 3 p.m. today, the doctor ___ (call) Elena with the test results.",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-08-s4", [
          { position: 70 },
        ]),
        blanks: [{ index: 6, validAnswers: ["will have called"] }],
        contextHint:
          '"By 3 p.m. today" sets a future deadline for a completed action.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-08-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-08-full-b"),
      ...buildCanonicalTimelineElements("pastPerfect", "story-08-full-c", [
        { position: 35 },
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("futurePerfect", "story-08-full-d", [
        { position: 70 },
      ]),
    ],
    difficulty: 2,
    tenseCategory: "mixed",
  },
  {
    id: "story-09",
    type: "story-builder",
    storyTitle: "Darnell at the Community Center",
    storyPrompt: "Build Darnell's community-services day with a question and a negative form included.",
    sentences: [
      {
        template: "Before the doors open each morning, Darnell ___ (check) the sign-in desk for new forms.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-09-s1"
        ),
        blanks: [{ index: 7, validAnswers: ["checks"] }],
        contextHint:
          'A repeated community-center routine takes Present Simple, and "before" gives the time cue.',
      },
      {
        template: "Right now, he ___ (not answer) the phone because he is helping a family in person.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-09-s2"),
        blanks: [{ index: 3, validAnswers: ["is not answering", "isn't answering"] }],
        contextHint:
          'A present action that is temporarily not happening can still use Present Continuous in the negative.',
      },
      {
        template: "When the supervisor arrived earlier, Darnell ___ (already finish) the supply list.",
        targetTense: "Past Perfect",
        elements: buildCanonicalTimelineElements("pastPerfect", "story-09-s3", [
          { position: 35 },
          { position: 55 },
        ]),
        blanks: [{ index: 6, validAnswers: ["had already finished"] }],
        contextHint:
          '"Already" plus a later past event points to Past Perfect.',
      },
      {
        template: "By 5 p.m., why ___ the outreach nurse ___ (leave) the center already?",
        targetTense: "Future Perfect",
        elements: buildCanonicalTimelineElements("futurePerfect", "story-09-s4", [
          { position: 70 },
        ]),
        blanks: [
          { index: 4, validAnswers: ["will"] },
          { index: 8, validAnswers: ["have left"] },
        ],
        contextHint:
          'A future question about a completed action before a deadline uses Future Perfect.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-09-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-09-full-b"),
      ...buildCanonicalTimelineElements("pastPerfect", "story-09-full-c", [
        { position: 35 },
        { position: 55 },
      ]),
      ...buildCanonicalTimelineElements("futurePerfect", "story-09-full-d", [
        { position: 70 },
      ]),
    ],
    difficulty: 3,
    tenseCategory: "mixed",
  },
  {
    id: "story-10",
    type: "story-builder",
    storyTitle: "Ben's School Morning",
    storyPrompt: "Use short daily-life sentences with a negative and a question.",
    sentences: [
      {
        template: "Before school, Ben ___ (eat) breakfast at home.",
        targetTense: "Present Simple",
        elements: buildCanonicalTimelineElements(
          "presentSimpleHabit",
          "story-10-s1"
        ),
        blanks: [{ index: 3, validAnswers: ["eats"] }],
        contextHint:
          'A daily routine uses Present Simple, and "before" gives the time cue.',
      },
      {
        template: "Right now, he ___ (not wear) his shoes yet.",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-10-s2"),
        blanks: [{ index: 3, validAnswers: ["is not wearing", "isn't wearing"] }],
        contextHint:
          'A negative action happening now can use Present Continuous.',
      },
      {
        template: "When his mom called, Ben ___ (look) for his bag.",
        targetTense: "Past Continuous",
        elements: [
          ...buildCanonicalTimelineElements("pastContinuous", "story-10-s3-a", [
            { position: 50 },
          ]),
          ...buildCanonicalTimelineElements("pastSimple", "story-10-s3-b", [
            { position: 70 },
          ]),
        ],
        blanks: [{ index: 5, validAnswers: ["was looking"] }],
        contextHint:
          '"When" plus a past interruption often takes Past Continuous for the background action.',
      },
      {
        template: "Why ___ Ben ___ (run) to the bus stop right now?",
        targetTense: "Present Continuous",
        elements: buildCanonicalTimelineElements("presentContinuous", "story-10-s4"),
        blanks: [
          { index: 1, validAnswers: ["is"] },
          { index: 3, validAnswers: ["running"] },
        ],
        contextHint:
          'A present question about an action happening now uses Present Continuous.',
      },
    ],
    fullTimelineElements: [
      ...buildCanonicalTimelineElements("presentSimpleHabit", "story-10-full-a"),
      ...buildCanonicalTimelineElements("presentContinuous", "story-10-full-b"),
      ...buildCanonicalTimelineElements("pastContinuous", "story-10-full-c", [
        { position: 50 },
      ]),
      ...buildCanonicalTimelineElements("pastSimple", "story-10-full-d", [
        { position: 70 },
      ]),
      ...buildCanonicalTimelineElements("presentContinuous", "story-10-full-e"),
    ],
    difficulty: 1,
    tenseCategory: "mixed",
  },
];
