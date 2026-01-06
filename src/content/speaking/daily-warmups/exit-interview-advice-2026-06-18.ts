import type { SpeakingActivityContent } from "@/types/activity";

export const exitInterviewAdvice_2026_06_18: SpeakingActivityContent = {
  type: "speaking",
  title: "6/18/26: Exit Interview + Advice for New Students",
  description: "Reflect on progress, give feedback, and practice advice language for new students",

  keyPhrases: [
    { phrase: "I feel more confident about...", example: "I feel more confident about speaking at work." },
    { phrase: "The hardest thing was...", example: "The hardest thing was pronunciation." },
    { phrase: "The most helpful activity was...", example: "The most helpful activity was role-plays." },
    { phrase: "I recommend...", example: "I recommend practicing every day." },
    { phrase: "If you want to improve, you should...", example: "If you want to improve, you should speak as much as possible." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Exit interview: Answer 5 questions about your experience this year.",
      context: "What did you like? What was hard? What helped you?"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Advice for new students: Give 3 tips and explain why.",
      context: "Use: You should..., Don't be afraid to..., It's helpful to..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Program feedback: What do you want more of next year? What should change?",
      context: "Use: I'd like more..., I suggest..., It would be better if..."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Role-play: Teacher asks follow-up questions. Student answers with details.",
      context: "Use: for example, because, one reason is..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Celebrate: Share one success and give a compliment to a classmate.",
      context: "Use: I'm proud of..., I noticed that you..."
    },
  ],

  reflectionPrompt: "What is one thing you will keep doing to practice English after today?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

