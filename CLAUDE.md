# CLAUDE.md

This file provides guidance to agents when working with code in this repository.

Last major refresh: current branch update to match live scripts, environment variables, schema surface, API surface, learner visibility rules, and PWA behavior.

## Project Overview

Class Companion is an ESOL (English for Speakers of Other Languages) learning platform with gamification features. Built with Next.js 16 (App Router), TypeScript, Prisma, and NextAuth. The app uses PostgreSQL and includes a comprehensive points/achievements/leaderboard system to motivate students.

## Common Development Commands

### Development
```bash
npm run dev                    # Start development server on localhost:3000
npm run build                  # Build for production (includes prisma generate)
npm run deploy                 # Alias for next build
npm run typecheck              # Run TypeScript type checking
npm run lint                   # Run ESLint
npm run analyze               # Bundle analysis
npm run analyze:server        # Analyze server bundle
npm run analyze:browser       # Analyze browser bundle
```

### Database Operations
```bash
npx prisma migrate dev         # Create and apply new migration
npx prisma migrate deploy      # Apply migrations (production-like)
npm run db:migrate             # Alias for prisma migrate deploy
npm run ci:db:prepare          # Alias for prisma migrate deploy in CI pipelines
npx prisma studio              # Open Prisma Studio GUI
npm run db:seed:guides         # Seed grammar guide content
npm run db:seed:grammar        # Alias for guide+base seed
npm run db:seed                # Seed grammar + base content + vocab + assignments
npm run db:seed:full           # Full destructive reset + reseed workflow
npm run db:seed:users          # Seed users and seeded accounts
npm run db:seed:base           # Seed core base data
npm run db:seed:vocab          # Seed vocab cards/review scheduling
npm run db:seed:quizzes        # Import all quiz collections
npm run db:seed:minimal-pairs  # Seed minimal pair content
npm run db:seed:pronunciation  # Seed pronunciation content
npm run db:seed:weekly-vocab   # Seed weekly vocab reminder dataset
npm run db:export:app-data      # Safe DB export for app data backup
npm run db:sync:vocab-review    # Sync derived vocab review rows
npm run db:backup:safe         # Safe DB backup (if needed)
npm run db:backup:package      # Package DB backup artifacts
npm run db:backup:check        # Validate backups
npx tsx prisma/seed-grammar-only.ts
npx tsx prisma/seed-achievements.ts  # Seed gamification achievements
npx tsx scripts/checks/report-maintenance.mjs # Optional maintenance report
```

### Health and Validation
```bash
npm run health:gate            # typecheck + lint + vitest + build
npm run health:weekly          # weekly maintenance validation bundle
npm run health:release         # health:gate + e2e smoke checks
npm run health:monthly         # lightweight monthly maintenance check
npm run ci:e2e:setup          # Seed/migrate DB for CI e2e setup
npm run check:nullable-upserts  # Guardrails for Prisma write patterns
npm run check:repo-hygiene     # Repo quality guardrails
npm run check:generated        # Ensure generated activity data stays in sync
npm run report:maintenance     # Generate maintenance report
npm run report:level1-definitions # Activity definition audit
npm run audit:grammar-dark-mode # Validate grammar guide dark-mode-safe styles
npm run audit:answer-position  # Quiz answer-position bias checks
```

### Tests
```bash
npm run test:vitest                 # Unit tests via Vitest
npm run test:critical               # Required critical test bundle
npm run test:gamification
npm run test:activity-submit
npm run test:exercise-answer-normalization
npm run test:activity-submit:contract
npm run test:activity-progress:merge
npm run test:activity-progress:points
npm run test:assignments-featured
npm run test:classes-join
npm run test:submission-points-claim
npm run test:sanitize
npm run test:validators-env
npm run test:db-guard
npm run test:vocab-review
npm run test:e2e                  # Playwright suite
npm run test:e2e:smoke            # Mobile/PWA smoke
npm run test:e2e:mobile           # Dedicated mobile smoke entry
npm run test:e2e:headed           # Headed browser mode
npm run test:e2e:install          # Install Playwright browsers and dependencies
```

