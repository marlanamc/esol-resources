# Timeline Tenses — Game Improvement Roadmap

Pedagogical gaps and feature suggestions for making this a fully thought-out adult ESOL learning tool. Organized by theme, with rough effort estimates.

**Effort scale:** 🟢 Small (hours) · 🟡 Medium (days) · 🔴 Large (week+)

---

## 1. In-game reference & scaffolding

These address the gap between what students already know and what the game asks them to do cold.

### 1A. Make the Tense Formula Sheet available during all exercises 🟢
The `TenseFormulaModal` already exists but is only shown during the tutorial. Add a small persistent button (e.g. a bookmark icon) in the corner of every exercise screen that opens it. Adults need to be able to glance at "have + past participle = Present Perfect" while they're mid-task — looking it up shouldn't require leaving the game.

**What to build:** Move the formula button from tutorial-only to the exercise header/toolbar in `TimelineTensesGame.tsx`.

---

### 1B. Stamp meaning reference panel 🟢
Add a "What does each stamp mean?" quick-reference, accessible from the selection screen and ideally from within Build exercises. Each stamp type (dot, line, arc, solid-to-now, etc.) should show:
- Its name in plain English ("Duration line," "Completion dot," "Past-to-now arc")
- One example tense it represents
- A tiny visual preview

**Why:** Not all adult learners have been taught grammar visually. Some come from rote/translation backgrounds and find the timeline metaphor non-intuitive without explicit explanation.

---

### 1C. Meaning-first tense descriptions throughout 🟡
Replace or supplement all technical tense explanations with meaning-first language. Every place a tense is named or described — feedback panels, formula sheet, category cards, question explanations — should lead with meaning before form.

| Instead of | Use |
|---|---|
| "Describes duration up to a specific future point" | "Something that started in the past, is still happening, and will reach a future deadline" |
| "Completed actions with connection to present" | "Something from the past that matters RIGHT NOW" |
| "Actions in progress" | "What was happening at that exact moment — like a background scene" |

**Why:** Adult ESOL learners — especially those without grammar education backgrounds — connect to meaning before they can absorb form labels.

---

### 1D. "When would I use this?" tag on every tense 🟢
Each tense category card on the selection screen (and in the formula sheet) should include a one-line real-life use case:

- Simple → *"Telling stories, stating facts, describing habits"*
- Continuous → *"Describing what was happening at a specific moment"*
- Perfect → *"Talking about experience, recent events, things that still matter now"*
- Perfect Continuous → *"Showing how long something has been going on"*
- Mixed → *"When two things happened at different times"*

**Why:** Adult learners are strongly motivated by relevance. They need to know *when* to use something, not just *how* to form it.

---

### 1E. "Show formula" hint in Transformer exercise 🟡
The Transformer mode asks students to rewrite a sentence in a new tense cold — the hardest cognitive task in the game. Add a hint option that reveals the formula (not the answer):

> *Hint: Future Perfect = will + have + past participle*

This bridges the gap without giving the game away and is especially valuable for adult learners who haven't memorized verb forms yet.

---

## 2. Feedback quality

These improve what students learn from each answer, right or wrong.

### 2A. Meaning-focused post-answer explanation 🟡
Every `explanation` field should follow a two-part structure:

1. **Meaning:** What does this tense tell us about time? (plain language)
2. **Form:** What does the timeline/verb form look like, and why?

Example for Past Perfect:
> *"'Had studied' = the studying happened BEFORE she took the test. When two past things are in order, Past Perfect shows which one came first. On the timeline: the arc sits further back, the dot sits closer to now."*

**Action:** Audit and rewrite all `explanation` fields in `timeline-tenses-questions.ts` following this structure.

---

### 2B. Mini-dialogue examples in feedback 🟡
After an answer (correct or incorrect), show a 2-line natural conversation using the tense. This makes the communicative function concrete:

> *Past Perfect in real life:*
> *"A: Why didn't you answer when I called?"*
> *"B: Sorry — I'd been sleeping."*

Adult learners remember examples from real conversations far more effectively than abstract rules.

---

### 2C. Highlight the deciding clue in feedback 🟢
When feedback is shown, visually highlight the time expression in the sentence that determined the tense:

