import type { SpeakingActivityContent } from "@/types/activity";

export const stressSolutionsRoundtable_2026_05_21: SpeakingActivityContent = {
  type: "speaking",
  title: "5/21/26: Stress Solutions Roundtable",
  description: "Share stress triggers and solutions using advice language and supportive conversation skills",

  keyPhrases: [
    { phrase: "I feel stressed when...", example: "I feel stressed when I have too many responsibilities." },
    { phrase: "One thing that helps me is...", example: "One thing that helps me is going for a walk." },
    { phrase: "You could try...", example: "You could try breathing exercises." },
    { phrase: "I agree because...", example: "I agree because sleep is very important." },
    { phrase: "Have you tried...?", example: "Have you tried journaling?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Share one stress trigger and one solution that helps you.",
      context: "Keep it simple: work, family, money, health, sleep."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Advice circle: Listen to your partner’s problem and give 2 suggestions.",
      context: "Use: You should..., You could..., It's a good idea to..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Supportive language: Respond with empathy and one follow-up question.",
      context: "Use: That sounds hard..., How often does that happen?"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Agree/disagree: Is sleep more important than exercise? Discuss and respond to a different opinion.",
      context: "Use: I agree/disagree because..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Plan: Choose one habit to try this week and explain how you will do it.",
      context: "Use: This week, I'm going to..., I will try to..."
    },
  ],

  reflectionPrompt: "Which advice phrase sounds most natural to you: should, could, or it's a good idea to?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

