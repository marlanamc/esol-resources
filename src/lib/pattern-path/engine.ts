import { POINTS } from "@/lib/gamification/constants";

/**
 * Shared rules for the "path" games (Tense Path, Sound Path), built on the
 * Irregular Verbs / Gerunds & Infinitives structure: a map of worlds and
 * levels, Round 1 Learn → Round 2 Master, a checkpoint per world, and a final.
 * Each game supplies its own worlds, levels and questions.
 */

export type PathRoundMode = "round1" | "round2" | "checkpoint" | "final";
export type ServerRoundMode = "round1" | "round2" | "review" | "final";

/** Accuracy (0-100) needed to pass each kind of round. */
export const PASS_ACCURACY: Record<PathRoundMode, number> = {
  round1: 80,
  round2: 90,
  checkpoint: 80,
  final: 80,
};

/** How many recent question ids to remember per step, so replays feel new. */
const RECENT_LIMIT = 30;

export interface PathStepProgress {
  /** Round 1 passed (levels) or the round passed (checkpoints / final). */
  passed: boolean;
  /** Round 2 passed (levels only). */
  mastered: boolean;
  attempts: number;
  bestAccuracy: number;
  recentIds: string[];
}

export interface PathProgress {
  steps: Record<string, PathStepProgress>;
  badges: Record<string, boolean>;
}

export type PathStage = "not-started" | "passed" | "mastered";

export type PathUpNext<W extends string> =
  | { kind: "level"; levelId: string; mode: "round1" | "round2" }
  | { kind: "checkpoint"; world: W }
  | { kind: "final" }
  | { kind: "done" };

export interface PathRoundResult {
  stepId: string;
  mode: PathRoundMode;
  correct: number;
  total: number;
  accuracy: number;
  passed: boolean;
  /** True when this round newly passed / mastered the step. */
  newlyPassed: boolean;
  newlyMastered: boolean;
  /** True the first time the final is passed: the game's master badge. */
  earnedBadge: boolean;
  progress: PathProgress;
}

export interface PathConfig<W extends string> {
  worlds: ReadonlyArray<{ id: W }>;
  levels: ReadonlyArray<{ id: string; world: W }>;
  finalId: string;
  /** Key under `badges` set the first time the final is passed. */
  badgeKey: string;
}

export function emptyStep(): PathStepProgress {
  return { passed: false, mastered: false, attempts: 0, bestAccuracy: 0, recentIds: [] };
}

export function emptyProgress(): PathProgress {
  return { steps: {}, badges: {} };
}

/** Accepts whatever the server stored (string, object, or nothing) and returns clean progress. */
export function normalizeProgress(raw: unknown): PathProgress {
  let data = raw;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return emptyProgress();
    }
  }
  if (!data || typeof data !== "object") return emptyProgress();
  const obj = data as Record<string, unknown>;
  const stepsIn = obj.steps && typeof obj.steps === "object" ? (obj.steps as Record<string, unknown>) : {};
  const steps: Record<string, PathStepProgress> = {};
  for (const [id, value] of Object.entries(stepsIn)) {
    if (!value || typeof value !== "object") continue;
    const v = value as Record<string, unknown>;
    steps[id] = {
      passed: v.passed === true,
      mastered: v.mastered === true,
      attempts: typeof v.attempts === "number" && Number.isFinite(v.attempts) ? v.attempts : 0,
      bestAccuracy: typeof v.bestAccuracy === "number" && Number.isFinite(v.bestAccuracy) ? v.bestAccuracy : 0,
      recentIds: Array.isArray(v.recentIds) ? v.recentIds.filter((x): x is string => typeof x === "string") : [],
    };
  }
  const badgesIn = obj.badges && typeof obj.badges === "object" ? (obj.badges as Record<string, unknown>) : {};
  const badges: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(badgesIn)) {
    if (value === true) badges[key] = true;
  }
  return { steps, badges };
}

export function getStep(progress: PathProgress, id: string): PathStepProgress {
  return progress.steps[id] ?? emptyStep();
}

export function getLevelStage(progress: PathProgress, levelId: string): PathStage {
  const step = getStep(progress, levelId);
  if (step.mastered) return "mastered";
  if (step.passed) return "passed";
  return "not-started";
}

/** Which round a level opens on: Round 1 until passed, then Round 2. */
export function getLevelRoundMode(progress: PathProgress, levelId: string): "round1" | "round2" {
  return getStep(progress, levelId).passed ? "round2" : "round1";
}

export function checkpointId(world: string): string {
  return `checkpoint-${world}`;
}

/** Server round mode for /api/activity/progress (it accepts round1 / round2 / review / final). */
export function toServerRoundMode(mode: PathRoundMode): ServerRoundMode {
  return mode === "checkpoint" ? "review" : mode;
}

