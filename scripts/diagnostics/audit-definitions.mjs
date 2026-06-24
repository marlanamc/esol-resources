/**
 * Definition audit script.
 *
 * Reads src/data/public-level1-vocab.ts, extracts every englishDefinition
 * from the raw term literals, and produces:
 *
 *   audit/definitions-all.csv       — every definition + offline scores
 *   audit/audit-prompt-1of3.txt     — paste-ready Claude.ai chunk 1
 *   audit/audit-prompt-2of3.txt     — paste-ready Claude.ai chunk 2
 *   audit/audit-prompt-3of3.txt     — paste-ready Claude.ai chunk 3
 *
 * No npm install, no API calls. Run with:
 *   node scripts/audit-definitions.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dataFile = path.join(repoRoot, "src/data/public-level1-vocab.ts");
const auditDir = path.join(repoRoot, "audit");

const CHUNK_COUNT = 3;
const LENGTH_FLAG_THRESHOLD = 12; // words

// ---------- load already-rewritten IDs to skip ----------

const rewriteReportPath = path.join(auditDir, "applied-rewrites.json");
let skipIds = new Set();
if (fs.existsSync(rewriteReportPath)) {
  const report = JSON.parse(fs.readFileSync(rewriteReportPath, "utf8"));
  skipIds = new Set((report.accepted || []).map((a) => a.id));
  console.log(`Skipping ${skipIds.size} already-rewritten definitions (second-pass mode).`);
}

// ---------- extract ----------

const source = fs.readFileSync(dataFile, "utf8");

/**
 * Match each RawTerm-style object literal that has both `term:` and
 * `englishDefinition:`. We use a non-greedy capture and bracket-aware
 * matching keyed off the literal opening brace. Order in the file is
 * preserved, which matches the order learners see in the UI.
 */
const TERM_OBJECT_RE =
  /\{\s*term:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*englishDefinition:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;

const records = [];
let match;
while ((match = TERM_OBJECT_RE.exec(source)) !== null) {
  const term = unescape(match[1]);
  const englishDefinition = unescape(match[2]);
  records.push({
    id: records.length + 1,
    term,
    englishDefinition,
    // store the byte range of the englishDefinition string contents (between
    // the quotes) for the future apply script
    defStart: match.index + match[0].lastIndexOf('"' + match[2]) + 1,
    defEnd: match.index + match[0].lastIndexOf('"' + match[2]) + 1 + match[2].length,
  });
}

if (records.length === 0) {
  console.error("No term/englishDefinition pairs found — extractor regex may be stale.");
  process.exit(1);
}

console.log(`Extracted ${records.length} definitions.`);

// Filter to only unreviewed records for second-pass prompts
const unreviewed = records.filter((r) => !skipIds.has(r.id));

// ---------- offline scores ----------

function unescape(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, " ");
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function syllableCount(word) {
  // Crude English syllable estimate. Good enough for grade-level signals,
  // not for poetry. Adapted from common public-domain heuristics.
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  // remove silent endings
  const trimmed = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const vowelGroups = trimmed.match(/[aeiouy]+/g);
  return Math.max(1, vowelGroups ? vowelGroups.length : 1);
}

function fleschKincaidGrade(text) {
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || [""]).length);
  const words = wordCount(text) || 1;
  const syllables = text
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, w) => sum + syllableCount(w), 0);
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

