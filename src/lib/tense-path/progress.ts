import {
  TENSE_PATH_CHECKPOINTS,
  TENSE_PATH_FINAL_ID,
  TENSE_PATH_LEVELS,
  TENSE_PATH_WORLDS,
  getWorldLevels,
  type TensePathWorldId,
} from "./levels";
import { POINTS } from "@/lib/gamification/constants";
import type { TensePathRoundMode } from "./questions";

/** Accuracy (0-100) needed to pass each kind of round. */
export const PASS_ACCURACY: Record<TensePathRoundMode, number> = {
  round1: 80,
  round2: 90,
  checkpoint: 80,
  final: 80,
};

/** How many recent question ids to remember per level, so replays feel new. */
const RECENT_LIMIT = 30;

export interface TensePathStepProgress {
  /** Round 1 passed (levels) or the round passed (checkpoints / final). */
  passed: boolean;
  /** Round 2 passed (levels only). */
  mastered: boolean;
  attempts: number;
  bestAccuracy: number;
  recentIds: string[];
}

export interface TensePathProgress {
  steps: Record<string, TensePathStepProgress>;
  badges: { tenseMaster?: boolean };
}

export type TensePathStage = "not-started" | "passed" | "mastered";

export function emptyStep(): TensePathStepProgress {
  return { passed: false, mastered: false, attempts: 0, bestAccuracy: 0, recentIds: [] };
}

export function emptyProgress(): TensePathProgress {
  return { steps: {}, badges: {} };
}

/** Accepts whatever the server stored (string, object, or nothing) and returns clean progress. */
export function normalizeProgress(raw: unknown): TensePathProgress {
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
  const steps: Record<string, TensePathStepProgress> = {};
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
  return { steps, badges: { tenseMaster: badgesIn.tenseMaster === true } };
}

export function getStep(progress: TensePathProgress, id: string): TensePathStepProgress {
  return progress.steps[id] ?? emptyStep();
}

export function getLevelStage(progress: TensePathProgress, levelId: string): TensePathStage {
  const step = getStep(progress, levelId);
  if (step.mastered) return "mastered";
  if (step.passed) return "passed";
  return "not-started";
}

/** Which round a level opens on: Round 1 until passed, then Round 2. */
export function getLevelRoundMode(progress: TensePathProgress, levelId: string): "round1" | "round2" {
  return getStep(progress, levelId).passed ? "round2" : "round1";
}

export function checkpointId(world: TensePathWorldId): string {
  return `checkpoint-${world}`;
}

/** World 1 is open. Each later world opens when the previous checkpoint is passed. */
export function isWorldUnlocked(progress: TensePathProgress, world: TensePathWorldId): boolean {
  const idx = TENSE_PATH_WORLDS.findIndex((w) => w.id === world);
  if (idx <= 0) return true;
  return getStep(progress, checkpointId(TENSE_PATH_WORLDS[idx - 1].id)).passed;
}

/** A checkpoint opens when every level in its world has passed Round 1. */
export function isCheckpointUnlocked(progress: TensePathProgress, world: TensePathWorldId): boolean {
  return isWorldUnlocked(progress, world) && getWorldLevels(world).every((l) => getStep(progress, l.id).passed);
}

export function isFinalUnlocked(progress: TensePathProgress): boolean {
  return TENSE_PATH_CHECKPOINTS.every((c) => getStep(progress, c.id).passed);
}

export type UpNext =
  | { kind: "level"; levelId: string; mode: "round1" | "round2" }
  | { kind: "checkpoint"; world: TensePathWorldId }
  | { kind: "final" }
  | { kind: "done" };

/**
 * The one thing to play next, so learners never have to choose:
 * the first level not yet passed, then that world's checkpoint, then the
 * first level not yet mastered, then the final.
 */
