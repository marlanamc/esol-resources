import type { SpeakingActivityContent } from "@/types/activity";

export const housingVocabRoomDescriptions_2026_01_20: SpeakingActivityContent = {
  type: "speaking",
  title: "1/20/26: Housing Vocabulary + Room Descriptions",
  description: "Build housing vocabulary and practice describing rooms, furniture, and common apartment features",

  keyPhrases: [
    { phrase: "There is / There are...", example: "There are two bedrooms and one bathroom." },
    { phrase: "In my living room, I have...", example: "In my living room, I have a sofa and a small table." },
    { phrase: "It's next to / across from...", example: "The kitchen is next to the living room." },
    { phrase: "My place is (small/quiet/bright)...", example: "My place is small, but it's bright." },
    { phrase: "I share my apartment with...", example: "I share my apartment with my sister." },
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
        "There is / There are...",
        "In my living room, I have...",
        "It's next to / across from...",
        "My place is (small/quiet/bright)...",
        "I share my apartment with..."
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
        "living room", "bedroom", "bathroom", "kitchen", "furniture",
        "sofa", "table", "chair", "closet", "window", "apartment", "share"
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
      text: "Describe your home: What rooms are there? How many bedrooms and bathrooms?",
      context: "Use: There is/There are, bedroom, bathroom, kitchen, living room."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Describe ONE room in detail. What furniture is in the room?",
      context: "Use: table, chair, bed, couch/sofa, closet, window, lamp."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Give directions inside your home: How do you get from the front door to the kitchen?",
      context: "Use prepositions: next to, behind, across from, on the left/right."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Compare: What is different about your home now vs your home in the past?",
      context: "Use simple comparatives: bigger/smaller, quieter/noisier, closer/farther."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Pair interview: Ask your partner 5 questions about their home and take notes. Then introduce their home to the class.",
      context: "Ask follow-ups: Why? How often? Since when? What do you like best?"
    },
  ],

  reflectionPrompt: "What new housing words did you use today? Which word do you want to practice more?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
