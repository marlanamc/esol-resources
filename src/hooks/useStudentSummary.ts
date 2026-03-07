"use client";

import { useEffect, useState } from "react";

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

export function getFreshStudentSummaryCache(): StudentSummaryResponse | null {
    if (!studentSummaryCache) return null;
    if (Date.now() - studentSummaryCache.cachedAt > STUDENT_SUMMARY_CACHE_TTL_MS) return null;
    return studentSummaryCache.data;
}

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
