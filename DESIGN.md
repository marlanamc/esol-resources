---
name: My ESOL Class
description: A warm, paper-toned classroom companion for adult ESOL learners on their phones.
colors:
  terracotta: "#b05740"
  terracotta-deep: "#8e4432"
  terracotta-soft: "#d08b78"
  sage: "#6a8d73"
  sage-deep: "#4d6b53"
  sage-soft: "#8da693"
  mustard: "#e9c46a"
  mustard-deep: "#cba342"
  mustard-soft: "#f4e4a8"
  error-red: "#d64045"
  warning-clay: "#ca5c43"
  info-harbor: "#4a8ca0"
  ink: "#1a202c"
  ink-muted: "#5e6b7d"
  ink-faint: "#94a3b8"
  cream-paper: "#fdf9f0"
  cream-light: "#f7f2e8"
  cream-sand: "#f2ead3"
  off-white: "#fffdfa"
  shell-linen: "#f6f3ee"
  card-linen: "#fcfbf9"
  surface-contrast: "#f3ebdf"
  tone-grammar: "#3d8e42"
  tone-vocabulary: "#268a82"
  tone-quizzes: "#c44a28"
  tone-games: "#7d3fa6"
  tone-pronunciation: "#db2777"
  tone-speaking: "#b56e1a"
  tone-info: "#3b7cb8"
  unit-1: "#B0432B"
  unit-2: "#8A5A0B"
  unit-3: "#4B6B1F"
  unit-4: "#1E6E5C"
  dark-bg: "#0d1620"
  dark-surface: "#162b3d"
  dark-primary-sky: "#7fb3d5"
  dark-ink: "#e8f1f8"
typography:
  display:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "-0.025em"
  legible:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
  handwritten:
    fontFamily: "Caveat, cursive"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  4xl: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.sage-deep}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.cream-light}"
  card:
    backgroundColor: "{colors.card-linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  chip-grammar:
    backgroundColor: "#eef4ec"
    textColor: "#2d6930"
    rounded: "{rounded.full}"
  chip-vocabulary:
    backgroundColor: "#edf5f4"
    textColor: "#1a6560"
    rounded: "{rounded.full}"
  bottom-nav:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.ink-muted}"
    height: "56px"
---

# Design System: My ESOL Class

## Overview

**Creative North Star: "Warm Educational Modernism"**

The app feels like a good classroom handout printed on warm cream paper: terracotta ink, sage and mustard highlights, and serif headings with a bookish, human feel. It is a modern, phone-first interface, but every surface is tinted warm. Pure white and cold gray are avoided on purpose: backgrounds are cream (`cream-paper`), cards are linen (`card-linen`), and even "white" is an off-white (`off-white`). The result is calm and adult. It respects tired learners instead of shouting at them.

Density is moderate. Cards hold one idea each, there's generous padding (24px), and touch targets are big (48px buttons, 56px bottom nav). Color carries meaning more than decoration. Each activity type (grammar, vocabulary, quizzes, games, speaking, pronunciation) has its own tone family, and each course unit has its own accent. Learners can find things by color before they read the words.

The confirmed anti-references are **cold corporate SaaS** (sterile gray/blue enterprise dashboards) and **kiddie or cartoonish** styling (bubbly, childish game-app visuals). Gamification lives inside the same warm, grown-up material.

**Key Characteristics:**
- Warm cream paper ground, never pure white or cool gray
- Terracotta primary, sage secondary, mustard accent
- Lora serif headings over DM Sans body; Atkinson Hyperlegible available for reading-heavy content
- Color-coded tone families per activity type and per unit
- Soft, layered, warm-brown shadows; cards lift gently on hover
- A separate dark mode on deep navy with a soft sky-blue primary
- Phone-first: fixed bottom nav, 44px+ targets, a Large Text option

## Colors

An earthy, warm palette: terracotta, sage and mustard on cream, with a disciplined set of tone families for wayfinding.

### Primary
- **Academic Terracotta** (`terracotta`): main actions, active states, links, focus rings (at 50% alpha). `terracotta-deep` is the hover/pressed state and the colored-text variant (`--primary-text`). `terracotta-soft` is for tints and decorative fills.

### Secondary
- **Garden Sage** (`sage`): supportive actions, completed and positive states. `sage-deep` doubles as the success color and is the safe choice for filled buttons with text on them.

### Tertiary
- **Warm Mustard** (`mustard`): highlights, points, streak and achievement moments. Use it as a fill or background, never as text on cream.

