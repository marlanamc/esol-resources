# ESOL 3 Grammar Companion

The student booklet has 34 pages (17 sheets duplex). The original PDF is preserved.

## Print

Use `output/pdf/esol-3b-grammar-reference.pdf` from the repository root. Print Letter, actual size / 100%, two-sided, flip on the long edge. Do not select booklet imposition or automatic landscape rotation. All PDF sheets are portrait Letter; wide charts on pages 11, 12, and 22 are rotated inside the sheet. Turn the binder counterclockwise to read those charts. Both horizontal edges reserve at least 0.65 inch for binding. A physical printer proof has not been performed.

The standalone `esol-3b-grammar-reference.html` includes its CSS, SVG assets, and embedded Atkinson Hyperlegible Next regular and bold fonts. The PDF embeds both font weights as well. It opens offline and shows landscape charts upright on screen. The PDF is the stable print deliverable.

## Rebuild

From the repository root:

```sh
node --import tsx scripts/reference-sheets/build-esol-3b-grammar.ts
node scripts/reference-sheets/export-esol-3b-grammar.mjs
```

The export uses the project's existing Playwright Chromium installation. It blocks remote asset requests and fails for page overflow, missing internal destinations, incomplete master charts, or table type below 10 pt. It does not start the app, access student data, or run database migrations.

Print-only content lives in `src/content/reference-sheets/esol-3b-booklet.ts`; page-specific visual compositions live in `src/content/reference-sheets/esol-3b-visual-design.ts`. Sentence-building and connector content lives in `src/content/reference-sheets/esol-3b-sentence-support.ts`. The generator holds page assembly, master charts, and base typography. Timeline data and SVG components are reused from the app. Print transformations do not modify the app reference or game behavior.

## Teaching and color conventions

- Pages use layouts matched to the teaching idea: a frequency ladder, sentence-building pieces, time lenses, tense comparisons, conditional pathways, and reported-speech bubbles. Detailed lookup charts remain where side-by-side comparison is useful.
- Visual relationships also use words, arrows, numbering, and line styles; color is a supporting cue. Each page retains its stable contents destination and printed page number.
- Tense explanations (13–16) begin with one plain-language family idea. Each tense has one large affirmative example, an app timeline, its uses, time clues, and a secondary reminder. Repeated negative/question examples are covered by the master charts on pages 11–12, with printed cross-references; meaning distinctions remain on the explanation pages.
- Six quick-navigation groups use matching category colors in the contents cards and chapter strips. Topic headings and timeline colors keep their teaching roles. Text labels remain meaningful without color.
- Tense-family colors match the app: simple green, continuous teal, perfect rust, perfect continuous amber.
- Master charts mark subjects in purple, helpers in blue, main verbs in rust, and negatives in burgundy. A labeled key appears on both charts.
- Irregular-verb column colors distinguish V2 and V3; column headings are authoritative.
- All examples are reference material, not scored activities. Rewards and balances are unchanged.

## Original coverage and deliberate corrections

Original physical PDF pages map to the new printed pages:

| Original | Topic | New |
|---|---|---|
| 1 | Contents | 1 |
| 2–3 | Word types, adjectives/adverbs, frequency | 2–5 |
| 4–5 | Time, space, movement prepositions | 6–8 |
| 6–7 | Verb forms, formulas, worked chart | 9–12 |
| 8–9 | Four tense families | 13–17 |
| 10–11 | Two-clause sentences | 19–20 |
| 12 | Contractions | 23 |
| 13–14 | Modals, uses, certainty/obligation | 24–26 |
| 15 | Gerunds and infinitives | 27–28 |
| 16 | Conditionals | 22 |
| 17 | Comparisons | 29 |
| 18 | Used-to forms | 30 |
| 19 | Passive voice | 31 |
| 20–21 | Reported speech | 32–34 |

Added: pronoun/article guidance, six irregular-verb patterns, tense-choice contrasts, question construction and short answers (18), and meaning-changing gerund/infinitive patterns.

Corrected: misleading adjective/adverb comparison rows; possession terms labeled as pronouns; verbs defined only as actions; blanket tense-backshift/interruption rules; mixed certainty/obligation percentage scales; third-conditional formula; used-to percentage continuum; automatic reported-speech changes. Frequency words are described approximately rather than given invented exact probabilities. Original examples and illustrations have been adapted, not copied verbatim throughout.

## Example emphasis

`esol-3b-focus.ts` applies topic-specific emphasis to examples without changing their wording. Frequency adverbs, time prepositions, helpers, modal phrases, conditional verbs, passive forms, and reporting patterns are bold. Existing tense underlines and sentence-piece blocks remain. Broad example bolding is removed where it concealed the target words.

## Quick navigation

The contents uses a two-column, three-row grid: Build a Sentence; Time, Place & Movement; Verbs & Tenses; Connect Ideas; Everyday Grammar Tools; Change the Message. Related topics use page ranges to reduce scanning. Problem-based shortcuts route students to formulas, tense choice, questions, or their separate Verb Reference. Conditionals follows Connectors on page 22; Everyday Grammar Tools begins with Contractions on page 23. `esol-3b-navigation.ts` defines category membership and checks that every topic appears exactly once.

## Final editorial pass

- Added Build a Sentence immediately after word jobs (page 3), with consistent functional blocks, helpers, and explicitly optional details.
- Added function-based connectors and practical punctuation guidance (page 21).
- Standardized Base Form (V1), He / She / It Form (V1-s), -ing Form (V-ing), Past Form (V2), and Past Participle (V3). The build rejects the old labels; app data is translated only for print.
- Replaced the long irregular-verb list with six representative patterns and a pointer to the separate Verb Reference.
- Added selective lookup cues on pages 11 and 28; increased timeline width without adding explanations.
- Reviewed the entire booklet for plain wording, grammar, preserved distinctions, and visual hierarchy. Rebuilt contents and cross-references from page IDs.

## Validation completed

- Compared all original pages, including image-based diagrams.
- Inspected all 34 rendered final pages and representative grayscale rendering.
- Verified 34 portrait Letter PDF sheets, printed numbering, both 12-row master charts, internal cross-references, no external dependencies, and no overflow.
- Tables remain at least 10 pt; body text is 11 pt with 10–10.5 pt compact examples and notes. Timeline labels are outside the SVG at readable print size.
- TypeScript check and targeted ESLint checks passed.
- No physical duplex print test performed; confirm your printer uses long-edge duplex and actual size before making class copies.

## Final QA sign-off

Applied the requested Place terminology, statement-specific word-order reminder, and contiguous Connect Ideas ordering. Checked all 34 pages for grammar and visual layout; verified all 51 navigation links and printed references, all six contiguous category headers, both 12-tense charts, final verb-form terminology, and landscape content on pages 11, 12, and 22. Automated export found no overflow, remote dependencies, broken links, or table text below 10 pt. The physical printer proof remains unperformed.
