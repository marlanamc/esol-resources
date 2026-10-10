# Course map mobile QA

final result: passed

Scope: updated course-map components rendered in a local interactive fixture with sample progress. This is not a signed-in production acceptance test. Next navigation/link hooks are adapted for the fixture; week switching uses the actual component event handlers.

## Visual references and evidence

- Source: /Users/marlanacreed/.codex/generated_images/01a0e898-c7fb-72e0-bd41-533bf952a699/exec-7b3377a7-cf4c-4261-875c-038777a9cc10.png (853 × 1844).
- Implementation: output/course-map-mobile-qa/implementation-375.png (375 × 1200, 375 CSS-pixel viewport, 1× capture).
- States: Week 2, one completed task, next flash-card task, collapsed details and optional practice. Also inspected Week 3 preview, cross-unit Week 4, expanded details, and expanded optional practice.
- Compared the course-card regions, excluding the mockup's app header and bottom navigation, which are outside this change. Source card width is approximately 778px; compare at approximately 0.44 scale to the 343px implementation card. Content differs intentionally: actual component sample activities, optional practice, and previous-week navigation remain available.
- Full-view and focused header/list/navigation inspection completed using browser captures at 320, 375, and 430px. Final 375 × 1200 capture includes the entire card; no additional crop was required to read labels.

## Findings and corrections

- Removed inherited paragraph bottom margins from title, details, and previous/upcoming section headings. Unified row padding to 16px horizontally and 12px vertically; removed compounded outer-list and optional-section spacing.
- Added native week selector with 44px touch area and visible keyboard focus. Switching units keeps the selected week's header in view.
- Full titles wrap; Next follows the first unfinished actionable task in the viewed week, independently of older unfinished work. Done rows remain readable and reviewable; locked rows are non-links with an explicit label.
- Initial fixture lacked compiled CSS; corrected fixture dependency resolution before accepting visual evidence. Initial full-page screenshot capture was scaled incorrectly; replaced it with a verified 375 × 1200 viewport capture.

## Required fidelity surfaces

- Typography: existing application font tokens preserved; full titles and compact hierarchy verified. Fixture uses font fallbacks because Next's font loader is absent. Production font loading is not revalidated here.
- Spacing: consistent 16px inset, compact headings and 12px row padding; no horizontal overflow at 320 or 430px.
- Colors: application tokens retained, ocean accent selected to match the user's screenshot; blush header, blue next state and green done indicator.
- Assets: existing Lucide icons used; no new raster assets or replacement of app branding.
- Copy: meaningful Next/Done/Locked states, Vocab type in both hero and list, This week navigation, and Tuesday early-access explanation. No course-content records changed.

## Validation

- 47 existing focused schedule/session/launch tests passed.
- 3 new render tests passed: viewed-week next task, completed/locked states, selector and hero destination.
- TypeScript, targeted ESLint, and git diff whitespace checks passed.
- Browser: same-unit and cross-unit selection, disclosure expansion, optional-practice expansion, wrapped titles, 44px selector/summary targets, and no horizontal overflow verified. No browser console errors in the final preview.

## Remaining limits

Signed-in activity navigation, live progress writes, production font rendering, and global app navigation were not exercised in the fixture. Desktop rendering is unchanged by the opt-in mobile row variant; its scroll target behavior remains unchanged.

## Follow-up: activity formats and workload reassurance

- User-approved refinement: replace broad categories with one icon-and-text format chip; merge the embedded launch panel into the next list row; add “Work at your own pace. Start with one activity.” No duration or difficulty claims.
- Evidence: output/course-map-mobile-qa/format-chips-375.png (375px mobile viewport). Browser checked at 320px: document width 320px, exactly one link for the next activity, full titles and chips wrap without overflow. Week 3 selection shows the correct Start row and destination. Browser error log empty.
- Completed tasks remain reviewable; Next/Done/Locked stay separate from the format. The all-finished header invites review. Standalone wayfinding and desktop variants retain their existing launch behavior.
- 49 focused render/format/date/session/launch tests passed. TypeScript and targeted lint passed. Signed-in production testing remains outside this local fixture.
- final result: passed

# Word Rescue mobile QA — October 10, 2026

final result: passed

Scope: visual and interactive development-preview review of Word Rescue. This does not certify the draft pronunciation content, real-device microphone behavior, or live-database rewards for student release.

## Reference and comparison

- Selected revised mobile reference: `output/word-rescue/mobile-reference.png` (854 × 1846; interpreted at 390 CSS pixels wide, scale approximately 0.457).
- Final implementation: `output/word-rescue/mobile-spanish.jpg` (390 × 1150, 1× capture). Initial interactive viewport: 390 × 844. Full-height evidence expands the capture to include the language panel and teacher-only reset control, without changing layout width.
- Compared the Hear stage with Spanish help expanded in both images in the same review input. Inspected the full screen and word/audio/language regions at readable size. The preview banner, extra single-syllable guidance, and reset control intentionally add vertical content. Scrolling is allowed; there is no horizontal overflow.
- Typography: existing Lora/DM Sans tokens, large English word, 16px guidance, visible control labels. Increased the main word size after comparison.
- Spacing: 20px phone insets, stacked stages, no sidebar. Reduced audio controls to a horizontal icon/text arrangement to better match the reference and save phone height.
- Colors: warm paper, slate text, sage audio/help, darker terracotta primary action for contrast.
- Assets: existing Lucide icons; no new illustrative assets required. The progress line replaces the reference's decorative circles while preserving all three step labels.
- Copy: normal/slow audio, approximate language guidance, optional recording, and equal effort recognition. No stress-identification quiz or automatic accent grade.

## Interaction evidence

