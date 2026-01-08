import type { SpeakingActivityContent } from "@/types/activity";

export const housingProblemsSolutions_2026_02_03: SpeakingActivityContent = {
  type: "speaking",
  title: "2/3/26: Housing Problems & Solutions (Type 0 vs Type 1 Conditionals)",
  description: "Use Type 0 conditionals to state housing problems/facts, and Type 1 conditionals to offer solutions and future plans",

  keyPhrases: [
    { phrase: "If you don't..., you... (Type 0 - facts)", example: "If you don't pay rent, you get evicted." },
    { phrase: "If I..., I will... (Type 1 - future plans)", example: "If the heat doesn't work, I will call the landlord." },
    { phrase: "When..., ... (Type 0 - general truths)", example: "When landlords ignore problems, tenants call the city." },
    { phrase: "What will happen if...? (Type 1)", example: "What will happen if they don't fix it by Friday?" },
    { phrase: "If this continues, I will... (Type 1)", example: "If this continues, I will report it to inspectional services." },
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
        "If you don't..., you... (Type 0 - facts)",
        "If I..., I will... (Type 1 - future plans)",
        "When..., ... (Type 0 - general truths)",
        "What will happen if...? (Type 1)",
        "If this continues, I will... (Type 1)"
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
        "if", "will", "landlord", "repair", "rent", "solution", "call", "city", "complaint", "notice"
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
      text: "State a housing problem using Type 0 conditional (general facts). Then say what you will do using Type 1 conditional.",
      context: "Type 0 (fact): 'If the heat doesn't work in winter, it's dangerous.' Type 1 (your plan): 'If my landlord doesn't fix it, I will call the city.' Problems: no heat, leak, bugs, broken window, loud neighbors."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What are the rules about housing repairs in Massachusetts? Use Type 0 conditionals.",
      context: "Type 0 facts: 'If you have no heat, the landlord must fix it within 24 hours. If the apartment is unsafe, you can withhold rent legally.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "You have a broken heater. Explain the problem (Type 0) and your plan (Type 1) if it's not fixed.",
      context: "Type 0: 'If the temperature drops below 68°F during the day, the landlord violates state law.' Type 1: 'If they don't fix it by tomorrow, I will file a complaint.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What happens if tenants don't report problems? What will you do if you have a problem?",
      context: "Type 0 (general): 'If you don't report problems in writing, you have no record.' Type 1 (you): 'If I have a leak, I will send an email and take photos.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What will happen if your landlord increases rent too much? What are your options?",
      context: "Type 1 (future plans): 'If my rent increases by more than $200, I will look for a new apartment. If I can't find one, I will get a roommate.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare Type 0 (housing facts/laws) with Type 1 (your future plan) for the same problem.",
      context: "Example: Type 0: 'If landlords don't fix code violations, the city fines them.' Type 1: 'If my landlord ignores my request, I will call inspectional services and document everything.'"
    },
  ],

  reflectionPrompt: "What's the difference between Type 0 (general facts/rules) and Type 1 (your future plans)? Which one is harder to use when talking about housing problems?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
