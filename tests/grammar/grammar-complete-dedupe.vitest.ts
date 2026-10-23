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
vi.mock("@/lib/database/prisma", () => {
    const db = {
        $executeRaw: vi.fn(),
        $transaction: vi.fn(),
        activity: { findUnique: vi.fn() },
        pointsLedger: { findFirst: vi.fn() },
        activityProgress: { findFirst: vi.fn(), update: vi.fn(), create: vi.fn() },
        submission: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
        quizResponse: { createMany: vi.fn() },
    };
    db.$transaction.mockImplementation(async fn => fn(db));
    return { prisma: db };
});
vi.mock("@/lib/grammar-guide-registry", () => ({ getGrammarGuide: () => ({ loadContent: async () => ({ miniQuiz: Array(5).fill({}) }) }) }));

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
        id: "progress-1", progress: 99, status: "in_progress",
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

describe("Week 5 quiz effort", () => {
    it("credits a completed imperfect quiz without prior exercise credit", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);
        mockPrisma.activityProgress.findFirst.mockResolvedValue(null as never);
        const response = await grammarCompletePost(completeRequest({ slug: "questions-real-answers", score: 2, total: 5 }));
        expect((await response.json()).awarded).toBe(true);
        expect(mockAward).toHaveBeenCalledWith(expect.objectContaining({ dedupeKey: true }));
    });
    it("does not credit a partial quiz or navigation alone", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);
        mockPrisma.activityProgress.findFirst.mockResolvedValue(null as never);
        const response = await grammarCompletePost(completeRequest({ slug: "questions-real-answers", score: 1, total: 2 }));
        expect(response.status).toBe(400);
        expect(mockAward).not.toHaveBeenCalled();
    });
    it("reports no new points when the transactional award was deduplicated", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);
        mockAward.mockResolvedValue({deduped: true} as never);
        const response = await grammarCompletePost(completeRequest({ slug: "questions-real-answers", score: 2, total: 5 }));
        expect(await response.json()).toMatchObject({awarded: false, points: 0});
    });
});


describe("guide completion from mini-quiz submission", () => {
    it("marks a zero-score quiz complete and credits effort with no practice", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);
        mockPrisma.activityProgress.findFirst.mockResolvedValue(null as never);
        mockAward.mockResolvedValue({ deduped: false } as never);
        const res = await grammarCompletePost(completeRequest({ slug: "your-week-in-english", score: 0, total: 5 }));
        expect(res.status).toBe(200);
        expect(mockPrisma.activityProgress.create).toHaveBeenCalledWith({ data: {
            userId: "student-1", activityId: "verb-forms-overview-guide", assignmentId: null, progress: 100, status: "completed",
        } });
        expect(await res.json()).toMatchObject({ awarded: true, points: 5 });
    });
    it("repairs 99% even if completion points were already awarded, without changing exercise evidence", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue({ id: "credited" } as never);
        await grammarCompletePost(completeRequest({ slug: "your-week-in-english", score: 5, total: 5 }));
        expect(mockPrisma.activityProgress.update).toHaveBeenCalledWith({ where: { id: "progress-1" }, data: { progress: 100, status: "completed" } });
        expect(mockAward).not.toHaveBeenCalled();
    });
    it("keeps completion in the submitted assignment scope", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue({ id: "credited" } as never);
        await grammarCompletePost(completeRequest({ slug: "your-week-in-english", score: 1, total: 5, assignmentId: "class-assignment" }));
        expect(mockPrisma.activityProgress.findFirst).toHaveBeenCalledWith({ where: { userId: "student-1", activityId: "verb-forms-overview-guide", assignmentId: "class-assignment" }, orderBy: { updatedAt: "desc" } });
    });
    it("does not complete a guide just for navigation", async () => {
        mockPrisma.pointsLedger.findFirst.mockResolvedValue(null as never);
        mockPrisma.activityProgress.findFirst.mockResolvedValue(null as never);
        await grammarCompletePost(completeRequest({ slug: "your-week-in-english" }));
        expect(mockPrisma.activityProgress.update).not.toHaveBeenCalled();
        expect(mockPrisma.activityProgress.create).not.toHaveBeenCalled();
        expect(mockAward).not.toHaveBeenCalled();
    });
});
