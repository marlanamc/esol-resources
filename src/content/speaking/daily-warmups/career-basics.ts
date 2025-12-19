import type { SpeakingActivityContent } from "@/types/activity";

export const careerBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Daily Warm-up: Career Goals & Job Searching",
  description: "Practice talking about careers, job interviews, and professional goals",

  keyPhrases: [
    { phrase: "I'm looking for a job in...", example: "I'm looking for a job in healthcare." },
    { phrase: "I have experience in...", example: "I have experience in customer service." },
    { phrase: "My goal is to...", example: "My goal is to become a manager." },
    { phrase: "I've been working as...", example: "I've been working as a cashier for two years." },
    { phrase: "What are your strengths?", example: "What are your strengths and weaknesses?" },
    { phrase: "I'm interested in learning...", example: "I'm interested in learning new skills." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What is your dream job? Describe what you would do every day.",
      context: "Think about the type of work, the environment, and why it appeals to you."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Imagine you're in a job interview. How would you introduce yourself and describe your experience?",
      context: "Practice saying: 'My name is...', 'I have worked...', 'I am good at...'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What job skills have you developed since coming to the U.S.? What skills do you want to improve?",
      context: "Example: 'I have improved my English communication skills, and I have learned to use new computer programs.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What challenges have you faced in looking for work? How have you overcome them?",
      context: "Talk about barriers and solutions: language, credentials, transportation, etc."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using past perfect: Before you got your current job (or last job), what had you done to prepare? What hadn't you expected?",
      context: "Example: 'Before I started this job, I had taken a training course, but I hadn't realized how fast-paced it would be.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Using future perfect: By this time next year, what career goals will you have achieved? What steps will you have taken?",
      context: "Example: 'By next December, I will have completed my certification, and I will have applied for better positions.'"
    },
  ],

  reflectionPrompt: "What career topic was easiest to talk about? What was most difficult? Why?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
