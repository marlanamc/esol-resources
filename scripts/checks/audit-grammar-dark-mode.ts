#!/usr/bin/env node

import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, expect, type Browser, type Page } from "@playwright/test";
import { parse } from "node-html-parser";
import {
  getGrammarDarkClassNames,
  getGrammarDarkMatcherHits,
} from "@/lib/grammar-dark-style-matchers";
import {
  getGrammarContent,
  getGrammarContentSourceFile,
  grammarContentSlugs,
} from "@/lib/grammar-content-loader";

type AuditMode = "hybrid" | "static" | "rendered";
type CoverageStatus = "covered" | "partially-covered" | "uncovered";
type RenderedFindingType = "contrast-fail" | "theme-mismatch" | "near-threshold";

interface AuditOptions {
  mode: AuditMode;
  slugs: string[];
  reportFile: string;
  artifactDir: string;
  baseUrl: string;
  port: number;
  devDistDir: string;
}

interface RiskRule {
  id: string;
  label: string;
  severity: number;
  coveredByClasses: string[];
  test: (style: string) => boolean;
}

interface RiskMatch {
  id: string;
  label: string;
  severity: number;
  coveredByClasses: string[];
}

interface StaticFinding {
  kind: "static";
  slug: string;
  sectionId?: string;
  sectionTitle?: string;
  fieldPath: string;
  elementTag: string;
  styleSnippet: string;
  textSnippet: string;
  riskLabels: string[];
  coverageStatus: CoverageStatus;
  matchedClasses: string[];
  sourceFile: string;
  sourceLine?: number;
  sortRank: number;
}

interface RenderedFinding {
  kind: "rendered";
  slug: string;
  sectionIndex: number;
  sectionTitle: string;
  domIndex: number;
  findingType: RenderedFindingType;
  contrastRatio: number;
  threshold: number;
  fontSizePx: number;
  fontWeight: number;
  color: string;
  ownBackground: string;
  resolvedBackground: string;
  styleSnippet: string;
  textSnippet: string;
  screenshotPath?: string;
  sortRank: number;
}

interface AuditMetadata {
  generatedAt: string;
  mode: AuditMode;
  slugs: string[];
}

interface RenderedSectionProgress {
  title: string;
  counterText: string;
  currentIndex: number;
  totalSections: number;
}

interface HtmlStringNode {
  path: string;
  html: string;
  sectionId?: string;
  sectionTitle?: string;
}

