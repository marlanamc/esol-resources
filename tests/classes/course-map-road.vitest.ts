import { describe, expect, it } from "vitest";
import type { CourseMapOutlineUnit, CourseMapUnit } from "@/lib/course-map";
import {
    buildCourseMapRoad,
    cycleForUnit,
    formatRoadCtaTitle,
    formatRoadRowLabels,
    formatRoadWeekDates,
    type RoadScheduleWeek,
} from "@/lib/course-map-road";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";

const outline: CourseMapOutlineUnit[] = [
    { unitNumber: 1, unitTitle: "Getting to Know You", month: "September", weeks: [
        { weekNumber: 1, title: "Start the Class" },
        { weekNumber: 2, title: "Parts of Speech" },
        { weekNumber: 3, title: "Parts of Speech Review" },
    ] },
    { unitNumber: 2, unitTitle: "Daily Life in the Community", month: "October", weeks: [
        { weekNumber: 4, title: "Foundations" },
        { weekNumber: 5, title: "Digital Habits" },
        { weekNumber: 6, title: "Getting Around" },
    ] },
    { unitNumber: 3, unitTitle: "Community Participation", month: "November", weeks: [
        { weekNumber: 8, title: "Phone English" },
    ] },
    { unitNumber: 6, unitTitle: "Workforce Preparation", month: "February", weeks: [
        { weekNumber: 20, title: "Resume" },
    ] },
];

function level(n: number, ids: string[]): CourseMapUnit["levels"][number] {
    return {
        levelNumber: n,
        levelTitle: `Week ${n}`,
        requiredActivities: ids.map((id) => ({
            id,
            activityId: id,
            title: id === "w4-flash" ? "Say It & Spell It: Flash Cards" : id,
            activityType: "game" as const,
            status: "available" as const,
        })),
    };
}

// Weeks 1–5 are open; week 5 is the early-access week after the class week (4).
const units: CourseMapUnit[] = [
    { unitNumber: 1, unitTitle: "Getting to Know You", month: "September", levels: [
        level(1, ["w1-a"]), level(2, ["w2-a", "w2-b"]), level(3, ["w3-a"]),
    ] },
    { unitNumber: 2, unitTitle: "Daily Life in the Community", month: "October", levels: [
        level(4, ["w4-guide", "w4-flash"]), level(5, ["w5-a"]),
    ] },
];

const progress = {
    "w1-a": { status: "completed", categoryData: null },
    "w2-a": { status: "completed", categoryData: null },
    "w3-a": { status: "completed", categoryData: null },
    "w4-guide": { status: "completed", categoryData: null },
};

const schedule = new Map<number, RoadScheduleWeek>(
    buildTeachingWeeks().map((week) => [
        week.index,
        { weekNumber: week.index, weekStart: week.weekStart, firstClassDate: week.classDates[0] ?? null },
    ])
);

const road = buildCourseMapRoad({ outline, units, progress, currentWeek: 4, schedule });
const week = (n: number) => road.weeks.find((w) => w.weekNumber === n)!;

describe("course map road", () => {
    it("assigns cycles by month, falling back to unit number", () => {
        expect(cycleForUnit({ unitNumber: 5, month: "January" })).toBe(1);
        expect(cycleForUnit({ unitNumber: 6, month: "February" })).toBe(2);
        expect(cycleForUnit({ unitNumber: 7, month: "" })).toBe(2);
    });

    it("keeps Cycle 2 off the road until the class reaches it", () => {
        expect(road.cycles.map((c) => c.number)).toEqual([1]);
        expect(road.weeks.some((w) => w.weekNumber === 20)).toBe(false);

        const later = buildCourseMapRoad({ outline, units, progress, currentWeek: 20 });
        expect(later.cycles.map((c) => [c.number, c.isPast, c.isCurrent])).toEqual([[1, true, false], [2, false, true]]);
        expect(later.cycles[0].summary).toBe("2 of 7 weeks done");
    });

    it("derives week states from the class week and visibility", () => {
        expect(week(1).state).toBe("done");
        expect(week(2).state).toBe("past");
        expect(week(2).done).toBe(1);
        expect(week(4).state).toBe("current");
        expect(week(5).state).toBe("upcoming");
        expect(week(6).state).toBe("locked");
        expect(week(8).state).toBe("locked");
    });

    it("dates weeks Monday–Friday and notes early-access weeks", () => {
        expect(week(1).dates).toBe("Sep 14–18");
        expect(formatRoadWeekDates("2026-09-28")).toBe("Sep 28 – Oct 2");
        expect(week(6).note).toBeNull();
        expect(week(5).note).toBe("Open now · class starts Tuesday");
    });

    it("folds past units with a summary and neutralises locked future units", () => {
        const [unit1, unit2, unit3] = road.cycles[0].units;
        expect(unit1.isPast).toBe(true);
        expect(unit1.summary).toBe("Weeks 1–3 · 2 of 3 weeks done");
        expect(unit2.isPast || unit2.isLocked).toBe(false);
        expect(unit3.isLocked).toBe(true);
        expect(unit3.summary).toBe("1 week");
    });

    it("marks the week's next activity and links back to that week", () => {
        const current = week(4);
        expect(current.next?.id).toBe("w4-flash");
        expect(current.activities.filter((a) => a.isNext)).toHaveLength(1);
        expect(current.next?.href).toContain(encodeURIComponent("/dashboard/map?week=4"));
        expect(formatRoadCtaTitle(current.next!.title)).toBe("Flash Cards");
    });
});

describe("formatRoadRowLabels", () => {
    it("leads vocab rounds with the round and names the week's words", () => {
        expect(formatRoadRowLabels({ title: "Learning English: Flash Cards", vocabUi: "flashcards", weekNumber: 4 }, "Flash cards"))
            .toEqual({ title: "Flash Cards", detail: "Week 4 words" });
        expect(formatRoadRowLabels({ title: "Learning English: Fill in the Blank", vocabUi: "fill-blank" }, "Complete sentences"))
            .toEqual({ title: "Fill in the Blank", detail: "This week's words" });
    });

    it("drops the week prefix the heading already shows", () => {
        expect(formatRoadRowLabels({ title: "Week 4: Adjectives and Articles" }, "Game"))
            .toEqual({ title: "Adjectives and Articles", detail: "Game" });
        expect(formatRoadRowLabels({ title: "Week 4 Quiz — Review Day" }, "Quiz"))
            .toEqual({ title: "Review Day", detail: "Quiz" });
    });

    it("keeps a bare week quiz title and does not repeat its format", () => {
        expect(formatRoadRowLabels({ title: "Week 9 Quiz" }, "Quiz")).toEqual({ title: "Week 9 Quiz", detail: null });
        expect(formatRoadRowLabels({ title: "Verb Forms + Your Study Toolkit" }, "Read & practice"))
            .toEqual({ title: "Verb Forms + Your Study Toolkit", detail: "Read & practice" });
    });
});
