import { expect, type Page } from "@playwright/test";

const DASHBOARD_URL_PATTERN = /\/dashboard(?:[/?#].*)?$/;
const PASSWORD_INPUT_SELECTOR = 'input[name="password"]';
const DEFAULT_PASSWORD = "password123";

type LoginOptions = {
  attempts?: number;
  expectedUrlPattern?: RegExp;
  password?: string;
  submitDelayMs?: number;
  submitMethod?: "click" | "tap";
  timeout?: number;
  waitForNetworkIdle?: boolean;
};

export async function login(page: Page, username: string, options: LoginOptions = {}) {
  const {
    attempts = 1,
    expectedUrlPattern = DASHBOARD_URL_PATTERN,
    password = DEFAULT_PASSWORD,
    submitDelayMs = 0,
    submitMethod = "click",
    timeout = 15000,
    waitForNetworkIdle = false,
  } = options;

  let lastError: unknown = new Error(`Login failed for ${username}`);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await page.goto("/login");

    if (waitForNetworkIdle) {
      await page.waitForLoadState("networkidle");
    }

    await page.getByLabel(/username/i).fill(username);
    await page.locator(PASSWORD_INPUT_SELECTOR).fill(password);

    if (submitDelayMs > 0) {
      await page.waitForTimeout(submitDelayMs);
    }

    const signInButton = page.getByRole("button", { name: /sign in/i });
    if (submitMethod === "tap") {
      await signInButton.tap({ position: { x: 50, y: 25 } });
    } else {
      await signInButton.click();
    }

    try {
      await expect(page).toHaveURL(expectedUrlPattern, { timeout });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function loginAsStudent(page: Page, options?: LoginOptions) {
  return login(page, "e2e-student", options);
}

export function loginAsTeacher(page: Page, options?: LoginOptions) {
  return login(page, "e2e-teacher", options);
}
