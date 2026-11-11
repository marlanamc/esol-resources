import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * getWeeklyRankForUser powers the header medal badge on every dashboard page.
 * It must rank exactly like getTimeframedLeaderboard (ties share a rank, zero
 * totals are unranked) while running a single ledger query.
 */

const groupByMock = vi.fn();
const findManyMock = vi.fn();

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    pointsLedger: { groupBy: (...args: unknown[]) => groupByMock(...args) },
    user: { findMany: (...args: unknown[]) => findManyMock(...args) },
  },
}));

import { getWeeklyRankForUser } from "@/lib/gamification/gamification";

const totals = (rows: Array<[string, number | null]>) =>
  rows.map(([userId, points]) => ({ userId, _sum: { points } }));

describe("getWeeklyRankForUser", () => {
  beforeEach(() => {
    groupByMock.mockReset();
    findManyMock.mockReset();
  });

  it("ranks by strictly higher weekly totals, sharing ranks on ties", async () => {
    groupByMock.mockResolvedValue(totals([["a", 50], ["b", 30], ["c", 30], ["d", 10]]));

    expect(await getWeeklyRankForUser("a", { classId: "class_1" })).toBe(1);
    expect(await getWeeklyRankForUser("b", { classId: "class_1" })).toBe(2);
    expect(await getWeeklyRankForUser("c", { classId: "class_1" })).toBe(2);
    expect(await getWeeklyRankForUser("d", { classId: "class_1" })).toBe(4);
  });

  it("returns null for learners with no points this week", async () => {
    groupByMock.mockResolvedValue(totals([["a", 50], ["login-only", 0], ["empty", null]]));

    expect(await getWeeklyRankForUser("login-only", { classId: "class_1" })).toBeNull();
    expect(await getWeeklyRankForUser("empty", { classId: "class_1" })).toBeNull();
    expect(await getWeeklyRankForUser("absent", { classId: "class_1" })).toBeNull();
  });

  it("scopes the ledger query to the class and uses only one query", async () => {
    groupByMock.mockResolvedValue(totals([["a", 5]]));

    await getWeeklyRankForUser("a", { classId: "class_1" });

    expect(groupByMock).toHaveBeenCalledTimes(1);
    expect(findManyMock).not.toHaveBeenCalled();
    const [{ where }] = groupByMock.mock.calls[0] as [{ where: { user: unknown; createdAt: unknown } }];
    expect(where.createdAt).toBeDefined();
    expect(where.user).toMatchObject({
      role: "student",
      classes: { some: { classId: "class_1", status: "active" } },
    });
  });
});
