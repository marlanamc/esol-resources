---
name: guide-review
description: Review a weekly grammar guide in src/content/grammar/*.ts the way a student would - teaching errors, questions that can be answered without knowing any English, mini-quiz coverage, and whether each scene photo actually shows what it claims to show. Use when asked to review, audit, check, proofread, or improve a grammar guide, a mini-guide, a weekly guide, or its scene images.
---

# Grammar guide review

A student walkthrough of one guide. Read it in order, do the exercises honestly,
look at the photos, and find the places where a student doing everything right
still gets something wrong.

Usage: `/guide-review <slug>` (e.g. `parts-of-speech`), or a week number, or a
file path. If none is given, ask which guide.

## What this skill is NOT for

The repo already has mechanical audits. Do not hand-check what a script checks:

| Script | Catches |
|---|---|
| `npm run audit:mini-guides -- --report` | the full rule set: mechanical, tone, characters, dialogue, images, holidays |
| `npm run audit:answer-integrity` | answers that appear verbatim in their own question stem |
| `npm run audit:mini-quiz-quality` | empty stems, duplicate options, <3 options, shared option prefixes |
| `npm run audit:answer-position` | answers clustering in the same slot (baseline-tracked) |
| `npm run audit:scene-images -- --list` | scene photos the caption/alt heuristic flags, not yet in the reviewed ledger |
| `npm run audit:grammar-dark-mode` | inline styles that break in dark mode |
| `npm run audit:mini-guide-images` | builds `tmp/mini-guides-audit/image-review.html`, a visual contact sheet |

**Run these first.** Fix or note what they report, then spend your attention on
everything below, which is what they cannot see.

Two gotchas:
- The audits take `--min-week`/`--max-week`, not a slug. Grep their output for
  your slug.
- Guides resolve from the course map (`src/lib/grammar-guide-audit/scope.ts`).
  An off-map guide must be listed in `EXTRA_AUDIT_SLUGS` or every audit silently
  skips it. If a guide reports zero findings, check that first.

## Step 1 - Read the whole guide before changing anything

Read the file top to bottom, in order, the way a learner meets it: scene photo,
intro paragraph, dialogue, explanation boxes, tip box, exercises, then the mini
quiz at the end. Answer each exercise in your head *before* looking at
`expectedAnswer`. The findings come from that gap - the times your honest answer
differed from the key, or the times you got it right without reading the sentence.

## Step 2 - The checks

Each of these has bitten a real guide. The examples are from the
`parts-of-speech` review.

### A. Teaching that is wrong, or contradicts the guide itself

- **Every example must actually be the thing it is labelled.** Test each one
  against the rule the guide itself states a few lines earlier.
  *Found:* "Carlos **speaks** Spanish" was listed under STATE VERBS, while the
  tip box taught "can you watch someone do it? then it's an action verb."
- **A bolded word must be the part of speech it is bolded as.** The usual
  offenders are prepositions bolded as adverbs (*after, before, during*) and
  noun phrases called adverbs (*every Tuesday*).
  *Found:* "He comes **after** his shift" taught `after` as an adverb. Fixed by
  teaching that a group of words can do an adverb's job, and bolding the phrase.
- **Do not let a simplification become a false statement.** "Works like an
  adverb" is honest; "is an adverb" is not.
- **Facts must agree across sections.** *Found:* the bulletin board said classes
  start Monday, then meet every Tuesday.
- **`stepNumber` must be sequential with no gaps or repeats** - it renders as
  "Part N". *Found:* Nouns had none and Adjectives repeated Part 2.
- **Characters must not appear once and vanish.** *Found:* the intro named
  James, the dialogue below labelled the same person "Volunteer", and the next
  section introduced Carlos as the volunteer.
  Before renaming anyone, check `AMERICAN_NAMES` in
  `src/lib/grammar-guide-audit/config.ts` - the audit requires each guide to
  contain one, and it may be the name you were about to delete.
  Named characters need a skin-toned avatar (`PLAIN_YELLOW_AVATARS` rule).

### B. Questions answerable without knowing any English

The biggest category, and invisible to every script.

- **Option labels must be symmetric.** If one option carries an explanation and
  the others are bare, the answer is readable from shape alone.
  *Found:* wrong answers read "Not correct. Should be: I know all the students."
  while the right answer was a bare "Not correct." Both options now carry
  parallel reasoning: "Correct - this verb can use the -ing form." /
  "Not correct - this verb cannot use the -ing form."
  This is already a house rule in `docs/ADD_EXERCISES_PROMPT.md`.
- **Instructions must not give the game away.** *Found:* "One word is in the
  wrong form" told the student the bold word is always wrong, so the answer was
  "pick the other one" - especially since every item in the exercise *was* wrong.
  Fixed by adding an already-correct item and rewording to "Sometimes the word
  in bold is already correct."
- **In a correct/incorrect exercise, mix in correct items.** All-wrong is a
  pattern, not a test.
- **Watch answer position within an exercise**, not just across the file.
- **Distractors must be plausible errors a learner actually makes** (missing
  auxiliary, wrong tense marker, wrong word order). A distractor from a
  different category is free elimination.
- **Every plausible answer should be an option.** If the sentence contains two
  adjectives and only one is offered, either trim the sentence or offer both.

### C. Items that test nothing

- **The answer is printed in the item.** *Found:* "Amara has a ___ job at a busy
  hospital. **(full-time)**" and "They need a ___ notebook. **(small)**".
  A parenthetical is fine when it names the *source* word for a transformation
  ("(Use the adverb form of 'neat'.)"), never when it is the answer itself.
- **The answer is copied from the paragraph directly above.** *Found:* the
  plural exercise asked for `class/classes` and `student/students`, the exact
  two pairs printed in the box above it. Changed to `notebook` and `box`, which
  makes the `-es` rule do some work.
- **The item reuses a sentence from earlier in the same exercise.**
- Replace a dead item with a gap in coverage rather than deleting it - something
  the guide teaches but never tests.

### D. Word scrambles with more than one right answer

Before accepting a scramble, try to build a **second** grammatical sentence from
the same tiles. If one exists, the student can be right and be marked wrong.

Reliable sources of a second answer:
- subject/object swaps: *Amara sees Carlos* / *Carlos sees Amara*
- coordinated names: *Yemi and Linh* / *Linh and Yemi*
- symmetric relations: *The closet is behind the door* / *The door is behind the closet*

Subject-verb agreement often blocks a swap (*Carlos helps new students* cannot
reverse, because *new students helps* is ungrammatical) - check, don't assume.

Fix by adding the alternate to `correctAnswers: string[]` (supported by both the
exercise and mini-quiz scramble types and by the grader). Only rewrite the tiles
if the alternate sentence is something you would not want a student to produce.

### E. Mini-quiz coverage

- **Map every question to a section.** A section with a lot of teaching and no
  question is the finding. *Found:* verbs was the longest section in the guide
  and had zero questions, while two of five questions tested the same trap.
- **Nothing may be tested that is not taught.** *Found:* `hardly` was tested
  twice and never appears in any explanation. Either teach it or drop it - the
  fix was a short "hard and hardly" box, since the error is worth teaching.
- **Do not test the same trap twice** in a short quiz.
- **The explanation must not restate the answer**, and the stem must not hand
  over the form being tested.
- Aim for a difficulty ramp and an `id` per question; gaps in the id sequence
  (`q1, q3, q9`) usually mean questions were deleted and coverage drifted.

## Step 3 - Look at every scene photo

This is the part no script can do, and the part most likely to be wrong.

**The alt text is not the photo.** Alt text is written from the author's
*intent*, so a guide can carry a perfect description of the scene it wanted
beside a photo of something else entirely. The heuristic in
`rules-image-context.ts` compares the caption to the alt - two strings written
from the same intent - so a wrong photo with well-written alt text is
structurally invisible to it. The only way to catch it is to look.

*Found in `parts-of-speech`:* `sceneFormTable`'s alt reads "Community center
desk where a volunteer helps a resident fill out a registration form" and its
caption reads "Community center. Amara fills out the form." - a perfect
heuristic match. The photo is a market stall.

Procedure, for each scene in the guide:

1. **Collect the scenes.**
   ```bash
   grep -n 'sceneCard(' src/content/grammar/<slug>.ts     # sceneId + caption
   cat src/data/<slug>-images.generated.ts                # url + alt + credit
   ```

2. **Download each photo** to the scratchpad (a smaller `w=` is fine and faster):
   ```bash
   curl -sS -L -o "$SCRATCH/<sceneId>.jpg" "<url with w=800>"
   ```

3. **Read each file with the Read tool.** This renders the image for you. Do not
   skip it and do not describe a photo from its alt text or its URL.

4. **For each photo, answer these separately:**
   - Does the **alt text** describe *this* photo? (It is both the accessibility
     text and the only thing the automated check can see, so wrong alt poisons
     the heuristic for everyone downstream.)
   - Does the photo match the **caption**: the setting, the time of day, the
     kind of place?
   - Does it match the **dialogue underneath it**? Count the people. A
     two-person conversation under a photo of someone alone at a laptop does not
     land.
   - Would it **mislead or alienate a student**? Visible text in the photo that
     contradicts the lesson; a corporate office standing in for a community
     center; a register that does not match the learners the guide is written
     for (see `docs/grammar-activity-style-guide.md`).

5. **Verdict per scene:**
   - photo fine, alt fine → nothing
   - photo fine, alt wrong → fix the alt in `src/data/<slug>-images.generated.ts`
   - photo wrong → swap it (`scripts/content/swap-mini-guide-images.ts`), then
     write alt that describes the new photo
   - heuristic-flagged but genuinely fine → add `"<slug>#<sceneId>"` to
     `REVIEWED_SCENE_IMAGES` in
     `src/lib/grammar-guide-audit/scene-image-reviewed.ts`, which is what clears
     the `audit:scene-images` gate

6. **If you cannot load the images** (blocked CDN, offline), run
   `npm run audit:mini-guide-images`, point the user at
   `tmp/mini-guides-audit/image-review.html`, and **say plainly that you could
   not see the photos yourself.** Never report a photo as fine on the strength
   of its alt text.

## Step 4 - Fix, flag, or ask

Fix directly:
- anything in steps 2A-2E that is clearly wrong, plus alt text and ledger entries

Flag, do not change:
- anything that looks like a deliberate choice by the teacher - seasonal or
  cultural content, a character's name or background, the story the guide tells,
  the difficulty aimed at a particular class

Ask when a fix has more than one reasonable shape (rename the character vs
rename the speaker vs make them anonymous). In this repo that judgment has paid
off: a name that looked like a loose end turned out to be load-bearing for the
`american-name-missing` audit rule.

Report findings grouped by **what they cost the student**, not by line number.
Lead with the ones that teach something false or mark a correct answer wrong.

## Step 5 - Finish

- `npm run typecheck` and re-run the audits from Step 1.
- Content lives in `src/content/grammar/*.ts` but students read the seeded copy:
  **remind the user to run `npm run db:seed:guides`**.
- Commit with the findings in the message, grouped as above, so the next
  reviewer can see what was already looked at.
