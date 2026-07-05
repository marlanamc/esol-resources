"use client";

import Link from "next/link";
import { useState } from "react";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";
import { withReturnTo } from "@/lib/learner/navigation";
import type { CourseMapActivity, CourseMapActivityType, CourseMapUnit } from "@/lib/course-map";
import { isMapActivityCompleted, type CourseMapProgressState } from "@/lib/course-map-progress";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuidedAssignmentInfo {
    assignmentId: string;
    title: string | null;
    activityTitle: string;
    type?: string;
    category?: string | null;
}

interface Props {
    guidedUnits: CourseMapUnit[];
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
}

// ─── Per-unit accent palette (cycles through brand tones) ─────────────────────

const UNIT_ACCENTS = [
    // Sept: warm terracotta
    { bg: "rgba(176,87,64,0.07)", border: "rgba(176,87,64,0.3)", accent: "#b05740", chipBg: "rgba(176,87,64,0.12)", chipText: "#8e4432", stampBg: "rgba(176,87,64,0.15)" },
    // Oct: vocabulary teal
    { bg: "rgba(38,138,130,0.06)", border: "rgba(38,138,130,0.28)", accent: "#268a82", chipBg: "rgba(38,138,130,0.12)", chipText: "#1a6560", stampBg: "rgba(38,138,130,0.14)" },
    // Nov: grammar green
    { bg: "rgba(61,142,66,0.06)", border: "rgba(61,142,66,0.28)", accent: "#3d8e42", chipBg: "rgba(61,142,66,0.12)", chipText: "#2d6930", stampBg: "rgba(61,142,66,0.14)" },
    // Dec: speaking amber
    { bg: "rgba(181,110,26,0.06)", border: "rgba(181,110,26,0.26)", accent: "#b56e1a", chipBg: "rgba(181,110,26,0.12)", chipText: "#7a5020", stampBg: "rgba(181,110,26,0.14)" },
    // Jan: games purple
    { bg: "rgba(125,63,166,0.06)", border: "rgba(125,63,166,0.24)", accent: "#7d3fa6", chipBg: "rgba(125,63,166,0.10)", chipText: "#5c2d7a", stampBg: "rgba(125,63,166,0.13)" },
    // Feb: pronunciation pink
    { bg: "rgba(219,39,119,0.05)", border: "rgba(219,39,119,0.22)", accent: "#db2777", chipBg: "rgba(219,39,119,0.10)", chipText: "#9d174d", stampBg: "rgba(219,39,119,0.12)" },
    // Mar: vocabulary teal (repeat)
    { bg: "rgba(74,140,154,0.06)", border: "rgba(74,140,154,0.28)", accent: "#268a82", chipBg: "rgba(74,140,154,0.12)", chipText: "#1a6560", stampBg: "rgba(74,140,154,0.14)" },
    // Apr: quizzes orange
    { bg: "rgba(196,74,40,0.06)", border: "rgba(196,74,40,0.26)", accent: "#c44a28", chipBg: "rgba(196,74,40,0.12)", chipText: "#923a25", stampBg: "rgba(196,74,40,0.14)" },
    // May: grammar green
    { bg: "rgba(61,142,66,0.06)", border: "rgba(61,142,66,0.28)", accent: "#3d8e42", chipBg: "rgba(61,142,66,0.12)", chipText: "#2d6930", stampBg: "rgba(61,142,66,0.14)" },
    // Jun: terracotta gold
    { bg: "rgba(233,196,106,0.12)", border: "rgba(233,196,106,0.45)", accent: "#c9a22e", chipBg: "rgba(233,196,106,0.22)", chipText: "#8a6e1a", stampBg: "rgba(233,196,106,0.25)" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    if (t === "pronunciation") return "🔊";
    if (t === "catch-up") return "🧭";
    if (t === "assessment") return "✅";
    return "📌";
}

function guidedActivityIcon(type: CourseMapActivityType, vocabUi?: string): string {
    if (vocabUi) return "🔤";
    switch (type) {
        case "guide": return "📖";
        case "game": return "🎮";
        case "quiz": return "✏️";
        case "pronunciation": return "🔊";
        case "writing": return "✍️";
        case "speaking": return "🎤";
        case "review": return "🔁";
        case "catch-up": return "🧭";
        case "assessment": return "✅";
        default: return "📌";
    }
}

function isCompleted(activity: CourseMapActivity, progress: CourseMapProgressState): boolean {
    return isMapActivityCompleted(activity, progress);
}

function isActionable(activity: CourseMapActivity): boolean {
    return activity.status !== "planned" && activity.status !== "locked" && Boolean(activity.activityId || activity.href);
}

// ─── Activity row inside a level card ─────────────────────────────────────────

function ActivityRow({
    activity,
    assignment,
    done,
    isCurrent,
    currentLabel,
    accent,
}: {
    activity: CourseMapActivity;
    assignment?: GuidedAssignmentInfo;
    done: boolean;
    isCurrent: boolean;
    currentLabel: "Start here" | "Next up";
    accent: typeof UNIT_ACCENTS[number];
}) {
    const isPlanned = activity.status === "planned";
    const isLocked = activity.status === "locked";
    const inactive = isPlanned || isLocked;
    const currentHref = useCurrentAppHref();

    const icon = assignment
        ? activityTypeIcon(assignment.type, assignment.category)
        : guidedActivityIcon(activity.activityType, activity.vocabUi);

    const rowBase =
        "flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors";

    const rowClass = `${rowBase} ${
        done
            ? "text-text-muted opacity-60"
            : isCurrent
            ? "font-semibold text-text"
            : inactive
            ? "text-text-muted opacity-50 cursor-default"
            : "text-text-muted hover:text-text hover:bg-black/[0.03]"
    }`;

    const inner = (
        <>
            <span className="shrink-0 mt-0.5 text-sm leading-none" aria-hidden>{icon}</span>
            <span className={`flex-1 leading-snug min-w-0 ${done ? "line-through" : ""}`}>
                {activity.title}
                {activity.wrappedGame && !inactive && (
                    <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wide opacity-60">preset</span>
                )}
            </span>
            {isCurrent && (
                <span
                    className="shrink-0 self-center rounded-full px-2 py-0.5 text-[9px] font-bold leading-none"
                    style={{ background: accent.chipBg, color: accent.chipText }}
                >
                    {currentLabel}
                </span>
            )}
            {isPlanned && (
                <span className="shrink-0 self-center text-[9px] font-semibold text-text-muted opacity-60 leading-none">soon</span>
            )}
        </>
    );

    if (!inactive && activity.activityId) {
        return (
            <ActivityLink
                activityId={activity.activityId}
                assignmentId={assignment?.assignmentId}
                href={activity.href}
                vocabUi={activity.vocabUi}
                className={rowClass}
            >
                {inner}
            </ActivityLink>
        );
    }
    if (!inactive && activity.href) {
        return (
            <Link href={withReturnTo(activity.href, currentHref)} className={rowClass}>
                {inner}
            </Link>
        );
    }
    return <div className={rowClass} aria-disabled="true">{inner}</div>;
}

// ─── Level card inside an expanded unit ───────────────────────────────────────

function LevelCard({
    level,
    assignments,
    progress,
    currentId,
    currentLabel,
    accent,
}: {
    level: CourseMapUnit["levels"][number];
    assignments: Record<string, GuidedAssignmentInfo>;
    progress: CourseMapProgressState;
    currentId: string | null;
    currentLabel: "Start here" | "Next up";
    accent: typeof UNIT_ACCENTS[number];
}) {
    const requiredDone = level.requiredActivities.filter((a) => isCompleted(a, progress)).length;
    const totalRequired = level.requiredActivities.length;
    const levelDone = requiredDone === totalRequired && totalRequired > 0;
    const hasCurrent = level.requiredActivities.some((a) => a.id === currentId);

    return (
        <div
            className="flex-shrink-0 w-[220px] rounded-xl border flex flex-col overflow-hidden transition-all duration-200"
            style={{
                background: levelDone
                    ? accent.stampBg
                    : hasCurrent
                    ? `linear-gradient(160deg, ${accent.bg} 0%, var(--dashboard-surface-start) 100%)`
                    : "var(--dashboard-surface-start)",
                borderColor: levelDone
                    ? accent.border
                    : hasCurrent
                    ? accent.border
                    : "var(--border-subtle)",
                boxShadow: hasCurrent
                    ? `0 0 0 2px ${accent.border}, 0 2px 8px rgba(0,0,0,0.06)`
                    : "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            {/* Card header */}
            <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                        Lv {level.levelNumber}
                    </span>
                    <span
                        className="text-[10px] font-bold tabular-nums"
                        style={{ color: levelDone ? accent.accent : "var(--text-muted)" }}
                    >
                        {levelDone ? "✓ done" : `${requiredDone}/${totalRequired}`}
                    </span>
                </div>
                <p className="text-xs font-bold text-text mt-0.5 leading-snug">{level.levelTitle}</p>
                {level.levelGoal && (
                    <p className="text-[10px] text-text-muted mt-1 leading-snug opacity-80">{level.levelGoal}</p>
                )}
            </div>

            {/* Required activities */}
            <div className="flex-1 px-1 py-1.5 space-y-0.5">
                {level.requiredActivities.map((activity) => (
                    <ActivityRow
                        key={activity.id}
                        activity={activity}
                        assignment={activity.activityId ? assignments[activity.activityId] : undefined}
                        done={isCompleted(activity, progress)}
                        isCurrent={activity.id === currentId}
                        currentLabel={currentLabel}
                        accent={accent}
                    />
                ))}
            </div>

            {/* Extra practice */}
            {level.extraPractice && level.extraPractice.length > 0 && (
                <div
                    className="border-t px-1 py-1.5 space-y-0.5"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <p className="px-2 text-[9px] font-bold uppercase tracking-widest text-text-muted opacity-60 mb-1">
                        Extra
                    </p>
                    {level.extraPractice.map((activity) => (
                        <ActivityRow
                            key={activity.id}
                            activity={activity}
                            assignment={activity.activityId ? assignments[activity.activityId] : undefined}
                            done={isCompleted(activity, progress)}
                            isCurrent={false}
                            currentLabel={currentLabel}
                            accent={accent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Single chapter strip ──────────────────────────────────────────────────────

function ChapterStrip({
    unit,
    assignments,
    progress,
    currentId,
    currentLabel,
    state,
    defaultOpen,
}: {
    unit: CourseMapUnit;
    assignments: Record<string, GuidedAssignmentInfo>;
    progress: CourseMapProgressState;
    currentId: string | null;
    currentLabel: "Start here" | "Next up";
    state: "done" | "current" | "future";
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const accent = UNIT_ACCENTS[(unit.unitNumber - 1) % UNIT_ACCENTS.length];

    const allRequired = unit.levels.flatMap((l) => l.requiredActivities);
    const doneCount = allRequired.filter((a) => isCompleted(a, progress)).length;
    const totalCount = allRequired.length;

    // Dot pips for collapsed view — one dot per level
    const levelDots = unit.levels.map((l) => {
        const lvlDone = l.requiredActivities.length > 0 &&
            l.requiredActivities.every((a) => isCompleted(a, progress));
        const lvlCurrent = l.requiredActivities.some((a) => a.id === currentId);
        return { lvlDone, lvlCurrent };
    });

    const isDone = state === "done";
    const isFuture = state === "future";

    return (
        <div
            className="group rounded-2xl border overflow-hidden transition-all duration-300"
            style={{
                borderColor: isDone
                    ? accent.border
                    : isFuture
                    ? "var(--border-subtle)"
                    : accent.border,
                background: isDone
                    ? `linear-gradient(to right, ${accent.stampBg}, var(--dashboard-surface-start))`
                    : isFuture
                    ? "var(--surface-subtle)"
                    : `linear-gradient(135deg, ${accent.bg} 0%, var(--dashboard-surface-start) 60%)`,
                opacity: isFuture ? 0.7 : 1,
            }}
        >
            {/* ── Strip header ── */}
            <button
                onClick={() => !isFuture && setOpen((v) => !v)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${
                    isFuture
                        ? "cursor-default"
                        : "cursor-pointer hover:bg-black/[0.025]"
                }`}
                aria-expanded={open}
                disabled={isFuture}
            >
                {/* Unit number badge */}
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors"
                    style={{
                        background: isDone ? accent.chipBg : isFuture ? "var(--surface-subtle)" : accent.chipBg,
                        borderColor: isDone || !isFuture ? accent.border : "var(--border-subtle)",
                        color: isDone || !isFuture ? accent.accent : "var(--text-muted)",
                    }}
                >
                    {isDone ? "✓" : isFuture ? "🔒" : unit.unitNumber}
                </span>

                {/* Title + month */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span
                            className={`text-sm font-bold leading-tight ${isFuture ? "text-text-muted" : "text-text"}`}
                        >
                            Unit {unit.unitNumber} — {unit.unitTitle}
                        </span>
                        <span
                            className="text-[10px] font-bold uppercase tracking-widest leading-none"
                            style={{ color: isFuture ? "var(--text-muted)" : accent.accent }}
                        >
                            {unit.month}
                        </span>
                    </div>

                    {/* Collapsed state: dot pips + count */}
                    {!open && (
                        <div className="mt-1.5 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {levelDots.map((dot, i) => (
                                    <span
                                        key={i}
                                        className="inline-block rounded-full transition-colors"
                                        style={{
                                            width: 7,
                                            height: 7,
                                            background: dot.lvlDone
                                                ? accent.accent
                                                : dot.lvlCurrent
                                                ? accent.border
                                                : "var(--border-subtle)",
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-text-muted tabular-nums">
                                {doneCount}/{totalCount} activities
                            </span>
                        </div>
                    )}
                </div>

                {/* Done stamp */}
                {isDone && (
                    <span
                        className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border rotate-[-3deg] leading-none"
                        style={{
                            color: accent.accent,
                            borderColor: accent.border,
                            background: accent.chipBg,
                        }}
                    >
                        Complete
                    </span>
                )}

                {/* Expand/collapse chevron */}
                {!isFuture && (
                    <svg
                        className="shrink-0 text-text-muted transition-transform duration-300"
                        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {/* ── Expanded content: horizontal level card row ── */}
            {open && !isFuture && (
                <div
                    className="border-t px-5 pb-5 pt-4 overflow-x-auto overscroll-x-contain"
                    style={{ borderColor: accent.border }}
                >
                    <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                        {unit.levels.map((level) => (
                            <LevelCard
                                key={level.levelNumber}
                                level={level}
                                assignments={assignments}
                                progress={progress}
                                currentId={currentId}
                                currentLabel={currentLabel}
                                accent={accent}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ChapterStripCoursePath({ guidedUnits, guidedAssignments, guidedProgress }: Props) {
    const allRequired = guidedUnits.flatMap((u) => u.levels.flatMap((l) => l.requiredActivities));

    // Find first incomplete actionable activity
    const firstIncomplete = allRequired.find(
        (a) => isActionable(a) && !isCompleted(a, guidedProgress)
    );
    const currentId = firstIncomplete?.id ?? null;
    const hasAnyCompleted = allRequired.some((a) => isCompleted(a, guidedProgress));
    const currentLabel = hasAnyCompleted ? "Next up" : "Start here";

    // Determine which unit is "current"
    const currentUnitNumber = guidedUnits.find((u) =>
        u.levels.some((l) => l.requiredActivities.some((a) => a.id === currentId))
    )?.unitNumber;

    return (
        <div className="space-y-2.5">
            {guidedUnits.map((unit) => {
                const unitRequired = unit.levels.flatMap((l) => l.requiredActivities);
                const unitDone = unitRequired.every((a) => isCompleted(a, guidedProgress)) && unitRequired.length > 0;
                const unitIsCurrent = unit.unitNumber === currentUnitNumber;
                const unitIsFuture = !unitDone && !unitIsCurrent && (currentUnitNumber ? unit.unitNumber > currentUnitNumber : true);

                const state: "done" | "current" | "future" = unitDone
                    ? "done"
                    : unitIsFuture
                    ? "future"
                    : "current";

                return (
                    <ChapterStrip
                        key={unit.unitNumber}
                        unit={unit}
                        assignments={guidedAssignments}
                        progress={guidedProgress}
                        currentId={currentId}
                        currentLabel={currentLabel}
                        state={state}
                        defaultOpen={unitIsCurrent}
                    />
                );
            })}
        </div>
    );
}
