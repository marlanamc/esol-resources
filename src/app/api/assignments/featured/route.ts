import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCategoryData } from "@/lib/categoryData";
import { isTeacherAdmin } from "@/lib/roles";
import {
    buildActivitySubmissionMap,
    buildFeaturedAssignmentsWhere,
    deriveFeaturedAssignmentProgress,
    isWithinNewReleaseWindow,
} from "@/lib/featured-assignments";

export {
    buildActivitySubmissionMap,
    buildFeaturedAssignmentsWhere,
    deriveFeaturedAssignmentProgress,
    isWithinNewReleaseWindow,
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;

        // Get student's enrolled classes
        const enrollments: { classId: string }[] = await prisma.classEnrollment.findMany({
            where: { studentId: userId },
            select: { classId: true }
        });

        const classIds = enrollments.map((enrollment) => enrollment.classId);

        // Get featured assignments for those classes
        const featuredAssignments = classIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: buildFeaturedAssignmentsWhere(classIds),
            include: {
                activity: true,
                class: true,
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        completedAt: true,
                        score: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const activityIds = Array.from(new Set(featuredAssignments.map((a) => a.activityId)));
        const activityTitles = Array.from(new Set(featuredAssignments.map((a) => a.activity.title).filter(Boolean))) as string[];

        // Fetch all submissions for these activities to ensure we catch completion
        // even if it wasn't recorded under the exact assigned ID (e.g. canonical resolution shifted it).
        // For grammar guides, we check by both ID and Title for maximum robustness.
        const allActivitySubmissions = activityIds.length === 0 ? [] : await prisma.submission.findMany({
            where: {
                userId,
                status: { in: ["submitted", "graded"] },
                completedAt: { not: null },
                OR: [
                    { activityId: { in: activityIds } },
                    { activity: { title: { in: activityTitles } } }
                ]
            },
            select: {
                activityId: true,
                score: true,
                activity: {
                    select: { title: true }
                }
            }
        });

        const activitySubmissionMap = buildActivitySubmissionMap(allActivitySubmissions);

        const progressRows =
            activityIds.length === 0
                ? []
                : await prisma.activityProgress.findMany({
                    where: {
                        userId,
                        activityId: { in: activityIds },
                    },
                      select: { activityId: true, progress: true, status: true, categoryData: true, updatedAt: true },
                      orderBy: { updatedAt: "desc" },
                  });

        const progressMap = (progressRows as Array<{
            activityId: string;
            progress: number;
            status: string;
            categoryData: string | null;
        }>).reduce<Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>>(
            (map, row) => {
                if (map.has(row.activityId)) {
                    return map;
                }

                map.set(row.activityId, {
                    progress: row.progress,
                    status: row.status,
                    categoryData: parseCategoryData(row.categoryData),
                });
                return map;
            },
            new Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>()
        );

        const withProgress = featuredAssignments.map((a) => {
            const p = progressMap.get(a.activityId);
            const derived = deriveFeaturedAssignmentProgress({
                assignment: {
                    activityId: a.activityId,
                    createdAt: a.createdAt,
                    updatedAt: a.updatedAt,
                    activity: {
                        type: a.activity.type,
                        category: a.activity.category,
                        title: a.activity.title,
                    },
                },
                progress: p,
                activitySubmissionMap,
            });

            return {
                ...a,
                ...derived,
            };
        });

        return NextResponse.json(withProgress);
    } catch (error: unknown) {
        console.error("Error fetching featured assignments:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to fetch featured assignments" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const userId = session.user?.id;
        const admin = isTeacherAdmin(session.user);

        // Get all classes owned by the teacher (or all classes for admin).
        const teacherClasses = await prisma.class.findMany({
            where: admin ? {} : { teacherId: userId },
            select: { id: true }
        });

        const classIds = teacherClasses.map((c) => c.id);

        // Unfeatured all assignments in teacher's classes
        const result = await prisma.assignment.updateMany({
            where: {
                classId: { in: classIds },
                isFeatured: true
            },
            data: {
                isFeatured: false
            }
        });

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `Cleared ${result.count} featured assignment${result.count === 1 ? '' : 's'}`
        });
    } catch (error: unknown) {
        console.error("Error clearing featured assignments:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to clear featured assignments" },
            { status: 500 }
        );
    }
}
