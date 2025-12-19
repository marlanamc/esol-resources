import type { SpeakingActivityContent } from "@/types/activity";

export const classroomBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Daily Warm-up: Classroom & School Language",
  description: "Practice asking for help, clarification, and navigating school situations",

  keyPhrases: [
    { phrase: "Could you please repeat that?", example: "I'm sorry, could you please repeat that?" },
    { phrase: "I don't understand.", example: "I don't understand. Can you explain it again?" },
    { phrase: "Can you say that more slowly?", example: "Excuse me, can you say that more slowly?" },
    { phrase: "How do you spell...?", example: "How do you spell your name?" },
    { phrase: "What does ___ mean?", example: "What does 'assignment' mean?" },
    { phrase: "May I ask a question?", example: "Excuse me, may I ask a question?" },
    { phrase: "I have a question about...", example: "I have a question about the homework." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Practice asking your teacher for help. What will you say when you don't understand something?",
      context: "Use phrases like: 'I don't understand', 'Could you repeat that?', 'Can you explain this?'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "You missed class last week. What questions will you ask your teacher or classmates?",
      context: "Think about: What did we do? What's the homework? When is the test?"
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "You need to go to the bathroom during class. What will you say to your teacher?",
      context: "Practice polite requests: 'Excuse me, may I...?' or 'Can I please...?'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "The teacher is speaking too fast and you're confused. What are THREE different ways to ask for clarification?",
      context: "Examples: 'Could you speak more slowly?', 'I'm sorry, I didn't catch that', 'What does that word mean?'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Using present perfect: What school situations have been difficult for you? What have you learned to do better?",
      context: "Example: 'I have been nervous about asking questions, but I have learned that it's okay to ask for help.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Using past perfect: Think about your first day of class. What had you been worried about? What hadn't you expected?",
      context: "Example: 'Before I started class, I had worried that I wouldn't understand anything, but I hadn't expected everyone to be so friendly.'"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Using future perfect: By the end of this class, what classroom skills will you have improved?",
      context: "Example: 'By June, I will have learned to ask questions confidently, and I will have made many friends in class.'"
    },
  ],

  reflectionPrompt: "Which classroom phrase is hardest for you to say? Why do you think that is?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
