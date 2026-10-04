"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Check, ChevronDown, ChevronRight, Lock, Play, Plus } from "lucide-react";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    formatRoadCtaTitle,
    type RoadActivity,
    type RoadCycle,
    type RoadUnit,
    type RoadWeek,
} from "@/lib/course-map-road";

const HALO = "0 0 0 4px var(--bg-color)";
const ROW_BORDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";
const CARD_BORDER = "1px solid color-mix(in srgb, var(--road-rail) 75%, transparent)";

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
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[18px] font-extrabold"
                style={{
                    ...base,
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
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] font-extrabold"
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
                <span className="block text-[11.5px] font-extrabold uppercase tracking-[.1em] opacity-75">{label}</span>
                <span className="block font-display text-[18px] font-bold leading-tight">{cycle.range}</span>
                {cycle.summary ? <span className="mt-0.5 block text-[13px] opacity-85">{cycle.summary}</span> : null}
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
                <span className="block text-[11.5px] font-extrabold uppercase tracking-[.08em]" style={{ color: accent }}>
                    {eyebrow}
                </span>
                <span className="block font-display text-[17px] font-bold leading-tight text-text">{unit.title}</span>
                {unit.summary ? (
                    <span className="mt-0.5 block text-[13px] font-semibold" style={{ color: "var(--road-summary)" }}>
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
}: {
    activity: RoadActivity;
    showNext: boolean;
    inset?: number;
}) {
    const isNext = showNext && activity.isNext;
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = format.icon;
    const locked = !activity.done && activity.href == null;

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
                <span className={`block text-[15px] leading-[1.3] ${activity.done ? "font-medium text-text-muted" : "font-semibold text-text"}`}>{activity.title}</span>
                <span className="mt-0.5 block text-[13px] font-semibold" style={{ color: activity.done ? "var(--text-muted)" : tone.chipText }}>
                    {format.label}
                </span>
                {/* The check badge, lock and Start label carry these visually. */}
                {activity.done ? <span className="sr-only">Done</span> : null}
                {locked ? <span className="sr-only">Opens later</span> : null}
            </span>
            {isNext ? (
                <span className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ background: tone.accent, color: "var(--road-on-tone)" }}>
                    Start
                </span>
            ) : null}
        </>
    );

    const className = "flex min-h-[64px] items-center gap-3 py-2.5 text-left";
    const style: CSSProperties = {
        paddingLeft: inset,
        paddingRight: inset,
        borderTop: ROW_BORDER,
        background: isNext ? `color-mix(in srgb, ${tone.accent} 9%, transparent)` : undefined,
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

function ActivityList({
    activities,
    showNext,
    inset,
}: {
    activities: RoadActivity[];
    showNext: boolean;
    inset?: number;
}) {
    return (
        <div>
            {activities.map((activity) => (
                <ActivityRow
                    key={activity.id}
                    activity={activity}
                    showNext={showNext}
                    inset={inset}
                />
            ))}
        </div>
    );
}

function OptionalPractice({
    week,
    open,
    onToggle,
}: {
    week: RoadWeek;
    open: boolean;
    onToggle: () => void;
}) {
    if (week.extras.length === 0) return null;
    return (
        <div className="mx-3 mt-2.5 mb-3 overflow-hidden rounded-[14px]" style={{ border: "1.5px dashed color-mix(in srgb, var(--road-rail) 85%, transparent)" }}>
            <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-h-[54px] w-full items-center gap-3 px-3 py-2.5 text-left">
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-text-muted" style={{ background: "var(--surface-subtle)" }}>
                    <Plus size={18} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[.06em] text-text-muted">Extra · not required</span>
                    <span className="block text-[15px] font-semibold text-text">More games for this week</span>
                </span>
                <Chevron open={open} />
            </button>
            {open ? <ActivityList activities={week.extras} showNext={false} inset={12} /> : null}
        </div>
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
        <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={week.isFuture} node={<WeekNode week={week} accent={tone.button} />}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex min-h-[60px] w-full items-center gap-2 py-2.5 text-left"
            >
                <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-text-muted">{weekLine(week, weekNoun)}</span>
                    <span className="block text-[16.5px] font-bold leading-snug text-text">{week.title}</span>
                    <span
                        className="block text-[13.5px]"
                        style={{ color: week.isDone ? "var(--success-color)" : "var(--text-muted)" }}
                    >
                        {status}
                    </span>
                </span>
                <Chevron open={open} />
            </button>
            {open ? (
                <div className="mb-3 overflow-hidden rounded-2xl" style={{ background: "var(--surface-base)", border: CARD_BORDER }}>
                    <div className="-mt-px">
                        <ActivityList activities={week.activities} showNext={week.state === "upcoming"} inset={14} />
                    </div>
                    <OptionalPractice week={week} open={optionalOpen} onToggle={onToggleOptional} />
                </div>
            ) : null}
        </RoadRow>
    );
}

export function LockedWeekRow({ week, weekNoun }: { week: RoadWeek; weekNoun: string }) {
    return (
        <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={week.isFuture} node={<WeekNode week={week} accent="" />}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <div className="flex min-h-[58px] flex-col justify-center py-2.5">
                <span className="block text-[13px] font-bold" style={{ color: "var(--road-future-meta)" }}>
                    {weekLine(week, weekNoun)}
                </span>
                <span className="block text-[16px] font-bold leading-snug" style={{ color: "var(--road-future-title)" }}>
                    {week.title}
                </span>
                {week.note ? <span className="block text-[13.5px] text-text-muted">{week.note}</span> : null}
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
    return (
        <RoadRow id={`road-week-${week.weekNumber}`} spyWeek={week.weekNumber} future={false} node={<WeekNode week={week} accent={tone.button} />}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <div
                className="mt-1 mb-3.5 overflow-hidden rounded-[20px]"
                style={{
                    background: "var(--surface-base)",
                    border: `1px solid color-mix(in srgb, ${tone.accent} 30%, transparent)`,
                    boxShadow: "0 12px 28px rgba(40,31,23,.12)",
                }}
            >
                <div className="px-4 pt-3.5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[13.5px] font-bold whitespace-nowrap text-text-muted">
                            {weekNoun} {week.weekNumber}
                        </span>
                        <span
                            className="shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ background: tone.button, color: "var(--road-on-accent)" }}
                        >
                            You are here
                        </span>
                    </div>
                    <p className="mt-2 mb-0 font-display text-[24px] font-bold leading-tight text-text">{week.title}</p>
                    {week.total > 0 ? (
                        <div className="mt-2.5 flex items-center gap-3">
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
                            <span className="text-[13.5px] font-bold whitespace-nowrap text-text-muted">
                                {week.done} of {week.total} done
                            </span>
                        </div>
                    ) : null}
                </div>

                {next?.href ? (
                    <Link
                        href={next.href}
                        className="mx-3 mb-3 flex min-h-[52px] items-center gap-2.5 rounded-[14px] px-3 py-2"
                        style={{
                            background: tone.button,
                            color: "var(--road-on-accent)",
                            boxShadow: `0 8px 18px color-mix(in srgb, ${tone.button} 30%, transparent)`,
                        }}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--road-on-accent)", color: tone.button }}>
                            <Play size={15} fill="currentColor" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-extrabold uppercase tracking-[.06em] opacity-90">
                                {week.done > 0 ? "Continue" : "Start"}
                            </span>
                            <span className="block text-[15px] font-bold leading-snug">{formatRoadCtaTitle(next.title)}</span>
                        </span>
                        <ChevronRight size={18} aria-hidden className="shrink-0" />
                    </Link>
                ) : week.isDone ? (
                    <p className="mx-3 mt-0 mb-3 rounded-2xl px-4 py-3 text-[15px] leading-snug font-bold" style={{ background: "var(--road-done-bg)", color: "var(--road-done-text)" }}>
                        You finished this week! You can review anything below
                        {nextWeekOpen ? " or start next week early." : "."}
                    </p>
                ) : null}

                {week.activities.length > 0 ? (
                    <>
                        <p className="m-0 px-4 pt-1 pb-1.5 text-[12px] leading-normal font-extrabold uppercase tracking-[.06em] text-text-muted">
                            This week&apos;s activities
                        </p>
                        <ActivityList activities={week.activities} showNext />
                    </>
                ) : null}
                <OptionalPractice week={week} open={optionalOpen} onToggle={onToggleOptional} />
            </div>
        </RoadRow>
    );
}
