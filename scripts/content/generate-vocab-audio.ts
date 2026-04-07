/**
 * Generate vocabulary pronunciation audio files using ElevenLabs API.
 *
 * This script:
 * - Scans seeded vocabulary JSON content from the database when available
 * - Includes public Level 1 vocabulary terms from the LMS data source
 * - Generates `public/audio/vocab/<sanitized-term>.mp3` for each term (if missing).
 *   Filenames use the term text with spaces (not URI encoding) so URLs like
 *   `/audio/vocab/End%20table.mp3` resolve to `End table.mp3` on disk.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-vocab-audio.ts
 *
 * Flags:
 *   --only <term>   Generate a single term that appears in the collected vocab (e.g. --only Name)
 *   --force         Overwrite an existing mp3 for that term
 *
 * Optional:
 *   ELEVENLABS_VOICE_ID=... — single voice only (overrides default mix)
 *   ELEVENLABS_VOICE_IDS=id1,id2,... — explicit rotation order (overrides default mix)
 *
 * Default (no voice env): rotates female/male preset voices — Rachel, Josh, Elli, Adam.
 */

import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { extractVocabTermsFromJsonContent, dedupeVocabTerms } from "../../src/components/dashboard/activity-categories-vocab-utils";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "../../src/data/public-level1-vocab";

const API_KEY = process.env.ELEVENLABS_API_KEY;
/** Preset US English voices (ElevenLabs): alternating female / male for variety. */
const VOICE_OPTIONS = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
] as const;
const VOICE_ID_LOOKUP = new Map<string, string>(VOICE_OPTIONS.map((voice) => [voice.id, voice.name]));
const DEFAULT_MIX_VOICE_IDS = VOICE_OPTIONS.map((voice) => voice.id);
const DEFAULT_VOICE_IDS = process.env.ELEVENLABS_VOICE_IDS
  ? process.env.ELEVENLABS_VOICE_IDS.split(",").map((value) => value.trim()).filter(Boolean)
  : process.env.ELEVENLABS_VOICE_ID
    ? [process.env.ELEVENLABS_VOICE_ID]
    : DEFAULT_MIX_VOICE_IDS;
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "vocab");

/** When the card label should not match what we send to TTS (e.g. shorter spoken clip). */
const SPEAK_TEXT_OVERRIDES: Record<string, string> = {
  Name: "name",
};

function parseCliArgs(): { onlyTerm: string | undefined; force: boolean } {
  let onlyTerm: string | undefined;
  let force = false;
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") {
      force = true;
    } else if (a === "--only" && argv[i + 1]) {
      onlyTerm = argv[++i]!.trim();
    }
  }
  return { onlyTerm, force };
}

function speakTextForTerm(term: string): string {
  return SPEAK_TEXT_OVERRIDES[term] ?? term;
}

