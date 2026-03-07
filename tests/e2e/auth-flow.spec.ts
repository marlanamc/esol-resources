import { expect, test } from "@playwright/test";

test.describe("Auth flow", () => {
  test("login with valid credentials redirects to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/username/i).fill("e2e-teacher");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /dashboard|class|welcome/i })).toBeVisible({ timeout: 10000 });
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/username/i).fill("nonexistent");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 5000 });
  });
});
