/**
 * Capture real student-UI screenshots for the Welcome / How to Use the App guide.
 *
 * Usage:
 *   npm run capture:how-to-screenshots
 *
 * Optional env:
 *   PLAYWRIGHT_BASE_URL   — reuse a running server (skips starting one)
 *   PLAYWRIGHT_PORT       — local port if starting a server (default 3000)
 *   HOW_TO_SCREENSHOT_USER / HOW_TO_SCREENSHOT_PASSWORD
 *
 * Writes PNGs to public/images/how-to-use-app/. Re-run when the learner UI changes.
 * Do not run in CI.
 *
 * Logs in through the form, then opens independent preview so the published
 * course map is visible (the E2E classroom has no week reveals).
 */

import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, expect, type Browser, type Locator, type Page } from "@playwright/test";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public/images/how-to-use-app");
const PORT = Number(process.env.PLAYWRIGHT_PORT || 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;
// e2e-teacher in independent preview sees the full published course map.
// The e2e-student test class has no week reveals, so its map is empty.
const USERNAME = process.env.HOW_TO_SCREENSHOT_USER || "e2e-teacher";
const PASSWORD = process.env.HOW_TO_SCREENSHOT_PASSWORD || "password123";
const SERVER_START_TIMEOUT_MS = 120_000;

const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 307 || response.status === 308 || response.status === 401) {
        return;
      }
    } catch {
      // still starting
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

async function maybeStartServer(): Promise<ChildProcess | null> {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    return null;
  }

  try {
    await waitForServer(BASE_URL, 1500);
    console.log(`Reusing server at ${BASE_URL}`);
    return null;
  } catch {
    // start below
  }

  let serverLogs = "";
  const child = spawn("/bin/zsh", ["-lc", `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`], {
    cwd: ROOT,
    env: {
      ...process.env,
      NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX: "false",
      NEXTAUTH_URL: BASE_URL,
    },
    stdio: "pipe",
  });
  child.stdout?.on("data", (chunk) => {
    serverLogs = `${serverLogs}${String(chunk)}`.slice(-4000);
  });
  child.stderr?.on("data", (chunk) => {
    serverLogs = `${serverLogs}${String(chunk)}`.slice(-4000);
  });

  await Promise.race([
    waitForServer(BASE_URL, SERVER_START_TIMEOUT_MS).catch((error) => {
      throw new Error(`${String(error)}\n\nDev server logs:\n${serverLogs.trim() || "(no output)"}`);
    }),
    new Promise<never>((_, reject) => {
      child.once("exit", (code, signal) => {
        reject(
          new Error(
            `Dev server exited (code=${code}, signal=${signal}).\n\n${serverLogs.trim() || "(no output)"}`,
          ),
        );
      });
    }),
  ]);

  console.log(`Started server at ${BASE_URL}`);
  return child;
}

async function stopServer(child: ChildProcess | null): Promise<void> {
  if (!child || child.killed) return;
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5000);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

async function seedE2eUsers(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("/bin/zsh", ["-lc", "node --import tsx scripts/e2e-seed.ts"], {
      cwd: ROOT,
      env: process.env,
      stdio: "inherit",
    });
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`e2e-seed exited with code ${code}`));
    });
  });
}

async function login(page: Page, username: string): Promise<void> {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel(/username/i).fill(username);
  await page.locator('input[name="password"]').fill(PASSWORD);
  const credentialsResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/callback/credentials") && response.request().method() === "POST",
    { timeout: 20_000 },
  );
  await page.getByRole("button", { name: /sign in/i }).click();
  const response = await credentialsResponse;
  if (!response.ok()) {
    throw new Error(`Credentials callback failed for ${username}: ${response.status()}`);
  }
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
}

async function dismissChrome(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.localStorage.setItem("independent-welcome-dismissed-v1", "1");
    for (const node of Array.from(document.querySelectorAll("div, section, aside"))) {
      if (node instanceof HTMLElement && node.textContent?.includes("Admin preview")) {
        node.style.display = "none";
      }
    }
    const welcome = document.querySelector('[aria-label="Welcome to Class Companion"]');
    if (welcome instanceof HTMLElement) welcome.style.display = "none";
    for (const portal of Array.from(document.querySelectorAll("nextjs-portal"))) {
      if (portal instanceof HTMLElement) portal.style.display = "none";
    }
    for (const node of Array.from(document.body.children)) {
      if (
        node instanceof HTMLElement &&
        node.className.includes("fixed") &&
        /points!/i.test(node.textContent || "")
      ) {
        node.style.display = "none";
      }
    }
  });
}

