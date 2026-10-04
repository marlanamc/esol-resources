"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown, ChevronRight, Play } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import { ActivityRow } from "@/components/dashboard/course-map-road/parts";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import type { CourseMapActivityType } from "@/lib/course-map";
import type { RoadActivity } from "@/lib/course-map-road";

export interface ThisWeekRoadCardProps {
    weekNumber: number;
    weekTitle: string;
    unitNumber: number;
    unitMonth: string;
    progress: { done: number; total: number };
    items: TimelineItem[];
    currentTitle: string;
    continueHref: string;
    continueLabel: "Start here" | "Continue" | "Review this week";
    mapHref: string;
    showUnitMonths?: boolean;
}

function toRoadActivity(item: TimelineItem, isNext: boolean): RoadActivity {
    return {
        id: item.activityId,
        title: item.title,
        activityType: item.type as CourseMapActivityType,
        vocabUi: item.vocabUi,
        href: item.href,
        done: item.status === "done",
        isNext,
    };
}

/** The course map's "You are here" card, sized for the mobile home. */
export function ThisWeekRoadCard({
    weekNumber,
    weekTitle,
    unitNumber,
    unitMonth,
    progress,
    items,
    currentTitle,
    continueHref,
    continueLabel,
    mapHref,
    showUnitMonths = true,
}: ThisWeekRoadCardProps) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const tone = getCourseMapUnitTone(unitNumber);
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;
    const weekDone = progress.total > 0 && progress.done >= progress.total;

    const currentIndex = items.findIndex((item) => item.status === "current" || item.status === "todo");
    const activities = items.map((item, index) => toRoadActivity(item, index === currentIndex));
    // The Continue button already names the next activity; the list stays folded until asked for.
    const canExpand = activities.length > 0;

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"} className={`font-legible ${roadStyles.road}`}>
            <div
                className="overflow-hidden rounded-[20px]"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    boxShadow: "0 12px 28px rgba(40,31,23,.12)",
                }}
            >
                <div className="px-4 pt-3.5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate text-[13.5px] font-bold text-text-muted">
                            <span style={{ color: tone.accent }}>{unitLabel}</span> · {weekLabel}
                        </span>
                        <span
                            className="shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            You are here
                        </span>
                    </div>
                    <h2 className="mt-2 mb-0 font-display text-[24px] font-bold leading-tight text-text">{weekTitle}</h2>
                    {items.length > 0 ? (
                        <div className="mt-2.5 flex items-center gap-3">
                            <div className="flex flex-1 gap-1" aria-hidden>
                                {activities.map((activity) => (
                                    <span
                                        key={activity.id}
                                        className="h-2 flex-1 rounded"
                                        style={{
                                            background: activity.done
                                                ? "var(--success-color)"
                                                : activity.isNext
                                                  ? `color-mix(in srgb, ${tone.accent} 45%, transparent)`
                                                  : "var(--road-progress-todo)",
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-[13.5px] font-bold whitespace-nowrap text-text-muted">
                                {progress.done} of {progress.total} done
                            </span>
                        </div>
                    ) : null}
                </div>

                {weekDone ? (
                    <p
                        className="mx-3 mt-0 mb-3 rounded-2xl px-4 py-3 text-[15px] leading-snug font-bold"
                        style={{ background: "var(--road-done-bg)", color: "var(--road-done-text)" }}
                    >
                        You finished this {showUnitMonths ? "week" : "level"}! You can review anything on the map.
                    </p>
                ) : (
                    <Link
                        href={continueHref}
                        className="mx-3 mb-3 flex min-h-[52px] items-center gap-2.5 rounded-[14px] px-3 py-2"
                        style={{
                            background: tone.button,
                            color: "var(--road-on-accent)",
                            boxShadow: `0 8px 18px color-mix(in srgb, ${tone.button} 30%, transparent)`,
                        }}
                    >
                        <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{ background: "var(--road-on-accent)", color: tone.button }}
                        >
                            <Play size={15} fill="currentColor" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-extrabold uppercase tracking-[.06em] opacity-90">
                                {continueLabel === "Start here" ? "Start" : "Continue"}
                            </span>
                            <span className="block text-[15px] font-bold leading-snug">{currentTitle}</span>
                        </span>
                        <ChevronRight size={18} aria-hidden className="shrink-0" />
                    </Link>
                )}

                {expanded ? (
                    <>
                        <p className="m-0 px-4 pt-1 pb-1.5 text-[12px] leading-normal font-extrabold uppercase tracking-[.06em] text-text-muted">
                            This {showUnitMonths ? "week" : "level"}&apos;s activities
                        </p>
                        <div id={listId}>
                            {activities.map((activity) => (
                                <ActivityRow key={activity.id} activity={activity} showNext />
                            ))}
                        </div>
                    </>
                ) : null}

                <div className="flex" style={{ borderTop: "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)" }}>
                    {canExpand ? (
                        <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={listId}
                            onClick={() => setExpanded((open) => !open)}
                            className="flex min-h-12 flex-1 items-center justify-center gap-1 text-[14px] font-bold text-text-muted"
                        >
                            {expanded ? "Show less" : `See all ${activities.length}`}
                            <ChevronDown
                                size={16}
                                aria-hidden
                                className="transition-transform duration-200 motion-reduce:transition-none"
                                style={{ transform: expanded ? "rotate(180deg)" : "none" }}
                            />
                        </button>
                    ) : null}
                    <Link
                        href={mapHref}
                        className="flex min-h-12 flex-1 items-center justify-center gap-1 text-[14px] font-bold"
                        style={{
                            color: tone.accent,
                            borderLeft: canExpand
                                ? "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)"
                                : undefined,
                        }}
                    >
                        Open map
                        <ChevronRight size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
