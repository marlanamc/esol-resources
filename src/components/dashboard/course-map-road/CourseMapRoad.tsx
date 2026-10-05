"use client";

import { Fragment, type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    COURSE_MAP_OPEN_WEEK_EVENT,
    syncMapUrl,
    type CourseMapOpenWeekDetail,
} from "@/lib/course-map-navigation";
import type { CourseMapRoadModel, RoadUnit, RoadWeek } from "@/lib/course-map-road";
import {
    CompactWeekRow,
    CurrentWeekCard,
    CycleBanner,
    LockedWeekRow,
    RoadRow,
    UnitSign,
} from "./parts";
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

/** Scroll-spy line, below the sticky bar. */
const SPY_OFFSET_PX = 70;

/** How much of the current week's card must be on screen to hide "Back to this week". */
const CURRENT_VISIBLE_PX = 80;

/** Desktop strip pills show their week number while the road is this short. */
const STRIP_NUMBERS_MAX_WEEKS = 24;

function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDesktop(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
}

/** Desktop: breathing room between the strip and the week it lands on. */
const DESKTOP_LAND_GAP_PX = 16;

function isRendered(el: Element | null): el is HTMLElement {
    return el != null && el.getClientRects().length > 0;
}

function addTo(set: Set<number>, value: number): Set<number> {
    if (set.has(value)) return set;
    const next = new Set(set);
    next.add(value);
    return next;
}

function toggleIn(set: Set<number>, value: number): Set<number> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
}

