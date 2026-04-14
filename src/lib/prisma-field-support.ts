import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

let activityReleasedMetadataSupportCache: boolean | null = null;

/**
 * Probes the actual database (not just the Prisma DMMF) to determine whether
 * the `isReleasedInContent` column has been deployed to the Activity table.
 *
 * The result is cached for the lifetime of the process.
 */
export async function probeActivityIsReleasedInContentColumn(): Promise<boolean> {
    if (activityReleasedMetadataSupportCache !== null) {
        return activityReleasedMetadataSupportCache;
    }

    try {
        const result = await prisma.$queryRaw<{ exists: boolean }[]>`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'Activity'
                  AND column_name = 'isReleasedInContent'
            ) AS "exists"
        `;
        activityReleasedMetadataSupportCache = result[0]?.exists === true;
    } catch (error) {
        logger.warn("Failed to probe isReleasedInContent column; assuming absent", {
            error: error instanceof Error ? error.message : String(error),
        });
        activityReleasedMetadataSupportCache = false;
    }

    return activityReleasedMetadataSupportCache;
}

/**
 * Synchronous check that returns the cached probe result.
 * Returns `false` until `probeActivityIsReleasedInContentColumn()` has resolved.
 */
export function supportsActivityIsReleasedInContent(): boolean {
    return activityReleasedMetadataSupportCache === true;
}
