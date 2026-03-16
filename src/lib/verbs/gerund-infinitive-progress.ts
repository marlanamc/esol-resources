/**
 * Progress tracking and unlock logic for the Gerunds & Infinitives Pattern Discovery Game.
 * Mirrors the structure of irregular-verbs-progress.ts.
 */

import {
  GI_GROUPS,
  GI_REVIEW_GROUP_ID,
  GI_FINAL_GROUP_ID,
  getGIGroupById,
} from '@/data/gerund-infinitive-groups';
import type {
  GerundInfinitiveGroup,
  GIGroupProgress,
  GIRoundResults,
  GIGroupStage,
  GIRoundMode,
  GIRoundProgress,
  PatternPerformance,
  GIExercise,
} from '@/types/gerund-infinitive';
import {
  GI_UNLOCK_THRESHOLD,
  GI_MASTERY_THRESHOLD,
  GI_REVIEW_UNLOCK_GROUPS,
} from '@/types/gerund-infinitive';

// ---------------------------------------------------------------------------
// CONSTANTS RE-EXPORTED FOR CONVENIENCE
// ---------------------------------------------------------------------------

export const UNLOCK_THRESHOLD = GI_UNLOCK_THRESHOLD;          // 80
export const ROUND_2_MASTERY_THRESHOLD = GI_MASTERY_THRESHOLD; // 85

/** How many groups are needed to unlock the Mixed Review */
export const REVIEW_UNLOCK_COUNT = GI_REVIEW_UNLOCK_GROUPS;   // 5

// ---------------------------------------------------------------------------
// PRIVATE HELPERS
// ---------------------------------------------------------------------------

function createEmptyRoundProgress(): GIRoundProgress {
  return { attempts: 0, bestAccuracy: 0, lastAccuracy: 0, passed: false };
}

function createEmptyGroupProgress(locked = true): GIGroupProgress {
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
    patternStats: {},
    reviewDue: false,
  };
}

function normalizeRoundProgress(
  value: unknown,
  fallbackAccuracy = 0,
  fallbackAttempts = 0,
  fallbackPassed = false
): GIRoundProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { attempts: fallbackAttempts, bestAccuracy: fallbackAccuracy, lastAccuracy: fallbackAccuracy, passed: fallbackPassed };
  }
  const r = value as Partial<GIRoundProgress>;
  return {
    attempts: r.attempts ?? fallbackAttempts,
    bestAccuracy: r.bestAccuracy ?? fallbackAccuracy,
    lastAccuracy: r.lastAccuracy ?? fallbackAccuracy,
    lastAttemptDate: r.lastAttemptDate,
    passed: r.passed ?? fallbackPassed,
  };
}

