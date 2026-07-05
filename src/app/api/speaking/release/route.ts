import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { ApiErrors, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const userRole = session.user?.role;
    if (userRole !== 'teacher') {
        return ApiErrors.forbidden("Only teachers can release speaking activities");
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
        select: { content: true }
    });

    if (!activity) {
        return ApiErrors.notFound("Activity", activityId);
    }

    await prisma.activity.update({
        where: { id: activityId },
        data: { isReleased: released },
        select: { id: true },
    });

    return NextResponse.json({
        ok: true,
        released,
        message: released ? "Speaking activity released to students" : "Speaking activity hidden from students"
    });
}
