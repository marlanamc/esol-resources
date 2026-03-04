"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FlameIcon, StarIcon, TrophyIcon } from "@/components/icons/Icons";

type StudentSummaryResponse = {
    totalPoints: number;
    effectiveCurrentStreak: number;
    actualWeeklyPoints: number;
};

interface StudentQuickStatsProps {
    mobile?: boolean;
}

export function StudentQuickStats({ mobile = false }: StudentQuickStatsProps) {
    const [summary, setSummary] = useState<StudentSummaryResponse | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/dashboard/student-summary", { cache: "no-store" });
                if (!res.ok) return;
                const data = (await res.json()) as StudentSummaryResponse;
                if (!cancelled) setSummary(data);
            } catch {
                // Fail-soft: keep cards hidden.
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (!summary) {
        return (
            <div className={`flex gap-3 ${mobile ? "flex-wrap" : ""}`}>
                <div className={`skeleton rounded-full ${mobile ? "h-9 w-24" : "h-12 w-32"}`} />
                <div className={`skeleton rounded-full ${mobile ? "h-9 w-28" : "h-12 w-36"}`} />
                <div className={`skeleton rounded-full ${mobile ? "h-9 w-24" : "h-12 w-32"}`} />
            </div>
        );
    }

    const chips: ReactNode[] = [];

    if (summary.effectiveCurrentStreak > 0) {
        chips.push(
            <Link
                key="streak"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${mobile ? "pl-2 pr-3 py-1.5" : "pl-2.5 pr-4 py-2"} bg-[#f7f3ec] border border-[#e2d9cc] rounded-full shadow-sm`}
            >
                <div className={`${mobile ? "w-7 h-7" : "w-8 h-8"} bg-[#fff9f2] rounded-full flex items-center justify-center`}>
                    <FlameIcon className="text-[#b97a45]" size={mobile ? 14 : 16} />
                </div>
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide text-text-muted leading-none`}>Streak</div>
                    <div className={`${mobile ? "text-base" : "text-base"} font-semibold text-text leading-tight`}>
                        {summary.effectiveCurrentStreak} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-medium text-text-muted`}>days</span>
                    </div>
                </div>
            </Link>
        );
    }

    if (summary.actualWeeklyPoints > 0) {
        chips.push(
            <Link
                key="weekly"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${mobile ? "pl-2 pr-3.5 py-2" : "pl-2.5 pr-4 py-2.5"} bg-white border border-[#ccb79c] rounded-full shadow-[0_2px_8px_rgba(64,46,28,0.08)]`}
            >
                <div className={`${mobile ? "w-8 h-8" : "w-9 h-9"} bg-[#f7f0e4] rounded-full flex items-center justify-center`}>
                    <StarIcon className="text-[#9f6f3a]" size={mobile ? 15 : 17} />
                </div>
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide text-[#6a5947] leading-none`}>This Week</div>
                    <div className={`${mobile ? "text-lg" : "text-xl"} font-bold text-text leading-tight`}>
                        {summary.actualWeeklyPoints} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-semibold text-text-muted`}>pts</span>
                    </div>
                </div>
            </Link>
        );
    }

    if (summary.totalPoints > 0) {
        chips.push(
            <Link
                key="total"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${mobile ? "pl-2 pr-3 py-1.5" : "pl-2.5 pr-4 py-2"} bg-[#f7f3ec] border border-[#e2d9cc] rounded-full shadow-sm`}
            >
                <div className={`${mobile ? "w-7 h-7" : "w-8 h-8"} bg-[#f1f4ec] rounded-full flex items-center justify-center`}>
                    <TrophyIcon className="text-[#6a8b61]" size={mobile ? 14 : 16} />
                </div>
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide text-text-muted leading-none`}>Total</div>
                    <div className="text-base font-semibold text-text leading-tight">
                        {summary.totalPoints} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-medium text-text-muted`}>pts</span>
                    </div>
                </div>
            </Link>
        );
    }

    return <>{chips}</>;
}
