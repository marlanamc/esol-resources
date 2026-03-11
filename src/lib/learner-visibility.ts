import { parseActivityContent } from "@/types/activity";

export type LearnerVisibleActivityInput = {
    deletedAt?: Date | null;
    type?: string | null;
    category?: string | null;
    isReleased?: boolean | null;
    content?: string | null;
    createdBy?: string | null;
};

function hasReleasedContentFlag(content: string | null | undefined): boolean {
    if (!content) {
        return false;
    }

    const parsed = parseActivityContent(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return false;
    }

    return (parsed as { released?: unknown }).released === true;
}

export function isLearnerVisibleActivity(activity: LearnerVisibleActivityInput): boolean {
    if (activity.deletedAt) {
        return false;
    }

    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();

    if (type === "guide" && category === "grammar") {
        return activity.isReleased === true;
    }

    if (type === "speaking" || type === "quiz" || category === "quizzes") {
        return hasReleasedContentFlag(activity.content);
    }

    return true;
}

export function filterLearnerVisibleActivities<T extends LearnerVisibleActivityInput>(activities: T[]): T[] {
    return activities.filter((activity) => isLearnerVisibleActivity(activity));
}

export function assertLearnerCanAccessActivity(activity: LearnerVisibleActivityInput, userRole: string | null | undefined): boolean {
    if (userRole !== "student") {
        return true;
    }

    return isLearnerVisibleActivity(activity);
}
