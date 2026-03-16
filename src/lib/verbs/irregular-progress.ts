/**
 * Progress tracking and unlock logic for Irregular Verbs game.
 * Supports a two-round model: discover the pattern first, then lock it in.
 */

import { VERB_GROUPS, getVerbGroupById } from '@/data/irregular-verbs-groups';
import type {
  GroupProgress,
  VerbExercise,
  VerbGameRoundResults,
  VerbGroup,
  VerbGroupStage,
  VerbPerformance,
  VerbRoundMode,
  VerbRoundProgress,
} from '@/types/irregular-verbs';

export const UNLOCK_THRESHOLD = 80;
export const ROUND_2_MASTERY_THRESHOLD = 85;
export const ALL_PATTERNS_GROUP_ID = 'all-patterns-quiz';

export const ALL_PATTERNS_GROUP: VerbGroup = {
  id: ALL_PATTERNS_GROUP_ID,
  title: 'All Patterns Review',
  pattern: 'Expanded mixed practice using the patterns you have already passed',
  patternExample: 'Mix V1 -> V2 -> V3 across groups',
  colorClass: 'from-indigo-100 to-blue-100 border-indigo-200',
  difficulty: 3,
  prerequisite: null,
  verbs: Array.from(
    new Map(VERB_GROUPS.flatMap((g) => g.verbs).map((v) => [v.base, v])).values()
  )
};

type ExerciseOutcome = {
  exercise: VerbExercise;
  correct: boolean;
};

function createEmptyRoundProgress(): VerbRoundProgress {
  return {
    attempts: 0,
    bestAccuracy: 0,
    lastAccuracy: 0,
    passed: false,
  };
}

function createEmptyGroupProgress(locked = true): GroupProgress {
  return {
    completed: false,
    accuracy: 0,
    exercisesCompleted: 0,
    lastAttemptDate: '',
    attempts: 0,
    locked,
    stage: 'not-started',
    round1: createEmptyRoundProgress(),
    round2: createEmptyRoundProgress(),
    verbStats: {},
    reviewDue: false,
  };
}

export function getGroupStage(progress?: GroupProgress): VerbGroupStage {
  if (!progress) return 'not-started';
  if (progress.stage) return progress.stage;
  if ((progress.round2?.passed ?? false) || progress.reviewDue === false && progress.completed && progress.round2?.attempts) {
    return 'mastered';
  }
  if (progress.completed) return 'passed';
  return 'not-started';
}

export function isGroupPassed(progress?: GroupProgress): boolean {
  return getGroupStage(progress) !== 'not-started';
}

export function isGroupMastered(progress?: GroupProgress): boolean {
  return getGroupStage(progress) === 'mastered';
}

function normalizeVerbStats(value: unknown): Record<string, VerbPerformance> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const stats = value as Record<string, Partial<VerbPerformance>>;
  const normalized: Record<string, VerbPerformance> = {};

  for (const [base, stat] of Object.entries(stats)) {
    normalized[base] = {
      seen: stat.seen ?? 0,
      correct: stat.correct ?? 0,
      misses: stat.misses ?? 0,
      round1Misses: stat.round1Misses ?? 0,
      round2Misses: stat.round2Misses ?? 0,
      lastSeenAt: stat.lastSeenAt,
      lastMissedAt: stat.lastMissedAt,
      needsReview: stat.needsReview ?? false,
    };
  }

  return normalized;
}

function normalizeRoundProgress(value: unknown, fallbackAccuracy = 0, fallbackAttempts = 0, fallbackPassed = false): VerbRoundProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      attempts: fallbackAttempts,
      bestAccuracy: fallbackAccuracy,
      lastAccuracy: fallbackAccuracy,
      passed: fallbackPassed,
    };
  }

  const round = value as Partial<VerbRoundProgress>;

  return {
    attempts: round.attempts ?? fallbackAttempts,
    bestAccuracy: round.bestAccuracy ?? fallbackAccuracy,
    lastAccuracy: round.lastAccuracy ?? fallbackAccuracy,
    lastAttemptDate: round.lastAttemptDate,
    passed: round.passed ?? fallbackPassed,
  };
}

