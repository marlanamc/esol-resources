/**
 * Apply Claude.ai audit results to src/data/public-level1-vocab.ts.
 *
 * Expects you to have saved the JSON responses from each chunk as:
 *   audit/audit-results-1.json
 *   audit/audit-results-2.json
 *   audit/audit-results-3.json
 *
 * Each file should be the JSON array Claude returned. The script:
 *   1. merges the arrays by id
 *   2. shows a colored diff for each non-"ok" suggestion
 *   3. asks: y (accept), n (reject), a (accept all remaining), q (quit)
 *   4. on accept, rewrites the matching englishDefinition in the source file
 *
 * Run with:
 *   node scripts/apply-definition-rewrites.mjs
 *
 * Add --dry-run to preview without writing.
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dataFile = path.join(repoRoot, "src/data/public-level1-vocab.ts");
const auditDir = path.join(repoRoot, "audit");

const DRY_RUN = process.argv.includes("--dry-run");

// ---------- collect audit result chunks ----------

const resultFiles = fs
  .readdirSync(auditDir)
  .filter((f) => /^audit-results-\d+\.json$/.test(f))
  .sort();

if (resultFiles.length === 0) {
  console.error(
    "No audit-results-N.json files found in audit/. Paste each Claude.ai response into a JSON file first."
  );
  process.exit(1);
}

let suggestions = [];
for (const f of resultFiles) {
  const raw = fs.readFileSync(path.join(auditDir, f), "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${f}: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(parsed)) {
    console.error(`${f} is not a JSON array.`);
    process.exit(1);
  }
  suggestions.push(...parsed);
}

console.log(`Loaded ${suggestions.length} suggestions from ${resultFiles.length} files.`);

// ---------- re-extract source so we can match by term + original def ----------

const TERM_OBJECT_RE =
  /\{\s*term:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*englishDefinition:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;

function unescapeStr(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function escapeForTs(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let source = fs.readFileSync(dataFile, "utf8");

const records = [];
let m;
while ((m = TERM_OBJECT_RE.exec(source)) !== null) {
  records.push({
    id: records.length + 1,
    term: unescapeStr(m[1]),
    englishDefinition: unescapeStr(m[2]),
    rawTerm: m[1],
    rawDef: m[2],
  });
}
const byId = new Map(records.map((r) => [r.id, r]));

// ---------- review loop ----------

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function ask(q) {
  return new Promise((resolve) => rl.question(q, (a) => resolve(a)));
}

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const accepted = []; // {id, before, after, term, status}
const skipped = [];
let acceptAll = false;

const actionable = suggestions.filter(
  (s) => s && s.status && s.status !== "ok" && s.suggestion && s.suggestion.trim()
);

console.log(
  `${actionable.length} suggestions are actionable (status != "ok" with a non-empty rewrite).\n`
);

for (let i = 0; i < actionable.length; i++) {
  const s = actionable[i];
  const rec = byId.get(s.id);
  if (!rec) {
    console.warn(`[skip] suggestion id ${s.id} has no matching term in source.`);
    continue;
  }
  // Defensive: bail if Claude's understanding of the original drifts.
  if (s.englishDefinition && s.englishDefinition !== rec.englishDefinition) {
    console.warn(
      `[skip] id ${s.id} (${rec.term}): suggestion's original text doesn't match source — definition may have been edited since extraction.`
    );
    continue;
  }

  console.log(
    `\n[${i + 1}/${actionable.length}] ${YELLOW}${rec.term}${RESET}  ${DIM}(${s.status})${RESET}`
  );
  console.log(`  ${RED}- ${rec.englishDefinition}${RESET}`);
  console.log(`  ${GREEN}+ ${s.suggestion}${RESET}`);

  let answer = "a";
  if (!acceptAll) {
    answer = (await ask("  accept? [y]es / [n]o / [a]ll / [q]uit: ")).trim().toLowerCase();
  }
  if (answer === "q") break;
  if (answer === "a") acceptAll = true;
  if (acceptAll || answer === "y" || answer === "") {
    accepted.push({
      id: s.id,
      term: rec.term,
      before: rec.englishDefinition,
      after: s.suggestion.trim(),
      status: s.status,
    });
  } else {
    skipped.push(rec.term);
  }
}

rl.close();

console.log("");
console.log(`Accepted: ${accepted.length}`);
console.log(`Skipped:  ${skipped.length}`);

if (accepted.length === 0) {
  console.log("Nothing to apply.");
  process.exit(0);
}

// ---------- apply ----------

let updated = source;
let applied = 0;
let collisions = 0;

for (const a of accepted) {
  // Build an anchor regex that matches the exact term + def pair we saw
  // in the original. This is precise enough to avoid touching the wrong
  // record even if two terms share a definition.
  const termPattern = escapeRegex(escapeForTs(byId.get(a.id).rawTerm));
  const defPattern = escapeRegex(byId.get(a.id).rawDef);
  const anchor = new RegExp(
    `(\\{\\s*term:\\s*"${termPattern}"\\s*,\\s*englishDefinition:\\s*")${defPattern}(")`
  );
  const matches = updated.match(new RegExp(anchor, "g"));
  if (!matches || matches.length === 0) {
    console.warn(`[miss] ${a.term}: anchor not found in source.`);
    collisions++;
    continue;
  }
  if (matches.length > 1) {
    console.warn(`[miss] ${a.term}: anchor matched ${matches.length} places — skipping for safety.`);
    collisions++;
    continue;
  }
  updated = updated.replace(anchor, `$1${escapeForTs(a.after)}$2`);
  applied++;
}

if (DRY_RUN) {
  console.log(`\n[dry-run] Would apply ${applied} edits (${collisions} skipped).`);
} else if (applied > 0) {
  fs.writeFileSync(dataFile, updated, "utf8");
  console.log(`\nApplied ${applied} edits to src/data/public-level1-vocab.ts.`);
  if (collisions > 0) console.log(`${collisions} edits skipped due to anchor mismatch.`);
}

// Always write a record of what happened so you can sanity-check.
const reportPath = path.join(auditDir, "applied-rewrites.json");
fs.writeFileSync(reportPath, JSON.stringify({ accepted, skipped, applied, collisions, dryRun: DRY_RUN }, null, 2), "utf8");
console.log(`Report written to ${reportPath}`);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
