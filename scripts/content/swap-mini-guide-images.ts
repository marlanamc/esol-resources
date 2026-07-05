/**
 * Targeted image swap for 21 mini-guide scenes identified in the image review.
 *
 * Usage:
 *   npx tsx scripts/content/swap-mini-guide-images.ts
 *   npx tsx scripts/content/swap-mini-guide-images.ts --dry-run
 *   npx tsx scripts/content/swap-mini-guide-images.ts --only=sceneBreakRoom,sceneBusCommute
 *
 * Each entry below defines the scene key, target file, and either an exact
 * `photoId` (preferred — pick the photo that fits the caption from the contact
 * sheet and paste its id) or a fuzzy `query` fallback. Alt text is sourced from
 * the photo's own Unsplash description unless an explicit `alt` override is given,
 * so stored alt always matches the real image. The script calls the Unsplash API
 * and patches the generated .ts file in place.
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

const DEFAULT_DELAY_MS = 1500;
const DELAY_MS = (() => {
  const raw = process.env.UNSPLASH_DELAY_MS?.trim();
  if (!raw) return DEFAULT_DELAY_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_DELAY_MS;
})();

const DATA_DIR = path.join(__dirname, "../../src/data");

interface SwapTarget {
  /** Scene key as it appears in the .ts file */
  sceneId: string;
  /** Generated .ts filename (without path) */
  file: string;
  /**
   * Exact Unsplash photo id (e.g. "AB04SBsdHjY") to use. When set, this photo is
   * fetched directly — no fuzzy search, no "first unused result" guessing. This is
   * the preferred path: pick the photo that matches the caption from the contact
   * sheet (npm run audit:mini-guide-images) and paste its id here.
   */
  photoId?: string;
  /** Unsplash search query. Used only as a fallback when `photoId` is not set. */
  query?: string;
  /**
   * Optional alt-text override. When omitted, alt is sourced from the photo's own
   * Unsplash description so it always matches the real image.
   */
  alt?: string;
  orientation?: "landscape" | "portrait" | "squarish";
}

