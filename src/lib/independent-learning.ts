import { isLearnerVisibleActivity, type LearnerVisibleActivityInput } from "@/lib/learner-visibility";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments";
import { getVocabReviewSourceByActivityId } from "@/lib/vocab-review-sources";

export const INDEPENDENT_RECOMMENDATION_SEQUENCE: readonly IndependentRecommendationConfig[] = [
    { activityId: "present-simple-guide", stage: 1 },
    {
        activityId: "vocab-daily-review",
        stage: 1,
        displayTitle: "Daily Vocab Review",
    },
    {
        activityId: "vocab-sep-w1",
        stage: 1,
        displayTitle: "Unit 1 Vocabulary: Digital Habits",
        unitNumber: 1,
        theme: "Getting to Know You",
    },
    {
        activityTitle: "Minimal Pairs Listening Lab",
        stage: 1,
        displayTitle: "Minimal Pairs Lab",
    },
    { activityId: "verb-forms-challenge", stage: 1, displayTitle: "Verb Forms Practice" },
    { activityId: "present-continuous-guide", stage: 2 },
    {
        activityId: "vocab-oct-w1",
        stage: 2,
        displayTitle: "Unit 2 Vocabulary: Daily Life in the Community",
        unitNumber: 2,
        theme: "Daily Life in the Community",
    },
    { activityId: "countable-uncountable-nouns", stage: 2, displayTitle: "Countable vs Uncountable Practice" },
    { activityId: "past-simple-guide", stage: 3 },
    {
        activityId: "vocab-nov-w1",
        stage: 3,
        displayTitle: "Unit 3 Vocabulary: Community Participation",
        unitNumber: 3,
        theme: "Community Participation",
    },
    { activityId: "simple-tenses-review", stage: 3 },
    { activityId: "continuous-tenses-review", stage: 3 },
    { activityId: "conditionals-zero-first", stage: 3, displayTitle: "Zero & First Conditionals" },
] as const;

export const INDEPENDENT_RECOMMENDATION_ACTIVITY_IDS = INDEPENDENT_RECOMMENDATION_SEQUENCE.map(
    (item) => item.activityId
).filter((activityId): activityId is string => Boolean(activityId));
export const INDEPENDENT_RECOMMENDATION_ACTIVITY_TITLES = INDEPENDENT_RECOMMENDATION_SEQUENCE.map(
    (item) => item.activityTitle
).filter((activityTitle): activityTitle is string => Boolean(activityTitle));

export const INDEPENDENT_NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

