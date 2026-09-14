import test from "node:test";
import assert from "node:assert/strict";
import { findClosure, getClassDayInfo, isClassDay, toDateKey } from "@/lib/class-days";

/** Local-noon Date so the day never drifts across a timezone boundary. */
function on(dateKey: string): Date {
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0, 0);
}

test("toDateKey reads the local calendar day", () => {
    assert.equal(toDateKey(on("2026-09-15")), "2026-09-15");
});

test("Tuesdays and Thursdays in the term are class days", () => {
    assert.equal(isClassDay(on("2026-09-15")), true); // Tuesday
    assert.equal(isClassDay(on("2026-09-17")), true); // Thursday
    assert.equal(isClassDay(on("2027-06-10")), true); // last Thursday of the term
});

test("other weekdays are never class days", () => {
    for (const dateKey of ["2026-09-14", "2026-09-16", "2026-09-18", "2026-09-19", "2026-09-20"]) {
        assert.equal(isClassDay(on(dateKey)), false, dateKey);
    }
});

test("dates outside the term are not class days", () => {
    assert.equal(isClassDay(on("2026-09-10")), false); // Thursday before the term
    assert.equal(isClassDay(on("2027-06-15")), false); // Tuesday after the term
});

test("a holiday cancels the class day it lands on", () => {
    // Every Tue/Thu the 2026-27 closures take out.
    const cancelled: Array<[string, string]> = [
        ["2026-11-26", "Thanksgiving Break"],
        ["2026-12-24", "Winter Break"],
        ["2026-12-29", "Winter Break"],
        ["2026-12-31", "Winter Break"],
        ["2027-02-16", "February Break"],
        ["2027-02-18", "February Break"],
        ["2027-04-20", "Spring Break"],
        ["2027-04-22", "Spring Break"],
    ];

    for (const [dateKey, label] of cancelled) {
        const info = getClassDayInfo(on(dateKey));
        assert.equal(info.isScheduledMeeting, true, dateKey);
        assert.equal(info.meets, false, dateKey);
        assert.equal(info.cancelledBy?.label, label, dateKey);
    }
});

test("a holiday on a non-class weekday leaves cancelledBy unset", () => {
    // Indigenous Peoples' Day is a Monday — nothing to cancel.
    const info = getClassDayInfo(on("2026-10-12"));
    assert.equal(info.isScheduledMeeting, false);
    assert.equal(info.cancelledBy, null);
    assert.equal(findClosure("2026-10-12")?.label, "Indigenous Peoples' Day");
});

test("findClosure covers the interior of a multi-day break", () => {
    assert.equal(findClosure("2026-12-28")?.label, "Winter Break");
    assert.equal(findClosure("2027-01-02"), null);
});