const SWAP_TARGETS: SwapTarget[] = [
  // ── all-four-conditionals-quick-tour ──────────────────────────────────
  {
    sceneId: "sceneWarehouseLift",
    file: "all-four-conditionals-quick-tour-images.generated.ts",
    query: "warehouse worker loading dock forklift safety equipment",
    alt: "A warehouse worker on a loading dock handling freight with safety gear.",
  },

  // ── all-the-tenses-year-in-review ─────────────────────────────────────
  {
    sceneId: "sceneVideoCall",
    file: "all-the-tenses-year-in-review-images.generated.ts",
    query: "woman video call phone tired late night after work shift",
    alt: "A woman on a video call on her phone after a long work shift, looking tired.",
  },

  // ── be-used-to-get-used-to ────────────────────────────────────────────
  {
    sceneId: "sceneSchoolPhone",
    file: "be-used-to-get-used-to-images.generated.ts",
    query: "parent waiting bus stop checking smartphone evening after work",
    alt: "A parent at a bus stop checking messages on their phone after a double shift.",
  },

  // ── gerunds-infinitives-full-review ───────────────────────────────────
  {
    sceneId: "sceneKitchenLetter",
    file: "gerunds-infinitives-full-review-images.generated.ts",
    query: "woman kitchen table reading letter phone late night worried rent",
    alt: "A woman at a kitchen table late at night, reading a letter and checking her phone.",
  },
  {
    sceneId: "scenePharmacyPickup",
    file: "gerunds-infinitives-full-review-images.generated.ts",
    query: "pharmacy counter customer picking up prescription bag medicine",
    alt: "A customer at a pharmacy counter collecting a prescription bag.",
  },

  // ── i-used-to-but-now-i ───────────────────────────────────────────────
  {
    sceneId: "sceneBusCommute",
    file: "i-used-to-but-now-i-images.generated.ts",
    query: "person bus commute window morning looking outside city street",
    alt: "A commuter on a city bus looking out the window during the morning commute.",
  },
  {
    sceneId: "sceneBreakRoom",
    file: "i-used-to-but-now-i-images.generated.ts",
    query: "hotel housekeeping workers break room coffee talking coworkers",
    alt: "Two hotel housekeeping coworkers chatting in the break room during a morning break.",
  },
  {
    sceneId: "sceneApartment",
    file: "i-used-to-but-now-i-images.generated.ts",
    query: "apartment building exterior urban East Boston neighborhood residential",
    alt: "A three-decker apartment building on a residential urban street.",
  },
  {
    sceneId: "sceneKitchenLunch",
    file: "i-used-to-but-now-i-images.generated.ts",
    query: "kitchen morning lunch prep bread sandwiches lunchbox children",
    alt: "A kitchen counter with bread, fruit, and lunch prep supplies for children.",
  },
  {
    sceneId: "sceneClassroom",
    file: "i-used-to-but-now-i-images.generated.ts",
    query: "adult evening ESL class students desks community center learning",
    alt: "Adult learners seated at desks during an evening ESL class.",
  },

  // ── ive-been-working ──────────────────────────────────────────────────
  {
    sceneId: "sceneConstruction",
    file: "ive-been-working-images.generated.ts",
    query: "construction workers hard hats safety vests talking morning job site",
    alt: "Two construction workers in hard hats and safety vests talking at a job site in the early morning.",
  },

  // ── just-already-yet ──────────────────────────────────────────────────
  {
    sceneId: "scenePharmacy",
    file: "just-already-yet-images.generated.ts",
    query: "pharmacy counter shelves medicine prescription window neighborhood drugstore",
    alt: "A neighborhood pharmacy counter with shelves of medicine and a prescription pickup window.",
  },
  {
    sceneId: "sceneApartmentHallway",
    file: "just-already-yet-images.generated.ts",
    query: "apartment building hallway corridor doors residential interior light",
    alt: "A residential apartment hallway with numbered doors and natural light at the end of the corridor.",
  },

  // ── third-conditional-what-would-have-happened ───────────────────────
  {
    sceneId: "sceneWritingNotes",
    file: "third-conditional-what-would-have-happened-images.generated.ts",
    query: "person writing notes notebook journal table home kitchen afternoon",
    alt: "A person writing in a notebook at a kitchen table on a weekend afternoon.",
  },
  {
    sceneId: "sceneBreakRoom",
    file: "third-conditional-what-would-have-happened-images.generated.ts",
    query: "warehouse workers break room lunch table sitting talking employee lounge",
    alt: "Workers sitting at a table in a warehouse break room talking over lunch.",
  },
  {
    sceneId: "sceneBreakRoomTalk",
    file: "third-conditional-what-would-have-happened-images.generated.ts",
    query: "coworkers lunch break table food eating talking factory warehouse",
    alt: "Two coworkers eating lunch and talking at a break room table.",
  },
  {
    sceneId: "sceneConstructionLocker",
    file: "third-conditional-what-would-have-happened-images.generated.ts",
    query: "construction workers hard hats job site break",
  },

  // ── scene-image gate backlog (audit:scene-images grandfathered set) ───
  // Queries target each caption's detected setting group so the photo's own
  // Unsplash description clears the rules-image-context heuristic. Alt is left
  // to the real description (no override) so it always matches the image.
  {
    sceneId: "scenePhone",
    file: "welcome-back-images.generated.ts",
    query: "classroom desks whiteboard empty school",
  },
  {
    sceneId: "sceneTrain",
    file: "past-simple-past-continuous-images.generated.ts",
    query: "subway train station platform commuters morning",
  },
  {
    sceneId: "sceneToDoList",
    file: "just-already-yet-images.generated.ts",
    query: "kitchen table morning notebook list coffee mug",
  },
  {
    sceneId: "sceneLabel",
    file: "stop-taking-or-stop-to-take-images.generated.ts",
    query: "warehouse worker shelves interior inventory",
  },
  {
    sceneId: "sceneCallingLucia",
    file: "doctor-said-reported-speech-images.generated.ts",
    query: "office break room interior tables chairs",
    alt: "A quiet workplace break room with tables and chairs at the end of an evening shift.",
  },
  {
    sceneId: "workplaceEmailLaptop",
    file: "medical-instructions-images.generated.ts",
    query: "person laptop coffee kitchen table morning",
  },

  // ── duplicate-unsplash-id fixes (audit:mini-guides gate) ──────────────
  // Each pair shared one photo across two guides; the scene whose caption fit
  // the shared photo worse gets a fresh image.
  {
    sceneId: "clinicSign",
    file: "medical-instructions-images.generated.ts",
    query: "clinic entrance sign medical office building door",
  },
  {
    sceneId: "sceneJobApplication",
    file: "present-perfect-how-long-images.generated.ts",
    query: "office desk job application form paperwork pen writing",
  },

  // ── your-week-in-english ──────────────────────────────────────────────
  {
    sceneId: "sceneAfterClass",
    file: "your-week-in-english-images.generated.ts",
    query: "two women talking smiling outside building community center evening after class",
    alt: "Two women talking and smiling outside a community center on a weeknight after class.",
  },
  {
    sceneId: "sceneForm",
    file: "your-week-in-english-images.generated.ts",
    query: "person filling out paper intake form desk community center staff",
    alt: "A person filling out a paper intake form at a desk in a community center.",
  },
  {
    sceneId: "sceneFriday",
    file: "your-week-in-english-images.generated.ts",
    query: "coworkers talking smiling break",
    alt: "Two coworkers smiling and chatting at the end of a work shift.",
  },
  {
    sceneId: "sceneWeeklySchedule",
    file: "your-week-in-english-images.generated.ts",
    query: "person phone calendar schedule bus morning commute weekly planner",
    alt: "A commuter on the bus checking their phone calendar to plan their weekly schedule.",
  },
];

