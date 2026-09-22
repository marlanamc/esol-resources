import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

const calls: string[] = [];
const tx = {
  classEnrollment: { deleteMany: vi.fn(async () => { calls.push("classEnrollment"); }) },
  writingGroupMember: { deleteMany: vi.fn(async () => { calls.push("writingGroupMember"); }) },
  writingSessionCheckIn: { deleteMany: vi.fn(async () => { calls.push("writingSessionCheckIn"); }) },
  writingGroupVote: { deleteMany: vi.fn(async () => { calls.push("writingGroupVote"); }) },
  writingClassVote: { deleteMany: vi.fn(async () => { calls.push("writingClassVote"); }) },
  user: { delete: vi.fn(async () => { calls.push("user"); }) },
};

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), delete: vi.fn() },
    $transaction: vi.fn(async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx)),
  },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/database/prisma";
import { DELETE } from "@/app/api/admin/users/[userId]/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);

const adminSession = { user: { id: "admin-1", role: "admin" } };
const params = { params: Promise.resolve({ userId: "student-2" }) };
const zeroCounts = {
  submissions: 0,
  activityProgress: 0,
  pointsLedger: 0,
  achievements: 0,
  quizResponses: 0,
  speakingSubmissions: 0,
  writingSubmissions: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
  calls.length = 0;
});

describe("DELETE /api/admin/users/[userId]", () => {
  it("removes a never-engaged student's enrollments before deleting the user", async () => {
    mockSession.mockResolvedValue(adminSession);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "student-2",
      username: "noshow",
      role: "student",
      points: 0,
      isSystemAccount: false,
      _count: zeroCounts,
    } as never);

    const res = await DELETE(new Request("https://example.test", { method: "DELETE" }), params);

    expect(res.status).toBe(200);
    expect(tx.classEnrollment.deleteMany).toHaveBeenCalledWith({ where: { studentId: "student-2" } });
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: "student-2" } });
    expect(calls.at(-1)).toBe("user");
    expect(calls).toContain("classEnrollment");
    expect(mockPrisma.user.delete).not.toHaveBeenCalled();
  });

  it("does not delete a student who has done work", async () => {
    mockSession.mockResolvedValue(adminSession);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "student-2",
      username: "active",
      role: "student",
      points: 0,
      isSystemAccount: false,
      _count: { ...zeroCounts, submissions: 1 },
    } as never);

    const res = await DELETE(new Request("https://example.test", { method: "DELETE" }), params);

    expect(res.status).toBe(409);
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });
});
