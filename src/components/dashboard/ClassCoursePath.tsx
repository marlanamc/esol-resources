"use client";

import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Clock, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";
import { withReturnTo } from "@/lib/learner-navigation";
import type {
    CourseMapActivity,
    CourseMapActivityType,
    CourseMapUnit,
} from "@/lib/course-map";

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
    guidedProgress?: Record<string, string | null>;
    desktopLayout?: boolean;
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

function guidedActivityIcon(type: CourseMapActivityType): string {
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

interface UnitGroup {
    label: string;
    activities: PathActivity[];
}

function flattenRequired(units: CourseMapUnit[]): CourseMapActivity[] {
    return units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
}

function isActionable(activity: CourseMapActivity): boolean {
    return (
        activity.status !== "planned" &&
        activity.status !== "locked" &&
        Boolean(activity.activityId || activity.href)
    );
}

function isActivityCompleted(
    activity: CourseMapActivity,
    guidedProgress: Record<string, string | null>
): boolean {
    return Boolean(activity.activityId && guidedProgress[activity.activityId] === "completed");
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
    const currentHref = useCurrentAppHref();
    const baseClass = `group flex flex-1 items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-all duration-150 ${
        isCompleted
            ? "text-text-muted opacity-75 hover:opacity-95"
            : isCurrent
              ? "font-semibold text-text bg-[var(--tone-vocab-surface,rgba(106,141,115,0.08))] ring-1 ring-[var(--tone-vocab-accent,#6a8d73)]/25 hover:bg-[var(--tone-vocab-surface,rgba(106,141,115,0.12))]"
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
                className={baseClass}
            >
                {children}
                {isCurrent && (
                    <span className="shrink-0 rounded-full bg-[var(--tone-vocab-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-vocab-accent,#6a8d73)]">
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
                    <span className="shrink-0 rounded-full bg-[var(--tone-vocab-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-vocab-accent,#6a8d73)]">
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
                <span className="shrink-0 rounded-full bg-[var(--tone-vocab-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-vocab-accent,#6a8d73)]">
                    {currentLabel}
                </span>
            ) : null}
        </div>
    );
}

function GuidedActivityRow({
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
    const isPlanned = activity.status === "planned";
    const isLocked = activity.status === "locked";
    const isInactive = isPlanned || isLocked;
    const icon = assignment
        ? activityTypeIcon(assignment.type, assignment.category)
        : guidedActivityIcon(activity.activityType);

    return (
        <div className="relative flex items-center gap-2.5">
            <div
                className={`absolute -left-5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isCompleted
                        ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)]"
                        : isCurrent
                          ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)]"
                          : isPlanned
                            ? "border-dashed border-[var(--border-subtle,#ddd6ca)] bg-bg"
                            : isLocked
                              ? "border-[var(--border-subtle,#ddd6ca)] bg-bg"
                              : "border-[var(--tone-vocab-accent,#6a8d73)]/40 bg-white dark:bg-[#162b3d]"
                }`}
            >
                {isCompleted ? (
                    <Check size={9} className="text-[var(--tone-grammar-accent,#b05740)]" />
                ) : isCurrent ? (
                    <span className="block h-2 w-2 rounded-full bg-[var(--tone-vocab-accent,#6a8d73)]" />
                ) : isPlanned ? (
                    <Clock size={8} className="text-text-muted opacity-60" />
                ) : isLocked ? (
                    <Lock size={9} className="text-text-muted" />
                ) : (
                    <span className="block h-1.5 w-1.5 rounded-full bg-[var(--tone-vocab-accent,#6a8d73)]/55" />
                )}
            </div>

            <ActivityShell
                activity={activity}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                currentLabel={currentLabel}
                assignment={assignment}
            >
                <span className="shrink-0 text-base leading-none" aria-hidden>
                    {icon}
                </span>
                <span className="min-w-0 flex-1">
                    <span className={`block leading-snug ${isCompleted ? "line-through" : ""}`}>
                        {activity.title}
                    </span>
                    {activity.wrappedGame && !isInactive && (
                        <span className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-wide ${
                            isCompleted ? "text-text-muted" : "text-[var(--tone-vocab-accent,#6a8d73)]"
                        }`}>
                            Preset practice
                        </span>
                    )}
                </span>
            </ActivityShell>
        </div>
    );
}