// ─── Unsplash helpers ─────────────────────────────────────────────────────────

interface UnsplashPhoto {
  id: string;
  urls: { raw?: string; full?: string; regular?: string; small?: string };
  alt_description?: string | null;
  description?: string | null;
  links?: { html?: string };
  user?: {
    name?: string;
    username?: string;
    links?: { html?: string };
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toCanonicalUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.search = "";
    u.searchParams.set("w", "1200");
    u.searchParams.set("q", "80");
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return raw;
  }
}

interface PickedPhoto {
  url: string;
  alt: string;
  unsplashId: string;
  unsplashPage: string;
  creditName: string;
  creditUrl: string;
}

/** Build a PickedPhoto from a raw Unsplash photo, sourcing alt + credit from the API. */
function photoToPicked(photo: UnsplashPhoto): PickedPhoto | null {
  const rawUrl = photo.urls.regular || photo.urls.small || photo.urls.full || photo.urls.raw;
  if (!rawUrl) return null;
  const alt = (photo.alt_description || photo.description || "").trim();
  return {
    url: toCanonicalUrl(rawUrl),
    alt,
    unsplashId: photo.id,
    unsplashPage: photo.links?.html ?? `https://unsplash.com/photos/${photo.id}`,
    creditName: photo.user?.name ?? photo.user?.username ?? "Unsplash",
    creditUrl:
      photo.user?.links?.html ??
      (photo.user?.username
        ? `https://unsplash.com/@${photo.user.username}`
        : "https://unsplash.com"),
  };
}

/** Fetch one exact photo by its Unsplash id. No search, no guessing. */
async function fetchUnsplashPhotoById(id: string): Promise<PickedPhoto | null> {
  if (!ACCESS_KEY) return null;

  const res = await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}`, "Accept-Version": "v1" },
  });

  if (res.status === 429 || res.status === 403) {
    throw new Error(`Unsplash rate limit (${res.status}) for photo "${id}"`);
  }
  if (res.status === 404) {
    throw new Error(`Unsplash photo not found: "${id}"`);
  }
  if (!res.ok) throw new Error(`Unsplash API ${res.status}: ${res.statusText}`);

  const photo = (await res.json()) as UnsplashPhoto;
  return photoToPicked(photo);
}

async function searchUnsplash(
  query: string,
  orientation: "landscape" | "portrait" | "squarish",
  usedIds: Set<string>
): Promise<PickedPhoto | null> {
  if (!ACCESS_KEY) return null;

  const shorterQuery = query.split(/\s+/).slice(0, 4).join(" ");

  const attempts = [
    { q: query, orient: orientation, filter: true },
    { q: query, orient: orientation, filter: false },
    { q: query, orient: undefined, filter: false },
    { q: shorterQuery, orient: orientation, filter: false },
    { q: shorterQuery, orient: undefined, filter: false },
  ];

  for (const attempt of attempts) {
    for (let page = 1; page <= 3; page++) {
      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", attempt.q);
      url.searchParams.set("per_page", "15");
      url.searchParams.set("page", String(page));
      if (attempt.orient) url.searchParams.set("orientation", attempt.orient);
      if (attempt.filter) url.searchParams.set("content_filter", "high");

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Client-ID ${ACCESS_KEY}`, "Accept-Version": "v1" },
      });

      if (res.status === 429 || res.status === 403) {
        throw new Error(`Unsplash rate limit (${res.status}) for query "${attempt.q}"`);
      }
      if (!res.ok) throw new Error(`Unsplash API ${res.status}: ${res.statusText}`);

      const data = (await res.json()) as { results?: UnsplashPhoto[] };
      const results = data.results ?? [];

      for (const photo of results) {
        if (!photo.id || usedIds.has(photo.id)) continue;
        const picked = photoToPicked(photo);
        if (!picked) continue;
        usedIds.add(photo.id);
        return picked;
      }
      if (results.length === 0) break;
    }
  }
  return null;
}

// ─── File patching ────────────────────────────────────────────────────────────

function collectUsedIds(content: string): Set<string> {
  const ids = new Set<string>();
  for (const m of content.matchAll(/unsplashId:\s+"([^"]+)"/g)) {
    ids.add(m[1]);
  }
  return ids;
}

/**
 * The audit gates duplicate unsplashIds ACROSS guides, so query-based swaps must
 * avoid ids used in any generated image module, not just the file being patched.
 */
function collectUsedIdsAcrossDataDir(): Set<string> {
  const ids = new Set<string>();
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!f.endsWith("-images.generated.ts")) continue;
    const content = fs.readFileSync(path.join(DATA_DIR, f), "utf-8");
    for (const id of collectUsedIds(content)) ids.add(id);
  }
  return ids;
}

