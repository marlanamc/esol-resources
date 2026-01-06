import type { SpeakingActivityContent } from "@/types/activity";

export const negotiationSelfAdvocacy_2026_03_24: SpeakingActivityContent = {
  type: "speaking",
  title: "3/24/26: Negotiation & Self-Advocacy (Infinitives vs Gerunds)",
  description: "Practice negotiating schedules using infinitives (decide to, plan to, want to) and gerunds (enjoy -ing, avoid -ing, consider -ing)",

  keyPhrases: [
    { phrase: "I'd like to... (infinitive)", example: "I'd like to change my schedule." },
    { phrase: "I plan to / I need to... (infinitive)", example: "I plan to take classes on Tuesdays. I need to pick up my child at 3pm." },
    { phrase: "I enjoy / I prefer... (gerund)", example: "I enjoy working mornings. I prefer having weekends off." },
    { phrase: "I can't avoid... (gerund)", example: "I can't avoid missing work if my child is sick." },
    { phrase: "Would you consider...? (gerund)", example: "Would you consider changing my shift?" },
    { phrase: "I decided to... (infinitive)", example: "I decided to ask for a schedule change." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Use INFINITIVES to explain what you need and want: I need to... / I want to... / I'd like to... / I plan to...",
      context: "Example: 'I'd like to change my schedule. I need to pick up my child at 3pm. I want to work mornings instead of evenings.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use GERUNDS to explain what you prefer and enjoy: I enjoy... / I prefer... / I like...",
      context: "Example: 'I enjoy working with customers. I prefer having weekends off. I like starting early in the morning.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Negotiation: Use both infinitives AND gerunds. What do you WANT TO do vs. What do you ENJOY DOING?",
      context: "Infinitive (goal): 'I want to work full-time.' Gerund (preference): 'I enjoy working with people.' Mix both in your answer!"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Ask your manager politely: Would you consider...? (gerund) / Would it be possible to...? (infinitive)",
      context: "Gerund: 'Would you consider changing my shift?' Infinitive: 'Would it be possible to work Tuesdays and Thursdays?'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Complex negotiation: Use verbs that take infinitives (decide to, plan to, hope to) AND verbs that take gerunds (avoid, finish, keep, suggest).",
      context: "Example: 'I decided to ask for a schedule change because I need to avoid working Sundays. I hope to keep working here, so I'm suggesting a different shift.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Grammar contrast: Explain what you CAN'T AVOID (gerund) vs. what you NEED TO DO (infinitive).",
      context: "Gerund: 'I can't avoid missing work if my child is sick.' Infinitive: 'I need to find childcare. I want to be reliable.'"
    },
  ],

  reflectionPrompt: "When negotiating, which is easier: using infinitives (want to, need to) or gerunds (enjoy -ing, prefer -ing)? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};

