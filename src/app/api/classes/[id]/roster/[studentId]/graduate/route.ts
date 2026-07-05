import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { canManageClass } from "@/lib/auth/policies";
import { requireTeacher } from "@/lib/auth/api-auth";
import { ApiErrors, handleApiError } from "@/lib/api/response";

interface RouteParams {
    params: Promise<{ id: string; studentId: string }>;
}

// POST — graduate a student (mark enrollment as graduated, keep history intact)
export async function POST(_req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId, studentId } = await params;

        const cls = await withPrismaReadRetry(() =>
            prisma.class.findUnique({
                where: { id: classId },
                select: { id: true, teacherId: true },
            })
        );
        if (!cls) return ApiErrors.notFound("Class", classId);
        if (!canManageClass(user, admin, cls.teacherId)) return ApiErrors.forbidden();

        const enrollment = await withPrismaReadRetry(() =>
            prisma.classEnrollment.findUnique({
                where: { classId_studentId: { classId, studentId } },
                select: { id: true, status: true },
            })
        );
        if (!enrollment) return ApiErrors.notFound("Enrollment");

        const updated = await prisma.classEnrollment.update({
            where: { classId_studentId: { classId, studentId } },
            data: {
                status: "graduated",
                statusChangedAt: new Date(),
                statusNote: "Graduated by teacher",
            },
            select: {
                id: true,
                status: true,
                statusChangedAt: true,
                student: { select: { id: true, username: true, name: true } },
            },
        });

        return NextResponse.json({
            enrollmentId: updated.id,
            userId: updated.student.id,
            username: updated.student.username,
            displayName: updated.student.name ?? null,
            status: updated.status,
            graduatedAt: updated.statusChangedAt?.toISOString() ?? null,
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to graduate student" });
    }
}
