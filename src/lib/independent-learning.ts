import { isLearnerVisibleActivity, type LearnerVisibleActivityInput } from "@/lib/learner-visibility";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments";
import { getVocabReviewSourceByActivityId } from "@/lib/vocab-review-sources";

export const INDEPENDENT_NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

type SequenceActivity = {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    isReleased?: boolean | null;
    isFeaturedForIndependent?: boolean | null;
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

export function isIndependentNewRelease(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= INDEPENDENT_NEW_RELEASE_WINDOW_MS;
}

export function filterIndependentVisibleActivities<T extends LearnerVisibleActivityInput>(activities: T[]): T[] {
    return activities.filter((activity) => isLearnerVisibleActivity(activity));
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
    return getIndependentVocabDisplayTitle(params);
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
}): FeaturedAssignment {
    const { activity, progress, submissions = [] } = params;
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
        displayTitle: getIndependentDisplayTitle({
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
        .sort((left, right) => {
            const leftTime = (left.updatedAt ?? left.createdAt ?? new Date(0)).getTime();
            const rightTime = (right.updatedAt ?? right.createdAt ?? new Date(0)).getTime();
            return rightTime - leftTime;
        })
        .filter((activity) => activity.isFeaturedForIndependent === true)
        .slice(0, params.limit ?? 4)
        .map((activity) =>
            buildIndependentFeaturedAssignment({
                activity,
                progress: progressMap.get(activity.id),
                submissions: submissionMap.get(activity.id) || [],
            })
        );
}
