"use client";

import { Check } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { dispatchOpenMapWeek } from "@/lib/course-map-navigation";
import type { CourseMapRoadModel, RoadUnit } from "@/lib/course-map-road";

interface Props {
    model: CourseMapRoadModel;
    showMonths?: boolean;
}

/** Desktop unit list beside the road; clicking a unit jumps the road to it. */
export function CourseMapRoadSidebar({ model, showMonths = true }: Props) {
    const units = model.cycles.flatMap((cycle) => cycle.units);
    const containsCurrent = (unit: RoadUnit) => unit.weeks.some((week) => week.weekNumber === model.currentWeek);

    return (
        <nav aria-label="Units" className="flex flex-col gap-1.5 font-legible">
            {units.map((unit) => {
                const tone = getCourseMapUnitTone(unit.unitNumber);
                const isCurrent = containsCurrent(unit);
                const allDone = unit.weeks.length > 0 && unit.doneWeeks === unit.weeks.length;
                const target = isCurrent ? model.currentWeek : unit.weeks[0]?.weekNumber;
                const eyebrow = showMonths && unit.month ? `Unit ${unit.unitNumber} · ${unit.month.slice(0, 3)}` : `Unit ${unit.unitNumber}`;
                return (
                    <button
                        key={unit.unitNumber}
                        type="button"
                        onClick={() => target != null && dispatchOpenMapWeek(target)}
                        aria-current={isCurrent ? "step" : undefined}
                        className="flex min-h-[52px] w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left transition-colors hover:bg-surface-subtle"
                        style={
                            isCurrent
                                ? { background: "var(--surface-base)", boxShadow: `inset 0 0 0 1.5px ${tone.accent}` }
                                : undefined
                        }
                    >
                        <span aria-hidden className="h-8 w-2.5 shrink-0 rounded" style={{ background: tone.accent, opacity: unit.isLocked ? 0.45 : 1 }} />
                        <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-extrabold uppercase tracking-[.08em]" style={{ color: tone.accent }}>
                                {eyebrow}
                            </span>
                            <span className={`block truncate text-[15px] leading-tight font-bold ${unit.isLocked ? "text-text-muted" : "text-text"}`}>
                                {unit.title}
                            </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold whitespace-nowrap text-text-muted">
                            {unit.doneWeeks}/{unit.weeks.length}
                            {allDone ? <Check size={14} aria-label="Done" style={{ color: "var(--success-color)" }} /> : null}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
