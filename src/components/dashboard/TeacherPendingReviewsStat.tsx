"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardIcon } from "@/components/icons/Icons";

type PendingReviewsResponse = { pendingReviews: number };

interface TeacherPendingReviewsStatProps {
    mobile?: boolean;
}

type PendingReviewsCache = {
    data: number;
    cachedAt: number;
};

const PENDING_REVIEWS_CACHE_TTL_MS = 60_000;
let pendingReviewsCache: PendingReviewsCache | null = null;
let pendingReviewsInFlight: Promise<number | null> | null = null;

function getFreshPendingReviewsCache(): number | null {
    if (!pendingReviewsCache) return null;
    if (Date.now() - pendingReviewsCache.cachedAt > PENDING_REVIEWS_CACHE_TTL_MS) return null;
    return pendingReviewsCache.data;
}

async function loadPendingReviews(): Promise<number | null> {
    const cached = getFreshPendingReviewsCache();
    if (cached !== null) return cached;
    if (pendingReviewsInFlight) return pendingReviewsInFlight;

    pendingReviewsInFlight = (async () => {
        try {
            const res = await fetch("/api/dashboard/teacher-summary", { cache: "no-store" });
            if (!res.ok) return null;
            const data = (await res.json()) as PendingReviewsResponse;
            const value = data.pendingReviews ?? 0;
            pendingReviewsCache = { data: value, cachedAt: Date.now() };
            return value;
        } catch {
            return null;
        } finally {
            pendingReviewsInFlight = null;
        }
    })();

    return pendingReviewsInFlight;
}

export function TeacherPendingReviewsStat({ mobile = false }: TeacherPendingReviewsStatProps) {
    const [pendingReviews, setPendingReviews] = useState<number | null>(() => getFreshPendingReviewsCache());

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const value = await loadPendingReviews();
            if (!cancelled && value !== null) setPendingReviews(value);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (pendingReviews === null) {
        return <div className={`skeleton rounded-full ${mobile ? "h-9 w-28" : "h-12 w-32"}`} />;
    }
    if (pendingReviews <= 0) return null;

    return mobile ? (
        <Link
            href="/dashboard/stats"
            className="flex items-center gap-2 bg-[#f7f3ec] border border-[#e2d9cc] rounded-full pl-2 pr-3 py-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b79e80]"
        >
            <div className="w-7 h-7 bg-[#f2ede5] rounded-full flex items-center justify-center">
                <ClipboardIcon className="text-[#9f6f3a]" />
            </div>
            <div>
                <div className="text-[9px] font-bold uppercase tracking-wide text-text-muted leading-none">Reviews</div>
                <div className="text-base font-semibold text-text leading-tight">
                    {pendingReviews} <span className="text-[10px] font-medium text-text-muted">new</span>
                </div>
            </div>
        </Link>
    ) : (
        <Link
            href="/dashboard/stats"
            className="flex items-center gap-2.5 bg-white/90 border border-amber-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all"
        >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center">
                <ClipboardIcon className="text-warning" size={16} />
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Reviews</div>
                <div className="text-lg font-bold text-text leading-tight">
                    {pendingReviews} <span className="text-xs font-semibold text-text-muted">new</span>
                </div>
            </div>
        </Link>
    );
}
