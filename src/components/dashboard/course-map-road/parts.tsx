"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronDown, ChevronRight, Lock, Play, Plus } from "lucide-react";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { ClassQuestionBox, useClassQuestionsEnabled } from "@/components/dashboard/course-map-road/ClassQuestionBox";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { getWeekLearning } from "@/lib/week-learning";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivityType } from "@/lib/course-map";
import {
    formatRoadCtaTitle,
    formatRoadRowLabels,
    groupRoadWeekSteps,
    type RoadActivity,
    type RoadCycle,
    type RoadUnit,
    type RoadWeek,
} from "@/lib/course-map-road";

const HALO = "0 0 0 4px var(--bg-color)";
const ROW_BORDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

// ── Rail + row shell ──────────────────────────────────────────────────────────

/** Two-column road row: the rail (and node) on the left, content on the right. */
export function RoadRow({
    future,
    node,
    children,
    id,
    spyWeek,
    fullWidth = false,
}: {
    /** Dashed rail for stretches after the class week. */
    future: boolean;
    node?: ReactNode;
    children: ReactNode;
    id?: string;
    spyWeek?: number;
    /** Signs span the road; the rail shows in the gaps above and below them. */
    fullWidth?: boolean;
}) {
    const rail = (
        <span
            aria-hidden
            className="absolute top-0 bottom-0 left-[33px] w-[3px]"
            style={{
                background: future
                    ? "repeating-linear-gradient(to bottom, var(--road-rail-future) 0 6px, transparent 6px 12px)"
                    : "var(--road-rail)",
            }}
        />
    );
    if (fullWidth) {
        return (
            <div id={id} data-road-spy={spyWeek} className="relative px-4">
                {rail}
                <div className="relative">{children}</div>
            </div>
        );
    }
    return (
        <div
            id={id}
            data-road-spy={spyWeek}
            className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-2 pr-4 pl-3"
        >
            {rail}
            <div className="relative flex justify-center" aria-hidden>
                {node}
            </div>
            <div className="min-w-0">{children}</div>
        </div>
    );
}

export function WeekNode({ week, accent }: { week: RoadWeek; accent: string }) {
    const base: CSSProperties = { boxShadow: HALO, marginTop: 16 };
    if (week.isCurrent) {
        return (
            <span
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[1.125rem] font-extrabold"
                style={{
                    ...base,
                    marginTop: 14,
                    background: accent,
                    color: "var(--road-on-accent)",
                    boxShadow: `${HALO}, 0 0 0 9px color-mix(in srgb, ${accent} 22%, transparent)`,
                }}
            >
                {week.weekNumber}
            </span>
        );
    }
    if (week.isLocked) {
        return (
            <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full"
                style={{
                    ...base,
                    background: "var(--road-locked-bg)",
                    border: "2px dashed var(--road-rail-future)",
                    color: "var(--road-locked-icon)",
                }}
            >
                <Lock size={14} />
            </span>
        );
    }
    if (week.isDone) {
        return (
            <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full"
                style={{ ...base, background: "var(--success-color)", color: "var(--road-on-success)" }}
            >
                <Check size={16} strokeWidth={3} />
            </span>
        );
    }
    return (
        <span
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[0.8125rem] font-extrabold"
            style={{
                ...base,
                background: "var(--bg-color)",
                border: `2px solid ${week.isFuture ? "var(--road-rail-future)" : "var(--road-node-past-border)"}`,
                color: week.isFuture ? "var(--road-future-meta)" : "var(--text)",
            }}
        >
            {week.weekNumber}
        </span>
    );
}

function Chevron({ open }: { open: boolean }) {
    return (
        <ChevronDown
            size={20}
            aria-hidden
            className="shrink-0 text-text-muted transition-transform duration-200 motion-reduce:transition-none"
            style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
    );
}

// ── Cycle banner + unit sign ──────────────────────────────────────────────────

