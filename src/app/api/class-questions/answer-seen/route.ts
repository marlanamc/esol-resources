import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";

/** The learner saw the teacher's answer to one of their questions. Body: { questionId }. */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const body = await request.json().catch(() => null);
        if (typeof body?.questionId !== "string") return apiError("Question is required", 400);

        // Scoped to the learner's own answered questions; repeats are no-ops.
        const result = await prisma.classQuestion.updateMany({
            where: { id: body.questionId, studentId: session.user.id, answeredAt: { not: null }, answerSeenAt: null },
            data: { answerSeenAt: new Date() },
        });
        return NextResponse.json({ ok: true, updated: result.count });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not save", path: request.url });
    }
}
