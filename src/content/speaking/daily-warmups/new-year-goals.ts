import type { SpeakingActivityContent } from "@/types/activity";

export const newYearGoalsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/8/26: Year Reflection & New Goals (Warm-Up)",
  description:
    "Reflect on last year and set new goals. Focus: clear sentences, then notice the small structure words (I, a/an/the, in/at/on, because/so/but).",

  keyPhrases: [
    // Core sentence starters (from your original)
    { phrase: "Last year, I...", example: "Last year, I learned a lot of new things." },
    { phrase: "I'm proud of...", example: "I'm proud of how much my English improved." },
    { phrase: "This year, I want to...", example: "This year, I want to get a better job." },
    { phrase: "My goal is to...", example: "My goal is to become more confident speaking English." },
    { phrase: "This year, I'm going to...", example: "This year, I'm going to exercise more and eat healthier." },

    // Lifelines (keep these posted every warm-up)
    { phrase: "Can you repeat that?", example: "Can you repeat that, please?" },
    { phrase: "What does ___ mean?", example: "What does 'accomplish' mean?" },
    { phrase: "Do you mean ___?", example: "Do you mean you changed jobs?" },
    { phrase: "Can you give an example?", example: "Can you give an example?" },
    { phrase: "Why?", example: "Why is that important to you?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 1 prompt(s) below", required: true },
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
        "Last year, I [past tense verb]...",
        "I'm proud of [noun/gerund]...",
        "This year, I want to [base verb]...",
        "My goal is to [base verb]...",
        "This year, I'm going to [base verb]..."
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
        "proud", "accomplish", "challenge", "improve", "learn",
        "goal", "plan", "different", "better", "successful",
        "because", "so", "but", "in", "at", "on", "for", "with"
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
    // Keep it to 3 main prompts so the class feels unified
    {
      id: "prompt-1",
      level: "beginner",
      text: "Looking back on LAST year: What are you proud of? What did you accomplish?",
      context:
        "Plan 3 sentences. Try: 1) Last year, I… 2) I'm proud of… 3) One challenge was…, but…"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "For THIS year: What is one thing you want to do differently?",
      context:
        "Plan 3 sentences. Try: This year, I want to… because… / So I'm going to… / One small step is…"
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "What is ONE goal for this year that matters to you? Why?",
      context:
        "Make it specific. Add details with small words: in/at/on, with, for. Example pattern: My goal is to… in… because…"
    },

    // Optional extension for higher students, still aligned with today's grammar theme
    {
      id: "extension",
      level: "challenge",
      text: "Challenge: Say your goal again and include: (1) a preposition (in/at/on/for/with), and (2) a connector (because/so/but).",
      context:
        "After you speak, quickly notice your structure words (I, a/an/the, in/at/on, because/so/but)."
    },
  ],

  reflectionPrompt:
    "Quick check: Did you ask 2 follow-up questions? Which small words did you use today (in/at/on, because/so/but, a/the)?",
  reflectionMinLength: 20,
  minPromptsRequired: 1,
  released: false,
};
