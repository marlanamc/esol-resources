import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { parseCategoryData } from "@/lib/categoryData";
import { isAdmin } from "@/lib/auth/roles";
import { ApiErrors } from "@/lib/api/response";
import { requireTeacher } from "@/lib/auth/api-auth";
import { logger } from "@/lib/shared/logger";
import { expandClassIdsToSectionGroupIds } from "@/lib/section-group-classes";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import {
    buildActivitySubmissionMap,
    buildFeaturedAssignmentsWhere,
    buildGlobalFeaturedActivitiesWhere,
    deriveFeaturedAssignmentProgress,
    isWithinNewReleaseWindow,
    mergeFeaturedEntries,
} from "@/lib/featured-assignments";
import { buildIndependentFeaturedAssignment } from "@/lib/independent-learning";

export {
    buildActivitySubmissionMap,
    buildFeaturedAssignmentsWhere,
    buildGlobalFeaturedActivitiesWhere,
    deriveFeaturedAssignmentProgress,
    isWithinNewReleaseWindow,
    mergeFeaturedEntries,
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ApiErrors.unauthorized();
        }

        const userId = session.user?.id;
    
        // Get student's enrolled classes
        const enrollments: { classId: string }[] = await prisma.classEnrollment.findMany({
            where: { studentId: userId, status: "active" },
            select: { classId: true }
        });

        const classIds = enrollments.map((enrollment) => enrollment.classId);
        const featuredClassIds = await expandClassIdsToSectionGroupIds(prisma, classIds);

        // Get featured assignments for those classes
        const featuredAssignments = featuredClassIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: buildFeaturedAssignmentsWhere(featuredClassIds),
            include: {
                activity: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        ui: true,
                        isReleased: true,
                                        content: true,
                    },
                },
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
        const visibleFeaturedAssignments = featuredAssignments.filter((assignment) =>
            isLearnerVisibleActivity(assignment.activity)
        );

        // Activities featured for everyone in /admin/content. Classroom students
        // see these alongside anything featured for their class.
        const globalFeaturedActivities = await prisma.activity.findMany({
            where: buildGlobalFeaturedActivitiesWhere(),
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                category: true,
                isReleased: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const visibleGlobalFeatured = globalFeaturedActivities.filter((activity) =>
            isLearnerVisibleActivity(activity)
        );

        const activityIds = Array.from(new Set([
            ...visibleFeaturedAssignments.map((a) => a.activityId),
            ...visibleGlobalFeatured.map((a) => a.id),
        ]));
        const activityTitles = Array.from(new Set([
            ...visibleFeaturedAssignments.map((a) => a.activity.title),
            ...visibleGlobalFeatured.map((a) => a.title),
        ].filter(Boolean))) as string[];

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
                completedAt: true,
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

        const withProgress = visibleFeaturedAssignments.map((a) => {
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

        // Deduplicate by activityId: section-group expansion can return same activity from multiple classes.
        // Prefer assignments from the student's enrolled classes so activity links work (access check requires enrollment).
        const enrolledClassIds = new Set(classIds);
        const deduped = Array.from(
            withProgress
                .reduce<Map<string, (typeof withProgress)[number]>>((map, a) => {
                    const existing = map.get(a.activityId);
                    const aEnrolled = enrolledClassIds.has(a.classId);
                    const existingEnrolled = existing ? enrolledClassIds.has(existing.classId) : false;
                    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
                    const existingTime = existing ? new Date(existing.updatedAt ?? existing.createdAt).getTime() : -1;
                    const keepNew = !existing || (aEnrolled && !existingEnrolled) || (aEnrolled === existingEnrolled && aTime > existingTime);
                    if (keepNew) map.set(a.activityId, a);
                    return map;
                }, new Map())
                .values()
        );

        // Build the global cards with the same shape the independent dashboard
        // uses, then union them in. Class-featured wins on the same activity —
        // it carries the assignmentId that links and submissions depend on.
        const submissionsByActivityId = new Map<
            string,
            Array<{ activityId: string; score: number | null; completedAt: Date | null }>
        >();
        for (const submission of allActivitySubmissions) {
            const list = submissionsByActivityId.get(submission.activityId) ?? [];
            list.push({
                activityId: submission.activityId,
                score: submission.score,
                completedAt: submission.completedAt,
            });
            submissionsByActivityId.set(submission.activityId, list);
        }

        const globalCards = visibleGlobalFeatured.map((activity) => {
            const p = progressMap.get(activity.id);
            return buildIndependentFeaturedAssignment({
                activity,
                progress: p
                    ? {
                          activityId: activity.id,
                          progress: p.progress,
                          status: p.status,
                          // progressMap already parsed this; the builder only
                          // passes it straight through to the card.
                          categoryData: null,
                      }
                    : undefined,
                submissions: submissionsByActivityId.get(activity.id) ?? [],
            });
        });

        // Restore the parsed categoryData the builder could not receive.
        const globalCardsWithProgress = globalCards.map((card) => ({
            ...card,
            categoryData: progressMap.get(card.activityId)?.categoryData ?? null,
        }));

        const merged = mergeFeaturedEntries<{ activityId: string }>(
            deduped,
            globalCardsWithProgress
        ) as Array<(typeof deduped)[number] | (typeof globalCardsWithProgress)[number]>;

        return NextResponse.json(merged);
    } catch (error: unknown) {
        logger.error("Error fetching featured assignments", error);
        return ApiErrors.internal("Failed to fetch featured assignments");
    }
}

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const userId = teacherCheck.user.id;
        const admin = isAdmin(teacherCheck.user);

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
        logger.error("Error clearing featured assignments", error);
        return ApiErrors.internal("Failed to clear featured assignments");
    }
}
