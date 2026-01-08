import type { SpeakingActivityContent } from "@/types/activity";

export const homeRemediesProcess_2026_05_19: SpeakingActivityContent = {
  type: "speaking",
  title: "5/19/26: Home Remedies (Future Conditional)",
  description: "Practice using Type 1 conditionals (If + present, will + verb) to talk about home remedies and health choices",

  keyPhrases: [
    { phrase: "If I have (a cold/fever/headache), I will...", example: "If I have a cold, I will drink tea with honey." },
    { phrase: "If (remedy) doesn't work, I will...", example: "If the tea doesn't work, I will try ginger." },
    { phrase: "If it gets worse, I will...", example: "If it gets worse, I will call the doctor." },
    { phrase: "I will... if...", example: "I will rest if I feel tired." },
    { phrase: "What will you do if...?", example: "What will you do if you get sick?" },
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
        "If I have (a cold/fever/headache), I will...",
        "If (remedy) doesn't work, I will...",
        "If it gets worse, I will...",
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
        "if", "will", "cold", "fever", "headache", "remedy", "doctor", "home", "rest", "tea", "medicine"
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
      text: "Use Type 1 conditional: If you have a cold, what will you do? What home remedy will you try?",
      context: "If I have a cold, I will drink tea with honey. I will rest. I will take vitamin C."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Use Type 1 conditional: If you have a headache, what will you try first? What will you do if it doesn't help?",
      context: "If I have a headache, I will drink water. If it doesn't help, I will take medicine."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'If it gets worse, I will...': When will you call a doctor? When will you go to urgent care?",
      context: "If my fever gets worse, I will call the doctor. If I can't breathe well, I will go to urgent care."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Chain conditionals: If remedy A doesn't work, what will you try? If remedy B doesn't work, then what?",
      context: "If tea doesn't work, I will try ginger. If ginger doesn't work, I will take medicine. If nothing works, I will see a doctor."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Ask your partner questions using conditionals: 'What will you do if...?'",
      context: "What will you do if you feel sick at work? What will you do if your child has a fever? What will you do if you can't sleep?"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full conditional conversation: Use Type 1 conditionals to explain your complete plan for different health situations.",
      context: "Example: 'If I get a cold, I will rest at home and drink tea with lemon. If I have a fever over 101°F, I will take medicine. If it doesn't go down, I will call my doctor. If the doctor says to come in, I will make an appointment.'"
    },
  ],

  reflectionPrompt: "When talking about health choices, why is Type 1 conditional (If + present, will) useful? Give one example.",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
