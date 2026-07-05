import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { requireTeacher } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/database/prisma";
import { ApiErrors, handleApiError } from "@/lib/api/response";
import { parseApiBody, GradeSubmissionBodySchema } from "@/lib/api/schemas";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;

        const { user, admin } = teacherCheck;
        const userId = user.id;

        const rawBody = await request.json().catch(() => null);
        const parsed = parseApiBody(GradeSubmissionBodySchema, rawBody);
        if (!parsed.ok) return parsed.response;
        const { submissionId, score, feedback } = parsed.data;

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

        // Update submission (undefined score leaves the existing value unchanged)
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                score,
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








