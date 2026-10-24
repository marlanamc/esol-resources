"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Check, ChevronDown, ChevronRight, Flame, Play, Star } from "lucide-react";
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
    /** Streak and ledger points this week; shown on the line under the road. */
    momentum?: { streak: number; weeklyPoints: number } | null;
}

function toRoadActivity(item: TimelineItem, isNext: boolean, weekNumber: number): RoadActivity {
    return {
        id: item.activityId,
        title: item.title,
        activityType: item.type as CourseMapActivityType,
        vocabUi: item.vocabUi,
        weekNumber,
        href: item.href,
        done: item.status === "done",
        isNext,
    };
}

const DIVIDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

/**
 * The week as a short road: done stops first, then the next stop, then the rest.
 * It counts progress (the list order lives in "See all"), so it always fills left to right.
 */
function WeekRoad({ done, total, accent }: { done: number; total: number; accent: string }) {
    if (total < 2) return null;
    const finished = done >= total;
    const reach = finished ? 1 : Math.min(1, done / (total - 1));

    return (
        <div className="relative mt-4 h-6" aria-hidden>
            <span className="absolute inset-x-[9px] top-[10px] h-1 rounded-full" style={{ background: "var(--road-progress-todo)" }} />
            <span
                className="absolute left-[9px] top-[10px] h-1 rounded-full"
                style={{ width: `calc((100% - 18px) * ${reach})`, background: "var(--success-color)" }}
            />
            <div className="absolute inset-0 flex items-center justify-between">
                {Array.from({ length: total }, (_, index) => {
                    if (index < done) {
                        return (
                            <span
                                key={index}
                                className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
                                style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}
                            >
                                <Check size={11} strokeWidth={4} />
                            </span>
                        );
                    }
                    if (index === done) {
                        return (
                            <span
                                key={index}
                                className="h-[22px] w-[22px] rounded-full"
                                style={{
                                    background: "var(--surface-base)",
                                    border: `6px solid ${accent}`,
                                    boxShadow: `0 0 0 4px color-mix(in srgb, ${accent} 20%, transparent)`,
                                }}
                            />
                        );
                    }
                    return (
                        <span
                            key={index}
                            className="h-3 w-3 rounded-full"
                            style={{ background: "var(--surface-base)", border: "2px solid var(--road-rail)" }}
                        />
                    );
                })}
            </div>
        </div>
    );
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
    mapHref,
    showUnitMonths = true,
    momentum = null,
}: ThisWeekRoadCardProps) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const tone = getCourseMapUnitTone(unitNumber);
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;
    const weekDone = progress.total > 0 && progress.done >= progress.total;
    const left = Math.max(0, progress.total - progress.done);
    // Points earned this week sit next to this week's progress, so a finished activity visibly counts.
    const showMomentum = momentum != null && (momentum.streak > 0 || momentum.weeklyPoints > 0);

    const currentIndex = items.findIndex((item) => item.status === "current" || item.status === "todo");
    const activities = items.map((item, index) => toRoadActivity(item, index === currentIndex, weekNumber));
    // The Next up button already names the next activity; the list stays folded until asked for.
    const canExpand = activities.length > 0;

    return (
        <section aria-label={showUnitMonths ? "This week" : "This level"} className={`font-legible ${roadStyles.road}`}>
            <div
                className="overflow-hidden rounded-[20px]"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    // Negative spread keeps the shadow inside the card's width: .dashboard-shell clips
                    // overflow-x on phones, which cut a wide shadow into a hard band under the card.
                    boxShadow: "0 1px 2px rgba(40,31,23,.06), 0 10px 16px -8px rgba(40,31,23,.18)",
                }}
            >
                <div className="px-4 pt-4 pb-4" style={{ background: tone.surface }}>
                    <span className="block truncate text-[0.8438rem] font-bold text-text-muted">
                        <span style={{ color: tone.accent }}>{unitLabel}</span> · {weekLabel}
                    </span>
                    <h2 className="mt-1.5 mb-0 font-display text-[1.5625rem] font-bold leading-[1.18] text-balance text-text">{weekTitle}</h2>
                    {progress.total > 0 ? (
                        <>
                            <WeekRoad done={progress.done} total={progress.total} accent={tone.accent} />
                            <div className="mt-1.5 flex justify-between text-[0.8125rem] font-bold text-text-muted">
                                <span>{progress.done} of {progress.total} done</span>
                                {momentum && showMomentum ? (
                                    <span className="flex items-center gap-3">
                                        {momentum.streak > 0 ? (
                                            <span className="flex items-center gap-1">
                                                <Flame size={15} aria-hidden style={{ color: "var(--tone-speaking-accent, #b56e1a)" }} />
                                                <span className="text-text">{momentum.streak} {momentum.streak === 1 ? "day" : "days"}</span>
                                                <span className="sr-only"> in a row</span>
                                            </span>
                                        ) : null}
                                        <span className="flex items-center gap-1">
                                            <Star size={15} aria-hidden fill="var(--accent-color, #e9c46a)" style={{ color: "#cba342" }} />
                                            <span className="text-text">{momentum.weeklyPoints.toLocaleString()} pts</span>
                                            <span className="sr-only"> this week</span>
                                        </span>
                                    </span>
                                ) : (
                                    <span>{weekDone ? `${showUnitMonths ? "Week" : "Level"} complete` : `${left} to go`}</span>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="flex flex-col gap-2 p-3">
                    {weekDone ? (
                        <div className="rounded-[14px] px-4 py-3" style={{ background: "var(--road-done-bg)" }}>
                            <p className="m-0 font-display text-[1.1875rem] font-bold" style={{ color: "var(--road-done-text)" }}>
                                You finished {weekLabel}.
                            </p>
                            <p className="mt-1 mb-0 text-[0.875rem] text-text">You can review anything on the map.</p>
                        </div>
                    ) : (
                        <Link
                            href={continueHref}
                            className="flex min-h-[60px] items-center gap-3 rounded-[14px] py-2 pr-3.5 pl-2.5 transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            style={{
                                background: tone.button,
                                color: "var(--road-on-accent)",
                                boxShadow: `0 8px 18px -8px color-mix(in srgb, ${tone.button} 70%, transparent)`,
                            }}
                        >
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                style={{ background: "var(--road-on-accent)", color: tone.button }}
                            >
                                <Play size={16} fill="currentColor" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[0.6875rem] font-extrabold uppercase tracking-[.06em] opacity-90">Next up</span>
                                <span className="block text-[1.0625rem] font-bold leading-snug">{currentTitle}</span>
                            </span>
                            <ChevronRight size={20} strokeWidth={2.5} aria-hidden className="shrink-0" />
                        </Link>
                    )}
                </div>

                {/* Always mounted so the toggle's aria-controls points at a real element. */}
                <div id={listId} hidden={!expanded}>
                    <p className="m-0 px-4 pt-1 pb-1.5 text-[0.75rem] leading-normal font-extrabold uppercase tracking-[.06em] text-text-muted">
                        This {showUnitMonths ? "week" : "level"}&apos;s activities
                    </p>
                    {activities.map((activity) => (
                        <ActivityRow key={activity.id} activity={activity} showNext />
                    ))}
                </div>

                <div className="flex" style={{ borderTop: DIVIDER }}>
                    {canExpand ? (
                        <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={listId}
                            onClick={() => setExpanded((open) => !open)}
                            className="flex min-h-12 flex-1 items-center justify-center gap-1 text-[0.875rem] font-bold text-text-muted"
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
                        className="flex min-h-12 flex-1 items-center justify-center gap-1 text-[0.875rem] font-bold text-text-muted"
                        style={{ borderLeft: canExpand ? DIVIDER : undefined }}
                    >
                        Open map
                        <ChevronRight size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