function GuidedCoursePath({
    guidedUnits,
    guidedAssignments,
    guidedProgress,
    desktopLayout = false,
}: {
    guidedUnits: CourseMapUnit[];
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: Record<string, string | null>;
    desktopLayout?: boolean;
}) {
    const requiredActivities = useMemo(() => flattenRequired(guidedUnits), [guidedUnits]);
    const completedRequired = requiredActivities.filter((activity) =>
        isActivityCompleted(activity, guidedProgress)
    ).length;
    const firstIncomplete = requiredActivities.find((activity) =>
        isActionable(activity) && !isActivityCompleted(activity, guidedProgress)
    );
    const currentLevelNumber = guidedUnits
        .flatMap((unit) => unit.levels)
        .find((level) =>
            level.requiredActivities.some((activity) => activity.id === firstIncomplete?.id)
        )?.levelNumber;
    const hasAnyCompleted = completedRequired > 0;
    const currentLabel = hasAnyCompleted ? "Next up" : "Start here";
    const currentId = firstIncomplete?.id ?? null;

    const [collapsed, setCollapsed] = useState<Record<number, boolean>>(() => {
        const currentUnitNumber = guidedUnits.find((unit) =>
            unit.levels.some((level) =>
                level.requiredActivities.some((activity) => activity.id === currentId)
            )
        )?.unitNumber;

        return Object.fromEntries(
            guidedUnits.map((unit) => [unit.unitNumber, currentUnitNumber ? unit.unitNumber !== currentUnitNumber : false])
        );
    });

    const toggle = (unitNumber: number) =>
        setCollapsed((prev) => ({ ...prev, [unitNumber]: !prev[unitNumber] }));

    return (
        <div className={desktopLayout ? "space-y-0" : "dashboard-panel rounded-2xl p-4 sm:p-5"}>
            {!desktopLayout && (
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-text">Your Course Path</h3>
                        <p className="mt-0.5 text-xs text-text-muted">
                            Week by week. Do the required work first, then choose extra practice.
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-medium text-text-muted">
                        Level {currentLevelNumber ?? 36}
                    </span>
                </div>
            )}

            <div className={desktopLayout ? "space-y-6" : "space-y-4"}>
                {guidedUnits.map((unit) => {
                    const unitRequired = unit.levels.flatMap((level) => level.requiredActivities);
                    const unitDone = unitRequired.filter((activity) =>
                        isActivityCompleted(activity, guidedProgress)
                    ).length;
                    const isUnitDone = unitDone === unitRequired.length && unitRequired.length > 0;
                    const hasCurrent = unitRequired.some((activity) => activity.id === currentId);
                    const isOpen = !collapsed[unit.unitNumber];

                    return (
                        <section key={unit.unitNumber} id={`unit-${unit.unitNumber}`} className={desktopLayout ? "dashboard-panel rounded-2xl overflow-hidden" : ""}>
                            <button
                                onClick={() => toggle(unit.unitNumber)}
                                className={`w-full flex items-center gap-2 text-left group ${desktopLayout ? "px-5 py-4 hover:bg-surface-subtle/50 transition-colors" : ""}`}
                                aria-expanded={isOpen}
                            >
                                <span
                                    className={`flex shrink-0 items-center justify-center rounded-full border font-bold transition-colors ${
                                        desktopLayout ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]"
                                    } ${
                                        isUnitDone
                                            ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)] text-[var(--tone-grammar-accent,#b05740)]"
                                            : hasCurrent
                                              ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)] text-[var(--tone-vocab-accent,#6a8d73)]"
                                              : "border-[var(--border-subtle,#ddd6ca)] bg-[var(--surface-subtle,#f8f4ef)] text-text-muted"
                                    }`}
                                >
                                    {isUnitDone ? <Check size={desktopLayout ? 13 : 11} /> : unit.unitNumber}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className={`block font-semibold tracking-wide uppercase text-text ${desktopLayout ? "text-sm" : "text-xs"}`}>
                                        Unit {unit.unitNumber}: {unit.unitTitle}
                                    </span>
                                    <span className={`block text-text-muted ${desktopLayout ? "text-xs" : "text-[11px]"}`}>{unit.month}</span>
                                </span>
                                {desktopLayout && (
                                    <span className="text-xs text-text-muted tabular-nums shrink-0 mr-1">
                                        {unitDone}/{unitRequired.length}
                                    </span>
                                )}
                                {isOpen ? (
                                    <ChevronDown size={desktopLayout ? 16 : 14} className="text-text-muted shrink-0" />
                                ) : (
                                    <ChevronRight size={desktopLayout ? 16 : 14} className="text-text-muted shrink-0" />
                                )}
                            </button>

                            {isOpen && (
                                <div className={desktopLayout
                                    ? "border-t border-[var(--border-subtle)] px-5 pb-5 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
                                    : "mt-3 space-y-4 pl-2"
                                }>
                                    {unit.levels.map((level) => {
                                        const levelRequiredDone = level.requiredActivities.filter((activity) =>
                                            isActivityCompleted(activity, guidedProgress)
                                        ).length;
                                        const levelHasCurrent = level.requiredActivities.some((activity) => activity.id === currentId);
                                        const isLevelDone =
                                            level.requiredActivities.length > 0 &&
                                            levelRequiredDone === level.requiredActivities.length;

                                        return (
                                            <div
                                                key={level.levelNumber}
                                                className={`rounded-xl border ${desktopLayout ? "p-4" : "p-3.5"} transition-all duration-300 relative overflow-hidden ${
                                                    isLevelDone
                                                        ? "bg-gradient-to-r from-[rgba(176,87,64,0.06)] to-[rgba(232,160,144,0.03)] dark:from-[rgba(176,87,64,0.12)] dark:to-[rgba(232,160,144,0.05)] border-[var(--tone-grammar-accent,#b05740)]/40 hover:border-[var(--tone-grammar-accent,#b05740)]/60 shadow-sm"
                                                        : levelHasCurrent
                                                          ? "bg-[var(--tone-vocab-surface,rgba(106,141,115,0.05))] border-[var(--tone-vocab-accent,#6a8d73)]/60 hover:border-[var(--tone-vocab-accent,#6a8d73)] shadow-md ring-2 ring-[var(--tone-vocab-accent,#6a8d73)]/15"
                                                          : "bg-bg/50 border-[var(--border-subtle,#ddd6ca)] hover:bg-surface-subtle/40"
                                                }`}
                                            >
                                                {isLevelDone && (
                                                    <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden pointer-events-none">
                                                        <div className="absolute top-[-8px] right-[-24px] rotate-45 bg-[var(--tone-grammar-accent,#b05740)]/10 dark:bg-[var(--tone-grammar-accent,#b05740)]/20 py-1 text-center w-20 text-[9px] font-bold text-[var(--tone-grammar-accent,#b05740)]">
                                                            🏆
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mb-2.5 relative z-10">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
                                                                Week {level.levelNumber} / Level {level.levelNumber}
                                                            </p>
                                                            <h4 className="text-sm font-bold text-text mt-0.5">{level.levelTitle}</h4>
                                                        </div>
                                                        <span
                                                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold border transition-all duration-300 ${
                                                                isLevelDone
                                                                    ? "bg-[var(--tone-grammar-chip-bg,#f5ede8)] text-[var(--tone-grammar-accent,#b05740)] border-[var(--tone-grammar-accent,#b05740)]/20 shadow-sm scale-105 animate-[badge-pop_0.35s_ease-out]"
                                                                    : levelHasCurrent
                                                                      ? "bg-[var(--tone-vocab-chip-bg,#eef3ee)] text-[var(--tone-vocab-accent,#6a8d73)] border-[var(--tone-vocab-accent,#6a8d73)]/20 animate-pulse"
                                                                      : "text-text-muted bg-surface-subtle/50 border-transparent"
                                                            }`}
                                                        >
                                                            {isLevelDone ? "🏆 Level complete" : `${levelRequiredDone}/${level.requiredActivities.length}`}
                                                        </span>
                                                    </div>
                                                    {level.levelGoal && (
                                                        <p className="mt-1 text-xs leading-snug text-text-muted">
                                                            Goal: {level.levelGoal}
                                                        </p>
                                                    )}
                                                </div>

                                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                                                    Required
                                                </p>
                                                <div className="relative pl-5">
                                                    <div
                                                        className="absolute left-[9px] top-1 bottom-1 w-px rounded-full"
                                                        style={{ background: "var(--border-subtle, #ddd6ca)" }}
                                                    />
                                                    <div className="space-y-1.5">
                                                        {level.requiredActivities.map((activity) => (
                                                            <GuidedActivityRow
                                                                key={activity.id}
                                                                activity={activity}
                                                                assignment={activity.activityId ? guidedAssignments[activity.activityId] : undefined}
                                                                isCompleted={isActivityCompleted(activity, guidedProgress)}
                                                                isCurrent={activity.id === currentId}
                                                                currentLabel={currentLabel}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {level.extraPractice && level.extraPractice.length > 0 && (
                                                    <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                                                            Extra Practice
                                                        </p>
                                                        <div className="relative pl-5">
                                                            <div
                                                                className="absolute left-[9px] top-1 bottom-1 w-px rounded-full"
                                                                style={{ background: "var(--border-subtle, #ddd6ca)" }}
                                                            />
                                                            <div className="space-y-1.5">
                                                                {level.extraPractice.map((activity) => (
                                                                    <GuidedActivityRow
                                                                        key={activity.id}
                                                                        activity={activity}
                                                                        assignment={activity.activityId ? guidedAssignments[activity.activityId] : undefined}
                                                                        isCompleted={isActivityCompleted(activity, guidedProgress)}
                                                                        isCurrent={false}
                                                                        currentLabel={currentLabel}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
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
}: Props) {
    if (guidedUnits.length > 0) {
        return (
            <GuidedCoursePath
                guidedUnits={guidedUnits}
                guidedAssignments={guidedAssignments}
                guidedProgress={guidedProgress}
                desktopLayout={desktopLayout}
            />
        );
    }

    return <LegacyCoursePath assignments={assignments} />;
}
