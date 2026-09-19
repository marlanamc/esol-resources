import { expect, test } from "@playwright/test";
import { loginAsTeacher } from "./helpers/auth";

// Optional local-only session fixture avoids changing shared account credentials.
const previewState = process.env.WORKSPACE_TEST_STORAGE;
if (
    previewState &&
    !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(
        process.env.PLAYWRIGHT_BASE_URL ?? "",
    )
) {
    throw new Error("Workspace preview sessions are restricted to localhost");
}
if (previewState) test.use({ storageState: previewState });

test.describe("Teaching workspace", () => {
    test.beforeEach(async ({ page }) => {
        if (!previewState)
            await loginAsTeacher(page, {
                attempts: 2,
                timeout: 20000,
                waitForNetworkIdle: true,
            });
        await page.goto("/teach");
    });

    test("teacher can open the workspace and class list", async ({ page }) => {
        await expect(page.locator("#main-content h1")).toHaveText(
            /Ready for class|Your teaching workspace/,
        );
        await page.goto("/teach/classes");
        await expect(
            page.getByRole("heading", { name: "Your Classes" }),
        ).toBeVisible();
        await expect(
            page.getByRole("link", { name: /New class/i }),
        ).toHaveAttribute("href", "/teach/classes/new");
    });

    test("mobile navigation opens and restores keyboard focus", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        const more = page.getByRole("button", { name: "More navigation" });
        await more.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(
            page.getByRole("dialog").getByRole("link", { name: "Calendar" }),
        ).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).not.toBeVisible();
        await expect(more).toBeFocused();
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
        ).toBe(true);
    });

    test("participation filters survive reload", async ({ page }) => {
        await page.goto("/teach/reports?status=never&q=sample");
        await expect(
            page.getByRole("textbox", { name: "Search students" }),
        ).toHaveValue("sample");
        await expect(
            page.getByRole("combobox", { name: "Participation filter" }),
        ).toHaveValue("never");
        await page.reload();
        await expect(
            page.getByRole("textbox", { name: "Search students" }),
        ).toHaveValue("sample");
        await expect(
            page.getByRole("combobox", { name: "Participation filter" }),
        ).toHaveValue("never");
    });

    test("legacy new-class bookmark reaches the teaching shell", async ({
        page,
    }) => {
        await page.goto("/dashboard/classes/new");
        await expect(page).toHaveURL(/\/teach\/classes\/new/);
        await expect(
            page.getByRole("heading", { name: "Create New Class" }),
        ).toBeVisible();
    });
});
