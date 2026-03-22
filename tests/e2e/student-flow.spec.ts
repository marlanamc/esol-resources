import { expect, test } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Student flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
  });

  test("student can view join class page and submit code", async ({ page }) => {
    await page.goto("/dashboard/join");
    await expect(page.getByRole("heading", { name: /join a class/i })).toBeVisible({ timeout: 5000 });

    await page.getByLabel(/class code/i).fill("E2ETEST");
    await page.getByRole("button", { name: /join/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|classes)/, { timeout: 10000 });
  });
});
