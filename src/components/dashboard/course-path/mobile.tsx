"use client";

import { Check, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import { CourseMapNextUpHeroCard } from "@/components/dashboard/CourseMapNextUpHeroCard";
import { getCourseMapActivityIconEmoji } from "@/lib/course-map-hero";
import { courseMapUnitToneStyle, getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { buildMapReturnHref, isMapActivityCompleted } from "@/lib/course-map-navigation";
import {
    type GuidedAssignmentInfo,
    type UnitSummary,
    type WeekSummary,
    MAP_SCROLL_MARGIN,
    activityTypeIcon,
    buildWeekTimelineItems,
    estimatedMinutes,
    focusText,
    formatLevelLabel,
    formatUnitProgressLabel,
    getExtraPracticeActivities,
    guidedActivityIcon,
    nextUpTitle,
    shortActivityTitle,
} from "./shared";
import { ActivityShell, StartActivityButton, UnitBadge, UnitStatusChip } from "./atoms";

export function MobileNextUpCard({
    activity,
    assignment,
    currentLabel,
    unitNumber,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    currentLabel: "Start here" | "Next up";
    unitNumber: number;
}) {
    const icon = assignment
        ? getCourseMapActivityIconEmoji(activity.activityType, assignment.type, assignment.category)
        : getCourseMapActivityIconEmoji(activity.activityType);

    return (
        <CourseMapNextUpHeroCard
            href={activity.href ?? "#"}
            title={nextUpTitle(activity.title)}
            currentLabel={currentLabel}
            unitNumber={unitNumber}
            estimatedMinutes={estimatedMinutes(activity)}
            icon={icon}
            cta={
                <StartActivityButton
                    activity={activity}
                    assignment={assignment}
                    className="mt-5 flex min-h-12 w-full items-center justify-between rounded-full bg-[#fffdfa] px-5 text-sm font-bold text-[#172235] shadow-sm transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff]/70"
                >
                    <span>Start Lesson</span>
                    <ChevronRight size={20} aria-hidden />
                </StartActivityButton>
            }
        />
    );
}

export function MobileActivityRow({
    activity,
    assignment,
    isCompleted,
    isCurrent,
    currentLabel,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    isCompleted: boolean;
    isCurrent: boolean;
    currentLabel: "Start here" | "Next up";
}) {
    const icon = assignment
        ? activityTypeIcon(assignment.type, assignment.category)
        : guidedActivityIcon(activity.activityType, activity.vocabUi);

    return (
        <div className="relative flex items-center gap-3 py-2">
            <div className="absolute -left-[31px] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border bg-white" style={{ borderColor: isCompleted ? "var(--unit-accent,#b05740)" : "var(--border-subtle)" }}>
                {isCompleted ? <Check size={11} className="text-[var(--unit-accent,#b05740)]" /> : isCurrent ? <span className="h-2 w-2 rounded-full bg-[var(--unit-accent,#6a8d73)]" /> : null}
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--unit-chip-bg,#eef3ee)] text-xl" aria-hidden>
                {icon}
            </span>
            <ActivityShell
                activity={activity}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                currentLabel={currentLabel}
                assignment={assignment}
            >
                <span className="min-w-0 flex-1">
                    <span className={`block leading-snug ${isCompleted ? "line-through" : ""}`}>
                        {shortActivityTitle(activity.title)}
                    </span>
                    {activity.wrappedGame && (
                        <span className="mt-1 inline-flex rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2 py-0.5 text-[11px] font-semibold text-[var(--unit-accent,#6a8d73)]">
                            Practice
                        </span>
                    )}
                </span>
            </ActivityShell>
        </div>
    );
}

export function MobileUnitSection({
    unit,
    isOpen,
    openWeekNumber,
    openOptional,
    currentId,
    currentLabel,
    guidedAssignments,
    guidedProgress,
    showUnitMonths = true,
    onToggle,
    onWeekToggle,
    onOptionalToggle,
}: {
    unit: UnitSummary;
    isOpen: boolean;
    openWeekNumber: number | null;
    openOptional: Record<number, boolean>;
    currentId: string | null;
    currentLabel: "Start here" | "Next up";
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
    showUnitMonths?: boolean;
    onToggle: () => void;
    onWeekToggle: (weekNumber: number) => void;
    onOptionalToggle: (weekNumber: number) => void;
}) {
    const tone = getCourseMapUnitTone(unit.unitNumber);
    const hasOpenWeek = openWeekNumber != null && unit.weeks.some((week) => week.level.levelNumber === openWeekNumber);
    return (
        <div
            id={`unit-${unit.unitNumber}`}
            className={`dashboard-panel overflow-hidden ${MAP_SCROLL_MARGIN}`}
            style={{ borderRadius: 18 }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 14px",
                    background: isOpen ? `linear-gradient(135deg, ${tone.surface}, transparent)` : "transparent",
                    border: "none",
                }}
            >
                <UnitBadge n={unit.unitNumber} status={unit.status} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: tone.accent }}>
                            {showUnitMonths ? unit.unitMonth : `Unit ${unit.unitNumber}`}
                        </span>
                        <UnitStatusChip status={unit.status} />
                    </div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 15, marginTop: 3, lineHeight: 1.15, color: "var(--text)" }}>
                        {unit.unitTitle}
                    </div>
                    {!hasOpenWeek ? (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                            {formatUnitProgressLabel(unit.doneWeeks, unit.totalWeeks, showUnitMonths)}
                        </div>
                    ) : null}
                </div>
                <span style={{
                    color: "var(--text-muted)", flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform .2s",
                }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M6.5 4.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div style={{ padding: hasOpenWeek ? "0 10px 12px" : "0 14px 14px" }}>
                    {hasOpenWeek ? (
                        <>
                            {unit.weeks
                                .filter((week) => openWeekNumber === week.level.levelNumber)
                                .map((week) => (
                                    <div
                                        key={week.level.levelNumber}
                                        id={`week-${week.level.levelNumber}`}
                                        className={MAP_SCROLL_MARGIN}
                                    >
                                        <MobileWeekCard
                                            week={week}
                                            isOpen
                                            optionalOpen={Boolean(openOptional[week.level.levelNumber])}
                                            currentId={currentId}
                                            currentLabel={currentLabel}
                                            guidedAssignments={guidedAssignments}
                                            guidedProgress={guidedProgress}
                                            onToggle={() => onWeekToggle(week.level.levelNumber)}
                                            onToggleOptional={() => onOptionalToggle(week.level.levelNumber)}
                                        />
                                    </div>
                                ))}
                            {unit.weeks.some((week) => week.level.levelNumber !== openWeekNumber) ? (
                                <div
                                    className="border-t pt-2"
                                    style={{ borderColor: "var(--border-subtle)" }}
                                >
                                    <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                                        More in this unit
                                    </p>
                                    {unit.weeks
                                        .filter((week) => week.level.levelNumber !== openWeekNumber)
                                        .map((week, index, siblings) => (
                                            <div
                                                key={week.level.levelNumber}
                                                id={`week-${week.level.levelNumber}`}
                                                className={MAP_SCROLL_MARGIN}
                                                style={{
                                                    borderBottom:
                                                        index < siblings.length - 1
                                                            ? "1px solid var(--border-subtle)"
                                                            : undefined,
                                                }}
                                            >
                                                <MobileWeekCard
                                                    week={week}
                                                    isOpen={false}
                                                    optionalOpen={Boolean(openOptional[week.level.levelNumber])}
                                                    currentId={currentId}
                                                    currentLabel={currentLabel}
                                                    guidedAssignments={guidedAssignments}
                                                    guidedProgress={guidedProgress}
                                                    onToggle={() => onWeekToggle(week.level.levelNumber)}
                                                    onToggleOptional={() => onOptionalToggle(week.level.levelNumber)}
                                                />
                                            </div>
                                        ))}
                                </div>
                            ) : null}
                        </>
                    ) : (
                        unit.weeks.map((week, index) => {
                            const weekIsOpen = openWeekNumber === week.level.levelNumber;
                            const isLast = index === unit.weeks.length - 1;
                            return (
                                <div
                                    key={week.level.levelNumber}
                                    id={`week-${week.level.levelNumber}`}
                                    className={MAP_SCROLL_MARGIN}
                                    style={{
                                        borderTop: index === 0 ? "1px solid var(--border-subtle)" : undefined,
                                        borderBottom: !isLast && !weekIsOpen ? "1px solid var(--border-subtle)" : undefined,
                                    }}
                                >
                                    <MobileWeekCard
                                        week={week}
                                        isOpen={weekIsOpen}
                                        optionalOpen={Boolean(openOptional[week.level.levelNumber])}
                                        currentId={currentId}
                                        currentLabel={currentLabel}
                                        guidedAssignments={guidedAssignments}
                                        guidedProgress={guidedProgress}
                                        onToggle={() => onWeekToggle(week.level.levelNumber)}
                                        onToggleOptional={() => onOptionalToggle(week.level.levelNumber)}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export function MobileWeekCard({
    week,
    isOpen,
    optionalOpen,
    currentId,
    currentLabel,
    guidedAssignments,
    guidedProgress,
    onToggle,
    onToggleOptional,
}: {
    week: WeekSummary;
    isOpen: boolean;
    optionalOpen: boolean;
    currentId: string | null;
    currentLabel: "Start here" | "Next up";
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
    onToggle: () => void;
    onToggleOptional: () => void;
}) {
    const focus = focusText(week.level.levelTitle, week.level.levelGoal);
    const tone = getCourseMapUnitTone(week.unitNumber);

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={false}
                className="flex w-full items-center gap-3 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                    style={{
                        color: tone.accent,
                        borderColor: `color-mix(in srgb, ${tone.accent} 55%, var(--border-subtle))`,
                    }}
                >
                    {week.level.levelNumber}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-text">
                        {week.level.levelTitle}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-muted">
                        {week.requiredDone} / {week.requiredTotal} done
                    </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-text-muted" aria-hidden />
            </button>
        );
    }

    return (
        <section
            aria-labelledby={`week-${week.level.levelNumber}-heading`}
            className="pb-1"
            style={courseMapUnitToneStyle(week.unitNumber)}
        >
            <div
                className="sticky top-0 z-10 -mx-[10px] mb-2 border-b px-[10px] py-2 backdrop-blur"
                style={{
                    borderColor: "var(--border-subtle)",
                    background: `color-mix(in srgb, ${tone.surface} 92%, var(--bg))`,
                }}
            >
                <h2
                    id={`week-${week.level.levelNumber}-heading`}
                    tabIndex={-1}
                    className="font-display text-[15px] font-bold leading-tight text-text focus-visible:outline-none"
                >
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: tone.accent }}>
                        {formatLevelLabel(week.level.levelNumber)}
                    </span>
                    <span className="ml-1.5 align-middle">{week.level.levelTitle}</span>
                </h2>
            </div>
            {focus ? (
                <p className="mb-3 text-sm leading-relaxed text-text-muted">
                    {focus}
                </p>
            ) : null}

            {(() => {
                const returnHref = buildMapReturnHref(week.level.levelNumber, true);
                const timelineItems = buildWeekTimelineItems(
                    week.level.requiredActivities,
                    guidedProgress,
                    guidedAssignments,
                    currentId,
                    returnHref
                );
                return (
                    <ActivityTimeline
                        items={timelineItems}
                        accent={{ fg: tone.accent, bg: tone.surface }}
                        layout="list"
                    />
                );
            })()}

            <button
                type="button"
                onClick={onToggle}
                className="mt-2 w-full py-2 text-center text-xs font-semibold text-text-muted"
            >
                Collapse level
            </button>

            {getExtraPracticeActivities(week.level.extraPractice).length > 0 ? (
                <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <button
                        type="button"
                        onClick={onToggleOptional}
                        aria-expanded={optionalOpen}
                        className="flex w-full items-center gap-3 text-left"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--unit-chip-bg,#eef3ee)] text-[var(--unit-accent,#6a8d73)]">
                            {optionalOpen ? <ChevronDown size={20} aria-hidden /> : <Plus size={21} aria-hidden />}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-base font-semibold text-text">Optional practice</span>
                            <span className="block text-sm text-text-muted">
                                {optionalOpen ? "Hide extra games and activities" : "More games and activities"}
                            </span>
                        </span>
                        <ChevronRight size={18} className={`shrink-0 text-text-muted transition-transform ${optionalOpen ? "rotate-90" : ""}`} aria-hidden />
                    </button>

                    {optionalOpen ? (
                        <div className="relative ml-[31px] mt-3">
                            <div className="absolute -left-[22px] bottom-4 top-4 w-px rounded-full bg-[var(--border-subtle)]" />
                            <div className="space-y-1">
                                {getExtraPracticeActivities(week.level.extraPractice).map((activity) => (
                                    <MobileActivityRow
                                        key={activity.id}
                                        activity={activity}
                                        assignment={activity.activityId ? guidedAssignments[activity.activityId] : undefined}
                                        isCompleted={isMapActivityCompleted(activity, guidedProgress)}
                                        isCurrent={false}
                                        currentLabel={currentLabel}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}

