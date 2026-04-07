/**
 * Independent Learner Progress Tracking
 *
 * Functions for calculating progress stats, analyzing weak areas,
 * and managing weekly goals for independent learners.
 */

import {
    INDEPENDENT_RECOMMENDATION_SEQUENCE,
} from "@/lib/independent-learning";

// ============================================================================
// Types
// ============================================================================

export type SkillCategory =
    | "grammar"
    | "vocabulary"
    | "listening"
    | "speaking"
    | "reading"
    | "pronunciation";

export interface StageProgress {
    stage: number;
    label: string;
    completed: number;
    total: number;
    isCurrentStage: boolean;
    activities: Array<{
        id: string;
        title: string;
        completed: boolean;
    }>;
}

export interface IndependentProgressStats {
    totalActivities: number;
    completedActivities: number;
    currentStage: number;
    stageProgress: StageProgress[];
    percentComplete: number;
}

export interface WeeklyGoalProgress {
    completed: number;
    goal: number;
    percentComplete: number;
    isGoalMet: boolean;
    daysRemaining: number;
    weekStart: Date;
    weekEnd: Date;
}

export interface WeakAreaRecommendation {
    activityId: string;
    activityTitle: string;
    category: string | null;
    score: number;
    reason: string;
}

export interface InProgressActivity {
    activityId: string;
    activityTitle: string;
    progress: number;
    updatedAt: Date;
}

export interface SkillCategoryStats {
    skill: SkillCategory;
    completed: number;
    total: number;
    avgScore: number | null;
}

// Input types for functions
interface ActivityInput {
    id: string;
    title: string;
    type: string;
    category: string | null;
}

interface ProgressInput {
    activityId: string;
    progress: number;
    status: string;
    updatedAt: Date;
}

interface SubmissionInput {
    activityId: string;
    score: number | null;
    completedAt: Date | null;
}

// ============================================================================
// Stage Labels
// ============================================================================

const STAGE_LABELS: Record<number, string> = {
    1: "Foundations",
    2: "Building Skills",
    3: "Advanced Practice",
};

// ============================================================================
// Skill Categorization
// ============================================================================

/**
 * Map an activity to a skill category based on type and category fields
 */
export function categorizeActivity(activity: Pick<ActivityInput, "type" | "category">): SkillCategory {
    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();

    // Grammar guides and quizzes
    if (category === "grammar" || type === "guide") {
        return "grammar";
    }

    // Vocabulary activities
    if (
        category === "vocabulary" ||
        type === "flashcards" ||
        type === "matching" ||
        type === "vocab-review"
    ) {
        return "vocabulary";
    }

    // Listening activities
    if (category === "listening" || type === "listening" || type === "minimal-pairs") {
        return "listening";
    }

    // Speaking activities
    if (category === "speaking" || type === "speaking") {
        return "speaking";
    }

    // Pronunciation
    if (category === "pronunciation" || type === "pronunciation-listening") {
        return "pronunciation";
    }

    // Reading
    if (category === "reading" || type === "reading") {
        return "reading";
    }

    // Default to grammar for unknown types
    return "grammar";
}

/**
 * Get a human-readable label for a skill category
 */
export function getSkillCategoryLabel(skill: SkillCategory): string {
    const labels: Record<SkillCategory, string> = {
        grammar: "Grammar",
        vocabulary: "Vocabulary",
        listening: "Listening",
        speaking: "Speaking",
        reading: "Reading",
        pronunciation: "Pronunciation",
    };
    return labels[skill];
}

// ============================================================================
// Progress Calculation
// ============================================================================

/**
 * Check if an activity is completed based on progress and submissions
 */
function isActivityCompleted(params: {
    activity: Pick<ActivityInput, "type" | "category">;
    progress?: Pick<ProgressInput, "status">;
    submissions?: Array<Pick<SubmissionInput, "score" | "completedAt">>;
}): boolean {
    const { activity, progress, submissions = [] } = params;

    const isGrammarGuide =
        (activity.type || "").toLowerCase() === "guide" &&
        (activity.category || "").toLowerCase() === "grammar";

    // Grammar guides require score > 70 on mini-quiz
    if (isGrammarGuide) {
        return submissions.some(
            (s) => s.completedAt && typeof s.score === "number" && s.score > 70
        );
    }

    if (progress?.status === "completed") {
        return true;
    }

    return submissions.some((s) => s.completedAt);
}

/**
 * Calculate comprehensive progress stats for independent learner
 */
