# User Types and Transitions

This document describes the different user types in Class Companion and how students transition between learning modes.

## User Roles

Class Companion has the following roles:

| Role | Database Value | Description |
|------|---------------|-------------|
| **Teacher** | `teacher` | Creates classes, assigns activities, views student progress and reports |
| **Admin** | `admin` | One account with teacher tools plus full access to all classes, students, and independent learners |
| **Student** | `student` | Completes activities, earns points, appears on leaderboards |

### Admin Capabilities

Users with the `admin` role have elevated access:

- **Stats page** (`/dashboard/stats`) - Toggle between "Classroom", "Independent", and "All Students" views
- **Reports page** (`/dashboard/reports`) - Filter activity reports by learner type
- **Leaderboard** (`/dashboard/leaderboard`) - Toggle between "Classroom" and "Independent" leaderboards
- **All classes** - Access to all classes, not just their own
- **Dashboard view toggle** - Switch between "Teaching" and "Admin" views from one login

To check if a user can use teacher tools or admin tools:

```typescript
import { canUseTeacherTools, isAdmin } from "@/lib/roles";

const teacherTools = canUseTeacherTools(session.user);
const admin = isAdmin(session.user);
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
1. Check active ClassEnrollment rows for the student
2. If at least one enrollment has status = "active", use "classroom"
3. If no active enrollments exist, use "independent"
```

**Key points:**
- ClassEnrollment.status is the source of truth
- Students do not manually toggle learner mode
- Graduated and exited enrollments remain history but do not make a learner classroom
- A never-enrolled student is independent by definition

## Database Schema

### ClassEnrollment

```prisma
model ClassEnrollment {
  id              String   @id @default(cuid())
  classId         String
  studentId       String
  joinedAt        DateTime @default(now())
  status          String   @default("active") // active | exited | graduated
  statusChangedAt DateTime?
  statusNote      String?

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

Mark the active class enrollment as graduated:

```typescript
await graduateStudentFromClass({
  prisma,
  studentId: userId,
  classId,
  note: "Completed Spring 2026"
});
```

No separate learner-mode preference is written. The student becomes independent because they no longer have an active enrollment.

### What Happens After Transition

Once transitioned, the student will:

1. **Dashboard** - Be redirected to `/dashboard/independent` instead of the classroom dashboard
2. **Leaderboard** - Appear on the independent leaderboard, not class leaderboards
3. **Activities** - See the independent learning path with staged recommendations
4. **Progress** - Continue with their existing points, streaks, and achievements

### Reversing a Transition

To move a student back to classroom mode:

1. Enroll or reactivate them in a class with `status = "active"`

```typescript
await enrollStudentInClass({
  prisma,
  studentId: userId,
  classId,
});
```

## Leaderboard Isolation

Classroom and independent leaderboards are completely separate:

| Leaderboard Type | Who Appears |
|-----------------|-------------|
| **Class Leaderboard** | Only students with active enrollment in that class |
| **All Classes Leaderboard** | Students with active enrollment in any of the viewer's classes |
| **Independent Leaderboard** | Students with no active class enrollments |

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
  "weeklyActivityGoal": 4
}
```

Response:
```json
{
  "ok": true,
  "weeklyActivityGoal": 4,
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
