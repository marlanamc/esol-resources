"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Check, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { getCourseMapActivityFormat } from "@/components/dashboard/CourseMapActivityFormatChip";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { getWeekLearning } from "@/lib/week-learning";
import { getWeekVerbs, type WeekVerb } from "@/lib/week-verbs";
import type { TimelineItem } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivityType } from "@/lib/course-map";
import {
    formatRoadRowLabels,
    groupRoadWeekSteps,
    type RoadActivity,
    type RoadWeek,
} from "@/lib/course-map-road";

const ROW_BORDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

// ── Cycle banner + unit sign ──────────────────────────────────────────────────

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
    // Done for the week, but the game has levels left: keep the check, invite them back.
    const keepGoing = activity.done ? activity.keepGoing : undefined;

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
                <span className={`block text-[0.9375rem] leading-[1.3] ${activity.done && !keepGoing ? "font-medium text-text-muted" : "font-semibold text-text"}`}>{labels.title}</span>
                {labels.detail ? (
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold" style={{ color: activity.done ? "var(--text-muted)" : tone.chipText }}>
                        {labels.detail}
                    </span>
                ) : null}
                {keepGoing ? (
                    <span className="mt-0.5 block text-[0.8125rem] font-semibold" style={{ color: tone.chipText }}>
                        Done for this week · {keepGoing}
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
            {keepGoing && activity.href ? (
                <span className="shrink-0 rounded-full px-3 py-1.5 text-[0.8125rem] font-bold" style={{ background: tone.chipBg, color: tone.chipText }}>
                    Keep going
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
    verbs = [],
}: {
    weekNumber: number;
    accent: string;
    className?: string;
    /** Shorter tap row for a header that already has its own padding. */
    compact?: boolean;
    /** Verbs of the week, shown with their V1 / V2 / V3 forms. */
    verbs?: WeekVerb[];
}) {
    const learning = getWeekLearning(weekNumber);
    if (!learning && verbs.length === 0) return null;
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
            {learning ? (
            <ul className="m-0 mt-1 list-none space-y-1 p-0">
                {learning.canDo.map((line) => (
                    <li key={line} className="flex gap-2 text-[0.875rem] leading-snug text-text">
                        <Check size={15} strokeWidth={3} aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--success-color)" }} />
                        {line}
                    </li>
                ))}
            </ul>
            ) : null}
            {verbs.length > 0 ? (
                <div className="mt-2.5 rounded-[12px] px-3 py-2" style={{ background: "var(--road-neutral-chip)" }}>
                    <p className="m-0 text-[0.8125rem] font-bold text-text">Verbs of the week: V1 · V2 · V3</p>
                    <ul className="m-0 mt-0.5 list-none p-0">
                        {verbs.map((verb) => (
                            <li key={verb.v1} className="text-[0.8125rem] leading-snug text-text-muted">
                                <span className="font-bold text-text">{verb.v1}</span> · {verb.v2} · {verb.v3}
                                {verb.isReview ? <span className="italic"> (review)</span> : null}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {learning && learning.pages.length > 0 ? (
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

// ── Week tiles ────────────────────────────────────────────────────────────────

const isQuizActivity = (activity: RoadActivity) => activity.activityType === "quiz" || activity.activityType === "assessment";

/** The line under a tile's title: what state it is in, or what kind of activity it is. */
function tileStatus(activity: RoadActivity, title: string, isNext: boolean, locked: boolean, formatLabel: string): string {
    const score = activity.quizScore;
    if (activity.done && score) return `${Math.round((score.correct / score.total) * 100)}%`;
    if (activity.done && activity.keepGoing) return `Keep going · ${activity.keepGoing}`;
    if (activity.done) return "Done";
    if (locked) return "Opens later";
    if (isNext) return "Start here";
    if (isQuizActivity(activity)) return "Required";
    // "Flash Cards" over "Flash cards" says nothing new.
    return formatLabel.toLowerCase() === title.toLowerCase() ? "" : formatLabel;
}

/** One required activity as a square tile: done, next, not open yet, or waiting. */
function WeekTile({ activity, showNext, accent }: { activity: RoadActivity; showNext: boolean; accent: string }) {
    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
    const tone = getLearnerCategoryTone(format.tone);
    const Icon = format.icon;
    const { title } = formatRoadRowLabels(activity, format.label);
    const locked = !activity.done && activity.href == null;
    const isNext = showNext && activity.isNext && !activity.done && !locked;
    const quiz = isQuizActivity(activity);
    const status = tileStatus(activity, title, isNext, locked, format.label);

    const border = isNext
        ? `2px solid ${accent}`
        : quiz && !activity.done && !locked
          ? "2px solid color-mix(in srgb, var(--road-required-bg) 55%, transparent)"
          : activity.done
            ? "1px solid color-mix(in srgb, var(--success-color) 30%, transparent)"
            : "1px solid var(--border-subtle)";
    const background = activity.done ? "var(--road-done-bg)" : locked ? "var(--road-locked-bg)" : "var(--surface-base)";
    const statusColor = activity.done
        ? "var(--road-done-text)"
        : isNext
          ? accent
          : quiz && !locked
            ? "var(--road-required-bg)"
            : "var(--text-muted)";

    const badge = activity.done ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
            <Check size={20} strokeWidth={3} aria-hidden />
        </span>
    ) : locked ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--road-progress-todo)", color: "var(--road-locked-icon)" }}>
            <Lock size={17} aria-hidden />
        </span>
    ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: tone.surface, color: tone.accent }}>
            <Icon size={20} aria-hidden />
        </span>
    );

    const content = (
        <>
            {badge}
            <span className={`line-clamp-3 text-[0.875rem] leading-tight font-bold ${locked ? "text-text-muted" : "text-text"}`}>{title}</span>
            {status ? (
                <span className={`text-[0.75rem] leading-tight ${activity.done || isNext || quiz ? "font-bold" : "font-semibold"}`} style={{ color: statusColor }}>
                    {activity.quizScore && activity.done ? <span className="sr-only">Best score: </span> : null}
                    {status}
                </span>
            ) : null}
        </>
    );
    const className = "flex min-h-[112px] flex-col items-center justify-center gap-1.5 rounded-[18px] px-1.5 py-2.5 text-center";
    const style: CSSProperties = { border, background };
    if (!activity.href) {
        return (
            <div className={className} style={style} aria-disabled="true">
                {content}
            </div>
        );
    }
    return (
        <Link href={activity.href} className={`${className} focus-visible:outline-none focus-visible:ring-2`} style={style}>
            {content}
        </Link>
    );
}

/** Extra games as a plain list under the tiles. */
function ExtrasList({ extras }: { extras: RoadActivity[] }) {
    const done = extras.filter((activity) => activity.done).length;
    return (
        <div className="mt-3">
            <div className="flex items-baseline justify-between gap-2 px-1 pb-1">
                <h4 className="m-0 [font-family:inherit] text-[0.75rem] font-extrabold uppercase tracking-[.08em] text-text-muted">Extra</h4>
                {done > 0 ? <span className="text-[0.75rem] font-bold text-text-muted">{done} of {extras.length} done</span> : null}
            </div>
            <ul className="m-0 list-none p-0">
                {extras.map((activity, index) => {
                    const format = getCourseMapActivityFormat(activity.activityType, activity.vocabUi, activity.title);
                    const tone = getLearnerCategoryTone(format.tone);
                    const Icon = format.icon;
                    const { title } = formatRoadRowLabels(activity, format.label);
                    const className = "flex min-h-[48px] items-center gap-3 px-1 py-1.5 text-left";
                    const content = (
                        <>
                            {activity.done ? (
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                                    <Check size={13} strokeWidth={3} aria-hidden />
                                </span>
                            ) : (
                                <Icon size={19} aria-hidden className="mx-[2.5px] shrink-0" style={{ color: tone.accent }} />
                            )}
                            <span className={`min-w-0 flex-1 text-[0.9375rem] leading-snug font-semibold ${activity.done ? "text-text-muted" : "text-text"}`}>{title}</span>
                            {activity.done ? (
                                <span className="shrink-0 text-[0.8125rem] font-bold" style={{ color: "var(--road-done-text)" }}>
                                    Done
                                </span>
                            ) : (
                                <ChevronRight size={18} aria-hidden className="shrink-0 text-text-muted" />
                            )}
                        </>
                    );
                    return (
                        <li key={activity.id} style={{ borderTop: index > 0 ? ROW_BORDER : undefined }}>
                            {activity.href ? (
                                <Link href={activity.href} className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset`}>
                                    {content}
                                </Link>
                            ) : (
                                <div className={`${className} opacity-70`} aria-disabled="true">
                                    {content}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/** The week's required activities as tiles (words, grammar, practice, quiz), then the optional extras. */
function WeekTiles({ week, accent }: { week: RoadWeek; accent: string }) {
    const steps = groupRoadWeekSteps(week.activities);
    const ordered = [...steps.words, ...steps.grammar, ...steps.practice, ...steps.quiz];
    return (
        <div id={`road-week-${week.weekNumber}-steps`} className="mt-3">
            {ordered.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {ordered.map((activity) => (
                        <WeekTile key={activity.id} activity={activity} showNext accent={accent} />
                    ))}
                </div>
            ) : null}
            {week.extras.length > 0 ? <ExtrasList extras={week.extras} /> : null}
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

export function LockedWeekRow({ week, weekNoun }: { week: RoadWeek; weekNoun: string }) {
    return (
        <div id={`road-week-${week.weekNumber}`} className="mx-4 my-2 flex items-center gap-3 rounded-[18px] px-3.5 py-3 lg:mx-1" style={{ border: "1.5px dashed var(--road-rail-future)", background: "var(--road-locked-bg)" }}>
            <WeekHeading week={week} weekNoun={weekNoun} />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ color: "var(--road-locked-icon)", border: "1.5px dashed var(--road-rail-future)" }}>
                <Lock size={15} aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col justify-center">
                <span className="block text-[0.8125rem] font-bold" style={{ color: "var(--road-future-meta)" }}>
                    {weekLine(week, weekNoun)}
                </span>
                <span className="block text-[1rem] font-bold leading-snug" style={{ color: "var(--road-future-title)" }}>
                    {week.title}
                </span>
                {week.note ? <span className="block text-[0.8438rem] text-text-muted">{week.note}</span> : null}
            </div>
        </div>
    );
}

/** "Verbs: become · lead · go" under a week title (current and past weeks). Review verbs are lighter. */
function WeekVerbsChip({ verbs, accent, className = "mt-1.5" }: { verbs: WeekVerb[]; accent: string; className?: string }) {
    if (verbs.length === 0) return null;
    return (
        <p className={`m-0 ${className} flex flex-wrap items-center gap-1.5 text-[0.8125rem] leading-tight`}>
            <span className="font-bold text-text-muted">Verbs:</span>
            {verbs.map((verb) => (
                <span
                    key={verb.v1}
                    className="min-w-min rounded-full px-2 py-[3px] font-bold"
                    style={{
                        background: `color-mix(in srgb, ${accent} ${verb.isReview ? 7 : 14}%, var(--surface-base))`,
                        color: verb.isReview ? "var(--text-color-muted)" : "var(--text-color)",
                    }}
                >
                    {verb.v1}
                    {verb.isReview ? <span className="sr-only"> (review)</span> : null}
                </span>
            ))}
        </p>
    );
}

export function CurrentWeekCard({
    week,
    weekNoun,
    nextWeekOpen,
}: {
    week: RoadWeek;
    weekNoun: string;
    /** Whether the following week is already open, for the all-done copy. */
    nextWeekOpen: boolean;
}) {
    const tone = getCourseMapUnitTone(week.unitNumber);
    const hasSteps = week.activities.length > 0 || week.extras.length > 0;
    const verbs = getWeekVerbs([...week.activities, ...week.extras].map((activity) => activity.id));
    const tray: CSSProperties = {
        background: `color-mix(in srgb, ${tone.accent} 8%, var(--surface-base))`,
        borderColor: `color-mix(in srgb, ${tone.accent} 34%, transparent)`,
    };
    // The week number stays on the rail. The tray holds the title, progress, and Continue.
    return (
        <div className="my-2">
            <div id={`road-week-${week.weekNumber}`} className="px-4 lg:px-1">
                <WeekHeading week={week} weekNoun={weekNoun} />
                <div className="rounded-[18px] border px-3.5 pt-2.5 pb-3" style={tray}>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.8438rem] font-bold leading-tight whitespace-nowrap text-text-muted">
                            {weekNoun} {week.weekNumber}
                        </span>
                        {week.isCurrent ? (
                        <span
                            className="shrink-0 rounded-full px-2 py-[1.5px] text-[0.6563rem] font-extrabold uppercase tracking-[.06em] whitespace-nowrap"
                            style={{ border: `1.5px solid ${tone.accent}`, color: tone.accent }}
                        >
                            You are here
                        </span>
                        ) : null}
                    </div>
                    <div className="relative mt-1">
                        <p className="m-0 min-w-0 font-display text-[1.5rem] font-bold leading-[1.12] text-text">{week.title}</p>
                    </div>
                    <WeekVerbsChip verbs={verbs} accent={tone.accent} />
                    <WeekLearningDisclosure weekNumber={week.weekNumber} accent={tone.accent} compact className="mt-0.5" verbs={verbs} />
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

                    {week.isDone ? (
                        <p className="mt-2.5 mb-0 rounded-2xl px-4 py-3 text-[0.9375rem] leading-snug font-bold" style={{ background: "var(--road-done-bg)", color: "var(--road-done-text)" }}>
                            You finished this week! You can review anything below
                            {nextWeekOpen ? " or start next week early." : "."}
                        </p>
                    ) : null}
                    {hasSteps ? <WeekTiles week={week} accent={tone.button} /> : null}
                </div>
            </div>
        </div>
    );
}
