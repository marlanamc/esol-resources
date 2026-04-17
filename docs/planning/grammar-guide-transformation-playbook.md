# Grammar Guide Transformation Playbook

How to turn a text-heavy interactive guide in `src/content/grammar/*.ts` into a vibrant, scene-based learner journey with real photos, dialogues, diagrams, and varied exercises — without changing the renderer or the `InteractiveGuideContent` type.

This playbook generalizes the pattern used for [medical-instructions-complete.ts](../../src/content/grammar/medical-instructions-complete.ts).

---

## When to use this playbook

Reach for this when a guide is:

- Mostly paragraphs of explanation, with short `<p>` blocks and one or two exercises per section.
- Dominated by a single exercise type (usually `radio`) instead of a mix.
- Missing a concrete setting — students can't picture where the language actually lives.
- Already covering a topic that has strong real-world imagery (workplace, medical, cooking, housing, transportation, travel, school).

It's probably **not** the right fit for:

- Pure structural references (verb conjugation tables, punctuation rules) where scene-setting adds noise.
- Short review guides meant as a quick cheat sheet.

---

## Core principle: learner journey, not topic dump

Pick a single narrative arc the learner walks through from start to finish. Every section should feel like the next stop on that journey, with its own scene.

| Topic | Example journey |
|---|---|
| Medical instructions | ER Triage → Prescription Label → Doctor's Office → Pharmacy → Reception Desk → Role-play → Workplace → Discharge |
| Workplace phrasal verbs | First day → Meeting → Email inbox → Hallway chat → Performance review → Off-boarding |
| Conditionals (zero/first) | Waking up → Cooking breakfast → Commute → Office emergencies → After-work plans |
| Prepositions of time/place | Apartment tour → Grocery store → Bus stop → Park → Evening calendar |
| Articles (a/an/the) | At a café → Library checkout → Doctor visit → Community center signup |
| Past perfect | A day that went wrong → Interview → Missed connection → Resolution |

One story, 8–10 stops, same characters reappearing. Recurring characters make grammar feel like a habit, not a rule.

---

## The 6-step recipe

