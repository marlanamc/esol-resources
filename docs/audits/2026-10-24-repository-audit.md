# Repository risk audit — October 24, 2026

Audit base: `1dcfc92f` (`main`). Fix branch: `codex/repo-risk-audit`. No push, deployment, migration, seed, or production-data modification was performed. Existing worksheet/PDF changes and untracked classroom/release material were preserved.

## Scope and confidence

The inventory covered **3,131 tracked regular files**, including **1,955 text files**, at the audit base. Repository-wide checks included static import resolution, dangerous-operation searches, test discovery, npm-script target checks, type checking, lint, tests, generated-content checks, and the mini-guide audit. Manual review concentrated on API authorization, activity and quiz persistence, rewards, account handling, browser storage, deployment scripts, schema relationships, and the affected frontend flows.

This is a broad static audit, **not a claim that every line or binary asset was manually inspected or that every possible bug is known**. Authored PDFs, images, audio, and historical classroom materials were inventoried, not visually or pedagogically revalidated. Generated content was checked with the repository's existing validators. No real PostgreSQL concurrency test or browser session was run; transaction regression tests use rollback/serialization doubles. The companion inventory lists paths, text/binary classification, and text line counts for every tracked regular file examined by the inventory.

Ranking is an engineering estimate of how soon an issue could affect normal classroom use, weighted by student-credit impact, data-loss severity, and exposure. “Confirmed” means the code path or local test demonstrates the problem; “risk” means the trigger depends on deployment, concurrency, input, or a workflow not reproduced live. The first five were fixed in the initial pass. Findings 6–10 were fixed in the requested local follow-up; findings 11–46 remain open.

## Ranked findings

