import type { SpeakingActivityContent } from "@/types/activity";

export const nutritionFoodLabels_2026_05_14: SpeakingActivityContent = {
  type: "speaking",
  title: "5/14/26: Nutrition & Food Labels",
  description: "Practice comparing foods using label information and explaining choices clearly",

  keyPhrases: [
    { phrase: "This one has more/less...", example: "This one has less sugar." },
    { phrase: "It's higher/lower in...", example: "It's higher in protein." },
    { phrase: "I choose this because...", example: "I choose this because it has fewer calories." },
    { phrase: "How many servings are in...?", example: "How many servings are in this package?" },
    { phrase: "In my opinion...", example: "In my opinion, this is a better choice." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Label basics: Describe a food label (servings, calories, sugar, sodium).",
      context: "Use numbers and units clearly."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Compare two foods and choose the better option for a goal (lower sugar, more protein, less sodium).",
      context: "Use comparatives: more/less, higher/lower."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Explain your choice to a partner. Partner asks 2 follow-up questions.",
      context: "Use: because, for example."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Advice: Your friend wants to eat healthier. Give 3 tips using food label language.",
      context: "Use: You should..., Try to..., It's better to..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-debate: Is counting calories helpful? Agree/disagree and give reasons.",
      context: "Use: I agree/disagree because..."
    },
  ],

  reflectionPrompt: "What is one label word that is confusing (serving, sodium, fiber)? What question can you ask?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

