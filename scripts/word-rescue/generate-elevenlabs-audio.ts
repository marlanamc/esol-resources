/** One voice for the active FY27 catalogue. Resume by text + voice + model, never by filename alone. */
import { loadEnvConfig } from '@next/env';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID } from '../../src/lib/word-rescue/content';

loadEnvConfig(process.cwd());
const apply = process.argv.includes('--apply');
const output = path.resolve('public/word-rescue-audio');
const voice = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const model = 'eleven_turbo_v2_5';
const settings = { stability: 0.75, similarity_boost: 0.75, style: 0, use_speaker_boost: true };
const manifestPath = path.join(output, 'elevenlabs-sources.json');
type Entry = { text: string; signature: string; voice: string; model: string; source: 'elevenlabs'; review: 'needs-listening-review' };
async function main() {
  const ids = [...new Set(RESCUE_COLLECTIONS.flatMap(set => set.wordIds))];
  const groups = new Map<string, { text: string; signature: string; files: string[] }>();
  for (const id of ids) for (const clip of ['word', 'phrase', 'sentence'] as const) {
    const word = RESCUE_WORD_BY_ID[id];
    const text = clip === 'word' ? word.term : word[clip];
    const signature = createHash('sha256').update(JSON.stringify({ text, voice, model, settings })).digest('hex');
    const group = groups.get(signature) ?? { text, signature, files: [] };
    group.files.push(`${id}-${clip}.mp3`); groups.set(signature, group);
  }
  let manifest: Record<string, Entry> = {};
  try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first run */ }
  const jobs: { text: string; signature: string; files: string[]; cached?: string }[] = [];
  for (const group of groups.values()) {
    const cached = group.files.find(file => manifest[file]?.signature === group.signature);
    const valid = cached && await stat(path.join(output, cached)).then(s => s.size > 1000).catch(() => false);
    jobs.push({ ...group, cached: valid ? cached : undefined });
  }
  const missing = jobs.filter(job => !job.cached);
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', words: ids.length, clips: ids.length * 3, uniqueRequests: missing.length, characters: missing.reduce((sum, job) => sum + job.text.length, 0) }));
  if (!apply) return;
  if (!process.env.ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY is not configured.');
  await mkdir(output, { recursive: true });
  let checkpoint = Promise.resolve();
  let index = 0, done = 0, failed = false;
  async function worker() {
    while (!failed && index < jobs.length) {
      const job = jobs[index++];
      try {
        let audio: Buffer;
        if (job.cached) audio = await readFile(path.join(output, job.cached));
        else {
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
            method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY!, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
            body: JSON.stringify({ text: job.text, model_id: model, language_code: 'en', voice_settings: settings }),
            signal: AbortSignal.timeout(60000),
          });
          if (!response.ok) throw new Error(`ElevenLabs returned ${response.status}; stopped without automatic paid retries.`);
          audio = Buffer.from(await response.arrayBuffer());
          if (!response.headers.get('content-type')?.includes('audio') || audio.length < 1000) throw new Error('Invalid audio response.');
        }
        for (const file of job.files) {
          await writeFile(path.join(output, `${file}.tmp`), audio);
          await rename(path.join(output, `${file}.tmp`), path.join(output, file));
          manifest[file] = { text: job.text, signature: job.signature, voice, model, source: 'elevenlabs', review: 'needs-listening-review' };
        }
        checkpoint = checkpoint.then(async () => {
          await writeFile(`${manifestPath}.tmp`, JSON.stringify(manifest, null, 2) + '\n');
          await rename(`${manifestPath}.tmp`, manifestPath);
        });
        await checkpoint;
        done++;
        if (done % 20 === 0 || done === jobs.length) console.log(`Prepared ${done}/${jobs.length} unique clips`);
      } catch (error) { failed = true; throw error; }
    }
  }
  const results = await Promise.allSettled([worker(), worker()]);
  await checkpoint;
  const failure = results.find(result => result.status === 'rejected');
  if (failure?.status === 'rejected') throw failure.reason;
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify({ status: 'draft-needs-listening-review', provider: 'elevenlabs', voice, model, words: ids.length, clips: ids.length * 3, sources: 'elevenlabs-sources.json', scope: 'FY27 collections and everyday words; legacy saved sessions retain previous audio' }, null, 2) + '\n');
  console.log('All current word, phrase, and sentence clips use the same ElevenLabs voice.');
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Generation failed'); process.exitCode = 1; });
