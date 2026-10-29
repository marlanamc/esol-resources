import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";

/** The learner read their teacher's reply on one of their logs. Body: { logId }. */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const body = await request.json().catch(() => null);
        if (typeof body?.logId !== "string") return apiError("Log is required", 400);

        // Scoped to the learner's own logs that have a reply; repeats are no-ops.
        const result = await prisma.studyLog.updateMany({
            where: { id: body.logId, userId: session.user.id, replyKind: { not: null }, replySeenAt: null },
            data: { replySeenAt: new Date() },
        });
        return NextResponse.json({ ok: true, updated: result.count });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not save", path: request.url });
    }
}
