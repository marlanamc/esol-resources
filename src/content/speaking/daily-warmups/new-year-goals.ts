import type { SpeakingActivityContent } from "@/types/activity";

export const newYearGoalsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/8/26: Year Reflection & New Goals",
  description: "Practice reflecting on last year’s accomplishments and setting goals for this year",

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
      text: "Using present perfect: Thinking about LAST year, what have you achieved? What have you learned? What have you improved?",
      context: "Example: 'I have learned to speak up in class, and I have improved my vocabulary.'"
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
      text: "Using future perfect: By the end of THIS year, what will you have accomplished? What changes will you have made?",
      context: "Example: 'By December, I will have finished Level 3, and I will have found a full-time job.'"
    },
  ],

  reflectionPrompt: "What is ONE goal you're committing to working on? How will you stay motivated?",
  reflectionMinLength: 40,
  minPromptsRequired: 2,
  released: false
};
