#!/usr/bin/env node
/**
 * Audit cross-week duplicate terms in weekly-vocab-data.js.
 *
 * Daily Vocab merges duplicates into one VocabCard at sync time, but this check
 * helps authors notice when a term is reused across weeks before seeding.
 *
 * Usage:
 *   node --import tsx scripts/vocab/check-vocab-duplicates.js
 *   node --import tsx scripts/vocab/check-vocab-duplicates.js --update-baseline
 *   node --import tsx scripts/vocab/check-vocab-duplicates.js --report
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, "scripts/vocab/vocab-duplicates-baseline.json");
const DATA_PATH = path.join(ROOT, "scripts/vocab/weekly-vocab-data.js");

const { normalizeVocabTerm } = require("../../src/lib/vocab/review.ts");
const { weeklyVocabData } = require("./weekly-vocab-data.js");

const args = new Set(process.argv.slice(2));
const shouldUpdateBaseline = args.has("--update-baseline");
const verboseReport = args.has("--report");

function main() {

  const termMap = new Map();

  for (const slug of Object.keys(weeklyVocabData)) {
    const week = weeklyVocabData[slug];
    const entries = [
      ...(week.words ?? []).map((word) => ({ slug, field: "words", term: word.term })),
      ...(week.bonusWords ?? []).map((word) => ({ slug, field: "bonusWords", term: word.term })),
    ];

    for (const entry of entries) {
      const normalizedTerm = normalizeVocabTerm(entry.term);
      if (!normalizedTerm) continue;

      if (!termMap.has(normalizedTerm)) {
        termMap.set(normalizedTerm, []);
      }
      termMap.get(normalizedTerm).push(`${entry.slug}:${entry.field}`);
    }
  }

  const duplicates = [...termMap.entries()]
    .filter(([, locations]) => locations.length > 1)
    .map(([term, locations]) => ({ term, locations: [...locations].sort() }))
    .sort((left, right) => left.term.localeCompare(right.term));

  const duplicateTerms = duplicates.map((entry) => entry.term);
  const totalEntries = [...termMap.values()].reduce((sum, locations) => sum + locations.length, 0);

  if (shouldUpdateBaseline) {
    const baseline = {
      version: 1,
      generatedAt: new Date().toISOString(),
      scope: "scripts/vocab/weekly-vocab-data.js",
      note: "Cross-week duplicate normalized terms. Daily Vocab merges these into one VocabCard; baseline prevents accidental new duplicates during authoring.",
      duplicateTerms,
    };

    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
    console.log(`Wrote baseline: ${path.relative(ROOT, BASELINE_PATH)} (${duplicateTerms.length} duplicate terms)`);
    printSummary(totalEntries, termMap.size, duplicates);
    return;
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`ERROR: baseline not found: ${path.relative(ROOT, BASELINE_PATH)}`);
    console.error("Run: npm run check:vocab-duplicates:update-baseline");
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  const baselineTerms = new Set(baseline.duplicateTerms ?? []);
  const currentTerms = new Set(duplicateTerms);

  const newDuplicates = duplicateTerms.filter((term) => !baselineTerms.has(term));
  const removedDuplicates = [...baselineTerms].filter((term) => !currentTerms.has(term));

  printSummary(totalEntries, termMap.size, duplicates);

  if (verboseReport || newDuplicates.length > 0 || removedDuplicates.length > 0) {
    console.log("\nCross-week duplicate terms:");
    for (const entry of duplicates) {
      console.log(`  ${entry.term}`);
      for (const location of entry.locations) {
        console.log(`    - ${location}`);
      }
    }
  }

  if (removedDuplicates.length > 0) {
    console.log(`\nRemoved duplicates (${removedDuplicates.length}): ${removedDuplicates.join(", ")}`);
    console.log("Update baseline if this cleanup was intentional:");
    console.log("  npm run check:vocab-duplicates:update-baseline");
  }

  if (newDuplicates.length > 0) {
    console.error(`\nERROR: ${newDuplicates.length} new cross-week duplicate term(s) not in baseline:`);
    for (const term of newDuplicates) {
      const entry = duplicates.find((candidate) => candidate.term === term);
      console.error(`  - ${term}${entry ? ` (${entry.locations.join(", ")})` : ""}`);
    }
    console.error("\nDaily Vocab will merge these at sync time, but reuse should be intentional.");
    console.error("If expected, update baseline with: npm run check:vocab-duplicates:update-baseline");
    process.exit(1);
  }

  console.log(`\nOK: ${duplicateTerms.length} known cross-week duplicate term(s); no new duplicates.`);
}

function printSummary(totalEntries, uniqueTerms, duplicates) {
  console.log("\n=== Weekly Vocab Duplicate Audit ===");
  console.log(`Source: ${path.relative(ROOT, DATA_PATH)}`);
  console.log(`Total term entries: ${totalEntries}`);
  console.log(`Unique normalized terms: ${uniqueTerms}`);
  console.log(`Cross-week duplicates: ${duplicates.length}`);
}

main();