function normalizeGroupProgress(progress: GroupProgress | undefined, groupId: string): GroupProgress {
  const locked = progress?.locked ?? groupId !== VERB_GROUPS[0]?.id;
  const completed = progress?.completed ?? false;
  const accuracy = progress?.accuracy ?? 0;
  const attempts = progress?.attempts ?? 0;
  const stage = getGroupStage(progress);
  const round1 = normalizeRoundProgress(progress?.round1, accuracy, attempts, completed);
  const round2 = normalizeRoundProgress(
    progress?.round2,
    stage === 'mastered' ? accuracy : 0,
    progress?.round2?.attempts ?? 0,
    stage === 'mastered'
  );

  return {
    ...createEmptyGroupProgress(locked),
    ...progress,
    completed,
    accuracy,
    attempts,
    locked,
    stage,
    round1,
    round2,
    verbStats: normalizeVerbStats(progress?.verbStats),
    reviewDue: progress?.reviewDue ?? stage === 'passed',
  };
}

export function normalizeProgressData(raw: Record<string, GroupProgress> | null | undefined): Record<string, GroupProgress> {
  const base = initializeProgressData();
  if (!raw) return base;

  const normalized: Record<string, GroupProgress> = { ...base };

  for (const group of VERB_GROUPS) {
    normalized[group.id] = normalizeGroupProgress(raw[group.id], group.id);
  }

  if (raw[ALL_PATTERNS_GROUP_ID]) {
    normalized[ALL_PATTERNS_GROUP_ID] = normalizeGroupProgress(raw[ALL_PATTERNS_GROUP_ID], ALL_PATTERNS_GROUP_ID);
  }

  return normalized;
}

function getProgressGroupById(groupId: string): VerbGroup | undefined {
  if (groupId === ALL_PATTERNS_GROUP_ID) {
    return ALL_PATTERNS_GROUP;
  }

  return getVerbGroupById(groupId);
}

function getRegularGroupProgress(categoryData: Record<string, GroupProgress>): GroupProgress[] {
  return VERB_GROUPS.map((group) => normalizeGroupProgress(categoryData[group.id], group.id));
}

export function hasAnyPassedGroups(categoryData: Record<string, GroupProgress>): boolean {
  return VERB_GROUPS.some((group) => isGroupPassed(categoryData[group.id]));
}

export function getPassedGroups(categoryData: Record<string, GroupProgress>): VerbGroup[] {
  return VERB_GROUPS.filter((group) => isGroupPassed(categoryData[group.id]));
}

export function getReviewDueGroups(categoryData: Record<string, GroupProgress>): VerbGroup[] {
  return VERB_GROUPS.filter((group) => normalizeGroupProgress(categoryData[group.id], group.id).reviewDue);
}

export function isGroupUnlocked(
  groupId: string,
  categoryData: Record<string, GroupProgress>
): boolean {
  if (groupId === ALL_PATTERNS_GROUP_ID) {
    return hasAnyPassedGroups(categoryData);
  }

  const group = getProgressGroupById(groupId);
  if (!group) return false;
  if (!group.prerequisite) return true;

  return isGroupPassed(categoryData[group.prerequisite]);
}

export function getNextUnlockedGroup(
  categoryData: Record<string, GroupProgress>
): VerbGroup | null {
  for (const group of VERB_GROUPS) {
    if (isGroupPassed(categoryData[group.id])) continue;
    if (isGroupUnlocked(group.id, categoryData)) return group;
  }

  return null;
}

