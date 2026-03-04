import { logger } from "@/lib/logger";

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "off"].includes(normalized)) return false;
    return defaultValue;
}

function parseNumber(value: string | undefined, defaultValue: number): number {
    if (value === undefined) return defaultValue;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return defaultValue;
    return parsed;
}

const PERF_LOG_ENABLED = parseBoolean(
    process.env.PERF_LOG_ENABLED,
    process.env.NODE_ENV === "production"
);
const PERF_LOG_THRESHOLD_MS = parseNumber(process.env.PERF_LOG_THRESHOLD_MS, 300);
const PERF_LOG_SAMPLE_RATE = Math.min(
    1,
    Math.max(0, parseNumber(process.env.PERF_LOG_SAMPLE_RATE, 0.2))
);

function shouldSample(): boolean {
    if (PERF_LOG_SAMPLE_RATE >= 1) return true;
    if (PERF_LOG_SAMPLE_RATE <= 0) return false;
    return Math.random() <= PERF_LOG_SAMPLE_RATE;
}

type PerfContext = {
    route: string;
    queryLabel: string;
    userRole?: string | null;
    rowCount?: number;
    requestId?: string;
};

export async function timedQuery<T>(
    context: PerfContext,
    fn: () => Promise<T>,
    getRowCount?: (result: T) => number | undefined
): Promise<T> {
    const start = Date.now();
    try {
        const result = await fn();
        if (!PERF_LOG_ENABLED || !shouldSample()) return result;

        const duration = Date.now() - start;
        const rowCount = getRowCount ? getRowCount(result) : context.rowCount;
        const payload = {
            route: context.route,
            queryLabel: context.queryLabel,
            duration,
            rowCount,
            userRole: context.userRole ?? null,
            requestId: context.requestId,
        };

        if (duration > PERF_LOG_THRESHOLD_MS) {
            logger.warn("Slow query detected", payload);
        } else {
            logger.info("Query timing", payload);
        }
        return result;
    } catch (error) {
        if (PERF_LOG_ENABLED) {
            const duration = Date.now() - start;
            logger.error("Timed query failed", error, {
                route: context.route,
                queryLabel: context.queryLabel,
                duration,
                userRole: context.userRole ?? null,
                requestId: context.requestId,
            });
        }
        throw error;
    }
}
