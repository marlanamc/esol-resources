import type { SpeakingActivityContent } from "@/types/activity";

export const homeRemediesProcess_2026_05_19: SpeakingActivityContent = {
  type: "speaking",
  title: "5/19/26: Home Remedies (Explain the Process)",
  description: "Explain a home remedy step-by-step using sequencing words and simple passive voice chunks",

  keyPhrases: [
    { phrase: "First / Next / Then / Finally...", example: "First, I boil water. Next, I add ginger." },
    { phrase: "It's used for...", example: "It's used for a sore throat." },
    { phrase: "It is mixed / boiled / added...", example: "Honey is added at the end." },
    { phrase: "Be careful because...", example: "Be careful because it can be very hot." },
    { phrase: "It helps me when...", example: "It helps me when I have a cold." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Share a simple home remedy you use. What is it for?",
      context: "Keep it general and comfortable: cold, cough, stress, sleep."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Explain the steps using sequencing words (4–6 steps).",
      context: "Use: First, Next, Then, After that, Finally."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Add 2 passive voice chunks (is mixed, is boiled, is added, is used).",
      context: "Example: 'The tea is boiled for 10 minutes.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Partner questions: Ask 3 questions about the remedy (ingredients, how often, safety).",
      context: "Use follow-ups: How much? How long? How often? Why?"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-presentation: Explain your remedy to the class in 1 minute.",
      context: "Include: purpose, steps, and one safety note."
    },
  ],

  reflectionPrompt: "Which sequencing word do you use most? Which one do you forget?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

