import type { SpeakingActivityContent } from "@/types/activity";

export const healthcareBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "4/14/26: Healthcare & Doctor Visits (Advice Modals)",
  description: "Practice advice modals. Focus: should/shouldn't, must/have to, need to for health advice.",

  keyPhrases: [
    { phrase: "You should...", example: "You should see a doctor if you have a high fever." },
    { phrase: "You shouldn't...", example: "You shouldn't go to work if you're contagious." },
    { phrase: "You must / have to...", example: "You must take antibiotic three times a day." },
    { phrase: "You need to...", example: "You need to schedule a follow-up appointment." },
    { phrase: "I should have...", example: "I should have called doctor sooner." },
    { phrase: "Do I have to...?", example: "Do I have to fast before blood test?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences giving health advice using modals", required: true },
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
        "You should...",
        "You shouldn't...",
        "You must / have to...",
        "You need to...",
        "I should have...",
        "Do I have to...?"
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
        "should", "shouldn't", "must", "have to", "need to", "don't have to",
        "see", "call", "take", "schedule", "visit", "rest", "exercise",
        "doctor", "medicine", "appointment", "symptoms", "fever", "pain"
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
      text: "Give 3 pieces of health advice using should/shouldn't. What should people do when they feel sick?",
      context: "Examples: You should drink water. You should rest. You shouldn't go to work. You shouldn't ignore a high fever."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Doctor's instructions: The doctor says you have a cold. What must you do? What should you do? What shouldn't you do?",
      context: "Use: I must take medicine. I should rest. I shouldn't exercise. I have to stay home for 3 days."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Emergency room advice: Your friend has a bad cut. Give them advice using modals. When should they go to the ER? What do they have to bring?",
      context: "You should go to the emergency room immediately. You must bring your insurance card. You need to apply pressure to stop the bleeding."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Medication instructions: The doctor prescribed medicine. Explain what you have to do, what you should do, and what you must not do.",
      context: "I have to take it twice a day. I should take it with food. I must not drink alcohol. I need to finish all the pills."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Preventive health: What should people do to stay healthy? What do they have to do every year? What shouldn't they do?",
      context: "You should exercise 3 times a week. You have to get a flu shot every year. You must see a dentist twice a year. You shouldn't eat too much sugar."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Past regret (should have): Think about a time you were sick. What should you have done differently? What shouldn't you have done?",
      context: "I should have called the doctor sooner. I should have rested more. I shouldn't have gone to work. I should have taken the medicine on time."
    },
  ],

  reflectionPrompt: "When giving health advice, which modal do you use most: should, must, or have to? What's the difference between them?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
