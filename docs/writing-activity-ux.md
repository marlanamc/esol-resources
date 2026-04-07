# Writing Activity — User Experience Guide

## Overview

The Timed Writing activity supports two modes:

- **Solo mode** — a student writes independently against a timer, submits, and earns points
- **Live Session mode** — the teacher hosts a real-time class activity where students are split into anonymous animal groups, write competitively, vote on each other's work, and a class winner is revealed

---

## Creating a Writing Activity (Teacher)

From the Create Activity form, select **Timed Writing** as the type. You can configure:

| Field | Description |
|---|---|
| Prompt(s) | The writing question or scenario. Up to 3 prompts (one per round). |
| Image URL | Optional photo to accompany the prompt (great for picture-based prompts). |
| Sentence Starters | Comma-separated phrases students can tap to insert into their writing. |
| Vocabulary | Comma-separated words displayed as reference chips while writing. |
| Timer | How long students have to write (in minutes). Applies to every round. |
| Show Word Count | Toggle whether students see a live word count as they type. |

---

## Teacher Experience — Live Session

### Step 1: Start a Session

When a teacher opens a writing activity, they see the **Start a Live Writing Session** screen. They select which class to run it for and click **Start Live Session**.

- This creates a new session in the database with status `waiting`
- No groups are created yet — they fill dynamically as students join
- If a previous session for this activity is still open, it is automatically marked finished

> If you land on the waiting screen from a previous session instead, click **"Start a new session instead"** to clear it and start fresh.

---

### Step 2: Waiting Phase (Projected View)

The teacher sees a **host dashboard** they can project on screen:

- **Phase** and **Round** indicators at the top
- The **prompt text** for the current round
- **Group cards** that appear and fill in real time as students join — showing each animal group name, emoji, and the list of students who've checked in
- A **"Start Round"** button at the bottom

Groups are built automatically as students open the activity:
- First 4 students → Group 1 (e.g., 🐧 Penguins)
- Next 4 students → Group 2 (e.g., 🦊 Foxes)
- And so on up to 10 animal groups

The teacher waits until enough students have joined, then presses **▶ Start Round**.

---

### Step 3: Writing Phase

After starting the round, the teacher sees:
- A live **submitted count** (e.g., `5 / 19 submitted`) that updates every 3 seconds
- A **countdown timer** showing how much time is left
- A **"Open Group Voting →"** button to advance when ready (can be pressed before the timer runs out)

---

### Step 4: Group Vote Phase

The teacher advances to group voting. Students now vote within their own group for their favorite submission. The teacher waits, then presses **"Show Class Finalists →"** to move on.

---

### Step 5: Class Vote Phase

One winning submission per group is shown to the whole class. Students vote for their favorite across groups (they cannot vote for their own group). The teacher waits, then presses **"Reveal Winner →"**.

---

### Step 6: Results

The class winner is revealed — the group whose submission got the most class votes. Points are awarded automatically.

If there are multiple rounds (prompts), the teacher presses **"Next Round →"** and the cycle repeats from the waiting phase. After all rounds, the session ends.

---

## Student Experience — Live Session

### Joining

When a student opens the writing activity while a live session is active for their class, they are automatically routed into the session (no join code needed). On their first poll, they are **automatically assigned to a group**. They see the **Waiting screen**:

- Their animal group name displayed large (e.g., **🐧 Penguins**)
- A pulsing animation while they wait for the teacher to start
- If it's round 2+, it shows "Round X coming up…"

Students do not know which of their classmates are in the same group until the voting phase.

---

### Writing Phase

Once the teacher starts the round, every student sees:

- Their **group badge** (emoji + color) in the top left
- A **circular countdown timer** in the top right that turns orange at 60 seconds and red at 30 seconds with a pulsing animation
- The **writing prompt** (with optional image)
- A **💬 Sentence Starters** toggle — tapping a starter inserts it directly into their writing
- A **📚 Vocabulary** toggle — shows reference words as colored chips (tap to dismiss)
- A **lined paper textarea** that autofocuses so they can start typing immediately
- A live **word count** (if enabled)
- A **"Submit early →"** button that appears once they've written at least one word

When the timer hits zero, the writing is submitted automatically. If a student submits early, they see a confirmation screen with their word count and a message that they're waiting for the teacher to open voting.

> If a student refreshes the page after submitting, they are restored to the submitted/waiting screen — they won't lose their submission or be asked to write again.

---

### Group Vote Phase

Each student sees the submissions from their **own group** (excluding their own writing), displayed as anonymous cards labeled "Writing 1", "Writing 2", etc. with a word count.

- Tapping a card selects it as their vote (highlighted with their group color)
- They can change their vote at any time before the teacher advances
- Once voted, they see "Waiting for your teacher to move to the class vote…"

If all teammates submitted blank (or a student is alone in their group), they see a message that no teammates submitted this round.

---

### Class Vote Phase

Each group's internal winner is shown as a card with the group name and emoji. Students vote for their favorite **across groups** (voting for your own group's submission is disabled, shown at reduced opacity).

- Vote by tapping the **"Vote for this one →"** button on a card
- The button changes to "✓ Voted for this one" once selected
- Votes can be changed until the teacher advances

---

### Results Phase

The class winner is revealed with a glowing card effect. If the student's group won, they see 🎉 confetti animation and "Your group won! The class voted for your writing!" If another group won, they see that group's name and emoji.

Points are awarded after the class vote is tallied:

| Achievement | Points |
|---|---|
| Participated (submitted any writing) | 3 pts |
| Group winner (your writing was voted best in your group) | +3 pts |
| Class winner (your group's writing won the class vote) | +5 pts |

---

## Student Experience — Solo Mode

If there is no active session running for the student's class (or the student accesses the activity outside of class), they enter **solo mode**:

1. They see the prompt with the timer duration displayed
2. Pressing **"Start Writing ✏️"** begins the countdown
3. The same lined-paper textarea, suggestion panel, and word count are available
4. Writing auto-submits when the timer expires, or they can submit early
5. On completion, they see their word count and their writing is saved
6. Points are awarded and a points toast notification appears

---

## Technical Notes

- **Polling interval**: Both teacher host and student participant views poll the session state every 3 seconds (only when the tab is visible, paused when hidden)
- **Auto-blank submission**: When the teacher advances from the writing phase, any student who joined but didn't submit gets an empty submission created automatically — this prevents blocking the group vote
- **Duplicate submission prevention**: The submit endpoint uses an upsert, so refreshing or early-submitting multiple times is safe
- **Session cleanup**: Starting a new session automatically marks any previous active session for the same activity + class as finished
- **Offline resilience**: Solo mode uses the submission outbox for offline-safe submission
