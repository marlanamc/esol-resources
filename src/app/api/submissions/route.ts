import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionsPostBodySchema, parseApiBody } from "@/lib/api-schemas";

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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        if (userRole !== "student") {
            return NextResponse.json({ error: "Only students can submit work" }, { status: 403 });
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
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const isEnrolled = assignment.class.enrollments.some(
            (enrollment: { studentId: string }) => enrollment.studentId === userId
        );

        if (!isEnrolled) {
            return NextResponse.json({ error: "You are not enrolled in this class" }, { status: 403 });
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
    } catch (error: unknown) {
        console.error("Error creating submission:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create submission" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        if (userRole !== "student") {
            return NextResponse.json({ error: "Only students can update submissions" }, { status: 403 });
        }

        const body = await request.json();
        const { submissionId, content } = body;
        const idempotencyKey = readIdempotencyKey(request);

        if (!submissionId || !content) {
            return NextResponse.json(
                { error: "Submission ID and content are required" },
                { status: 400 }
            );
        }

        const contentStr = typeof content === "string" ? content : JSON.stringify(content);
        const userId = session.user?.id;

        // Verify submission belongs to user
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        if (submission.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (submission.status === "graded") {
            return NextResponse.json(
                { error: "Cannot update graded submission" },
                { status: 400 }
            );
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
    } catch (error: unknown) {
        console.error("Error updating submission:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update submission" },
            { status: 500 }
        );
    }
}




