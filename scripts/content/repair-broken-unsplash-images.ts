/**
 * Repair grammar guide scene images whose Unsplash CDN URLs return 404.
 *
 * Usage:
 *   npx tsx scripts/content/repair-broken-unsplash-images.ts
 *   npx tsx scripts/content/repair-broken-unsplash-images.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: path.join(__dirname, "../../.env.local") });
loadDotenv({ path: path.join(__dirname, "../../.env") });

const ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY?.trim() ||
  process.env.UNSPLASH_CLIENT_ID?.trim() ||
  process.env.UNSPLASH_ACCESS_KEY_ID?.trim();

const DATA_DIR = path.join(__dirname, "../../src/data");
const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = Number(process.env.UNSPLASH_DELAY_MS ?? 1500);

interface SceneEntry {
  key: string;
  url: string;
  alt: string;
  unsplashId: string;
  creditName: string;
  creditUrl: string;
  start: number;
  end: number;
  raw: string;
}

interface UnsplashPhoto {
  id: string;
  urls: { regular?: string; small?: string; full?: string; raw?: string };
  links?: { html?: string };
  user?: { name?: string; username?: string; links?: { html?: string } };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toCanonicalUrl(raw: string): string {
  const u = new URL(raw);
  u.search = "";
  u.searchParams.set("w", "1200");
  u.searchParams.set("q", "80");
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "crop");
  return u.toString();
}

function parseScenes(content: string): SceneEntry[] {
  const scenes: SceneEntry[] = [];
  const sceneRegex = /(scene\w+):\s*\{([\s\S]*?)\n  \},/g;

  let match: RegExpExecArray | null;
  while ((match = sceneRegex.exec(content))) {
    const key = match[1];
    const body = match[2];
    const url = body.match(/url:\s*"([^"]+)"/)?.[1];
    const alt = body.match(/alt:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    const unsplashId = body.match(/unsplashId:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    const creditBlock = body.match(/credit:\s*\{([\s\S]*?)\}/)?.[1];
    const creditName = creditBlock?.match(/name:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    const creditUrl = creditBlock?.match(/url:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    if (!url || !alt || !unsplashId || !creditName || !creditUrl) continue;

    scenes.push({
      key,
      url,
      alt,
      unsplashId,
      creditName,
      creditUrl,
      start: match.index,
      end: match.index + match[0].length,
      raw: match[0],
    });
  }
  return scenes;
}

function renderScene(entry: SceneEntry, replacement: {
  url: string;
  unsplashId: string;
  creditName: string;
  creditUrl: string;
}): string {
  return entry.raw
    .replace(/url:\s*"[^"]+"/, `url: ${JSON.stringify(replacement.url)}`)
    .replace(/unsplashId:\s*"[^"]+"/, `unsplashId: ${JSON.stringify(replacement.unsplashId)}`)
    .replace(/name:\s*"[^"]+"/, `name: ${JSON.stringify(replacement.creditName)}`)
    .replace(
      /(credit:[\s\S]*?url:\s*)"[^"]+"/,
      `$1${JSON.stringify(replacement.creditUrl)}`
    );
}

async function urlOk(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

async function searchReplacement(
  alt: string,
  usedPhotoIds: Set<string>
): Promise<{
  url: string;
  unsplashId: string;
  creditName: string;
  creditUrl: string;
} | null> {
  if (!ACCESS_KEY) return null;

  const query = alt
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .slice(0, 8)
    .join(" ")
    .trim();

  for (let page = 1; page <= 2; page++) {
    const searchUrl = new URL("https://api.unsplash.com/search/photos");
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("per_page", "15");
    searchUrl.searchParams.set("page", String(page));
    searchUrl.searchParams.set("orientation", "landscape");

    const response = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash search failed (${response.status}) for "${query}"`);
    }

    const data = (await response.json()) as { results?: UnsplashPhoto[] };
    for (const photo of data.results ?? []) {
      if (!photo.id || usedPhotoIds.has(photo.id)) continue;
      const rawUrl = photo.urls.regular || photo.urls.small || photo.urls.full || photo.urls.raw;
      if (!rawUrl) continue;

      const url = toCanonicalUrl(rawUrl);
      if (!(await urlOk(url))) continue;

      usedPhotoIds.add(photo.id);
      return {
        url,
        unsplashId: photo.id,
        creditName: photo.user?.name ?? photo.user?.username ?? "Unsplash",
        creditUrl:
          photo.user?.links?.html ??
          (photo.user?.username ? `https://unsplash.com/@${photo.user.username}` : "https://unsplash.com"),
      };
    }
  }

  return null;
}

async function main(): Promise<void> {
  if (!ACCESS_KEY) {
    console.error("Missing UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID).");
    process.exit(1);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((name) => name.endsWith("-images.generated.ts"))
    .sort();

  const usedPhotoIds = new Set<string>();
  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    for (const scene of parseScenes(content)) {
      if (await urlOk(scene.url)) {
        usedPhotoIds.add(scene.unsplashId);
      }
    }
  }

  let repaired = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    let content = fs.readFileSync(filePath, "utf8");
    const scenes = parseScenes(content);
    const brokenScenes: SceneEntry[] = [];
    for (const scene of scenes) {
      if (!(await urlOk(scene.url))) brokenScenes.push(scene);
    }

    let fileChanged = false;

    for (const scene of brokenScenes.sort((a, b) => b.start - a.start)) {
      console.log(`Broken: ${file} → ${scene.key}`);
      const replacement = await searchReplacement(scene.alt, usedPhotoIds);
      await sleep(DELAY_MS);

      if (!replacement) {
        console.error(`  Could not find replacement for ${scene.key}`);
        failed += 1;
        continue;
      }

      const updated = renderScene(scene, replacement);
      content = content.slice(0, scene.start) + updated + content.slice(scene.end);
      fileChanged = true;
      repaired += 1;
      console.log(`  → ${replacement.unsplashId}`);
    }

    if (fileChanged && !DRY_RUN) {
      fs.writeFileSync(filePath, content);
    }
  }

  console.log(`\nRepaired ${repaired} image(s). Failed ${failed}.`);
  if (DRY_RUN) console.log("(dry run — no files written)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