### Neutral
- **Classroom Ink** (`ink`): body text and headings.
- **Slate Pencil** (`ink-muted`): secondary text and metadata (passes AA on cream).
- **Faint Pencil** (`ink-faint`): icons, placeholders and disabled hints only. It does not pass contrast for readable text.
- **Cream Paper** (`cream-paper`): the page background. It sits under a very faint cross pattern and a cream gradient.
- **Cream Light / Cream Sand** (`cream-light`, `cream-sand`): recessed areas, ghost-button hover, tracks.
- **Off-White** (`off-white`): text on accent fills, raised surfaces, the bottom nav.
- **Shell Linen / Card Linen** (`shell-linen`, `card-linen`): the dashboard shell and card faces.
- **Borders**: warm translucent browns (`rgba(207,191,171,0.65)` subtle, `rgba(180,165,145,0.85)` strong). Dashboard cards use `rgba(0,0,0,0.08)`.

### Status
- **Error Red** (`error-red`), **Warning Clay** (`warning-clay`), **Harbor Blue** (`info-harbor`).

### Tone families
Each activity type has a five-part family (`surface`, `surface-muted`, `border`, `accent`, `accent-strong`, plus chip bg/text), defined as `--tone-<type>-*` in `src/app/globals.css`. The accents are grammar `tone-grammar`, vocabulary `tone-vocabulary`, quizzes `tone-quizzes`, games `tone-games`, pronunciation `tone-pronunciation`, speaking `tone-speaking`, and info `tone-info`. Reading reuses vocabulary and writing reuses grammar. Calendar events have their own muted family (`--tone-event-*`), and course units use `unit-1` through `unit-4`.

### Dark mode
Dark mode (`.dark` / `[data-theme="dark"]`) is its own palette, not an inverted one. The ground is deep navy (`dark-bg`) with `dark-surface` cards. The primary becomes a soft sky blue (`dark-primary-sky`), secondary becomes mint `#6fbf9f`, and mustard lightens to `#f5d98a`. Text is `dark-ink`.

### Named Rules
**The No Cold White Rule.** Surfaces are cream, linen or off-white. Pure `#fff` appears only inside form inputs and checkboxes.

**The Color Means Something Rule.** Tone families mark activity type and unit accents mark course units. Never borrow a tone color just for decoration, or it stops working as a signal.

**The Text-On-Fill Rule.** Filled buttons with text use `terracotta`, `sage-deep` or darker. Mid `sage` (#6a8d73) and `warning-clay` fall below 4.5:1 with white text.

## Typography

**Display Font:** Lora (fallback ui-serif, Georgia)
**Body Font:** DM Sans (fallback ui-sans-serif, system-ui)
**Reading Font:** Atkinson Hyperlegible, for content where legibility matters most
**Accent Font:** Caveat (handwritten), used sparingly

**Character:** A bookish serif paired with a friendly geometric sans. Headings feel like a printed textbook and body text feels like a clear modern app. Every stack includes color-emoji fallbacks, because guide content uses emoji avatars.

### Hierarchy
- **Headings (h1–h6)** (Lora 700, letter-spacing -0.02em): all headings come from the base rule. Sizes are set per use with Tailwind text utilities; there are no fixed heading sizes.
- **Body** (DM Sans 400, 16px, line-height 1.6): all running text and UI.
- **Label** (DM Sans 700, 10px, tracking tight): bottom-nav tab labels. Other labels use `text-sm` with font-medium/semibold.

### Named Rules
**The Large Text Rule.** All type is rem-based. The Large Text setting (`html[data-font-size="large"]`) scales the root to 118.75%, so never use fixed px font sizes for readable text.

**The Serif Is For Headings Rule.** Lora is for headings only. Body, controls and labels stay in DM Sans or Atkinson.

## Layout

The layout is phone-first. On mobile a fixed bottom nav (56px, `md:hidden`) carries the main destinations, and pages pad their bottom to clear it. Containers are centered with 16px side padding (24px from `md` up). The breakpoints are Tailwind defaults: 640 / 768 / 1024 / 1280. The spacing rhythm is 4 / 8 / 16 / 24 / 32. Cards use 24px internal padding (`p-6`), with dividers between header, body and footer. Layouts are tested down to 320px with no horizontal overflow; the body uses `overflow-x: clip`, which keeps sticky headers working.

Note: Tailwind v4 reads tokens from `@theme` in `src/app/globals.css`. `tailwind.config.ts` isn't loaded (there's no `@config`), so its radius and shadow values aren't live.

## Elevation & Depth

Surfaces are soft and lifted. Cards rest on layered, diffuse, warm-brown shadows with a 1px inner highlight on the top edge, like heavy paper catching light. On hover they lift 2px and the shadow deepens. Buttons have their own small shadow that grows on hover. In dark mode, shadows switch to deeper navy-black values instead of disappearing.

