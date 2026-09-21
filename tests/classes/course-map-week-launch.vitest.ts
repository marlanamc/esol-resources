import { describe, expect, it } from "vitest";
import {
    findFirstActionableInWeek,
    findFirstIncompleteInWeek,
    getMapWeekMeta,
    resolveWeekActivityLaunch,
} from "@/lib/course-map-navigation";
import type { CourseMapUnit } from "@/lib/course-map";

function activity(id: string, activityId: string, title: string) {
    return {
        id,
        title,
        activityType: "guide" as const,
        status: "available" as const,
        activityId,
    };
}

const units: CourseMapUnit[] = [
    {
        unitNumber: 1,
        unitTitle: "Parts of Speech",
        month: "September",
        levels: [
            {
                levelNumber: 1,
                levelTitle: "Welcome Back",
                requiredActivities: [
                    activity("w1a", "act-w1a", "Week 1 Guide"),
                    activity("w1b", "act-w1b", "Week 1 Quiz"),
                ],
            },
            {
                levelNumber: 2,
                levelTitle: "Parts of Speech",
                requiredActivities: [
                    activity("w2a", "act-w2a", "Week 2 Guide"),
                    activity("w2b", "act-w2b", "Week 2 Game"),
                ],
            },
        ],
    },
];

const nothingDone = {};
const week2Done = {
    "act-w2a": { status: "completed", categoryData: null },
    "act-w2b": { status: "completed", categoryData: null },
};

describe("findFirstIncompleteInWeek", () => {
    it("never returns an activity from a different week", () => {
        // Week 1 is untouched, but asking about week 2 must stay in week 2.
        const match = findFirstIncompleteInWeek(units, nothingDone, 2);
        expect(match?.weekNumber).toBe(2);
        expect(match?.activity.id).toBe("w2a");
    });

    it("returns null when the week is complete", () => {
        expect(findFirstIncompleteInWeek(units, week2Done, 2)).toBeNull();
    });

    it("returns null for a week that is not visible", () => {
        expect(findFirstIncompleteInWeek(units, nothingDone, 9)).toBeNull();
    });
});

describe("findFirstActionableInWeek", () => {
    it("returns the week's first activity regardless of completion", () => {
        expect(findFirstActionableInWeek(units, 2)?.activity.id).toBe("w2a");
    });
});

describe("resolveWeekActivityLaunch", () => {
    it("targets the viewed week even when an earlier week is unfinished", () => {
        const launch = resolveWeekActivityLaunch(units, nothingDone, 2);
        expect(launch?.weekNumber).toBe(2);
        expect(launch?.title).toBe("Week 2 Guide");
        expect(launch?.isReview).toBe(false);
        // The return link must point back at the same week it launched from.
        expect(launch?.href).toContain("week%3D2");
    });

    it("keeps a Week 1 button inside Week 1 when browsing back", () => {
        const launch = resolveWeekActivityLaunch(units, nothingDone, 1);
        expect(launch?.weekNumber).toBe(1);
        expect(launch?.title).toBe("Week 1 Guide");
    });

    it("offers review of the same week once it is finished", () => {
        const launch = resolveWeekActivityLaunch(units, week2Done, 2);
        expect(launch?.weekNumber).toBe(2);
        expect(launch?.isReview).toBe(true);
        expect(launch?.title).toBe("Week 2 Guide");
    });

    it("returns null for a week with nothing launchable", () => {
        expect(resolveWeekActivityLaunch(units, nothingDone, 9)).toBeNull();
    });
});

describe("getMapWeekMeta", () => {
    it("resolves unit metadata for a week number", () => {
        expect(getMapWeekMeta(units, 2)).toEqual({
            weekNumber: 2,
            unitNumber: 1,
            unitMonth: "September",
            unitTitle: "Parts of Speech",
        });
    });

    it("returns null for an unknown week", () => {
        expect(getMapWeekMeta(units, 12)).toBeNull();
    });
});
