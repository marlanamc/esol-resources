import type { SpeakingActivityContent } from "@/types/activity";

export const workplacePoliciesProcedures_2026_04_02: SpeakingActivityContent = {
  type: "speaking",
  title: "4/2/26: Workplace Policies & Procedures",
  description: "Practice talking about workplace rules, procedures, and what to do if something happens",

  keyPhrases: [
    { phrase: "The policy is...", example: "The policy is that we must wear gloves." },
    { phrase: "You're expected to...", example: "You're expected to arrive on time." },
    { phrase: "What should I do if...?", example: "What should I do if I'm late?" },
    { phrase: "Is it required to...?", example: "Is it required to sign in?" },
    { phrase: "Could you show me where...?", example: "Could you show me where the supplies are?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Ask 5 questions about workplace rules (uniform, breaks, phone use, safety, attendance).",
      context: "Use: Is it okay to...? Do we have to...? When do we...?"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Explain a rule to a new employee. Give an example.",
      context: "Use: You're expected to..., It's important because..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What do you do if...: you are late / you make a mistake / a customer is angry / you feel sick?",
      context: "Use: First..., then..., finally..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Clarification role-play: You don’t understand a procedure. Ask for help politely.",
      context: "Use: Could you repeat that? Can you show me an example? Can you speak slowly?"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Group decision: Which rule is most important for safety? Explain why.",
      context: "Use: In my opinion..., I agree/disagree because..."
    },
  ],

  reflectionPrompt: "What is one workplace rule you want to understand clearly? What question can you ask?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

