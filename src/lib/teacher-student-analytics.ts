export type StudentAnalyticsCategoryKey = "vocab" | "grammar" | "numbers" | "other";

export type StudentAnalyticsCategoryStatus =
  | "on-track"
  | "needs-attention"
  | "not-started"
  | "no-assigned-work";

export type StudentAnalyticsNextActionType = "resume" | "start" | "review";

export interface StudentAnalyticsNextAction {
  assignmentId: string;
  title: string;
  dueDate: string | null;
  actionType: StudentAnalyticsNextActionType;
}

export interface StudentAnalyticsCategoryActivitySnapshot {
  id: string;
  activityId: string;
  assignmentId: string | null;
  title: string;
  progress: number;
  status: string;
  updatedAt: string;
}

export interface StudentAnalyticsCategorySummary {
  activities: StudentAnalyticsCategoryActivitySnapshot[];
  avgProgress: number;
  completed: number;
  assignedCount: number;
  startedCount: number;
  completedCount: number;
  completionRate: number;
  stalledCount: number;
  overdueCount: number;
  lastActiveAt: string | null;
  latestScore: number | null;
  nextAction: StudentAnalyticsNextAction | null;
  status: StudentAnalyticsCategoryStatus;
  historicalActivityCount: number;
}

export interface StudentAnalyticsResponse {
  student: {
    id: string;
    name: string;
    username: string;
    points: number;
    weeklyPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActive: string | null;
    daysActiveThisMonth: number;
  };
  engagement: {
    totalActivitiesCompleted: number;
    activitiesInProgress: number;
    totalActivitiesStarted: number;
    favoriteActivities: Array<{
      key: string;
      count: number;
      title: string;
      category: string;
    }>;
    currentStreak: number;
    longestStreak: number;
  };
  progress: {
    byCategory: Record<StudentAnalyticsCategoryKey, StudentAnalyticsCategorySummary>;
    all: unknown[];
  };
  timeline: Array<{
    id: string;
    points: number;
    activity: string;
    activityType?: string;
    source?: "points" | "progress";
    timestamp: string;
  }>;
  verbQuizResults: Array<{
    id: string;
    title: string;
    score: number | null;
    submittedAt: string | null;
    completed: boolean;
  }>;
  grammarQuizResults: Array<{
    id: string;
    title: string;
    score: number | null;
    submittedAt: string | null;
    completed: boolean;
  }>;
}

type AssignmentLike = {
  id: string;
  title: string | null;
  dueDate: Date | null;
  activityId: string;
  activity: {
    id: string;
    title: string;
    type?: string | null;
    category: string | null;
    isReleased?: boolean | null;
    deletedAt?: Date | null;
    content?: string | null;
  };
};

type ProgressLike = {
  id: string;
  activityId: string;
  assignmentId: string | null;
  progress: number;
  status: string;
  updatedAt: Date;
  activity: {
    id: string;
    title: string;
    category: string | null;
  };
};