/** Server-side pass check, using the server's round mode names. */
export function isServerRoundPassed(roundMode: ServerRoundMode, accuracy: number): boolean {
  const mode: PathRoundMode = roundMode === "review" ? "checkpoint" : roundMode;
  return accuracy >= PASS_ACCURACY[mode];
}

/** Points for one finished round: same scale as the other pattern games. */
export function calculatePathRoundPoints(roundExercisesCompleted: number, passed: boolean): number {
  if (!Number.isFinite(roundExercisesCompleted) || roundExercisesCompleted <= 0) return 0;
  return passed ? POINTS.PATH_ROUND : POINTS.PATH_ROUND_EFFORT;
}

export function createPathEngine<W extends string>(config: PathConfig<W>) {
  const { worlds, levels, finalId, badgeKey } = config;
  const worldLevels = (world: W) => levels.filter((l) => l.world === world);

  /** World 1 is open. Each later world opens when the previous checkpoint is passed. */
  function isWorldUnlocked(progress: PathProgress, world: W): boolean {
    const idx = worlds.findIndex((w) => w.id === world);
    if (idx <= 0) return true;
    return getStep(progress, checkpointId(worlds[idx - 1].id)).passed;
  }

  /** A checkpoint opens when every level in its world has passed Round 1. */
  function isCheckpointUnlocked(progress: PathProgress, world: W): boolean {
    return isWorldUnlocked(progress, world) && worldLevels(world).every((l) => getStep(progress, l.id).passed);
  }

  function isFinalUnlocked(progress: PathProgress): boolean {
    return worlds.every((w) => getStep(progress, checkpointId(w.id)).passed);
  }

  /**
   * The one thing to play next, so learners never have to choose:
   * the first level not yet passed, then that world's checkpoint, then the
   * final, then the first level not yet mastered.
   */
  function getUpNext(progress: PathProgress): PathUpNext<W> {
    for (const world of worlds) {
      if (!isWorldUnlocked(progress, world.id)) break;
      const notPassed = worldLevels(world.id).find((l) => !getStep(progress, l.id).passed);
      if (notPassed) return { kind: "level", levelId: notPassed.id, mode: "round1" };
      if (!getStep(progress, checkpointId(world.id)).passed) return { kind: "checkpoint", world: world.id };
    }
    if (isFinalUnlocked(progress) && !getStep(progress, finalId).passed) return { kind: "final" };
    const notMastered = levels.find(
      (l) => isWorldUnlocked(progress, l.world) && getStep(progress, l.id).passed && !getStep(progress, l.id).mastered
    );
    if (notMastered) return { kind: "level", levelId: notMastered.id, mode: "round2" };
    return { kind: "done" };
  }

  function getSummary(progress: PathProgress) {
    const passed = levels.filter((l) => getStep(progress, l.id).passed).length;
    const mastered = levels.filter((l) => getStep(progress, l.id).mastered).length;
    const checkpoints = worlds.filter((w) => getStep(progress, checkpointId(w.id)).passed).length;
    const finalPassed = getStep(progress, finalId).passed;
    // Each level counts twice (pass + master), plus checkpoints and the final.
    const total = levels.length * 2 + worlds.length + 1;
    const done = passed + mastered + checkpoints + (finalPassed ? 1 : 0);
    return {
      passed,
      mastered,
      totalLevels: levels.length,
      checkpoints,
      finalPassed,
      percent: Math.round((done / total) * 100),
    };
  }

  function processRound(
    progress: PathProgress,
    stepId: string,
    mode: PathRoundMode,
    answers: Array<{ questionId: string; correct: boolean }>
  ): PathRoundResult {
    const total = answers.length;
    const correct = answers.filter((a) => a.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = total > 0 && accuracy >= PASS_ACCURACY[mode];

    const before = getStep(progress, stepId);
    const seen = answers.map((a) => a.questionId);
    const recentIds = [...seen, ...before.recentIds.filter((id) => !seen.includes(id))].slice(0, RECENT_LIMIT);

    const after: PathStepProgress = {
      // Passing Round 2 also counts as passed.
      passed: before.passed || passed,
      mastered: before.mastered || (passed && mode === "round2"),
      attempts: before.attempts + 1,
      bestAccuracy: Math.max(before.bestAccuracy, accuracy),
      recentIds,
    };

    const earnedBadge = mode === "final" && passed && !progress.badges[badgeKey];
    return {
      stepId,
      mode,
      correct,
      total,
      accuracy,
      passed,
      newlyPassed: !before.passed && after.passed,
      newlyMastered: !before.mastered && after.mastered,
      earnedBadge,
      progress: {
        steps: { ...progress.steps, [stepId]: after },
        badges: { ...progress.badges, ...(earnedBadge ? { [badgeKey]: true } : {}) },
      },
    };
  }

  return {
    isWorldUnlocked,
    isCheckpointUnlocked,
    isFinalUnlocked,
    getUpNext,
    getSummary,
    processRound,
  };
}
