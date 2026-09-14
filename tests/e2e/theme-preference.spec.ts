import { expect, test } from "@playwright/test";

test.describe("Theme preference", () => {
  test.use({ colorScheme: "dark" });

  test("defaults to light even when the device prefers dark", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("treats a saved System preference as light", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("class-companion-theme", "system");
    });
    await page.goto("/login");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("keeps an explicitly selected dark preference", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("class-companion-theme", "dark");
    });
    await page.goto("/login");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});
