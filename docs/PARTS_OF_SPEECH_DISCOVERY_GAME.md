# Parts of Speech Discovery Game — Organized Reference

## 1) Scope

This document is now organized as a practical authoring map for two audiences:

- engineering teams checking game behavior
- content teams preparing or rebuilding parts-of-speech data in CSV

The current game logic is implemented across:

- `src/data/parts-of-speech-groups.ts`
- `src/data/parts-of-speech-exercises.ts`
- `src/hooks/usePartsOfSpeechGameState.ts`
- `src/types/parts-of-speech.ts`

A dedicated CSV importer is now wired for round/phase tuning (`scripts/import/import-parts-of-speech-game.ts` + `scripts/lib/parts-of-speech-round-overrides.ts`) and maps cleanly into the staged workflow documented below.

## 2) Playable scope and flow

- Total playable groups: **24**
- Content groups: **19**
- Checkpoints: **5** (review-only)
- Phases in unlock order: Foundation, Sentence Roles, Modifiers, Connectors, Application Bridge
- Ordering source: `ALL_POS_GROUPS` in `src/data/parts-of-speech-groups.ts`
- Group difficulty field: `difficulty` is 1-3 and affects scoring expectations, not round structure.
- Group completion: `maxRounds` is 3, 4, or 5.

## 3) Round sizing and thresholds

| Constant | Meaning |
|---|---|
| `POS_ROUND1_SIZE` | 8 questions (Foundation Round 1 is 6 in current runtime behavior) |
| `POS_ROUND2_SIZE` | 8 questions |
| `POS_ROUND3_SIZE` | 8 questions |
| `POS_ROUND4_SIZE` | 8 questions |
| `POS_ROUND5_SIZE` | 10 questions |
| `POS_CHECKPOINT_SIZE` | 10 questions |
| `POS_REVIEW_SIZE` | 12 questions |
| `POS_FINAL_SIZE` | 20 questions |

Pass requirements from `POS_ROUND_THRESHOLDS`:

- Round 1: 70
- Round 2: 75
- Round 3: 80
- Round 4: 85
- Round 5: 90

Round labels from `POS_ROUND_LABELS`:

- `round1`: Notice
- `round2`: Sort
- `round3`: Connect
- `round4`: Build
- `round5`: Master

## 4) Progression logic

- Current group is stored as `currentGroup` in `usePartsOfSpeechGameState.ts`.
- `highestRoundPassed` tracks per-group progress.
- Next round is `highestRoundPassed + 1`, capped by `group.maxRounds`.
- A round pass moves to the next round in the same group if available.
- If the group is complete, the game moves to the next group in `ALL_POS_GROUPS`.
- If already in the final group, the game finishes.
- A Round 1 failure follows the retry-style `round2` path.
- Round 2+ failures hold on the same round.
- Missed pattern IDs are promoted in later rounds as additional targets.
- Progress is persisted with `/api/activity/progress`. Call `GET /api/activity/progress?activityId=...` on entry and `POST /api/activity/progress` after each round.

## 5) Ordered group map

### 5.1 Foundation

| # | Group ID | Title | Max Rounds |
|---|---|---|---:|
| 1 | `pos-1-verbs` | What is a Verb? | 3 |
| 2 | `pos-2-nouns` | What is a Noun? | 3 |
| 3 | `pos-3-pronouns` | What is a Pronoun? | 3 |
| 4 | `pos-4-articles` | Articles & Determiners | 3 |
| 5 | `pos-checkpoint-1` | Checkpoint: Foundation Review | 3 |

### 5.2 Sentence Roles

| # | Group ID | Title | Max Rounds |
|---|---|---|---:|
| 6 | `pos-5-subject` | The Subject: Who Does It? | 4 |
| 7 | `pos-6-verb-forms` | Verb Forms | 5 |
| 8 | `pos-7-object` | The Object: Who Receives? | 4 |
| 9 | `pos-8-complement` | Complements: What Completes? | 4 |
| 10 | `pos-checkpoint-2` | Checkpoint: Sentence Structure Review | 3 |

