import type { CourseMapUnit } from "@/lib/course-map";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import {
    buildCourseMapProgressState,
    collectGrammarReaderSlugs,
    enrichActivity,
    getCourseMapProgressActivityIds,
    type CourseMapProgressState,
} from "@/lib/course-map-progress";

export async function loadCourseMapProgressState(
    userId: string,
    units: CourseMapUnit[]
): Promise<CourseMapProgressState> {
    const progressActivityIds = getCourseMapProgressActivityIds(units);
    if (progressActivityIds.length === 0) return {};

    const progressRows = await withPrismaReadRetry(() =>
        prisma.activityProgress.findMany({
            where: { userId, activityId: { in: progressActivityIds } },
            select: { activityId: true, status: true, categoryData: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
        })
    );

    return buildCourseMapProgressState(progressRows);
}

export async function enrichCourseMapUnitsWithGrammarIds(
    units: CourseMapUnit[]
): Promise<CourseMapUnit[]> {
    const slugs = collectGrammarReaderSlugs(units);
    const slugToActivityId = new Map<string, string>();

    await Promise.all(
        slugs.map(async (slug) => {
            const activityId = await resolveCanonicalGrammarActivityId({ slug });
            if (activityId) slugToActivityId.set(slug, activityId);
        })
    );

    return units.map((unit) => ({
        ...unit,
        levels: unit.levels.map((level) => ({
            ...level,
            requiredActivities: level.requiredActivities.map((activity) =>
                enrichActivity(activity, slugToActivityId)
            ),
            extraPractice: level.extraPractice?.map((activity) =>
                enrichActivity(activity, slugToActivityId)
            ),
        })),
    }));
}