> *"By the time you arrive, **I will have cooked** dinner."*
> *↑ "By the time" = something will be finished before a future moment → Future Perfect*

This trains students to look for the clue word in future sentences — a transferable skill. The `ContextTenseExercise` already does something like this with `clueWords`. Extend this pattern to the main exercise feedback panels.

---

### 2D. "Try again" before reveal for wrong answers 🟡
Currently some exercises (especially Transformer) reveal the correct answer immediately after a wrong guess. For adult learners who are intrinsically motivated, this can feel deflating. Consider:

- First wrong attempt → show the meaning hint, not the answer
- Second wrong attempt → reveal the answer

This respects adult agency while still ensuring learning happens.

---

## 3. New exercise types

These address the biggest pedagogical gap: teaching tense *choice*, not just tense *form*.

### 3A. "Which tense fits here and why?" — Choice exercise 🔴
A short paragraph where ALL options are grammatically possible but only one fits the meaning. This is harder than In Context because there's no obviously wrong option — it requires genuine tense reasoning.

Example:
> *"I'm exhausted. I ___ all day."*
> - A: worked *(Past Simple — finished, no connection to now)*
> - B: have been working *(Present Perfect Continuous — still feels relevant now)* ✓
> - C: was working *(Past Continuous — incomplete, sounds like something interrupted it)*

**Why:** This is the real decision adult learners face when speaking and writing. The current In Context mode has some wrong options that are obviously grammatically incorrect. True choice questions require understanding communicative function.

---

### 3B. Passage reading mode — "Tense spotting" 🔴
A short real-world paragraph (news excerpt, social media post, email, story) with multiple tenses. The student:
1. Identifies each verb tense
2. Explains why that tense was used in that context

This directly teaches how tenses work *across* sentences, not just within one — the skill that transfers to real-world reading and writing.

**Content ideas:**
- A news report (mixes Present Simple, Present Perfect, Past Simple)
- A job cover letter (mixes Present Perfect, Past Simple, Present Simple)
- A travel story (mixes Past Simple, Past Continuous, Past Perfect)
- A personal message (mixes Present Perfect, Present Continuous, Future)

---

### 3C. "Your turn" free-write prompt after correct answers 🟡
After a student gets a question right, optionally prompt:
> *"Great! Can you write your own sentence using [tense]? Think about your own life."*

The student types a sentence (unscored) and sees it acknowledged. Optional teacher review could be flagged.

**Why:** Active generation — producing your own example — dramatically improves retention compared to recognition alone. This is well-established in adult learning research (the generation effect).

**Note:** This doesn't need to be scored or validated. The act of trying is what creates the learning.

---

### 3D. Communicative function groupings (alongside tense categories) 🔴
Add an alternative way to practice organized by *what you're trying to say*, not just *what tense it is*:

- **"Telling a story"** → Past Simple, Past Continuous, Past Perfect, Past Perfect Continuous
- **"Talking about experience"** → Present Perfect, Present Perfect Continuous
- **"Making future plans"** → Future Simple, Future Continuous, Future Perfect
- **"Describing the present"** → Present Simple, Present Continuous
- **"Comparing two time periods"** → Mixed tenses

**Why:** Adults often know they want to "talk about what happened" but don't know which tense to reach for. Organizing by function gives them a different entry point that aligns with communicative need.

---

## 4. Learning science & retention

### 4A. Spaced repetition for weak questions 🔴
The highest-leverage learning science improvement. Track which specific questions a student got wrong in previous sessions and surface them more frequently in future rounds.

**How it could work:**
- Questions answered correctly twice in a row → lower priority
- Questions answered incorrectly → higher priority for next session
- Questions not seen recently → gradually increase priority

**Why:** This is how memory actually works. Adult learners with limited study time benefit enormously from their practice time being focused on what they actually don't know.

**What to build:** Extend `PointsLedger` or add a `QuestionHistory` table tracking per-question accuracy per user. Modify the question selection algorithm in `buildStandardDifficultyBalancedRound` to weight by history.

---

### 4B. Personal example bank 🟡
Allow students to save their own example sentences (from the "Your turn" prompts or written during practice) and review them later. Seeing your own sentences reinforces ownership of the language.

**Why:** Adult learners retain language they have personally generated far better than examples they've only read.

