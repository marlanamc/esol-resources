import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";
import { isPracticeGoalDays, PRACTICE_GOAL_OPTIONS } from "@/lib/learner/study-log";

/** Sets the learner's practice goal (days a week). Never touches points. */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const body = await request.json().catch(() => null);
        if (!isPracticeGoalDays(body?.days)) {
            return apiError(`Pick ${PRACTICE_GOAL_OPTIONS.join(", ")} days.`, 400);
        }
        await prisma.user.update({ where: { id: session.user.id }, data: { practiceGoalDays: body.days } });
        return NextResponse.json({ goalDays: body.days });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not save your goal", path: request.url });
    }
}
