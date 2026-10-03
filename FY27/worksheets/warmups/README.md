# Arrival Warm-Ups (FY27)

Quick "start when you arrive" worksheets — a 5-10 minute silent task
students do on their own while attendance is taken. One per class day.

**To make a new one, use the `/arrival-warmup` skill** (don't hand-write
another HTML file from scratch — the skill knows the layout rules, the
type scale, the naming convention, and keeps task formats varied day to
day so it doesn't get repetitive). It's defined at
`.claude/skills/arrival-warmup.md`.

This is a different skill from `/warmup`, which builds the longer
15-20 minute lesson-style warmup — use that one instead if you want the
fuller Part A/B/C format.

## Folder structure

```
print/       2 identical copies side by side on one landscape sheet,
             cut down the middle — one printout = two students' worth
             of paper.
classroom/   1 copy, portrait, for Google Classroom or single-copy
             printing.
```

Every warmup produces one file in each folder, same filename:

```
print/week[N]-day[M]-[YYYY-MM-DD].html
classroom/week[N]-day[M]-[YYYY-MM-DD].html
```

`day[M]` is Day 1 or Day 2 of that week (this class meets Tuesday/
Thursday). The on-page title spells out the actual weekday instead
("Warm-Up: Week 1, Tuesday"), not "Day 1".

## Accessibility: font size floor

Some students (elderly, low-vision) struggle to read small print. The
type scale in `.claude/skills/arrival-warmup.md` is an accessibility
**floor**, not a style choice — never generate or hand-edit a warmup
below it:

```
classroom: 30 / 24 / 19 / 15  (h1 / task-title / body / small print)
print:     24 / 20 / 16 / 12
```

If a page runs long, trim spacing (margins, line-height) before
shrinking any font-size below this floor — see "Hard Requirements" in
the skill file for how to trim safely without losing the write-in room
students need (e.g. the margin above a find-the-errors dialogue line).

## When a new school year starts

Move this whole `FY27` folder aside (e.g. `git mv FY27 FY28` for the new
year, or archive `FY27` and start fresh) rather than mixing years'
content together — see the skill file for details.
