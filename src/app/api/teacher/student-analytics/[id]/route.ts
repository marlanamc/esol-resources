import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { canUseTeacherTools, isAdmin } from '@/lib/auth/roles';
import { ApiErrors } from '@/lib/api/response';
import { CLASS_TIME_ZONE } from '@/data/school-calendar-2026-27';
import {
    buildRequiredQuizzes,
    buildStudentEvaluation,
    type StudentEvaluation,
} from '@/lib/teacher-student-evaluation';
const activitySelect = { id: true, title: true, type: true, category: true } as const;
export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return ApiErrors.unauthorized();
    if (!canUseTeacherTools(session.user)) return ApiErrors.forbidden();
    const { id: studentId } = await params;
    const now = new Date();
    const classId = new URL(request.url).searchParams.get('classId');
    const enrollments = await prisma.classEnrollment.findMany({
        where: {
            studentId,
            status: 'active',
            student: { role: 'student', isSystemAccount: false },
            ...(isAdmin(session.user) ? {} : { class: { teacherId: session.user.id } }),
        },
        select: {
            classId: true,
            joinedAt: true,
            class: { select: { id: true, name: true, createdAt: true } },
        },
        orderBy: { class: { createdAt: 'desc' } },
    });
    const enrollment = classId ? enrollments.find((e) => e.classId === classId) : enrollments[0];
    if (!enrollment) return ApiErrors.notFound('Active class enrollment');
    const since = new Date(
        Math.max(enrollment.joinedAt.getTime(), enrollment.class.createdAt.getTime()),
    );
    const [student, assignments, reveals, schedules] = await Promise.all([
        prisma.user.findUnique({
            where: { id: studentId },
            select: { id: true, name: true, username: true, points: true },
        }),
        prisma.assignment.findMany({
            where: { classId: enrollment.classId },
            select: { id: true, activityId: true },
        }),
        prisma.classReveal.findMany({
            where: { classId: enrollment.classId },
            select: { weekId: true },
        }),
        prisma.classWeekSchedule.findMany({
            where: { classId: enrollment.classId, revealAt: { lte: now } },
            select: { weekId: true },
        }),
    ]);
    if (!student) return ApiErrors.notFound('Student');
    const weekIds = [...new Set([...reveals, ...schedules].map((w) => w.weekId))];
    const assignmentIds = assignments.map((a) => a.id);
    const ownership = { OR: [{ assignmentId: null }, { assignmentId: { in: assignmentIds } }] };
    const dateRange = { gte: since, lte: now };
    const [activities, progress, submissions, responses, ledger] = await Promise.all([
        prisma.activity.findMany({
            where: {
                type: 'quiz',
                deletedAt: null,
                OR: [
                    { courseMapItems: { some: { weekId: { in: weekIds } } } },
                    { id: { in: assignments.map((a) => a.activityId) } },
                ],
            },
            select: { ...activitySelect, content: true, deletedAt: true },
        }),
        prisma.activityProgress.findMany({
            where: { userId: studentId, updatedAt: dateRange, ...ownership },
            select: {
                activityId: true,
                assignmentId: true,
                progress: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                categoryData: true,
                activity: { select: activitySelect },
            },
            orderBy: { updatedAt: 'desc' },
        }),
        prisma.submission.findMany({
            where: { userId: studentId, updatedAt: dateRange, ...ownership },
            select: {
                activityId: true,
                assignmentId: true,
                score: true,
                status: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                completedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
        }),
        prisma.quizResponse.findMany({
            where: { userId: studentId, createdAt: dateRange, ...ownership },
            select: {
                activityId: true,
                questionId: true,
                isCorrect: true,
                skillTag: true,
                createdAt: true,
                activity: { select: activitySelect },
            },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.pointsLedger.findMany({
            where: { userId: studentId, createdAt: dateRange },
            select: { id: true, reason: true, source: true, points: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        }),
    ]);
    const quizzes = buildRequiredQuizzes({ activities, submissions, assignmentIds, since, now });
    const result: StudentEvaluation = {
        student,
        scope: {
            classId: enrollment.classId,
            className: enrollment.class.name,
            since: since.toISOString(),
            asOf: now.toISOString(),
            timeZone: CLASS_TIME_ZONE,
        },
        classes: enrollments.map((e) => ({ id: e.classId, name: e.class.name })),
        ...buildStudentEvaluation({
            since,
            now,
            assignmentIds,
            progress,
            submissions,
            responses,
            ledger,
            quizzes,
        }),
    };
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
}
