# Handoff: Student Home & Course Map Redesign

## Overview
This package redesigns four learner-facing screens in the **Class Companion** ESOL app:

1. **In‑class student Home** (classroom learners — weeks, calendar, teacher‑gated releases)
2. **Independent learner Home** (self‑paced — levels, no calendar, gamified)
3. **In‑class Course Map** (week‑by‑week path, gated)
4. **Independent Level Map** (all levels open, self‑paced)

The goals of the redesign:
- **Demote "featured activities."** Featured items are no longer the main focus and are **no longer required**. They become a small, optional **Spotlight strip** ("From your teacher" for in‑class / "New this week" for independent).
- **Make the learning journey the centerpiece** — a **vertical Timeline** the learner moves along, with one clear "you're here" point.
- **In‑class = Weeks** with a calendar and teacher‑controlled week releases (current week prominent, future weeks locked/hidden).
- **Independent = Levels** (numbered + a theme name), self‑paced, **no calendar**, with **dialed‑up gamification** (level/XP ring, streak, points, weekly goal, leaderboard).
- Keep the existing **"Warm Educational Modernism"** look — same palette, fonts, paper texture — but calmer and less overwhelming.

> ⚠️ This is a **redesign of an existing codebase**, not a greenfield build. The bundled HTML files are **design references** showing intended look + behavior. The task is to **recreate them inside the existing Next.js / React / Tailwind v4 app**, reusing its data layer (Prisma, NextAuth, existing queries), its design tokens in `globals.css`, and its component conventions. Do **not** ship the HTML directly, and do **not** rebuild the backend — only the presentation layer changes.

---

## Fidelity
**High‑fidelity.** Colors, typography, spacing, states, and interactions are intentional. Recreate pixel‑accurately using the app's existing tokens and component patterns. The bundled prototype is React + inline styles for portability; in the real app, use Tailwind classes / CSS variables that already exist in `src/app/globals.css`.

## Committed decision
The prototype lets you toggle three "path styles" (Trail / Timeline / Stepping Stones). **Build only the Timeline style.** The other two were exploration and should be ignored.

---

## Where each screen lives in the codebase

| Redesigned screen | Existing file to modify | Notes |
|---|---|---|
| In‑class Home | `src/app/dashboard/page.tsx` (+ `src/components/dashboard/*`) | The classroom student dashboard. |
| Independent Home | `src/app/dashboard/independent/page.tsx` (+ `IndependentDashboardClient.tsx`) | |
| In‑class Course Map | `src/app/dashboard/map/page.tsx` → `ClassCoursePath.tsx` | Currently serves all students. Add a **week‑gated** treatment. |
| Independent Level Map | `src/app/dashboard/map/page.tsx` (learner‑mode branch) or a new `dashboard/map` variant | Show **Levels**, all open. Use `getLearnerState()` to branch. |

Learner mode is already resolved server‑side via `getLearnerState(prisma, userId)` / `src/lib/learner-mode.ts` (`"classroom"` vs `"independent"`). The home route already redirects independent students to `/dashboard/independent`. Reuse this; do not add a manual toggle.

---

## Design tokens (already in `src/app/globals.css` — reuse, don't redefine)

| Token | Value | Use |
|---|---|---|
| `--primary` | `#b05740` (Academic Terracotta) | primary actions, in‑class accent |
| `--secondary` | `#6a8d73` (Library Sage) | success, goals, completed |
| `--accent` | `#e9c46a` (Parchment Gold) | highlights, avatar, streak chip |
| text / muted | `#1a202c` / `#5e6b7d` | |
| bg / surface | `#fdf9f0` paper / `#fffdfa` cards | |
| Fonts | Lora (display), DM Sans (body), Caveat (hand) | already wired via `--font-display/-body/-handwritten` |

**Unit / Level colors:** use the existing **school‑year rainbow** in `src/lib/course-map-unit-colors.ts` — `getCourseMapUnitTone(n)` returns `{ month, accent, chipBg, surface, button }` (September red → June gold). Each unit (in‑class) and each level (independent) is keyed by its number `1–10`.

Category tones (grammar=green, vocabulary=teal, quizzes=orange, games=purple, pronunciation=pink, speaking=gold) already exist as `--tone-*` variables and `getLearnerCategoryTone()`.

