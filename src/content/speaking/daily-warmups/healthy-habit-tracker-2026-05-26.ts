import type { SpeakingActivityContent } from "@/types/activity";

export const healthyHabitTracker_2026_05_26: SpeakingActivityContent = {
  type: "speaking",
  title: "5/26/26: Healthy Habit Tracker (Report Results)",
  description: "Do a quick class survey about wellness habits and report results clearly",

  keyPhrases: [
    { phrase: "How often do you...?", example: "How often do you exercise?" },
    { phrase: "I usually / sometimes / rarely...", example: "I usually drink water in the morning." },
    { phrase: "Most people...", example: "Most people sleep about 7 hours." },
    { phrase: "A few people...", example: "A few people meditate." },
    { phrase: "I learned that...", example: "I learned that many people want to sleep more." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Survey: Ask 3 classmates 5 questions about habits (sleep, water, exercise, vegetables, stress).",
      context: "Write short notes while you listen."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Report your results to a partner using quantities (most, some, a few, none).",
      context: "Example: 'Most people drink coffee every day. A few people drink soda.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Class report: Share one interesting result and one surprise.",
      context: "Use: I was surprised that..., I noticed that..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Goal talk: Choose one habit to improve and explain your plan.",
      context: "Use: I'm going to..., I will try to..., My goal is..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Advice: Based on the survey, give 2 class recommendations.",
      context: "Use: We should..., It would be helpful to..."
    },
  ],

  reflectionPrompt: "What did you learn from the survey? What is one habit you want to change?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

