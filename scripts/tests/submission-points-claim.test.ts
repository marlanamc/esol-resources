import test from "node:test";
import assert from "node:assert/strict";
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

test("claims points once when pointsAwarded is still zero", async () => {
  const state: SubmissionDelegateMock = { pointsAwarded: 0, claimable: true };
  const result = await claimSubmissionPointsOnce({
    submission: buildMockSubmission(state),
    submissionId: "sub_1",
    userId: "user_1",
    pointsAwarded: 10,
  });

  assert.equal(result.claimed, true);
  assert.equal(result.existingPointsAwarded, 10);
  assert.equal(state.sawUserId, "user_1");
});

test("returns duplicate shape when claim already taken", async () => {
  const state: SubmissionDelegateMock = { pointsAwarded: 15, claimable: false };
  const result = await claimSubmissionPointsOnce({
    submission: buildMockSubmission(state),
    submissionId: "sub_2",
    userId: "user_2",
    pointsAwarded: 10,
  });

  assert.equal(result.claimed, false);
  assert.equal(result.existingPointsAwarded, 15);
});