export function CycleBanner({
    cycle,
    open,
    onToggle,
}: {
    cycle: RoadCycle;
    open: boolean;
    onToggle?: () => void;
}) {
    const label = `Cycle ${cycle.number}${cycle.isCurrent ? " · now" : ""}`;
    const body = (
        <>
            <span className="min-w-0 flex-1">
                <span className="block text-[0.7188rem] font-extrabold uppercase tracking-[.1em] opacity-75">{label}</span>
                <span className="block font-display text-[1.125rem] font-bold leading-tight">{cycle.range}</span>
                {cycle.summary ? <span className="mt-0.5 block text-[0.8125rem] opacity-85">{cycle.summary}</span> : null}
            </span>
            {onToggle ? <ChevronDown size={20} aria-hidden className="shrink-0 transition-transform motion-reduce:transition-none" style={{ transform: open ? "rotate(180deg)" : "none" }} /> : null}
        </>
    );
    const className = "mt-[18px] mb-1 flex w-full items-center gap-3 rounded-2xl px-[14px] py-3 text-left";
    const style: CSSProperties = { background: "var(--road-ink)", color: "var(--road-ink-text)" };
    return onToggle ? (
        <button type="button" onClick={onToggle} aria-expanded={open} className={className} style={style}>
            {body}
        </button>
    ) : (
        <div className={className} style={style}>
            {body}
        </div>
    );
}

export function UnitSign({
    unit,
    open,
    showMonth,
    onToggle,
}: {
    unit: RoadUnit;
    open: boolean;
    showMonth: boolean;
    onToggle?: () => void;
}) {
    const tone = getCourseMapUnitTone(unit.unitNumber);
    const neutral = unit.isLocked;
    const accent = neutral ? "var(--road-future-title)" : tone.accent;
    const chip = neutral ? "var(--road-neutral-chip)" : tone.chipBg;
    const eyebrow = showMonth && unit.month ? `Unit ${unit.unitNumber} · ${unit.month}` : `Unit ${unit.unitNumber}`;
    // Chip colors are translucent in dark mode; lay them on the page color so the rail doesn't show through.
    const style: CSSProperties = { background: `linear-gradient(${chip}, ${chip}), var(--bg-color)` };

    const body = (
        <>
            <span className="min-w-0 flex-1">
                <span className="block text-[0.7188rem] font-extrabold uppercase tracking-[.08em]" style={{ color: accent }}>
                    {eyebrow}
                </span>
                <span className="block font-display text-[1.0625rem] font-bold leading-tight text-text">{unit.title}</span>
                {unit.summary ? (
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold" style={{ color: "var(--road-summary)" }}>
                        {unit.summary}
                    </span>
                ) : null}
            </span>
            {onToggle ? <Chevron open={open} /> : null}
        </>
    );
    const className = "mt-5 mb-2 flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left";
    return onToggle ? (
        <button type="button" onClick={onToggle} aria-expanded={open} className={className} style={style}>
            {body}
        </button>
    ) : (
        <div className={className} style={style}>
            {body}
        </div>
    );
}

// ── Activity rows ─────────────────────────────────────────────────────────────