const ROOT = process.cwd();
const DEFAULT_REPORT_FILE = path.join(
  ROOT,
  "docs",
  "audits",
  "grammar-dark-mode-sweep.md",
);
const DEFAULT_ARTIFACT_DIR = path.join(ROOT, "tmp", "grammar-dark-mode-sweep");
const DEV_DIST_DIR_PREFIX = ".next-audit-grammar-dark-mode";
const DEFAULT_DEV_DIST_DIR = `${DEV_DIST_DIR_PREFIX}-${process.pid}`;
const DEFAULT_PORT = Number(process.env.PLAYWRIGHT_PORT || 3000);
const DEFAULT_BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${DEFAULT_PORT}`;
const REPORT_JSON_FILE = "findings.json";
const REPORT_SCREENSHOT_DIR = "screenshots";
const SERVER_START_TIMEOUT_MS = 120_000;
const LIGHT_SURFACE_LUMINANCE = 0.68;
const NEAR_THRESHOLD_MARGIN = 0.75;
const MAX_SCREENSHOTS_PER_SECTION = 8;

const SURFACE_CLASSES = [
  "gc-bg-white",
  "gc-bg-slate",
  "gc-bg-yellow",
  "gc-bg-amber",
  "gc-bg-orange",
  "gc-bg-red",
  "gc-bg-pink",
  "gc-bg-green",
  "gc-bg-blue",
  "gc-bg-purple",
  "gc-bg-violet",
  "gc-bg-cyan",
  "gc-bg-slate-300",
  "gc-bg-cyan-alpha",
  "gc-bg-purple-alpha",
  "gc-bg-orange-alpha",
  "gc-bg-amber-alpha",
  "gc-bg-sage-alpha",
  "gc-bg-terracotta-alpha",
  "gc-grad-amber",
  "gc-grad-purple",
  "gc-grad-terracotta",
  "gc-grad-red",
  "gc-grad-cyan",
  "gc-grad-green",
  "gc-grad-violet",
  "gc-grad-amber-solid",
];

const TEXT_CLASSES = [
  "gc-text-white",
  "gc-text-muted",
  "gc-text-dark",
  "gc-text-amber",
  "gc-text-sage",
  "gc-text-terracotta",
  "gc-text-brown",
  "gc-text-purple",
  "gc-text-red",
  "gc-text-light",
];

const BORDER_CLASSES = [
  "gc-box-cyan",
  "gc-box-amber",
  "gc-box-terracotta",
  "gc-box-sage",
  "gc-box-amber-500",
  "gc-box-orange-500",
  "gc-box-violet",
  "gc-border-white",
  "gc-callout-red",
  "gc-callout-green",
  "gc-callout-purple",
  "gc-callout-blue",
  "gc-callout-emerald",
  "gc-callout-amber",
  "gc-callout-orange",
  "gc-callout-left",
  "gc-callout-top",
  "gc-table-border",
  "gc-table-border-blue",
  "gc-table-divider",
  "gc-border-orange-light",
  "gc-border-slate",
  "gc-border-black-alpha",
];

const STATIC_RISK_RULES: readonly RiskRule[] = [
  {
    id: "light-surface",
    label: "light surface background",
    severity: 3,
    coveredByClasses: SURFACE_CLASSES,
    test: (style) =>
      /background(?:-color)?\s*:\s*(?:white|#fff(?:fff)?(?:\b|;)|#f8fafc|#fdfbf7|#f4f1ea|#fef9f3|#fff3cd|#fff5f2|#fffaf0|#fff9e6|#fffbeb|#fff7ed|#fef9c3|#fef3c7|#fef2f2|#fdf2f8|#f0fdf4|#ecfdf5|#eff6ff|#faf5ff|#f5f3ff|#ede9fe|#ecfeff|#cbd5e1)/i.test(
        style,
      ) || /linear-gradient/i.test(style),
  },
  {
    id: "dark-or-muted-text",
    label: "dark or muted text color",
    severity: 3,
    coveredByClasses: TEXT_CLASSES,
    test: (style) =>
      /(?:^|;\s*)color:\s*#(?:6b7280|475569|94a3b8|64748b|3a3a3a|334155|2b3a4a|374151|1e293b|111827|d4a843|b45309|6d28d9|8b5cf6|dc2626)/i.test(
        style,
      ),
  },
  {
    id: "light-text",
    label: "light text color",
    severity: 2,
    coveredByClasses: TEXT_CLASSES,
    test: (style) =>
      /(?:^|;\s*)color:\s*(?:white|#fff(?:fff)?(?:\b|;|$)|#f8fafc|#e2e8f0|#e5e7eb|#cbd5e1)/i.test(
        style,
      ),
  },
  {
    id: "light-border",
    label: "light or alpha border",
    severity: 1,
    coveredByClasses: BORDER_CLASSES,
    test: (style) =>
      /border(?:-[a-z]+)?\s*:\s*(?:[124]px\s+solid\s+(?:white|#ddd|#dbeafe|#e2e8f0|#ffedd5|#fed7aa|rgba\(0,\s*0,\s*0,\s*0\.1\)))/i.test(
        style,
      ),
  },
  {
    id: "inset-shadow",
    label: "inset shadow on styled container",
    severity: 1,
    coveredByClasses: ["gc-shadow-inset"],
    test: (style) =>
      style.includes("box-shadow: inset") || style.includes("box-shadow:inset"),
  },
];

function parseArgs(argv: string[]): AuditOptions {
  const slugs: string[] = [];
  let mode: AuditMode = "hybrid";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--slug") {
      const slug = argv[i + 1];
      if (!slug) {
        throw new Error("Missing value for --slug");
      }
      slugs.push(slug);
      i += 1;
      continue;
    }
    if (arg === "--static-only") {
      mode = "static";
      continue;
    }
    if (arg === "--rendered-only") {
      mode = "rendered";
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  const selectedSlugs = Array.from(new Set(slugs.length > 0 ? slugs : grammarContentSlugs));
  const unknownSlugs = selectedSlugs.filter((slug) => !grammarContentSlugs.includes(slug));
  if (unknownSlugs.length > 0) {
    throw new Error(`Unknown grammar slug(s): ${unknownSlugs.join(", ")}`);
  }

  return {
    mode,
    slugs: selectedSlugs,
    reportFile: DEFAULT_REPORT_FILE,
    artifactDir: DEFAULT_ARTIFACT_DIR,
    baseUrl: DEFAULT_BASE_URL,
    port: DEFAULT_PORT,
    devDistDir: DEFAULT_DEV_DIST_DIR,
  };
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 140): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1)}...`;
}

