---
name: guide-rewrite
description: Rewrite a weekly grammar guide in src/content/grammar/*.ts to the "fewer dialogues" pattern - keep 1-2 strong dialogues, give every other page one visual (bar chart, schedule, checklist, or a short fact-checked reading about a real person), and rewrite the exercises so learners must read the visual. Use when asked to rewrite, convert, de-dialogue, or roll out the new pattern to a grammar guide, mini-guide, or weekly guide.
---

# Grammar guide rewrite: fewer dialogues, more to look at

Marlana's rule (Oct 2026, after 5 weeks of the short guides): a dialogue on every
page is too many. Each guide keeps **1-2 strong dialogues**. Every other page gets
**one thing worth looking at** in place of the photo + chat.

Reference implementation: `src/content/grammar/your-week-in-english.ts` (Week 6,
PR #103). Read it before starting, because it is the model for every page.

Usage: `/guide-rewrite <slug>` or a week number. With no argument, take the next
unconverted guide in course-map order (see "Finding the next guide").

## Step 1: Read the guide and plan the pages (no edits yet)

1. Read the whole guide file and its `src/data/<slug>-images.generated.ts`.
2. List each section: grammar point, scene, dialogue speakers, story beat.
3. Pick the **1-2 dialogues to keep**. Prefer the ones that carry the story,
   usually the first page (sets up the problem) and the last (pays it off). A
   kept dialogue keeps its `sceneCard` photo.
4. For every other page, pick **one visual** that fits its grammar point:

| Grammar point | Good visual |
|---|---|
| frequency, quantity, comparatives, superlatives | `frequencyBar` (any 0-100 scale works) |
| routines, schedules, time expressions, prepositions of time | `scheduleChart` |
| present perfect, already/yet, to-dos | `checklist` |
| imperatives, directions, instructions, signs, app alerts | `stepsCard` |
| past simple, used to, any tense with a real-life story | `readingCard` about a real person |
| comparison of two options | `<table>` with gc-table classes (see existing guides) |

   Mix the visual types. Don't put three bar charts in one guide.
5. Plan how the story stays connected once the cut dialogues are gone. A
   visual can carry a story beat: in the pilot, Rosa's checklist shows "Delete
   the fake toll text ✅", which sets up page 5.
6. **Show Marlana the page plan as a short table and wait for an OK** before
   writing. She chooses the famous person. Offer 2-3 options with one line each
   and a recommendation. Favor people tied to the month or the unit theme (for
   example Hispanic Heritage Month, Black History Month, women in science), and
   people adult immigrant learners can relate to.
   **Never repeat a person.** Before offering anyone, check they aren't
   already in another guide (see "No repeats" below), and don't offer them
   if they are.

## Step 2: Write the pages

Import from the shared helpers. Don't copy them into the guide:

```ts
import { checklist, frequencyBar, readingCard, scheduleChart, stepsCard } from "@/content/grammar/_shared/guide-visuals";
```

The helpers live in `src/content/grammar/_shared/guide-visuals.ts`. If a new
visual type is needed, add it there and follow the same rules: only `gc-*`
classes carry color, neutral surfaces are translucent black/grey, there is
**no SVG** (the sanitizer in `src/utils/sanitize.ts` strips it), and
wide content scrolls inside its own box (`overflow-x: auto`).

On each converted page:
- Remove the `sceneCard(...)` and `dialogue([...])`. The visual replaces both.
- Add a one-line lead-in `<p>` that says what the learner is looking at and
  links it to the story ("It's Friday afternoon. Rosa looks at her to-do list...").
- Keep the grammar teaching boxes (callouts, form tables, "Watch out").
- Put the target grammar in the visual in `<strong>`.
- No em dashes in learner-facing text.

### Tables and charts must fit a phone

Marlana likes the tables, so keep using them. But most learners use a phone,
and in Week 6 Rosa's schedule cut off after Thursday on mobile. The Clean
(Sat) and Family (Sun) rows looked empty, and nothing showed that the table
scrolls sideways. A learner can't answer "When does Rosa clean?" from a
column they can't see.

Plan for a content width of about **300px (~19rem)**:
- **No `min-width` over ~19rem** on a table or grid. `scheduleChart` used
  to have `min-width: 30rem` and always scrolled on a phone. It now puts each
  activity's label on its own line, so 7 days fit. Keep its cell text to 5
  characters or fewer.
- **5 columns at most** (including the label column) for a table that has to
  fit with no scrolling. For a 7-day week, switch to a phone-friendly shape:
  only the days that matter, day rows × activity columns (flip the table),
  short headers ("M T W T F S S"), or one row per activity listing its days.
- **Exercises must not depend on hidden content.** If a question needs a
  weekend cell, that cell has to show without scrolling.
- If a table really has to scroll, label it ("Swipe → to see the weekend")
  and make sure no exercise needs the hidden part.
- Keep `white-space: nowrap` for short labels only, and keep the label column
  narrow (emoji + 1 word).
- Don't use text smaller than 11px (`0.7rem`) except the uppercase kicker.

### Readings about real people
- About 80-120 words in 2 short paragraphs, at learner level, using this
  week's grammar.
- **Fact-check every claim against a primary source** (NASA, Smithsonian,
  Library of Congress, the person's official bio, Britannica). Use WebFetch.
  **Cut any claim you can't find on the page**, even if you "know" it.
- Cite every source in the `sources` array.

### Every reading gets a photo of the person
- Find one on Wikimedia Commons with a **public-domain, CC BY or CC BY-SA**
  license. Check the license with the Commons API, not the search page:
  `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&format=json&titles=File:<name>`
  (look at `LicenseShortName` and `Artist`). Official US government
  portraits are public domain. A photo that shows the story (Escalante at
  his chalkboard) beats a plain headshot.
- The site's CSP (`img-src` in `src/proxy.ts`) blocks Wikimedia, so **don't
  hotlink**. Download it to `public/images/guide-people/<first-last>.jpg`,
  shrink it (`sips --resampleWidth 600 -s formatOptions 75 <file>`), and
  commit it with the guide.
- Pass it to `readingCard`:
  ```ts
  photo: {
    url: "/images/guide-people/jaime-escalante.jpg",
    alt: "Jaime Escalante points at math on a chalkboard in his classroom, 1983",
    credit: "Los Angeles Times, 1983, CC BY 4.0",   // short: author or agency, year, license
    creditUrl: "https://commons.wikimedia.org/wiki/File:...", // the Commons file page
  },
  ```
  The credit renders as a link to `creditUrl`, so keep `credit` short.
- Look at the photo with the Read tool. The card crops it to 260px tall
  from the top, so the face must be in the top part.
- `audit:guide-mobile` renders without a server, so the local image shows as
  broken in its screenshots. That's expected. Check the photo itself instead.

### No repeats
A real person, and a photo, appear in only one guide. Before choosing:
```bash
grep -l "<Last name>" src/content/grammar/*.ts   # want no hits
ls public/images/guide-people/                     # photo not already there
```

## Step 3: Rewrite the exercises

- Every exercise on a converted page that pointed at a deleted dialogue must
  change. Search the file for each removed speaker's name, including in the
  `miniQuiz` and `tipBox`.
- Add at least one question per visual that **can only be answered by reading
  it**: "Look at Rosa's week. Which sentence is true?", "Look at the checklist.
  What has Rosa already done?". Combine the visual with the grammar in a
  single item where you can.
- Don't make answers that copy the reading or visual word for word. The
  `answer-recycled-from-explanation-text` rule **fails CI**. Comprehension
  answers should be a number, a choice, or a sentence the learner builds.
  Word-scrambles should be new sentences.
- Text items use `expectedAnswers: [...]` (an array). Radio items use
  `expectedAnswer`.
- Keep the mini-quiz at exactly 5 questions.
- Check for repeated items. The pilot had the same question as a radio item
  and a text item.

## Step 4: Watch for these CI traps

- `american-name-missing` **fails CI**. It scans *all* guide text for a name from
  `AMERICAN_NAMES` in `src/lib/grammar-guide-audit/config.ts`. Cutting a
  dialogue can remove the guide's only one. Fix it by naming a helper in a
  lead-in line (the pilot used "Jessica at the tech help desk").
- Speakers in the kept dialogues still need 2+ distinct names and mixed avatar
  skin tones.
- Leave unused entries in `<slug>-images.generated.ts` alone, because the swap
  script references them.

## Step 5: Verify

```bash
npx tsc --noEmit -p .
npx eslint src/content/grammar/<slug>.ts src/content/grammar/_shared/guide-visuals.ts
npx vitest run mini-guides grammar
npm run audit:mini-guides 2>&1 | grep <slug>
npm run audit:grammar-dark-mode -- --static-only --slug <slug>   # want 0 uncovered
npm run audit:scene-images
npm run audit:guide-mobile -- <slug>   # phone fit at 375px/320px + dark mode, want no ✗
```

`audit:guide-mobile` renders each section's explanation in headless Chromium
at phone widths. It doesn't need a dev server or the database. It exits 1 on:
- `hidden-in-scroll`: a scroll box hides content, and it lists the text that's
  hidden (e.g. `Sat | Sun | house | call`)
- `page-overflow`: the whole page scrolls sideways
- `spills-out`: something pokes past the screen edge

`tiny-text` lines (`!`) are warnings. Fix any ✗, re-run, then **look at the
screenshots** for every page with a visual
(`output/guide-mobile-fit/<slug>/375-<section>.png`). Use the Read tool. A
table can pass and still look cramped or leave rows looking empty. The
wrapper only approximates the reader's gutters, so Marlana's phone check
still counts.

### Dark mode

`audit:guide-mobile` also runs a **dark-mode pass** at the first width. It
loads the reader's real CSS from `globals.css` with `<html class="dark">` and
fails on:
- `dark-contrast`: text under 4.5:1 (3:1 for large/bold text) against what is
  really behind it, after opacity and translucent backgrounds
- `dark-light-box`: a light surface behind text left over in dark mode

Then **look at every `dark-375-<section>.png`** too. The static
`audit:grammar-dark-mode` only checks that inline styles have an override.
It passed Week 6 while the schedule headers were breaking ("Mo / n").

Rules that keep dark mode working:
- Only `gc-*` classes carry color. Inline colors are translucent neutrals only
  (`rgba(0,0,0,x)`, `rgba(128,128,128,x)`).
- In dark mode, `gc-bg-{terracotta,sage,amber}-alpha` all become the **same
  navy**. Never let background color alone carry meaning; label it.
- Don't put `gc-bg-blue-alpha` and `gc-text-blue` on one element. The bg rule
  wins in dark and the text turns plain. `stepsCard` defaults to blue, so pass
  another `accent` when the badge color matters.
- The reader's phone CSS forces `padding: 0.5rem 0.6rem !important` and
  `overflow-wrap: anywhere` on every `th`/`td`. A narrow column needs its own
  `padding: ... !important` (see `scheduleChart`).
- **Never run `audit:grammar-dark-mode` without `--static-only`.** Rendered
  mode runs `scripts/e2e-seed.ts`, which upserts `e2e-teacher` /
  `e2e-student` with `password123` into whatever `DATABASE_URL` points at,
  and locally that's production.

`audit:scene-images` may fail on `phrasal-verbs-at-work#sceneWarehouseClockout`.
That was already failing before this rollout started. Only failures in *your*
slug are yours.

Then count what's left: `grep -c "dialogue(\[" src/content/grammar/<slug>.ts`
should be 1 or 2.

Every `readingCard` must have a `photo` whose file exists in
`public/images/guide-people/`, with a `credit` and `creditUrl`, and the
person must not appear in any other guide (see "No repeats").

Don't start a dev server to check the page: the local `.env` points at the
**production database**. Ask Marlana to look at it on her phone and on desktop.

## Step 6: Hand off

- Commit only the guide file (plus `guide-visuals.ts` if you changed it, and
  any new `public/images/guide-people/*.jpg`) on a
  branch from `origin/main`. Her working tree usually has unrelated
  uncommitted classroom files, so never use `git add -A`.
- Commit or push only when she asks.
- Summarize with a before/after table per page, the facts you cut because you
  couldn't verify them, the phone-fit result, and anything left for her eye.
- Then suggest running `/guide-review <slug>` as a student-eye check.

## Finding the next guide

Convert guides in course-map order, starting from the current week. To list them:

```bash
node -e 'const s=require("fs").readFileSync("src/lib/course-map-data.ts","utf8");const re=/"number": (\d+),\s*"title": "([^"]+)"|"href": "\/grammar-reader\/([^"?]+)"/g;let m,w;while(m=re.exec(s)){if(m[1])w=m[1];else console.log("W"+w, m[3]);}'
```

A guide counts as converted when it has 2 or fewer `dialogue([` calls.
Do 3-4 guides per session at most, because each one needs its own visuals and
fact-checking.
