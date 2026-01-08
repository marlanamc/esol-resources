import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessReflectionWhatsChanged_2026_06_04: SpeakingActivityContent = {
  type: "speaking",
  title: "6/4/26: Wellness Reflection (What’s Changed?)",
  description: "Reflect on wellness changes using present perfect and present perfect continuous",

  keyPhrases: [
    { phrase: "I've started...", example: "I've started drinking more water." },
    { phrase: "I've stopped...", example: "I've stopped eating fast food so often." },
    { phrase: "I've been trying to...", example: "I've been trying to sleep earlier." },
    { phrase: "I've gotten better at...", example: "I've gotten better at managing stress." },
    { phrase: "One thing I still want to improve is...", example: "One thing I still want to improve is exercise." },
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
        "I've started...",
        "I've stopped...",
        "I've been trying to...",
        "I've gotten better at...",
        "One thing I still want to improve is..."
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
        "changed", "habit", "present perfect", "present perfect continuous",
        "practice", "improve", "proud", "strategy", "support", "progress"
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
      level: "intermediate",
      text: "Talk about 2 changes you have made for your health recently.",
      context: "Use: I've started..., I've stopped..."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Ongoing effort: Share one thing you’ve been trying to improve. How long have you been trying?",
      context: "Use: I've been trying to..., for/since..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Partner follow-ups: Ask 3 follow-up questions to get details.",
      context: "How often? Why? What helped you? What was hard?"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Advice: Tell your partner one small habit that can help this week.",
      context: "Use: You could try..., It's a good idea to..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-share: Say one success and one challenge to the class.",
      context: "Use: I'm proud that..., I'm still working on..."
    },
  ],

  reflectionPrompt: "What change are you most proud of? What helped you succeed?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
