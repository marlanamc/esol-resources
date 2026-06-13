#!/usr/bin/env node

/**
 * Gate: every mini-guide scene photo that the heuristic flags as not matching its
 * caption must be human-reviewed.
 *
 * The heuristic (rules-image-context.ts) is conservative and has false positives,
 * so we do NOT fail on the raw heuristic. We fail only when a scene is flagged AND
 * its key is not in the reviewed ledger (scene-image-reviewed.ts). That makes
 * progress monotonic: a new mismatch fails CI until the photo is swapped or the
 * scene is explicitly approved.
 *
 * Usage:
 *   npm run audit:scene-images            # gate — exits 1 on unreviewed flags
 *   npm run audit:scene-images -- --list  # print all currently-flagged keys
 */

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import process from "node:process";
import { resolveAnswerIntegrityScope } from "@/lib/grammar-guide-audit/scope";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import { extractSceneContexts } from "@/lib/grammar-guide-audit/scene-context";
import { evaluateSceneMatch } from "@/lib/grammar-guide-audit/rules-image-context";
import { REVIEWED_SCENE_IMAGES } from "@/lib/grammar-guide-audit/scene-image-reviewed";

interface SceneImage {
  url: string;
  alt: string;
  credit?: { name?: string; url?: string };
}

interface FlaggedScene {
  key: string;
  slug: string;
  sceneId: string;
  reason: string;
  detail: string;
  caption: string | null;
  alt: string;
}

function findImageExportName(source: string): string | null {
  return source.match(/export const (\w+Images)\s*:/)?.[1] ?? null;
}

async function loadImageModule(
  imageModulePath: string | null,
): Promise<Record<string, SceneImage>> {
  if (!imageModulePath) return {};
  let source: string;
  try {
    source = await readFile(imageModulePath, "utf8");
  } catch {
    return {};
  }
  const exportName = findImageExportName(source);
  if (!exportName) return {};
  const mod = await import(pathToFileURL(imageModulePath).href);
  return (mod[exportName] as Record<string, SceneImage>) ?? {};
}

async function collectFlagged(): Promise<FlaggedScene[]> {
  const flagged: FlaggedScene[] = [];

  for (const entry of resolveAnswerIntegrityScope()) {
    const loaded = await loadGuide(entry);
    if (!loaded.contentSource.includes("sceneCard(")) continue;

    const images = await loadImageModule(loaded.imageModulePath);
    const scenes = extractSceneContexts(loaded.contentSource);

    for (const scene of scenes) {
      const image = images[scene.sceneId];
      if (!image) continue; // missing scenes are reported by the image-module rules
      const match = evaluateSceneMatch(scene.caption, image.alt ?? "");
      if (!match.flagged) continue;
      flagged.push({
        key: `${loaded.slug}#${scene.sceneId}`,
        slug: loaded.slug,
        sceneId: scene.sceneId,
        reason: match.reason ?? "",
        detail: match.detail,
        caption: scene.caption,
        alt: image.alt ?? "",
      });
    }
  }

  return flagged.sort((a, b) => a.key.localeCompare(b.key));
}

async function main(): Promise<void> {
  const listMode = process.argv.includes("--list");
  const flagged = await collectFlagged();

  if (listMode) {
    console.log(`${flagged.length} flagged scene(s):\n`);
    for (const f of flagged) console.log(`  "${f.key}",`);
    return;
  }

  const unreviewed = flagged.filter((f) => !REVIEWED_SCENE_IMAGES.has(f.key));

  if (unreviewed.length === 0) {
    console.log(
      `✓ scene-images: ${flagged.length} flagged, all reviewed (${REVIEWED_SCENE_IMAGES.size} in ledger).`,
    );
    return;
  }

  console.error(
    `✗ scene-images: ${unreviewed.length} flagged scene(s) not reviewed.\n` +
      `  Fix the photo (npx tsx scripts/content/swap-mini-guide-images.ts --only=<sceneId>)\n` +
      `  or approve it in src/lib/grammar-guide-audit/scene-image-reviewed.ts.\n`,
  );
  for (const f of unreviewed) {
    console.error(`  • ${f.key}  [${f.reason}] ${f.detail}`);
    if (f.caption) console.error(`      scene: ${f.caption.slice(0, 90)}`);
    console.error(`      photo: ${f.alt.slice(0, 90)}`);
  }
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
