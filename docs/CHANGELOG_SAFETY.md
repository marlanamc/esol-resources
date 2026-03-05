# Safety Changelog

Use this log for any change that affects:
- Authorization
- Class/section data model
- Assignment sync behavior
- Leaderboard scoping
- Destructive scripts or data migrations

Goal: make high-risk changes auditable and reversible.

## Entry Template

Copy/paste this block for each change:

```md
## YYYY-MM-DD - Short Title

### Summary
- What changed:
- Why:

### Risk Level
- Low / Medium / High

### Areas Impacted
- API routes:
- UI pages/components:
- DB models/migrations:

### Backward Compatibility
- Compatible: Yes/No
- If No, breaking behavior:

### Rollback Plan
1. Revert commit(s):
2. Revert migration/data changes:
3. Restore config/env:

### Verification Performed
- [ ] Typecheck
- [ ] Relevant route access checks (teacher/student/admin)
- [ ] Data integrity checks
- [ ] UI smoke check

### Notes
- Any edge cases, follow-ups, or TODOs:
```

## Entries

## 2026-03-05 - Calendar Event Edit Flow on Teacher Dashboard

### Summary
- Replaced direct delete action in upcoming events with an edit-first flow.
- Added calendar event update endpoint (`PATCH /api/calendar-events`) with teacher authorization checks.
- Delete now happens from inside the edit panel with explicit confirmation.

### Risk Level
- Medium

### Areas Impacted
- API routes: calendar-events.
- UI pages/components: UpcomingEventsList, teacher dashboard/calendar pages.
- DB models/migrations: none.

### Backward Compatibility
- Compatible: Yes
- Notable behavior changes:
  - Teachers now click `Edit` first; delete is no longer a one-click action.

### Rollback Plan
1. Revert edit-flow UI/API commits.
2. Restore direct delete button in upcoming events list.
3. Smoke-check teacher calendar create/delete.

### Verification Performed
- [x] Typecheck
- [ ] Relevant route access checks (teacher/student/admin)
- [ ] Data integrity checks
- [ ] UI smoke check

### Notes
- Upcoming list now reads and preserves calendar event descriptions during edit.

## 2026-03-05 - Calendar Section Sync Option

### Summary
- Added optional calendar event sync across section siblings in the same `sectionGroupId`.
- Added teacher UI toggle in Add to Calendar to choose one section or all sections.

### Risk Level
- Medium

### Areas Impacted
- API routes: calendar-events.
- UI pages/components: calendar/new, CreateCalendarEventForm.
- DB models/migrations: none.

### Backward Compatibility
- Compatible: Yes
- Notable behavior changes:
  - Default remains single-class event creation.
  - Teachers can now opt in to multi-section creation.

### Rollback Plan
1. Revert calendar sync UI/API commits.
2. Keep existing event data; no migration rollback needed.
3. Verify Add to Calendar reverts to single-class behavior.

### Verification Performed
- [ ] Typecheck
- [ ] Relevant route access checks (teacher/student/admin)
- [ ] Data integrity checks
- [ ] UI smoke check

### Notes
- Response now includes `createdCount` when creating calendar events.

## 2026-03-05 - Section Sync + Policy Centralization

### Summary
- Added `Class.sectionGroupId` support.
- Added section creation from existing class.
- Added assignment sync across sections with per-assignment toggle.
- Added class-scoped leaderboard defaulting and context endpoint.
- Centralized key auth checks using `src/lib/policies.ts`.

### Risk Level
- High

### Areas Impacted
- API routes: classes, assignments, activities, leaderboard, calendar, submissions.
- UI pages/components: dashboard, leaderboard, class create/edit flows.
- DB models/migrations: `Class.sectionGroupId` migration.

### Backward Compatibility
- Compatible: Mostly yes
- Notable behavior changes:
  - Teacher checklist now dedupes synced assignments.
  - Leaderboard defaults to class scope instead of global scope.

### Rollback Plan
1. Revert section-sync and policy commits.
2. Revert/ignore section-group usage in code paths.
3. Keep migration in DB but stop relying on field in app logic.

### Verification Performed
- [x] Typecheck
- [x] Relevant route access checks (teacher/student/admin)
- [x] Data integrity checks
- [x] UI smoke check

### Notes
- Teacher checklist now shows `N sections` badge on deduped synced items.
- Leaderboard selector moved to subtle subtitle inline dropdown.
