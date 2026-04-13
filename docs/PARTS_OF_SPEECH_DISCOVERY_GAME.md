# Parts of Speech Discovery Game Documentation

This document describes the level and round structure of the discovery game implemented in:

- `src/data/parts-of-speech-groups.ts`
- `src/data/parts-of-speech-exercises.ts`
- `src/hooks/usePartsOfSpeechGameState.ts`
- `src/types/parts-of-speech.ts`

The game uses a dynamic generator, so rounds are assembled at runtime based on the selected group, round mode, and student misses.

## 1) Overall architecture

- Total playable items in order: **24 groups**
  - **19 content groups**
  - **5 checkpoints** (review-only groups)
- Phases and unlock order:
  1. Foundation
  2. Sentence Roles
  3. Modifiers
  4. Connectors
  5. Application Bridge
- The exact ordering comes from `ALL_POS_GROUPS` in `parts-of-speech-groups.ts`.
- Round size constants:
  - Round 1: **8 questions** (except Foundation rounds, where Round 1 is **6 questions**)
  - Round 2: **8 questions**
  - Round 3: **8 questions**
  - Round 4: **8 questions**
  - Round 5: **10 questions**
  - Checkpoint rounds: **10 questions**
- Group difficulty tier (`difficulty`): 1, 2, or 3 affects difficulty scoring, not round behavior.
- Each group can have `maxRounds` of 3, 4, or 5.

## 2) Progression logic (how rounds and levels move)

### Round thresholds
From `types/parts-of-speech.ts`:

- Round 1: **70%**
- Round 2: **75%**
- Round 3: **80%**
- Round 4: **85%**
- Round 5 (or final round for that group): **90%**

### Group progression

From `usePartsOfSpeechGameState.ts`:

- `highestRoundPassed` controls what round opens next for a group.
- `nextRound = highestRoundPassed + 1`, capped by `group.maxRounds`.
- **Passing Round 1** unlocks the next content group for display flow.
- On round pass:
  - if next round exists in that group: move forward
  - if at final round for that group: move to next group in the ordered list
  - if at last group: finish
- On failure:
  - Round 1 failure routes as retry-style `round2` in results flow
  - Round 2+ failure stays on the same round
- Missed pattern IDs are tracked and used as priority input in later rounds.
- Save/load is done through `/api/activity/progress`:
  - `GET /api/activity/progress?activityId=...` when the game starts
  - `POST /api/activity/progress` after each round

## 3) Group/level catalog (by order and rounds)

### Foundation (all maxRounds = 3)

1. `pos-1-verbs` — *What is a Verb?*  
2. `pos-2-nouns` — *What is a Noun?*  
3. `pos-3-pronouns` — *What is a Pronoun?*  
4. `pos-4-articles` — *Articles & Determiners*  
5. `pos-checkpoint-1` — *Checkpoint: Foundation Review* (checkpoint template)

### Sentence Roles

1. `pos-5-subject` — *The Subject: Who Does It?* (**maxRounds: 4**)  
2. `pos-6-verb-forms` — *Verb Forms* (**maxRounds: 5**)  
3. `pos-7-object` — *The Object: Who Receives?* (**maxRounds: 4**)  
4. `pos-8-complement` — *Complements: What Completes?* (**maxRounds: 4**)  
5. `pos-checkpoint-2` — *Checkpoint: Sentence Structure Review* (checkpoint template)

### Modifiers

1. `pos-9-adjective` — *What is an Adjective?*  
2. `pos-10-adj-placement` — *Adjective Placement*  
3. `pos-11-adverb` — *What is an Adverb?*  
4. `pos-12-adverb-placement` — *Adverb Placement*  
5. `pos-checkpoint-3` — *Checkpoint: Modifier Review* (checkpoint template)

### Connectors

1. `pos-13-preposition` — *What is a Preposition?*  
2. `pos-14-prep-collocations` — *Preposition Collocations* (**maxRounds: 5**)  
3. `pos-15-conjunction` — *What is a Conjunction?*  
4. `pos-16-subordinating` — *Subordinating Conjunctions* (**maxRounds: 5**)  
5. `pos-checkpoint-4` — *Checkpoint: Connectors Review* (checkpoint template)

### Application Bridge

1. `pos-17-bridge-gerund` — *Verbs That Transform* (**maxRounds: 5**)  
2. `pos-18-bridge-what-comes-after` — *What Comes After?* (**maxRounds: 5**)  
3. `pos-19-bridge-complete` — *Complete the Pattern* (**maxRounds: 5**)  
4. `pos-checkpoint-5` — *Final Challenge: All Parts of Speech* (checkpoint template)

