import { POINTS } from "@/lib/gamification/constants";
import type { EdSound } from "@/lib/ed-pronunciation-data";

/**
 * Sound Path: a level map for the -ed endings, on the same structure as Tense
 * Path. Listening comes before sorting (learners cannot say a sound they
 * cannot hear yet), and the extra clap (/id/) is the easiest difference to
 * hear, so the Clap Count idea is the front door.
 *
 * Wording follows the -ed Sounds game and class slides: claps and whisper
 * sounds, never "voiced / voiceless".
 */

export type SoundPathWorldId = "hear-it" | "sort-it" | "use-it";

/** Who a rule panel is about; picks the team color. */
export type PanelTone = EdSound | "no-clap" | "now" | "past";

export interface SoundRulePanel {
  tone: PanelTone;
  label: string;
  /** Big symbol in the corner, e.g. "/t/" or "2 claps". */
  symbol: string;
  /** Short lines; the first one is shown biggest. */
  lines: string[];
  /** Words a learner can tap to hear. */
  words: string[];
}

export type SoundQuestionType = "clap" | "now-or-past" | "whisper" | "team" | "odd" | "sentence";

export interface SoundPathLevel {
  id: string;
  world: SoundPathWorldId;
  number: number;
  title: string;
  /** Short example under the title on the map. */
  example: string;
  /** Which question types a round uses, and how much of each. */
  mix: Array<{ type: SoundQuestionType; share: number }>;
  /** Only the tricky-spelling verbs (level 6). */
  trickyOnly?: boolean;
  /** Whisper level: no /id/ verbs anywhere in its questions. */
  noExtraClap?: boolean;
  ruleCard: { title: string; lead: string; panels: SoundRulePanel[] };
}

export interface SoundPathWorld {
  id: SoundPathWorldId;
  number: number;
  title: string;
  description: string;
}

export const SOUND_PATH_WORLDS: SoundPathWorld[] = [
  { id: "hear-it", number: 1, title: "Hear It", description: "Count the claps. Hear the -ed before you say it." },
  { id: "sort-it", number: 2, title: "Sort It", description: "Put every word on its team: /t/, /d/ or /id/." },
  { id: "use-it", number: 3, title: "Use It", description: "-ed inside real sentences, and spellings that trick your eyes." },
];

export const SOUND_PATH_LEVELS: SoundPathLevel[] = [
  {
    id: "extra-clap",
    world: "hear-it",
    number: 1,
    title: "Extra Clap?",
    example: "want·ed (2 claps) · walked (1)",
    mix: [
      { type: "clap", share: 0.7 },
      { type: "odd", share: 0.3 },
    ],
    ruleCard: {
      title: "Extra clap?",
      lead: "Most -ed words do NOT get a new clap. Only verbs that end in a T or D sound get an extra clap.",
      panels: [
        {
          tone: "id",
          label: "Extra clap",
          symbol: "/id/",
          lines: ["want → want·ed", "need → need·ed", "Ends in T or D → add a clap."],
          words: ["wanted", "needed"],
        },
        {
          tone: "no-clap",
          label: "No extra clap",
          symbol: "same claps",
          lines: ["walk → walked", "play → played", "Everything else: same number of claps."],
          words: ["walked", "played"],
        },
      ],
    },
  },
  {
    id: "now-or-past",
    world: "hear-it",
    number: 2,
    title: "Now or Past?",
    example: "play or played?",
    mix: [
      { type: "now-or-past", share: 0.7 },
      { type: "clap", share: 0.3 },
    ],
    ruleCard: {
      title: "Now or past?",
      lead: "The -ed is small, but it changes the time. Listen to the very end of the word.",
      panels: [
        {
          tone: "now",
          label: "Now",
          symbol: "V1",
          lines: ["play", "I play soccer every Sunday."],
          words: ["play", "clean", "watch"],
        },
        {
          tone: "past",
          label: "Past",
          symbol: "V2",
          lines: ["played", "I played soccer yesterday."],
          words: ["played", "cleaned", "watched"],
        },
      ],
    },
  },
  {
    id: "whisper-or-not",
    world: "sort-it",
    number: 3,
    title: "Whisper or Not?",
    example: "washed /t/ · cleaned /d/",
    noExtraClap: true,
    mix: [
      { type: "whisper", share: 0.7 },
      { type: "odd", share: 0.3 },
    ],
    ruleCard: {
      title: "Whisper or not?",
      lead: "No extra clap here. Listen to the LAST sound of the verb.",
      panels: [
        {
          tone: "t",
          label: "Whisper sound",
          symbol: "/t/",
          lines: ["s · sh · ch · k · p · f · x", "walk → walked, wash → washed"],
          words: ["walked", "washed", "stopped"],
        },
        {
          tone: "d",
          label: "Not a whisper sound",
          symbol: "/d/",
          lines: ["vowels, m, n, l, r, v, z...", "play → played, clean → cleaned"],
          words: ["played", "called", "cleaned"],
        },
      ],
    },
  },
  {
    id: "three-teams",
    world: "sort-it",
    number: 4,
    title: "Three Teams",
    example: "/t/ · /d/ · /id/",
    mix: [
      { type: "team", share: 0.6 },
      { type: "odd", share: 0.3 },
      { type: "clap", share: 0.1 },
    ],
    ruleCard: {
      title: "Three teams",
      lead: "Ask two questions. 1: Does it end in T or D? 2: If not, is it a whisper sound?",
      panels: [
        {
          tone: "id",
          label: "Ends in T or D",
          symbol: "/id/",
          lines: ["Extra clap.", "wanted, needed, decided"],
          words: ["wanted", "needed"],
        },
        {
          tone: "t",
          label: "Whisper sound",
          symbol: "/t/",
          lines: ["Tiny /t/. No new clap.", "walked, washed, laughed"],
          words: ["walked", "washed"],
        },
        {
          tone: "d",
          label: "Everything else",
          symbol: "/d/",
          lines: ["Tiny /d/. No new clap.", "played, called, lived"],
          words: ["played", "called"],
        },
      ],
    },
  },
  {
    id: "in-sentences",
    world: "use-it",
    number: 5,
    title: "-ed in Sentences",
    example: "I needed help yesterday.",
    mix: [
      { type: "sentence", share: 0.7 },
      { type: "team", share: 0.3 },
    ],
    ruleCard: {
      title: "-ed in sentences",
      lead: "In a sentence the -ed goes fast and quiet. Find the past verb, then pick its team.",
      panels: [
        {
          tone: "id",
          label: "Extra clap",
          symbol: "/id/",
          lines: ["I waited for the bus."],
          words: ["waited"],
        },
        {
          tone: "t",
          label: "Tiny /t/",
          symbol: "/t/",
          lines: ["She cooked dinner."],
          words: ["cooked"],
        },
        {
          tone: "d",
          label: "Tiny /d/",
          symbol: "/d/",
          lines: ["We cleaned the kitchen."],
          words: ["cleaned"],
        },
      ],
    },
  },
  {
    id: "tricky-spellings",
    world: "use-it",
    number: 6,
    title: "Tricky Spellings",
    example: "laughed · fixed · used · decided",
    trickyOnly: true,
    mix: [
      { type: "team", share: 0.7 },
      { type: "odd", share: 0.3 },
    ],
    ruleCard: {
      title: "Tricky spellings",
      lead: "Listen to the SOUND, not the letters. Some letters make a different sound.",
      panels: [
        {
          tone: "t",
          label: "Looks different, sounds like a whisper",
          symbol: "/t/",
          lines: ["gh = f: laughed", "x = ks: fixed", "ce = s: danced"],
          words: ["laughed", "fixed", "danced"],
        },
        {
          tone: "d",
          label: "s that sounds like z",
          symbol: "/d/",
          lines: ["used", "closed", "surprised"],
          words: ["used", "closed"],
        },
        {
          tone: "id",
          label: "Silent e at the end",
          symbol: "/id/",
          lines: ["decide → decided", "The e is quiet. The last sound is still d."],
          words: ["decided", "hated"],
        },
      ],
    },
  },
];

