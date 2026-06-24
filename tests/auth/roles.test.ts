import test from "node:test";
import assert from "node:assert/strict";
import {
  canUseTeacherTools,
  isAdmin,
  isStudent,
  isTeacher,
  normalizeUserRole,
} from "@/lib/roles";

test("normalizeUserRole maps legacy teacher_admin to admin", () => {
  assert.equal(normalizeUserRole("teacher_admin"), "admin");
  assert.equal(normalizeUserRole("admin"), "admin");
  assert.equal(normalizeUserRole("teacher"), "teacher");
  assert.equal(normalizeUserRole("unexpected"), "student");
});

test("role helpers separate permission roles from teacher-tool access", () => {
  assert.equal(isStudent({ role: "student" }), true);
  assert.equal(isTeacher({ role: "teacher" }), true);
  assert.equal(isTeacher({ role: "admin" }), false);
  assert.equal(isAdmin({ role: "admin" }), true);
  assert.equal(canUseTeacherTools({ role: "teacher" }), true);
  assert.equal(canUseTeacherTools({ role: "admin" }), true);
  assert.equal(canUseTeacherTools({ role: "student" }), false);
});
