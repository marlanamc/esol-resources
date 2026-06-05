import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { ensureTeacher } from "@/lib/policies";
import { filterLearnerVisibleActivities } from "@/lib/learner-visibility";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { timedQuery } from "@/lib/perf-log";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return ApiErrors.unauthorized();
        }
        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return apiError(teacherCheck.error, teacherCheck.status);
        }

        const body = await request.json();
        const { title, description, type, category, level, content } = body;

        if (!title || !type || !content) {
            return apiError("Title, type, and content are required", 400);
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
                createdBy: session.user.id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                category: true,
                level: true,
                content: true,
                ui: true,
                isReleased: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(activity);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to create activity",
            path: request.url,
        });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return ApiErrors.unauthorized();
        }

            const userRole = session.user?.role;

        if (userRole === "student") {
            const studentActivities = await timedQuery(
                {
                    route: "/api/activities",
                    queryLabel: "activity.findMany.student",
                    userRole,
                },
                () =>
                    prisma.activity.findMany({
                        where: {
                            deletedAt: null,
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            type: true,
                            category: true,
                            level: true,
                            ui: true,
                            isReleased: true,
                                                content: true,
                        },
                        orderBy: { createdAt: "desc" },
                    }),
                (result) => result.length
            );

            const visibleActivities = collapseEdPronunciationActivities(
                filterLearnerVisibleActivities(studentActivities)
            )
                .map((activity) => ({
                    id: activity.id,
                    title: activity.title,
                    description: activity.description,
                    type: activity.type,
                    category: activity.category,
                    level: activity.level,
                    ui: activity.ui,
                    isReleased: activity.isReleased,
                    isVisible: true,
                }));

            logger.info("api.activities.student.payload", {
                route: "/api/activities",
                role: userRole,
                payloadBytes: JSON.stringify(visibleActivities).length,
                activityCount: visibleActivities.length,
            });
            return NextResponse.json(visibleActivities);
        }

        const teacherCheck = ensureTeacher(session.user);
        if (!teacherCheck.ok) {
            return apiError(teacherCheck.error, teacherCheck.status);
        }
        const admin = teacherCheck.admin;

        // Teachers see their own activities. Admin sees all activities.
        const activities = await timedQuery(
            {
                route: "/api/activities",
                queryLabel: "activity.findMany.teacherAdmin",
                userRole,
            },
            () =>
                prisma.activity.findMany({
                    where: admin
                        ? { deletedAt: null }
                        : { deletedAt: null, createdBy: session.user.id },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        level: true,
                        ui: true,
                        isReleased: true,
                                    },
                    orderBy: { createdAt: "desc" },
                }),
            (result) => result.length
        );

        const response = collapseEdPronunciationActivities(activities).map((activity) => ({ ...activity, isVisible: true }));
        logger.info("api.activities.teacher.payload", {
            route: "/api/activities",
            role: userRole,
            payloadBytes: JSON.stringify(response).length,
            activityCount: response.length,
            admin,
        });
        return NextResponse.json(response);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to fetch activities",
        });
    }
}
