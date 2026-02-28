/**
 * Progress tracking and unlock logic for Irregular Verbs game
 * Handles sequential group unlocking, accuracy calculations, and progression state
 */

import { VERB_GROUPS, getVerbGroupById } from '@/data/irregular-verbs-groups';
import type { GroupProgress, VerbGroup, VerbGameRoundResults } from '@/types/irregular-verbs';

// Unlock threshold: must achieve this accuracy to unlock next group
export const UNLOCK_THRESHOLD = 80;

/**
 * Check if a group is unlocked based on prerequisite completion
 * First group is always unlocked
 * Subsequent groups unlock when prerequisite group achieves 80%+ accuracy
 */
export function isGroupUnlocked(
  groupId: string,
  categoryData: Record<string, GroupProgress>
): boolean {
  const group = getVerbGroupById(groupId);
  if (!group) return false;

  // First group always unlocked
  if (!group.prerequisite) return true;

  // Check if prerequisite is completed with sufficient accuracy
  const prereqProgress = categoryData[group.prerequisite];
  if (!prereqProgress) return false;

  return prereqProgress.completed && prereqProgress.accuracy >= UNLOCK_THRESHOLD;
}

/**
 * Get the next unlocked group that hasn't been completed yet
 * Used for "Continue" functionality
 */
export function getNextUnlockedGroup(
  categoryData: Record<string, GroupProgress>
): VerbGroup | null {
  for (const group of VERB_GROUPS) {
    const progress = categoryData[group.id];

    // Skip already completed groups
    if (progress?.completed) continue;

    // Check if this group is unlocked
    if (isGroupUnlocked(group.id, categoryData)) {
      return group;
    }
  }

  return null; // All groups completed or none unlocked
}

/**
 * Calculate overall progress across all groups (0-100%)
 * Based on number of completed groups
 */
export function calculateOverallProgress(categoryData: Record<string, GroupProgress>): number {
  if (VERB_GROUPS.length === 0) return 0;

  const completedCount = Object.values(categoryData).filter(p => p.completed).length;
  return Math.round((completedCount / VERB_GROUPS.length) * 100);
}

/**
 * Get all unlocked groups for a user
 */
export function getUnlockedGroups(categoryData: Record<string, GroupProgress>): VerbGroup[] {
  return VERB_GROUPS.filter(group => isGroupUnlocked(group.id, categoryData));
}

/**
 * Get all locked groups for a user (with their prerequisites)
 */
export function getLockedGroups(categoryData: Record<string, GroupProgress>) {
  return VERB_GROUPS.filter(
    group => !isGroupUnlocked(group.id, categoryData)
  ).map(group => ({
    group,
    prerequisiteGroup: group.prerequisite ? getVerbGroupById(group.prerequisite) : null,
    prerequisiteProgress: group.prerequisite ? categoryData[group.prerequisite] : null
  }));
}

/**
 * Process round results and return updated group progress
 * Handles: accuracy calculation, completion status, unlock determination
 */
export function processRoundResults(
  groupId: string,
  exercisesCompleted: number,
  correctAnswers: number,
  currentCategoryData: Record<string, GroupProgress>
): VerbGameRoundResults {
  const group = getVerbGroupById(groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);

  // Calculate accuracy
  const accuracy = exercisesCompleted > 0 ? Math.round((correctAnswers / exercisesCompleted) * 100) : 0;

  // Determine if group is completed (80%+ accuracy)
  const isCompleted = accuracy >= UNLOCK_THRESHOLD;

  // Get previous progress for this group (if any)
  const previousProgress = currentCategoryData[groupId] ?? {
    completed: false,
    accuracy: 0,
    exercisesCompleted: 0,
    lastAttemptDate: '',
    attempts: 0
  };

  // Only update completion status if this attempt is better
  // But always update to highest accuracy achieved
  const updatedProgress: GroupProgress = {
    completed: previousProgress.completed || isCompleted, // Once completed, stays completed
    accuracy: Math.max(previousProgress.accuracy, accuracy), // Keep highest accuracy
    exercisesCompleted: (previousProgress.exercisesCompleted ?? 0) + exercisesCompleted,
    lastAttemptDate: new Date().toISOString(),
    attempts: previousProgress.attempts + 1,
    unlockedAt: previousProgress.unlockedAt
  };

  // Update category data
  const updatedCategoryData = {
    ...currentCategoryData,
    [groupId]: updatedProgress
  };

  // Check if this attempt unlocked the next group in sequence
  const currentGroupIndex = VERB_GROUPS.findIndex(g => g.id === groupId);
  const nextGroup = currentGroupIndex >= 0 ? VERB_GROUPS[currentGroupIndex + 1] : undefined;
  let unlockedGroupId: string | undefined;

  const nextWasLocked = nextGroup ? !isGroupUnlocked(nextGroup.id, currentCategoryData) : false;
  const nextIsUnlocked = nextGroup ? isGroupUnlocked(nextGroup.id, updatedCategoryData) : false;

  if (isCompleted && nextGroup && nextWasLocked && nextIsUnlocked) {
    unlockedGroupId = nextGroup.id;
    updatedCategoryData[nextGroup.id] = {
      ...updatedCategoryData[nextGroup.id],
      locked: false,
      unlockedAt: new Date().toISOString()
    };
  }

  return {
    groupId,
    exercisesCompleted,
    correctAnswers,
    accuracy,
    completed: isCompleted,
    streak: correctAnswers, // Simple streak = correct in a row
    pointsAwarded: calculateGroupPoints(accuracy, exercisesCompleted, isCompleted),
    unlocked: !!unlockedGroupId,
    newAchievements: [] // Can be expanded later
  };
}

