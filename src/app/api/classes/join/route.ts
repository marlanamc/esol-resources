import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { requireStudent } from "@/lib/auth/api-auth";
import { ApiErrors, apiError } from "@/lib/api/response";
import { JoinClassBodySchema, parseApiBody } from "@/lib/api/schemas";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { enrollStudentInClass } from "@/lib/learner-transitions";

export function validateJoinSession(session: { user?: { role?: string | null } } | null): {
    allowed: boolean;
    status?: number;
    error?: string;
} {
    if (!session) {
        return { allowed: false, status: 401, error: "Unauthorized" };
    }

    if (canUseTeacherTools(session.user)) {
        return { allowed: false, status: 403, error: "Teachers cannot join classes" };
    }

    return { allowed: true };
}

export function normalizeJoinClassCode(code: unknown): {
    ok: true;
    code: string;
} | {
    ok: false;
    status: number;
    error: string;
} {
    if (!code || typeof code !== "string") {
        return { ok: false, status: 400, error: "Class code is required" };
    }

    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode.length !== 6) {
        return { ok: false, status: 400, error: "Invalid class code format" };
    }

    return { ok: true, code: trimmedCode };
}

export function buildAlreadyEnrolledResponse(classId: string) {
    return {
        status: 400,
        body: { error: "You are already enrolled in this class", classId },
    };
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const studentCheck = requireStudent(session);
        if (!studentCheck.ok) return studentCheck.response;

        const body = await request.json();
        const validated = parseApiBody(JoinClassBodySchema, body);
        if (!validated.ok) return validated.response;

        const normalizedCode = normalizeJoinClassCode(validated.data.code);
        if (!normalizedCode.ok) {
            return apiError(normalizedCode.error, normalizedCode.status);
        }

        const userId = studentCheck.user.id;

        // Find class by code
        const classItem = await prisma.class.findUnique({
            where: { code: normalizedCode.code },
        });

        if (!classItem) {
            return ApiErrors.notFound("Class");
        }

        const existingEnrollment = await prisma.classEnrollment.findUnique({
            where: {
                classId_studentId: {
                    classId: classItem.id,
                    studentId: userId,
                },
            },
            select: { status: true },
        });

        if (existingEnrollment?.status === "active") {
            const alreadyEnrolled = buildAlreadyEnrolledResponse(classItem.id);
            return NextResponse.json(alreadyEnrolled.body, { status: alreadyEnrolled.status });
        }

        await enrollStudentInClass({
            prisma,
            classId: classItem.id,
            studentId: userId,
        });

        return NextResponse.json({ classId: classItem.id, message: "Successfully joined class" });
    } catch {
        return ApiErrors.internal("Failed to join class. Please try again.");
    }
}

