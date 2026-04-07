/**
 * Unsplash API: fetch one landscape image per weekday + month using "feeling" search queries.
 *
 * Does not modify vocab-images-overrides.ts — writes a report + TS snippet you can paste in.
 *
 * Requires: UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID / UNSPLASH_ACCESS_KEY_ID)
 *
 * Usage:
 *   npx tsx scripts/content/fetch-calendar-feel-images.ts
 *   npx tsx scripts/content/fetch-calendar-feel-images.ts --days-only
 *   npx tsx scripts/content/fetch-calendar-feel-images.ts --months-only
 *   npx tsx scripts/content/fetch-calendar-feel-images.ts --dry-run
 *
 * Env: UNSPLASH_DELAY_MS (default 73000, same demo-tier spacing as fetch-vocab-images.ts)
 *
 * Output:
 *   scripts/content/output/calendar-feel-images.json
 *   scripts/content/output/calendar-feel-images.overrides.ts
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

const DEFAULT_DELAY_MS = 73_000;
const DELAY_MS = (() => {
  const raw = process.env.UNSPLASH_DELAY_MS?.trim();
  if (!raw) return DEFAULT_DELAY_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_DELAY_MS;
})();

/** Keys match Level 1 `card.term` (capitalized weekday / month). */
export const CALENDAR_FEEL_QUERIES: Record<string, string> = {
  // Days — distinct “vibe” per day (US / Northern Hemisphere defaults)
  Sunday:
    "sunday rest hammock relax family brunch quiet morning peaceful weekend",
  Monday:
    "monday morning commute train platform office coffee busy work week start",
  Tuesday: "tuesday weekday routine office meeting neutral workday candid",
  Wednesday: "wednesday work week office desk laptop midweek routine candid",
  Thursday: "thursday evening almost weekend meal friends city lights candid",
  Friday: "friday evening celebration friends restaurant weekend starts happy hour",
  Saturday: "saturday park market family weekend leisure outdoor sunny",
  // Months — season + common cultural anchors (tweak for your audience)
  January: "january winter snow new year cold cozy january morning light",
  February: "february winter cozy valentine soft light still cold",
  March: "march spring nature green buds trees outdoor early spring light",
  April: "april spring rain umbrella cherry blossom showers fresh green",
  May: "may spring flowers green park mothers day picnic bright may",
  June: "june summer picnic beach sunshine long day school vacation",
  July: "july summer heat beach fourth of july fireworks sunset",
  August: "august summer vacation road trip heat late summer sunset",
  September: "september autumn back to school fall leaves september morning",
  October: "october fall halloween pumpkin orange leaves crisp october",
  November: "november thanksgiving autumn cozy november rain warm sweater",
  December: "december winter holiday christmas lights snow december evening",
};

const OUT_DIR = path.join(__dirname, "output");

interface UnsplashUrls {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
  thumb?: string;
}

interface UnsplashPhoto {
  id: string;
  urls: UnsplashUrls;
  links?: { html?: string };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function pickUnsplashUrl(photo: UnsplashPhoto): string | null {
  return photo.urls.regular ?? photo.urls.small ?? photo.urls.full ?? null;
}

/** Match vocab-images-overrides.ts sizing. */
function toOverrideStyle(imageUrl: string): string {
  const u = new URL(imageUrl);
  u.search = "";
  u.searchParams.set("w", "1080");
  u.searchParams.set("q", "80");
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "crop");
  return u.toString();
}

/** Backup when the long “feeling” query returns nothing (or only duplicates). */
function backupQueryForTerm(term: string): string {
  const t = term.toLowerCase();
  const days = new Set(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]);
  if (days.has(t)) return `${t} day people lifestyle outdoor candid`;
  return `${t} season nature landscape mood`;
}

type SearchOpts = {
  /** Default `landscape`. Use `all` to omit param (Unsplash returns every orientation). */
  orientation?: "landscape" | "portrait" | "squarish" | "all";
  /** Omit for API default (low). `high` often returns 0 hits for mood searches. */
  contentFilter?: "low" | "high";
};