export function calculateOverallProgress(categoryData: Record<string, GroupProgress>): number {
  if (VERB_GROUPS.length === 0) return 0;

  const passedCount = getRegularGroupProgress(categoryData).filter((p) => isGroupPassed(p)).length;
  return Math.round((passedCount / VERB_GROUPS.length) * 100);
}

export function getUnlockedGroups(categoryData: Record<string, GroupProgress>): VerbGroup[] {
  return VERB_GROUPS.filter((group) => isGroupUnlocked(group.id, categoryData));
}

export function getLockedGroups(categoryData: Record<string, GroupProgress>) {
  return VERB_GROUPS.filter((group) => !isGroupUnlocked(group.id, categoryData)).map((group) => ({
    group,
    prerequisiteGroup: group.prerequisite ? getVerbGroupById(group.prerequisite) : null,
    prerequisiteProgress: group.prerequisite ? categoryData[group.prerequisite] : null,
  }));
}

function updateVerbStats(
  existing: Record<string, VerbPerformance>,
  exerciseResults: ExerciseOutcome[],
  roundMode: VerbRoundMode,
  timestamp: string
): Record<string, VerbPerformance> {
  const updated = { ...existing };

  for (const { exercise, correct } of exerciseResults) {
    const base = exercise.verb.base;
    const previous = updated[base] ?? {
      seen: 0,
      correct: 0,
      misses: 0,
      round1Misses: 0,
      round2Misses: 0,
      needsReview: false,
    };

    updated[base] = {
      ...previous,
      seen: previous.seen + 1,
      correct: previous.correct + (correct ? 1 : 0),
      misses: previous.misses + (correct ? 0 : 1),
      round1Misses: previous.round1Misses + (!correct && roundMode === 'round1' ? 1 : 0),
      round2Misses: previous.round2Misses + (!correct && roundMode !== 'round1' ? 1 : 0),
      lastSeenAt: timestamp,
      lastMissedAt: correct ? previous.lastMissedAt : timestamp,
      needsReview: !correct || roundMode === 'round1',
    };
  }

  return updated;
}

function updateRoundProgress(previous: VerbRoundProgress, accuracy: number, passed: boolean, timestamp: string): VerbRoundProgress {
  return {
    attempts: previous.attempts + 1,
    bestAccuracy: Math.max(previous.bestAccuracy, accuracy),
    lastAccuracy: accuracy,
    lastAttemptDate: timestamp,
    passed: previous.passed || passed,
  };
}