function escapeTableCell(value: string): string {
  return value
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br />")
    .replace(/`/g, "\\`");
}

function lineNumberForIndex(source: string, index: number): number {
  return source.slice(0, Math.max(index, 0)).split("\n").length;
}

function sortRankForRendered(type: RenderedFindingType): number {
  switch (type) {
    case "contrast-fail":
      return 500;
    case "theme-mismatch":
      return 400;
    case "near-threshold":
      return 200;
    default:
      return 0;
  }
}

function sortRankForStatic(coverageStatus: CoverageStatus): number {
  switch (coverageStatus) {
    case "uncovered":
      return 300;
    case "partially-covered":
      return 250;
    case "covered":
      return 100;
    default:
      return 0;
  }
}

function collectRiskMatches(style: string, fallbackLabels: string[]): RiskMatch[] {
  const matches = STATIC_RISK_RULES.filter((rule) => rule.test(style)).map((rule) => ({
    id: rule.id,
    label: rule.label,
    severity: rule.severity,
    coveredByClasses: rule.coveredByClasses,
  }));
  if (matches.length > 0) {
    return matches;
  }
  return fallbackLabels.map((label, index) => ({
    id: `matcher-${index}`,
    label,
    severity: 1,
    coveredByClasses: [],
  }));
}

function getCoverageStatus(
  riskMatches: RiskMatch[],
  matchedClasses: string[],
): CoverageStatus {
  if (matchedClasses.length === 0) {
    return "uncovered";
  }
  if (riskMatches.length === 0) {
    return "covered";
  }

  let covered = 0;
  for (const riskMatch of riskMatches) {
    if (
      riskMatch.coveredByClasses.length === 0 ||
      riskMatch.coveredByClasses.some((cls) => matchedClasses.includes(cls))
    ) {
      covered += 1;
    }
  }

  if (covered === riskMatches.length) {
    return "covered";
  }
  if (covered > 0) {
    return "partially-covered";
  }
  return "uncovered";
}

function collectStyledHtmlStrings(
  value: unknown,
  pathPrefix: string,
  sectionContext: { sectionId?: string; sectionTitle?: string } | undefined,
  parentKey: string | undefined,
  results: HtmlStringNode[],
): void {
  if (typeof value === "string") {
    if (/<[a-z][\s\S]*style\s*=\s*["']/i.test(value)) {
      results.push({
        path: pathPrefix,
        html: value,
        sectionId: sectionContext?.sectionId,
        sectionTitle: sectionContext?.sectionTitle,
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextSectionContext =
        parentKey === "sections" &&
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
          ? {
              sectionId:
                typeof (item as { id?: unknown }).id === "string"
                  ? ((item as { id: string }).id)
                  : undefined,
              sectionTitle:
                typeof (item as { title?: unknown }).title === "string"
                  ? ((item as { title: string }).title)
                  : undefined,
            }
          : sectionContext;
      collectStyledHtmlStrings(
        item,
        `${pathPrefix}[${index}]`,
        nextSectionContext,
        undefined,
        results,
      );
    });
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    collectStyledHtmlStrings(
      nestedValue,
      pathPrefix ? `${pathPrefix}.${key}` : key,
      sectionContext,
      key,
      results,
    );
  }
}

function findNextSourceIndex(
  source: string,
  cursor: number,
  candidates: string[],
): number {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    const fromCursor = source.indexOf(candidate, cursor);
    if (fromCursor !== -1) {
      return fromCursor;
    }
    const fromStart = source.indexOf(candidate);
    if (fromStart !== -1) {
      return fromStart;
    }
  }
  return -1;
}

async function runStaticAudit(slugs: string[]): Promise<StaticFinding[]> {
  const findings: StaticFinding[] = [];

  for (const slug of slugs) {
    console.log(`Static audit: ${slug}`);
    const content = await getGrammarContent(slug);
    if (!content) {
      continue;
    }

    const sourceFile = getGrammarContentSourceFile(slug) || "unknown";
    const absoluteSourceFile = path.join(ROOT, sourceFile);
    const source = await readFile(absoluteSourceFile, "utf8");
    let sourceCursor = 0;

    const htmlNodes: HtmlStringNode[] = [];
    collectStyledHtmlStrings(content, "content", undefined, undefined, htmlNodes);

    for (const htmlNode of htmlNodes) {
      const root = parse(`<audit-root>${htmlNode.html}</audit-root>`);
      const styledElements = root.querySelectorAll("[style]");

      for (const element of styledElements) {
        const style = element.getAttribute("style") || "";
        const normalizedStyle = normalizeWhitespace(style);
        const matcherHits = getGrammarDarkMatcherHits(normalizedStyle);
        const matchedClasses = getGrammarDarkClassNames(normalizedStyle);
        const fallbackLabels = Array.from(
          new Set(matcherHits.map((matcher) => matcher.label)),
        );
        const riskMatches = collectRiskMatches(normalizedStyle, fallbackLabels);

        if (riskMatches.length === 0 && matcherHits.length === 0) {
          continue;
        }

        const coverageStatus = getCoverageStatus(riskMatches, matchedClasses);
        const searchCandidates = [
          `style="${style}"`,
          `style='${style}'`,
          normalizedStyle,
          truncate(normalizedStyle, 80),
        ];
        const sourceIndex = findNextSourceIndex(source, sourceCursor, searchCandidates);
        if (sourceIndex !== -1) {
          sourceCursor = sourceIndex + Math.max(searchCandidates[0]?.length ?? 0, 1);
        }

        findings.push({
          kind: "static",
          slug,
          sectionId: htmlNode.sectionId,
          sectionTitle: htmlNode.sectionTitle,
          fieldPath: htmlNode.path,
          elementTag: element.tagName.toLowerCase(),
          styleSnippet: truncate(normalizedStyle, 180),
          textSnippet: truncate(normalizeWhitespace(element.textContent), 120),
          riskLabels: Array.from(new Set(riskMatches.map((match) => match.label))),
          coverageStatus,
          matchedClasses,
          sourceFile,
          sourceLine:
            sourceIndex === -1 ? undefined : lineNumberForIndex(source, sourceIndex),
          sortRank: sortRankForStatic(coverageStatus),
        });
      }
    }
  }

  return findings;
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for dev server at ${url}`);
}

async function maybeStartServer(options: AuditOptions): Promise<{
  process: ChildProcess | null;
  reusedExistingServer: boolean;
}> {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    return { process: null, reusedExistingServer: true };
  }

  try {
    await waitForServer(options.baseUrl, 1500);
    return { process: null, reusedExistingServer: true };
  } catch {
    // Start a fresh dev server below.
  }

  let serverLogs = "";
  const appendServerLog = (chunk: string | Buffer) => {
    const text = String(chunk);
    serverLogs = `${serverLogs}${text}`.slice(-6000);
  };

  const child = spawn(
    "/bin/zsh",
    [
      "-lc",
      `npm run dev -- --hostname localhost --port ${options.port}`,
    ],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX: "false",
        NEXT_DIST_DIR: options.devDistDir,
        NEXTAUTH_URL: options.baseUrl,
      },
      stdio: "pipe",
    },
  );

  child.stdout?.on("data", appendServerLog);
  child.stderr?.on("data", appendServerLog);

  await Promise.race([
    waitForServer(options.baseUrl, SERVER_START_TIMEOUT_MS).catch((error) => {
      throw new Error(
        `${String(error)}\n\nDev server logs:\n${serverLogs.trim() || "(no output captured)"}`,
      );
    }),
    new Promise<never>((_, reject) => {
      child.once("exit", (code, signal) => {
        reject(
          new Error(
            `Dev server exited before becoming ready (code=${code}, signal=${signal}).\n\nDev server logs:\n${serverLogs.trim() || "(no output captured)"}`,
          ),
        );
      });
    }),
  ]);
  return { process: child, reusedExistingServer: false };
}

async function stopServer(child: ChildProcess | null): Promise<void> {
  if (!child || child.killed) {
    return;
  }

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

async function ensureE2EUsers(): Promise<void> {
  let seedLogs = "";
  const appendSeedLog = (chunk: string | Buffer) => {
    const text = String(chunk);
    seedLogs = `${seedLogs}${text}`.slice(-6000);
  };

  const child = spawn("/bin/zsh", ["-lc", "node --import tsx scripts/e2e-seed.ts"], {
    cwd: ROOT,
    env: process.env,
    stdio: "pipe",
  });

  child.stdout?.on("data", appendSeedLog);
  child.stderr?.on("data", appendSeedLog);

  await new Promise<void>((resolve, reject) => {
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `Failed to seed rendered-audit users (code=${code}, signal=${signal}).\n\nSeed logs:\n${seedLogs.trim() || "(no output captured)"}`,
        ),
      );
    });
  });
}

async function loginWithDarkTheme(page: Page, baseUrl: string): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("class-companion-theme", "dark");
  });

  const authRequest = page.context().request;
  const csrfResponse = await authRequest.get(`${baseUrl}/api/auth/csrf`);
  if (!csrfResponse.ok()) {
    throw new Error(`Failed to fetch CSRF token: ${csrfResponse.status()} ${csrfResponse.statusText()}`);
  }

  const csrfPayload = (await csrfResponse.json()) as { csrfToken?: string };
  if (!csrfPayload.csrfToken) {
    throw new Error("NextAuth CSRF response did not include csrfToken.");
  }

  const signInResponse = await authRequest.post(
    `${baseUrl}/api/auth/callback/credentials?json=true`,
    {
      form: {
        csrfToken: csrfPayload.csrfToken,
        username: "e2e-teacher",
        password: "password123",
        callbackUrl: `${baseUrl}/dashboard`,
        json: "true",
      },
    },
  );

  if (!signInResponse.ok()) {
    throw new Error(
      `NextAuth sign-in request failed: ${signInResponse.status()} ${signInResponse.statusText()}`,
    );
  }

  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
  try {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  } catch (error) {
    const alertText = await page
      .getByRole("alert")
      .textContent()
      .catch(() => null);
    throw new Error(
      `Login did not reach /dashboard. Current URL: ${page.url()}. Alert: ${alertText || "none"}.\nOriginal error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function collectRenderedIssues(page: Page): Promise<
  Array<
    Omit<RenderedFinding, "kind" | "slug" | "sectionIndex" | "screenshotPath" | "sortRank">
  >
> {
  return page.evaluate(
    ({
      lightSurfaceLuminance,
      nearThresholdMargin,
    }: {
      lightSurfaceLuminance: number;
      nearThresholdMargin: number;
    }) => {
    type RawIssue = Omit<
      RenderedFinding,
      "kind" | "slug" | "sectionIndex" | "screenshotPath" | "sortRank"
    >;

    const explanation = document.querySelector<HTMLElement>(
      '[data-testid="grammar-reader-explanation"]',
    );
    const sectionTitle =
      document.querySelector<HTMLElement>(".section-header h2")?.textContent?.trim() ||
      "Untitled section";

    if (!explanation) {
      return [];
    }

    const helpers = {
      parseRgb(value: string): [number, number, number] {
        const srgbMatch = value.match(
          /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/,
        );
        if (srgbMatch) {
          return [
            Math.round(Number(srgbMatch[1]) * 255),
            Math.round(Number(srgbMatch[2]) * 255),
            Math.round(Number(srgbMatch[3]) * 255),
          ];
        }
        const match = value.match(/\d+(\.\d+)?/g);
        if (!match || match.length < 3) {
          throw new Error(`Cannot parse rgb value: ${value}`);
        }
        return [Number(match[0]), Number(match[1]), Number(match[2])];
      },

      luminance([r, g, b]: [number, number, number]): number {
        const [rs, gs, bs] = [r, g, b].map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.03928
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      },

      contrastRatio(
        foreground: [number, number, number],
        background: [number, number, number],
      ): number {
        const lighter = Math.max(
          helpers.luminance(foreground),
          helpers.luminance(background),
        );
        const darker = Math.min(
          helpers.luminance(foreground),
          helpers.luminance(background),
        );
        return (lighter + 0.05) / (darker + 0.05);
      },

      isVisible(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();
        const computed = window.getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        Number.parseFloat(computed.opacity || "1") > 0.05 &&
        computed.visibility !== "hidden" &&
        computed.display !== "none"
      );
      },

      resolveBackground(element: HTMLElement): string {
        let current: HTMLElement | null = element;
        while (current) {
          const computed = window.getComputedStyle(current);
          const backgroundColor = computed.backgroundColor;
          if (
            backgroundColor &&
            backgroundColor !== "rgba(0, 0, 0, 0)" &&
            backgroundColor !== "transparent"
          ) {
            return backgroundColor;
          }
          current = current.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor;
      },
    };

    const styledElements = Array.from(
      explanation.querySelectorAll<HTMLElement>("[style]"),
    );
    const issues: RawIssue[] = [];

      styledElements.forEach((element, domIndex) => {
        if (!helpers.isVisible(element)) {
          return;
        }

        if (element.classList.contains("formula-part") || element.closest(".formula-box")) {
          return;
        }

        const textSnippet = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (!textSnippet) {
        return;
      }

      const computed = window.getComputedStyle(element);
      const resolvedBackground = helpers.resolveBackground(element);
      const ownBackground = computed.backgroundColor;
      const fontSizePx = Number.parseFloat(computed.fontSize) || 0;
      const fontWeight = Number.parseInt(computed.fontWeight, 10) || 400;
      const isLargeText =
        fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
      const threshold = isLargeText ? 3 : 4.5;
      const contrast = helpers.contrastRatio(
        helpers.parseRgb(computed.color),
        helpers.parseRgb(resolvedBackground),
      );
      const isContainerLike =
        /^(div|li|td|th|ol|ul|section|article|p)$/i.test(element.tagName) ||
        Number.parseFloat(computed.paddingTop) >= 8 ||
        Number.parseFloat(computed.paddingLeft) >= 8;
      const ownBackgroundLuminance =
        ownBackground &&
        ownBackground !== "rgba(0, 0, 0, 0)" &&
        ownBackground !== "transparent"
          ? helpers.luminance(helpers.parseRgb(ownBackground))
          : null;

      let findingType: RenderedFindingType | null = null;
      if (contrast < threshold) {
        findingType = "contrast-fail";
      } else if (
        isContainerLike &&
        ownBackgroundLuminance !== null &&
        ownBackgroundLuminance > lightSurfaceLuminance
      ) {
        findingType = "theme-mismatch";
      } else if (contrast < threshold + nearThresholdMargin) {
        findingType = "near-threshold";
      }

      if (!findingType) {
        return;
      }

      issues.push({
        sectionTitle,
        domIndex,
        findingType,
        contrastRatio: contrast,
        threshold,
        fontSizePx,
        fontWeight,
        color: computed.color,
        ownBackground,
        resolvedBackground,
        styleSnippet: (element.getAttribute("style") || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 180),
        textSnippet: textSnippet.slice(0, 120),
      });
    });

    return issues;
    },
    {
      lightSurfaceLuminance: LIGHT_SURFACE_LUMINANCE,
      nearThresholdMargin: NEAR_THRESHOLD_MARGIN,
    },
  );
}

function slugArtifactPath(artifactDir: string, slug: string, fileName: string): string {
  return path.join(artifactDir, REPORT_SCREENSHOT_DIR, slug, fileName);
}

async function getRenderedSectionProgress(page: Page): Promise<RenderedSectionProgress> {
  const title =
    (await page.locator(".section-header h2").textContent())?.trim() ||
    "Untitled section";
  const counterText =
    (await page.locator(".section-header p").textContent())?.trim() || "Section 1 of 1";
  const counterMatch = counterText.match(/Section\s+(\d+)\s+of\s+(\d+)/i);

  return {
    title,
    counterText,
    currentIndex: counterMatch ? Number(counterMatch[1]) : 1,
    totalSections: counterMatch ? Number(counterMatch[2]) : 1,
  };
}

async function advanceToNextRenderedSection(
  page: Page,
  progress: RenderedSectionProgress,
): Promise<void> {
  const waitForAdvance = async (): Promise<boolean> =>
    page
      .waitForFunction(
        ({ previousCounter, previousTitle, nextIndex }) => {
          const title =
            document.querySelector(".section-header h2")?.textContent?.trim() || "";
          const counter =
            document.querySelector(".section-header p")?.textContent?.trim() || "";
          const counterMatch = counter.match(/Section\s+(\d+)\s+of\s+(\d+)/i);
          const currentIndex = counterMatch ? Number(counterMatch[1]) : null;

          return (
            counter !== previousCounter ||
            (title.length > 0 && title !== previousTitle) ||
            currentIndex === nextIndex
          );
        },
        {
          previousCounter: progress.counterText,
          previousTitle: progress.title,
          nextIndex: progress.currentIndex + 1,
        },
        { timeout: 5_000 },
      )
      .then(() => true)
      .catch(() => false);

  await page.getByRole("button", { name: "Next section" }).click({ force: true });
  if (await waitForAdvance()) {
    return;
  }

  await page.keyboard.press("ArrowRight");
  if (await waitForAdvance()) {
    return;
  }

  throw new Error(
    `Failed to advance from rendered section ${progress.currentIndex} of ${progress.totalSections} (${progress.title}).`,
  );
}

async function runRenderedAudit(options: AuditOptions): Promise<RenderedFinding[]> {
  const findings: RenderedFinding[] = [];
  await ensureE2EUsers();
  const server = await maybeStartServer(options);
  let browser: Browser | null = null;
  let hasAuthenticatedSession = false;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.addInitScript(() => {
      window.localStorage.setItem("class-companion-theme", "dark");
    });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });

    for (const slug of options.slugs) {
      console.log(`Rendered audit: ${slug}`);
      let response = await page.goto(`${options.baseUrl}/grammar-reader/${slug}`, {
        waitUntil: "domcontentloaded",
      });
      if (
        page.url().includes("/login") ||
        (await page.getByLabel(/username/i).isVisible().catch(() => false))
      ) {
        if (!hasAuthenticatedSession) {
          await loginWithDarkTheme(page, options.baseUrl);
          hasAuthenticatedSession = true;
        }
        response = await page.goto(`${options.baseUrl}/grammar-reader/${slug}`, {
          waitUntil: "domcontentloaded",
        });
      }
      await page.locator(".section-header").waitFor({ state: "visible" });
      if (response && response.status() >= 400) {
        console.warn(
          `Skipping rendered audit for ${slug}: route returned ${response.status()}.`,
        );
        continue;
      }
      const hasExplanation = await page
        .locator('[data-testid="grammar-reader-explanation"]')
        .isVisible({ timeout: 10_000 })
        .catch(() => false);
      if (!hasExplanation) {
        console.warn(
          `Skipping rendered audit for ${slug}: grammar reader shell did not render.`,
        );
        continue;
      }

      const visitedSections = new Set<string>();
      const maxSections = 100;

      for (let step = 0; step < maxSections; step += 1) {
        const explanationVisible = await page
          .locator('[data-testid="grammar-reader-explanation"]')
          .isVisible({ timeout: 5_000 })
          .catch(() => false);
        if (!explanationVisible) {
          console.warn(
            `Stopping rendered audit for ${slug}: explanation panel disappeared after section navigation.`,
          );
          break;
        }
        const progress = await getRenderedSectionProgress(page);
        const sectionKey = `${progress.currentIndex}:${progress.title}`;
        if (visitedSections.has(sectionKey)) {
          break;
        }
        visitedSections.add(sectionKey);

        const rawIssues = await collectRenderedIssues(page);
        if (rawIssues.length > 0) {
          const explanationLocator = page.locator(
            '[data-testid="grammar-reader-explanation"] [style]',
          );
          let screenshotsCaptured = 0;
          for (const issue of rawIssues) {
            let screenshotPath: string | undefined;
            if (screenshotsCaptured < MAX_SCREENSHOTS_PER_SECTION) {
              const screenshotFile = `${slug}--section-${String(progress.currentIndex).padStart(2, "0")}--node-${String(issue.domIndex).padStart(3, "0")}--${issue.findingType}.png`;
              const absoluteScreenshotPath = slugArtifactPath(
                options.artifactDir,
                slug,
                screenshotFile,
              );
              await mkdir(path.dirname(absoluteScreenshotPath), { recursive: true });

              try {
                await explanationLocator
                  .nth(issue.domIndex)
                  .screenshot({
                    path: absoluteScreenshotPath,
                    animations: "disabled",
                    timeout: 2_000,
                  });
                screenshotPath = path.relative(ROOT, absoluteScreenshotPath);
                screenshotsCaptured += 1;
              } catch {
                // Keep the finding even if the element screenshot is unavailable.
              }
            }

            findings.push({
              kind: "rendered",
              slug,
              sectionIndex: Math.max(progress.currentIndex - 1, 0),
              sectionTitle: issue.sectionTitle || progress.title,
              domIndex: issue.domIndex,
              findingType: issue.findingType,
              contrastRatio: issue.contrastRatio,
              threshold: issue.threshold,
              fontSizePx: issue.fontSizePx,
              fontWeight: issue.fontWeight,
              color: issue.color,
              ownBackground: issue.ownBackground,
              resolvedBackground: issue.resolvedBackground,
              styleSnippet: issue.styleSnippet,
              textSnippet: issue.textSnippet,
              screenshotPath,
              sortRank: sortRankForRendered(issue.findingType),
            });
          }
        }

        if (progress.currentIndex >= progress.totalSections) {
          break;
        }

        await advanceToNextRenderedSection(page, progress);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    await stopServer(server.process);
  }

  return findings;
}

function compareFindings(
  left: StaticFinding | RenderedFinding,
  right: StaticFinding | RenderedFinding,
): number {
  if (right.sortRank !== left.sortRank) {
    return right.sortRank - left.sortRank;
  }
  if (left.slug !== right.slug) {
    return left.slug.localeCompare(right.slug);
  }
  if (left.kind !== right.kind) {
    return left.kind.localeCompare(right.kind);
  }
  if (left.kind === "rendered" && right.kind === "rendered") {
    if (left.sectionIndex !== right.sectionIndex) {
      return left.sectionIndex - right.sectionIndex;
    }
    return left.domIndex - right.domIndex;
  }
  if (left.kind === "static" && right.kind === "static") {
    const leftLine = left.sourceLine ?? Number.MAX_SAFE_INTEGER;
    const rightLine = right.sourceLine ?? Number.MAX_SAFE_INTEGER;
    return leftLine - rightLine;
  }
  return 0;
}

function buildSummaryLines(
  metadata: AuditMetadata,
  staticFindings: StaticFinding[],
  renderedFindings: RenderedFinding[],
): string[] {
  const renderedCounts = new Map<RenderedFindingType, number>();
  for (const finding of renderedFindings) {
    renderedCounts.set(
      finding.findingType,
      (renderedCounts.get(finding.findingType) || 0) + 1,
    );
  }

  const staticCounts = new Map<CoverageStatus, number>();
  for (const finding of staticFindings) {
    staticCounts.set(
      finding.coverageStatus,
      (staticCounts.get(finding.coverageStatus) || 0) + 1,
    );
  }

  return [
    "# Grammar Dark Mode Sweep",
    "",
    `Generated: ${metadata.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Mode: \`${metadata.mode}\``,
    `- Guides audited: ${metadata.slugs.length}`,
    `- Static findings: ${staticFindings.length}`,
    `- Rendered findings: ${renderedFindings.length}`,
    `- Contrast failures: ${renderedCounts.get("contrast-fail") || 0}`,
    `- Theme mismatches: ${renderedCounts.get("theme-mismatch") || 0}`,
    `- Near-threshold rendered findings: ${renderedCounts.get("near-threshold") || 0}`,
    `- Static uncovered findings: ${staticCounts.get("uncovered") || 0}`,
    `- Static partially covered findings: ${staticCounts.get("partially-covered") || 0}`,
    `- Static covered findings: ${staticCounts.get("covered") || 0}`,
    `- Audited slugs: ${metadata.slugs.map((slug) => `\`${slug}\``).join(", ")}`,
    "",
  ];
}

function buildRenderedSection(findings: RenderedFinding[]): string[] {
  if (findings.length === 0) {
    return ["## Rendered Findings", "", "_No rendered findings._", ""];
  }

  const lines = [
    "## Rendered Findings",
    "",
    "| Priority | Guide | Section | Issue | Contrast | Colors | Text | Style | Screenshot |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const finding of findings.sort(compareFindings)) {
    lines.push(
      `| ${finding.sortRank} | \`${escapeTableCell(finding.slug)}\` | ${escapeTableCell(finding.sectionTitle)} | \`${finding.findingType}\` | ${finding.contrastRatio.toFixed(2)} / ${finding.threshold.toFixed(2)} | \`${escapeTableCell(`${finding.color} on ${finding.resolvedBackground}`)}\` | ${escapeTableCell(finding.textSnippet)} | \`${escapeTableCell(finding.styleSnippet)}\` | ${finding.screenshotPath ? `[artifact](${encodeURI(finding.screenshotPath)})` : ""} |`,
    );
  }

  lines.push("");
  return lines;
}

