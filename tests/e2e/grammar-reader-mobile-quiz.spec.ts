import { expect, test, type Page } from "@playwright/test";

async function loginAsStudent(page: Page) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto("/login");
    await page.getByLabel(/username/i).fill("e2e-student");
    await page.locator('input[name="password"]').fill("password123");
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /sign in/i }).tap({ position: { x: 50, y: 25 } });

    try {
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

test.describe("Grammar reader mobile mini quiz", () => {
  test("keeps the quiz submit action accessible on mobile", async ({ page }) => {
    await loginAsStudent(page);

    await page.goto("/grammar-reader/present-simple", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("grammar-reader-shell")).toBeVisible();

    for (let step = 0; step < 8; step += 1) {
      await page.getByRole("button", { name: /next section/i }).click();
    }

    await page.getByRole("button", { name: /take quiz/i }).click();

    const submitButton = page.getByRole("button", { name: /submit quiz/i });

    await expect(submitButton).toBeVisible();
    await expect(page.getByRole("button", { name: /^Prev$/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Finish$/ })).toHaveCount(0);

    const answeredQuestions = await page.evaluate(() => {
      const answered = new Set<string>();
      const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

      for (const input of radios) {
        if (answered.has(input.name)) continue;
        input.click();
        answered.add(input.name);
      }

      return answered.size;
    });

    expect(answeredQuestions).toBe(18);

    await expect(page.getByText("18/18")).toBeVisible();
    await expect(submitButton).toBeEnabled();

    await submitButton.click();

    await expect(page.getByText(/score:\s*\d+\s*\/\s*18/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Finish$/ })).toBeVisible();
  });
});