/**
 * Verbs whose spelling hides their sound, with the reason, keyed by past form.
 * Level 6 uses only these; other levels use the note in feedback.
 */
export const TRICKY_SPELLINGS: Record<string, string> = {
  laughed: "gh sounds like f, a whisper sound → /t/",
  coughed: "gh sounds like f, a whisper sound → /t/",
  fixed: "x sounds like ks, a whisper sound → /t/",
  mixed: "x sounds like ks, a whisper sound → /t/",
  danced: "ce sounds like s, a whisper sound → /t/",
  promised: "se sounds like s here, a whisper sound → /t/",
  finished: "sh is one whisper sound → /t/",
  washed: "sh is one whisper sound → /t/",
  brushed: "sh is one whisper sound → /t/",
  pushed: "sh is one whisper sound → /t/",
  watched: "ch is one whisper sound → /t/",
  reached: "ch is one whisper sound → /t/",
  closed: "s sounds like z here. z is not a whisper → /d/",
  used: "s sounds like z here. z is not a whisper → /d/",
  surprised: "s sounds like z here. z is not a whisper → /d/",
  tried: "y is a vowel sound, not a whisper → /d/",
  stayed: "y is a vowel sound, not a whisper → /d/",
  enjoyed: "y is a vowel sound, not a whisper → /d/",
  played: "y is a vowel sound, not a whisper → /d/",
  decided: "The e is silent. The last sound is d → extra clap /id/",
  hated: "The e is silent. The last sound is t → extra clap /id/",
  invited: "The e is silent. The last sound is t → extra clap /id/",
  voted: "The e is silent. The last sound is t → extra clap /id/",
  provided: "The e is silent. The last sound is d → extra clap /id/",
};

export const SOUND_PATH_FINAL_ID = "final";
export const SOUND_PATH_FINAL_BONUS_POINTS = POINTS.SOUND_PATH_FINAL_BONUS;

export function getSoundLevel(id: string): SoundPathLevel | undefined {
  return SOUND_PATH_LEVELS.find((l) => l.id === id);
}

export function getSoundWorld(id: SoundPathWorldId): SoundPathWorld {
  const world = SOUND_PATH_WORLDS.find((w) => w.id === id);
  if (!world) throw new Error(`Unknown Sound Path world: ${id}`);
  return world;
}

export function getSoundWorldLevels(world: SoundPathWorldId): SoundPathLevel[] {
  return SOUND_PATH_LEVELS.filter((l) => l.world === world);
}
