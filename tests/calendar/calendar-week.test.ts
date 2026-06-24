import test from "node:test";
import assert from "node:assert/strict";
import {
    buildCalendarWeekActivity,
    CALENDAR_WEEK_DAY_LABELS,
    getCalendarWeekStartDayKey,
    getCalendarWeekTodayIndex,
    getInstantForLearnerDayStart,
    getLearnerDayKey,
} from "@/lib/gamification/calendar-week";

test("getCalendarWeekStartDayKey returns Monday for a Wednesday in learner time", () => {
    assert.equal(getCalendarWeekStartDayKey(new Date("2026-06-03T15:00:00.000Z")), "2026-06-01");
});

test("getCalendarWeekTodayIndex is 0 on Monday and 6 on Sunday in learner time", () => {
    assert.equal(getCalendarWeekTodayIndex(new Date("2026-06-01T13:00:00.000Z")), 0);
    assert.equal(getCalendarWeekTodayIndex(new Date("2026-06-07T13:00:00.000Z")), 6);
});

test("CALENDAR_WEEK_DAY_LABELS are fixed Mon–Sun", () => {
    assert.deepEqual([...CALENDAR_WEEK_DAY_LABELS], ["M", "T", "W", "T", "F", "S", "S"]);
});

test("buildCalendarWeekActivity marks days with earned points", () => {
    const reference = new Date("2026-06-01T13:00:00.000Z");
    const activity = buildCalendarWeekActivity(
        [
            { createdAt: new Date("2026-06-01T14:00:00.000Z") },
            { createdAt: new Date("2026-06-04T18:00:00.000Z") },
        ],
        reference
    );

    assert.deepEqual(activity, [true, false, false, true, false, false, false]);
});

test("buildCalendarWeekActivity marks login-only days", () => {
    const reference = new Date("2026-06-02T13:00:00.000Z");
    const activity = buildCalendarWeekActivity(
        [{ createdAt: new Date("2026-06-02T12:00:00.000Z") }],
        reference
    );

    assert.deepEqual(activity, [false, true, false, false, false, false, false]);
});

test("buildCalendarWeekActivity uses America/New_York day boundaries", () => {
    const reference = new Date("2026-06-02T13:00:00.000Z");
    const activity = buildCalendarWeekActivity(
        [{ createdAt: new Date("2026-06-02T02:30:00.000Z") }],
        reference
    );

    // 2026-06-02T02:30Z is still Monday evening in New York.
    assert.deepEqual(activity, [true, false, false, false, false, false, false]);
});

test("getInstantForLearnerDayStart aligns with learner day key", () => {
    const dayKey = "2026-06-01";
    const instant = getInstantForLearnerDayStart(dayKey);

    assert.equal(getLearnerDayKey(instant), dayKey);
    assert.equal(getLearnerDayKey(new Date(instant.getTime() - 1)), "2026-05-31");
});
