---
name: practice-log-corrections
description: Draft teacher replies to the practice log - a corrected version of each student's sentence (recast) or a thumbs-up - for Marlana to review and approve before anything is saved. Use when asked to correct, reply to, check, or draft feedback on practice logs, study logs, or what students wrote from home.
---

# Practice log corrections

Students log English practice from home with one sentence ("I watched the move in English").
Teachers reply in the app with either a **recast** (the sentence rewritten correctly; the student
sees it under theirs with the changed words highlighted) or **praise** (a thumbs-up). This skill
drafts those replies in bulk. **Nothing reaches students until Marlana approves the drafts.**

Usage: `/practice-log-corrections [class name] [since YYYY-MM-DD]`. Default since = this Monday.

## 1. Export (reads only)

Confirm which database `DATABASE_URL` points at, then:

```bash
npx tsx scripts/study-log/export-unreplied.ts --class "<class>" --since <YYYY-MM-DD> --out tmp/practice-log/unreplied.json
```

Without `--class` it lists the classes. Only entries with no reply are exported, so anything
Marlana already answered in the app is left alone. `tmp/` is gitignored: student sentences
never get committed.

## 2. Draft one reply per entry

Read `tmp/practice-log/unreplied.json` and decide each entry yourself (no subagents, no scripts
for the judgment). Write `tmp/practice-log/drafts.json`:

```json
{ "replies": [
  { "logId": "…", "kind": "recast", "text": "I watched the movie in English.", "why": "move → movie" },
  { "logId": "…", "kind": "praise", "why": "correct V2" },
  { "logId": "…", "kind": "skip", "why": "can't tell what she meant" }
] }
```

### Rules for a recast

These are adult ESOL level 3 learners practicing **the simple past (V2)**; the log form shows
them a V2 hint ("watch → watched"). Recasts work because they're small.

- **Fix at most two things**, the ones that matter most, in this order:
  1. Verb form and tense: `writed` → `wrote`, `I go` → `I went`, `I am watch` → `I watched`.
  2. A wrong word that changes the meaning: `move` → `movie`, `spook` → `spoke`.
  3. A missing word the sentence needs: `I went store` → `I went to the store`, a missing subject.
  4. Two sentences run together: `…my boss her name is…` → `…my boss. Her name is…`.
- **Keep their words, meaning, and details.** Don't add information, swap in fancier vocabulary,
  or restructure a sentence that already works. Names, places, and personal details stay as written.
- **Leave small things alone** when they're the only issue: capitalization (`tv`, `english`),
  a missing final period, `a`/`an`. Such a sentence gets praise. Fix them only if you're already
  recasting the sentence for something bigger.
- Use American English. Don't correct an informal but natural sentence into a formal one.
- The recast must differ from the original (the apply script rejects identical text).

### Praise

Any sentence with a correct past-tense verb and no error from the list above. Praise should be
common: the log is for building a habit, and students who see only corrections log less.

### Skip and flag for Marlana

Never draft a reply for these. List them in the review with the reason:
- You can't tell what the student meant.
- The sentence isn't in English, or isn't a sentence about practice (test text, a question to the teacher).
- **Anything about distress, safety, health, immigration, money trouble, or other personal
  hardship.** Marlana should answer those herself, or not at all, whatever the grammar.

## 3. Review with Marlana

Show one table, grouped by student, then the skips:

| Student | Day | They wrote | Draft | Why |
|---|---|---|---|---|
| Ricardo | Wed | I spook with my boss her name is Katherine. | I **spoke** with my boss**.** **Her** name is Katherine. | spook → spoke; run-on |
| Elena | Thu | I talked to my friend in English. | 👍 | correct V2 |

Bold the changed words in each draft. Then ask her to approve all, or name the rows to change
or drop. Apply her edits to the drafts, then write only the approved replies (no skips) to
`tmp/practice-log/approved.json` in the same shape.

## 4. Save the approved replies

Dry run first and show her the output:

```bash
npx tsx scripts/study-log/apply-replies.ts tmp/practice-log/approved.json --teacher <her username>
```

Then, only after she says to, run the same command with `--apply`. Against production the script
refuses unless `ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=<host>` is set: ask her for that, don't
set it on your own. The script skips any entry that got a reply in the app since the export, and
never changes points.

Finish with a one-line count (sent, praised, skipped) and delete `tmp/practice-log/`.
