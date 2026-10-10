import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/database/prisma";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";
import { logger } from "@/lib/shared/logger";

export const GRAMMAR_GUIDE_ACTIVITY_TAG = "grammar-guide-activity";

export interface GrammarGuideActivity {
    id: string;
    isReleased: boolean;
}

/**
 * Uncached title -> { id, isReleased } lookup for a grammar guide.
 * Exported for tests; app code should use getGrammarGuideActivity.
 *
 * When the registry title has drifted from the seeded Activity.title (e.g. a
 * guide renamed in code but not re-seeded), the slug fallback still finds the
 * row by id (`slug` / `slug-guide`). Without it the reader gets no activityId
 * and silently saves no progress, so the guide never counts as done.
 */
export async function lookupGrammarGuideActivity(
    title: string,
    slug?: string
): Promise<GrammarGuideActivity | null> {
    // Prefer the canonical released mini-quiz guide when duplicate titles exist.
    const canonicalId = await resolveCanonicalGrammarActivityId({ title });
    if (canonicalId) {
        const activity = await prisma.activity.findUnique({
            where: { id: canonicalId },
            select: { isReleased: true },
        });
        return { id: canonicalId, isReleased: activity?.isReleased === true };
    }

    const activity = await prisma.activity.findFirst({
        where: { title, type: "guide", category: "grammar" },
        select: { id: true, isReleased: true },
    });
    if (activity) {
        return { id: activity.id, isReleased: activity.isReleased === true };
    }

    if (!slug) return null;
    const slugId = await resolveCanonicalGrammarActivityId({ slug });
    if (!slugId) return null;
    const slugActivity = await prisma.activity.findUnique({
        where: { id: slugId },
        select: { isReleased: true },
    });
    return { id: slugId, isReleased: slugActivity?.isReleased === true };
}

const getCachedGrammarGuideActivity = unstable_cache(
    lookupGrammarGuideActivity,
    ["grammar-guide-activity"],
    { revalidate: 300, tags: [GRAMMAR_GUIDE_ACTIVITY_TAG] }
);

/**
 * Cached lookup for the grammar-reader route so most guide views hit no DB.
 * The title -> id map only changes at seed/import time (covered by the TTL);
 * release toggles invalidate the tag directly. Returns null when the guide
 * has no activity row or the database is unreachable (e.g. during build),
 * matching the old getActivityIdSafely behavior.
 */
export async function getGrammarGuideActivity(
    title: string,
    slug?: string
): Promise<GrammarGuideActivity | null> {
    try {
        return await getCachedGrammarGuideActivity(title, slug);
    } catch (error) {
        logger.warn(`Grammar guide activity lookup failed for "${title}"`, { error });
        return null;
    }
}

/**
 * Drop cached guide lookups so release toggles (and activity edits that can
 * change a guide's title or release state) show up immediately instead of
 * after the TTL. No-ops outside a Next.js request context (scripts, tests,
 * cron via tsx).
 */
export function invalidateGrammarGuideActivityCache() {
    try {
        revalidateTag(GRAMMAR_GUIDE_ACTIVITY_TAG, "max");
    } catch {
        // Not running inside Next.js — nothing to invalidate.
    }
}
