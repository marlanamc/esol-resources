import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { requireTeacher } from "@/lib/auth/api-auth";
import { apiError, handleApiError } from "@/lib/api/response";
import { parseStudyLogRecast, STUDY_LOG_ENTRY_SELECT, toStudyLogEntry } from "@/lib/learner/study-log";

/**
 * A teacher's reply to one practice log. Body: { logId, kind: "recast" | "praise" | "clear", text? }.
 * A recast is the learner's sentence rewritten correctly. Replies never change points.
 * Changing a reply marks it unread again.
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const body = await request.json().catch(() => null);
        const logId = typeof body?.logId === "string" ? body.logId : null;
        const kind = body?.kind;
        if (!logId) return apiError("Log is required", 400);
        if (kind !== "recast" && kind !== "praise" && kind !== "clear") return apiError("Unknown reply", 400);

        const log = await prisma.studyLog.findUnique({ where: { id: logId }, select: { userId: true, text: true } });
        if (!log) return apiError("Log not found", 404);
        // Only a teacher of one of the student's active classes (or an admin) can reply.
        if (!teacherCheck.admin) {
            const enrollment = await prisma.classEnrollment.findFirst({
                where: { studentId: log.userId, status: "active", class: { teacherId: teacherCheck.user.id } },
                select: { id: true },
            });
            if (!enrollment) return apiError("Log not found", 404);
        }

        let data;
        if (kind === "clear") {
            data = { replyKind: null, replyText: null, repliedById: null, repliedAt: null, replySeenAt: null };
        } else {
            let replyText: string | null = null;
            if (kind === "recast") {
                const parsed = parseStudyLogRecast(body?.text, log.text);
                if ("error" in parsed) return apiError(parsed.error, 400);
                replyText = parsed.text;
            }
            data = { replyKind: kind, replyText, repliedById: teacherCheck.user.id, repliedAt: new Date(), replySeenAt: null };
        }

        const updated = await prisma.studyLog.update({ where: { id: logId }, data, select: STUDY_LOG_ENTRY_SELECT });
        return NextResponse.json({ entry: toStudyLogEntry(updated) });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not save your reply", path: request.url });
    }
}
