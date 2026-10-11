import { acquireUserActivityScopeLock } from "@/lib/database/locks";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { ApiErrors, apiError, handleApiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return ApiErrors.unauthorized();
        }

        const queuedOwner = request.headers.get("x-outbox-user-id");
        if (queuedOwner && queuedOwner !== session.user.id) return ApiErrors.forbidden("Sign in to the account that saved this work.");

        // Get user
        const user = await prisma.user.findUnique({
            where: { username: session.user.username || '' },
        });

        if (!user) {
            return ApiErrors.notFound('User');
        }

        const body = await request.json();
        const { activityId, assignmentId, selectedPromptIds, solo, speaking } = body;

        // Validate required fields
        if (!activityId || !selectedPromptIds || !solo || !speaking) {
            return apiError('Missing required fields', 400);
        }

        // Create submission record
        const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
        return await prisma.$transaction(async tx => {
            await acquireUserActivityScopeLock(tx, { userId: user.id, activityId, assignmentId: assignmentKey });
            const submissionWhere = {
                userId: user.id,
                activityId,
                assignmentId: assignmentKey,
            };
            const existingSubmission = await tx.speakingSubmission.findFirst({
                where: submissionWhere,
            });

            const submissionPayload = {
                ...submissionWhere,
                selectedPromptIds,
                soloSentences: solo.sentences,
                soloFollowUpQuestions: solo.followUpQuestions,
                soloCompletedStepIds: solo.completedStepIds,
                speakingBestSentence: speaking.bestSentence,
                speakingCompletedStepIds: speaking.completedStepIds,
                submittedAt: new Date(),
                status: 'submitted',
            };

            const submission = existingSubmission
                ? await tx.speakingSubmission.update({
                      where: { id: existingSubmission.id },
                      data: submissionPayload,
                  })
                : await tx.speakingSubmission.create({
                      data: submissionPayload,
                  });

            // Update activity progress
            const progressWhere = {
                userId: user.id,
                activityId,
                assignmentId: assignmentKey,
            };
            const existingProgress = await tx.activityProgress.findFirst({
                where: progressWhere,
            });

            if (existingProgress) {
                await tx.activityProgress.update({
                    where: { id: existingProgress.id },
                    data: {
                        progress: 100,
                        status: 'submitted',
                        updatedAt: new Date(),
                    },
                });
            } else {
                await tx.activityProgress.create({
                    data: {
                        ...progressWhere,
                        progress: 100,
                        status: 'submitted',
                    },
                });
            }

            return NextResponse.json({ success: true, submission });
        }, { timeout: 10000 });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: 'Failed to submit speaking warm-up',
            path: request.url,
        });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return ApiErrors.unauthorized();
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { username: session.user.username || '' },
        });

        if (!user) {
            return ApiErrors.notFound('User');
        }

        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activityId');
        const assignmentId = searchParams.get('assignmentId');

        if (!activityId) {
            return apiError('activityId is required', 400);
        }

        const submission = await prisma.speakingSubmission.findFirst({
            where: {
                userId: user.id,
                activityId,
                assignmentId: assignmentId ?? null,
            },
        });

        if (!submission) {
            return NextResponse.json({ submission: null });
        }

        // Transform to match frontend interface
        const transformedSubmission = {
            activityId: submission.activityId,
            assignmentId: submission.assignmentId,
            userId: submission.userId,
            selectedPromptIds: submission.selectedPromptIds,
            solo: {
                sentences: submission.soloSentences as [string, string, string],
                followUpQuestions: submission.soloFollowUpQuestions as [string, string],
                completedStepIds: submission.soloCompletedStepIds,
            },
            speaking: {
                bestSentence: submission.speakingBestSentence,
                completedStepIds: submission.speakingCompletedStepIds,
            },
            submittedAt: submission.submittedAt.toISOString(),
            status: submission.status as 'submitted',
        };

        return NextResponse.json({ submission: transformedSubmission });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: 'Failed to fetch speaking submission',
            path: request.url,
        });
    }
}
