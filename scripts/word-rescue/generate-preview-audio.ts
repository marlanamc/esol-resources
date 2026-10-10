/** Local draft audio, no API keys or external service. Requires macOS say + ffmpeg.
 * Review clips before release; this script does not mark them approved. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, stat, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { RESCUE_WORDS, rescueAudioPath } from '../../src/lib/word-rescue/content';

const run = promisify(execFile);
async function main() {
  const output = path.join(process.cwd(), 'public/word-rescue-audio');
  await mkdir(output, { recursive: true });
  const jobs = RESCUE_WORDS.flatMap(word => (['word', 'phrase', 'sentence'] as const).map(clip => ({ id: word.id, clip, text: clip === 'word' ? word.term : word[clip] })));
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      const filename = path.join(process.cwd(), 'public', rescueAudioPath(job.id, job.clip));
      try { if ((await stat(filename)).size > 1000) continue; } catch { /* Generate missing or empty audio. */ }
      const temporary = `${filename}.aiff`;
      try {
        await run('/usr/bin/say', ['-v', 'Samantha', '-r', '155', '-o', temporary, job.text], { timeout: 30000 });
        await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', temporary, '-codec:a', 'libmp3lame', '-b:a', '64k', filename]);
        if ((await stat(filename)).size < 1000) { await rm(filename, { force: true }); throw new Error('The speech service produced empty audio. Run outside the sandbox.'); }
      } finally { await rm(temporary, { force: true }); }
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify({ status: 'draft-needs-listening-review', voice: 'Samantha en-US', words: RESCUE_WORDS.length, clips: jobs.length }, null, 2) + '\n');
  console.log(`Prepared ${jobs.length} draft clips for ${RESCUE_WORDS.length} words.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
