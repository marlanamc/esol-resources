import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { requireTeacher, type SessionUser } from "@/lib/auth/api-auth";
import { canManageClass } from "@/lib/auth/policies";
import { apiError, handleApiError } from "@/lib/api/response";
import { parseReplyText, parseWeekNumber, QUESTION_SELECT, toTeacherQuestion } from "@/lib/learner/class-questions";

async function loadManagedClass(classId: string, user: SessionUser, admin: boolean) {
    const cls = await prisma.class.findUnique({ where: { id: classId }, select: { id: true, teacherId: true } });
    if (!cls || !canManageClass(user, admin, cls.teacherId)) return null;
    return cls;
}

/** One class's questions for one week, oldest first. */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const classId = request.nextUrl.searchParams.get("classId");
        const weekNumber = parseWeekNumber(request.nextUrl.searchParams.get("week"));
        if (!classId || weekNumber == null) return apiError("Class and week are required", 400);
        if (!(await loadManagedClass(classId, teacherCheck.user, teacherCheck.admin))) return apiError("Class not found", 404);

        const rows = await prisma.classQuestion.findMany({
            where: { classId, weekNumber },
            orderBy: { createdAt: "asc" },
            select: {
                ...QUESTION_SELECT,
                createdAt: true,
                student: { select: { name: true, username: true } },
            },
        });
        return NextResponse.json({ questions: rows.map(toTeacherQuestion) });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not load questions", path: request.url });
    }
}

/**
 * Marks questions answered (or not). Body: { classId, ids: string[], answered: boolean, reply?: string }.
 * A reply needs exactly one question and answered: true; un-answering also clears the reply.
 */
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const body = await request.json().catch(() => null);
        const classId = typeof body?.classId === "string" ? body.classId : null;
        const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string").slice(0, 200) : [];
        if (!classId || ids.length === 0 || typeof body?.answered !== "boolean") {
            return apiError("Class, questions and answered are required", 400);
        }
        const hasReply = body.reply !== undefined;
        if (hasReply && (ids.length !== 1 || !body.answered)) return apiError("Reply to one answered question at a time", 400);
        const parsedReply = parseReplyText(body.reply);
        if ("error" in parsedReply) return apiError(parsedReply.error, 400);
        if (!(await loadManagedClass(classId, teacherCheck.user, teacherCheck.admin))) return apiError("Class not found", 404);

        // Scoped to the class so a teacher can only mark their own class's questions.
        const result = await prisma.classQuestion.updateMany({
            where: { id: { in: ids }, classId },
            // Any new answer or reply resets answerSeenAt so the learner is told again.
            data: body.answered
                ? { answeredAt: new Date(), answerSeenAt: null, ...(hasReply ? { replyText: parsedReply.text } : {}) }
                : { answeredAt: null, answerSeenAt: null, replyText: null },
        });
        return NextResponse.json({ updated: result.count });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not update questions", path: request.url });
    }
}