### 5.3 Modifiers

| # | Group ID | Title | Max Rounds |
|---|---|---|---:|
| 11 | `pos-9-adjective` | What is an Adjective? | 4 |
| 12 | `pos-10-adj-placement` | Adjective Placement | 4 |
| 13 | `pos-11-adverb` | What is an Adverb? | 4 |
| 14 | `pos-12-adverb-placement` | Adverb Placement | 4 |
| 15 | `pos-checkpoint-3` | Checkpoint: Modifier Review | 3 |

### 5.4 Connectors

| # | Group ID | Title | Max Rounds |
|---|---|---|---:|
| 16 | `pos-13-preposition` | What is a Preposition? | 4 |
| 17 | `pos-14-prep-collocations` | Preposition Collocations | 5 |
| 18 | `pos-15-conjunction` | What is a Conjunction? | 4 |
| 19 | `pos-16-subordinating` | Subordinating Conjunctions | 5 |
| 20 | `pos-checkpoint-4` | Checkpoint: Connectors Review | 3 |

### 5.5 Application Bridge

| # | Group ID | Title | Max Rounds |
|---|---|---|---:|
| 21 | `pos-17-bridge-gerund` | Verbs That Transform | 5 |
| 22 | `pos-18-bridge-what-comes-after` | What Comes After? | 5 |
| 23 | `pos-19-bridge-complete` | Complete the Pattern | 5 |
| 24 | `pos-checkpoint-5` | Final Challenge: All Parts of Speech | 3 |

Checkpoint groups pull reviewed categories from `reviewsGroups` and currently render:

- `pattern-choice`
- `mad-libs`
- optional `word-family`
- each around 10 questions.

## 6) Round templates by phase (what generator can emit)

### 6.1 Foundation

- Round 1 uses `photo-sort` and `pattern-choice`.
- Round 1 currently uses 6 questions, with graduated `choiceCount` for `pattern-choice` in 2,3,4.
- Rounds 2 and 3 use the available family of discovery types, with current emphasis on `photo-sort`, `error-correction`, `contrast-pair`, `odd-one-out`, and `mad-libs`.

### 6.2 Sentence Roles

- Round 1 combines `pattern-choice`, `sentence-completion`, and either `pattern-sorting` or `subcategory-sorting`.
- Round 2 includes `pos-tagging`, `word-family`, `odd-one-out`, `photo-sort`, `error-correction`, `contrast-pair`, and `sentence-completion`.
- Round 3 emphasizes `pos-tagging`, `error-correction`, `contrast-pair`, and one `odd-one-out`.
- Round 4 includes `sentence-builder`, `mad-libs` fallback, `minimal-pair`, one `word-family`, one `word-transform`.
- Round 5 (for 5-round groups) includes `sentence-completion`, optional `photo-sort`, one `odd-one-out`, and one `mad-libs`.

### 6.3 Modifiers

- Round 1 uses `pattern-choice`, `sentence-completion`, `pos-tagging`, plus sorting style.
- Round 2 and beyond follows the same shared type family as Sentence Roles.

### 6.4 Connectors

- Round 1 adds `function-match` with `pattern-choice`, `sentence-completion`, `pos-tagging`, and sorting style.
- Later rounds include the same shared set, plus connector-specific factories.

### 6.5 Application Bridge

- Available pool from round start includes all core types used in earlier phases.
- Bridge rounds typically satisfy more factories because content supports stronger mixing.
- Rounds 2-5 follow shared Round 2-5 composition logic.

## 7) Exercise type reference