| Rank | Likelihood / impact | Finding and evidence | Status |
|---|---|---|---|
| 1 | High / lost student credit | **Progress could commit before rewards.** `src/lib/activity/progress/post-progress.ts` saved completion outside the award transaction; `award-points.ts` swallowed an award exception and returned zero. Retrying completed vocabulary modes then skipped credit. Concurrent first saves could also duplicate nullable-scope progress rows or overwrite another vocabulary mode. | **Fixed — `e2018150`.** Read/merge/write, assignment-to-global sync, and rewards now share scope locks and a transaction. Failure returns a retryable error and rolls back completion and credit. Also preserves the request key alongside serialized category data. |
| 2 | High / effort goes unrewarded | **Several practice paths required mastery to earn anything.** Both verb-group calculators returned zero below passing; Parts of Speech rounds 3–5 were absent from the server's valid modes; zero-correct verb forms and sub-70% Time Signals attempts earned no effort credit. `VerbFormsGame.tsx` nevertheless displayed a hard-coded +4 even on failed saves. | **Fixed — `8f30dfb4`.** Meaningful attempted rounds earn 3 effort points, passing bonuses remain, POS rounds 3–5 are accepted, and the verb-form toast uses the server receipt. Verb/POS result objects carry stable retry keys, with distinct long-lived ledger identities for genuine new rounds. |
| 3 | High under retries / duplicate or missing credit | **Daily vocabulary completion was a check-then-write race, followed by a separate award.** Two requests could both pass the daily check; a failed award left the daily marker blocking retries. Dashboard compatibility helpers also swallowed missing-table errors in this write path. | **Fixed — `4e292cd9`.** Lock, strict completion lookup/create, balance, and ledger changes commit together. Positive integer card-count validation added. Existing once-per-day reward policy retained. |
| 4 | Conditional on migration failure / severe schema damage | **Build wrapper guessed migrations had succeeded.** `scripts/migrate-deploy.mjs` marked any P3009 migration applied, and treated one “already exists” message as evidence the whole migration had run. A multi-statement migration can fail halfway through. | **Fixed — `5ca2f999`.** Failures now stop the build and retain diagnostics; no automatic resolve commands. Subprocess tests cover P3009, P3018, partial-object errors, and success without a database. |
| 5 | Publicly reachable / paid-credit exposure | **Anyone could spend the TTS API key.** `src/app/api/tts/route.ts` had neither authentication nor rate limits and waited without a provider timeout. Proxy matching does not cover this API. | **Fixed in the fifth commit.** Requires a session, validates text, enforces per-account minute/day quotas, fails closed on configured store failure, limits provider duration, and returns private audio responses. |
| 6 | High around week boundaries / confusing ranks | **Two definitions of “week.”** `vercel.json` resets `weeklyPoints` Tuesday 00:00 UTC, while `src/lib/gamification/leaderboard-period.ts` scores Monday–Sunday in New York. `getUserGamificationStats()` still ranks the reset counter. The leaderboard and rank/stats can disagree; ties are also ranked differently (ID tiebreak in stats versus shared ranks in the leaderboard). | **Fixed in local follow-up.** Stats and leaderboard use the same New York ledger windows and tied ranks. Reset preserves current-week awards and runs Monday at 05:00 UTC (midnight EST / 01:00 EDT), within Hobby cron limits. Monday/tie regression tests pass. |
| 7 | High if image upload is used on Vercel / feature fails | **Uploads write to the deployed filesystem.** `src/app/api/upload/image/route.ts` writes into `process.cwd()/public/uploads/activities`; it does not use durable object storage. Serverless deployment storage is not a persistent public upload destination. | **Fixed in local follow-up.** Uploads use public Blob storage, validate size/type, and fail clearly on missing configuration/provider failure. Runtime BLOB_READ_WRITE_TOKEN required; hosted retrieval remains untested locally. |
| 8 | High on shared devices / privacy and wrong-owner drafts | **Speaking drafts are not user-scoped.** `src/lib/speakingSubmissions.ts` keys localStorage by activity and assignment only. The authenticated outbox is user-scoped, but loading another learner's draft happens before submission. Cache clearing does not clear localStorage drafts. | **Fixed in local follow-up.** Draft keys include the authenticated owner; account/scope changes remount the form, hydration precedes autosave, and async cleanup retains the submitting owner. Unowned legacy drafts remain preserved but are never auto-loaded. Account-switch regressions pass. |
| 9 | Moderate under failures / lost warmup credit | **Speaking warmups have the same completion-before-award gap.** `src/app/api/speaking/complete/route.ts` commits `status: completed`, then calls `applyAwardChain` outside that transaction. The duplicate branch prevents recovery after award failure. | **Fixed in local follow-up.** Completion and award chain share the locked transaction; retry receipts return zero. Rollback and concurrent-request regression tests pass using transaction doubles. Historical missing awards require separate evidence-based reconciliation; no production data was changed. |
| 10 | High when the warmup screen is reopened / misleading UI | **Warmup completion lookup uses the wrong endpoint and shape.** `SpeakingActivityRenderer.tsx` requests `/api/activities/progress`, but the endpoint is `/api/activity/progress`; it also expects `data.progress.status` instead of top-level `status`. Its successful completion handler never sets the existing points toast. | **Fixed in local follow-up.** Uses the canonical progress client and top-level status; successful completion displays the server receipt and refreshes progress. Client contract tests cover saved completion, awarded points, duplicates, and failed saves. |
| 11 | Moderate / missing receipt and retry | **Vocab completion UI couples credit with two refresh requests.** `VocabReviewClient.tsx` uses `Promise.all` for completion, summary, and queue; either refresh failure discards a successful award receipt. On failure it only resets a ref, which does not rerun the effect or show a retry action. | Confirmed; open. Server atomicity is fixed; client recovery is separate. |
| 12 | Moderate / invalid class associations | **Generic progress/submission APIs do not consistently enforce assignment scope.** Progress POST, speaking completion/submissions, grammar completion, and the non-quiz branch of activity submission accept assignment IDs without checking activity correspondence and active membership. Weekly/verb quiz submission has stronger checks. | Confirmed authorization gap; open. Test other-class, inactive enrollment, and mismatched activity IDs for each endpoint. |
| 13 | Moderate / gradebook corruption | **`/api/submissions` POST permits mismatched activity IDs and graded overwrites.** It checks enrollment but never compares `assignment.activityId` to the posted activity; its upsert replaces graded content/status. PUT refuses graded work, so POST bypasses that rule. The enrollment check does not require `status: active`. | Confirmed; open. Also coordinate grade writes and edits under the same scope lock. |
| 14 | Moderate / uncredited submitted work | **Legacy text and speaking submissions do not atomically award effort.** `/api/submissions` only writes a submission; `/api/speaking/submissions` writes submission/progress. The speaking UI subsequently asks the progress API for credit, after progress already reads 100. There is no submission-owned credit claim in these endpoints. | Confirmed missing reward path; open. Preserve submitted work and reconcile only after checking existing ledger credit. |
| 15 | Moderate / completion evidence lost | **Grammar exercise progress is still a read/modify/write race.** `src/app/api/grammar/exercise-progress/route.ts` reads category JSON, awards, then writes outside a common progress lock. Concurrent exercises or a navigation save can overwrite evidence. Its ledger dedupe helps prevent duplicate rewards, but does not preserve both JSON updates. | Confirmed concurrency risk; open. |
| 16 | Moderate / repeated diagnostics and client-controlled grades | **Grammar mini-quiz completion trusts client score and correctness and inserts responses on every retry.** `src/app/api/grammar/complete/route.ts` checks score bounds and quiz length, but does not grade responses against answers; `quizResponse.createMany` has no attempt/request identity. | Confirmed; open. Test forged scores, lost-response replay, and real retakes separately. |
| 17 | Moderate / migrations/checks bypassed in one release path | **Build commands disagree.** `npm run build` performs checks, migrations, and course-map seeding. `vercel.json` instead runs `prisma generate && next build`, and `npm run deploy` is also just `next build`. A successful Vercel build does not prove the schema or content sync ran. | **Partly fixed 2026-10-29.** The Vercel build now runs `scripts/migrate-deploy.mjs` before `next build` when `VERCEL_ENV=production` (preview builds skip it so unmerged migrations can't reach a shared database); a failed migration fails the deploy. Course-map seeding still runs only in `npm run build`. |
| 18 | Moderate / unsafe operational recovery | **Database guard uses substring allowlisting.** `scripts/lib/require-safe-db-target.js` considers hosts/database names containing `ci`, `dev`, or `test` non-production. A production hostname such as `service.example.com` contains `ci`; private networks can also host production. | Confirmed false-safe classification; open. Use explicit targets, not arbitrary substrings. |
| 19 | Moderate when old scripts are reused / partial destructive changes | **Some cleanup scripts have no recognized target/dry-run guard.** `scripts/maintenance/clear-marlie-progress.ts` and `scripts/db/sync-featured-items.ts` delete rows immediately for hard-coded accounts/classes. `scripts/migrations/update-all-vocab.js` and `scripts/vocab/seed-weekly-vocab.js` delete old activity IDs. Course-map seed also prunes rows during npm builds. | Confirmed operational risk; open. Deletions may fail on references or partially apply; do not run as audit checks. |
| 20 | Moderate when reset is used / partial reset | **Full reset is not atomic and misses related models.** `prisma/seed-full-reset.ts` deletes progress/ledger and resets balances before deleting activities, but leaves assignments, quiz responses, course-map links, and writing data that can block the activity delete. The target guard and prompt do not make the series atomic. | Confirmed; open. Needs isolated DB fixture with all relations populated. |
| 21 | Moderate on token compromise or role changes / retained access | **JWT sessions are not revoked after password/role changes or deletion.** `src/lib/auth/auth.ts` copies claims at login and returns them on subsequent JWT callbacks without checking a session version or current account role. Password-reset routes change credentials but do not revoke other sessions. | Confirmed design gap; open. |
| 22 | Moderate / longer desktop sessions than intended | **The 12-hour desktop expiration is overwritten by the encoder.** `auth.ts` assigns `token.exp`, but installed `next-auth/jwt/index.js` calls `setExpirationTime(now() + maxAge)`; the configured JWT maxAge is 30 days. | Confirmed against installed dependency implementation; open. |
| 23 | Moderate under overlapping requests / reset-token replay | **Reset token consumption is not conditional/atomic.** `/api/auth/reset-password` finds a valid token, hashes, then updates by user ID alone. Two concurrent requests can both validate the same token and the later write wins. | Confirmed race; open. Use conditional token-and-expiry consumption in the update. |
| 24 | Moderate / stale reset link remains valid | **Authenticated password change does not clear reset-token fields.** `/api/auth/password-reset` updates password and `mustChangePassword`, leaving a previously issued email reset token usable until expiry. | Confirmed; open. |
| 25 | Conditional on a token-store leak / credential reset | **Email reset tokens are stored as plaintext bearer tokens.** `/api/auth/forgot-password` stores the random token directly in `User.passwordResetToken`; reset looks it up directly. Hashing at rest would keep a read-only token-store leak from immediately yielding valid reset links. | Confirmed hardening gap; open. Tokens are random and expire, which limits exposure. |
| 26 | Moderate / password policy inconsistency | **Registration and email reset bypass the shared disallowed-password policy.** They duplicate length checks instead of using `auth/config.ts`. All paths allow 128 characters, despite bcrypt's 72-byte truncation, so different long passwords can compare identically. | Confirmed; open. Test UTF-8 byte boundaries as well as ASCII. |
| 27 | Moderate on malformed requests / noisy 500s | **Several mutation APIs assert JSON types rather than validating them.** Examples: null/malformed bodies in register/reset, non-string reset password/token, non-finite progress/accuracy, and arbitrary progress statuses. Some errors happen outside a route's error handler. | Confirmed validation gaps; open. Add boundary tests to each affected route, not only schema-unit tests. |
| 28 | Moderate under fast repeats / withheld or duplicate practice points | **Legacy progress awards still use display-title + 60-second dedupe where no stable attempt key is supplied.** Different activities with the same title can collide, real quick practice can be suppressed, and replay after the window can award again on repeatable paths. | Open outside the verb/POS attempt-key flow fixed in #2. Needs attempt identity on remaining repeatable games. |
| 29 | Moderate with dishonest clients / unsupported rewards | **Several endpoints trust completion claims.** Vocab completion accepts a client card count without checking saved review evidence; generic progress trusts client accuracy/counts/category JSON. Added count validation prevents malformed numbers, not fabricated effort. | Confirmed trust-boundary risk; open. Server-owned attempt evidence needed without punishing legitimate offline work. |
| 30 | Moderate under overlapping review saves / incorrect schedules | **Vocab review rating uses read-compute-upsert without request identity or a lock.** `src/lib/vocab/review.ts:saveVocabReviewRating` can lose concurrent review increments; a technical replay can count as a second review and change the schedule. | Confirmed race/replay risk; open. |
| 31 | Moderate when deleting writing participants / delete fails | **Self-service deletion omits writing relations.** `/api/account/delete` does not remove WritingGroupMember, WritingSubmission, WritingSessionCheckIn, or votes that reference the student without cascading. Admin deletion has separate handling, but self-delete rolls back with a foreign-key failure. | Confirmed schema mismatch; open. |
| 32 | Moderate in multi-teacher use / unauthorized global release | **Speaking/quiz release lack ownership and type checks.** Their handlers update any undeleted activity ID; speaking release also rejects the admin role. These are weaker than the normal activity-edit policy. | Confirmed policy inconsistency; open. Decide explicitly whether shared curriculum release is global teacher authority. |
| 33 | Conditional on untrusted authored content / stored HTML injection | **Some HTML renderers bypass sanitization.** `ExplanationPanel.tsx` injects `postExplanation`, and `InteractiveGuideViewer.tsx` injects explanation HTML directly, while neighboring fields use the sanitizer. | Confirmed unsafe sink; exploitability depends on who can supply that content. Open. |
| 34 | Conditional / incomplete browser protections | **Security headers cover only proxy-matched routes.** `src/proxy.ts` matches dashboard, password-reset, and activity, excluding login/register, teach, grammar-reader, public vocabulary, and APIs. CSP also allows inline scripts. | Confirmed coverage gap; open. Don't assume one response header policy covers the entire site. |
| 35 | Conditional on push configuration / server request abuse | **Push subscription endpoint accepts arbitrary endpoint strings.** They are stored and later passed to `webpush.sendNotification`, with no provider/HTTPS/private-address validation in app code. | Potential server-request abuse; not exploited. Open. Validate provider endpoints and keys before persistence. |
| 36 | Moderate on multi-device use / reminders disappear | **Push subscriptions are unique per user rather than per device.** Registering a second browser overwrites the first; expired endpoints are never removed because `sendVocabReminderToUser` swallows all send failures. | Confirmed reliability limitation; open. |
| 37 | Moderate with rapid audio taps / overlapping playback | **TTS hook cancellation does not cancel pending fetches.** `src/hooks/useTTS.ts` checks only mounted state after await. An older request can finish after a newer one or after `cancel()` and start speaking; its module cache never revokes object URLs or evicts entries. | Confirmed race/resource risk; open. |
| 38 | Conditional on early session termination / lost effort points | **Live writing awards only during class-vote → results.** Ending/skipping a round earlier retains written work but does not award participation. Other state-machine transitions do not share the award transition's lock. More than 40 checked-in students exhaust the ten animal groups. | Confirmed workflow/boundary gaps; open. |
| 39 | Moderate / inaccurate response totals | **Award receipt total excludes achievement bonuses.** `applyAwardChain` returns `updatedUser.points + streakBonus`, although achievement checking can award additional points afterward. | Confirmed; open. The persisted ledger may be correct while the receipt is stale. |
| 40 | Conditional on direct helper use / duplicate achievement bonuses | **Achievement dedupe does not gate the bonus on inserted rows.** `checkAndAwardAchievements` uses `createMany(skipDuplicates: true)` but sums all candidates. Normal award chains first lock the user through a balance update; direct concurrent calls do not have that protection. | Risk, not demonstrated on the normal award chain; open. |
| 41 | High near local midnight / wrong day/month views | **Day and month leaderboards use server-local dates.** `getLeaderboardPeriod` uses New York day keys for week views, but `new Date(year, month, day)` for day/month views. UTC servers shift “Today” relative to the learner. | Confirmed; open. Test under UTC and New York. |
| 42 | High during maintenance / false-green tests | **Nine existing `.test.ts` files are excluded from both runners.** Vitest only includes `.vitest.ts`; npm's Node runner names four files explicitly. Running eight safe omitted files produced 46 passes and 2 failures. | Confirmed; open. Full list and failures below. The ninth performs real DB mutation and was not run. |
| 43 | High during refactors / missing behavior coverage | **Coverage gate is deliberately narrow.** `vitest.config.ts` excludes award-chain/orchestration modules and measures a short include list with 25% line/function and 20% branch minimums. CI's browser job runs only the mobile smoke script, not the full Playwright collection. | Confirmed coverage limitation; open. A passing gate does not validate most routes or all browser flows. |
| 44 | Moderate when legacy content is requested / missing deployment files | **Legacy runtime depends on untracked directories.** `/api/legacy-guide` and tracing config reference `_legacy/activities` and `css-from-legacy`; neither is part of the tracked source inventory. A clean checkout cannot supply those assets from Git. | Confirmed packaging risk; open. Could be obsolete functionality, but do not remove without checking stored activity links. |
| 45 | Lower / increasing maintenance burden | **Unused modules and barrels remain.** Static import analysis found 60 modules with no incoming literal import/export/require; 5 are speaking content potentially loaded by tooling and are not classified as dead. | Candidates listed below. No files deleted; live DB/string-based references and manual scripts require checking before removal. |
| 46 | Lower / misleading tooling and environment drift | **Local Node differs from CI, and helper comments are stale.** Local verification used Node 23.3.0, CI pins Node 20; no package `engines` pins the contract. Maintenance wrapper-target labels point at removed old wrappers; several test headers still advertise old script locations. | Confirmed maintenance risk; open. |

## Missing tests and currently hidden failures

The normal baseline passed **123 Vitest files / 974 tests** plus **30 Node tests**, typecheck, and lint. `npm run check:push` passed after the five fixes. After the final report-aggregation adjustment, typecheck, affected-file lint, and coverage were rerun: **129 Vitest files / 1,017 tests** passed. The standard **30 Node tests** passed in the full gate. The measured coverage subset was **56.92% lines / 48.11% branches**; this is not whole-repository coverage.

The additional omitted-suite run produced **46 passes and 2 failures**:

- `tests/classes/learner-search.test.ts:359`: the “released quizzes” fixture sets DB `isReleased: false` and legacy JSON `released: true`; current visibility rejects it. Resolve the intended legacy policy or update the fixture, rather than blindly changing production visibility to satisfy the test.
- `tests/vocab/vocab-dark-mode-ui.test.ts`: reads nonexistent `src/components/ui/FillInBlankGame.tsx` and other old UI paths; the components moved to `src/components/games/`.

Existing Node-style suites not in the standard test command:

- `tests/auth/roles.test.ts`
- `tests/auth/student-isolation.test.ts` — integration script that mutates the configured database; intentionally not executed.
- `tests/calendar/calendar-week.test.ts`
- `tests/calendar/daily-habits.test.ts`
- `tests/classes/learner-mode.test.ts`
- `tests/classes/learner-search.test.ts`
- `tests/classes/section-group-classes.test.ts`
- `tests/classes/teacher-student-analytics.test.ts`
- `tests/vocab/vocab-dark-mode-ui.test.ts`

`tests/vocab/test-fsrs-algorithm.ts` is another ad-hoc executable check outside both standard discovery patterns. Do not add all scripts to a wildcard runner without separating integration/mutating tests from pure tests.

Behavior tests still needed, in priority order:

1. Real isolated PostgreSQL tests for concurrent progress, completion/ledger rollback, nullable-assignment uniqueness, request replay, and all writers sharing a lock. New transaction doubles validate orchestration, not actual database isolation.
2. Browser tests for zero-score practice → visible receipt → persisted balance/ledger, reload, rapid repeat, offline retry, and account switching. Existing effects/toasts were inspected; browser execution remains outstanding.
3. Assignment membership/activity correspondence and release/ownership matrices across every write endpoint, including archived activities and graduated students.
4. Legacy speaking/text submission reward recovery, graded submission immutability, and grammar exercise concurrency.
5. Password-token single-use under concurrency, session revocation, long Unicode passwords, and malformed-body handling.
6. Serverless upload persistence, safe target classification, failed/partial migrations, schema/content release parity, and isolated full-reset behavior.
7. Week/day/month leaderboard boundary consistency, ties, reset overlap, achievement response totals, and direct achievement concurrency.
8. Vocab review failure/retry UI, concurrent rating scheduling, paid-audio quota across multiple server instances, and audio cancellation.
9. Self-deletion after every writing relation is populated, live-session early exit participation, and class sizes above 40.
10. Push endpoint validation, multi-device subscriptions, expired subscription cleanup, HTML sanitizer coverage, and security headers on each route family.

The baseline scan found the following **62 API route files without a literal path reference in tests**. This is a discovery aid, not proof of zero indirect/static/browser coverage. New fixes now test progress POST via its library implementation, vocab completion, and TTS. Existing auth suites may inspect whole route families without naming a literal full path.

- `src/app/api/account/delete/route.ts`
- `src/app/api/activities/[id]/route.ts`
- `src/app/api/activities/route.ts`
- `src/app/api/activity/progress/route.ts`
- `src/app/api/admin/activities/[id]/featured-independent/route.ts`
- `src/app/api/admin/reset-weekly-points/route.ts`
- `src/app/api/assignments/reorder/route.ts`
- `src/app/api/assignments/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/api/calendar-events/route.ts`
- `src/app/api/classes/[id]/overview/route.ts`
- `src/app/api/classes/[id]/reveal/route.ts`
- `src/app/api/classes/[id]/roster/[studentId]/graduate/route.ts`
- `src/app/api/classes/[id]/roster/[studentId]/route.ts`
- `src/app/api/classes/[id]/roster/route.ts`
- `src/app/api/classes/route.ts`
- `src/app/api/course-map/next-launch/route.ts`
- `src/app/api/cron/reset-weekly-points/route.ts`
- `src/app/api/cron/send-vocab-reminders/route.ts`
- `src/app/api/dashboard/student-summary/route.ts`
- `src/app/api/dashboard/teacher-summary/route.ts`
- `src/app/api/diagnostics/class-skills/route.ts`
- `src/app/api/diagnostics/student-skills/route.ts`
- `src/app/api/diagnostics/tab-nav/route.ts`
- `src/app/api/feedback/route.ts`
- `src/app/api/gamification/award-points/route.ts`
- `src/app/api/gamification/leaderboard/context/route.ts`
- `src/app/api/gamification/stats/route.ts`
- `src/app/api/health/route.ts`
- `src/app/api/invites/[code]/route.ts`
- `src/app/api/invites/route.ts`
- `src/app/api/legacy-guide/route.ts`
- `src/app/api/ping/route.ts`
- `src/app/api/push/status/route.ts`
- `src/app/api/push/subscribe/route.ts`
- `src/app/api/push/unsubscribe/route.ts`
- `src/app/api/push/vapid-public/route.ts`
- `src/app/api/quiz/release/route.ts`
- `src/app/api/search/learner/route.ts`
- `src/app/api/search/learner/telemetry/route.ts`
- `src/app/api/speaking/complete/route.ts`
- `src/app/api/speaking/release/route.ts`
- `src/app/api/speaking/submissions/route.ts`
- `src/app/api/submissions/grade/route.ts`
- `src/app/api/submissions/route.ts`
- `src/app/api/teacher/activity-reports/route.ts`
- `src/app/api/tts/route.ts`
- `src/app/api/upload/image/route.ts`
- `src/app/api/user/avatar/route.ts`
- `src/app/api/user/preferences/route.ts`
- `src/app/api/vocab-review/complete/route.ts`
- `src/app/api/vocab-review/queue/route.ts`
- `src/app/api/vocab-review/review/route.ts`
- `src/app/api/vocab-review/summary/route.ts`
- `src/app/api/vocab/library/route.ts`
- `src/app/api/writing-session/[id]/advance/route.ts`
- `src/app/api/writing-session/[id]/end/route.ts`
- `src/app/api/writing-session/active/route.ts`
- `src/app/api/writing-session/start/route.ts`

## Dead/unused file candidates

The following modules have no incoming literal TypeScript/JavaScript import, re-export, or require in the tracked code graph. Framework entry points were excluded. These are deletion candidates, not an instruction to delete: content import scripts can use computed paths, database content can reference assets, and unreferenced barrels are harmless compatibility leftovers. No runtime module was removed as part of the five fixes.

- `src/components/admin/AdminHeader.tsx`
- `src/components/dashboard/ActivityCarousel.tsx`
- `src/components/dashboard/ChapterStripCoursePath.tsx`
- `src/components/dashboard/ContinueLearningRow.tsx`
- `src/components/dashboard/CourseMapMobileDrawer.tsx`
- `src/components/dashboard/CourseMapPathBreadcrumb.tsx`
- `src/components/dashboard/DashboardCoursePathCard.tsx`
- `src/components/dashboard/DashboardNextUpHero.tsx`
- `src/components/dashboard/DashboardResumeWeekActivities.tsx`
- `src/components/dashboard/MobileStudentGreeting.tsx`
- `src/components/dashboard/TeacherPendingReviewsStat.tsx`
- `src/components/dashboard/TeacherStudentStatsPanel.tsx`
- `src/components/dashboard/TeachingScheduleEditor.tsx`
- `src/components/dashboard/VocabReviewLaunchCard.tsx`
- `src/components/dashboard/WeeklyQuizBadge.tsx`
- `src/components/dashboard/YourLevelPanel.tsx`
- `src/components/forms/ForgotPasswordForm.tsx`
- `src/components/forms/index.ts`
- `src/components/games/GerundInfinitiveGame/PatternHint.tsx`
- `src/components/games/GerundInfinitiveGame/exercises/SwipeChoiceExercise.tsx`
- `src/components/games/IrregularVerbsGame/PatternHint.tsx`
- `src/components/games/IrregularVerbsGame/index.ts`
- `src/components/games/TimelineTensesGame/PracticeModeBar.tsx`
- `src/components/grammar-reader/BreadcrumbTrail.tsx`
- `src/components/grammar-reader/ConfidenceRating.tsx`
- `src/components/grammar-reader/HintSystem.tsx`
- `src/components/grammar-reader/exercises/DragDropExercise.tsx`
- `src/components/layout/index.ts`
- `src/components/public-vocab/ActivityCheckmark.tsx`
- `src/components/public-vocab/MasteryBadge.tsx`
- `src/components/public-vocab/MobileActivityDropdown.tsx`
- `src/components/public-vocab/ProgressRing.tsx`
- `src/components/public-vocab/ThemeDrawer.tsx`
- `src/components/renderers/index.ts`
- `src/components/student/index.ts`
- `src/components/system/index.ts`
- `src/components/teach/TeachHeader.tsx`
- `src/components/ui/AvatarSection.tsx`
- `src/components/ui/FeedbackNavItem.tsx`
- `src/components/ui/FeedbackWidget.tsx`
- `src/components/ui/LoadingSkeleton.tsx`
- `src/components/ui/StudyReminders.tsx`
- `src/components/vocab/index.ts`
- `src/data/monthly-content-map.ts`
- `src/hooks/index.ts`
- `src/lib/api/index.ts`
- `src/lib/auth/index.ts`
- `src/lib/dashboard-card-preview.ts`
- `src/lib/database/index.ts`
- `src/lib/gamification/index.ts`
- `src/lib/shared/index.ts`
- `src/lib/verbs/index.ts`
- `src/lib/vocab/index.ts`
- `src/types/index.ts`
- `src/utils/index.ts`

These five content files were also unreferenced in the static graph, but are **not classified as dead** because curriculum tooling can discover files by filename:

- `src/content/speaking/daily-warmups/future-goals-money-milestones-2026-02-12.ts`
- `src/content/speaking/daily-warmups/housing-conditionals-2026-01-29.ts`
- `src/content/speaking/daily-warmups/long-term-career-goals-2026-03-19.ts`
- `src/content/speaking/daily-warmups/money-housing-plans-2026-02-05.ts`
- `src/content/speaking/daily-warmups/resume-cover-letter-basics-2026-02-24.ts`

Other retained files are intentional or insufficiently proven dead: FY26/FY27 teaching resources, documents, public media, database migration history, standalone seeds/imports, test fixtures, and `gamification/award-points/route.ts` (an explicit 410 compatibility endpoint). A missing import alone cannot establish that a public URL is unused.

## Validation and limits

- `npm run check:push`: typecheck, lint, Vitest coverage, and standard Node suites passed. Final report-key adjustment: typecheck, affected-file lint, and full Vitest coverage reran successfully (1,017 tests).
- Generated content check passed: gerund CSV parity, vocabulary duplicate baseline (54 known cross-week duplicate terms), and 34 weekly quizzes.
- Mini-guide audit passed for weeks 1–18 with no errors/warnings; this does not validate every historical teaching document.
- Repository hygiene check and `git diff --check` passed.
- Omitted pure Node suites: 46 passes / 2 failures, documented above. The database-mutating student-isolation script was not run.
- No `npm run build`, seeds, reset scripts, migration command against a real DB, or E2E setup was run. The build script mutates its configured database, and an isolated test database was not established for this task.
- No vulnerability advisory claim is made: a fresh registry dependency audit was not performed. The installed code was inspected where dependency behavior mattered.
- Existing historical missing-credit records were not reconciled. This task changes repo code; confirmed missing awards need a separate data audit that checks completion evidence and existing ledger entries before crediting anything.
- TTS rate limits use the existing shared-store configuration. With no Upstash configuration, its fallback remains per-instance memory; production-wide quotas therefore require the shared store. Account quotas reduce exposure but are not a global dollar budget.
- Existing classroom/PDF edits and untracked material were preserved. No files were pushed or deployed.

Companion: [tracked-file inventory](repository-audit-inventory-2026-10-24.json).

## Local follow-up: findings 6–10

Five additional fixes were made locally, one commit per finding. `npm run check:push` passed: typecheck, lint, 134 Vitest files / 1,031 tests, coverage thresholds, and 30 Node tests. No push or deployment was performed. Blob provider calls and transaction behavior were verified with test doubles; hosted retrieval, a real PostgreSQL concurrency run, and browser UI verification were not performed. Image uploads require the runtime `BLOB_READ_WRITE_TOKEN`. Legacy unowned speaking drafts were preserved without loading them into another account. Historical warmup credit gaps were not altered without production completion/ledger evidence.
