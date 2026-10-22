import type { SentenceBuilderContent } from "@/types/activity";

// Rounds and rule cards come from the Week 6 worksheet,
// FY27/worksheets/group-handouts/phrase-banks/adverbs-of-frequency.html. Keep the rule
// wording in sync with its "Where does it go?" key.

const FREQ = ["always", "usually", "often", "sometimes", "rarely", "never"];

const FIRST_NOTE =
    "**Also correct!** Usually, sometimes, and often can go **first**. The most common place is **before the verb**.";

export const adverbsOfFrequencySentenceBuilder: SentenceBuilderContent = {
    type: "sentence-builder",
    title: "Sentence Builder: How Often?",
    description: "Put adverbs of frequency in the right place, then make true sentences about you.",
    courseMapPreset: true,
    released: true,
    rules: {
        A: { title: "Most verbs: the adverb goes **BEFORE the verb**", example: "I **usually drink** coffee." },
        B: { title: "[am / is / are]: the adverb goes **AFTER the verb**", example: "I **am always** tired." },
        C: { title: "Negative: [don't / doesn't] **+ usually**", example: "I **don't usually** cook." },
        N: { title: "**Never is already negative.** Don't use don't.", example: "I **never cook**. (Not: I don't never cook.)" },
        S: { title: "[he / she / it]: **adverb + V1-s**", example: "My friend **usually drinks** tea." },
        Q: { title: "Questions: **Do you ever...?**", example: "**Do you ever** take a nap?" },
    },
    rounds: [
        { kind: "place", id: "aof-p1", words: ["I", "drink", "coffee", "in the morning."], word: "usually", answer: 1, also: [{ slot: 0, note: FIRST_NOTE }], rule: "A" },
        { kind: "place", id: "aof-p2", words: ["I", "am", "tired", "after work."], word: "always", answer: 2, rule: "B" },
        { kind: "place", id: "aof-p3", words: ["My", "friend", "drinks", "tea."], word: "never", answer: 2, rule: "S" },
        { kind: "place", id: "aof-p4", words: ["She", "is", "late", "for class."], word: "never", answer: 2, rule: "B" },
        { kind: "place", id: "aof-p5", words: ["We", "eat", "dinner", "together."], word: "sometimes", answer: 1, also: [{ slot: 0, note: FIRST_NOTE }, { slot: 4, note: "**Also correct!** Sometimes can go **at the end** too." }], rule: "A" },
        {
            kind: "place", id: "aof-p6", words: ["I", "don't", "cook", "on weekends."], word: "usually", answer: 2,
            also: [
                { slot: 1, note: "**Also correct!** \"I **usually don't** cook\" is common too. Both mean the same thing." },
                { slot: 0, note: FIRST_NOTE },
            ],
            rule: "C",
        },
        { kind: "place", id: "aof-p7", words: ["The kids", "are", "hungry", "after school."], word: "always", answer: 2, rule: "B" },
        { kind: "place", id: "aof-p8", words: ["I", "check", "TikTok", "before bed."], word: "often", answer: 1, also: [{ slot: 0, note: FIRST_NOTE }, { slot: 3, note: "**Also correct!** Often can also come **after the thing you do**." }], rule: "A" },
        { kind: "place", id: "aof-p9", words: ["He", "takes", "the bus", "to work."], word: "rarely", answer: 1, rule: "S" },

        { kind: "pick", id: "aof-k1", parts: ["My sister", { options: ["always cooks", "cooks always"], answer: 0 }, "dinner."], rule: "S" },
        { kind: "pick", id: "aof-k2", parts: ["I", { options: ["never am", "am never"], answer: 1 }, "late for work."], rule: "B" },
        { kind: "pick", id: "aof-k3", parts: ["He", { options: ["takes usually", "usually take", "usually takes"], answer: 2 }, "the bus."], rule: "S" },
        { kind: "pick", id: "aof-k4", parts: ["We", { options: ["don't usually", "usually don't", "don't never"], answer: 0, also: [1] }, "work on Sunday."], rule: "C" },
        { kind: "pick", id: "aof-k5", parts: ["I", { options: ["don't never", "never"], answer: 1 }, "eat fast food."], rule: "N" },
        { kind: "pick", id: "aof-k6", parts: ["Do you", { options: ["never", "ever"], answer: 1 }, "take a nap?"], rule: "Q" },
        { kind: "pick", id: "aof-k7", parts: ["She", { options: ["always is", "is always"], answer: 1 }, "on time."], rule: "B" },

        { kind: "true", id: "aof-t1", question: "How often do you eat breakfast?", choices: FREQ, template: "I {choice} eat breakfast." },
        { kind: "true", id: "aof-t2", question: "How often do you cook at home?", choices: FREQ, template: "I {choice} cook at home." },
        { kind: "true", id: "aof-t3", question: "How often do you take the bus?", choices: FREQ, template: "I {choice} take the bus." },
        { kind: "true", id: "aof-t4", question: "How often are you tired after work?", choices: FREQ, template: "I am {choice} tired after work." },
        { kind: "true", id: "aof-t5", question: "How often do you call your family on weekends?", choices: FREQ, template: "I {choice} call my family on weekends." },
    ],
};
