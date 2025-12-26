import type { SpeakingActivityContent } from "@/types/activity";

export const jobApplicationTalkThrough_2026_03_10: SpeakingActivityContent = {
  type: "speaking",
  title: "3/10/26: Job Application Talk-Through",
  description: "Practice the language needed to complete job applications: spelling, numbers, dates, and clarification",

  keyPhrases: [
    { phrase: "How do you spell...?", example: "How do you spell your last name?" },
    { phrase: "My phone number is...", example: "My phone number is 617-555-0123." },
    { phrase: "My availability is...", example: "My availability is Monday to Friday after 3pm." },
    { phrase: "I have worked as...", example: "I have worked as a dishwasher for two years." },
    { phrase: "Could you explain what ___ means?", example: "Could you explain what 'reference' means?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Partner form practice: Ask and answer basic application questions (name, address, phone, email).",
      context: "Focus on clarity and repeating information."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Spelling and numbers challenge: Spell your name, street, and email. Say your phone number clearly.",
      context: "Partner checks and asks: Is that double __? Is that B as in Boston?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Work history: Describe your last job (title, responsibilities, dates).",
      context: "Use past tense and time expressions."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Availability: Explain when you can work and any limits you have.",
      context: "Use: I can..., I can't..., I prefer..., I'm available..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Clarification role-play: You don’t understand a question on the application. Ask for help politely.",
      context: "Use: What does ___ mean? Could you repeat that? Can you show me an example?"
    },
  ],

  reflectionPrompt: "Which application information is hardest to say quickly (address, email, dates)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

