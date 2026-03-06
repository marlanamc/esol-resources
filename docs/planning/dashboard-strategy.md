# Dashboard Strategy Notes

This note is here to keep the dashboard directions organized while multiple versions are being explored.

## Current Dashboard Routes

### `/dashboard`
- Primary dashboard for current students who are enrolled in a class.
- This is the current live classroom-oriented experience.
- Main job:
  - show checklist
  - show teacher announcements
  - show due dates / calendar context
  - support the current class workflow

### `/dashboardv2`
- Experimental alternative for the student dashboard.
- Still focused on enrolled students.
- Main job:
  - explore a better student home experience
  - improve motivation / continuation flow
  - test a new structure before deciding whether it should replace or influence `/dashboard`

### `/dashboardv3`
- Experimental dashboard for learners who are not enrolled in a class.
- Main job:
  - support self-paced learning
  - allow adults to use the app without being in a course
  - give structure without requiring teacher-assigned work

## Learner States We Need To Support

### 1. Enrolled student
- Currently in an active class.
- Needs:
  - class checklist
  - announcements
  - due dates
  - class calendar
  - class-specific navigation

### 2. Non-enrolled self-paced learner
- Never joined a class, or wants to use the app independently.
- Needs:
  - structured self-paced path
  - clear next steps
  - progress visibility
  - optional class join CTA
- Likely does **not** need:
  - teacher checklist
  - class announcements
  - class-scoped leaderboard assumptions

### 3. Former student / course ended learner
- Was in a class before, but the course ended or they left.
- Still should keep access to the app.
- Needs:
  - continued access to completed work
  - a self-paced next step
  - preserved progress/history
- Likely does **not** need:
  - active class checklist
  - current teacher assignment pressure
  - class reminders that no longer matter

## Important Product Thought

The “former student” state may not need a totally separate dashboard.

A simpler approach may be:
- enrolled student -> classroom dashboard
- non-enrolled learner -> self-paced dashboard
- former student -> self-paced dashboard **with existing history/progress carried forward**

That would mean the future “course ended” experience could potentially be a version of `/dashboardv3`, not a brand new `/dashboardv4`.

## Product Tension

One of the main product questions is whether this is:
- an LMS for active classes
- a standalone English learning app
- or one platform that supports both

Right now it is trying to do both, which is why dashboard planning feels complicated.

### LMS mode
- built around an active teacher-student relationship
- centered on assigned work
- uses checklist, due dates, announcements, and class structure
- helps students keep up with a live course

### Self-paced app mode
- built around learner independence
- centered on progression and repeatable practice
- uses units, pathways, review, and “continue learning” flows
- should still make sense with no teacher involved

### What should likely be shared
- authentication and learner accounts
- progress history
- completed activities
- grammar/vocabulary/game content library
- streaks / points / achievement systems where useful

### What should likely stay separate
- class checklist vs self-paced unit progression
- teacher announcements vs personal learner guidance
- due dates / calendar pressure vs evergreen learning flow
- class-specific navigation vs independent learner navigation

### Working lens for future decisions
- If a feature only makes sense because a teacher assigned it, it belongs to classroom mode.
- If a feature still makes sense with no teacher, it belongs to self-paced mode.

### Long-term possibility
- It is possible this eventually becomes two separate apps.
- That does **not** mean it should split yet.
- Near-term, the cleaner approach is probably:
  - one platform
  - shared accounts and content
  - two clear modes: classroom and self-paced

This framing may help avoid premature app-splitting while still allowing the dashboards to evolve in different directions.

## Direction For Self-Paced Learning

Flat recommendations may not be enough.

A more organized model would be unit-based, for example:
- Unit 1 = grammar + vocabulary + game/practice
- Unit 2 = grammar + vocabulary + game/practice
- Unit 3 = grammar + vocabulary + game/practice

Example pattern:
- `Unit 1`: Present Perfect + Unit 1 vocab + a game/practice activity
- `Unit 2`: Past Simple + Unit 2 vocab + a game/practice activity
- `Unit 3`: Present Continuous + Unit 3 vocab + a game/practice activity

Why this may be better:
- gives learners a path
- reduces overwhelm
- feels intentional
- makes self-paced learning feel closer to a course
- works for both brand new independent learners and former students

## Open Questions

### Should `/dashboardv3` be recommendation-based or unit-based?
- Current instinct: unit-based is stronger.

### Should former students get their own dashboard route?
- Current instinct: probably no.
- Better option may be to move them into the self-paced learner experience while preserving past class progress.

### What changes when a course ends?
- Checklist should likely disappear.
- Completed work should still be visible.
- Progress should carry into a self-paced path.

### What should define a self-paced unit?
- likely one grammar anchor
- one vocabulary set
- one practice/game activity
- maybe a checkpoint every few units

## Working Assumption For Now

Short-term:
- `/dashboard` = active enrolled students
- `/dashboardv2` = student dashboard experiment
- `/dashboardv3` = non-enrolled learner experiment

Long-term:
- active class learners and self-paced learners may be the two real product states
- “former student” may become a subtype of self-paced learner rather than its own dashboard family