export function getIndependentProgressStats(params: {
    activities: ActivityInput[];
    progressRows: ProgressInput[];
    submissions: SubmissionInput[];
}): IndependentProgressStats {
    const { activities, progressRows, submissions } = params;

    const progressMap = new Map(progressRows.map((row) => [row.activityId, row]));
    const submissionMap = submissions.reduce<Map<string, SubmissionInput[]>>((map, sub) => {
        const rows = map.get(sub.activityId) || [];
        rows.push(sub);
        map.set(sub.activityId, rows);
        return map;
    }, new Map());

    // Build activity lookup
    const activityMap = new Map(activities.map((a) => [a.id, a]));

    // Group activities by stage
    const stageActivities = new Map<number, Array<{ id: string; title: string; completed: boolean }>>();

    for (const config of INDEPENDENT_RECOMMENDATION_SEQUENCE) {
        // Handle both activityId and activityTitle variants
        const activityId = "activityId" in config ? config.activityId : undefined;
        if (!activityId) continue;

        const activity = activityMap.get(activityId);
        if (!activity) continue;

        const progress = progressMap.get(activityId);
        const subs = submissionMap.get(activityId) || [];
        const completed = isActivityCompleted({ activity, progress, submissions: subs });

        const stage = config.stage;
        const stageList = stageActivities.get(stage) || [];
        stageList.push({ id: activityId, title: activity.title, completed });
        stageActivities.set(stage, stageList);
    }

    // Calculate per-stage progress
    let firstIncompleteStage: number | null = null;
    let totalCompleted = 0;
    let totalActivities = 0;

    const stageProgress: StageProgress[] = [];

    for (const stage of [1, 2, 3]) {
        const activities = stageActivities.get(stage) || [];
        const completed = activities.filter((a) => a.completed).length;
        totalCompleted += completed;
        totalActivities += activities.length;

        const allCompleted = activities.length > 0 && completed === activities.length;
        if (!allCompleted && firstIncompleteStage === null) {
            firstIncompleteStage = stage;
        }

        stageProgress.push({
            stage,
            label: STAGE_LABELS[stage] || `Stage ${stage}`,
            completed,
            total: activities.length,
            isCurrentStage: false, // Set below
            activities,
        });
    }

    // Mark current stage
    const currentStage = firstIncompleteStage ?? 3;
    const currentStageEntry = stageProgress.find((s) => s.stage === currentStage);
    if (currentStageEntry) {
        currentStageEntry.isCurrentStage = true;
    }

    return {
        totalActivities,
        completedActivities: totalCompleted,
        currentStage,
        stageProgress,
        percentComplete: totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0,
    };
}

// ============================================================================
// Weekly Goal Tracking
// ============================================================================

/**
 * Get the start of the current week based on start day preference
 */
