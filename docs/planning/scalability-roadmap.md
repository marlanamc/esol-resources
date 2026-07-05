# Scalability & Leanness Roadmap

Follow-up work identified during the July 2026 codebase review. The quick wins
and hot-path fixes from that review already landed (dead dependency removal,
duplicate wiki cleanup, orphaned shim retirement, quiz-release batching, vocab
library SQL counts, activity-report groupBy aggregation, leaderboard caching,
pluggable rate-limit store). The items below are larger refactors, ordered
roughly by impact.

## 1. Grammar-reader route consolidation

`src/app/grammar-reader/` contains ~74 near-identical `page.tsx` files
(~47 lines each, ~3,500 LOC total) that differ only in the content import,
title, and `completionKey`. Collapse into a single `grammar-reader/[slug]`
dynamic route backed by a content registry module that maps slug →
`{ content, title, completionKey }`.

Prerequisite: resolve the **dual source of truth** — grammar content modules
in `src/content/grammar/*.ts` are imported directly by reader pages *and*
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

## 4. Shim codemod

~25 flat `src/lib/*.ts` backward-compat shims remain (e.g. `@/lib/prisma`
with 194 importers, `@/lib/auth` with 191), plus 21 one-line re-export stubs
at `src/components/*.ts`. One mechanical find-and-replace pass per shim,
gated by `npm run typecheck`, then delete the shims and the CLAUDE.md table.
Note: some tests `vi.mock("@/lib/rate-limit")` and similar shim paths —
update mocks in the same pass.

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

## 10. npm script consolidation

~95 scripts in `package.json`, including ~22 single-file `test:*` wrappers
and a hand-maintained 14-entry `test:critical` chain. Replace one-file
wrappers with vitest path globs / tags, and group seed/import scripts
behind a small CLI (`tsx scripts/run.ts <task>`).

## 11. Smaller follow-ups

- Paginate `/api/vocab/library` for `topic=all` responses as the card
  catalog grows.
- `send-vocab-reminders` cron: filter already-notified/completed users in
  the subscription query (`notIn`) instead of loading all student
  subscriptions and filtering in JS.
- Split `src/app/api/activity/progress/route.ts` (764 lines multiplexing
  vocab/grammar/course-map progress) into per-domain handlers or a
  dispatcher with small strategy modules.
- Review the `import:verb-quizzes` / `delete:verb-quizzes` workflow pair —
  candidates for an admin UI action rather than npm scripts.
