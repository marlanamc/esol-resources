import type { SpeakingActivityContent } from "@/types/activity";

export const housingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/13/26: Describing Your Home",
  description: "Quick speaking practice about your living situation",

  keyPhrases: [
    { phrase: "I live in...", example: "I live in a small apartment." },
    { phrase: "My favorite room is...", example: "My favorite room is the kitchen." },
    { phrase: "I have... bedrooms.", example: "I have two bedrooms." },
    { phrase: "I'm calling about...", example: "I'm calling about a broken heater." },
    { phrase: "When can you fix this?", example: "When can you fix this problem?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Describe the place where you live now. How many rooms? What's your favorite room?",
      context: "Think about the layout and what makes each room special to you."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell me about your neighborhood. What do you like about it?",
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "Describe your bedroom or living room. What furniture do you have?",
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Tell me about a time something broke in your home. What did you do?",
      context: "Describe the problem and how you solved it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "You need to call your landlord about a broken heater. What will you say?",
      context: "Practice explaining the problem clearly and asking when it can be fixed."
    },
  ],

  reflectionPrompt: "What did you practice today? Which prompt was most challenging?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
