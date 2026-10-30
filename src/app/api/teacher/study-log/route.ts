import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { requireTeacher } from "@/lib/auth/api-auth";
import { canManageClass } from "@/lib/auth/policies";
import { apiError, handleApiError } from "@/lib/api/response";
import { addDaysToDayKey, getCalendarWeekStartDayKey } from "@/lib/gamification/calendar-week";
import {
    buildTeacherStudyRows,
    getWeekStartForDayKey,
    parseDayKey,
    parseWeekStartDayKey,
    STUDY_LOG_ENTRY_SELECT,
} from "@/lib/learner/study-log";

/**
 * One class's practice logs for a Mon–Sun week. Query: classId, week (Monday YYYY-MM-DD, default this week).
 * With day (YYYY-MM-DD) instead, only that day's logs, and only students who logged that day.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const classId = request.nextUrl.searchParams.get("classId");
        if (!classId) return apiError("Class is required", 400);
        const cls = await prisma.class.findUnique({ where: { id: classId }, select: { teacherId: true } });
        if (!cls || !canManageClass(teacherCheck.user, teacherCheck.admin, cls.teacherId)) return apiError("Class not found", 404);

        const dayParam = request.nextUrl.searchParams.get("day");
        const day = parseDayKey(dayParam);
        if (dayParam != null && !day) return apiError("Day must be YYYY-MM-DD", 400);
        const weekStart = day ? getWeekStartForDayKey(day) : parseWeekStartDayKey(request.nextUrl.searchParams.get("week"));
        const weekEnd = addDaysToDayKey(weekStart, 6);

        // Same population as the participation list: active, real students.
        const enrollments = await prisma.classEnrollment.findMany({
            where: { classId, status: "active", student: { isSystemAccount: false } },
            select: { student: { select: { id: true, name: true, username: true, practiceGoalDays: true } } },
        });
        const students = enrollments.map((enrollment) => enrollment.student);
        const logs = students.length
            ? await prisma.studyLog.findMany({
                  where: { userId: { in: students.map((s) => s.id) }, dayKey: day ?? { gte: weekStart, lte: weekEnd } },
                  select: { ...STUDY_LOG_ENTRY_SELECT, userId: true },
              })
            : [];

        const rows = buildTeacherStudyRows(students, logs, weekStart);
        return NextResponse.json({
            weekStart,
            isCurrentWeek: weekStart === getCalendarWeekStartDayKey(),
            rows: day ? rows.filter((row) => row.entries.length > 0) : rows,
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Could not load practice logs", path: request.url });
    }
}
