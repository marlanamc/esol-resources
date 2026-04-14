'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  TimelineTensesQuestion,
  TenseCategory,
  SentenceForm,
  TimelineElement,
  TimelineTimeFrame,
} from '@/types/activity';
import { fetchActivityProgress, saveActivityProgress } from '@/lib/activityProgress';
import { TIMELINE_TENSES_QUESTIONS } from '@/data/timeline-tenses-questions';
import { TIMELINE_COMPARISON_QUESTIONS } from '@/data/timeline-comparison-questions';
import { TIMELINE_TRANSFORMER_QUESTIONS } from '@/data/timeline-transformer-questions';
import { TIMELINE_CONTEXT_QUESTIONS } from '@/data/timeline-context-questions';
import { TIMELINE_ERROR_QUESTIONS } from '@/data/timeline-error-questions';
// import { TIMELINE_STORY_QUESTIONS } from '@/data/timeline-story-questions'; // Temporarily disabled — story questions need full audit before going live
import {
  CATEGORIZED_TUTORIAL_QUESTIONS,
  TUTORIAL_COMPLETED_KEY,
  CATEGORY_TUTORIAL_KEY_PREFIX,
} from '@/data/timeline-tenses-tutorial';
import {
  buildTimelineRoundQuestions,
  calculateTimelineOverallProgress,
  categoriesToProgressKey,
  DEFAULT_TIMELINE_PRACTICE_MODE,
  isChallengeMode,
  type TimelinePracticeMode,
} from '../timelineTensesUtils';

// Answer types for both question types
export interface TimelineDrawingAnswer {
  elements: TimelineElement[];
}

export interface VerbFillAnswer {
  answers: Record<string, string>; // stable blank id -> user answer
}

/** Generic answer shape for challenge mode exercises */
export interface ChallengeAnswer {
  [key: string]: unknown;
}

export type QuestionAnswer = TimelineDrawingAnswer | VerbFillAnswer | ChallengeAnswer;

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
  /** Current mastery level (1-5) */
  level: number;
  /** Number of passing rounds at the current level (used for slower level-ups) */
  passesAtCurrentLevel?: number;
  /** Question count snapshot for detecting newly added challenges later */
  questionPoolSize?: number;
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

type GamePhase =
  | 'selection'
  | 'learn-tenses'
  | 'time-signals'
  | 'tutorial-intro'
  | 'tutorial'
  | 'tutorial-complete'
  | 'exercise'
  | 'lab'
  | 'results';

interface GameState {
  phase: GamePhase;
  loading: boolean;
  error: string | null;
  questionBank: TimelineTensesQuestion[];
  roundQuestions: TimelineTensesQuestion[];
  currentQuestionIndex: number;
  roundSize: number;
  /** Empty array means "all tenses" */
  selectedCategories: TenseCategory[];
  selectedSentenceForm: SentenceForm | 'all';
  selectedTimeFrame: TimelineTimeFrame | 'all';
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
  /** When opening Tense Tools (lab / walkthrough / time signals) from an active round */
  phaseBeforeTenseTools: 'exercise' | 'selection' | null;
}

const DEFAULT_ROUND_SIZE = 10;
const CHALLENGE_ROUND_SIZE = 5;
const PASSES_REQUIRED_PER_LEVEL = 2;
const RECENT_QUESTION_MEMORY_KEY = 'timeline-recent-questions-v1';

function getRoundSizeForPracticeMode(practiceMode: TimelinePracticeMode): number {
  return isChallengeMode(practiceMode) ? CHALLENGE_ROUND_SIZE : DEFAULT_ROUND_SIZE;
}

function markTimelineTutorialCompleted(category: TenseCategory | 'all') {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TUTORIAL_COMPLETED_KEY, '1');
  window.localStorage.setItem(`${CATEGORY_TUTORIAL_KEY_PREFIX}${category}`, '1');
}

function getCategoryQuestionCount(
  questions: TimelineTensesQuestion[],
  category: TenseCategory | 'all'
): number {
  if (category === 'all') {
    return questions.length;
  }
  return questions.filter((question) => question.tenseCategory === category).length;
}

