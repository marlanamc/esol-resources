import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceRightsScenarios_2026_03_17: SpeakingActivityContent = {
  type: "speaking",
  title: "3/17/26: Workplace Rights Scenarios",
  description: "Practice discussing workplace rights scenarios and choosing an appropriate next step",

  keyPhrases: [
    { phrase: "I’m concerned about...", example: "I’m concerned about my schedule changing every day." },
    { phrase: "This doesn’t seem fair because...", example: "This doesn’t seem fair because only some people get breaks." },
    { phrase: "I’d like to request...", example: "I’d like to request a consistent schedule." },
    { phrase: "Can we talk about a solution?", example: "Can we talk about a solution for this?" },
    { phrase: "Who should I contact?", example: "Who should I contact about this issue?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Scenario talk: Read a scenario and explain the problem in 2–3 sentences.",
      context: "Examples: no break, unsafe situation, unpaid hours, discrimination, schedule change, disrespect."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "What’s the best next step? Choose ONE: talk to a supervisor, write a message, contact HR, ask a coworker, document the issue.",
      context: "Use: I think the best next step is..., because..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Role-play: Employee explains the issue. Manager responds. Employee asks 2 follow-up questions.",
      context: "Use polite tone and clarification questions."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Language practice: Say the same message in a soft way and a direct way.",
      context: "Example: 'Could we talk about...' vs 'I need this to change...'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-debate: Which scenario is most serious? Explain why and respond to a different opinion.",
      context: "Use: I agree/disagree because..., In my opinion..."
    },
  ],

  reflectionPrompt: "Which phrase helps you sound professional when you are upset or stressed?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

