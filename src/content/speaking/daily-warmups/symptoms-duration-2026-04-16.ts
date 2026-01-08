import type { SpeakingActivityContent } from "@/types/activity";

export const symptomsDuration_2026_04_16: SpeakingActivityContent = {
  type: "speaking",
  title: "4/16/26: Symptoms + Advice (Advice Modals)",
  description: "Practice describing symptoms and giving/receiving health advice using modals (should, shouldn't, must, have to, need to)",

  keyPhrases: [
    { phrase: "You should...", example: "You should see a doctor if you have a high fever." },
    { phrase: "You shouldn't...", example: "You shouldn't go to work if you're contagious." },
    { phrase: "You must / have to...", example: "You must take the medicine three times a day. You have to rest." },
    { phrase: "You need to...", example: "You need to drink more water. You need to make an appointment." },
    { phrase: "You could...", example: "You could try taking ibuprofen. You could call the doctor's office." },
    { phrase: "It might be...", example: "It might be a cold. It might be serious—you should get checked." },
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
        "You should...",
        "You shouldn't...",
        "You must / have to...",
        "You need to...",
        "You could...",
        "It might be..."
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
        "should", "must", "have to", "need to", "could", "symptom",
        "advice", "doctor", "rest", "water", "fever", "cold"
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
      text: "Give advice using 'should' and 'shouldn't': If someone has a headache, what should they do? What shouldn't they do?",
      context: "You should rest. You should drink water. You shouldn't look at screens. You shouldn't skip meals."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Give advice using 'need to': If someone has a fever, what do they need to do?",
      context: "You need to take your temperature. You need to rest. You need to call the doctor if it's over 103°F."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'must' and 'have to' for strong advice: What must you do if you have a serious symptom?",
      context: "You must see a doctor immediately. You have to go to the emergency room. You must take the medicine exactly as prescribed."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'could' for suggestions: If someone has a cold, what could they try?",
      context: "You could drink tea with honey. You could take vitamin C. You could rest for a few days. You could try over-the-counter medicine."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Roleplay: Partner describes a symptom → You give 3 pieces of advice using different modals (should, need to, could).",
      context: "Example: 'I have a bad cough.' → 'You should rest. You need to drink lots of water. You could try cough medicine.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare modals: When do you use 'should' vs 'must' vs 'could'? Give examples for each with health advice.",
      context: "'Should' = recommendation. 'Must/have to' = necessary/required. 'Could' = suggestion/possibility. Example: 'You should rest' (advice) vs 'You must take this medicine' (required) vs 'You could try tea' (suggestion).'"
    },
  ],

  reflectionPrompt: "Which advice modal is most useful in health situations: should, must, have to, need to, or could? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
