import { readWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";

export type LearnerVisibleActivityInput = {
    deletedAt?: Date | null;
    type?: string | null;
    category?: string | null;
    isReleased?: boolean | null;
    content?: string | null;
    createdBy?: string | null;
};

export function isLearnerVisibleActivity(activity: LearnerVisibleActivityInput, now: Date = new Date()): boolean {
    if (activity.deletedAt) {
        return false;
    }

    const quizSchedule = readWeeklyQuizSchedule(activity.content);
    // Scheduled quizzes stay available indefinitely after opening, regardless of
    // the legacy manual release flag. Due is a target, never an access cutoff.
    if (quizSchedule) return now >= quizSchedule.opensAt;

    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();

    if (
        type === "speaking" ||
        category === "speaking" ||
        category === "writing" ||
        category === "writing-reading"
    ) {
        return false;
    }

    if (
        (type === "guide" && category === "grammar") ||
        type === "quiz" ||
        category === "quizzes"
    ) {
        return activity.isReleased === true;
    }

    return true;
}

export function filterLearnerVisibleActivities<T extends LearnerVisibleActivityInput>(activities: T[]): T[] {
    return activities
        .filter((activity) => isLearnerVisibleActivity(activity))
        .map((activity) => readWeeklyQuizSchedule(activity.content)
            ? { ...activity, isReleased: true }
            : activity);
}

export function assertLearnerCanAccessActivity(
    activity: LearnerVisibleActivityInput,
    userRole: string | null | undefined,
): boolean {
    if (userRole !== "student") {
        return true;
    }

    return isLearnerVisibleActivity(activity);
}
