"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, X } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CurrentMapWeekMeta, WeekProgressEntry } from "@/lib/course-map-navigation";
import {
    dispatchOpenMapWeek,
    scrollToMapTarget,
} from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { CourseMapUnitIcon } from "@/components/dashboard/CourseMapUnitIcon";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

interface UnitProgress {
    unitNumber: number;
    done: number;
    total: number;
    isDone: boolean;
}

export interface CourseMapMobileDrawerProps {
    units: CourseMapUnit[];
    unitProgress: UnitProgress[];
    weekProgress: WeekProgressEntry[];
    currentWeek: CurrentMapWeekMeta | null;
    showUnitMonths?: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CourseMapMobileDrawerPanel({
    units,
    unitProgress,
    weekProgress,
    currentWeek,
    showUnitMonths = true,
    open,
    onOpenChange,
}: CourseMapMobileDrawerProps) {
    const [expandedUnits, setExpandedUnits] = useState<Set<number>>(() => {
        const initial = currentWeek?.unitNumber ?? units[0]?.unitNumber;
        return initial != null ? new Set([initial]) : new Set();
    });
    const { activeUnitNumber } = useCourseMapScrollSpy(units);

    const progressByUnit = useMemo(
        () => new Map(unitProgress.map((entry) => [entry.unitNumber, entry])),
        [unitProgress]
    );
    const weeksByUnit = useMemo(() => {
        const map = new Map<number, WeekProgressEntry[]>();
        for (const week of weekProgress) {
            if (!map.has(week.unitNumber)) map.set(week.unitNumber, []);
            map.get(week.unitNumber)!.push(week);
        }
        return map;
    }, [weekProgress]);

    useEffect(() => {
        if (activeUnitNumber != null) {
            setExpandedUnits((prev) => new Set(prev).add(activeUnitNumber));
        }
    }, [activeUnitNumber]);

    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    const close = useCallback(() => onOpenChange(false), [onOpenChange]);

    const handleUnitNavigate = useCallback((unit: CourseMapUnit) => {
        scrollToMapTarget(`unit-${unit.unitNumber}`);
        const firstWeek = unit.levels[0]?.levelNumber;
        if (firstWeek != null) {
            dispatchOpenMapWeek(firstWeek);
        }
        close();
    }, [close]);

    const handleWeekNavigate = useCallback((weekNumber: number, focusActivity = false) => {
        dispatchOpenMapWeek(weekNumber, focusActivity);
        scrollToMapTarget(`week-${weekNumber}`);
        if (focusActivity) {
            window.requestAnimationFrame(() => scrollToMapTarget("map-activity-current"));
        }
        close();
    }, [close]);

    const toggleUnitExpanded = useCallback((unitNumber: number) => {
        setExpandedUnits((prev) => {
            const next = new Set(prev);
            if (next.has(unitNumber)) next.delete(unitNumber);
            else next.add(unitNumber);
            return next;
        });
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[280] lg:hidden" role="dialog" aria-modal="true" aria-label="Course map">
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close course map"
                onClick={close}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-2xl border-t bg-bg shadow-2xl safe-area-bottom-padding-mobile-lg">
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
                    <h2 className="text-base font-bold text-text">Course Map</h2>
                    <button
                        type="button"
                        onClick={close}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-subtle"
                        aria-label="Close"
                    >
                        <X size={18} aria-hidden />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(88vh-3.25rem)] px-4 py-4 space-y-4">
                    {currentWeek ? (
                        <button
                            type="button"
                            onClick={() => handleWeekNavigate(currentWeek.weekNumber, true)}
                            className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left"
                            style={{
                                borderColor: `color-mix(in srgb, ${getCourseMapUnitTone(currentWeek.unitNumber).accent} 35%, var(--border-subtle))`,
                                backgroundColor: getCourseMapUnitTone(currentWeek.unitNumber).chipBg,
                            }}
                        >
                            <span
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: getCourseMapUnitTone(currentWeek.unitNumber).chipBg,
                                    color: getCourseMapUnitTone(currentWeek.unitNumber).accent,
                                }}
                            >
                                <CourseMapUnitIcon unitNumber={currentWeek.unitNumber} size={16} />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span
                                    className="block text-[10px] font-bold uppercase tracking-wide"
                                    style={{ color: getCourseMapUnitTone(currentWeek.unitNumber).accent }}
                                >
                                    Go to my next lesson
                                </span>
                                <span className="mt-0.5 block text-sm font-bold text-text leading-tight">
                                    {showUnitMonths
                                        ? `Level ${currentWeek.weekNumber} · ${currentWeek.unitMonth}`
                                        : `Level ${currentWeek.weekNumber}`}
                                </span>
                            </span>
                            <MapPin size={16} className="shrink-0 text-text-muted" aria-hidden />
                        </button>
                    ) : null}

