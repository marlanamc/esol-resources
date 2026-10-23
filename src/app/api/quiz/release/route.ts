import { readWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { ApiErrors, apiError } from "@/lib/api/response";
import { invalidateGrammarGuideActivityCache } from "@/lib/grammar-guide-activity";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    if (!canUseTeacherTools(session.user)) {
        return ApiErrors.forbidden("Only teachers can release quizzes");
    }

    const { activityId, released } = await request.json();

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

    if (readWeeklyQuizSchedule(activity.content)) {
        return apiError("Weekly quizzes open automatically Thursday at 6 p.m. Eastern and stay open. Their release is managed by the course schedule.", 409);
    }

    await prisma.activity.update({
        where: { id: activityId },
        data: { isReleased: released },
        select: { id: true },
    });

    // The route doesn't verify the activity type, so a guide row could be
    // toggled here too — keep the guide lookup cache honest.
    invalidateGrammarGuideActivityCache();

    // Quiz reminders live with the activities; releasing a quiz does not add calendar clutter.

    return NextResponse.json({
        ok: true,
        released,
        message: released ? "Quiz released to students" : "Quiz hidden from students"
    });
}
