import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceSmallTalkSafeTopics_2026_03_31: SpeakingActivityContent = {
  type: "speaking",
  title: "3/31/26: Workplace Small Talk (Safe Topics)",
  description: "Practice starting, continuing, and ending short workplace conversations using safe topics and follow-up questions",

  keyPhrases: [
    { phrase: "How's your day going?", example: "Hi! How's your day going?" },
    { phrase: "How was your weekend?", example: "How was your weekend?" },
    { phrase: "What do you do after work?", example: "What do you do after work?" },
    { phrase: "That's interesting—tell me more.", example: "That's interesting—tell me more." },
    { phrase: "I should get back to work.", example: "I should get back to work. See you later!" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Start small talk with a coworker. Choose 2 topics: weather, commute, food, weekend plans, sports, TV.",
      context: "Ask 2 questions and give 2 short answers."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Keep the conversation going for 1 minute using follow-up questions.",
      context: "Use: Why? How often? What do you like about it? What happened next?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Boundaries: What topics are NOT good at work? How can you change the subject politely?",
      context: "Use: Let's talk about..., I'm not sure..., Anyway..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Ending lines: Practice ending the conversation politely.",
      context: "Use: Nice talking with you..., See you later..., I should get back to..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Role-play: A coworker is stressed. Say something supportive and ask 1 follow-up question.",
      context: "Use: Are you okay? That sounds hard. Do you want to talk about it?"
    },
  ],

  reflectionPrompt: "What is your favorite safe small-talk question? When can you use it?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