export function ActivityRow({
    activity,
    showNext,
    inset = 16,
    divider = true,
    emphasizeNext = true,
}: {
    activity: RoadActivity;
    showNext: boolean;
    inset?: number;
    /** The line above the row; off for the first row under a step heading. */
    divider?: boolean;
    /** Filled row and Start pill. Off when Continue already names the next activity. */
    emphasizeNext?: boolean;
}) {
    const isNext = showNext && activity.isNext;
    const showStart = isNext && emphasizeNext;
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = format.icon;
    const labels = formatRoadRowLabels(activity, format.label);
    const locked = !activity.done && activity.href == null;
    const score = activity.quizScore;
    const perfect = score != null && score.correct >= score.total;

    // The circle wears the activity's color: soft when done, outlined when waiting, filled when next.
    const ring = locked ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-muted" style={{ border: "1.5px dashed var(--road-rail-future)" }}>
            <Lock size={14} aria-hidden />
        </span>
    ) : (
        <span
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={
                activity.done
                    ? { background: tone.surface, color: tone.accent }
                    : isNext
                      ? { background: tone.accent, color: "var(--road-on-tone)" }
                      : { background: "var(--surface-base)", border: `2px solid ${tone.accent}`, color: tone.accent }
            }
        >
            <Icon size={19} aria-hidden />
            {activity.done ? (
                <span
                    className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full"
                    style={{ background: "var(--success-color)", color: "var(--road-on-success)", boxShadow: "0 0 0 2px var(--surface-base)" }}
                >
                    <Check size={10} strokeWidth={3.5} aria-hidden />
                </span>
            ) : null}
        </span>
    );

    const content = (
        <>
            {ring}
            <span className="min-w-0 flex-1">
                <span className={`block text-[0.9375rem] leading-[1.3] ${activity.done ? "font-medium text-text-muted" : "font-semibold text-text"}`}>{labels.title}</span>
                {labels.detail ? (
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold" style={{ color: activity.done ? "var(--text-muted)" : tone.chipText }}>
                        {labels.detail}
                    </span>
                ) : null}
                {score && !perfect ? (
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold" style={{ color: tone.chipText }}>
                        Try again!
                    </span>
                ) : null}
                {/* The check badge, lock and Start label carry these visually. */}
                {activity.done ? <span className="sr-only">Done</span> : null}
                {locked ? <span className="sr-only">Opens later</span> : null}
                {isNext && !showStart ? <span className="sr-only">Next</span> : null}
            </span>
            {showStart ? (
                <span className="shrink-0 rounded-full px-3 py-1.5 text-[0.8125rem] font-bold" style={{ background: tone.accent, color: "var(--road-on-tone)" }}>
                    Start
                </span>
            ) : null}
            {score ? (
                <span
                    className="shrink-0 rounded-full px-3 py-1.5 text-[0.8125rem] font-bold tabular-nums"
                    style={perfect ? { background: "var(--road-done-bg)", color: "var(--road-done-text)" } : { background: tone.chipBg, color: tone.chipText }}
                >
                    <span className="sr-only">Best score: </span>
                    {Math.round((score.correct / score.total) * 100)}%
                    {perfect ? <span aria-hidden> 🎉</span> : null}
                </span>
            ) : null}
        </>
    );

    const className = "flex min-h-[64px] items-center gap-3 py-2.5 text-left";
    const style: CSSProperties = {
        paddingLeft: inset,
        paddingRight: inset,
        borderTop: divider ? ROW_BORDER : undefined,
        background: showStart ? `color-mix(in srgb, ${tone.accent} 9%, transparent)` : undefined,
    };

    if (!activity.href) {
        return (
            <div className={`${className} opacity-70`} style={style} aria-disabled="true">
                {content}
            </div>
        );
    }
    return (
        <Link href={activity.href} className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset`} style={style}>
            {content}
        </Link>
    );
}

/** Timeline items as road rows; the current item (or first to-do) is next. Locked items get no link. */
export function timelineToRoadActivities(items: TimelineItem[], weekNumber?: number): RoadActivity[] {
    const currentIndex = items.findIndex((item) => item.status === "current");
    const nextIndex = currentIndex >= 0 ? currentIndex : items.findIndex((item) => item.status === "todo");
    return items.map((item, index) => ({
        id: item.activityId,
        title: item.title,
        activityType: item.type as CourseMapActivityType,
        vocabUi: item.vocabUi,
        weekNumber,
        href: item.status === "locked" ? null : item.href,
        done: item.status === "done",
        isNext: index === nextIndex,
    }));
}

/** One bar per activity: green when done, unit color when next. */
export function SegmentedProgress({ activities, accent }: { activities: RoadActivity[]; accent: string }) {
    return (
        <div className="flex flex-1 gap-1" aria-hidden>
            {activities.map((activity) => (
                <span
                    key={activity.id}
                    className="h-2 flex-1 rounded"
                    style={{
                        background: activity.done
                            ? "var(--success-color)"
                            : activity.isNext
                              ? `color-mix(in srgb, ${accent} 45%, transparent)`
                              : "var(--road-progress-todo)",
                    }}
                />
            ))}
        </div>
    );
}

// ── What you'll learn ─────────────────────────────────────────────────────────

/** A tap-to-open list of the week's "I can" goals and the reference pages that help. */
export function WeekLearningDisclosure({
    weekNumber,
    accent,
    className = "",
    compact = false,
}: {
    weekNumber: number;
    accent: string;
    className?: string;
    /** Shorter tap row for a header that already has its own padding. */
    compact?: boolean;
}) {
    const learning = getWeekLearning(weekNumber);
    if (!learning) return null;
    return (
        <details className={`group ${className}`}>
            <summary
                className={`inline-flex cursor-pointer list-none items-center gap-1 text-[0.875rem] font-bold [&::-webkit-details-marker]:hidden ${
                    compact ? "min-h-7 leading-tight" : "min-h-[36px]"
                }`}
                style={{ color: accent }}
            >
                What you&apos;ll learn
                <ChevronDown size={16} aria-hidden className="transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <ul className="m-0 mt-1 list-none space-y-1 p-0">
                {learning.canDo.map((line) => (
                    <li key={line} className="flex gap-2 text-[0.875rem] leading-snug text-text">
                        <Check size={15} strokeWidth={3} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--success-color)" }} />
                        {line}
                    </li>
                ))}
            </ul>
            {learning.pages.length > 0 ? (
                <div className="mt-2.5 rounded-[12px] px-3 py-2" style={{ background: "var(--road-neutral-chip)" }}>
                    <p className="m-0 text-[0.8125rem] font-bold text-text">Need more help? Grammar Reference Sheets:</p>
                    <ul className="m-0 mt-0.5 list-none p-0">
                        {learning.pages.map((page) => (
                            <li key={page.section} className="text-[0.8125rem] leading-snug text-text-muted">
                                <span className="font-bold text-text">p. {page.page}</span> · {page.label}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </details>
    );
}

// ── Week steps ────────────────────────────────────────────────────────────────

/** A small activity button for the "More practice" step; the check marks it done. */
function PracticePill({ activity }: { activity: RoadActivity }) {
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = activity.done ? Check : format.icon;
    const { title } = formatRoadRowLabels(activity, format.label);
    const className = "inline-flex min-h-[40px] max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.875rem] font-semibold";
    const style: CSSProperties = { background: "var(--surface-base)", border: ROW_BORDER, color: activity.done ? "var(--text-muted)" : "var(--text)" };
    const content = (
        <>
            <Icon size={15} aria-hidden className="shrink-0" style={{ color: activity.done ? "var(--success-color)" : tone.accent }} strokeWidth={activity.done ? 3 : 2} />
            <span className="truncate">{title}</span>
            {activity.done ? <span className="sr-only">Done</span> : null}
        </>
    );
    if (!activity.href) {
        return (
            <span className={`${className} opacity-70`} style={style} aria-disabled="true">
                {content}
            </span>
        );
    }
    return (
        <Link href={activity.href} className={`${className} focus-visible:outline-none focus-visible:ring-2`} style={style}>
            {content}
        </Link>
    );
}

/** A step's small dot on the road; only weeks get numbered circles. */
function StepNode({ required, filled, accent }: { required: boolean; filled: boolean; accent: string }) {
    return (
        <span
            className="mt-[11px] block h-3 w-3 rounded-full"
            style={{
                boxShadow: HALO,
                background: required ? "var(--road-required-bg)" : filled ? accent : "var(--road-rail)",
            }}
        />
    );
}

function StepHeading({ marker, title, tag, required }: { marker: string | null; title: string; tag: string | null; required: boolean }) {
    return (
        <div className="flex min-h-[32px] flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h4 className="m-0 text-[1.0625rem] font-bold leading-tight text-text">
                {marker ? <span className="mr-1.5 text-text-muted">{marker}.</span> : null}
                {title}
            </h4>
            {tag ? (
                <span
                    className="shrink-0 rounded-full px-2.5 py-[3px] text-[0.75rem] font-bold whitespace-nowrap"
                    style={
                        required
                            ? { background: "var(--road-required-bg)", color: "var(--road-required-text)" }
                            : { background: "var(--road-neutral-chip)", color: "var(--text-muted)" }
                    }
                >
                    {tag}
                </span>
            ) : null}
        </div>
    );
}

/** Rows under a step heading: no box, just dividers between them. */
function StepRows({ activities, showNext, emphasizeNext }: { activities: RoadActivity[]; showNext: boolean; emphasizeNext: boolean }) {
    return (
        <div className="-mx-2">
            {activities.map((activity, index) => (
                <ActivityRow key={activity.id} activity={activity} showNext={showNext} emphasizeNext={emphasizeNext} inset={8} divider={index > 0} />
            ))}
        </div>
    );
}

/**
 * The week as the class routine: words and grammar to start before Tuesday,
 * class, more practice all week, then the required quiz. Timing tags only show
 * on the class week and the weeks after it; past weeks keep just the groups.
 */
function WeekSteps({
    week,
    showNext,
    emphasizeNext = true,
    extrasOpen,
    onToggleExtras,
}: {
    week: RoadWeek;
    showNext: boolean;
    /** When Continue already names the next activity, rows stay one list. */
    emphasizeNext?: boolean;
    extrasOpen: boolean;
    onToggleExtras: () => void;
}) {
    const tone = getCourseMapUnitTone(week.unitNumber);
    const questionsEnabled = useClassQuestionsEnabled();
    const steps = groupRoadWeekSteps(week.activities);
    const ahead = week.isCurrent || week.state === "upcoming";
    const hasPractice = steps.practice.length > 0 || week.extras.length > 0;

    type Step = { key: string; numbered: boolean; title: string; tag: string | null; required?: boolean; filled: boolean; body?: ReactNode };
    const list: Step[] = [];
    if (steps.words.length > 0) {
        list.push({ key: "words", numbered: true, title: "Words", tag: ahead ? "Start before Tues" : null, filled: true, body: <StepRows activities={steps.words} showNext={showNext} emphasizeNext={emphasizeNext} /> });
    }
    if (steps.grammar.length > 0) {
        list.push({ key: "grammar", numbered: true, title: "Grammar", tag: ahead ? "Start before Tues" : null, filled: true, body: <StepRows activities={steps.grammar} showNext={showNext} emphasizeNext={emphasizeNext} /> });
    }
    if (ahead) {
        list.push({
            key: "class",
            numbered: true,
            title: "Class",
            tag: "Tues & Thurs",
            filled: questionsEnabled,
            body: questionsEnabled ? <ClassQuestionBox weekNumber={week.weekNumber} accent={tone.button} /> : undefined,
        });
    }
    if (hasPractice) {
        list.push({
            key: "practice",
            numbered: false,
            title: "More practice",
            tag: ahead ? "All week" : null,
            filled: false,
            body: (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {steps.practice.map((activity) => (
                        <PracticePill key={activity.id} activity={activity} />
                    ))}
                    {extrasOpen ? week.extras.map((activity) => <PracticePill key={activity.id} activity={activity} />) : null}
                    {week.extras.length > 0 ? (
                        <button
                            type="button"
                            onClick={onToggleExtras}
                            aria-expanded={extrasOpen}
                            className="inline-flex min-h-[40px] items-center gap-1 rounded-full px-3 py-1.5 text-[0.875rem] font-semibold text-text-muted"
                            style={{ border: "1.5px dashed color-mix(in srgb, var(--road-rail) 85%, transparent)" }}
                        >
                            {extrasOpen ? null : <Plus size={15} aria-hidden />}
                            {extrasOpen ? "Fewer games" : `${week.extras.length} more games`}
                        </button>
                    ) : null}
                </div>
            ),
        });
    }
    if (steps.quiz.length > 0) {
        list.push({ key: "quiz", numbered: true, title: "Quiz", tag: ahead ? "Required · Thurs" : "Required", required: true, filled: true, body: <StepRows activities={steps.quiz} showNext={showNext} emphasizeNext={emphasizeNext} /> });
    }

    // Each step sits on the road itself, so an open week reads as part of the path.
    let n = 0;
    return (
        <>
            {list.map((step) => (
                <RoadRow
                    key={step.key}
                    future={week.isFuture}
                    node={<StepNode required={step.required ?? false} filled={step.filled} accent={tone.button} />}
                >
                    <div className="pb-4">
                        <StepHeading marker={step.numbered ? String(++n) : null} title={step.title} tag={step.tag} required={step.required ?? false} />
                        {step.body ? <div className="mt-1">{step.body}</div> : null}
                    </div>
                </RoadRow>
            ))}
        </>
    );
}

// ── Week rows ─────────────────────────────────────────────────────────────────

function weekLine(week: RoadWeek, weekNoun: string): string {
    return week.dates ? `${weekNoun} ${week.weekNumber} · ${week.dates}` : `${weekNoun} ${week.weekNumber}`;
}

function WeekHeading({ week, weekNoun }: { week: RoadWeek; weekNoun: string }) {
    return (
        <h3 id={`road-week-${week.weekNumber}-heading`} tabIndex={-1} className="sr-only">
            {weekNoun} {week.weekNumber}: {week.title}
        </h3>
    );
}

export function CompactWeekRow({
    week,
    weekNoun,
    open,
    optionalOpen,
    onToggle,
    onToggleOptional,
}: {
    week: RoadWeek;
    weekNoun: string;
    open: boolean;
    optionalOpen: boolean;
    onToggle: () => void;
    onToggleOptional: () => void;
}) {
    const tone = getCourseMapUnitTone(week.unitNumber);
    const status = week.isDone
        ? "All done ✓"
        : week.state === "upcoming"
          ? (week.note ?? `${week.total} activities`)
          : `${week.done} of ${week.total} done`;
    return (
        <>
        <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={week.isFuture} node={<WeekNode week={week} accent={tone.button} />}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex min-h-[60px] w-full items-center gap-2 py-2.5 text-left"
            >
                <span className="min-w-0 flex-1">
                    <span className="block text-[0.8125rem] font-bold text-text-muted">{weekLine(week, weekNoun)}</span>
                    <span className="block text-[1.0313rem] font-bold leading-snug text-text">{week.title}</span>
                    <span
                        className="block text-[0.8438rem]"
                        style={{ color: week.isDone ? "var(--success-color)" : "var(--text-muted)" }}
                    >
                        {status}
                    </span>
                </span>
                <Chevron open={open} />
            </button>
            {open ? <WeekLearningDisclosure weekNumber={week.weekNumber} accent={tone.accent} className="-mt-1 pb-2" /> : null}
        </RoadRow>
        {open ? <WeekSteps week={week} showNext={week.state === "upcoming"} extrasOpen={optionalOpen} onToggleExtras={onToggleOptional} /> : null}
        </>
    );
}

export function LockedWeekRow({ week, weekNoun }: { week: RoadWeek; weekNoun: string }) {
    return (
        <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={week.isFuture} node={<WeekNode week={week} accent="" />}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <div className="flex min-h-[58px] flex-col justify-center py-2.5">
                <span className="block text-[0.8125rem] font-bold" style={{ color: "var(--road-future-meta)" }}>
                    {weekLine(week, weekNoun)}
                </span>
                <span className="block text-[1rem] font-bold leading-snug" style={{ color: "var(--road-future-title)" }}>
                    {week.title}
                </span>
                {week.note ? <span className="block text-[0.8438rem] text-text-muted">{week.note}</span> : null}
            </div>
        </RoadRow>
    );
}

export function CurrentWeekCard({
    week,
    weekNoun,
    nextWeekOpen,
    optionalOpen,
    onToggleOptional,
}: {
    week: RoadWeek;
    weekNoun: string;
    /** Whether the following week is already open, for the all-done copy. */
    nextWeekOpen: boolean;
    optionalOpen: boolean;
    onToggleOptional: () => void;
}) {
    const tone = getCourseMapUnitTone(week.unitNumber);
    const next = week.next;
    const [stepsOpen, setStepsOpen] = useState(true);
    const hasSteps = week.activities.length > 0 || week.extras.length > 0;
    const tray: CSSProperties = {
        background: `color-mix(in srgb, ${tone.accent} 8%, var(--surface-base))`,
        borderColor: `color-mix(in srgb, ${tone.accent} 34%, transparent)`,
    };
    // The week number stays on the rail. The tray holds the title, progress, and Continue.
    return (
        <div className="my-2">
            <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={false} node={<WeekNode week={week} accent={tone.button} />}>
                <WeekHeading week={week} weekNoun={weekNoun} />
                <div className="rounded-[18px] border px-3.5 pt-2.5 pb-3" style={tray}>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.8438rem] font-bold leading-tight whitespace-nowrap text-text-muted">
                            {weekNoun} {week.weekNumber}
                        </span>
                        <span
                            className="shrink-0 rounded-full px-2 py-[3px] text-[0.6563rem] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            You are here
                        </span>
                    </div>
                    <div className="relative mt-1">
                        <p className="m-0 min-w-0 pr-11 font-display text-[1.5rem] font-bold leading-[1.12] text-text">{week.title}</p>
                        {hasSteps ? (
                            <button
                                type="button"
                                onClick={() => setStepsOpen((open) => !open)}
                                aria-expanded={stepsOpen}
                                aria-controls={`road-week-${week.weekNumber}-steps`}
                                aria-label={stepsOpen ? "Hide this week's steps" : "Show this week's steps"}
                                className="absolute top-1/2 right-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full"
                            >
                                <Chevron open={stepsOpen} />
                            </button>
                        ) : null}
                    </div>
                    <WeekLearningDisclosure weekNumber={week.weekNumber} accent={tone.accent} compact className="mt-0.5" />
                    {week.total > 0 ? (
                        <div className="mt-1.5 flex items-center gap-3">
                            <div className="flex flex-1 gap-1" aria-hidden>
                                {week.activities
                                    .filter((activity) => activity.href != null)
                                    .map((activity) => (
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
                            <span className="text-[0.8438rem] font-bold whitespace-nowrap text-text-muted">
                                {week.done} of {week.total} done
                            </span>
                        </div>
                    ) : null}

                    {next?.href ? (
                        <Link
                            href={next.href}
                            className="mt-2.5 flex min-h-[52px] items-center gap-2.5 rounded-[14px] px-3 py-2"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--road-on-accent)", color: tone.button }}>
                                <Play size={15} fill="currentColor" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[0.6875rem] font-extrabold uppercase tracking-[.06em] opacity-90">
                                    {week.done > 0 ? "Continue" : "Start"}
                                </span>
                                <span className="block text-[0.9375rem] font-bold leading-snug">{formatRoadCtaTitle(next.title)}</span>
                            </span>
                            <ChevronRight size={18} aria-hidden className="shrink-0" />
                        </Link>
                    ) : week.isDone ? (
                        <p className="mt-2.5 mb-0 rounded-2xl px-4 py-3 text-[0.9375rem] leading-snug font-bold" style={{ background: "var(--road-done-bg)", color: "var(--road-done-text)" }}>
                            You finished this week! You can review anything below
                            {nextWeekOpen ? " or start next week early." : "."}
                        </p>
                    ) : null}
                </div>
            </RoadRow>
            {hasSteps && stepsOpen ? (
                <div id={`road-week-${week.weekNumber}-steps`} className="mt-3">
                    <WeekSteps week={week} showNext emphasizeNext={false} extrasOpen={optionalOpen} onToggleExtras={onToggleOptional} />
                </div>
            ) : null}
        </div>
    );
}
