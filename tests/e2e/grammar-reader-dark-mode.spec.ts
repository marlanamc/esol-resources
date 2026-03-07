import { expect, test, type Locator, type Page } from "@playwright/test";

const GUIDE_SLUGS = [
  "past-perfect-family",
  "information-questions",
  "future-perfect-family",
] as const;

function parseRgb(value: string): [number, number, number] {
  const match = value.match(/\d+(\.\d+)?/g);
  if (!match || match.length < 3) {
    throw new Error(`Unable to parse rgb value: ${value}`);
  }
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function luminance([r, g, b]: [number, number, number]) {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(foreground: [number, number, number], background: [number, number, number]) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

async function loginWithDarkTheme(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("class-companion-theme", "dark");
  });

  await page.goto("/login");
  await page.getByLabel(/username/i).fill("e2e-teacher");
  await page.getByLabel(/password/i).fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

type StyleSnapshot = {
  color: string;
  backgroundColor: string;
  text: string;
};

async function getStyleSnapshot(locator: Locator) {
  return locator.evaluate((element) => {
    const resolvedBackground = (node: Element | null): string => {
      let current: Element | null = node;
      while (current) {
        const { backgroundColor } = window.getComputedStyle(current);
        if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
          return backgroundColor;
        }
        current = current.parentElement;
      }
      return window.getComputedStyle(document.body).backgroundColor;
    };

    const computed = window.getComputedStyle(element);
    return {
      color: computed.color,
      backgroundColor: resolvedBackground(element),
      text: (element.textContent || "").trim(),
    };
  });
}

async function expectReadable(locator: Locator, minContrast = 3) {
  const snapshot = await getStyleSnapshot(locator);
  expect(snapshot.text.length).toBeGreaterThan(0);
  const ratio = contrastRatio(parseRgb(snapshot.color), parseRgb(snapshot.backgroundColor));
  expect(ratio).toBeGreaterThan(minContrast);
}

test.describe("Grammar reader dark mode", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await loginWithDarkTheme(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`renders ${slug} with readable dark-mode guide content`, async ({ page }) => {
      test.setTimeout(60000);

      await page.goto(`/grammar-reader/${slug}`, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(new RegExp(`/grammar-reader/${slug}`), { timeout: 10000 });

      const shell = page.getByTestId("grammar-reader-shell");
      const explanation = page.getByTestId("grammar-reader-explanation");
      const sectionTitle = page.locator(".section-header h2").first();
      const paragraph = page.locator(".explanation-content p").filter({ hasText: /\S/ }).first();
      const authoredBlock = page.locator('.explanation-content [style*="background"]').first();

      await expect(shell).toBeVisible();
      await expect(explanation).toBeVisible();
      await expect(sectionTitle).toBeVisible();
      await expect(paragraph).toBeVisible();
      await expect(authoredBlock).toBeVisible();

      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

      await shell.waitFor({ state: "visible" });
      const shellBackground = await shell.evaluate((element) => window.getComputedStyle(element).backgroundColor);
      expect(parseRgb(shellBackground)).not.toEqual([255, 255, 255]);

      await expectReadable(sectionTitle, 4);
      await expectReadable(paragraph, 4);
      await expectReadable(authoredBlock, 3);

      const authoredBackground = await authoredBlock.evaluate((element) => window.getComputedStyle(element).backgroundColor);
      expect(parseRgb(authoredBackground)).not.toEqual([255, 255, 255]);
    });
  }
});
