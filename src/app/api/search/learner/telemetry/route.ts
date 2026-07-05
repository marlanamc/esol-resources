import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { logger } from "@/lib/shared/logger";
import { ApiErrors, apiError } from "@/lib/api/response";
import { canUseTeacherTools } from "@/lib/auth/roles";

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
        return ApiErrors.unauthorized();
    }
    if (session.user.role !== "student" && !canUseTeacherTools(session.user)) {
        return ApiErrors.forbidden();
    }

    try {
        const payload = await request.json();
        if (!isTelemetryPayload(payload)) {
            return apiError("Invalid payload", 400);
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
    } catch {
        return apiError("Invalid payload", 400);
    }
}
