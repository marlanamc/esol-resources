"use client";

import { Fragment, type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, List, Lock } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    COURSE_MAP_OPEN_WEEK_EVENT,
    syncMapUrl,
    type CourseMapOpenWeekDetail,
} from "@/lib/course-map-navigation";
import type { CourseMapRoadModel, RoadCycle, RoadWeek } from "@/lib/course-map-road";
import { CurrentWeekCard, LockedWeekRow } from "./parts";
import styles from "./road.module.css";

interface Props {
    model: CourseMapRoadModel;
    /** An explicit ?week= link; lands there instead of the current week. */
    initialWeek?: number | null;
    /** "Week" for classroom learners, "Level" for independent ones. */
    weekNoun?: string;
    /** Show month names (classroom calendar). */
    showMonths?: boolean;
}

/** Desktop strip pills show their week number while the road is this short. */
const STRIP_NUMBERS_MAX_WEEKS = 24;

/** Remembers whether the learner left the week strip open. */
const STRIP_OPEN_KEY = "course-map-strip-open";

function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The course map, one week at a time: the sticky header names the week, an
 * optional strip of every week picks another, and the page below shows only
 * the selected week.
 */
export function CourseMapRoad({ model, initialWeek = null, weekNoun = "Week", showMonths = true }: Props) {
    const { cycles, weeks, currentWeek } = model;
    const weekByNumber = useMemo(() => new Map(weeks.map((week) => [week.weekNumber, week])), [weeks]);

    const landingWeek = initialWeek != null && weekByNumber.has(initialWeek) ? initialWeek : currentWeek;
    const [selectedWeek, setSelectedWeek] = useState(landingWeek);
    const [stripOpen, setStripOpen] = useState(false);
    const [showList, setShowList] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const stripRef = useRef<HTMLDivElement>(null);
    const didSelect = useRef(false);

    // The sticky bar sits under the app header, whose height varies with safe areas.
    useLayoutEffect(() => {
        const header = document.querySelector(".mode-header");
        if (!header) return;
        const update = () => setHeaderHeight(header.getBoundingClientRect().height);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    // Restore the strip's open/closed choice after hydration.
    useEffect(() => {
        try {
            if (window.localStorage.getItem(STRIP_OPEN_KEY) === "1") setStripOpen(true);
        } catch {
            // Storage blocked: the strip starts closed.
        }
    }, []);

    const toggleStrip = useCallback(() => {
        setStripOpen((open) => {
            const next = !open;
            try {
                window.localStorage.setItem(STRIP_OPEN_KEY, next ? "1" : "0");
            } catch {
                // Storage blocked: the choice lasts for this visit only.
            }
            return next;
        });
    }, []);

    const selectWeek = useCallback(
        (weekNumber: number) => {
            if (!weekByNumber.has(weekNumber)) return;
            didSelect.current = true;
            setShowList(false);
            setSelectedWeek(weekNumber);
        },
        [weekByNumber]
    );

    // The desktop sidebar asks for a week through the shared open-week event.
    useEffect(() => {
        const onOpenWeek = (event: Event) => {
            const { week } = (event as CustomEvent<CourseMapOpenWeekDetail>).detail;
            selectWeek(week);
        };
        window.addEventListener(COURSE_MAP_OPEN_WEEK_EVENT, onOpenWeek);
        return () => window.removeEventListener(COURSE_MAP_OPEN_WEEK_EVENT, onOpenWeek);
    }, [selectWeek]);

    // Keep the URL on the selected week so returning from an activity lands there.
    // After a pick, start the new week at the top and move focus to its heading.
    useEffect(() => {
        syncMapUrl(selectedWeek);
        if (!didSelect.current) return;
        window.scrollTo({ top: 0, behavior: "auto" });
        document.getElementById(`road-week-${selectedWeek}-heading`)?.focus({ preventScroll: true });
    }, [selectedWeek]);

    // Keep the strip centered on the selected week whenever it is showing.
    useEffect(() => {
        if (!stripOpen) return;
        const strip = stripRef.current;
        const segment = strip?.querySelector<HTMLElement>(`[data-strip-week="${selectedWeek}"]`);
        if (!strip || !segment) return;
        const left = segment.offsetLeft - strip.clientWidth / 2 + segment.offsetWidth / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, [selectedWeek, stripOpen]);

    const selected = weekByNumber.get(selectedWeek) ?? weekByNumber.get(currentWeek);
    const selectedTone = getCourseMapUnitTone(selected?.unitNumber ?? 1);
    const relation = selectedWeek === currentWeek ? "this" : selectedWeek < currentWeek ? "earlier" : "later";
    const stripNumbers = weeks.length <= STRIP_NUMBERS_MAX_WEEKS;
    const selectedIndex = weeks.findIndex((week) => week.weekNumber === selectedWeek);
    const prevWeek = selectedIndex > 0 ? weeks[selectedIndex - 1] : null;
    const nextWeek = selectedIndex >= 0 && selectedIndex < weeks.length - 1 ? weeks[selectedIndex + 1] : null;

    // Cycles only mean something once there is more than one on the road.
    const showCycles = cycles.length > 1;
    const eyebrow = selected
        ? [showCycles ? `Cycle ${selected.cycle}` : null, showMonths && selected.unitMonth ? selected.unitMonth : null, `Unit ${selected.unitNumber}`]
              .filter(Boolean)
              .join(" · ")
        : "";

    const renderWeek = (week: RoadWeek) => {
        if (week.isLocked) return <LockedWeekRow week={week} weekNoun={weekNoun} />;
        return (
            <CurrentWeekCard
                week={week}
                weekNoun={weekNoun}
                nextWeekOpen={weekByNumber.get(week.weekNumber + 1)?.isLocked === false}
            />
        );
    };

    const pillBase = "shrink-0 rounded-full px-2.5 py-[5px] text-[0.75rem] font-extrabold whitespace-nowrap";

    return (
        <div
            className={`-mx-4 font-legible md:-mx-6 lg:mx-0 ${styles.road}`}
            style={{ "--road-scroll-top": `calc(${headerHeight}px + 5.5rem)` } as CSSProperties}
        >
            {/* Desktop shows a visible title in the sidebar. */}
            <h1 className="sr-only lg:hidden">Course Map</h1>

            {/* Sticky top bar */}
            <div
                className="sticky z-30 px-4 pt-2 pb-2 lg:px-1 lg:pt-1 lg:pb-3"
                style={{
                    top: headerHeight,
                    background: "var(--bg-color)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <div className="flex items-center justify-between gap-3" aria-live="polite">
                    <div className="min-w-0">
                        <p className="m-0 truncate text-[0.75rem] leading-snug font-extrabold uppercase tracking-[.07em]" style={{ color: selectedTone.accent }}>
                            {eyebrow}
                        </p>
                        {/* The week name doubles as the strip toggle. */}
                        <button
                            type="button"
                            onClick={toggleStrip}
                            aria-expanded={stripOpen}
                            aria-controls="course-map-week-strip"
                            aria-label={`${weekNoun} ${selectedWeek}${selected?.dates ? `, ${selected.dates}` : ""}. ${stripOpen ? "Hide" : "Show"} all ${weekNoun.toLowerCase()}s`}
                            className="-ml-1 flex min-h-[40px] items-baseline gap-1.5 rounded-lg px-1 leading-tight whitespace-nowrap"
                        >
                            <span className="font-display text-[1.3125rem] font-bold text-text lg:text-[1.75rem]">
                                {weekNoun} {selectedWeek}
                            </span>
                            {selected?.dates ? <span className="text-[0.875rem] font-semibold text-text-muted lg:text-[1.0625rem]">{selected.dates}</span> : null}
                            <ChevronDown
                                size={18}
                                aria-hidden
                                className="shrink-0 self-center text-text-muted transition-transform motion-reduce:transition-none"
                                style={{ transform: stripOpen ? "rotate(180deg)" : undefined }}
                            />
                        </button>
                    </div>
                    {relation === "this" ? (
                        <span className={pillBase} style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                            This {weekNoun.toLowerCase()}
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => selectWeek(currentWeek)}
                            className={`${pillBase} flex min-h-[36px] items-center gap-1`}
                            style={{ background: "var(--road-ink)", color: "var(--road-ink-text)" }}
                        >
                            {relation === "earlier" ? <ChevronRight size={14} aria-hidden /> : <ChevronLeft size={14} aria-hidden />}
                            Back to this {weekNoun.toLowerCase()}
                        </button>
                    )}
                </div>

                {/* Week strip, folded away until asked for */}
                {stripOpen ? (
                <div
                    id="course-map-week-strip"
                    ref={stripRef}
                    className="relative -mx-4 mt-1.5 flex gap-[7px] overflow-x-auto px-4 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:mt-2 lg:gap-2.5 lg:overflow-visible lg:px-0.5 lg:py-1"
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
                                        className="flex shrink-0 flex-col gap-[3px] lg:min-w-0 lg:shrink lg:[flex-basis:0] lg:[flex-grow:var(--strip-weeks)] lg:gap-1.5"
                                        style={{ "--strip-weeks": unit.weeks.length } as CSSProperties}
                                    >
                                        <div className="flex gap-[3px] lg:gap-1">
                                            {unit.weeks.map((week) => {
                                                const bg = week.isCurrent
                                                    ? tone.button
                                                    : week.isDone
                                                      ? "var(--success-color)"
                                                      : week.isFuture || week.isLocked
                                                        ? "var(--road-segment-future)"
                                                        : "var(--road-rail)";
                                                const fg = week.isCurrent
                                                    ? "var(--road-on-tone)"
                                                    : week.isDone
                                                      ? "var(--road-on-success)"
                                                      : "var(--road-future-meta)";
                                                return (
                                                    <button
                                                        key={week.weekNumber}
                                                        type="button"
                                                        data-strip-week={week.weekNumber}
                                                        aria-label={`Go to ${weekNoun.toLowerCase()} ${week.weekNumber}: ${week.title}`}
                                                        aria-current={week.weekNumber === selectedWeek ? "true" : undefined}
                                                        onClick={() => selectWeek(week.weekNumber)}
                                                        className="icon-button flex h-[22px] w-4 items-center justify-center lg:h-8 lg:w-auto lg:min-w-0 lg:flex-1"
                                                    >
                                                        <span
                                                            className="flex h-2.5 w-4 items-center justify-center rounded-[3px] lg:h-full lg:w-full lg:rounded-[7px]"
                                                            style={{
                                                                background: bg,
                                                                color: fg,
                                                                boxShadow:
                                                                    week.weekNumber === selectedWeek
                                                                        ? "0 0 0 1.5px var(--bg-color), 0 0 0 3.5px var(--text)"
                                                                        : undefined,
                                                            }}
                                                        >
                                                            {stripNumbers ? (
                                                                <span aria-hidden className="hidden text-[0.75rem] font-bold lg:inline">
                                                                    {week.weekNumber}
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <span
                                            className="pl-1 text-[0.6563rem] font-extrabold uppercase tracking-[.06em] whitespace-nowrap lg:pl-1.5 lg:text-[0.75rem] lg:tracking-[.1em]"
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
                ) : null}
                {stripOpen && !showList ? (
                    <button
                        type="button"
                        onClick={() => {
                            setShowList(true);
                            window.scrollTo({ top: 0, behavior: "auto" });
                        }}
                        className="mt-1 flex min-h-[40px] items-center gap-1.5 text-[0.875rem] font-bold"
                        style={{ color: selectedTone.accent }}
                    >
                        <List size={16} aria-hidden />
                        See all {weekNoun.toLowerCase()}s as a list
                    </button>
                ) : null}
            </div>

            {showList ? (
                <AllWeeksList
                    cycles={cycles}
                    weekNoun={weekNoun}
                    showMonths={showMonths}
                    showCycles={showCycles}
                    selectedWeek={selectedWeek}
                    onSelect={selectWeek}
                    onClose={() => setShowList(false)}
                />
            ) : (
            <>
            {/* The selected week only */}
            <section key={selectedWeek} aria-label={`${weekNoun} ${selectedWeek}`} className="pt-2">
                {selected ? renderWeek(selected) : null}
            </section>

            {/* Previous / next week */}
            <nav aria-label={`Other ${weekNoun.toLowerCase()}s`} className="grid grid-cols-2 gap-2.5 px-4 pt-4 pb-6 lg:px-1">
                {prevWeek ? (
                    <WeekStepButton week={prevWeek} weekNoun={weekNoun} direction="prev" onSelect={selectWeek} />
                ) : (
                    <span />
                )}
                {nextWeek ? <WeekStepButton week={nextWeek} weekNoun={weekNoun} direction="next" onSelect={selectWeek} /> : null}
            </nav>
            </>
            )}
        </div>
    );
}

function WeekStepButton({
    week,
    weekNoun,
    direction,
    onSelect,
}: {
    week: RoadWeek;
    weekNoun: string;
    direction: "prev" | "next";
    onSelect: (weekNumber: number) => void;
}) {
    const isNext = direction === "next";
    const tone = getCourseMapUnitTone(week.unitNumber);
    const status = week.isDone ? "All done ✓" : week.isLocked ? (week.note ?? "Coming up") : week.title;
    return (
        <button
            type="button"
            onClick={() => onSelect(week.weekNumber)}
            className={`flex min-h-[64px] flex-col justify-center gap-0.5 rounded-2xl px-3.5 py-2 ${isNext ? "text-right" : "text-left"}`}
            style={{
                background: tone.surface,
                border: `1px solid color-mix(in srgb, ${tone.accent} 35%, transparent)`,
            }}
        >
            <span
                className={`flex items-center gap-0.5 text-[0.8125rem] font-extrabold ${isNext ? "justify-end" : ""}`}
                style={{ color: tone.accent }}
            >
                {isNext ? null : <ChevronLeft size={15} aria-hidden />}
                {weekNoun} {week.weekNumber}
                {isNext ? <ChevronRight size={15} aria-hidden /> : null}
            </span>
            <span className="line-clamp-2 text-[0.875rem] leading-tight font-bold text-text">{status}</span>
        </button>
    );
}

/** Every week by title, grouped by unit; tapping one opens that week. */
function AllWeeksList({
    cycles,
    weekNoun,
    showMonths,
    showCycles,
    selectedWeek,
    onSelect,
    onClose,
}: {
    cycles: RoadCycle[];
    weekNoun: string;
    showMonths: boolean;
    showCycles: boolean;
    selectedWeek: number;
    onSelect: (weekNumber: number) => void;
    onClose: () => void;
}) {
    const noun = weekNoun.toLowerCase();
    return (
        <section aria-labelledby="all-weeks-heading" className="flex flex-col gap-4 px-4 pt-4 pb-8 lg:px-1">
            <div className="flex items-center justify-between gap-3">
                <h2 id="all-weeks-heading" className="m-0 font-display text-[1.25rem] font-bold text-text">
                    All {noun}s
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex min-h-[40px] items-center gap-1 rounded-full px-3 text-[0.875rem] font-bold text-text"
                    style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}
                >
                    <ChevronLeft size={16} aria-hidden />
                    Back to {weekNoun} {selectedWeek}
                </button>
            </div>
            {cycles.map((cycle) => (
                <Fragment key={cycle.number}>
                    {showCycles ? (
                        <p className="m-0 text-[0.75rem] font-extrabold uppercase tracking-[.08em] text-text-muted">
                            Cycle {cycle.number}
                            {cycle.range ? ` · ${cycle.range}` : ""}
                        </p>
                    ) : null}
                    {cycle.units.map((unit) => {
                        const tone = getCourseMapUnitTone(unit.unitNumber);
                        const heading = showMonths && unit.month ? `${unit.month} · ${unit.title}` : `Unit ${unit.unitNumber} · ${unit.title}`;
                        return (
                            <div
                                key={unit.unitNumber}
                                className="overflow-hidden rounded-2xl"
                                style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}
                            >
                                <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ background: tone.surface }}>
                                    <span aria-hidden className="h-5 w-1.5 shrink-0 rounded" style={{ background: tone.accent }} />
                                    <h3 className="m-0 min-w-0 flex-1 text-[0.9375rem] leading-snug font-extrabold" style={{ color: tone.accent }}>
                                        {heading}
                                    </h3>
                                    <span className="shrink-0 text-[0.8125rem] font-bold text-text-muted">
                                        {unit.doneWeeks}/{unit.weeks.length} done
                                    </span>
                                </div>
                                <ul className="m-0 list-none p-0">
                                    {unit.weeks.map((week) => {
                                        const status = week.isDone
                                            ? "All done"
                                            : week.isLocked
                                              ? (week.note ?? "Coming up")
                                              : week.isCurrent
                                                ? `This ${noun} · ${week.done} of ${week.total} done`
                                                : `${week.done} of ${week.total} done`;
                                        return (
                                            <li key={week.weekNumber} style={{ borderTop: "1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent)" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelect(week.weekNumber)}
                                                    aria-current={week.isCurrent ? "step" : undefined}
                                                    className="flex min-h-[56px] w-full items-center gap-3 px-3.5 py-2 text-left"
                                                    style={week.isCurrent ? { background: tone.surface, boxShadow: `inset 4px 0 0 ${tone.accent}` } : undefined}
                                                >
                                                    <WeekBadge week={week} accent={tone.accent} />
                                                    <span className="min-w-0 flex-1">
                                                        <span
                                                            className="block text-[0.9375rem] leading-snug font-bold"
                                                            style={{ color: week.isLocked ? "var(--road-future-title)" : "var(--text-color)" }}
                                                        >
                                                            {week.title}
                                                        </span>
                                                        <span
                                                            className="block text-[0.8125rem] font-semibold"
                                                            style={{ color: week.isDone ? "var(--success-color)" : "var(--text-color-muted)" }}
                                                        >
                                                            {weekNoun} {week.weekNumber} · {status}
                                                        </span>
                                                    </span>
                                                    <ChevronRight size={16} aria-hidden className="shrink-0 text-text-muted" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </Fragment>
            ))}
        </section>
    );
}

function WeekBadge({ week, accent }: { week: RoadWeek; accent: string }) {
    const base = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-extrabold";
    if (week.isDone) {
        return (
            <span aria-hidden className={base} style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                <Check size={16} strokeWidth={3} />
            </span>
        );
    }
    if (week.isLocked) {
        return (
            <span aria-hidden className={base} style={{ background: "var(--road-locked-bg)", color: "var(--road-locked-icon)" }}>
                <Lock size={14} />
            </span>
        );
    }
    if (week.isCurrent) {
        return (
            <span aria-hidden className={base} style={{ background: accent, color: "var(--road-on-tone)" }}>
                {week.weekNumber}
            </span>
        );
    }
    return (
        <span aria-hidden className={base} style={{ border: `2px solid ${accent}`, color: accent }}>
            {week.weekNumber}
        </span>
    );
}