### Content Import / Asset Scripts
```bash
npm run import:verb-quizzes    # Import verb quiz activities
npm run import:simple-tenses
npm run import:time-indicators
npm run import:countable-uncountable
npm run import:gerund-infinitive
npm run import:parts-of-speech  # Import Parts of Speech game content
npm run import:verb-quiz-sync
npm run delete:verb-quizzes    # Delete verb quiz activities
npm run generate:content         # Generate/sync gerund content CSV from source
npm run sync:gerund-csv         # Sync gerund CSV (authoritative source)
npm run sync:gerund-csv:check   # Check gerund CSV drift
npm run vocab:curate           # Curate vocab records from CSV input
npm run vocab:images           # Generate/fetch level 1 vocab images
npm run vocab:images:search    # Fetch with search
npm run vocab:images:calendar-feel
npm run audio:vocab            # Generate vocab pronunciation audio
npm run audio:minimal-pairs    # Generate minimal pairs audio
npm run audio:pronunciation-sentences  # Generate pronunciation sentence audio
npm run push:generate-vapid    # Generate VAPID key pair
```

### Build Guardrails
```bash
npm run prebuild                # check-env + repo hygiene + nullable-upsert + answer-position check
```

## Architecture Overview

### Authentication & Authorization
- **NextAuth.js** handles authentication with credentials provider (`src/lib/auth/auth.ts`)
- Users have roles: `student` or `teacher`
- Session strategy: JWT with mobile/desktop duration differences
- Mobile users get longer session windows than desktop users
- `teacher_admin` is normalized to `teacher` role in app auth/session data (`isTeacherAdmin` stays as a flag)
- Login automatically tracks learner activity via `trackLogin()` in `src/lib/gamification.ts`
- Session/session payload includes: `id`, `role`, `username`, `isTeacherAdmin`, `mustChangePassword`

### Database Schema (Prisma)
The database uses PostgreSQL. Core models in use:

**Core models:**
- `User`: Teachers and students with gamification fields (`points`, `currentStreak`, `longestStreak`, `weeklyPoints`, `lastWeekRank`)
- `Class`: Classes with unique join code
- `ClassEnrollment`: Student-class join table (`@@unique([classId, studentId])`)
- `Activity`: Activity metadata + JSON content payload
- `Assignment`: Class activity assignments (`isFeatured`, due dates)
- `Submission`: Activity/assignment submissions and point results
- `ActivityProgress`: Completion status and per-category progress
- `QuizResponse`: Per-question response tracking

**Gamification and social models:**
- `Achievement`, `UserAchievement`
- `PointsLedger`
- `DailyHabitCompletion`

**Learner/content systems:**
- `Feedback`
- `VocabCard`
- `UserVocabReviewState`
- `PushSubscription`
- `UserPreferences`
- `WritingSession`, `WritingGroup`, `WritingGroupMember`
- `WritingRound`, `WritingSubmission`, `WritingGroupVote`, `WritingClassVote`
- `WritingSessionCheckIn`

**Operational/admin models:**
- `CalendarEvent`
- `InviteLink`
- `AccountDeletionRecord`
- `SpeakingSubmission`

**Notable indexing patterns in use:**
- User lookup/filtering for leaderboards and rollups: `role`, `isSystemAccount`, `weeklyPoints`, `[role, weeklyPoints]`
- Activity visibility filters: `isReleased`, `isReleasedInContent`, `[type, category, isReleased]`, `deletedAt`
- Enrollment and class queries: `classId`, `studentId`, `[classId, createdAt]`
- Assignment/submission access: `[classId, isFeatured]`, `[classId, dueDate]`, `[userId, status, completedAt]`
- Points and scoring paths: `PointsLedger(createdAt)`, `[source, createdAt]`, `[userId, createdAt]`
- Writing flow performance: `[activityId, classId, status]`, `[teacherId]`, `[sessionId]`, `[roundId, groupId]`

### Gamification System (`src/lib/gamification.ts`)
This is the core of student engagement.

**Points System:**
- Activity completion by type: defined in `src/lib/gamification/activity-points.ts` and `src/lib/gamification/constants.ts`
- Quiz scoring:
  - Perfect: 15
  - High score: 10
  - Good score: 5
  - Passing: 2
- Daily streak award: 3 (plus 25 bonus on 7-day boundaries)
- Activity completion bonus varies by type (games, writing, vocab, speaking, pronunciation, timeline, etc.)
- Achievement bonus: 50

**Key functions:**
- `awardPoints(userId, points, reason)`
- `updateStreak(userId, activityPoints)`
- `checkAndAwardAchievements(userId)`
- `calculateQuizPoints(score)`
- `getTimeframedLeaderboard(range, limit, classId?)`
- `getWeeklyLeaderboard(range, classId?)`
- `resetWeeklyPoints()`
- `trackLogin(userId)`

