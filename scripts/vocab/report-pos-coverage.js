#!/usr/bin/env node
/**
 * Report how many weekly vocab terms have POS from inline data, weekly batches, or legacy.
 * Usage: node scripts/vocab/report-pos-coverage.js
 */

const { weeklyVocabData } = require("./weekly-vocab-data.js");
const legacyPosMap = require("./legacy-pos-map.js");
const weeklyVocabPos = require("./weekly-vocab-pos.js");

function resolvePos(word) {
  if (word.pos && String(word.pos).trim()) return { pos: String(word.pos).trim(), source: "inline" };
  const key = word.term.toLowerCase();
  if (weeklyVocabPos[key]) return { pos: weeklyVocabPos[key], source: "weekly-vocab-pos" };
  if (legacyPosMap[key]) return { pos: legacyPosMap[key], source: "legacy" };
  return null;
}

const terms = new Map();
for (const [slug, unit] of Object.entries(weeklyVocabData)) {
  for (const list of [unit.words ?? [], unit.bonusWords ?? []]) {
    for (const word of list) {
      if (!word?.term) continue;
      const key = word.term.toLowerCase();
      if (!terms.has(key)) {
        terms.set(key, { term: word.term, slug, ...resolvePos(word) });
      }
    }
  }
}

const covered = [...terms.values()].filter((t) => t.pos);
const missing = [...terms.values()].filter((t) => !t.pos);

console.log(`POS coverage: ${covered.length}/${terms.size} terms`);
console.log(
  `  inline: ${covered.filter((t) => t.source === "inline").length}`,
  `batch: ${covered.filter((t) => t.source === "weekly-vocab-pos").length}`,
  `legacy: ${covered.filter((t) => t.source === "legacy").length}`
);
if (missing.length > 0) {
  console.log(`\nMissing POS (${missing.length}):`);
  for (const t of missing.slice(0, 20)) {
    console.log(`  - ${t.term} (${t.slug})`);
  }
  if (missing.length > 20) console.log(`  … and ${missing.length - 20} more`);
}
