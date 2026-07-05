import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";
import { ApiErrors } from "@/lib/api-response";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";

export const maxDuration = 10; // 10 second timeout

interface PopularActivity {
  activityId: string;
  name: string;
  type: string;
  playCount: number;
  uniquePlayers: number;
}

interface ActiveStudent {
  userId: string;
  username: string;
  firstName: string;
  activitiesCompleted: number;
  pointsEarned: number;
  lastActivityReason?: string;
  lastActivityTime?: string;
}

interface RecentActivityEntry {
  odgerId: string;
  odgerEntry: string;
  userId: string;
  studentName: string;
  studentUsername: string;
  activity: string;
  activityType?: string;
  points: number;
  timestamp: string;
}

interface ReportData {
  timeframe: "daily" | "weekly";
  lastUpdated: string;
  popularActivities: PopularActivity[];
  activeStudents: ActiveStudent[];
  recentActivity: RecentActivityEntry[];
  summary: {
    totalPlays: number;
    totalActiveStudents: number;
    totalPointsAwarded: number;
  };
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return ApiErrors.unauthorized();
  }

  if (!canUseTeacherTools(session.user)) {
    return ApiErrors.forbidden("Only teachers can access reports");
  }

  const teacherId = session.user.id;
  const admin = isAdmin(session.user);

  // Parse query params
  const { searchParams } = new URL(request.url);
  const timeframe = (searchParams.get("timeframe") || "weekly") as
    | "daily"
    | "weekly";
  const classId = searchParams.get("classId"); // Optional class filter
  const learnerTypeParam = searchParams.get("learnerType"); // Optional learner type filter
  const learnerType = learnerTypeParam === "independent" ? "independent" :
                      learnerTypeParam === "all" ? "all" : "classroom";

  // Calculate time threshold
  const now = new Date();
  const timeThreshold = new Date(
    timeframe === "daily"
      ? now.getTime() - 24 * 60 * 60 * 1000 // 24 hours ago
      : now.getTime() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
  );

  try {
    // Get student IDs based on learner type filter
    let studentIds: string[] = [];
    let useStudentFilter = true;

    // Admin can view independent learners
    const effectiveLearnerType = admin ? learnerType : "classroom";

    if (effectiveLearnerType === "independent") {
      // Get independent learners only
      const independentStudents = await prisma.user.findMany({
        where: {
          role: "student",
          isSystemAccount: false,
          ...buildIndependentLearnerWhere(),
        },
        select: { id: true },
      });
      studentIds = independentStudents.map((s) => s.id);
    } else if (effectiveLearnerType === "all" && admin && !classId) {
      // Admin viewing all students - no filter needed
      useStudentFilter = false;
    } else {
      // Classroom students (default) or class-specific filter
      const classWhere = classId
        ? { id: classId, ...(admin ? {} : { teacherId }) }
        : admin ? {} : { teacherId };

      const classes = await prisma.class.findMany({
        where: classWhere,
        select: {
          enrollments: {
            where: {
              status: "active",
              student: {
                isSystemAccount: false,
                excludeFromLeaderboard: false,
              },
            },
            select: {
              studentId: true,
            },
          },
        },
      });

      studentIds = Array.from(
        new Set(
          classes.flatMap((cls) => cls.enrollments.map((e) => e.studentId))
        )
      );
    }

    // Parallel queries for report data
    // Include source "activity" (new) and source "award" with activity-style reason (historical)
    const [groupedPoints, activities, recentActivityData] = await Promise.all([
      prisma.pointsLedger.groupBy({
        by: ["userId", "reason"],
        where: {
          createdAt: { gte: timeThreshold },
          points: { gt: 0 },
          OR: [
            { source: "activity" },
            { source: "award", reason: { contains: "|" } },
            { source: "award", reason: { startsWith: "Completed" } },
          ],
          ...(useStudentFilter ? { userId: { in: studentIds } } : {}),
          user: {
            isSystemAccount: false,
            excludeFromLeaderboard: false,
          },
        },
        _sum: { points: true },
        _count: { _all: true },
      }),
      // Get all activities for name lookup
      prisma.activity.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          type: true,
        },
      }),
      // Get recent activity feed (chronological, with timestamps)
      prisma.pointsLedger.findMany({
        where: {
          createdAt: { gte: timeThreshold },
          points: { gt: 0 },
          OR: [
            { source: "activity" },
            { source: "award", reason: { contains: "|" } },
            { source: "award", reason: { startsWith: "Completed" } },
          ],
          ...(useStudentFilter ? { userId: { in: studentIds } } : {}),
          user: {
            isSystemAccount: false,
            excludeFromLeaderboard: false,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          userId: true,
          points: true,
          reason: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Memoized activity lookup: reason keys repeat across the report sections
    const activityMatchCache = new Map<string, (typeof activities)[number] | undefined>();
    const findActivityForKey = (key: string) => {
      if (activityMatchCache.has(key)) return activityMatchCache.get(key);
      const match = activities.find(
        (a) => key.includes(a.id) || key.toLowerCase().includes(a.title.toLowerCase())
      );
      activityMatchCache.set(key, match);
      return match;
    };

    // Process popular activities from grouped rows.
    // Each grouped row is a unique (userId, reason) pair, so distinct
    // players per reason is the number of rows sharing that reason.
    const activityMap = new Map<
      string,
      { playCount: number; uniquePlayers: Set<string>; activityId: string }
    >();

    groupedPoints.forEach((row) => {
      // Reason can be: "activity:numbers-game", "activity-name", or null
      const activityId = row.reason || "unknown";

      if (!activityMap.has(activityId)) {
        activityMap.set(activityId, {
          playCount: 0,
          uniquePlayers: new Set(),
          activityId,
        });
      }

      const activityData = activityMap.get(activityId)!;
      activityData.playCount += row._count._all;
      activityData.uniquePlayers.add(row.userId);
    });

    // Convert to array and sort by play count
    const popularActivitiesRaw = Array.from(activityMap.entries())
      .map(([key, data]) => ({
        activityKey: key,
        playCount: data.playCount,
        uniquePlayers: data.uniquePlayers.size,
        activityId: data.activityId,
      }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);

    // Enhance with activity names from database
    const popularActivities: PopularActivity[] = popularActivitiesRaw.map(
      (activity) => {
        // Try to find matching activity by ID or title
        const dbActivity = findActivityForKey(activity.activityKey);

        return {
          activityId: activity.activityKey,
          name: dbActivity?.title || activity.activityKey,
          type: dbActivity?.type || "unknown",
          playCount: activity.playCount,
          uniquePlayers: activity.uniquePlayers,
        };
      }
    );

    // Process active students
    const studentMap = new Map<
      string,
      { pointsEarned: number; activitiesCompleted: number }
    >();

    groupedPoints.forEach((row) => {
      if (!studentMap.has(row.userId)) {
        studentMap.set(row.userId, {
          pointsEarned: 0,
          activitiesCompleted: 0,
        });
      }

      const studentData = studentMap.get(row.userId)!;
      studentData.pointsEarned += row._sum.points ?? 0;
      studentData.activitiesCompleted += row._count._all;
    });

    // Get top 10 active students
    const activeStudentsWithData = Array.from(studentMap.entries())
      .map(([userId, data]) => ({
        userId,
        ...data,
      }))
      .sort((a, b) => b.pointsEarned - a.pointsEarned)
      .slice(0, 10);

    // Fetch full student details
    const activeStudentIds = activeStudentsWithData.map((s) => s.userId);
    const studentDetails = await prisma.user.findMany({
      where: {
        id: { in: activeStudentIds },
        isSystemAccount: false,
        excludeFromLeaderboard: false,
      },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    // Build a map of last activity per student for enrichment
    const lastActivityByStudent = new Map<string, { reason: string; time: Date }>();

    // recentActivityData is already sorted by createdAt desc, so first entry per user is most recent
    recentActivityData.forEach((entry) => {
      if (!lastActivityByStudent.has(entry.userId)) {
        lastActivityByStudent.set(entry.userId, {
          reason: entry.reason || "Activity",
          time: entry.createdAt,
        });
      }
    });

    const studentDetailsById = new Map(studentDetails.map((d) => [d.id, d]));

    const activeStudents: ActiveStudent[] = activeStudentsWithData.map(
      (student) => {
        const details = studentDetailsById.get(student.userId);
        const lastActivity = lastActivityByStudent.get(student.userId);

        // Try to get a friendly activity name
        let lastActivityReason = lastActivity?.reason;
        if (lastActivityReason) {
          const dbActivity = findActivityForKey(lastActivityReason);
          if (dbActivity) {
            lastActivityReason = dbActivity.title;
          }
        }

        return {
          userId: student.userId,
          username: details?.username || "Unknown",
          firstName: details?.name?.split(" ")[0] || details?.username || "Unknown",
          activitiesCompleted: student.activitiesCompleted,
          pointsEarned: student.pointsEarned,
          lastActivityReason,
          lastActivityTime: lastActivity?.time.toISOString(),
        };
      }
    );

    // Build recent activity feed
    const recentActivity: RecentActivityEntry[] = recentActivityData
      .map((entry) => {
        // Try to get a friendly activity name and type
        let activityName = entry.reason || "Activity";
        let activityType: string | undefined;

        const dbActivity = findActivityForKey(activityName);

        if (dbActivity) {
          activityName = dbActivity.title;
          activityType = dbActivity.type || undefined;
        }

        return {
          odgerId: entry.id,
          odgerEntry: entry.id,
          userId: entry.userId,
          studentName: entry.user.name?.split(" ")[0] || entry.user.username,
          studentUsername: entry.user.username,
          activity: activityName,
          activityType,
          points: entry.points,
          timestamp: entry.createdAt.toISOString(),
        };
      });

    // Calculate summary
    const summary = {
      totalPlays: groupedPoints.reduce((sum, row) => sum + row._count._all, 0),
      totalActiveStudents: studentMap.size,
      totalPointsAwarded: groupedPoints.reduce(
        (sum, row) => sum + (row._sum.points ?? 0),
        0
      ),
    };

    const reportData: ReportData = {
      timeframe,
      lastUpdated: new Date().toISOString(),
      popularActivities,
      activeStudents,
      recentActivity,
      summary,
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error fetching teacher activity report:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity report" },
      { status: 500 }
    );
  }
}