export function useTimelineTensesState(activityId: string, assignmentId?: string | null) {
  const [recentQuestionIdsByFilter, setRecentQuestionIdsByFilter] = useState<Record<string, string[]>>(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    try {
      const raw = window.localStorage.getItem(RECENT_QUESTION_MEMORY_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, string[]>;
      }
    } catch {
      // Ignore parse errors and start fresh.
    }
    return {};
  });

  const buildFilterMemoryKey = useCallback(
    (
      category: TenseCategory | 'all',
      practiceMode: TimelinePracticeMode,
      sentenceForm: SentenceForm | 'all',
      timeFrame: TimelineTimeFrame | 'all'
    ) => `${category}::${practiceMode}::${sentenceForm}::${timeFrame}`,
    []
  );

  const rememberRoundQuestions = useCallback(
    (
      category: TenseCategory | 'all',
      practiceMode: TimelinePracticeMode,
      sentenceForm: SentenceForm | 'all',
      timeFrame: TimelineTimeFrame | 'all',
      roundQuestions: TimelineTensesQuestion[]
    ) => {
      const filterKey = buildFilterMemoryKey(category, practiceMode, sentenceForm, timeFrame);
      const cap = roundQuestions.length * 4;
      const roundIds = roundQuestions.map((question) => question.id);

      setRecentQuestionIdsByFilter((prev) => {
        const previousIds = prev[filterKey] || [];
        const merged = [...roundIds, ...previousIds.filter((id) => !roundIds.includes(id))].slice(0, cap);
        const next = {
          ...prev,
          [filterKey]: merged,
        };

        // Defer localStorage write to avoid blocking the main thread
        if (typeof window !== 'undefined') {
          if ('requestIdleCallback' in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
              window.localStorage.setItem(RECENT_QUESTION_MEMORY_KEY, JSON.stringify(next));
            });
          } else {
            setTimeout(() => {
              window.localStorage.setItem(RECENT_QUESTION_MEMORY_KEY, JSON.stringify(next));
            }, 0);
          }
        }
        return next;
      });
    },
    [buildFilterMemoryKey]
  );

  const [state, setState] = useState<GameState>(() => {
    // Check localStorage for tutorial completion
    const isTutorialCompleted = (category: TenseCategory | 'all'): boolean => {
      if (typeof window === 'undefined') return false;
      const globalCompleted = window.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === '1';
      const categoryCompleted = window.localStorage.getItem(`${CATEGORY_TUTORIAL_KEY_PREFIX}${category}`) === '1';
      return globalCompleted || categoryCompleted;
    };

    return {
      phase: 'selection',
      loading: true,
      error: null,
      questionBank: [],
      roundQuestions: [],
      currentQuestionIndex: 0,
      roundSize: getRoundSizeForPracticeMode(DEFAULT_TIMELINE_PRACTICE_MODE),
      selectedCategories: [],
      selectedSentenceForm: 'all',
      selectedTimeFrame: 'all',
      selectedPracticeMode: DEFAULT_TIMELINE_PRACTICE_MODE,
      categoryProgress: {},
      showFeedback: false,
      lastAnswerCorrect: null,
      roundResults: null,
      questionResults: [],
      tutorialStep: 0,
      tutorialCompleted: isTutorialCompleted('all'),
      phaseBeforeTenseTools: null,
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
            const rawProgress = parsed || {};
            categoryProgress = Object.fromEntries(
              Object.entries(rawProgress).map(([key, value]) => {
                const progress = value as CategoryProgress;
                return [
                  key,
                  {
                    ...progress,
                    level: progress.level || 1,
                    passesAtCurrentLevel: progress.passesAtCurrentLevel || 0,
                  },
                ];
              })
            );
          } catch {
            // Ignore parse errors
          }
        }

        // Merge all question banks (core + challenge modes)
        const allQuestions = [
          ...TIMELINE_TENSES_QUESTIONS,
          ...TIMELINE_COMPARISON_QUESTIONS,
          ...TIMELINE_TRANSFORMER_QUESTIONS,
          ...TIMELINE_CONTEXT_QUESTIONS,
          ...TIMELINE_ERROR_QUESTIONS,
          // ...TIMELINE_STORY_QUESTIONS, // Temporarily disabled
        ];

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

  /**
   * Toggle a tense category in/out of the selection.
   * - Passing 'all' clears the selection (= all tenses).
   * - Passing a category adds it if not present, removes it if already present.
   * - If all 5 real categories end up selected, auto-collapse to [] (= all).
   */
  const toggleTenseCategory = useCallback((category: TenseCategory | 'all') => {
    setState((prev) => {
      if (category === 'all') {
        return { ...prev, error: null, selectedCategories: [] };
      }
      const current = prev.selectedCategories;
      const alreadySelected = current.includes(category);
      const next = alreadySelected
        ? current.filter((c) => c !== category)
        : [...current, category];
      // If all 5 real categories selected → collapse back to "all"
      const allRealCategories: TenseCategory[] = ['simple', 'continuous', 'perfect', 'perfect-continuous', 'mixed'];
      const isAll = allRealCategories.every((c) => next.includes(c));
      return { ...prev, error: null, selectedCategories: isAll ? [] : next };
    });
  }, []);

  // Select sentence form filter
  const selectSentenceForm = useCallback((form: SentenceForm | 'all') => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedSentenceForm: form,
    }));
  }, []);

  const selectTimeFrame = useCallback((timeFrame: TimelineTimeFrame | 'all') => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedTimeFrame: timeFrame,
    }));
  }, []);

  const selectPracticeMode = useCallback((practiceMode: TimelinePracticeMode) => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedPracticeMode: practiceMode,
      roundSize: getRoundSizeForPracticeMode(practiceMode),
    }));
  }, []);

  const startLab = useCallback(() => {
    setState((prev) => {
      const fromExercise = prev.phase === 'exercise';
      return {
        ...prev,
        error: null,
        phase: 'lab',
        phaseBeforeTenseTools: fromExercise ? 'exercise' : 'selection',
        ...(fromExercise
          ? {}
          : {
              currentQuestionIndex: 0,
              roundQuestions: [],
              questionResults: [],
              showFeedback: false,
              lastAnswerCorrect: null,
              roundResults: null,
            }),
      };
    });
  }, []);

  // Start a new round (or tutorial if first time in build mode)
  const startRound = useCallback(() => {
    setState((prev) => {
      if (prev.selectedPracticeMode === 'lab') {
        return {
          ...prev,
          error: null,
          phase: 'lab',
          phaseBeforeTenseTools: 'selection',
          currentQuestionIndex: 0,
          roundQuestions: [],
          questionResults: [],
          showFeedback: false,
          lastAnswerCorrect: null,
          roundResults: null,
        };
      }

      // If build-the-timeline mode and tutorial not completed for this category, show tutorial intro
      // Challenge modes skip the tutorial entirely
      const effectiveCategoryKey = categoriesToProgressKey(prev.selectedCategories);
      const isCompleted = typeof window !== 'undefined' && (
        window.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === '1' ||
        window.localStorage.getItem(`${CATEGORY_TUTORIAL_KEY_PREFIX}${effectiveCategoryKey}`) === '1'
      );

      if (
        prev.selectedPracticeMode === 'build-the-timeline' &&
        !isChallengeMode(prev.selectedPracticeMode) &&
        !isCompleted
      ) {
        return {
          ...prev,
          error: null,
          phase: 'tutorial-intro',
          tutorialCompleted: false,
        };
      }

      const roundQuestions = buildTimelineRoundQuestions(
        prev.questionBank,
        prev.selectedCategories,
        prev.selectedPracticeMode,
        prev.roundSize,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        prev.categoryProgress[effectiveCategoryKey]?.level || 1,
        recentQuestionIdsByFilter[
          buildFilterMemoryKey(
            effectiveCategoryKey,
            prev.selectedPracticeMode,
            prev.selectedSentenceForm,
            prev.selectedTimeFrame
          )
        ] || []
      );

      if (roundQuestions.length === 0) {
        return {
          ...prev,
          error: 'No questions are available for that category and practice style yet.',
        };
      }

      rememberRoundQuestions(
        effectiveCategoryKey,
        prev.selectedPracticeMode,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        roundQuestions
      );

      return {
        ...prev,
        error: null,
        phase: 'exercise',
        phaseBeforeTenseTools: null,
        currentQuestionIndex: 0,
        roundQuestions,
        questionResults: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
      };
    });
  }, [buildFilterMemoryKey, recentQuestionIdsByFilter, rememberRoundQuestions]);

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

  const startLearnTenses = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: 'learn-tenses',
      phaseBeforeTenseTools: prev.phase === 'exercise' ? 'exercise' : 'selection',
    }));
  }, []);

  const closeLearnTenses = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: prev.phaseBeforeTenseTools === 'exercise' ? 'exercise' : 'selection',
      phaseBeforeTenseTools: null,
    }));
  }, []);

  const startTimeSignals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: 'time-signals',
      phaseBeforeTenseTools: prev.phase === 'exercise' ? 'exercise' : 'selection',
    }));
  }, []);

  const closeTimeSignals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: prev.phaseBeforeTenseTools === 'exercise' ? 'exercise' : 'selection',
      phaseBeforeTenseTools: null,
    }));
  }, []);

  const exitLab = useCallback(() => {
    setState((prev) => {
      if (prev.phaseBeforeTenseTools === 'exercise') {
        return {
          ...prev,
          error: null,
          phase: 'exercise',
          phaseBeforeTenseTools: null,
        };
      }
      return {
        ...prev,
        error: null,
        phase: 'selection',
        phaseBeforeTenseTools: null,
        currentQuestionIndex: 0,
        roundQuestions: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
        questionResults: [],
      };
    });
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
      const effectiveKey = categoriesToProgressKey(prev.selectedCategories);

      const tutorialQuestions = CATEGORIZED_TUTORIAL_QUESTIONS[effectiveKey] ?? CATEGORIZED_TUTORIAL_QUESTIONS['all'];
      if (nextStep >= tutorialQuestions.length) {
        // Tutorial complete - mark in localStorage for this specific category
        markTimelineTutorialCompleted(effectiveKey);
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

  // Skip the tutorial entirely and go straight to exercising
  const skipTutorial = useCallback(() => {
    setState((prev) => {
      const effectiveKey = categoriesToProgressKey(prev.selectedCategories);
      markTimelineTutorialCompleted(effectiveKey);
      const roundQuestions = buildTimelineRoundQuestions(
        prev.questionBank,
        prev.selectedCategories,
        prev.selectedPracticeMode,
        prev.roundSize,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        prev.categoryProgress[effectiveKey]?.level || 1,
        recentQuestionIdsByFilter[
          buildFilterMemoryKey(
            effectiveKey,
            prev.selectedPracticeMode,
            prev.selectedSentenceForm,
            prev.selectedTimeFrame
          )
        ] || []
      );

      if (roundQuestions.length === 0) {
        return {
          ...prev,
          tutorialCompleted: true,
          error: 'No questions are available for that category and practice style yet.',
          phase: 'selection',
        };
      }

      rememberRoundQuestions(
        effectiveKey,
        prev.selectedPracticeMode,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        roundQuestions
      );

      return {
        ...prev,
        tutorialCompleted: true,
        error: null,
        phase: 'exercise',
        phaseBeforeTenseTools: null,
        currentQuestionIndex: 0,
        roundQuestions,
        questionResults: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
      };
    });
  }, [buildFilterMemoryKey, recentQuestionIdsByFilter, rememberRoundQuestions]);

  // Continue from tutorial complete to real practice
  const startAfterTutorial = useCallback(() => {
    setState((prev) => {
      const effectiveKey = categoriesToProgressKey(prev.selectedCategories);
      const roundQuestions = buildTimelineRoundQuestions(
        prev.questionBank,
        prev.selectedCategories,
        prev.selectedPracticeMode,
        prev.roundSize,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        prev.categoryProgress[effectiveKey]?.level || 1,
        recentQuestionIdsByFilter[
          buildFilterMemoryKey(
            effectiveKey,
            prev.selectedPracticeMode,
            prev.selectedSentenceForm,
            prev.selectedTimeFrame
          )
        ] || []
      );

      if (roundQuestions.length === 0) {
        return {
          ...prev,
          error: 'No questions are available for that category and practice style yet.',
          phase: 'selection',
        };
      }

      rememberRoundQuestions(
        effectiveKey,
        prev.selectedPracticeMode,
        prev.selectedSentenceForm,
        prev.selectedTimeFrame,
        roundQuestions
      );

      return {
        ...prev,
        error: null,
        phase: 'exercise',
        phaseBeforeTenseTools: null,
        currentQuestionIndex: 0,
        roundQuestions,
        questionResults: [],
        showFeedback: false,
        lastAnswerCorrect: null,
        roundResults: null,
      };
    });
  }, [buildFilterMemoryKey, recentQuestionIdsByFilter, rememberRoundQuestions]);

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
            category: categoriesToProgressKey(prev.selectedCategories),
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
        level: 1,
        passesAtCurrentLevel: 0,
        questionPoolSize: getCategoryQuestionCount(state.questionBank, categoryKey),
      };

      // Track recent scores (keep last 3)
      const previousScores = existingProgress.recentScores || [];
      const recentScores = [state.roundResults.accuracy, ...previousScores].slice(0, 3);

      // Use weighted average for accuracy display
      const weightedAccuracy = calculateWeightedAccuracy(recentScores);

      // Slower level-up curve: students need multiple passing rounds per level.
      let newLevel = existingProgress.level || 1;
      let passesAtCurrentLevel = existingProgress.passesAtCurrentLevel || 0;
      if (state.roundResults.accuracy >= 70 && newLevel < 5) {
        passesAtCurrentLevel += 1;
        if (passesAtCurrentLevel >= PASSES_REQUIRED_PER_LEVEL) {
          newLevel += 1;
          passesAtCurrentLevel = 0;
        }
      }

      const newProgress: CategoryProgress = {
        completed: state.roundResults.accuracy >= 70 || existingProgress.completed,
        accuracy: weightedAccuracy,
        attempts: existingProgress.attempts + 1,
        lastAttemptDate: new Date().toISOString(),
        recentScores,
        level: newLevel,
        passesAtCurrentLevel,
        questionPoolSize: getCategoryQuestionCount(state.questionBank, categoryKey),
      };

      const updatedCategoryData = {
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
  }, [activityId, assignmentId, state.roundResults, state.categoryProgress, state.questionBank]);

  // Retry the same category
  const retryRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      phase: 'selection',
      phaseBeforeTenseTools: null,
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

  // Get appropriate tutorial questions for the current category
  const tutorialQuestions = CATEGORIZED_TUTORIAL_QUESTIONS[categoriesToProgressKey(state.selectedCategories)] || CATEGORIZED_TUTORIAL_QUESTIONS['all'];

  return {
    state,
    tutorialQuestions,
    toggleTenseCategory,
    selectSentenceForm,
    selectTimeFrame,
    selectPracticeMode,
    startLab,
    startLearnTenses,
    closeLearnTenses,
    startTimeSignals,
    closeTimeSignals,
    exitLab,
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
    resetProgress: async () => {
      setRecentQuestionIdsByFilter({});
      setState(prev => ({
        ...prev,
        categoryProgress: {},
        tutorialCompleted: false,
        phaseBeforeTenseTools: null,
      }));
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
        window.localStorage.removeItem(RECENT_QUESTION_MEMORY_KEY);
      }

      await saveActivityProgress(
        activityId,
        0,
        'in_progress',
        0,
        undefined,
        assignmentId,
        undefined,
        '{}' // Clear categoryData
      );
    },
  };
}
