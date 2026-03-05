# Sections and Authorization Guardrails

This document is the source of truth for:
- Multi-section class behavior
- Assignment sync rules
- Leaderboard scoping rules
- Authorization policy usage for API/routes

Use this before adding or modifying class, assignment, leaderboard, or teacher/admin features.

## Data Model

### Class section grouping
- `Class.sectionGroupId` links sections of the same course.
- `NULL` means standalone class (no section sync).
- All classes in the same section group should have the same teacher owner in normal operation.

### Role model
- Database role values:
  - `student`
  - `teacher`
  - `teacher_admin`
- Session role values:
  - `student`
  - `teacher`
- Admin detection:
  - `session.user.isTeacherAdmin === true`

## Section Behavior

### Create section from existing class
- Route: `POST /api/classes`
- Input:
  - `sourceClassId` (optional)
  - `copyAssignments` (optional, boolean)
- Behavior:
  - No `sourceClassId`: create standalone class with a new `sectionGroupId`.
  - With `sourceClassId`: create a new class in the source class group.
  - If source has no group yet, one is created and source is updated.
  - If `copyAssignments` is true, source assignments are cloned into the new section.

### Per-assignment sync toggle
- Route: `POST /api/assignments`
- Input:
  - `syncToSectionGroup` (boolean, default `true`)
- Behavior:
  - `true`: assignment is also created in sibling sections in same `sectionGroupId`.
  - `false`: assignment is created only in the selected class.

## Leaderboard Rules

### Class-scoped by default
- Route: `GET /api/gamification/leaderboard`
- If `classId` provided:
  - Must pass access checks.
- If `classId` not provided:
  - Student: defaults to latest enrolled class.
  - Teacher/admin: defaults to latest visible class.

### Access checks
- Student can request only classes they are enrolled in.
- Teacher can request only owned classes.
- `teacher_admin` can request all classes.

### UI notes
- Leaderboard subtitle hosts a subtle class selector for multi-class users.
- If only one class is available, no selector is shown.

## Authorization Policy Helpers

Central policy helpers live in:
- `src/lib/policies.ts`

Use these helpers instead of inlining ad hoc role checks:
- `ensureTeacher(user)`
- `classOwnershipWhere(user, admin)`
- `canManageClass(user, admin, teacherId)`
- `canManageActivity(user, admin, createdBy)`

### Required pattern for new teacher API routes
1. Check session exists.
2. Call `ensureTeacher(session.user)`.
3. Resolve resource.
4. Enforce ownership with `canManageClass`/`canManageActivity`.
5. Only then mutate/read sensitive data.

## Known UX Guardrails

### Teacher dashboard checklist dedupe
- Teacher checklist intentionally dedupes section-synced items by:
  - `activityId + normalized title`
- It keeps the newest item and shows an `N sections` badge.
- Student checklist is not deduped globally (student data is class-scoped).

## Safety Checklist for Changes

Before merging class/section/auth changes:
1. `npm run typecheck`
2. Verify:
   - Teacher can access only owned classes
   - Admin can access all classes
   - Student cannot access unrelated class leaderboard
3. Verify section sync:
   - New assignment with sync ON appears in sibling sections
   - New assignment with sync OFF appears only in selected section
4. Verify teacher checklist:
   - No duplicate rows from section sync
   - `N sections` badge appears when expected

## Migration Notes

- Migration introducing section groups:
  - `prisma/migrations/20260305103000_add_class_section_group/migration.sql`
- After pulling schema changes:
  - `npx prisma migrate dev`
  - `npx prisma generate`

