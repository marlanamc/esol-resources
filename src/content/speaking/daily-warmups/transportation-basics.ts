import type { SpeakingActivityContent } from "@/types/activity";

export const transportationBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "3/3/26: Transportation & Getting Around",
  description: "Practice talking about transportation, directions, and commuting",

  keyPhrases: [
    { phrase: "How do you get to...?", example: "How do you get to work every day?" },
    { phrase: "I usually take the...", example: "I usually take the bus to school." },
    { phrase: "I've never been to...", example: "I've never been to that neighborhood before." },
    { phrase: "How long does it take?", example: "How long does it take to get there?" },
    { phrase: "By next year, I will have...", example: "By next year, I will have learned to drive." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "How do you get to work or school? Describe your daily commute.",
      context: "Talk about what transportation you use and how long it takes."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Describe your neighborhood. What places can you walk to?",
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What places in your city have you visited? What places haven't you been to yet?",
      context: "Practice: 'I have been to the library many times, but I haven't visited the museum yet.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Using past perfect: Tell me about a time you got lost. Where had you been trying to go? What had happened?",
      context: "Example: 'I had been looking for the post office when I realized I had taken the wrong bus.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using future perfect: By this time next year, what transportation skills will you have learned or improved?",
      context: "Example: 'By next December, I will have gotten my driver's license and bought a car.'"
    },
  ],

  reflectionPrompt: "What transportation topic did you practice? Which tense was hardest?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
