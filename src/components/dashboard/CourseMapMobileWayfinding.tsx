"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Play } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CurrentMapWeekMeta, WeekProgressEntry } from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

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
}: Props) {
    const { activeUnitNumber, activeWeekNumber } = useCourseMapScrollSpy(units);

    const meta = useMemo(() => {
        const unitNumber = activeUnitNumber ?? currentWeek?.unitNumber ?? units[0]?.unitNumber;
        if (unitNumber == null) return null;
        const unit = units.find((entry) => entry.unitNumber === unitNumber);
        if (!unit) return null;
        const weekNumber = activeWeekNumber ?? currentWeek?.weekNumber ?? unit.levels[0]?.levelNumber ?? null;
        const level = weekNumber != null
            ? unit.levels.find((entry) => entry.levelNumber === weekNumber)
            : undefined;
        const weekEntry = weekNumber != null
            ? weekProgress.find((entry) => entry.weekNumber === weekNumber)
            : undefined;
        return {
            unitMonth: unit.month,
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            weekNumber,
            levelTitle: level?.levelTitle ?? weekEntry?.title ?? null,
            levelDone: weekEntry?.done ?? null,
            levelTotal: weekEntry?.total ?? null,
        };
    }, [activeUnitNumber, activeWeekNumber, currentWeek, units, weekProgress]);

    if (!meta) return null;

    const tone = getCourseMapUnitTone(meta.unitNumber);
    const hasLevelProgress =
        meta.levelDone != null && meta.levelTotal != null && meta.levelTotal > 0;
    const levelDone = meta.levelDone ?? 0;
    const levelTotal = meta.levelTotal ?? 0;
    const levelPct = hasLevelProgress ? Math.round((levelDone / levelTotal) * 100) : 0;

    return (
        <>
            <div
                className="overflow-hidden rounded-2xl border"
                style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--surface-subtle)",
                }}
                aria-live="polite"
            >
                {/* Zone A — Orient */}
                <div className="px-4 pt-3 pb-3">
                    <p className="font-display text-[17px] font-bold leading-tight text-text">
                        <span style={{ color: tone.accent }}>Unit {meta.unitNumber}:</span>{" "}
                        {meta.unitTitle}
                        {showUnitMonths ? (
                            <span className="ml-1.5 text-[11px] font-normal text-text-muted">
                                {meta.unitMonth}
                            </span>
                        ) : null}
                    </p>
                    {meta.weekNumber != null && meta.levelTitle ? (
                        <p className="mt-1 text-[13px] leading-tight text-text">
                            <span className="font-semibold text-text-muted">Level {meta.weekNumber}</span>
                            <span className="text-text-muted" aria-hidden>{" · "}</span>
                            <span className="font-semibold">{meta.levelTitle}</span>
                        </p>
                    ) : null}

                    {/* Progress bar with count chip at its end */}
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
                                aria-label={`Level progress: ${levelDone} of ${levelTotal} activities done`}
                            >
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                                    style={{
                                        width: `${levelPct}%`,
                                        background: tone.accent,
                                    }}
                                />
                            </div>
                            <span
                                className="shrink-0 text-[12px] font-bold tabular-nums"
                                style={{ color: tone.accent }}
                                aria-hidden
                            >
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
                                aria-label={`Course progress: ${completedLevels} of ${totalLevels} levels complete`}
                            >
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                                    style={{
                                        width: `${overallPct}%`,
                                        background: tone.accent,
                                    }}
                                />
                            </div>
                            <span
                                className="shrink-0 text-[12px] font-bold tabular-nums"
                                style={{ color: tone.accent }}
                                aria-hidden
                            >
                                {completedLevels}/{totalLevels}
                            </span>
                        </div>
                    ) : null}
                </div>

                {/* Zone B — Continue */}
                {currentActivity ? (
                    <Link
                        href={currentActivity.href}
                        className="flex items-center gap-3 border-t px-4 py-3 transition-colors hover:bg-bg focus-visible:outline-none focus-visible:bg-bg focus-visible:ring-2 focus-visible:ring-primary/40"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                            style={{ background: tone.accent }}
                            aria-hidden
                        >
                            <Play size={20} fill="currentColor" className="ml-0.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.accent }}>
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
        </>
    );
}
