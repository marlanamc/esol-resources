import { describe, expect, it } from "vitest";
import { buildTeachingWeeks, zonedWallClockToUtc } from "@/lib/course-map-schedule";

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

describe("zonedWallClockToUtc", () => {
  it("resolves 8pm ET to the right UTC instant in daylight time", () => {
    // 2026-09-13 is EDT (UTC-4), so 20:00 ET is 00:00 UTC the next day.
    expect(zonedWallClockToUtc(2026, 9, 13, 20, ET).toISOString()).toBe("2026-09-14T00:00:00.000Z");
  });

  it("resolves 8pm ET to the right UTC instant in standard time", () => {
    // 2026-12-06 is EST (UTC-5), so 20:00 ET is 01:00 UTC the next day.
    expect(zonedWallClockToUtc(2026, 12, 6, 20, ET).toISOString()).toBe("2026-12-07T01:00:00.000Z");
  });

  it("still reads back as 8pm local on both sides of the DST change", () => {
    for (const [y, m, d] of [[2026, 9, 13], [2026, 12, 6], [2027, 3, 14], [2027, 6, 6]] as const) {
      expect(inET(zonedWallClockToUtc(y, m, d, 20, ET))).toContain("20:00");
    }
  });
});

describe("buildTeachingWeeks", () => {
  const weeks = buildTeachingWeeks();

  it("covers the whole evening-class year", () => {
    expect(weeks.length).toBe(36);
    expect(weeks[0].weekStart).toBe("2026-09-14");
    expect(weeks[0].classDates).toEqual(["2026-09-15", "2026-09-17"]);
    expect(weeks[weeks.length - 1].classDates).toContain("2027-06-10");
  });

  it("skips full break weeks entirely", () => {
    const starts = weeks.map((w) => w.weekStart);
    expect(starts).not.toContain("2026-12-28"); // winter break
    expect(starts).not.toContain("2027-02-15"); // February break
    expect(starts).not.toContain("2027-04-19"); // spring break
  });

  it("keeps weeks that lose only one session to a holiday", () => {
    const thanksgiving = weeks.find((w) => w.weekStart === "2026-11-23");
    expect(thanksgiving?.classDates).toEqual(["2026-11-24"]);
    const preWinter = weeks.find((w) => w.weekStart === "2026-12-21");
    expect(preWinter?.classDates).toEqual(["2026-12-22"]);
  });

  it("never drops a class session on a holiday", () => {
    const all = weeks.flatMap((w) => w.classDates);
    for (const closed of ["2026-11-26", "2026-12-24", "2027-02-16", "2027-04-20"]) {
      expect(all).not.toContain(closed);
    }
  });

  it("opens every week at 8pm local on the Sunday before", () => {
    for (const w of weeks) {
      const label = inET(w.revealAt);
      expect(label).toContain("Sun");
      expect(label).toContain("20:00");
      expect(w.revealAt.getTime()).toBeLessThan(new Date(`${w.classDates[0]}T00:00:00Z`).getTime());
    }
  });

  it("advances strictly forward in time", () => {
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i].revealAt.getTime()).toBeGreaterThan(weeks[i - 1].revealAt.getTime());
    }
  });
});