Radii: cards `~24px` (`--radius-3xl`-ish; prototype uses 24), inner rows `14–16px`. Shadows: the existing `--dashboard-shadow-rest` / `surface-card-shadow` are the right card elevation.

---

## ⭐ The core new component: `<ActivityTimeline>`

A vertical, connected list of activities — this is the heart of the redesign and is reused on **all four screens** (in the home "this week / this level" panel and inside each map unit/level).

**Props**
```ts
type TimelineStatus = "done" | "current" | "todo" | "locked";
interface TimelineItem {
  activityId: string;
  title: string;
  type: "guide" | "vocab" | "game" | "quiz" | "pronunciation" | "speaking" | "writing";
  estMinutes: number;
  status: TimelineStatus;
  href: string;                 // ActivityLink target
}
interface ActivityTimelineProps {
  items: TimelineItem[];
  accent: { fg: string; bg: string };   // from getCourseMapUnitTone(n) → accent + a 9–12% tint
}
```

**Layout per row** (CSS grid `34px minmax(0,1fr)`, `gap: 14px`):
- **Left rail (34px column):** a 30px status node + a vertical connector to the next row.
  - `done`: filled circle = `accent.fg`, white check icon, soft colored shadow.
  - `current`: white circle, **3px** `accent.fg` border, small `accent.fg` dot inside.
  - `todo`: white circle, 2px `--line` border, tiny grey dot.
  - `locked`: `--surface-2` circle, lock icon, muted.
  - Connector: 2.5px line; colored `accent.fg` when the row above is `done`, else `--line`.
- **Right cell (`minmax(0,1fr)` — important to prevent overflow):** a card, `borderRadius: 14`, `padding: 10px 12px`, containing:
  - **Type glyph** 36px rounded square, tinted with that activity type's tone (`--tone-*`).
  - **Title** (DM Sans 13.5px/700) + meta row: category label (in its tone color) · `⏱ {estMinutes} min`.
  - **Trailing affordance:** `current` → a small filled "▸ Start" button in `accent.fg`; `todo` → a chevron; `locked` → nothing.
  - **`current` row styling:** background `accent.bg`, border `color-mix(accent.fg 30%, transparent)`, slightly stronger shadow. **All other rows:** white surface, `--line` border, `--sh-sm`.
  - `locked` rows render at `opacity: .6`.

> **Critical:** the right column **must** be `minmax(0,1fr)` (not `1fr`) and the card‑holding div needs `min-width: 0`, or long titles cause horizontal overflow on mobile.

**Reference implementation:** `prototype/components/journey.jsx` → `TimelinePath`. (Ignore `TrailPath` and `StonesPath`.)

---

## Screen 1 — In‑class Home (`/dashboard`)

**Purpose:** A classroom learner sees their current week's path, what the teacher wants them to focus on, the calendar, and their streak.

**Desktop layout:** two columns `1fr / 322px`, max content width ~1180px, 24–26px page padding.
- **Top:** sticky app bar (logo, search pill, streak chip `🔥 N`, points chip `⚡ N`, avatar initial).
- **Announcement bar** (full width): warm gold‑tinted strip, `📣 Mrs. P:` + message. Pulls from `class.announcement` (already fetched).
- **Left column:**
  1. **Greeting** — `"Welcome back, {name}"` (name in `--primary` with a hand‑drawn sage underline) + sub line `"{weekRange} · You're doing great!"`. Keep the existing rank medal emoji logic.
  2. **★ This Week panel** (primary card): tinted header band in the current unit's color showing overline `THIS WEEK · WEEK {n}`, the week title (Lora ~23px), the week `goal` text, and a small progress ring (% of required items done). Body = **`<ActivityTimeline>`** for the current week's items. Footer: a `▸ Continue` button (in unit color) + a `Full map →` link to `/dashboard/map`.
  3. **Spotlight strip** ("From your teacher") — overline + 3 small horizontal cards (type glyph, a tag like "Focus on this" / "Optional" / "Daily", title, meta). **Optional, not required.** This replaces the old featured/required treatment.
  4. **Explore activities** card: 6 category chips (grid 6‑up), linking to `/dashboard/activities?category=…`.
- **Right column (sticky):**
  1. **Momentum card** — streak ring (`🔥 N`, longest), 7‑day activity dots, points pill.
  2. **Calendar card** — mini month calendar with event dots + an **Upcoming** list (due / class / holiday), from `class.calendarEvents` + assignment `dueDate`s (already fetched in `page.tsx`).

