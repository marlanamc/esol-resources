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
} from '@/data/gerund-infinitive-exercises';
import {
  GI_REVIEW_GROUP_ID,
  GI_FINAL_GROUP_ID,
  GI_GROUPS,
  getGIGroupById,
} from '@/data/gerund-infinitive-groups';
import {
  isGroupUnlocked,
  normalizeProgressData,
  processRoundResults,
  calculateOverallProgress,
  getPassedGroups,
  initializeProgressData,
  getGroupStage,
} from '@/lib/gerund-infinitive-progress';

export type GIGamePhase = 'selection' | 'intro' | 'exercise' | 'results';

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
    exerciseResults: [],
  });

  // Load progress on mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
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
    const unlocked = isGroupUnlocked(group.id, state.categoryData);
    if (!unlocked) {
      setState(prev => ({ ...prev, error: 'Complete the prerequisite group first' }));
      return;
    }
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

  const saveProgress = useCallback(async (results: GIRoundResults) => {
    if (!state.selectedGroup || !results.updatedCategoryData) return;
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
        }),
      });
      if (!response.ok) throw new Error('Failed to save progress');
      setState(prev => ({ ...prev, categoryData: updatedCategoryData }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save progress';
      setState(prev => ({ ...prev, error: errorMessage }));
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
      setState(prev => ({
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

    const currentIndex = GI_GROUPS.findIndex(g => g.id === selectedGroup.id);
    const nextGroup = GI_GROUPS[currentIndex + 1];
    if (nextGroup && isGroupUnlocked(nextGroup.id, effectiveCategoryData)) {
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

  return {
    state,
    selectGroup,
    startGroupChallenge,
    returnToGroupIntro,
    submitAnswer,
    saveProgress,
    retryGroup,
    continueToNext,
    quitGame,
  };
}
