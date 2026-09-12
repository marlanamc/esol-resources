import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Regression cover for duplicate activity awards.
 *
 * /api/activity/progress has no atomic claim of its own (unlike /api/activity/submit,
 * which uses claimSubmissionPointsOnce), and its client effects can fire concurrently —
 * FlashcardCarousel saves on every card view. Before the dedupe guard, three simultaneous
 * completion POSTs each wrote a ledger row and tripled the points.
 */

const ledgerRows: Array<{ userId: string; source: string; reason: string; createdAt: Date }> = [];
const advisoryLocks: string[] = [];

const awardPointsMock = vi.fn(async (userId: string, points: number, reason: string, source: string) => {
  ledgerRows.push({ userId, source, reason, createdAt: new Date() });
  return { points, currentStreak: 1 };
});

vi.mock("@/lib/gamification/gamification", () => ({
  awardPoints: (...args: Parameters<typeof awardPointsMock>) => awardPointsMock(...args),
  updateStreak: async () => ({ streakUpdated: false, newStreak: 1, pointsAwarded: 0 }),
  checkAndAwardAchievements: async () => [],
}));

vi.mock("@/lib/database/prisma", () => {
  const tx = {
    $executeRaw: async (strings: TemplateStringsArray, ...values: unknown[]) => {
      advisoryLocks.push(String(values[0]));
      return 1;
    },
    pointsLedger: {
      findFirst: async ({ where }: { where: { userId: string; source: string; reason: string } }) =>
        ledgerRows.find(
          (r) => r.userId === where.userId && r.source === where.source && r.reason === where.reason
        ) ?? null,
    },
    user: {
      findUnique: async () => ({ points: 42, currentStreak: 1 }),
    },
  };
  return {
    prisma: {
      $transaction: async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
    },
  };
});

const { applyAwardChain } = await import("@/lib/gamification/award-chain");

const award = () =>
  applyAwardChain({
    userId: "user-1",
    points: 6,
    reason: "Completed: Café Catch-Up",
    source: "activity",
    dedupeKey: true,
  });

beforeEach(() => {
  ledgerRows.length = 0;
  advisoryLocks.length = 0;
  awardPointsMock.mockClear();
});

describe("applyAwardChain dedupe", () => {
  it("awards once and skips the repeat for the same activity", async () => {
    const first = await award();
    const second = await award();

    expect(first.deduped).toBeFalsy();
    expect(second.deduped).toBe(true);
    expect(awardPointsMock).toHaveBeenCalledTimes(1);
    expect(ledgerRows).toHaveLength(1);
  });

  it("takes a transaction-scoped advisory lock before reading the ledger", async () => {
    await award();
    expect(advisoryLocks).toContain("award:user-1:activity:Completed: Café Catch-Up");
  });

  it("still awards a genuinely different activity", async () => {
    await award();
    const other = await applyAwardChain({
      userId: "user-1",
      points: 8,
      reason: "Completed: Timeline Tenses",
      source: "activity",
      dedupeKey: true,
    });

    expect(other.deduped).toBeFalsy();
    expect(ledgerRows).toHaveLength(2);
  });

  it("leaves callers without dedupeKey untouched", async () => {
    await applyAwardChain({ userId: "user-1", points: 6, reason: "Quiz", source: "activity" });
    await applyAwardChain({ userId: "user-1", points: 6, reason: "Quiz", source: "activity" });

    // /api/activity/submit guards itself via claimSubmissionPointsOnce, so the chain
    // must not start silently swallowing its awards.
    expect(awardPointsMock).toHaveBeenCalledTimes(2);
    expect(advisoryLocks).toHaveLength(0);
  });
});