type SequenceActivity = {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    isReleased?: boolean | null;
    content?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

type ActivityProgressRow = {
    activityId: string;
    progress: number;
    status: string;
    categoryData: string | null;
};

type SubmissionRow = {
    activityId: string;
    score: number | null;
    completedAt: Date | null;
};

type IndependentRecommendationConfig = {
    activityId?: string;
    activityTitle?: string;
    stage: number;
    displayTitle?: string;
    unitNumber?: number;
    theme?: string;
};

const INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_ID = new Map<string, IndependentRecommendationConfig>(
    INDEPENDENT_RECOMMENDATION_SEQUENCE
        .filter((item) => Boolean(item.activityId))
        .map((item) => [item.activityId as string, item])
);
const INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_TITLE = new Map<string, IndependentRecommendationConfig>(
    INDEPENDENT_RECOMMENDATION_SEQUENCE
        .filter((item) => Boolean(item.activityTitle))
        .map((item) => [item.activityTitle as string, item])
);
const INDEPENDENT_RECOMMENDATION_ORDER = new Map<string, number>(
    INDEPENDENT_RECOMMENDATION_SEQUENCE.flatMap((item, index) => {
        const keys = [item.activityId, item.activityTitle].filter((value): value is string => Boolean(value));
        return keys.map((key) => [key, index] as const);
    })
);

export function isIndependentNewRelease(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= INDEPENDENT_NEW_RELEASE_WINDOW_MS;
}

export function isIndependentSequenceActivityId(activityId: string): boolean {
    return INDEPENDENT_RECOMMENDATION_ACTIVITY_IDS.includes(activityId);
}

export function filterIndependentVisibleActivities<T extends LearnerVisibleActivityInput>(activities: T[]): T[] {
    return activities.filter((activity) => isLearnerVisibleActivity(activity));
}

export function getIndependentRecommendationActivityIds(): string[] {
    return [...INDEPENDENT_RECOMMENDATION_ACTIVITY_IDS];
}

export function getIndependentRecommendationActivityTitles(): string[] {
    return [...INDEPENDENT_RECOMMENDATION_ACTIVITY_TITLES];
}

export function getIndependentRecommendationConfig(activityId: string): IndependentRecommendationConfig | null {
    return INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_ID.get(activityId) ?? null;
}

export function getIndependentRecommendationConfigForActivity(params: { id: string; title: string }): IndependentRecommendationConfig | null {
    return (
        INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_ID.get(params.id) ??
        INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_TITLE.get(params.title) ??
        null
    );
}

function sortActivitiesByIndependentSequence<T extends { id: string; title: string }>(activities: T[]): T[] {
    return [...activities].sort((left, right) => {
        const leftIndex =
            INDEPENDENT_RECOMMENDATION_ORDER.get(left.id) ??
            INDEPENDENT_RECOMMENDATION_ORDER.get(left.title) ??
            Number.MAX_SAFE_INTEGER;
        const rightIndex =
            INDEPENDENT_RECOMMENDATION_ORDER.get(right.id) ??
            INDEPENDENT_RECOMMENDATION_ORDER.get(right.title) ??
            Number.MAX_SAFE_INTEGER;
        return leftIndex - rightIndex;
    });
}

function isIndependentSequenceActivity(activity: Pick<SequenceActivity, "id" | "title">): boolean {
    return isIndependentSequenceActivityId(activity.id) || INDEPENDENT_RECOMMENDATION_BY_ACTIVITY_TITLE.has(activity.title);
}

function getIndependentRecommendationStage(activity: Pick<SequenceActivity, "id" | "title">): number | null {
    return getIndependentRecommendationConfigForActivity(activity)?.stage ?? null;
}

export function getIndependentVocabDisplayTitle(params: {
    activityId: string;
    title: string;
    unitNumber?: number;
    theme?: string;
}): string | null {
    if (params.activityId === "vocab-daily-review") {
        if (params.unitNumber && params.theme) {
            return `Unit ${params.unitNumber} Vocabulary Review`;
        }
        return "Vocabulary Review";
    }

    if (!params.activityId.startsWith("vocab-")) {
        return null;
    }

    const source = getVocabReviewSourceByActivityId(params.activityId);
    const unitNumber = params.unitNumber ?? source?.unitNumber ?? null;
    const theme = params.theme ?? source?.shortLabel ?? null;

    if (unitNumber && theme) {
        return `Unit ${unitNumber} Vocabulary: ${theme}`;
    }

    if (unitNumber) {
        return `Unit ${unitNumber} Vocabulary`;
    }

    if (theme) {
        return `${theme} Vocabulary`;
    }

    return "Vocabulary";
}

export function getIndependentDisplayTitle(params: {
    activityId: string;
    title: string;
}): string | null {
    const config = getIndependentRecommendationConfig(params.activityId);
    if (config?.displayTitle) {
        return config.displayTitle;
    }

    return getIndependentVocabDisplayTitle({
        activityId: params.activityId,
        title: params.title,
        unitNumber: config?.unitNumber,
        theme: config?.theme,
    });
}

function isActivityCompleted(params: {
    activity: Pick<SequenceActivity, "type" | "category">;
    progress?: Pick<ActivityProgressRow, "progress" | "status">;
    submissions?: SubmissionRow[];
}) {
    const { activity, progress, submissions = [] } = params;
    const isGrammarGuide =
        (activity.type || "").toLowerCase() === "guide" &&
        (activity.category || "").toLowerCase() === "grammar";

    if (isGrammarGuide) {
        return submissions.some((submission) => submission.completedAt && typeof submission.score === "number" && submission.score > 70);
    }

    if (progress?.status === "completed") {
        return true;
    }

    return submissions.some((submission) => submission.completedAt);
}

export function buildIndependentFeaturedAssignment(params: {
    activity: SequenceActivity;
    progress?: ActivityProgressRow;
    submissions?: SubmissionRow[];
    recommendationConfig?: IndependentRecommendationConfig | null;
}): FeaturedAssignment {
    const { activity, progress, submissions = [], recommendationConfig } = params;
    const isCompleted = isActivityCompleted({
        activity,
        progress,
        submissions,
    });

    return {
        id: activity.id,
        assignmentId: null,
        activityId: activity.id,
        href: activity.id === "vocab-daily-review" ? "/dashboard/vocab-review" : `/activity/${encodeURIComponent(activity.id)}`,
        title: activity.title,
        displayTitle: recommendationConfig?.displayTitle || getIndependentDisplayTitle({
            activityId: activity.id,
            title: activity.title,
        }),
        featuredAt: activity.updatedAt ?? activity.createdAt ?? null,
        updatedAt: activity.updatedAt ?? activity.createdAt ?? null,
        createdAt: activity.createdAt ?? null,
        isNewRelease: isIndependentNewRelease(activity.updatedAt ?? activity.createdAt ?? null),
        progress: isCompleted ? 100 : (progress?.progress ?? 0),
        progressStatus: isCompleted ? "completed" : (progress?.status ?? "in_progress"),
        categoryData: progress?.categoryData ?? null,
        activity: {
            title: activity.title,
            description: activity.description,
            type: activity.type,
            category: activity.category,
        },
        submissions: submissions.map((submission, index) => ({
            id: `${activity.id}-submission-${index}`,
            status: submission.completedAt ? "submitted" : "in_progress",
            completedAt: submission.completedAt,
            score: submission.score,
        })),
    };
}

export function getCurrentIndependentRecommendation(params: {
    activities: SequenceActivity[];
    progressRows: ActivityProgressRow[];
    submissions: SubmissionRow[];
}): FeaturedAssignment[] {
    const progressMap = new Map(params.progressRows.map((row) => [row.activityId, row]));
    const submissionMap = params.submissions.reduce<Map<string, SubmissionRow[]>>((map, submission) => {
        const rows = map.get(submission.activityId) || [];
        rows.push(submission);
        map.set(submission.activityId, rows);
        return map;
    }, new Map<string, SubmissionRow[]>());

    const visibleActivities = sortActivitiesByIndependentSequence(
        filterIndependentVisibleActivities(params.activities)
    );
    const nextActivity = visibleActivities.find((activity) => {
        const progress = progressMap.get(activity.id);
        const submissions = submissionMap.get(activity.id) || [];
        return !isActivityCompleted({ activity, progress, submissions });
    });

    if (!nextActivity) {
        return [];
    }

    const currentStage = getIndependentRecommendationStage(nextActivity);
    const stageActivities =
        currentStage === null
            ? [nextActivity]
            : visibleActivities.filter((activity) => getIndependentRecommendationStage(activity) === currentStage);

    return stageActivities.map((activity) =>
        buildIndependentFeaturedAssignment({
            activity,
            progress: progressMap.get(activity.id),
            submissions: submissionMap.get(activity.id) || [],
            recommendationConfig: getIndependentRecommendationConfigForActivity(activity),
        })
    );
}

export function getIndependentNewActivityCards(params: {
    activities: SequenceActivity[];
    progressRows: ActivityProgressRow[];
    submissions: SubmissionRow[];
    limit?: number;
}): FeaturedAssignment[] {
    const progressMap = new Map(params.progressRows.map((row) => [row.activityId, row]));
    const submissionMap = params.submissions.reduce<Map<string, SubmissionRow[]>>((map, submission) => {
        const rows = map.get(submission.activityId) || [];
        rows.push(submission);
        map.set(submission.activityId, rows);
        return map;
    }, new Map<string, SubmissionRow[]>());

    return filterIndependentVisibleActivities(params.activities)
        .filter((activity) => !isIndependentSequenceActivity(activity))
        .sort((left, right) => {
            const leftTime = (left.updatedAt ?? left.createdAt ?? new Date(0)).getTime();
            const rightTime = (right.updatedAt ?? right.createdAt ?? new Date(0)).getTime();
            return rightTime - leftTime;
        })
        .filter((activity) => isIndependentNewRelease(activity.updatedAt ?? activity.createdAt ?? null))
        .slice(0, params.limit ?? 4)
        .map((activity) =>
            buildIndependentFeaturedAssignment({
                activity,
                progress: progressMap.get(activity.id),
                submissions: submissionMap.get(activity.id) || [],
            })
        );
}
