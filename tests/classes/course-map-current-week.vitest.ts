import { describe, expect, it } from "vitest";
import {
    resolveCurrentWeek,
    resolveScheduledTeachingWeek,
    visibleWeekNumbers,
    weekSwitchAt,
} from "@/lib/course-map-current-week";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";
import type { CourseMapUnit } from "@/lib/course-map";

const ET = "America/New_York";
const inET = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
        timeZone: ET,
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        // h23, not hour12: false -- some ICU builds (CI's Node 20) read that as h24
        // and render midnight as "24:00".
        hourCycle: "h23",
    }).format(d);

/** All 36 teaching weeks, as a classroom learner with everything released. */
const allWeeks = Array.from({ length: 36 }, (_, i) => i + 1);

describe("weekSwitchAt", () => {
    it("switches at Tuesday midnight Eastern for the Sept 21 week", () => {
        expect(weekSwitchAt("2026-09-21").toISOString()).toBe("2026-09-22T04:00:00.000Z");
    });

    it("always lands on Tuesday 00:00 local, including across DST changes", () => {
        for (const week of buildTeachingWeeks()) {
            const label = inET(weekSwitchAt(week.weekStart));
            expect(label).toContain("Tue");
            expect(label).toContain("00:00");
        }
    });

    it("switches after the week opens, never before", () => {
        for (const week of buildTeachingWeeks()) {
            expect(weekSwitchAt(week.weekStart).getTime()).toBeGreaterThan(week.revealAt.getTime());
        }
    });
});

describe("resolveScheduledTeachingWeek", () => {
    it("still shows Week 1 on Monday September 21", () => {
        // Mon Sep 21, 8am ET
        expect(resolveScheduledTeachingWeek(new Date("2026-09-21T12:00:00Z"))?.weekNumber).toBe(1);
    });

    it("still shows Week 1 at 11:59pm Monday", () => {
        expect(resolveScheduledTeachingWeek(new Date("2026-09-22T03:59:00Z"))?.weekNumber).toBe(1);
    });

    it("switches to Week 2 at midnight Eastern on Tuesday September 22", () => {
        expect(resolveScheduledTeachingWeek(new Date("2026-09-22T04:00:00Z"))?.weekNumber).toBe(2);
    });

    it("does not advance during the Sunday 8pm early-access window", () => {
        // Sun Sep 20, 9pm ET — Week 2 content is open but the class is on Week 1.
        expect(resolveScheduledTeachingWeek(new Date("2026-09-21T01:00:00Z"))?.weekNumber).toBe(1);
    });

    it("holds the first teaching week before the term begins", () => {
        expect(resolveScheduledTeachingWeek(new Date("2026-08-01T12:00:00Z"))?.weekNumber).toBe(1);
    });

    it("holds the last teaching week after the term ends", () => {
        const last = buildTeachingWeeks().length;
        expect(resolveScheduledTeachingWeek(new Date("2027-08-01T12:00:00Z"))?.weekNumber).toBe(last);
    });

    it("does not advance through a full break week", () => {
        // Winter break runs Dec 23 - Jan 1; no teaching week starts Dec 28.
        const beforeBreak = resolveScheduledTeachingWeek(new Date("2026-12-23T12:00:00Z"))!;
        const duringBreak = resolveScheduledTeachingWeek(new Date("2026-12-30T12:00:00Z"))!;
        expect(duringBreak.weekNumber).toBe(beforeBreak.weekNumber);
    });
});

describe("resolveCurrentWeek — classroom", () => {
    const at = (iso: string, visibleWeeks = allWeeks, progressWeek: number | null = 1) =>
        resolveCurrentWeek({
            mode: "classroom",
            visibleWeeks,
            progressWeek,
            now: new Date(iso),
        });

    it("keeps Week 1 on Monday even when Week 1 is unfinished", () => {
        expect(at("2026-09-21T12:00:00Z")).toMatchObject({ weekNumber: 1, source: "calendar" });
    });

    it("moves to Week 2 on Tuesday even when Week 1 is unfinished", () => {
        expect(at("2026-09-22T04:00:00Z")).toMatchObject({ weekNumber: 2, source: "calendar" });
    });

    it("ignores progress entirely — a finished Week 2 is still Week 2", () => {
        // progressWeek points far ahead; the calendar still wins.
        const resolved = at("2026-09-22T04:00:00Z", allWeeks, 9);
        expect(resolved).toMatchObject({ weekNumber: 2, source: "calendar" });
    });

    it("falls back to the latest visible earlier week when the scheduled week is not released", () => {
        const resolved = at("2026-09-22T04:00:00Z", [1], 1);
        expect(resolved).toMatchObject({
            weekNumber: 1,
            source: "fallback",
            scheduledWeekNumber: 2,
        });
    });

    it("uses the first visible week when nothing earlier is available", () => {
        const resolved = at("2026-09-22T04:00:00Z", [5, 6], 5);
        expect(resolved?.weekNumber).toBe(5);
    });

    it("returns null when no weeks are visible", () => {
        expect(at("2026-09-22T04:00:00Z", [], null)).toBeNull();
    });
});

describe("resolveCurrentWeek — independent", () => {
    it("stays progress-driven and ignores the calendar", () => {
        const resolved = resolveCurrentWeek({
            mode: "independent",
            visibleWeeks: allWeeks,
            progressWeek: 4,
            now: new Date("2026-09-22T04:00:00Z"),
        });
        expect(resolved).toMatchObject({ weekNumber: 4, source: "progress" });
        expect(resolved?.scheduledWeekNumber).toBeNull();
    });

    it("falls back to the first visible week with no progress", () => {
        const resolved = resolveCurrentWeek({
            mode: "independent",
            visibleWeeks: [3, 4],
            progressWeek: null,
            now: new Date("2026-09-22T04:00:00Z"),
        });
        expect(resolved?.weekNumber).toBe(3);
    });
});

describe("visibleWeekNumbers", () => {
    it("flattens and sorts week numbers across units", () => {
        const units = [
            { unitNumber: 2, unitTitle: "B", month: "October", levels: [{ levelNumber: 4, levelTitle: "", requiredActivities: [] }] },
            { unitNumber: 1, unitTitle: "A", month: "September", levels: [{ levelNumber: 2, levelTitle: "", requiredActivities: [] }, { levelNumber: 1, levelTitle: "", requiredActivities: [] }] },
        ] as unknown as CourseMapUnit[];
        expect(visibleWeekNumbers(units)).toEqual([1, 2, 4]);
    });
});
