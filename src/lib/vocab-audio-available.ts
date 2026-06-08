import fs from "node:fs";
import path from "node:path";

let cachedKeys: Set<string> | null = null;

function sanitizeAudioFilename(term: string): string {
  return term.trim().replace(/[/\\:?*"<>|]/g, "-");
}

function loadAudioKeys(): Set<string> {
  if (cachedKeys) return cachedKeys;

  const dir = path.join(process.cwd(), "public", "audio", "vocab");
  if (!fs.existsSync(dir)) {
    cachedKeys = new Set();
    return cachedKeys;
  }

  cachedKeys = new Set(
    fs
      .readdirSync(dir)
      .filter((file) => file.toLowerCase().endsWith(".mp3"))
      .map((file) => file.slice(0, -4).toLowerCase())
  );
  return cachedKeys;
}

/** True when a matching mp3 exists under public/audio/vocab. */
export function hasVocabAudioFile(term: string): boolean {
  const keys = loadAudioKeys();
  return keys.has(sanitizeAudioFilename(term).toLowerCase());
}
