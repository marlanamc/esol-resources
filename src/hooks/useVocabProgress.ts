"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProgress,
  getThemeProgress,
  updateActivityProgress,
  getUnitProgress,
  getUnitThemesProgress,
  getOverallStats,
  type ActivityMode,
  type ThemeProgress,
  type ActivityProgress,
} from "@/lib/vocab-progress";

/**
 * React hook for managing public vocabulary progress
 * Uses localStorage to track progress for non-logged-in users
 */
export function useVocabProgress(unitSlug?: string, themeId?: string) {
  const [themeProgress, setThemeProgress] = useState<ThemeProgress | null>(null);
  const [unitProgress, setUnitProgress] = useState<number>(0);
  const [unitThemesProgress, setUnitThemesProgress] = useState<
    Record<string, ThemeProgress>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial progress
  useEffect(() => {
    setIsLoading(true);

    if (unitSlug && themeId) {
      const progress = getThemeProgress(unitSlug, themeId);
      setThemeProgress(progress);
    }

    if (unitSlug) {
      const progress = getUnitProgress(unitSlug);
      setUnitProgress(progress);

      const themesProgress = getUnitThemesProgress(unitSlug);
      setUnitThemesProgress(themesProgress);
    }

    setIsLoading(false);
  }, [unitSlug, themeId]);

  // Update activity progress
  const updateActivity = useCallback(
    (mode: ActivityMode, update: Partial<ActivityProgress>) => {
      if (!unitSlug || !themeId) {
        console.warn("Cannot update activity: missing unitSlug or themeId");
        return;
      }

      updateActivityProgress(unitSlug, themeId, mode, update);

      // Refresh local state
      const updatedThemeProgress = getThemeProgress(unitSlug, themeId);
      setThemeProgress(updatedThemeProgress);

      const updatedUnitProgress = getUnitProgress(unitSlug);
      setUnitProgress(updatedUnitProgress);

      const updatedThemesProgress = getUnitThemesProgress(unitSlug);
      setUnitThemesProgress(updatedThemesProgress);
    },
    [unitSlug, themeId]
  );

  // Mark activity as completed
  const completeActivity = useCallback(
    (mode: ActivityMode, additionalData?: Partial<ActivityProgress>) => {
      updateActivity(mode, {
        completed: true,
        ...additionalData,
      });
    },
    [updateActivity]
  );

  // Track flashcard study
  const studyFlashcard = useCallback(
    (cardTerm: string, totalCards: number) => {
      if (!themeProgress) return;

      const studiedCards = new Set(themeProgress.flashcards.studiedCards || []);
      studiedCards.add(cardTerm);

      const completed = studiedCards.size >= totalCards;

      updateActivity("flashcards", {
        studiedCards: Array.from(studiedCards),
        completed,
      });
    },
    [themeProgress, updateActivity]
  );

  // Track matching game attempt
  const completeMatching = useCallback(() => {
    if (!themeProgress) return;

    const attempts = (themeProgress.matching.attempts || 0) + 1;

    updateActivity("matching", {
      completed: true,
      attempts,
    });
  }, [themeProgress, updateActivity]);

  // Track fill-in-blank completion
  const completeFillBlank = useCallback(
    (score: number) => {
      if (!themeProgress) return;

      const attempts = (themeProgress.fillBlank.attempts || 0) + 1;

      updateActivity("fillBlank", {
        completed: true,
        attempts,
        lastScore: score,
      });
    },
    [themeProgress, updateActivity]
  );

  // Track word list view
  const viewWordList = useCallback(() => {
    updateActivity("wordList", {
      completed: true,
    });
  }, [updateActivity]);

  return {
    // State
    themeProgress,
    unitProgress,
    unitThemesProgress,
    isLoading,

    // Actions
    completeActivity,
    studyFlashcard,
    completeMatching,
    completeFillBlank,
    viewWordList,
    updateActivity,
  };
}

/**
 * Hook for overall progress statistics
 */
export function useOverallProgress() {
  const [stats, setStats] = useState({
    totalUnitsStarted: 0,
    totalThemesCompleted: 0,
    totalActivitiesCompleted: 0,
    overallProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const overallStats = getOverallStats();
    setStats(overallStats);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    const overallStats = getOverallStats();
    setStats(overallStats);
  }, []);

  return {
    stats,
    isLoading,
    refresh,
  };
}

/**
 * Hook for managing progress across all units
 */
export function useAllUnitsProgress() {
  const [unitsProgress, setUnitsProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const progress = getProgress();
    const unitProgressMap: Record<string, number> = {};

    Object.keys(progress.units).forEach((unitSlug) => {
      unitProgressMap[unitSlug] = getUnitProgress(unitSlug);
    });

    setUnitsProgress(unitProgressMap);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    const progress = getProgress();
    const unitProgressMap: Record<string, number> = {};

    Object.keys(progress.units).forEach((unitSlug) => {
      unitProgressMap[unitSlug] = getUnitProgress(unitSlug);
    });

    setUnitsProgress(unitProgressMap);
  }, []);

  return {
    unitsProgress,
    isLoading,
    refresh,
  };
}