| Type | What it is | Typical question source | Notes |
|---|---|---|---|
| `pattern-choice` | choose the POS of a highlighted word | `POSPattern` examples | Works well for early identification and stable scaffolding |
| `sentence-completion` | fill the blank | `POSExample.blank` | `completionMode` can be `choice` or `text` |
| `photo-sort` | choose matching photo | `photoGallery` + distractor bank | In Round 1 it is often single-select only |
| `odd-one-out` | choose intruder | pattern examples + distractor set | Strong boundary checking when semantic distractors are clean |
| `pos-tagging` | label words in sentence | example + tokenized options | Best once sentence roles are stable |
| `function-match` | pick role | sentence + `FunctionMatchData` | Heavy terminology; late-stage use |
| `word-family` | connect derivational forms | `wordFamily` data | Useful in advanced morphology goals |
| `mad-libs` | fill one or more blanks | sentence parts + word bank | Good for production-heavy drills |
| `minimal-pair` | compare POS-shift pair | two example sentences | Keep semantic contrast very clear |
| `word-transform` | map form change | pattern family rules | Works best in later mastery rounds |
| `sentence-builder` | drag-fill sentence slot | builder slot structures | Prefer late placement |
| `error-correction` | fix targeted error | wrong vs correct word lists | Late-stage only |
| `contrast-pair` | choose closer form pair | two close options | Strong early boundary reinforcement if semantic confusion is obvious |
| `pattern-sorting` | sort tokens into buckets | phrase lists | Used as sorting-style task |
| `photo-sort` | gallery selection of POS targets | photo entries | Use caution in early groups due to literal word recognition |

Notes:

- `photo-sort` currently checks written labels first in many early questions, so it is less reliable for deep noticing in Round 1.
- `function-match` and `sentence-builder` are currently the highest-cognitive-load modes.

## 8) Data model to mirror in CSV

### 8.1 Canonical in-code fields

The code uses `POSGroup`, `POSPattern`, and `POSExample` in `src/types/parts-of-speech.ts`.

Group-level required fields:

- `id`
- `title`
- `shortTitle`
- `phase`
- `prerequisite`
- `difficulty`
- `maxRounds`
- `pattern`
- `patternExample`
- `colorClass`
- `patterns`

Pattern-level required fields:

- `id`
- `word`
- `partOfSpeech`
- `category`
- `examples`

Example-level required fields:

- `sentence`
- `highlightWord`
- `role`

Optional high-value fields:

- `blank`
- `context`
- `explanation`
- `memoryTrick`
- `commonError`
- `errorExplanation`
- `wordFamily`

### 8.2 Suggested CSV staging shape

To support your current CSV build, the easiest approach is staged files rather than one wide spreadsheet.

`pos_groups.csv`

Columns:

- `group_id`
- `title`
- `short_title`
- `phase`
- `prerequisite`
- `difficulty`
- `max_rounds`
- `pattern`
- `pattern_example`
- `memory_trick`
- `icon`
- `color_class`
- `is_checkpoint`
- `reviews_groups`
- `photo_gallery`

`pos_patterns.csv`

Columns:

- `pattern_id`
- `group_id`
- `word`
- `part_of_speech`
- `category`
- `memory_trick`
- `common_error`
- `error_explanation`
- `word_family_csv_ids`

`pos_examples.csv`

Columns:

- `example_id`
- `pattern_id`
- `sentence`
- `blank`
- `highlight_word`
- `role`
- `context`
- `explanation`

`pos_word_family.csv` (optional)

Columns:

- `pattern_id`
- `word`
- `part_of_speech`
- `usage`

`pos_photos.csv` (optional)

Columns:

- `group_id`
- `image_url`
- `word`
- `part_of_speech`
- `subcategory_label`
- `alt_text`

### 8.3 Round/phase override CSV (`parts-of-speech-round-phase-overrides.csv`)

Columns:

- `row_type` (`phase` or `round`)
- `phase` (`foundation`, `sentence-roles`, `modifiers`, `connectors`, `application-bridge`)
- `round` (1-5, required for `round` rows)
- `round_size` (optional positive integer, overrides exercise count)
- `exercise_types` (optional `;`- or `,`-delimited POS exercise types)

The importer validates this file in `scripts/import/import-parts-of-speech-game.ts` before writing `Activity.content`.

