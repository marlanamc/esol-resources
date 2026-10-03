# Story review rubric

Use this to read each packet in [packets/](packets/), which `npm run audit:stories` builds. The automatic signals at the top of a packet are hints. This read is what decides.

Read the packet the way a tired adult student would after a work shift: once, from top to bottom, without the grammar notes.

## Score each area 1–3

| Area | 3 (good) | 2 (okay) | 1 (fix it) |
|---|---|---|---|
| **Clear** | I can say what happens in one sentence. Each scene follows from the last one. | I can follow it, but a jump in time or place needs a second read. | I can't tell who these people are or what's going on. |
| **Makes sense** | Jobs, times, places and relationships stay the same all the way through. People act like real adults. | One small slip (Tuesday becomes Wednesday, a sister becomes a cousin). | A contradiction, or something no real person would say or do. |
| **Not cringe** | People talk the way students hear English at work and on the bus. It's warm without preaching. | One line is a little stiff or a little too cheerful. | Pep talk, forced enthusiasm, a lesson in disguise, slang that tries too hard, or everyone being relentlessly nice. |
| **Theme fit** | The story *is* the week's theme (see the Theme line). The grammar comes up naturally inside it. | The theme is there, but only as background. | The story ignores the week's theme, or the theme is pasted into a caption. |
| **Worth reading** | There's a small problem, a deadline, a surprise or a laugh, and it pays off. | It's pleasant, but nothing happens. | Characters just describe their routines. |

## Specific things to catch

- **Exercises and quiz break the story:** a new name appears without an introduction, someone's job changes, or a question asks about something the story never said.
- **The scene photo contradicts the caption.** For example, the caption says "the kitchen" and the photo shows a classroom.
- **Survival-mode reality.** Characters have jobs, shifts, kids, bills and appointments. Watch for free-time hobbies or volunteering every week (see [docs/grammar-guide-authoring-spec.md](../../grammar-guide-authoring-spec.md), Real-world tone).
- **Teacher's-pet lines:** a character announces the grammar ("I'm using the present perfect!") or thanks the class for learning.
- **Too many exclamation points.** Real texts have some. A whole dialogue of them reads as fake cheer.
- **Disconnected vignettes.** These are fine for a review guide. In a single-topic guide, one story usually works better.

## Output per guide

```
### <Guide title> (`slug`), Week N
Scores: Clear 3 · Sense 2 · Cringe 3 · Theme 2 · Interest 1 → **Revise** | Polish | Keep
One-line story: ...
Problems:
- <section or quiz item>: <what's wrong>, quoted line
Best fix: <one concrete idea, e.g. "give Rosa a deadline: the clinic closes at 5">
```

Verdict: **Keep** means all scores are 3, or there's a single 2. **Polish** means there are 2s but no 1s. **Revise** means any score is 1.
