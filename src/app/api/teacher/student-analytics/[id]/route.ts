import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import {
  buildTeacherStudentCategorySummaries,
  filterVisibleTeacherAnalyticsAssignments,
} from "@/lib/teacher-student-analytics";
import { ApiErrors } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return ApiErrors.unauthorized();
  }

  const teacherId = session.user.id;
  const admin = isAdmin(session.user);
  const { id: studentId } = await params;

  if (canUseTeacherTools(session.user) && !admin) {
    const enrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        status: "active",
        class: {
          teacherId,
        },
        student: {
          isSystemAccount: false,
        },
      },
    });

    if (!enrollment) {
      return ApiErrors.forbidden("Student not found in your classes");
    }
  }

  const [student, enrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        username: true,
        points: true,
        weeklyPoints: true,
        currentStreak: true,
        longestStreak: true,
        lastActivityDate: true,
        createdAt: true,
        isSystemAccount: true,
      },
    }),
    prisma.classEnrollment.findMany({
      where: {
        studentId,
        status: "active",
        student: {
          isSystemAccount: false,
        },
        ...(canUseTeacherTools(session.user) && !admin ? { class: { teacherId } } : {}),
      },
      select: {
        classId: true,
        class: {
          select: {
            assignments: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                title: true,
                dueDate: true,
                activityId: true,
                activity: {
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    category: true,
                    content: true,
                    isReleased: true,
                    deletedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  if (!student || student.isSystemAccount) {
    return ApiErrors.notFound("Student", studentId);
  }

  const visibleAssignments = enrollments.flatMap((enrollment) =>
    filterVisibleTeacherAnalyticsAssignments(
      enrollment.class.assignments,
      isLearnerVisibleActivity
    )
  );
  const visibleAssignmentIds = visibleAssignments.map((assignment) => assignment.id);

  const [
    activityProgress,
    pointsHistory,
    pointsThisMonth,
    scopedSubmissions,
    verbQuizActivities,
    grammarGuideActivities,
  ] = await Promise.all([
    prisma.activityProgress.findMany({
      where: { userId: studentId },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
            level: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.pointsLedger.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        points: true,
        reason: true,
        createdAt: true,
      },
    }),
    prisma.pointsLedger.findMany({
      where: {
        userId: studentId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      select: {
        createdAt: true,
      },
    }),
    visibleAssignmentIds.length
      ? prisma.submission.findMany({
          where: {
            userId: studentId,
            assignmentId: { in: visibleAssignmentIds },
          },
          select: {
            id: true,
            activityId: true,
            assignmentId: true,
            score: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            completedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
    prisma.activity.findMany({
      where: {
        type: "quiz",
        content: {
          contains: '"type":"verb-quiz"',
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.activity.findMany({
      where: {
        type: "guide",
        category: "grammar",
      },
      select: {
        id: true,
        title: true,
      },
    }),
  ]);

  const effectiveCurrentStreak = getEffectiveStreak(
    student.currentStreak,
    student.lastActivityDate
  );
  const completedActivities = activityProgress.filter((entry) => entry.status === "completed");
  const inProgressActivities = activityProgress.filter(
    (entry) => entry.status === "in_progress" && entry.progress < 100
  );

  const activityPlayCounts = new Map<
    string,
    { count: number; title: string; category: string }
  >();

  for (const entry of pointsHistory) {
    const activityKey = entry.reason;
    if (!activityKey) {
      continue;
    }

    const existing = activityPlayCounts.get(activityKey);
    if (existing) {
      existing.count++;
      continue;
    }

    const [category = "activity", rawName] = activityKey.split(":");
    const name = rawName ? rawName.replace(/-/g, " ") : category;
    activityPlayCounts.set(activityKey, {
      count: 1,
      title: name.charAt(0).toUpperCase() + name.slice(1),
      category,
    });
  }

  const favoriteActivities = Array.from(activityPlayCounts.entries())
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const uniqueDays = new Set(
    pointsThisMonth.map((entry) => entry.createdAt.toISOString().split("T")[0])
  );
  const daysActiveThisMonth = uniqueDays.size;
  const latestPointsAt = pointsHistory[0]?.createdAt ?? null;
  const latestProgressAt = activityProgress[0]?.updatedAt ?? null;
  const lastActive =
    [latestPointsAt, latestProgressAt, student.lastActivityDate]
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  const categorySummaries = buildTeacherStudentCategorySummaries({
    assignments: visibleAssignments,
    progressRows: activityProgress,
    submissionRows: scopedSubmissions,
  });

  const [verbQuizSubmissions, grammarQuizSubmissions] = await Promise.all([
    verbQuizActivities.length
      ? prisma.submission.findMany({
          where: {
            userId: studentId,
            activityId: {
              in: verbQuizActivities.map((activity) => activity.id),
            },
          },
          select: {
            id: true,
            activityId: true,
            score: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : Promise.resolve([]),
    grammarGuideActivities.length
      ? prisma.submission.findMany({
          where: {
            userId: studentId,
            activityId: {
              in: grammarGuideActivities.map((activity) => activity.id),
            },
            score: { not: null },
          },
          select: {
            id: true,
            activityId: true,
            score: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : Promise.resolve([]),
  ]);

  const verbQuizResults = verbQuizActivities.map((activity) => {
    const submission = verbQuizSubmissions.find(
      (row) => row.activityId === activity.id
    );
    return {
      id: activity.id,
      title: activity.title,
      score: submission?.score ?? null,
      submittedAt: submission?.createdAt ?? null,
      completed: submission !== undefined,
    };
  });

  const grammarQuizResults = grammarGuideActivities
    .map((activity) => {
      const submission = grammarQuizSubmissions.find(
        (row) => row.activityId === activity.id
      );
      return {
        id: activity.id,
        title: activity.title,
        score: submission?.score ?? null,
        submittedAt: submission?.createdAt ?? null,
        completed: submission !== undefined,
      };
    })
    .filter((row) => row.completed);

  const progressTimeline = activityProgress.slice(0, 50).map((entry) => ({
    id: `progress-${entry.id}`,
    points: 0,
    activity: entry.activity.title,
    activityType: entry.activity.type || "activity",
    source: "progress" as const,
    timestamp: entry.updatedAt,
  }));
  const pointsTimeline = pointsHistory.map((entry) => ({
    id: `points-${entry.id}`,
    points: entry.points,
    activity: entry.reason,
    source: "points" as const,
    timestamp: entry.createdAt,
  }));
  const timeline = [...pointsTimeline, ...progressTimeline]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);

  return NextResponse.json({
    student: {
      ...student,
      currentStreak: effectiveCurrentStreak,
      lastActive,
      daysActiveThisMonth,
    },
    engagement: {
      totalActivitiesCompleted: completedActivities.length,
      activitiesInProgress: inProgressActivities.length,
      totalActivitiesStarted: activityProgress.length,
      favoriteActivities,
      currentStreak: effectiveCurrentStreak,
      longestStreak: student.longestStreak || 0,
    },
    progress: {
      byCategory: categorySummaries,
      all: activityProgress,
    },
    timeline,
    verbQuizResults,
    grammarQuizResults,
  });
}