### Shadow Vocabulary
- **Card rest** (`--dashboard-shadow-rest`): inset top highlight plus 1px hairline and three warm-brown layers. The default for dashboard cards.
- **Card hover** (`--dashboard-shadow-hover`): the same structure, stronger. Paired with `translateY(-2px)`.
- **Shell** (`--dashboard-shell-shadow`): the large, very soft shadow around the dashboard frame.
- **Pill / Button** (`--dashboard-pill-shadow`, `--dashboard-button-shadow`, plus hover variants): small lifted controls.
- **Simple elevation** (`--elevation-card` `0 6px 20px rgba(40,31,23,0.06)`, `--elevation-raised`, `--elevation-button`): single-layer versions for components.

### Named Rules
**The Warm Shadow Rule.** Shadows are tinted warm brown (`rgba(40,31,23,…)` / `rgba(52,43,34,…)`), never neutral black at high opacity.

**The Fallback Rule.** New components pass the light shadow value as a `var()` fallback, and component-specific tokens live in a CSS module next to the component. A missing variable fails silently in production.

## Shapes

Corners are gently to generously rounded and nothing is sharp. Buttons and inputs use 8px (`rounded.md`; large buttons 12px). Cards use 20px (`rounded.2xl`). Nav hit areas use 12px. Chips, badges and pills are fully round. Borders are 1px warm hairlines; the outline button uses a 2px border.

## Components

### Buttons
Buttons should feel solid, warm and easy to tap.
- **Shape:** gently rounded (8px; 12px at `lg`).
- **Sizes:** sm 40px, md 48px, lg 56px minimum height.
- **Primary:** terracotta fill with off-white text and a small shadow.
- **Hover / Focus / Active:** hover darkens (`brightness-90`) and deepens the shadow. Focus shows a 2px terracotta ring at 50% with a 2px offset. Pressing scales to 95%. Transitions run 300ms.
- **Secondary / Success / Warning:** the same shape with sage, success or warning fills.
- **Outline / Ghost:** transparent. Outline has a 2px warm border; ghost hovers to `cream-light`.

### Chips / Badges
- **Style:** pill-shaped, semibold, 1px border, small shadow. Colors come from the matching tone family's `chip-bg` / `chip-text`.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** `card-linen`, with a `rgba(0,0,0,0.08)` border.
- **Shadow Strategy:** card rest, lifting to card hover when clickable (see Elevation & Depth).
- **Internal Padding:** 24px, with divider lines between header, body and footer.

### Inputs / Fields
- **Style:** `.form-field`: white fill, 1px gray-300 border, 8px radius, 8px × 12px padding, small shadow.
- **Focus:** the border turns terracotta, plus a 1px terracotta ring at 30%.
- **Dark:** translucent white fill (5%) with a white/20 border.

### Navigation
- **Mobile bottom nav:** fixed, full width, 56px tall, top border, hidden from `md` up. Each tab has a 28px icon over a 10px bold label and a 12px-radius hit area with an inset focus ring. Motion is 120–140ms ease-out.
- **Back buttons:** contextual back and course-map return buttons sit at the top of activity pages.

### Course Map Road (signature)
The course map shows each week as a road with a rail, Next / Done / Locked rows, and unit-colored accents. Its tokens are scoped to `src/components/dashboard/course-map-road/road.module.css`.

## Do's and Don'ts

### Do:
- **Do** build on the tokens in `src/app/globals.css` (`--color-*`, `--tone-*`, `--unit-*`, `--dashboard-*`), and put new component-specific tokens in a CSS module next to the component.
- **Do** use the activity's tone family whenever you show an activity type, and unit accents for course units.
- **Do** keep touch targets at 44px or more (buttons 48px by default) and keep the visible terracotta focus ring.
- **Do** check every new surface in both light and dark mode, at 320px wide, and with Large Text on.
- **Do** respect `prefers-reduced-motion`; the global guard in `globals.css` covers decorative motion.

### Don't:
- **Don't** make it look like cold corporate SaaS: no pure white surfaces, no cool gray backgrounds, no sterile blue-gray dashboards in light mode.
- **Don't** make it kiddie or cartoonish: no bubbly display fonts, no childish mascots, no candy-colored reward explosions. Learners are adults.
- **Don't** put white text on mid `sage` or `warning-clay`, or use `ink-faint` / mustard as text on cream.
- **Don't** use fixed px font sizes for readable text; they break Large Text.
- **Don't** add new design tokens only to `globals.css` without a `var()` fallback. Stale builds have shipped CSS without the new variables before.
