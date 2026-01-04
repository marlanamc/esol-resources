import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceRightsScenarios_2026_03_17: SpeakingActivityContent = {
  type: "speaking",
  title: "3/17/26: Workplace Rights Scenarios (Present Perfect Continuous)",
  description: "Practice discussing workplace rights using present perfect continuous to explain ongoing problems and how long they've been happening",

  keyPhrases: [
    { phrase: "I have been experiencing...", example: "I have been experiencing problems with my schedule." },
    { phrase: "This has been happening...", example: "This has been happening for three weeks." },
    { phrase: "How long have you been...?", example: "How long have you been working without breaks?" },
    { phrase: "I have been trying to...", example: "I have been trying to talk to my manager about this." },
    { phrase: "We have been waiting for...", example: "We have been waiting for a response since last month." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Describe a workplace problem using present perfect continuous. How long has this been happening?",
      context: "Use: I have been experiencing... This has been happening for... I have been working without breaks for two months."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Workplace rights scenario: You haven't been getting breaks. Explain the problem using present perfect continuous and ask for a solution.",
      context: "I have been working 8-hour shifts without breaks for three weeks. This has been very difficult. I have been feeling exhausted."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Ask your manager: How long has this policy been in place? How long have other workers been dealing with this?",
      context: "Use questions: How long have you been aware of this? How long has the company been doing this?"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Explain your efforts: What have you been doing to try to fix this problem? Who have you been talking to?",
      context: "I have been documenting every incident. I have been talking to my coworkers. I have been trying to speak with my supervisor."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Compare past simple and present perfect continuous: What happened vs. What has been happening?",
      context: "Past simple: My boss yelled at me yesterday. Present perfect continuous: My boss has been yelling at me for months."
    },
  ],

  reflectionPrompt: "When discussing workplace problems, how does present perfect continuous help you explain ongoing issues? How is it different from past simple?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: true
};

