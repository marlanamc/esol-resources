# Summer Deep Clean — Marlie's Local Todo List

Branch: `claude/student-home-redesign-lzpasp`

---

## Do First (5 min)

- [ ] `npm install` — picks up `react-hook-form` and `@hookform/resolvers` added in Phase 6b
- [ ] `npm run typecheck` — should be clean (pre-existing env errors don't count)
- [ ] `npm run lint` — should be clean

---

## Browser Test Pass (before merging)

These were done in the remote container without a browser. Walk through each one locally:

**Forms — golden path + error states**
- [ ] `/login` — bad credentials shows error; good credentials signs in
- [ ] `/forgot-password` — valid email shows success; invalid email shows error
- [ ] `/reset-password?token=...` — invalid token shows "Invalid Link"; valid token lets you reset
- [ ] `/join?code=XXXX` — invite code auto-fills and validates; full registration flow works
- [ ] `/dashboard/classes/join` — wrong code shows field error; correct code joins
- [ ] `/dashboard/classes/new` — create class; try "Copy from existing class" toggle
- [ ] `/dashboard/classes/[id]/edit` — edit name/description saves
- [ ] `/dashboard/activities/new` — create each activity type (worksheet, quiz, slides…)
- [ ] `/dashboard/activities/[id]/edit` — edit and save an existing activity
- [ ] `/dashboard/assignments/new` — create assignment; check activity auto-fills title
- [ ] Student submission form — submit, update submission, see "waiting for review" state

**Dark mode toggle** — flip on and check:
- [ ] Dashboard leaderboard and widgets look right
- [ ] Grammar guide pages
- [ ] Game pages (Timeline Tenses, Gerund/Infinitive)
- [ ] Login / Join pages

**Server Component conversions** — these should just render; verify no blank panels:
- [ ] Vocab unit/topic cards (`/vocab` or wherever level-1 UI shows)
- [ ] `MedalIcons`, `CertificateMedal`, `MiniCertificateCard` (achievements/leaderboard area)
- [ ] `TeacherPendingReviewsStat` and `NewThisWeekSection` on teacher dashboard

---

## Deferred Task — Phase 3e (medium effort, needs VS Code)

**Split `ActivityCategories.tsx` (1,427 lines)**

File: `src/components/dashboard/ActivityCategories.tsx`

A split was started in git history but not finished. Each major category section should become its own sub-component under `src/components/dashboard/activity-categories/`.

Steps:
1. Read the file to identify the logical section boundaries (one per activity category)
2. Extract each section into `src/components/dashboard/activity-categories/<CategoryName>.tsx`
3. Import them all back into `ActivityCategories.tsx` as a slim orchestrator
4. Run `npm run typecheck` and verify the dashboard activity list still renders

---

## Optional / Nice-to-Have

- [ ] **ESLint `no-console` rule** — add `"no-console": "warn"` to `.eslintrc` (Phase 1c from plan); 45 files currently have production `console.*` calls
- [ ] **Tailwind animation utilities** — the 22 `@keyframes` in `globals.css` aren't registered in `tailwind.config.ts`, so they can't be used as `animate-*` classes. Add them if you want that convenience.
- [ ] **`src/lib` shim comments** — 31 backward-compat re-export files in `src/lib/*.ts` could each get a one-line deprecation comment pointing to the canonical path (Phase 4c)

---

## All Done (for reference)

- [x] Phase 1 — Housekeeping (orphaned files, `.gitignore`, script organization)
- [x] Phase 2 — Token system (used-to tokens, writing/reading aliases, hardcoded hex → CSS vars, `.form-field` utility)
- [x] Phase 3a — Game type files moved from `src/components/ui/` to `src/components/games/`
- [x] Phase 3b — Duplicate `AssignmentCard` consolidated
- [x] Phase 3c — `PrimaryActionButton`, `ContextualBackButton`, `CourseMapReturnButton` thinned to wrappers
- [x] Phase 3d — `Dialog.tsx` primitive created; HowToPlay modals refactored to use it
- [x] Phase 4a — Tests moved from `/scripts/tests/` to `/tests/` organized by domain
- [x] Phase 4b — Jest/Vitest duplicate test files resolved
- [x] Phase 4c — Canonical lib paths documented in `CLAUDE.md`
- [x] Phase 5 — 13 pure-display components converted from Client → Server Components
- [x] Phase 6a — `src/lib/api/client.ts` typed fetch wrapper (`apiFetch` + `ApiError`)
- [x] Phase 6b — All 11 forms migrated to react-hook-form + zod
