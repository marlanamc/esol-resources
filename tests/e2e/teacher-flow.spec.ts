import { expect, test } from "@playwright/test";
import { loginAsTeacher } from "./helpers/auth";

test.describe("Teacher flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTeacher(page, {
      attempts: 2,
      timeout: 20000,
      waitForNetworkIdle: true,
    });
  });

  test("teacher can view dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { level: 1 }).filter({ hasText: /welcome,/i })
    ).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("link", { name: /^Classes$/i })).toBeVisible({ timeout: 5000 });
  });

  test("teacher can navigate to classes", async ({ page }) => {
    await page.goto("/dashboard/classes");
    await expect(page.getByRole("heading", { name: /^Your Classes$/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("link", { name: /^\+ New Class$/i })).toBeVisible({ timeout: 5000 });
  });
});
