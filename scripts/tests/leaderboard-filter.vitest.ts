import { describe, expect, it } from "vitest";
import {
  buildLeaderboardEligibleUserWhere,
  EXCLUDED_LEADERBOARD_USERNAMES,
  isLeaderboardExcludedUser,
} from "@/lib/gamification/leaderboard-filter";

describe("leaderboard filter", () => {
  it("excludes system accounts from leaderboard queries", () => {
    expect(buildLeaderboardEligibleUserWhere()).toMatchObject({
      role: "student",
      isSystemAccount: false,
      username: { notIn: EXCLUDED_LEADERBOARD_USERNAMES },
    });
  });

  it("keeps caller-provided class filters intact", () => {
    expect(
      buildLeaderboardEligibleUserWhere({
        classes: { some: { classId: "class_123" } },
      })
    ).toMatchObject({
      role: "student",
      isSystemAccount: false,
      classes: { some: { classId: "class_123" } },
    });
  });

  it("marks system test students as excluded", () => {
    expect(
      isLeaderboardExcludedUser({
        username: "student_g54ueu",
        isSystemAccount: true,
      })
    ).toBe(true);
  });

  it("marks explicit username exclusions as excluded", () => {
    expect(
      isLeaderboardExcludedUser({
        username: "marlie",
        isSystemAccount: false,
      })
    ).toBe(true);
  });

  it("allows regular students onto the leaderboard", () => {
    expect(
      isLeaderboardExcludedUser({
        username: "real-student",
        isSystemAccount: false,
      })
    ).toBe(false);
  });
});
