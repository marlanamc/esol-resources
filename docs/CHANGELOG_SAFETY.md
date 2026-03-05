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

