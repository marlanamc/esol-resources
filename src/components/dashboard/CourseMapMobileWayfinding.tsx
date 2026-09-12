"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Play } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CurrentMapWeekMeta, WeekProgressEntry } from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";

export interface MobileWayfindingCurrentActivity {
    title: string;
    href: string;
    iconEmoji: string;
    typeLabel: string;
}

interface Props {
    units: CourseMapUnit[];
    weekProgress: WeekProgressEntry[];
    currentWeek: CurrentMapWeekMeta | null;
    overallPct: number;
    completedLevels: number;
    totalLevels: number;
    /** School-year month labels — classroom learners only */
    showUnitMonths?: boolean;
    currentActivity?: MobileWayfindingCurrentActivity | null;
    /** Sit flush inside the open unit card instead of as a separate panel */
    embedded?: boolean;
    /** When set, the locator follows the open week instead of scroll position */
    pinnedUnitNumber?: number | null;
    pinnedWeekNumber?: number | null;
}

export function CourseMapMobileWayfinding({
    units,
    weekProgress,
    currentWeek,
    overallPct,
    completedLevels,
    totalLevels,
    showUnitMonths = true,
    currentActivity = null,
    embedded = false,
    pinnedUnitNumber = null,
    pinnedWeekNumber = null,
}: Props) {
    const { activeUnitNumber, activeWeekNumber } = useCourseMapScrollSpy(units);
    const unitNumber = pinnedUnitNumber ?? activeUnitNumber;
    const weekNumber = pinnedWeekNumber ?? activeWeekNumber;

    const meta = useMemo(() => {
        const resolvedUnit = unitNumber ?? currentWeek?.unitNumber ?? units[0]?.unitNumber;
        if (resolvedUnit == null) return null;
        const unit = units.find((entry) => entry.unitNumber === resolvedUnit);
        if (!unit) return null;
        const resolvedWeek = weekNumber ?? currentWeek?.weekNumber ?? unit.levels[0]?.levelNumber ?? null;
        const level = resolvedWeek != null
            ? unit.levels.find((entry) => entry.levelNumber === resolvedWeek)
            : undefined;
        const weekEntry = resolvedWeek != null
            ? weekProgress.find((entry) => entry.weekNumber === resolvedWeek)
            : undefined;
        return {
            unitMonth: unit.month,
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            weekNumber: resolvedWeek,
            levelTitle: level?.levelTitle ?? weekEntry?.title ?? null,
            levelDone: weekEntry?.done ?? null,
            levelTotal: weekEntry?.total ?? null,
        };
    }, [currentWeek, unitNumber, units, weekNumber, weekProgress]);

    if (!meta) return null;

    const tone = getCourseMapUnitTone(meta.unitNumber);
    const hasLevelProgress =
        meta.levelDone != null && meta.levelTotal != null && meta.levelTotal > 0;
    const levelDone = meta.levelDone ?? 0;
    const levelTotal = meta.levelTotal ?? 0;
    const levelPct = hasLevelProgress ? Math.round((levelDone / levelTotal) * 100) : 0;

    return (
        <div
            className={embedded ? undefined : "overflow-hidden rounded-2xl border"}
            style={embedded ? undefined : {
                borderColor: `color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-border))`,
                backgroundColor: "var(--surface-subtle)",
            }}
            aria-live="polite"
        >
            <div
                className="px-4 pt-3 pb-3"
                style={{
                    background: `color-mix(in srgb, ${tone.surface} 70%, var(--dashboard-surface-start))`,
                }}
            >
                <h1 className="font-display text-[17px] font-bold leading-tight text-text">
                    <span style={{ color: tone.accent }}>Unit {meta.unitNumber}:</span>{" "}
                    {meta.unitTitle}
                    {showUnitMonths ? (
                        <span className="ml-1.5 text-[11px] font-normal text-text-muted">
                            {meta.unitMonth}
                        </span>
                    ) : null}
                </h1>
                {meta.weekNumber != null && meta.levelTitle ? (
                    <p className="mt-1 text-[13px] leading-tight text-text">
                        <span className="font-semibold" style={{ color: tone.accent }}>
                            {formatLevelLabel(meta.weekNumber, showUnitMonths)}
                        </span>
                        <span className="text-text-muted" aria-hidden>{" · "}</span>
                        <span className="font-semibold">{meta.levelTitle}</span>
                    </p>
                ) : null}

                {hasLevelProgress ? (
                    <div className="mt-2 flex items-center gap-2">
                        <div
                            className="relative h-2 flex-1 overflow-hidden rounded-full"
                            style={{
                                background: "var(--bg)",
                                border: "1px solid var(--border-subtle)",
                            }}
                            role="progressbar"
                            aria-valuenow={levelDone}
                            aria-valuemin={0}
                            aria-valuemax={levelTotal}
                            aria-label={`${showUnitMonths ? "Week" : "Level"} progress: ${levelDone} of ${levelTotal} activities done`}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                                style={{
                                    width: `${levelPct}%`,
                                    background: "var(--primary)",
                                }}
                            />
                        </div>
                        <span className="shrink-0 text-[12px] font-bold tabular-nums text-text-muted" aria-hidden>
                            {levelDone}/{levelTotal}
                        </span>
                    </div>
                ) : totalLevels > 0 ? (
                    <div className="mt-2 flex items-center gap-2">
                        <div
                            className="relative h-2 flex-1 overflow-hidden rounded-full"
                            style={{
                                background: "var(--bg)",
                                border: "1px solid var(--border-subtle)",
                            }}
                            role="progressbar"
                            aria-valuenow={completedLevels}
                            aria-valuemin={0}
                            aria-valuemax={totalLevels}
                            aria-label={`Course progress: ${completedLevels} of ${totalLevels} ${showUnitMonths ? "weeks" : "levels"} complete`}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                                style={{
                                    width: `${overallPct}%`,
                                    background: "var(--primary)",
                                }}
                            />
                        </div>
                        <span className="shrink-0 text-[12px] font-bold tabular-nums text-text-muted" aria-hidden>
                            {completedLevels}/{totalLevels}
                        </span>
                    </div>
                ) : null}
            </div>

            {currentActivity ? (
                <Link
                    href={currentActivity.href}
                    className={`flex items-center gap-3 border-t px-4 py-3 transition-colors hover:bg-bg focus-visible:outline-none focus-visible:bg-bg focus-visible:ring-2 focus-visible:ring-primary/40${embedded ? " border-b" : ""}`}
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-[var(--text-on-accent)] shadow-sm"
                        aria-hidden
                    >
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-primary">
                            Continue
                        </span>
                        <span className="block truncate text-sm font-semibold leading-tight text-text">
                            {currentActivity.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-text-muted">
                            <span aria-hidden>{currentActivity.iconEmoji}</span>{" "}
                            {currentActivity.typeLabel}
                        </span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-text-muted" aria-hidden />
                </Link>
            ) : (
                <div
                    className="flex items-center gap-3 border-t px-4 py-3"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <span className="text-xl" aria-hidden>🎉</span>
                    <p className="text-sm font-semibold text-text">
                        All caught up — pick anything below to keep practicing.
                    </p>
                </div>
            )}
        </div>
    );
}
