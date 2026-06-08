"use client";

import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Clock, Plus } from "lucide-react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";
import { withReturnTo } from "@/lib/learner-navigation";
import { ActivityTimeline, type TimelineItem, type TimelineStatus } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity, CourseMapActivityType, CourseMapUnit } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import { CourseMapNextUpHeroCard } from "@/components/dashboard/CourseMapNextUpHeroCard";
import { CourseMapUnitIcon } from "@/components/dashboard/CourseMapUnitIcon";
import {
    formatNextUpActivityTitle,
    getCourseMapActivityIconEmoji,
    getCourseMapEstimatedMinutesForActivity,
} from "@/lib/course-map-hero";
import { courseMapUnitToneStyle, getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import {
    buildMapActivityHref,
    buildMapReturnHref,
    COURSE_MAP_OPEN_WEEK_EVENT,
    type CourseMapOpenWeekDetail,
    focusMapWeekHeading,
    isMapActivityActionable,
    isMapActivityCompleted,
    parseMapWeekFromHash,
    scrollToMapTarget,
    syncMapUrl,
} from "@/lib/course-map-navigation";
import {
    readCourseMapSessionState,
    resolveInitialMapOpenWeek,
    writeCourseMapSessionState,
} from "@/lib/course-map-session-state";

const MAP_SCROLL_MARGIN = "scroll-mt-[5.5rem]";

const CoursePathReturnHrefContext = createContext<string | null>(null);

function useCoursePathReturnHref(): string {
    const contextHref = useContext(CoursePathReturnHrefContext);
    const currentHref = useCurrentAppHref();
    return contextHref ?? currentHref;
}

interface PathActivity {
    id: string;
    activityId: string;
    title: string | null;
    sequenceNumber: number | null;
    unitLabel: string | null;
    isCompleted: boolean;
    isInProgress: boolean;
    activity: {
        title: string;
        type?: string;
        category?: string | null;
    };
}

interface GuidedAssignmentInfo {
    assignmentId: string;
    title: string | null;
    activityTitle: string;
    type?: string;
    category?: string | null;
}

interface Props {
    assignments: PathActivity[];
    guidedUnits?: CourseMapUnit[];
    guidedAssignments?: Record<string, GuidedAssignmentInfo>;
    guidedProgress?: CourseMapProgressState;
    desktopLayout?: boolean;
    initialWeek?: number | null;
    focusNextActivity?: boolean;
    mobileWayfinding?: ReactNode;
    /** School-year month labels (e.g. September) — classroom only */
    showUnitMonths?: boolean;
}

function formatLevelLabel(levelNumber: number): string {
    return `Level ${levelNumber}`;
}

function formatUnitProgressLabel(done: number, total: number, showUnitMonths: boolean): string {
    const noun = showUnitMonths
        ? (total === 1 ? "week" : "weeks")
        : (total === 1 ? "level" : "levels");
    return `${done}/${total} ${noun}`;
}

function activityTypeIcon(type?: string, category?: string | null): string {
    const t = (type || "").toLowerCase();
    const c = (category || "").toLowerCase();
    if (t === "guide" && c === "grammar") return "📖";
    if (t === "guide") return "📖";
    if (t === "game") return "🎮";
    if (t === "quiz") return "✏️";
    if (t === "speaking") return "🎤";
    if (t === "writing") return "✍️";
    if (t === "vocabulary" || c === "vocabulary") return "🗂️";
    if (t === "worksheet") return "📄";
    if (t === "slides") return "📊";
    return "📌";
}

function guidedActivityIcon(type: CourseMapActivityType, vocabUi?: string): string {
    if (vocabUi) return "🔤";
    switch (type) {
        case "guide":
            return "📖";
        case "game":
            return "🎮";
        case "quiz":
            return "✏️";
        case "pronunciation":
            return "🔊";
        case "writing":
            return "✍️";
        case "speaking":
            return "🎤";
        case "review":
            return "🔁";
        case "catch-up":
            return "🧭";
        case "assessment":
            return "✅";
        default:
            return "📌";
    }
}

function shortActivityTitle(title: string): string {
    return formatNextUpActivityTitle(title);
}

function nextUpTitle(title: string): string {
    return formatNextUpActivityTitle(title);
}

const focusOverrides: Record<string, string> = {
    "Parts of Speech + App Habit": "Build English sentence basics",
    "Verb Forms + Past -ed Sounds": "Use verb forms in context",
    "Tenses in Action": "Talk about now, past, and future",
};

function UnitSectionHeader({
    unitNumber,
    unitMonth,
    showUnitMonths = true,
    className = "mb-3",
}: {
    unitNumber: number;
    unitMonth?: string;
    showUnitMonths?: boolean;
    className?: string;
}) {
    const tone = getCourseMapUnitTone(unitNumber);
    const unitLabel = showUnitMonths
        ? `${unitMonth || tone.month} · Unit ${unitNumber}`
        : `Unit ${unitNumber}`;
    return (
        <div
            className={`flex items-center gap-2.5 px-0.5 ${className}`}
            style={courseMapUnitToneStyle(unitNumber)}
        >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--unit-chip-bg)] text-[var(--unit-accent)]">
                <CourseMapUnitIcon unitNumber={unitNumber} size={15} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--unit-accent)]">
                {unitLabel}
            </span>
        </div>
    );
}