### 8.4 Importing rule

Keep `POS_ROUND_THRESHOLDS`, group order, and progression behavior in code. Let CSV be a source of truth for authored content only.

Recommended conversion flow:

1. Export or edit CSV in the five-sheet model above.
2. Validate required columns and IDs locally.
3. Build or hand-merge to `src/data/parts-of-speech-groups.ts`.
4. Add round/phase rows to `src/data/parts-of-speech-round-phase-overrides.csv` as tuning targets.
5. Keep existing tests as a regression gate using `scripts/tests/parts-of-speech-content.vitest.ts`.

### 8.5 Data provenance for current CSV merge

Source tracker table (what populated this merge):

| POS | Data source(s) |
|---|---|
| noun | `src/data/pos_frequency_list.csv` |
| verb | `src/data/pos_frequency_list.csv`, `src/data/pos_tricky_verbs.csv` |
| adjective | `src/data/pos_frequency_list.csv` |
| adverb | `src/data/pos_frequency_list.csv` |
| preposition | `src/data/pos_frequency_list.csv` |
| conjunction | `src/data/pos_frequency_list.csv` |
| pronoun | `src/data/pos_frequency_list.csv` |
| article | `src/data/pos_frequency_list.csv` |

Runtime data artifact:

- `src/data/parts-of-speech-frequency.generated.ts`  
  - Generated from `pos_frequency_list.csv` + `pos_tricky_verbs.csv` by `scripts/sync-pos-frequency-corpus.ts`.
  - Pulled into `src/data/parts-of-speech-exercises.ts` to seed cross-POS distractor and fill-in words.
- `src/data/parts-of-speech-round-phase-overrides.csv`
  - Runtime-only override config for round sizes and exercise-type constraints; not a lexical corpus.

## 9) Known quality constraints (what already passes)

From `scripts/tests/parts-of-speech-content.vitest.ts` and recent generation behavior:

- No synthetic lead-ins / trailing fragments should appear in authored examples.
- Every sentence with blank fields must contain `___` and non-blank examples must include the `highlightWord`.
- The be-verb canonical intro example must remain: `I ___ from El Salvador.`
- `round1` generation should avoid immediate same-pattern sentence repeats.
- Checkpoint exercises should maintain reasonable variation.

## 10) Current quality gaps

- `photo-sort` is often answerable from written labels and can feel like image recognition rather than POS noticing.
- `sentence-builder` no longer shows misleading non-target POS labels after the slot-labeling fix; remaining cleanup is monitoring learner response quality.
- Foundation Round 2 and Round 3 labels imply simpler tasks but currently feel skewed to higher-complexity formats.
- Some groups repeat the same authored sentence too quickly across attempts.
- `function-match` and abstract labels (`complement`, `modifier`) can feel cognitively distant for early learners.

## 11) Why the redesign is still needed

The game currently is strong on engine sophistication but mixed skill-intent in early rounds.

Current mismatch for early learners:

- category recognition and sentence-role reasoning are interleaved too early.
- tasks sometimes reward puzzle logic before category stability.
- vocabulary in feedback can be too abstract before examples are secure.

One rule of thumb to align design: discovery should move from pattern noticing, to sentence role awareness, then to production.

## 12) Suggested instructional sequence (recommended)

- Layer 1: Notice the category.
- Layer 2: Notice the job in sentence.
- Layer 3: Produce and repair.

Concrete layer behaviors:

- layer 1 uses 1-target prompts, low branch complexity, and immediate explanation.
- layer 2 adds role identification once a learner can reliably label the category.
- layer 3 adds transform/build/correct tasks after stable retention.

## 13) High-impact changes to apply first

1. Set foundation Round 1s to low complexity.
2. Replace `photo-sort` from being a core driver in very early rounds.
3. Reduce abstract terms in opening groups.
4. Split parts-of-speech and sentence roles more clearly in sequencing.
5. Add short micro-instruction before each new group.
6. Keep checkpoints tight and familiar for early confidence checks.