function getWeekStart(startDay: number, now: Date = new Date()): Date {
    const currentDay = now.getDay();
    const daysToSubtract = (currentDay - startDay + 7) % 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

/**
 * Get the end of the current week
 */
function getWeekEnd(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
}

/**
 * Calculate weekly goal progress
 */
export function getWeeklyGoalProgress(params: {
    weeklyGoal: number;
    startDay: number; // 0=Sunday, 1=Monday, etc.
    submissions: Array<Pick<SubmissionInput, "completedAt">>;
    progressRows: Array<Pick<ProgressInput, "status" | "updatedAt">>;
    now?: Date;
}): WeeklyGoalProgress {
    const { weeklyGoal, startDay, submissions, progressRows, now = new Date() } = params;

    const weekStart = getWeekStart(startDay, now);
    const weekEnd = getWeekEnd(weekStart);

    // Count unique completed activities this week
    const completedThisWeek = new Set<string>();

    // Count submissions completed this week
    for (const sub of submissions) {
        if (sub.completedAt && sub.completedAt >= weekStart && sub.completedAt <= weekEnd) {
            completedThisWeek.add("submission"); // Simple counter approach
        }
    }

    // Count progress marked complete this week
    for (const prog of progressRows) {
        if (
            prog.status === "completed" &&
            prog.updatedAt >= weekStart &&
            prog.updatedAt <= weekEnd
        ) {
            completedThisWeek.add("progress");
        }
    }

    // For simplicity, count total completed activities from submissions
    const completedCount = submissions.filter(
        (s) => s.completedAt && s.completedAt >= weekStart && s.completedAt <= weekEnd
    ).length;

    const daysRemaining = Math.ceil((weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
        completed: completedCount,
        goal: weeklyGoal,
        percentComplete: Math.min(100, Math.round((completedCount / weeklyGoal) * 100)),
        isGoalMet: completedCount >= weeklyGoal,
        daysRemaining: Math.max(0, daysRemaining),
        weekStart,
        weekEnd,
    };
}

// ============================================================================
// Weak Area Analysis
// ============================================================================

const LOW_SCORE_THRESHOLD = 70;

/**
 * Analyze submissions to find activities needing review
 */
export function analyzeWeakAreas(params: {
    activities: ActivityInput[];
    submissions: Array<SubmissionInput & { activityId: string }>;
    limit?: number;
}): WeakAreaRecommendation[] {
    const { activities, submissions, limit = 3 } = params;

    const activityMap = new Map(activities.map((a) => [a.id, a]));

    // Find activities with low scores
    const weakAreas: WeakAreaRecommendation[] = [];

    for (const submission of submissions) {
        if (submission.score !== null && submission.score < LOW_SCORE_THRESHOLD) {
            const activity = activityMap.get(submission.activityId);
            if (!activity) continue;

            // Avoid duplicates
            if (weakAreas.some((w) => w.activityId === submission.activityId)) continue;

            weakAreas.push({
                activityId: submission.activityId,
                activityTitle: activity.title,
                category: activity.category,
                score: submission.score,
                reason: `You scored ${submission.score}% - try again to improve!`,
            });
        }
    }

    // Sort by lowest score first
    weakAreas.sort((a, b) => a.score - b.score);

    return weakAreas.slice(0, limit);
}

// ============================================================================
// In-Progress Activity Detection
// ============================================================================

/**
 * Find the most recent in-progress activity to show "continue" card
 */
export function getInProgressActivity(params: {
    activities: ActivityInput[];
    progressRows: ProgressInput[];
}): InProgressActivity | null {
    const { activities, progressRows } = params;

    const activityMap = new Map(activities.map((a) => [a.id, a]));

    // Filter to in-progress activities with meaningful progress
    const inProgress = progressRows
        .filter((p) => p.status === "in_progress" && p.progress > 0 && p.progress < 100)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    if (inProgress.length === 0) {
        return null;
    }

    const mostRecent = inProgress[0];
    const activity = activityMap.get(mostRecent.activityId);

    if (!activity) {
        return null;
    }

    return {
        activityId: mostRecent.activityId,
        activityTitle: activity.title,
        progress: mostRecent.progress,
        updatedAt: mostRecent.updatedAt,
    };
}

// ============================================================================
// Skill Category Stats
// ============================================================================

/**
 * Calculate per-skill completion stats
 */
export function getSkillCategoryStats(params: {
    activities: ActivityInput[];
    submissions: SubmissionInput[];
    progressRows: ProgressInput[];
}): Map<SkillCategory, SkillCategoryStats> {
    const { activities, submissions, progressRows } = params;

    const progressMap = new Map(progressRows.map((row) => [row.activityId, row]));
    const submissionMap = submissions.reduce<Map<string, SubmissionInput[]>>((map, sub) => {
        const rows = map.get(sub.activityId) || [];
        rows.push(sub);
        map.set(sub.activityId, rows);
        return map;
    }, new Map());

    // Initialize stats for each skill
    const stats = new Map<SkillCategory, { completed: number; total: number; scores: number[] }>();
    const skills: SkillCategory[] = ["grammar", "vocabulary", "listening", "speaking", "reading", "pronunciation"];
    for (const skill of skills) {
        stats.set(skill, { completed: 0, total: 0, scores: [] });
    }

    // Process each activity
    for (const activity of activities) {
        const skill = categorizeActivity(activity);
        const skillStats = stats.get(skill);
        if (!skillStats) continue;

        skillStats.total++;

        const progress = progressMap.get(activity.id);
        const subs = submissionMap.get(activity.id) || [];
        const completed = isActivityCompleted({ activity, progress, submissions: subs });

        if (completed) {
            skillStats.completed++;
        }

        // Collect scores
        for (const sub of subs) {
            if (sub.score !== null) {
                skillStats.scores.push(sub.score);
            }
        }
    }

    // Convert to final format
    const result = new Map<SkillCategory, SkillCategoryStats>();
    for (const skill of skills) {
        const data = stats.get(skill)!;
        const avgScore =
            data.scores.length > 0
                ? Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length)
                : null;

        result.set(skill, {
            skill,
            completed: data.completed,
            total: data.total,
            avgScore,
        });
    }

    return result;
}

/**
 * Filter activities by skill category
 */
export function filterActivitiesBySkill<T extends ActivityInput>(
    activities: T[],
    skill: SkillCategory | "all"
): T[] {
    if (skill === "all") {
        return activities;
    }
    return activities.filter((activity) => categorizeActivity(activity) === skill);
}