function focusText(title: string, goal?: string): string | null {
    if (focusOverrides[title]) return focusOverrides[title];
    if (!goal) return null;

    const firstSentence = goal.split(/[.!?]/)[0] ?? goal;
    return firstSentence
        .replace(/^Learn the basic building blocks of English and\s+/i, "Build ")
        .replace(/^Get comfortable in the app,\s*/i, "Start the app routine, ")
        .replace(/^Practice\s+/i, "Use ")
        .replace(/^Learn\s+/i, "Build ")
        .trim();
}

function estimatedMinutes(activity: CourseMapActivity): number {
    return getCourseMapEstimatedMinutesForActivity(activity);
}

function buildWeekTimelineItems(
    activities: CourseMapActivity[],
    guidedProgress: CourseMapProgressState,
    guidedAssignments: Record<string, GuidedAssignmentInfo>,
    currentId: string | null,
    returnHref: string
): TimelineItem[] {
    return activities
        .filter((a) => a.status !== "planned")
        .map((activity) => {
            const isCompleted = isMapActivityCompleted(activity, guidedProgress);
            const isCurrent = activity.id === currentId;
            const isActionable = isMapActivityActionable(activity);

            const status: TimelineStatus = !isActionable
                ? "locked"
                : isCompleted
                  ? "done"
                  : isCurrent
                    ? "current"
                    : "todo";

            const assignment = activity.activityId ? guidedAssignments[activity.activityId] : undefined;
            let href = "/dashboard/map";

            if (isActionable) {
                const base = buildMapActivityHref(activity, assignment?.assignmentId);
                if (base) {
                    href = withReturnTo(base, returnHref);
                }
            }

            return {
                activityId: activity.id,
                title: activity.title,
                type: activity.activityType,
                vocabUi: activity.vocabUi,
                estMinutes: estimatedMinutes(activity),
                status,
                href,
            };
        });
}

interface UnitGroup {
    label: string;
    activities: PathActivity[];
}

function flattenRequired(units: CourseMapUnit[]): CourseMapActivity[] {
    return units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
}

function getExtraPracticeActivities(
    extraPractice: CourseMapActivity[] | undefined
): CourseMapActivity[] {
    return extraPractice ?? [];
}

