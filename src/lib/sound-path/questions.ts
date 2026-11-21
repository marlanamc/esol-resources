import { ED_VERBS, getEndingTD, type EdSound, type EdVerb } from "@/lib/ed-pronunciation-data";
import type { PathRoundMode } from "@/lib/pattern-path/engine";
import {
  SOUND_PATH_LEVELS,
  TRICKY_SPELLINGS,
  getSoundWorldLevels,
  type SoundPathLevel,
  type SoundPathWorldId,
  type SoundQuestionType,
} from "./levels";

export type SoundPathRoundMode = PathRoundMode;

export type SoundQuestion =
  | { id: string; type: "clap"; verb: EdVerb }
  | { id: string; type: "now-or-past"; verb: EdVerb; target: "base" | "past" }
  | { id: string; type: "whisper"; verb: EdVerb }
  | { id: string; type: "team"; verb: EdVerb }
  | { id: string; type: "sentence"; verb: EdVerb }
  | { id: string; type: "odd"; verbs: EdVerb[]; oddIndex: number; by: "clap" | "team" };

export const ROUND_SIZE: Record<SoundPathRoundMode, number> = {
  round1: 10,
  round2: 10,
  checkpoint: 12,
  final: 20,
};

export const QUESTION_TYPE_LABEL: Record<SoundQuestionType, string> = {
  clap: "Clap Count",
  "now-or-past": "Now or Past?",
  whisper: "Whisper or Not?",
  team: "Which Team?",
  odd: "Odd One Out",
  sentence: "In a Sentence",
};

type Rng = () => number;

