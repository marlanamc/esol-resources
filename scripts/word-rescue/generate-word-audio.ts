/** Reuse vocabulary recordings; buy only missing word clips. Never sends student data. */
import { loadEnvConfig } from '@next/env';
import { copyFile, mkdir, readFile, readdir, stat, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { RESCUE_WORDS } from '../../src/lib/word-rescue/content';

loadEnvConfig(process.cwd());
const apply = process.argv.includes('--apply');
const output = path.resolve('public/word-rescue-audio');
const library = path.resolve('public/audio/vocab');
const manifestPath = path.join(output, 'word-sources.json');
type Source = { text: string; source: string; review: 'needs-listening-review' };
async function main() {
  await mkdir(output, { recursive: true });
  const files = await readdir(library);
  let manifest: Record<string, Source> = {};
  try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first run */ }
  const terms = [...new Set(RESCUE_WORDS.map(word => word.term))];
  const missing = terms.filter(term => !files.some(file => file.toLowerCase() === `${term}.mp3`.toLowerCase()));
  console.log(JSON.stringify({ words: terms.length, missing, mode: apply ? 'apply' : 'dry-run' }));
  if (!apply) return;
  if (await stat(path.join(output, 'elevenlabs-sources.json')).then(() => true).catch(() => false)) {
    throw new Error('Consistent ElevenLabs audio exists. Use audio:word-rescue:elevenlabs to preserve its voice across all three steps.');
  }
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  for (const term of terms) {
    const words = RESCUE_WORDS.filter(word => word.term === term);
    const filename = files.find(file => file.toLowerCase() === `${term}.mp3`.toLowerCase());
    let source = filename ? path.join(library, filename) : '';
    if (!source) {
      // A successfully generated clip remains reusable across interrupted runs.
      const cached = words.find(word => manifest[word.id]?.text === term && manifest[word.id]?.source === 'elevenlabs');
      if (cached && await stat(path.join(output, `${cached.id}-word.mp3`)).then(s => s.size > 1000).catch(() => false)) {
        source = path.join(output, `${cached.id}-word.mp3`);
      } else {
        if (!key) throw new Error('ELEVENLABS_API_KEY is not configured.');
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
          method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify({ text: term, model_id: 'eleven_turbo_v2_5', language_code: 'en', voice_settings: { stability: 0.75, similarity_boost: 0.75, style: 0, use_speaker_boost: true } }),
          signal: AbortSignal.timeout(60000),
        });
        if (!response.ok) throw new Error(`ElevenLabs failed (${response.status}) for ${term}. No automatic paid retry.`);
        const audio = Buffer.from(await response.arrayBuffer());
        if (!response.headers.get('content-type')?.includes('audio') || audio.length < 1000) throw new Error(`Invalid audio for ${term}`);
        source = path.join(output, `${words[0].id}-word.mp3`);
        await writeFile(`${source}.tmp`, audio); await rename(`${source}.tmp`, source);
        console.log(`Generated: ${term}`);
      }
    }
    for (const word of words) {
      const destination = path.join(output, `${word.id}-word.mp3`);
      if (source !== destination) await copyFile(source, destination);
      manifest[word.id] = { text: term, source: filename ? `vocabulary/${filename}` : 'elevenlabs', review: 'needs-listening-review' };
    }
    await writeFile(`${manifestPath}.tmp`, JSON.stringify(manifest, null, 2) + '\n');
    await rename(`${manifestPath}.tmp`, manifestPath);
  }
  console.log(`Prepared ${Object.keys(manifest).length} word clips. Phrases/sentences remain draft preview audio.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Audio generation failed'); process.exitCode = 1; });
