# Independent Learner Flow

This document defines the recommended activity flow for learners who are not enrolled in a class.

It is meant to support:
- friends of students who want app access without joining a class
- former/graduated students who should keep learning after the course ends
- future self-paced learners using the app independently

## Goals

- Give independent learners a clear next step instead of an empty class dashboard
- Keep the experience structured without requiring teacher assignments
- Preserve points, streaks, and leaderboard motivation
- Surface new content without breaking the main learning path

## Product Model

Independent learners should use a self-paced path, not a fake class.

That means:
- no class enrollment required
- no teacher announcements
- no class checklist
- no class-scoped leaderboard assumptions
- yes to guided progression
- yes to gamification
- yes to access to the broader activity library

## Dashboard Structure

The independent learner dashboard should have 3 main areas:

1. `Recommended Activities`
- Shows the single next activity in the guided sequence
- Advances only when the current step is completed
- Acts as the main “what should I do next?” card

2. `New This Week`
- Shows newly released learner-visible activities
- Should not replace or reorder the main recommendation sequence
- Exists to help learners notice fresh content without losing their path

3. `All Activities`
- Keeps the full library available for browsing and review
- Supports independent exploration outside the guided path

## Current Recommended Sequence

The curated sequence spans 3 stages with 13 activities total:

### Stage 1 (Beginner)
1. `Present Simple Guide`
2. `Daily Vocab Review`
3. `Unit 1 Vocabulary: Getting to Know You`
4. `Minimal Pairs Listening Lab`
5. `Verb Forms Challenge`

### Stage 2 (Intermediate)
6. `Present Continuous Guide`
7. `Unit 2 Vocabulary: Daily Life in the Community`
8. `Countable vs Uncountable Practice`

### Stage 3 (Advanced)
9. `Past Simple Guide`
10. `Unit 3 Vocabulary: Community Participation`
11. `Simple Tenses Review`
12. `Continuous Tenses Review`
13. `Zero & First Conditionals`

These map to the current implementation in [src/lib/independent-learning.ts](../../src/lib/independent-learning.ts).

## How to Access

Independent learners can join via:
- **Invite links** - Existing users can share invite links from `/dashboard/invite`
- **Registration** - New users register at `/join?code=INVITECODE`
- **Mode switch** - Enrolled students can switch to independent mode in Account Settings

## Progression Rules

### General rule
- Only one main recommendation is shown at a time
- When that activity is completed, the next activity in sequence becomes recommended

### Completion rules
- Grammar guides count as completed only when the learner passes the related checkpoint with a score above 70
- Other activities count as completed when progress status is `completed` or the learner has a completed submission

### If all sequence items are completed
- The learner should still see `New This Week` content when available
- The learner should still be able to browse `All Activities`
- In a future version, the sequence should continue into additional units rather than ending at the current starter path

## New Content Rules

New content should be handled separately from the main sequence.

Rules:
- A new release is anything within the defined “new” time window
- New items appear in `New This Week`
- New items do not interrupt the current recommended step
- New items should remain optional exploration, not required sequence blockers

## Gamification Rules

Independent learners should stay inside the gamification system.

They should have:
- points
- streaks
- achievements
- an `independent` leaderboard pool

They should not be mixed into a live class leaderboard unless they are in classroom mode.

## Recommended Expansion Pattern

The long-term flow should move from a flat starter sequence into unit-based progression.

Recommended unit pattern:
- 1 grammar anchor
- 1 checkpoint or review
- 1 vocabulary activity
- 1 game or practice activity

Example shape:
- Unit 1: Present Simple -> review/checkpoint -> vocab -> game
- Unit 2: Past Simple -> review/checkpoint -> vocab -> game
- Unit 3: Present Continuous -> review/checkpoint -> vocab -> game

This is stronger than flat recommendations because it:
- reduces overwhelm
- feels intentional
- gives learners a sense of progress
- works for both brand-new and former students

## Former Student Transition

When a course ends, former students should move into the independent learner experience instead of being left in classroom mode.

They should keep:
- existing account
- past progress
- points
- streaks
- achievements
- access to the independent leaderboard

They should lose:
- teacher-driven checklist pressure
- class announcements
- class-specific dashboard assumptions

### How the transition works (schema level)

The `ClassEnrollment.status` field tracks where a student is in their journey:

| Status | Meaning |
| --- | --- |
| `active` | Currently enrolled and attending |
| `exited` | Dropped or stopped attending — record kept for history |
| `graduated` | Completed the class, transitioned to independent mode |

When a student is marked `graduated`:
1. `ClassEnrollment.status` → `"graduated"`, `statusChangedAt` = now
2. No active enrollment remains, so the dashboard resolves as independent
3. Points, streak, and achievements are untouched

When a returning student re-enrolls in a future class:
1. New `ClassEnrollment` row created with `isReturning = true`
2. The active enrollment resolves the dashboard as classroom
3. All prior history and points carry over — nothing resets

See [data-structure-summer-2026.md](data-structure-summer-2026.md) for the full schema reference.

## Suggested Next Expansion

The next version of this plan should define:
- the next 3 to 5 units after the current starter sequence
- which vocab activity should pair with each grammar anchor
- which game or practice activity should close each unit
- whether checkpoints should always be grammar review guides or sometimes quizzes/games
