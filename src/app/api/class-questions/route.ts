import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { apiError, handleApiError } from "@/lib/api/response";
import {
    MAX_QUESTIONS_PER_WEEK,
    parseQuestionText,
    parseWeekNumber,
    QUESTION_SELECT,
    toStudentQuestion,
} from "@/lib/learner/class-questions";

/** The class a learner's questions go to: their earliest active enrollment. */
async function findQuestionClassId(studentId: string): Promise<string | null> {
    const enrollment = await prisma.classEnrollment.findFirst({
        where: { studentId, status: "active" },
        orderBy: { joinedAt: "asc" },
        select: { classId: true },
    });
    return enrollment?.classId ?? null;
}

/** The learner's own questions for one week. */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);

        const weekNumber = parseWeekNumber(request.nextUrl.searchParams.get("week"));
        if (weekNumber == null) return apiError("Week is required", 400);

        const rows = await prisma.classQuestion.findMany({
            where: { studentId: session.user.id, weekNumber },
            orderBy: { createdAt: "asc" },
            select: QUESTION_SELECT,
        });
        return NextResponse.json({ questions: rows.map(toStudentQuestion) });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not load questions", path: request.url });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError("Unauthorized", 401);
        if (session.user.role !== "student") return apiError("Forbidden", 403);
        const studentId = session.user.id;

        const body = await request.json().catch(() => null);
        const weekNumber = parseWeekNumber(body?.weekNumber);
        if (weekNumber == null) return apiError("Week is required", 400);
        const parsed = parseQuestionText(body?.text);
        if ("error" in parsed) return apiError(parsed.error, 400);

        const classId = await findQuestionClassId(studentId);
        if (!classId) return apiError("Join a class to send questions.", 403);

        const count = await prisma.classQuestion.count({ where: { studentId, weekNumber } });
        if (count >= MAX_QUESTIONS_PER_WEEK) {
            return apiError(`You can send ${MAX_QUESTIONS_PER_WEEK} questions a week. Bring the rest to class!`, 429);
        }

        const row = await prisma.classQuestion.create({
            data: { studentId, classId, weekNumber, text: parsed.text, anonymous: body?.anonymous === true },
            select: QUESTION_SELECT,
        });
        return NextResponse.json({ question: toStudentQuestion(row) }, { status: 201 });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not send question", path: request.url });
    }
}
