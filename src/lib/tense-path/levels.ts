import {
  buildCanonicalTimelineElements,
  type TimelineStampCanonName,
} from "@/data/timeline-challenge-stamp-canon";
import { POINTS } from "@/lib/gamification/constants";
import type { TimelineElement } from "@/types/activity";

/**
 * Tense Path: a level map for the timeline tenses, built on the same
 * structure as the Irregular Verbs and Gerunds & Infinitives games
 * (rule card → Round 1 Learn → Round 2 Master, checkpoints, final).
 *
 * World order follows the tense-aspect acquisition research (present -ing and
 * habits first, then simple past, past -ing, future, and the perfects last,
 * with past perfect the latest). It is NOT tied to the course weeks.
 */

export type TensePathWorldId = "present" | "past" | "future" | "past-to-now" | "before-and-by";

export interface RuleCardPanel {
  /** Short meaning label, e.g. "Finished". */
  label: string;
  /** Verb pattern in the class V-labels, e.g. "V2" or "have + V3". */
  form: string;
  elements: TimelineElement[];
  /** Example sentence; the verb phrase is bolded with `verb`. */
  example: string;
  verb: string;
  /** One plain-English line under the example. */
  note: string;
  signals: string[];
}

export interface TensePathLevel {
  id: string;
  world: TensePathWorldId;
  /** 1-13, shown on the map. */
  number: number;
  title: string;
  /** Short example shown on the level card. */
  example: string;
  /** Stamp timeline shown on the level card. */
  preview: TimelineElement[];
  /** A question must include at least one of these tenses. */
  focus: string[];
  /** Every tense in a question must be in focus ∪ allowed. */
  allowed: string[];
  /** Contrast levels prefer questions that use two focus tenses. */
  contrast?: boolean;
  ruleCard: {
    title: string;
    lead: string;
    panels: RuleCardPanel[];
  };
}

export interface TensePathWorld {
  id: TensePathWorldId;
  number: number;
  title: string;
  description: string;
}

export const TENSE_PATH_WORLDS: TensePathWorld[] = [
  {
    id: "present",
    number: 1,
    title: "The Present",
    description: "Things that are always true, and things happening right now.",
  },
  {
    id: "past",
    number: 2,
    title: "The Past",
    description: "Finished actions, actions in the middle, and old habits.",
  },
  {
    id: "future",
    number: 3,
    title: "The Future",
    description: "What will happen, and what will be happening.",
  },
  {
    id: "past-to-now",
    number: 4,
    title: "Past to Now",
    description: "Actions that started before and still touch NOW.",
  },
  {
    id: "before-and-by",
    number: 5,
    title: "Before & By",
    description: "One action before another one, in the past or the future.",
  },
];

const canon = (name: TimelineStampCanonName, prefix: string) =>
  buildCanonicalTimelineElements(name, prefix);

function withMoment(elements: TimelineElement[], prefix: string, zone: TimelineElement["zone"], position: number): TimelineElement[] {
  return [...elements, { id: `${prefix}-moment`, type: "single-dot", zone, position }];
}

