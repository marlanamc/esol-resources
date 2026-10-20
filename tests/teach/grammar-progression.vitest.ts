import { describe, it, expect, vi, beforeEach } from "vitest";
import { parse } from "node-html-parser";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));

import { getServerSession } from "next-auth";
import { GET } from "@/app/api/teach/grammar-reference-sheet/route";
import { PROGRESSION_PAGES, loadProgressionPage } from "@/lib/teach/grammar-progression";

const mockSession = vi.mocked(getServerSession);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("grammar reference sheet route", () => {
    it("is for teachers only", async () => {
        mockSession.mockResolvedValue(null);
        expect((await GET()).status).toBe(401);
        mockSession.mockResolvedValue({ user: { id: "student-1", role: "student" } });
        expect((await GET()).status).toBe(403);
        mockSession.mockResolvedValue({ user: { id: "teacher-1", role: "teacher" } });
        const res = await GET();
        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toContain("text/html");
    });
});

describe("loadProgressionPage", () => {
    it("loads every page without its standalone header or nav", async () => {
        for (const { slug } of PROGRESSION_PAGES) {
            const page = await loadProgressionPage(slug, 6);
            expect(page.title, slug).not.toBe(slug);
            expect(page.html, slug).not.toContain("site-nav");
            expect(page.html, slug).not.toContain('class="page"');
        }
    });

    it("keeps every link inside the workspace", async () => {
        for (const { slug } of PROGRESSION_PAGES) {
            const { html } = await loadProgressionPage(slug, 6);
            for (const link of parse(html).querySelectorAll("a[href]")) {
                const href = link.getAttribute("href")!;
                expect(href, `${slug}: ${href}`).toMatch(
                    /^(#|\/teach\/progression\?page=|\/api\/teach\/grammar-reference-sheet|https:\/\/)/
                );
            }
        }
    });

    it("shows lesson previews one week at a time", async () => {
        const page = await loadProgressionPage("lessons", 6);
        const root = parse(page.html);
        expect(root.querySelectorAll("article.week-card").map((a) => a.id)).toEqual(["w6"]);
        expect(page.weeks).toContain(36);
        expect((await loadProgressionPage("lessons", 999)).html).toContain('id="w1"');
    });

    it("labels sequence cells so rows can stack on a phone", async () => {
        const root = parse((await loadProgressionPage("sequence")).html);
        const cell = root.querySelector("table.gp-stack tbody td:nth-child(3)");
        expect(cell?.getAttribute("data-label")).toBe("Required guide");
    });
});
