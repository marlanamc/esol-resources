import test from "node:test";
import assert from "node:assert/strict";
import { buildIndependentLearnerWhere, resolveLearnerMode } from "@/lib/learner-mode";

test("resolveLearnerMode keeps explicit independent learners independent", () => {
  assert.equal(
    resolveLearnerMode({
      storedMode: "independent",
      enrollmentCount: 2,
    }),
    "independent"
  );
});

test("resolveLearnerMode preserves classroom mode for unenrolled students unless independent is explicit", () => {
  assert.equal(
    resolveLearnerMode({
      storedMode: "classroom",
      enrollmentCount: 0,
    }),
    "classroom"
  );
});

test("resolveLearnerMode keeps enrolled classroom learners in classroom mode", () => {
  assert.equal(
    resolveLearnerMode({
      storedMode: "classroom",
      enrollmentCount: 1,
    }),
    "classroom"
  );
});

test("resolveLearnerMode defaults missing preferences to classroom mode", () => {
  assert.equal(
    resolveLearnerMode({
      storedMode: null,
      enrollmentCount: 0,
    }),
    "classroom"
  );
});

test("buildIndependentLearnerWhere includes explicit independent learners and unenrolled learners", () => {
  assert.deepEqual(buildIndependentLearnerWhere(), {
    OR: [
      {
        preferences: {
          is: {
            learnerMode: "independent",
          },
        },
      },
      {
        classes: {
          none: {},
        },
      },
    ],
  });
});