export const TENSE_PATH_LEVELS: TensePathLevel[] = [
  // ---------------- World 1: The Present ----------------
  {
    id: "always-true",
    world: "present",
    number: 1,
    title: "Always True",
    example: "She works at a bakery.",
    preview: canon("presentSimpleHabit", "always-true"),
    focus: ["Present Simple"],
    allowed: [],
    ruleCard: {
      title: "Always true",
      lead: "A habit, a routine, or a fact. The dots repeat again and again.",
      panels: [
        {
          label: "Habit / Fact",
          form: "V1 / V1-s",
          elements: canon("presentSimpleHabit", "rc-always"),
          example: "She works at a bakery every day.",
          verb: "works",
          note: "He / she / it → add -s: work → works.",
          signals: ["every day", "usually", "always", "never", "on Mondays"],
        },
      ],
    },
  },
  {
    id: "right-now",
    world: "present",
    number: 2,
    title: "Right Now",
    example: "She is working right now.",
    preview: canon("presentContinuous", "right-now"),
    focus: ["Present Continuous"],
    allowed: [],
    ruleCard: {
      title: "Right now",
      lead: "The action is happening at NOW. It started and it is not finished.",
      panels: [
        {
          label: "In progress",
          form: "am / is / are + V-ing",
          elements: canon("presentContinuous", "rc-now"),
          example: "She is working right now.",
          verb: "is working",
          note: "I am · he / she / it is · you / we / they are.",
          signals: ["now", "right now", "at the moment", "today", "Look!"],
        },
      ],
    },
  },
  {
    id: "always-or-now",
    world: "present",
    number: 3,
    title: "Always or Right Now?",
    example: "I work · I'm working",
    preview: [...canon("presentSimpleHabit", "aon-a"), ...canon("presentContinuous", "aon-b")],
    focus: ["Present Simple", "Present Continuous"],
    allowed: [],
    contrast: true,
    ruleCard: {
      title: "Always or right now?",
      lead: "Ask: is it a habit, or is it happening at this moment?",
      panels: [
        {
          label: "Always",
          form: "V1 / V1-s",
          elements: canon("presentSimpleHabit", "rc-aon-a"),
          example: "I usually take the bus.",
          verb: "take",
          note: "A habit. It repeats.",
          signals: ["usually", "every day", "always"],
        },
        {
          label: "Right now",
          form: "am / is / are + V-ing",
          elements: canon("presentContinuous", "rc-aon-b"),
          example: "Today I am walking.",
          verb: "am walking",
          note: "Only now. It is different today.",
          signals: ["now", "today", "this week"],
        },
      ],
    },
  },

  // ---------------- World 2: The Past ----------------
  {
    id: "finished-past",
    world: "past",
    number: 4,
    title: "Finished Past",
    example: "I called my mom yesterday.",
    preview: canon("pastSimple", "finished-past"),
    focus: ["Past Simple"],
    allowed: [],
    ruleCard: {
      title: "Finished past",
      lead: "One moment in the PAST. It is over. It does not touch NOW.",
      panels: [
        {
          label: "Finished",
          form: "V2",
          elements: canon("pastSimple", "rc-past"),
          example: "I called my mom yesterday.",
          verb: "called",
          note: "Questions and negatives use did + V1: Did you call? I didn't call.",
          signals: ["yesterday", "last week", "in 2019", "ago"],
        },
      ],
    },
  },
  {
    id: "in-the-middle",
    world: "past",
    number: 5,
    title: "In the Middle",
    example: "I was cooking when you called.",
    preview: withMoment(canon("pastContinuous", "itm"), "itm", "past", 55),
    focus: ["Past Continuous"],
    allowed: ["Past Simple"],
    ruleCard: {
      title: "In the middle",
      lead: "A long action in the past. Something short happens in the middle of it.",
      panels: [
        {
          label: "Long action",
          form: "was / were + V-ing",
          elements: withMoment(canon("pastContinuous", "rc-itm"), "rc-itm", "past", 55),
          example: "I was cooking when you called.",
          verb: "was cooking",
          note: "The long action uses was / were + V-ing. The short one uses V2.",
          signals: ["when", "while", "at 8 o'clock last night"],
        },
      ],
    },
  },
  {
    id: "not-anymore",
    world: "past",
    number: 6,
    title: "Not Anymore",
    example: "I used to live in Haiti.",
    preview: canon("pastSimpleHabit", "not-anymore"),
    focus: ["Used to", "Would"],
    allowed: ["Past Simple", "Present Simple", "Present Continuous"],
    ruleCard: {
      title: "Not anymore",
      lead: "An old habit or an old fact. It was true in the past. It is not true now.",
      panels: [
        {
          label: "Old habit",
          form: "used to + V1",
          elements: canon("pastSimpleHabit", "rc-used"),
          example: "I used to live in Haiti. Now I live in Boston.",
          verb: "used to live",
          note: "Questions and negatives: Did you use to...? I didn't use to...",
          signals: ["when I was a child", "before", "not anymore"],
        },
      ],
    },
  },

  // ---------------- World 3: The Future ----------------
  {
    id: "what-will-happen",
    world: "future",
    number: 7,
    title: "What Will Happen?",
    example: "I will call you tomorrow.",
    preview: canon("futureSimple", "will"),
    focus: ["Future Simple"],
    allowed: ["Present Simple"],
    ruleCard: {
      title: "What will happen?",
      lead: "One moment in the FUTURE.",
      panels: [
        {
          label: "Future moment",
          form: "will + V1",
          elements: canon("futureSimple", "rc-will"),
          example: "I will call you tomorrow.",
          verb: "will call",
          note: "Will is the same for everyone: I will, she will, they will.",
          signals: ["tomorrow", "next week", "soon", "in 2030"],
        },
      ],
    },
  },
  {
    id: "this-time-tomorrow",
    world: "future",
    number: 8,
    title: "This Time Tomorrow",
    example: "I will be working at 9 tomorrow.",
    preview: canon("futureContinuous", "ttt"),
    focus: ["Future Continuous"],
    allowed: ["Future Simple", "Present Continuous"],
    ruleCard: {
      title: "This time tomorrow",
      lead: "A long action in the FUTURE. It will be in progress at that time.",
      panels: [
        {
          label: "Future in progress",
          form: "will be + V-ing",
          elements: canon("futureContinuous", "rc-ttt"),
          example: "At 9 tomorrow, I will be working.",
          verb: "will be working",
          note: "Don't call at 9. I will be busy.",
          signals: ["this time tomorrow", "at 9 tomorrow", "all day tomorrow"],
        },
      ],
    },
  },

  // ---------------- World 4: Past to Now ----------------
  {
    id: "past-to-now",
    world: "past-to-now",
    number: 9,
    title: "Has It Happened?",
    example: "I have visited New York.",
    preview: canon("presentPerfect", "ptn"),
    focus: ["Present Perfect"],
    allowed: [],
    ruleCard: {
      title: "Has it happened?",
      lead: "Something happened before NOW. We don't say when. The Link touches NOW.",
      panels: [
        {
          label: "Past → now",
          form: "have / has + V3",
          elements: canon("presentPerfect", "rc-ptn"),
          example: "I have visited New York two times.",
          verb: "have visited",
          note: "Experience in my life. No exact time.",
          signals: ["ever", "never", "already", "yet", "just"],
        },
      ],
    },
  },
  {
    id: "finished-or-still-true",
    world: "past-to-now",
    number: 10,
    title: "Finished or Still True?",
    example: "I lived · I have lived",
    preview: canon("presentPerfect", "fost"),
    focus: ["Present Perfect", "Past Simple"],
    allowed: [],
    contrast: true,
    ruleCard: {
      title: "Finished or still true?",
      lead: "Ask: is it over, or does it still touch NOW?",
      panels: [
        {
          label: "Finished",
          form: "V2",
          elements: canon("pastSimple", "rc-fost-a"),
          example: "I lived in Haiti for 10 years.",
          verb: "lived",
          note: "It's over. I don't live there now.",
          signals: ["yesterday", "last year", "in 2019", "ago"],
        },
        {
          label: "Still true now",
          form: "have / has + V3",
          elements: canon("presentPerfect", "rc-fost-b"),
          example: "I have lived in Boston for 3 years.",
          verb: "have lived",
          note: "I still live here. It touches NOW.",
          signals: ["since 2023", "for 3 years", "ever", "never", "yet"],
        },
      ],
    },
  },
  {
    id: "how-long",
    world: "past-to-now",
    number: 11,
    title: "How Long?",
    example: "I have been waiting for an hour.",
    preview: canon("presentPerfectContinuous", "how-long"),
    focus: ["Present Perfect Continuous"],
    allowed: ["Present Perfect", "Present Continuous"],
    ruleCard: {
      title: "How long?",
      lead: "A long action that started in the past and is still going at NOW.",
      panels: [
        {
          label: "Long action → now",
          form: "have / has been + V-ing",
          elements: canon("presentPerfectContinuous", "rc-how-long"),
          example: "I have been waiting for an hour.",
          verb: "have been waiting",
          note: "for + an amount of time · since + a start time.",
          signals: ["for an hour", "since 9 o'clock", "all day", "How long...?"],
        },
      ],
    },
  },

  // ---------------- World 5: Before & By ----------------
  {
    id: "before-the-past",
    world: "before-and-by",
    number: 12,
    title: "Before the Past",
    example: "The bus had left when I arrived.",
    preview: canon("pastPerfect", "btp"),
    focus: ["Past Perfect", "Past Perfect Continuous"],
    allowed: ["Past Simple", "Past Continuous"],
    ruleCard: {
      title: "Before the past",
      lead: "Two past actions. The EARLIER one uses had + V3.",
      panels: [
        {
          label: "Earlier past",
          form: "had + V3",
          elements: canon("pastPerfect", "rc-btp"),
          example: "When I arrived, the bus had left.",
          verb: "had left",
          note: "First the bus left. Then I arrived (V2).",
          signals: ["before", "already", "by the time", "when"],
        },
      ],
    },
  },
  {
    id: "by-then",
    world: "before-and-by",
    number: 13,
    title: "By Then",
    example: "I will have finished by June.",
    preview: canon("futurePerfect", "by-then"),
    focus: ["Future Perfect", "Future Perfect Continuous"],
    allowed: ["Future Simple", "Future Continuous", "Present Simple"],
    ruleCard: {
      title: "By then",
      lead: "An action will be finished before a time in the future.",
      panels: [
        {
          label: "Done before then",
          form: "will have + V3",
          elements: canon("futurePerfect", "rc-by-then"),
          example: "I will have finished the course by June.",
          verb: "will have finished",
          note: "At the end of June, it will be done.",
          signals: ["by June", "by the time", "before"],
        },
      ],
    },
  },
];

export interface TensePathCheckpoint {
  id: string;
  world: TensePathWorldId;
  title: string;
}

export const TENSE_PATH_CHECKPOINTS: TensePathCheckpoint[] = TENSE_PATH_WORLDS.map((w) => ({
  id: `checkpoint-${w.id}`,
  world: w.id,
  title: `Checkpoint ${w.number}`,
}));

export const TENSE_PATH_FINAL_ID = "final";
export const TENSE_PATH_FINAL_BONUS_POINTS = POINTS.TENSE_PATH_FINAL_BONUS;

export function getLevel(id: string): TensePathLevel | undefined {
  return TENSE_PATH_LEVELS.find((l) => l.id === id);
}

export function getWorld(id: TensePathWorldId): TensePathWorld {
  const world = TENSE_PATH_WORLDS.find((w) => w.id === id);
  if (!world) throw new Error(`Unknown Tense Path world: ${id}`);
  return world;
}

export function getWorldLevels(world: TensePathWorldId): TensePathLevel[] {
  return TENSE_PATH_LEVELS.filter((l) => l.world === world);
}

export function getCheckpoint(id: string): TensePathCheckpoint | undefined {
  return TENSE_PATH_CHECKPOINTS.find((c) => c.id === id);
}