                    <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted px-1">Units</p>
                        {units.map((unit) => {
                            const progress = progressByUnit.get(unit.unitNumber);
                            const isUnitDone = progress?.isDone ?? false;
                            const unitTone = getCourseMapUnitTone(unit.unitNumber);
                            const isExpanded = expandedUnits.has(unit.unitNumber);
                            const weeks = weeksByUnit.get(unit.unitNumber) ?? [];

                            return (
                                <div key={unit.unitNumber}>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleUnitNavigate(unit)}
                                            className="flex flex-1 items-center gap-2.5 rounded-xl px-2 py-2 text-left text-xs transition-colors hover:bg-surface-subtle"
                                        >
                                            <span
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                                                style={
                                                    isUnitDone
                                                        ? {
                                                              borderColor: unitTone.accent,
                                                              backgroundColor: unitTone.accent,
                                                              color: "#fffdfa",
                                                          }
                                                        : {
                                                              borderColor: `color-mix(in srgb, ${unitTone.accent} 40%, var(--border-subtle))`,
                                                              backgroundColor: unitTone.chipBg,
                                                              color: unitTone.accent,
                                                          }
                                                }
                                            >
                                                {isUnitDone ? (
                                                    <Check size={12} strokeWidth={2.75} aria-hidden />
                                                ) : (
                                                    <CourseMapUnitIcon unitNumber={unit.unitNumber} size={13} />
                                                )}
                                            </span>
                                            <span className="flex-1 truncate font-medium text-text leading-tight">
                                                {unit.unitTitle}
                                            </span>
                                            <span className="text-[10px] tabular-nums shrink-0 text-text-muted">
                                                {progress?.done ?? 0}/{progress?.total ?? 0}
                                            </span>
                                        </button>
                                        {weeks.length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleUnitExpanded(unit.unitNumber)}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-surface-subtle"
                                                aria-expanded={isExpanded}
                                                aria-label={`${isExpanded ? "Collapse" : "Expand"} weeks for ${unit.unitTitle}`}
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className="text-text-muted transition-transform"
                                                    style={{ transform: isExpanded ? "rotate(180deg)" : undefined }}
                                                    aria-hidden
                                                />
                                            </button>
                                        ) : null}
                                    </div>

                                    {isExpanded && weeks.length > 0 ? (
                                        <div
                                            className="ml-3 mb-1 space-y-0.5 border-l pl-2"
                                            style={{ borderColor: `color-mix(in srgb, ${unitTone.accent} 25%, var(--border-subtle))` }}
                                        >
                                            {weeks.map((week) => {
                                                const isCurrent = currentWeek?.weekNumber === week.weekNumber;
                                                return (
                                                    <button
                                                        key={week.weekNumber}
                                                        type="button"
                                                        onClick={() => handleWeekNavigate(week.weekNumber)}
                                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] transition-colors ${
                                                            isCurrent
                                                                ? "bg-surface-subtle font-semibold text-text"
                                                                : "text-text-muted hover:bg-surface-subtle hover:text-text"
                                                        }`}
                                                    >
                                                        <span
                                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                                                            style={
                                                                week.isDone
                                                                    ? {
                                                                          backgroundColor: unitTone.accent,
                                                                          color: "#fffdfa",
                                                                      }
                                                                    : isCurrent
                                                                      ? {
                                                                            backgroundColor: unitTone.chipBg,
                                                                            color: unitTone.accent,
                                                                            border: `1px solid color-mix(in srgb, ${unitTone.accent} 45%, var(--border-subtle))`,
                                                                        }
                                                                      : {
                                                                            backgroundColor: "var(--surface-subtle)",
                                                                            color: "var(--text-muted)",
                                                                        }
                                                            }
                                                        >
                                                            {week.isDone ? <Check size={10} strokeWidth={3} aria-hidden /> : week.weekNumber}
                                                        </span>
                                                        <span className="min-w-0 flex-1 truncate leading-tight">{week.title}</span>
                                                        <span className="shrink-0 tabular-nums text-[10px]">
                                                            {week.done}/{week.total}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
