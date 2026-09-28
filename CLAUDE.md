# CLAUDE.md

This file provides guidance to agents when working with code in this repository.

Class Companion is an ESOL (English for Speakers of Other Languages) learning platform with gamification (points, streaks, achievements, leaderboards) to motivate adult learners.

## Commands
- `npm run health:gate` (typecheck + lint + vitest + build) is the pre-merge check; `npm run test:critical` is the fast bundle.
- **All `db:seed:*`, `import:*`, `delete:*`, and `prisma/*` / `scripts/db/*` scripts write to whatever `DATABASE_URL` points at, with no guard.** Confirm the target database before running one. `db:seed:full` is a destructive reset.

## Conventions
- Always use `@/` imports (`@/*` → `./src/*`).
- `src/lib/` is organized by domain — import from the canonical subdirectory path (e.g. `@/lib/auth/auth`, `@/lib/database/prisma`, `@/lib/gamification/gamification`, `@/lib/api/response`, `@/lib/shared/logger`). The old flat backward-compat shims (`@/lib/prisma`, `@/lib/auth`, etc.) were removed; do not reintroduce them.
- API routes: `getServerSession(authOptions)` + role check (`student` / `teacher`) before any role-gated work.

## Auth gotchas
- `teacher_admin` is normalized to the `teacher` role in auth/session data; use the `isTeacherAdmin` flag where admin-only checks are needed.
- Force a password update when `mustChangePassword === true`.
- Login tracks learner activity via `trackLogin()`.

## Gamification rules
1. Always award through `awardPoints()` so a `PointsLedger` row is written; never write point fields directly.
2. Prevent duplicate grants with the existing guards.
3. Update both lifetime and weekly points when rewarding.
4. Call `updateStreak()` and `checkAndAwardAchievements()` after completions where applicable.
5. `PointsLedger` is the source of truth — compute leaderboards from ledger aggregation, not user totals, and apply the exclusion helpers (`marlie` plus `EXCLUDED_LEADERBOARD_USERNAMES`).
6. The weekly reset (`/api/cron/reset-weekly-points`) captures `lastWeekRank` and resets `User.weeklyPoints`; it leaves `PointsLedger` immutable and `User.points` untouched.

## Activities
1. `Activity.content` is JSON; parse with `parseActivityContent(raw)` and branch with the content type guards (`isInteractiveGuideContent`, `isLegacyGuideContent`, etc.).
2. Learner visibility differs by content type:
   - Grammar guide: requires `activity.isReleased === true`
   - Speaking/quiz: prefers `isReleasedInContent` (if field exists), otherwise uses `content.released`
   - Other activities visible unless deleted
3. Call `supportsActivityIsReleasedInContent()` before referencing optional schema fields.
4. Keep activity and submission logic in `src/lib/learner` and `src/lib/learner/visibility.ts`.
5. If you rename a `CourseWeek.title` in `src/lib/course-map-data.ts`, also check the matching `topic` string in `scripts/vocab/weekly-vocab-data.js` (keyed the same, e.g. `sep-w1`). That week's vocab `Activity.title` is generated as `` `Unit ${unit}: ${data.topic}` `` in `scripts/vocab/seed-weekly-vocab.js`, so a stale topic surfaces the old week name anywhere the raw activity title is shown. After editing, re-run `npm run db:seed:weekly-vocab`.

## Environment notes
`.env.example` is the canonical list. Non-obvious ones:
- `DATABASE_URL` is preferred, `POSTGRES_URL` is the fallback.
- `ALLOW_PROD_DB_MUTATION`, `CONFIRM_DB_HOST`: safety gates for DB-mutating scripts.
- `NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX`: turns on the offline submission queue (`SubmissionOutboxManager`, localStorage retry with idempotent replay).
- `NEXT_PUBLIC_AUDIO_CDN_URL`: serves `/audio/*` from Vercel Blob; falls back to `public/audio` when unset.
- `NEXT_PUBLIC_ENABLE_SAFARI_EXTERNAL_ESCAPE`: default on; set `"false"` to disable the iOS PWA escape-to-Safari hatch in `src/lib/shared/open-external-link.ts`.
- Upstash vars are optional; without them auth rate limits fall back to per-instance memory.

## Testing accounts (after seeding)
- Teacher: `teacher` / `password123`
- Student: `ricardo` / `password123` (and other seeded student accounts)
- Test account: `marlie` (excluded from leaderboard ranking)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
