# Handoff: Mobile Course Map — "One Road" (design 3a)

## Overview
A redesign of the **student mobile course map** (`/dashboard/map`, `lg:hidden` branch) for the ESOL app (`marlanamc/esol-resources`). The current mobile map uses nested accordions (unit card → week card), a hidden native `<select>` for week switching, a heading that changes meaning ("This week" / "Viewing" / "Coming up"), and week lists that reorder when tapped. Students (and the teacher) get lost.

The new design treats the course as **one continuous vertical road** for the whole school year:
- It always **opens scrolled to "You are here"** (the current class week).
- **Units are signposts on the road**, not containers. **Cycles** (Cycle 1 = Sep–Jan, Cycle 2 = Feb–Jun) are larger banners.
- A **sticky top bar** always says where you're looking (Cycle · Month · Unit, Week N, dates) and holds a **horizontally scrollable week strip** for the whole year.
- A floating **"Back to this week"** button appears whenever you scroll away from the current week (like a map app's re-center).
- **Finished units/cycles fold** into one-line summaries. **Future weeks are visible but locked** until their class week.
- Weeks never reorder. Nothing opens inside anything else, except a past week, which can expand in place.

**Chosen configuration:** design **3a**, with **Future weeks = "Locked until class week"**.

## About the design files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behavior, not production code to copy directly. The task is to **recreate design 3a in the existing Next.js 16 / React 19 / Tailwind 4 codebase**, using its patterns: `lucide-react` icons, CSS variables in `src/app/globals.css`, the existing helpers in `src/lib/course-map-*.ts`, `CourseMapActivityFormatChip`, and so on.

Open `Course Map Mobile Review.dc.html` in a browser (keep `support.js` next to it). **Design 3a is the top section ("Turn 3 · Starting from scratch").** The sections below it (2a/2b, 1a/1b/1c, "Current") are earlier explorations and the annotated review of today's UI. Use them only as context. In the Tweaks panel you can switch **Time of year** (October / April), **Future weeks**, and **progress**.

The prototype's course data (unit titles for units 5–10, week titles after week 5, activities) is **mock data**. Use real data from `getVisibleMap()` / `CourseMapUnit[]`.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and behavior are final. Recreate them closely using existing tokens. Where the prototype hard-codes a hex that exists as a CSS variable, use the variable (mapping in *Design Tokens*).

## Where it goes in the codebase
- `src/app/dashboard/map/page.tsx`: the mobile branch (`<div className="lg:hidden">`) renders `ClassCoursePath` with `mobileWayfinding`. Replace it with a new component, e.g. `CourseMapRoad`. The desktop layout is **unchanged**.
- Components that become unused on mobile: `course-path/mobile.tsx` (`MobileUnitSection`, `MobileWeekCard`) and `CourseMapMobileWayfinding.tsx`. Keep them until the rollout is done.
- Reuse:
  - `course-map-navigation.ts`: `isMapActivityActionable`, `isMapActivityCompleted`, `buildMapActivityHref`, `buildMapReturnHref`, `syncMapUrl`, `parseMapWeekParam`.
  - `course-map-current-week.ts`: `resolveCurrentWeek` gives the "You are here" week. For classroom mode, use the calendar week (`scheduledWeek`).
  - `course-map-unit-colors.ts`: `getCourseMapUnitTone(n)` gives `accent`, `chipBg`, `surface`.
  - `course-map-hero.ts`: `formatNextUpActivityTitle`, `getCourseMapEstimatedMinutesForActivity`.
  - `CourseMapActivityFormatChip.tsx`: the activity type chip (label, icon, tone).
  - `ActivityLink` / `withReturnTo`: activity links must return to `/dashboard/map?week=N`.
  - `course-map-session-state.ts`: optional. Opening on "You are here" is the default; restore the saved position only if returning from an activity (`?week=` or `?focus=next`).
- Locking: activities already support `status: "locked" | "planned"`. "Locked until class week" means **any week whose number is greater than the current class week** renders as locked, regardless of the activity status. Confirm with the teacher whether this is enforced on the server or only in the UI.
- Cycles: the data has no cycle concept yet. Derive it from the month: units Sep–Jan = Cycle 1, Feb–Jun = Cycle 2. You could add a `cycle` field to the unit seed later.

## Screen: Course map (mobile, 375pt reference width)

### Shell
- The page background is `--bg` (`#fdf9f0`). The existing app header (`ModeHeader`) and `BottomNav` (56px, Map active) stay as they are.
- The scroll container is the page. In the prototype it is an inner scroller inside a phone frame; in production use window scroll. The top bar is `position: sticky; top: <header height>`.
- Bottom padding is about 110px so the last content and the floating button clear the bottom nav.

### 1. Sticky top bar
- Container: `background: rgba(253,249,240,.95)`, `backdrop-filter: blur(8px)`, `border-bottom: 1px solid var(--border-subtle)`, padding `12px 16px 10px`, z-index above the content.
- **Row 1**, flex with space-between and items aligned to the bottom:
  - Eyebrow: `{Cycle N} · {Month} · Unit {n}`. 12px, weight 800, letter-spacing .07em, uppercase, color = **the viewed unit's accent**.
  - Title row (baseline, gap 6): `Week {n}` in Lora 21px/700, followed by dates `Oct 5–9` in 14px/600 `--text-muted`. Dates are Mon–Fri. If they cross a month, use `Sep 28 – Oct 2`.
  - Right pill (no wrap):
    - Viewed week is the current week: **"This week"**, `background #4d6b53` (`--success-color`), text `#fffdfa`, 12px/800, padding 5px 10px, fully rounded.
    - Otherwise: **"Earlier week"** or **"Coming up"**, `background #fffdfa`, `inset 0 0 0 1px rgba(207,191,171,.9)`, text `--text-muted`.
- **Week strip** (margin-top 10px, bleeds to the edges with `margin: 0 -16px; padding: 2px 16px`, `overflow-x: auto`, scrollbar hidden):
  - A flex row (gap 7px) of **unit groups**. Each group is a column (gap 3px) holding a row of week segments (gap 3px), then a month label.
  - Segment: a 16×22px tap target wrapping a 16×10px bar with radius 3px. **Every segment is a button** (`aria-label="Go to week N"`).
    - Current week: the **current unit's accent**.
    - Finished week: `#4d6b53`.
    - Past and unfinished: `#cdbfa9`.
    - Future and locked: `#efe9df`.
    - The viewed week also gets a ring: `box-shadow: 0 0 0 1.5px #fdf9f0, 0 0 0 3.5px #1a202c`.
  - Month label: 10.5px/800, uppercase, letter-spacing .06em, color = unit accent, `border-left: 2px solid <accent>`, `padding-left: 4px`, no wrap.
  - **Cycle divider**: a 2px-wide vertical line, `#cdbfa9`, radius 1px, margin `4px 3px 2px`, between the January and February groups.
  - The strip **auto-scrolls (smooth) to center the viewed week's segment** whenever the viewed week changes, and on first load.
- Tapping a segment smooth-scrolls the page to that week. It first expands any folded cycle or unit that contains it. If the week is locked (not rendered as a row), scroll to its unit sign instead.

### 2. The road (content)
Every row uses the same 2-column grid: `grid-template-columns: 44px minmax(0,1fr); gap: 8px; padding: 0 16px 0 12px`.
- **Rail** (left column): an absolutely positioned 3px vertical line at `left: 21px`, covering the full row height.
  - Weeks up to and including the current week: solid `#cdbfa9`.
  - Future weeks: dashed, `repeating-linear-gradient(to bottom, #d6cbbb 0 6px, transparent 6px 12px)`.
- Row types, in order: **Cycle banner**, then for each unit a **Unit sign** followed by its **Week rows**.

#### Cycle banner
- `margin: 18px 0 4px; padding: 12px 14px; border-radius: 16px; background: #1a202c; color: #fffdfa`.
- Eyebrow: `Cycle 2 · now` (append " · now" for the current cycle). 11.5px/800, uppercase, .1em, opacity .75.
- Title: `February – June` (or `September – January`), Lora 18px/700.
- Summary (13px, opacity .85):
  - Past cycle: `21 of 21 weeks done`.
  - Future cycle: `Starts Feb 1 · 20 weeks`.
- **Past cycle**: folded by default, so its units and weeks are not rendered. There is a chevron (20px, rotates 180° when open), and tapping toggles it.
- **Future cycle** (with locking on): always folded, no chevron, not tappable.
- **Current cycle**: always open.

#### Unit sign
- `margin: 16px 0 8px; padding: 10px 12px; border-radius: 14px; background: <unit chipBg>`.
- Badge: 32×32px, radius 9px, background = accent, Lora 16px/700, text `#fffdfa`, showing the unit number.
- Eyebrow: `{Month} · Unit {n}`. 11.5px/800, uppercase, .08em, accent.
- Title: unit title, Lora 17px/700.
- **Past unit** (its last week is before the current week): folded by default and tappable. Summary (13px/600, `#4a5566`): `Weeks 22–25 · 4 of 4 weeks done ✓` (the ✓ only appears when all weeks are done). Chevron on the right.
- **Future unit** (with locking on): uses neutral colors instead (`accent #6b7684`, `chip #f1ece4`). Summary `Opens May 3 · 5 weeks`. Its weeks are not rendered. Not tappable.
- **Current unit**: always open, no summary.

#### Week node (on the rail; `margin-top: 16px`; every node has a `box-shadow: 0 0 0 4px #fdf9f0` halo that cuts the rail)
- **Done**: 30px circle, `#4d6b53`, white 16px check.
- **Current**: 42px circle, **unit accent**, white week number 18px/800, plus `0 0 0 9px color-mix(accent 22%, transparent)`.
- **Past and unfinished**: 30px, `#fdf9f0`, `border: 2px solid #8f99a5`, number 13px/800 in `--text`.
- **Locked future**: 30px, `#f3eee6`, `border: 2px dashed #d6cbbb`, lock icon 14px in `#8a94a0`.

#### Week row — compact (past weeks)
- The whole row is a button (min-height 60px):
  - `Week 4 · Sep 28 – Oct 2`: 13px/700, muted.
  - Title: 16.5px/700.
  - Status, 13.5px: `All done ✓` in `#4d6b53`, or `2 of 3 done` in muted. Past unfinished weeks get **no warnings or catch-up nudges**, by design.
  - Chevron-down, 20px; rotates 180° when open.
- Tapping expands the week **in place**, showing a card underneath: `#fffdfa`, `1px solid rgba(207,191,171,.75)`, radius 16. It lists the activity rows (see below, with no "Next" tag).

#### Week row — locked (future weeks in the current unit)
- Not interactive, min-height 58px:
  - `Week 33 · Apr 19–23`: 13px/700, `#7a8594`.
  - Title: 16px/700, `#6b7684`.
  - `Opens Monday, Apr 19`: 13.5px, muted.

#### Week row — current ("You are here" card)
- Card: `margin: 4px 0 14px; border-radius: 20px; background: #fffdfa; border: 1px solid color-mix(accent 30%, transparent); box-shadow: 0 12px 28px rgba(40,31,23,.12)`.
- Header (padding 14px 16px 12px):
  - Pill **"You are here"**: accent background, `#fffdfa` text, 11.5px/800 uppercase, padding 4px 10px.
  - Next to it: `Week 32 · Apr 12–16`, 13.5px/700, muted.
  - Title: Lora 24px/700.
  - Progress: one 8px-tall bar per activity, `flex: 1`, gap 4, radius 4. Colors: done `#4d6b53`, next = `color-mix(accent 45%, transparent)`, todo `#e9e1d4`. Then `1 of 6 done` (13.5px/700, muted, no wrap).
- **Primary button** (when the week has a next activity):
  - `margin: 0 12px 12px; min-height: 64px; padding: 10px 14px; radius 16px; background: accent; color: #fffdfa; box-shadow: 0 8px 18px color-mix(accent 30%, transparent)`.
  - Left: a 38px white circle with a play icon in the accent color.
  - Middle: eyebrow `CONTINUE · ABOUT 5 MIN` (or `START …` when nothing is done yet), 12px/800 uppercase .06em, opacity .92. Below it, the next activity title (prefix "Say It & Spell It: " stripped; use `formatNextUpActivityTitle`), 17px/700.
  - Right: a chevron.
  - Links to the next activity.
- **All done this week**: replace the button with a box: `#eef4ec` background, `#2d6930` text, 15px/700, radius 16, text "You finished this week! You can review anything below or start next week early." With locking on, change this copy to "…You can review anything below."
- Heading `THIS WEEK'S ACTIVITIES`: 12px/800 uppercase .06em, muted, padding 4px 16px 6px.
- Activity rows (see below). The next activity's row has a light tint `color-mix(accent 7%, transparent)` and a trailing **"Next"** pill: unit `chipBg` background, unit accent text, 12px/800, padding 3px 8px.
- Optional practice:
  - `margin: 10px 12px 12px`, `1.5px dashed rgba(180,165,145,.85)`, radius 14, padding 10px 12px.
  - A 34px circle (`rgba(247,242,232,.9)`) with a plus icon.
  - Text: `EXTRA · NOT REQUIRED` (11px/800 uppercase) above `More games for this week` (15px/600).
  - It opens the existing extra-practice list. Expanding it inline is fine.

#### Activity row (shared)
- Layout: flex, gap 12, padding `10px 16px` (14px inside expanded cards), min-height 56–58px, `border-top: 1px solid rgba(207,191,171,.45)`. The whole row is a link (`ActivityLink` with returnTo).
- Step dot: 26px circle.
  - Done: `#4d6b53` fill with a white ✓.
  - Next: `#fffdfa` fill, `2px solid <accent>`, number in the accent color.
  - Todo: transparent, `1.5px solid rgba(94,107,125,.45)`, number in muted.
- Title: 15px/600, line-height 1.3.
- Meta row (margin-top 4, wraps, gap 4px 8px):
  - **`CourseMapActivityFormatChip`**: pill, padding 4px 9px, 13px/600, 14px lucide icon, tone background and text. Labels and icons: Read & practice/BookOpen, Flash cards/Copy, Match pairs/Link2, Complete sentences/Pencil, Sort words/Puzzle, Game/Gamepad2, Quiz/ClipboardCheck, Listen & say/Volume2, Speaking/Mic, Writing/Pencil, Review/RotateCcw.
  - Then `Done` or `about N min`, 13px/600, muted.

### 3. Floating "Back to this week" button
- Shown only when the viewed week ≠ the current week.
- Fixed and centered horizontally, `bottom: bottom-nav height + 16px`, z-index above the content.
- `min-height: 50px; padding: 0 20px; border-radius: 999px; background: #1a202c; color: #fffdfa; 15.5px/700; box-shadow: 0 10px 24px rgba(0,0,0,.28)`.
- Label: `↓ Back to this week` when the viewed week is earlier, `↑ Back to this week` when it is later.
- Tapping smooth-scrolls to the current week's row.

## Interactions & behavior
- **Initial load**: scroll (instantly, no animation) so the current week's row sits just under the sticky bar (offset = bar height + 4px). An explicit `?week=N` link wins and lands on week N; expand any folds that contain it.
- **Scroll-spy**: the viewed week = the last week row (or folded sign) whose top is ≤ bar height + 70px. Updating it re-renders the top bar text and segment ring, auto-centers the strip, and shows or hides the floating button. Throttle it, or use `IntersectionObserver` (there is already `useCourseMapScrollSpy`, which can be adapted).
- **Folds**: past cycles and past units are folded on every visit (per-session state is fine). Tapping a sign or banner toggles it. Jumping from the strip auto-expands folds.
- **Expand a past week**: toggles in place. Several can be open at once. Nothing reorders.
- **Locked**: future-week rows, future-unit weeks, and the future cycle can't be interacted with. Strip segments for locked weeks scroll to the unit sign.
- **URL**: keep `syncMapUrl(viewedWeek)` so returning from an activity lands back in place.
- **Accessibility**:
  - Sticky bar text has `aria-live="polite"`.
  - The rail is decorative (`aria-hidden`).
  - Each week row has a heading for screen readers: `Week N: Title`.
  - Strip segments are buttons with labels.
  - Every tap target is at least 44px (segments are 22px tall but 16px wide; consider making the touch target 44px tall with the 10px bar centered).
- **Reduced motion**: use `behavior: "auto"` instead of smooth scrolling.

## State
- `currentWeek`: from `resolveCurrentWeek` (calendar-based for classroom learners).
- `viewedWeek`: from scroll-spy.
- `openCycles: Set<number>`, `openUnits: Set<number>`, `openWeeks: Set<number>`: UI only.
- Derived per week: `done` / `total` (actionable required activities), `isPast`, `isCurrent`, `isFuture`, `isLocked = isFuture && lockFutureWeeks`, `dates` (Mon–Fri from the calendar), and `nextActivity` (first actionable activity that isn't completed).
- Derived per unit: `doneWeeks`, `weekRange`. Per cycle: unit membership and its summary.

## Design tokens (existing in `globals.css` unless noted)
- Background `--bg` `#fdf9f0`. Surface `--surface-base` `#fffdfa`. Subtle `--surface-subtle` `rgba(247,242,232,.78)`. Border `--border-subtle` `rgba(207,191,171,.65)`.
- Text `--text` `#1a202c`. Muted `--text-muted` `#5e6b7d`. Success `--success-color` `#4d6b53`. Ink (banner and float button) `#1a202c`.
- Unit accents and chip backgrounds (`--unit-N-accent` / `--unit-N-chip-bg`):
  - 1 `#B0432B`/`#fae8e5`
  - 2 `#8A5A0B`/`#f6ecd8`
  - 3 `#4B6B1F`/`#eef3e0`
  - 4 `#1E6E5C`/`#e4f3ef`
  - 5 `#17667F`/`#e0f0f5`
  - 6 `#2A5599`/`#e4ebf6`
  - 7 `#4A46A0`/`#eceaf6`
  - 8 `#7A3E9D`/`#f3eaf7`
  - 9 `#9C3272`/`#f8e8f0`
  - 10 `#A32B4A`/`#f8e6eb`
- **The unit accent replaces `--primary` everywhere on this screen.** The teacher asked that terracotta not be overused. `--primary` stays only in the global bottom nav.
- Activity tones: grammar `--tone-grammar-chip-bg/-text`, vocabulary `--tone-vocabulary-*`, games `--tone-games-*`, quizzes `--tone-quizzes-*` (via `getLearnerCategoryTone`).
- New neutrals (not tokens yet):
  - Rail `#cdbfa9`, dashed rail `#d6cbbb`.
  - Future segment `#efe9df`, todo progress `#e9e1d4`.
  - Locked node `#f3eee6` / `#8a94a0`.
  - Past node border `#8f99a5`.
  - Future text `#6b7684` / `#7a8594`, summary text `#4a5566`.
- Type:
  - **Lora** (`--font-display`) for titles.
  - **Atkinson Hyperlegible Next** for all body text on this screen. It's new here; the repo already ships Atkinson in `FY27/worksheets/unit-checklists/fonts/`, and there's an existing `--font-legible` token (`var(--font-atkinson)`). Use `--font-legible`.
  - Body text is 13–17px.
- Radii: 3 (strip segments), 9 (badges), 14 (signs, optional card), 16 (cycle banner, button, expanded cards), 20 (current card), 999 (pills).
- Shadows:
  - Current card `0 12px 28px rgba(40,31,23,.12)`.
  - Button `0 8px 18px color-mix(accent 30%)`.
  - Float button `0 10px 24px rgba(0,0,0,.28)`.

## Assets
No images. Icons are **lucide-react** (already a dependency): Check, Play, ChevronDown, ChevronRight, Plus, Lock, and the format-chip icons listed above. The bottom nav uses the existing `src/components/icons/Icons.tsx`.

## Files in this bundle
- `Course Map Mobile Review.dc.html`: all explorations. **Design 3a is the top section.** The Tweaks panel has Time of year (October/April), Future weeks (use "Locked until class week"), and progress.
- `support.js`: runtime needed to open the HTML file locally.
- `README.md`: this document.
- `screenshots/3a-october.png`: design 3a in October (week 5). Left: what a student sees when the map opens. Right: after scrolling back to September ("Back to this week" showing).
- `screenshots/3a-april.png`: the same two states in April (week 32, Cycle 2). Cycle 1 and February/March are folded. On the right, scrolled back to February.

## Source files read while designing (repo)
`src/app/dashboard/map/page.tsx`, `src/components/dashboard/ClassCoursePath.tsx`, `src/components/dashboard/course-path/{mobile,atoms,shared}.tsx|ts`, `src/components/dashboard/CourseMapMobileWayfinding.tsx`, `src/components/dashboard/ActivityTimeline.tsx`, `src/components/dashboard/CourseMapActivityFormatChip.tsx`, `src/components/ui/BottomNav.tsx`, `src/components/layout/ModeHeader.tsx`, `src/lib/course-map-unit-colors.ts`, `src/lib/learner/theme.ts`, `src/app/globals.css`.
