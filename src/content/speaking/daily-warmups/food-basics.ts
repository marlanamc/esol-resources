import type { SpeakingActivityContent } from "@/types/activity";

export const foodBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Daily Warm-up: Food & Restaurants",
  description: "Practice talking about food, cooking, restaurants, and dining experiences",

  keyPhrases: [
    { phrase: "I'd like to order...", example: "I'd like to order the chicken salad, please." },
    { phrase: "I've tried...", example: "I've tried Thai food many times." },
    { phrase: "What would you recommend?", example: "What would you recommend for someone who doesn't eat meat?" },
    { phrase: "I've never eaten...", example: "I've never eaten sushi before." },
    { phrase: "By next month, I will have...", example: "By next month, I will have learned to cook five new dishes." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What's your favorite food? Describe a meal you love to eat.",
      context: "Talk about the ingredients, flavors, and why you like it."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Describe the last time you went to a restaurant. What did you order?",
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What types of food have you tried in the U.S.? What haven't you tried yet?",
      context: "Practice: 'I have tried Mexican food and Italian food, but I haven't tried Korean food yet.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Using past perfect: Tell me about a restaurant experience that went wrong. What had you ordered? What had happened?",
      context: "Example: 'The waiter had brought me the wrong dish. I had asked for chicken, but he had given me fish.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using future perfect: By the end of this year, what cooking skills or food experiences will you have achieved?",
      context: "Example: 'By December, I will have learned to make my grandmother's recipe' or 'I will have tried ten new restaurants.'"
    },
  ],

  reflectionPrompt: "What did you talk about? Which perfect tense did you use?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
