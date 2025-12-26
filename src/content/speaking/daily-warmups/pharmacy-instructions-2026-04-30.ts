import type { SpeakingActivityContent } from "@/types/activity";

export const pharmacyInstructions_2026_04_30: SpeakingActivityContent = {
  type: "speaking",
  title: "4/30/26: Pharmacy Instructions",
  description: "Practice understanding and explaining medicine instructions (dosage, frequency, warnings) using teach-back",

  keyPhrases: [
    { phrase: "Take ___ (once/twice) a day.", example: "Take one tablet twice a day." },
    { phrase: "Take it with food.", example: "Take it with food to avoid stomach pain." },
    { phrase: "Do not take it with...", example: "Do not take it with alcohol." },
    { phrase: "I have a question about...", example: "I have a question about the side effects." },
    { phrase: "So, I should...", example: "So, I should take it in the morning and at night." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Read a simple label and explain it to your partner (how much + how often).",
      context: "Partner repeats back the instructions to check understanding."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Teach-back role-play: Pharmacist gives directions; patient repeats them in their own words.",
      context: "Use: So, I should..., And I shouldn't..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Ask 4 questions at the pharmacy.",
      context: "Examples: side effects, refill, interactions, when to call the doctor."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Warnings and advice: Explain 2 warning sentences in simple language.",
      context: "Example: 'May cause drowsiness' → 'It can make you sleepy.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Scenario: You missed a dose. What should you do? Role-play asking the pharmacist.",
      context: "Use: I forgot to..., Should I...?"
    },
  ],

  reflectionPrompt: "What is one question you always want to ask before taking a new medicine?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

