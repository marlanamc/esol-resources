import type { SpeakingActivityContent } from "@/types/activity";

export const finalPresentationRehearsal_2026_06_16: SpeakingActivityContent = {
  type: "speaking",
  title: "6/16/26: Final Presentation Rehearsal",
  description: "Rehearse a short end-of-year talk and practice asking and answering questions",

  keyPhrases: [
    { phrase: "My goal is...", example: "My goal is to get a better job." },
    { phrase: "I've learned...", example: "I've learned how to advocate for myself." },
    { phrase: "One example is...", example: "One example is calling the doctor to make an appointment." },
    { phrase: "My next step is...", example: "My next step is to study for a certification." },
    { phrase: "Do you have any questions?", example: "Do you have any questions?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Plan your talk (60–90 seconds): goal, what you learned, one success, next steps.",
      context: "Write 4 bullet points only."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Rehearse with a partner. Partner asks 2 questions.",
      context: "Practice clear answers and follow-up questions."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Improve: Add one detail (a number, date, time, or example).",
      context: "Example: 'I studied 2 times a week.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Small group rehearsal: Present to 3–4 classmates and answer questions.",
      context: "Focus on volume, pace, and eye contact."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Feedback round: Give one compliment and one suggestion to a partner.",
      context: "Use: I liked..., Next time you could..."
    },
  ],

  reflectionPrompt: "What part of your presentation do you want to improve before the final day?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

