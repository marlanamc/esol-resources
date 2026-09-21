"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Play, RotateCcw } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CurrentMapWeekMeta, WeekProgressEntry } from "@/lib/course-map-navigation";
import { resolveWeekActivityLaunch } from "@/lib/course-map-navigation";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { formatNextUpActivityTitle, getCourseMapActivityIconEmoji } from "@/lib/course-map-hero";
import type { GuidedAssignmentInfo } from "@/components/dashboard/course-path/shared";
import { dispatchOpenMapWeek, scrollToMapTarget } from "@/lib/course-map-navigation";

export interface MobileWayfindingCurrentActivity {
    title: string;
    href: string;
    iconEmoji: string;
    typeLabel: string;
}

function activityTypeLabel(
    activityType: string,
    assignmentType?: string,
    category?: string | null
): string {
    const c = (category || "").toLowerCase();
    const t = (assignmentType || activityType || "").toLowerCase();
    if (c === "vocabulary" || t === "vocabulary") return "Vocab";
    if (t === "guide") return "Grammar";
    if (t === "game") return "Game";
    if (t === "quiz") return "Quiz";
    if (t === "speaking") return "Speaking";
    if (t === "writing") return "Writing";
    if (t === "pronunciation") return "Pronunciation";
    if (t === "review") return "Review";
    if (t === "assessment") return "Check-in";
    if (t === "catch-up") return "Catch up";
    return "Activity";
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
    /** Progress + assignment data so the button can follow the viewed week. */
    guidedProgress?: CourseMapProgressState;
    guidedAssignments?: Record<string, GuidedAssignmentInfo>;
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
    guidedProgress = {},
    guidedAssignments = {},
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

    const viewedWeek = meta?.weekNumber ?? null;
    const scheduledWeek = currentWeek?.weekNumber ?? null;
    // "This week" only when the viewed week is the one the calendar says the
    // class is on. Browsing elsewhere is labelled for where you actually are.
    const isOnScheduledWeek = viewedWeek != null && viewedWeek === scheduledWeek;
    const isAheadOfSchedule = viewedWeek != null && scheduledWeek != null && viewedWeek > scheduledWeek;

    // The button follows the week on screen, so its title and destination
    // always agree with the heading above it.
    const launch = useMemo(() => {
        if (viewedWeek == null) return null;
        return resolveWeekActivityLaunch(units, guidedProgress, viewedWeek, guidedAssignments);
    }, [guidedAssignments, guidedProgress, units, viewedWeek]);

    const currentActivity = useMemo<
        (MobileWayfindingCurrentActivity & { isReview: boolean }) | null
    >(() => {
        if (!launch) return null;
        const level = units
            .flatMap((unit) => unit.levels)
            .find((entry) => entry.levelNumber === launch.weekNumber);
        const activity = level?.requiredActivities.find(
            (entry) => entry.activityId === launch.activityId || entry.title === launch.title
        );
        const assignment = launch.activityId ? guidedAssignments[launch.activityId] : undefined;
        return {
            title: formatNextUpActivityTitle(launch.title),
            href: launch.href,
            iconEmoji: getCourseMapActivityIconEmoji(
                activity?.activityType ?? "guide",
                assignment?.type,
                assignment?.category ?? null
            ),
            typeLabel: activityTypeLabel(
                activity?.activityType ?? "",
                assignment?.type,
                assignment?.category ?? null
            ),
            isReview: launch.isReview,
        };
    }, [guidedAssignments, launch, units]);

    if (!meta) return null;

    const tone = getCourseMapUnitTone(meta.unitNumber);
    const hasLevelProgress =
        meta.levelDone != null && meta.levelTotal != null && meta.levelTotal > 0;
    const levelDone = meta.levelDone ?? 0;
    const levelTotal = meta.levelTotal ?? 0;
    const levelPct = hasLevelProgress ? Math.round((levelDone / levelTotal) * 100) : 0;

    const weekLabel = meta.weekNumber != null
        ? formatLevelLabel(meta.weekNumber, showUnitMonths)
        : null;
    const headingPrefix = !showUnitMonths
        ? null
        : isOnScheduledWeek
          ? "This week"
          : isAheadOfSchedule
            ? "Coming up"
            : "Viewing";

    const backToCurrent = () => {
        if (scheduledWeek == null) return;
        dispatchOpenMapWeek(scheduledWeek, false);
        scrollToMapTarget(`week-${scheduledWeek}`);
    };

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
                {/* The week is the headline: students read where they are first. */}
                {weekLabel ? (
                    <h1 className="font-display text-[20px] font-bold leading-tight text-text">
                        {headingPrefix ? (
                            <>
                                <span style={{ color: tone.accent }}>{headingPrefix}</span>
                                <span className="text-text-muted" aria-hidden>{" · "}</span>
                            </>
                        ) : null}
                        {weekLabel}
                    </h1>
                ) : null}
                {meta.levelTitle ? (
                    <p className="mt-0.5 text-[15px] font-semibold leading-tight text-text">
                        {meta.levelTitle}
                    </p>
                ) : null}
                <p className="mt-1 text-[11px] leading-tight text-text-muted">
                    Unit {meta.unitNumber}: {meta.unitTitle}
                    {showUnitMonths && meta.unitMonth ? ` · ${meta.unitMonth}` : ""}
                </p>

                {!isOnScheduledWeek && scheduledWeek != null && showUnitMonths ? (
                    <button
                        type="button"
                        onClick={backToCurrent}
                        className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        style={{ backgroundColor: tone.chipBg, color: tone.accent }}
                    >
                        <RotateCcw size={14} aria-hidden />
                        Back to this week · {formatLevelLabel(scheduledWeek, showUnitMonths)}
                    </button>
                ) : null}

                {hasLevelProgress ? (
                    <div className="mt-2.5 flex items-center gap-2">
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
                            aria-label={`${levelDone} of ${levelTotal} activities finished`}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                                style={{
                                    width: `${levelPct}%`,
                                    background: "var(--primary)",
                                }}
                            />
                        </div>
                    </div>
                ) : totalLevels > 0 ? (
                    <div className="mt-2.5 flex items-center gap-2">
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
                    </div>
                ) : null}

                {hasLevelProgress ? (
                    <p className="mt-1.5 text-[13px] font-semibold text-text-muted">
                        {levelDone} of {levelTotal} activities finished
                    </p>
                ) : null}
            </div>

            {currentActivity ? (
                <Link
                    href={currentActivity.href}
                    className={`flex min-h-16 items-center gap-3 border-t px-4 py-3 transition-colors hover:bg-bg focus-visible:outline-none focus-visible:bg-bg focus-visible:ring-2 focus-visible:ring-primary/40${embedded ? " border-b" : ""}`}
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-[var(--text-on-accent)] shadow-sm"
                        aria-hidden
                    >
                        {currentActivity.isReview ? (
                            <RotateCcw size={19} />
                        ) : (
                            <Play size={20} fill="currentColor" className="ml-0.5" />
                        )}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-primary">
                            {currentActivity.isReview
                                ? `Review ${weekLabel ?? "this week"}`
                                : levelDone > 0
                                  ? "Continue"
                                  : "Start"}
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