## 14) Recommended early sequence by category

### 14.1 Verbs

1. What is a verb?
2. Find the verb in the sentence
3. Choose the action word
4. Choose the correct verb sentence

### 14.2 Nouns

1. What is a noun?
2. Find the noun in the sentence
3. Choose the naming word
4. Sort nouns and verbs

### 14.3 Pronouns

1. What is a pronoun?
2. Replace the noun with a pronoun
3. Choose who the pronoun refers to

### 14.4 Adjectives and adverbs

Do not introduce adjectives and adverbs before nouns and verbs feel stable.

## 15) High-value interaction patterns for CSV-ready redesign

1. Tap the word: example prompt is to tap the verb in `She runs every morning.`
2. Two-button choice: example prompt is `run` is Noun or Verb.
3. This or that contrast: example prompt is `run` vs `runner` and identify the verb.
4. Small bucket drag: use 4-6 cards with one target class per item.
5. Highlight + confirm: short text with one binary response.
6. Replace it: pronoun substitution in one short sentence.
7. Intruder rounds: use clear, unambiguous semantic distractors only.
8. Early sentence swap: one incorrect vs corrected sentence pair.
9. Sentence-builder late only: reserve until core categories are stable.
10. Speed round: 30-60 second rapid-fire reinforcement.

## 16) Critical insight: verb visibility is not enough

Learners often start with `verb = action`, which works for `run`, `eat`, `walk`.

The gap appears with hidden or abstract verbs:

- considered buying
- enjoys cooking
- decided to move

The fix is definition refinement:

- from `verb = action`
- to `verb = what happens in the sentence`.

Build this into content planning by including:

- physical verbs
- state verbs
- helping verbs
- mental verbs
- communication verbs

Recommended confusion-focused interactions:

- identify main verb vs. non-finite complement
- dual highlighting: main verb and second action
- staged verb progression from action to mental and pattern verbs

Suggested metadata for future verb authoring:

```ts
{
  word: "consider",
  pos: "verb",
  category: "verb-helping",
  difficulty: 2,
  type: "mental",
  confusionTag: ["non-action", "verb+ing"]
}
```

This structure is a clean bridge to your CSV work because you can model confusion tags and verb classes as explicit columns before rebuilding group/pattern rows.

## 17) Phase 2 implementation checklist

Use this list to track each implementation pass as you move from content planning to code and finally CSV parity.

- [x] Foundation round complexity reduced (2/3-choice noticing path first).
- [x] Early rounds in Round 2 and Round 3 capped for foundation to avoid overload.
- [x] Function-match copy updated to beginner-friendly language.
- [x] Checkpoint review sets limited to the most relevant recent groups.
- [x] Pattern-choice now includes fallback explanatory text when authored explanations are missing.
- [x] Round 2 non-foundation path now includes sentence completion for retention depth.
- [x] Add explicit "phase transition review" checks between checkpoints in docs and implementation notes.
- [x] Wire remaining CSV-backed round/phase overrides into content importer pipeline.
- [x] Add automated checks for required field completeness per CSV row type.
- [x] Update unit tests to lock in foundation sequencing and checkpoint limit behavior.
- [x] Add a "what changed in this run" changelog entry in this file for each phase.

### 17.1 Phase transition review checks (gate criteria)

Use this exact mini-checklist before allowing the learner flow to unlock the next checkpoint/phase.

- [ ] Foundation → Sentence Roles transition
  - [ ] Confirm all Foundation groups (`pos-1-verbs`, `pos-2-nouns`, `pos-3-pronouns`, `pos-4-articles`) are passable in Round 1 for your target learner sample.
  - [ ] Ensure Round 1 remains mostly noticing/labeling (pattern-choice, sentence-completion, odd-one-out) and avoids heavy function/role-heavy tasks.
  - [ ] Verify checkpoint-1 review items do not exceed `POS_CHECKPOINT_SIZE`.
  - [ ] Confirm no new connector/adder roles are introduced before the sentence-roles checkpoint.

