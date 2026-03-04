import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAlreadyEnrolledResponse,
  normalizeJoinClassCode,
  validateJoinSession,
} from "@/app/api/classes/join/route";

test("validateJoinSession enforces unauthorized and teacher restrictions", () => {
  const unauthorized = validateJoinSession(null);
  assert.equal(unauthorized.allowed, false);
  assert.equal(unauthorized.status, 401);

  const teacherBlocked = validateJoinSession({ user: { role: "teacher" } });
  assert.equal(teacherBlocked.allowed, false);
  assert.equal(teacherBlocked.status, 403);

  const studentAllowed = validateJoinSession({ user: { role: "student" } });
  assert.equal(studentAllowed.allowed, true);
});

test("normalizeJoinClassCode validates and uppercases class code", () => {
  assert.deepEqual(normalizeJoinClassCode(" ab12c3 "), {
    ok: true,
    code: "AB12C3",
  });

  const invalidFormat = normalizeJoinClassCode("abc");
  assert.equal(invalidFormat.ok, false);
  if (!invalidFormat.ok) {
    assert.equal(invalidFormat.status, 400);
    assert.equal(invalidFormat.error, "Invalid class code format");
  }
});

test("buildAlreadyEnrolledResponse includes classId in error payload", () => {
  const response = buildAlreadyEnrolledResponse("class_123");
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: "You are already enrolled in this class",
    classId: "class_123",
  });
});

