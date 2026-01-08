import type { SpeakingActivityContent } from "@/types/activity";

export const transportationBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "3/3/26: Transportation & Getting Around",
  description: "Practice transportation vocabulary. Focus: present perfect for experiences and future perfect for goals.",

  keyPhrases: [
    { phrase: "How do you get to...?", example: "How do you get to work every day?" },
    { phrase: "I usually take...", example: "I usually take the bus to school." },
    { phrase: "I've never been to...", example: "I've never been to that neighborhood before." },
    { phrase: "How long does it take?", example: "How long does it take to get there?" },
    { phrase: "By next year, I will have...", example: "By next year, I will have learned to drive." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences about transportation using present perfect", required: true },
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
        "How do you get to...?",
        "I usually take...",
        "I've never been to...",
        "How long does it take?",
        "By next year, I will have..."
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
        "bus", "train", "subway", "car", "walk", "bike", "drive",
        "take", "get to", "arrive", "leave", "commute", "travel",
        "never", "always", "usually", "sometimes", "often", "rarely"
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
      text: "How do you get to work or school? Describe your daily commute.",
      context: "Talk about what transportation you use and how long it takes."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Describe your neighborhood. What places can you walk to?",
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: What places in your city have you visited? What places haven't you been to yet?",
      context: "Practice: 'I have been to the library many times, but I haven't visited the museum yet.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Using past perfect: Tell me about a time you got lost. Where had you been trying to go? What had happened?",
      context: "Example: 'I had been looking for the post office when I realized I had taken the wrong bus.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using future perfect: By this time next year, what transportation skills will you have learned or improved?",
      context: "Example: 'By next December, I will have gotten my driver's license and bought a car.'"
    },
  ],

  reflectionPrompt: "What transportation topic did you practice? Which tense was hardest?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
