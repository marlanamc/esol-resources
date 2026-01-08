import type { SpeakingActivityContent } from "@/types/activity";

export const clinicVisitStepsPassive_2026_04_28: SpeakingActivityContent = {
  type: "speaking",
  title: "4/28/26: Clinic Visit Steps (Passive Voice Intro)",
  description: "Practice passive voice. Focus: passive for procedures and instructions.",

  keyPhrases: [
    { phrase: "You are asked to...", example: "You are asked to fill out a form." },
    { phrase: "Forms are filled out.", example: "Forms are filled out at the front desk." },
    { phrase: "Your name is called.", example: "Your name is called in the waiting room." },
    { phrase: "Your temperature is taken.", example: "Your temperature is taken by a nurse." },
    { phrase: "You are given instructions.", example: "You are given instructions for medicine." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using passive voice", required: true },
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
        "You are asked to [verb]...",
        "[Forms/Papers] are filled out...",
        "Your name is called...",
        "Your temperature is taken...",
        "You are given [noun]...",
        "Instructions are provided...",
        "A test is ordered..."
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
        "clinic", "hospital", "doctor", "nurse", "patient", "appointment",
        "form", "paperwork", "registration", "check-in", "waiting room",
        "temperature", "blood pressure", "medicine", "prescription", "instructions",
        "insurance", "referral", "specialist", "emergency", "follow-up"
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
      text: "Put the steps in order: check-in → waiting room → nurse → doctor → pharmacy.",
      context: "Then say the steps out loud using passive voice."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Describe a clinic visit using 5 passive sentences.",
      context: "Use: You are asked to..., Your temperature is taken..., A test is ordered..."
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "Role-play: Patient explains what happens at the clinic to a new student.",
      context: "Use sequencing: First, Next, Then, After that, Finally."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Fix the sentence: Change active to passive.",
      context: "Example: 'The nurse takes your blood pressure' → 'Your blood pressure is taken.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Ask 3 clinic questions and answer them with passive voice.",
      context: "Example: What happens at check-in? Forms are filled out..."
    },
  ],

  reflectionPrompt: "Where is passive voice useful (rules, instructions, procedures)? Give one example.",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
