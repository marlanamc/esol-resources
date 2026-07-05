'use client';

/**
 * State machine and data for the Irregular Verbs game: group selection, exercises, round results,
 * progress sync with API, and navigation between selection / intro / exercise / results phases.
 * @see IrregularVerbsGame
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  VerbGroup,
  VerbExercise,
  VerbGameRoundResults,
  GroupProgress,
  VerbRoundMode,
} from '@/types/irregular-verbs';
import {
  generateExercises,
  generateMixedReviewExercises,
  generateTargetedRound2Exercises,
} from '@/data/irregular-verbs-exercises';
import {
  ALL_PATTERNS_GROUP,
  ALL_PATTERNS_GROUP_ID,
  calculateOverallProgress,
  getGroupStage,
  getPassedGroups,
  isGroupUnlocked,
  normalizeProgressData,
  processRoundResults,
  initializeProgressData,
} from '@/lib/verbs/irregular-progress';
import { VERB_GROUPS } from '@/data/irregular-verbs-groups';

export type GamePhase = 'selection' | 'intro' | 'exercise' | 'results';

interface ExerciseOutcome {
  exercise: VerbExercise;
  correct: boolean;
}

interface VerbGameState {
  phase: GamePhase;
  selectedGroup: VerbGroup | null;
  selectedRoundMode: VerbRoundMode;
  exercises: VerbExercise[];
  currentExerciseIndex: number;
  roundResults: VerbGameRoundResults | null;
  categoryData: Record<string, GroupProgress>;
  loading: boolean;
  error: string | null;
  exerciseResults: ExerciseOutcome[];
}

export { ALL_PATTERNS_GROUP_ID, ALL_PATTERNS_GROUP };

export function hasCompletedAllRegularVerbGroups(
  categoryData: Record<string, GroupProgress>
): boolean {
  return VERB_GROUPS.every((group) => getGroupStage(categoryData[group.id]) !== 'not-started');
}

function calculateBestStreak(results: ExerciseOutcome[]): number {
  let best = 0;
  let current = 0;

  for (const result of results) {
    if (result.correct) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

function getDefaultRoundMode(group: VerbGroup, categoryData: Record<string, GroupProgress>): VerbRoundMode {
  if (group.id === ALL_PATTERNS_GROUP_ID) return 'review';

  const stage = getGroupStage(categoryData[group.id]);
  if (stage === 'not-started') return 'round1';
  if (stage === 'passed') return 'round2';
  return 'review';
}

function getAllPatternsVerbStats(categoryData: Record<string, GroupProgress>) {
  const merged: NonNullable<GroupProgress['verbStats']> = {};

  for (const group of getPassedGroups(categoryData)) {
    const stats = categoryData[group.id]?.verbStats ?? {};
    for (const [base, stat] of Object.entries(stats)) {
      merged[base] = {
        seen: (merged[base]?.seen ?? 0) + (stat.seen ?? 0),
        correct: (merged[base]?.correct ?? 0) + (stat.correct ?? 0),
        misses: (merged[base]?.misses ?? 0) + (stat.misses ?? 0),
        round1Misses: (merged[base]?.round1Misses ?? 0) + (stat.round1Misses ?? 0),
        round2Misses: (merged[base]?.round2Misses ?? 0) + (stat.round2Misses ?? 0),
        lastSeenAt: stat.lastSeenAt,
        lastMissedAt: stat.lastMissedAt,
        needsReview: merged[base]?.needsReview || stat.needsReview,
      };
    }
  }

  return merged;
}

function buildExercisesForMode(
  group: VerbGroup,
  roundMode: VerbRoundMode,
  categoryData: Record<string, GroupProgress>,
  hideExplanations: boolean
): VerbExercise[] {
  if (group.id === ALL_PATTERNS_GROUP_ID) {
    const passedGroups = getPassedGroups(categoryData);
    const mixedGroups = passedGroups.length > 0 ? passedGroups : VERB_GROUPS.slice(0, 1);
    return generateMixedReviewExercises(mixedGroups, getAllPatternsVerbStats(categoryData), 14, hideExplanations);
  }

  if (roundMode === 'round1') {
    return generateExercises(group, 10, hideExplanations, true);
  }

  const progress = categoryData[group.id];
  const count = roundMode === 'round2' ? 8 : 10;
  return generateTargetedRound2Exercises(group, progress?.verbStats, count, hideExplanations);
}

export function useVerbGameState(activityId: string, hideExplanations: boolean) {
  const [state, setState] = useState<VerbGameState>({
    phase: 'selection',
    selectedGroup: null,
    selectedRoundMode: 'round1',
    exercises: [],
    currentExerciseIndex: 0,
    roundResults: null,
    categoryData: {},
    loading: true,
    error: null,
    exerciseResults: [],
  });

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(`/api/activity/progress?activityId=${activityId}`);
        if (!response.ok) throw new Error('Failed to load progress');

        const data = await response.json();
        const categoryData = data.categoryData
          ? normalizeProgressData(
              JSON.parse(typeof data.categoryData === 'string' ? data.categoryData : JSON.stringify(data.categoryData))
            )
          : initializeProgressData();

        setState((prev) => ({
          ...prev,
          categoryData,
          loading: false,
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          categoryData: initializeProgressData(),
        }));
      }
    };

    initializeGame();
  }, [activityId]);

  const selectGroup = useCallback((group: VerbGroup) => {
    const unlocked = isGroupUnlocked(group.id, state.categoryData);
    if (!unlocked) {
      setState((prev) => ({
        ...prev,
        error: 'Complete the prerequisite group first',
      }));
      return;
    }

    const roundMode = getDefaultRoundMode(group, state.categoryData);

    setState((prev) => ({
      ...prev,
      selectedGroup: group,
      selectedRoundMode: roundMode,
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      phase: 'intro',
      error: null,
    }));
  }, [state.categoryData]);

  const startGroupChallenge = useCallback(() => {
    if (!state.selectedGroup) return;

    const exercises = buildExercisesForMode(
      state.selectedGroup,
      state.selectedRoundMode,
      state.categoryData,
      hideExplanations
    );

    setState((prev) => ({
      ...prev,
      exercises,
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      phase: 'exercise',
      error: null,
    }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData, hideExplanations]);

  const submitAnswer = useCallback((correct: boolean, exercise: VerbExercise) => {
    setState((prev) => {
      const newResults = [...prev.exerciseResults, { correct, exercise }];
      const newIndex = prev.currentExerciseIndex + 1;

      if (newIndex >= prev.exercises.length && prev.selectedGroup) {
        const results = processRoundResults(
          prev.selectedGroup.id,
          prev.selectedRoundMode,
          prev.exercises,
          newResults,
          prev.categoryData
        );
        const bestStreak = calculateBestStreak(newResults);
        const updatedCategoryData = results.updatedCategoryData
          ? normalizeProgressData(results.updatedCategoryData)
          : prev.categoryData;

        return {
          ...prev,
          currentExerciseIndex: newIndex,
          exerciseResults: newResults,
          roundResults: { ...results, streak: bestStreak },
          categoryData: updatedCategoryData,
          phase: 'results',
        };
      }

      return {
        ...prev,
        currentExerciseIndex: newIndex,
        exerciseResults: newResults,
      };
    });
  }, []);

  const saveProgress = useCallback(async (results: VerbGameRoundResults): Promise<{ pointsAwarded?: number } | null> => {
    if (!state.selectedGroup || !results.updatedCategoryData) return null;

    try {
      const updatedCategoryData = normalizeProgressData(results.updatedCategoryData);
      const overallProgress = calculateOverallProgress(updatedCategoryData);

      const response = await fetch('/api/activity/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          progress: overallProgress,
          status: overallProgress >= 100 ? 'completed' : 'in_progress',
          categoryData: updatedCategoryData,
          groupId: results.groupId,
          roundMode: results.roundMode,
          roundAccuracy: results.accuracy,
          roundExercisesCompleted: results.exercisesCompleted,
        })
      });

      const data = response.ok ? (await response.json()) as { pointsAwarded?: number } : null;
      if (!response.ok) throw new Error('Failed to save progress');

      setState((prev) => ({
        ...prev,
        categoryData: updatedCategoryData,
      }));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save progress';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return null;
    }
  }, [state.selectedGroup, activityId]);

  const retryGroup = useCallback(() => {
    if (!state.selectedGroup) return;

    const exercises = buildExercisesForMode(
      state.selectedGroup,
      state.selectedRoundMode,
      state.categoryData,
      hideExplanations
    );

    setState((prev) => ({
      ...prev,
      exercises,
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      phase: 'exercise',
      error: null,
    }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData, hideExplanations]);

  const returnToGroupIntro = useCallback(() => {
    if (!state.selectedGroup) return;

    setState((prev) => ({
      ...prev,
      phase: 'intro',
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      error: null,
    }));
  }, [state.selectedGroup]);

  const continueToNext = useCallback(() => {
    if (!state.selectedGroup) return;

    const selectedGroup = state.selectedGroup;
    const nextAction = state.roundResults?.nextStep;
    const effectiveCategoryData = state.roundResults?.updatedCategoryData
      ? normalizeProgressData(state.roundResults.updatedCategoryData)
      : state.categoryData;

    if (selectedGroup.id === ALL_PATTERNS_GROUP_ID) {
      setState((prev) => ({
        ...prev,
        phase: 'selection',
        selectedGroup: null,
        exercises: [],
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
      }));
      return;
    }

    if (nextAction === 'round2') {
      setState((prev) => ({
        ...prev,
        selectedRoundMode: 'round2',
        phase: 'intro',
        exercises: [],
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        error: null,
      }));
      return;
    }

    const currentIndex = VERB_GROUPS.findIndex((g) => g.id === selectedGroup.id);
    const nextGroup = VERB_GROUPS[currentIndex + 1];

    if (nextGroup && isGroupUnlocked(nextGroup.id, effectiveCategoryData)) {
      const nextRoundMode = getDefaultRoundMode(nextGroup, effectiveCategoryData);
      setState((prev) => ({
        ...prev,
        categoryData: effectiveCategoryData,
        selectedGroup: nextGroup,
        selectedRoundMode: nextRoundMode,
        phase: 'intro',
        exercises: [],
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        error: null,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      categoryData: effectiveCategoryData,
      phase: 'selection',
      selectedGroup: null,
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      error: null,
    }));
  }, [state.selectedGroup, state.roundResults, state.categoryData]);

  const quitGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'selection',
      selectedGroup: null,
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      error: null,
    }));
  }, []);

  return {
    state,
    selectGroup,
    startGroupChallenge,
    returnToGroupIntro,
    submitAnswer,
    saveProgress,
    retryGroup,
    continueToNext,
    quitGame
  };
}
