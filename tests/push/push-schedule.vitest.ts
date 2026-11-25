import { describe, expect, it } from "vitest";
import { getScheduledPushMessage, SCHEDULED_PUSH_MESSAGES } from "@/lib/push-schedule";
import { getLearnerDayKey } from "@/lib/daily-habits";

describe("scheduled push messages", () => {
  it("covers all six Thanksgiving packet days", () => {
    const days = ["2026-11-25", "2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29", "2026-11-30"];
    days.forEach((day, i) => {
      expect(getScheduledPushMessage(day)?.tag).toBe(`thanksgiving-writing-day-${i + 1}`);
    });
    expect(Object.keys(SCHEDULED_PUSH_MESSAGES)).toHaveLength(6);
  });

  it("matches the 9am ET cron run (14:00 UTC) to the right day", () => {
    const key = getLearnerDayKey(new Date("2026-11-26T14:00:00Z"));
    expect(getScheduledPushMessage(key)?.title).toContain("Happy Thanksgiving");
  });

  it("returns null on ordinary days", () => {
    expect(getScheduledPushMessage("2026-12-01")).toBeNull();
  });
});
