import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));

import { getServerSession } from "next-auth";
import { GET } from "@/app/api/teach/grammar-progression/[file]/route";

const mockSession = vi.mocked(getServerSession);
const teacherSession = { user: { id: "teacher-1", role: "teacher" } };

const get = (file: string) =>
    GET(new Request("https://example.test"), { params: Promise.resolve({ file }) });

beforeEach(() => {
    vi.clearAllMocks();
});

describe("grammar progression route", () => {
    it("requires a signed-in teacher", async () => {
        mockSession.mockResolvedValue(null);
        expect((await get("index.html")).status).toBe(401);
        mockSession.mockResolvedValue({ user: { id: "student-1", role: "student" } });
        expect((await get("index.html")).status).toBe(403);
    });

    it("serves pages framed only by this site", async () => {
        mockSession.mockResolvedValue(teacherSession);
        const res = await get("weeks.html");
        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toContain("text/html");
        expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
        const html = await res.text();
        expect(html).toContain('id="w1"');
        expect(html).not.toContain("FY27/reference-sheets");
        expect(html).toContain('href="reference-sheet.html#');
    });

    it("serves the Grammar Companion and the stylesheet", async () => {
        mockSession.mockResolvedValue(teacherSession);
        expect((await get("reference-sheet.html")).status).toBe(200);
        const css = await get("style.css");
        expect(css.headers.get("content-type")).toContain("text/css");
    });

    it("refuses anything outside the reference pages", async () => {
        mockSession.mockResolvedValue(teacherSession);
        for (const file of ["..%2F..%2Fpackage.json", "../../.env", "reference-pages.json", "missing.html", ".env"]) {
            expect((await get(file)).status).toBe(404);
        }
    });
});
