import { parseActivityContent } from "@/types/activity";

export type LearnerVisibleActivityInput = {
    deletedAt?: Date | null;
    type?: string | null;
    category?: string | null;
    isReleased?: boolean | null;
    content?: string | null;
    isReleasedInContent?: boolean | null;
    createdBy?: string | null;
};

export type LearnerContentMetadata = {
    type: string | null;
    releasedInContent: boolean;
};

export type LearnerContentMetadataCache = Map<string, LearnerContentMetadata>;

export function createLearnerContentMetadataCache(): LearnerContentMetadataCache {
    return new Map();
}

export function getLearnerContentMetadata(
    content: string | Record<string, unknown> | null | undefined,
    cache?: LearnerContentMetadataCache
): LearnerContentMetadata {
    const deriveReleasedInContent = (parsed: Record<string, unknown>): boolean => {
        if (Object.prototype.hasOwnProperty.call(parsed, "released")) {
            return parsed.released === true;
        }

        // Legacy activities may not have explicit release metadata in content yet.
        // In that case, keep them visible by default for backward compatibility.
        return true;
    };

    if (!content) {
        return { type: null, releasedInContent: false };
    }

    if (typeof content === "string") {
        if (cache && cache.has(content)) {
            return cache.get(content) as LearnerContentMetadata;
        }

        const parsed = parseActivityContent(content);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            const metadata = { type: null, releasedInContent: false };
            if (cache) cache.set(content, metadata);
            return metadata;
        }

        const parsedMetadata = parsed as Record<string, unknown>;
        const activityType = typeof parsedMetadata.type === "string" ? parsedMetadata.type : null;
        const releasedInContent = deriveReleasedInContent(parsedMetadata);
        const metadata = { type: activityType, releasedInContent };
        if (cache) cache.set(content, metadata);
        return metadata;
    }

    if (typeof content !== "object" || Array.isArray(content)) {
        const metadata = { type: null, releasedInContent: false };
        return metadata;
    }

    const contentMetadata = content as Record<string, unknown>;
    const activityType = typeof contentMetadata.type === "string" ? contentMetadata.type : null;
    const releasedInContent = deriveReleasedInContent(contentMetadata);
    const metadata = { type: activityType, releasedInContent };
    return metadata;
}

export function isLearnerVisibleActivity(
    activity: LearnerVisibleActivityInput,
    cache?: LearnerContentMetadataCache
): boolean {
    if (activity.deletedAt) {
        return false;
    }

    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();

    if (type === "guide" && category === "grammar") {
        return activity.isReleased === true;
    }

    if (type === "speaking" || type === "quiz" || category === "quizzes") {
        const contentMetadata = getLearnerContentMetadata(activity.content, cache);
        if (typeof activity.isReleasedInContent === "boolean") {
            return activity.isReleasedInContent;
        }
        return contentMetadata.releasedInContent;
    }

    return true;
}

export function filterLearnerVisibleActivities<T extends LearnerVisibleActivityInput>(activities: T[], cache?: LearnerContentMetadataCache): T[] {
    return activities.filter((activity) => isLearnerVisibleActivity(activity, cache));
}

export function assertLearnerCanAccessActivity(
    activity: LearnerVisibleActivityInput,
    userRole: string | null | undefined,
    cache?: LearnerContentMetadataCache
): boolean {
    if (userRole !== "student") {
        return true;
    }

    return isLearnerVisibleActivity(activity, cache);
}
