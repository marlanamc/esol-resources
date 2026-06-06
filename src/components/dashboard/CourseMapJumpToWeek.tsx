"use client";

import { MapPin } from "lucide-react";
import type { CurrentMapWeekMeta } from "@/lib/course-map-navigation";
import {
    dispatchOpenMapWeek,
    scrollToMapTarget,
} from "@/lib/course-map-navigation";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { CourseMapUnitIcon } from "@/components/dashboard/CourseMapUnitIcon";

interface Props {
    currentWeek: CurrentMapWeekMeta | null;
    variant: "sidebar" | "mobile";
    showUnitMonths?: boolean;
}

function formatJumpLabel(
    weekNumber: number,
    unitMonth: string,
    showUnitMonths: boolean
): string {
    const levelLabel = `Level ${weekNumber}`;
    return showUnitMonths ? `${levelLabel} · ${unitMonth}` : levelLabel;
}

export function CourseMapJumpToWeek({ currentWeek, variant, showUnitMonths = true }: Props) {
    if (!currentWeek) return null;

    const tone = getCourseMapUnitTone(currentWeek.unitNumber);

    const handleClick = () => {
        dispatchOpenMapWeek(currentWeek.weekNumber, true);
        scrollToMapTarget(`week-${currentWeek.weekNumber}`);
        window.requestAnimationFrame(() => {
            scrollToMapTarget("map-activity-current");
        });
    };

    if (variant === "sidebar") {
        return (
            <button
                type="button"
                onClick={handleClick}
                className="dashboard-panel flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-opacity hover:opacity-95"
                style={{
                    borderColor: `color-mix(in srgb, ${tone.accent} 32%, var(--border-subtle))`,
                }}
            >
                <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: tone.chipBg, color: tone.accent }}
                >
                    <CourseMapUnitIcon unitNumber={currentWeek.unitNumber} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.accent }}>
                        Jump to my level
                    </span>
                    <span className="mt-0.5 block text-sm font-bold text-text leading-tight">
                        {formatJumpLabel(currentWeek.weekNumber, currentWeek.unitMonth, showUnitMonths)}
                    </span>
                </span>
                <MapPin size={16} className="shrink-0 text-text-muted" aria-hidden />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left shadow-sm transition-opacity hover:opacity-95"
            style={{
                borderColor: `color-mix(in srgb, ${tone.accent} 35%, var(--border-subtle))`,
                backgroundColor: tone.chipBg,
            }}
        >
            <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.accent }}>
                    Your level
                </span>
                <span className="mt-0.5 block text-sm font-bold text-text">
                    {formatJumpLabel(currentWeek.weekNumber, currentWeek.unitMonth, showUnitMonths)}
                </span>
            </span>
            <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: tone.button }}
            >
                Go
                <MapPin size={12} aria-hidden />
            </span>
        </button>
    );
}
