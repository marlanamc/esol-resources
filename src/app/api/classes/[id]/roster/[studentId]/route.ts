import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { canManageClass } from "@/lib/policies";
import { requireTeacher } from "@/lib/api-auth";
import { ApiErrors, handleApiError } from "@/lib/api-response";

interface RouteParams {
    params: Promise<{ id: string; studentId: string }>;
}

// DELETE — remove (deactivate) a student from the class
export async function DELETE(_req: Request, { params }: RouteParams) {
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
                status: "inactive",
                statusChangedAt: new Date(),
                statusNote: "Removed by teacher",
            },
            select: { id: true, status: true, statusChangedAt: true },
        });

        return NextResponse.json({
            enrollmentId: updated.id,
            status: updated.status,
            statusChangedAt: updated.statusChangedAt?.toISOString() ?? null,
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to remove student from class" });
    }
}
