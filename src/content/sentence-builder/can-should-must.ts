import type { SentenceBuilderContent } from "@/types/activity";

// Rounds and rule cards come from the Week 8 worksheet,
// FY27/worksheets/group-handouts/phrase-banks/can-should-must.html. Keep the rule
// wording in sync with its "How does it work?" key and "Remember" strip.

export const canShouldMustSentenceBuilder: SentenceBuilderContent = {
    type: "sentence-builder",
    title: "Sentence Builder: Can, Should, Must",
    description: "Put can, should, and must in the right place, then say what you can and should do.",
    courseMapPreset: true,
    released: true,
    rules: {
        A: { title: "Modal + **V1**. **No \"to\".**", example: "I **can call** my mom. (Not: I can to call.)" },
        B: { title: "[he / she / it]: **no -s**", example: "She **can call** her son. (Not: She can calls.)" },
        C: { title: "Negative: [can't / shouldn't / must not] **+ V1**", example: "I **can't drive**. (Not: I don't can drive.)" },
        D: { title: "Questions: **the modal goes first**", example: "**Can you** help me? (Not: Do you can help me?)" },
        R: { title: "[can] = possible · [should] = a good idea · [must] = a rule", example: "You **should** call back. You **must not** share your PIN." },
    },
    rounds: [
        { kind: "place", id: "csm-p1", words: ["I", "call", "my mom."], word: "can", answer: 1, rule: "A" },
        { kind: "place", id: "csm-p2", words: ["You", "check", "your messages."], word: "should", answer: 1, rule: "A" },
        { kind: "place", id: "csm-p3", words: ["She", "call", "her son."], word: "can", answer: 1, rule: "B" },
        { kind: "place", id: "csm-p4", words: ["He", "work", "on Saturday."], word: "must", answer: 1, rule: "B" },
        { kind: "place", id: "csm-p5", words: ["I", "drive."], word: "can't", answer: 1, rule: "C" },
        { kind: "place", id: "csm-p6", words: ["You", "answer", "unknown numbers."], word: "shouldn't", answer: 1, rule: "C" },
        { kind: "place", id: "csm-p7", words: ["You", "share", "your PIN."], word: "must not", answer: 1, rule: "C" },
        { kind: "place", id: "csm-p8", words: ["you", "help", "me?"], word: "can", answer: 0, rule: "D" },
        { kind: "place", id: "csm-p9", words: ["I", "call", "back?"], word: "should", answer: 0, rule: "D" },

        { kind: "pick", id: "csm-k1", parts: ["She", { options: ["can calls", "can call", "cans call"], answer: 1 }, "her son."], rule: "B" },
        { kind: "pick", id: "csm-k2", parts: ["I", { options: ["can to drive", "can drive"], answer: 1 }, "to work."], rule: "A" },
        { kind: "pick", id: "csm-k3", parts: ["I", { options: ["don't can", "can't", "no can"], answer: 1 }, "swim."], rule: "C" },
        { kind: "pick", id: "csm-k4", parts: [{ options: ["Do you can", "Can you"], answer: 1 }, "help me?"], rule: "D" },
        { kind: "pick", id: "csm-k5", parts: ["He", { options: ["must works", "must work", "musts work"], answer: 1 }, "on Saturday."], rule: "B" },
        { kind: "pick", id: "csm-k6", parts: ["You", { options: ["shouldn't to click", "shouldn't click", "don't should click"], answer: 1 }, "strange links."], rule: "C" },
        { kind: "pick", id: "csm-k7", parts: [{ options: ["Should I", "Do I should"], answer: 0 }, "call back?"], rule: "D" },
        { kind: "pick", id: "csm-k8", parts: ["Your PIN is private. You", { options: ["must not", "can"], answer: 0 }, "share it."], rule: "R" },
        { kind: "pick", id: "csm-k9", parts: ["Her new phone is great. Now she", { options: ["can", "must not"], answer: 0 }, "video-call her daughter."], rule: "R" },

        {
            kind: "true", id: "csm-t1", question: "What can you do on your phone?",
            choices: ["video-call my family", "send voice messages", "pay my bills", "take photos"],
            template: "I can {choice} on my phone.",
        },
        {
            kind: "true", id: "csm-t2", question: "What is still hard in English?",
            choices: ["understand fast speakers", "spell long words", "make phone calls in English", "fill out forms"],
            template: "I can't {choice} yet.",
        },
        {
            kind: "true", id: "csm-t3", question: "Your friend gets a text from a new number. It asks for money. What should she do?",
            choices: ["call the real number", "ask her family", "delete the message", "block the number"],
            template: "She should {choice}.",
        },
        {
            kind: "true", id: "csm-t4", question: "What should you do this week?",
            choices: ["call my family", "sleep more", "drink more water", "practice English every day"],
            template: "I should {choice} this week.",
        },
        {
            kind: "true", id: "csm-t5", question: "What must you never do with your phone?",
            choices: ["share my PIN", "click strange links", "send money to strangers", "give my password to anyone"],
            template: "I must not {choice}.",
        },
    ],
};
