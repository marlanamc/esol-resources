import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { canManageClass } from "@/lib/policies";
import { requireTeacher } from "@/lib/api-auth";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST — add a student to the class roster
// Body: { username: string } or { studentId: string }
export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId } = await params;

        const body = await req.json() as Record<string, unknown>;
        const { username, studentId } = body;

        if (!username && !studentId) {
            return apiError("Provide username or studentId", 400);
        }
        if (username !== undefined && typeof username !== "string") {
            return apiError("username must be a string", 400);
        }
        if (studentId !== undefined && typeof studentId !== "string") {
            return apiError("studentId must be a string", 400);
        }

        const [cls, student] = await Promise.all([
            withPrismaReadRetry(() =>
                prisma.class.findUnique({
                    where: { id: classId },
                    select: { id: true, teacherId: true },
                })
            ),
            withPrismaReadRetry(() =>
                prisma.user.findFirst({
                    where: studentId
                        ? { id: studentId as string, role: "student" }
                        : { username: (username as string).trim().toLowerCase(), role: "student" },
                    select: { id: true, username: true, name: true, role: true },
                })
            ),
        ]);

        if (!cls) return ApiErrors.notFound("Class", classId);
        if (!canManageClass(user, admin, cls.teacherId)) return ApiErrors.forbidden();
        if (!student) return apiError("Student not found", 404);

        // Upsert enrollment: if they were previously removed/graduated, re-activate
        const enrollment = await prisma.classEnrollment.upsert({
            where: { classId_studentId: { classId, studentId: student.id } },
            create: {
                classId,
                studentId: student.id,
                status: "active",
            },
            update: {
                status: "active",
                statusChangedAt: new Date(),
                statusNote: "Re-enrolled by teacher",
            },
            select: {
                id: true,
                status: true,
                joinedAt: true,
                student: { select: { id: true, username: true, name: true } },
            },
        });

        return NextResponse.json({
            enrolled: {
                enrollmentId: enrollment.id,
                userId: enrollment.student.id,
                username: enrollment.student.username,
                displayName: enrollment.student.name ?? null,
                status: enrollment.status,
                enrolledAt: enrollment.joinedAt.toISOString(),
            },
        }, { status: 201 });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to add student to class" });
    }
}
