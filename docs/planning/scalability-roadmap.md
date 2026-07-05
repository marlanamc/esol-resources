# Scalability & Leanness Roadmap

Follow-up work identified during the July 2026 codebase review. The quick wins
and hot-path fixes from that review already landed (dead dependency removal,
duplicate wiki cleanup, orphaned shim retirement, quiz-release batching, vocab
library SQL counts, activity-report groupBy aggregation, leaderboard caching,
pluggable rate-limit store). The items below are larger refactors, ordered
roughly by impact.

## 1. Grammar-reader route consolidation — DONE (dual source remains)

The ~74 near-identical `page.tsx` files were collapsed into a single
`grammar-reader/[slug]` dynamic route backed by a content registry.

Remaining: resolve the **dual source of truth** — grammar content modules
in `src/content/grammar/*.ts` are imported directly by the reader route *and*
seeded into Postgres (`prisma/seed-grammar-only.ts`). Pick one canonical
store (TS modules or DB) so the two copies cannot drift.

## 2. GameShell extraction

The 17 game components under `src/components/games/` each hand-roll their
own state machine, grading, score tracking, and celebration flow (grading
logic repeated across ~51 files; framer-motion celebration boilerplate in
~96 places). Extract a shared `GameShell` (score + progress + results +
celebration) and a `useGameState` reducer; migrate games incrementally.

Note: game code-splitting is already in place — every game/activity
component in `src/components/renderers/ActivityRenderer.tsx` is loaded via
`next/dynamic` with a shared loading fallback, and remaining static game
imports are per-route pages that Next splits on its own. (The unused
`src/components/games/index.ts` barrel, which would have defeated the
splitting if imported, was removed.)

## 3. Move generated audio out of git — mechanism in place, cutover pending

The code side is done: all audio URL construction goes through
`resolveAudioUrl` (`src/lib/audio/url.ts`), which prefixes
`NEXT_PUBLIC_AUDIO_CDN_URL` when set and falls back to `public/audio/`
when unset, and `npm run audio:upload:blob` uploads `public/audio/**` to
Vercel Blob idempotently.

Cutover steps (requires a Vercel Blob store):
1. Vercel dashboard -> Storage -> Blob -> create a store; copy the
   read-write token.
2. `BLOB_READ_WRITE_TOKEN=... npm run audio:upload:blob` (re-runnable;
   skips already-uploaded files). It prints the store's base URL.
3. Set `NEXT_PUBLIC_AUDIO_CDN_URL=<that base URL>` in the Vercel project
   env and redeploy; verify audio playback in vocab review, minimal pairs,
   -ed pronunciation, sentence listening, and the emotion wheel.
4. Remove `public/audio/` from git (`git rm -r public/audio` +
   `.gitignore` entry) — the ~21MB / 1,189 mp3s stop being tracked. Keep
   the `audio:*` generation scripts writing to `public/audio/` locally;
   re-run the upload script after generating new audio.
5. Optional, coordinated: purge the mp3s from git history with
   `git filter-repo` to shrink `.git` (~33MB) — rewrites history for all
   clones, so do it deliberately.

## 4. Shim codemod — DONE

All flat `src/lib/*.ts` backward-compat shims and the `src/components/*.ts`
re-export stubs were removed via a repo-wide codemod; imports now use the
canonical domain paths and the CLAUDE.md shim table was replaced with a
one-line rule.

## 5. Type god-modules — DONE

Both split into domain modules behind barrels that preserve the original
import paths: `src/types/activity/` (guide, speaking, quiz, vocabulary,
pronunciation, writing, games, timeline, content) and
`src/types/parts-of-speech/` (core, exercises, progression, content).

## 6. Shared client data-fetching layer

~103 raw `fetch()` calls across client components, each with bespoke
loading/error/retry state. Introduce a small shared hook (or SWR/TanStack
Query) for request dedup, caching, and consistent error handling. Start
with the dashboard widgets, which re-fetch the same endpoints.

## 7. `Activity.content` String → Json migration

`prisma/schema.prisma` stores activity content as serialized `String`;
every read parses the whole blob and the DB can't validate or index into
it. Migrate the column to `Json` (Postgres `jsonb`) with a data migration,
then simplify `parseActivityContent`.

