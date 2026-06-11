"use client";

import { Check, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import { courseMapUnitToneStyle, getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { buildMapReturnHref, isMapActivityCompleted } from "@/lib/course-map-navigation";
import {
    type GuidedAssignmentInfo,
    type UnitSummary,
    type WeekSummary,
    MAP_SCROLL_MARGIN,
    activityTypeIcon,
    buildWeekTimelineItems,
    focusText,
    formatLevelLabel,
    formatUnitProgressLabel,
    getExtraPracticeActivities,
    guidedActivityIcon,
    nextUpTitle,
    shortActivityTitle,
} from "./shared";
import { StartActivityButton, UnitBadge, UnitStatusChip } from "./atoms";

export function DesktopUnitSection({
    unit,
    isOpen,
    openWeekNumber,
    openOptional,
    currentId,
    currentLabel,
    guidedAssignments,
    guidedProgress,
    pulseCurrentActivity,
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
    pulseCurrentActivity?: boolean;
    showUnitMonths?: boolean;
    onToggle: () => void;
    onWeekToggle: (weekNumber: number) => void;
    onOptionalToggle: (weekNumber: number) => void;
}) {
    const tone = getCourseMapUnitTone(unit.unitNumber);
    return (
        <div
            id={`unit-${unit.unitNumber}`}
            className={`dashboard-panel overflow-hidden ${MAP_SCROLL_MARGIN}`}
            style={{ borderRadius: 20 }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px",
                    background: isOpen ? `linear-gradient(135deg, ${tone.surface}, transparent)` : "transparent",
                    border: "none",
                }}
            >
                <UnitBadge n={unit.unitNumber} status={unit.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: tone.accent }}>
                            {showUnitMonths ? unit.unitMonth : `Unit ${unit.unitNumber}`}
                        </span>
                        <UnitStatusChip status={unit.status} />
                    </div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 17, marginTop: 3, lineHeight: 1.15, color: "var(--text)" }}>
                        {unit.unitTitle}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>
                        {formatUnitProgressLabel(unit.doneWeeks, unit.totalWeeks, showUnitMonths)}
                    </div>
                </div>
                <span style={{
                    color: "var(--text-muted)", flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform .2s",
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div style={{ padding: "4px 18px 18px", display: "grid", gap: 10 }}>
                    {unit.weeks.map((week) => (
                        <div key={week.level.levelNumber} id={`week-${week.level.levelNumber}`} className={MAP_SCROLL_MARGIN}>
                            <DesktopWeekPanel
                                week={week}
                                isOpen={openWeekNumber === week.level.levelNumber}
                                currentId={currentId}
                                currentLabel={currentLabel}
                                guidedAssignments={guidedAssignments}
                                guidedProgress={guidedProgress}
                                optionalOpen={Boolean(openOptional[week.level.levelNumber])}
                                pulseCurrent={pulseCurrentActivity}
                                onToggle={() => onWeekToggle(week.level.levelNumber)}
                                onToggleOptional={() => onOptionalToggle(week.level.levelNumber)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function DesktopActivityRow({
    activity,
    assignment,
    isCompleted,
    isCurrent,
    currentLabel,
    pulseCurrent,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    isCompleted: boolean;
    isCurrent: boolean;
    currentLabel: "Start here" | "Next up";
    pulseCurrent?: boolean;
}) {
    const icon = assignment
        ? activityTypeIcon(assignment.type, assignment.category)
        : guidedActivityIcon(activity.activityType, activity.vocabUi);

    return (
        <div className="relative" id={isCurrent ? "map-activity-current" : undefined}>
            <div
                className={`absolute -left-[40px] top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white ${
                    isCompleted
                        ? "border-[var(--unit-accent,#6a8d73)] bg-[var(--unit-accent,#6a8d73)]"
                        : isCurrent
                          ? "border-[var(--unit-accent,#6a8d73)]"
                          : "border-[var(--border-subtle)]"
                }`}
            >
                {isCompleted ? (
                    <Check size={15} className="text-white" />
                ) : isCurrent ? (
                    <span className="h-4 w-4 rounded-full border-4 border-[var(--unit-accent,#6a8d73)] bg-white" />
                ) : null}
            </div>
            <StartActivityButton
                activity={activity}
                assignment={assignment}
                className={`group flex min-h-[72px] w-full items-center gap-5 border-b px-4 text-left transition-colors ${
                    isCurrent
                        ? `rounded-xl border bg-bg shadow-sm ring-1 ring-[var(--border-subtle)] ${pulseCurrent ? "map-activity-focus-pulse" : ""}`
                        : "border-[var(--border-subtle)] hover:bg-surface-subtle/50"
                }`}
            >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--unit-chip-bg,#eef3ee)] text-xl" aria-hidden>
                    {icon}
                </span>
                <span className="min-w-0 flex-1 text-base font-semibold text-text">
                    <span className={`${isCompleted ? "line-through text-text-muted" : ""}`}>
                        {shortActivityTitle(activity.title)}
                    </span>
                    {activity.wrappedGame ? (
                        <span className="ml-3 inline-flex rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2.5 py-1 text-xs font-semibold text-[var(--unit-accent,#6a8d73)]">
                            Practice
                        </span>
                    ) : null}
                    {isCurrent ? (
                        <span className="ml-3 inline-flex rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2.5 py-1 text-xs font-bold text-[var(--unit-accent,#6a8d73)]">
                            {currentLabel}
                        </span>
                    ) : null}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted">
                    {isCompleted ? (
                        <Check size={18} className="text-[var(--unit-accent,#6a8d73)]" />
                    ) : isCurrent ? (
                        <ChevronRight size={22} className="text-text" />
                    ) : null}
                </span>
            </StartActivityButton>
        </div>
    );
}

export function DesktopNextUpCard({
    activity,
    assignment,
    currentLabel,
    progressText,
    unitNumber,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    currentLabel: "Start here" | "Next up";
    progressText?: string;
    unitNumber: number;
}) {
    const icon = assignment
        ? activityTypeIcon(assignment.type, assignment.category)
        : guidedActivityIcon(activity.activityType, activity.vocabUi);

    return (
        <section
            className="dashboard-panel rounded-2xl px-6 py-5"
            style={{
                ...courseMapUnitToneStyle(unitNumber),
                borderColor: "color-mix(in srgb, var(--unit-accent,#6a8d73) 32%, var(--border-subtle))",
                boxShadow: "var(--dashboard-shadow-hover)",
            }}
        >
            <div className="flex items-center gap-7">
                <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[var(--unit-chip-bg,#eef3ee)] text-4xl" aria-hidden>
                    {icon}
                </span>
                <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-lg bg-[var(--unit-chip-bg,#eef3ee)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--unit-accent,#6a8d73)]">
                        {currentLabel}
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-text">
                        {nextUpTitle(activity.title)}
                    </h2>
                    <p className="mt-3 flex items-center gap-3 text-base font-medium text-text-muted">
                        {progressText ? (
                            <span>{progressText}</span>
                        ) : null}
                    </p>
                </div>

                <StartActivityButton
                    activity={activity}
                    assignment={assignment}
                    className="flex min-h-14 w-[170px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[var(--unit-button,#2f7d4b)] px-5 text-base font-bold text-white shadow-sm transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--unit-button,#2f7d4b)]/40"
                >
                    <span>Continue</span>
                    <ChevronRight size={24} aria-hidden />
                </StartActivityButton>
            </div>
        </section>
    );
}

export function DesktopWeekPanel({
    week,
    isOpen,
    currentId,
    currentLabel,
    guidedAssignments,
    guidedProgress,
    optionalOpen,
    pulseCurrent,
    onToggle,
    onToggleOptional,
}: {
    week: WeekSummary;
    isOpen: boolean;
    currentId: string | null;
    currentLabel: "Start here" | "Next up";
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
    optionalOpen: boolean;
    pulseCurrent?: boolean;
    onToggle: () => void;
    onToggleOptional: () => void;
}) {
    const focus = focusText(week.level.levelTitle, week.level.levelGoal);
    const extraPractice = getExtraPracticeActivities(week.level.extraPractice);

    if (!isOpen) {
        return (
            <section
                id={`week-${week.level.levelNumber}`}
                className={`dashboard-panel rounded-2xl px-6 py-4 ${MAP_SCROLL_MARGIN}`}
                style={courseMapUnitToneStyle(week.unitNumber)}
            >
                <button type="button" onClick={onToggle} className="flex w-full items-center gap-5 text-left">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base font-bold text-[var(--unit-accent,#6a8d73)]" style={{ borderColor: "color-mix(in srgb, var(--unit-accent,#6a8d73) 55%, var(--border-subtle))" }}>
                        {week.level.levelNumber}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold uppercase tracking-wide text-[var(--unit-accent,#6a8d73)]">
                            {formatLevelLabel(week.level.levelNumber)}
                        </span>
                        <span className="mt-0.5 block font-display text-xl font-bold leading-tight text-text">
                            {week.level.levelTitle}
                        </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-text-muted">
                        {week.requiredDone} / {week.requiredTotal}
                    </span>
                    <ChevronDown size={20} className="shrink-0 text-text-muted" aria-hidden />
                </button>
            </section>
        );
    }

    return (
        <section
            id={`week-${week.level.levelNumber}`}
            className={`dashboard-panel rounded-2xl p-6 ${MAP_SCROLL_MARGIN}`}
            style={courseMapUnitToneStyle(week.unitNumber)}
            aria-labelledby={`week-${week.level.levelNumber}-heading`}
        >
            <h2
                id={`week-${week.level.levelNumber}-heading`}
                tabIndex={-1}
                className="sr-only"
            >
                {formatLevelLabel(week.level.levelNumber)}: {week.level.levelTitle}
            </h2>
            <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-start gap-5 text-left">
                <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wide text-[var(--unit-accent,#6a8d73)]">
                        {formatLevelLabel(week.level.levelNumber)}
                    </span>
                    <span className="mt-2 block font-display text-3xl font-bold leading-tight text-text">
                        {week.level.levelTitle}
                    </span>
                    {focus ? (
                        <span className="mt-2 block max-w-2xl text-sm leading-snug text-text-muted">
                            Focus: {focus}
                        </span>
                    ) : null}
                </span>
                <span className="shrink-0 rounded-full border px-5 py-2 text-base font-bold tabular-nums text-[var(--unit-accent,#6a8d73)]" style={{ borderColor: "color-mix(in srgb, var(--unit-accent,#6a8d73) 35%, var(--border-subtle))" }}>
                    {week.requiredDone} / {week.requiredTotal}
                </span>
                <ChevronDown size={22} className="mt-2 shrink-0 rotate-180 text-text" aria-hidden />
            </button>

            <div className="mt-6">
                {(() => {
                    const returnHref = buildMapReturnHref(week.level.levelNumber, true);
                    const timelineItems = buildWeekTimelineItems(
                        week.level.requiredActivities,
                        guidedProgress,
                        guidedAssignments,
                        currentId,
                        returnHref
                    );
                    const tone = getCourseMapUnitTone(week.unitNumber);
                    return (
                        <ActivityTimeline
                            items={timelineItems}
                            accent={{ fg: tone.accent, bg: tone.surface }}
                        />
                    );
                })()}
            </div>

            {extraPractice.length > 0 ? (
                <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--border-subtle)" }}>
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
                        <ChevronDown
                            size={18}
                            className={`shrink-0 text-text-muted transition-transform ${optionalOpen ? "rotate-180" : ""}`}
                            aria-hidden
                        />
                    </button>
                    {optionalOpen ? (
                        <div className="relative ml-10 mt-4">
                            <div className="absolute -left-[27px] bottom-10 top-8 w-px rounded-full bg-[var(--border-subtle)]" />
                            {extraPractice.map((activity) => (
                                <DesktopActivityRow
                                    key={activity.id}
                                    activity={activity}
                                    assignment={activity.activityId ? guidedAssignments[activity.activityId] : undefined}
                                    isCompleted={isMapActivityCompleted(activity, guidedProgress)}
                                    isCurrent={false}
                                    currentLabel={currentLabel}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}

