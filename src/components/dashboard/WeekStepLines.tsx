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
    inset,
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
    inset: number;
}) {
    const content = (
        <>
            {last ? null : (
                <span aria-hidden className="absolute top-[26px] -bottom-[14px] w-[2px]" style={{ left: inset + 5, background: "var(--road-rail)" }} />
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
 * 1. Words, 2. Grammar, 3. Class, 4. Quiz. The full activity list lives on the Map.
 */
export function WeekStepLines({
    items,
    weekNumber,
    mapHref,
    showUnitMonths,
    accent,
    inset = 16,
}: {
    items: TimelineItem[];
    weekNumber: number;
    mapHref: string;
    showUnitMonths: boolean;
    accent: string;
    inset?: number;
}) {
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
                    accent={accent}
                    last={index === lines.length - 1}
                    inset={inset}
                />
            ))}
        </div>
    );
}
