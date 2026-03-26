# Future Expansions: Timeline Tenses Game

This document outlines recommended advanced grammar concepts and sentence combinations that could be added to the Timeline Tenses game in the future. These concepts offer fascinating visualization challenges for ESL students, mapping complex abstract grammar onto concrete visual timelines.

## 1. Conditionals (If-Clauses)

Conditionals are notoriously difficult for students to visualize, especially when the tense used does not match the actual time (e.g., using past perfect for hypothetical past).

### Real Future (First Conditional)
*   **Example:** *"If it rains tomorrow, we will stay home."*
*   **Timeline Mapping:** 
    *   `Moment` (future) for the condition (rains).
    *   `Moment` (future) or `Duration` (future) for the result (stay home).
    *   *Visual Challenge:* Exploring how to visually link the condition to the result.

### Unreal Past (Third Conditional)
*   **Example:** *"If I had studied harder, I would have passed the test."*
*   **Timeline Mapping:** 
    *   Requires mapping *unreal/hypothetical* actions against *real* actions in the past zones.
    *   Could involve introducing a new visual stamp variation (like a faded/transparent "Unreal Link" arc) to specifically indicate actions that *didn't* actually happen but were possible.

## 2. Past Habits vs. States ("Used To" / "Would")

Distinguishing between regular past actions, past habits no longer true, and past ongoing states.

*   **Example 1 (Fact/State):** *"I used to live in London, but now I live here."*
    *   **Mapping:** `Duration` (past) + `Multiple Dots` (present).
*   **Example 2 (Repeated Habit):** *"Every summer we would go to the beach."*
    *   **Mapping:** `Multiple Dots` (past).
    *   *Visual Challenge:* The game already supports `multiple-dots` (Habit/Fact), so this is a great way to force students to realize that "would" here functions exactly like "Simple Present" repeated actions, but shifted to the past timeline zone.

## 3. Modals of Deduction/Speculation

Using timeline logic to map deductions about present evidence pointing to past events.

*   **Example:** *"She is late. She must have missed the train."*
*   **Timeline Mapping:** 
    *   `Moment` (present) for "She is late".
    *   `Moment` (past) for "missed the train".
    *   *Visual Challenge:* Like Present Perfect, this draws a logical connection between two zones. The grammar is complex ("must have missed"), but visually, it's just a dot in the past causing a dot in the present.

## 4. Future in the Past

A very advanced construct usually taught at C1/C2 levels, mapping intentions made in the past about an event further in the past (or present).

*   **Example:** *"I thought it was going to rain, but it didn't."*
*   **Timeline Mapping:** 
    *   `Moment` (past-earlier) for "thought".
    *   `Moment` (past-later) for "didn't rain".
    *   *Visual Challenge:* Shows how "was going to" behaves functionally identically to "will", but shifted chronologically backwards on the timeline into the split-past zones.

## 5. Passive Voice Interactions

Timelines for passive voice sentences function exactly the same as active voice sentences (because the *time* hasn't changed, only the subject focus). Including them is a great way to prove to students that passive voice doesn't alter timeline logic.

*   **Example:** *"The window was broken yesterday."*
*   **Mapping:** `Moment` (past).
*   **Example:** *"The houses have been built already."*
*   **Mapping:** `Arc` (past -> now).

---

## Technical Notes for Implementation
When implementing these:
*   Ensure that the `elementsUseSplitPast` function in `timelineTensesUtils.ts` correctly captures any new combinations requiring the split-past zones.
*   Consider if any new stamps are needed (e.g., "Unreal Action") or if existing primitives (dot, multiple-dots, solid-line, arc, solid-to-now) can handle the abstract mapping. Usually, existing primitives are perfectly sufficient!
