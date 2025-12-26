import type { SpeakingActivityContent } from "@/types/activity";

export const housingProblemsSolutions_2026_02_03: SpeakingActivityContent = {
  type: "speaking",
  title: "2/3/26: Housing Problems & Solutions",
  description: "Describe a housing problem clearly and propose a solution or next step",

  keyPhrases: [
    { phrase: "It's not working.", example: "The heater isn't working." },
    { phrase: "It's leaking / clogged / broken.", example: "The sink is clogged." },
    { phrase: "This is urgent because...", example: "This is urgent because we have no hot water." },
    { phrase: "Could you fix it by...?", example: "Could you fix it by Friday?" },
    { phrase: "If it isn't fixed, I will...", example: "If it isn't fixed, I will contact the city." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Choose a problem card and explain it to your partner: What is the problem? Where is it? When did it start?",
      context: "Problems: no heat, leak, bugs, broken window, loud neighbors, bad smell."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Problem → request: Make a clear request and a deadline.",
      context: "Use: Could you...?, I need..., by (day/time)."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Add details: Give two examples of how the problem affects your life.",
      context: "Example: 'My child can't sleep' / 'I can't cook' / 'It's unsafe.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Next steps: What will you do if the landlord doesn’t respond?",
      context: "Use: follow up, send an email, call again, talk to neighbors, contact the city."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-meeting: In a group, choose the most urgent problem and explain why.",
      context: "Use: In my opinion..., I agree/disagree..., The most urgent issue is..."
    },
  ],

  reflectionPrompt: "What information makes a complaint clear (where, when, how, examples)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