- [ ] Sentence Roles → Modifiers transition
  - [ ] Confirm unlock criteria from checkpoint 2 to checkpoint 3 are clear (review groups, maxRound targets, and progression thresholds).
  - [ ] Check role-focused prompts show learner-friendly labels where applicable (function-match wording, examples, UI feedback).
  - [ ] Verify error-correction/correctness wording is not abstract before modifiers groups.
  - [ ] Confirm one checkpoint review pass can be completed with current item cap and no repeat pattern overload.

- [ ] Modifiers → Connectors transition
  - [ ] Confirm connector-specific phrasing is preloaded in instruction notes for checkpoints 3 to 4.
  - [ ] Verify connectors exercises increasingly include sentence-role awareness before full production tasks.
  - [ ] Confirm no more than one new exercise family is introduced per wave (avoid compounding load).

- [ ] Connectors → Application Bridge transition
  - [ ] Confirm round progression in bridge groups still hits `POS_ROUND_THRESHOLDS` without forcing early abandonment.
  - [ ] Verify production tasks (`sentence-builder`, `mad-libs`) are used as review/confirmation, not as a first exposure.
  - [ ] Confirm checkpoint-5 review draws from checkpoints and bridge groups without exceeding intended size.

Implementation note:
- Add these checks to both docs (`PARTS_OF_SPEECH_DISCOVERY_GAME.md`) and a short code comment near `getAvailableExerciseTypes()` and checkpoint review generation so they stay close to behavior changes.

### 17.2 Run 1 changelog

- Imported CSV-backed round/phase overrides into the importer via `scripts/import/import-parts-of-speech-game.ts` and added a dedicated parser at `scripts/lib/parts-of-speech-round-overrides.ts`.
- Added override-aware exercise generation in `src/data/parts-of-speech-exercises.ts` for `roundSize` and per-round/per-phase exercise type gates, including foundation-specific sizing behavior.
- Threaded parsed override config from activity content into `usePartsOfSpeechGameState.ts` and `PartsOfSpeechGame.tsx` so generated rounds obey the configured CSV policy per phase.

### 17.3 Run 2 changelog

- Added `scripts/tests/parts-of-speech-content.vitest.ts` coverage for foundation round caps, checkpoint sizing, and override CSV parsing/row precedence.

### 17.4 Run 3 changelog

- Deduped and normalized `src/data/pos_frequency_list.csv` to clean ASCII-stable POS ordering, preserve contiguous ranks, and remove duplicate lexical rows (`preposition:around`, `pronoun:her`).
- Added `scripts/sync-pos-frequency-corpus.ts` to generate `src/data/parts-of-speech-frequency.generated.ts` from `pos_frequency_list.csv` + `pos_tricky_verbs.csv`, and documented it in Section 8.5.
- Wired generated frequency data and tricky-verb signals into `src/data/parts-of-speech-exercises.ts` as the primary source for cloze distractors/fill-in words.
- Extended photo-sort distractor generation to prefer image-backed words from `pos_frequency_list.csv` (via `POS_FREQUENCY_WORDS_BY_PART_OF_SPEECH`) while retaining existing curated image backups.

### 17.5 Run 4 changelog

- Added `buildFrequencyHintWords(...)` in `src/data/parts-of-speech-exercises.ts` to centralize frequency-backed distractor selection for sentence-builder and error-correction flows.
- Updated `makeSentenceBuilder` so only the target slot keeps a POS label while non-target words now use a neutral `Word` label, and sentence-builder distractors now prefer frequency-map candidates (with tricky-verb support) before fallback bank words.
- Extended `getErrorCorrectionWrongWords` to include confusion-weighted frequency candidates (and tricky verbs for verb targets), improving wrong-word plausibility and reducing repetition.
- Added image-health reporting to `scripts/sync-pos-frequency-corpus.ts` to flag top-frequency words per POS that lack `vocabImagesGenerated` coverage.
