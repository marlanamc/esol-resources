import type { SpeakingActivityContent } from "@/types/activity";

export const summerNextStepsGoals_2026_06_11: SpeakingActivityContent = {
  type: "speaking",
  title: "6/11/26: Summer + Next Steps Goals",
  description: "Practice goal-setting language. Focus: future perfect and planning vocabulary.",

  keyPhrases: [
    { phrase: "This summer, I plan to...", example: "This summer, I plan to practice English every day." },
    { phrase: "My next step is to...", example: "My next step is to update my resume." },
    { phrase: "By (month), I will have...", example: "By September, I will have applied for three jobs." },
    { phrase: "One obstacle might be...", example: "One obstacle might be my schedule." },
    { phrase: "To solve that, I can...", example: "To solve that, I can practice on weekends." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using future perfect and planning language", required: true },
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
        "This summer, I plan to [verb]...",
        "My next step is to [verb]...",
        "By [month], I will have [past participle]...",
        "One obstacle might be [noun]...",
        "To solve that, I can [verb]...",
        "My goal is to [verb]..."
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
        "plan", "goal", "step", "obstacle", "solution", "timeline", "deadline",
        "practice", "improve", "learn", "apply", "study", "finish", "complete",
        "summer", "fall", "job", "career", "education", "training", "program"
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
      text: "Share one summer goal for English and one goal for life (work/health/family).",
      context: "Make it specific."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Make a 3-step plan for your goal (Step 1/2/3).",
      context: "Use sequencing words and time words."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Future perfect practice: Say one goal using “By ___, I will have ___.”",
      context: "Example: By September, I will have finished my resume."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Obstacles and solutions: Share one obstacle and one solution.",
      context: "Use: might, could, can."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Partner coaching: Give your partner 2 suggestions to help them succeed.",
      context: "Use: You could..., It's a good idea to..."
    },
  ],

  reflectionPrompt: "What is one small action you can do this week to start your goal?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
