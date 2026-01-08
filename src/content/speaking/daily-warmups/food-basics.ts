import type { SpeakingActivityContent } from "@/types/activity";

export const foodBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/15/26: Food & Restaurants (Superlatives & Quantifiers)",
  description: "Practice superlatives and quantifiers. Focus: best/worst/most and too much/many, not enough.",

  keyPhrases: [
    { phrase: "The best... is...", example: "The best pizza in Boston is at Regina's in North End." },
    { phrase: "The cheapest...", example: "The cheapest grocery store is Market Basket." },
    { phrase: "Too much / too many", example: "I ate too much food. / There are too many restaurants to choose from." },
    { phrase: "Not enough", example: "I don't have enough money for Whole Foods. / There's not enough salt in this soup." },
    { phrase: "How much / How many", example: "How much does it cost? / How many slices of pizza do you want?" },
    { phrase: "The most expensive...", example: "The most expensive restaurant in Boston is very fancy." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using superlatives or quantifiers", required: true },
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
        "The best... is...",
        "The cheapest... is...",
        "Too much / too many...",
        "Not enough...",
        "How much / How many...",
        "The most expensive... is..."
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
        "best", "worst", "cheapest", "most expensive", "good", "bad", "delicious",
        "too much", "too many", "not enough", "very", "really", "quite",
        "food", "restaurant", "pizza", "coffee", "grocery", "store", "price", "cost"
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
  released: false
};