function buildStaticSection(findings: StaticFinding[]): string[] {
  if (findings.length === 0) {
    return ["## Static Findings", "", "_No static findings._", ""];
  }

  const lines = [
    "## Static Findings",
    "",
    "| Priority | Guide | Section | Coverage | Patterns | Classes | Source | Text | Style |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const finding of findings.sort(compareFindings)) {
    const sourceRef = finding.sourceLine
      ? `${finding.sourceFile}:${finding.sourceLine}`
      : finding.sourceFile;
    lines.push(
      `| ${finding.sortRank} | \`${escapeTableCell(finding.slug)}\` | ${escapeTableCell(finding.sectionTitle || finding.fieldPath)} | \`${finding.coverageStatus}\` | ${escapeTableCell(finding.riskLabels.join(", "))} | \`${escapeTableCell(finding.matchedClasses.join(", "))}\` | \`${escapeTableCell(sourceRef)}\` | ${escapeTableCell(finding.textSnippet)} | \`${escapeTableCell(finding.styleSnippet)}\` |`,
    );
  }

  lines.push("");
  return lines;
}

async function writeArtifacts(
  options: AuditOptions,
  metadata: AuditMetadata,
  staticFindings: StaticFinding[],
  renderedFindings: RenderedFinding[],
): Promise<void> {
  await mkdir(path.dirname(options.reportFile), { recursive: true });

  const allFindings = [...renderedFindings, ...staticFindings].sort(compareFindings);
  const reportLines = [
    ...buildSummaryLines(metadata, staticFindings, renderedFindings),
    ...buildRenderedSection(renderedFindings),
    ...buildStaticSection(staticFindings),
  ];

  await writeFile(options.reportFile, `${reportLines.join("\n")}\n`, "utf8");
  await writeFile(
    path.join(options.artifactDir, REPORT_JSON_FILE),
    JSON.stringify(
      {
        metadata,
        findings: allFindings,
      },
      null,
      2,
    ),
    "utf8",
  );
}

