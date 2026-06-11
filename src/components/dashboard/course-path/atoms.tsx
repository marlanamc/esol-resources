"use client";

import Link from "next/link";

import { ActivityLink } from "@/components/navigation/ActivityLink";
import { withReturnTo } from "@/lib/learner-navigation";
import type { CourseMapActivity } from "@/lib/course-map";

import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";
import { type GuidedAssignmentInfo, useCoursePathReturnHref } from "./shared";

export function ActivityShell({
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

export function StartActivityButton({
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

export function UnitBadge({ n, status, size = 44 }: { n: number; status: "done" | "current" | "todo"; size?: number }) {
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

export function UnitStatusChip({ status }: { status: "done" | "current" | "todo" }) {
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

