import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTeacherAdmin } from "@/lib/roles";
import { ApiErrors } from "@/lib/api-response";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";

export const maxDuration = 10; // 10 second timeout
export const revalidate = 300; // Cache for 5 minutes

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

  const userRole = session.user.role;
  if (userRole !== "teacher") {
    return ApiErrors.forbidden("Only teachers can access reports");
  }

  const teacherId = session.user.id;
  const admin = isTeacherAdmin(session.user);

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
              student: {
                isSystemAccount: false,
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
    const [pointsData, activities, recentActivityData] = await Promise.all([
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
        },
        select: {
          userId: true,
          points: true,
          reason: true,
          user: {
            select: {
              username: true,
              name: true,
              isSystemAccount: true,
            },
          },
        },
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
              isSystemAccount: true,
            },
          },
        },
      }),
    ]);

    // Filter out system accounts from results
    const filteredPointsData = pointsData.filter(
      (p) => !p.user.isSystemAccount
    );

    // Process popular activities
    const activityMap = new Map<
      string,
      { playCount: number; uniquePlayers: Set<string>; activityId: string }
    >();

    filteredPointsData.forEach((entry) => {
      // Parse activity ID from reason field
      // Reason can be: "activity:numbers-game", "activity-name", or null
      const activityId = entry.reason || "unknown";

      if (!activityMap.has(activityId)) {
        activityMap.set(activityId, {
          playCount: 0,
          uniquePlayers: new Set(),
          activityId,
        });
      }

      const activityData = activityMap.get(activityId)!;
      activityData.playCount++;
      activityData.uniquePlayers.add(entry.userId);
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
        const dbActivity = activities.find(
          (a) =>
            a.id === activity.activityKey ||
            activity.activityKey.includes(a.id) ||
            activity.activityKey.toLowerCase().includes(a.title.toLowerCase())
        );

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

    filteredPointsData.forEach((entry) => {
      if (!studentMap.has(entry.userId)) {
        studentMap.set(entry.userId, {
          pointsEarned: 0,
          activitiesCompleted: 0,
        });
      }

      const studentData = studentMap.get(entry.userId)!;
      studentData.pointsEarned += entry.points;
      studentData.activitiesCompleted++;
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
    recentActivityData
      .filter((entry) => !entry.user.isSystemAccount)
      .forEach((entry) => {
        if (!lastActivityByStudent.has(entry.userId)) {
          lastActivityByStudent.set(entry.userId, {
            reason: entry.reason || "Activity",
            time: entry.createdAt,
          });
        }
      });

    const activeStudents: ActiveStudent[] = activeStudentsWithData.map(
      (student) => {
        const details = studentDetails.find((d) => d.id === student.userId);
        const lastActivity = lastActivityByStudent.get(student.userId);

        // Try to get a friendly activity name
        let lastActivityReason = lastActivity?.reason;
        if (lastActivityReason) {
          const dbActivity = activities.find(
            (a) =>
              lastActivityReason!.includes(a.id) ||
              lastActivityReason!.toLowerCase().includes(a.title.toLowerCase())
          );
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
      .filter((entry) => !entry.user.isSystemAccount)
      .map((entry) => {
        // Try to get a friendly activity name and type
        let activityName = entry.reason || "Activity";
        let activityType: string | undefined;

        const dbActivity = activities.find(
          (a) =>
            activityName.includes(a.id) ||
            activityName.toLowerCase().includes(a.title.toLowerCase())
        );

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
      totalPlays: filteredPointsData.length,
      totalActiveStudents: studentMap.size,
      totalPointsAwarded: filteredPointsData.reduce(
        (sum, entry) => sum + entry.points,
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
