import test from "node:test";
import assert from "node:assert/strict";
import {
    findClosure,
    getClassDayAnnouncement,
    getClassDayInfo,
    isClassDay,
    toDateKey,
    zonedNow,
} from "@/lib/class-days";

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
    assert.equal(isClassDay(on("2026-09-22")), true); // Tuesday
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
        ["2026-09-24", "No Class"],
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

// ── Class-day announcement window ───────────────────────────────────────────
// All instants are UTC; Eastern is UTC-4 in September (EDT) and UTC-5 in
// January (EST), so these cover both sides of the DST change.

test("the announcement runs from midnight Eastern on a class day", () => {
    // Tue Sept 15 2026, 12:00am and 11:59am ET.
    assert.equal(getClassDayAnnouncement(new Date("2026-09-15T04:00:00Z")), "Class tonight at 6PM!");
    assert.equal(getClassDayAnnouncement(new Date("2026-09-15T15:59:00Z")), "Class tonight at 6PM!");
});

test("the announcement clears at 8:30pm Eastern, when class lets out", () => {
    // 8:29pm ET still on, 8:30pm ET off, 11pm ET off.
    assert.equal(getClassDayAnnouncement(new Date("2026-09-16T00:29:00Z")), "Class tonight at 6PM!");
    assert.equal(getClassDayAnnouncement(new Date("2026-09-16T00:30:00Z")), null);
    assert.equal(getClassDayAnnouncement(new Date("2026-09-16T03:00:00Z")), null);
});

test("the announcement holds through the standard-time switch", () => {
    // Tue Jan 19 2027, 11:00am EST — the same wall-clock window, UTC-5.
    assert.equal(getClassDayAnnouncement(new Date("2027-01-19T16:00:00Z")), "Class tonight at 6PM!");
    assert.equal(getClassDayAnnouncement(new Date("2027-01-20T01:30:00Z")), null); // 8:30pm EST
});

test("no announcement on days class does not meet", () => {
    assert.equal(getClassDayAnnouncement(new Date("2026-09-16T16:00:00Z")), null); // Wednesday
    assert.equal(getClassDayAnnouncement(new Date("2026-09-24T16:00:00Z")), null); // no-class Thursday
    assert.equal(getClassDayAnnouncement(new Date("2026-11-26T16:00:00Z")), null); // Thanksgiving
    assert.equal(getClassDayAnnouncement(new Date("2026-09-08T16:00:00Z")), null); // before the term
    assert.equal(getClassDayAnnouncement(new Date("2027-06-15T16:00:00Z")), null); // after the term
});

test("zonedNow reads the Eastern wall clock, not the host clock", () => {
    // 1:30am UTC on Sept 16 is still 9:30pm on Sept 15 in Eastern.
    assert.deepEqual(zonedNow(new Date("2026-09-16T01:30:00Z")), {
        dateKey: "2026-09-15",
        minutesOfDay: 21 * 60 + 30,
    });
    // Midnight Eastern lands on the new day at minute 0, not hour 24.
    assert.deepEqual(zonedNow(new Date("2026-09-16T04:00:00Z")), {
        dateKey: "2026-09-16",
        minutesOfDay: 0,
    });
});