type SubmissionLike = {
  id: string;
  activityId: string;
  assignmentId: string | null;
  score: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

type AssignmentEvaluation = {
  assignmentId: string;
  title: string;
  dueDate: Date | null;
  started: boolean;
  completed: boolean;
  overdue: boolean;
  stalled: boolean;
  lastActivityAt: Date | null;
  latestScore: number | null;
};

const CATEGORY_KEYS: StudentAnalyticsCategoryKey[] = ["vocab", "grammar", "numbers", "other"];
const LOW_SCORE_REVIEW_THRESHOLD = 70;

function toIsoOrNull(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function isLaterDate(candidate: Date | null, current: Date | null): boolean {
  if (!candidate) return false;
  if (!current) return true;
  return candidate.getTime() > current.getTime();
}

function isEarlierDate(candidate: Date | null, current: Date | null): boolean {
  if (!candidate) return false;
  if (!current) return true;
  return candidate.getTime() < current.getTime();
}

function getSubmissionActivityAt(submission: SubmissionLike | null): Date | null {
  if (!submission) return null;

  return submission.completedAt ?? submission.updatedAt ?? submission.createdAt;
}

function chooseBestProgressRow(
  current: ProgressLike | undefined,
  candidate: ProgressLike
): ProgressLike {
  if (!current) {
    return candidate;
  }

  if (candidate.progress !== current.progress) {
    return candidate.progress > current.progress ? candidate : current;
  }

  return candidate.updatedAt > current.updatedAt ? candidate : current;
}

function chooseLatestSubmission(
  current: SubmissionLike | undefined,
  candidate: SubmissionLike
): SubmissionLike {
  if (!current) {
    return candidate;
  }

  const currentAt = getSubmissionActivityAt(current);
  const candidateAt = getSubmissionActivityAt(candidate);

  if (!currentAt) return candidate;
  if (!candidateAt) return current;

  return candidateAt > currentAt ? candidate : current;
}

function getActivityTitle(assignment: AssignmentLike): string {
  return (assignment.title || assignment.activity.title || "").trim();
}

export function getStudentAnalyticsCategoryKey(input: {
  activityId?: string | null;
  category?: string | null;
}): StudentAnalyticsCategoryKey {
  const activityId = (input.activityId || "").toLowerCase();
  const category = (input.category || "").toLowerCase();

  if (
    category === "vocab" ||
    category === "vocabulary" ||
    activityId.startsWith("vocab-")
  ) {
    return "vocab";
  }

  if (category === "grammar") {
    return "grammar";
  }

  if (category === "number" || category === "numbers") {
    return "numbers";
  }

  return "other";
}

export function buildTeacherStudentCategorySummaries(params: {
  assignments: AssignmentLike[];
  progressRows: ProgressLike[];
  submissionRows: SubmissionLike[];
  now?: Date;
  stalledAfterDays?: number;
}): Record<StudentAnalyticsCategoryKey, StudentAnalyticsCategorySummary> {
  const {
    assignments,
    progressRows,
    submissionRows,
    now = new Date(),
    stalledAfterDays = 7,
  } = params;
  const stalledThresholdMs = stalledAfterDays * 24 * 60 * 60 * 1000;
  const assignmentsByActivityId = new Map<string, string[]>();
  const scopedProgressByAssignmentId = new Map<string, ProgressLike>();
  const fallbackProgressByAssignmentId = new Map<string, ProgressLike>();
  const scopedSubmissionByAssignmentId = new Map<string, SubmissionLike>();
  const rawProgressByCategory = new Map<StudentAnalyticsCategoryKey, ProgressLike[]>();
  const evaluationsByCategory = new Map<StudentAnalyticsCategoryKey, AssignmentEvaluation[]>();

  for (const categoryKey of CATEGORY_KEYS) {
    rawProgressByCategory.set(categoryKey, []);
    evaluationsByCategory.set(categoryKey, []);
  }

  for (const assignment of assignments) {
    const bucket = assignmentsByActivityId.get(assignment.activityId);
    if (bucket) {
      bucket.push(assignment.id);
    } else {
      assignmentsByActivityId.set(assignment.activityId, [assignment.id]);
    }
  }

  for (const row of progressRows) {
    const categoryKey = getStudentAnalyticsCategoryKey({
      activityId: row.activity.id,
      category: row.activity.category,
    });
    rawProgressByCategory.get(categoryKey)?.push(row);

    if (row.assignmentId) {
      scopedProgressByAssignmentId.set(
        row.assignmentId,
        chooseBestProgressRow(scopedProgressByAssignmentId.get(row.assignmentId), row)
      );
      continue;
    }

    const linkedAssignmentIds = assignmentsByActivityId.get(row.activityId) || [];
    if (linkedAssignmentIds.length === 1) {
      const [assignmentId] = linkedAssignmentIds;
      if (!scopedProgressByAssignmentId.has(assignmentId)) {
        fallbackProgressByAssignmentId.set(
          assignmentId,
          chooseBestProgressRow(fallbackProgressByAssignmentId.get(assignmentId), row)
        );
      }
    }
  }

  for (const row of submissionRows) {
    if (!row.assignmentId) {
      continue;
    }

    scopedSubmissionByAssignmentId.set(
      row.assignmentId,
      chooseLatestSubmission(scopedSubmissionByAssignmentId.get(row.assignmentId), row)
    );
  }

  for (const assignment of assignments) {
    const categoryKey = getStudentAnalyticsCategoryKey({
      activityId: assignment.activity.id,
      category: assignment.activity.category,
    });
    const progress =
      scopedProgressByAssignmentId.get(assignment.id) ||
      fallbackProgressByAssignmentId.get(assignment.id) ||
      null;
    const submission = scopedSubmissionByAssignmentId.get(assignment.id) || null;
    const progressCompleted = Boolean(
      progress && (progress.status === "completed" || progress.progress >= 100)
    );
    const submissionCompleted = Boolean(
      submission &&
        (submission.completedAt ||
          submission.score !== null ||
          submission.status === "completed" ||
          submission.status === "submitted")
    );
    const started = Boolean(
      progressCompleted ||
        submissionCompleted ||
        (progress && progress.progress > 0) ||
        submission
    );
    const completed = progressCompleted || submissionCompleted;
    const progressActivityAt = progress?.updatedAt ?? null;
    const submissionActivityAt = getSubmissionActivityAt(submission);
    const lastActivityAt = isLaterDate(submissionActivityAt, progressActivityAt)
      ? submissionActivityAt
      : progressActivityAt;
    const overdue = Boolean(!completed && assignment.dueDate && assignment.dueDate < now);
    const stalled = Boolean(
      started &&
        !completed &&
        lastActivityAt &&
        now.getTime() - lastActivityAt.getTime() >= stalledThresholdMs
    );

    evaluationsByCategory.get(categoryKey)?.push({
      assignmentId: assignment.id,
      title: getActivityTitle(assignment),
      dueDate: assignment.dueDate,
      started,
      completed,
      overdue,
      stalled,
      lastActivityAt,
      latestScore: submission?.score ?? null,
    });
  }

  const summaries = {} as Record<StudentAnalyticsCategoryKey, StudentAnalyticsCategorySummary>;

  for (const categoryKey of CATEGORY_KEYS) {
    const evaluations = evaluationsByCategory.get(categoryKey) || [];
    const rawProgress = rawProgressByCategory.get(categoryKey) || [];
    const assignedCount = evaluations.length;
    const startedCount = evaluations.filter((item) => item.started).length;
    const completedCount = evaluations.filter((item) => item.completed).length;
    const stalledCount = evaluations.filter((item) => item.stalled).length;
    const overdueCount = evaluations.filter((item) => item.overdue).length;
    const completionRate = assignedCount
      ? Math.round((completedCount / assignedCount) * 100)
      : 0;
    const avgProgress = rawProgress.length
      ? Math.round(
          rawProgress.reduce((sum, row) => sum + row.progress, 0) / rawProgress.length
        )
      : 0;
    let lastActiveAt: Date | null = null;
    let latestScoreAt: Date | null = null;
    let latestScore: number | null = null;

    for (const evaluation of evaluations) {
      if (isLaterDate(evaluation.lastActivityAt, lastActiveAt)) {
        lastActiveAt = evaluation.lastActivityAt;
      }

      if (typeof evaluation.latestScore === "number" && evaluation.lastActivityAt) {
        if (isLaterDate(evaluation.lastActivityAt, latestScoreAt)) {
          latestScoreAt = evaluation.lastActivityAt;
          latestScore = evaluation.latestScore;
        }
      }
    }

    const overdueCandidate = evaluations
      .filter((item) => item.overdue)
      .reduce<AssignmentEvaluation | null>(
        (best, item) => (isEarlierDate(item.dueDate, best?.dueDate ?? null) ? item : best),
        null
      );
    const stalledCandidate = evaluations
      .filter((item) => item.stalled)
      .reduce<AssignmentEvaluation | null>((best, item) => {
        if (!best) return item;
        const bestAt = best.lastActivityAt?.getTime() ?? Number.POSITIVE_INFINITY;
        const itemAt = item.lastActivityAt?.getTime() ?? Number.POSITIVE_INFINITY;
        return itemAt < bestAt ? item : best;
      }, null);
    const unstartedCandidate = evaluations
      .filter((item) => !item.started && !item.completed)
      .reduce<AssignmentEvaluation | null>((best, item) => {
        if (!best) return item;
        const bestDue = best.dueDate?.getTime() ?? Number.POSITIVE_INFINITY;
        const itemDue = item.dueDate?.getTime() ?? Number.POSITIVE_INFINITY;
        return itemDue < bestDue ? item : best;
      }, null);
    const reviewCandidate = evaluations
      .filter(
        (item) =>
          item.completed &&
          typeof item.latestScore === "number" &&
          item.latestScore < LOW_SCORE_REVIEW_THRESHOLD
      )
      .reduce<AssignmentEvaluation | null>((best, item) => {
        if (!best) return item;
        const bestAt = best.lastActivityAt?.getTime() ?? 0;
        const itemAt = item.lastActivityAt?.getTime() ?? 0;
        return itemAt > bestAt ? item : best;
      }, null);

    const nextActionSource =
      overdueCandidate ||
      stalledCandidate ||
      unstartedCandidate ||
      reviewCandidate ||
      null;
    const nextActionType: StudentAnalyticsNextActionType | null = overdueCandidate
      ? "resume"
      : stalledCandidate
        ? "resume"
        : unstartedCandidate
          ? "start"
          : reviewCandidate
            ? "review"
            : null;
    const status: StudentAnalyticsCategoryStatus = assignedCount === 0
      ? "no-assigned-work"
      : overdueCount > 0 || stalledCount > 0
        ? "needs-attention"
        : startedCount === 0
          ? "not-started"
          : "on-track";

    summaries[categoryKey] = {
      activities: rawProgress.map((row) => ({
        id: row.id,
        activityId: row.activityId,
        assignmentId: row.assignmentId,
        title: row.activity.title,
        progress: row.progress,
        status: row.status,
        updatedAt: row.updatedAt.toISOString(),
      })),
      avgProgress,
      completed: rawProgress.filter((row) => row.status === "completed").length,
      assignedCount,
      startedCount,
      completedCount,
      completionRate,
      stalledCount,
      overdueCount,
      lastActiveAt: toIsoOrNull(lastActiveAt),
      latestScore,
      nextAction:
        nextActionSource && nextActionType
          ? {
              assignmentId: nextActionSource.assignmentId,
              title: nextActionSource.title,
              dueDate: toIsoOrNull(nextActionSource.dueDate),
              actionType: nextActionType,
            }
          : null,
      status,
      historicalActivityCount: rawProgress.length,
    };
  }

  return summaries;
}

export function filterVisibleTeacherAnalyticsAssignments<T extends AssignmentLike>(
  assignments: T[],
  isVisible: (activity: T["activity"]) => boolean
): T[] {
  return assignments.filter((assignment) => isVisible(assignment.activity));
}
