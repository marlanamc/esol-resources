#!/usr/bin/env node
/**
 * List weekly vocab terms missing pronunciation mp3 files.
 * Usage: node scripts/vocab/report-vocab-audio-coverage.js
 */

const fs = require("fs");
const path = require("path");
const { weeklyVocabData } = require("./weekly-vocab-data.js");
const legacyPosMap = require("./legacy-pos-map.js");

const AUDIO_DIR = path.join(process.cwd(), "public", "audio", "vocab");

function sanitizeFilename(term) {
  return term.trim().replace(/[/\\:?*"<>|]/g, "-");
}

function hasAudio(term) {
  const filename = `${sanitizeFilename(term)}.mp3`;
  if (fs.existsSync(path.join(AUDIO_DIR, filename))) return true;
  const lower = filename.toLowerCase();
  return fs.readdirSync(AUDIO_DIR).some((file) => file.toLowerCase() === lower);
}

const terms = new Set();
for (const data of Object.values(weeklyVocabData)) {
  for (const word of [...(data.words ?? []), ...(data.bonusWords ?? [])]) {
    if (word?.term) terms.add(word.term.trim());
  }
}
for (const term of Object.keys(legacyPosMap)) {
  if (term.trim()) terms.add(term.trim());
}

const missing = [...terms].filter((term) => !hasAudio(term)).sort((a, b) => a.localeCompare(b));

console.log(`Vocab audio coverage: ${terms.size - missing.length}/${terms.size} terms`);
if (missing.length > 0) {
  console.log(`\nMissing audio (${missing.length}):`);
  for (const term of missing) console.log(`  - ${term}`);
  console.log("\nGenerate missing files with:");
  console.log("  ELEVENLABS_API_KEY=... npm run audio:weekly-vocab");
}
