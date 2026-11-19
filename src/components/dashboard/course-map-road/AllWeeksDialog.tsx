"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronDown, Lock, X } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import type { CourseMapRoadModel, RoadUnit, RoadWeek } from "@/lib/course-map-road";

/** A week before the class week that still has open work in it. */
export function isWeekBehind(week: RoadWeek): boolean {
    return !week.isCurrent && !week.isFuture && !week.isLocked && week.total > 0 && !week.isDone;
}

function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Every week at once: the month strip on top for a quick jump, then each unit
 * with its weeks and progress. Finished units start folded.
 */
export function AllWeeksDialog({
    open,
    onClose,
    model,
    selectedWeek,
    onSelect,
    weekNoun,
    showMonths,
}: {
    open: boolean;
    onClose: () => void;
    model: CourseMapRoadModel;
    selectedWeek: number;
    onSelect: (weekNumber: number) => void;
    weekNoun: string;
    showMonths: boolean;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const { cycles, weeks, currentWeek } = model;
    const showCycles = cycles.length > 1;
    const anyBehind = weeks.some(isWeekBehind);
    const noun = weekNoun.toLowerCase();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    // Center the strip on the selected week each time the list opens.
    useEffect(() => {
        if (!open) return;
        const strip = stripRef.current;
        const segment = strip?.querySelector<HTMLElement>(`[data-strip-week="${selectedWeek}"]`);
        if (!strip || !segment) return;
        const left = segment.offsetLeft - strip.clientWidth / 2 + segment.offsetWidth / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, [open, selectedWeek]);

    const pick = (weekNumber: number) => {
        onSelect(weekNumber);
        onClose();
    };

    // The unit after the class week stays open so learners can see what is coming.
    const units = cycles.flatMap((cycle) => cycle.units);
    const currentUnitIndex = units.findIndex((unit) => unit.weeks.some((week) => week.weekNumber === currentWeek));
    const startsOpen = (unit: RoadUnit, index: number) =>
        unit.weeks.some((week) => week.weekNumber === selectedWeek || isWeekBehind(week)) ||
        index === currentUnitIndex ||
        index === currentUnitIndex + 1;

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(event) => {
                // A click on the backdrop (the dialog box itself, outside the panel) closes it.
                if (event.target === event.currentTarget) onClose();
            }}
            aria-labelledby="all-weeks-title"
            className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-text backdrop:bg-black/40 lg:m-auto lg:h-auto lg:max-h-[85dvh] lg:max-w-2xl lg:rounded-3xl"
        >
            <div className="flex h-full flex-col bg-bg lg:max-h-[85dvh] lg:rounded-3xl">
                <div className="flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <h2 id="all-weeks-title" className="m-0 flex-1 font-display text-[1.375rem] font-bold">
                        All {noun}s
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-11 w-11 items-center justify-center rounded-full"
                        style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-base)" }}
                    >
                        <X size={18} aria-hidden />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                    {/* Month strip: one block per week */}
                    <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <div
                            ref={stripRef}
                            className="relative -mx-4 flex gap-[7px] overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:gap-2.5 lg:overflow-visible lg:px-0.5"
                        >
                            {cycles.map((cycle, cycleIndex) => (
                                <Fragment key={cycle.number}>
                                    {cycleIndex > 0 ? (
                                        <span aria-hidden className="mx-[3px] mt-1 mb-0.5 w-[2px] shrink-0 rounded-[1px]" style={{ background: "var(--road-rail)" }} />
                                    ) : null}
                                    {cycle.units.map((unit) => {
                                        const tone = getCourseMapUnitTone(unit.unitNumber);
                                        return (
                                            <div
                                                key={unit.unitNumber}
                                                className="flex shrink-0 flex-col gap-1.5 lg:min-w-0 lg:shrink lg:[flex-basis:0] lg:[flex-grow:var(--strip-weeks)]"
                                                style={{ "--strip-weeks": unit.weeks.length } as CSSProperties}
                                            >
                                                <div className="flex gap-[3px] lg:gap-1">
                                                    {unit.weeks.map((week) => {
                                                        const behind = isWeekBehind(week);
                                                        const bg = week.isCurrent
                                                            ? tone.button
                                                            : week.isDone
                                                              ? "var(--success-color)"
                                                              : behind
                                                                ? "var(--road-behind)"
                                                                : week.isFuture || week.isLocked
                                                                  ? "var(--road-segment-future)"
                                                                  : "var(--road-rail)";
                                                        return (
                                                            <button
                                                                key={week.weekNumber}
                                                                type="button"
                                                                data-strip-week={week.weekNumber}
                                                                aria-label={`Go to ${noun} ${week.weekNumber}: ${week.title}${behind ? `, ${week.total - week.done} left` : ""}`}
                                                                aria-current={week.weekNumber === selectedWeek ? "true" : undefined}
                                                                onClick={() => pick(week.weekNumber)}
                                                                className="icon-button flex h-[30px] w-[22px] items-center justify-center lg:h-8 lg:w-auto lg:min-w-0 lg:flex-1"
                                                            >
                                                                <span
                                                                    className="block h-[18px] w-[22px] rounded-[5px] lg:h-full lg:w-full lg:rounded-[7px]"
                                                                    style={{
                                                                        background: bg,
                                                                        boxShadow:
                                                                            week.weekNumber === selectedWeek
                                                                                ? "0 0 0 1.5px var(--bg-color), 0 0 0 3.5px var(--text)"
                                                                                : undefined,
                                                                    }}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <span
                                                    className="pl-1 text-[0.6875rem] font-extrabold uppercase tracking-[.06em] whitespace-nowrap lg:pl-1.5 lg:text-[0.75rem] lg:tracking-[.1em]"
                                                    style={{ color: tone.accent, borderLeft: `2px solid ${tone.accent}` }}
                                                >
                                                    {showMonths && unit.month ? unit.month.slice(0, 3) : `Unit ${unit.unitNumber}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </Fragment>
                            ))}
                        </div>
                        <p className="m-0 mt-2 flex items-center gap-1.5 text-[0.8125rem] text-text-muted">
                            {anyBehind ? (
                                <>
                                    <span aria-hidden className="inline-block h-3 w-3 rounded-[3px]" style={{ background: "var(--road-behind)" }} />
                                    Not finished ·{" "}
                                </>
                            ) : null}
                            Tap a {noun} to go to it
                        </p>
                    </div>

                    {/* Units and their weeks */}
                    <div className="flex flex-col gap-2.5 px-4 pt-3">
                        {cycles.map((cycle) => (
                            <Fragment key={cycle.number}>
                                {showCycles ? (
                                    <p className="m-0 mt-1 text-[0.75rem] font-extrabold uppercase tracking-[.1em] text-text-muted">
                                        Cycle {cycle.number}
                                        {cycle.range ? ` · ${cycle.range}` : ""}
                                    </p>
                                ) : null}
                                {cycle.units.map((unit) => {
                                    return (
                                        <UnitGroup
                                            key={unit.unitNumber}
                                            unit={unit}
                                            defaultOpen={startsOpen(unit, units.indexOf(unit))}
                                            selectedWeek={selectedWeek}
                                            weekNoun={weekNoun}
                                            showMonths={showMonths}
                                            onPick={pick}
                                        />
                                    );
                                })}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </dialog>
    );
}

function UnitGroup({
    unit,
    defaultOpen,
    selectedWeek,
    weekNoun,
    showMonths,
    onPick,
}: {
    unit: RoadUnit;
    defaultOpen: boolean;
    selectedWeek: number;
    weekNoun: string;
    showMonths: boolean;
    onPick: (weekNumber: number) => void;
}) {
    const tone = getCourseMapUnitTone(unit.unitNumber);
    const allDone = unit.weeks.length > 0 && unit.doneWeeks === unit.weeks.length;
    const eyebrow = showMonths && unit.month ? `Unit ${unit.unitNumber} · ${unit.month}` : `Unit ${unit.unitNumber}`;
    return (
        <details
            open={defaultOpen}
            className="group rounded-[18px]"
            style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-base)" }}
        >
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center gap-3 px-3.5 py-2 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                    <span className="block text-[0.6875rem] font-extrabold uppercase tracking-[.08em]" style={{ color: tone.accent }}>
                        {eyebrow}
                    </span>
                    <span className={`block text-[1rem] leading-tight font-bold ${unit.isLocked ? "text-text-muted" : "text-text"}`}>{unit.title}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-bold whitespace-nowrap text-text-muted">
                    {unit.doneWeeks} of {unit.weeks.length}
                    {allDone ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                            <Check size={12} strokeWidth={3} aria-label="Done" />
                        </span>
                    ) : null}
                </span>
                <ChevronDown size={18} aria-hidden className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <ul className="m-0 list-none px-1.5 pb-1.5">
                {unit.weeks.map((week) => (
                    <li key={week.weekNumber}>
                        <WeekLine week={week} accent={tone.button} selected={week.weekNumber === selectedWeek} weekNoun={weekNoun} onPick={onPick} />
                    </li>
                ))}
            </ul>
        </details>
    );
}

function WeekLine({
    week,
    accent,
    selected,
    weekNoun,
    onPick,
}: {
    week: RoadWeek;
    accent: string;
    selected: boolean;
    weekNoun: string;
    onPick: (weekNumber: number) => void;
}) {
    const behind = isWeekBehind(week);
    const left = week.total - week.done;

    let marker: ReactNode;
    if (week.isDone) {
        marker = (
            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                <Check size={16} strokeWidth={3} aria-hidden />
            </span>
        );
    } else if (week.isCurrent) {
        marker = (
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[0.8125rem] font-extrabold" style={{ background: accent, color: "var(--road-on-accent)" }}>
                {week.weekNumber}
            </span>
        );
    } else if (behind) {
        const deg = Math.round((360 * week.done) / week.total);
        marker = (
            <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: `conic-gradient(var(--road-behind) 0deg ${deg}deg, var(--road-progress-todo) ${deg}deg 360deg)` }}
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[0.6875rem] font-extrabold" style={{ background: "var(--surface-base)" }}>
                    {week.weekNumber}
                </span>
            </span>
        );
    } else if (week.isLocked) {
        marker = (
            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--road-locked-bg)", color: "var(--road-locked-icon)" }}>
                <Lock size={14} aria-hidden />
            </span>
        );
    } else {
        marker = (
            <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[0.8125rem] font-extrabold"
                style={{ border: `2px ${week.isFuture ? "dashed" : "solid"} var(--road-rail-future)`, color: "var(--road-future-meta)" }}
            >
                {week.weekNumber}
            </span>
        );
    }

    const chip = (text: string, style: CSSProperties) => (
        <span className="shrink-0 rounded-full px-2.5 py-[3px] text-[0.75rem] font-bold whitespace-nowrap" style={style}>
            {text}
        </span>
    );
    let right: ReactNode = null;
    if (week.isCurrent) right = chip(`This ${weekNoun.toLowerCase()}`, { background: accent, color: "var(--road-on-accent)" });
    else if (behind) right = chip(`${left} left`, { background: "var(--road-behind-bg)", color: "var(--road-behind-text)" });
    else if (week.isDone) right = <span className="shrink-0 text-[0.8125rem] font-bold" style={{ color: "var(--road-done-text)" }}>Done</span>;
    else if (week.isLocked) right = <span className="shrink-0 text-right text-[0.8125rem] text-text-muted">{week.note ?? "Not open yet"}</span>;
    else if (week.state === "upcoming") right = <span className="shrink-0 text-[0.8125rem] text-text-muted">Open early</span>;

    return (
        <button
            type="button"
            onClick={() => onPick(week.weekNumber)}
            aria-current={selected ? "true" : undefined}
            className="flex min-h-[56px] w-full items-center gap-3 rounded-[14px] px-2 py-1.5 text-left"
            style={selected ? { background: `color-mix(in srgb, ${accent} 10%, transparent)` } : undefined}
        >
            {marker}
            <span className="min-w-0 flex-1">
                <span className="block text-[0.75rem] font-semibold text-text-muted">
                    {weekNoun} {week.weekNumber}
                    {week.dates ? ` · ${week.dates}` : ""}
                </span>
                <span className={`block truncate text-[0.9375rem] leading-snug ${week.isCurrent || behind ? "font-bold" : "font-semibold"} ${week.isLocked ? "text-text-muted" : "text-text"}`}>
                    {week.title}
                </span>
            </span>
            {right}
        </button>
    );
}
