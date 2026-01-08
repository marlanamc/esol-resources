import type { SpeakingActivityContent } from "@/types/activity";

export const pastPresentHabitsHousing_2026_02_10: SpeakingActivityContent = {
  type: "speaking",
  title: "2/10/26: Budgeting, Bills, Credit & Debt (Past Perfect)",
  description: "Practice using past perfect tense to talk about money timelines: what had happened before a problem or payment",

  keyPhrases: [
    { phrase: "I had already paid...", example: "I had already paid my rent before I got the late fee notice." },
    { phrase: "Before I checked, I had...", example: "Before I checked my account, I had forgotten about the automatic payment." },
    { phrase: "By the time..., I had...", example: "By the time I got my paycheck, I had already spent too much on my MBTA pass." },
    { phrase: "I had never... before", example: "I had never used a credit card before I came to the U.S." },
    { phrase: "After I had...", example: "After I had paid all my bills, I didn't have enough money for groceries." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 3 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using the Key Phrases", required: true },
      { id: "s3", text: "Add 2 detail words (place/time/people) to your sentences", required: true },
      { id: "s4", text: "Write 2 follow-up questions you can ask a partner", required: true }
    ],
    inputs: [
      { id: "sentence1", label: "Sentence 1", type: "textarea", required: true },
      { id: "sentence2", label: "Sentence 2", type: "textarea", required: true },
      { id: "sentence3", label: "Sentence 3", type: "textarea", required: true },
      { id: "question1", label: "Follow-up Question 1", type: "text", required: true },
      { id: "question2", label: "Follow-up Question 2", type: "text", required: true }
    ],
    help: {
      sentenceFrames: [
        "I had already paid...",
        "Before I checked, I had...",
        "By the time..., I had...",
        "I had never... before",
        "After I had..."
      ],
      questionStems: [
        "Why?",
        "When?",
        "Where?",
        "How often?",
        "Who with?",
        "What is it like?"
      ],
      wordBank: [
        "paid", "bills", "rent", "credit", "debt", "account", "timeline",
        "late fee", "plan", "graduation", "past perfect", "before", "after"
      ]
    }
  },

  speakingMode: {
    title: "Speaking Mode (10 minutes)",
    subtitle: "Start when your teacher says GO.",
    checklist: [
      { id: "p1", text: "Speak for 2 minutes (Partner A)", required: true },
      { id: "p2", text: "Ask 2 follow-up questions (Partner B)", required: true },
      { id: "p3", text: "Switch roles and repeat", required: true },
      { id: "p4", text: "Write ONE best sentence you said (or heard)", required: true }
    ],
    inputs: [
      { id: "bestSentence", label: "Best sentence", type: "textarea", required: true }
    ],
    noPartnerNote: "Make a trio. Roles: Speaker (2 min), Question-asker (asks 2), Listener (writes 1 best sentence). Rotate."
  },

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Last month timeline: What bills had you paid by the middle of the month? What hadn't you paid yet?",
      context: "Use past perfect: I had paid my rent and my Eversource bill. I hadn't paid my phone bill yet."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Money mistake story: By the time you realized there was a problem, what had already happened?",
      context: "Example: By the time I checked my Bank of America account, I had already bounced a check. The fee had already been charged."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Credit history: Before you came to the U.S., what had you known about credit cards or credit scores? What hadn't you learned yet?",
      context: "Use: I had heard about..., but I had never... I hadn't learned about... I hadn't understood..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Late fee explanation: Explain a time you got a late fee. What had happened? What hadn't you done on time?",
      context: "Timeline: Before the due date → What you had/hadn't done → The fee → How you fixed it"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Budget planning timeline: Before last month started, what expenses had you planned for? What unexpected costs came up that you hadn't expected?",
      context: "Example: I had planned to spend $200 on groceries at Market Basket, but I hadn't expected my Xfinity internet bill to increase."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Payment plan story: Tell about a time you needed a payment plan. What expenses had piled up? What had you tried before calling?",
      context: "Before I called, I had... I had tried to... but it hadn't worked. I had never asked for... before."
    },
  ],

  reflectionPrompt: "What's harder: talking about money in English, or using past perfect tense to explain what had happened? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 3,
  released: false
};
