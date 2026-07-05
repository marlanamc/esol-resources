import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { ApiErrors, apiError } from "@/lib/api/response";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const user = session.user;
    const admin = isAdmin(session.user);
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const activityId = searchParams.get("activityId");

    if (!studentId || !activityId) {
        return apiError("Missing studentId or activityId", 400);
    }

    // Verify access: teacher must have student in their class, or user is viewing their own data
    if (canUseTeacherTools(user) && !admin) {
        const enrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId,
                status: "active",
                class: { teacherId: user.id },
                student: {
                    isSystemAccount: false,
                },
            },
        });
        if (!enrollment) {
            return ApiErrors.forbidden("Access denied");
        }
    } else if (user.id !== studentId) {
        return ApiErrors.forbidden("Access denied");
    }

    // Get all responses for this student and activity
    const responses = await prisma.quizResponse.findMany({
        where: {
            userId: studentId,
            activityId,
            skillTag: { not: null },
        },
        select: {
            skillTag: true,
            isCorrect: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Aggregate by skillTag
    const skillMap = new Map<
        string,
        {
            attempts: number;
            correct: number;
            lastAttemptDate: Date;
        }
    >();

    responses.forEach((r) => {
        if (!r.skillTag) return;

        const existing = skillMap.get(r.skillTag);
        if (existing) {
            existing.attempts++;
            if (r.isCorrect) {
                existing.correct++;
            }
            // Keep the most recent date (responses are ordered desc)
            if (!existing.lastAttemptDate || r.createdAt > existing.lastAttemptDate) {
                existing.lastAttemptDate = r.createdAt;
            }
        } else {
            skillMap.set(r.skillTag, {
                attempts: 1,
                correct: r.isCorrect ? 1 : 0,
                lastAttemptDate: r.createdAt,
            });
        }
    });

    // Format results
    const skills = Array.from(skillMap.entries()).map(([skillTag, data]) => ({
        skillTag,
        attempts: data.attempts,
        correct: data.correct,
        percentCorrect:
            data.attempts > 0
                ? Math.round((data.correct / data.attempts) * 100)
                : 0,
        lastAttemptDate: data.lastAttemptDate,
    }));

    // Sort by percentCorrect ascending (worst performing skills first)
    skills.sort((a, b) => a.percentCorrect - b.percentCorrect);

    return NextResponse.json({
        studentId,
        activityId,
        skills,
    });
}
