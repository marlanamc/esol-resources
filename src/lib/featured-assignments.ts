export const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

export function buildFeaturedAssignmentsWhere(classIds: string[]) {
    return {
        classId: { in: classIds },
        isFeatured: true,
        activity: { deletedAt: null },
    };
}

export function buildActivitySubmissionMap(submissions: Array<{
    activityId: string;
    score: number | null;
    activity?: { title?: string | null } | null;
}>): Map<string, number[]> {
    const activitySubmissionMap = new Map<string, number[]>();

    submissions.forEach((submission) => {
        if (typeof submission.score !== "number") return;

        const scoresById = activitySubmissionMap.get(submission.activityId) || [];
        scoresById.push(submission.score);
        activitySubmissionMap.set(submission.activityId, scoresById);

        const title = submission.activity?.title;
        if (!title) return;

        const titleKey = `title:${title.toLowerCase().trim()}`;
        const scoresByTitle = activitySubmissionMap.get(titleKey) || [];
        scoresByTitle.push(submission.score);
        activitySubmissionMap.set(titleKey, scoresByTitle);
    });

    return activitySubmissionMap;
}

export function deriveFeaturedAssignmentProgress(params: {
    assignment: {
        activityId: string;
        createdAt: Date;
        updatedAt: Date | null;
        activity: { type: string | null; category: string | null; title: string | null };
    };
    progress: { progress: number; status: string; categoryData: Record<string, unknown> | null } | undefined;
    activitySubmissionMap: Map<string, number[]>;
}) {
    const { assignment, progress, activitySubmissionMap } = params;
    const isGrammarGuide =
        (assignment.activity.type || "").toLowerCase() === "guide" &&
        (assignment.activity.category || "").toLowerCase() === "grammar";

    const scoresById = activitySubmissionMap.get(assignment.activityId) || [];
    const titleKey = assignment.activity.title ? `title:${assignment.activity.title.toLowerCase().trim()}` : null;
    const scoresByTitle = titleKey ? (activitySubmissionMap.get(titleKey) || []) : [];
    const allRelevantScores = [...scoresById, ...scoresByTitle];
    const hasPassedMiniQuiz = isGrammarGuide && allRelevantScores.some((score) => score > 70);
    const featuredAt = assignment.updatedAt ?? assignment.createdAt;

    return {
        featuredAt,
        isNewRelease: isWithinNewReleaseWindow(featuredAt),
        progress: hasPassedMiniQuiz ? 100 : (progress?.progress ?? 0),
        progressStatus: hasPassedMiniQuiz ? "completed" : (progress?.status ?? "in_progress"),
        categoryData: progress?.categoryData ?? null,
    };
}
