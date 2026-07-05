import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { logger } from "@/lib/shared/logger";
import { clampLearnerSearchLimit, normalizeLearnerSearchText, parseLearnerSearchFilter, searchLearnerContent } from "@/lib/learner-search";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import type { LearnerSearchContext } from "@/lib/learner-search/types";
import { ApiErrors } from "@/lib/api/response";

function isLearnerSearchContext(value: string | null): value is LearnerSearchContext {
    return value === "quick-open" || value === "search-page";
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return ApiErrors.unauthorized();
    }
    if (session.user.role !== "student" && !canUseTeacherTools(session.user)) {
        return ApiErrors.forbidden();
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const rawFilter = searchParams.get("filter");
    const filter = parseLearnerSearchFilter(rawFilter) ?? "all";
    const context = isLearnerSearchContext(searchParams.get("context")) ? searchParams.get("context") : "search-page";
    const limit = clampLearnerSearchLimit(Number(searchParams.get("limit")), context === "quick-open" ? 8 : 24);

    const response = await searchLearnerContent({
        query,
        filter,
        limit,
        viewer: canUseTeacherTools(session.user)
            ? {
                role: "teacher",
                userId: session.user.id,
                admin: isAdmin(session.user),
            }
            : { role: "student" },
    });

    if (normalizeLearnerSearchText(query).length > 0 && response.totalCount === 0) {
        logger.info("Learner search zero results", {
            userId: session.user.id,
            context,
            filter,
            query: normalizeLearnerSearchText(query).slice(0, 80),
        });
    }

    return NextResponse.json(response);
}
