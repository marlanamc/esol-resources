"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FlameIcon, StarIcon, TrophyIcon } from "@/components/icons/Icons";
import { useStudentSummary } from "@/hooks/useStudentSummary";

interface StudentQuickStatsProps {
    mobile?: boolean;
    maxVisible?: number;
    chipKeys?: Array<"streak" | "weekly" | "total">;
    compact?: boolean;
    /** Tighter spacing for inline use (e.g. checklist header) */
    tight?: boolean;
}

export function StudentQuickStats({ mobile = false, maxVisible = 3, chipKeys, compact = false, tight = false }: StudentQuickStatsProps) {
    const summary = useStudentSummary();

    if (!summary) {
        return (
            <div className={`flex ${tight ? "gap-1" : "gap-3"} ${mobile && !tight ? "flex-wrap" : ""}`}>
                <div className={`skeleton rounded-full ${tight ? "h-6 w-14" : mobile ? "h-9 w-24" : "h-12 w-32"}`} />
                <div className={`skeleton rounded-full ${tight ? "h-6 w-16" : mobile ? "h-9 w-28" : "h-12 w-36"}`} />
                {!tight && <div className={`skeleton rounded-full ${mobile ? "h-9 w-24" : "h-12 w-32"}`} />}
            </div>
        );
    }

    const chips: ReactNode[] = [];

    const isHotStreak = summary.effectiveCurrentStreak >= 7;
    const shellClass = "surface-elevated surface-card-shadow border";

    const pad = tight ? "px-2.5 py-1 gap-1" : compact ? "px-3 py-1.5 gap-1.5" : mobile ? "pl-2 pr-3 py-1.5 gap-2" : "pl-2.5 pr-4 py-2 gap-2";
    const iconBox = tight ? "w-4 h-4" : compact ? "w-5 h-5" : mobile ? "w-7 h-7" : "w-8 h-8";
    const iconSz = tight ? 10 : compact ? 12 : mobile ? 14 : 16;
    const textSz = tight ? "text-[12px]" : compact ? "text-[13px]" : "";

    if (summary.effectiveCurrentStreak > 0) {
        chips.push(
            <Link
                key="streak"
                href="/dashboard/profile"
                className={`flex items-center ${pad} ${shellClass} rounded-full transition-shadow duration-300`}
                style={{
                    background: (compact || tight)
                        ? 'linear-gradient(135deg, var(--surface-elevated) 0%, var(--tone-quizzes-surface-muted, var(--surface-subtle)) 100%)'
                        : isHotStreak
                            ? 'linear-gradient(90deg, var(--tone-speaking-chip-bg) 0%, var(--tone-quizzes-chip-bg) 100%)'
                            : 'var(--surface-elevated)',
                    borderColor: (compact || tight) ? 'var(--tone-quizzes-border)' : isHotStreak ? 'var(--tone-speaking-border)' : 'var(--border-subtle)',
                    boxShadow: isHotStreak && !compact && !tight ? '0 0 12px rgba(245, 217, 138, 0.18)' : undefined,
                }}
            >
                <div className={`${iconBox} rounded-full flex items-center justify-center`}
                style={{
                    background: (compact || tight)
                        ? 'linear-gradient(135deg, var(--tone-quizzes-chip-bg) 0%, var(--tone-quizzes-surface) 100%)'
                        : isHotStreak
                            ? 'linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-bg, var(--tone-speaking-surface)) 100%)'
                            : 'var(--surface-subtle)',
                }}>
                    <FlameIcon className={(compact || tight) ? "text-[var(--tone-quizzes-accent)]" : isHotStreak ? "text-[var(--tone-speaking-accent)]" : "text-[var(--tone-quizzes-accent)]"} size={iconSz} />
                </div>
                {(compact || tight) ? (
                    <span className={`${textSz || "text-[13px]"} font-bold text-text leading-none`}>{summary.effectiveCurrentStreak}</span>
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
                className={`flex items-center ${pad} ${shellClass} rounded-full`}
                style={{
                    background: compact
                        ? 'linear-gradient(135deg, var(--surface-elevated) 0%, var(--tone-speaking-surface-muted) 100%)'
                        : 'linear-gradient(90deg, var(--surface-elevated) 0%, var(--tone-speaking-surface-muted) 100%)',
                    borderColor: 'var(--tone-speaking-border)',
                }}
            >
                <div
                    className={`${iconBox} rounded-full flex items-center justify-center`}
                    style={{ background: 'linear-gradient(135deg, var(--tone-speaking-chip-bg) 0%, var(--tone-speaking-surface) 100%)' }}
                >
                    <StarIcon className="text-[var(--tone-speaking-accent)]" size={tight ? 10 : compact ? 12 : mobile ? 15 : 17} />
                </div>
                {(compact || tight) ? (
                    <span className={`${textSz || "text-[13px]"} font-bold text-text leading-none`}>{summary.actualWeeklyPoints}</span>
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
