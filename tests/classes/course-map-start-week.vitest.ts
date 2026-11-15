import { describe, expect, it } from "vitest";
import { limitCatchUpToStartWeek, type CatchUpWeek } from "@/lib/course-map-navigation";
import { resolveScheduledTeachingWeek } from "@/lib/course-map-current-week";

const week = (weekNumber: number, isDone = false, isCurrent = false): CatchUpWeek => ({
    weekNumber,
    title: `Week ${weekNumber}`,
    done: isDone ? 5 : 0,
    total: 5,
    isDone,
    isCurrent,
    href: isDone ? null : `/w${weekNumber}`,
});

describe("profile catch-up for students who join mid-year", () => {
    const weeks = [week(1, true), week(2), week(3), week(4, false, true)];

    it("hides unfinished weeks from before the student started", () => {
        expect(limitCatchUpToStartWeek(weeks, 3).map((w) => w.weekNumber)).toEqual([1, 3, 4]);
    });

    it("keeps finished earlier weeks as a bonus and always keeps the current week", () => {
        expect(limitCatchUpToStartWeek(weeks, 9).map((w) => w.weekNumber)).toEqual([1, 4]);
    });

    it("changes nothing without a start week (no active enrollment)", () => {
        expect(limitCatchUpToStartWeek(weeks, null)).toEqual(weeks);
    });

    it("maps a Tuesday Nov 17 start to Week 10", () => {
        expect(resolveScheduledTeachingWeek(new Date("2026-11-17T22:00:00Z"))?.weekNumber).toBe(10);
    });
});
