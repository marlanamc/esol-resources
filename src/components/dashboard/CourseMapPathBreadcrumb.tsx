"use client";

import { useMemo } from "react";
import type { CourseMapUnit } from "@/lib/course-map";
import type { NextMapActivityMeta } from "@/lib/course-map-navigation";
import { useCourseMapScrollSpy } from "@/hooks/useCourseMapScrollSpy";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

interface Props {
    units: CourseMapUnit[];
    nextActivity: NextMapActivityMeta | null;
    variant?: "desktop" | "mobile";
}

export function CourseMapPathBreadcrumb({ units, nextActivity, variant = "desktop" }: Props) {
    const { activeUnitNumber, activeWeekNumber } = useCourseMapScrollSpy(units);

    const meta = useMemo(() => {
        if (activeUnitNumber == null) return null;
        const unit = units.find((entry) => entry.unitNumber === activeUnitNumber);
        if (!unit) return null;
        const week = activeWeekNumber
            ? unit.levels.find((level) => level.levelNumber === activeWeekNumber)
            : unit.levels[0];
        return {
            unitMonth: unit.month,
            unitNumber: unit.unitNumber,
            weekNumber: week?.levelNumber ?? null,
            weekTitle: week?.levelTitle ?? null,
        };
    }, [activeUnitNumber, activeWeekNumber, units]);

    if (!meta) return null;

    const tone = getCourseMapUnitTone(meta.unitNumber);
    const showNext =
        nextActivity != null &&
        (meta.weekNumber == null || nextActivity.weekNumber === meta.weekNumber);

    if (variant === "mobile") {
        return (
            <div
                className="sticky top-0 z-10 mb-3 rounded-xl border px-3 py-2 backdrop-blur-sm lg:hidden"
                style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "color-mix(in srgb, var(--bg) 94%, transparent)",
                }}
                aria-live="polite"
            >
                <p className="truncate text-xs font-semibold text-text">
                    <span style={{ color: tone.accent }}>Unit {meta.unitNumber}</span>
                    {meta.weekNumber != null ? (
                        <>
                            <span className="text-text-muted" aria-hidden>
                                {" "}
                                ›{" "}
                            </span>
                            <span>Week {meta.weekNumber}</span>
                        </>
                    ) : null}
                    {showNext ? (
                        <>
                            <span className="text-text-muted" aria-hidden>
                                {" "}
                                ›{" "}
                            </span>
                            <span className="text-text-muted">Next: </span>
                            <span>{nextActivity.title}</span>
                        </>
                    ) : null}
                </p>
            </div>
        );
    }

    return (
        <div
            className="sticky top-0 z-10 mb-4 hidden rounded-xl border px-3 py-2.5 backdrop-blur-sm lg:block"
            style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)",
            }}
            aria-live="polite"
        >
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.accent }}>
                {meta.unitMonth} · Unit {meta.unitNumber}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-text">
                {meta.weekNumber != null ? (
                    <>
                        Week {meta.weekNumber}
                        {meta.weekTitle ? (
                            <span className="font-normal text-text-muted"> · {meta.weekTitle}</span>
                        ) : null}
                    </>
                ) : null}
                {showNext ? (
                    <>
                        {meta.weekNumber != null ? (
                            <span className="font-normal text-text-muted" aria-hidden>
                                {" "}
                                ›{" "}
                            </span>
                        ) : null}
                        <span className="font-normal text-text-muted">Next: </span>
                        {nextActivity.title}
                    </>
                ) : null}
            </p>
        </div>
    );
}
