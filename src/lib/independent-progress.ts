/**
 * Independent Learner Progress Tracking
 *
 * Weekly goal calculation for independent learners.
 */

export interface WeeklyGoalProgress {
    completed: number;
    goal: number;
    percentComplete: number;
    isGoalMet: boolean;
    daysRemaining: number;
    weekStart: Date;
    weekEnd: Date;
}

interface ProgressInput {
    activityId: string;
    status: string;
    updatedAt: Date;
}

interface SubmissionInput {
    activityId: string;
    completedAt: Date | null;
}

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
    submissions: SubmissionInput[];
    progressRows: ProgressInput[];
    now?: Date;
}): WeeklyGoalProgress {
    const { weeklyGoal, startDay, submissions, progressRows, now = new Date() } = params;

    const weekStart = getWeekStart(startDay, now);
    const weekEnd = getWeekEnd(weekStart);

    // Dedupe by activityId so a submission + progress row for the same activity counts once
    const completedActivityIds = new Set<string>();

    for (const sub of submissions) {
        if (sub.completedAt && sub.completedAt >= weekStart && sub.completedAt <= weekEnd) {
            completedActivityIds.add(sub.activityId);
        }
    }

    for (const prog of progressRows) {
        if (
            prog.status === "completed" &&
            prog.updatedAt >= weekStart &&
            prog.updatedAt <= weekEnd
        ) {
            completedActivityIds.add(prog.activityId);
        }
    }

    const completedCount = completedActivityIds.size;
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
