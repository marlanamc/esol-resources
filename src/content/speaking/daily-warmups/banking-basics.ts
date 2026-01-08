import type { SpeakingActivityContent } from "@/types/activity";

export const bankingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/27/26: Banking & Shopping (Type 0 Conditionals)",
  description: "Use Type 0 conditionals to explain banking facts and rules. Focus: If + present, present for facts and rules.",

  keyPhrases: [
    { phrase: "If you..., you...", example: "If you pay late, you get a fee." },
    { phrase: "If I don't..., I...", example: "If I don't have cash, I use my debit card." },
    { phrase: "When you..., you...", example: "When you overdraw your account, you pay a $35 fee." },
    { phrase: "If they..., they...", example: "If they charge too much, they lose customers." },
    { phrase: "What happens if...?", example: "What happens if I forget my PIN?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
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
        "If you [present], you [present]...",
        "When I [present], I [present]...",
        "If they [present], they [present]...",
        "What happens if you [present]?",
        "When people [present], they [present]..."
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
        "pay", "late", "on time", "fee", "cost", "charge", "spend", "save",
        "cash", "card", "debit", "credit", "account", "bank", "ATM", "PIN",
        "overdraw", "balance", "deposit", "withdraw", "transfer", "bill"
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
      text: "What happens if you pay a bill late? What happens if you pay on time?",
      context: "Use Type 0 conditionals to explain the facts. Example: 'If you pay late, you get a fee. If you pay on time, you save money.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What do you do if you don't have cash? What payment methods do you use?",
      context: "Use Type 0 conditionals. Example: 'If I don't have cash, I use my debit card. If the store doesn't take cards, I go to an ATM.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What are the rules at your bank? What happens if you overdraw your account? What happens if you keep a minimum balance?",
      context: "Explain banking rules using Type 0 conditionals. 'If you overdraw, you pay a $35 fee. If you keep $500 in your account, you don't pay monthly fees.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What are your spending habits? What do you do if you spend too much in one week?",
      context: "Use Type 0 conditionals to explain your habits. 'If I spend too much on groceries, I skip going out to eat. If I run out of money, I use my credit card.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What happens if you lose your debit card? What steps do you take?",
      context: "Explain the process using Type 0 conditionals. 'If I lose my card, I call the bank immediately. If they cancel it, they send me a new one in 7-10 days.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "What general truths do you know about money and banking in the U.S.? What surprises people from other countries?",
      context: "Share facts using Type 0 conditionals. 'If you write a check without money in your account, it bounces. If you pay credit cards in full, you don't pay interest.'"
    },
  ],

  reflectionPrompt: "How comfortable are you using Type 0 conditionals (If + present, present) to explain banking facts and habits? What was challenging?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
