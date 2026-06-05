export type LearnerVisibleActivityInput = {
    deletedAt?: Date | null;
    type?: string | null;
    category?: string | null;
    isReleased?: boolean | null;
    content?: string | null;
    createdBy?: string | null;
};

export function isLearnerVisibleActivity(activity: LearnerVisibleActivityInput): boolean {
    if (activity.deletedAt) {
        return false;
    }

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
    return activities.filter((activity) => isLearnerVisibleActivity(activity));
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
