---
name: monday-slides
description: Make the weekly class slideshow images - "Top Learners" (top 6 by points) and "Practice Stars" (top 5 students by days of home practice logged) - for last week or a given week. Use when asked for the Monday slides, the weekly slides, the top students / top learners image, the leaderboard slide, or a practice log / practice stars slide.
---

# Monday slides

Two 1920x1080 PNGs for the class slideshow, built by read-only scripts in `scripts/slides/`:

- `week<N>-top-learners.png`: top 6 by points from the ledger (same as the app leaderboard, test accounts excluded).
- `week<N>-practice-stars.png`: the top 5 students by days of practice logged that Mon–Sun week (ties: more logs first), with the app's dots, kind icons, and "Goal done!" chip. Marlana wants the top 5 loggers, not only students who reached 3 days or their goal.

## Steps

1. Run both slides at once. With no `--week`, they cover last week (right on a Monday).
   ```
   npm run -s slides:monday
   ```
   For a specific teaching week: `npm run -s slides:monday -- --week 8`. Other flags: `--class FY27`, `--top 5` / `--min 1` (practice stars only: how many students, fewest days to appear).
   If Playwright says the browser is missing, run `npx playwright install chromium` and try again.
2. Read both PNGs from `~/Downloads/` and check them: no names cut off, rows fit on the slide, no test accounts.
3. Reply with both full file paths and a short list: the top 6 with points, and each practice star with days / goal. Also name anyone just below the top 5 so Marlana can encourage them out loud.

## Notes

- Both scripts only read the database. They load the live DB from the git-ignored `.env.production-db` (via `scripts/lib/use-live-db.ts`); local `.env` points at the `prisma dev` database.
- Don't put student sentences on the slides. Learners would see each other's mistakes on the big screen.
- If the app's practice card or leaderboard changes (labels, colors, icons), update the slide scripts so they match. Learners notice any difference.
