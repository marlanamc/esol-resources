import type { SpeakingActivityContent } from "@/types/activity";

export const negotiationSelfAdvocacy_2026_03_24: SpeakingActivityContent = {
  type: "speaking",
  title: "3/24/26: Negotiation & Self-Advocacy",
  description: "Practice negotiating schedules and responsibilities politely and clearly",

  keyPhrases: [
    { phrase: "Would it be possible to...?", example: "Would it be possible to start at 9 instead of 8?" },
    { phrase: "I’m available on...", example: "I’m available on Mondays and Wednesdays." },
    { phrase: "I can..., but I can’t...", example: "I can work evenings, but I can’t work Sundays." },
    { phrase: "I’d prefer...", example: "I’d prefer a consistent schedule each week." },
    { phrase: "That works for me.", example: "That works for me. Thank you." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Role-play: Ask for a schedule change (childcare, transportation, school).",
      context: "Include: reason + request + alternative time."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Role-play: Ask for help or training at work.",
      context: "Use: Could you show me how to...?, I need help with..., I want to do this correctly."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Polite disagreement: Your manager says no. Respond politely and offer another option.",
      context: "Use: I understand..., However..., Would it be possible to...?"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Negotiation meeting: In pairs, find a schedule that works for both people.",
      context: "Ask questions and summarize the agreement at the end."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Exit lines: Practice closing the conversation professionally.",
      context: "Use: Thanks for your time..., I appreciate it..., I’ll follow up on..."
    },
  ],

  reflectionPrompt: "What is one request you want to feel confident making in English at work?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

