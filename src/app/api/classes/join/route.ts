import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function validateJoinSession(session: { user?: { role?: string | null } } | null): {
    allowed: boolean;
    status?: number;
    error?: string;
} {
    if (!session) {
        return { allowed: false, status: 401, error: "Unauthorized" };
    }

    if (session.user?.role === "teacher") {
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
        const sessionValidation = validateJoinSession(session);
        if (!sessionValidation.allowed) {
            return NextResponse.json({ error: sessionValidation.error }, { status: sessionValidation.status });
        }

        const body = await request.json();
        const { code } = body;

        const normalizedCode = normalizeJoinClassCode(code);
        if (!normalizedCode.ok) {
            return NextResponse.json({ error: normalizedCode.error }, { status: normalizedCode.status });
        }

        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find class by code
        const classItem = await prisma.class.findUnique({
            where: { code: normalizedCode.code },
        });

        if (!classItem) {
            return NextResponse.json({ error: "Class not found. Please check the code." }, { status: 404 });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.classEnrollment.findUnique({
            where: {
                classId_studentId: {
                    classId: classItem.id,
                    studentId: userId,
                },
            },
        });

        if (existingEnrollment) {
            const alreadyEnrolled = buildAlreadyEnrolledResponse(classItem.id);
            return NextResponse.json(alreadyEnrolled.body, { status: alreadyEnrolled.status });
        }

        // Create enrollment
        await prisma.classEnrollment.create({
            data: {
                classId: classItem.id,
                studentId: userId,
            },
        });

        return NextResponse.json({ classId: classItem.id, message: "Successfully joined class" });
    } catch (error: unknown) {
        console.error("Error joining class:", error);
        // SECURITY: Don't expose internal error details to user
        return NextResponse.json(
            { error: "Failed to join class. Please try again." },
            { status: 500 }
        );
    }
}