## 4) Round templates by phase

### What each phase tends to use in each round

#### Foundation rounds

- **Round 1 (Foundation Notice)**
  - `photo-sort` (up to 2 items from group photo gallery)
  - `pattern-choice` (all remaining questions)
  - total: **6 questions**
  - option count ramps in order: first 2 questions use 2 choices, next 2 use 3 choices, then 4 choices
- **Round 2 (Sort/Targeted Review)**
  - `function-match`
  - `pos-tagging`
  - `odd-one-out`
  - `mad-libs` (one eligible exercise)
  - total: **8 questions**
- **Round 3 (Connect/Context)**
  - `pos-tagging`
  - `function-match`
  - `odd-one-out` (one injected exercise)
  - total: **8 questions**

#### Sentence Roles / Modifiers rounds

- **Round 1 (Notice)**
  - `pattern-choice`
  - `sentence-completion`
  - `pattern-sorting` (or `subcategory-sorting` fallback in the code)
  - total: **8 questions**
- **Round 2**
  - `function-match`
  - `pos-tagging`
  - `odd-one-out`
  - `mad-libs` (one)
  - total: **8 questions**
- **Round 3**
  - `pos-tagging`
  - `function-match`
  - `odd-one-out`
  - total: **8 questions**
- **Round 4**
  - `sentence-builder`
  - `mad-libs` fallback if sentence-builder cannot be built for a pattern
  - `minimal-pair`
  - `word-family`
  - `word-transform`
  - total: **8 questions**
- **Round 5** (only on maxRounds=5 groups)
  - `sentence-completion`
  - `function-match`
  - `odd-one-out`
  - `mad-libs`
  - total: **10 questions**

#### Connectors rounds

- **Round 1 (Notice)**
  - `pattern-choice`
  - `sentence-completion`
  - `pos-tagging`
  - `function-match`
  - `pattern-sorting` (or `subcategory-sorting` fallback in the code)
  - total: **8 questions**
- **Round 2**
  - `function-match`
  - `pos-tagging`
  - `odd-one-out`
  - `mad-libs`
  - total: **8 questions**
- **Round 3**
  - `pos-tagging`
  - `function-match`
  - `odd-one-out`
  - total: **8 questions**
- **Round 4**
  - `sentence-builder`
  - `mad-libs` fallback if sentence-builder cannot be built for a pattern
  - `minimal-pair`
  - `word-family`
  - `word-transform`
  - total: **8 questions**
- **Round 5** (only on maxRounds=5 groups)
  - `sentence-completion`
  - `function-match`
  - `odd-one-out`
  - `mad-libs`
  - total: **10 questions**

#### Application Bridge rounds

- **Round 1**
  - `pattern-choice`
  - `sentence-completion`
  - `pos-tagging`
  - `function-match`
  - `sentence-builder`
  - `pattern-sorting` (or fallback)
  - total: **8 questions**
- **Round 2**
  - same generator behavior as other phases (`function-match`, `pos-tagging`, `odd-one-out`, `mad-libs`)
  - total: **8 questions**
- **Round 3**
  - same as Sentence Roles/Modifiers Connect (`pos-tagging`, `function-match`, `odd-one-out`)
  - total: **8 questions**
- **Round 4**
  - same as Sentence Roles/Modifiers Build (`sentence-builder`, `mad-libs`, `minimal-pair`, `word-family`, `word-transform`)
  - total: **8 questions**
- **Round 5**
  - same as Round 5 mastery mix (`sentence-completion`, `function-match`, `odd-one-out`, `mad-libs`)
  - total: **10 questions**

#### Checkpoints (`review` / `final` in generator)

- Used by all five checkpoint groups
- Exercises are pulled from `reviewsGroups` only
- The checkpoint generator blends:
  - `pattern-choice`
  - `mad-libs`
  - `word-family`
- total: **10 questions**

## 5) Per-level round map (specific to each group)

