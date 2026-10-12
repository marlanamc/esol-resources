# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Installable PWA (`public/manifest.json`, `start_url: /dashboard`, portrait). Mobile web is the primary learner context; a native wrapper is not planned.

## Users

**Primary: adult ESOL learners** in the teacher's own classes at an East Boston adult-ed program, mostly Level 3. Many work two or three jobs (restaurants, construction, cleaning, warehouse, home care) and have children to care for. They practice English between shifts, on the bus, on a break, or after the kids are asleep, almost always on a phone. Home languages in the room include Spanish, Haitian Creole, Somali, Portuguese, Vietnamese, Arabic, Cantonese, Khmer, Tagalog and Bengali. Their job in the app: know what to do this week, do it, and see that it counted.

A smaller group are **independent learners** who are not enrolled in a class and follow a staged learning path on their own.

**Secondary: the teacher** (one teacher/admin account, plus `teacher_admin` normalized to teacher) who plans weeks, assigns and releases activities, reviews submissions, and watches who needs help.

## Product Purpose

My ESOL Class is a classroom companion that keeps learners practicing between class meetings. It exists because students drop off when they don't know what to do next. Success means students always have a clear "next up," finish their weekly work, and keep coming back.

## Positioning

Built by the teacher who teaches the class, around her actual curriculum, calendar, and students. Content reflects learners' real lives (shifts, landlords, clinic visits, bus transfers), not generic textbook scenarios. A generic LMS or language app can't copy that fit.

Productizing for other teachers/programs (`docs/PRODUCTIZATION_ROADMAP.md`) is a someday possibility: don't design for it yet, but avoid choices that would block it (e.g. keep platform vs. curriculum concerns separable).

## Operating Context

- Class meets on a weekly calendar; the classroom "current week" comes from the calendar (Monday midnight ET), not from student progress.
- Course is moving toward a guided linear path: units of micro-modules (review, practice, apply, discover a new tense) with a "Next up" card and soft guidance, not hard gates.
- Teacher releases content over time; learners only see released grammar guides, speaking tasks and quizzes.
- Activity types: grammar guides and mini-quizzes, vocab (flash cards, weekly vocab, review), speaking, writing, games (verb quizzes, parts of speech, comparison battle), reference sheets, café catch-up.
- Gamification motivates: points, weekly points, streaks, achievements, weekly leaderboard (classroom and independent boards are separate).
- Connectivity can be unreliable; an offline submission outbox exists behind a flag, and iOS PWA users sometimes need an escape hatch to Safari.
- The school has no computer lab; learners use their own phones (and a "computer class" exists).

## Capabilities and Constraints

- Next.js (non-standard version; see CLAUDE.md), Prisma/Postgres, NextAuth, Vercel. Roles: `student`, `teacher`, `admin`.
- Teacher surfaces: `/teach` and teacher views in `/dashboard` (classes, students, gradebook, calendar, course map, reports, stats).
- Learner surfaces: `/dashboard`, `/activity`, `/grammar-reader`, `/grammar-map`, `/vocab`, games.
- Printable FY27 worksheets/handouts live in the repo but are **out of scope** for this product record.
- The teacher is self-funded; prefer free and low-cost tooling and services.

## Brand Commitments

- Name: **My ESOL Class** (short: **My ESOL**), defined in `src/lib/brand.ts`.
- Voice toward learners: plain, respectful, adult. Students are tired and doing hard things; skip inspirational filler and childish gamified cheerleading. Gamification motivates without being Duolingo.
- Learner content uses real East Boston settings and a diverse cast (skin-tone-varied avatars, names and languages from the actual room); see `docs/grammar-guide-authoring-spec.md` and `docs/grammar-guide-cast.md`.
- Don't invent school facilities, programs, or services.

## Evidence on Hand

- Curriculum content in `src/content/` (grammar guides, quizzes, speaking, reference sheets, café catch-up) and `scripts/vocab/weekly-vocab-data.js`.
- Course map data in `src/lib/course-map-data.ts`.
- No testimonials, outcome metrics, or third-party endorsements exist; don't fabricate any.

## Product Principles

1. **Always a clear next step.** A learner opening the app should know what to do this week within seconds.
2. **Respect the learner's time and life.** Short sessions, phone-first, forgiving of missed days; real-life contexts, adult tone.
3. **Reward real practice honestly.** Points and streaks reflect actual completed work through the ledger, never shortcuts.
4. **Plain English for language learners.** UI copy is short, concrete and low on metalanguage; icons and structure carry meaning where words might fail.
5. **The teacher's workflow stays light.** Planning, releasing and reviewing should take minutes, not evenings.

## Accessibility & Inclusion

- Target WCAG 2.2 AA (see `docs/ACCESSIBILITY_AUDIT.md`): 4.5:1 text contrast, visible focus, 44px touch targets, proper landmarks and heading order.
- Users are English language learners: favor simple vocabulary, short sentences, and consistent labels; don't rely on idioms.
- Light and dark mode are both supported and must both stay legible.
- Small phones (320px wide) and unreliable connections are normal, not edge cases.
