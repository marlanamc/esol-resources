import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/26/26: Workplace Conversations",
  description: "Practice workplace language. Focus: describing jobs, schedules, and polite requests.",

  keyPhrases: [
    { phrase: "I work as a...", example: "I work as a cashier at a grocery store." },
    { phrase: "My schedule is...", example: "My schedule is Monday through Friday, 9 to 5." },
    { phrase: "I need to request...", example: "I need to request time off next week." },
    { phrase: "Could you please...?", example: "Could you please show me how to do this?" },
    { phrase: "I don't understand...", example: "I don't understand this procedure. Can you explain?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences describing your job or workplace", required: true },
      { id: "s3", text: "Add 2 detail words (place/time/people) to your sentences", required: true },
      { id: "s4", text: "Write 2 follow-up questions you can ask a partner", required: true }
    ],
    inputs: [
      { id: "sentence1", label: "Sentence 1", type: "textarea", required: true },
      { id: "sentence2", label: "Sentence 2", type: "textarea", required: true },
      { id: "sentence3", label: "Sentence 3", type: "textarea", required: true },
      { id: "question1", label: "Follow-up Question 1", type: "text", required: true },
      { id: "question2", label: "Follow-up Question 2", type: "text", required: true }
    ],
    help: {
      sentenceFrames: [
        "I work as a...",
        "My schedule is...",
        "I need to request...",
        "Could you please...?",
        "I don't understand..."
      ],
      questionStems: [
        "Why?",
        "When?",
        "Where?",
        "How often?",
        "Who with?",
        "What is it like?"
      ],
      wordBank: [
        "work", "job", "schedule", "hours", "shift", "weekend",
        "request", "time off", "vacation", "meeting", "training",
        "could", "please", "may I", "excuse me", "thank you",
        "manager", "coworker", "team", "customer", "client"
      ]
    }
  },

  speakingMode: {
    title: "Speaking Mode (10 minutes)",
    subtitle: "Start when your teacher says GO.",
    checklist: [
      { id: "p1", text: "Speak for 2 minutes (Partner A)", required: true },
      { id: "p2", text: "Ask 2 follow-up questions (Partner B)", required: true },
      { id: "p3", text: "Switch roles and repeat", required: true },
      { id: "p4", text: "Write ONE best sentence you said (or heard)", required: true }
    ],
    inputs: [
      { id: "bestSentence", label: "Best sentence", type: "textarea", required: true }
    ],
    noPartnerNote: "Make a trio. Roles: Speaker (2 min), Question-asker (asks 2), Listener (writes 1 best sentence). Rotate."
  },

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Describe your current job or a job you had before. What are your responsibilities?",
      context: "Think about your daily tasks and what you do at work."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell me about your work schedule. What days and hours do you work?",
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "Describe your coworkers or your manager. Who do you work with?",
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "You need to ask your boss for a day off. What will you say?",
      context: "Practice requesting time off politely and explaining why you need it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "A customer is upset about something at work. How do you handle the situation?",
      context: "Practice staying calm, listening to the problem, and offering help."
    },
  ],

  reflectionPrompt: "Which workplace situation did you practice? What was challenging about it?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
