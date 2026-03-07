import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, DEFAULT_PASSWORD_BLOCKED_MESSAGE, isDisallowedPassword } from "@/lib/auth-config";
import { createAuditLogger } from "@/lib/audit-log";
import { isTeacherAdmin } from "@/lib/roles";
import { checkRateLimit, authRateLimitKey } from "@/lib/rate-limit";
import { ApiErrors, apiSuccess } from "@/lib/api-response";
import { requireTeacher } from "@/lib/api-auth";

export async function POST(request: Request) {
    const key = authRateLimitKey(request, "admin-reset-password");
    if (!checkRateLimit(key)) {
        return ApiErrors.rateLimited("Too many requests. Please try again later.");
    }

    const session = await getServerSession(authOptions);
    const teacherCheck = requireTeacher(session);
    const audit = createAuditLogger(request);

    if (!teacherCheck.ok) {
        if (session?.user) {
            audit.failure(
                'admin.unauthorized_attempt',
                session.user.id,
                session.user.role,
                'Non-teacher attempted to reset student password'
            );
        }
        return teacherCheck.response;
    }

    const { userId, newPassword } = await request.json();
    const admin = isTeacherAdmin(teacherCheck.user);

    if (!userId || typeof userId !== "string") {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // SECURITY: Validate password length (min and max)
    if (!newPassword || typeof newPassword !== "string") {
        return NextResponse.json({ error: "Invalid password format." }, { status: 400 });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }, { status: 400 });
    }

    if (newPassword.length > MAX_PASSWORD_LENGTH) {
        return NextResponse.json({ error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` }, { status: 400 });
    }
    if (isDisallowedPassword(newPassword)) {
        return NextResponse.json({ error: DEFAULT_PASSWORD_BLOCKED_MESSAGE }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, isSystemAccount: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "student") {
        return NextResponse.json({ error: "Only student passwords can be changed here" }, { status: 400 });
    }
    if (user.isSystemAccount) {
        return NextResponse.json({ error: "System accounts cannot be updated here" }, { status: 400 });
    }

    // SECURITY: Verify teacher owns this student (enrolled in one of their classes)
    const enrollment = admin
        ? { id: "admin-access" }
        : await prisma.classEnrollment.findFirst({
            where: {
                studentId: userId,
                class: { teacherId: teacherCheck.user.id },
                student: {
                    isSystemAccount: false,
                },
            },
        });

    if (!enrollment) {
        audit.failure(
            'admin.unauthorized_student_access',
            teacherCheck.user.id,
            teacherCheck.user.role || "teacher",
            `Teacher attempted to reset password for student not in their classes: ${userId}`
        );
        return NextResponse.json({ error: "Access denied - student not in your classes" }, { status: 403 });
    }

    // SECURITY: Use industry-standard bcrypt rounds (12 in 2025)
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: userId },
        data: {
            password: passwordHash,
            mustChangePassword: false,
        },
    });

    // AUDIT: Log password reset action
    audit.success(
        'user.password_reset',
        teacherCheck.user.id,
        teacherCheck.user.role || "teacher",
        {
            targetId: userId,
            targetType: 'user',
            metadata: { resetBy: 'teacher' }
        }
    );

    return apiSuccess(undefined, 200, "Password updated");
}