- Walked through through → through security → full sentence → spoken confirmation → Practice again → saved preview receipt → prohibited.
- Verified normal word/phrase audio and slowed word/sentence audio. Empty initial sandbox-generated drafts were replaced by valid audio; all 687 final MP3 files have nonempty output.
- Switched Spanish to Brazilian Portuguese, reloaded, and verified the selection and current session survived. Returned to Spanish for the saved screenshot.
- Checked 320px and 390px phone widths and the 1440px desktop fallback. No horizontal overflow. Audio controls measured 73px tall; phone controls retain at least 48px touch height.
- Final browser error/warning log was empty. The development-tool indicator is not part of the production UI.
- 24 focused automated tests passed; TypeScript, scoped ESLint, whitespace, vocabulary-source synchronization, and nullable-assignment safety checks passed.

## Remaining release checks

- Review all synthesized clips and draft phrase extractions, and expand/review the authored bilingual pronunciation hints for the selected class weeks.
- Test microphone grant/denial, local playback, and cleanup on physical iPhone Safari and Android Chrome. No ambient microphone recording was taken during this review.
- Seed the unreleased activity and verify a real signed-in balance/ledger save on non-production PostgreSQL before student release. Persistence tests in this change use a mocked transaction contract.

Repository hygiene check separately flagged existing Finder files: `FY27/.DS_Store`, `FY27/worksheets/.DS_Store`, and `output/.DS_Store`. They were not removed as part of this activity change.

### Word Rescue weekly integration — October 10
- 31 vocabulary weeks receive a collection-specific pronunciation link, before the closing verb quiz. Review weeks without a set remain unchanged.
- Verified the October Week 2 mobile link selects transportation vocabulary and starts with “depart.” Screenshot: `output/word-rescue/weekly-mobile.png`.
- 48 focused tests pass, including weekly completion isolation, latest-state merge, effort/retry contracts and existing map ordering/navigation. TypeScript and scoped UI lint pass.
- Existing audio reused for 201 unique terms; ElevenLabs generated only “through” and “correctly.” Both new MP3s decode successfully. Provenance saved for all 229 word IDs. Phrases/sentences still use draft Samantha clips; listening review remains pending.
- No database seed or student release performed. Live database reward and physical microphone checks remain outstanding as documented above.

### FY27 picker and consistent voice — October 10 follow-up
- Replaced legacy catalog labels/order with actual FY27 map titles and vocabulary references. The 31 current sets appear as FY27 · Week N · title; six unmapped catalog sets are excluded from new weekly sessions. Existing saved words remain readable.
- Generated all 597 clips for the 199 active word IDs using one ElevenLabs voice/model/settings combination; 569 unique requests after text deduplication. Every generated file has provenance and a reusable signature. A cache version refreshes previously loaded preview audio.
- 30 focused tests pass; TypeScript and scoped lint pass. Browser confirms current FY27 labels (e.g. Week 4 Foundations: Learn How to Learn). Screenshot: `output/word-rescue/fy27-collections.png`.
- Still pending listening review and student release; generation does not imply reviewed pronunciation.


## Word Rescue accordion implementation — October 10, 2026

- Source visual: `/Users/marlanacreed/.codex/generated_images/01a12742-df34-7f60-b99d-8d0d87c269df/exec-69f32b5d-1bef-4342-a3f7-a2c6ce5e1f80.png` (1536×1024 board, three app states).
- Implementation: `output/word-rescue/accordion-listen.png`, `accordion-practice.png`, `accordion-saved.png`; localhost preview at `/preview/word-rescue`.
- Viewport: 390×844 CSS px, screenshot width 390px (1×), full-page captures. Compared the center reference panel (~390px wide) with the 390px implementation; excluded decorative frame/footer and the preview-only banner/reset control from app-content comparison. Reference and revised practice screenshot were opened together in one tool result. Entire panels were legible, so separate focused crops were unnecessary.
- States: Listen; reopened completed Build & say; saved reflection. Reference's Build state is unfinished; the implementation practice screenshot shows the same region reopened after completing it, explaining its Practiced checkmark.

### Findings and comparison history

Initial P2: practice audio labels wrapped and the recording icon occupied another line, putting the main action too low. Fixed with compact Normal/Slow labels and an inline recording button. Recaptured `accordion-practice.png`; the unnecessary wrapping is resolved.

Typography: existing app display serif and body fonts retained; clear large word and readable phrase/sentence text. Intentional difference from the generated mock's mixed fonts: established app fonts take precedence.
Spacing: fixed word/meaning region and three bordered folding sections match the approved hierarchy. Phrase and sentence share one panel; recording privacy copy and persistent Stop audio are retained product requirements. Controls have 48px minimum touch height. Preview-only notices make captures taller than the live activity.
Colors: cream, sage, dark green and terracotta use existing Word Rescue tokens. Selected confidence has a subtle terracotta outline/background.
Assets: existing Lucide icons retained. Quotes, leaves, decorative frame and slogans deliberately omitted at the user's request. No raster assets needed.
Copy: Ready to practice, I practiced it, How does it feel?, Next word match the approved flow. Preview honestly labels its illustrative totals; production retains confirmed +2 word toasts and the actual session total (+12 weekly, +6 standalone).

### Interaction checks

Browser walkthrough completed all three standalone preview words, including normal/slow model playback, both reflection choices, reopening completed panels, a stable word after saving, next-word reset, and final six-point preview total. No browser console errors. Weekly six-word / twelve-point persistence and retry deduplication remain covered by existing automated tests. No real student account was used for QA awards. Physical-device microphone behavior was not re-tested in this visual change.

No actionable P0/P1/P2 findings remain. No added animation; user-paced folding and focus changes use preventScroll. The persistent per-word toast remains unchanged and honors reduced motion.

final result: passed
