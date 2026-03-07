import { expect, test } from "@playwright/test";

test.describe("Student flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/username/i).fill("e2e-student");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("student can view join class page and submit code", async ({ page }) => {
    await page.goto("/dashboard/join");
    await expect(page.getByRole("heading", { name: /join a class/i })).toBeVisible({ timeout: 5000 });

    await page.getByLabel(/class code/i).fill("E2ETEST");
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|classes)/, { timeout: 10000 });
  });
});
