import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

type TrackedTabPath = "/dashboard" | "/dashboard/calendar" | "/dashboard/activities";

type TabNavMetric = {
    fromPath: TrackedTabPath;
    toPath: TrackedTabPath;
    clickToRouteCommitMs: number;
    clickToFirstFrameMs: number;
    clickToIdleMs: number | null;
    at: string;
};

const MAX_EVENTS = 2000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const tabNavEvents: TabNavMetric[] = [];

function isTrackedPath(value: unknown): value is TrackedTabPath {
    return value === "/dashboard" || value === "/dashboard/calendar" || value === "/dashboard/activities";
}

function isValidMetric(value: unknown): value is TabNavMetric {
    if (!value || typeof value !== "object") return false;
    const metric = value as Partial<TabNavMetric>;
    if (!isTrackedPath(metric.fromPath) || !isTrackedPath(metric.toPath)) return false;
    if (typeof metric.clickToRouteCommitMs !== "number" || metric.clickToRouteCommitMs < 0 || metric.clickToRouteCommitMs > 20_000) return false;
    if (typeof metric.clickToFirstFrameMs !== "number" || metric.clickToFirstFrameMs < 0 || metric.clickToFirstFrameMs > 20_000) return false;
    if (metric.clickToIdleMs !== null && (typeof metric.clickToIdleMs !== "number" || metric.clickToIdleMs < 0 || metric.clickToIdleMs > 40_000)) return false;
    if (typeof metric.at !== "string") return false;
    return true;
}

function percentile(values: number[], p: number): number {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
    return Math.round(sorted[idx] * 10) / 10;
}

function trimOldEvents(now: number) {
    const minTs = now - ONE_DAY_MS;
    for (let i = tabNavEvents.length - 1; i >= 0; i--) {
        const ts = Date.parse(tabNavEvents[i].at);
        if (Number.isNaN(ts) || ts < minTs) {
            tabNavEvents.splice(i, 1);
        }
    }
    if (tabNavEvents.length > MAX_EVENTS) {
        tabNavEvents.splice(0, tabNavEvents.length - MAX_EVENTS);
    }
}

async function parseBody(request: Request): Promise<{ events: TabNavMetric[] }> {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return (await request.json()) as { events: TabNavMetric[] };
    }
    const raw = await request.text();
    return JSON.parse(raw) as { events: TabNavMetric[] };
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await parseBody(request);
        const events = Array.isArray(body?.events) ? body.events.filter(isValidMetric) : [];
        if (!events.length) {
            return NextResponse.json({ ok: true, accepted: 0 });
        }

        const now = Date.now();
        trimOldEvents(now);
        tabNavEvents.push(...events);
        trimOldEvents(now);

        logger.info("Tab nav telemetry batch", {
            userId: (session.user as { id?: string }).id,
            count: events.length,
            sample: events.slice(0, 2),
        });

        return NextResponse.json({ ok: true, accepted: events.length });
    } catch (error) {
        logger.warn("Tab nav telemetry parse failed", { error: String(error) });
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = Date.now();
    trimOldEvents(now);

    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to");
    const filtered = isTrackedPath(to) ? tabNavEvents.filter((e) => e.toPath === to) : tabNavEvents;

    const commitValues = filtered.map((e) => e.clickToRouteCommitMs);
    const frameValues = filtered.map((e) => e.clickToFirstFrameMs);
    const idleValues = filtered
        .map((e) => e.clickToIdleMs)
        .filter((v): v is number => typeof v === "number");

    const avg = (values: number[]) =>
        values.length ? Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10 : 0;

    return NextResponse.json({
        window: "24h in-memory",
        totalEvents: filtered.length,
        routeCommit: {
            avgMs: avg(commitValues),
            p50Ms: percentile(commitValues, 50),
            p95Ms: percentile(commitValues, 95),
        },
        firstFrame: {
            avgMs: avg(frameValues),
            p50Ms: percentile(frameValues, 50),
            p95Ms: percentile(frameValues, 95),
        },
        idleReady: {
            avgMs: avg(idleValues),
            p50Ms: percentile(idleValues, 50),
            p95Ms: percentile(idleValues, 95),
        },
        sample: filtered.slice(-10),
    });
}
