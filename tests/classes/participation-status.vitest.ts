import { describe, expect, it } from "vitest";
import {
    latestActivityDate,
    participationStatus,
    parseParticipationFilter,
    safeProgressReturn,
} from "@/lib/teach/participation-status";
const now = new Date("2026-09-19T16:00:00Z").getTime();
describe("workspace participation", () => {
    it("separates never-started students from seven-day inactivity", () => {
        expect(participationStatus(null, now)).toBe("never");
        expect(participationStatus(new Date(now - 7 * 86400000), now)).toBe(
            "inactive",
        );
        expect(participationStatus(new Date(now - 7 * 86400000 + 1), now)).toBe(
            "active",
        );
    });
    it("takes the latest signal, including progress without points", () => {
        const recent = new Date(now - 1000);
        expect(
            latestActivityDate(new Date(now - 86400000), null, recent),
        ).toEqual(recent);
        expect(latestActivityDate(null, undefined)).toBeNull();
    });
    it("normalizes unknown filters", () => {
        expect(parseParticipationFilter("never")).toBe("never");
        expect(parseParticipationFilter("unknown")).toBe("all");
    });
    it("preserves list context while rejecting external and unrelated return URLs", () => {
        expect(
            safeProgressReturn(
                "/teach/reports?classId=one&q=Ana&status=inactive",
            ),
        ).toBe("/teach/reports?classId=one&q=Ana&status=inactive");
        for (const value of [
            "//evil.example/teach/reports",
            "https://evil.example/teach/reports",
            "/admin/users",
            "javascript:alert(1)",
        ])
            expect(safeProgressReturn(value)).toBe("/teach/reports");
    });
});
