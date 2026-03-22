import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { login as loginWithCredentials } from "./helpers/auth";

test.describe.configure({ mode: "parallel" });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((t) => {
    window.localStorage.setItem("class-companion-theme", t);
  }, theme);
}

/**
 * Run axe accessibility scan on the current page.
 * Checks WCAG 2.1 AA color-contrast plus a broad set of a11y rules.
 */
async function runAxeScan(page: Page, label: string) {
  const isErrorPage = await page.locator("html#__next_error__").count();
  if (isErrorPage > 0) {
    throw new Error(`[${label}] Page loaded as Next.js error page — cannot run axe`);
  }

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .exclude('a.hidden[href="/dashboard/leaderboard"]')
    .analyze();

  const violations = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.length,
    sample: v.nodes[0]?.html?.slice(0, 120),
  }));

  expect(
    violations,
    `[${label}] Found ${violations.length} accessibility violation(s):\n${JSON.stringify(violations, null, 2)}`
  ).toHaveLength(0);
}

/**
 * Manually check contrast ratio on specific elements that axe may miss
 * (e.g. elements with layered backgrounds or CSS variable colors).
 */
function parseRgb(value: string): [number, number, number] {
  const srgbMatch = value.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgbMatch) {
    return [
      Math.round(Number(srgbMatch[1]) * 255),
      Math.round(Number(srgbMatch[2]) * 255),
      Math.round(Number(srgbMatch[3]) * 255),
    ];
  }
  const match = value.match(/\d+(\.\d+)?/g);
  if (!match || match.length < 3) throw new Error(`Cannot parse rgb: ${value}`);
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function luminance([r, g, b]: [number, number, number]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]) {
  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectElementReadable(page: Page, selector: string, minContrast = 3) {
  const locator = page.locator(selector).first();
  if (!(await locator.isVisible())) return;

  const snapshot = await locator.evaluate((el) => {
    const resolvedBg = (node: Element | null): string => {
      let current: Element | null = node;
      while (current) {
        const bg = window.getComputedStyle(current).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
        current = current.parentElement;
      }
      return window.getComputedStyle(document.body).backgroundColor;
    };
    const cs = window.getComputedStyle(el);
    return { color: cs.color, bg: resolvedBg(el), text: (el.textContent || "").trim() };
  });

  if (!snapshot.text) return;
  const ratio = contrastRatio(parseRgb(snapshot.color), parseRgb(snapshot.bg));
  expect(
    ratio,
    `Element "${selector}" has contrast ${ratio.toFixed(2)} (need ${minContrast}): "${snapshot.text.slice(0, 60)}"`
  ).toBeGreaterThanOrEqual(minContrast);
}

// ---------------------------------------------------------------------------
// Routes to test — covers dashboard, activities, quiz results, and content
// ---------------------------------------------------------------------------

const STUDENT_ROUTES = [
  { path: "/dashboard", label: "Student Dashboard" },
  { path: "/dashboard/stats/student", label: "Student Stats" },
  { path: "/dashboard/join", label: "Join Class" },
];

const TEACHER_ROUTES = [
  { path: "/dashboard", label: "Teacher Dashboard" },
  { path: "/dashboard/classes", label: "Classes List" },
  { path: "/dashboard/activities", label: "Activities List" },
  { path: "/dashboard/leaderboard", label: "Leaderboard" },
  { path: "/dashboard/passwords", label: "Password Manager" },
];

// ---------------------------------------------------------------------------
// Theme isolation check — ensures dark: utilities respect .dark class
// ---------------------------------------------------------------------------

test.describe("Theme isolation", () => {
  test("dark: utilities do not activate when app is in light mode", async ({ page }) => {
    await setTheme(page, "light");
    await loginWithCredentials(page, "e2e-teacher", {
      timeout: 45000,
      waitForNetworkIdle: true,
    });
    await page.waitForLoadState("networkidle");

    const htmlHasDark = await page.locator("html").evaluate(
      (el) => el.classList.contains("dark")
    );
    expect(htmlHasDark, "html should NOT have .dark class in light mode").toBe(false);

    const dataTheme = await page.locator("html").getAttribute("data-theme");
    expect(dataTheme, "data-theme should be 'light'").toBe("light");

    const headerBg = await page
      .locator("header")
      .first()
      .evaluate((el) => window.getComputedStyle(el).backgroundColor);

    if (headerBg && headerBg !== "rgba(0, 0, 0, 0)") {
      const [r, g, b] = parseRgb(headerBg);
      expect(
        r + g + b,
        `Header bg should be light in light mode, got ${headerBg}`
      ).toBeGreaterThan(600);
    }
  });

  test("dark: utilities activate when app is in dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await loginWithCredentials(page, "e2e-teacher", {
      timeout: 45000,
      waitForNetworkIdle: true,
    });
    await page.waitForLoadState("networkidle");

    const htmlHasDark = await page.locator("html").evaluate(
      (el) => el.classList.contains("dark")
    );
    expect(htmlHasDark, "html SHOULD have .dark class in dark mode").toBe(true);

    const dataTheme = await page.locator("html").getAttribute("data-theme");
    expect(dataTheme).toBe("dark");
  });
});