| Level ID | Title | Phase | Max Rounds | Rounds present |
|---|---|---|---:|---|
| `pos-1-verbs` | What is a Verb? | Foundation | 3 | 1, 2, 3 |
| `pos-2-nouns` | What is a Noun? | Foundation | 3 | 1, 2, 3 |
| `pos-3-pronouns` | What is a Pronoun? | Foundation | 3 | 1, 2, 3 |
| `pos-4-articles` | Articles & Determiners | Foundation | 3 | 1, 2, 3 |
| `pos-checkpoint-1` | Checkpoint: Foundation Review | Foundation | 3 | checkpoint review |
| `pos-5-subject` | The Subject: Who Does It? | Sentence Roles | 4 | 1, 2, 3, 4 |
| `pos-6-verb-forms` | Verb Forms | Sentence Roles | 5 | 1, 2, 3, 4, 5 |
| `pos-7-object` | The Object: Who Receives? | Sentence Roles | 4 | 1, 2, 3, 4 |
| `pos-8-complement` | Complements: What Completes? | Sentence Roles | 4 | 1, 2, 3, 4 |
| `pos-checkpoint-2` | Checkpoint: Sentence Structure Review | Sentence Roles | 3 | checkpoint review |
| `pos-9-adjective` | What is an Adjective? | Modifiers | 4 | 1, 2, 3, 4 |
| `pos-10-adj-placement` | Adjective Placement | Modifiers | 4 | 1, 2, 3, 4 |
| `pos-11-adverb` | What is an Adverb? | Modifiers | 4 | 1, 2, 3, 4 |
| `pos-12-adverb-placement` | Adverb Placement | Modifiers | 4 | 1, 2, 3, 4 |
| `pos-checkpoint-3` | Checkpoint: Modifier Review | Modifiers | 3 | checkpoint review |
| `pos-13-preposition` | What is a Preposition? | Connectors | 4 | 1, 2, 3, 4 |
| `pos-14-prep-collocations` | Preposition Collocations | Connectors | 5 | 1, 2, 3, 4, 5 |
| `pos-15-conjunction` | What is a Conjunction? | Connectors | 4 | 1, 2, 3, 4 |
| `pos-16-subordinating` | Subordinating Conjunctions | Connectors | 5 | 1, 2, 3, 4, 5 |
| `pos-checkpoint-4` | Checkpoint: Connectors Review | Connectors | 3 | checkpoint review |
| `pos-17-bridge-gerund` | Verbs That Transform | Application Bridge | 5 | 1, 2, 3, 4, 5 |
| `pos-18-bridge-what-comes-after` | What Comes After? | Application Bridge | 5 | 1, 2, 3, 4, 5 |
| `pos-19-bridge-complete` | Complete the Pattern | Application Bridge | 5 | 1, 2, 3, 4, 5 |
| `pos-checkpoint-5` | Final Challenge: All Parts of Speech | Application Bridge | 3 | checkpoint review |

## 6) What each game pulls (sentence/example counts)

| Game | What it looks like | Content pulled | How many source items |
|---|---|---|---|
| `pattern-choice` | Choose the correct part of speech for a highlighted word | one pattern example | 1 sentence/choice prompt |
| `photo-sort` | Pick the matching picture for a POS | gallery entries + distractors | 1 photo in set as answer, 3 distractor photos |
| `sentence-completion` | Fill-in-the-blank from multiple choices | example with `___` | 1 sentence with 1 blank |
| `odd-one-out` | Find the word that belongs to another part of speech | pattern examples + distractor bank | 4 choices total (3 majority + 1 intruder) |
| `pos-tagging` | Tag highlighted word in sentence context | one sentence example | 1 sentence |
| `function-match` | Pick grammatical role (subject, verb, object, etc.) | one sentence example + role | 1 sentence |
| `word-family` | Match related forms to their POS | word family list in pattern | depends on word-family size (minimum 2 nodes) |
| `mad-libs` | Fill the blank using a word bank | sentence with `___` and distractor bank | 1 sentence with 1 blank |
| `minimal-pair` | Compare 2 sentences for POS change | two example sentences + family usage | 2 sentences |
| `word-transform` | Select transformed form from same root family | word family + generated variants | no sentence-based prompt |
| `sentence-builder` | Drag words into sentence slots | sentence example with blank | 1 sentence |
| `pattern-sorting` | Sort words into POS/subcategory buckets | phrase list from pattern examples | 4 to 6 entries |

## 7) Content source details

- Pattern and exercise source data comes from each group’s `patterns` array.
- A pattern usually has 3–5 base examples.
- `parts-of-speech-groups.ts` expands examples for many groups via `expandGroupExamples`, usually to at least 4 (or 5 for high-variety groups).
- Round 2 and later rounds can prioritize `missedPatternIds` from previous attempt history.
- `photo-sort` depends on group `photoGallery` (foundation groups with provided photos, usually verbs and nouns).
- Checkpoint groups have no new patterns; they exclusively remix selected earlier groups from `reviewsGroups`.

## 8) Practical takeaway

The game is a phase-based, adaptive sequence where:

- each group has a fixed phase and round cap,
- rounds become progressively production-heavy,
- checkpoints repeatedly enforce retrieval of previous groups,
- and later rounds in long groups (`maxRounds: 5`) are mastery rounds with higher threshold and larger round size.