**Mobile layout:** single column (`grid-template-columns: minmax(0,1fr)`), order: Momentum → Greeting → Announcement → This Week panel → Spotlight (horizontal snap‑scroll) → Explore (3‑up) → Upcoming card. Sticky bottom tab bar: Home / Map / Activities / Profile (44px+ targets).

**Data:** reuse the existing `page.tsx` queries. The "This Week" items come from the current `CourseWeek` for the student's current unit (see `src/lib/course-map*.ts`); `status` is derived from `ActivityProgress` (`completed` → done, the first non‑complete required item → current, rest → todo). The old `featuredAssignments` feed the **Spotlight** instead of a required checklist.

**Reference:** `prototype/pages/home.jsx` → `InClassHome`.

---

## Screen 2 — Independent Home (`/dashboard/independent`)

**Purpose:** A self‑paced learner continues their current level, sees what's new, and stays motivated.

**Differences from in‑class:** terminology is **Levels** not weeks; **no calendar/announcement**; gamification is **dialed up**.

**Desktop:** two columns `1fr / 322px`.
- **Left column:**
  1. **Greeting** `"Welcome back, {name}"` + `"Learning at your own pace 🌱"`.
  2. **★ Your Path panel:** header overline `YOUR PATH · LEVEL {n}`, level theme name (e.g. *Home & Housing*), sub `"Self-paced — pick up where you left off."`, progress ring (% of level done). Body = **`<ActivityTimeline>`** showing a focused window (current item + next ~4–5). Footer: `▸ Continue learning` + `Level map →`.
  3. **Spotlight strip** ("New this week") — surfaces newly added optional activities (tag "New").
  4. **Explore activities** card.
- **Right column (sticky), dialed‑up gamification:**
  1. **Level/XP card:** big ring with `LVL {n}` + XP fraction (`240 / 400 XP`, "{remaining} XP to Level {n+1}"), two stat tiles (streak, total points), 7‑day dots. (Map XP to the existing points system; "XP to next level" can be derived from level thresholds.)
  2. **Weekly goal card:** `{done} of {goal} activities`, segmented progress, days left. Backed by the existing `userPreferences.weeklyActivityGoal` + `getWeeklyGoalProgress()`.
  3. **Leaderboard card:** `"You're #{rank} this week"` on the self‑paced leaderboard (existing independent leaderboard, `independentOnly`).

**Mobile:** Level/XP card → Greeting → Your Path panel → (Weekly goal + Leaderboard stacked) → Spotlight → Explore. Bottom tab bar.

**Reference:** `prototype/pages/home.jsx` → `IndependentHome`; sidebar widgets in `prototype/components/chrome.jsx` (`LevelMomentumCard`, `WeeklyGoalCard`, `LeaderboardCard`).

**Level naming:** the prototype maps the 10 curriculum units to themed level names (Foundations, Everyday Life, Your Community, Smart Choices, Home & Housing, Work‑Ready, Careers, Health, Wellbeing, Next Steps). Confirm these names with the teacher; they're easy to change in one place.

---

## Screen 3 — In‑class Course Map (`/dashboard/map`)

**Purpose:** The full week‑by‑week path, with the current week front‑and‑center and future weeks gated by teacher release.

**Desktop:** two columns `288px / 1fr`.
- **Sticky left sidebar:** "Course Map" title + sub; an **overall progress card** (ring %, `{doneWeeks}/{totalWeeks} weeks`); a **Unit nav** list (rainbow number badge per unit, title, month; completed = check badge, current = highlighted + dot, locked = lock icon); a "Practice Library" link.
- **Right column:** a vertical stack of **Unit accordion cards** (one per month/unit):
  - **Header:** rainbow unit badge (number, or lock if locked, green check overlay if complete), month overline, status chip (`Completed` / `In progress` / `Locked`), unit title, `{done}/{total} weeks` (+ "unlocks soon" if locked).
  - Completed units are **collapsed**; the **current unit is expanded by default**; locked units are collapsed.
  - **Expanded body:** a list of **Week rows**. The **current week is expanded** and shows its `goal` + an **`<ActivityTimeline>`**. Done weeks show a green check, locked weeks are disabled/greyed.

