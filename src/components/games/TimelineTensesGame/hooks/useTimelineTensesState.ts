'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  TimelineTensesQuestion,
  TenseCategory,
  SentenceForm,
  TimelineElement,
} from '@/types/activity';
import { fetchActivityProgress } from '@/lib/activityProgress';
import { TIMELINE_TENSES_QUESTIONS } from '@/data/timeline-tenses-questions';
import {
  TIMELINE_TUTORIAL_QUESTIONS,
  TUTORIAL_COMPLETED_KEY,
} from '@/data/timeline-tenses-tutorial';
import {
  buildTimelineRoundQuestions,
  calculateTimelineOverallProgress,
  DEFAULT_TIMELINE_PRACTICE_MODE,
  type TimelinePracticeMode,
} from '../timelineTensesUtils';

// Answer types for both question types
export interface TimelineDrawingAnswer {
  elements: TimelineElement[];
}

export interface VerbFillAnswer {
  answers: Record<string, string>; // stable blank id -> user answer
}

export type QuestionAnswer = TimelineDrawingAnswer | VerbFillAnswer;

// Round results
export interface RoundResults {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  category: TenseCategory | 'all';
  questionResults: Array<{
    questionId: string;
    correct: boolean;
    userAnswer: QuestionAnswer;
    tenseName?: string;
  }>;
}

// Category progress tracking
export interface CategoryProgress {
  completed: boolean;
  accuracy: number;
  attempts: number;
  lastAttemptDate?: string;
  /** Recent accuracy scores for weighted average (last 3 attempts) */
  recentScores?: number[];
}

/** Calculate weighted average of recent scores (most recent weighted higher) */
function calculateWeightedAccuracy(recentScores: number[]): number {
  if (recentScores.length === 0) return 0;
  if (recentScores.length === 1) return recentScores[0];

  // Weights: most recent = 3, second = 2, third = 1
  const weights = [3, 2, 1];
  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < recentScores.length && i < 3; i++) {
    weightedSum += recentScores[i] * weights[i];
    totalWeight += weights[i];
  }

  return Math.round(weightedSum / totalWeight);
}

type GamePhase = 'selection' | 'tutorial-intro' | 'tutorial' | 'tutorial-complete' | 'exercise' | 'results';

interface GameState {
  phase: GamePhase;
  loading: boolean;
  error: string | null;
  questionBank: TimelineTensesQuestion[];
  roundQuestions: TimelineTensesQuestion[];
  currentQuestionIndex: number;
  roundSize: number;
  selectedCategory: TenseCategory | 'all';
  selectedSentenceForm: SentenceForm | 'all';
  selectedPracticeMode: TimelinePracticeMode;
  categoryProgress: Record<string, CategoryProgress>;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
  roundResults: RoundResults | null;
  questionResults: Array<{
    questionId: string;
    correct: boolean;
    userAnswer: QuestionAnswer;
    tenseName?: string;
  }>;
  // Tutorial state
  tutorialStep: number;
  tutorialCompleted: boolean;
}

const DEFAULT_ROUND_SIZE = 10;

