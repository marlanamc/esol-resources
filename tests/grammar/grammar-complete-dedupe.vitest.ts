import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/shared/logger", () => ({
    logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/grammar-activity-resolution", () => ({
    resolveCanonicalGrammarActivityId: vi.fn().mockResolvedValue("verb-forms-overview-guide"),
}));
vi.mock("@/lib/gamification/award-chain", () => ({ applyAwardChain: vi.fn() }));
vi.mock("@/lib/database/prisma", () => ({
    prisma: {
        activity: { findUnique: vi.fn() },
        pointsLedger: { findFirst: vi.fn() },
        activityProgress: { findFirst: vi.fn() },
        submission: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
        quizResponse: { createMany: vi.fn() },
    },
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/database/prisma";
import { applyAwardChain } from "@/lib/gamification/award-chain";
import { POST as grammarCompletePost } from "@/app/api/grammar/complete/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);
const mockAward = vi.mocked(applyAwardChain);

function completeRequest(body: unknown): Request {
    return new Request("https://example.test/api/grammar/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    mockSession.mockResolvedValue({ user: { id: "student-1", role: "student" } });
    mockPrisma.activity.findUnique.mockResolvedValue({
        id: "verb-forms-overview-guide",
        title: "Verb Forms Overview",
    } as never);
    mockPrisma.submission.findFirst.mockResolvedValue(null as never);
    mockPrisma.activityProgress.findFirst.mockResolvedValue({
        categoryData: JSON.stringify({
            exercises: { a: { completed: true, completedAt: "", pointsAwarded: 2 } },
            totalExercisePoints: 2,
        }),
    } as never);
});

describe("grammar completion points", () => {
    it("does not re-award on a mini-quiz retake when the award used the display reason", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue({ id: "ledger-1" } as never);

        const res = await grammarCompletePost(
            completeRequest({ slug: "verb-forms-overview", score: 5, total: 5 })
        );

        expect(res.status).toBe(200);
        expect(mockPrisma.pointsLedger.findFirst).toHaveBeenCalledWith({
            where: {
                userId: "student-1",
                reason: { in: ["grammar:verb-forms-overview", "Verb Forms Overview|Grammar Guide"] },
            },
        });
        expect(mockAward).not.toHaveBeenCalled();
    });

    it("awards once when no completion has been recorded", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);

        await grammarCompletePost(completeRequest({ slug: "verb-forms-overview" }));

        expect(mockAward).toHaveBeenCalledWith(
            expect.objectContaining({ userId: "student-1", reason: "Verb Forms Overview|Grammar Guide" })
        );
    });
});
