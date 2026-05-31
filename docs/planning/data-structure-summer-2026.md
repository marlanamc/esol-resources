# Data Structure — Summer 2026

This document is the living reference for schema decisions made during the summer 2026 build. It covers what was added, why, and what still needs to be figured out.

## What was added (May 2026)

### `ClassEnrollment` — new fields

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `status` | `String` | `"active"` | Tracks where a student is in their journey |
| `statusChangedAt` | `DateTime?` | — | When status last changed |
| `statusNote` | `String?` | — | Free-text teacher note ("Dropped week 8", "Graduated Spring 2026") |
| `isReturning` | `Boolean` | `false` | True when a student re-enrolls in a future class |

**`status` values:**

| Value | Meaning |
| --- | --- |
| `active` | Currently enrolled and attending |
| `exited` | Dropped or stopped — record kept for history, not shown on active roster |
| `graduated` | Completed the class, moved to independent learner mode |

**Migration:** `20260531120000_add_enrollment_status_and_learner_mode`

---

### `User` — new fields

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `learnerMode` | `String` | `"class"` | Controls which dashboard the student sees |

**`learnerMode` values:**

| Value | Meaning |
| --- | --- |
| `class` | Teacher-driven dashboard — assignments, class path, class leaderboard |
| `independent` | Self-directed dashboard — guided track, browse, personal progress |

**Migration:** `20260531120000_add_enrollment_status_and_learner_mode`

---

## How the pieces connect

### Graduating a student (end of year)

1. Set `ClassEnrollment.status` → `"graduated"`, `statusChangedAt` → now, optional `statusNote`
2. Set `User.learnerMode` → `"independent"`
3. Points, streak, and achievements carry over untouched

### Marking a student as exited (dropout)

1. Set `ClassEnrollment.status` → `"exited"`, `statusChangedAt` → now, optional `statusNote`
2. `User.learnerMode` stays `"class"` — they may re-enroll later
3. Enrollment record is kept for history, student disappears from active roster

### Re-enrolling a returning student

1. Create new `ClassEnrollment` row with `isReturning = true`
2. Set `User.learnerMode` → `"class"` automatically on join
3. All prior points, streak, and achievements carry over — nothing resets
4. Old enrollment rows stay intact — full history is always visible

---

## Spring 2026 Level 3 Roster

These 16 students are the active cohort as of the end of Spring 2026. Everyone else has exited.

Andrea, Carolina, Tolesa, Ingrid, Elena, Ever, Karina, Carlos M, Edwar, Sonia, Erica, Carlos O, Julian, Hazel, Evelyn, Susan

When class ends, these students should be transitioned to `graduated` + `learnerMode = "independent"`.

---

## Open questions for summer 2026

Things to think through and decide before or during the summer build:

- [ ] **Self-directed track structure** — how many stages, which activities map to each stage, how does it connect to the existing activity library
- [ ] **Graduated student onboarding** — what do students see the first time they log in after graduating? Is there a transition message or prompt?
- [ ] **Independent leaderboard scope** — do independent learners compete against each other globally, or is it opt-in?
- [ ] **Teacher roster UI** — where in the teacher dashboard does the status management live? Is it per-class or in a separate students view?
- [ ] **Re-enrollment flow** — does re-enrollment automatically detect a returning student and set `isReturning`, or is it a manual teacher action?
- [ ] **`ActivityProgress` and stage tracking** — do we need a new model to track which stage of the self-directed track a learner is on, or can we derive it from existing `ActivityProgress` rows?
- [ ] **Cohort tagging** — should there be a formal cohort label (e.g. "Spring 2026") on `ClassEnrollment` for easier historical reporting, or is `statusNote` enough?

---

## Related docs

- [independent-learner-flow.md](independent-learner-flow.md) — product model and UX rules for independent mode
- [New ESOL LMS/](New%20ESOL%20LMS/) — prototype and design direction (Hearth theme, self-directed track)
- [dashboard-strategy.md](dashboard-strategy.md) — existing dashboard structure