export function processRoundResults(
  groupId: string,
  roundMode: VerbRoundMode,
  exercises: VerbExercise[],
  exerciseResults: ExerciseOutcome[],
  currentCategoryData: Record<string, GroupProgress>
): VerbGameRoundResults {
  const group = getProgressGroupById(groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);

  const normalizedData = normalizeProgressData(currentCategoryData);
  const previousProgress = normalizeGroupProgress(normalizedData[groupId], groupId);
  const timestamp = new Date().toISOString();
  const correctAnswers = exerciseResults.filter((result) => result.correct).length;
  const exercisesCompleted = exercises.length;
  const accuracy = exercisesCompleted > 0 ? Math.round((correctAnswers / exercisesCompleted) * 100) : 0;
  const passedThreshold = roundMode === 'round1' ? UNLOCK_THRESHOLD : ROUND_2_MASTERY_THRESHOLD;
  const passedThisRound = accuracy >= passedThreshold;
  const updatedVerbStats = updateVerbStats(previousProgress.verbStats ?? {}, exerciseResults, roundMode, timestamp);
  const missedVerbBases = Array.from(
    new Set(exerciseResults.filter((result) => !result.correct).map((result) => result.exercise.verb.base))
  );

  const round1 = roundMode === 'round1'
    ? updateRoundProgress(previousProgress.round1 ?? createEmptyRoundProgress(), accuracy, passedThisRound, timestamp)
    : previousProgress.round1 ?? createEmptyRoundProgress();
  const round2 = roundMode !== 'round1'
    ? updateRoundProgress(previousProgress.round2 ?? createEmptyRoundProgress(), accuracy, passedThisRound, timestamp)
    : previousProgress.round2 ?? createEmptyRoundProgress();

  const stage: VerbGroupStage =
    groupId === ALL_PATTERNS_GROUP_ID
      ? (round2.passed ? 'mastered' : getGroupStage(previousProgress))
      : round2.passed ? 'mastered' : round1.passed ? 'passed' : 'not-started';

  const updatedProgress: GroupProgress = {
    ...previousProgress,
    completed: groupId === ALL_PATTERNS_GROUP_ID ? (previousProgress.completed || passedThisRound) : round1.passed,
    accuracy: roundMode === 'round1'
      ? Math.max(previousProgress.accuracy, accuracy)
      : Math.max(previousProgress.accuracy, accuracy),
    exercisesCompleted: (previousProgress.exercisesCompleted ?? 0) + exercisesCompleted,
    correctAnswers,
    lastAttemptDate: timestamp,
    attempts: previousProgress.attempts + 1,
    stage,
    round1,
    round2,
    verbStats: Object.fromEntries(
      Object.entries(updatedVerbStats).map(([base, stat]) => [
        base,
        {
          ...stat,
          needsReview: stage !== 'mastered' || stat.needsReview,
        },
      ])
    ),
    reviewDue: groupId === ALL_PATTERNS_GROUP_ID ? false : stage === 'passed',
    locked: previousProgress.locked,
    unlockedAt: previousProgress.unlockedAt,
    streak: exerciseResults.reduce((best, result) => {
      if (!result.correct) return best;
      return Math.max(best, 1);
    }, 0),
  };

  if (stage === 'mastered') {
    for (const stat of Object.values(updatedProgress.verbStats ?? {})) {
      stat.needsReview = false;
    }
  }

  const updatedCategoryData = normalizeProgressData({
    ...normalizedData,
    [groupId]: updatedProgress,
  });

  const currentGroupIndex = VERB_GROUPS.findIndex((g) => g.id === groupId);
  const nextGroup = currentGroupIndex >= 0 ? VERB_GROUPS[currentGroupIndex + 1] : undefined;
  let unlockedGroupId: string | undefined;

  if (roundMode === 'round1' && passedThisRound && nextGroup && !isGroupUnlocked(nextGroup.id, normalizedData) && isGroupUnlocked(nextGroup.id, updatedCategoryData)) {
    unlockedGroupId = nextGroup.id;
    updatedCategoryData[nextGroup.id] = {
      ...normalizeGroupProgress(updatedCategoryData[nextGroup.id], nextGroup.id),
      locked: false,
      unlockedAt: updatedCategoryData[nextGroup.id]?.unlockedAt ?? timestamp,
    };
  }

  const completed = roundMode === 'round1' ? passedThisRound : passedThisRound;
  const nextStep = groupId === ALL_PATTERNS_GROUP_ID
    ? 'selection'
    : roundMode === 'round1' && passedThisRound
      ? 'round2'
      : roundMode === 'round1'
        ? 'selection'
        : nextGroup
          ? 'next-group'
          : 'selection';

  return {
    groupId,
    roundMode,
    exercisesCompleted,
    correctAnswers,
    accuracy,
    completed,
    streak: 0,
    pointsAwarded: calculateGroupPoints(accuracy, exercisesCompleted, completed, roundMode),
    unlocked: !!unlockedGroupId,
    newAchievements: [],
    updatedCategoryData,
    missedVerbBases,
    nextStep,
    masteryAchieved: roundMode !== 'round1' && stage === 'mastered',
    reviewDue: updatedProgress.reviewDue,
  };
}

/** Points per round for Irregular Verbs game. Awarded when round is completed. */
const POINTS_PER_ROUND = 5;