## 8. `CalendarEvent` uniqueness — DONE

`@@unique([classId, title, type, date])` added with a dedupe migration
(`20260705120000_add_calendar_event_uniqueness`); quiz release now uses
`createMany(skipDuplicates)` and the manual calendar-events route returns
409 on duplicates.

## 9. `docs/audits/` retention policy

13 generated audit reports (~824KB, one 524KB file) are committed and some
are *read* by `health:gate` scripts (`audit-mini-guides`,
`audit-grammar-dark-mode`). Decide which reports are working inputs vs
stale outputs; regenerate-on-demand for the rest and gitignore them.

## 10. npm script consolidation — test wrappers DONE

The 15 single-file `test:*` wrappers and the hand-maintained
`test:critical` chain are gone: `test:critical` now runs vitest
directories plus `test:node` (the three node --test suites), and CI's 12
redundant per-file steps collapsed to two (the per-file runs duplicated
the coverage run). Remaining: group seed/import scripts behind a small
CLI (`tsx scripts/run.ts <task>`) if the `db:seed:*`/`import:*` families
keep growing.

## 11. Prisma 7 upgrade (deferred July 2026)

Prisma CLI/client are on 6.19.x; 7.x is out (7.8.0 as of July 2026).
Deliberately deferred before the summer break — it is a real migration,
not a version bump: new `prisma.config.ts` config file (no automatic
`.env` loading), new `prisma-client` generator with changed import paths,
and a required driver adapter (`@prisma/adapter-pg`) that touches
`src/lib/database/prisma.ts`, every seed/import script, `ci:db:prepare`,
and the Vercel build. Do it as a dedicated task in the fall with the full
health gate plus a watched deploy. Prisma 6.x remains supported meanwhile;
`npm audit` is clean on it.

## 12. Lightning-fast follow-ups (performance, July 2026)

Ordered by expected impact per hour of work. Items 6 (shared client
data-fetching) and 7 (`Activity.content` → jsonb) above are also
performance levers; these are the additional ones.

1. **Region colocation check (one-time, ~15 min).** Verify the Vercel
   function region sits next to the database region (db.prisma.io).
   Every API request pays that round-trip several times (session lookup
   plus queries), so a cross-region setup taxes literally every click.
   Check Vercel project settings → Functions region vs the Prisma
   Postgres region; move the function region if they differ.
2. **Guide-page TTFB: cache the activity lookup.** The
   `grammar-reader/[slug]` route serves content that is fully static in
   `src/content/grammar/*.ts`, but each view pays per-request DB queries
   (`getActivityIdSafely` title→id, then the release check). Cache the
   title→id map (it only changes at seed/import time) and the release
   flags (short TTL, or invalidate when a teacher toggles release) so
   most guide views hit no DB at all.
3. **CDN cache headers on read-heavy GETs.** The pattern already exists
   (five routes set `Cache-Control`; the leaderboard has a 60s
   server-side cache). Extend `s-maxage` + `stale-while-revalidate` to
   other GETs whose responses are not per-user, so repeat requests are
   served by the Vercel CDN without invoking a function.
4. **Responsive scene images.** `sceneCard` in the guide content emits
   `<img>` with a fixed `w=1200` Unsplash URL; phones download
   desktop-size images rendered at ~360px. Emit `srcset` with 400/800/
   1200 widths plus `sizes` (Unsplash serves arbitrary `w=` values).
   `loading="lazy"` is already in place.
5. **Dashboard shell streaming (larger).** The learner dashboard blocks
   on per-user data before paint. With Next 16 Cache Components/PPR the
   static shell can render instantly while widgets stream in; pairs
   naturally with item 6's fetch dedup.

## 13. Smaller follow-ups

- Paginate `/api/vocab/library` for `topic=all` responses as the card
  catalog grows.
- ~~`send-vocab-reminders` cron: filter already-notified/completed users in
  the subscription query~~ — DONE (SQL-filtered query sends one reminder
  per student).
- Split `src/app/api/activity/progress/route.ts` (764 lines multiplexing
  vocab/grammar/course-map progress) into per-domain handlers or a
  dispatcher with small strategy modules.
- Review the `import:verb-quizzes` / `delete:verb-quizzes` workflow pair —
  candidates for an admin UI action rather than npm scripts.
