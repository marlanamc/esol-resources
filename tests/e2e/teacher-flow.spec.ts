import { expect, test } from "@playwright/test";

test.describe("Teacher flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/username/i).fill("e2e-teacher");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("teacher can view dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/class|dashboard|students/i)).toBeVisible({ timeout: 5000 });
  });

  test("teacher can navigate to classes", async ({ page }) => {
    await page.goto("/dashboard/classes");
    await expect(page.getByRole("heading", { name: /classes|class/i })).toBeVisible({ timeout: 5000 });
  });
});
