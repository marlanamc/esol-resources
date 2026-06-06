"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { WeekProgressEntry } from "@/lib/course-map-navigation";
import { CourseMapUnitIcon } from "@/components/dashboard/CourseMapUnitIcon";
import { getCourseMapUnitTone, type CourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    dispatchOpenMapWeek,
    scrollToMapTarget,
} from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { useListboxKeyboard } from "@/hooks/useListboxKeyboard";

interface UnitProgress {
    unitNumber: number;
    done: number;
    total: number;
    isDone: boolean;
}

interface Props {
    units: CourseMapUnit[];
    unitProgress: UnitProgress[];
    weekProgress?: WeekProgressEntry[];
    currentWeekNumber?: number | null;
    variant: "sidebar" | "strip";
}

function UnitWeekListbox({
    weeks,
    unitTitle,
    unitTone,
    activeWeekNumber,
    currentWeekNumber,
    onWeekNavigate,
}: {
    weeks: WeekProgressEntry[];
    unitTitle: string;
    unitTone: CourseMapUnitTone;
    activeWeekNumber: number | null;
    currentWeekNumber: number | null;
    onWeekNavigate: (weekNumber: number) => void;
}) {
    const listRef = useRef<HTMLDivElement>(null);
    const handleKeyDown = useListboxKeyboard(listRef);

    return (
        <div
            ref={listRef}
            role="listbox"
            aria-label={`Weeks in ${unitTitle}`}
            onKeyDown={handleKeyDown}
            className="ml-3 mb-1 space-y-0.5 border-l pl-2"
            style={{ borderColor: `color-mix(in srgb, ${unitTone.accent} 25%, var(--border-subtle))` }}
        >
            {weeks.map((week) => {
                const isWeekActive = activeWeekNumber === week.weekNumber;
                const isCurrent = currentWeekNumber === week.weekNumber;
                const isSelected = isWeekActive || isCurrent;
                return (
                    <button
                        key={week.weekNumber}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={isWeekActive ? 0 : -1}
                        onClick={() => onWeekNavigate(week.weekNumber)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11px] transition-colors ${
                            isSelected
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
    );
}

export function CourseMapUnitNav({
    units,
    unitProgress,
    weekProgress = [],
    currentWeekNumber = null,
    variant,
}: Props) {
    const { activeUnitNumber, activeWeekNumber } = useCourseMapScrollSpy(units);
    const [expandedUnits, setExpandedUnits] = useState<Set<number>>(() => {
        if (variant === "sidebar") {
            return new Set();
        }
        const initialUnit =
            weekProgress.find((week) => week.weekNumber === currentWeekNumber)?.unitNumber ??
            units[0]?.unitNumber;
        return initialUnit != null ? new Set([initialUnit]) : new Set();
    });
    const progressByUnit = new Map(unitProgress.map((entry) => [entry.unitNumber, entry]));
    const weeksByUnit = useMemo(() => {
        const map = new Map<number, WeekProgressEntry[]>();
        for (const week of weekProgress) {
            if (!map.has(week.unitNumber)) map.set(week.unitNumber, []);
            map.get(week.unitNumber)!.push(week);
        }
        return map;
    }, [weekProgress]);

    useEffect(() => {
        if (variant === "sidebar" || activeUnitNumber == null) return;
        setExpandedUnits((prev) => new Set(prev).add(activeUnitNumber));
    }, [activeUnitNumber, variant]);

    const handleUnitNavigate = useCallback((unit: CourseMapUnit) => {
        scrollToMapTarget(`unit-${unit.unitNumber}`);
        const firstWeek = unit.levels[0]?.levelNumber;
        if (firstWeek != null) {
            dispatchOpenMapWeek(firstWeek);
        }
    }, []);

    const handleWeekNavigate = useCallback((weekNumber: number) => {
        dispatchOpenMapWeek(weekNumber);
        scrollToMapTarget(`week-${weekNumber}`);
    }, []);

    const toggleUnitExpanded = useCallback((unitNumber: number) => {
        setExpandedUnits((prev) => {
            const next = new Set(prev);
            if (next.has(unitNumber)) next.delete(unitNumber);
            else next.add(unitNumber);
            return next;
        });
    }, []);

    if (variant === "sidebar") {
        return (
            <nav
                className="dashboard-panel rounded-2xl p-4 space-y-1"
                aria-label="Course map units and weeks"
            >
                <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted mb-2 px-1" id="course-map-unit-nav-label">
                    Units
                </p>
                {units.map((unit) => {
                    const progress = progressByUnit.get(unit.unitNumber);
                    const isUnitDone = progress?.isDone ?? false;
                    const unitTone = getCourseMapUnitTone(unit.unitNumber);
                    const isActive = activeUnitNumber === unit.unitNumber;
                    const isExpanded = expandedUnits.has(unit.unitNumber);
                    const weeks = weeksByUnit.get(unit.unitNumber) ?? [];

                    return (
                        <div key={unit.unitNumber}>
                            <div className="flex items-center gap-0.5">
                                <a
                                    href={`#unit-${unit.unitNumber}`}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handleUnitNavigate(unit);
                                    }}
                                    aria-current={isActive ? "location" : undefined}
                                    className={`flex flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs transition-colors group min-w-0 ${
                                        isActive
                                            ? "bg-surface-subtle text-text font-semibold"
                                            : "text-text-muted hover:text-text hover:bg-surface-subtle"
                                    }`}
                                >
                                    <span
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
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
                                    <span className="flex-1 leading-tight font-medium group-hover:text-text truncate">
                                        {unit.unitTitle}
                                    </span>
                                    <span className="text-[10px] tabular-nums shrink-0">
                                        {progress?.done ?? 0}/{progress?.total ?? 0}
                                    </span>
                                </a>
                                {weeks.length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => toggleUnitExpanded(unit.unitNumber)}
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-surface-subtle"
                                        aria-expanded={isExpanded}
                                        aria-label={`${isExpanded ? "Collapse" : "Expand"} weeks for ${unit.unitTitle}`}
                                    >
                                        <ChevronDown
                                            size={14}
                                            className="text-text-muted transition-transform"
                                            style={{ transform: isExpanded ? "rotate(180deg)" : undefined }}
                                            aria-hidden
                                        />
                                    </button>
                                ) : null}
                            </div>

                            {isExpanded && weeks.length > 0 ? (
                                <UnitWeekListbox
                                    weeks={weeks}
                                    unitTitle={unit.unitTitle}
                                    unitTone={unitTone}
                                    activeWeekNumber={activeWeekNumber}
                                    currentWeekNumber={currentWeekNumber}
                                    onWeekNavigate={handleWeekNavigate}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </nav>
        );
    }

    return (
        <div className="mb-5 -mx-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted mb-2.5 px-1">Units</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {units.map((unit) => {
                    const progress = progressByUnit.get(unit.unitNumber);
                    const isUnitDone = progress?.isDone ?? false;
                    const unitTone = getCourseMapUnitTone(unit.unitNumber);
                    const isActive = activeUnitNumber === unit.unitNumber;

                    return (
                        <a
                            key={unit.unitNumber}
                            href={`#unit-${unit.unitNumber}`}
                            onClick={(event) => {
                                event.preventDefault();
                                handleUnitNavigate(unit);
                            }}
                            aria-current={isActive ? "location" : undefined}
                            className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-colors ${
                                isActive ? "ring-2 ring-offset-1" : "hover:opacity-90"
                            }`}
                            style={{
                                borderColor: `color-mix(in srgb, ${unitTone.accent} 35%, var(--border-subtle))`,
                                backgroundColor: unitTone.chipBg,
                                ...(isActive ? { ringColor: unitTone.accent } : {}),
                            }}
                        >
                            <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                                style={{
                                    borderColor: unitTone.accent,
                                    backgroundColor: isUnitDone ? unitTone.accent : unitTone.chipBg,
                                    color: unitTone.accent,
                                }}
                            >
                                {isUnitDone ? (
                                    <Check size={14} className="text-[#fffdfa]" strokeWidth={2.75} aria-hidden />
                                ) : (
                                    <CourseMapUnitIcon unitNumber={unit.unitNumber} size={15} />
                                )}
                            </span>
                            <span className="min-w-0">
                                <span
                                    className="block text-[10px] font-bold uppercase tracking-wide leading-none"
                                    style={{ color: unitTone.accent }}
                                >
                                    {unit.month}
                                </span>
                                <span className="mt-0.5 block max-w-[9rem] truncate text-xs font-semibold text-text leading-tight">
                                    {unit.unitTitle}
                                </span>
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
