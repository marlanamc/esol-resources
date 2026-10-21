---
name: phrase-bank-worksheet
description: Build a two-sided printable phrase-bank worksheet for one grammar point - front is a visual "where does it go" rule key plus a phrase bank sorted by everyday topics, back is sentence starters with a detail, a partner interview, and a self-check. Use when asked for a phrase bank worksheet, sentence-starter worksheet, "a worksheet like the adverbs of frequency one", or a confidence-building writing/speaking handout for a grammar point or course week.
---

# Phrase bank worksheet

Usage: `/phrase-bank-worksheet <grammar point or week number>`
(e.g. `/phrase-bank-worksheet have you ever`, `/phrase-bank-worksheet 9`).

## Why this format works

The adverbs-of-frequency worksheet (Oct 2026) was a big hit. Students who
lack confidence speaking felt empowered because they never face a blank
line alone: the phrase bank gives them the words, the rule key shows where
the words go, and the sentence starters give them the first few words.
Keep that promise on every worksheet. Every writing line on the back should
be answerable using only the front page.

**Reference implementation:** `FY27/worksheets/group-handouts/adverbs-of-frequency.html`.
Copy its `<style>` block and page structure exactly. Change only the content.

## Steps

1. **Find the grammar point.** If given a week number, read that week in
   `src/lib/course-map-data.ts` (title, goal, grammar items) and the matching
   guide in `src/content/grammar/<slug>.ts`. Use the guide's terms and
   examples so the worksheet matches what students saw in the app. Check
   `course-fit.md` in this folder for the angle already planned for that week.
2. **Tell Marlana the plan before building it.** Keep it short: the target
   forms (the "scale" row), the 3-5 rules for the key, the phrase bank
   categories, and the back-page tasks. Wait for an OK or changes.
3. **Build the HTML** at `FY27/worksheets/group-handouts/<slug>.html`.
4. **Render and check the fit** (see below). Fix any overflow, then export the PDF.
5. **Report** both file paths and anything you guessed (local references,
   percentages, unusual vocabulary).

## Page layout

**Front (keep it; it's the reference page)**
1. **Name / Date row + title.** The title is a question or plain label
   (e.g. "Have You Ever...?"), with the italic note "Keep this page. Use it
   to write on the back."
2. **The forms at a glance.** One row of 4-6 cells showing the target forms
   side by side. Use whatever shape fits the grammar point: a scale (always to
   never), a pair (have to / don't have to / can't), a timeline (for / since),
   or a verb chart (base / V3).
3. **Where does it go? (the rule key).** 3-5 rule boxes in a 2-column grid.
   Each box has:
   - a rule name in plain words ("Most verbs: BEFORE the verb")
   - a formula made of word boxes (`.chip`), with the target word in a black
     chip (`.chip.adv`)
   - one more example with the target word bold and underlined
   - one crossed-out common mistake (`&#10007; <s>...</s>`). Pick mistakes
     these learners really make (many speak Spanish, Portuguese, or Haitian
     Creole): word order, a missing -s, a doubled negative, "to" after a modal.
   - End with a full-width "Remember:" strip on one line.
4. **Phrase bank.** 35-50 phrases in a 4-column flowing list (`column-count: 4`,
   `.cat { break-inside: avoid }`), sorted into 6-9 everyday topics (food,
   home, getting around, health, learning, phone & free time, people,
   work...). Bend the topics toward the week's theme (housing, work, health)
   but keep some daily-life ones so everyone has something true to say.
   Write the phrases in the form students will copy (base verb, past
   participle, etc.). Use a dashed strip at the bottom for a second, smaller
   bank (e.g. adjectives for am/is/are).

**Back (write, then talk)**
4. **One sentence per form.** The target form is printed on the left
   (`.write-row .adv`), with a fill line. The first row is an italic example.
   Ask students to add a detail: when? where? or because... Put detail ideas
   in a small hint line underneath.
5. **Two more.** 2-3 starter rows that practice the trickier rules from the key.
6. **Ask a partner.** A question frame ("How often do you...?", "Have you
   ever...?"), a 4-row table with the first question filled in, then 2 lines
   to write about the partner (third person, so they practice the he/she
   change).
- **Check strip** at the bottom (`margin-top: auto`): 3-4 checkboxes that
  match the rules on the key.

## Content rules

- Adult learners, mostly working parents in the Boston area. Use
  real, everyday situations and respect their experience. Nothing childish.
- The worksheet does NOT have to match the week's theme. Choose the
  situations where native speakers really use the grammar point every day.
  Most students can't vote, so don't build tasks that assume voting or
  citizenship.
- Name verb forms with Marlana's class terms, not tense names: **V1** (base),
  **V1-s** (he/she/it), **V2** (past), **V3** (past participle), **V-ing**.
  Write "If + V1, will + V1", not "If + present, will + verb".
- Language level: short sentences, high-frequency words. Explanations go in
  rule names, not paragraphs.
- No em dashes in learner-facing text. Use a colon, a comma, or a new sentence.
- Don't invent school facilities (say "computer class", not "computer lab").
  Local references (the T, Market Basket) are fine but name them in the report
  so Marlana can swap them.
- The type scale stays 22 / 18 / 14 / 11 and the page stays black and white.
  The impeccable design hook will flag these against the app's DESIGN.md.
  That's a known false positive for print worksheets, so leave them as they are.

## Render and check the fit

Each `.page` is exactly 8.5in x 11in with `overflow: hidden`, so overflowing
content gets cut off silently. Always check the PDF itself, not just a screenshot:

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd FY27/worksheets/group-handouts
"$CH" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf=<slug>.pdf <slug>.html
pdfinfo <slug>.pdf | grep Pages          # must be 2
pdftoppm -r 60 -png <slug>.pdf <scratchpad>/pg   # then Read pg-1.png and pg-2.png
```

`--virtual-time-budget` makes sure Atkinson Hyperlegible has loaded. Without
it, the fallback font is narrower, so the page looks like it fits when it
doesn't. Look for these problems:
- a box's bottom border is missing
- a phrase bank column wraps badly
- big empty space on the back (give `.write-row` more height for handwriting)

If the front overflows, cut in this order: shorten the "Remember:" strip to
one line, trim example glosses, tighten `.box` padding, and only then cut phrases.
