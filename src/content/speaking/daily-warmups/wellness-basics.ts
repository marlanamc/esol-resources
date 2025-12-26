import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "5/12/26: Wellness & Self-Care",
  description: "Practice talking about mental health, stress management, and holistic wellness",

  keyPhrases: [
    { phrase: "I feel stressed when...", example: "I feel stressed when I have too much work." },
    { phrase: "To relax, I usually...", example: "To relax, I usually listen to music or take a walk." },
    { phrase: "I've been trying to...", example: "I've been trying to sleep better and exercise more." },
    { phrase: "Taking care of myself means...", example: "Taking care of myself means setting boundaries and resting when I need to." },
    { phrase: "I need to make time for...", example: "I need to make time for activities I enjoy." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What do you do to relax after a stressful day? Describe your favorite way to unwind.",
      context: "Think about activities that help you feel calm: exercise, hobbies, spending time with family, etc."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What makes you feel stressed? How do you handle stress?",
      context: "Talk about stressors (work, family, money) and your coping strategies."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What healthy habits have you started this year? What habits have you been trying to change?",
      context: "Example: 'I have started walking every morning, and I have been trying to eat less sugar.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What does self-care mean to you? How do you take care of your mental and physical health?",
      context: "Discuss: sleep, exercise, healthy eating, hobbies, social connections, setting boundaries."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using past perfect: Think about a time you felt burned out or overwhelmed. What signs had you ignored? What had you needed?",
      context: "Example: 'Before I got sick, I had been working too much and hadn't been sleeping enough. I hadn't realized how tired I was.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Using future perfect: By the end of this year, what wellness goals will you have achieved? What changes will you have made?",
      context: "Example: 'By December, I will have established a regular exercise routine, and I will have learned to manage my stress better.'"
    },
  ],

  reflectionPrompt: "What self-care topic resonated with you most? What do you want to work on?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};
