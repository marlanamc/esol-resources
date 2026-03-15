"use client";

import { useEffect, useState } from "react";

/**
 * Response shape from the student dashboard summary API (points, streak, weekly points).
 */
export type StudentSummaryResponse = {
    totalPoints: number;
    effectiveCurrentStreak: number;
    actualWeeklyPoints: number;
};

type StudentSummaryCache = {
    data: StudentSummaryResponse;
    cachedAt: number;
};

const STUDENT_SUMMARY_CACHE_TTL_MS = 60_000;

let studentSummaryCache: StudentSummaryCache | null = null;
let studentSummaryInFlight: Promise<StudentSummaryResponse | null> | null = null;

/**
 * Returns cached student summary if still within TTL (1 minute). Use for initial render before fetch.
 */
export function getFreshStudentSummaryCache(): StudentSummaryResponse | null {
    if (!studentSummaryCache) return null;
    if (Date.now() - studentSummaryCache.cachedAt > STUDENT_SUMMARY_CACHE_TTL_MS) return null;
    return studentSummaryCache.data;
}

/**
 * Fetches student summary from the API, with in-memory cache and request deduplication.
 * @returns Cached or freshly fetched summary, or null on error
 */
export async function loadStudentSummary(): Promise<StudentSummaryResponse | null> {
    const cached = getFreshStudentSummaryCache();
    if (cached) return cached;

    if (studentSummaryInFlight) return studentSummaryInFlight;

    studentSummaryInFlight = (async () => {
        try {
            const res = await fetch("/api/dashboard/student-summary", { cache: "no-store" });
            if (!res.ok) return null;

            const data = (await res.json()) as StudentSummaryResponse;
            studentSummaryCache = { data, cachedAt: Date.now() };
            return data;
        } catch {
            return null;
        } finally {
            studentSummaryInFlight = null;
        }
    })();

    return studentSummaryInFlight;
}

/**
 * Subscribes to student dashboard summary (points, streak, weekly points).
 * Uses a short-lived cache and shared in-flight request to avoid duplicate fetches.
 * @returns Current summary or null while loading / on error
 */
export function useStudentSummary() {
    const [summary, setSummary] = useState<StudentSummaryResponse | null>(() => getFreshStudentSummaryCache());

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const data = await loadStudentSummary();
            if (!cancelled && data) {
                setSummary(data);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return summary;
}
