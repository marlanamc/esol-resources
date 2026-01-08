import type { SpeakingActivityContent } from "@/types/activity";

export const communityResourcesPitch_2026_06_02: SpeakingActivityContent = {
  type: "speaking",
  title: "6/2/26: Community Resources + Directions (MBTA)",
  description: "Recommend a community resource and practice giving directions / transit steps to get there",

  keyPhrases: [
    { phrase: "A good resource is...", example: "A good resource is the community health center." },
    { phrase: "It can help you with...", example: "It can help you with affordable care." },
    { phrase: "You can go to...", example: "You can go to the library for free classes." },
    { phrase: "You should bring...", example: "You should bring an ID and proof of address." },
    { phrase: "I recommend it because...", example: "I recommend it because it's close and helpful." },
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
        "A good resource is...",
        "It can help you with...",
        "You can go to...",
        "You should bring...",
        "I recommend it because..."
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
        "resource", "community", "library", "clinic", "pantry", "YMCA",
        "directions", "MBTA", "bus", "subway", "transfer", "neighbor", "support"
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
      text: "Think of one helpful place in the community. What is it? Where is it?",
      context: "Examples: library, school, clinic, food pantry, YMCA, career center."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Give a 45-second pitch: What is it, who is it for, what do you do there, why do you recommend it?",
      context: "Include 1 example and 1 tip."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Directions practice: Explain how to get there from your home (walk/bus/subway).",
      context: "Use: First..., then..., transfer at..., get off at..., it's next to..."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "MBTA problem-solving: Your partner is confused about the route. Clarify and confirm the steps.",
      context: "Use: Do you mean...? Let me repeat..., Did you say ___ or ___?"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Partner Q&A: Ask 2 questions about the resource (hours, cost, documents).",
      context: "Use: Do you need to...? Is it open on...?"
    },
  ],

  reflectionPrompt: "What makes a recommendation convincing (details, examples, clear steps)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
