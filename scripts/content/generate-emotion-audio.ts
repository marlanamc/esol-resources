/**
 * Generate Emotion Spin Wheel word audio with ElevenLabs.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-emotion-audio.ts
 *
 * Optional:
 *   ELEVENLABS_VOICE_ID=...  Use a specific voice. Defaults to Rachel.
 *   --force                  Overwrite existing MP3 files.
 */

import * as fs from "fs";
import * as path from "path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "emotions");

const EMOTION_WORDS = [
  "happy",
  "excited",
  "proud",
  "peaceful",
  "accepted",
  "tired",
  "busy",
  "bored",
  "stressed",
  "confused",
  "nervous",
  "lonely",
  "disappointed",
  "angry",
  "frustrated",
  "scared",
  "hopeful",
  "calm",
] as const;

function parseCliArgs(): { force: boolean } {
  return { force: process.argv.includes("--force") };
}

function outputPathForWord(word: string): string {
  return path.join(OUTPUT_DIR, `${word}.mp3`);
}

async function generateAudio(word: string, outputPath: string): Promise<boolean> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": API_KEY!,
    },
    body: JSON.stringify({
      text: word,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.65,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
        speed: 0.85,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "unknown error");
    console.error(`  Failed "${word}": ${response.status} ${error}`);
    return false;
  }

  const audioBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { force } = parseCliArgs();

  if (!API_KEY) {
    console.error("Missing ELEVENLABS_API_KEY environment variable.");
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  console.log("ElevenLabs Emotion Spin Wheel Audio Generator");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Words: ${EMOTION_WORDS.length}\n`);

  for (let i = 0; i < EMOTION_WORDS.length; i++) {
    const word = EMOTION_WORDS[i]!;
    const outputPath = outputPathForWord(word);

    if (fs.existsSync(outputPath) && !force) {
      console.log(`[${i + 1}/${EMOTION_WORDS.length}] Skipping "${word}"`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${EMOTION_WORDS.length}] Generating "${word}"`);
    try {
      if (await generateAudio(word, outputPath)) {
        generated++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`  Failed "${word}":`, error);
      failed++;
    }

    if (i < EMOTION_WORDS.length - 1) await sleep(500);
  }

  console.log("\nSummary");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