async function fetchUnsplashImage(
  query: string,
  usedPhotoIds: Set<string>,
  opts: SearchOpts = {}
): Promise<{ url: string; id: string; htmlLink: string | null; reusedDuplicate?: boolean } | null> {
  if (!ACCESS_KEY) return null;

  const orientation = opts.orientation ?? "landscape";
  const contentFilter = opts.contentFilter;

  const fetchPage = async (page: number): Promise<UnsplashPhoto[]> => {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "30");
    url.searchParams.set("page", String(page));
    if (orientation !== "all") url.searchParams.set("orientation", orientation);
    if (contentFilter) url.searchParams.set("content_filter", contentFilter);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (response.status === 403) {
      const text = await response.text();
      throw new Error(`Unsplash 403 (rate limit?): ${text.slice(0, 300)}`);
    }
    if (!response.ok) {
      throw new Error(`Unsplash API ${response.status}: ${response.statusText}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    return data.results ?? [];
  };

  const tryPick = (results: UnsplashPhoto[], allowDuplicate: boolean): UnsplashPhoto | null => {
    for (const photo of results) {
      if (!photo.id) continue;
      const imageUrl = pickUnsplashUrl(photo);
      if (!imageUrl) continue;
      if (!usedPhotoIds.has(photo.id)) {
        usedPhotoIds.add(photo.id);
        return photo;
      }
    }
    if (allowDuplicate && results.length > 0) {
      const photo = results[0];
      if (photo?.id && pickUnsplashUrl(photo)) {
        usedPhotoIds.add(photo.id);
        return photo;
      }
    }
    return null;
  };

  let firstPageForFallback: UnsplashPhoto[] = [];

  for (let page = 1; page <= 3; page++) {
    const results = await fetchPage(page);
    if (page === 1) firstPageForFallback = results;
    if (results.length === 0) break;

    for (const photo of results) {
      if (!photo.id) continue;
      const imageUrl = pickUnsplashUrl(photo);
      if (!imageUrl) continue;
      if (!usedPhotoIds.has(photo.id)) {
        usedPhotoIds.add(photo.id);
        return {
          url: toOverrideStyle(imageUrl),
          id: photo.id,
          htmlLink: photo.links?.html ?? null,
        };
      }
    }
  }

  const dup = tryPick(firstPageForFallback, true);
  if (dup) {
    const imageUrl = pickUnsplashUrl(dup)!;
    return {
      url: toOverrideStyle(imageUrl),
      id: dup.id,
      htmlLink: dup.links?.html ?? null,
      reusedDuplicate: true,
    };
  }

  return null;
}

/**
 * Tries: primary query (landscape, no strict content filter) → same without orientation if empty →
 * backup shorter query → optional portrait if still empty. Matches fetch-vocab-images duplicate fallback.
 */
async function fetchImageForTerm(
  term: string,
  primaryQuery: string,
  usedPhotoIds: Set<string>
): Promise<{ picked: Awaited<ReturnType<typeof fetchUnsplashImage>>; usedQuery: string } | null> {
  const attempts: Array<{ label: string; fn: () => ReturnType<typeof fetchUnsplashImage> }> = [
    {
      label: "primary+landscape",
      fn: () => fetchUnsplashImage(primaryQuery, usedPhotoIds, { orientation: "landscape" }),
    },
    {
      label: "primary+all-orientations",
      fn: () => fetchUnsplashImage(primaryQuery, usedPhotoIds, { orientation: "all" }),
    },
    {
      label: "backup+landscape",
      fn: () => fetchUnsplashImage(backupQueryForTerm(term), usedPhotoIds, { orientation: "landscape" }),
    },
    {
      label: "backup+all-orientations",
      fn: () => fetchUnsplashImage(backupQueryForTerm(term), usedPhotoIds, { orientation: "all" }),
    },
  ];

  for (const { label, fn } of attempts) {
    const picked = await fn();
    if (picked) return { picked, usedQuery: label };
  }
  return null;
}

type ResultRow = {
  term: string;
  query: string;
  unsplashPhotoId: string | null;
  unsplashPage: string | null;
  overrideUrl: string | null;
  /** Which search strategy succeeded (for debugging sparse results). */
  strategy?: string;
  error?: string;
};

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const daysOnly = args.has("--days-only");
  const monthsOnly = args.has("--months-only");

  if (daysOnly && monthsOnly) {
    console.error("Use only one of --days-only or --months-only.");
    process.exit(1);
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let terms: string[];
  if (daysOnly) terms = days;
  else if (monthsOnly) terms = months;
  else terms = [...days, ...months];

  if (!dryRun && !ACCESS_KEY) {
    console.error("Set UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID) in .env.local or .env");
    process.exit(1);
  }

  console.log(
    dryRun
      ? `[dry-run] Would query Unsplash for ${terms.length} term(s). No API calls.\n`
      : `Fetching ${terms.length} image(s); delay between calls: ${DELAY_MS}ms\n`
  );

  const usedPhotoIds = new Set<string>();
  const rows: ResultRow[] = [];

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    const query = CALENDAR_FEEL_QUERIES[term];
    if (!query) {
      rows.push({
        term,
        query: "",
        unsplashPhotoId: null,
        unsplashPage: null,
        overrideUrl: null,
        error: "missing CALENDAR_FEEL_QUERIES entry",
      });
      continue;
    }

    if (dryRun) {
      console.log(`  ${term}: ${query}`);
      rows.push({
        term,
        query,
        unsplashPhotoId: null,
        unsplashPage: null,
        overrideUrl: null,
      });
      continue;
    }

    try {
      console.log(`  [${i + 1}/${terms.length}] ${term}…`);
      const result = await fetchImageForTerm(term, query, usedPhotoIds);
      const picked = result?.picked;
      if (!picked) {
        rows.push({
          term,
          query,
          unsplashPhotoId: null,
          unsplashPage: null,
          overrideUrl: null,
          error: "no image returned (all attempts empty)",
        });
        console.log(`       ✗ no results after fallbacks`);
      } else {
        const unsplashPage = picked.htmlLink ?? `https://unsplash.com/photos/${picked.id}`;
        const extra = picked.reusedDuplicate ? " (same photo as another term — consider re-run or pick manually)" : "";
        rows.push({
          term,
          query,
          unsplashPhotoId: picked.id,
          unsplashPage,
          overrideUrl: picked.url,
          strategy: result?.usedQuery,
        });
        console.log(`       → ${picked.id} [${result!.usedQuery}]${extra}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`       ✗ ${msg}`);
      rows.push({ term, query, unsplashPhotoId: null, unsplashPage: null, overrideUrl: null, error: msg });
    }

    if (!dryRun && i < terms.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  if (dryRun) {
    console.log("\nDone (dry-run).");
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, "calendar-feel-images.json");
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2), "utf-8");

  const ok = rows.filter((r) => r.overrideUrl);
  const tsLines = [
    "// Paste into src/data/vocab-images-overrides.ts (merge with existing keys).",
    `// Generated ${new Date().toISOString()} — ${ok.length}/${rows.length} ok`,
    "",
    ...rows
      .filter((r) => r.overrideUrl)
      .map((r) => {
        const key = /^[A-Za-z]+$/.test(r.term) ? r.term : JSON.stringify(r.term);
        const comment = r.unsplashPage ? `  /** ${r.unsplashPage} */\n` : "";
        return `${comment}  ${key}: ${JSON.stringify(r.overrideUrl!)},`;
      }),
    "",
  ];
  const tsPath = path.join(OUT_DIR, "calendar-feel-images.overrides.ts");
  fs.writeFileSync(tsPath, tsLines.join("\n"), "utf-8");

  console.log(`\nWrote:\n  ${jsonPath}\n  ${tsPath}`);
  console.log(`Success: ${ok.length}/${rows.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
