# ESOL Arrival Warm-Up Generator

Generate a quick "do this the moment you sit down" warm-up. This is NOT the
same as `/warmup` (that's the fuller 15-20 minute Part A/B/C lesson warmup).
This one is a short, silent, heads-down task (5-10 min) students start on
their own while the teacher takes attendance — typically 2 short tasks,
e.g. a fill-in-the-blank exercise and a find-the-errors dialogue.

**Every arrival warmup produces TWO HTML files from the same content:**
1. **Print** — 2 identical copies side by side on one landscape sheet, cut
   down the middle, so one printout = two students' worth of paper.
2. **Classroom** — 1 copy, portrait, full page, for assigning digitally
   (Google Classroom) or printing single copies. More generous spacing
   since it isn't sharing a sheet with a second copy.

Both share the same content and section markup; only the outer layout
(two-up landscape vs. single-copy portrait) and type scale differ.

## When to Use

Use `/arrival-warmup` when:
- The user says "make an arrival warmup" / "day warmup" / "start when you
  arrive" worksheet for a specific day/topic
- Converting one of the old one-off `tmp/pdfs/build-*.py` reportlab scripts
  to the standard HTML format

## Keep It Varied — Don't Let Students Get Bored

Students see one of these every class. If the task shapes repeat too
often, it stops being "fun and interesting" and becomes a worn drill.
Before building a new day's warmup:

- **Check what the last few days used** (open the neighboring files in
  `print/` or `classroom/`) and deliberately pick a *different* pair of
  task shapes. Formats already used as of Week 4: matching-grid (Wk1D1),
  open sentence-completion (Wk1D1), fill-in-the-blank with word bank
  (Wk1D2), find-the-errors dialogue (Wk1D2), letter-scramble (Wk2D1),
  sort-into-3-boxes (Wk2D1, Wk4D2), riddles ("What word am I?", Wk3D1),
  true-or-false (Wk3D1), word-order/sentence-unscramble (Wk3D2), be/have
  fill-in-the-blank (Wk3D2), word search grid (Wk4D1), would-you-rather
  with a reason (Wk4D1), sentence-sequencing/story-ordering (Wk4D2).
  Still unused and available: two-truths-and-a-lie, mini crossword,
  picture-free "odd one out," dictation, partner-interview prompts.
- **Tie the format to what's pedagogically live that week when possible**
  — e.g. a parts-of-speech week suggests a sort/categorize task; a verb-
  tense week suggests an error-hunt or transformation task. This makes
  the warmup feel like a preview/rehearsal of the week's real lesson
  instead of a generic drill, which is more engaging on its own.
- **Add a short "Bonus round"** for fast finishers when the two main
  tasks don't fill the page — a one- or two-line writing prompt using
  today's words (see template). This both uses leftover space
  purposefully (see the layout note below) and keeps quick finishers
  engaged instead of sitting idle.
- Keep the tone light — footer lines, subtitles, and task names can have
  personality ("Word Detective Challenge", "Crack the code") as long as
  they're still plain black text.

## Hard Requirements

- **Black and white only.** No color anywhere (text, borders, backgrounds).
  This prints cheaply and photocopies cleanly.
- **Two-up landscape, cut in half.** One printed sheet = two identical
  student copies, divided by a dashed vertical cut line. This halves paper
  cost — never break this layout.
- **Font: Atkinson Hyperlegible** (via Google Fonts), falling back to
  Arial/Helvetica. It's designed for readability at small sizes, which
  matters since two copies share one landscape sheet.
- **Let CSS flow decide spacing — never hand-place content with fixed
  pixel/point coordinates.** A hardcoded coordinate layout (the old
  reportlab approach) produces dead gaps wherever content is shorter than
  the space reserved for it, and cramped spacing wherever it's longer.
  Flexbox/normal document flow avoids both failure modes for free.
- **Any single fixed-height container is a bug**, except pinning the
  closing "Finished? ..." line to the bottom of the page via
  `margin-top: auto` inside a full-height flex column — that's the ONE
  place leftover space is allowed to collect, so it never appears as a
  surprise gap in the middle of the page.
- **Give real room to write** wherever the task requires it:
  - Fill-in-the-blank: the blank line itself is the writing space.
  - Find-the-errors: students must write a correction *above* the flawed
    word, so each dialogue line needs visible margin-top (roughly 12px in
    the print two-up, ~17px in the roomier classroom single-copy) — not
    just line-height between lines of body text.
- **Budget for one page.** At the sizes/margins in the template below, a
  6-item fill-in-the-blank task plus a 9-line dialogue just fits one
  landscape half-sheet. If a topic needs more items, either trim the
  other task or shrink the base font-size slightly (don't blow past one
  page — check the rendered page count, not just how it looks on screen).
- **When a page is close but still overflows after a margin trim that
  should have been enough, measure instead of guessing.** Render with
  Playwright and read `document.querySelector('.copy').scrollHeight` via
  `page.evaluate()`, then compare it to the actual page budget: portrait
  Letter is 11in × 96dpi = 1056px tall; the print two-up's `min-height`
  (usually 8.1in) × 96dpi is its budget. A page that's only ~10-20px over
  can look identical across several "should have fixed it" edits — at
  that point a small `line-height` reduction (e.g. 1.5 → 1.42) closes the
  gap faster than chasing individual margins one at a time.
- **Vary spacing by relationship, not uniformly.** The gap between two
  sections (`.task` margin-bottom) must be visibly larger than the gap
  between items inside a list or dialogue — if every margin on the page
  is within a couple px of every other one, sections stop reading as
  distinct groups. When trimming margins to fit one page, trim the
  tight/related-item gaps first and preserve the bigger section-level gap.

## Content Guidelines

- **Word banks / answer lists must be scrambled**, never left in the same
  order as the sentences/items they answer. Pick a derangement (no word in
  its own answer slot) — don't just alphabetize, since that can coincide
  with the answer order for one or more words.
- **Don't force manual line breaks in sentences.** Write each sentence as
  one continuous string and let the browser wrap it — this uses the full
  column width instead of an arbitrarily short second line.
- **Always include a one-line worked example** for any task whose
  annotation convention (circling, carets, etc.) isn't self-evident from
  the instruction line alone.
- 5-9 items per task is typical; keep total content short enough to fit
  one half-sheet without shrinking type below ~10px.
- **Task-specific markup is expected to change task to task** — e.g. a
  word-scramble list, a 3-column sort-into-boxes grid, or a dialogue
  block are all fine as their own CSS classes (see the Week 2 Day 1
  files for a scramble-list + sort-boxes example). Reuse `.word-bank`
  for any bordered word-pool box, `.blank` for any inline write-in line,
  and a `.bonus-line` (a bare `border-bottom` rule, no fixed width) for
  bonus/writing-prompt lines — don't reinvent those three.
- **Word search grids** (see Week 4 Day 1): build as an HTML `<table>`
  with one letter per `<td>`, monospace font, fixed cell width/height.
  Place the target words first (across or down), then fill every
  remaining cell with a plausible-looking filler letter — after placing
  words, re-read each filler row/column and confirm it doesn't
  accidentally spell another real word. Keep a plain-text word list
  below the grid.
- **Sequencing tasks** (see Week 4 Day 2): give a short blank *before*
  each lettered item (a narrow `.seq-blank`-style modifier of `.blank`,
  ~1.6-1.8em wide) for students to write the order number, and shuffle
  the displayed lettered order so it's a genuine derangement against the
  correct 1-N sequence (no letter's display position equals its correct
  number).

## Input Sources

- Ask the user for the day's topic/sentences if not provided, or adapt
  from an existing `tmp/pdfs/build-*.py` script being converted.

## Output Format & Naming

Current-year warmups live under a fiscal/school-year folder, e.g. `FY27`
(check the repo root for the current one — a new year starts a new
top-level `FY[YY]/` folder). Save both variants there, same filename in
each subfolder (the folder name is what tells them apart, so the filename
doesn't need to repeat "print"/"classroom" or the year):

```
FY27/worksheets/warmups/print/week[N]-day[M]-[YYYY-MM-DD].html
FY27/worksheets/warmups/classroom/week[N]-day[M]-[YYYY-MM-DD].html
```

If the warmup isn't tied to a specific course week/day, fall back to
`[topic]-[YYYY-MM-DD].html`.

**Filename vs. on-page title:** the filename uses `day[M]` (stable,
sortable). The on-page `<h1>` uses the actual weekday name instead —
`Warm-Up: Week [N], [Weekday]` — since this class meets Tuesday/Thursday,
so Day 1 = Tuesday and Day 2 = Thursday. Work out the weekday from the
date, don't hardcode the Day-1/Day-2 mapping if the class schedule ever
changes.

**Archiving a school year:** when a new school year starts, move the
entire previous year's folder wholesale, e.g. `git mv FY26 archive/FY26`
or just leave last year's `FY26/` folder in place and start a fresh
`FY27/` — don't mix years' content inside one folder tree.

## HTML Template — Print (two-up landscape)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>[TOPIC] Arrival Warm-Up</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    font-size: 14px;
    line-height: 1.4;
  }

  .page {
    display: flex;
    width: 100%;
  }

  .copy {
    width: 50%;
    height: 100vh;
    padding: 0.3in 0.35in;
    display: flex;
    flex-direction: column;
  }

  .copy:first-child {
    border-right: 1.5px dashed #000;
  }

  /* Type scale: 22 / 18 / 14 / 11 — each step ~1.25x the next. Don't let
     sizes cluster within a point of each other (that reads as flat/no
     hierarchy) — h1, task-title, body text, and small print should each
     look like a distinct tier at a glance. */
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid #000;
    padding-bottom: 5px;
    margin-bottom: 8px;
  }

  h1 {
    font-size: 22px;
  }

  .date {
    font-size: 11px;
    font-weight: normal;
    white-space: nowrap;
  }

  .subtitle {
    font-size: 11px;
    margin-bottom: 10px;
  }

  /* Section-level gap (.task) is deliberately much larger than the tight,
     related-item gaps below (list items, dialogue lines) — otherwise
     every gap on the page reads as the same uniform rhythm and sections
     stop feeling like distinct groups. */
  .task { margin-bottom: 17px; }

  .task-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .task-instructions {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .task-example {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .word-bank {
    border: 1px solid #000;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    padding: 5px 10px;
    margin-bottom: 7px;
    letter-spacing: 0.3px;
  }

  .fill-blank-list { list-style: none; }
  .fill-blank-list li {
    margin-bottom: 6px;
    font-size: 14px;
  }
  .fill-blank-list li b { margin-right: 6px; }

  .blank {
    display: inline-block;
    border-bottom: 1.5px solid #000;
    width: 5.5em;
    margin: 0 2px;
  }

  .dialogue p {
    margin-top: 12px;
    font-size: 14px;
  }
  .dialogue p:first-child { margin-top: 0; }
  .dialogue .speaker { font-weight: bold; margin-right: 6px; }

  .footer-note {
    margin-top: auto;
    padding-top: 8px;
    font-size: 11px;
  }

  @media print {
    @page { size: letter landscape; margin: 0; }
    body { background: #fff; }
    /* 8.1in, not the full 8.5in page height: leaves a small safety margin
       for real printers' unprintable edge, while still pinning the
       footer close to the bottom via margin-top: auto instead of
       stranding it mid-page with a big empty band below it. */
    .copy { height: auto; min-height: 8.1in; }
  }
</style>
</head>
<body>
  <div class="page">
    <!-- Duplicate this .copy block a second time, identical content, for the two-up cut layout -->
    <div class="copy">
      <div class="header-row">
        <h1>Warm-Up: Week [N], [Weekday]</h1>
        <span class="date">[M/D/YY]</span>
      </div>
      <div class="subtitle">[optional one-line context]</div>

      <section class="task">
        <div class="task-title">1&ensp;Complete the sentences</div>
        <p class="task-instructions">Use every word once. Change the verb form if needed.</p>
        <div class="word-bank">[word2] &middot; [word5] &middot; [word6] &middot; [word1] &middot; [word4] &middot; [word3]</div>
        <ol class="fill-blank-list">
          <li><b>1.</b> [Full sentence with a <span class="blank"></span> in place of the missing word].</li>
          <!-- Repeat for 5-9 items. Write each as ONE string; do not pre-split lines. -->
        </ol>
      </section>

      <section class="task">
        <div class="task-title">2&ensp;Find the errors</div>
        <p class="task-instructions">Find [N] errors. Circle wrong words; use ^ for a missing helping verb.</p>
        <p class="task-example"><b>Example:</b> She go to work early. &rarr; circle "go" and write "goes" above it.</p>
        <div class="dialogue">
          <p><span class="speaker">[Name]:</span> [line]</p>
          <!-- Repeat for each dialogue turn -->
        </div>
      </section>

      <p class="footer-note">Finished? [next instruction, e.g. rewrite corrected lines in your notebook].</p>
    </div>
  </div>
</body>
</html>
```

## HTML Template — Classroom (single copy, portrait)

Same section markup as the print template, dropped into a single-column
portrait page with a larger type scale (no need to conserve half a
landscape sheet). Key CSS differences from the print template above:

```css
body {
  font-family: "Atkinson Hyperlegible", Arial, Helvetica, sans-serif;
  color: #000;
  background: #fff;
  font-size: 17px;
  line-height: 1.5;
}

.copy {
  max-width: 7.5in;
  margin: 0 auto;
  padding: 0.6in 0.5in;
  /* no border-right, no height: 100vh / flex column — footer just flows */
}

/* Type scale: 28 / 22 / 17 / 13 — each step >=1.25x the next, checked at
   the smallest gap too (17/13 = 1.31, not just the bigger gaps above it).
   Don't let sizes cluster close enough to blur into one tier. */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px solid #000;
  padding-bottom: 7px;
  margin-bottom: 16px;
}
h1 { font-size: 28px; }
.date { font-size: 13px; font-weight: normal; white-space: nowrap; }
.task { margin-bottom: 18px; }
.task-title { font-size: 22px; margin-bottom: 8px; }
.task-instructions { font-size: 13px; margin-bottom: 10px; }
.task-example { font-size: 13px; margin-bottom: 10px; }
.word-bank { font-size: 17px; padding: 8px 12px; margin-bottom: 14px; }
.fill-blank-list li { font-size: 17px; margin-bottom: 12px; }
.dialogue p { font-size: 17px; margin-top: 17px; }
.footer-note { margin-top: 18px; font-size: 13px; font-style: italic; }

@media print {
  @page { size: letter portrait; margin: 0; }
  body { background: #fff; }
}
```

Body markup is just one `.copy` block (no duplicate, no `.page` wrapper,
no dashed divider) — the same `<section class="task">...</section>` and
`<div class="dialogue">...</div>` content as the print version, pasted once.

## Verification

After generating both files:
1. Open each file directly in a browser (or via a headless screenshot).
2. Print preview (Cmd+P) each — the print variant should be exactly one
   landscape page with the dashed cut line centered and both copies
   identical; the classroom variant should be one portrait page.
3. Confirm there's no large dead gap between sections in either — if
   there is, it means a fixed height/coordinate crept in; switch that
   spot back to natural flow.
4. Confirm the find-the-errors lines have visible room above them to
   write a correction, in both variants.