// ---------------------------------------------------------------------------
// Full accessibility scans — light and dark modes
// ---------------------------------------------------------------------------

test.describe("Accessibility – Light Mode", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await setTheme(page, "light");
    await loginWithCredentials(page, "e2e-teacher", {
      timeout: 45000,
      waitForNetworkIdle: true,
    });
  });

  for (const route of TEACHER_ROUTES) {
    test(`${route.label} passes axe a11y audit (light)`, async ({ page }) => {
      test.setTimeout(90000);
      const currentUrl = page.url();
      if (!currentUrl.endsWith(route.path)) {
        await page.goto(route.path);
      }
      await page.waitForLoadState("networkidle");
      await runAxeScan(page, `Light – ${route.label}`);
    });
  }
});

test.describe("Accessibility – Dark Mode", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await setTheme(page, "dark");
    await loginWithCredentials(page, "e2e-teacher", {
      timeout: 45000,
      waitForNetworkIdle: true,
    });
  });

  for (const route of TEACHER_ROUTES) {
    test(`${route.label} passes axe a11y audit (dark)`, async ({ page }) => {
      test.setTimeout(90000);
      const currentUrl = page.url();
      if (!currentUrl.endsWith(route.path)) {
        await page.goto(route.path);
      }
      await page.waitForLoadState("networkidle");
      await runAxeScan(page, `Dark – ${route.label}`);
    });
  }
});

test.describe("Accessibility – Student Routes", () => {
  test.describe.configure({ mode: "serial" });

  for (const theme of ["light", "dark"] as const) {
    test.describe(`${theme} mode`, () => {
      test.beforeEach(async ({ page }) => {
        await setTheme(page, theme);
        await loginWithCredentials(page, "e2e-student", {
          timeout: 45000,
          waitForNetworkIdle: true,
        });
      });

      for (const route of STUDENT_ROUTES) {
        test(`${route.label} passes axe (${theme})`, async ({ page }) => {
          test.setTimeout(90000);
          const currentUrl = page.url();
          if (!currentUrl.endsWith(route.path)) {
            await page.goto(route.path);
          }
          await page.waitForLoadState("networkidle");
          await runAxeScan(page, `${theme} – ${route.label}`);
        });
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Verb Quiz results — manual contrast checks for both themes
// ---------------------------------------------------------------------------

test.describe("Verb Quiz Results contrast", () => {
  test.describe.configure({ mode: "serial" });

  for (const theme of ["light", "dark"] as const) {
    test(`correct answer cells are readable in ${theme} mode`, async ({ page }) => {
      test.setTimeout(60000);
      await setTheme(page, theme);
      await loginWithCredentials(page, "e2e-student");
      await page.waitForLoadState("networkidle");

      // Find a completed verb quiz by navigating to quizzes
      const quizLink = page
        .locator('a[href*="verb-quiz"]')
        .first();

      if (!(await quizLink.isVisible({ timeout: 5000 }).catch(() => false))) {
        test.skip(true, "No verb quiz link visible — skipping contrast check");
        return;
      }

      await quizLink.click();
      await page.waitForLoadState("networkidle");

      // Verify theme held after navigation
      const dataTheme = await page.locator("html").getAttribute("data-theme");
      expect(dataTheme).toBe(theme);

      // Check header readability
      await expectElementReadable(page, "header h1", 4.5);

      // Check verb card titles ("To Forward", etc.)
      await expectElementReadable(page, "h4.capitalize", 4.5);

      // Check score text ("4/4")
      await expectElementReadable(page, ".text-sm.font-semibold span", 3);

      // Check answer text inside result cells
      await expectElementReadable(page, ".font-mono.text-sm div", 3);
    });
  }
});

// ---------------------------------------------------------------------------
// Login page — should be accessible in both modes
// ---------------------------------------------------------------------------

test.describe("Login page accessibility", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`login page passes axe (${theme})`, async ({ page }) => {
      await setTheme(page, theme);
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await runAxeScan(page, `${theme} – Login`);
    });
  }
});
