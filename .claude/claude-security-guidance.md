# Class Companion — project security rules

Codebase-specific invariants for the security-guidance plugin's review layers.
These supplement (do not repeat) the built-in generic rules (XSS, injection, SSRF,
secrets, path traversal). Flag a diff that violates any rule below.

## 1. Auth gate on every API route
Every handler under `src/app/api/**/route.ts` MUST establish a session via
`getServerSession(authOptions)` and return 401 when there is no `session?.user`,
BEFORE reading request body/query or touching the database. Flag any new or edited
route handler that reads request data or queries Prisma before establishing a
session. (Exempt: `src/app/api/cron/**` and `src/app/api/auth/**`, which use their
own auth — see rule 5.)

## 2. Role gating on teacher operations
Teacher-only operations — class creation, assignment creation, content release
(`/api/grammar/release`, `/api/quiz/release`, `/api/speaking/release`), and anything
under `/api/admin/**` — MUST check `session.user.role === 'teacher'` (or
`isTeacherAdmin`) and return 403 otherwise. Flag a state-changing handler in these
areas that has a session check but no role check.

## 3. IDOR / ownership on student-scoped data
Any Prisma query filtered by `studentId`, `userId`, or `classId` MUST derive that
identifier from the session (`session.user.id`) or from a verified `ClassEnrollment`
membership — NEVER directly from an unvalidated request body or query param. Flag a
`where` clause that uses a client-supplied `studentId`/`userId`/`classId` without a
preceding ownership/enrollment check. Reference idiom:
`src/app/api/activity/submit/route.ts`.

## 4. Points integrity (anti-fraud / anti-replay)
- Points may be granted ONLY through `awardPoints()` writing to `PointsLedger`.
  Flag any code that increments `User.points` or `User.weeklyPoints` directly to
  grant a reward.
- Ranking/leaderboard math MUST read from `PointsLedger`, not from `User` totals.
- Award paths MUST preserve the idempotency guard (advisory lock + `findFirst`
  dedup, see `src/lib/gamification/gamification.ts`). Flag a new award path that has
  no duplicate-grant check — a replayed submission must not double-award.

## 5. Cron route authentication
Routes under `src/app/api/cron/**` MUST validate `CRON_SECRET` (prefer a
constant-time compare) before doing any work, and MUST fail closed when the secret
is unset. Flag a cron handler that proceeds when the secret is missing or mismatched.

## 6. Destructive DB-mutation safety
Scripts that perform destructive database writes (resets, bulk deletes, prod
mutations) MUST go through the `ALLOW_PROD_DB_MUTATION` / `CONFIRM_DB_HOST` guards in
`scripts/lib/require-safe-db-target.js`. Flag a destructive write that bypasses that
guard.

## 7. Leaderboard exclusion
Leaderboard and ranking queries MUST exclude the test account `marlie` and the
usernames in `EXCLUDED_LEADERBOARD_USERNAMES`. Flag a new ranking/leaderboard query
that does not apply the exclusion helper.
