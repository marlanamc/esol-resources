"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import type { CourseMapActivityType } from "@/lib/course-map";
import { formatRoadRowLabels, groupRoadWeekSteps, type RoadActivity } from "@/lib/course-map-road";

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
        ...(item.keepGoing ? { keepGoing: item.keepGoing } : {}),
        ...(item.keepGoingLevels ? { keepGoingLevels: item.keepGoingLevels } : {}),
        ...(item.estMinutes ? { estMinutes: item.estMinutes } : {}),
    };
}

function rowTitle(activity: RoadActivity): string {
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    return formatRoadRowLabels(activity, format.label).title;
}

/** Where a step line goes: the first unfinished activity in it, else the first one. */
function stepHref(activities: RoadActivity[]): string | null {
    return (activities.find((a) => !a.done && a.href) ?? activities.find((a) => a.href))?.href ?? null;
}

type LevelProgress = { passed: number; total: number };

/**
 * A level game that met this week's goal but has levels left: a gold ring that
 * fills with levels passed. The green check is saved for every level done.
 */
function LevelRing({ levels }: { levels: LevelProgress }) {
    const size = 22;
    const stroke = 4;
    const r = (size - stroke) / 2;
    const pct = levels.total > 0 ? Math.min(100, (levels.passed / levels.total) * 100) : 0;
    return (
        <svg
            aria-hidden
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="relative z-[1] mt-px -ml-1 -mr-1 shrink-0 rounded-full"
            style={{ background: "var(--surface-base)", boxShadow: "0 0 0 3px var(--surface-base)" }}
        >
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="var(--road-progress-todo)" />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                stroke="var(--accent-color-dark)"
                pathLength={100}
                strokeDasharray={`${pct} 100`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </svg>
    );
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
    current = false,
    levels,
    accent,
    last,
    inset,
}: {
    marker: string | null;
    title: string;
    status: ReactNode;
    tag?: string;
    href: string | null;
    done: boolean;
    required?: boolean;
    current?: boolean;
    levels?: LevelProgress;
    accent: string;
    last: boolean;
    inset: number;
}) {
    const content = (
        <>
            {last ? null : (
                <span aria-hidden className="absolute top-[26px] -bottom-[14px] w-[2px]" style={{ left: inset + 5, background: "var(--road-rail)" }} />
            )}
            {levels ? (
                <LevelRing levels={levels} />
            ) : (
                // Done: green check. Required (quiz): red. Not started: an open circle,
                // with a dot in the middle on the one that is next.
                <span
                    aria-hidden
                    className="relative z-[1] mt-[5px] box-border flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: done ? "var(--success-color)" : required ? "var(--road-required-bg)" : "var(--surface-base)",
                        border: done || required ? undefined : `2px solid ${accent}`,
                        boxShadow: "0 0 0 3px var(--surface-base)",
                    }}
                >
                    {done ? <Check size={9} strokeWidth={4} style={{ color: "var(--road-on-success)" }} /> : null}
                    {!done && !required && current ? <span className="h-[6px] w-[6px] rounded-full" style={{ background: accent }} /> : null}
                </span>
            )}
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                    <span className="text-[0.9688rem] font-bold leading-snug text-text">
                        {marker ? <span className="mr-1 text-text-muted">{marker}.</span> : null}
                        {title}
                    </span>
                    {tag ? (
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
                    ) : null}
                </span>
                <span className="mt-0.5 block text-[0.8438rem] leading-snug text-text-muted">{status}</span>
            </span>
            {href ? <ChevronRight size={16} aria-hidden className="mt-1 shrink-0 text-text-muted" /> : null}
        </>
    );
    const className = "relative flex min-h-[52px] items-start gap-3 py-2";
    const style = { paddingLeft: inset, paddingRight: inset };
    return href ? (
        <Link href={href} className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset`} style={style}>
            {content}
        </Link>
    ) : (
        <div className={className} style={style}>
            {content}
        </div>
    );
}

/**
 * The week's steps for the home cards (phone and desktop), matching the Map:
 * 1. Words, 2. Grammar, 3. Quiz. Weeks with none of those list each activity
 * instead. The full activity list lives on the Map;
 * questions for class live next to Class links.
 */
export function WeekStepLines({
    items,
    weekNumber,
    accent,
    inset = 16,
}: {
    items: TimelineItem[];
    weekNumber: number;
    accent: string;
    inset?: number;
}) {
    const currentIndex = items.findIndex((item) => item.status === "current" || item.status === "todo");
    const steps = groupRoadWeekSteps(items.map((item, index) => toRoadActivity(item, index === currentIndex, weekNumber)));
    const allDone = (list: RoadActivity[]) => list.length > 0 && list.every((a) => a.done);
    const quiz = steps.quiz[0];

    type Line = { key: string; numbered: boolean; title: string; status: ReactNode; tag?: string; href: string | null; done: boolean; required?: boolean; current?: boolean; levels?: LevelProgress };
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
            current: steps.words.some((a) => a.isNext),
        });
    }
    if (steps.grammar.length > 0) {
        lines.push({ key: "grammar", numbered: true, title: "Grammar", status: steps.grammar.map(rowTitle).join(" · "), tag: "Start before Thurs", href: stepHref(steps.grammar), done: allDone(steps.grammar), current: steps.grammar.some((a) => a.isNext) });
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

    // Short weeks with no words, guide, or quiz (e.g. Thanksgiving's games): list each activity.
    if (lines.length === 0) {
        for (const activity of steps.practice) {
            const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
            const levels = activity.done ? activity.keepGoingLevels : undefined;
            lines.push({
                key: activity.id,
                numbered: true,
                title: rowTitle(activity),
                // The big button already says what is next, so a not-started row shows
                // what kind of activity it is and how long it takes.
                status: activity.done ? (
                    activity.keepGoing ? `Keep going · ${activity.keepGoing}` : "Done. You can play again."
                ) : activity.estMinutes ? (
                    `${format.label} · about ${activity.estMinutes} min`
                ) : (
                    format.label
                ),
                href: activity.href,
                done: activity.done,
                current: activity.isNext,
                ...(levels ? { levels } : {}),
            });
        }
    }

    if (lines.length === 0) return null;
    let n = 0;
    return (
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
                    current={line.current}
                    levels={line.levels}
                    accent={accent}
                    last={index === lines.length - 1}
                    inset={inset}
                />
            ))}
        </div>
    );
}
