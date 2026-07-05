import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const userRole = session.user.role;
    if (userRole !== 'teacher') {
        return ApiErrors.forbidden("Only teachers can release grammar guides");
    }

    try {
        const { activityId, released } = await request.json();

        if (!activityId || typeof activityId !== "string") {
            return apiError("activityId is required", 400);
        }

        if (typeof released !== "boolean") {
            return apiError("released must be a boolean", 400);
        }

        // Verify it's a grammar guide
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
            select: { type: true, category: true, title: true }
        });

        if (!activity) {
            return ApiErrors.notFound("Activity", activityId);
        }

        if (activity.type !== 'guide' || activity.category !== 'grammar') {
            return apiError("Only grammar guides can be released/hidden", 400);
        }

        // Update release status
        await prisma.activity.update({
            where: { id: activityId },
            data: { isReleased: released }
        });

        return NextResponse.json({
            ok: true,
            released,
            message: released
                ? `"${activity.title}" is now visible to students`
                : `"${activity.title}" is now hidden from students`
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to update grammar guide release status",
        });
    }
}
