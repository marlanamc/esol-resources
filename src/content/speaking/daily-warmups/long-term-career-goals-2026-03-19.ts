import type { SpeakingActivityContent } from "@/types/activity";

export const longTermCareerGoals_2026_03_19: SpeakingActivityContent = {
  type: "speaking",
  title: "3/19/26: Long-Term Career Goals (Future Perfect Continuous)",
  description: "Practice using future perfect continuous (will have been + -ing) to talk about long-term milestones and ongoing future achievements",

  keyPhrases: [
    { phrase: "By next year, I will have been...", example: "By next year, I will have been living in the U.S. for five years." },
    { phrase: "By the time I..., I will have been...", example: "By the time I graduate, I will have been studying English for three years." },
    { phrase: "In [time], I will have been...", example: "In two years, I will have been working at my company for a decade." },
    { phrase: "Will you have been...?", example: "Will you have been working here long enough to get a raise?" },
    { phrase: "I will have been... for...", example: "I will have been saving money for two years by then." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "By the end of this year (December 2026), how long will you have been living in Boston? How long will you have been learning English?",
      context: "Future perfect continuous: 'By December, I will have been living in Boston for four years. I will have been learning English for three years.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "If you stay at your current job (or in your current field), how long will you have been working there by next year?",
      context: "Use 'will have been + -ing': 'By next June, I will have been working at Dunkin' for two years.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "By the time you get a promotion or a better job, how long will you have been working in that field?",
      context: "Future perfect continuous: 'By the time I become a manager, I will have been working in retail for five years.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "By the time you finish ESOL classes (or reach your English goal), how long will you have been studying English?",
      context: "Example: 'By the time I finish Level 5, I will have been taking ESOL classes for two years. I will have been practicing speaking for hundreds of hours.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Think about a long-term work goal. By the time you achieve it, how long will you have been working toward it?",
      context: "Future perfect continuous: 'I want to become a nurse. By the time I graduate from nursing school, I will have been preparing for four years.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare all three perfect continuous tenses: Past (had been + -ing), Present (have been + -ing), Future (will have been + -ing). Give one example of each about your career.",
      context: "Past: 'I had been working in a factory before I came here.' Present: 'I have been studying computers for six months.' Future: 'By 2028, I will have been working in IT for five years.'"
    },
  ],

  reflectionPrompt: "How do you feel about using future perfect continuous (will have been + -ing)? Which perfect continuous tense is hardest: past, present, or future? Why?",
  reflectionMinLength: 40,
  minPromptsRequired: 2,
  released: true
};
