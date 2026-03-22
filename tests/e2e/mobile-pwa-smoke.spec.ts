import { expect, test, type Page } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

async function expectDocumentUnlocked(page: Page) {
  await expect
    .poll(async () => {
      return page.evaluate(() => ({
        bodyInlineOverflow: document.body.style.overflow,
        htmlInlineOverflow: document.documentElement.style.overflow,
        inertMainCount: document.querySelectorAll("main[inert]").length,
      }));
    })
    .toEqual({
      bodyInlineOverflow: "",
      htmlInlineOverflow: "",
      inertMainCount: 0,
    });
}

test.describe("Mobile PWA smoke", () => {
  test("login page renders mobile-safe controls", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /sign in to continue/i })).toBeVisible();
    const signInButton = page.getByRole("button", { name: /sign in/i });
    await expect(signInButton).toBeVisible();

    const box = await signInButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("offline route is available", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /you are offline/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to dashboard/i })).toBeVisible();
  });

  test("manifest has required install metadata", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/dashboard");
    expect(manifest.icons?.length).toBeGreaterThan(0);
  });

  test("service worker exposes offline fallback strategy", async ({ request }) => {
    const response = await request.get("/sw.js");
    expect(response.ok()).toBeTruthy();
    const scriptText = await response.text();

    expect(scriptText).toContain('const OFFLINE_URL = "/offline"');
    expect(scriptText).toContain('requestUrl.pathname.startsWith("/api/")');
  });

  test("learner menu navigation releases document locks on mobile", async ({ page }) => {
    await loginAsStudent(page, {
      attempts: 2,
      submitDelayMs: 500,
      submitMethod: "tap",
      waitForNetworkIdle: true,
    });

    const menuButton = page.getByRole("button", { name: /open navigation menu/i }).first();
    await menuButton.click();

    const menuDialog = page.locator('div[role="dialog"][aria-label="Navigation Menu"]');
    await expect(menuDialog).toBeVisible();

    await page.getByRole("link", { name: /grammar map/i }).click();
    await expect(page).toHaveURL(/\/grammar-map/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /level 3 grammar map/i })).toBeVisible();

    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuDialog).toBeVisible();
    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(menuDialog).toHaveAttribute("aria-hidden", "true");

    await expectDocumentUnlocked(page);
  });

  test("pagehide closes learner menu and clears mobile document locks", async ({ page }) => {
    await loginAsStudent(page, {
      attempts: 2,
      submitDelayMs: 500,
      submitMethod: "tap",
      waitForNetworkIdle: true,
    });

    const menuButton = page.getByRole("button", { name: /open navigation menu/i }).first();
    await menuButton.click();

    const menuDialog = page.locator('div[role="dialog"][aria-label="Navigation Menu"]');
    await expect(menuDialog).toBeVisible();

    await page.evaluate(() => {
      window.dispatchEvent(new Event("pagehide"));
    });

    await expect(menuDialog).toHaveAttribute("aria-hidden", "true");
    await expectDocumentUnlocked(page);
  });

  test("mobile body background does not use fixed attachment", async ({ page }) => {
    await page.goto("/login");

    const backgroundAttachment = await page.evaluate(() => getComputedStyle(document.body).backgroundAttachment);
    expect(backgroundAttachment).not.toContain("fixed");
  });
});
