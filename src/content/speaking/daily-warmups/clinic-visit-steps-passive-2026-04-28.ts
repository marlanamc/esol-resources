import type { SpeakingActivityContent } from "@/types/activity";

export const clinicVisitStepsPassive_2026_04_28: SpeakingActivityContent = {
  type: "speaking",
  title: "4/28/26: Clinic Visit Steps (Passive Voice Intro)",
  description: "Introduce passive voice through common clinic steps and procedures",

  keyPhrases: [
    { phrase: "You are asked to...", example: "You are asked to fill out a form." },
    { phrase: "Forms are filled out.", example: "Forms are filled out at the front desk." },
    { phrase: "Your name is called.", example: "Your name is called in the waiting room." },
    { phrase: "Your temperature is taken.", example: "Your temperature is taken by a nurse." },
    { phrase: "You are given instructions.", example: "You are given instructions for medicine." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Put the steps in order: check-in → waiting room → nurse → doctor → pharmacy.",
      context: "Then say the steps out loud using passive voice."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Describe a clinic visit using 5 passive sentences.",
      context: "Use: You are asked to..., Your temperature is taken..., A test is ordered..."
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "Role-play: Patient explains what happens at the clinic to a new student.",
      context: "Use sequencing: First, Next, Then, After that, Finally."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Fix the sentence: Change active to passive.",
      context: "Example: 'The nurse takes your blood pressure' → 'Your blood pressure is taken.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Ask 3 clinic questions and answer them with passive voice.",
      context: "Example: What happens at check-in? Forms are filled out..."
    },
  ],

  reflectionPrompt: "Where is passive voice useful (rules, instructions, procedures)? Give one example.",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

