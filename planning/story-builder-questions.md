# Story Builder Questions — Planning Notes

## Why story questions are currently disabled

The Story Builder mode was temporarily removed from the game while the question data is audited. Two issues were found that could teach students incorrect grammar:

- **Story-02, sentence 4** — "By the end of the day, Jordan ___ (receive) an offer." was marked as **Future Perfect** ("will have received"), but the entire story is narrated in the past. The correct tense for a past-tense story with a past deadline is **Past Perfect** ("had received"). This has been fixed in the data, but all stories need a similar check.
- **Story-04, sentence 3** — Same issue: "By lunchtime, Luis ___ (win) first prize" was marked Future Perfect mid-past-narrative. Fixed to Past Perfect ("had won").

The broader risk is that the story format makes tense errors harder to spot — unlike standalone sentences, the "right" answer depends on what tense frame the whole story is told in.

To re-enable: uncomment the two lines in `useTimelineTensesState.ts` and the Story Builder entry in `ModeSelector.tsx`.

---

## The core problem with story questions

Each sentence in a story does not stand alone — it exists inside a **tense frame** established by the narrative. Getting one sentence wrong teaches students not just an incorrect verb form, but an incorrect understanding of how tense shifts work across a text.

Key things to get right:

### 1. Establish the tense frame in sentence 1

The opening sentence sets the "register" for the whole story. Students will unconsciously anchor to it.

- **Past narrative** → sentences should use past tenses unless there's a clear reason to shift (reported speech, hypotheticals, narrative present)
- **Present narrative** → present tenses throughout, with logical shifts to perfect/future as needed
- **Mixed frame** (e.g. a flashback) → must be explicitly signaled with time markers

**Do not mix tense frames without a clear signal.** A story that starts in past tense should not insert a Future Perfect sentence just because "by [deadline]" appeared — in a past narrative, that phrasing calls for Past Perfect.

### 2. Signal every tense shift with a time expression

Students at this level use time expressions as anchors. Every sentence should have one, and the time expression should make the required tense *feel* obvious in context.

| Time expression | Past frame | Present frame | Future frame |
|---|---|---|---|
| "By the time X happened" | Past Perfect | — | — |
| "By [future deadline]" | — | Future Perfect | Future Perfect |
| "When X arrived" | Past Simple / Past Continuous | — | — |
| "At that moment" | Past Continuous | Present Continuous | — |
| "Already" | Past Perfect | Present Perfect | — |
| "Since [year]" | Past Perfect Continuous | Present Perfect Continuous | — |
| "Right now" | — | Present Continuous | — |

### 3. Check tense sequence logic

Stories should follow natural tense progressions. Common valid patterns:

**Past narrative arc:**
Past Simple → Past Continuous → Past Perfect → Past Perfect Continuous → back to Past Simple

**Interview / event day (past):**
Past Perfect Continuous (preparation) → Past Perfect (earlier event) → Past Simple (main event) → Past Continuous (ongoing at a moment)

**Do not** insert Future Perfect into a past narrative arc. Reserve Future Perfect for:
- Stories told from a present or future viewpoint
- Reported future plans within a past narrative (e.g. "She said she *would have finished* by Friday")

### 4. Keep the story frame consistent to the end

Every sentence, including the last one, must fit the established frame. The last sentence is the most tempting place to "wrap up" with an unrelated tense (e.g. jumping to Present Continuous for a "right now" feel), but this breaks the narrative logic unless the story explicitly transitions to the present.

---

## What makes a good story question for ESOL learners

- **3–5 sentences** — short enough to hold in working memory, long enough to establish context
- **One new tense per sentence** — each sentence should give students practice with a distinct tense that is motivated by the narrative
- **Increasing difficulty** — sentence 1 should be the most accessible tense; sentence 4/5 should be the most advanced
- **Real-world scenario** — students connect better with situations they recognize: job interviews, school events, travel, cooking, sports
- **Clear time markers in every sentence** — no sentence should require the student to guess the tense without a clue

---

## How to audit existing story questions

For each story, go through this checklist:

1. **What is the tense frame?** (past / present / future — established by sentence 1)
2. **Does each sentence fit that frame?** Check that the required tense matches the narrative time
3. **Does the time expression match the required tense?** E.g. "by [past deadline]" → Past Perfect, not Future Perfect
4. **Does the context hint explain the tense correctly?** Hints must reference the narrative frame, not just the time expression in isolation
5. **Is the difficulty progression sensible?** Harder tenses (Perfect Continuous, mixed) should come after simpler ones in the sequence
6. **Does the `targetTense` field match the `validAnswers`?** E.g. targetTense: "Past Perfect" must have answers like "had + past participle"

---

## Improvements for when we rebuild Story Builder

### Better narrative structure
Rather than a loose collection of sentences, each story should have:
- A **setup** (sentence 1–2): establishes setting and characters using accessible tenses
- A **complication** (sentence 3): something happened that requires a more complex tense
- A **resolution** (sentence 4–5): outcome using the most advanced tense in the set

### More variety in scenarios
Current stories lean toward academic/professional settings. Add:
- Everyday life (cooking, travel, family)
- Student-relevant situations (exam day, sports match, club event)
- Multilingual contexts (student from another country reflecting on their journey)

### Explicit "tense shift" stories
One advanced story type should be a narrative that intentionally shifts frames — e.g. a present-day character remembering a past event. This teaches students how tense frames coexist in real text, which is a high-value skill.

### Validation before re-enabling
Before turning Story Builder back on:
1. Read every story aloud from start to finish
2. Check every `targetTense` against the sentence and the time expression
3. Check every `contextHint` — it must explain the tense in terms of the narrative, not just repeat the time expression
4. Verify `buildCanonicalTimelineElements` is called with the correct tense key for each sentence
5. Confirm the `fullTimelineElements` array matches the sentence-by-sentence tense list

---

## Re-enabling checklist

- [ ] Full audit of all stories against the checklist above
- [ ] Fix any tense frame mismatches
- [ ] Add missing/weak context hints
- [ ] Test Story Builder end-to-end in the game (submit correct answers, submit wrong answers, reach results screen)
- [ ] Uncomment `TIMELINE_STORY_QUESTIONS` in `useTimelineTensesState.ts` (line ~16 and ~281)
- [ ] Uncomment Story Builder entry in `ModeSelector.tsx`
