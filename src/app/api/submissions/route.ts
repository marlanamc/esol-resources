import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { SubmissionsPostBodySchema, parseApiBody } from "@/lib/api/schemas";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

function readIdempotencyKey(request: NextRequest): string | null {
    const key = request.headers.get("x-idempotency-key");
    if (!key) return null;
    const trimmed = key.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function buildSubmissionContent(content: string, idempotencyKey: string | null): string {
    return JSON.stringify({
        text: content,
        _meta: idempotencyKey ? { idempotencyKey } : undefined,
    });
}

function extractSubmissionMeta(content: string | null | undefined): { idempotencyKey?: string } | null {
    if (!content) return null;
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === "object" && parsed._meta && typeof parsed._meta === "object") {
            return parsed._meta as { idempotencyKey?: string };
        }
        return null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return ApiErrors.unauthorized();
        }

        const userRole = session.user?.role;
        if (userRole !== "student") {
            return ApiErrors.forbidden("Only students can submit work");
        }

        const body = await request.json();
        const validated = parseApiBody(SubmissionsPostBodySchema, body);
        if (!validated.ok) return validated.response;
        const { activityId, assignmentId, content } = validated.data;
        const contentStr = typeof content === "string" ? content : JSON.stringify(content);
        const idempotencyKey = readIdempotencyKey(request);

        const userId = session.user?.id;

        // Verify assignment exists and student is enrolled
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                class: {
                    include: {
                        enrollments: true,
                    },
                },
            },
        });

        if (!assignment) {
            return ApiErrors.notFound("Assignment", assignmentId);
        }

        const isEnrolled = assignment.class.enrollments.some(
            (enrollment: { studentId: string }) => enrollment.studentId === userId
        );

        if (!isEnrolled) {
            return ApiErrors.forbidden("You are not enrolled in this class");
        }

        if (idempotencyKey) {
            const existingSubmission = await prisma.submission.findFirst({
                where: { userId, activityId, assignmentId },
            });

            const existingMeta = extractSubmissionMeta(existingSubmission?.content);
            if (existingSubmission && existingMeta?.idempotencyKey === idempotencyKey) {
                return NextResponse.json(existingSubmission);
            }
        }

        // Create or update submission
        const submission = await prisma.submission.upsert({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId,
                    assignmentId,
                },
            },
            update: {
                content: buildSubmissionContent(contentStr, idempotencyKey),
                status: "submitted",
            },
            create: {
                userId,
                activityId,
                assignmentId,
                content: buildSubmissionContent(contentStr, idempotencyKey),
                status: "submitted",
            },
        });

        return NextResponse.json(submission);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to create submission",
            path: request.url,
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return ApiErrors.unauthorized();
        }

        const userRole = session.user?.role;
        if (userRole !== "student") {
            return ApiErrors.forbidden("Only students can update submissions");
        }

        const body = await request.json();
        const { submissionId, content } = body;
        const idempotencyKey = readIdempotencyKey(request);

        if (!submissionId || !content) {
            return apiError("Submission ID and content are required", 400);
        }

        const contentStr = typeof content === "string" ? content : JSON.stringify(content);
        const userId = session.user?.id;

        // Verify submission belongs to user
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            return ApiErrors.notFound("Submission", submissionId);
        }

        if (submission.userId !== userId) {
            return ApiErrors.forbidden();
        }

        if (submission.status === "graded") {
            return apiError("Cannot update graded submission", 400);
        }

        const existingMeta = extractSubmissionMeta(submission.content);
        if (idempotencyKey && existingMeta?.idempotencyKey === idempotencyKey) {
            return NextResponse.json(submission);
        }

        // Update submission
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                content: buildSubmissionContent(contentStr, idempotencyKey),
                status: "submitted",
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to update submission",
            path: request.url,
        });
    }
}