function normalizePatternStats(value: unknown): Record<string, PatternPerformance> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const stats = value as Record<string, Partial<PatternPerformance>>;
  const normalized: Record<string, PatternPerformance> = {};
  for (const [id, stat] of Object.entries(stats)) {
    normalized[id] = {
      patternId: id,
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

// ---------------------------------------------------------------------------
// PUBLIC: STAGE & STATUS HELPERS
// ---------------------------------------------------------------------------

export function getGroupStage(progress?: GIGroupProgress): GIGroupStage {
  if (!progress) return 'not-started';
  if (progress.stage) return progress.stage;
  if (progress.round2?.passed || (progress.completed && progress.round2?.attempts)) return 'mastered';
  if (progress.completed) return 'passed';
  return 'not-started';
}

export function isGroupPassed(progress?: GIGroupProgress): boolean {
  return getGroupStage(progress) !== 'not-started';
}

export function isGroupMastered(progress?: GIGroupProgress): boolean {
  return getGroupStage(progress) === 'mastered';
}

// ---------------------------------------------------------------------------
// PUBLIC: UNLOCK LOGIC
// ---------------------------------------------------------------------------

/**
 * Check if mixed review is ready with stricter requirements
 * Requires: 5+ groups passed AND pattern family coverage
 */
export function isMixedReviewReady(
  categoryData: Record<string, GIGroupProgress>
): { ready: boolean; reason?: string } {
  const passedGroups = GI_GROUPS.filter(g => isGroupPassed(categoryData[g.id]));
  const passedCount = passedGroups.length;

  // Requirement 1: At least 5 groups passed
  if (passedCount < REVIEW_UNLOCK_COUNT) {
    return {
      ready: false,
      reason: `Complete ${REVIEW_UNLOCK_COUNT - passedCount} more pattern groups first`,
    };
  }

  // Requirement 2: Check pattern family coverage
  // Each major pattern family should have at least one passed group
  const patternFamilies = new Set<string>();
  for (const group of passedGroups) {
    // Extract pattern family from group ID or patterns
    if (group.id.includes('0a') || group.id.includes('0b')) {
      patternFamilies.add('intro');
    } else if (group.id.includes('1')) {
      patternFamilies.add('preposition');
    } else if (group.id.includes('2')) {
      patternFamilies.add('verb-forms');
    } else if (group.id.includes('3')) {
      patternFamilies.add('adjective-noun');
    } else if (group.id.includes('subject')) {
      patternFamilies.add('subject');
    } else {
      patternFamilies.add('other');
    }
  }

  // Require at least 3 different pattern families
  const MIN_PATTERN_FAMILIES = 3;
  if (patternFamilies.size < MIN_PATTERN_FAMILIES) {
    return {
      ready: false,
      reason: 'Practice more variety of pattern types first',
    };
  }

  // Requirement 3: Check that each passed group has at least 5 correct answers total
  const groupsWithSufficientPractice = passedGroups.filter(group => {
    const progress = categoryData[group.id];
    const totalCorrect = Object.values(progress?.patternStats ?? {})
      .reduce((sum, stat) => sum + (stat.correct ?? 0), 0);
    return totalCorrect >= 5;
  });

  if (groupsWithSufficientPractice.length < Math.min(3, passedCount)) {
    return {
      ready: false,
      reason: 'Get more practice in your passed groups first',
    };
  }

  return { ready: true };
}

export function isGroupUnlocked(
  groupId: string,
  categoryData: Record<string, GIGroupProgress>
): boolean {
  // Feature flag: unlock all groups (for testing/special access)
  if (process.env.NEXT_PUBLIC_UNLOCK_ALL_GI_GROUPS === 'true') {
    return true;
  }

  if (groupId === GI_REVIEW_GROUP_ID) {
    // Use stricter mixed review requirements
    const { ready } = isMixedReviewReady(categoryData);
    return ready;
  }

  if (groupId === GI_FINAL_GROUP_ID) {
    return GI_GROUPS.every(g => isGroupPassed(categoryData[g.id]));
  }

  const group = getGIGroupById(groupId);
  if (!group) return false;
  if (!group.prerequisite) return true; // Group 1 is always unlocked

  return isGroupPassed(categoryData[group.prerequisite]);
}

export function getPassedGroups(categoryData: Record<string, GIGroupProgress>): GerundInfinitiveGroup[] {
  return GI_GROUPS.filter(g => isGroupPassed(categoryData[g.id]));
}

export function hasAnyPassedGroups(categoryData: Record<string, GIGroupProgress>): boolean {
  return GI_GROUPS.some(g => isGroupPassed(categoryData[g.id]));
}

export function hasCompletedAllGroups(categoryData: Record<string, GIGroupProgress>): boolean {
  return GI_GROUPS.every(g => isGroupPassed(categoryData[g.id]));
}

// ---------------------------------------------------------------------------
// PUBLIC: DATA NORMALIZATION
// ---------------------------------------------------------------------------

export function normalizeGroupProgress(
  progress: GIGroupProgress | undefined,
  groupId: string
): GIGroupProgress {
  const locked = progress?.locked ?? groupId !== GI_GROUPS[0]?.id;
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
    patternStats: normalizePatternStats(progress?.patternStats),
    reviewDue: progress?.reviewDue ?? stage === 'passed',
  };
}

export function normalizeProgressData(
  raw: Record<string, GIGroupProgress> | null | undefined
): Record<string, GIGroupProgress> {
  const base = initializeProgressData();
  if (!raw) return base;
  const normalized: Record<string, GIGroupProgress> = { ...base };
  for (const group of GI_GROUPS) {
    normalized[group.id] = normalizeGroupProgress(raw[group.id], group.id);
  }
  for (const specialId of [GI_REVIEW_GROUP_ID, GI_FINAL_GROUP_ID]) {
    if (raw[specialId]) {
      normalized[specialId] = normalizeGroupProgress(raw[specialId], specialId);
    }
  }
  return normalized;
}

export function initializeProgressData(): Record<string, GIGroupProgress> {
  const categoryData: Record<string, GIGroupProgress> = {};

  GI_GROUPS.forEach((group, index) => {
    categoryData[group.id] = createEmptyGroupProgress(index !== 0);
  });

  if (GI_GROUPS.length > 0) {
    categoryData[GI_GROUPS[0].id] = {
      ...categoryData[GI_GROUPS[0].id],
      locked: false,
      unlockedAt: new Date().toISOString(),
    };
  }

  categoryData[GI_REVIEW_GROUP_ID] = createEmptyGroupProgress(true);
  categoryData[GI_FINAL_GROUP_ID] = createEmptyGroupProgress(true);

  return categoryData;
}

// ---------------------------------------------------------------------------
// PUBLIC: PROGRESS CALCULATION
// ---------------------------------------------------------------------------

export function calculateOverallProgress(categoryData: Record<string, GIGroupProgress>): number {
  if (GI_GROUPS.length === 0) return 0;
  const passedCount = GI_GROUPS.filter(g => isGroupPassed(categoryData[g.id])).length;
  return Math.round((passedCount / GI_GROUPS.length) * 100);
}

/** Points per round for Gerunds & Infinitives game. Awarded when round is completed. */
const POINTS_PER_ROUND = 5;

export function calculateGroupPoints(
  _accuracy: number,
  _exercisesCompleted: number,
  isRoundCompleted: boolean,
  _roundMode: GIRoundMode
): number {
  return isRoundCompleted ? POINTS_PER_ROUND : 0;
}

export function getProgressSummary(categoryData: Record<string, GIGroupProgress>) {
  const normalizedData = normalizeProgressData(categoryData);
  const completedGroups = GI_GROUPS.filter(g => isGroupPassed(normalizedData[g.id])).length;
  const masteredGroups = GI_GROUPS.filter(g => isGroupMastered(normalizedData[g.id])).length;
  const attemptedGroups = GI_GROUPS.filter(g => (normalizedData[g.id]?.attempts ?? 0) > 0).length;
  const totalExercises = Object.values(normalizedData).reduce((sum, p) => sum + (p.exercisesCompleted ?? 0), 0);

  return {
    completedGroups,
    masteredGroups,
    attemptedGroups,
    totalGroups: GI_GROUPS.length,
    overallProgress: calculateOverallProgress(normalizedData),
    totalExercisesCompleted: totalExercises,
    reviewUnlocked: isGroupUnlocked(GI_REVIEW_GROUP_ID, normalizedData),
    finalUnlocked: isGroupUnlocked(GI_FINAL_GROUP_ID, normalizedData),
  };
}

// ---------------------------------------------------------------------------
// PUBLIC: ROUND RESULT PROCESSING
// ---------------------------------------------------------------------------

type ExerciseOutcome = { exercise: GIExercise; correct: boolean };

function updatePatternStats(
  existing: Record<string, PatternPerformance>,
  exerciseResults: ExerciseOutcome[],
  roundMode: GIRoundMode,
  timestamp: string
): Record<string, PatternPerformance> {
  const updated = { ...existing };

  for (const { exercise, correct } of exerciseResults) {
    const pid = exercise.patternId;
    const previous = updated[pid] ?? {
      patternId: pid, seen: 0, correct: 0, misses: 0,
      round1Misses: 0, round2Misses: 0, needsReview: false,
    };

    updated[pid] = {
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

export function processRoundResults(
  groupId: string,
  roundMode: GIRoundMode,
  exercises: GIExercise[],
  exerciseResults: ExerciseOutcome[],
  currentCategoryData: Record<string, GIGroupProgress>
): GIRoundResults {
  const normalizedData = normalizeProgressData(currentCategoryData);
  const previousProgress = normalizeGroupProgress(normalizedData[groupId], groupId);
  const timestamp = new Date().toISOString();
  const correctAnswers = exerciseResults.filter(r => r.correct).length;
  const exercisesCompleted = exercises.length;
  const accuracy = exercisesCompleted > 0 ? Math.round((correctAnswers / exercisesCompleted) * 100) : 0;

  const isSpecial = groupId === GI_REVIEW_GROUP_ID || groupId === GI_FINAL_GROUP_ID;
  const passedThreshold = roundMode === 'round1' ? UNLOCK_THRESHOLD : ROUND_2_MASTERY_THRESHOLD;
  const passedThisRound = accuracy >= passedThreshold;

  const updatedPatternStats = updatePatternStats(
    previousProgress.patternStats ?? {},
    exerciseResults,
    roundMode,
    timestamp
  );

  const missedPatternIds = Array.from(
    new Set(exerciseResults.filter(r => !r.correct).map(r => r.exercise.patternId))
  );

  const round1 = roundMode === 'round1'
    ? updateRoundProgress(previousProgress.round1 ?? createEmptyRoundProgress(), accuracy, passedThisRound, timestamp)
    : previousProgress.round1 ?? createEmptyRoundProgress();

  const round2 = roundMode !== 'round1'
    ? updateRoundProgress(previousProgress.round2 ?? createEmptyRoundProgress(), accuracy, passedThisRound, timestamp)
    : previousProgress.round2 ?? createEmptyRoundProgress();

  const stage: GIGroupStage = round2.passed ? 'mastered' : round1.passed ? 'passed' : 'not-started';

  const updatedProgress: GIGroupProgress = {
    ...previousProgress,
    completed: isSpecial ? (previousProgress.completed || passedThisRound) : round1.passed,
    accuracy: Math.max(previousProgress.accuracy, accuracy),
    exercisesCompleted: (previousProgress.exercisesCompleted ?? 0) + exercisesCompleted,
    correctAnswers,
    lastAttemptDate: timestamp,
    attempts: previousProgress.attempts + 1,
    stage,
    round1,
    round2,
    patternStats: updatedPatternStats,
    reviewDue: isSpecial ? false : stage === 'passed',
    locked: previousProgress.locked,
    unlockedAt: previousProgress.unlockedAt,
  };

  const updatedCategoryData = normalizeProgressData({
    ...normalizedData,
    [groupId]: updatedProgress,
  });

  // Check if the next group gets unlocked
  const currentGroupIndex = GI_GROUPS.findIndex(g => g.id === groupId);
  const nextGroup = currentGroupIndex >= 0 ? GI_GROUPS[currentGroupIndex + 1] : undefined;
  let unlockedGroupId: string | undefined;

  if (
    roundMode === 'round1' &&
    passedThisRound &&
    nextGroup &&
    !isGroupUnlocked(nextGroup.id, normalizedData) &&
    isGroupUnlocked(nextGroup.id, updatedCategoryData)
  ) {
    unlockedGroupId = nextGroup.id;
    updatedCategoryData[nextGroup.id] = {
      ...normalizeGroupProgress(updatedCategoryData[nextGroup.id], nextGroup.id),
      locked: false,
      unlockedAt: updatedCategoryData[nextGroup.id]?.unlockedAt ?? timestamp,
    };
  }

  // Determine next step - checkpoints skip round2 and go directly to next group
  const group = getGIGroupById(groupId);
  const isCheckpoint = group?.isCheckpoint ?? false;

  const nextStep: GIRoundResults['nextStep'] = isSpecial
    ? 'selection'
    : isCheckpoint && passedThisRound
    ? (nextGroup ? 'next-group' : 'selection')  // Checkpoints go directly to next group
    : roundMode === 'round1' && passedThisRound
    ? 'round2'
    : roundMode === 'round1'
    ? 'selection'
    : nextGroup
    ? 'next-group'
    : 'selection';

  // Compute achievements
  const newAchievements: string[] = [];
  if (groupId === 'group-1' && passedThisRound) {
    newAchievements.push('pattern-spotter');  // First pattern group completed
    newAchievements.push('preposition-pro');  // Mastered preposition patterns
  }
  if (groupId === 'group-7' && passedThisRound) newAchievements.push('to-trap-master'); // "TO" as preposition trap
  if (groupId === 'group-6b' && stage === 'mastered') newAchievements.push('meaning-master');
  if (groupId === GI_FINAL_GROUP_ID && passedThisRound) newAchievements.push('grammar-guru');

  return {
    groupId,
    roundMode,
    exercisesCompleted,
    correctAnswers,
    accuracy,
    completed: passedThisRound,
    streak: 0,
    bestStreak: 0,
    pointsAwarded: calculateGroupPoints(accuracy, exercisesCompleted, passedThisRound, roundMode),
    unlocked: !!unlockedGroupId,
    newAchievements,
    updatedCategoryData,
    missedPatternIds,
    nextStep,
    masteryAchieved: roundMode !== 'round1' && stage === 'mastered',
    reviewDue: updatedProgress.reviewDue,
  };
}

function updateRoundProgress(
  previous: GIRoundProgress,
  accuracy: number,
  passed: boolean,
  timestamp: string
): GIRoundProgress {
  return {
    attempts: previous.attempts + 1,
    bestAccuracy: Math.max(previous.bestAccuracy, accuracy),
    lastAccuracy: accuracy,
    lastAttemptDate: timestamp,
    passed: previous.passed || passed,
  };
}
