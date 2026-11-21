import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
import { TIMELINE_COMPARISON_QUESTIONS } from "@/data/timeline-comparison-questions";
import { TIMELINE_CONTEXT_QUESTIONS } from "@/data/timeline-context-questions";
import { TIMELINE_ERROR_QUESTIONS } from "@/data/timeline-error-questions";
import { TIMELINE_TRANSFORMER_QUESTIONS } from "@/data/timeline-transformer-questions";
import type { TimelineTensesQuestion } from "@/types/activity";
import {
  TENSE_PATH_LEVELS,
  getWorldLevels,
  type TensePathLevel,
  type TensePathWorldId,
} from "./levels";

export type TensePathQuestion = Exclude<TimelineTensesQuestion, { type: "story-builder" }>;
export type TensePathRoundMode = "round1" | "round2" | "checkpoint" | "final";

/** Practice = the main Read / Build modes. Challenge = the challenge games. */
export const PRACTICE_TYPES = ["sentence-to-timeline", "timeline-to-verb"] as const;
export const CHALLENGE_TYPES = [
  "tense-comparison",
  "context-tense-picker",
  "sentence-transformer",
  "error-correction",
] as const;

export const ROUND_SIZE: Record<TensePathRoundMode, number> = {
  round1: 10,
  round2: 10,
  checkpoint: 12,
  final: 20,
};

const CHALLENGE_SHARE: Record<TensePathRoundMode, number> = {
  round1: 0.4,
  round2: 0.6,
  checkpoint: 0.5,
  final: 0.5,
};

/** Story Builder is hidden in Timeline Tenses until its questions are audited. */
export const ALL_TENSE_PATH_QUESTIONS: TensePathQuestion[] = [
  ...TIMELINE_TENSES_QUESTIONS,
  ...TIMELINE_COMPARISON_QUESTIONS,
  ...TIMELINE_CONTEXT_QUESTIONS,
  ...TIMELINE_ERROR_QUESTIONS,
  ...TIMELINE_TRANSFORMER_QUESTIONS,
].filter((q): q is TensePathQuestion => q.type !== "story-builder");

/**
 * Turn a bank tense label into one base tense.
 * "Past Simple (Negative)" → "Past Simple"; "2 x Past Continuous" → "Past Continuous".
 * Labels that change the meaning (present tenses used for the future, time
 * clauses) stay as they are so no level picks them up.
 */
export function normalizeTenseName(raw: string): string | null {
  const name = raw.trim().replace(/^\d+\s*x\s*/i, "");
  if (/\((future arrangement|scheduled future|future context)\)/i.test(name)) return name;
  const base = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (!base || /^context$/i.test(base)) return null;
  if (/^past simple sequence$/i.test(base)) return "Past Simple";
  if (/^simple future reference$/i.test(base)) return "Future Simple";
  if (/^present question form$/i.test(base)) return "Present Simple";
  return base;
}

function rawTenseLabels(q: TensePathQuestion): string[] {
  switch (q.type) {
    case "sentence-to-timeline":
      return [q.tenseName];
    case "timeline-to-verb":
      return q.blanks.map((b) => b.validAnswers[0]?.tenseName ?? "");
    case "tense-comparison":
      return [q.tenseA, q.tenseB];
    case "sentence-transformer":
      return [q.targetTense];
    case "context-tense-picker":
      return q.options.filter((o) => o.isCorrect).map((o) => o.tenseName);
    case "error-correction":
      return [q.correctTense];
  }
}

/** The base tenses a learner must know to answer this question. */
export function getQuestionTenses(q: TensePathQuestion): string[] {
  const out = new Set<string>();
  for (const label of rawTenseLabels(q)) {
    for (const part of label.split(/\s+\+\s+/)) {
      const t = normalizeTenseName(part);
      if (t) out.add(t);
    }
  }
  return [...out];
}

export function isChallengeQuestion(q: TensePathQuestion): boolean {
  return (CHALLENGE_TYPES as readonly string[]).includes(q.type);
}

