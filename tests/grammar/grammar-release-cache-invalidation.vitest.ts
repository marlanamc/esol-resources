import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/database/prisma", () => ({
    prisma: {
        activity: { findFirst: vi.fn(), update: vi.fn() },
    },
}));
vi.mock("@/lib/grammar-guide-activity", () => ({
    invalidateGrammarGuideActivityCache: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/database/prisma";
import { invalidateGrammarGuideActivityCache } from "@/lib/grammar-guide-activity";
import { POST as grammarReleasePost } from "@/app/api/grammar/release/route";

const mockSession = vi.mocked(getServerSession);
const mockPrisma = vi.mocked(prisma, true);
const mockInvalidate = vi.mocked(invalidateGrammarGuideActivityCache);

function releaseRequest(body: unknown): Request {
    return new Request("https://example.test/api/grammar/release", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    mockSession.mockResolvedValue({ user: { id: "teacher-1", role: "teacher" } });
});

describe("grammar release cache invalidation", () => {
    it("drops the guide lookup cache after toggling release", async () => {
        mockPrisma.activity.findFirst.mockResolvedValue({
            type: "guide",
            category: "grammar",
            title: "Present Simple",
        } as never);
        mockPrisma.activity.update.mockResolvedValue({} as never);

        const res = await grammarReleasePost(
            releaseRequest({ activityId: "guide-1", released: true })
        );

        expect(res.status).toBe(200);
        expect(mockPrisma.activity.update).toHaveBeenCalledWith({
            where: { id: "guide-1" },
            data: { isReleased: true },
        });
        expect(mockInvalidate).toHaveBeenCalledTimes(1);
    });

    it("does not invalidate when the activity is not a grammar guide", async () => {
        mockPrisma.activity.findFirst.mockResolvedValue({
            type: "quiz",
            category: "grammar",
            title: "Some Quiz",
        } as never);

        const res = await grammarReleasePost(
            releaseRequest({ activityId: "quiz-1", released: true })
        );

        expect(res.status).toBe(400);
        expect(mockPrisma.activity.update).not.toHaveBeenCalled();
        expect(mockInvalidate).not.toHaveBeenCalled();
    });
});
