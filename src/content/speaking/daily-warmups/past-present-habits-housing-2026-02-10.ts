import type { SpeakingActivityContent } from "@/types/activity";

export const pastPresentHabitsHousing_2026_02_10: SpeakingActivityContent = {
  type: "speaking",
  title: "2/10/26: Budgeting, Bills, Credit & Debt",
  description: "Practice common money conversations: monthly bills, payment plans, and credit/debt vocabulary",

  keyPhrases: [
    { phrase: "My monthly bills are...", example: "My monthly bills are rent, electricity, and phone." },
    { phrase: "I pay ___ on (date).", example: "I pay rent on the first of the month." },
    { phrase: "I need a payment plan.", example: "I need a payment plan for my electric bill." },
    { phrase: "I have a balance of...", example: "I have a balance of $200 on my credit card." },
    { phrase: "Could you waive the fee?", example: "Could you waive the late fee this time?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Bills list: What are 4 monthly expenses you pay? Which one is the biggest?",
      context: "Examples: rent, electricity, gas, phone, internet, transportation, food."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Budget choices: If you need to save $50 this month, what will you spend less on?",
      context: "Use: I will spend less on..., I can cut..., I can avoid..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Payment plan role-play: Call a company and ask for a payment plan.",
      context: "Include: the problem, what you can pay now, and a plan for next month."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Credit/debt talk: Explain one thing you know about credit cards or credit scores.",
      context: "Use simple language: interest, fees, minimum payment, credit score."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Problem-solving: You see a mistake on your bill/statement. What do you say to fix it?",
      context: "Use: I have a question about..., I think there is a mistake..., Can you check...?"
    },
  ],

  reflectionPrompt: "Which money topic is hardest to talk about in English (bills, debt, fees, payments)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
