'use client';

import { useState, useCallback, useEffect } from 'react';
import type { VerbGroup, VerbExercise, VerbGameRoundResults, GroupProgress } from '@/types/irregular-verbs';
import { generateExercises } from '@/data/irregular-verbs-exercises';
import { isGroupUnlocked, processRoundResults, initializeProgressData } from '@/lib/irregular-verbs-progress';
import { VERB_GROUPS } from '@/data/irregular-verbs-groups';

export type GamePhase = 'selection' | 'intro' | 'exercise' | 'results';

interface VerbGameState {
  phase: GamePhase;
  selectedGroup: VerbGroup | null;
  exercises: VerbExercise[];
  currentExerciseIndex: number;
  roundResults: VerbGameRoundResults | null;
  categoryData: Record<string, GroupProgress>;
  loading: boolean;
  error: string | null;
  answers: boolean[]; // Track correct/incorrect for each exercise
}

function calculateBestStreak(answers: boolean[]): number {
  let best = 0;
  let current = 0;

  for (const answer of answers) {
    if (answer) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

export function useVerbGameState(activityId: string, hideExplanations: boolean) {
  const [state, setState] = useState<VerbGameState>({
    phase: 'selection',
    selectedGroup: null,
    exercises: [],
    currentExerciseIndex: 0,
    roundResults: null,
    categoryData: {},
    loading: true,
    error: null,
    answers: []
  });

  // Initialize progress data on mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch existing progress from API
        const response = await fetch(`/api/activity/progress?activityId=${activityId}`);
        if (!response.ok) throw new Error('Failed to load progress');

        const data = await response.json();
        const categoryData = data.categoryData
          ? JSON.parse(typeof data.categoryData === 'string' ? data.categoryData : JSON.stringify(data.categoryData))
          : initializeProgressData();

        setState(prev => ({
          ...prev,
          categoryData,
          loading: false
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize game';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
          categoryData: initializeProgressData()
        }));
      }
    };

    initializeGame();
  }, [activityId]);

  // Handle group selection (go to intro screen first)
  const selectGroup = useCallback((group: VerbGroup) => {
    const unlocked = isGroupUnlocked(group.id, state.categoryData);

    if (!unlocked) {
      setState(prev => ({
        ...prev,
        error: `Complete the prerequisite group first`
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      selectedGroup: group,
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      answers: [],
      phase: 'intro',
      error: null
    }));
  }, [state.categoryData]);

  // Start challenge after intro
  const startGroupChallenge = useCallback(() => {
    if (!state.selectedGroup) return;

    const exercises = generateExercises(state.selectedGroup, 10, hideExplanations);
    setState(prev => ({
      ...prev,
      exercises,
      currentExerciseIndex: 0,
      roundResults: null,
      answers: [],
      phase: 'exercise',
      error: null
    }));
  }, [state.selectedGroup, hideExplanations]);

  // Handle exercise answer
  const submitAnswer = useCallback((correct: boolean) => {
    setState(prev => {
      const newAnswers = [...prev.answers, correct];
      const newIndex = prev.currentExerciseIndex + 1;

      // If round complete
      if (newIndex >= prev.exercises.length && prev.selectedGroup) {
        const correctCount = newAnswers.filter(a => a).length;
        const results = processRoundResults(
          prev.selectedGroup.id,
          prev.exercises.length,
          correctCount,
          prev.categoryData
        );
        const bestStreak = calculateBestStreak(newAnswers);

        return {
          ...prev,
          currentExerciseIndex: newIndex,
          answers: newAnswers,
          roundResults: { ...results, streak: bestStreak },
          phase: 'results'
        };
      }

      return {
        ...prev,
        currentExerciseIndex: newIndex,
        answers: newAnswers
      };
    });
  }, []);

  // Update progress after round completion
  const saveProgress = useCallback(async (results: VerbGameRoundResults) => {
    if (!state.selectedGroup) return;

    try {
      // Prepare categoryData update
      const updatedCategoryData = { ...state.categoryData };
      const existingProgress = updatedCategoryData[state.selectedGroup.id];
      const wasCompleted = existingProgress?.completed ?? false;
      const bestAccuracy = Math.max(existingProgress?.accuracy ?? 0, results.accuracy);

      updatedCategoryData[state.selectedGroup.id] = {
        completed: wasCompleted || results.completed,
        accuracy: bestAccuracy,
        attempts: (existingProgress?.attempts ?? 0) + 1,
        exercisesCompleted: (existingProgress?.exercisesCompleted ?? 0) + results.exercisesCompleted,
        correctAnswers: results.correctAnswers,
        lastAttemptDate: new Date().toISOString(),
        streak: results.streak
      };

      // Save to API
      const response = await fetch('/api/activity/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          category: state.selectedGroup.id,
          accuracy: results.accuracy,
          progress: results.completed ? 100 : Math.round((results.correctAnswers / results.exercisesCompleted) * 100)
        })
      });

      if (!response.ok) throw new Error('Failed to save progress');

      setState(prev => ({
        ...prev,
        categoryData: updatedCategoryData
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save progress';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  }, [state.selectedGroup, state.categoryData, activityId]);

  // Retry current group
  const retryGroup = useCallback(() => {
    if (!state.selectedGroup) return;

    const exercises = generateExercises(state.selectedGroup, 10, hideExplanations);
    setState(prev => ({
      ...prev,
      exercises,
      currentExerciseIndex: 0,
      roundResults: null,
      answers: [],
      phase: 'exercise',
      error: null
    }));
  }, [state.selectedGroup, hideExplanations]);

  // Return from challenge/results to the selected group's intro screen
  const returnToGroupIntro = useCallback(() => {
    if (!state.selectedGroup) return;

    setState(prev => ({
      ...prev,
      phase: 'intro',
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      answers: [],
      error: null
    }));
  }, [state.selectedGroup]);

  // Continue to next group
  const continueToNext = useCallback(() => {
    if (!state.selectedGroup) return;

    // Find next group
    const currentIndex = VERB_GROUPS.findIndex(g => g.id === state.selectedGroup!.id);
    const nextGroup = VERB_GROUPS[currentIndex + 1];

    if (!nextGroup) {
      setState(prev => ({
        ...prev,
        phase: 'selection',
        selectedGroup: null,
        exercises: [],
        currentExerciseIndex: 0,
        roundResults: null,
        answers: []
      }));
      return;
    }

    selectGroup(nextGroup);
  }, [state.selectedGroup, selectGroup]);

  // Quit to selection screen
  const quitGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'selection',
      selectedGroup: null,
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      answers: [],
      error: null
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
