"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { DailyChecklistHabit } from "@/lib/daily-habits";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { DashboardHeroCta } from "@/components/dashboard/DashboardHeroCta";

export function PinnedDailyHabitRow({
    habit,
    compact = false,
    embedded = false,
    ctaVariant = "category",
}: {
    habit: DailyChecklistHabit;
    compact?: boolean;
    embedded?: boolean;
    /** Match the Continue card CTA shape; vocabulary uses teal on the homepage stack */
    ctaVariant?: "category" | "vocabulary";
}) {
    const tone = getLearnerCategoryTone("vocabulary");
    const isDoneToday = habit.status === "done-today";
    const hasActionableCards = habit.dueCount > 0 || habit.newCount > 0;
    const visibleNewCount = Math.min(habit.newCount, 6);
    const useCompactCompletedStyle = compact && isDoneToday && !embedded;
    const useCondensedDoneLayout = compact || isDoneToday;
    const ctaLabel = isDoneToday
        ? "Review"
        : !hasActionableCards
            ? "View review"
            : "Start";

    const renderCta = (condensed = false) => {
        if (ctaVariant === "vocabulary") {
            return <DashboardHeroCta label={ctaLabel} variant="vocabulary" iconSize={condensed ? 14 : 16} />;
        }

        return (
            <span
                className={`dashboard-accent-button inline-flex items-center justify-center gap-1.5 !min-h-0 rounded-full font-semibold tracking-tight whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5 ${
                    condensed
                        ? "min-w-[82px] h-9 px-3 text-[13px] sm:min-w-[92px] sm:h-10 sm:px-4 sm:text-sm"
                        : "min-w-[96px] h-10 px-4 text-sm"
                }`}
                style={{
                    "--dashboard-button-accent": tone.accent,
                    "--dashboard-button-text": tone.chipText,
                    borderColor: tone.border,
                } as CSSProperties}
            >
                {ctaLabel}
                <ArrowRight className="h-3.5 w-3.5" />
            </span>
        );
    };

    if (embedded) {
        return (
            <Link
                href={habit.href}
                className={`checklist-row-premium relative block border-b px-4 py-3 transition-colors hover:bg-black/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${isDoneToday ? "opacity-80" : ""}`}
                style={{ borderColor: "var(--dashboard-divider)" }}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isDoneToday
                                    ? "bg-secondary/15 border-secondary/45 text-secondary"
                                    : "text-transparent shadow-sm"
                            }`}
                            style={isDoneToday ? undefined : { backgroundColor: "var(--surface-base)", borderColor: "var(--border-strong)" }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                            Daily Habit
                        </div>
                        <div className="mt-1 text-[13px] sm:text-sm font-semibold leading-tight text-text">
                            {habit.title}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {isDoneToday ? (
                                <span
                                    className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                                    style={{ backgroundColor: tone.chipBg, color: tone.chipText }}
                                >
                                    Done today
                                </span>
                            ) : null}
                            {!isDoneToday && habit.newCount > 0 ? (
                                <span className="inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                    {visibleNewCount} new
                                </span>
                            ) : null}
                            {!isDoneToday && habit.dueCount > 0 ? (
                                <span className="inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                    {habit.dueCount} due
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="shrink-0 pl-1">
                        <span
                            className="dashboard-accent-button inline-flex items-center justify-center !min-h-0 min-w-[82px] h-9 rounded-full px-3 text-[13px] font-semibold tracking-tight whitespace-nowrap sm:min-w-[92px] sm:h-10 sm:px-4 sm:text-sm"
                            style={{
                                "--dashboard-button-accent": tone.accent,
                                "--dashboard-button-text": tone.chipText,
                            } as CSSProperties}
                        >
                            <span>{ctaLabel}</span>
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    if (useCompactCompletedStyle) {
        return (
            <Link
                href={habit.href}
                className="group block rounded-xl border px-3.5 py-2.5 opacity-75 transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                style={{
                    borderColor: `color-mix(in srgb, ${tone.border} 38%, var(--border-subtle))`,
                    background: "var(--surface-subtle)",
                    boxShadow: "none",
                }}
            >
                <div className="relative flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, transparent)`,
                            color: tone.accent,
                        }}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold leading-snug text-text">
                            {habit.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                                className="inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: tone.chipBg,
                                    color: tone.chipText,
                                }}
                            >
                                Vocabulary
                            </span>
                            <span className="text-[10px] font-medium text-text-muted">
                                Completed today
                            </span>
                        </div>
                    </div>

                    {renderCta(true)}
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={habit.href}
            className="group block rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(31,24,18,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            style={{
                borderColor: isDoneToday ? `color-mix(in srgb, ${tone.border} 72%, var(--border-subtle))` : tone.border,
                background: isDoneToday
                    ? `linear-gradient(135deg, color-mix(in srgb, ${tone.surface} 72%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surfaceMuted} 34%, var(--surface-subtle)) 100%)`
                    : `linear-gradient(135deg, color-mix(in srgb, ${tone.surfaceMuted} 74%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surface} 46%, var(--surface-overlay)) 100%)`,
                boxShadow: isDoneToday
                    ? `inset 0 1px 0 color-mix(in srgb, white 10%, transparent), 0 1px 2px color-mix(in srgb, ${tone.accent} 8%, transparent)`
                    : `inset 0 1px 0 color-mix(in srgb, white 14%, transparent), 0 1px 3px color-mix(in srgb, ${tone.accent} 10%, transparent)`,
            }}
        >
            <div className={`${useCondensedDoneLayout ? "px-3.5 py-3" : "px-4 py-4"}`}>
                <div className={`flex justify-between gap-3 ${useCondensedDoneLayout ? "items-center" : "items-start"}`}>
                    <div className={`flex min-w-0 gap-3 ${useCondensedDoneLayout ? "items-center" : "items-start"}`}>
                        <div
                            className={`flex shrink-0 items-center justify-center rounded-xl ${useCondensedDoneLayout ? "h-9 w-9" : "h-10 w-10"}`}
                            style={{
                                backgroundColor: `color-mix(in srgb, ${tone.accent} 16%, var(--surface-elevated))`,
                                color: tone.accent,
                            }}
                        >
                            {isDoneToday ? <CheckCircle2 className={`${useCondensedDoneLayout ? "h-4.5 w-4.5" : "h-5 w-5"}`} /> : <BookOpen className={`${useCondensedDoneLayout ? "h-4.5 w-4.5" : "h-5 w-5"}`} />}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {!useCondensedDoneLayout && isDoneToday ? (
                                    <span
                                        className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, var(--surface-elevated))`,
                                            borderColor: `color-mix(in srgb, ${tone.accent} 30%, var(--border-subtle))`,
                                            color: tone.accentStrong,
                                        }}
                                    >
                                        Done today
                                    </span>
                                ) : null}
                            </div>

                            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                                Daily Habit
                            </div>
                            <h3 className={`${useCondensedDoneLayout ? "mt-1 text-[14px] sm:text-[15px]" : "mt-2 text-[15px] sm:text-base"} font-display font-bold leading-tight text-text`}>
                                {habit.title}
                            </h3>
                            {useCondensedDoneLayout && isDoneToday ? (
                                <div className="mt-1">
                                    <span
                                        className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, var(--surface-elevated))`,
                                            borderColor: `color-mix(in srgb, ${tone.accent} 30%, var(--border-subtle))`,
                                            color: tone.accentStrong,
                                        }}
                                    >
                                        Done today
                                    </span>
                                </div>
                            ) : null}
                            {!useCondensedDoneLayout ? (
                                <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">
                                    {habit.description}
                                </p>
                            ) : null}

                            <div className={`${useCondensedDoneLayout ? "mt-1" : "mt-2"} flex flex-wrap items-center gap-2`}>
                                {!isDoneToday && habit.dueCount > 0 ? (
                                    <span className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                        {habit.dueCount} due today
                                    </span>
                                ) : null}
                                {!isDoneToday && habit.newCount > 0 ? (
                                    <span className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                        {visibleNewCount} new
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        {renderCta(useCondensedDoneLayout)}
                    </div>
                </div>
            </div>
        </Link>
    );
}
