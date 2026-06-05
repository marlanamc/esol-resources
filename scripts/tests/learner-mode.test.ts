import test from "node:test";
import assert from "node:assert/strict";
import {
  buildIndependentLearnerWhere,
  resolveLearnerStateFromActiveEnrollments,
} from "@/lib/learner-mode";

test("student with one active enrollment resolves as classroom", () => {
  assert.deepEqual(
    resolveLearnerStateFromActiveEnrollments([
      { classId: "class-1", joinedAt: new Date("2026-01-01") },
    ]),
    {
      mode: "classroom",
      activeClassIds: ["class-1"],
      primaryClassId: "class-1",
    }
  );
});

test("student with no active enrollments resolves as independent", () => {
  assert.deepEqual(resolveLearnerStateFromActiveEnrollments([]), {
    mode: "independent",
    activeClassIds: [],
    primaryClassId: null,
  });
});

test("latest active enrollment is primary class", () => {
  assert.deepEqual(
    resolveLearnerStateFromActiveEnrollments([
      { classId: "older-class", joinedAt: new Date("2026-01-01") },
      { classId: "newer-class", joinedAt: new Date("2026-02-01") },
    ]),
    {
      mode: "classroom",
      activeClassIds: ["newer-class", "older-class"],
      primaryClassId: "newer-class",
    }
  );
});

test("buildIndependentLearnerWhere includes students with no active enrollments", () => {
  assert.deepEqual(buildIndependentLearnerWhere(), {
    classes: {
      none: {
        status: "active",
      },
    },
  });
});
