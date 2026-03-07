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

type StudentSummaryCache = {
    data: StudentSummaryResponse;
    cachedAt: number;
};

const STUDENT_SUMMARY_CACHE_TTL_MS = 60_000;
let studentSummaryCache: StudentSummaryCache | null = null;
let studentSummaryInFlight: Promise<StudentSummaryResponse | null> | null = null;

function getFreshStudentSummaryCache(): StudentSummaryResponse | null {
    if (!studentSummaryCache) return null;
    if (Date.now() - studentSummaryCache.cachedAt > STUDENT_SUMMARY_CACHE_TTL_MS) return null;
    return studentSummaryCache.data;
}

async function loadStudentSummary(): Promise<StudentSummaryResponse | null> {
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

interface StudentQuickStatsProps {
    mobile?: boolean;
    maxVisible?: number;
    chipKeys?: Array<"streak" | "weekly" | "total">;
    compact?: boolean;
}

export function StudentQuickStats({ mobile = false, maxVisible = 3, chipKeys, compact = false }: StudentQuickStatsProps) {
    const [summary, setSummary] = useState<StudentSummaryResponse | null>(() => getFreshStudentSummaryCache());

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await loadStudentSummary();
            if (!cancelled && data) setSummary(data);
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

    const isHotStreak = summary.effectiveCurrentStreak >= 7;
    const shellClass = "surface-elevated surface-card-shadow border";

    if (summary.effectiveCurrentStreak > 0) {
        chips.push(
            <Link
                key="streak"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${
                    compact
                        ? "px-1.5 py-1 gap-1"
                        : mobile
                        ? "pl-2 pr-3 py-1.5"
                        : "pl-2.5 pr-4 py-2"
                } ${shellClass} rounded-full transition-shadow duration-300`}
                style={{
                    background: isHotStreak
                        ? 'linear-gradient(90deg, var(--tone-speaking-chip-bg) 0%, var(--tone-quizzes-chip-bg) 100%)'
                        : 'var(--surface-elevated)',
                    borderColor: isHotStreak ? 'var(--tone-speaking-border)' : 'var(--border-subtle)',
                    boxShadow: isHotStreak ? '0 0 12px rgba(245, 217, 138, 0.18)' : undefined,
                }}
            >
                <div className={`${compact ? "w-3.5 h-3.5" : mobile ? "w-7 h-7" : "w-8 h-8"} rounded-full flex items-center justify-center ${
                    isHotStreak ? '' : ''
                }`}
                style={{
                    background: isHotStreak
                        ? 'linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-bg, var(--tone-speaking-surface)) 100%)'
                        : 'var(--surface-subtle)',
                }}>
                    <FlameIcon className={isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"} size={compact ? 10 : mobile ? 14 : 16} />
                </div>
                {compact ? (
                    <span className="text-[11px] font-bold text-text leading-none">{summary.effectiveCurrentStreak}</span>
                ) : (
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide leading-none ${
                        isHotStreak ? 'text-[var(--tone-speaking-chip-text)]' : 'text-text-muted'
                    }`}>Streak</div>
                    <div className={`${mobile ? "text-base" : "text-base"} font-semibold text-text leading-tight`}>
                        {summary.effectiveCurrentStreak} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-medium text-text-muted`}>days</span>
                    </div>
                </div>
                )}
            </Link>
        );
    }

    if (summary.actualWeeklyPoints > 0) {
        chips.push(
            <Link
                key="weekly"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${
                    compact
                        ? "px-1.5 py-1 gap-1"
                        : mobile
                        ? "pl-2 pr-3.5 py-2"
                        : "pl-2.5 pr-4 py-2.5"
                } ${shellClass} rounded-full`}
                style={{
                    background: 'linear-gradient(90deg, var(--surface-elevated) 0%, var(--tone-speaking-surface-muted) 100%)',
                    borderColor: 'var(--tone-speaking-border)',
                }}
            >
                <div
                    className={`${compact ? "w-3.5 h-3.5" : mobile ? "w-8 h-8" : "w-9 h-9"} rounded-full flex items-center justify-center`}
                    style={{ background: 'linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)' }}
                >
                    <StarIcon className="text-[var(--tone-speaking-accent)]" size={compact ? 10 : mobile ? 15 : 17} />
                </div>
                {compact ? (
                    <span className="text-[11px] font-bold text-text leading-none">{summary.actualWeeklyPoints}</span>
                ) : (
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide leading-none text-[var(--tone-speaking-chip-text)]`}>This Week</div>
                    <div className={`${mobile ? "text-lg" : "text-xl"} font-bold text-text leading-tight`}>
                        {summary.actualWeeklyPoints} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-semibold text-text-muted`}>pts</span>
                    </div>
                </div>
                )}
            </Link>
        );
    }

    if (summary.totalPoints > 0) {
        chips.push(
            <Link
                key="total"
                href="/dashboard/profile"
                className={`flex items-center gap-2 ${mobile ? "pl-2 pr-3 py-1.5" : "pl-2.5 pr-4 py-2"} ${shellClass} rounded-full`}
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--tone-grammar-border)' }}
            >
                <div
                    className={`${mobile ? "w-7 h-7" : "w-8 h-8"} rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: 'var(--tone-grammar-chip-bg)' }}
                >
                    <TrophyIcon className="text-[var(--tone-grammar-accent)]" size={mobile ? 14 : 16} />
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

    const filteredChips = chipKeys?.length
        ? chips.filter((chip) => {
              const key = (chip as { key?: string }).key;
              return key ? chipKeys.includes(key as "streak" | "weekly" | "total") : false;
          })
        : chips;
    const visibleChips = maxVisible > 0 ? filteredChips.slice(0, maxVisible) : [];

    return <>{visibleChips}</>;
}
