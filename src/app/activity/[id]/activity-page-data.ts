import { getServerSession, type Session } from "next-auth";
import { redirect, notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { grammarTopics } from "@/data/grammar-map";
import { RETURN_TO_QUERY_PARAM, sanitizeInternalHref } from "@/lib/learner-navigation";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";
import { type ActivityContent, parseActivityContent } from "@/types/activity";
import { assertLearnerCanAccessActivity } from "@/lib/learner-visibility";

type SessionUser = Session["user"];

type LoadedAssignment = Prisma.AssignmentGetPayload<{
  include: {
    class: true;
  };
}>;

type LoadedSubmission = Omit<Prisma.SubmissionGetPayload<object>, "content"> & {
  content: unknown;
};

type LoadedProgress = {
  progress: number;
  categoryData: string | null;
} | null;

export type ActivityPageData = {
  activity: Prisma.ActivityGetPayload<object>;
  assignment: LoadedAssignment | null;
  submission: LoadedSubmission | null;
  progressValue: number;
  categoryData: string | null;
  parsedContent: ActivityContent | null;
  viewer: {
    userId: string;
    userRole: SessionUser["role"];
    admin: boolean;
  };
};

export async function loadActivityPageData(args: {
  activityId: string;
  assignmentId?: string;
  returnTo?: string;
}): Promise<ActivityPageData> {
  redirectSpecialActivityIfNeeded(args.activityId, args.assignmentId, args.returnTo);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const activity = await loadActivityOrRedirect(args.activityId);
  assertReleasedSpeakingAccess(activity, user.role);
  redirectCanonicalGrammarGuideIfNeeded(activity, args.assignmentId, args.returnTo);

  const assignment = await loadAuthorizedAssignment({
    assignmentId: args.assignmentId,
    activityId: args.activityId,
    user,
  });

  const [submissionResult, progressRecord] = await loadSubmissionAndProgress({
    userId: user.id,
    activityId: args.activityId,
    assignmentId: args.assignmentId,
    userRole: user.role,
  });

  return {
    activity,
    assignment,
    submission: parseSubmission(submissionResult),
    progressValue: progressRecord?.progress ?? 0,
    categoryData: progressRecord?.categoryData ?? null,
    parsedContent: parseActivityContentSafely(activity.content),
    viewer: {
      userId: user.id,
      userRole: user.role,
      admin: isAdmin(user),
    },
  };
}

function redirectSpecialActivityIfNeeded(
  activityId: string,
  assignmentId?: string,
  returnTo?: string
) {
  if (activityId !== "vocab-daily-review") {
    return;
  }

  const qs = new URLSearchParams();
  if (assignmentId) qs.set("assignment", assignmentId);
  const sanitizedReturnTo = sanitizeInternalHref(returnTo);
  if (sanitizedReturnTo) qs.set(RETURN_TO_QUERY_PARAM, sanitizedReturnTo);
  redirect(`/dashboard/vocab-review${qs.toString() ? `?${qs.toString()}` : ""}`);
}

const ACTIVITY_BASE_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  category: true,
  level: true,
  content: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  ui: true,
  isReleased: true,
  deletedAt: true,
} as const;

async function loadActivityOrRedirect(activityId: string) {

  try {
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        deletedAt: null,
      },
      select: {
        ...ACTIVITY_BASE_SELECT,
      },
    });

    if (!activity) {
      notFound();
    }

    return activity as Prisma.ActivityGetPayload<object>;
  } catch (error) {
    logger.error("Failed to load activity", error, { activityId });
    redirect("/dashboard");
  }
}

function assertReleasedSpeakingAccess(
  activity: Prisma.ActivityGetPayload<object>,
  userRole: SessionUser["role"]
) {
  if (!assertLearnerCanAccessActivity(activity, userRole)) {
    redirect("/dashboard");
  }
}

function redirectCanonicalGrammarGuideIfNeeded(
  activity: Prisma.ActivityGetPayload<object>,
  assignmentId?: string,
  returnTo?: string
) {
  if (activity.type !== "guide" || activity.category !== "grammar") {
    return;
  }

  // Prefer stable activity id when it matches a grammar-reader route (e.g. medical-instructions-complete),
  // so guides that embed asset URLs from TS stay fresh instead of serving stale JSON from Activity.content.
  const slug =
    activity.id === "medical-instructions-complete"
      ? "medical-instructions-complete"
      : completionKeyFromActivityTitle(activity.title);
  const known = new Set([
    ...grammarTopics.map((topic) => topic.id),
    "present-perfect-family",
    "past-perfect-family",
    "future-perfect-family",
    "medical-instructions-complete",
  ]);

  if (!known.has(slug)) {
    return;
  }

  const qs = new URLSearchParams();
  if (assignmentId) qs.set("assignment", assignmentId);
  if (returnTo) qs.set(RETURN_TO_QUERY_PARAM, returnTo);
  redirect(`/grammar-reader/${slug}${qs.toString() ? `?${qs.toString()}` : ""}`);
}

async function loadAuthorizedAssignment(args: {
  assignmentId?: string;
  activityId: string;
  user: SessionUser;
}) {
  if (!args.assignmentId) {
    return null;
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: args.assignmentId },
      include: { class: true },
    });

    if (!assignment?.class) {
      redirect("/dashboard");
    }

    if (args.user.role === "student") {
      const enrollment = await prisma.classEnrollment.findUnique({
        where: {
          classId_studentId: {
            classId: assignment.classId,
            studentId: args.user.id,
          },
        },
        select: { status: true },
      });

      if (enrollment?.status !== "active") {
        redirect("/dashboard");
      }
    }

    if (canUseTeacherTools(args.user)) {
      const admin = isAdmin(args.user);
      if (!admin && assignment.class.teacherId !== args.user.id) {
        redirect("/dashboard");
      }
    }

    return assignment;
  } catch (error) {
    logger.error("Failed to load assignment for activity", error, {
      assignmentId: args.assignmentId,
      activityId: args.activityId,
      userId: args.user.id,
    });
    redirect("/dashboard");
  }
}

async function loadSubmissionAndProgress(args: {
  userId: string;
  activityId: string;
  assignmentId?: string;
  userRole: SessionUser["role"];
}): Promise<[Prisma.SubmissionGetPayload<object> | null, LoadedProgress]> {
  try {
    return await Promise.all([
      args.userRole === "student"
        ? prisma.submission.findFirst({
            where: {
              userId: args.userId,
              activityId: args.activityId,
              assignmentId: args.assignmentId ?? null,
            },
          })
        : Promise.resolve(null),
      prisma.activityProgress.findFirst({
        where: {
          userId: args.userId,
          activityId: args.activityId,
          assignmentId: args.assignmentId ?? null,
        },
        select: {
          progress: true,
          categoryData: true,
        },
      }),
    ]);
  } catch (error) {
    logger.error("Failed to load activity submission/progress", error, {
      activityId: args.activityId,
      assignmentId: args.assignmentId ?? null,
      userId: args.userId,
    });
    return [null, null];
  }
}

function parseSubmission(
  submission: Prisma.SubmissionGetPayload<object> | null
): LoadedSubmission | null {
  if (!submission?.content || typeof submission.content !== "string") {
    return submission as LoadedSubmission | null;
  }

  try {
    return {
      ...submission,
      content: JSON.parse(submission.content) as Record<string, unknown>,
    };
  } catch {
    return submission as LoadedSubmission;
  }
}

function parseActivityContentSafely(content: string): ActivityContent | null {
  try {
    return parseActivityContent(content);
  } catch {
    return null;
  }
}
