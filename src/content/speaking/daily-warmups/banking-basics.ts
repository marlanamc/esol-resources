import type { SpeakingActivityContent } from "@/types/activity";

export const bankingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/27/26: Banking & Shopping",
  description: "Practice talking about money, shopping, and banking",

  keyPhrases: [
    { phrase: "I need to...", example: "I need to deposit this check." },
    { phrase: "How much does this cost?", example: "How much does this shirt cost?" },
    { phrase: "I'm looking for...", example: "I'm looking for the savings account options." },
    { phrase: "Can you help me with...?", example: "Can you help me with opening an account?" },
    { phrase: "I'd like to return this.", example: "I'd like to return this item I bought yesterday." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Describe your daily spending. What do you usually buy during the week?",
      context: "Think about groceries, transportation, and other regular expenses."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell me about your last shopping trip. What did you buy?",
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "You need to open a bank account. What questions will you ask the bank employee?",
      context: "Think about account types, fees, and what documents you need."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Describe a time you bought something and had to return it. What happened?",
      context: "Explain why you returned it and how the store helped you."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "You see a mistake on your bank statement. What do you say to the bank?",
      context: "Practice explaining the problem clearly and asking them to fix it."
    },
  ],

  reflectionPrompt: "What did you practice speaking about? What was difficult?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};
