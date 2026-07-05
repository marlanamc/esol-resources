import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { ApiErrors, apiError } from "@/lib/api/response";
import { logger } from "@/lib/shared/logger";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    if (!canUseTeacherTools(session.user)) {
        return ApiErrors.forbidden("Only teachers can release quizzes");
    }

    const { activityId, released } = await request.json();
    const userId = session.user.id;
    const admin = isAdmin(session.user);

    if (!activityId || typeof activityId !== "string") {
        return apiError("activityId is required", 400);
    }

    // Update the activity's content to include released status
    const activity = await prisma.activity.findFirst({
        where: {
            id: activityId,
            deletedAt: null,
        },
        select: { content: true, title: true }
    });

    if (!activity) {
        return ApiErrors.notFound("Activity", activityId);
    }

    await prisma.activity.update({
        where: { id: activityId },
        data: { isReleased: released },
        select: { id: true },
    });

    // If this is a verb quiz being released, create calendar events for all classes
    const content = JSON.parse(activity.content);
    if (released && content.type === 'verb-quiz' && content.due_date) {
        try {
            // Get all classes for this teacher
            const classes = await prisma.class.findMany({
                where: admin ? {} : { teacherId: userId },
                select: { id: true }
            });

            // Parse the due date (format: YYYY-MM-DD)
            const parseDateOnly = (dateStr: string) => {
                const [y, m, d] = dateStr.split("-").map(Number);
                return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
            };

            const dueDate = parseDateOnly(content.due_date);

            // Create calendar events for classes that don't already have one
            const existingEvents = await prisma.calendarEvent.findMany({
                where: {
                    classId: { in: classes.map((c) => c.id) },
                    title: activity.title,
                    type: 'quiz',
                    date: dueDate
                },
                select: { classId: true }
            });
            const classIdsWithEvent = new Set(existingEvents.map((e) => e.classId));
            const missingClassIds = classes
                .map((c) => c.id)
                .filter((id) => !classIdsWithEvent.has(id));

            if (missingClassIds.length > 0) {
                await prisma.calendarEvent.createMany({
                    data: missingClassIds.map((classId) => ({
                        classId,
                        title: activity.title,
                        description: `Verb quiz due date`,
                        date: dueDate,
                        type: 'quiz',
                        createdById: userId
                    }))
                });
            }
        } catch (error) {
            logger.error('Error creating calendar events for verb quiz', error);
            // Don't fail the request if calendar event creation fails
        }
    }

    return NextResponse.json({
        ok: true,
        released,
        message: released ? "Quiz released to students" : "Quiz hidden from students"
    });
}
