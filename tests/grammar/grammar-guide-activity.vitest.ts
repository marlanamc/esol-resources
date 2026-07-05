import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
    unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
    revalidateTag: vi.fn(),
}));
vi.mock("@/lib/shared/logger", () => ({
    logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/database/prisma", () => ({
    prisma: {
        activity: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/database/prisma";
import {
    GRAMMAR_GUIDE_ACTIVITY_TAG,
    getGrammarGuideActivity,
    invalidateGrammarGuideActivityCache,
    lookupGrammarGuideActivity,
} from "@/lib/grammar-guide-activity";

const mockPrisma = vi.mocked(prisma, true);
const mockRevalidateTag = vi.mocked(revalidateTag);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("lookupGrammarGuideActivity", () => {
    it("prefers the canonical released mini-quiz guide among duplicate titles", async () => {
        mockPrisma.activity.findMany.mockResolvedValue([
            {
                id: "legacy-guide",
                title: "Present Simple",
                content: "{}",
                isReleased: false,
            },
            {
                id: "canonical-guide",
                title: "Present Simple",
                content: JSON.stringify({ miniQuiz: { questions: [] } }),
                isReleased: true,
            },
        ] as never);
        mockPrisma.activity.findUnique.mockResolvedValue({ isReleased: true } as never);

        const result = await lookupGrammarGuideActivity("Present Simple");

        expect(result).toEqual({ id: "canonical-guide", isReleased: true });
        expect(mockPrisma.activity.findFirst).not.toHaveBeenCalled();
    });

    it("falls back to a direct title match when no canonical candidate exists", async () => {
        mockPrisma.activity.findMany.mockResolvedValue([] as never);
        mockPrisma.activity.findFirst.mockResolvedValue({
            id: "plain-guide",
            isReleased: false,
        } as never);

        const result = await lookupGrammarGuideActivity("Past Perfect");

        expect(result).toEqual({ id: "plain-guide", isReleased: false });
        expect(mockPrisma.activity.findFirst).toHaveBeenCalledWith({
            where: { title: "Past Perfect", type: "guide", category: "grammar" },
            select: { id: true, isReleased: true },
        });
    });

    it("returns null when no activity row matches the title", async () => {
        mockPrisma.activity.findMany.mockResolvedValue([] as never);
        mockPrisma.activity.findFirst.mockResolvedValue(null as never);

        await expect(lookupGrammarGuideActivity("Missing Guide")).resolves.toBeNull();
    });
});

describe("getGrammarGuideActivity", () => {
    it("returns null instead of throwing when the database is unreachable", async () => {
        mockPrisma.activity.findMany.mockRejectedValue(new Error("db down"));

        await expect(getGrammarGuideActivity("Present Simple")).resolves.toBeNull();
    });
});

describe("invalidateGrammarGuideActivityCache", () => {
    it("revalidates the grammar guide tag", () => {
        invalidateGrammarGuideActivityCache();

        expect(mockRevalidateTag).toHaveBeenCalledWith(GRAMMAR_GUIDE_ACTIVITY_TAG, "max");
    });

    it("no-ops when revalidateTag is unavailable outside Next.js", () => {
        mockRevalidateTag.mockImplementation(() => {
            throw new Error("outside request scope");
        });

        expect(() => invalidateGrammarGuideActivityCache()).not.toThrow();
    });
});
