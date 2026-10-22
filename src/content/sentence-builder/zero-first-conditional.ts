import type { SentenceBuilderContent } from "@/types/activity";

// Rounds and rule cards come from the Week 7 worksheet,
// FY27/worksheets/group-handouts/zero-first-conditional.html. Keep the rule
// wording in sync with its "How does it work?" key and "Level up" box.

export const zeroFirstConditionalSentenceBuilder: SentenceBuilderContent = {
    type: "sentence-builder",
    title: "Sentence Builder: If This, Then That",
    description: "Build zero and first conditional sentences, then say what you will do.",
    courseMapPreset: true,
    released: true,
    rules: {
        Z: { title: "Zero: **If + V1, V1** (always true)", example: "If I **drink** coffee at night, I **can't sleep**." },
        F: { title: "First: **NO will after if.** If + V1, will + V1", example: "If it **rains** tomorrow, I **will take** the bus." },
        C: { title: "**If first? Use a comma.** If in the middle? No comma.", example: "**If it rains,** I take the bus. / I take the bus if it rains." },
        U: { title: "[unless / when / as soon as] **+ V1** (not will)", example: "I'll call you **as soon as I get** home." },
        S: { title: "[he / she / it] + **V1-s**", example: "If my **son gets** sick, I stay home." },
    },
    rounds: [
        { kind: "place", id: "zf-p1", words: ["If", "it", "rains", "tomorrow,", "I", "take", "the bus."], word: "will", answer: 5, rule: "F" },
        { kind: "place", id: "zf-p2", words: ["If", "you", "need", "help,", "I", "come."], word: "will", answer: 5, rule: "F" },
        { kind: "place", id: "zf-p3", words: ["If", "she", "gets", "paid", "Friday,", "she", "go", "shopping."], word: "will", answer: 6, rule: "F" },
        { kind: "place", id: "zf-p4", words: ["I", "take", "the bus", "it", "rains."], word: "if", answer: 3, rule: "C" },
        { kind: "place", id: "zf-p5", words: ["My", "son", "stays", "home", "he", "is", "sick."], word: "if", answer: 4, rule: "Z" },
        { kind: "place", id: "zf-p6", words: ["I", "won't", "go", "you", "come", "with me."], word: "unless", answer: 3, rule: "U" },
        { kind: "place", id: "zf-p7", words: ["I'll", "text", "you", "I", "get", "to work."], word: "when", answer: 3, rule: "U" },

        { kind: "pick", id: "zf-k1", parts: ["If it", { options: ["rains", "will rain"], answer: 0 }, "tomorrow, I", { options: ["take", "will take"], answer: 1 }, "the bus."], rule: "F" },
        { kind: "pick", id: "zf-k2", parts: ["If I", { options: ["drink", "will drink"], answer: 0 }, "coffee at night, I", { options: ["can't", "couldn't"], answer: 0 }, "sleep."], rule: "Z" },
        { kind: "pick", id: "zf-k3", parts: ["If you heat ice, it", { options: ["melted.", "melts."], answer: 1 }], rule: "Z" },
        { kind: "pick", id: "zf-k4", parts: ["I'll call you as soon as I", { options: ["will get", "get"], answer: 1 }, "home."], rule: "U" },
        { kind: "pick", id: "zf-k5", parts: ["I won't go unless you", { options: ["come", "will come"], answer: 0 }, "with me."], rule: "U" },
        { kind: "pick", id: "zf-k6", parts: ["If my son", { options: ["get", "gets"], answer: 1 }, "sick, I", { options: ["stay", "stays"], answer: 0 }, "home."], rule: "S" },
        {
            kind: "pick", id: "zf-k7",
            parts: [{ options: ["If it rains, I take the bus.", "I take the bus, if it rains.", "I take the bus if it rains."], answer: 0, also: [2] }],
            rule: "C",
        },
        { kind: "pick", id: "zf-k8", parts: ["When I", { options: ["get", "will get"], answer: 0 }, "paid, I'll pay my bills."], rule: "U" },

        {
            kind: "true", id: "zf-t1", question: "What will you do if it rains tomorrow?",
            choices: ["take the bus", "stay home", "bring an umbrella", "wear my rain jacket"],
            template: "If it rains tomorrow, I will {choice}.",
        },
        {
            kind: "true", id: "zf-t2", question: "What do you do if you feel sick?",
            choices: ["stay home", "go to bed early", "call my doctor", "drink tea"],
            template: "If I feel sick, I {choice}.",
        },
        {
            kind: "true", id: "zf-t3", question: "What will you do if you have free time this weekend?",
            choices: ["go to the park", "visit my friends", "watch a movie", "sleep"],
            template: "If I have free time this weekend, I will {choice}.",
        },
        {
            kind: "true", id: "zf-t4", question: "What do you do if the bus is late?",
            choices: ["text my boss", "walk", "take an Uber", "wait"],
            template: "If the bus is late, I {choice}.",
        },
        {
            kind: "true", id: "zf-t5", question: "What will you do as soon as you get home today?",
            choices: ["cook dinner", "take a nap", "call my family", "help my kids with homework"],
            template: "As soon as I get home today, I will {choice}.",
        },
    ],
};
