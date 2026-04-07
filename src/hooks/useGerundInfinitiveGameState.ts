'use client';

/**
 * State machine and data for the Gerund & Infinitive game: group selection, exercises, round results,
 * progress sync with API, and navigation between selection / intro / exercise / results phases.
 * @see GerundInfinitiveGame
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  GerundInfinitiveGroup,
  GIExercise,
  GIRoundResults,
  GIGroupProgress,
  GIRoundMode,
} from '@/types/gerund-infinitive';
import {
  generateExercises,
  generateMixedReviewExercises,
  generateTargetedRound2Exercises,
  generateFinalChallengeExercises,
  generateCheckpointExercises,
  resetExerciseSelectionContext,
} from '@/data/gerund-infinitive-exercises';
import {
  GI_REVIEW_GROUP_ID,
  GI_FINAL_GROUP_ID,
  GI_GROUPS,
  getGIGroupById,
} from '@/data/gerund-infinitive-groups';
import {
  normalizeProgressData,
  processRoundResults,
  calculateOverallProgress,
  getPassedGroups,
  initializeProgressData,
  getGroupStage,
} from '@/lib/gerund-infinitive-progress';

export type GIGamePhase = 'selection' | 'intro' | 'sorting' | 'exercise' | 'results';

interface ExerciseOutcome {
  exercise: GIExercise;
  correct: boolean;
}

interface GIGameState {
  phase: GIGamePhase;
  selectedGroup: GerundInfinitiveGroup | null;
  selectedRoundMode: GIRoundMode;
  exercises: GIExercise[];
  currentExerciseIndex: number;
  roundResults: GIRoundResults | null;
  categoryData: Record<string, GIGroupProgress>;
  loading: boolean;
  error: string | null;
  saveError: string | null;  // Shown as toast when save fails (any phase)
  lockedGroupError: string | null;  // Shown as toast when tapping locked group
  exerciseResults: ExerciseOutcome[];
}

export { GI_REVIEW_GROUP_ID, GI_FINAL_GROUP_ID };

export function hasCompletedAllGIGroups(
  categoryData: Record<string, GIGroupProgress>
): boolean {
  return GI_GROUPS.every(group => getGroupStage(categoryData[group.id]) !== 'not-started');
}

function getDefaultRoundMode(
  group: GerundInfinitiveGroup,
  categoryData: Record<string, GIGroupProgress>
): GIRoundMode {
  if (group.id === GI_REVIEW_GROUP_ID || group.id === GI_FINAL_GROUP_ID) return 'review';
  // Checkpoints are single-round challenges (no round2)
  if (group.isCheckpoint) return 'round1';
  const stage = getGroupStage(categoryData[group.id]);
  if (stage === 'not-started') return 'round1';
  if (stage === 'passed') return 'round2';
  return 'review';
}

function calculateBestStreak(results: ExerciseOutcome[]): number {
  let best = 0;
  let current = 0;
  for (const r of results) {
    if (r.correct) { current++; best = Math.max(best, current); }
    else current = 0;
  }
  return best;
}

function buildExercisesForMode(
  group: GerundInfinitiveGroup,
  roundMode: GIRoundMode,
  categoryData: Record<string, GIGroupProgress>,
  currentStreak = 0
): GIExercise[] {
  const noHints = group.id === GI_FINAL_GROUP_ID;

  if (group.id === GI_FINAL_GROUP_ID) {
    const passedGroups = getPassedGroups(categoryData);
    const groups = passedGroups.length > 0 ? passedGroups : GI_GROUPS.slice(0, 1);
    return generateFinalChallengeExercises(groups, 20);
  }

  if (group.id === GI_REVIEW_GROUP_ID) {
    const passedGroups = getPassedGroups(categoryData);
    const groups = passedGroups.length > 0 ? passedGroups : GI_GROUPS.slice(0, 1);
    const allPatternStats: Record<string, import('@/types/gerund-infinitive').PatternPerformance> = {};
    for (const g of groups) {
      const stats = categoryData[g.id]?.patternStats ?? {};
      for (const [pid, stat] of Object.entries(stats)) {
        allPatternStats[pid] = stat;
      }
    }
    return generateMixedReviewExercises(groups, allPatternStats, 12, noHints);
  }

  // Handle checkpoint groups - pull patterns from reviewsGroups
  if (group.isCheckpoint && group.reviewsGroups) {
    const reviewGroups = group.reviewsGroups
      .map(id => getGIGroupById(id))
      .filter((g): g is GerundInfinitiveGroup => g !== undefined);

    // Collect pattern stats from all reviewed groups
    const allPatternStats: Record<string, import('@/types/gerund-infinitive').PatternPerformance> = {};
    for (const g of reviewGroups) {
      const stats = categoryData[g.id]?.patternStats ?? {};
      for (const [pid, stat] of Object.entries(stats)) {
        allPatternStats[pid] = stat;
      }
    }

    return generateCheckpointExercises(reviewGroups, allPatternStats, 10, currentStreak);
  }

  if (roundMode === 'round1') {
    return generateExercises(group, 10, noHints, true);
  }

  const count = roundMode === 'round2' ? 8 : 10;
  return generateTargetedRound2Exercises(
    group,
    categoryData[group.id]?.patternStats ?? {},
    count,
    noHints
  );
}

// ---------------------------------------------------------------------------
// MAIN HOOK
// ---------------------------------------------------------------------------

export function useGerundInfinitiveGameState(activityId: string) {
  const [state, setState] = useState<GIGameState>({
    phase: 'selection',
    selectedGroup: null,
    selectedRoundMode: 'round1',
    exercises: [],
    currentExerciseIndex: 0,
    roundResults: null,
    categoryData: {},
    loading: true,
    error: null,
    saveError: null,
    lockedGroupError: null,
    exerciseResults: [],
  });

  // Load progress on mount and reset sentence selection for fresh variety
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Reset sentence selection context for maximum variety in this session
        resetExerciseSelectionContext();
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(`/api/activity/progress?activityId=${activityId}`);
        if (!response.ok) throw new Error('Failed to load progress');
        const data = await response.json();
        const categoryData = data.categoryData
          ? normalizeProgressData(
              JSON.parse(typeof data.categoryData === 'string' ? data.categoryData : JSON.stringify(data.categoryData))
            )
          : initializeProgressData();
        setState(prev => ({ ...prev, categoryData, loading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
        setState(prev => ({ ...prev, error: errorMessage, loading: false, categoryData: initializeProgressData() }));
      }
    };
    initializeGame();
  }, [activityId]);

  const selectGroup = useCallback((group: GerundInfinitiveGroup) => {
    const roundMode = getDefaultRoundMode(group, state.categoryData);
    setState(prev => ({
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
    // For Mixed Verbs group (group-2c), show sorting mini-game first (only on round1)
    if (state.selectedGroup.id === 'group-2c' && state.selectedRoundMode === 'round1') {
      setState(prev => ({ ...prev, phase: 'sorting', error: null }));
      return;
    }
    const exercises = buildExercisesForMode(state.selectedGroup, state.selectedRoundMode, state.categoryData);
    setState(prev => ({ ...prev, exercises, currentExerciseIndex: 0, roundResults: null, exerciseResults: [], phase: 'exercise', error: null }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData]);

  const completeSortingMiniGame = useCallback(() => {
    if (!state.selectedGroup) return;
    const exercises = buildExercisesForMode(state.selectedGroup, state.selectedRoundMode, state.categoryData);
    setState(prev => ({ ...prev, exercises, currentExerciseIndex: 0, roundResults: null, exerciseResults: [], phase: 'exercise', error: null }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData]);

  const skipSortingMiniGame = useCallback(() => {
    if (!state.selectedGroup) return;
    const exercises = buildExercisesForMode(state.selectedGroup, state.selectedRoundMode, state.categoryData);
    setState(prev => ({ ...prev, exercises, currentExerciseIndex: 0, roundResults: null, exerciseResults: [], phase: 'exercise', error: null }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData]);

  const submitAnswer = useCallback((correct: boolean, exercise: GIExercise) => {
    setState(prev => {
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

      return { ...prev, currentExerciseIndex: newIndex, exerciseResults: newResults };
    });
  }, []);

  const saveProgress = useCallback(async (results: GIRoundResults): Promise<{ pointsAwarded?: number } | null> => {
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
        }),
      });
      const data = response.ok ? (await response.json()) as { pointsAwarded?: number } : null;
      if (!response.ok) throw new Error('Failed to save progress');
      setState(prev => ({ ...prev, categoryData: updatedCategoryData }));
      return data;
    } catch {
      setState(prev => ({ ...prev, saveError: 'Progress could not be saved. Your work may not sync across devices.' }));
      return null;
    }
  }, [state.selectedGroup, activityId]);

  const retryGroup = useCallback(() => {
    if (!state.selectedGroup) return;
    const exercises = buildExercisesForMode(state.selectedGroup, state.selectedRoundMode, state.categoryData);
    setState(prev => ({ ...prev, exercises, currentExerciseIndex: 0, roundResults: null, exerciseResults: [], phase: 'exercise', error: null }));
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData]);

  const returnToGroupIntro = useCallback(() => {
    if (!state.selectedGroup) return;
    setState(prev => ({ ...prev, phase: 'intro', exercises: [], currentExerciseIndex: 0, roundResults: null, exerciseResults: [], error: null }));
  }, [state.selectedGroup]);

  const continueToNext = useCallback(() => {
    if (!state.selectedGroup) return;
    const selectedGroup = state.selectedGroup;
    const nextAction = state.roundResults?.nextStep;
    const effectiveCategoryData = state.roundResults?.updatedCategoryData
      ? normalizeProgressData(state.roundResults.updatedCategoryData)
      : state.categoryData;

    if (selectedGroup.id === GI_REVIEW_GROUP_ID || selectedGroup.id === GI_FINAL_GROUP_ID) {
      setState(prev => ({ ...prev, phase: 'selection', selectedGroup: null, exercises: [], currentExerciseIndex: 0, roundResults: null, exerciseResults: [] }));
      return;
    }

    if (nextAction === 'round2') {
      // Skip intro when advancing to Round 2 — go directly to exercise
      const round2Exercises = buildExercisesForMode(
        selectedGroup,
        'round2',
        effectiveCategoryData,
        state.roundResults?.streak ?? 0
      );
      setState(prev => ({
        ...prev,
        selectedRoundMode: 'round2',
        phase: 'exercise',
        exercises: round2Exercises,
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        error: null,
      }));
      return;
    }

    const currentIndex = GI_GROUPS.findIndex(g => g.id === selectedGroup.id);
    const nextGroup = GI_GROUPS[currentIndex + 1];
    if (nextGroup) {
      const nextRoundMode = getDefaultRoundMode(nextGroup, effectiveCategoryData);
      setState(prev => ({
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

    setState(prev => ({
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
    // Reset context when returning to selection to ensure fresh variety if user tries another group
    resetExerciseSelectionContext();
    setState(prev => ({
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

  const dismissSaveError = useCallback(() => {
    setState(prev => ({ ...prev, saveError: null }));
  }, []);

  const dismissLockedGroupError = useCallback(() => {
    setState(prev => ({ ...prev, lockedGroupError: null }));
  }, []);

  return {
    state,
    selectGroup,
    dismissSaveError,
    dismissLockedGroupError,
    startGroupChallenge,
    completeSortingMiniGame,
    skipSortingMiniGame,
    returnToGroupIntro,
    submitAnswer,
    saveProgress,
    retryGroup,
    continueToNext,
    quitGame,
  };
}