function shuffle<T>(items: T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isTricky(verb: EdVerb): boolean {
  return verb.past in TRICKY_SPELLINGS;
}

export function hasExtraClap(verb: EdVerb): boolean {
  return verb.sound === "id";
}

/** The verbs a level may use in this round. */
export function getLevelVerbs(level: SoundPathLevel, mode: "round1" | "round2" | "mixed"): EdVerb[] {
  let pool = ED_VERBS;
  if (level.trickyOnly) pool = pool.filter(isTricky);
  else if (mode === "round1") pool = pool.filter((v) => v.difficulty !== "hard");
  if (level.noExtraClap) pool = pool.filter((v) => v.sound !== "id");
  return pool;
}

// ---------------------------------------------------------------------------
// Answers and feedback
// ---------------------------------------------------------------------------

/** The answer value a learner must pick: a sound, "clap"/"no-clap", "base"/"past", or the odd index. */
export function correctAnswer(q: SoundQuestion): string {
  switch (q.type) {
    case "clap":
      return hasExtraClap(q.verb) ? "clap" : "no-clap";
    case "now-or-past":
      return q.target;
    case "whisper":
    case "team":
    case "sentence":
      return q.verb.sound;
    case "odd":
      return String(q.oddIndex);
  }
}

export function isCorrect(q: SoundQuestion, answer: string): boolean {
  return answer === correctAnswer(q);
}

/** One plain line explaining the sound of a verb, in claps + whisper language. */
export function explainVerb(verb: EdVerb): string {
  const trick = TRICKY_SPELLINGS[verb.past];
  if (trick) return `${verb.past}: ${trick}`;
  if (verb.sound === "id") {
    const td = getEndingTD(verb.base) ?? "T or D";
    return `${verb.base} ends in a ${td} sound → extra clap /id/`;
  }
  if (verb.sound === "t") return `${verb.base} ends in a whisper sound → tiny /t/`;
  return `${verb.base} does not end in a whisper sound → tiny /d/`;
}

export function explain(q: SoundQuestion): string {
  switch (q.type) {
    case "clap":
      return hasExtraClap(q.verb)
        ? `${q.verb.base} ends in a ${getEndingTD(q.verb.base) ?? "T or D"} sound, so we add a clap: ${q.verb.past}.`
        : `${q.verb.base} does not end in T or D, so ${q.verb.past} keeps the same claps.`;
    case "now-or-past":
      return q.target === "past"
        ? `You heard "${q.verb.past}". Listen for the tiny -ed at the end.`
        : `You heard "${q.verb.base}". No -ed at the end: it is now, not past.`;
    case "whisper":
    case "team":
    case "sentence":
      return explainVerb(q.verb);
    case "odd": {
      const odd = q.verbs[q.oddIndex];
      return q.by === "clap"
        ? `${odd.past} is different: ${hasExtraClap(odd) ? "it has an extra clap" : "it has no extra clap"}.`
        : `${odd.past} is on a different team. ${explainVerb(odd)}`;
    }
  }
}

// ---------------------------------------------------------------------------
// Round building
// ---------------------------------------------------------------------------

interface BuildContext {
  rng: Rng;
  recent: Set<string>;
  /** Past forms already used in this round, so a word shows up once. */
  usedVerbs: Set<string>;
  /** Teams to rotate through so a round is balanced. */
  teamTurn: number;
}

/** Fresh, unused verbs first; recently seen ones last. */
function orderVerbs(pool: EdVerb[], ctx: BuildContext, idFor: (v: EdVerb) => string): EdVerb[] {
  const free = pool.filter((v) => !ctx.usedVerbs.has(v.past));
  const unseen = shuffle(free.filter((v) => !ctx.recent.has(idFor(v))), ctx.rng);
  const seen = shuffle(free.filter((v) => ctx.recent.has(idFor(v))), ctx.rng);
  return [...unseen, ...seen];
}

function pickVerb(pool: EdVerb[], ctx: BuildContext, idFor: (v: EdVerb) => string, wantSound?: EdSound | "not-id"): EdVerb | null {
  const ordered = orderVerbs(pool, ctx, idFor);
  const match = ordered.find((v) =>
    wantSound === undefined ? true : wantSound === "not-id" ? v.sound !== "id" : v.sound === wantSound
  );
  const verb = match ?? ordered[0] ?? null;
  if (verb) ctx.usedVerbs.add(verb.past);
  return verb;
}

function nextTeam(ctx: BuildContext, teams: EdSound[]): EdSound {
  const team = teams[ctx.teamTurn % teams.length];
  ctx.teamTurn += 1;
  return team;
}

function makeQuestion(type: SoundQuestionType, level: SoundPathLevel, pool: EdVerb[], ctx: BuildContext): SoundQuestion | null {
  const teams: EdSound[] = level.noExtraClap ? ["t", "d"] : ["t", "d", "id"];
  switch (type) {
    case "clap": {
      // Half extra clap, half not.
      const want = ctx.teamTurn % 2 === 0 ? "id" : "not-id";
      ctx.teamTurn += 1;
      const verb = pickVerb(pool, ctx, (v) => `clap:${v.past}`, want);
      return verb ? { id: `clap:${verb.past}`, type: "clap", verb } : null;
    }
    case "now-or-past": {
      const verb = pickVerb(pool, ctx, (v) => `now-or-past:${v.past}`);
      if (!verb) return null;
      const target = ctx.rng() < 0.5 ? "base" : "past";
      return { id: `now-or-past:${verb.past}:${target}`, type: "now-or-past", verb, target };
    }
    case "whisper": {
      const verb = pickVerb(pool.filter((v) => v.sound !== "id"), ctx, (v) => `whisper:${v.past}`, nextTeam(ctx, ["t", "d"]));
      return verb ? { id: `whisper:${verb.past}`, type: "whisper", verb } : null;
    }
    case "team":
    case "sentence": {
      const verb = pickVerb(pool, ctx, (v) => `${type}:${v.past}`, nextTeam(ctx, teams));
      return verb ? { id: `${type}:${verb.past}`, type, verb } : null;
    }
    case "odd": {
      const byClap = level.id === "extra-clap";
      const group = (v: EdVerb) => (byClap ? (hasExtraClap(v) ? "clap" : "no-clap") : v.sound);
      const groups = byClap ? ["clap", "no-clap"] : teams;
      const free = orderVerbs(pool, ctx, (v) => `odd:${v.past}`);
      // Try every (pair group, odd group) combination; small pools can run out of one team.
      const combos = shuffle(groups.flatMap((a) => groups.filter((b) => b !== a).map((b) => [a, b] as const)), ctx.rng);
      let pair: EdVerb[] = [];
      let odd: EdVerb | undefined;
      for (const [majority, minority] of combos) {
        pair = free.filter((v) => group(v) === majority).slice(0, 2);
        odd = free.find((v) => group(v) === minority);
        if (pair.length === 2 && odd) break;
      }
      if (pair.length < 2 || !odd) return null;
      const verbs = shuffle([...pair, odd], ctx.rng);
      verbs.forEach((v) => ctx.usedVerbs.add(v.past));
      return {
        id: `odd:${verbs.map((v) => v.past).join("-")}`,
        type: "odd",
        verbs,
        oddIndex: verbs.indexOf(odd),
        by: byClap ? "clap" : "team",
      };
    }
  }
}

/** Turn a level's mix into exact counts that add up to `size`. */
export function mixCounts(level: SoundPathLevel, size: number): Array<{ type: SoundQuestionType; count: number }> {
  const counts = level.mix.map((m) => ({ type: m.type, count: Math.floor(size * m.share) }));
  let left = size - counts.reduce((s, c) => s + c.count, 0);
  for (let i = 0; left > 0; i = (i + 1) % counts.length, left--) counts[i].count += 1;
  return counts;
}

/**
 * Spread each question type evenly through the round (a 7 / 3 mix becomes
 * c o c c o c c o c c, not o o o c c c c c c c).
 */
export function interleaveByType(items: SoundQuestion[]): SoundQuestion[] {
  const buckets = new Map<string, SoundQuestion[]>();
  for (const q of items) {
    const list = buckets.get(q.type) ?? [];
    list.push(q);
    buckets.set(q.type, list);
  }
  const placed: Array<{ q: SoundQuestion; at: number }> = [];
  let typeIdx = 0;
  for (const list of buckets.values()) {
    list.forEach((q, i) => placed.push({ q, at: (i + 0.5) / list.length + typeIdx * 1e-6 }));
    typeIdx += 1;
  }
  return placed.sort((a, b) => a.at - b.at).map((p) => p.q);
}

function buildFromLevel(level: SoundPathLevel, mode: "round1" | "round2" | "mixed", size: number, ctx: BuildContext): SoundQuestion[] {
  const pool = getLevelVerbs(level, mode);
  const out: SoundQuestion[] = [];
  for (const { type, count } of mixCounts(level, size)) {
    for (let i = 0; i < count; i++) {
      // If a type cannot be built from the words left, ask a team question instead.
      const q = makeQuestion(type, level, pool, ctx) ?? (type !== "team" ? makeQuestion(level.noExtraClap ? "whisper" : "team", level, pool, ctx) : null);
      if (q) out.push(q);
    }
  }
  return out;
}

export interface BuildRoundOptions {
  recentIds?: string[];
  rng?: Rng;
}

function newContext({ recentIds = [], rng = Math.random }: BuildRoundOptions): BuildContext {
  return { rng, recent: new Set(recentIds), usedVerbs: new Set(), teamTurn: Math.floor(rng() * 6) };
}

export function buildLevelRound(level: SoundPathLevel, mode: "round1" | "round2", options: BuildRoundOptions = {}): SoundQuestion[] {
  const ctx = newContext(options);
  return interleaveByType(shuffle(buildFromLevel(level, mode, ROUND_SIZE[mode], ctx), ctx.rng));
}

/** Questions spread across several levels, `count` in total. */
function spreadAcross(levels: SoundPathLevel[], count: number, ctx: BuildContext): SoundQuestion[] {
  const out: SoundQuestion[] = [];
  const order = shuffle(levels, ctx.rng);
  const per = Math.floor(count / order.length);
  let extra = count - per * order.length;
  for (const level of order) {
    const n = per + (extra > 0 ? 1 : 0);
    extra -= 1;
    if (n > 0) out.push(...buildFromLevel(level, "mixed", n, ctx));
  }
  return out;
}

/** World checkpoint: mostly this world, plus some earlier sounds so they come back. */
export function buildCheckpointRound(world: SoundPathWorldId, options: BuildRoundOptions = {}): SoundQuestion[] {
  const ctx = newContext(options);
  const size = ROUND_SIZE.checkpoint;
  const firstIdx = SOUND_PATH_LEVELS.findIndex((l) => l.world === world);
  const earlier = SOUND_PATH_LEVELS.slice(0, firstIdx);
  const reviewCount = earlier.length > 0 ? Math.round(size / 4) : 0;
  const current = spreadAcross(getSoundWorldLevels(world), size - reviewCount, ctx);
  const review = earlier.length > 0 ? spreadAcross(earlier, size - current.length, ctx) : [];
  return interleaveByType(shuffle([...current, ...review], ctx.rng));
}

export function buildFinalRound(options: BuildRoundOptions = {}): SoundQuestion[] {
  const ctx = newContext(options);
  return interleaveByType(shuffle(spreadAcross(SOUND_PATH_LEVELS, ROUND_SIZE.final, ctx), ctx.rng));
}

/** The level whose rule card explains this question (for checkpoint reminders). */
export function findLevelForQuestion(q: SoundQuestion): SoundPathLevel | undefined {
  const verb = q.type === "odd" ? q.verbs[q.oddIndex] : q.verb;
  if (q.type === "clap" || (q.type === "odd" && q.by === "clap")) return SOUND_PATH_LEVELS[0];
  if (q.type === "now-or-past") return SOUND_PATH_LEVELS[1];
  if (q.type === "sentence") return SOUND_PATH_LEVELS[4];
  if (isTricky(verb)) return SOUND_PATH_LEVELS[5];
  if (q.type === "whisper" || verb.sound !== "id") return SOUND_PATH_LEVELS[2];
  return SOUND_PATH_LEVELS[3];
}

/** Short text for the "listen again" list on the results screen. */
export function getQuestionWord(q: SoundQuestion): EdVerb {
  return q.type === "odd" ? q.verbs[q.oddIndex] : q.verb;
}
