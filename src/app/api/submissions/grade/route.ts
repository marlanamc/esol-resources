import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireTeacher } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const { user, admin } = teacherCheck;
        const userId = user.id;

        const body = await request.json();
        const { submissionId, score, feedback } = body;

        if (!submissionId) {
            return apiError("Submission ID is required", 400);
        }

        // Get submission with assignment and class
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                assignment: {
                    include: {
                        class: true,
                    },
                },
            },
        });

        if (!submission) {
            return ApiErrors.notFound("Submission", submissionId);
        }

        // Verify teacher owns the class
        if (!admin && submission.assignment?.class.teacherId !== userId) {
            return ApiErrors.forbidden();
        }

        // Validate score if provided
        if (score !== null && (score < 0 || score > 100)) {
            return apiError("Score must be between 0 and 100", 400);
        }

        // Update submission
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                score: score !== null ? score : null,
                feedback: feedback || null,
                status: "graded",
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to grade submission",
            path: request.url,
        });
    }
}