**Teacher gating (key behavior):** weeks/units after `releasedThroughWeek` are not yet available. Provide two presentations, controlled by a teacher/admin setting (prototype exposes a toggle "Show locked" vs "Hide"):
- **Show locked:** locked weeks render greyed with a lock + "unlocks soon".
- **Hide:** locked weeks are omitted; a fully‑locked future unit collapses to a slim dashed "{Month} · {Title} — unlocks when your teacher releases it" teaser, and partially‑released units show a "+N more weeks unlock soon" footer.

**Mobile:** progress card + a horizontal month‑chip scroller for wayfinding + the unit accordion stack. No left sidebar.

**Data:** reuse `getVisibleMap()`, `course-map-progress.ts`, and `course-map-navigation.ts`. Week status = `done` (week < current) / `current` / `todo` (released, future) / `locked` (beyond release).

**Reference:** `prototype/pages/map.jsx` → `InClassMap`, `InClassUnitSection`, `InClassWeekRow`.

---

## Screen 4 — Independent Level Map

**Purpose:** Same structure as the in‑class map but for **Levels**, and **everything is open** (no locking, self‑paced).

**Differences:** "Level Map" title, sub "Self‑paced · all levels open"; progress measured in **activities** (`{done}/{total} activities`); the Level nav has **no locks** (future levels are simply "Available"); each level section's body is an **`<ActivityTimeline>`** of all that level's activities (completed levels collapsed, current expanded, future available/collapsed). The desktop sidebar also repeats the Level/XP momentum card.

**Reference:** `prototype/pages/map.jsx` → `IndependentMap`, `IndependentLevelSection`.

---

## Interactions & behavior
- **Timeline `current` row** is the primary CTA → navigates to the activity (`ActivityLink` / `href`). `todo` rows navigate too; `locked` rows are inert.
- **Accordion** unit/level headers toggle open/closed; current is open on load.
- **Progress rings** animate `stroke-dashoffset` ~0.8s ease‑out on mount.
- **Entrance animation:** rows fade/translate in with a small per‑item stagger. **Start the keyframe at `opacity: .55` (not 0)** and gate decorative motion behind `prefers-reduced-motion` so print/PDF/reduced‑motion always show content.
- **Hover:** category chips lift 2px; cards use the existing `card-hover-lift`.
- **Responsive:** the app already uses a `lg` breakpoint to switch desktop/mobile layouts in these pages — keep that. Every mobile container must be width‑constrained (`grid-template-columns: minmax(0,1fr)`) and horizontal strips (Spotlight, month chips) must be self‑contained scrollers, or content overflows the viewport.
- **Bottom nav** (mobile) and **sticky sidebars** (desktop) as today.

## State
No new global state. Server components fetch as they do now (enrollments, assignments, calendar events, progress, preferences, leaderboard). Client interactivity is limited to accordions and the weekly‑goal editor (already a client component, `IndependentDashboardClient.tsx`).

## Assets
- Icons: simple stroked SVGs (flame, bolt, trophy, calendar, check, lock, chevron, play, target, etc.). The prototype inlines them; map to the app's existing `@/components/icons/Icons` set where equivalents exist.
- Activity type glyphs use emoji (📖 🗂️ 🎮 ✏️ 🔊 🎤 ✍️) — matches the app's current convention in `ClassCoursePath`/course‑map code.
- No new image assets. Paper texture + gradients are CSS, already present in `globals.css`.

## Files in this bundle
- `prototype/Class Companion Redesign.html` — the interactive prototype (open it; switch to **Timeline + Desktop/Mobile** to see the committed design). Open this file directly — its assets sit alongside it in `prototype/`.
- `prototype/assets/tokens.css` — token reference (mirrors the app's existing variables).
- `prototype/assets/data.js` — sample content model (the real curriculum mapped to weeks & levels) so you can see expected shapes.
- `prototype/components/primitives.jsx` — icons, progress ring, week dots, type glyph, pill, button, overline.
- `prototype/components/journey.jsx` — **`TimelinePath` is the component to build** (ignore `TrailPath`/`StonesPath`).
- `prototype/components/chrome.jsx` — app bar, bottom nav, momentum/level/calendar/goal/leaderboard/spotlight/category widgets.
- `prototype/pages/home.jsx`, `prototype/pages/map.jsx` — the four screens.
- `prototype/app.jsx` — shell + page/device/style switching (review tooling only; not part of the product).
