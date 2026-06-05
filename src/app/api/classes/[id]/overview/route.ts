import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { canManageClass } from "@/lib/policies";
import { requireTeacher } from "@/lib/api-auth";
import { ApiErrors, handleApiError } from "@/lib/api-response";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ISO Monday of the current week (UTC)
function getWeekStart(): Date {
    const now = new Date();
    const day = now.getUTCDay(); // 0=Sun, 1=Mon, ...
    const daysFromMonday = day === 0 ? 6 : day - 1;
    const start = new Date(now);
    start.setUTCDate(now.getUTCDate() - daysFromMonday);
    start.setUTCHours(0, 0, 0, 0);
    return start;
}

const NEEDS_ATTENTION_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId } = await params;

        // Load class + enrollments + student profile fields
        const cls = await withPrismaReadRetry(() =>
            prisma.class.findUnique({
                where: { id: classId },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    teacherId: true,
                    enrollments: {
                        orderBy: { joinedAt: "asc" },
                        select: {
                            id: true,
                            status: true,
                            joinedAt: true,
                            student: {
                                select: {
                                    id: true,
                                    username: true,
                                    name: true,
                                    currentStreak: true,
                                    lastActivityDate: true,
                                    isSystemAccount: true,
                                    preferences: {
                                        select: { weeklyActivityGoal: true },
                                    },
                                },
                            },
                        },
                    },
                    classReveals: {
                        select: {
                            weekId: true,
                            revealedAt: true,
                            week: { select: { id: true, number: true, title: true } },
                        },
                        orderBy: { week: { number: "desc" } },
                    },
                },
            })
        );

        if (!cls) return ApiErrors.notFound("Class", classId);
        if (!canManageClass(user, admin, cls.teacherId)) return ApiErrors.forbidden();

        const studentIds = cls.enrollments.map((e) => e.student.id);
        const weekStart = getWeekStart();

        // Weekly completions (this ISO week) + all-time completed (for weekPosition)
        const [weeklyProgress, allCompleted, activityWeekMap] = await Promise.all([
            // Activities completed this week
            withPrismaReadRetry(() =>
                prisma.activityProgress.findMany({
                    where: {
                        userId: { in: studentIds },
                        updatedAt: { gte: weekStart },
                        OR: [{ progress: { gte: 100 } }, { status: "completed" }],
                    },
                    select: { userId: true, activityId: true },
                })
            ),
            // All-time completed activities per student
            withPrismaReadRetry(() =>
                prisma.activityProgress.findMany({
                    where: {
                        userId: { in: studentIds },
                        OR: [{ progress: { gte: 100 } }, { status: "completed" }],
                    },
                    select: { userId: true, activityId: true },
                })
            ),
            // Course map: activityId → week number
            withPrismaReadRetry(() =>
                prisma.courseMapItem.findMany({
                    where: { activityId: { not: null } },
                    select: {
                        activityId: true,
                        week: { select: { number: true } },
                    },
                })
            ),
        ]);

        // Build activityId → highest week number map
        const activityToWeekNum = new Map<string, number>();
        for (const item of activityWeekMap) {
            if (item.activityId) {
                activityToWeekNum.set(item.activityId, item.week.number);
            }
        }

        // Weekly completions: dedupe by userId+activityId, count per student
        const weeklyByStudent = new Map<string, Set<string>>();
        for (const row of weeklyProgress) {
            let set = weeklyByStudent.get(row.userId);
            if (!set) { set = new Set(); weeklyByStudent.set(row.userId, set); }
            set.add(row.activityId);
        }

        // Week position: highest course-map week number each student has completed
        const weekPositionByStudent = new Map<string, number>();
        for (const row of allCompleted) {
            const weekNum = activityToWeekNum.get(row.activityId);
            if (weekNum !== undefined) {
                const current = weekPositionByStudent.get(row.userId) ?? 0;
                if (weekNum > current) weekPositionByStudent.set(row.userId, weekNum);
            }
        }

        const now = Date.now();

        const roster = cls.enrollments.map((enrollment) => {
            const s = enrollment.student;
            const weeklyDone = weeklyByStudent.get(s.id)?.size ?? 0;
            const goal = s.preferences?.weeklyActivityGoal ?? 3;
            const lastActive = s.lastActivityDate;
            const isActive = enrollment.status === "active";

            return {
                userId: s.id,
                username: s.username,
                displayName: s.name ?? null,
                isSystemAccount: s.isSystemAccount,
                enrollmentStatus: enrollment.status as "active" | "inactive" | "graduated",
                enrolledAt: enrollment.joinedAt.toISOString(),
                streak: s.currentStreak,
                lastActivityDate: lastActive?.toISOString() ?? null,
                weeklyProgress: {
                    completed: weeklyDone,
                    goal,
                    percentage: goal > 0 ? Math.min(100, Math.round((weeklyDone / goal) * 100)) : 0,
                },
                weekPosition: weekPositionByStudent.get(s.id) ?? null,
                needsAttention:
                    isActive && (!lastActive || now - lastActive.getTime() > NEEDS_ATTENTION_MS),
            };
        });

        const currentReveal = cls.classReveals[0] ?? null;

        return NextResponse.json({
            classId: cls.id,
            className: cls.name,
            joinCode: cls.code,
            teacherId: cls.teacherId,
            currentRevealedWeek: currentReveal
                ? {
                      weekId: currentReveal.week.id,
                      weekNumber: currentReveal.week.number,
                      weekTitle: currentReveal.week.title,
                      revealedAt: currentReveal.revealedAt.toISOString(),
                  }
                : null,
            roster,
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to load class overview" });
    }
}
