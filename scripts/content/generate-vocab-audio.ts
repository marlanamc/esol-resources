/**
 * Generate vocabulary pronunciation audio files using ElevenLabs API.
 *
 * This script:
 * - Scans all seeded vocabulary JSON content from the database
 * - Extracts unique vocab terms using existing helpers
 * - Generates `public/audio/vocab/<term>.mp3` for each term (if missing)
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-vocab-audio.ts
 *
 * Optional:
 *   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM npx tsx scripts/content/generate-vocab-audio.ts
 */

import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { extractVocabTermsFromJsonContent, dedupeVocabTerms } from "../../src/components/dashboard/activity-categories-vocab-utils";

const prisma = new PrismaClient();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM"; // Rachel - clear American English
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "vocab");

if (!API_KEY) {
  console.error("❌ Missing ELEVENLABS_API_KEY environment variable.");
  console.error("   Get your key from https://elevenlabs.io and run:");
  console.error("   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-vocab-audio.ts");
  process.exit(1);
}

async function generateAudio(text: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
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

async function collectVocabTerms(): Promise<string[]> {
  // Look for consolidated vocabulary activities
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
}

async function main() {
  console.log("🎙️  ElevenLabs Vocabulary Pronunciation Audio Generator");
  console.log("======================================================\n");
  console.log(`Voice ID: ${DEFAULT_VOICE_ID}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
  }

  const terms = await collectVocabTerms();
  if (terms.length === 0) {
    console.log("No vocabulary terms found. Are vocab activities seeded yet?");
    await prisma.$disconnect();
    return;
  }

  console.log(`\n📝 Unique vocab terms: ${terms.length}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i]!;
    const safeFileName = encodeURIComponent(term);
    const outputPath = path.join(OUTPUT_DIR, `${safeFileName}.mp3`);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  [${i + 1}/${terms.length}] Skipping "${term}" (already exists)`);
      skipped++;
      continue;
    }

    console.log(`🔊 [${i + 1}/${terms.length}] Generating "${term}"...`);
    const success = await generateAudio(term, outputPath);

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

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