function patchScene(
  content: string,
  sceneId: string,
  url: string,
  alt: string,
  unsplashId: string,
  unsplashPage: string,
  creditName: string,
  creditUrl: string
): string {
  // Match: `  sceneId: {` … up to and including the next `  },` at 2-space indent
  const pattern = new RegExp(
    `(  ${sceneId}: \\{)[\\s\\S]*?\\n  \\},`,
    "m"
  );

  // Only emit `unsplashPage` for files whose scene-image type declares it
  // (e.g. MedicalSceneImage); other types would reject it as an excess property.
  const unsplashPageLine = content.includes("unsplashPage:")
    ? `\n    unsplashPage: ${JSON.stringify(unsplashPage)},`
    : "";

  const replacement = `  ${sceneId}: {
    url: ${JSON.stringify(url)},
    alt: ${JSON.stringify(alt)},
    unsplashId: ${JSON.stringify(unsplashId)},${unsplashPageLine}
    credit: { name: ${JSON.stringify(creditName)}, url: ${JSON.stringify(creditUrl)} },
  },`;

  if (!pattern.test(content)) {
    console.warn(`  ⚠  "${sceneId}" not found in file — skipping patch`);
    return content;
  }
  return content.replace(pattern, replacement);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const onlyArg = args.find((a) => a.startsWith("--only="))?.replace("--only=", "") ?? "";
  const onlyIds = onlyArg ? new Set(onlyArg.split(",").map((s) => s.trim())) : null;

  if (!dryRun && !ACCESS_KEY) {
    console.error(
      "Error: set UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID / UNSPLASH_ACCESS_KEY_ID) in .env.local or .env"
    );
    process.exit(1);
  }

  const targets = onlyIds
    ? SWAP_TARGETS.filter((t) => onlyIds.has(t.sceneId))
    : SWAP_TARGETS;

  if (targets.length === 0) {
    console.log("No targets matched.");
    return;
  }

  console.log(
    dryRun
      ? `[dry-run] ${targets.length} scenes — no API calls or file writes\n`
      : `Swapping ${targets.length} scenes; delay between API calls: ${DELAY_MS}ms\n`
  );

  // Group by file so we only read/write each file once
  const byFile = new Map<string, SwapTarget[]>();
  for (const t of targets) {
    const arr = byFile.get(t.file) ?? [];
    arr.push(t);
    byFile.set(t.file, arr);
  }

  let totalSwapped = 0;
  let fileIdx = 0;

  for (const [filename, scenes] of byFile) {
    fileIdx++;
    const filePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`  ✗ File not found: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");
    const usedIds = collectUsedIdsAcrossDataDir();

    console.log(`\n[${fileIdx}/${byFile.size}] ${filename} (${scenes.length} scene(s))`);

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const source = scene.photoId ? `id ${scene.photoId}` : `"${scene.query ?? ""}"`;
      console.log(`  [${i + 1}/${scenes.length}] ${scene.sceneId}  ← ${source}`);

      if (dryRun) continue;

      try {
        if (!scene.photoId && !scene.query) {
          console.warn(`    ✗ no photoId or query — scene not patched`);
          continue;
        }

        const picked = scene.photoId
          ? await fetchUnsplashPhotoById(scene.photoId)
          : await searchUnsplash(scene.query!, scene.orientation ?? "landscape", usedIds);

        if (!picked) {
          console.warn(`    ✗ no image found — scene not patched`);
          continue;
        }

        // searchUnsplash registers its pick in usedIds; the photoId path does not,
        // so record it here to keep de-dup working when scenes mix photoId + query.
        usedIds.add(picked.unsplashId);

        // Prefer an explicit override, else use the photo's own description so the
        // alt text always matches the real image.
        const alt = scene.alt ?? picked.alt;
        if (!alt) {
          console.warn(
            `    ✗ no alt text (photo has no description and none provided) — scene not patched`
          );
          continue;
        }

        content = patchScene(
          content,
          scene.sceneId,
          picked.url,
          alt,
          picked.unsplashId,
          picked.unsplashPage,
          picked.creditName,
          picked.creditUrl
        );

        console.log(`    → ${picked.unsplashId} by ${picked.creditName}`);
        totalSwapped++;
      } catch (err) {
        console.error(`    ✗ ${err instanceof Error ? err.message : String(err)}`);
      }

      if (i < scenes.length - 1) await sleep(DELAY_MS);
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, content, "utf-8");
      if (fileIdx < byFile.size) await sleep(DELAY_MS);
    }
  }

  if (dryRun) {
    console.log("\nDone (dry-run). No files changed.");
  } else {
    console.log(`\nDone. ${totalSwapped}/${targets.length} scenes swapped.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