export function CourseMapRoad({ model, initialWeek = null, weekNoun = "Week", showMonths = true }: Props) {
    const { cycles, weeks, currentWeek } = model;
    const weekByNumber = useMemo(() => new Map(weeks.map((week) => [week.weekNumber, week])), [weeks]);
    const unitByNumber = useMemo(
        () => new Map(cycles.flatMap((cycle) => cycle.units).map((unit) => [unit.unitNumber, unit])),
        [cycles]
    );

    const landingWeek = initialWeek != null && weekByNumber.has(initialWeek) ? initialWeek : currentWeek;
    const landing = weekByNumber.get(landingWeek);

    // Past cycles and units start folded, except the one an explicit link lands in.
    const [openCycles, setOpenCycles] = useState<Set<number>>(() => new Set(landing ? [landing.cycle] : []));
    const [openUnits, setOpenUnits] = useState<Set<number>>(() => new Set(landing ? [landing.unitNumber] : []));
    const [openWeeks, setOpenWeeks] = useState<Set<number>>(() =>
        landing && landingWeek !== currentWeek && !landing.isLocked ? new Set([landingWeek]) : new Set()
    );
    const [openOptional, setOpenOptional] = useState<Set<number>>(() => new Set());
    const [viewedWeek, setViewedWeek] = useState(landingWeek);
    const [currentOnScreen, setCurrentOnScreen] = useState(landingWeek === currentWeek);
    const [headerHeight, setHeaderHeight] = useState(0);

    const rootRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const pendingScroll = useRef<{ id: string; behavior: ScrollBehavior } | null>(null);
    const [scrollRequest, setScrollRequest] = useState(0);
    const didLand = useRef(false);

    const isCycleOpen = (cycle: { number: number; isPast: boolean }) => !cycle.isPast || openCycles.has(cycle.number);
    const isUnitOpen = (unit: RoadUnit) => (!unit.isPast && !unit.isLocked) || openUnits.has(unit.unitNumber);

    const stickyOffset = useCallback(() => {
        const header = document.querySelector(".mode-header");
        const headerBottom = isRendered(header) ? header.getBoundingClientRect().height : 0;
        const bar = barRef.current?.getBoundingClientRect().height ?? 0;
        return headerBottom + bar;
    }, []);

    const scrollToId = useCallback(
        (id: string, behavior: ScrollBehavior) => {
            const el = document.getElementById(id);
            if (!isRendered(el)) return;
            const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset() - 4;
            window.scrollTo({ top: Math.max(0, top), behavior });
        },
        [stickyOffset]
    );

    // Land with the week just under the strip; desktop leaves a little room above it.
    const landOn = useCallback(
        (id: string) => {
            if (!isDesktop()) {
                scrollToId(id, "auto");
                return;
            }
            const el = document.getElementById(id);
            if (!isRendered(el)) return;
            const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset() - DESKTOP_LAND_GAP_PX;
            window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
        },
        [scrollToId, stickyOffset]
    );

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

    // Land on "You are here" (or the linked week) without animating.
    useLayoutEffect(() => {
        if (didLand.current || !isRendered(rootRef.current)) return;
        didLand.current = true;
        const unitLocked = landing && unitByNumber.get(landing.unitNumber)?.isLocked;
        const target = unitLocked ? `road-unit-${landing.unitNumber}` : `road-week-${landingWeek}`;
        landOn(target);
        // The router resets scroll after navigation; land again once it has.
        // Not cancelled on cleanup: Strict Mode's re-run returns early above.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => landOn(target));
        });
    }, [landing, landingWeek, landOn, unitByNumber]);

    // Run a jump once the folds it opened have rendered.
    useEffect(() => {
        const request = pendingScroll.current;
        if (!request) return;
        pendingScroll.current = null;
        scrollToId(request.id, request.behavior);
    }, [scrollRequest, scrollToId]);

    const jumpToWeek = useCallback(
        (weekNumber: number) => {
            const week = weekByNumber.get(weekNumber);
            if (!week) return;
            const unit = unitByNumber.get(week.unitNumber);
            setOpenCycles((prev) => addTo(prev, week.cycle));
            if (unit && !unit.isLocked) setOpenUnits((prev) => addTo(prev, unit.unitNumber));
            const id = unit?.isLocked ? `road-unit-${week.unitNumber}` : `road-week-${weekNumber}`;
            pendingScroll.current = { id, behavior: prefersReducedMotion() ? "auto" : "smooth" };
            setScrollRequest((n) => n + 1);
        },
        [unitByNumber, weekByNumber]
    );

    // The desktop sidebar asks for a week through the shared open-week event.
    useEffect(() => {
        const onOpenWeek = (event: Event) => {
            const { week } = (event as CustomEvent<CourseMapOpenWeekDetail>).detail;
            jumpToWeek(week);
        };
        window.addEventListener(COURSE_MAP_OPEN_WEEK_EVENT, onOpenWeek);
        return () => window.removeEventListener(COURSE_MAP_OPEN_WEEK_EVENT, onOpenWeek);
    }, [jumpToWeek]);

    // Scroll-spy: the viewed week is the last spy row whose top has passed the line.
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const root = rootRef.current;
            if (!isRendered(root)) return;
            const line = stickyOffset() + SPY_OFFSET_PX;
            let found = weeks[0]?.weekNumber ?? currentWeek;
            for (const el of root.querySelectorAll<HTMLElement>("[data-road-spy]")) {
                if (el.getBoundingClientRect().top > line) break;
                found = Number(el.dataset.roadSpy);
            }
            setViewedWeek(found);

            // Between the sticky bars and the bottom nav.
            const current = document.getElementById(`road-week-${currentWeek}`);
            if (isRendered(current)) {
                const rect = current.getBoundingClientRect();
                const nav = document.querySelector(".bottom-nav");
                const bottom = isRendered(nav) ? nav.getBoundingClientRect().top : window.innerHeight;
                const visible = Math.min(rect.bottom, bottom) - Math.max(rect.top, stickyOffset());
                setCurrentOnScreen(visible >= CURRENT_VISIBLE_PX);
            } else {
                setCurrentOnScreen(false);
            }
        };
        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(update);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [currentWeek, stickyOffset, weeks]);

    // Keep the URL on the viewed week so returning from an activity lands in place,
    // and keep the strip centered on it.
    useEffect(() => {
        if (!isRendered(rootRef.current)) return;
        syncMapUrl(viewedWeek);
        const strip = stripRef.current;
        const segment = strip?.querySelector<HTMLElement>(`[data-strip-week="${viewedWeek}"]`);
        if (!strip || !segment) return;
        const left = segment.offsetLeft - strip.clientWidth / 2 + segment.offsetWidth / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: didLand.current && !prefersReducedMotion() ? "smooth" : "auto" });
    }, [viewedWeek]);

    const viewed = weekByNumber.get(viewedWeek) ?? weekByNumber.get(currentWeek);
    const viewedTone = getCourseMapUnitTone(viewed?.unitNumber ?? 1);
    const relation = viewedWeek === currentWeek ? "this" : viewedWeek < currentWeek ? "earlier" : "later";
    const nextWeekOpen = weekByNumber.get(currentWeek + 1)?.isLocked === false;
    const stripNumbers = weeks.length <= STRIP_NUMBERS_MAX_WEEKS;

    // Cycles only mean something once there is more than one on the road.
    const showCycles = cycles.length > 1;
    const eyebrow = viewed
        ? [showCycles ? `Cycle ${viewed.cycle}` : null, showMonths && viewed.unitMonth ? viewed.unitMonth : null, `Unit ${viewed.unitNumber}`]
              .filter(Boolean)
              .join(" · ")
        : "";

    const renderWeek = (week: RoadWeek) => {
        if (week.isLocked) return <LockedWeekRow key={week.weekNumber} week={week} weekNoun={weekNoun} />;
        if (week.isCurrent) {
            return (
                <CurrentWeekCard
                    key={week.weekNumber}
                    week={week}
                    weekNoun={weekNoun}
                    nextWeekOpen={nextWeekOpen}
                    optionalOpen={openOptional.has(week.weekNumber)}
                    onToggleOptional={() => setOpenOptional((prev) => toggleIn(prev, week.weekNumber))}
                />
            );
        }
        return (
            <CompactWeekRow
                key={week.weekNumber}
                week={week}
                weekNoun={weekNoun}
                open={openWeeks.has(week.weekNumber)}
                optionalOpen={openOptional.has(week.weekNumber)}
                onToggle={() => setOpenWeeks((prev) => toggleIn(prev, week.weekNumber))}
                onToggleOptional={() => setOpenOptional((prev) => toggleIn(prev, week.weekNumber))}
            />
        );
    };

    return (
        <div ref={rootRef} className={`-mx-4 font-legible md:-mx-6 lg:mx-0 ${styles.road}`}>
            {/* Desktop shows a visible title in the sidebar. */}
            <h1 className="sr-only lg:hidden">Course Map</h1>

            {/* Sticky top bar */}
            <div
                ref={barRef}
                className="sticky z-30 px-4 pt-3 pb-2.5 lg:px-1 lg:pt-1 lg:pb-4"
                style={{
                    top: headerHeight,
                    background: "var(--bg-color)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <div className="flex items-end justify-between gap-3" aria-live="polite">
                    <div className="min-w-0">
                        <p className="m-0 truncate text-[12px] leading-snug font-extrabold uppercase tracking-[.07em]" style={{ color: viewedTone.accent }}>
                            {eyebrow}
                        </p>
                        <p className="m-0 flex items-baseline gap-1.5 leading-tight whitespace-nowrap">
                            <span className="font-display text-[21px] font-bold text-text lg:text-[28px]">
                                {weekNoun} {viewedWeek}
                            </span>
                            {viewed?.dates ? <span className="text-[14px] font-semibold text-text-muted lg:text-[17px]">{viewed.dates}</span> : null}
                        </p>
                    </div>
                    {relation === "this" ? (
                        <span className="shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-extrabold whitespace-nowrap" style={{ background: "var(--success-color)", color: "var(--road-on-success)" }}>
                            This {weekNoun.toLowerCase()}
                        </span>
                    ) : (
                        <span
                            className="shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-extrabold whitespace-nowrap text-text-muted"
                            style={{ background: "var(--surface-base)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}
                        >
                            {relation === "earlier" ? `Earlier ${weekNoun.toLowerCase()}` : "Coming up"}
                        </span>
                    )}
                </div>

                {/* Week strip */}
                <div
                    ref={stripRef}
                    className="relative -mx-4 mt-2.5 flex gap-[7px] overflow-x-auto px-4 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:mt-4 lg:gap-2.5 lg:overflow-visible lg:px-0.5 lg:py-1"
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
                                                        aria-label={`Go to ${weekNoun.toLowerCase()} ${week.weekNumber}`}
                                                        aria-current={week.weekNumber === viewedWeek ? "true" : undefined}
                                                        onClick={() => jumpToWeek(week.weekNumber)}
                                                        className="icon-button flex h-[22px] w-4 items-center justify-center lg:h-8 lg:w-auto lg:min-w-0 lg:flex-1"
                                                    >
                                                        <span
                                                            className="flex h-2.5 w-4 items-center justify-center rounded-[3px] lg:h-full lg:w-full lg:rounded-[7px]"
                                                            style={{
                                                                background: bg,
                                                                color: fg,
                                                                boxShadow:
                                                                    week.weekNumber === viewedWeek
                                                                        ? "0 0 0 1.5px var(--bg-color), 0 0 0 3.5px var(--text)"
                                                                        : undefined,
                                                            }}
                                                        >
                                                            {stripNumbers ? (
                                                                <span aria-hidden className="hidden text-[12px] font-bold lg:inline">
                                                                    {week.weekNumber}
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <span
                                            className="pl-1 text-[10.5px] font-extrabold uppercase tracking-[.06em] whitespace-nowrap lg:pl-1.5 lg:text-[12px] lg:tracking-[.1em]"
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
            </div>

            {/* The road */}
            <div>
                {cycles.map((cycle) => {
                    const cycleOpen = isCycleOpen(cycle);
                    const firstWeek = cycle.units[0]?.weeks[0]?.weekNumber;
                    return (
                        <section key={cycle.number} aria-label={`Cycle ${cycle.number}`}>
                            {showCycles ? (
                                <RoadRow
                                    id={`road-cycle-${cycle.number}`}
                                    spyWeek={cycleOpen ? undefined : firstWeek}
                                    future={firstWeek != null && firstWeek > currentWeek}
                                    fullWidth
                                >
                                    <CycleBanner
                                        cycle={cycle}
                                        open={cycleOpen}
                                        onToggle={cycle.isPast ? () => setOpenCycles((prev) => toggleIn(prev, cycle.number)) : undefined}
                                    />
                                </RoadRow>
                            ) : null}
                            {cycleOpen
                                ? cycle.units.map((unit) => {
                                      const unitOpen = isUnitOpen(unit);
                                      return (
                                          <Fragment key={unit.unitNumber}>
                                              <RoadRow
                                                  id={`road-unit-${unit.unitNumber}`}
                                                  spyWeek={unitOpen ? undefined : unit.weeks[0].weekNumber}
                                                  future={unit.isFuture}
                                                  fullWidth
                                              >
                                                  <UnitSign
                                                      unit={unit}
                                                      open={unitOpen}
                                                      showMonth={showMonths}
                                                      onToggle={unit.isPast ? () => setOpenUnits((prev) => toggleIn(prev, unit.unitNumber)) : undefined}
                                                  />
                                              </RoadRow>
                                              {unitOpen ? unit.weeks.map(renderWeek) : null}
                                          </Fragment>
                                      );
                                  })
                                : null}
                        </section>
                    );
                })}
            </div>

            {/* Back to this week */}
            {relation !== "this" && !currentOnScreen ? (
                <button
                    type="button"
                    onClick={() => jumpToWeek(currentWeek)}
                    className="fixed left-1/2 flex min-h-[50px] -translate-x-1/2 items-center gap-2 rounded-full px-5 text-[15.5px] font-bold whitespace-nowrap"
                    style={{
                        bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 16px)",
                        zIndex: "var(--z-fixed)",
                        background: "var(--road-ink)",
                        color: "var(--road-ink-text)",
                        boxShadow: "0 10px 24px rgba(0,0,0,.28)",
                    }}
                >
                    {relation === "earlier" ? <ArrowDown size={18} aria-hidden /> : <ArrowUp size={18} aria-hidden />}
                    Back to this {weekNoun.toLowerCase()}
                </button>
            ) : null}
        </div>
    );
}
