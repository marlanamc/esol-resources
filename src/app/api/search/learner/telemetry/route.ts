import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

type TelemetryPayload = {
    type: "query" | "zero_results" | "click_result" | "select_filter";
    context: "search-page" | "quick-open";
    query: string;
    filter: string;
    resultId?: string;
    href?: string;
};

function isTelemetryPayload(value: unknown): value is TelemetryPayload {
    if (!value || typeof value !== "object") return false;
    const payload = value as Partial<TelemetryPayload>;
    return (
        (payload.type === "query" || payload.type === "zero_results" || payload.type === "click_result" || payload.type === "select_filter") &&
        (payload.context === "search-page" || payload.context === "quick-open") &&
        typeof payload.query === "string" &&
        typeof payload.filter === "string"
    );
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "student" && session.user.role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const payload = await request.json();
        if (!isTelemetryPayload(payload)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        logger.info("Learner search telemetry", {
            userId: session.user.id,
            type: payload.type,
            context: payload.context,
            filter: payload.filter,
            query: payload.query.slice(0, 80),
            resultId: payload.resultId,
            href: payload.href,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        logger.warn("Learner search telemetry failed", { error: String(error) });
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}
