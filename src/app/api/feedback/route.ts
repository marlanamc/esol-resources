import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { FeedbackPostBodySchema, parseApiBody } from "@/lib/api-schemas";
import { ApiErrors, apiSuccess } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const authError = requireAuth(session);
        if (authError) return authError;

        const body = await request.json();
        const validated = parseApiBody(FeedbackPostBodySchema, body);
        if (!validated.ok) return validated.response;

        const feedback = await prisma.feedback.create({
            data: {
                userId: session!.user!.id,
                activityId: validated.data.activityId ?? null,
                activityTitle: validated.data.activityTitle ?? null,
                difficulty: validated.data.difficulty ?? null,
                type: validated.data.type,
                message: validated.data.message,
            },
            select: {
                id: true,
                createdAt: true,
            },
        });

        logger.info("Feedback recorded", {
            userId: session!.user!.id,
            feedbackId: feedback.id,
            activityId: validated.data.activityId ?? undefined,
            type: validated.data.type,
        });

        return apiSuccess(feedback, 201, "Feedback submitted");
    } catch (error) {
        logger.error("Error saving feedback", error);
        return ApiErrors.internal("Failed to save feedback");
    }
}
