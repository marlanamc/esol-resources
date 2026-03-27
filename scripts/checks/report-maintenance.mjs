import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const args = new Set(process.argv.slice(2));
const writeIndex = process.argv.indexOf("--write");
const writePath = writeIndex >= 0 ? process.argv[writeIndex + 1] : null;
const skipVitest = args.has("--skip-vitest");

const wrapperTargets = [
  {
    importPath: "@/lib/auth",
    wrapperFile: "src/lib/auth.ts",
    canonicalHome: "src/lib/auth/*",
  },
  {
    importPath: "@/lib/prisma",
    wrapperFile: "src/lib/prisma.ts",
    canonicalHome: "src/lib/database/*",
  },
  {
    importPath: "@/lib/gamification",
    wrapperFile: "src/lib/gamification.ts",
    canonicalHome: "src/lib/gamification/*",
  },
];

function execCommand(command, commandArgs, options = {}) {
  try {
    return execFileSync(command, commandArgs, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    }).trim();
  } catch (error) {
    if (options.allowFailure) {
      return {
        ok: false,
        stdout: error.stdout?.toString() ?? "",
        stderr: error.stderr?.toString() ?? "",
        status: error.status ?? 1,
      };
    }
    throw error;
  }
}

function getLintSummary() {
  const raw = execCommand("./node_modules/.bin/eslint", [".", "--format", "json"]);
  const report = JSON.parse(raw);

  const warnings = report.reduce((sum, file) => sum + (file.warningCount || 0), 0);
  const errors = report.reduce((sum, file) => sum + (file.errorCount || 0), 0);
  const filesWithIssues = report.filter(
    (file) => (file.warningCount || 0) > 0 || (file.errorCount || 0) > 0
  ).length;

  return { warnings, errors, filesWithIssues };
}

function getVitestSummary() {
  if (skipVitest) {
    return {
      skipped: true,
      failedSuites: null,
      failedTests: null,
      passedTests: null,
    };
  }

  const outputFile = path.join(
    os.tmpdir(),
    `maintenance-vitest-${process.pid}-${Date.now()}.json`
  );

  try {
    execCommand("./node_modules/.bin/vitest", [
      "run",
      "--reporter=json",
      "--outputFile",
      outputFile,
    ]);

    const report = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    return {
      skipped: false,
      failedSuites: report.numFailedTestSuites ?? 0,
      failedTests: report.numFailedTests ?? 0,
      passedTests: report.numPassedTests ?? 0,
    };
  } finally {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  }
}

function getWrapperUsageSummary() {
  return wrapperTargets
    .map((target) => {
      const raw = execCommand("rg", [
        "-n",
        "--fixed-strings",
        `from "${target.importPath}"`,
        "src",
        "scripts",
        "tests",
      ], { allowFailure: true });

      const count = raw.ok === false
        ? 0
        : raw
            .split("\n")
            .filter(Boolean)
            .length;

      return {
        ...target,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);
}

function buildMarkdown() {
  const lint = getLintSummary();
  const vitest = getVitestSummary();
  const wrappers = getWrapperUsageSummary();
  const nextCleanup = wrappers[0];

  const lines = [
    "# Maintenance Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Health Snapshot",
    `- Lint errors: ${lint.errors}`,
    `- Lint warnings: ${lint.warnings}`,
    `- Files with lint findings: ${lint.filesWithIssues}`,
  ];

  if (vitest.skipped) {
    lines.push("- Vitest summary: skipped for this report run");
  } else {
    lines.push(`- Failing test suites: ${vitest.failedSuites}`);
    lines.push(`- Failing tests: ${vitest.failedTests}`);
    lines.push(`- Passing tests: ${vitest.passedTests}`);
  }

  lines.push(
    "",
    "## Duplicate Wrapper Targets",
    ...wrappers.slice(0, 3).map(
      (target) =>
        `- \`${target.importPath}\`: ${target.count} imports still use wrapper file \`${target.wrapperFile}\` instead of canonical home \`${target.canonicalHome}\``
    ),
    "",
    "## Next Cleanup Candidate",
    `- \`${nextCleanup.importPath}\` is the highest-volume wrapper import and should be the next contained cleanup pass.`,
    "",
    "## Debt Buckets",
    "- `stability`",
    "- `cleanup`",
    "- `test-gap`",
    "- `performance`",
    "- `content-sync`",
    ""
  );

  return lines.join("\n");
}

const markdown = buildMarkdown();

if (writePath) {
  fs.writeFileSync(path.resolve(repoRoot, writePath), markdown, "utf8");
}

console.log(markdown);
