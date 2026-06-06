"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Map as MapIcon } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CurrentMapWeekMeta, WeekProgressEntry } from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { CourseMapMobileDrawerPanel } from "@/components/dashboard/CourseMapMobileDrawer";

interface UnitProgress {
    unitNumber: number;
    done: number;
    total: number;
    isDone: boolean;
}

interface Props {
    units: CourseMapUnit[];
    unitProgress: UnitProgress[];
    weekProgress: WeekProgressEntry[];
    currentWeek: CurrentMapWeekMeta | null;
    overallPct: number;
    completedLevels: number;
    totalLevels: number;
    /** School-year month labels — classroom learners only */
    showUnitMonths?: boolean;
}

export function CourseMapMobileWayfinding({
    units,
    unitProgress,
    weekProgress,
    currentWeek,
    overallPct,
    completedLevels,
    totalLevels,
    showUnitMonths = true,
}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { activeUnitNumber, activeWeekNumber } = useCourseMapScrollSpy(units);

    const meta = useMemo(() => {
        const unitNumber = activeUnitNumber ?? currentWeek?.unitNumber ?? units[0]?.unitNumber;
        if (unitNumber == null) return null;
        const unit = units.find((entry) => entry.unitNumber === unitNumber);
        if (!unit) return null;
        const weekNumber = activeWeekNumber ?? currentWeek?.weekNumber ?? unit.levels[0]?.levelNumber ?? null;
        return {
            unitMonth: unit.month,
            unitNumber: unit.unitNumber,
            weekNumber,
        };
    }, [activeUnitNumber, activeWeekNumber, currentWeek, units]);

    if (!meta) return null;

    const tone = getCourseMapUnitTone(meta.unitNumber);

    return (
        <>
            <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--surface-subtle)",
                }}
                aria-live="polite"
            >
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-text">
                    <span style={{ color: tone.accent }}>Unit {meta.unitNumber}</span>
                    {meta.weekNumber != null ? (
                        <>
                            <span className="text-text-muted" aria-hidden>
                                {" · "}
                            </span>
                            <span>Level {meta.weekNumber}</span>
                        </>
                    ) : null}
                    {showUnitMonths ? (
                        <>
                            <span className="text-text-muted" aria-hidden>
                                {" · "}
                            </span>
                            <span className="font-normal text-text-muted">{meta.unitMonth}</span>
                        </>
                    ) : null}
                </p>

                {totalLevels > 0 ? (
                    <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums border"
                        title={`${completedLevels} of ${totalLevels} levels complete`}
                        style={{
                            background: completedLevels > 0
                                ? "color-mix(in srgb, var(--tone-grammar-chip-bg) 80%, transparent)"
                                : "var(--bg)",
                            color: completedLevels > 0
                                ? "var(--tone-grammar-accent, #b05740)"
                                : "var(--text-muted)",
                            borderColor: completedLevels > 0
                                ? "color-mix(in srgb, var(--tone-grammar-accent, #b05740) 25%, transparent)"
                                : "var(--border-subtle)",
                        }}
                    >
                        {overallPct}%
                    </span>
                ) : null}

                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text transition-colors hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    style={{ borderColor: "var(--border-subtle)" }}
                    aria-haspopup="dialog"
                    aria-expanded={drawerOpen}
                    aria-label="Browse units and levels"
                >
                    <MapIcon size={12} aria-hidden />
                    <span>Browse</span>
                    <ChevronDown size={12} className="-rotate-90" aria-hidden />
                </button>
            </div>

            <CourseMapMobileDrawerPanel
                units={units}
                unitProgress={unitProgress}
                weekProgress={weekProgress}
                currentWeek={currentWeek}
                showUnitMonths={showUnitMonths}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </>
    );
}
