# User Types and Transitions

This document describes the different user types in Class Companion and how students transition between learning modes.

## User Roles

Class Companion has the following roles:

| Role | Database Value | Description |
|------|---------------|-------------|
| **Teacher** | `teacher` | Creates classes, assigns activities, views student progress and reports |
| **Teacher Admin** | `teacher_admin` | Full access to all classes and students, including independent learners |
| **Student** | `student` | Completes activities, earns points, appears on leaderboards |

### Teacher Admin Capabilities

Users with the `teacher_admin` role have elevated access:

- **Stats page** (`/dashboard/stats`) - Toggle between "Classroom", "Independent", and "All Students" views
- **Reports page** (`/dashboard/reports`) - Filter activity reports by learner type
- **Leaderboard** (`/dashboard/leaderboard`) - Toggle between "Classroom" and "Independent" leaderboards
- **All classes** - Access to all classes, not just their own

To check if a user is an admin:

```typescript
import { isTeacherAdmin } from "@/lib/roles";

const admin = isTeacherAdmin(session.user);
```

## Student Learning Modes

Students can operate in one of two learning modes:

### Classroom Mode (Default)

- Students are enrolled in one or more classes
- They see assignments featured by their teacher
- They appear on class-specific leaderboards
- Dashboard shows class announcements, calendar events, and weekly checklist

### Independent Mode

- Students learn on their own without class enrollment
- They follow a structured learning path with staged recommendations
- They appear on the independent learner leaderboard (separate from classroom)
- Dashboard shows personalized activity recommendations and progress tracking

## How Learning Mode is Determined

The learning mode is resolved using the following logic:

```
1. Check UserPreferences.learnerMode for the student
2. If preference exists and is valid ("classroom" or "independent"), use it
3. If no preference exists, default to "classroom"
```

**Key points:**
- The default is always `"classroom"` for safety
- Students must explicitly opt into `"independent"` mode
- Class enrollment count does NOT automatically change the mode
- An unenrolled student without a preference will still be in `"classroom"` mode

## Database Schema

### UserPreferences

```prisma
model UserPreferences {
  id                   String   @id @default(cuid())
  userId               String   @unique
  learnerMode          String   @default("classroom")  // "classroom" | "independent"
  weeklyActivityGoal   Int      @default(3)
  weeklyGoalStartDay   Int      @default(1)            // 0=Sunday, 1=Monday
  skillFocus           String[] @default([])
  // ... other fields
}
```

### ClassEnrollment

```prisma
model ClassEnrollment {
  id        String   @id @default(cuid())
  classId   String
  studentId String
  joinedAt  DateTime @default(now())

  @@unique([classId, studentId])
}
```

## Transitioning Students

### When to Transition

Transition a student from classroom to independent mode when:
- They complete a class/course
- They no longer need teacher-assigned activities
- They want to continue learning independently

### Transition Process

#### Step 1: Remove Class Enrollments

Remove the student from all class enrollments:

```sql
-- Using SQL
DELETE FROM "ClassEnrollment" WHERE "studentId" = '<user_id>';
```

Or using Prisma:

```typescript
await prisma.classEnrollment.deleteMany({
  where: { studentId: userId }
});
```

#### Step 2: Update Learning Mode Preference

Set the student's learning mode to independent:

```sql
-- Using SQL (upsert)
INSERT INTO "UserPreferences" (id, "userId", "learnerMode", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), '<user_id>', 'independent', NOW(), NOW())
ON CONFLICT ("userId")
DO UPDATE SET "learnerMode" = 'independent', "updatedAt" = NOW();
```

Or using Prisma:

```typescript
await prisma.userPreferences.upsert({
  where: { userId },
  update: { learnerMode: "independent" },
  create: {
    userId,
    learnerMode: "independent",
  }
});
```

Or via the API (as the logged-in student):

```typescript
// POST /api/user/preferences
fetch('/api/user/preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ learnerMode: 'independent' })
});
```

### What Happens After Transition

Once transitioned, the student will:

1. **Dashboard** - Be redirected to `/dashboard/independent` instead of the classroom dashboard
2. **Leaderboard** - Appear on the independent leaderboard, not class leaderboards
3. **Activities** - See the independent learning path with staged recommendations
4. **Progress** - Continue with their existing points, streaks, and achievements

### Reversing a Transition

To move a student back to classroom mode:

1. Enroll them in a class
2. Update their preference to `"classroom"` (or delete the preference to use default)

```typescript
// Re-enroll in a class
await prisma.classEnrollment.create({
  data: {
    classId: classId,
    studentId: userId,
  }
});

// Update preference
await prisma.userPreferences.update({
  where: { userId },
  data: { learnerMode: "classroom" }
});
```

## Leaderboard Isolation

Classroom and independent leaderboards are completely separate:

| Leaderboard Type | Who Appears |
|-----------------|-------------|
| **Class Leaderboard** | Only students enrolled in that specific class |
| **All Classes Leaderboard** | Students enrolled in any of the viewer's classes |
| **Independent Leaderboard** | Only students with `learnerMode: "independent"` OR no class enrollments |

This ensures:
- Classroom students compete with their classmates
- Independent learners compete with other independent learners
- No mixing between the two groups

## API Endpoints

### Get User Preferences

```
GET /api/user/preferences
```

Response:
```json
{
  "learnerMode": "classroom",
  "weeklyActivityGoal": 3,
  "weeklyGoalStartDay": 1,
  "skillFocus": []
}
```

### Update User Preferences

```
POST /api/user/preferences
Content-Type: application/json

{
  "learnerMode": "independent"
}
```

Response:
```json
{
  "ok": true,
  "learnerMode": "independent",
  "weeklyActivityGoal": 3,
  "weeklyGoalStartDay": 1,
  "skillFocus": []
}
```

### Leaderboard Context

```
GET /api/gamification/leaderboard/context
```

Response includes `learnerMode` and `defaultScope`:
```json
{
  "viewerRole": "student",
  "learnerMode": "independent",
  "classes": [],
  "defaultClassId": null,
  "defaultScope": "independent"
}
```

## Testing

Run the student isolation tests to verify the separation between modes:

```bash
npx tsx scripts/tests/student-isolation.test.ts
```

This test suite verifies:
- Classroom students remain in classroom mode
- Independent students are properly isolated
- Leaderboards show the correct students
- Transitions work correctly

## Related Files

- [`src/lib/learner-mode.ts`](../src/lib/learner-mode.ts) - Mode resolution logic
- [`src/lib/gamification/leaderboard-filter.ts`](../src/lib/gamification/leaderboard-filter.ts) - Leaderboard filtering
- [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx) - Dashboard routing logic
- [`src/app/dashboard/independent/`](../src/app/dashboard/independent/) - Independent dashboard
- [`src/lib/independent-learning.ts`](../src/lib/independent-learning.ts) - Independent learning path
- [`scripts/tests/student-isolation.test.ts`](../scripts/tests/student-isolation.test.ts) - Integration tests