if (!API_KEY) {
  console.error("❌ Missing ELEVENLABS_API_KEY environment variable.");
  console.error("   Get your key from https://elevenlabs.io and run:");
  console.error("   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-vocab-audio.ts");
  process.exit(1);
}

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
        model_id: "eleven_turbo_v2_5", // Free tier compatible
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  ❌ API error for "${text}": ${response.status} - ${error}`);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to generate "${text}":`, error);
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Filesystem-safe base name; must match what static hosting maps from encodeURIComponent(term) in URLs. */
function sanitizeFilename(term: string): string {
  const trimmed = term.trim();
  if (!trimmed) {
    return "empty";
  }
  return trimmed.replace(/[/\\:?*"<>|]/g, "-");
}

function collectPublicLevel1Terms(): string[] {
  return dedupeVocabTerms(
    LEVEL1_PUBLIC_VOCAB_UNITS.flatMap((unit) =>
      unit.categories.flatMap((category) => category.cards.map((card) => card.term))
    )
  );
}

async function collectDatabaseVocabTerms(): Promise<string[]> {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    console.log("Skipping database vocab scan because no database URL is configured.\n");
    return [];
  }

  const prisma = new PrismaClient();

  // Look for consolidated vocabulary activities
  try {
    const activities = await prisma.activity.findMany({
      where: {
        OR: [
          {
            type: {
              equals: "vocabulary",
              mode: "insensitive",
            },
          },
          {
            id: {
              startsWith: "vocab-",
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: "Vocab",
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    console.log(`Found ${activities.length} vocabulary activities to scan.\n`);

    const allTerms: string[] = [];

    for (const activity of activities) {
      if (!activity.content) continue;
      try {
        const contentStr =
          typeof activity.content === "string" ? activity.content : JSON.stringify(activity.content);
        const terms = extractVocabTermsFromJsonContent(contentStr);
        if (terms.length > 0) {
          console.log(`- ${activity.id} (${activity.title}): ${terms.length} terms`);
          allTerms.push(...terms);
        }
      } catch (error) {
        console.error(`  ⚠️ Failed to parse vocab terms for activity ${activity.id}:`, error);
      }
    }

    return dedupeVocabTerms(allTerms);
  } finally {
    await prisma.$disconnect();
  }
}

async function collectVocabTerms(): Promise<string[]> {
  const publicTerms = collectPublicLevel1Terms();
  console.log(`Found ${publicTerms.length} public Level 1 terms.\n`);

  const databaseTerms = await collectDatabaseVocabTerms();
  return dedupeVocabTerms([...publicTerms, ...databaseTerms]);
}

async function main() {
  const { onlyTerm, force } = parseCliArgs();

  console.log("🎙️  ElevenLabs Vocabulary Pronunciation Audio Generator");
  console.log("======================================================\n");
  console.log(
    `Voices: ${DEFAULT_VOICE_IDS.map((voiceId) => VOICE_ID_LOOKUP.get(voiceId) ?? voiceId).join(", ")}`
  );

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
  }

  const allTerms = await collectVocabTerms();
  if (allTerms.length === 0) {
    console.log("No vocabulary terms found. Are vocab activities seeded yet?");
    return;
  }

  let terms = allTerms;
  if (onlyTerm) {
    const match = allTerms.find((t) => t === onlyTerm);
    if (!match) {
      console.error(`❌ Term "${onlyTerm}" not found in ${allTerms.length} collected terms.`);
      process.exit(1);
    }
    terms = [match];
    console.log(`\n🎯 Single term mode: "${match}"\n`);
  }

  console.log(`\n📝 Unique vocab terms (this run): ${terms.length}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i]!;
    const safeFileName = sanitizeFilename(term);
    const outputPath = path.join(OUTPUT_DIR, `${safeFileName}.mp3`);
    const globalIndex = allTerms.indexOf(term);
    const voiceIndex = globalIndex >= 0 ? globalIndex : i;
    const voiceId = DEFAULT_VOICE_IDS[voiceIndex % DEFAULT_VOICE_IDS.length] ?? VOICE_OPTIONS[0].id;
    const voiceName = VOICE_ID_LOOKUP.get(voiceId) ?? voiceId;
    const spoken = speakTextForTerm(term);

    if (fs.existsSync(outputPath) && !force) {
      console.log(`⏭️  [${i + 1}/${terms.length}] Skipping "${term}" (already exists)`);
      skipped++;
      continue;
    }

    if (fs.existsSync(outputPath) && force) {
      console.log(`♻️  [${i + 1}/${terms.length}] Overwriting "${term}" (--force)...`);
    }

    const label =
      spoken === term ? `"${term}"` : `"${term}" (speak: "${spoken}")`;
    console.log(`🔊 [${i + 1}/${terms.length}] Generating ${label} with ${voiceName}...`);
    const success = await generateAudio(spoken, outputPath, voiceId);

    if (success) {
      console.log(`   ✅ Saved: ${safeFileName}.mp3`);
      generated++;
    } else {
      failed++;
    }

    if (i < terms.length - 1) {
      await sleep(500); // be nice to the free tier
    }
  }

  console.log("\n======================================================");
  console.log("📊 Summary:");
  console.log(`   ✅ Generated: ${generated}`);
  console.log(`   ⏭️  Skipped:   ${skipped}`);
  console.log(`   ❌ Failed:    ${failed}`);
  console.log(`\n📁 Audio files saved to: ${OUTPUT_DIR}`);
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
