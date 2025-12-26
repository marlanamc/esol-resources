import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessPresentationPractice_2026_05_28: SpeakingActivityContent = {
  type: "speaking",
  title: "5/28/26: Wellness Presentation Practice",
  description: "Practice a short wellness presentation and build Q&A skills",

  keyPhrases: [
    { phrase: "Today I’m going to talk about...", example: "Today I’m going to talk about sleep." },
    { phrase: "One reason is...", example: "One reason is that it reduces stress." },
    { phrase: "For example...", example: "For example, I turn off my phone at 10pm." },
    { phrase: "My recommendation is...", example: "My recommendation is to drink more water." },
    { phrase: "Do you have any questions?", example: "Do you have any questions?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Choose a wellness topic (sleep, stress, exercise, food, routines). Plan 3 points.",
      context: "Write 3 bullet points only."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Give a 1-minute talk to a partner. Partner asks 2 questions.",
      context: "Use: Today I'm going to talk about..., One reason is..., For example..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Improve it: Add 2 details (numbers, time, frequency, examples).",
      context: "Example: 'I walk 20 minutes, 3 times a week.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Group share: Present to a small group (3–4) and answer questions.",
      context: "Practice asking good follow-up questions."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Feedback: Give your partner one compliment and one suggestion.",
      context: "Use: I liked..., Next time you could..."
    },
  ],

  reflectionPrompt: "What part is hardest: starting, giving examples, or answering questions?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

