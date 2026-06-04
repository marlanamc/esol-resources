'use client';

/**
 * State machine for the Parts of Speech Pattern Discovery Game.
 * Manages group selection, exercise rounds, progress sync, and phase transitions.
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  POSGroup,
  POSExercise,
  POSRoundResults,
  POSGroupProgress,
  POSRoundMode,
  PartsOfSpeechContent,
} from '@/types/parts-of-speech';
import {
  POS_UNLOCK_THRESHOLD,
  POS_MASTERY_THRESHOLD,
  POS_ROUND_THRESHOLDS,
} from '@/types/parts-of-speech';
import {
  generatePOSExercises,
} from '@/data/parts-of-speech-exercises';
import {
  ALL_POS_GROUPS,
  getNextGroup,
} from '@/data/parts-of-speech-groups';

// ─── Phase type (extends base with no sorting step needed) ────────────────────
export type POSGamePhase = 'selection' | 'intro' | 'exercise' | 'results';

interface ExerciseOutcome {
  exercise: POSExercise;
  correct: boolean;
}

interface POSGameInternalState {
  phase: POSGamePhase;
  selectedGroup: POSGroup | null;
  selectedRoundMode: POSRoundMode;
  exercises: POSExercise[];
  currentExerciseIndex: number;
  roundResults: POSRoundResults | null;
  categoryData: Record<string, POSGroupProgress>;
  loading: boolean;
  error: string | null;
  saveError: string | null;
  lockedGroupError: string | null;
  exerciseResults: ExerciseOutcome[];
  recentlyUsedSentences: Record<string, string[]>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGroupStage(progress?: POSGroupProgress): 'not-started' | 'in-progress' | 'passed' | 'mastered' {
  if (!progress) return 'not-started';
  if (progress.stage === 'mastered') return 'mastered';
  const highest = progress.highestRoundPassed ?? 0;
  if (highest === 0) return 'not-started';
  // "passed" = completed round 1 (unlocked next group); in-progress = working through later rounds
  if (progress.completed) return highest >= 2 ? 'in-progress' : 'passed';
  return highest >= 1 ? 'in-progress' : 'not-started';
}

/** Returns the next unpassed round number (1-based), capped by group.maxRounds */
function getNextRound(group: POSGroup, progress?: POSGroupProgress): number {
  const highest = progress?.highestRoundPassed ?? 0;
  return Math.min(highest + 1, group.maxRounds);
}

function roundNumberToMode(n: number): POSRoundMode {
  const map: Record<number, POSRoundMode> = { 1: 'round1', 2: 'round2', 3: 'round3', 4: 'round4', 5: 'round5' };
  return map[n] ?? 'round1';
}

