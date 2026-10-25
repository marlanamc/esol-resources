"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ChevronRight, Flame, Play, Star } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { WeekLearningDisclosure } from "@/components/dashboard/course-map-road/parts";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";
import { formatLevelLabel } from "@/components/dashboard/course-path/shared";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import type { CourseMapActivityType } from "@/lib/course-map";
import { formatRoadRowLabels, groupRoadWeekSteps, type RoadActivity } from "@/lib/course-map-road";

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

function rowTitle(activity: RoadActivity): string {
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    return formatRoadRowLabels(activity, format.label).title;
}

/** Where a step line goes: the first unfinished activity in it, else the first one. */
function stepHref(activities: RoadActivity[]): string | null {
    return (activities.find((a) => !a.done && a.href) ?? activities.find((a) => a.href))?.href ?? null;
}

/**
 * One line per step of the week, matching the Map: a dot, the step name, a short
 * status, and the same timing tag. The full list of activities lives on the Map.
 */
function StepLine({
    marker,
    title,
    status,
    tag,
    href,
    done,
    required = false,
    accent,
    last,
}: {
    marker: string | null;
    title: string;
    status: ReactNode;
    tag: string;
    href: string | null;
    done: boolean;
    required?: boolean;
    accent: string;
    last: boolean;
}) {
    const content = (
        <>
            {last ? null : (
                <span aria-hidden className="absolute top-[26px] -bottom-[14px] left-[21px] w-[2px]" style={{ background: "var(--road-rail)" }} />
            )}
            <span
                aria-hidden
                className="relative z-[1] mt-[5px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full"
                style={{
                    background: done ? "var(--success-color)" : required ? "var(--road-required-bg)" : accent,
                    boxShadow: "0 0 0 3px var(--surface-base)",
                }}
            >
                {done ? <Check size={9} strokeWidth={4} style={{ color: "var(--road-on-success)" }} /> : null}
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                    <span className="text-[0.9688rem] font-bold leading-snug text-text">
                        {marker ? <span className="mr-1 text-text-muted">{marker}.</span> : null}
                        {title}
                    </span>
                    <span
                        className="shrink-0 rounded-full px-2 py-[2px] text-[0.6875rem] font-bold whitespace-nowrap"
                        style={
                            required
                                ? { background: "var(--road-required-bg)", color: "var(--road-required-text)" }
                                : { background: "var(--road-neutral-chip)", color: "var(--text-muted)" }
                        }
                    >
                        {tag}
                    </span>
                </span>
                <span className="mt-0.5 block text-[0.8438rem] leading-snug text-text-muted">{status}</span>
            </span>
            {href ? <ChevronRight size={16} aria-hidden className="mt-1 shrink-0 text-text-muted" /> : null}
        </>
    );
    const className = "relative flex min-h-[52px] items-start gap-3 px-4 py-2";
    return href ? (
        <Link href={href} className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset`}>
            {content}
        </Link>
    ) : (
        <div className={className}>{content}</div>
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
    const tone = getCourseMapUnitTone(unitNumber);
    const weekLabel = formatLevelLabel(weekNumber, showUnitMonths);
    const unitLabel = showUnitMonths && unitMonth ? `Unit ${unitNumber} · ${unitMonth}` : `Unit ${unitNumber}`;
    const weekDone = progress.total > 0 && progress.done >= progress.total;
    const showMomentum = momentum != null && (momentum.streak > 0 || momentum.weeklyPoints > 0);

    const currentIndex = items.findIndex((item) => item.status === "current" || item.status === "todo");
    const steps = groupRoadWeekSteps(items.map((item, index) => toRoadActivity(item, index === currentIndex, weekNumber)));
    const allDone = (list: RoadActivity[]) => list.length > 0 && list.every((a) => a.done);
    const quiz = steps.quiz[0];

    type Line = { key: string; numbered: boolean; title: string; status: ReactNode; tag: string; href: string | null; done: boolean; required?: boolean };
    const lines: Line[] = [];
    if (steps.words.length > 0) {
        const doneCount = steps.words.filter((a) => a.done).length;
        lines.push({
            key: "words",
            numbered: true,
            title: "Words",
            status: `${steps.words.map(rowTitle).join(" · ")}${doneCount > 0 ? ` (${doneCount} of ${steps.words.length} done)` : ""}`,
            tag: "Start before Tues",
            href: stepHref(steps.words),
            done: allDone(steps.words),
        });
    }
    if (steps.grammar.length > 0) {
        lines.push({ key: "grammar", numbered: true, title: "Grammar", status: steps.grammar.map(rowTitle).join(" · "), tag: "Start before Tues", href: stepHref(steps.grammar), done: allDone(steps.grammar) });
    }
    if (showUnitMonths) {
        lines.push({ key: "class", numbered: true, title: "Class", status: "Send a question before class", tag: "Tues & Thurs", href: mapHref, done: false });
    }
    if (quiz) {
        lines.push({
            key: "quiz",
            numbered: true,
            title: "Quiz",
            status: quiz.done ? "Done. You can try again for a better score." : quiz.href ? "Open now. Do it even if you were absent." : "Opens Thursday",
            tag: "Required · Thurs",
            href: quiz.href,
            done: quiz.done,
            required: true,
        });
    }

    let n = 0;
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
                <div className="px-4 pt-4 pb-3" style={{ background: tone.surface }}>
                    <span className="flex items-center justify-between gap-3 text-[0.8438rem] font-bold text-text-muted">
                        <span className="min-w-0 truncate">
                            <span style={{ color: tone.accent }}>{unitLabel}</span> · {weekLabel}
                        </span>
                        {momentum && showMomentum ? (
                            <span className="flex shrink-0 items-center gap-2.5 text-[0.8125rem]">
                                {momentum.streak > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <Flame size={14} aria-hidden style={{ color: "var(--tone-speaking-accent, #b56e1a)" }} />
                                        <span className="text-text">{momentum.streak}</span>
                                        <span className="sr-only"> {momentum.streak === 1 ? "day" : "days"} in a row</span>
                                    </span>
                                ) : null}
                                <span className="flex items-center gap-1">
                                    <Star size={14} aria-hidden fill="var(--accent-color, #e9c46a)" style={{ color: "#cba342" }} />
                                    <span className="text-text">{momentum.weeklyPoints.toLocaleString()}</span>
                                    <span className="sr-only"> points this week</span>
                                </span>
                            </span>
                        ) : null}
                    </span>
                    <h2 className="mt-1.5 mb-0 font-display text-[1.5625rem] font-bold leading-[1.18] text-balance text-text">{weekTitle}</h2>
                    <WeekLearningDisclosure weekNumber={weekNumber} accent={tone.accent} className="mt-1" />
                </div>

                <div className="p-3">
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

                {lines.length > 0 ? (
                    <div className="pb-1">
                        {lines.map((line, index) => (
                            <StepLine
                                key={line.key}
                                marker={line.numbered ? String(++n) : null}
                                title={line.title}
                                status={line.status}
                                tag={line.tag}
                                href={line.href}
                                done={line.done}
                                required={line.required}
                                accent={tone.button}
                                last={index === lines.length - 1}
                            />
                        ))}
                    </div>
                ) : null}

                <Link
                    href={mapHref}
                    className="flex min-h-12 items-center justify-center gap-1 text-[0.875rem] font-bold text-text-muted"
                    style={{ borderTop: DIVIDER }}
                >
                    More practice on the Map
                    <ChevronRight size={16} aria-hidden />
                </Link>
            </div>
        </section>
    );
}