**Important notes:**
- Use exclusion helpers for leaderboards (`marlie` plus configured usernames)
- `PointsLedger` is source of truth; avoid using user fields for ranking computation
- Leaderboard helpers support class-scoped and independent learner views

### Activity Content System
Activities store typed JSON in `Activity.content` and are described by `src/types/activity.ts`.

**Current content shapes:**
- `QuizContent`, `WorksheetContent`, `GuideContent`, `InteractiveGuideContent`, `LegacyGuideContent`
- `SlidesContent`, `SpeakingActivityContent`, `VocabularyContent`
- `EdPronunciationContent`, `MinimalPairsContent`, `PronunciationSentenceListeningContent`
- `TimelineTensesContent`, `TimedWritingContent`
- Fallback: `Record<string, unknown>` for legacy/unknown shapes

**Parts-of-speech game system (`src/types/parts-of-speech.ts`):**
- Expanded `PartOfSpeech`, `POSCategory`, and `POSExerciseType` unions
- New game patterns include `error-correction`, `contrast-pair`, `word-family`, `photo-sort`, and more

**Interactive guide structure notes:**
- Grammar guide structure uses `sections` with formulas/examples/exercises/usage meaning
- Inline styling is still present in some guide content (legacy pattern)

### API Route Patterns
All API routes follow `getServerSession(authOptions)` + role checks in app-route handlers.

**Typical auth pattern:**
```typescript
const session = await getServerSession(authOptions);
if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const role = (session.user as { role?: string }).role;
```

**Representative route domains (not exhaustive):**
- `GET /api/activities` and `POST /api/activities`
- `GET /api/activities/[id]`
- `POST /api/activity/progress` and `POST /api/activity/submit`
- `POST /api/grammar/complete`, `GET /api/legacy-guide`, `POST /api/grammar/release`
- `POST /api/quiz/release`, `POST /api/speaking/release`, `POST /api/speaking/complete`
- `GET /api/assignments`, `POST /api/assignments`, `GET /api/assignments/featured`
- `GET /api/classes`, `POST /api/classes`, `POST /api/classes/join`, `GET /api/classes/[id]`
- `GET /api/calendar-events`
- `GET /api/search/learner`, `POST /api/search/learner/telemetry`
- `GET /api/vocab-review/*`
- `GET /api/gamification/leaderboard`, `GET /api/gamification/stats`
- `GET /api/gamification/leaderboard/context`
- `GET /api/push/vapid-public`, `POST /api/push/subscribe`, `POST /api/push/unsubscribe`, `GET /api/push/status`
- `GET /api/cron/reset-weekly-points`, `GET /api/cron/send-vocab-reminders`
- `GET /api/writing-session/*` (state, start, advance, vote, submit, end)
- `POST /api/admin/*` and `GET /api/diagnostics/*`
- `POST /api/auth/*`

### Component Organization
- `src/components/ui/` - Shared UI primitives
- `src/components/dashboard/` - Dashboard layout/widgets for learner and teacher
- `src/components/games/` - Game-specific renderers (verb, grammar practice, parts of speech, etc.)
- `src/components/grammar-reader/` - Guided grammar content UX
- `src/components/system/` - PWA/system concerns (`ServiceWorkerRegistration`, `PWAInstallPrompt`, `PWAUpdateNotification`, `NetworkStatusBanner`, `SubmissionOutboxManager`)
- `src/components/activities/` - Activity type-specific rendering
- `src/components/icons/` - Vector icon registry

### Design System
Colors and tokens are defined in `src/app/globals.css`.

- `--primary`: `#b05740` (`@/colors` warm terracotta)
- `--secondary`: `#6a8d73` (`@/colors` sage)
- `--accent`: `#e9c46a` (`@/colors` parchment gold)
- background: `#fdf9f0` → `#fdfbf7`
- text: `#1a202c`

Font tokens:
- Display: `Fraunces`
- Body: `DM Sans`
- Handwritten: `Caveat`
- Emoji fallbacks included for title/content glyph compatibility

### TypeScript Path Aliases
```typescript
"@/*" maps to "./src/*"
```
Always use `@/` imports for internal modules.

## Important Development Notes

