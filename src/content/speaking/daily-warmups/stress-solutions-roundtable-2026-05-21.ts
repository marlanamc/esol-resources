import type { SpeakingActivityContent } from "@/types/activity";

export const stressSolutionsRoundtable_2026_05_21: SpeakingActivityContent = {
  type: "speaking",
  title: "5/21/26: Stress Solutions (Future Conditional)",
  description: "Practice using Type 1 conditionals (If + present, will + verb) to talk about stress management strategies and coping plans",

  keyPhrases: [
    { phrase: "If I feel stressed, I will...", example: "If I feel stressed, I will take a break and breathe deeply." },
    { phrase: "If I can't..., I will...", example: "If I can't sleep, I will try meditation or tea." },
    { phrase: "If (problem) happens, I will...", example: "If work gets too busy, I will ask for help." },
    { phrase: "I will... if...", example: "I will go for a walk if I feel overwhelmed." },
    { phrase: "What will you do if...?", example: "What will you do if you feel anxious?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using the Key Phrases", required: true },
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
        "If I feel stressed, I will...",
        "If I can't..., I will...",
        "If (problem) happens, I will...",
        "I will... if...",
        "What will you do if...?"
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
        "stress", "manage", "break", "breathe", "meditation", "work", "support",
        "plan", "healthy", "mental", "anxiety", "pause"
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
      text: "Use Type 1 conditional: If you feel stressed, what will you do? What strategies will you try?",
      context: "If I feel stressed, I will take deep breaths. I will go for a walk. I will call a friend."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Use Type 1 conditional: If you can't sleep, what will you try? What will you do if it doesn't help?",
      context: "If I can't sleep, I will drink tea. If that doesn't help, I will try meditation."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use conditionals for work stress: If work gets too busy, what will you do? If your boss asks you to work overtime?",
      context: "If work gets too busy, I will prioritize my tasks. If my boss asks me to work overtime, I will explain my schedule."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use conditionals for self-care: If you feel overwhelmed, what will you do to take care of yourself?",
      context: "If I feel overwhelmed, I will take a break. I will set boundaries. I will ask for help if I need it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Ask your partner questions using conditionals: 'What will you do if...?'",
      context: "What will you do if you feel anxious? What will you do if you have too much to do? What will you do if you need a mental health day?"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full conditional plan: Use Type 1 conditionals to explain your complete stress management plan.",
      context: "Example: 'If I start to feel stressed, I will notice my body's signals. If I'm breathing fast, I will do breathing exercises. If I still feel overwhelmed, I will take a 10-minute break. If it continues, I will talk to someone I trust.'"
    },
  ],

  reflectionPrompt: "How does using Type 1 conditional (If + present, will) help you plan for stressful situations? Give one example.",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
