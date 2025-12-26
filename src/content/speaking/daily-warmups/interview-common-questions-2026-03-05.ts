import type { SpeakingActivityContent } from "@/types/activity";

export const interviewCommonQuestions_2026_03_05: SpeakingActivityContent = {
  type: "speaking",
  title: "3/5/26: Interview Questions + Dress Code",
  description: "Practice interview questions, follow-up questions, and professional dress/etiquette language",

  keyPhrases: [
    { phrase: "I have experience in...", example: "I have experience in customer service." },
    { phrase: "My strengths are...", example: "My strengths are reliability and teamwork." },
    { phrase: "I'm available...", example: "I'm available on weekdays and weekends." },
    { phrase: "In my last job, I...", example: "In my last job, I helped customers and handled payments." },
    { phrase: "Could you tell me more about...?", example: "Could you tell me more about the schedule?" },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Answer: Tell me about yourself. (30 seconds)",
      context: "Name, experience, one strength, one goal."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Answer: What are your strengths? Give 2 strengths and 1 example for each.",
      context: "Use: I am..., For example..., I have..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Answer: Why do you want this job?",
      context: "Use: I want..., because..., I enjoy..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Answer: Tell me about a difficult situation at work and how you solved it.",
      context: "Use: First..., then..., finally... / I listened / I explained / I asked for help."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Ask the interviewer 2 questions about the job.",
      context: "Examples: schedule, training, responsibilities, pay, teamwork, next steps."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Dress code talk: What should you wear for an interview for your job? Why?",
      context: "Use: I would wear..., It's professional because..., I would avoid..."
    },
  ],

  reflectionPrompt: "Which interview question was hardest? What phrase helped you answer more clearly?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};
