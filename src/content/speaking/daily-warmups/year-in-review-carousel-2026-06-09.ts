import type { SpeakingActivityContent } from "@/types/activity";

export const yearInReviewCarousel_2026_06_09: SpeakingActivityContent = {
  type: "speaking",
  title: "6/9/26: Year-in-Review Carousel",
  description: "Reflect on the year: most useful unit, best phrase, biggest improvement, and next steps",

  keyPhrases: [
    { phrase: "The most useful unit for me was...", example: "The most useful unit for me was Housing." },
    { phrase: "My favorite phrase is...", example: "My favorite phrase is 'Could you please repeat that?'" },
    { phrase: "I've improved in...", example: "I've improved in speaking more confidently." },
    { phrase: "One challenge was...", example: "One challenge was pronunciation." },
    { phrase: "Next, I want to...", example: "Next, I want to practice job interviews." },
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
        "The most useful unit for me was...",
        "My favorite phrase is...",
        "I've improved in...",
        "One challenge was...",
        "Next, I want to..."
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
        "unit", "phrase", "improved", "challenge", "next", "goal",
        "advice", "confidence", "practice", "thank you", "share"
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
      text: "Station 1: Most useful unit — choose one and explain why.",
      context: "Use: because + one example."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Station 2: Best phrase — share one phrase you used in real life.",
      context: "Say where you used it (doctor, work, school, store)."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Station 3: Biggest improvement — speaking, listening, reading, writing, vocabulary, confidence.",
      context: "Use: I've improved in..., I'm better at..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Station 4: One challenge + one strategy that helped you.",
      context: "Use: At first..., then..., now..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Station 5: Advice for new Level 3 students — give 3 tips.",
      context: "Use: You should..., Don't be afraid to..., It's helpful to..."
    },
  ],

  reflectionPrompt: "What is one thing you want to continue practicing after this class ends?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
