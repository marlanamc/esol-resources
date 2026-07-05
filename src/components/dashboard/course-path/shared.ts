"use client";

import { createContext, useContext } from "react";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";
import { withReturnTo } from "@/lib/learner/navigation";
import type { TimelineItem, TimelineStatus } from "@/components/dashboard/ActivityTimeline";
import type { CourseMapActivity, CourseMapActivityType, CourseMapUnit } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import {
    formatNextUpActivityTitle,
    getCourseMapEstimatedMinutesForActivity,
} from "@/lib/course-map-hero";
import {
    buildMapActivityHref,
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-navigation";

export const MAP_SCROLL_MARGIN = "scroll-mt-[5.5rem]";

export const CoursePathReturnHrefContext = createContext<string | null>(null);

export function useCoursePathReturnHref(): string {
    const contextHref = useContext(CoursePathReturnHrefContext);
    const currentHref = useCurrentAppHref();
    return contextHref ?? currentHref;
}

export interface PathActivity {
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

export interface GuidedAssignmentInfo {
    assignmentId: string;
    title: string | null;
    activityTitle: string;
    type?: string;
    category?: string | null;
}

export function formatLevelLabel(levelNumber: number): string {
    return `Level ${levelNumber}`;
}

export function formatUnitProgressLabel(done: number, total: number, showUnitMonths: boolean): string {
    const noun = showUnitMonths
        ? (total === 1 ? "week" : "weeks")
        : (total === 1 ? "level" : "levels");
    return `${done}/${total} ${noun}`;
}

export function activityTypeIcon(type?: string, category?: string | null): string {
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

export function guidedActivityIcon(type: CourseMapActivityType, vocabUi?: string): string {
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

export function shortActivityTitle(title: string): string {
    return formatNextUpActivityTitle(title);
}

export function nextUpTitle(title: string): string {
    return formatNextUpActivityTitle(title);
}

export const focusOverrides: Record<string, string> = {
    "Parts of Speech + App Habit": "Build English sentence basics",
    "Verb Forms + Past -ed Sounds": "Use verb forms in context",
    "Tenses in Action": "Talk about now, past, and future",
};

export function focusText(title: string, goal?: string): string | null {
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

export function estimatedMinutes(activity: CourseMapActivity): number {
    return getCourseMapEstimatedMinutesForActivity(activity);
}

export function buildWeekTimelineItems(
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

export interface UnitGroup {
    label: string;
    activities: PathActivity[];
}

export function flattenRequired(units: CourseMapUnit[]): CourseMapActivity[] {
    return units.flatMap((unit) =>
        unit.levels.flatMap((level) => level.requiredActivities)
    );
}

export function getExtraPracticeActivities(
    extraPractice: CourseMapActivity[] | undefined
): CourseMapActivity[] {
    return extraPractice ?? [];
}
export interface WeekSummary {
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    level: CourseMapUnit["levels"][number];
    requiredDone: number;
    requiredTotal: number;
    hasCurrent: boolean;
    isDone: boolean;
}

export interface UnitSummary {
    unitNumber: number;
    unitTitle: string;
    unitMonth: string;
    weeks: WeekSummary[];
    doneWeeks: number;
    totalWeeks: number;
    hasCurrent: boolean;
    status: "done" | "current" | "todo";
}