/**
 * Calculate points for completing a group
 * Base: 3 points per exercise
 * Bonus: +15 for perfect (100%), +10 for unlock, +10 for group completion
 */
export function calculateGroupPoints(
  accuracy: number,
  exercisesCompleted: number,
  isGroupCompleted: boolean
): number {
  let points = exercisesCompleted * 3; // Base: 3 points per exercise

  // Accuracy bonuses
  if (accuracy === 100) {
    points += 15; // Perfect round bonus
  } else if (accuracy >= 90) {
    points += 10; // High accuracy bonus
  } else if (accuracy >= 80) {
    points += 5; // Completion bonus
  }

  // Group completion bonus
  if (isGroupCompleted) {
    points += 10; // Group mastery bonus
  }

  return points;
}

/**
 * Initialize progress data for a new player
 * Returns empty categoryData with first group unlocked
 */
export function initializeProgressData(): Record<string, GroupProgress> {
  const categoryData: Record<string, GroupProgress> = {};

  // Initialize all groups as locked
  VERB_GROUPS.forEach(group => {
    categoryData[group.id] = {
      completed: false,
      accuracy: 0,
      exercisesCompleted: 0,
      lastAttemptDate: '',
      attempts: 0,
      locked: true
    };
  });

  // Unlock first group
  if (VERB_GROUPS.length > 0) {
    categoryData[VERB_GROUPS[0].id] = {
      ...categoryData[VERB_GROUPS[0].id],
      locked: false,
      unlockedAt: new Date().toISOString()
    };
  }

  return categoryData;
}

/**
 * Get user's progress summary
 */
export function getProgressSummary(categoryData: Record<string, GroupProgress>) {
  const completedGroups = Object.values(categoryData).filter(p => p.completed).length;
  const attemptedGroups = Object.values(categoryData).filter(p => p.attempts > 0).length;
  const totalAccuracy = calculateAverageAccuracy(categoryData);
  const totalExercises = Object.values(categoryData).reduce((sum, p) => sum + (p.exercisesCompleted ?? 0), 0);

  return {
    completedGroups,
    attemptedGroups,
    totalGroups: VERB_GROUPS.length,
    overallProgress: calculateOverallProgress(categoryData),
    averageAccuracy: totalAccuracy,
    totalExercisesCompleted: totalExercises,
    nextUnlockedGroup: getNextUnlockedGroup(categoryData),
    unlockedGroupCount: getUnlockedGroups(categoryData).length
  };
}

/**
 * Calculate average accuracy across all attempted groups
 */
export function calculateAverageAccuracy(categoryData: Record<string, GroupProgress>): number {
  const attempts = Object.values(categoryData).filter(p => p.attempts > 0);
  if (attempts.length === 0) return 0;

  const totalAccuracy = attempts.reduce((sum, p) => sum + p.accuracy, 0);
  return Math.round(totalAccuracy / attempts.length);
}

/**
 * Get progression path: ordered list of groups with unlock status
 */
export function getProgressionPath(categoryData: Record<string, GroupProgress>) {
  return VERB_GROUPS.map(group => ({
    group,
    progress: categoryData[group.id] ?? {
      groupId: group.id,
      completed: false,
      accuracy: 0,
      exercisesCompleted: 0,
      lastAttemptDate: '',
      attempts: 0
    },
    unlocked: isGroupUnlocked(group.id, categoryData),
    canUnlock: group.prerequisite
      ? categoryData[group.prerequisite]?.accuracy ?? 0 >= UNLOCK_THRESHOLD - 10 // Show if close to unlock
      : true
  }));
}

/**
 * Check if user has completed all groups
 */
export function hasCompletedAllGroups(categoryData: Record<string, GroupProgress>): boolean {
  return VERB_GROUPS.every(group => categoryData[group.id]?.completed ?? false);
}

/**
 * Export statistics for a user's verb game progress
 */
export function exportProgressStats(categoryData: Record<string, GroupProgress>) {
  const summary = getProgressSummary(categoryData);

  return {
    summary,
    stats: VERB_GROUPS.map(group => ({
      groupId: group.id,
      groupTitle: group.title,
      progress: categoryData[group.id],
      unlocked: isGroupUnlocked(group.id, categoryData)
    })),
    timestamp: new Date().toISOString()
  };
}