function ActivityShell({
    activity,
    isCompleted,
    isCurrent,
    currentLabel,
    assignment,
    children,
}: {
    activity: CourseMapActivity;
    isCompleted: boolean;
    isCurrent: boolean;
    currentLabel: "Start here" | "Next up";
    assignment?: GuidedAssignmentInfo;
    children: React.ReactNode;
}) {
    const isPlanned = activity.status === "planned";
    const isLocked = activity.status === "locked";
    const isInactive = isPlanned || isLocked;
    const currentHref = useCoursePathReturnHref();
    const baseClass = `group flex flex-1 items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-all duration-150 ${
        isCompleted
            ? "text-text-muted opacity-75 hover:opacity-95"
            : isCurrent
              ? "font-semibold text-text bg-[var(--unit-surface,rgba(106,141,115,0.08))] ring-1 ring-[var(--unit-accent,#6a8d73)]/25 hover:bg-[var(--unit-surface,rgba(106,141,115,0.14))]"
              : isPlanned
                ? "text-text-muted bg-surface-subtle/40 opacity-60"
                : isLocked
                  ? "text-text-muted bg-surface-subtle/50 opacity-70"
                  : "text-text hover:bg-surface-subtle"
    }`;

    if (!isInactive && activity.activityId) {
        return (
            <ActivityLink
                activityId={activity.activityId}
                assignmentId={assignment?.assignmentId}
                href={activity.href}
                vocabUi={activity.vocabUi}
                returnTo={currentHref}
                className={baseClass}
            >
                {children}
                {isCurrent && (
                    <span className="shrink-0 rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--unit-accent,#6a8d73)]">
                        {currentLabel}
                    </span>
                )}
            </ActivityLink>
        );
    }

    if (!isInactive && activity.href) {
        return (
            <Link href={withReturnTo(activity.href, currentHref)} className={baseClass}>
                {children}
                {isCurrent && (
                    <span className="shrink-0 rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--unit-accent,#6a8d73)]">
                        {currentLabel}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <div className={baseClass} aria-disabled="true">
            {children}
            {isPlanned ? (
                <span className="shrink-0 rounded-full border border-dashed px-2 py-0.5 text-[10px] font-semibold text-text-muted" style={{ borderColor: "var(--border-subtle)" }}>
                    Coming soon
                </span>
            ) : isLocked ? (
                <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-text-muted" style={{ borderColor: "var(--border-subtle)" }}>
                    Locked
                </span>
            ) : isCurrent ? (
                <span className="shrink-0 rounded-full bg-[var(--unit-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--unit-accent,#6a8d73)]">
                    {currentLabel}
                </span>
            ) : null}
        </div>
    );
}

function StartActivityButton({
    activity,
    assignment,
    className,
    children,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    className: string;
    children: React.ReactNode;
}) {
    const currentHref = useCoursePathReturnHref();

    if (activity.status === "planned" || activity.status === "locked") {
        return (
            <div className={className} aria-disabled="true">
                {children}
            </div>
        );
    }

    if (activity.activityId) {
        return (
            <ActivityLink
                activityId={activity.activityId}
                assignmentId={assignment?.assignmentId}
                href={activity.href}
                vocabUi={activity.vocabUi}
                returnTo={currentHref}
                className={className}
            >
                {children}
            </ActivityLink>
        );
    }

    if (activity.href) {
        return (
            <Link href={withReturnTo(activity.href, currentHref)} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <div className={className} aria-disabled="true">
            {children}
        </div>
    );
}

interface WeekSummary {
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    level: CourseMapUnit["levels"][number];
    requiredDone: number;
    requiredTotal: number;
    hasCurrent: boolean;
    isDone: boolean;
}

interface UnitSummary {
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    weeks: WeekSummary[];
    doneWeeks: number;
    totalWeeks: number;
    hasCurrent: boolean;
    status: "done" | "current" | "todo";
}

function MobileNextUpCard({
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

function MobileActivityRow({
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

function UnitBadge({ n, status, size = 44 }: { n: number; status: "done" | "current" | "todo"; size?: number }) {
    const tone = getCourseMapUnitTone(n);
    return (
        <div style={{
            width: size, height: size, borderRadius: 14, flexShrink: 0,
            display: "grid", placeItems: "center", position: "relative",
            background: `linear-gradient(150deg, color-mix(in srgb, ${tone.accent} 78%, #fff), ${tone.accent})`,
            color: "#fff",
            boxShadow: `0 5px 12px color-mix(in srgb, ${tone.accent} 32%, transparent)`,
        }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size * 0.42 }}>{n}</span>
            {status === "done" && (
                <span style={{
                    position: "absolute", bottom: -3, right: -3,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#4a7c59", color: "#fff",
                    display: "grid", placeItems: "center",
                    border: "2px solid var(--surface-base, var(--bg, #fdf9f0))",
                }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            )}
        </div>
    );
}

function UnitStatusChip({ status }: { status: "done" | "current" | "todo" }) {
    if (status === "done") return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, paddingInline: "8px", paddingBlock: "3px", borderRadius: 999, background: "#e9f0ea", color: "#3a6347", fontSize: 10.5, fontWeight: 700 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Completed
        </span>
    );
    if (status === "current") return (
        <span style={{ display: "inline-flex", alignItems: "center", paddingInline: "8px", paddingBlock: "3px", borderRadius: 999, background: "#fbeae4", color: "var(--primary)", fontSize: 10.5, fontWeight: 700 }}>
            In progress
        </span>
    );
    return (
        <span style={{ display: "inline-flex", alignItems: "center", paddingInline: "8px", paddingBlock: "3px", borderRadius: 999, background: "var(--surface-subtle, #f5f0e8)", color: "var(--text-muted)", fontSize: 10.5, fontWeight: 700 }}>
            Upcoming
        </span>
    );
}

function DesktopUnitSection({
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

function MobileUnitSection({
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

function MobileWeekCard({
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

function DesktopActivityRow({
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

function DesktopNextUpCard({
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

function DesktopWeekPanel({
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

function GuidedCoursePath({
    guidedUnits,
    guidedAssignments,
    guidedProgress,
    desktopLayout = false,
    initialWeek = null,
    focusNextActivity = false,
    mobileWayfinding,
    showUnitMonths = true,
}: {
    guidedUnits: CourseMapUnit[];
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
    desktopLayout?: boolean;
    initialWeek?: number | null;
    focusNextActivity?: boolean;
    mobileWayfinding?: ReactNode;
    showUnitMonths?: boolean;
}) {
    const pathname = usePathname();
    const requiredActivities = useMemo(() => flattenRequired(guidedUnits), [guidedUnits]);
    const completedRequired = requiredActivities.filter((activity) =>
        isMapActivityCompleted(activity, guidedProgress)
    ).length;
    const firstIncomplete = requiredActivities.find((activity) =>
        isMapActivityActionable(activity) && !isMapActivityCompleted(activity, guidedProgress)
    );
    const hasAnyCompleted = completedRequired > 0;
    const currentLabel = hasAnyCompleted ? "Next up" : "Start here";
    const currentId = firstIncomplete?.id ?? null;
    const weekSummaries = useMemo<WeekSummary[]>(() => (
        guidedUnits.flatMap((unit) =>
            unit.levels.map((level) => {
                const actionableRequired = level.requiredActivities.filter(isMapActivityActionable);
                const requiredDone = actionableRequired.filter((activity) =>
                    isMapActivityCompleted(activity, guidedProgress)
                ).length;
                const requiredTotal = actionableRequired.length;
                return {
                    unitNumber: unit.unitNumber,
                    unitTitle: unit.unitTitle,
                    unitMonth: unit.month,
                    level,
                    requiredDone,
                    requiredTotal,
                    hasCurrent: level.requiredActivities.some((activity) => activity.id === currentId),
                    isDone: requiredTotal > 0 && requiredDone === requiredTotal,
                };
            })
        )
    ), [guidedUnits, guidedProgress, currentId]);

    const unitSummaries = useMemo<UnitSummary[]>(() => {
        const map = new Map<number, UnitSummary>();
        for (const week of weekSummaries) {
            if (!map.has(week.unitNumber)) {
                map.set(week.unitNumber, {
                    unitNumber: week.unitNumber,
                    unitTitle: week.unitTitle,
                    unitMonth: week.unitMonth,
                    weeks: [],
                    doneWeeks: 0,
                    totalWeeks: 0,
                    hasCurrent: false,
                    status: "todo",
                });
            }
            const u = map.get(week.unitNumber)!;
            u.weeks.push(week);
            u.totalWeeks++;
            if (week.isDone) u.doneWeeks++;
            if (week.hasCurrent) u.hasCurrent = true;
        }
        for (const u of map.values()) {
            u.status = u.doneWeeks === u.totalWeeks && u.totalWeeks > 0
                ? "done"
                : u.hasCurrent
                    ? "current"
                    : "todo";
        }
        return Array.from(map.values());
    }, [weekSummaries]);

    const currentWeek = weekSummaries.find((week) => week.hasCurrent) ?? weekSummaries.find((week) => !week.isDone) ?? weekSummaries[0];
    const currentUnit = unitSummaries.find((u) => u.hasCurrent) ?? unitSummaries.find((u) => u.status !== "done") ?? unitSummaries[0];
    const progressWeekNumber = currentWeek?.level.levelNumber ?? null;
    const resolveOpenWeek = () =>
        resolveInitialMapOpenWeek({
            initialWeek,
            hashWeek: typeof window !== "undefined" ? parseMapWeekFromHash(window.location.hash) : null,
            progressWeek: progressWeekNumber,
        });
    const [openUnitNumber, setOpenUnitNumber] = useState<number | null>(() => currentUnit?.unitNumber ?? null);
    const [mobileOpenWeek, setMobileOpenWeek] = useState<number | null>(resolveOpenWeek);
    const [mobileOptionalOpen, setMobileOptionalOpen] = useState<Record<number, boolean>>({});
    const [desktopSelectedWeek, setDesktopSelectedWeek] = useState<number | null>(resolveOpenWeek);
    const [desktopOptionalOpen, setDesktopOptionalOpen] = useState<Record<number, boolean>>({});
    const [pulseCurrentActivity, setPulseCurrentActivity] = useState(focusNextActivity);
    const didInitialScroll = useRef(false);

    const openDesktopWeek = desktopSelectedWeek;
    const activeWeekNumber = desktopLayout
        ? (openDesktopWeek ?? currentWeek?.level.levelNumber ?? null)
        : (mobileOpenWeek ?? currentWeek?.level.levelNumber ?? null);
    const mapReturnHref =
        pathname === "/dashboard/map" && activeWeekNumber != null
            ? buildMapReturnHref(activeWeekNumber, true)
            : null;

    const navigateToWeek = useCallback((weekNumber: number, focusActivity = false) => {
        const parentUnit = weekSummaries.find((w) => w.level.levelNumber === weekNumber);
        if (parentUnit) setOpenUnitNumber(parentUnit.unitNumber);
        if (desktopLayout) {
            setDesktopSelectedWeek(weekNumber);
        } else {
            setMobileOpenWeek(weekNumber);
        }
        window.requestAnimationFrame(() => {
            scrollToMapTarget(`week-${weekNumber}`);
            if (focusActivity) {
                setPulseCurrentActivity(true);
                window.requestAnimationFrame(() => scrollToMapTarget("map-activity-current"));
            } else {
                focusMapWeekHeading(weekNumber);
            }
        });
    }, [desktopLayout, weekSummaries]);

    useEffect(() => {
        if (didInitialScroll.current) return;
        const hashWeek = parseMapWeekFromHash(window.location.hash);
        const explicitWeek = initialWeek ?? hashWeek;

        if (explicitWeek || focusNextActivity) {
            const targetWeek = explicitWeek ?? progressWeekNumber;
            if (targetWeek == null) return;
            didInitialScroll.current = true;
            navigateToWeek(targetWeek, focusNextActivity);
            return;
        }

        const session = readCourseMapSessionState();
        if (session?.week) {
            didInitialScroll.current = true;
            navigateToWeek(session.week, false);
            if (session.scrollY > 0) {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        window.scrollTo({ top: session.scrollY, behavior: "auto" });
                    });
                });
            }
        }
    }, [focusNextActivity, initialWeek, navigateToWeek, progressWeekNumber]);

    useEffect(() => {
        if (pathname !== "/dashboard/map") return;
        if (activeWeekNumber == null) return;
        writeCourseMapSessionState(activeWeekNumber, window.scrollY);

        let timeout: number;
        const onScroll = () => {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                writeCourseMapSessionState(activeWeekNumber, window.scrollY);
            }, 150);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.clearTimeout(timeout);
        };
    }, [activeWeekNumber, pathname]);

    useEffect(() => {
        if (!pulseCurrentActivity) return;
        const timeout = window.setTimeout(() => setPulseCurrentActivity(false), 2400);
        return () => window.clearTimeout(timeout);
    }, [pulseCurrentActivity]);

    useEffect(() => {
        if (pathname !== "/dashboard/map") return;
        syncMapUrl(activeWeekNumber, Boolean(pulseCurrentActivity));
    }, [activeWeekNumber, pathname, pulseCurrentActivity]);

    useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<CourseMapOpenWeekDetail>).detail;
            if (!detail?.week) return;
            navigateToWeek(detail.week, detail.focusActivity);
        };
        window.addEventListener(COURSE_MAP_OPEN_WEEK_EVENT, handler);
        return () => window.removeEventListener(COURSE_MAP_OPEN_WEEK_EVENT, handler);
    }, [navigateToWeek]);

    let content: ReactNode;

    if (!desktopLayout) {
        content = (
            <div className="space-y-3">
                {mobileWayfinding}

                <div className="space-y-3">
                    {unitSummaries.map((unit) => (
                        <MobileUnitSection
                            key={unit.unitNumber}
                            unit={unit}
                            isOpen={openUnitNumber === unit.unitNumber}
                            openWeekNumber={mobileOpenWeek}
                            openOptional={mobileOptionalOpen}
                            currentId={currentId}
                            currentLabel={currentLabel}
                            guidedAssignments={guidedAssignments}
                            guidedProgress={guidedProgress}
                            showUnitMonths={showUnitMonths}
                            onToggle={() =>
                                setOpenUnitNumber((prev) =>
                                    prev === unit.unitNumber ? null : unit.unitNumber
                                )
                            }
                            onWeekToggle={(weekNumber) =>
                                setMobileOpenWeek((prev) =>
                                    prev === weekNumber ? null : weekNumber
                                )
                            }
                            onOptionalToggle={(weekNumber) =>
                                setMobileOptionalOpen((prev) => ({
                                    ...prev,
                                    [weekNumber]: !prev[weekNumber],
                                }))
                            }
                        />
                    ))}
                </div>
            </div>
        );
    } else {
        content = (
        <div className="space-y-4">
            {unitSummaries.map((unit) => (
                <DesktopUnitSection
                    key={unit.unitNumber}
                    unit={unit}
                    isOpen={openUnitNumber === unit.unitNumber}
                    openWeekNumber={desktopSelectedWeek}
                    openOptional={desktopOptionalOpen}
                    currentId={currentId}
                    currentLabel={currentLabel}
                    guidedAssignments={guidedAssignments}
                    guidedProgress={guidedProgress}
                    pulseCurrentActivity={pulseCurrentActivity}
                    showUnitMonths={showUnitMonths}
                    onToggle={() =>
                        setOpenUnitNumber((prev) =>
                            prev === unit.unitNumber ? null : unit.unitNumber
                        )
                    }
                    onWeekToggle={(weekNumber) =>
                        setDesktopSelectedWeek((prev) =>
                            prev === weekNumber ? null : weekNumber
                        )
                    }
                    onOptionalToggle={(weekNumber) =>
                        setDesktopOptionalOpen((prev) => ({
                            ...prev,
                            [weekNumber]: !prev[weekNumber],
                        }))
                    }
                />
            ))}
        </div>
        );
    }

    return (
        <CoursePathReturnHrefContext.Provider value={mapReturnHref}>
            {content}
        </CoursePathReturnHrefContext.Provider>
    );
}

function LegacyCoursePath({ assignments }: { assignments: PathActivity[] }) {
    const sequenced = assignments
        .filter((a) => a.sequenceNumber != null)
        .sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));

    const unsequenced = assignments.filter((a) => a.sequenceNumber == null);

    const units = useMemo<UnitGroup[]>(() => {
        const groups: UnitGroup[] = [];
        const seen = new Map<string, UnitGroup>();
        for (const a of sequenced) {
            const label = a.unitLabel || "Course Activities";
            if (!seen.has(label)) {
                const group: UnitGroup = { label, activities: [] };
                groups.push(group);
                seen.set(label, group);
            }
            seen.get(label)!.activities.push(a);
        }
        return groups;
    }, [sequenced]);

    const nextUpId = useMemo(() => {
        return sequenced.find((a) => !a.isCompleted)?.id ?? null;
    }, [sequenced]);

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const toggle = (label: string) =>
        setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

    if (sequenced.length === 0 && unsequenced.length === 0) return null;
    if (sequenced.length === 0) return null;

    return (
        <div className="dashboard-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">Your Course Path</h3>
                <span className="text-xs font-medium text-text-muted">Next activity highlighted</span>
            </div>

            <div className="space-y-4">
                {units.map((unit) => {
                    const unitDone = unit.activities.filter((a) => a.isCompleted).length;
                    const unitTotal = unit.activities.length;
                    const isUnitDone = unitDone === unitTotal;
                    const isOpen = !collapsed[unit.label];
                    const hasNextUp = unit.activities.some((a) => a.id === nextUpId);

                    return (
                        <div key={unit.label}>
                            <button
                                onClick={() => toggle(unit.label)}
                                className="w-full flex items-center gap-2 text-left group"
                                aria-expanded={isOpen}
                            >
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                                        isUnitDone
                                            ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)] text-[var(--tone-grammar-accent,#b05740)]"
                                            : hasNextUp
                                              ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)] text-[var(--tone-vocab-accent,#6a8d73)]"
                                              : "border-[var(--border-subtle,#ddd6ca)] bg-[var(--surface-subtle,#f8f4ef)] text-text-muted"
                                    }`}
                                >
                                    {isUnitDone ? <Check size={10} /> : unitDone}
                                </span>
                                <span className="flex-1 text-xs font-semibold tracking-wide uppercase text-text-muted">
                                    {unit.label}
                                </span>
                                {isOpen ? (
                                    <ChevronDown size={13} className="text-text-muted shrink-0" />
                                ) : (
                                    <ChevronRight size={13} className="text-text-muted shrink-0" />
                                )}
                            </button>

                            {isOpen && (
                                <div className="relative mt-2 pl-5">
                                    <div
                                        className="absolute left-[9px] top-1 bottom-1 w-px rounded-full"
                                        style={{ background: "var(--border-subtle, #ddd6ca)" }}
                                    />

                                    <div className="space-y-1.5">
                                        {unit.activities.map((activity) => {
                                            const isNext = activity.id === nextUpId;
                                            const label = activity.title || activity.activity.title;
                                            const icon = activityTypeIcon(
                                                activity.activity.type,
                                                activity.activity.category
                                            );

                                            return (
                                                <div key={activity.id} className="relative flex items-center gap-2.5">
                                                    <div
                                                        className={`absolute -left-5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                                                            activity.isCompleted
                                                                ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)]"
                                                                : isNext
                                                                  ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)]"
                                                                  : "border-[var(--border-subtle,#ddd6ca)] bg-[var(--surface-subtle,#f8f4ef)]"
                                                        }`}
                                                    >
                                                        {activity.isCompleted ? (
                                                            <Check
                                                                size={9}
                                                                className="text-[var(--tone-grammar-accent,#b05740)]"
                                                            />
                                                        ) : isNext ? (
                                                            <span className="block h-2 w-2 rounded-full bg-[var(--tone-vocab-accent,#6a8d73)]" />
                                                        ) : (
                                                            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--border-subtle,#ddd6ca)]" />
                                                        )}
                                                    </div>

                                                    <ActivityLink
                                                        activityId={activity.activityId}
                                                        assignmentId={activity.id}
                                                        className={`flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-all duration-150 ${
                                                            activity.isCompleted
                                                                ? "text-text-muted opacity-70 hover:opacity-90"
                                                                : isNext
                                                                  ? "font-semibold text-text bg-[var(--tone-vocab-surface,rgba(106,141,115,0.06))] hover:bg-[var(--tone-vocab-surface,rgba(106,141,115,0.1))]"
                                                                  : "text-text-muted hover:text-text hover:bg-surface-subtle"
                                                        }`}
                                                    >
                                                        <span className="shrink-0 text-base leading-none" aria-hidden>
                                                            {icon}
                                                        </span>
                                                        <span className={`flex-1 leading-snug ${activity.isCompleted ? "line-through" : ""}`}>
                                                            {label}
                                                        </span>
                                                        {isNext && (
                                                            <span className="shrink-0 rounded-full bg-[var(--tone-vocab-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-vocab-accent,#6a8d73)]">
                                                                Next up
                                                            </span>
                                                        )}
                                                    </ActivityLink>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {unsequenced.length > 0 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border-subtle, #ddd6ca)" }}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                        More Activities
                    </p>
                    <div className="space-y-1">
                        {unsequenced.map((a) => (
                            <ActivityLink
                                key={a.id}
                                activityId={a.activityId}
                                assignmentId={a.id}
                                className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
                            >
                                <span className="shrink-0 text-base leading-none" aria-hidden>
                                    {activityTypeIcon(a.activity.type, a.activity.category)}
                                </span>
                                <span className="flex-1 leading-snug">{a.title || a.activity.title}</span>
                                {a.isCompleted && <Check size={12} className="shrink-0 text-text-muted" />}
                            </ActivityLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function ClassCoursePath({
    assignments,
    guidedUnits = [],
    guidedAssignments = {},
    guidedProgress = {},
    desktopLayout = false,
    initialWeek = null,
    focusNextActivity = false,
    mobileWayfinding,
    showUnitMonths = true,
}: Props) {
    if (guidedUnits.length > 0) {
        return (
            <GuidedCoursePath
                guidedUnits={guidedUnits}
                guidedAssignments={guidedAssignments}
                guidedProgress={guidedProgress}
                desktopLayout={desktopLayout}
                initialWeek={initialWeek}
                focusNextActivity={focusNextActivity}
                mobileWayfinding={mobileWayfinding}
                showUnitMonths={showUnitMonths}
            />
        );
    }

    return <LegacyCoursePath assignments={assignments} />;
}
