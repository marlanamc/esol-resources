import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { isAdmin, canUseTeacherTools } from "@/lib/roles";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import TeacherReportCard from "@/components/dashboard/TeacherReportCard";
import { StudentEngagementTable } from "@/components/dashboard/StudentEngagementTable";

export const metadata = { title: "Reports | Class Companion" };

export default async function TeachReportsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const userId = session.user.id;
    const admin = isAdmin(session.user);
    const userRole = session.user.role || "teacher";

    const classes = await timedQuery(
        { route: "/teach/reports", queryLabel: "class.findMany.teacherReports", userRole },
        () => withPrismaReadRetry(() =>
            prisma.class.findMany({
                where: admin ? {} : { teacherId: userId },
                select: {
                    id: true,
                    name: true,
                    enrollments: {
                        where: { status: "active", student: { isSystemAccount: false, excludeFromLeaderboard: false } },
                        select: {
                            student: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    points: true,
                                    weeklyPoints: true,
                                    currentStreak: true,
                                    longestStreak: true,
                                    lastActivityDate: true,
                                },
                            },
                        },
                    },
                    assignments: {
                        select: { id: true },
                    },
                },
                orderBy: { name: "asc" },
            })
        ),
        (r) => r.length
    );

    const formattedClasses = classes.map((cls) => ({
        id: cls.id,
        name: cls.name,
        studentCount: cls.enrollments.length,
    }));

    // Build enriched student list for engagement table
    const studentSectionsMap = new Map<string, Map<string, string>>();
    for (const cls of classes) {
        for (const enrollment of cls.enrollments) {
            const studentId = enrollment.student.id;
            if (!studentSectionsMap.has(studentId)) {
                studentSectionsMap.set(studentId, new Map<string, string>());
            }
            studentSectionsMap.get(studentId)?.set(cls.id, cls.name);
        }
    }

    const allStudents = Array.from(
        new Map(
            classes.flatMap((c) => c.enrollments.map((e) => [e.student.id, e.student]))
        ).values()
    );
    const studentIds = allStudents.map((s) => s.id);

    const [recentActivity, recentProgressUpdate, activitiesToday] = studentIds.length
        ? await Promise.all([
              withPrismaReadRetry(() =>
                  prisma.pointsLedger.groupBy({
                      by: ["userId"],
                      where: { userId: { in: studentIds } },
                      _max: { createdAt: true },
                  })
              ),
              withPrismaReadRetry(() =>
                  prisma.activityProgress.groupBy({
                      by: ["userId"],
                      where: { userId: { in: studentIds } },
                      _max: { updatedAt: true },
                  })
              ),
              withPrismaReadRetry(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return prisma.pointsLedger.groupBy({
                      by: ["userId"],
                      where: { userId: { in: studentIds }, createdAt: { gte: today } },
                      _count: true,
                  });
              }),
          ])
        : [[], [], []];

    const lastActiveMap = recentActivity.reduce((acc, e) => {
        acc[e.userId] = e._max.createdAt;
        return acc;
    }, {} as Record<string, Date | null>);

    const lastProgressMap = recentProgressUpdate.reduce((acc, e) => {
        acc[e.userId] = e._max.updatedAt;
        return acc;
    }, {} as Record<string, Date | null>);

    const activitiesTodayMap = activitiesToday.reduce((acc, e) => {
        acc[e.userId] = e._count;
        return acc;
    }, {} as Record<string, number>);

    const enrichedStudents = allStudents.map((student) => ({
        ...student,
        currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
        lastActive:
            [lastActiveMap[student.id], lastProgressMap[student.id], student.lastActivityDate]
                .filter((d): d is Date => d instanceof Date)
                .sort((a, b) => b.getTime() - a.getTime())[0] || null,
        activitiesToday: activitiesTodayMap[student.id] || 0,
        sections: Array.from(studentSectionsMap.get(student.id)?.entries() || []).map(([id, name]) => ({
            id,
            name,
        })),
    }));

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Analytics
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Activity Reports
                </h1>
                <p className="text-text-muted text-sm mt-1">
                    Track student engagement and popular activities across your classes
                </p>
            </div>

            <TeacherReportCard
                classes={formattedClasses}
            />

            {enrichedStudents.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                        Student Engagement
                    </h2>
                    <StudentEngagementTable students={enrichedStudents} />
                </section>
            )}
        </div>
    );
}
