import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const blockedNames = new Set([".DS_Store"]);
const blockedRelativePaths = new Set([
  "prisma/dev.db",
  "prisma/dev.db-journal",
  "prisma/backups/dev.db.bak",
]);
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  ".next",
  "coverage",
  "playwright-report",
  "test-results",
]);

const findings = [];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(repoRoot, absolutePath);

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }
      walk(absolutePath);
      continue;
    }

    if (blockedNames.has(entry.name) || blockedRelativePaths.has(relativePath)) {
      findings.push(relativePath);
    }
  }
}

walk(repoRoot);

if (findings.length === 0) {
  process.exit(0);
}

console.error("[repo-hygiene] Remove blocked local artifacts before committing:");
for (const finding of findings.sort()) {
  console.error(`- ${finding}`);
}
process.exit(1);
