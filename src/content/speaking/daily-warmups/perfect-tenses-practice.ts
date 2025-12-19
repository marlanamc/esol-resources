import type { SpeakingActivityContent } from "@/types/activity";

export const perfectTensesPracticeDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Daily Warm-up: Perfect Tenses Practice",
  description: "Focused practice on present perfect, past perfect, and future perfect across different topics",

  keyPhrases: [
    { phrase: "I have been...", example: "I have been living here for two years." },
    { phrase: "I had never...", example: "I had never seen snow before I came to the U.S." },
    { phrase: "By the time...", example: "By the time I got there, everyone had left." },
    { phrase: "I will have...", example: "I will have finished my English classes by June." },
    { phrase: "How long have you...?", example: "How long have you been studying English?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "PRESENT PERFECT: What have you accomplished this year? What have you learned?",
      context: "Practice talking about experiences from the past that connect to now: 'I have made many new friends' or 'I have improved my English.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "PRESENT PERFECT: How long have you lived in your current home? How long have you been studying English?",
      context: "Use 'for' and 'since': 'I have lived here for three years' or 'I have been studying since September.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "PAST PERFECT: Think about moving to the U.S. What had you done to prepare? What hadn't you expected?",
      context: "Example: 'Before I moved here, I had studied English for six months, but I hadn't practiced speaking with native speakers.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "PAST PERFECT: Describe your first day at work or school here. What had you prepared? What surprised you?",
      context: "Use past perfect to show what happened before: 'I had thought it would be easy, but I had underestimated the challenge.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "FUTURE PERFECT: Imagine yourself one year from now. What will you have achieved? What will you have learned?",
      context: "Example: 'By this time next year, I will have completed Level 3, and I will have found a better job.'"
    },
  ],

  reflectionPrompt: "Which perfect tense is easiest for you? Which is hardest? Why?",
  reflectionMinLength: 40,
  minPromptsRequired: 3,
  released: false
};
