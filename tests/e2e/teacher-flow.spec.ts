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

    test("home exposes roster, activity, and gradebook without nested navigation", async ({
        page,
    }) => {
        const roster = page.getByRole("region", {
            name: "Class roster",
            exact: true,
        });
        await expect(roster).toBeVisible();
        test.skip(
            (await roster.locator("tbody a").count()) === 0,
            "Requires an enrolled student fixture",
        );
        await expect(
            page.getByRole("heading", { name: "Recent class activity" }),
        ).toBeVisible();
        const shortcuts = page.getByRole("navigation", {
            name: "Class shortcuts",
        });
        await expect(
            shortcuts.getByRole("link", { name: "Roster", exact: true }),
        ).toHaveAttribute("href", "#roster");
        await expect(
            shortcuts.getByRole("link", { name: "Gradebook" }),
        ).toHaveAttribute("href", /classId=/);
        await roster
            .getByRole("textbox", { name: "Search roster" })
            .fill("no-such-student-000");
        await expect(
            roster.getByText("No matching students. Try another name."),
        ).toBeVisible();
        await roster.getByRole("textbox", { name: "Search roster" }).fill("");
        await roster
            .getByRole("combobox", { name: "Sort roster" })
            .selectOption("week");
        const percentages = await roster
            .locator("progress")
            .evaluateAll((elements) =>
                elements.map((el) => {
                    const progress = el as HTMLProgressElement;
                    return progress.value / progress.max;
                }),
            );
        expect(percentages).toEqual([...percentages].sort((a, b) => a - b));
        const student = roster.locator("tbody a").first();
        await student.click();
        const back = page.getByRole("link", { name: "Back to workspace" });
        await expect(back).toHaveAttribute("href", /classId=.*#roster$/);
        await back.click();
        await expect(roster).toBeVisible();
        await page.getByRole("link", { name: "Full roster →" }).click();
        await expect(
            page.getByRole("columnheader", { name: "Course map", exact: true }),
        ).toBeAttached();
        const actions = page.locator(".roster-actions").first();
        await actions.locator("summary").click();
        await expect(
            actions.getByRole("button", { name: "Graduate", exact: true }),
        ).toBeVisible();
        await expect(
            actions.getByRole("button", { name: "Remove", exact: true }),
        ).toBeVisible();
    });

    test("workspace reflows without page overflow", async ({ page }) => {
        test.skip(
            await page
                .getByRole("heading", {
                    name: "Your teaching workspace",
                    exact: true,
                })
                .isVisible(),
            "Requires a visible teaching class fixture",
        );
        for (const width of [1440, 1024, 720, 375]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(
                page.getByRole("textbox", { name: "Search roster" }),
            ).toBeVisible();
            expect(
                await page.evaluate(
                    () =>
                        document.documentElement.scrollWidth <=
                        window.innerWidth,
                ),
            ).toBe(true);
        }
    });

    test("activity expands and class selection follows gradebook navigation", async ({
        page,
    }) => {
        const report = page.getByRole("region", {
            name: "Class Activity Report",
        });
        await expect(
            report.getByRole("heading", { name: "Recent class activity" }),
        ).toBeVisible();
        const more = report.getByRole("button", { name: "Show more activity" });
        if (await more.isVisible()) {
            await expect(report.getByRole("link")).toHaveCount(5);
            await more.click();
            expect(await report.getByRole("link").count()).toBeGreaterThan(5);
            await report
                .getByRole("button", { name: "Show less activity" })
                .click();
            await expect(report.getByRole("link")).toHaveCount(5);
        }
        await report.getByRole("tab", { name: /^Daily/ }).click();
        await expect(
            report.getByRole("tab", { name: /^Daily/ }),
        ).toHaveAttribute("aria-selected", "true");
        const switcher = page.getByRole("combobox", { name: "Switch class" });
        if (await switcher.isVisible()) {
            const selected = await switcher.inputValue();
            const other = await switcher
                .locator("option")
                .evaluateAll(
                    (options, value) =>
                        options
                            .map((o) => (o as HTMLOptionElement).value)
                            .find((v) => v !== value),
                    selected,
                );
            if (other) {
                await switcher.selectOption(other);
                await expect(switcher).toHaveValue(other);
                const gradebook = page
                    .getByRole("navigation", { name: "Class shortcuts" })
                    .getByRole("link", { name: "Gradebook" });
                await expect(gradebook).toHaveAttribute(
                    "href",
                    `/teach/gradebook?classId=${other}`,
                );
                await gradebook.click();
                await expect(page).toHaveURL(new RegExp(`classId=${other}`));
                await expect(switcher).toHaveValue(other);
            }
        }
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
