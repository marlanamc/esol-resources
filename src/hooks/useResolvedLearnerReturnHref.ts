"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
    ACTIVITIES_LAST_HREF_STORAGE_KEY,
    RETURN_TO_QUERY_PARAM,
    buildReturnStorageKey,
    sanitizeInternalHref,
} from "@/lib/learner-navigation";

interface UseResolvedLearnerReturnHrefOptions {
    fallbackHref?: string;
}

/**
 * Resolves the "return" URL for learner flows (e.g. after completing an activity).
 * Uses query param, session storage, or activities last-href; falls back to the given href or /dashboard.
 * @param options.fallbackHref - Default destination when no return target is stored (default: "/dashboard")
 * @returns The resolved href string to use for back navigation
 */
export function useResolvedLearnerReturnHref({
    fallbackHref = "/dashboard",
}: UseResolvedLearnerReturnHrefOptions = {}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = searchParams.toString();
    const assignmentId = searchParams.get("assignment");
    const [resolvedHref, setResolvedHref] = useState(fallbackHref);

    const storageKey = useMemo(
        () => buildReturnStorageKey(pathname, assignmentId),
        [assignmentId, pathname]
    );

    useEffect(() => {
        const params = new URLSearchParams(searchKey);
        const explicitReturnTo = sanitizeInternalHref(params.get(RETURN_TO_QUERY_PARAM));
        const legacyGrammarMap = params.get("from") === "grammar-map" ? "/grammar-map" : null;
        const activitiesMemory = sanitizeInternalHref(window.sessionStorage.getItem(ACTIVITIES_LAST_HREF_STORAGE_KEY));
        const storedReturnTo = sanitizeInternalHref(window.sessionStorage.getItem(storageKey));
        const fallback = sanitizeInternalHref(fallbackHref) ?? "/dashboard";

        const nextHref =
            explicitReturnTo ??
            storedReturnTo ??
            legacyGrammarMap ??
            activitiesMemory ??
            fallback;

        window.sessionStorage.setItem(storageKey, nextHref);
        setResolvedHref(nextHref);
    }, [fallbackHref, searchKey, storageKey]);

    return resolvedHref;
}