function getDefaultRoundMode(
  group: POSGroup,
  categoryData: Record<string, POSGroupProgress>,
): POSRoundMode {
  if (group.isCheckpoint) return 'round1';
  const progress = categoryData[group.id];
  const nextRound = getNextRound(group, progress);
  return roundNumberToMode(nextRound);
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

function buildMissedPatternIds(
  exercises: POSExercise[],
  results: ExerciseOutcome[],
): string[] {
  return results
    .filter(r => !r.correct)
    .map(r => r.exercise.patternId)
    .filter((id, i, arr) => arr.indexOf(id) === i);
}

function roundModeToNumber(mode: POSRoundMode): number {
  const map: Record<POSRoundMode, number> = {
    round1: 1, round2: 2, round3: 3, round4: 4, round5: 5, review: 0, final: 0,
  };
  return map[mode] ?? 0;
}

function computeRoundResults(
  group: POSGroup,
  roundMode: POSRoundMode,
  exercises: POSExercise[],
  results: ExerciseOutcome[],
  categoryData: Record<string, POSGroupProgress>,
): POSRoundResults {
  const total = results.length;
  const correct = results.filter(r => r.correct).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Use the per-round threshold (round1=70%, round2=75%, ... round5=90%)
  const roundNum = roundModeToNumber(roundMode);
  const threshold = roundNum >= 1 ? POS_ROUND_THRESHOLDS[roundNum - 1] : POS_UNLOCK_THRESHOLD;
  const passed = accuracy >= threshold;

  const isFinalRound = roundNum >= group.maxRounds;
  const mastery = isFinalRound && accuracy >= POS_MASTERY_THRESHOLD;
  const bestStreak = calculateBestStreak(results);
  const missedPatternIds = buildMissedPatternIds(exercises, results);

  const existing = categoryData[group.id] ?? { completed: false, accuracy: 0, attempts: 0 };
  const prevHighest = existing.highestRoundPassed ?? 0;
  const newHighest = (passed && roundNum > prevHighest ? roundNum : prevHighest) as 0 | 1 | 2 | 3 | 4 | 5;

  // Build per-round progress entry
  const roundKey = roundMode as 'round1' | 'round2' | 'round3' | 'round4' | 'round5';
  const prevRoundProgress = (roundNum >= 1 && roundNum <= 5) ? existing[roundKey] : undefined;
  const roundProgress = {
    attempts: (prevRoundProgress?.attempts ?? 0) + 1,
    bestAccuracy: Math.max(prevRoundProgress?.bestAccuracy ?? 0, accuracy),
    lastAccuracy: accuracy,
    lastAttemptDate: new Date().toISOString(),
    passed,
  };

  const updatedGroupProgress: POSGroupProgress = {
    ...existing,
    // Round 1 passing is what unlocks the next group
    completed: (roundNum === 1 && passed) || existing.completed,
    accuracy: Math.max(existing.accuracy ?? 0, accuracy),
    attempts: (existing.attempts ?? 0) + 1,
    lastAttemptDate: new Date().toISOString(),
    highestRoundPassed: newHighest,
    stage: mastery ? 'mastered' : newHighest >= 1 ? 'in-progress' : (existing.stage ?? 'not-started'),
    ...(roundNum >= 1 && roundNum <= 5 ? { [roundKey]: roundProgress } : {}),
  };

  // Check if next group should be unlocked (only on Round 1 pass)
  const nextGroup = getNextGroup(group.id);
  const unlocked = roundNum === 1 && passed && !!nextGroup;

  // Determine what comes next
  let nextStep: POSRoundResults['nextStep'] = 'selection';
  if (!passed) {
    // Failed — retry same round; nextStep carries the round to retry
    // round1 failure retries as 'round2' slot (ResultsScreen maps this to retry)
    // round2+ failure carries the current round mode
    const retryMode = roundNum <= 1 ? 'round2' : roundMode;
    nextStep = retryMode as typeof nextStep;
  } else if (!isFinalRound) {
    // Passed but more rounds remain — advance to next round
    const nextRoundMode = roundNumberToMode(roundNum + 1);
    nextStep = nextRoundMode as typeof nextStep;
  } else if (nextGroup) {
    nextStep = 'next-group';
  } else {
    nextStep = 'finish';
  }

  // Points: awarded on round 1 pass only (so next-group unlock feels earned immediately)
  // Bonus points for mastery
  const basePoints = passed && roundNum === 1
    ? group.difficulty === 1 ? 3 : group.difficulty === 2 ? 5 : 8
    : 0;
  const masteryBonus = mastery ? 5 : 0;
  const pointsAwarded = basePoints + masteryBonus;

  return {
    groupId: group.id,
    roundMode,
    exercisesCompleted: total,
    correctAnswers: correct,
    accuracy,
    completed: passed,
    streak: bestStreak,
    bestStreak,
    pointsAwarded,
    unlocked,
    missedPatternIds,
    nextStep,
    masteryAchieved: mastery,
    updatedCategoryData: {
      ...categoryData,
      [group.id]: updatedGroupProgress,
    },
  };
}

function calculateOverallProgress(categoryData: Record<string, POSGroupProgress>): number {
  const contentGroups = ALL_POS_GROUPS.filter(g => !g.isCheckpoint);
  if (!contentGroups.length) return 0;
  const passed = contentGroups.filter(g => categoryData[g.id]?.completed).length;
  return Math.round((passed / contentGroups.length) * 100);
}

function normalizeSentence(sentence: string): string {
  return sentence.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getExerciseSentence(exercise: POSExercise): string | null {
  if (exercise.type === 'sentence-completion' || exercise.type === 'pattern-choice') {
    return exercise.prompt;
  }

  if (exercise.type === 'error-correction' && exercise.errorCorrection?.sentence) {
    return exercise.errorCorrection.sentence;
  }

  if (exercise.type === 'contrast-pair' && exercise.contrastPair?.sentence) {
    return exercise.contrastPair.sentence;
  }

  if (exercise.type === 'function-match' && exercise.functionMatch?.sentence) {
    return exercise.functionMatch.sentence;
  }

  if (exercise.type === 'minimal-pair' && exercise.minimalPair?.sentence1) {
    return `${exercise.minimalPair.sentence1} ${exercise.minimalPair.sentence2}`;
  }

  if (exercise.type === 'mad-libs' && exercise.madLibsData?.sentenceParts) {
    return exercise.madLibsData.sentenceParts.map(part => part.text).join(' ');
  }

  if (exercise.type === 'sentence-builder' && exercise.builderSlots?.length) {
    return exercise.builderSlots.map(slot => slot.correctWord).join(' ');
  }

  if (exercise.type === 'pos-tagging' && exercise.taggingTokens?.length) {
    return exercise.taggingTokens.map(token => token.word).join(' ');
  }

  return null;
}

function filterRecentSentences(exercises: POSExercise[], recentSentences: string[]): POSExercise[] {
  const banned = new Set(recentSentences.map(sentence => normalizeSentence(sentence)));
  if (!banned.size) return exercises;

  const seen = new Set<string>();
  const filtered: POSExercise[] = [];
  for (const exercise of exercises) {
    const sentence = getExerciseSentence(exercise);
    const normalized = sentence ? normalizeSentence(sentence) : null;

    if (normalized) {
      if (banned.has(normalized) || seen.has(normalized)) continue;
      seen.add(normalized);
    }

    filtered.push(exercise);
  }

  return filtered;
}

function getRoundSentences(exercises: POSExercise[]): string[] {
  const sentences = new Set<string>();
  for (const exercise of exercises) {
    const sentence = getExerciseSentence(exercise);
    if (sentence) sentences.add(normalizeSentence(sentence));
  }
  return [...sentences];
}

function getRecentSentences(state: POSGameInternalState, groupId: string): string[] {
  return state.recentlyUsedSentences[groupId] ?? [];
}

function initializeProgressData(): Record<string, POSGroupProgress> {
  return {};
}

// ─── Main hook ────────────────────────────────────────────────────────────────

interface PartsOfSpeechGameConfig {
  gameContent?: PartsOfSpeechContent | null;
}

export function usePartsOfSpeechGameState(activityId: string, config?: PartsOfSpeechGameConfig) {
  const [state, setState] = useState<POSGameInternalState>({
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
    recentlyUsedSentences: {},
  });

  const generationConfig = {
    phaseOverrides: config?.gameContent?.roundOverrides,
    exerciseTypes: config?.gameContent?.exerciseTypes,
  };
  const presetGroupId = config?.gameContent?.courseMapPreset ? config.gameContent.groupId : undefined;
  const presetRoundMode = config?.gameContent?.roundMode;

  // Load progress on mount
  useEffect(() => {
    const init = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const res = await fetch(`/api/activity/progress?activityId=${activityId}`);
        if (!res.ok) throw new Error('Failed to load progress');
        const data = await res.json();
        const categoryData: Record<string, POSGroupProgress> = data.categoryData
          ? (typeof data.categoryData === 'string'
            ? JSON.parse(data.categoryData)
            : data.categoryData)
          : initializeProgressData();
        const presetGroup = presetGroupId
          ? ALL_POS_GROUPS.find(group => group.id === presetGroupId) ?? null
          : null;
        setState(prev => ({
          ...prev,
          categoryData,
          loading: false,
          ...(presetGroup
            ? {
              selectedGroup: presetGroup,
              selectedRoundMode: presetRoundMode ?? getDefaultRoundMode(presetGroup, categoryData),
              phase: 'intro' as const,
            }
            : {}),
        }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to initialize game';
        setState(prev => ({ ...prev, error: msg, loading: false, categoryData: initializeProgressData() }));
      }
    };
    init();
  }, [activityId, presetGroupId, presetRoundMode]);

  const selectGroup = useCallback((group: POSGroup) => {
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
    try {
      const missedIds = state.categoryData[state.selectedGroup.id]?.patternStats
        ? Object.entries(state.categoryData[state.selectedGroup.id].patternStats ?? {})
          .filter(([, s]) => s.needsReview)
          .map(([id]) => id)
        : [];
      const recentSentences = getRecentSentences(state, state.selectedGroup.id);

      const generatedExercises = generatePOSExercises(
        state.selectedGroup.id,
        state.selectedRoundMode,
        missedIds,
      generationConfig,
      );
      const filtered = filterRecentSentences(generatedExercises, recentSentences);
      const exercises = filtered.length ? filtered : generatedExercises;

      if (!exercises.length) {
        setState(prev => ({
          ...prev,
          saveError: 'This level could not start. Please try again.',
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        exercises,
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        phase: 'exercise',
        error: null,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        saveError: 'This level could not start. Please reload and try again.',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedGroup, state.selectedRoundMode, state.categoryData, state.recentlyUsedSentences]);

  const submitAnswer = useCallback((correct: boolean, exercise: POSExercise) => {
    setState(prev => {
      const newResults = [...prev.exerciseResults, { correct, exercise }];
      const newIndex = prev.currentExerciseIndex + 1;

      if (newIndex >= prev.exercises.length && prev.selectedGroup) {
        const roundResults = computeRoundResults(
          prev.selectedGroup,
          prev.selectedRoundMode,
          prev.exercises,
          newResults,
          prev.categoryData,
        );
        const updatedCategoryData = roundResults.updatedCategoryData ?? prev.categoryData;
        const usedSentences = getRoundSentences(prev.exercises);
        const updatedRecent = {
          ...prev.recentlyUsedSentences,
          [prev.selectedGroup.id]: usedSentences,
        };
        return {
          ...prev,
          currentExerciseIndex: newIndex,
          exerciseResults: newResults,
          roundResults,
          categoryData: updatedCategoryData,
          recentlyUsedSentences: updatedRecent,
          phase: 'results',
        };
      }

      return { ...prev, currentExerciseIndex: newIndex, exerciseResults: newResults };
    });
  }, []);

  const saveProgress = useCallback(async (
    results: POSRoundResults,
  ): Promise<{ pointsAwarded?: number } | null> => {
    if (!state.selectedGroup || !results.updatedCategoryData) return null;
    try {
      const updatedCategoryData = results.updatedCategoryData;
      const overallProgress = calculateOverallProgress(updatedCategoryData);
      const res = await fetch('/api/activity/progress', {
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
      const data = res.ok ? (await res.json()) as { pointsAwarded?: number } : null;
      if (!res.ok) throw new Error('Failed to save');
      setState(prev => ({ ...prev, categoryData: updatedCategoryData }));
      return data;
    } catch {
      setState(prev => ({
        ...prev,
        saveError: 'Progress could not be saved. Your work may not sync across devices.',
      }));
      return null;
    }
  }, [state.selectedGroup, activityId]);

  const retryGroup = useCallback(() => {
    if (!state.selectedGroup) return;
    const recentSentences = getRecentSentences(state, state.selectedGroup.id);
    const generatedExercises = generatePOSExercises(
      state.selectedGroup.id,
      state.selectedRoundMode,
      undefined,
      generationConfig,
    );
    const filtered = filterRecentSentences(generatedExercises, recentSentences);
    const exercises = filtered.length ? filtered : generatedExercises;
    setState(prev => ({
      ...prev,
      exercises,
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      phase: 'exercise',
      error: null,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedGroup, state.selectedRoundMode, state.recentlyUsedSentences]);

  const returnToGroupIntro = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'intro',
      exercises: [],
      currentExerciseIndex: 0,
      roundResults: null,
      exerciseResults: [],
      error: null,
    }));
  }, []);

  const continueToNext = useCallback(() => {
    if (!state.selectedGroup) return;
    const nextStep = state.roundResults?.nextStep;
    const effectiveCategoryData = state.roundResults?.updatedCategoryData ?? state.categoryData;
    const recentSentences = getRecentSentences(state, state.selectedGroup.id);

    // Advance to any next round (round2 through round5)
    const nextRoundModes: POSRoundMode[] = ['round2', 'round3', 'round4', 'round5'];
    if (nextStep && nextRoundModes.includes(nextStep as POSRoundMode)) {
      const nextRoundMode = nextStep as POSRoundMode;
      const generatedExercises = generatePOSExercises(
        state.selectedGroup.id,
        nextRoundMode,
        state.roundResults?.missedPatternIds,
        generationConfig,
      );
      const filtered = filterRecentSentences(generatedExercises, recentSentences);
      const exercises = filtered.length ? filtered : generatedExercises;
      setState(prev => ({
        ...prev,
        selectedRoundMode: nextRoundMode,
        phase: 'exercise',
        exercises,
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        error: null,
        categoryData: effectiveCategoryData,
      }));
      return;
    }

    if (nextStep === 'next-group') {
      const next = getNextGroup(state.selectedGroup.id);
      if (next) {
        const nextRoundMode = getDefaultRoundMode(next, effectiveCategoryData);
        setState(prev => ({
          ...prev,
          categoryData: effectiveCategoryData,
          selectedGroup: next,
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
    }

    // Fall back to selection
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedGroup, state.roundResults, state.categoryData, state.recentlyUsedSentences]);

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

  const resetProgress = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/activity/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          progress: 0,
          status: 'not_started',
          categoryData: {},
        }),
      });
      if (!res.ok) throw new Error('Failed to reset');
      setState(prev => ({
        ...prev,
        categoryData: {},
        recentlyUsedSentences: {},
        phase: 'selection',
        selectedGroup: null,
        exercises: [],
        currentExerciseIndex: 0,
        roundResults: null,
        exerciseResults: [],
        error: null,
      }));
      return true;
    } catch {
      setState(prev => ({
        ...prev,
        saveError: 'Could not reset progress. Please try again.',
      }));
      return false;
    }
  }, [activityId]);

  const dismissSaveError = useCallback(() => {
    setState(prev => ({ ...prev, saveError: null }));
  }, []);

  const dismissLockedGroupError = useCallback(() => {
    setState(prev => ({ ...prev, lockedGroupError: null }));
  }, []);

  // Derived helpers
  // All groups are always unlocked — students can review any POS type freely
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isGroupUnlocked = useCallback((_group: POSGroup): boolean => true, []);

  const getGroupStagePublic = useCallback((groupId: string) => {
    return getGroupStage(state.categoryData[groupId]);
  }, [state.categoryData]);

  return {
    state,
    selectGroup,
    startGroupChallenge,
    submitAnswer,
    saveProgress,
    retryGroup,
    returnToGroupIntro,
    continueToNext,
    quitGame,
    resetProgress,
    dismissSaveError,
    dismissLockedGroupError,
    isGroupUnlocked,
    getGroupStage: getGroupStagePublic,
  };
}
