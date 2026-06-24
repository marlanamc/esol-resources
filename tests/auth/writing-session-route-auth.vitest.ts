import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    writingSession: { findUnique: vi.fn() },
    classEnrollment: { findFirst: vi.fn() },
    writingSessionCheckIn: { upsert: vi.fn(), findMany: vi.fn() },
    writingGroupMember: { findFirst: vi.fn() },
    writingRound: { findFirst: vi.fn() },
    writingSubmission: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      upsert: vi.fn(),
    },
    writingGroupVote: { upsert: vi.fn(), findUnique: vi.fn() },
    writingClassVote: { upsert: vi.fn(), findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { GET as stateGet } from "@/app/api/writing-session/[id]/state/route";
import { POST as votePost } from "@/app/api/writing-session/[id]/vote/route";
import { POST as submitPost } from "@/app/api/writing-session/[id]/submit/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);

const studentSession = { user: { id: "student-1", role: "student" } };
const params = { params: Promise.resolve({ id: "ws-1" }) };

function jsonRequest(body: unknown): NextRequest {
  return new Request("https://example.test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;
}

const getRequest = new Request("https://example.test") as unknown as NextRequest;

const baseSession = {
  id: "ws-1",
  classId: "class-1",
  teacherId: "teacher-1",
  status: "waiting",
  currentRound: 0,
  timerEndsAt: null,
  groups: [] as unknown[],
  rounds: [] as unknown[],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("writing-session state route authorization", () => {
  it("returns 401 when unauthenticated", async () => {
    mockSession.mockResolvedValue(null);
    const res = await stateGet(getRequest, params);
    expect(res.status).toBe(401);
  });

  it("rejects students who are not enrolled in the session's class", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(baseSession as never);
    mockPrisma.classEnrollment.findFirst.mockResolvedValue(null as never);

    const res = await stateGet(getRequest, params);

    expect(res.status).toBe(403);
    expect(mockPrisma.classEnrollment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          classId: "class-1",
          studentId: "student-1",
          status: "active",
        }),
      })
    );
    expect(mockPrisma.writingSessionCheckIn.upsert).not.toHaveBeenCalled();
  });

  it("checks in enrolled students during the waiting lobby", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(baseSession as never);
    mockPrisma.classEnrollment.findFirst.mockResolvedValue({ id: "enr-1" } as never);
    mockPrisma.writingSessionCheckIn.upsert.mockResolvedValue({} as never);

    const res = await stateGet(getRequest, params);

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: "waiting" });
    expect(mockPrisma.writingSessionCheckIn.upsert).toHaveBeenCalled();
  });
});

describe("writing-session vote route authorization", () => {
  const voteSession = { ...baseSession, status: "group-vote" };

  it("returns 400 on malformed JSON instead of crashing", async () => {
    mockSession.mockResolvedValue(studentSession);
    const res = await votePost(jsonRequest("{"), params);
    expect(res.status).toBe(400);
  });

  it("rejects voters who are not session participants", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(voteSession as never);
    mockPrisma.writingGroupMember.findFirst.mockResolvedValue(null as never);

    const res = await votePost(jsonRequest({ submissionId: "sub-1", voteType: "group" }), params);

    expect(res.status).toBe(403);
    expect(mockPrisma.writingGroupVote.upsert).not.toHaveBeenCalled();
  });

  it("rejects group votes for another group's submission", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(voteSession as never);
    mockPrisma.writingGroupMember.findFirst.mockResolvedValue({ groupId: "group-A" } as never);
    mockPrisma.writingRound.findFirst.mockResolvedValue({ id: "round-1" } as never);
    mockPrisma.writingSubmission.findFirst.mockResolvedValue(
      { id: "sub-1", roundId: "round-1", groupId: "group-B", studentId: "student-2" } as never
    );

    const res = await votePost(jsonRequest({ submissionId: "sub-1", voteType: "group" }), params);

    expect(res.status).toBe(400);
    expect(mockPrisma.writingGroupVote.upsert).not.toHaveBeenCalled();
  });

  it("records a valid group vote within the voter's own group", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(voteSession as never);
    mockPrisma.writingGroupMember.findFirst.mockResolvedValue({ groupId: "group-A" } as never);
    mockPrisma.writingRound.findFirst.mockResolvedValue({ id: "round-1" } as never);
    mockPrisma.writingSubmission.findFirst.mockResolvedValue(
      { id: "sub-1", roundId: "round-1", groupId: "group-A", studentId: "student-2" } as never
    );
    mockPrisma.writingGroupVote.upsert.mockResolvedValue({} as never);

    const res = await votePost(jsonRequest({ submissionId: "sub-1", voteType: "group" }), params);

    expect(res.status).toBe(200);
    expect(mockPrisma.writingGroupVote.upsert).toHaveBeenCalled();
  });
});

describe("writing-session submit route authorization", () => {
  it("rejects submissions from students who are not in a group", async () => {
    mockSession.mockResolvedValue(studentSession);
    mockPrisma.writingSession.findUnique.mockResolvedValue(
      {
        ...baseSession,
        status: "writing",
        groups: [{ id: "group-A", members: [{ studentId: "someone-else" }] }],
      } as never
    );

    const res = await submitPost(jsonRequest({ text: "hello" }), params);

    expect(res.status).toBe(403);
    expect(mockPrisma.writingSubmission.upsert).not.toHaveBeenCalled();
  });
});
