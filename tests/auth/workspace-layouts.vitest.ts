import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("next/navigation", () => ({
    redirect: (path: string) => {
        throw new Error(`redirect:${path}`);
    },
}));
vi.mock("@/components/workspace/WorkspaceLayout", () => ({
    WorkspaceLayout: () => null,
}));
import { getServerSession } from "next-auth";
import TeachLayout from "@/app/teach/layout";
import AdminLayout from "@/app/admin/layout";
const session = vi.mocked(getServerSession);
beforeEach(() => vi.clearAllMocks());
describe("workspace access boundaries", () => {
    it("requires sign-in for both shells", async () => {
        session.mockResolvedValue(null);
        await expect(TeachLayout({ children: null })).rejects.toThrow(
            "redirect:/login",
        );
        await expect(AdminLayout({ children: null })).rejects.toThrow(
            "redirect:/login",
        );
    });
    it("keeps students out of teaching and admin", async () => {
        session.mockResolvedValue({ user: { id: "student", role: "student" } });
        await expect(TeachLayout({ children: null })).rejects.toThrow(
            "redirect:/dashboard",
        );
        await expect(AdminLayout({ children: null })).rejects.toThrow(
            "redirect:/dashboard",
        );
    });
    it("keeps teachers out of administration", async () => {
        session.mockResolvedValue({ user: { id: "teacher", role: "teacher" } });
        await expect(AdminLayout({ children: null })).rejects.toThrow(
            "redirect:/teach",
        );
    });
});
