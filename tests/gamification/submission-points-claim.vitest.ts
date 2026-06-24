import { describe, it, expect } from "vitest";
import { claimSubmissionPointsOnce } from "@/lib/submission-points-award";

type SubmissionDelegateMock = {
  pointsAwarded: number;
  claimable: boolean;
  sawUserId?: string;
};

function buildMockSubmission(mock: SubmissionDelegateMock) {
  return {
    async updateMany(args: { where: { userId?: string } }) {
      mock.sawUserId = args.where.userId;
      if (!mock.claimable || mock.pointsAwarded !== 0) {
        return { count: 0 };
      }
      mock.pointsAwarded = 10;
      return { count: 1 };
    },
    async findUnique() {
      return { pointsAwarded: mock.pointsAwarded };
    },
  };
}

describe("submission points claim", () => {
  it("claims points once when pointsAwarded is still zero", async () => {
    const state: SubmissionDelegateMock = { pointsAwarded: 0, claimable: true };
    const result = await claimSubmissionPointsOnce({
      submission: buildMockSubmission(state),
      submissionId: "sub_1",
      userId: "user_1",
      pointsAwarded: 10,
    });

    expect(result.claimed).toBe(true);
    expect(result.existingPointsAwarded).toBe(10);
    expect(state.sawUserId).toBe("user_1");
  });

  it("returns duplicate shape when claim already taken", async () => {
    const state: SubmissionDelegateMock = { pointsAwarded: 15, claimable: false };
    const result = await claimSubmissionPointsOnce({
      submission: buildMockSubmission(state),
      submissionId: "sub_2",
      userId: "user_2",
      pointsAwarded: 10,
    });

    expect(result.claimed).toBe(false);
    expect(result.existingPointsAwarded).toBe(15);
  });
});