### When Working with Activities
1. Activity content is stored in `Activity.content` and typed via `parseActivityContent(raw: string)`
2. Use content type guards (`isInteractiveGuideContent`, `isLegacyGuideContent`, etc.)
3. Learner visibility differs by content type:
   - Grammar guide: requires `activity.isReleased === true`
   - Speaking/quiz: prefers `isReleasedInContent` (if field exists), otherwise uses `content.released`
   - Other activities visible unless deleted
4. Respect the release compatibility helper: `supportsActivityIsReleasedInContent()` before referencing optional schema fields
5. Keep activity and submission logic in `src/lib/learner` and `src/lib/learner/visibility.ts`

### Grammar Guide Styling (Future Refactor)
Grammar guides still carry inline style blocks in `src/content/grammar/*.ts`.
Dark mode support remains attribute-based (e.g. style selector matching).
A semantic class migration would reduce fragile overrides.

### When Working with Gamification
1. Always award through `PointsLedger` + `awardPoints()`
2. Prevent duplicate grants with existing guards
3. Update both lifetime and weekly points when rewarding
4. Call `updateStreak()` and `checkAndAwardAchievements()` after completions where applicable
5. Use leaderboard aggregation over ledger entries, not direct user totals

### When Working with the Database
1. PostgreSQL connection is configured via `DATABASE_URL` (preferred) with `POSTGRES_URL` fallback
2. Use `prisma` from `@/lib/prisma` for all queries
3. Migration setup and pooling defaults live in `prisma/schema.prisma` and `src/lib/database/prisma.ts`
4. Keep uniqueness constraints in place (`@@unique`) for ids and user/submission keys

### When Working with Authentication
1. Use `getServerSession(authOptions)` in server components
2. Use `useSession()` in client components
3. Check session role (`student` / `teacher`) before role-gated operations
4. Force password update if `mustChangePassword === true`
5. Use `teacher_admin` checks via optional `isTeacherAdmin` flag where needed

### Weekly Points Reset
The `/api/cron/reset-weekly-points` flow:
1. Captures `lastWeekRank`
2. Resets `User.weeklyPoints`
3. Persists ranking snapshot data
4. Leaves `PointsLedger` immutable and `User.points` untouched

### PWA, Offline, and Push
- Registration: `ServiceWorkerRegistration` is used in dashboard layout
- Script: `public/sw.js` (build-aware cache and update behavior)
- Update notifications via `PWAUpdateNotification`
- Network state surfaced via `NetworkStatusBanner`
- Offline form submission queue:
  - `SubmissionOutboxManager`
  - `isSubmissionOutboxEnabled` is controlled by `NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX`
  - localStorage queue handles retry and idempotent replay
- Push/vocab reminders:
  - `POST /api/push/subscribe`, `POST /api/push/unsubscribe`
  - `GET /api/push/vapid-public`, `GET /api/push/status`
  - `GET /api/cron/send-vocab-reminders` sends reminders when users have not completed today’s vocab review

### Content Import
- Use `tsx` for import scripts in `scripts/import/`
- Keep data keys stable when adding new exercise formats
- Validate generated payloads against `Activity.content` type guards
- Use dedicated gerund/pronunciation/parts-of-speech scripts for new content families

## Testing Accounts (After Seeding)
- Teacher: `teacher` / `password123`
- Student: `ricardo` / `password123` (and other seeded student accounts)
- Test account: `marlie` (excluded from leaderboard ranking)

## Environment Variables
Use `.env.example` as the canonical source.

- Database: `DATABASE_URL` (preferred), `POSTGRES_URL` (fallback)
- Authentication: `NEXTAUTH_SECRET` or `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`
- Cron: `CRON_SECRET`
- PWA/notifications: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `PERF_LOG_*` flags
- Leaderboards: `EXCLUDED_LEADERBOARD_USERNAMES`
- Accounts: `DEV_SEED_ACCOUNT_PASSWORD`, `TEST_STUDENT_DEFAULT_PASSWORD`
- Vocab imagery: `VOCAB_IMAGE_SIZE`, `UNSPLASH_ACCESS_KEY`, `UNSPLASH_CLIENT_ID`, `UNSPLASH_ACCESS_KEY_ID`, `UNSPLASH_DELAY_MS`, `UNSPLASH_RATE_LIMIT_PER_HOUR`
- Audio: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ELEVENLABS_VOICE_IDS`
- Backups: `BACKUP_DATABASE_URL`, `BACKUP_ENCRYPTION_KEY`
- Monitoring: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`
- Safety: `ALLOW_PROD_DB_MUTATION`, `CONFIRM_DB_HOST`
- Offline queue: `NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX`

