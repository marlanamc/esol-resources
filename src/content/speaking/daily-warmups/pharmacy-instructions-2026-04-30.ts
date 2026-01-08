import type { SpeakingActivityContent } from "@/types/activity";

export const pharmacyInstructions_2026_04_30: SpeakingActivityContent = {
  type: "speaking",
  title: "4/30/26: Pharmacy Instructions (Passive Voice)",
  description: "Practice pharmacy instructions. Focus: passive voice for medication instructions and procedures.",

  keyPhrases: [
    { phrase: "This medicine is taken...", example: "This medicine is taken with food." },
    { phrase: "It should be stored...", example: "It should be stored in a cool, dry place." },
    { phrase: "The prescription is refilled...", example: "The prescription is refilled every 30 days." },
    { phrase: "You are advised to...", example: "You are advised to avoid alcohol." },
    { phrase: "Side effects may be experienced.", example: "Drowsiness may be experienced. Nausea may be felt." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using passive voice for pharmacy instructions", required: true },
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
        "This medicine is [past participle]...",
        "[Forms/Papers] are filled out...",
        "Your name is called...",
        "Your temperature is taken...",
        "You are given [noun]...",
        "Instructions are provided...",
        "A test is ordered...",
        "The prescription is refilled...",
        "Side effects may be [past participle]...",
        "You are advised to [verb]..."
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
        "clinic", "hospital", "doctor", "nurse", "patient", "appointment", "results", "test",
        "medicine", "prescription", "instructions", "follow-up", "referral", "specialist", "emergency", "MyChart", "message", "call", "phone", "healthcare"
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
      text: "Explain medicine instructions using passive voice: 'is taken', 'should be stored'.",
      context: "Example: 'This medicine is taken twice a day. It is taken with food. It should be stored in the refrigerator.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use passive voice to explain what a medicine is prescribed for: 'is prescribed for...'",
      context: "Example: 'This medicine is prescribed for high blood pressure. It is prescribed for pain. It is prescribed for infections.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use passive voice for pharmacy procedures: 'is refilled', 'is picked up', 'is ready'.",
      context: "Example: 'The prescription is refilled every month. It is picked up at the pharmacy. It is ready in 15 minutes.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use passive voice for warnings and advice: 'You are advised to...', 'You are warned about...'",
      context: "Example: 'You are advised to take this with food. You are advised to avoid alcohol. You are warned about drowsiness.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Use passive voice for side effects: 'may be experienced', 'can be felt'.",
      context: "Example: 'Drowsiness may be experienced. Nausea may be experienced. Dizziness can be felt.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full pharmacy conversation using passive voice: Explain medicine instructions, storage, warnings, and refills.",
      context: "Example: 'This antibiotic is taken three times a day. It is taken with food. It should be stored at room temperature. You are advised to finish all the pills. The prescription is refilled at your doctor's office.'"
    },
  ],

  reflectionPrompt: "Why is passive voice useful for pharmacy instructions? How is it different from active voice?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
