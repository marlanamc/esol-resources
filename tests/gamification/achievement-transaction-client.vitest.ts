import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DbClient } from "@/lib/gamification/gamification";

const { baseRead } = vi.hoisted(() => ({ baseRead: vi.fn() }));
vi.mock("@/lib/database/prisma", () => ({
  prisma: { achievement: { findMany: baseRead } },
}));

import {
  checkAndAwardAchievements,
  invalidateAchievementDefinitions,
} from "@/lib/gamification/gamification";

describe("achievement reads during point awards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateAchievementDefinitions();
    // Production's single connection is already occupied by the award transaction.
    baseRead.mockRejectedValue(new Error("No free database connection"));
  });

  function transactionClient() {
    return {
      user: { findUnique: vi.fn().mockResolvedValue({ points: 4, currentStreak: 1, achievements: [] }) },
      achievement: { findMany: vi.fn().mockResolvedValue([]) },
    };
  }

  it("completes a cold-cache check using the occupied transaction connection", async () => {
    const tx = transactionClient();
    await expect(checkAndAwardAchievements("student", tx as unknown as DbClient)).resolves.toEqual([]);
    expect(tx.achievement.findMany).toHaveBeenCalledOnce();
    expect(baseRead).not.toHaveBeenCalled();
  });

  it("reuses cached definitions and reloads through the transaction after invalidation", async () => {
    const tx = transactionClient();
    await checkAndAwardAchievements("student", tx as unknown as DbClient);
    await checkAndAwardAchievements("student", tx as unknown as DbClient);
    expect(tx.achievement.findMany).toHaveBeenCalledTimes(1);
    invalidateAchievementDefinitions();
    await checkAndAwardAchievements("student", tx as unknown as DbClient);
    expect(tx.achievement.findMany).toHaveBeenCalledTimes(2);
    expect(baseRead).not.toHaveBeenCalled();
  });
});
