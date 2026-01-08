import type { SpeakingActivityContent } from "@/types/activity";

export const tenantLandlordPhoneCall_2026_01_22: SpeakingActivityContent = {
  type: "speaking",
  title: "1/22/26: Tenant ↔ Landlord Phone Call",
  description: "Practice calling a landlord about a problem, requesting repairs, and confirming details",

  keyPhrases: [
    { phrase: "I'm calling about...", example: "I'm calling about a leak in my bathroom." },
    { phrase: "The problem started...", example: "The problem started yesterday." },
    { phrase: "Could you please send someone to...?", example: "Could you please send someone to fix it?" },
    { phrase: "When can you come?", example: "When can you come to check it?" },
    { phrase: "Let me confirm...", example: "Let me confirm: Friday at 10am, right?" },
    { phrase: "My address is...", example: "My address is 12 Main Street, Apartment 3B." },
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
        "I'm calling about...",
        "The problem started...",
        "Could you please send someone to...?",
        "When can you come?",
        "Let me confirm...",
        "My address is..."
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
        "problem", "repair", "landlord", "tenant", "address", "appointment",
        "confirm", "heat", "water", "noise", "bugs", "stove"
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
      text: "Role-play: You are the tenant. Call your landlord about a problem (heat, water, noise, bugs, broken stove).",
      context: "Include: problem, when it started, how urgent it is."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Role-play: You are the landlord. Ask questions and propose a time to visit.",
      context: "Ask: What happened? When did it start? Is it dangerous? What is your address?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Add a follow-up: The landlord didn’t fix the problem. Call again and be polite but firm.",
      context: "Use: I'm following up..., It still isn't working..., I need this fixed as soon as possible."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Confirm details: Practice spelling your name, giving your address, and repeating the appointment time.",
      context: "Use clarification: Could you repeat that? How do you spell that? Did you say Tuesday or Thursday?"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Formal vs informal: Say the same message in a casual way and a formal way.",
      context: "Compare: 'Hey, my heater is broken' vs 'Hello, I'm calling to report that my heater is not working.'"
    },
  ],

  reflectionPrompt: "Which part of the phone call is hardest for you (explaining, asking questions, confirming)? Why?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
