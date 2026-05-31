"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FlameIcon, StarIcon, TrophyIcon } from "@/components/icons/Icons";
import { useStudentSummary } from "@/hooks/useStudentSummary";

interface StudentQuickStatsProps {
    mobile?: boolean;
    maxVisible?: number;
    chipKeys?: Array<"streak" | "weekly" | "total">;
    compact?: boolean;
    /** Tighter spacing for inline use (e.g. checklist header) */
    tight?: boolean;
    /** When false, render chips as static elements (e.g. inside a parent link) */
    linked?: boolean;
}

export function StudentQuickStats({
    mobile = false,
    maxVisible = 3,
    chipKeys,
    compact = false,
    tight = false,
    linked = true,
}: StudentQuickStatsProps) {
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
    const shellClass = "dashboard-pill stats-badge-polish";

    const renderChipShell = (
        key: string,
        className: string,
        style: CSSProperties,
        children: ReactNode,
    ) => {
        if (linked) {
            return (
                <Link key={key} href="/dashboard/profile" className={className} style={style}>
                    {children}
                </Link>
            );
        }
        return (
            <div key={key} className={className} style={style}>
                {children}
            </div>
        );
    };

    const pad = tight ? "px-2.5 py-1 gap-1" : compact ? "px-3 py-1.5 gap-1.5" : mobile ? "pl-2 pr-3 py-1.5 gap-2" : "pl-2.5 pr-4 py-2 gap-2";
    const iconBox = tight ? "w-4 h-4" : compact ? "w-5 h-5" : mobile ? "w-7 h-7" : "w-8 h-8";
    const iconSz = tight ? 10 : compact ? 12 : mobile ? 14 : 16;
    const textSz = tight ? "text-[12px]" : compact ? "text-[13px]" : "";

    if (summary.effectiveCurrentStreak > 0) {
        chips.push(
            renderChipShell(
                "streak",
                `flex items-center ${pad} ${shellClass} rounded-full transition-shadow duration-300`,
                {
                    background: (compact || tight)
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 10%, var(--dashboard-surface-end)) 100%)'
                        : isHotStreak
                            ? 'linear-gradient(90deg, color-mix(in srgb, var(--tone-speaking-surface) 18%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 14%, var(--dashboard-surface-end)) 100%)'
                            : 'linear-gradient(135deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)',
                    borderColor: (compact || tight)
                        ? 'color-mix(in srgb, var(--tone-quizzes-border) 72%, var(--dashboard-border))'
                        : isHotStreak
                            ? 'var(--tone-speaking-border)'
                            : 'var(--dashboard-border)',
                },
                <>
                <div className={`${iconBox} rounded-full flex items-center justify-center`}
                style={{
                    background: (compact || tight)
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-chip-bg) 42%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-quizzes-surface) 28%, var(--dashboard-surface-end)) 100%)'
                        : isHotStreak
                            ? 'linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-chip-bg) 48%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface) 26%, var(--dashboard-surface-end)) 100%)'
                            : 'color-mix(in srgb, var(--tone-quizzes-surface) 18%, var(--dashboard-surface-start))',
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
                </>,
            ),
        );
    }

    if (summary.actualWeeklyPoints > 0) {
        chips.push(
            renderChipShell(
                "weekly",
                `flex items-center ${pad} ${shellClass} rounded-full`,
                {
                    background: compact
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-surface) 16%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface-muted) 18%, var(--dashboard-surface-end)) 100%)'
                        : 'linear-gradient(90deg, color-mix(in srgb, var(--tone-speaking-surface) 14%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface-muted) 20%, var(--dashboard-surface-end)) 100%)',
                    borderColor: 'color-mix(in srgb, var(--tone-speaking-border) 84%, var(--dashboard-border))',
                },
                <>
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
                </>,
            ),
        );
    }

    if (summary.totalPoints > 0) {
        chips.push(
            renderChipShell(
                "total",
                `flex items-center gap-2 ${mobile ? "pl-2 pr-3 py-1.5" : "pl-2.5 pr-4 py-2"} ${shellClass}`,
                {
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--tone-grammar-surface) 14%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-grammar-surface) 8%, var(--dashboard-surface-end)) 100%)',
                    borderColor: 'color-mix(in srgb, var(--tone-grammar-border) 84%, var(--dashboard-border))',
                },
                <>
                <div
                    className={`${mobile ? "w-7 h-7" : "w-8 h-8"} rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: 'color-mix(in srgb, var(--tone-grammar-chip-bg) 50%, var(--dashboard-surface-start))' }}
                >
                    <TrophyIcon className="text-[var(--tone-grammar-accent)]" size={mobile ? 14 : 16} />
                </div>
                <div>
                    <div className={`${mobile ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wide text-text-muted leading-none`}>Total</div>
                    <div className="text-base font-semibold text-text leading-tight">
                        {summary.totalPoints} <span className={`${mobile ? "text-[10px]" : "text-xs"} font-medium text-text-muted`}>pts</span>
                    </div>
                </div>
                </>,
            ),
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
