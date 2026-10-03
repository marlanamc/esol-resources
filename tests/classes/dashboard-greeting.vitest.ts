import { describe, expect, it } from "vitest";
import { getTimeOfDayGreeting } from "@/lib/dashboard/welcome-header";

describe("dashboard greeting in Eastern time", () => {
    it.each([
        ["2026-10-03T01:30:00Z", "Good evening"], // 9:30 pm EDT, previous UTC date
        ["2026-12-03T02:30:00Z", "Good evening"], // 9:30 pm EST
        ["2026-10-02T15:59:00Z", "Good morning"],
        ["2026-10-02T16:00:00Z", "Good afternoon"],
        ["2026-10-02T20:59:00Z", "Good afternoon"],
        ["2026-10-02T21:00:00Z", "Good evening"],
        ["2026-10-03T04:00:00Z", "Good morning"], // midnight EDT
    ])("uses the class timezone for %s", (instant, greeting) => {
        expect(getTimeOfDayGreeting(new Date(instant))).toBe(greeting);
    });
});
