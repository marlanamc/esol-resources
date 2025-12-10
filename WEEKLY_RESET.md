# Weekly Points Reset

The weekly leaderboard runs on a **Tuesday - Monday** cycle to match your class schedule.

## When to Reset

Reset weekly points **every Tuesday** to start a new competition week.

## How to Reset Weekly Points

### Option 1: Run Script Locally (Recommended)

```bash
node scripts/reset-weekly-points.js
```

This will:
1. Show last week's rankings
2. Save each student's rank for comparison next week
3. Reset all students' weekly points to 0
4. Start a fresh week

### Option 2: Call API Endpoint

As a logged-in teacher, you can also visit:
```
POST https://myesolclass.com/api/admin/reset-weekly-points
```

Or use curl:
```bash
curl -X POST https://myesolclass.com/api/admin/reset-weekly-points \
  -H "Cookie: your-session-cookie"
```

## What Happens During Reset

- **Weekly points** reset to 0 for all students
- **Total points** remain unchanged (lifetime total)
- **Current streaks** remain unchanged
- **Last week's rankings** are saved (shows rank changes on leaderboard)

## Current Week

The "This Week" badge shows points earned since the last reset.

Students compete fresh each week for the weekly leaderboard!

## Future: Automatic Reset

To automate this, you could set up a Vercel Cron Job:

1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/admin/reset-weekly-points",
    "schedule": "0 0 * * 2"
  }]
}
```

This would run every Tuesday at midnight UTC.

**Note:** You'd need to modify the API route to accept cron authentication instead of requiring teacher login.