export function questionFitsLevel(q: TensePathQuestion, level: TensePathLevel): boolean {
  const tenses = getQuestionTenses(q);
  if (tenses.length === 0) return false;
  const known = new Set([...level.focus, ...level.allowed]);
  return tenses.every((t) => known.has(t)) && tenses.some((t) => level.focus.includes(t));
}

/** Uses two focus tenses: the questions a contrast level is about. */
export function isContrastQuestion(q: TensePathQuestion, level: TensePathLevel): boolean {
  const tenses = getQuestionTenses(q);
  return tenses.filter((t) => level.focus.includes(t)).length >= 2;
}

export function getLevelPool(level: TensePathLevel, bank: TensePathQuestion[] = ALL_TENSE_PATH_QUESTIONS): TensePathQuestion[] {
  return bank.filter((q) => questionFitsLevel(q, level));
}

type Rng = () => number;

function shuffle<T>(items: T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Unseen questions first (shuffled), then recently seen ones (shuffled). */
function freshFirst(items: TensePathQuestion[], recent: Set<string>, rng: Rng): TensePathQuestion[] {
  const unseen = items.filter((q) => !recent.has(q.id));
  const seen = items.filter((q) => recent.has(q.id));
  return [...shuffle(unseen, rng), ...shuffle(seen, rng)];
}

/** Reorder so the same question type rarely appears twice in a row. */
export function interleaveByType(items: TensePathQuestion[]): TensePathQuestion[] {
  const buckets = new Map<string, TensePathQuestion[]>();
  for (const q of items) {
    const list = buckets.get(q.type) ?? [];
    list.push(q);
    buckets.set(q.type, list);
  }
  const out: TensePathQuestion[] = [];
  while (out.length < items.length) {
    const last = out[out.length - 1]?.type;
    // Take from the type with the most left that is not the one just used.
    let pick: TensePathQuestion[] | undefined;
    for (const [type, list] of buckets) {
      if (list.length === 0 || type === last) continue;
      if (!pick || list.length > pick.length) pick = list;
    }
    pick ??= buckets.get(last ?? "") ?? [];
    out.push(pick.shift()!);
  }
  return out;
}

function pickMix(
  pool: TensePathQuestion[],
  size: number,
  challengeShare: number,
  recent: Set<string>,
  rng: Rng,
  preferFirst: (q: TensePathQuestion) => boolean = () => false
): TensePathQuestion[] {
  const order = (items: TensePathQuestion[]) => {
    const preferred = freshFirst(items.filter(preferFirst), recent, rng);
    const rest = freshFirst(items.filter((q) => !preferFirst(q)), recent, rng);
    return [...preferred, ...rest];
  };
  const challenges = order(pool.filter(isChallengeQuestion));
  const practice = order(pool.filter((q) => !isChallengeQuestion(q)));

  const wantChallenge = Math.min(challenges.length, Math.round(size * challengeShare));
  const picked = [...challenges.slice(0, wantChallenge), ...practice.slice(0, size - wantChallenge)];
  // Top up from whichever list still has questions.
  const leftovers = [...challenges.slice(wantChallenge), ...practice.slice(size - wantChallenge)];
  for (const q of leftovers) {
    if (picked.length >= size) break;
    picked.push(q);
  }
  return interleaveByType(shuffle(picked.slice(0, size), rng));
}

export interface BuildRoundOptions {
  /** Question ids the learner saw recently; they go to the back of the line. */
  recentIds?: string[];
  rng?: Rng;
}

export function buildLevelRound(
  level: TensePathLevel,
  mode: "round1" | "round2",
  { recentIds = [], rng = Math.random }: BuildRoundOptions = {}
): TensePathQuestion[] {
  const recent = new Set(recentIds);
  const pool = getLevelPool(level);
  // Round 1 stays on difficulty 1-2 when there are enough questions.
  const easy = pool.filter((q) => q.difficulty <= 2);
  const roundPool = mode === "round1" && easy.length >= ROUND_SIZE.round1 ? easy : pool;
  const preferFirst = level.contrast
    ? (q: TensePathQuestion) => isContrastQuestion(q, level)
    : mode === "round2"
      ? (q: TensePathQuestion) => q.difficulty >= 2
      : undefined;
  return pickMix(roundPool, ROUND_SIZE[mode], CHALLENGE_SHARE[mode], recent, rng, preferFirst);
}

/** Pick `count` questions spread evenly across several levels. */
function spreadAcross(
  levels: TensePathLevel[],
  count: number,
  recent: Set<string>,
  rng: Rng,
  taken: Set<string>
): TensePathQuestion[] {
  const queues = shuffle(levels, rng).map((l) =>
    freshFirst(getLevelPool(l).filter((q) => !taken.has(q.id)), recent, rng)
  );
  const out: TensePathQuestion[] = [];
  let progress = true;
  while (out.length < count && progress) {
    progress = false;
    for (const queue of queues) {
      while (queue.length > 0 && taken.has(queue[0].id)) queue.shift();
      const q = queue.shift();
      if (!q) continue;
      out.push(q);
      taken.add(q.id);
      progress = true;
      if (out.length >= count) break;
    }
  }
  return out;
}

/** World checkpoint: mostly this world, plus a few from earlier worlds so old tenses come back. */
export function buildCheckpointRound(
  world: TensePathWorldId,
  { recentIds = [], rng = Math.random }: BuildRoundOptions = {}
): TensePathQuestion[] {
  const recent = new Set(recentIds);
  const size = ROUND_SIZE.checkpoint;
  const worldLevels = getWorldLevels(world);
  const firstIdx = TENSE_PATH_LEVELS.findIndex((l) => l.world === world);
  const earlier = TENSE_PATH_LEVELS.slice(0, firstIdx);
  const reviewCount = earlier.length > 0 ? Math.round(size / 4) : 0;
  const taken = new Set<string>();
  const current = spreadAcross(worldLevels, size - reviewCount, recent, rng, taken);
  const review = spreadAcross(earlier, size - current.length, recent, rng, taken);
  return interleaveByType(shuffle([...current, ...review], rng));
}

export function buildFinalRound({ recentIds = [], rng = Math.random }: BuildRoundOptions = {}): TensePathQuestion[] {
  const recent = new Set(recentIds);
  const picked = spreadAcross(TENSE_PATH_LEVELS, ROUND_SIZE.final, recent, rng, new Set());
  return interleaveByType(shuffle(picked, rng));
}

/**
 * The level whose rule card explains this question (for the reminder after a
 * wrong answer in a checkpoint). Single-tense levels win over contrast levels.
 */
export function findLevelForQuestion(q: TensePathQuestion): TensePathLevel | undefined {
  const fits = TENSE_PATH_LEVELS.filter((l) => questionFitsLevel(q, l));
  return fits.find((l) => !l.contrast) ?? fits[0];
}

/** Short text for a question, for the "you missed" list. */
export function getQuestionLabel(q: TensePathQuestion): string {
  switch (q.type) {
    case "sentence-to-timeline":
      return q.sentence;
    case "timeline-to-verb":
      return q.sentenceTemplate.replace(/___\[([^\]]+)\]___/g, "___ ($1)");
    case "tense-comparison":
      return q.promptText;
    case "sentence-transformer":
      return q.sourceSentence;
    case "context-tense-picker":
      return q.scenario;
    case "error-correction":
      return q.incorrectSentence;
  }
}

export const QUESTION_TYPE_LABEL: Record<TensePathQuestion["type"], string> = {
  "sentence-to-timeline": "Build the timeline",
  "timeline-to-verb": "Read the timeline",
  "tense-comparison": "Spot the Difference",
  "context-tense-picker": "In Context",
  "sentence-transformer": "Transformer",
  "error-correction": "Fix It",
};
