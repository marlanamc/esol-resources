/**
 * LocalStorage-based progress tracking for public Level 1 vocabulary
 * This is ONLY for non-logged-in users and won't affect authenticated student data
 */

const STORAGE_KEY = "public-vocab-progress-v1";

export type ActivityMode = "wordList" | "flashcards" | "matching" | "fillBlank";

export type MasteryLevel = "untouched" | "started" | "practiced" | "mastered";

export interface ActivityProgress {
  completed: boolean;
  lastPlayedAt?: string; // ISO timestamp
  studiedCards?: string[]; // For flashcards - track which cards were flipped
  attempts?: number; // For matching and fill-blank
  lastScore?: number; // For fill-blank
}

export interface ThemeProgress {
  wordList: ActivityProgress;
  flashcards: ActivityProgress;
  matching: ActivityProgress;
  fillBlank: ActivityProgress;
  masteryLevel: MasteryLevel;
  completedActivities: number; // 0-4
}

export interface UnitProgress {
  themes: {
    [themeId: string]: ThemeProgress;
  };
  overallProgress: number; // 0-100%
}

export interface VocabProgress {
  version: "1.0";
  lastUpdated: string; // ISO timestamp
  units: {
    [unitSlug: string]: UnitProgress;
  };
}

// Helper to create empty activity progress
function createEmptyActivityProgress(): ActivityProgress {
  return {
    completed: false,
  };
}

// Helper to create empty theme progress
function createEmptyThemeProgress(): ThemeProgress {
  return {
    wordList: createEmptyActivityProgress(),
    flashcards: createEmptyActivityProgress(),
    matching: createEmptyActivityProgress(),
    fillBlank: createEmptyActivityProgress(),
    masteryLevel: "untouched",
    completedActivities: 0,
  };
}

// Helper to create empty unit progress
function createEmptyUnitProgress(): UnitProgress {
  return {
    themes: {},
    overallProgress: 0,
  };
}

// Get progress from localStorage
export function getProgress(): VocabProgress {
  if (typeof window === "undefined") {
    // Server-side - return empty progress
    return {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      units: {},
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        units: {},
      };
    }
    return JSON.parse(stored) as VocabProgress;
  } catch (error) {
    console.error("Failed to parse vocab progress:", error);
    return {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      units: {},
    };
  }
}

// Save progress to localStorage
export function saveProgress(progress: VocabProgress): void {
  if (typeof window === "undefined") return;

  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save vocab progress:", error);
  }
}

// Get theme progress (creates if doesn't exist)
export function getThemeProgress(
  unitSlug: string,
  themeId: string
): ThemeProgress {
  const progress = getProgress();

  if (!progress.units[unitSlug]) {
    progress.units[unitSlug] = createEmptyUnitProgress();
  }

  if (!progress.units[unitSlug].themes[themeId]) {
    progress.units[unitSlug].themes[themeId] = createEmptyThemeProgress();
  }

  return progress.units[unitSlug].themes[themeId];
}

// Update activity progress for a specific theme
export function updateActivityProgress(
  unitSlug: string,
  themeId: string,
  mode: ActivityMode,
  update: Partial<ActivityProgress>
): void {
  const progress = getProgress();

  // Ensure unit exists
  if (!progress.units[unitSlug]) {
    progress.units[unitSlug] = createEmptyUnitProgress();
  }

  // Ensure theme exists
  if (!progress.units[unitSlug].themes[themeId]) {
    progress.units[unitSlug].themes[themeId] = createEmptyThemeProgress();
  }

  const themeProgress = progress.units[unitSlug].themes[themeId];

  // Update the specific activity
  themeProgress[mode] = {
    ...themeProgress[mode],
    ...update,
    lastPlayedAt: new Date().toISOString(),
  };

  // Recalculate mastery level and completed count
  const completedActivities = [
    themeProgress.wordList.completed,
    themeProgress.flashcards.completed,
    themeProgress.matching.completed,
    themeProgress.fillBlank.completed,
  ].filter(Boolean).length;

  themeProgress.completedActivities = completedActivities;
  themeProgress.masteryLevel = calculateMasteryLevel(completedActivities);

  // Recalculate unit progress
  const totalThemes = Object.keys(progress.units[unitSlug].themes).length;
  if (totalThemes > 0) {
    const totalActivities = totalThemes * 4; // 4 activities per theme
    const completedCount = Object.values(progress.units[unitSlug].themes).reduce(
      (sum, theme) => sum + theme.completedActivities,
      0
    );
    progress.units[unitSlug].overallProgress = Math.round(
      (completedCount / totalActivities) * 100
    );
  }

  saveProgress(progress);
}

// Calculate mastery level based on completed activities
function calculateMasteryLevel(completedActivities: number): MasteryLevel {
  if (completedActivities === 0) return "untouched";
  if (completedActivities === 1) return "started";
  if (completedActivities >= 2 && completedActivities < 4) return "practiced";
  return "mastered";
}

// Get unit progress percentage
export function getUnitProgress(unitSlug: string): number {
  const progress = getProgress();
  return progress.units[unitSlug]?.overallProgress ?? 0;
}

// Get all theme progress for a unit
export function getUnitThemesProgress(
  unitSlug: string
): Record<string, ThemeProgress> {
  const progress = getProgress();
  return progress.units[unitSlug]?.themes ?? {};
}

// Export progress as JSON file
export function exportProgress(): void {
  if (typeof window === "undefined") return;

  const progress = getProgress();
  const dataStr = JSON.stringify(progress, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `vocab-progress-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import progress from JSON file
export function importProgress(jsonData: string): boolean {
  try {
    const imported = JSON.parse(jsonData) as VocabProgress;

    // Basic validation
    if (!imported.version || !imported.units) {
      throw new Error("Invalid progress data format");
    }

    saveProgress(imported);
    return true;
  } catch (error) {
    console.error("Failed to import progress:", error);
    return false;
  }
}

// Clear all progress
export function clearProgress(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear progress:", error);
  }
}

// Get completion statistics across all units
export function getOverallStats(): {
  totalUnitsStarted: number;
  totalThemesCompleted: number;
  totalActivitiesCompleted: number;
  overallProgress: number; // 0-100%
} {
  const progress = getProgress();
  const units = Object.values(progress.units);

  let totalThemesCompleted = 0;
  let totalActivitiesCompleted = 0;
  let totalPossibleActivities = 0;

  units.forEach((unit) => {
    const themes = Object.values(unit.themes);
    themes.forEach((theme) => {
      if (theme.masteryLevel === "mastered") {
        totalThemesCompleted++;
      }
      totalActivitiesCompleted += theme.completedActivities;
      totalPossibleActivities += 4; // 4 activities per theme
    });
  });

  return {
    totalUnitsStarted: units.length,
    totalThemesCompleted,
    totalActivitiesCompleted,
    overallProgress:
      totalPossibleActivities > 0
        ? Math.round((totalActivitiesCompleted / totalPossibleActivities) * 100)
        : 0,
  };
}
