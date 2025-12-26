import type { SpeakingActivityContent } from "@/types/activity";

export const foodBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/15/26: Food & Restaurants (Superlatives & Quantifiers)",
  description: "Practice using superlatives (best, cheapest, most expensive) and quantifiers (too much/many, not enough, how much/many) when talking about food, groceries, and restaurants",

  keyPhrases: [
    { phrase: "The best... is...", example: "The best pizza in Boston is at Regina's in the North End." },
    { phrase: "The cheapest...", example: "The cheapest grocery store is Market Basket." },
    { phrase: "Too much / too many", example: "I ate too much food. / There are too many restaurants to choose from." },
    { phrase: "Not enough", example: "I don't have enough money for Whole Foods. / There's not enough salt in this soup." },
    { phrase: "How much / How many", example: "How much does it cost? / How many slices of pizza do you want?" },
    { phrase: "The most expensive...", example: "The most expensive restaurant in Boston is very fancy." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Superlatives: What's the best restaurant you've been to? What's the worst food you've ever eaten?",
      context: "Use superlatives: best, worst, most delicious, spiciest, sweetest"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Boston groceries: Compare stores - Which is the cheapest? Which has the best produce? Which is the closest to your home?",
      context: "Compare: Market Basket (cheapest), Stop & Shop (convenient), Whole Foods (expensive but good quality), Trader Joe's (unique items)"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Quantifiers: How much do you spend on groceries per week? Is it too much or not enough? How many times do you eat out each month?",
      context: "Use: too much money, not enough vegetables, how much it costs, how many meals"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Healthy eating: Do you eat too much sugar? Not enough fruit? Too many carbs? Not enough protein? Explain your diet.",
      context: "Practice countable (too many cookies, not enough apples) vs uncountable (too much rice, not enough water)"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Restaurant comparisons: What's the fastest food place near you? The most expensive? The healthiest? The tastiest?",
      context: "Use: fastest (Chipotle), cheapest (McDonald's), healthiest (Sweetgreen), most authentic, most popular"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Boston food scene: Compare 3 types of restaurants (Italian, Chinese, Mexican, etc.). Which is the best? The most affordable? The most authentic?",
      context: "North End (Italian), Chinatown (Asian), East Boston (Latin American). Use multiple superlatives in your comparison."
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Budget challenge: You have $50 for groceries. How much will you spend at Market Basket vs Whole Foods? How many items can you buy? Is it too much or not enough?",
      context: "Calculate: How much for meat? How many vegetables? Too much for one person? Not enough for a family?"
    },
  ],

  reflectionPrompt: "What's harder: using superlatives (best/worst/most) or quantifiers (too much/many, not enough)? Why?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};
