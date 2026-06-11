export const RETURN_TO_QUERY_PARAM = "returnTo";
export const ACTIVITIES_LAST_HREF_STORAGE_KEY = "dashboard-activities-last-href-v1";

export function sanitizeInternalHref(value: string | null | undefined): string | null {
    if (!value) return null;

    const trimmed = value.trim();
    if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
        return null;
    }

    try {
        const parsed = new URL(trimmed, "https://class-companion.local");
        if (parsed.origin !== "https://class-companion.local") {
            return null;
        }
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return null;
    }
}

export function withReturnTo(href: string, returnTo: string | null | undefined): string {
    const sanitizedHref = sanitizeInternalHref(href);
    if (!sanitizedHref) {
        return href;
    }

    const sanitizedReturnTo = sanitizeInternalHref(returnTo);
    if (!sanitizedReturnTo) {
        return sanitizedHref;
    }

    const nextUrl = new URL(sanitizedHref, "https://class-companion.local");
    nextUrl.searchParams.set(RETURN_TO_QUERY_PARAM, sanitizedReturnTo);
    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
}

export function buildActivityHref(activityId: string, assignmentId?: string | null): string {
    const encodedActivityId = encodeURIComponent(activityId);
    if (!assignmentId) {
        return `/activity/${encodedActivityId}`;
    }

    const qs = new URLSearchParams({ assignment: assignmentId });
    return `/activity/${encodedActivityId}?${qs.toString()}`;
}

export function buildReturnStorageKey(pathname: string, assignmentId?: string | null): string {
    return `learner-return:${pathname}:${assignmentId ?? ""}`;
}

/**
 * Resolves the learner "return" destination synchronously, reading sessionStorage when available.
 * Same precedence as useResolvedLearnerReturnHref. Call this at interaction time (e.g. in a click
 * handler) so navigation never uses a stale fallback painted before the async sources resolved.
 */
export function resolveLearnerReturnHrefSync(options: {
    pathname: string;
    search: string;
    fallbackHref?: string | null;
}): string {
    const params = new URLSearchParams(options.search);
    const explicitReturnTo = sanitizeInternalHref(params.get(RETURN_TO_QUERY_PARAM));
    const legacyGrammarMap = params.get("from") === "grammar-map" ? "/grammar-map" : null;
    const fallback = sanitizeInternalHref(options.fallbackHref) ?? "/dashboard";

    if (typeof window === "undefined") {
        return explicitReturnTo ?? legacyGrammarMap ?? fallback;
    }

    const storageKey = buildReturnStorageKey(options.pathname, params.get("assignment"));
    const storedReturnTo = sanitizeInternalHref(window.sessionStorage.getItem(storageKey));
    const activitiesMemory = sanitizeInternalHref(
        window.sessionStorage.getItem(ACTIVITIES_LAST_HREF_STORAGE_KEY)
    );

    return explicitReturnTo ?? storedReturnTo ?? legacyGrammarMap ?? activitiesMemory ?? fallback;
}
