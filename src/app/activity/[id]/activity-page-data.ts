import { getServerSession, type Session } from "next-auth";
import { redirect, notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { grammarTopics } from "@/data/grammar-map";
import { RETURN_TO_QUERY_PARAM } from "@/lib/learner-navigation";
import { isTeacherAdmin } from "@/lib/roles";
import { type ActivityContent, parseActivityContent } from "@/types/activity";

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
      admin: isTeacherAdmin(user),
    },
  };
}

async function loadActivityOrRedirect(activityId: string) {
  try {
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        deletedAt: null,
      },
    });

    if (!activity) {
      notFound();
    }

    return activity;
  } catch (error) {
    logger.error("Failed to load activity", error, { activityId });
    redirect("/dashboard");
  }
}

function assertReleasedSpeakingAccess(
  activity: Prisma.ActivityGetPayload<object>,
  userRole: SessionUser["role"]
) {
  if (userRole !== "student" || activity.type !== "speaking") {
    return;
  }

  try {
    const content = JSON.parse(activity.content) as { released?: boolean };
    if (content.released !== true) {
      redirect("/dashboard");
    }
  } catch {
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

  const slug = completionKeyFromActivityTitle(activity.title);
  const known = new Set([
    ...grammarTopics.map((topic) => topic.id),
    "present-perfect-family",
    "past-perfect-family",
    "future-perfect-family",
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
      });

      if (!enrollment) {
        redirect("/dashboard");
      }
    }

    if (args.user.role === "teacher") {
      const admin = isTeacherAdmin(args.user);
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
