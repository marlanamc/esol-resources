# Timeline Tenses — Question Building Best Practices

A reference guide for writing, reviewing, and maintaining questions across all question types. Read this before adding new questions and use the checklists when auditing existing ones.

---

## Table of Contents
1. [Universal rules for every question type](#1-universal-rules-for-every-question-type)
2. [Timeline elements reference](#2-timeline-elements-reference)
3. [Tense → element type mapping](#3-tense--element-type-mapping)
4. [Time expressions → tense mapping](#4-time-expressions--tense-mapping)
5. [Question type guides](#5-question-type-guides)
6. [Common mistakes from the audit](#6-common-mistakes-from-the-audit)
7. [Pre-publish checklist](#7-pre-publish-checklist)

---

## 1. Universal rules for every question type

### IDs must be unique
Every question has an `id` field. There is no automatic duplicate check — if two questions share an ID, one will silently shadow the other in the results review screen. Students won't be able to review one of them after a round.

**Naming convention:**
```
[tense-abbrev]-[type-abbrev]-[descriptor]-[number]
```
Examples: `pperf-verb-3`, `fpc-1`, `mixed-pc-neg-2`, `cont-read-morning-1`

When in doubt, be more descriptive rather than less. IDs are never shown to students.

### Required fields — never skip these
Every question needs:
- `id` — unique string
- `type` — one of the question type strings
- `tenseCategory` — `'simple' | 'continuous' | 'perfect' | 'perfect-continuous' | 'mixed'`
- `sentenceForm` — `'affirmative' | 'negative' | 'question'`
- `difficulty` — `1` (easy) | `2` (medium) | `3` (hard)
- `tenseName` — use the standard names below (consistency matters for the results screen)

### Standard tenseName values
Use these exactly. The results screen uses the tense name for color-coding and display.

| Tense | tenseName |
|---|---|
| Present Simple | `'Present Simple'` |
| Past Simple | `'Past Simple'` |
| Future Simple | `'Future Simple'` |
| Present Continuous | `'Present Continuous'` |
| Past Continuous | `'Past Continuous'` |
| Future Continuous | `'Future Continuous'` |
| Present Perfect | `'Present Perfect'` |
| Past Perfect | `'Past Perfect'` |
| Future Perfect | `'Future Perfect'` |
| Present Perfect Continuous | `'Present Perfect Continuous'` |
| Past Perfect Continuous | `'Past Perfect Continuous'` |
| Future Perfect Continuous | `'Future Perfect Continuous'` |
| Two tenses in one sentence | `'Past Continuous + Past Simple'` (use `+` not `/`) |

Do **not** add qualifiers like `'Present Simple (Habit/Fact)'` — this breaks consistency and can cause display bugs.

### Difficulty guidelines
- **1 (easy):** Simple / Continuous tenses, affirmative sentences, common vocabulary, clear time marker
- **2 (medium):** Perfect tenses, negative/question forms, or two tenses in one sentence
- **3 (hard):** Perfect Continuous, complex mixed tenses, subtle time markers, no explicit clue word

---

## 2. Timeline elements reference

### Element types

| Type | Visual | Used for |
|---|---|---|
| `single-dot` | A point on the timeline | Completed actions at a specific moment (Past Simple, Future Simple) |
| `solid-line` | A horizontal bar | Duration without reference to now (Past Continuous, Future Continuous) |
| `dashed-line` | A dashed bar | Habitual or repeated actions (Present Simple habits) |
| `arc` | A curved arc in the past | Connection between two past moments (Past Perfect, Past Perfect Continuous) |
| `solid-to-now` | A line ending at NOW | Duration up to the present moment (Present Perfect, Present Perfect Continuous) |
| `solid-to-point` | A line ending at a future point | Duration up to a future deadline (Future Perfect, Future Perfect Continuous) |
| `arc-dashed` | A dashed arc in the future | Future Perfect in context (completed before a future moment) |

### Zones

| Zone | Meaning |
|---|---|
| `past` | Before NOW — for a single past zone |
| `past-earlier` | The further-back past — use when two past moments are needed (Past Perfect) |
| `past-later` | The more-recent past — the later of the two past moments |
| `present` | The NOW point |
| `future` | After NOW |

**Important:** Use `past-earlier` / `past-later` only when a question genuinely requires two distinct past moments (Past Perfect, Past Perfect Continuous). Do not use split-past zones for simple Past Continuous — those only need `past`.

### Position values
Position is a number from 0–100 representing where along the zone the element sits.

- `50` = centered in the zone (good default for single elements)
- For two elements in the **same zone**: use `30` and `70` to separate them visually
- For split-past zones: `past-earlier` element at `30`, `past-later` element at `70`
- **Never give two elements in the same zone the same position** — they will stack invisibly on top of each other

---

## 3. Tense → element type mapping

This is the most critical table. Getting the element type wrong teaches students an incorrect visual representation of the tense.

| Tense | Element type | Zone | Notes |
|---|---|---|---|
| Present Simple (habit) | `dashed-line` | `present` | |
| Present Simple (fact) | `single-dot` | `present` | |
| Past Simple | `single-dot` | `past` | |
| Future Simple | `single-dot` | `future` | |
| Present Continuous | `solid-line` | `present` | |
| Past Continuous | `solid-line` | `past` | |
| Future Continuous | `solid-line` | `future` | |
| Present Perfect | `arc` or `solid-to-now` | `past` / spans to `present` | Use `solid-to-now` when emphasising duration to now |
| Past Perfect | `arc` | `past-earlier` + dot in `past-later` | Arc = the earlier action; dot = the reference point |
| Future Perfect | `arc-dashed` | `future` | Dashed arc ending at future point |
| Present Perfect Continuous | `solid-to-now` | `past` zone, ending at now | The line starts in the past and reaches NOW |
| Past Perfect Continuous | `arc` | `past-earlier` | Extended arc showing duration before a past point |
| Future Perfect Continuous | `solid-to-point` | `future` | **NOT `solid-to-now`** — the endpoint is in the future, not now |

### The most common mix-up
**Future Perfect Continuous uses `solid-to-point`, NOT `solid-to-now`.**

`solid-to-now` means "up to the present moment." For a future deadline sentence like "By 2027, I will have been living here for 5 years," the endpoint is in the future — use `solid-to-point` in the `future` zone. Using `solid-to-now` here is technically showing Present Perfect Continuous, which teaches the wrong concept.

---

## 4. Time expressions → tense mapping

Use this table to verify that the time expression in your sentence matches the tense you're asking for.

### Past tenses
| Time expression | Likely tense |
|---|---|
| "yesterday," "last week," "in 2019," "ago" | Past Simple |
| "when X happened" (background action) | Past Continuous |
| "while X was happening" | Past Continuous |
| "already," "before X happened," "by the time X" | Past Perfect |
| "for [duration] before X," "since [past point] until X" | Past Perfect Continuous |

### Present tenses
| Time expression | Likely tense |
|---|---|
| "every day," "always," "usually," "never" | Present Simple |
| "right now," "at the moment," "currently" | Present Continuous |
| "already," "just," "yet," "ever," "never," "since," "for [duration]" | Present Perfect |
| "since [year]," "for [duration]" + ongoing | Present Perfect Continuous |

### Future tenses
| Time expression | Likely tense |
|---|---|
| "tomorrow," "next week," "soon" | Future Simple |
| "at this time tomorrow," "this time next year" | Future Continuous |
| "by [future deadline]," "before X happens" | Future Perfect |
| "by [future deadline], for [duration]" | Future Perfect Continuous |

### The "by [deadline]" trap
"By [deadline]" is the most commonly misapplied time expression:
- In a **past narrative** → Past Perfect ("By the time she arrived, he **had left**.")
- In a **present/future context** → Future Perfect ("By Friday, I **will have finished**.")

Always check which tense frame the sentence lives in before assigning Future Perfect.

---

## 5. Question type guides

### Type 1: `sentence-to-timeline` (Build mode)
The student reads a sentence and draws the timeline.

**Required fields:**
- `sentence` — the full sentence, grammatically correct
- `correctElements` — array of timeline elements (see element reference above)
- `explanation` — shown after the student answers; explain *why* the timeline looks this way

**Explanation tips:**
- Reference the time expression: *'"Since 2020" tells us the action started in the past and continues now.'*
- Describe what each element represents: *'The arc connects the earlier past action to the reference point.'*
- Never use element type names (`solid-to-now`) in the explanation — students don't know those terms
- Verify the explanation matches the actual `correctElements` you specified (check element type, zone, and visual description)

---

### Type 2: `timeline-to-verb` (Read mode)
The student sees a timeline and fills in the missing verb form.

**Required fields:**
- `timelineElements` — same element types as above, but each also needs `verbLabel` (the base verb shown on the timeline)
- `sentenceTemplate` — use `___[verb]___` syntax to mark blanks
- `blanks` — array with `validAnswers` (see answer guidance below)
- `scenario` — a short phrase giving context (e.g. `'Talking about your morning routine'`). **Do not skip this** — without it, the scenario heading in the exercise is blank.

**Answer guidance:**
- Always include at least one `validAnswer` with the `tenseName` and an optional `nuance`
- Include contracted forms as separate `validAnswers` when natural (e.g. `"'ll have been working"` alongside `"will have been working"`)
- The answer normalization system handles: case, punctuation, extra spaces, and some contractions — but not British/American spelling variants, so include both if relevant (e.g. `"has learnt"` / `"has learned"`)
- Do not include partial forms as valid answers — students must type the full verb form

---

### Type 3: `tense-comparison` (Spot the Difference mode)
Two timelines are shown; the student picks which one matches the prompt.

**Required fields:**
- `promptText` — the sentence or meaning clue
- `promptType` — `'sentence-to-timeline'`, `'clue-to-timeline'`, or `'timeline-to-sentence'`
- `elementsA` / `elementsB` — the two timeline options
- `optionA` / `optionB` — each needs a `sentence` showing the tense in use
- `correctOption` — `'A'` or `'B'`
- `tenseA` / `tenseB` — the tense name for each option
- `explanation` / `keyDifference` — shown in feedback

**Important:** The A/B display order is randomized on screen, so the feedback message translates the internal `correctOption` to the display label. Your job is only to set `correctOption` accurately — the display handles itself.

The two options should be **meaningfully different** in tense (not just wording), and the time expression in `promptText` should make one clearly right.

---

### Type 4: `sentence-transformer` (Transformer mode)
The student sees a sentence in one tense and rewrites the verb(s) in a new tense.

**Required fields:**
- `sourceSentence` / `targetSentence` — the full sentences in both tenses
- `sourceElements` / `targetElements` — timeline elements for both
- `verbBlanks` — which word indices to blank out in the target sentence, with `validAnswers`
- `targetTense` — the tense the student is transforming into

**Watch out for:**
- `verbBlanks[].index` is the **word index** in `targetSentence` (0-based, split on spaces). If the target sentence changes word count relative to the source, recount carefully.
- Multi-word verb forms span multiple word indices — the component uses `validAnswers[0].split(' ').length` to calculate how many words to hide. If you have alternate valid answers of a different word length, list the canonical full form as `validAnswers[0]`.

---

### Type 5: `context-tense-picker` (In Context mode)
A paragraph with a gap; the student picks the right tense from multiple choice.

**Required fields:**
- `contextParagraph` — the full passage with a blank `___`
- `options` — array of 3–4 choices, exactly one with `isCorrect: true`
- `clueWords` — words in the paragraph that hint at the answer (highlighted for the student)
- `explanation` — why the correct tense fits

Make sure exactly **one** option has `isCorrect: true`. There is no code validation for this — if two are marked correct or none are, the exercise will behave incorrectly.

---

### Type 6: `error-correction` (Fix It mode)
The student sees a sentence with a tense error and either corrects it or identifies the timeline error.

**Required fields:**
- `errorLocation` — `'verb'` or `'timeline'`
- `incorrectSentence` / `correctSentence`
- `errorExplanation` — why the original was wrong

**Note:** `errorLocation: 'timeline'` questions are automatically marked correct (the student just views the correct timeline). This is by design, but it means these questions inflate accuracy scores. Use them sparingly and mix them with `'verb'` questions.

---

## 6. Common mistakes from the audit

These are real errors found in the question bank. Check for these patterns whenever you add or edit questions.

### ❌ Wrong element type for Future Perfect Continuous
```ts
// WRONG — solid-to-now ends at the present, not a future point
correctElements: [{ type: 'solid-to-now', zone: 'future', position: 50 }]

// CORRECT — solid-to-point ends at a future deadline
correctElements: [{ type: 'solid-to-point', zone: 'future', position: 50 }]
```

### ❌ Explanation text doesn't match the element type
```ts
// WRONG — says "dashed line" but element is solid
explanation: 'The dashed line shows duration...',
correctElements: [{ type: 'solid-to-point', ... }]
```
Always read your `explanation` and verify every visual description matches the `correctElements`.

### ❌ Overlapping positions (two elements, same position)
```ts
// WRONG — elements are stacked invisibly
correctElements: [
  { type: 'solid-line', zone: 'past', position: 50 },
  { type: 'single-dot', zone: 'past', position: 50 }, // hidden behind the line
]

// CORRECT — separated so both are visible
correctElements: [
  { type: 'solid-line', zone: 'past', position: 30 },
  { type: 'single-dot', zone: 'past', position: 70 },
]
```

### ❌ Inverted split-past positions
```ts
// WRONG — earlier event has a higher position than the later event
correctElements: [
  { type: 'arc', zone: 'past-earlier', position: 50 },  // should be lower
  { type: 'single-dot', zone: 'past-later', position: 20 }, // should be higher
]

// CORRECT
correctElements: [
  { type: 'arc', zone: 'past-earlier', position: 30 },
  { type: 'single-dot', zone: 'past-later', position: 70 },
]
```

### ❌ Duplicate IDs
Search for your new ID before saving:
```
grep -r "id: 'your-id-here'" src/data/
```
If any result comes back, rename your new question.

### ❌ Missing `scenario` field on timeline-to-verb questions
Every `timeline-to-verb` question should have a `scenario`. It's shown as a context heading to help students interpret the timeline. Without it, the heading is blank.

### ❌ Non-standard `tenseName`
```ts
// WRONG
tenseName: 'Present Simple (Habit/Fact)'

// CORRECT
tenseName: 'Present Simple'
```

### ❌ Future Perfect in a past-tense narrative context
Whenever you write a sentence with "by [deadline]," ask: *Is this deadline in the past or the future?*
- Past deadline → **Past Perfect** ("had finished")
- Future deadline → **Future Perfect** ("will have finished")

---

## 7. Pre-publish checklist

Go through this for every question before adding it to the data file.

### Identity
- [ ] `id` is unique (search the codebase to confirm)
- [ ] `tenseCategory` matches the tense(s) in the sentence
- [ ] `sentenceForm` is correct (`affirmative` / `negative` / `question`)
- [ ] `difficulty` is appropriate (1 easy / 2 medium / 3 hard)
- [ ] `tenseName` uses the standard name from the table above

### Sentence quality
- [ ] The sentence is grammatically correct
- [ ] The sentence uses a clear time expression that signals the tense
- [ ] The vocabulary is appropriate for intermediate ESOL learners
- [ ] Negative and question forms are correctly structured (not just "not" added awkwardly)

### Timeline elements (sentence-to-timeline and timeline-to-verb)
- [ ] Element `type` matches the tense using the mapping table in section 3
- [ ] Element `zone` is correct (`past`, `past-earlier`, `past-later`, `present`, `future`)
- [ ] No two elements in the same zone share the same `position`
- [ ] Split-past positions: `past-earlier` has a lower position than `past-later`
- [ ] The explanation text matches the element types (no "dashed line" when using `solid-to-point`, etc.)

### Answers (timeline-to-verb and transformer)
- [ ] `validAnswers` includes the full canonical form
- [ ] Contracted forms are included as additional valid answers where natural
- [ ] `tenseName` on each valid answer is correct
- [ ] `scenario` field is present and gives useful context

### Context questions
- [ ] Exactly one option has `isCorrect: true`
- [ ] `clueWords` are actually present in the `contextParagraph`

### Final read-through
- [ ] Read the sentence aloud — does it sound natural?
- [ ] Does the time expression match the tense you're teaching?
- [ ] If the sentence has two clauses, do both tenses make sense together?
- [ ] Would a student who gets it right actually understand the concept, or just guess?
