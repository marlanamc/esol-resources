/**
 * Generate sentence-lab audio files using ElevenLabs API.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-pronunciation-sentence-audio.ts
 *
 * Voice (optional): defaults to ElevenLabs preset "Adam" (American English, male).
 *   ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
 * Pick another voice: GET https://api.elevenlabs.io/v1/voices with header xi-api-key
 *
 * Regenerate existing MP3s (e.g. after changing voice): ELEVENLABS_REGENERATE=1
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAllPronunciationSentencePrompts } from '../../src/data/pronunciation-sentence-listening';

const API_KEY = process.env.ELEVENLABS_API_KEY;
/** ElevenLabs preset "Adam" — American English, male (multilingual v2 compatible). */
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
const REGENERATE = process.env.ELEVENLABS_REGENERATE === '1' || process.env.ELEVENLABS_REGENERATE === 'true';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio', 'pronunciation-sentences');

if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY environment variable.');
  console.error('Run: ELEVENLABS_API_KEY=your_key_here npx tsx scripts/content/generate-pronunciation-sentence-audio.ts');
  process.exit(1);
}

async function generateAudio(text: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
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
      console.error(`API error for "${text}": ${response.status} - ${error}`);
      return false;
    }

    const audioBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    return true;
  } catch (error) {
    console.error(`Failed to generate "${text}":`, error);
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const prompts = getAllPronunciationSentencePrompts();

  console.log('ElevenLabs Pronunciation Sentence Audio Generator');
  console.log('===============================================');
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Regenerate existing files: ${REGENERATE ? 'yes' : 'no'}`);
  console.log(`Total sentences: ${prompts.length}`);
  console.log('');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created: ${OUTPUT_DIR}`);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let index = 0; index < prompts.length; index += 1) {
    const prompt = prompts[index]!;
    const outputPath = path.join(OUTPUT_DIR, `${prompt.id}.mp3`);

    if (fs.existsSync(outputPath) && !REGENERATE) {
      console.log(`[${index + 1}/${prompts.length}] Skip ${prompt.id} (${prompt.setKey})`);
      skipped += 1;
      continue;
    }

    console.log(`[${index + 1}/${prompts.length}] Generate ${prompt.id} (${prompt.setKey})`);
    const success = await generateAudio(prompt.text, outputPath);
    if (success) {
      generated += 1;
    } else {
      failed += 1;
    }

    if (index < prompts.length - 1) {
      await sleep(500);
    }
  }

  console.log('');
  console.log('Summary');
  console.log('=======');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