interface FileSnapshot {
  path: string;
  contents: string;
}

async function snapshotFile(filePath: string): Promise<FileSnapshot> {
  return {
    path: filePath,
    contents: await readFile(filePath, "utf8"),
  };
}

async function restoreFile(snapshot: FileSnapshot): Promise<void> {
  await writeFile(snapshot.path, snapshot.contents, "utf8");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const tsconfigSnapshot = await snapshotFile(path.join(ROOT, "tsconfig.json"));
  const metadata: AuditMetadata = {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    slugs: options.slugs,
  };

  await rm(options.artifactDir, { recursive: true, force: true });
  await mkdir(options.artifactDir, { recursive: true });
  await rm(path.join(ROOT, options.devDistDir), { recursive: true, force: true });

  try {
    const staticFindings =
      options.mode === "rendered" ? [] : await runStaticAudit(options.slugs);
    const renderedFindings =
      options.mode === "static" ? [] : await runRenderedAudit(options);

    await writeArtifacts(options, metadata, staticFindings, renderedFindings);

    const severeRendered = renderedFindings.filter(
      (finding) =>
        finding.findingType === "contrast-fail" ||
        finding.findingType === "theme-mismatch",
    ).length;
    const uncoveredStatic = staticFindings.filter(
      (finding) => finding.coverageStatus === "uncovered",
    ).length;

    console.log(`Wrote report: ${path.relative(ROOT, options.reportFile)}`);
    console.log(
      `Summary: ${renderedFindings.length} rendered findings (${severeRendered} severe), ${staticFindings.length} static findings (${uncoveredStatic} uncovered).`,
    );
  } finally {
    await rm(path.join(ROOT, options.devDistDir), { recursive: true, force: true });
    await restoreFile(tsconfigSnapshot);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
