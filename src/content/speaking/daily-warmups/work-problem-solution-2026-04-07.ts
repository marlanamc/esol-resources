import type { SpeakingActivityContent } from "@/types/activity";

export const workProblemSolution_2026_04_07: SpeakingActivityContent = {
  type: "speaking",
  title: "4/7/26: Work Problem → Solution",
  description: "Practice describing a work problem, proposing a solution, and agreeing on next steps",

  keyPhrases: [
    { phrase: "The problem is...", example: "The problem is that the instructions are unclear." },
    { phrase: "This happened when...", example: "This happened when I was closing the store." },
    { phrase: "One solution could be...", example: "One solution could be more training." },
    { phrase: "Can we agree to...?", example: "Can we agree to check the schedule every Friday?" },
    { phrase: "Let’s follow up on...", example: "Let’s follow up on this next week." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Choose a workplace problem and describe it: What happened? Who was involved? What was the result?",
      context: "Examples: misunderstanding, late schedule, missing supplies, customer complaint, safety issue."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Propose 2 solutions and explain which one is best.",
      context: "Use: could/should, because, for example."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Role-play: Employee explains problem → manager responds → employee asks 2 follow-up questions.",
      context: "Use: Do you mean...? What should I do next time?"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Agree on next steps and summarize the plan in 2 sentences.",
      context: "Use: We agreed that..., The next step is..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Polite tone practice: Say the same message in a calm professional way.",
      context: "Avoid blaming; focus on the issue and solution."
    },
  ],

  reflectionPrompt: "What helps a solution conversation go well (clear examples, calm tone, next steps)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