1. **Scope the transformation.** Confirm the full rewrite is wanted (vs. light polish). List what must be preserved — usually `skillTag`s on the mini-quiz so teacher diagnostics keep working.
2. **Design the journey.** Write the 8–10 stops as a bullet list before touching code.
3. **Enable inline images** in the sanitizer if not already done. See [the sanitizer step](#1-sanitizer-one-time-setup) below.
4. **Fetch curated Unsplash images** via a topic-specific script. See [step 2](#2-build-a-topic-specific-image-fetch-script).
5. **Rewrite the guide** using the reusable HTML patterns from [step 3](#3-rewrite-the-guide-content).
6. **Reseed and verify.**

---

## 1. Sanitizer (one-time setup)

This was done once for the medical guide and is now workspace-wide. If the sanitizer has been reverted or you need more tags:

- Edit [src/utils/sanitize.ts](../../src/utils/sanitize.ts).
- `<img>` is already allowed with: `src, alt, loading, width, height, decoding, referrerpolicy`.
- Only add more tags if a new pattern requires them. Prefer using existing tags: `div, span, table, ul/ol/li, h3, h4, a, strong, em, mark, sub, sup, pre, code`.
- Always add a unit test in [scripts/tests/sanitize-security.vitest.ts](../../scripts/tests/sanitize-security.vitest.ts) for any new tag or attribute.

> Note: `<figure>` and `<figcaption>` are **not** allowed. Use `<div>` with classes instead.

---

## 2. Build a topic-specific image fetch script

Follow the shape of [scripts/content/fetch-medical-instructions-images.ts](../../scripts/content/fetch-medical-instructions-images.ts).

### Required elements

- Load `.env.local` and `.env` with `dotenv` (exact two-line pattern from the medical script).
- Read `UNSPLASH_ACCESS_KEY` / `UNSPLASH_CLIENT_ID` / `UNSPLASH_ACCESS_KEY_ID`.
- Define a `SCENES` array of `{ id, query, alt, orientation? }`. Use **camelCase ids** so you can dot-access them as `img.receptionDesk.url`.
- Use **progressive query relaxation** (this was the single biggest reliability win). Try in order:
  1. full query + landscape + `content_filter: high`
  2. full query + landscape
  3. full query + any orientation
  4. shorter query (first 3 words) + landscape
  5. shorter query + any orientation
- Track `usedPhotoIds` across scenes to avoid duplicates across a single run.
- Rewrite the returned URL to a canonical CDN form: `?w=1200&q=80&auto=format&fit=crop`.
- Store photographer `name`, `url`, `unsplashId`, and `unsplashPage` for each scene so a credit line can render.
- Support `--force`, `--dry-run`, and `--refetch=scene1,scene2` flags.
- Load the existing generated file with a **dynamic import**, not a regex parser. Regex strippers destroy `//` inside URL strings.
- Output `src/data/<topic>-images.generated.ts` exporting a typed `Record<string, MedicalSceneImage>` (rename the interface per topic).

### Add an npm script

```json
"content:<topic>-images": "npx tsx scripts/content/fetch-<topic>-images.ts"
```

Convention: `content:<topic>-images` for anything that fetches images into a grammar guide, so the scripts group together in `package.json`.

### Common pitfalls

- **`content_filter: high` over-filters medical/clinical/emotional topics.** Always have a fallback that drops it.
- **Query wording matters more than length.** "woman resting home couch blanket tea mug sick recovery comfortable" beats "person resting at home with tea blanket recovery sick couch" for the same intent.
- **Manually verify all images after a first pass.** Unsplash returns lifestyle/stock photos that occasionally miss the mark (e.g., a cat instead of a person on a couch). Refetch those specific scenes with tweaked queries.

Example refetch:

```bash
npm run content:medical-images -- --refetch=recoveryHome,clipboardFasting
```

---

## 3. Rewrite the guide content

All new visual patterns live inside sanitized HTML inside the `explanation` string — no new React components needed.

### Helper builders at the top of the file

Define two (or three) template functions so every section stays consistent:

```ts
import { topicImages as img } from "@/data/<topic>-images.generated";

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" | "green" | "red" | "purple" = "terracotta"
): string => { /* returns a div with <img>, caption, and photographer credit */ };

type Turn = { speaker: string; avatar: string; text: string; side: "left" | "right"; tone: "terracotta" | "sage" | "blue" | "amber" | "purple" | "green" };
const dialogue = (turns: Turn[]): string => { /* returns a row of speech bubbles */ };
```

Tone conventions (apply consistently across all guides):

- **Terracotta** (`gc-text-terracotta`, `gc-bg-terracotta-alpha`) — authority figures: doctor, boss, manager, pharmacist, teacher.
- **Sage** (`gc-text-sage`, `gc-bg-sage-alpha`) — the learner/patient/employee speaking in reply.
- **Blue** — clinic/workplace staff (reception, nurse, HR, coworker).
- **Amber** — warnings or caution paired with advice.
- **Red** — danger/required only. Reserve for genuine "must not" messaging.
- **Green** — advice, positive outcomes, "you can" permissions.
- **Purple** — formal or rights language.

### Critical: the `gc-bg-*` classes are PALE TINTS, not solid colors

This trips up almost every new guide. In light mode:

- `gc-bg-red` → `#fef2f2` (almost-white pink, NOT solid red)
- `gc-bg-green` → `#f0fdf4` (almost-white mint)
- `gc-bg-blue` → `#eff6ff` (almost-white blue)
- `gc-bg-*-alpha` → 10% alpha of the target color (even paler)

**Never pair `gc-bg-*` with white text or `gc-text-white`.** The text will be invisible in light mode.

When you need a bold filled "action button" style with white text, use inline solid colors instead:

```html
<!-- Good: solid background + white text works in both modes -->
<div style="background: #dc2626; color: #ffffff">YES → must / must not</div>
<div style="background: #059669; color: #ffffff">YES → should / shouldn't</div>
<div style="background: #2563eb; color: #ffffff">YES → can / may</div>
<div style="background: #b45309; color: #ffffff">YES → need to</div>
<div style="background: #7c3aed; color: #ffffff">→ are allowed to</div>

<!-- Bad: white text on pale pink tint, unreadable in light mode -->
<div class="gc-bg-red"><span class="gc-text-white">YES → must / must not</span></div>
```

Rule of thumb:

- **Want a soft highlight?** Use `gc-bg-*-alpha` + **default** (dark) text.
- **Want a filled button / table header / emphasis block?** Use an inline solid color background + `color: #ffffff`.
- When you override `color: #ffffff` on a parent, also set it on child `<strong>`, `<h4>`, and `<th>` elements — some themes re-assert colors on headings.

### Available visual patterns

All of these are pure HTML + `gc-*` utility classes (see `src/app/globals.css` §Grammar coloring). Reuse them as-is from the medical guide:

1. **Scene card** — image + caption ribbon + photographer credit line at the top of each section.
2. **Dialogue bubbles** — two-column speech bubble layout, emoji avatar, name tag above each line, color-coded by role, alternating left/right.
3. **Tone ladder** — 5-rung vertical list with emoji, colored left border, strength tag on the right (STRONGEST → GENTLEST).
4. **Decision tree** — dashed question boxes with two-column YES/NO splits leading down through 3–4 layers.
5. **Faux label or sign mockup** — `font-family: 'Courier New', monospace`, colored header strip, bulleted instructions; works for prescription labels, warning stickers, job postings, timetables, menus.
6. **Comparison tables** — `gc-bg-*-alpha` for the header row, alternating row backgrounds for readability.
7. **Contrast cards** — two-column grid with "❌ Too direct" vs "✅ Respectful" or "OLD / NEW" framing.
8. **Callout boxes** — `gc-callout-blue`, `gc-callout-green`, `gc-callout-red`, `gc-callout-sage` for quick side notes.

### Section template

Each section should follow a predictable rhythm so learners don't have to re-orient:

```
1. Scene card — the setting for this stop on the journey.
2. One short paragraph — what's happening here and why this grammar matters.
3. Formula box (gc-bg-*-alpha) — the structural rule in one big line.
4. Diagram, dialogue, or mockup — see the current piece of grammar in action.
5. Table or callout — key variations or side-by-side contrasts.
6. tipBox — one memorable takeaway in plain language.
7. 1–2 exercises using varied item types.
```

### Exercise variety goal

A good guide uses at least **4** of these `ExerciseItem` types across its sections:

- `radio` — quick comprehension checks (1 correct answer).
- `checkbox` — "pick ALL that..." (e.g., warnings, rude phrasings, irregular verbs).
- `text` — fill-in-the-blank with `expectedAnswer` or `expectedAnswers: string[]` for multiple accepted forms.
- `select` — match sentence to category via dropdown.
- `word-select` — tap every imperative verb / target POS inside a real-world paragraph.
- `word-scramble` — rebuild a scrambled line from a dialogue.

Aim for roughly this distribution: 40% `radio`, 15% `checkbox`, 15% `word-select`, 15% `word-scramble`, 15% `text`.

### Exercise writing rules

- **Answer positions must be randomized.** Do not leave all correct answers as option `a`. Run `npm run audit:answer-position` after a batch.
- Every `text` item should use `expectedAnswers: string[]` when contractions or casing vary ("don't need to" vs "do not need to", "May" vs "may").
- `word-select` `tokens` array: mark EVERY target word with `isTarget: true`, not just the verb. E.g., for "Do not skip" mark both "Do" and "not".
- `word-scramble` prompts should feel like they come from the dialogue above — reuse exact lines.
- Keep exercise `id`s unique across the whole file, namespaced by section (`declaratives-scramble`, `workplace-rude-filter`).

---

## 4. Mini-quiz (teacher diagnostics)

The mini-quiz is the backbone of per-student diagnostics — handle with care.

### Rules

1. **Never rename or drop an existing `skillTag`.** Teacher reports reference these strings. If you're refreshing an existing guide, every original tag must survive verbatim.
2. **Add new items with new tags**, don't retrofit. If the new coverage is "tone ladder matching", the new tag is `tone-ladder-matching`.
3. **Ship a teacher diagnostic comment block** at the bottom of the file (the multi-line `/* ... */` comment) explaining what each tag measures and what to re-teach if students miss it.
4. **Aim for 18–22 items.** Fewer than 16 is too thin for diagnostics; more than 25 drives quiz fatigue.
5. **Difficulty mix**: ~40% easy, ~50% medium, ~10% hard.
6. **Distractors** should encode common learner errors (e.g., "you must to finish" tests `must + to` over-correction).

### Tag naming convention

```
<concept>-<sub-concept>-<context-or-contrast>
```

Examples:
- `modals-must-not-safety-warning`
- `permission-can-vs-may-polite`
- `register-employee-to-boss-declarative`
- `warning-label-checkbox`

Keep it kebab-case, 3–5 segments, descriptive enough to grep for.

---

## 5. Reseed and verify

### Typecheck first

```bash
npx tsc --noEmit -p tsconfig.json
```

### Run the guide's seed script

```bash
npx tsx prisma/seed-<topic>-complete.ts
```

Most grammar guides have their own seed file. If not, check the generic `prisma/seed-grammar-only.ts`.

### Smoke-test the learner view

```bash
npm run dev
```

Then open the guide's learner URL, typically `/grammar-reader/<slug>`. Click through every section and verify:

- Every scene card image loads and has a non-empty caption.
- Dialogue bubbles alternate left/right correctly and don't overflow on mobile.
- Exercises accept correct answers and reject incorrect ones.
- Dark mode looks reasonable — if custom inline colors render as invisible text, add explicit dark-mode-safe colors via `gc-*` utility classes instead of raw hex.

---

## Quick checklist

Use this before opening a PR for a transformed guide:

- [ ] Journey has 8–10 stops with recurring characters.
- [ ] Every section opens with a scene card.
- [ ] At least one dialogue block with color-coded speakers.
- [ ] At least one CSS diagram (tone ladder, decision tree, or faux label).
- [ ] At least 4 different `ExerciseItem` types used across the file.
- [ ] Every original `skillTag` is still present.
- [ ] 3–5 new `skillTag`s added for new exercise patterns.
- [ ] Teacher diagnostic comment block updated with guidance for new tags.
- [ ] `npx tsc --noEmit` passes cleanly.
- [ ] `npm run audit:answer-position` passes.
- [ ] `npm run audit:grammar-dark-mode` passes.
- [ ] Grep the file for `gc-text-white`, `color: white`, `color: #fff` — every match must live on a **solid** background (`background: #...` inline), never on a `gc-bg-*` class.
- [ ] Image fetch script lives in `scripts/content/` with a `content:<topic>-images` npm script.
- [ ] Generated images file lives at `src/data/<topic>-images.generated.ts`.
- [ ] Guide reseeded and verified in the learner view on mobile + desktop + dark mode.

---

## Reference implementation

- Plan: `medical-instructions-transformation` (in `.cursor/plans/`).
- Guide: [src/content/grammar/medical-instructions-complete.ts](../../src/content/grammar/medical-instructions-complete.ts).
- Image fetch: [scripts/content/fetch-medical-instructions-images.ts](../../scripts/content/fetch-medical-instructions-images.ts).
- Generated images: [src/data/medical-instructions-images.generated.ts](../../src/data/medical-instructions-images.generated.ts).
- Sanitizer update: [src/utils/sanitize.ts](../../src/utils/sanitize.ts) — the `BASE_ALLOWED_TAGS` / `BASE_ALLOWED_ATTR` entries for `img`.

When in doubt, copy the helper builders (`sceneCard`, `dialogue`) directly from the medical guide and adapt the scene ids and tone mapping.
