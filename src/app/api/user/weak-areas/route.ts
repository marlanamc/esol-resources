/**
 * Weak Areas API
 * GET: Analyze user's submissions to find activities needing review
 */

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiErrors, handleApiError } from "@/lib/api-response";
import { analyzeWeakAreas } from "@/lib/independent-progress";
import { createLearnerContentMetadataCache, filterLearnerVisibleActivities } from "@/lib/learner-visibility";
import { probeActivityIsReleasedInContentColumn, supportsActivityIsReleasedInContent } from "@/lib/prisma-field-support";

/**
 * GET /api/user/weak-areas
 * Returns activities where the user scored below 70%
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return ApiErrors.unauthorized();
        }

        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const limit = Math.min(10, Math.max(1, parseInt(searchParams.get("limit") || "3", 10)));

        // Fetch user's submissions with scores
        const submissions = await prisma.submission.findMany({
            where: {
                userId,
                score: { not: null },
                status: { in: ["submitted", "graded"] },
            },
            select: {
                activityId: true,
                score: true,
                completedAt: true,
            },
            orderBy: {
                completedAt: "desc",
            },
        });

        // Fetch activities for these submissions
        const activityIds = [...new Set(submissions.map((s) => s.activityId))];
        await probeActivityIsReleasedInContentColumn();
        const activitiesRaw = await prisma.activity.findMany({
            where: {
                id: { in: activityIds },
                deletedAt: null,
            },
            select: {
                id: true,
                title: true,
                type: true,
                category: true,
                isReleased: true,
                ...(supportsActivityIsReleasedInContent() ? { isReleasedInContent: true } : {}),
                content: true,
            },
        });
        const activities = filterLearnerVisibleActivities(
            activitiesRaw,
            createLearnerContentMetadataCache()
        ).map((activity) => ({
            id: activity.id,
            title: activity.title,
            type: activity.type,
            category: activity.category,
        }));

        // Analyze weak areas
        const weakAreas = analyzeWeakAreas({
            activities,
            submissions: submissions.map((s) => ({
                activityId: s.activityId,
                score: s.score,
                completedAt: s.completedAt,
            })),
            limit,
        });

        return NextResponse.json({
            weakAreas,
            analyzedCount: submissions.length,
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to analyze weak areas",
        });
    }
}