export function useTimelineTensesState(activityId: string, assignmentId?: string | null) {
  const [state, setState] = useState<GameState>(() => {
    // Check localStorage for tutorial completion (client-side only)
    const tutorialCompleted =
      typeof window !== 'undefined' &&
      window.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === '1';

    return {
      phase: 'selection',
      loading: true,
      error: null,
      questionBank: [],
      roundQuestions: [],
      currentQuestionIndex: 0,
      roundSize: DEFAULT_ROUND_SIZE,
      selectedCategory: 'all',
      selectedSentenceForm: 'all',
      selectedPracticeMode: DEFAULT_TIMELINE_PRACTICE_MODE,
      categoryProgress: {},
      showFeedback: false,
      lastAnswerCorrect: null,
      roundResults: null,
      questionResults: [],
      tutorialStep: 0,
      tutorialCompleted,
    };
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load progress data
        const progress = await fetchActivityProgress(activityId, assignmentId ?? undefined);
        let categoryProgress: Record<string, CategoryProgress> = {};

        if (progress?.categoryData) {
          try {
            const parsed = typeof progress.categoryData === 'string'
              ? JSON.parse(progress.categoryData)
              : progress.categoryData;
            categoryProgress = parsed || {};
          } catch {
            // Ignore parse errors
          }
        }

        // Get questions from data file
        const allQuestions = TIMELINE_TENSES_QUESTIONS;

        setState((prev) => ({
          ...prev,
          loading: false,
          questionBank: allQuestions,
          categoryProgress,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load activity',
        }));
      }
    };

    loadData();
  }, [activityId, assignmentId]);

  // Select tense category filter
  const selectTenseFilter = useCallback((category: TenseCategory | 'all') => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedCategory: category,
    }));
  }, []);

  // Select sentence form filter
  const selectSentenceForm = useCallback((form: SentenceForm | 'all') => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedSentenceForm: form,
    }));
  }, []);

  const selectPracticeMode = useCallback((practiceMode: TimelinePracticeMode) => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedPracticeMode: practiceMode,
    }));
  }, []);

  // Start a new round (or tutorial if first time in build mode)
  const startRound = useCallback(() => {
    setState((prev) => {
      // If build-the-timeline mode and tutorial not completed, show tutorial intro
      if (
        prev.selectedPracticeMode === 'build-the-timeline' &&
        !prev.tutorialCompleted
      ) {
        return {
          ...prev,
          error: null,
          phase: 'tutorial-intro',
        };
      }

      const roundQuestions = buildTimelineRoundQuestions(
        prev.questionBank,
        prev.selectedCategory,
        prev.selectedPracticeMode,
        prev.roundSize,
        prev.selectedSentenceForm
      );

      if (roundQuestions.length === 0) {
        return {
          ...prev,
          error: 'No questions are available for that category and practice style yet.',
        };
      }

      return {
        ...prev,
        error: null,
        phase: 'exercise',
        currentQuestionIndex: 0,
        roundQuestions,
        questionResults: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
      };
    });
  }, []);

  // Start the interactive tutorial
  const startTutorial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: 'tutorial',
      tutorialStep: 0,
      showFeedback: false,
      lastAnswerCorrect: null,
    }));
  }, []);

  // Submit answer for current tutorial question
  const submitTutorialAnswer = useCallback(
    (answer: QuestionAnswer, isCorrect: boolean) => {
      setState((prev) => ({
        ...prev,
        showFeedback: true,
        lastAnswerCorrect: isCorrect,
      }));
    },
    []
  );

  // Move to next tutorial step or completion
  const nextTutorialStep = useCallback(() => {
    setState((prev) => {
      const nextStep = prev.tutorialStep + 1;

      if (nextStep >= TIMELINE_TUTORIAL_QUESTIONS.length) {
        // Tutorial complete - mark in localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(TUTORIAL_COMPLETED_KEY, '1');
        }
        return {
          ...prev,
          phase: 'tutorial-complete',
          tutorialCompleted: true,
          showFeedback: false,
          lastAnswerCorrect: null,
        };
      }

      return {
        ...prev,
        tutorialStep: nextStep,
        showFeedback: false,
        lastAnswerCorrect: null,
      };
    });
  }, []);

  // Skip the tutorial entirely
  const skipTutorial = useCallback(() => {
    // Mark as completed so it doesn't show again
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TUTORIAL_COMPLETED_KEY, '1');
    }
    setState((prev) => ({
      ...prev,
      tutorialCompleted: true,
      phase: 'selection',
    }));
  }, []);

  // Continue from tutorial complete to real practice
  const startAfterTutorial = useCallback(() => {
    setState((prev) => {
      const roundQuestions = buildTimelineRoundQuestions(
        prev.questionBank,
        prev.selectedCategory,
        prev.selectedPracticeMode,
        prev.roundSize,
        prev.selectedSentenceForm
      );

      if (roundQuestions.length === 0) {
        return {
          ...prev,
          error: 'No questions are available for that category and practice style yet.',
          phase: 'selection',
        };
      }

      return {
        ...prev,
        error: null,
        phase: 'exercise',
        currentQuestionIndex: 0,
        roundQuestions,
        questionResults: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
      };
    });
  }, []);

  // Submit answer for current question
  const submitAnswer = useCallback((answer: QuestionAnswer, isCorrect: boolean, tenseName?: string) => {
    setState((prev) => {
      const currentQuestion = prev.roundQuestions[prev.currentQuestionIndex];

      return {
        ...prev,
        showFeedback: true,
        lastAnswerCorrect: isCorrect,
        questionResults: [
          ...prev.questionResults,
          {
            questionId: currentQuestion.id,
            correct: isCorrect,
            userAnswer: answer,
            tenseName,
          },
        ],
      };
    });
  }, []);

  // Move to next question or results
  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const totalRoundQuestions = prev.roundQuestions.length;

      if (nextIndex >= totalRoundQuestions) {
        // Round complete - calculate results
        const correctCount = prev.questionResults.filter((r) => r.correct).length;
        const accuracy = prev.questionResults.length
          ? Math.round((correctCount / prev.questionResults.length) * 100)
          : 0;

        return {
          ...prev,
          phase: 'results',
          showFeedback: false,
          roundResults: {
            totalQuestions: prev.questionResults.length,
            correctAnswers: correctCount,
            accuracy,
            category: prev.selectedCategory,
            questionResults: prev.questionResults,
          },
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        showFeedback: false,
        lastAnswerCorrect: null,
      };
    });
  }, []);

  // Save progress to server
  const saveProgress = useCallback(async () => {
    if (!state.roundResults) return null;

    const controller = new AbortController();

    try {
      const categoryKey = state.roundResults.category;
      const existingProgress = state.categoryProgress[categoryKey] || {
        completed: false,
        accuracy: 0,
        attempts: 0,
        recentScores: [],
      };

      // Track recent scores (keep last 3)
      const previousScores = existingProgress.recentScores || [];
      const recentScores = [state.roundResults.accuracy, ...previousScores].slice(0, 3);

      // Use weighted average for accuracy display
      const weightedAccuracy = calculateWeightedAccuracy(recentScores);

      const newProgress: CategoryProgress = {
        completed: state.roundResults.accuracy >= 70 || existingProgress.completed,
        accuracy: weightedAccuracy,
        attempts: existingProgress.attempts + 1,
        lastAttemptDate: new Date().toISOString(),
        recentScores,
      };

      const updatedCategoryData = categoryKey === 'all'
        ? state.categoryProgress
        : {
            ...state.categoryProgress,
            [categoryKey]: newProgress,
          };

      // Calculate overall progress
      const overallProgress = calculateTimelineOverallProgress(updatedCategoryData);

      // Direct API call to save progress with categoryData
      const response = await fetch('/api/activity/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          progress: overallProgress,
          status: overallProgress === 100 ? 'completed' : 'in_progress',
          accuracy: state.roundResults.accuracy,
          category: categoryKey,
          assignmentId: assignmentId ?? undefined,
          categoryData: JSON.stringify(updatedCategoryData),
        }),
        signal: controller.signal,
      });

      const result = response.ok ? await response.json() : null;

      setState((prev) => ({
        ...prev,
        categoryProgress: updatedCategoryData,
      }));

      return result;
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to save progress',
      }));
      return null;
    }
  }, [activityId, assignmentId, state.roundResults, state.categoryProgress]);

  // Retry the same category
  const retryRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: 'selection',
      currentQuestionIndex: 0,
      roundQuestions: [],
      showFeedback: false,
      lastAnswerCorrect: null,
      roundResults: null,
      questionResults: [],
    }));
  }, []);

  // Dismiss error
  const dismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    selectTenseFilter,
    selectSentenceForm,
    selectPracticeMode,
    startRound,
    startTutorial,
    submitTutorialAnswer,
    nextTutorialStep,
    skipTutorial,
    startAfterTutorial,
    submitAnswer,
    nextQuestion,
    saveProgress,
    retryRound,
    dismissError,
  };
}