export function calculateGroupPoints(
  _accuracy: number,
  _exercisesCompleted: number,
  isRoundCompleted: boolean,
  _roundMode: VerbRoundMode
): number {
  return isRoundCompleted ? POINTS_PER_ROUND : 0;
}

export function initializeProgressData(): Record<string, GroupProgress> {
  const categoryData: Record<string, GroupProgress> = {};

  VERB_GROUPS.forEach((group, index) => {
    categoryData[group.id] = createEmptyGroupProgress(index !== 0);
  });

  if (VERB_GROUPS.length > 0) {
    categoryData[VERB_GROUPS[0].id] = {
      ...categoryData[VERB_GROUPS[0].id],
      locked: false,
      unlockedAt: new Date().toISOString(),
    };
  }

  categoryData[ALL_PATTERNS_GROUP_ID] = createEmptyGroupProgress(true);

  return categoryData;
}

export function getProgressSummary(categoryData: Record<string, GroupProgress>) {
  const normalizedData = normalizeProgressData(categoryData);
  const regularProgress = getRegularGroupProgress(normalizedData);
  const completedGroups = regularProgress.filter((p) => isGroupPassed(p)).length;
  const masteredGroups = regularProgress.filter((p) => isGroupMastered(p)).length;
  const attemptedGroups = regularProgress.filter((p) => p.attempts > 0).length;
  const totalAccuracy = calculateAverageAccuracy(normalizedData);
  const totalExercises = Object.values(normalizedData).reduce((sum, p) => sum + (p.exercisesCompleted ?? 0), 0);

  return {
    completedGroups,
    masteredGroups,
    attemptedGroups,
    totalGroups: VERB_GROUPS.length,
    overallProgress: calculateOverallProgress(normalizedData),
    averageAccuracy: totalAccuracy,
    totalExercisesCompleted: totalExercises,
    nextUnlockedGroup: getNextUnlockedGroup(normalizedData),
    unlockedGroupCount: getUnlockedGroups(normalizedData).length,
    reviewDueCount: getReviewDueGroups(normalizedData).length,
  };
}

export function calculateAverageAccuracy(categoryData: Record<string, GroupProgress>): number {
  const attempts = Object.values(normalizeProgressData(categoryData)).filter((p) => p.attempts > 0);
  if (attempts.length === 0) return 0;

  const totalAccuracy = attempts.reduce((sum, p) => sum + p.accuracy, 0);
  return Math.round(totalAccuracy / attempts.length);
}

export function getProgressionPath(categoryData: Record<string, GroupProgress>) {
  const normalizedData = normalizeProgressData(categoryData);

  return VERB_GROUPS.map((group) => ({
    group,
    progress: normalizedData[group.id] ?? createEmptyGroupProgress(true),
    unlocked: isGroupUnlocked(group.id, normalizedData),
    canUnlock: group.prerequisite
      ? (normalizedData[group.prerequisite]?.round1?.bestAccuracy ?? 0) >= UNLOCK_THRESHOLD - 10
      : true,
  }));
}

export function hasCompletedAllGroups(categoryData: Record<string, GroupProgress>): boolean {
  const normalizedData = normalizeProgressData(categoryData);
  return VERB_GROUPS.every((group) => isGroupPassed(normalizedData[group.id]));
}

export function hasMasteredAllGroups(categoryData: Record<string, GroupProgress>): boolean {
  const normalizedData = normalizeProgressData(categoryData);
  return VERB_GROUPS.every((group) => isGroupMastered(normalizedData[group.id]));
}

export function exportProgressStats(categoryData: Record<string, GroupProgress>) {
  const normalizedData = normalizeProgressData(categoryData);
  const summary = getProgressSummary(normalizedData);

  return {
    summary,
    stats: VERB_GROUPS.map((group) => ({
      groupId: group.id,
      groupTitle: group.title,
      progress: normalizedData[group.id],
      unlocked: isGroupUnlocked(group.id, normalizedData),
    })),
    timestamp: new Date().toISOString(),
  };
}
