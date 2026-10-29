import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";
import { parseQuestionText, QUESTION_SELECT, toStudentQuestion } from "@/lib/learner/class-questions";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/** A learner's own question they can still change: not yet answered in class. */
async function editableError(id: string, studentId: string) {
    const row = await prisma.classQuestion.findFirst({ where: { id, studentId }, select: { id: true, answeredAt: true } });
    if (!row) return apiError("Question not found", 404);
    if (row.answeredAt) return apiError("This question was already answered.", 409);
    return null;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const { id } = await params;
        const blocked = await editableError(id, session.user.id);
        if (blocked) return blocked;

        const body = await request.json().catch(() => null);
        const parsed = parseQuestionText(body?.text);
        if ("error" in parsed) return apiError(parsed.error, 400);

        const row = await prisma.classQuestion.update({
            where: { id },
            data: { text: parsed.text, ...(typeof body?.anonymous === "boolean" ? { anonymous: body.anonymous } : {}) },
            select: QUESTION_SELECT,
        });
        return NextResponse.json({ question: toStudentQuestion(row) });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not update question", path: request.url });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const { id } = await params;
        const blocked = await editableError(id, session.user.id);
        if (blocked) return blocked;

        await prisma.classQuestion.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not delete question", path: request.url });
    }
}
