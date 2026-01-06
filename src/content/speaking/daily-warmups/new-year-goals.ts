import type { SpeakingActivityContent } from "@/types/activity";

export const newYearGoalsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/8/26: Year Reflection & New Goals (Parts of Speech)",
  description: "Practice reflecting on last year and setting goals while identifying parts of speech - especially structure words (pronouns, articles, prepositions, conjunctions)",

  keyPhrases: [
    { phrase: "Last year, I...", example: "Last year, I learned a lot of new things." },
    { phrase: "I'm proud of...", example: "I'm proud of how much my English improved." },
    { phrase: "This year, I want to...", example: "This year, I want to get a better job." },
    { phrase: "My goal is to...", example: "My goal is to become more confident speaking English." },
    { phrase: "This year, I'm going to...", example: "This year, I'm going to exercise more and eat healthier." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Looking back on LAST year: What are you proud of? What did you accomplish?",
      context: "Think about: things you learned, people you met, challenges you overcame, and progress you made."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "For THIS year: What is one thing you want to do differently?",
      context: "This could be about work, health, family, learning, or personal habits."
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "What are your top 3 goals for THIS year? Why are these important to you?",
      context: "Make them specific: 'I want to save $2000' or 'I want to pass my driver's test.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Parts of Speech - Identify Structure Words: Share 2 goals. Then identify the pronouns, articles, and prepositions you used.",
      context: "Example: 'I (pronoun) want to (infinitive) work at (preposition) a (article) hospital in (preposition) Boston.' Circle the structure words!"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "This year: What is one bad habit you want to break? What is one good habit you want to start?",
      context: "Talk about: staying up late, eating junk food, scrolling on phone, not exercising, etc."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Parts of Speech Challenge: Share your goals using ALL 8 parts of speech. Then label each one (nouns, verbs, adjectives, adverbs, pronouns, articles, prepositions, conjunctions).",
      context: "Example: 'I (pronoun) want to improve (verb) my (pronoun) English (noun) and (conjunction) get a (article) good (adjective) job (noun) in (preposition) Boston (noun) soon (adverb).'"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Structure Words Focus: Share 3 goals and use as many connecting words as possible (prepositions: at, in, on, with, for; conjunctions: and, but, because, so, or).",
      context: "Example: 'I want to study at a college in Boston because I need a degree for my career, but I also need to work, so I will study part-time.'"
    },
  ],

  reflectionPrompt: "What is ONE goal you're committing to? When you explain your goal, which parts of speech are easiest? Which are hardest?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
