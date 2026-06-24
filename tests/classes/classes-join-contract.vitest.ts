import { describe, it, expect } from "vitest";
import {
  buildAlreadyEnrolledResponse,
  normalizeJoinClassCode,
  validateJoinSession,
} from "@/app/api/classes/join/route";

describe("classes join contract", () => {
  it("validateJoinSession enforces unauthorized and teacher restrictions", () => {
    const unauthorized = validateJoinSession(null);
    expect(unauthorized.allowed).toBe(false);
    expect(unauthorized.status).toBe(401);

    const teacherBlocked = validateJoinSession({ user: { role: "teacher" } });
    expect(teacherBlocked.allowed).toBe(false);
    expect(teacherBlocked.status).toBe(403);

    const studentAllowed = validateJoinSession({ user: { role: "student" } });
    expect(studentAllowed.allowed).toBe(true);
  });

  it("normalizeJoinClassCode validates and uppercases class code", () => {
    expect(normalizeJoinClassCode(" ab12c3 ")).toEqual({ ok: true, code: "AB12C3" });

    const invalidFormat = normalizeJoinClassCode("abc");
    expect(invalidFormat.ok).toBe(false);
    if (!invalidFormat.ok) {
      expect(invalidFormat.status).toBe(400);
      expect(invalidFormat.error).toBe("Invalid class code format");
    }
  });

  it("buildAlreadyEnrolledResponse includes classId in error payload", () => {
    const response = buildAlreadyEnrolledResponse("class_123");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "You are already enrolled in this class",
      classId: "class_123",
    });
  });
});
