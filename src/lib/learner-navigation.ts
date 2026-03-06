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
