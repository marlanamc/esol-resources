import type { SpeakingActivityContent } from "@/types/activity";

export const reportedSpeechDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/29/26: Past Simple Fluency Practice",
  description: "Practice telling stories and explaining what happened using past simple tense - fluency and speed practice",

  keyPhrases: [
    { phrase: "What happened?", example: "What happened at the bank?" },
    { phrase: "I went to...", example: "I went to the landlord's office yesterday." },
    { phrase: "I called... and they said...", example: "I called Eversource and they said my bill was late." },
    { phrase: "It didn't work.", example: "I tried to pay online but it didn't work." },
    { phrase: "I asked... but they told me...", example: "I asked for help but they told me to call back later." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What happened yesterday? Tell me 5 things you did yesterday in order.",
      context: "Use past simple: I woke up at 7. I ate breakfast. I went to work. I came home. I studied English."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Problem story: Tell me about a small problem you had this week. What happened? How did you solve it?",
      context: "Example: My phone died. I didn't have a charger. I asked my friend and she gave me one."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Speed round (2 minutes): Explain what happened the last time you had a problem with a bill or payment.",
      context: "Fast fluency practice! Use: I received... I called... They said... I paid... It cost..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Housing problem story: Tell about a time something broke in your home. What happened? Who did you call? What did they do?",
      context: "Example: The heat stopped working. I called my landlord. He sent someone. They fixed it the next day."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Banking story: Describe the last time you went to a Bank of America, TD Bank, or Citizens Bank. What did you do there?",
      context: "Use past simple: I went to... I waited in line. I talked to... They helped me... I deposited/withdrew..."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Chain story (fast!): Tell what happened from the moment you woke up until you arrived to class today. How many past simple verbs can you use in 2 minutes?",
      context: "Speed challenge: I woke up, got dressed, ate, left, took the T, transferred at Park Street, arrived..."
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Problem-solution story: Tell about a time you had to solve a problem (housing, money, work, transportation). What happened first, next, and finally?",
      context: "Clear sequence: First, I noticed... Then, I tried... But it didn't work. Finally, I called... and they fixed it."
    },
  ],

  reflectionPrompt: "When you tell past simple stories in English, what's harder: remembering the past tense forms or speaking quickly without stopping?",
  reflectionMinLength: 35,
  minPromptsRequired: 3,
  released: true
};
