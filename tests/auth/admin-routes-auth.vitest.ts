import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));
vi.mock("@/lib/api/rate-limit", () => ({
  checkRateLimit: () => true,
  authRateLimitKey: () => "test-key",
}));
vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    classEnrollment: { findFirst: vi.fn() },
  },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/database/prisma";
import { PATCH as excludeLeaderboardPatch } from "@/app/api/admin/users/[userId]/exclude-leaderboard/route";
import { POST as resetStudentPasswordPost } from "@/app/api/admin/reset-student-password/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);

const studentSession = { user: { id: "student-1", role: "student" } };
const adminSession = { user: { id: "admin-1", role: "admin" } };
const teacherSession = { user: { id: "teacher-1", role: "teacher" } };

function patchRequest(body: unknown): NextRequest {
  return new Request("https://example.test", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;
}

const userParams = { params: Promise.resolve({ userId: "user-2" }) };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exclude-leaderboard route", () => {
  it("rejects students", async () => {
    mockSession.mockResolvedValue(studentSession);
    const res = await excludeLeaderboardPatch(patchRequest({ excluded: true }), userParams);
    expect(res.status).toBe(403);
  });

  it("rejects plain teachers (admin only)", async () => {
    mockSession.mockResolvedValue(teacherSession);
    const res = await excludeLeaderboardPatch(patchRequest({ excluded: true }), userParams);
    expect(res.status).toBe(403);
  });

  it("returns 400 when excluded is not a boolean", async () => {
    mockSession.mockResolvedValue(adminSession);
    const res = await excludeLeaderboardPatch(patchRequest({ excluded: "yes" }), userParams);
    expect(res.status).toBe(400);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("returns 400 (not 500) on malformed JSON", async () => {
    mockSession.mockResolvedValue(adminSession);
    const res = await excludeLeaderboardPatch(patchRequest("{"), userParams);
    expect(res.status).toBe(400);
  });

  it("updates the flag for admins", async () => {
    mockSession.mockResolvedValue(adminSession);
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-2", username: "ricardo" } as never);
    mockPrisma.user.update.mockResolvedValue(
      { id: "user-2", username: "ricardo", excludeFromLeaderboard: true } as never
    );

    const res = await excludeLeaderboardPatch(patchRequest({ excluded: true }), userParams);

    expect(res.status).toBe(200);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { excludeFromLeaderboard: true } })
    );
  });
});

describe("admin reset-student-password route", () => {
  function postRequest(body: unknown): Request {
    return new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  it("rejects students", async () => {
    mockSession.mockResolvedValue(studentSession);
    const res = await resetStudentPasswordPost(postRequest({ userId: "user-2", newPassword: "Bright-Garden-42" }));
    expect(res.status).toBe(403);
  });

  it("blocks teachers from resetting passwords of students outside their classes", async () => {
    mockSession.mockResolvedValue(teacherSession);
    mockPrisma.user.findUnique.mockResolvedValue(
      { id: "user-2", role: "student", isSystemAccount: false } as never
    );
    mockPrisma.classEnrollment.findFirst.mockResolvedValue(null as never);

    const res = await resetStudentPasswordPost(postRequest({ userId: "user-2", newPassword: "Bright-Garden-42" }));

    expect(res.status).toBe(403);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("returns 400 (not 500) on malformed JSON", async () => {
    mockSession.mockResolvedValue(adminSession);
    const res = await resetStudentPasswordPost(postRequest("{"));
    expect(res.status).toBe(400);
  });
});
