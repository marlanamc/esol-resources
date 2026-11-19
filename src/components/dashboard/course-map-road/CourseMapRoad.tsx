"use client";

import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    COURSE_MAP_OPEN_WEEK_EVENT,
    syncMapUrl,
    type CourseMapOpenWeekDetail,
} from "@/lib/course-map-navigation";
import type { CourseMapRoadModel, RoadWeek } from "@/lib/course-map-road";
import { AllWeeksDialog } from "./AllWeeksDialog";
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

/**
 * The course map, one week at a time: the sticky header names the week, the
 * All weeks list (opened from the week name or its button) picks another, and
 * the page below shows only the selected week.
 */
export function CourseMapRoad({ model, initialWeek = null, weekNoun = "Week", showMonths = true }: Props) {
    const { cycles, weeks, currentWeek } = model;
    const weekByNumber = useMemo(() => new Map(weeks.map((week) => [week.weekNumber, week])), [weeks]);

    const landingWeek = initialWeek != null && weekByNumber.has(initialWeek) ? initialWeek : currentWeek;
    const [selectedWeek, setSelectedWeek] = useState(landingWeek);
    const [allWeeksOpen, setAllWeeksOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

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

    const selectWeek = useCallback(
        (weekNumber: number) => {
            if (!weekByNumber.has(weekNumber)) return;
            didSelect.current = true;
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

    const selected = weekByNumber.get(selectedWeek) ?? weekByNumber.get(currentWeek);
    const selectedTone = getCourseMapUnitTone(selected?.unitNumber ?? 1);
    const relation = selectedWeek === currentWeek ? "this" : selectedWeek < currentWeek ? "earlier" : "later";
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
                        {/* The week name also opens the list of all weeks. */}
                        <button
                            type="button"
                            onClick={() => setAllWeeksOpen(true)}
                            aria-haspopup="dialog"
                            aria-label={`${weekNoun} ${selectedWeek}${selected?.dates ? `, ${selected.dates}` : ""}. Show all ${weekNoun.toLowerCase()}s`}
                            className="-ml-1 flex min-h-[40px] items-baseline gap-1.5 rounded-lg px-1 leading-tight whitespace-nowrap"
                        >
                            <span className="font-display text-[1.3125rem] font-bold text-text lg:text-[1.75rem]">
                                {weekNoun} {selectedWeek}
                            </span>
                            {selected?.dates ? <span className="text-[0.875rem] font-semibold text-text-muted lg:text-[1.0625rem]">{selected.dates}</span> : null}
                            <ChevronDown size={18} aria-hidden className="shrink-0 self-center text-text-muted" />
                        </button>
                    </div>
                    {/* On another week this becomes the way back; otherwise it opens the list. */}
                    {relation === "this" ? (
                        <button
                            type="button"
                            onClick={() => setAllWeeksOpen(true)}
                            aria-haspopup="dialog"
                            className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-extrabold whitespace-nowrap"
                            style={{ background: selectedTone.button, color: "var(--road-on-accent)" }}
                        >
                            <LayoutGrid size={15} aria-hidden />
                            All {weekNoun.toLowerCase()}s
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => selectWeek(currentWeek)}
                            className="flex min-h-[44px] shrink-0 items-center gap-1 rounded-full px-3.5 text-[0.8125rem] font-extrabold whitespace-nowrap"
                            style={{ background: "var(--road-ink)", color: "var(--road-ink-text)" }}
                        >
                            {relation === "earlier" ? <ChevronRight size={15} aria-hidden /> : <ChevronLeft size={15} aria-hidden />}
                            This {weekNoun.toLowerCase()}
                        </button>
                    )}
                </div>
            </div>

            <AllWeeksDialog
                open={allWeeksOpen}
                onClose={() => setAllWeeksOpen(false)}
                model={model}
                selectedWeek={selectedWeek}
                onSelect={selectWeek}
                weekNoun={weekNoun}
                showMonths={showMonths}
            />

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
