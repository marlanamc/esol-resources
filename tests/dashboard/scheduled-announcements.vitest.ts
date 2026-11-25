import { describe, expect, it } from "vitest";
import { getScheduledAnnouncement, SCHEDULED_ANNOUNCEMENTS } from "@/lib/scheduled-announcements";
import { renderAnnouncementMarkdown } from "@/utils/announcementMarkdown";

describe("scheduled homepage announcements", () => {
  it("has one announcement per Thanksgiving packet day, each with its own id", () => {
    const days = ["2026-11-25", "2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29", "2026-11-30"];
    expect(Object.keys(SCHEDULED_ANNOUNCEMENTS)).toEqual(days);
    const ids = Object.values(SCHEDULED_ANNOUNCEMENTS).map((a) => a.id);
    expect(new Set(ids).size).toBe(days.length);
  });

  it("switches at midnight Eastern, not UTC", () => {
    // 11pm ET Wed Nov 25 is already Nov 26 in UTC.
    expect(getScheduledAnnouncement(new Date("2026-11-26T04:00:00Z"))?.id).toBe("scheduled:thanksgiving-writing-day-1");
    expect(getScheduledAnnouncement(new Date("2026-11-26T05:00:00Z"))?.id).toBe("scheduled:thanksgiving-writing-day-2");
  });

  it("is gone before and after the packet week", () => {
    expect(getScheduledAnnouncement(new Date("2026-11-24T20:00:00Z"))).toBeNull();
    expect(getScheduledAnnouncement(new Date("2026-12-01T15:00:00Z"))).toBeNull();
  });

  it("renders the Wednesday message with the no-class line", () => {
    const html = renderAnnouncementMarkdown(SCHEDULED_ANNOUNCEMENTS["2026-11-25"].message);
    expect(html).toContain("<strong>No class tomorrow. Happy Thanksgiving!</strong>");
    expect(html).toContain("<em>just, already, yet</em>");
  });
});

describe("Google Classroom link for students who missed class", () => {
  it("appears in every day's announcement as a safe new-tab link", () => {
    for (const { message } of Object.values(SCHEDULED_ANNOUNCEMENTS)) {
      const html = renderAnnouncementMarkdown(message);
      expect(html).toContain("Missed class on Tuesday?");
      expect(html).toContain(
        '<a href="https://classroom.google.com/c/ODc4MTA5Mzc4NTU5/m/ODkyODk3NzcyNTQ3/details" target="_blank"'
      );
    }
  });
});