export function getUpNext(progress: TensePathProgress): UpNext {
  for (const world of TENSE_PATH_WORLDS) {
    if (!isWorldUnlocked(progress, world.id)) break;
    const notPassed = getWorldLevels(world.id).find((l) => !getStep(progress, l.id).passed);
    if (notPassed) return { kind: "level", levelId: notPassed.id, mode: "round1" };
    if (!getStep(progress, checkpointId(world.id)).passed) return { kind: "checkpoint", world: world.id };
  }
  const notMastered = TENSE_PATH_LEVELS.find(
    (l) => isWorldUnlocked(progress, l.world) && getStep(progress, l.id).passed && !getStep(progress, l.id).mastered
  );
  if (isFinalUnlocked(progress) && !getStep(progress, TENSE_PATH_FINAL_ID).passed) return { kind: "final" };
  if (notMastered) return { kind: "level", levelId: notMastered.id, mode: "round2" };
  return { kind: "done" };
}

export function getSummary(progress: TensePathProgress) {
  const passed = TENSE_PATH_LEVELS.filter((l) => getStep(progress, l.id).passed).length;
  const mastered = TENSE_PATH_LEVELS.filter((l) => getStep(progress, l.id).mastered).length;
  const checkpoints = TENSE_PATH_CHECKPOINTS.filter((c) => getStep(progress, c.id).passed).length;
  const finalPassed = getStep(progress, TENSE_PATH_FINAL_ID).passed;
  // Each level counts twice (pass + master), plus checkpoints and the final.
  const total = TENSE_PATH_LEVELS.length * 2 + TENSE_PATH_CHECKPOINTS.length + 1;
  const done = passed + mastered + checkpoints + (finalPassed ? 1 : 0);
  return {
    passed,
    mastered,
    totalLevels: TENSE_PATH_LEVELS.length,
    checkpoints,
    finalPassed,
    percent: Math.round((done / total) * 100),
  };
}

export interface TensePathRoundResult {
  stepId: string;
  mode: TensePathRoundMode;
  correct: number;
  total: number;
  accuracy: number;
  passed: boolean;
  /** True when this round newly passed / mastered the step. */
  newlyPassed: boolean;
  newlyMastered: boolean;
  /** True the first time the final is passed: the Tense Master badge. */
  earnedTenseMaster: boolean;
  progress: TensePathProgress;
}

export function processRound(
  progress: TensePathProgress,
  stepId: string,
  mode: TensePathRoundMode,
  answers: Array<{ questionId: string; correct: boolean }>
): TensePathRoundResult {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = total > 0 && accuracy >= PASS_ACCURACY[mode];

  const before = getStep(progress, stepId);
  const seen = answers.map((a) => a.questionId);
  const recentIds = [...seen, ...before.recentIds.filter((id) => !seen.includes(id))].slice(0, RECENT_LIMIT);

  const after: TensePathStepProgress = {
    // Passing Round 2 also counts as passed.
    passed: before.passed || passed,
    mastered: before.mastered || (passed && mode === "round2"),
    attempts: before.attempts + 1,
    bestAccuracy: Math.max(before.bestAccuracy, accuracy),
    recentIds,
  };

  const earnedTenseMaster = mode === "final" && passed && !progress.badges.tenseMaster;
  const next: TensePathProgress = {
    steps: { ...progress.steps, [stepId]: after },
    badges: { ...progress.badges, ...(earnedTenseMaster ? { tenseMaster: true } : {}) },
  };

  return {
    stepId,
    mode,
    correct,
    total,
    accuracy,
    passed,
    newlyPassed: !before.passed && after.passed,
    newlyMastered: !before.mastered && after.mastered,
    earnedTenseMaster,
    progress: next,
  };
}

/** Points for one finished round: same scale as the other pattern games. */
export function calculateTensePathRoundPoints(roundExercisesCompleted: number, passed: boolean): number {
  if (!Number.isFinite(roundExercisesCompleted) || roundExercisesCompleted <= 0) return 0;
  return passed ? POINTS.TENSE_PATH_ROUND : 3;
}

/** Server-side pass check, using the server's round mode names. */
export function isTensePathServerRoundPassed(
  roundMode: "round1" | "round2" | "review" | "final",
  accuracy: number
): boolean {
  const mode: TensePathRoundMode = roundMode === "review" ? "checkpoint" : roundMode;
  return accuracy >= PASS_ACCURACY[mode];
}

/** Server round mode for /api/activity/progress (it accepts round1 / round2 / review / final). */
export function toServerRoundMode(mode: TensePathRoundMode): "round1" | "round2" | "review" | "final" {
  return mode === "checkpoint" ? "review" : mode;
}
