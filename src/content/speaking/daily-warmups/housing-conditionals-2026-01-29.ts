import type { SpeakingActivityContent } from "@/types/activity";

export const housingConditionals_2026_01_29: SpeakingActivityContent = {
  type: "speaking",
  title: "1/29/26: Housing Conditionals (Type 1)",
  description: "Practice Type 1 conditionals. Focus: If + present, will + verb for future plans.",

  keyPhrases: [
    { phrase: "If I..., I will...", example: "If I save $500, I will move to a bigger apartment." },
    { phrase: "If..., I will...", example: "If rent increases, I will find a roommate." },
    { phrase: "What will you do if...?", example: "What will you do if your landlord raises the rent?" },
    { phrase: "If you..., you will...", example: "If you pay on time every month, you will build good credit." },
    { phrase: "I won't... if...", example: "I won't renew my lease if they don't fix the heat." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using Type 1 conditionals", required: true },
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
        "If I [present tense], I will [base verb]...",
        "If [present tense], I will [base verb]...",
        "What will you do if [condition]...?",
        "If you [present tense], you will [base verb]...",
        "I won't [base verb] if [condition]...",
        "If [condition happens], I will [base verb]..."
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
        "if", "will", "future", "plan", "option", "choice", "decision",
        "rent", "increase", "decrease", "roommate", "apartment", "house",
        "landlord", "lease", "contract", "deposit", "credit", "payment",
        "move", "stay", "leave", "find", "look for", "search", "afford"
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
      text: "What will you do if your rent increases next year? What are your options?",
      context: "Use Type 1 conditionals to talk about future plans. Example: 'If my rent increases, I will look for a cheaper apartment. If I can't find one, I will get a roommate.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "If you get a raise at work, what will you change about your housing situation?",
      context: "Talk about future possibilities. 'If I get a raise, I will move to a nicer neighborhood. I will look for a place with parking.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What will happen if your landlord doesn't fix a problem in your apartment? What steps will you take?",
      context: "Explain your future plan using Type 1 conditionals. 'If my landlord doesn't fix the heat, I will call the city. If they don't respond, I will withhold rent legally.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "If you save $1000 in the next 6 months, what will you do with that money for housing?",
      context: "Share your housing goals. 'If I save $1000, I will use it for a security deposit. I will move to a better apartment in Jamaica Plain.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What will you do if you lose your job? How will you handle rent and bills?",
      context: "Discuss future plans for emergencies. 'If I lose my job, I will apply for unemployment. I will talk to my landlord about a payment plan.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "If you could change one thing about housing in Boston, what would it be? What will happen if nothing changes?",
      context: "Use Type 1 conditionals to predict consequences. 'If rents keep increasing, people will leave Boston. If the city doesn't build more affordable housing, families will struggle.'"
    },
  ],

  reflectionPrompt: "How comfortable are you using Type 1 conditionals (If + present, will + verb) to talk about future housing plans? What's the difference between Type 0 (facts) and Type 1 (future predictions)?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
