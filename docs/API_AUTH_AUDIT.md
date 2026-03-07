# API Auth & Authorization Audit

Last updated: 2025-03

## Summary

All API routes have been audited for authentication and authorization. Key findings:

- **Auth**: All protected routes use `getServerSession(authOptions)` and return 401 when unauthenticated.
- **Role checks**: Teacher-only routes verify `session.user.role === "teacher"`.
- **Resource ownership**: Class/activity/assignment routes verify `canManageClass` / `canManageActivity` before mutations.
- **Cron**: `cron/reset-weekly-points` validates `CRON_SECRET` Bearer token.

## Route-by-Route Audit

| Route | Auth | Role | Ownership Check |
|-------|------|------|-----------------|
| `activity/submit` | ✅ | Student | N/A (own submission) |
| `activity/progress` | ✅ | Student | N/A (own progress) |
| `admin/reset-student-password` | ✅ | Teacher | Student in teacher's class |
| `admin/reset-weekly-points` | ✅ | Teacher | N/A (global action) |
| `assignments` | ✅ | Teacher | `canManageClass`, `canManageActivity` |
| `assignments/featured` | ✅ | Both | Scoped by user |
| `calendar-events` | ✅ | Teacher | `canManageClass` |
| `classes` | ✅ | Teacher | `classOwnershipWhere` |
| `classes/[id]` | ✅ | Teacher | `canManageClass` |
| `classes/join` | ✅ | Student only | Teachers blocked |
| `cron/reset-weekly-points` | ✅ CRON_SECRET | N/A | N/A |
| `gamification/leaderboard` | ✅ | Both | Class-scoped when provided |
| `gamification/stats` | ✅ | Both | Own stats only |
| `submissions` | ✅ | Student | Own submissions |
| `submissions/grade` | ✅ | Teacher | Class ownership via assignment |
| `teacher/student-analytics/[id]` | ✅ | Teacher | Student in teacher's class |
| `legacy-guide` | ✅ | Both | N/A |
| `grammar/*`, `quiz/*`, `speaking/*` | ✅ | Teacher/Student | Per-route |

## Recommendations

1. **Extract `withAuth` / `withTeacher`** – Reduce boilerplate across routes (Tier 6.1).
2. **Rate limiting** – Login and password reset have it; consider for other sensitive endpoints.
3. **Audit logging** – `admin/reset-student-password` uses audit log; extend to other admin actions.
