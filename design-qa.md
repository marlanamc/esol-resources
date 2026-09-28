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
