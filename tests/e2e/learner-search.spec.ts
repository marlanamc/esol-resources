import { expect, test } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Learner search", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
  });

  test("quick search opens on mobile and navigates to a learner tool", async ({ page }) => {
    await page.getByRole("button", { name: /open search/i }).first().click();

    const dialog = page.getByRole("dialog", { name: /learner search/i });
    await expect(dialog).toBeVisible();

    await page.getByLabel(/search learner content/i).fill("grammar map");
    await expect(page.getByRole("link", { name: /grammar map/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("link", { name: /grammar map/i }).click();

    await expect(page).toHaveURL(/\/grammar-map/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /level 3 grammar map/i })).toBeVisible();
  });

  test("dedicated search page supports broad filters and avoids duplicate grammar destinations", async ({ page }) => {
    await page.goto("/dashboard/search");
    await expect(page.getByRole("heading", { name: /find lessons and tools fast/i })).toBeVisible();

    await page.getByLabel(/search learner content/i).fill("present simple");
    const grammarFilter = page.getByRole("button", { name: /grammar/i }).first();
    await grammarFilter.click();

    await expect(page).toHaveURL(/filter=grammar/, { timeout: 10000 });
    await expect(page.getByRole("link", { name: /^present simple$/i })).toHaveCount(1);
  });

  test("quick search is dismissible and hidden content does not appear as a learner result", async ({ page }) => {
    await page.goto("/dashboard/search");
    await page.getByLabel(/search learner content/i).fill("classroom basics");
    await expect(page.getByRole("link", { name: /classroom basics/i })).toHaveCount(0);

    await page.getByRole("button", { name: /open search/i }).first().click();
    const dialog = page.getByRole("dialog", { name: /learner search/i });
    await expect(dialog).toBeVisible();
    await page.getByRole("button", { name: /close search/i }).click();
    await expect(dialog).toHaveCount(0);
  });
});
