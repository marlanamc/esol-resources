---
name: monday-slides
description: Make the weekly class slideshow images - "Top Learners" (top 6 by points) and "Practice Stars" (students who logged home practice on 3+ days) - for last week or a given week. Use when asked for the Monday slides, the weekly slides, the top students / top learners image, the leaderboard slide, or a practice log / practice stars slide.
---

# Monday slides

Two 1920x1080 PNGs for the class slideshow, built by read-only scripts in `scripts/slides/`:

- `week<N>-top-learners.png`: top 6 by points from the ledger (same as the app leaderboard, test accounts excluded).
- `week<N>-practice-stars.png`: students with practice logged on 3+ days that Mon–Sun week, with the app's dots, kind icons, and "Goal done!" chip.

## Steps

1. Run both slides at once. With no `--week`, they cover last week (right on a Monday).
   ```
   npm run -s slides:monday
   ```
   For a specific teaching week: `npm run -s slides:monday -- --week 8`. Other flags: `--class FY27`, `--min 2` (practice stars only; use a lower bar if few students reached 3 days).
   If Playwright says the browser is missing, run `npx playwright install chromium` and try again.
2. Read both PNGs from `~/Downloads/` and check them: no names cut off, rows fit on the slide, no test accounts.
3. Reply with both full file paths and a short list: the top 6 with points, and each practice star with days / goal. Also name anyone who just missed (like 1–2 practice days) so Marlana can encourage them out loud.

## Notes

- Both scripts only read the database. That matters because `.env` points at production.
- If the practice stars script says nobody logged 3+ days, offer `--min 2` rather than leaving the slide out.
- Don't put student sentences on the slides. Learners would see each other's mistakes on the big screen.
- If the app's practice card or leaderboard changes (labels, colors, icons), update the slide scripts so they match. Learners notice any difference.
