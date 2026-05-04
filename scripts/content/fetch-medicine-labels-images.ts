/**
 * Fetch curated Unsplash photos for the Medicine Labels & Insurance Cards grammar guide.
 *
 * One landscape photo per named scene. Photographer credit is stored alongside
 * the URL so the guide can show attribution inline.
 *
 * Requires: UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID / UNSPLASH_ACCESS_KEY_ID)
 *
 * Usage:
 *   npm run content:medicine-images                        — fill missing scenes
 *   npm run content:medicine-images -- --force             — regenerate every scene
 *   npm run content:medicine-images -- --refetch=pillBottleClose,pharmacyCounter
 *   npx tsx scripts/content/fetch-medicine-labels-images.ts --dry-run
 *
 * Env: UNSPLASH_DELAY_MS (default 1500ms between calls)
 *
 * Output: src/data/medicine-labels-images.generated.ts
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

const OUT_FILE = path.join(__dirname, "../../src/data/medicine-labels-images.generated.ts");

export interface SceneDefinition {
  id: string;
  query: string;
  alt: string;
  orientation?: "landscape" | "portrait" | "squarish";
  excludeUsernames?: string[];
}

const GLOBAL_EXCLUDE_USERNAMES = new Set(["navymedicine"]);

export const MEDICINE_SCENES: SceneDefinition[] = [
  {
    id: "pillBottleClose",
    query: "orange prescription pill bottle medication label close up pharmacy",
    alt: "An orange prescription pill bottle with a printed medication label, close up.",
  },
  {
    id: "medicineCabinet",
    query: "medicine shelf pharmacy over-the-counter bottles organized",
    alt: "Rows of medicine bottles organized on pharmacy shelves.",
  },
  {
    id: "pharmacyCounter",
    query: "pharmacist handing medication bag prescription customer counter",
    alt: "A pharmacist handing a prescription bag across a pharmacy counter.",
  },
  {
    id: "medicineSpoon",
    query: "measuring spoon liquid medicine syrup child dose",
    alt: "A measuring spoon with liquid medicine, used for children's dosing.",
  },
  {
    id: "parentChild",
    query: "parent reading medicine bottle label home child",
    alt: "A parent carefully reading the label on a medicine bottle at home.",
  },
  {
    id: "pharmacyAisle",
    query: "pharmacy store aisle over-the-counter medicine products shelf",
    alt: "A pharmacy store aisle with over-the-counter medicine products on shelves.",
  },
  {
    id: "insuranceCard",
    query: "health insurance card hands holding benefits card",
    alt: "Hands holding a health insurance card.",
  },
  {
    id: "doctorReception",
    query: "doctor office reception desk check in patient paperwork",
    alt: "A patient checking in at a doctor's office reception desk.",
  },
  {
    id: "enrollmentPaperwork",
    query: "healthcare enrollment form paperwork pen signing",
    alt: "A person filling out healthcare enrollment paperwork with a pen.",
  },
];

// ---------------------------------------------------------------------------
// Unsplash fetch helpers
// ---------------------------------------------------------------------------

interface UnsplashUrls {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
}

interface UnsplashPhoto {
  id: string;
  urls: UnsplashUrls;
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

async function fetchUnsplashScene(
  scene: SceneDefinition,
  usedPhotoIds: Set<string>
): Promise<{
  url: string;
  unsplashId: string;
  photographerName: string;
  photographerUrl: string;
  unsplashPage: string;
} | null> {
  if (!ACCESS_KEY) return null;

  const orientation = scene.orientation ?? "landscape";
  const excluded = new Set<string>([
    ...GLOBAL_EXCLUDE_USERNAMES,
    ...(scene.excludeUsernames?.map((u) => u.toLowerCase()) ?? []),
  ]);

  const fetchPage = async (
    query: string,
    page: number,
    opts: { useContentFilter: boolean; constrainOrientation: boolean }
  ): Promise<UnsplashPhoto[]> => {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "15");
    url.searchParams.set("page", String(page));
    if (opts.constrainOrientation) {
      url.searchParams.set("orientation", orientation);
    }
    if (opts.useContentFilter) {
      url.searchParams.set("content_filter", "high");
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (response.status === 429 || response.status === 403) {
      const body = await response.text();
      throw new Error(
        `Unsplash ${response.status} rate limit for "${scene.id}": ${body.slice(0, 200)}`
      );
    }
    if (!response.ok) {
      throw new Error(`Unsplash API ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as { results?: UnsplashPhoto[] };
    return data.results ?? [];
  };

  const shorterQuery = scene.query.split(/\s+/).slice(0, 3).join(" ");
  const attempts: Array<{
    label: string;
    query: string;
    useContentFilter: boolean;
    constrainOrientation: boolean;
  }> = [
    { label: "primary+landscape+filter", query: scene.query, useContentFilter: true, constrainOrientation: true },
    { label: "primary+landscape", query: scene.query, useContentFilter: false, constrainOrientation: true },
    { label: "primary+all-orientations", query: scene.query, useContentFilter: false, constrainOrientation: false },
    { label: "shorter+landscape", query: shorterQuery, useContentFilter: false, constrainOrientation: true },
    { label: "shorter+all-orientations", query: shorterQuery, useContentFilter: false, constrainOrientation: false },
  ];

  let firstPage: UnsplashPhoto[] = [];

  for (const attempt of attempts) {
    for (let page = 1; page <= 2; page++) {
      const results = await fetchPage(attempt.query, page, {
        useContentFilter: attempt.useContentFilter,
        constrainOrientation: attempt.constrainOrientation,
      });
      if (firstPage.length === 0 && results.length > 0) firstPage = results;
      if (results.length === 0) break;

      for (const photo of results) {
        if (!photo.id || usedPhotoIds.has(photo.id)) continue;
        const username = photo.user?.username?.toLowerCase();
        if (username && excluded.has(username)) continue;
        const rawUrl = photo.urls.regular || photo.urls.small || photo.urls.full || photo.urls.raw;
        if (!rawUrl) continue;

        usedPhotoIds.add(photo.id);
        return {
          url: toCanonicalUrl(rawUrl),
          unsplashId: photo.id,
          photographerName: photo.user?.name ?? photo.user?.username ?? "Unsplash",
          photographerUrl:
            photo.user?.links?.html ??
            (photo.user?.username ? `https://unsplash.com/@${photo.user.username}` : "https://unsplash.com"),
          unsplashPage: photo.links?.html ?? `https://unsplash.com/photos/${photo.id}`,
        };
      }
    }
  }

  const fallback = firstPage.find((p) => {
    if (!p.id) return false;
    const username = p.user?.username?.toLowerCase();
    return !(username && excluded.has(username));
  });
  if (!fallback?.id) return null;
  const rawUrl =
    fallback.urls.regular || fallback.urls.small || fallback.urls.full || fallback.urls.raw;
  if (!rawUrl) return null;

  console.warn(
    `  [medicine-images] reusing photo id ${fallback.id} for "${scene.id}" (no unused results)`
  );
  usedPhotoIds.add(fallback.id);
  return {
    url: toCanonicalUrl(rawUrl),
    unsplashId: fallback.id,
    photographerName: fallback.user?.name ?? fallback.user?.username ?? "Unsplash",
    photographerUrl:
      fallback.user?.links?.html ??
      (fallback.user?.username ? `https://unsplash.com/@${fallback.user.username}` : "https://unsplash.com"),
    unsplashPage: fallback.links?.html ?? `https://unsplash.com/photos/${fallback.id}`,
  };
}

// ---------------------------------------------------------------------------
// Existing output file parser
// ---------------------------------------------------------------------------
interface GeneratedSceneEntry {
  url: string;
  alt: string;
  unsplashId: string;
  unsplashPage: string;
  credit: { name: string; url: string };
}

async function loadExistingGenerated(): Promise<Partial<Record<string, GeneratedSceneEntry>>> {
  if (!fs.existsSync(OUT_FILE)) return {};
  try {
    const mod = (await import(`${OUT_FILE}?t=${Date.now()}`)) as {
      medicineLabelsImages?: Record<string, GeneratedSceneEntry>;
    };
    return { ...(mod.medicineLabelsImages ?? {}) };
  } catch (err) {
    console.warn(`  [medicine-images] could not import existing file; regenerating. (${String(err)})`);
    return {};
  }
}

function writeOutput(
  entries: Record<string, GeneratedSceneEntry>,
  sceneOrder: string[]
): void {
  const keyed = sceneOrder
    .filter((id) => entries[id])
    .map((id) => {
      const e = entries[id];
      return `  ${id}: {
    url: ${JSON.stringify(e.url)},
    alt: ${JSON.stringify(e.alt)},
    unsplashId: ${JSON.stringify(e.unsplashId)},
    unsplashPage: ${JSON.stringify(e.unsplashPage)},
    credit: {
      name: ${JSON.stringify(e.credit.name)},
      url: ${JSON.stringify(e.credit.url)},
    },
  },`;
    })
    .join("\n");

  const output = `// Auto-generated by scripts/content/fetch-medicine-labels-images.ts
// Run: npm run content:medicine-images
// All images are from Unsplash — credit field should be rendered with each image.

export interface MedicineLabelSceneImage {
  url: string;
  alt: string;
  unsplashId: string;
  unsplashPage: string;
  credit: { name: string; url: string };
}

export const medicineLabelsImages: Record<string, MedicineLabelSceneImage> = {
${keyed}
} as const;
`;

  fs.writeFileSync(OUT_FILE, output, "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const refetchArg =
    args.find((a) => a.startsWith("--refetch="))?.replace("--refetch=", "") ??
    (args.includes("--refetch") ? args[args.indexOf("--refetch") + 1] ?? "" : "");
  const refetchIds = refetchArg
    ? new Set(refetchArg.split(",").map((s) => s.trim()).filter(Boolean))
    : new Set<string>();

  if (!dryRun && !ACCESS_KEY) {
    console.error(
      "Error: set UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID / UNSPLASH_ACCESS_KEY_ID) in .env.local or .env"
    );
    process.exit(1);
  }

  const existing = await loadExistingGenerated();
  const sceneOrder = MEDICINE_SCENES.map((s) => s.id);

  const toProcess = MEDICINE_SCENES.filter((scene) => {
    if (forceAll) return true;
    if (refetchIds.size > 0) return refetchIds.has(scene.id);
    return !existing[scene.id];
  });

  if (refetchIds.size > 0) {
    const unknown = [...refetchIds].filter((id) => !sceneOrder.includes(id));
    if (unknown.length > 0) {
      console.warn(`Warning: unknown scene id(s) ignored: ${unknown.join(", ")}`);
    }
  }

  if (toProcess.length === 0) {
    console.log("All scenes already fetched. Use --force or --refetch=<id,...> to refresh.");
    return;
  }

  console.log(
    dryRun
      ? `[dry-run] Would fetch ${toProcess.length} scene(s). No API calls.\n`
      : `Fetching ${toProcess.length} scene(s); delay between calls: ${DELAY_MS}ms\n`
  );

  const results: Record<string, GeneratedSceneEntry> = {};
  for (const id of sceneOrder) {
    if (existing[id]) results[id] = existing[id]!;
  }

  const usedPhotoIds = new Set<string>(
    Object.values(existing)
      .filter((e): e is GeneratedSceneEntry => !!e)
      .map((e) => e.unsplashId)
  );

  for (let i = 0; i < toProcess.length; i++) {
    const scene = toProcess[i];
    console.log(`  [${i + 1}/${toProcess.length}] ${scene.id} ← "${scene.query}"`);

    if (dryRun) continue;

    try {
      const picked = await fetchUnsplashScene(scene, usedPhotoIds);
      if (!picked) {
        console.warn(`    ✗ no image returned for ${scene.id}`);
        continue;
      }
      results[scene.id] = {
        url: picked.url,
        alt: scene.alt,
        unsplashId: picked.unsplashId,
        unsplashPage: picked.unsplashPage,
        credit: { name: picked.photographerName, url: picked.photographerUrl },
      };
      console.log(`    → ${picked.unsplashId} by ${picked.photographerName}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`    ✗ ${msg}`);
    }

    if (i < toProcess.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  if (dryRun) {
    console.log("\nDone (dry-run).");
    return;
  }

  writeOutput(results, sceneOrder);

  const fetchedCount = Object.keys(results).length;
  const missingCount = sceneOrder.length - fetchedCount;
  console.log(
    `\n✅ Done. ${fetchedCount}/${sceneOrder.length} scenes written to src/data/medicine-labels-images.generated.ts` +
      (missingCount > 0 ? ` (${missingCount} missing — re-run or check API key)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
