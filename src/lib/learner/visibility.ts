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
    hasExplicitReleasedField?: boolean;
};

export type LearnerContentMetadataCache = Map<string, LearnerContentMetadata>;

export function createLearnerContentMetadataCache(): LearnerContentMetadataCache {
    return new Map();
}

export function getLearnerContentMetadata(
    content: string | Record<string, unknown> | null | undefined,
    cache?: LearnerContentMetadataCache
): LearnerContentMetadata {
    const readParsedMetadata = (parsed: Record<string, unknown>): LearnerContentMetadata => {
        const hasExplicitReleasedField = Object.prototype.hasOwnProperty.call(parsed, "released");
        const activityType = typeof parsed.type === "string" ? parsed.type : null;
        const releasedInContent = hasExplicitReleasedField ? parsed.released === true : true;

        return {
            type: activityType,
            releasedInContent,
            hasExplicitReleasedField,
        };
    };

    if (!content) {
        return { type: null, releasedInContent: false, hasExplicitReleasedField: false };
    }

    if (typeof content === "string") {
        if (cache && cache.has(content)) {
            const cached = cache.get(content);
            if (cached) {
                return cached;
            }
        }

        const parsed = parseActivityContent(content);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            const metadata = {
                type: null,
                releasedInContent: false,
                hasExplicitReleasedField: false,
            };
            if (cache) cache.set(content, metadata);
            return metadata;
        }

        const metadata = readParsedMetadata(parsed as Record<string, unknown>);
        if (cache) cache.set(content, metadata);
        return metadata;
    }

    if (typeof content !== "object" || Array.isArray(content)) {
        const metadata = { type: null, releasedInContent: false, hasExplicitReleasedField: false };
        return metadata;
    }

    const contentMetadata = readParsedMetadata(content as Record<string, unknown>);
    const metadata = {
        type: contentMetadata.type,
        releasedInContent: contentMetadata.releasedInContent,
        hasExplicitReleasedField: contentMetadata.hasExplicitReleasedField,
    };
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
        if (activity.isReleasedInContent === true && !contentMetadata.hasExplicitReleasedField) {
            return true;
        }
        if (activity.isReleasedInContent === false && contentMetadata.hasExplicitReleasedField) {
            return contentMetadata.releasedInContent;
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