async function shotLocator(locator: Locator, fileName: string): Promise<boolean> {
  try {
    await locator.first().waitFor({ state: "visible", timeout: 12_000 });
    await locator.first().scrollIntoViewIfNeeded();
    await locator.first().screenshot({
      path: path.join(OUT_DIR, fileName),
      animations: "disabled",
    });
    console.log(`  saved ${fileName}`);
    return true;
  } catch (error) {
    console.warn(`  skipped ${fileName}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function shotFirstVisible(page: Page, locators: Locator[], fileName: string): Promise<boolean> {
  for (const locator of locators) {
    const visible = locator.locator("visible=true").first();
    if ((await visible.count().catch(() => 0)) > 0) {
      return shotLocator(visible, fileName);
    }
  }
  for (const locator of locators) {
    const ok = await shotLocator(locator.locator("visible=true").first(), fileName);
    if (ok) return true;
  }
  return false;
}

async function gotoReady(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await dismissChrome(page);
}

async function captureDesktop(page: Page): Promise<void> {
  await gotoReady(page, `${BASE_URL}/dashboard/independent`);
  await gotoReady(page, `${BASE_URL}/dashboard/map?week=1`);
  await page
    .getByRole("heading", { name: /week 1|start the class/i })
    .first()
    .waitFor({ state: "visible", timeout: 20_000 })
    .catch(() => undefined);
  await page.waitForTimeout(400);

  await shotFirstVisible(
    page,
    [
      page.getByRole("link", { name: /^start$/i }).locator("xpath=ancestor::*[contains(@class,'rounded')][1]"),
      page.getByText("Start", { exact: true }).locator("xpath=ancestor::*[contains(@class,'rounded')][1]"),
      page.locator("#week-1"),
    ],
    "continue-card.png",
  );

  await shotFirstVisible(
    page,
    [
      page.locator("#week-1"),
      page
        .getByRole("heading", { name: /start the class|week 1/i })
        .locator("xpath=ancestor::*[self::section or contains(@class,'dashboard-panel') or contains(@id,'week-')][1]"),
    ],
    "this-week.png",
  );

  await shotFirstVisible(
    page,
    [
      page.locator("#unit-1"),
      page
        .getByRole("heading", { name: /getting to know you|unit 1|start the class/i })
        .locator("xpath=ancestor::*[contains(@class,'dashboard-panel')][1]"),
    ],
    "course-map.png",
  );

  await gotoReady(page, `${BASE_URL}/dashboard/profile`);
  await page.getByText(/day streak|points/i).first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
  await shotFirstVisible(
    page,
    [
      page.getByText("Day Streak", { exact: true }).locator("xpath=ancestor::div[contains(@class,'glass-card') or contains(@class,'rounded-2xl')][1]"),
      page.getByText(/day streak/i).locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]"),
    ],
    "points-streak.png",
  );

  await gotoReady(page, `${BASE_URL}/activity/vocab-sep-w1?ui=flashcards`);
  await page.getByText(/tap to flip|flip/i).first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
  await shotFirstVisible(
    page,
    [
      page.getByText(/tap to flip/i).locator("xpath=ancestor::div[contains(@class,'bg-bg') or contains(@class,'flex-col')][1]"),
      page.locator("main"),
    ],
    "vocab-flashcards.png",
  );

  await gotoReady(page, `${BASE_URL}/grammar-reader/welcome-back-tenses-review`);
  await page.getByTestId("grammar-reader-explanation").waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
  await shotFirstVisible(
    page,
    [page.getByTestId("grammar-reader-explanation"), page.getByTestId("grammar-reader-shell")],
    "grammar-guide.png",
  );

  await gotoReady(page, `${BASE_URL}/activity/timeline-tenses-week1-easy`);
  await page
    .getByText(/build|read the timeline|how to play|practice|complete the sentence/i)
    .first()
    .waitFor({ state: "visible", timeout: 20_000 })
    .catch(() => undefined);
  await page.waitForTimeout(600);
  await shotFirstVisible(page, [page.locator("main")], "game.png");

  await gotoReady(page, `${BASE_URL}/activity/verb-quiz-1`);
  await page.getByText(/verb quiz|submit quiz/i).first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => undefined);
  await shotFirstVisible(page, [page.locator("main")], "verb-quiz.png");
}

async function captureMobile(page: Page): Promise<void> {
  await gotoReady(page, `${BASE_URL}/dashboard/independent`);
  await gotoReady(page, `${BASE_URL}/dashboard/map?week=1`);
  await page
    .getByRole("heading", { name: /week 1|start the class/i })
    .first()
    .waitFor({ state: "visible", timeout: 20_000 })
    .catch(() => undefined);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(OUT_DIR, "mobile-home.png"),
    animations: "disabled",
    fullPage: false,
  });
  console.log("  saved mobile-home.png (phone viewport)");
}

async function newPage(browser: Browser, viewport: { width: number; height: number }): Promise<Page> {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.localStorage.setItem("independent-welcome-dismissed-v1", "1");
    window.localStorage.setItem("class-companion-theme", "light");
  });
  await login(page, USERNAME);
  await dismissChrome(page);
  return page;
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  await seedE2eUsers();

  const server = await maybeStartServer();
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    console.log(`\nDesktop captures (${USERNAME} @ ${DESKTOP.width}x${DESKTOP.height})`);
    const desktop = await newPage(browser, DESKTOP);
    await captureDesktop(desktop);
    await desktop.context().close();

    console.log(`\nPhone captures (${PHONE.width}x${PHONE.height})`);
    const phone = await newPage(browser, PHONE);
    await captureMobile(phone);
    await phone.context().close();

    console.log(`\nScreenshots written to ${OUT_DIR}`);
  } finally {
    await browser?.close();
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