// Bundled subset of the Dale-Chall easy-word list (public domain), ~3000
// words. Stored as a Set for O(1) lookup. This file lives alongside the
// script to avoid an npm dep.
const dalChallPath = path.join(__dirname, "audit-dale-chall-words.txt");
let dalChallSet = null;
if (fs.existsSync(dalChallPath)) {
  dalChallSet = new Set(
    fs
      .readFileSync(dalChallPath, "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

function hardWords(text) {
  if (!dalChallSet) return [];
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  const seen = new Set();
  const hard = [];
  for (const w of words) {
    if (seen.has(w)) continue;
    seen.add(w);
    if (w.length <= 2) continue;
    if (/^\d+$/.test(w)) continue;
    if (!dalChallSet.has(w) && !dalChallSet.has(w.replace(/'s$/, ""))) {
      hard.push(w);
    }
  }
  return hard;
}

for (const r of records) {
  r.words = wordCount(r.englishDefinition);
  r.grade = round1(fleschKincaidGrade(r.englishDefinition));
  r.hard = hardWords(r.englishDefinition);
  r.flagged =
    r.words > LENGTH_FLAG_THRESHOLD ||
    r.grade > 6 ||
    r.hard.length >= 2 ||
    looksCircular(r);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function looksCircular(r) {
  // Definition that contains the term itself (or its singular/plural form)
  // is a soft circularity signal — flag it for human review.
  const def = r.englishDefinition.toLowerCase();
  const t = r.term.toLowerCase();
  if (!t) return false;
  const tNoS = t.endsWith("s") ? t.slice(0, -1) : t;
  return def.includes(t) || (tNoS.length > 3 && def.includes(tNoS));
}

// ---------- write CSV ----------

if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

function csvCell(s) {
  const v = String(s ?? "");
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

const csvHeader = ["id", "term", "englishDefinition", "words", "grade", "hardWords", "flagged"];
const csvRows = records.map((r) =>
  [
    r.id,
    r.term,
    r.englishDefinition,
    r.words,
    r.grade,
    r.hard.join(" "),
    r.flagged ? "yes" : "",
  ]
    .map(csvCell)
    .join(",")
);

fs.writeFileSync(
  path.join(auditDir, "definitions-all.csv"),
  [csvHeader.join(","), ...csvRows].join("\n") + "\n",
  "utf8"
);
console.log(`Wrote audit/definitions-all.csv (${records.length} rows).`);

// ---------- write Claude.ai chunk prompts ----------

const chunkSize = Math.ceil(unreviewed.length / CHUNK_COUNT);
const chunks = [];
for (let i = 0; i < unreviewed.length; i += chunkSize) {
  chunks.push(unreviewed.slice(i, i + chunkSize));
}

const PROMPT_HEADER = (chunkIndex, totalChunks, count) => `\
You are auditing English vocabulary definitions for an adult ESL learning app.
Learners are at NRS Beginning Literacy / Beginning Basic ESL (CASAS ~180-200,
roughly grade 1-3 reading). They are ADULTS — do not patronize them. They
also use Google Translate liberally, so the goal is NOT to oversimplify; it
is to make every definition CLEAR, PRECISE, and UNAMBIGUOUS.

Audit each definition below for these specific failure modes:

  - vague: doesn't distinguish this word from similar ones (e.g. "clothing
    you wear" doesn't tell you a shirt from pants)
  - broad: too general — would fit many other words
  - narrow: excludes legitimate normal uses of the word
  - circular: defines the word using itself or its root
  - ambiguous: could fit a different word equally well
  - hard: uses uncommon English that the learner cannot reasonably translate
  - ok: definition is clear, precise, and adult-appropriate as-is

Output STRICT JSON, no markdown fences, no commentary. One object per item:

  { "id": <number>, "status": "ok" | "vague" | "broad" | "narrow" | "circular" | "ambiguous" | "hard", "suggestion": "<rewrite or empty string if ok>" }

When you suggest a rewrite, keep it under 15 words, use common English, and
treat the learner as a competent adult — concrete and specific over baby talk.

This is chunk ${chunkIndex + 1} of ${totalChunks} (${count} items). Return a JSON
array with exactly ${count} entries, in the same order as the input.

INPUT:
`;

chunks.forEach((chunk, i) => {
  const items = chunk
    .map((r) => `  { "id": ${r.id}, "term": ${JSON.stringify(r.term)}, "englishDefinition": ${JSON.stringify(r.englishDefinition)} }`)
    .join(",\n");
  const body = PROMPT_HEADER(i, chunks.length, chunk.length) + "[\n" + items + "\n]\n";
  const filename = path.join(
    auditDir,
    `audit-prompt-${i + 1}of${chunks.length}.txt`
  );
  fs.writeFileSync(filename, body, "utf8");
});

console.log(`Wrote ${chunks.length} prompt chunks to audit/.`);

// ---------- summary ----------

const flaggedOffline = records.filter((r) => r.flagged).length;
console.log(
  `Offline flags: ${flaggedOffline} / ${records.length} definitions had a length/grade/hard-word/circular signal.`
);
console.log("");
console.log("Next steps:");
console.log("  1. Open each audit/audit-prompt-N.txt, copy the entire file.");
console.log("  2. Paste into a fresh Claude.ai conversation, send.");
console.log("  3. Save the JSON response as audit/audit-results-N.json.");
console.log("  4. Run: node scripts/maintenance/apply-definition-rewrites.mjs");
