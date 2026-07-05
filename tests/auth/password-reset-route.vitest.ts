import { describe, it, expect, vi, beforeEach } from "vitest";

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
  },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/database/prisma";
import { POST as passwordResetPost } from "@/app/api/auth/password-reset/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);

function jsonRequest(body: unknown): Request {
  return new Request("https://example.test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const mustChangeUser = {
  id: "student-1",
  password: "old-hash",
  mustChangePassword: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("password-reset route", () => {
  it("returns 401 when unauthenticated", async () => {
    mockSession.mockResolvedValue(null);
    const res = await passwordResetPost(jsonRequest({ newPassword: "whatever" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 (not 500) on malformed JSON", async () => {
    mockSession.mockResolvedValue({ user: { id: "student-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser as never);

    const res = await passwordResetPost(jsonRequest("{"));

    expect(res.status).toBe(400);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("rejects passwords below the minimum length", async () => {
    mockSession.mockResolvedValue({ user: { id: "student-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser as never);

    const res = await passwordResetPost(jsonRequest({ newPassword: "ab" }));

    expect(res.status).toBe(400);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("hashes and saves an acceptable new password", async () => {
    mockSession.mockResolvedValue({ user: { id: "student-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mustChangeUser as never);
    mockPrisma.user.update.mockResolvedValue({} as never);

    const res = await passwordResetPost(jsonRequest({ newPassword: "Bright-Garden-42" }));

    expect(res.status).toBe(200);
    const updateArgs = mockPrisma.user.update.mock.calls[0][0];
    expect(updateArgs.where).toEqual({ id: "student-1" });
    expect(updateArgs.data.mustChangePassword).toBe(false);
    // Stored value must be a bcrypt hash, never the raw password
    expect(updateArgs.data.password).not.toBe("Bright-Garden-42");
    expect(String(updateArgs.data.password)).toMatch(/^\$2/);
  });

  it("returns 500 with a generic message when the database fails", async () => {
    mockSession.mockResolvedValue({ user: { id: "student-1" } });
    mockPrisma.user.findUnique.mockRejectedValue(new Error("db down"));

    const res = await passwordResetPost(jsonRequest({ newPassword: "Bright-Garden-42" }));

    expect(res.status).toBe(500);
  });
});
