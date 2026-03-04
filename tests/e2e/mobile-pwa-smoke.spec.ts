import { expect, test } from "@playwright/test";

test.describe("Mobile PWA smoke", () => {
  test("login page renders mobile-safe controls", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /sign in to your account/i })).toBeVisible();
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
});