---

### 4C. Session summary with weak spots highlighted 🟡
The current results screen shows overall accuracy. Extend it to show:
- Which tenses the student found hardest this session
- A specific suggestion: *"Try focusing on Past Perfect next time — you got 2/5 in that category"*
- Encouragement that references their actual progress: *"You've improved on Future Continuous since last week"*

**Why:** Adults are self-directed learners. Giving them a clear signal about where to focus next respects their agency and keeps them returning.

---

## 5. Audio & multimodal

### 5A. Text-to-speech for sentences 🟡
Add audio playback for every sentence in the game. Even browser-native text-to-speech (no third-party API needed) would help students connect written form to spoken form.

**Why:** Verb forms sound very different — "worked" vs "had been working" vs "will have been working." Adult ESOL learners who primarily interact with spoken English need to hear these differences, not just read them.

**What to build:** A small speaker icon on each sentence card that triggers `window.speechSynthesis.speak()` with the sentence text.

---

### 5B. Stress & rhythm notes for key tense markers 🟢
In the formula sheet or feedback, add a note about how the tense sounds in natural speech:

> *"In conversation, 'have' is often reduced: 'I've been waiting' not 'I have been waiting.'"*
> *"'Had' is often contracted in speech: 'She'd already left.'"*

**Why:** Adult learners often practice the full written form but are then confused when they hear contractions in natural speech.

---

## 6. Rebuilt Story Builder

*(See `story-builder-questions.md` for full details)*

### 6A. Narrative arc structure for all stories 🔴
Rebuild stories with a clear pedagogical arc:
- **Sentence 1–2:** Setup using accessible tenses (Past Simple, Past Continuous)
- **Sentence 3:** Complication using a more complex tense (Past Perfect, Present Perfect)
- **Sentence 4–5:** Resolution or reflection using the most advanced tense

### 6B. Tense shift stories 🔴
One story type where the narrative intentionally shifts frames — a present-day character remembering a past event. This is advanced but extremely valuable: it teaches students how real writers and speakers switch tense purposefully.

### 6C. Genre variety 🟡
Add stories across different real-world genres adult learners encounter:
- Job application / cover letter
- Personal email to a friend
- News report
- Social media post
- Spoken anecdote (informal register)

---

## 7. Teacher tools

### 7A. Flag questions for class discussion 🟡
Teachers should be able to mark specific questions as "discuss in class" from the teacher dashboard. When a student answers one of these, they see: *"Your teacher wants to talk about this one!"*

**Why:** Some tense distinctions (Present Perfect vs Past Simple for British/American English differences, for example) are genuinely nuanced and benefit from discussion, not just an answer reveal.

### 7B. Class-level weak spot report 🟡
In the teacher dashboard, show which tenses the class as a whole is struggling with, based on aggregate accuracy across all students' game sessions.

**Why:** Teachers can use this to inform the next lesson — if 80% of the class is getting Past Perfect questions wrong, that's a clear signal.

### 7C. Assign specific modes to specific classes 🟡
Allow teachers to assign the game with a pre-set tense category and mode locked in (e.g., "Practice only Past Perfect in Read mode this week"). Students who open the game from a class assignment see those settings pre-selected.

---

## Priority order for implementation

### Do first (high impact, manageable scope)
1. Make Tense Formula Sheet available during all exercises *(1A)*
2. Meaning-first language throughout — rewrite explanation fields *(1C + 2A)*
3. "When would I use this?" tag on tense cards *(1D)*
4. Highlight deciding clue in feedback *(2C)*
5. Text-to-speech for sentences *(5A)*

### Do next (medium scope, fills key gaps)
6. Stamp meaning reference panel *(1B)*
7. "Show formula" hint in Transformer *(1E)*
8. Mini-dialogue examples in feedback *(2B)*
9. "Your turn" free-write prompts *(3C)*
10. Session summary with weak spot highlights *(4C)*

### Plan for later (larger builds)
11. Spaced repetition system *(4A)*
12. "Which tense fits here and why?" choice exercise *(3A)*
13. Passage reading / tense spotting mode *(3B)*
14. Communicative function groupings *(3D)*
15. Rebuilt Story Builder *(Section 6)*
16. Teacher tools *(Section 7)*
