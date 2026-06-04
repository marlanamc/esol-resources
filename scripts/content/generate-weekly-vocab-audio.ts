/**
 * Generate ElevenLabs pronunciation audio for ALL weekly vocab words
 * (Cycle 1: Sep–Jan  +  Cycle 2: Feb–Jun) sourced directly from weekly-vocab-data.js.
 *
 * No database connection required — reads data file directly.
 * Skips any .mp3 that already exists (pass --force to overwrite).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... npx tsx scripts/content/generate-weekly-vocab-audio.ts
 *
 * Flags:
 *   --force          Overwrite existing .mp3 files
 *   --only <term>    Generate audio for one specific term (exact match, case-sensitive)
 *   --dry-run        Print what would be generated without calling ElevenLabs
 *
 * Voice rotation (Rachel → Josh → Elli → Adam) gives natural variety across weeks.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_KEY = process.env.ELEVENLABS_API_KEY;
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "vocab");

const VOICE_OPTIONS = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" }, // warm US female
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },   // clear US male
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },   // friendly US female
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },   // authoritative US male
] as const;

const VOICE_IDS = process.env.ELEVENLABS_VOICE_IDS
  ? process.env.ELEVENLABS_VOICE_IDS.split(",").map((v) => v.trim()).filter(Boolean)
  : process.env.ELEVENLABS_VOICE_ID
    ? [process.env.ELEVENLABS_VOICE_ID]
    : VOICE_OPTIONS.map((v) => v.id);

const VOICE_ID_LOOKUP = new Map<string, string>(VOICE_OPTIONS.map((v) => [v.id, v.name]));

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function parseArgs(): { force: boolean; onlyTerm?: string; dryRun: boolean } {
  const argv = process.argv.slice(2);
  let force = false;
  let dryRun = false;
  let onlyTerm: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--force") force = true;
    else if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--only" && argv[i + 1]) onlyTerm = argv[++i]!.trim();
  }
  return { force, onlyTerm, dryRun };
}

// Words where the bare term is ambiguous — use a short phrase to guide TTS pronunciation.
const PRONUNCIATION_OVERRIDES: Record<string, string> = {
  record: "to record something",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sanitizeFilename(term: string): string {
  return term.trim().replace(/[/\\:?*"<>|]/g, "-");
}

function ttsText(term: string): string {
  return PRONUNCIATION_OVERRIDES[term.toLowerCase()] ?? term;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function voiceForIndex(idx: number): { id: string; name: string } {
  const vid = VOICE_IDS[idx % VOICE_IDS.length] ?? VOICE_OPTIONS[0].id;
  return { id: vid, name: VOICE_ID_LOOKUP.get(vid) ?? vid };
}

// ---------------------------------------------------------------------------
// ElevenLabs API call
// ---------------------------------------------------------------------------
async function generateAudio(text: string, outputPath: string, voiceId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5", // fast + free-tier compatible
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "unknown");
      console.error(`  ❌ ElevenLabs error for "${text}": ${response.status} — ${err}`);
      return false;
    }

    const buf = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buf));
    return true;
  } catch (err) {
    console.error(`  ❌ Fetch failed for "${text}":`, err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Collect all unique terms from weekly-vocab-data.js
// ---------------------------------------------------------------------------
function collectTerms(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { weeklyVocabData } = require("../vocab/weekly-vocab-data.js") as {
    weeklyVocabData: Record<string, { words: Array<{ term: string }> }>;
  };

  const seen = new Set<string>();
  const terms: string[] = [];

  for (const [, data] of Object.entries(weeklyVocabData)) {
    for (const word of data.words) {
      const t = word.term.trim();
      if (!seen.has(t)) {
        seen.add(t);
        terms.push(t);
      }
    }
  }
  return terms;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const { force, onlyTerm, dryRun } = parseArgs();

  console.log("🎙️  Weekly Vocab — ElevenLabs Audio Generator");
  console.log("==============================================\n");

  if (!API_KEY && !dryRun) {
    console.error("❌  ELEVENLABS_API_KEY is not set.");
    console.error("    Run: ELEVENLABS_API_KEY=sk_... npx tsx scripts/content/generate-weekly-vocab-audio.ts");
    process.exit(1);
  }

  if (dryRun) console.log("🧪  DRY-RUN mode — no API calls will be made.\n");

  const voices = VOICE_IDS.map((id) => VOICE_ID_LOOKUP.get(id) ?? id).join(", ");
  console.log(`Voices: ${voices}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁  Created directory: ${OUTPUT_DIR}\n`);
  }

  let allTerms = collectTerms();
  console.log(`📝  Unique terms from weekly-vocab-data.js: ${allTerms.length}\n`);

  if (onlyTerm) {
    const match = allTerms.find((t) => t.toLowerCase() === onlyTerm.toLowerCase());
    if (!match) {
      console.error(`❌  Term "${onlyTerm}" not found in weekly vocab data.`);
      console.error(`    Available terms: ${allTerms.join(", ")}`);
      process.exit(1);
    }
    allTerms = [match];
    console.log(`🎯  Single-term mode: "${match}"\n`);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < allTerms.length; i++) {
    const term = allTerms[i]!;
    const filename = sanitizeFilename(term);
    const outputPath = path.join(OUTPUT_DIR, `${filename}.mp3`);
    const { id: voiceId, name: voiceName } = voiceForIndex(i);
    const exists = fs.existsSync(outputPath);

    if (exists && !force) {
      console.log(`⏭️   [${i + 1}/${allTerms.length}] "${term}" — already exists, skipping`);
      skipped++;
      continue;
    }

    if (exists && force) {
      console.log(`♻️   [${i + 1}/${allTerms.length}] "${term}" — overwriting (--force)`);
    } else {
      console.log(`🔊  [${i + 1}/${allTerms.length}] "${term}" — generating with ${voiceName}...`);
    }

    if (dryRun) {
      console.log(`     (dry-run) would save: ${filename}.mp3`);
      generated++;
      continue;
    }

    const ok = await generateAudio(ttsText(term), outputPath, voiceId);
    if (ok) {
      console.log(`     ✅  Saved: ${filename}.mp3`);
      generated++;
    } else {
      failed++;
    }

    // Polite rate-limiting — ElevenLabs free tier allows ~3 req/s
    if (i < allTerms.length - 1) await sleep(400);
  }

  console.log("\n==============================================");
  console.log("📊  Summary:");
  console.log(`    ✅  Generated : ${generated}`);
  console.log(`    ⏭️   Skipped   : ${skipped}`);
  console.log(`    ❌  Failed    : ${failed}`);
  console.log(`\n📁  Audio saved to: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
