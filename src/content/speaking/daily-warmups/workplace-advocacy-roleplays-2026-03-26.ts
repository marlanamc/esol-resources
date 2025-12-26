import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceAdvocacyRoleplays_2026_03_26: SpeakingActivityContent = {
  type: "speaking",
  title: "3/26/26: Workplace Rights & Advocacy Role-Plays",
  description: "Role-play workplace problems and practice a professional problem → request → next step conversation",

  keyPhrases: [
    { phrase: "The issue is...", example: "The issue is that my hours changed without notice." },
    { phrase: "I want to make sure...", example: "I want to make sure I understand the policy." },
    { phrase: "I’d like to request...", example: "I’d like to request a written schedule." },
    { phrase: "Can we agree on...?", example: "Can we agree on a plan for next week?" },
    { phrase: "What are the next steps?", example: "What are the next steps if this happens again?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Role-play A: Employee explains a problem and requests a solution.",
      context: "Use: issue + example + request + deadline."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Role-play B: Manager responds and offers options. Employee asks 2 follow-up questions.",
      context: "Use clarification: Do you mean...? So the plan is...?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Switch roles and repeat with a new scenario.",
      context: "Scenario ideas: break time, safety equipment, overtime, disrespectful customer, training."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Document it: Say 3 details you would write down after the conversation.",
      context: "Who, what, when, where, and what was agreed."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Follow-up message: Say a short follow-up email/text summarizing the agreement.",
      context: "Use: Thank you..., As we discussed..., We agreed that..."
    },
  ],

  reflectionPrompt: "What helps you stay calm and professional during a difficult work conversation?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

