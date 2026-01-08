import type { SpeakingActivityContent } from "@/types/activity";

export const housingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/13/26: Describing Your Home (Information Questions)",
  description: "Ask and answer WH-questions about housing. Focus: correct question word order and complete answers.",

  keyPhrases: [
    { phrase: "Where do you live?", example: "Where do you live? / I live in Jamaica Plain." },
    { phrase: "How many...?", example: "How many bedrooms does it have? / It has two bedrooms." },
    { phrase: "What is... like?", example: "What is your neighborhood like? / It's quiet and safe." },
    { phrase: "Why did you choose...?", example: "Why did you choose this apartment? / Because rent is affordable." },
    { phrase: "When did you move in?", example: "When did you move in? / I moved in last year." },
    { phrase: "Who do you live with?", example: "Who do you live with? / I live with my family." },
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
        "Where do you live?",
        "How many...?",
        "What is... like?",
        "Why did you choose...?",
        "When did you move in?",
        "Who do you live with?"
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
        "live", "house", "apartment", "room", "bedroom", "bathroom", "kitchen",
        "neighborhood", "quiet", "safe", "expensive", "affordable", "rent",
        "family", "roommate", "alone", "move", "choose"
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
      text: "Answer these questions about your home: Where do you live? How many rooms does it have? What is your favorite room?",
      context: "Practice answering WH-questions with complete sentences. Start your answer with the question word or key info."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Ask your partner 4 questions about their home using Who, What, Where, and How many.",
      context: "Examples: Where do you live? Who do you live with? What floor is it on? How many bathrooms do you have?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Apartment hunt: You're looking for an apartment in Allston or Dorchester. Ask a landlord 6 questions using all the WH-words.",
      context: "Use: Where (location), When (available), How much (rent), What (included), Why (previous tenant left), Who (pays utilities)"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Ask your partner about their neighborhood: What is it like? Where is the closest grocery store? How do you get to class from home?",
      context: "Practice 'What is ___ like?' for descriptions. Use 'Where' for location and 'How' for transportation/methods."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Your friend is moving to Boston. They ask you about housing. What questions should they ask a landlord? Give 5 examples.",
      context: "Think about: rent, lease length, utilities, repairs, parking, laundry, pets, quiet hours, heat included"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Question practice: Create 8 questions about housing (one for each WH-word: Who, What, Where, When, Why, How, Which, Whose).",
      context: "Example: Whose responsibility is it to fix the heat? Which floor is best for families? Check your question word order!"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Role-play: You're calling about an apartment ad. Ask as many questions as you can in 2 minutes. Partner: answer as the landlord.",
      context: "Speed and accuracy! Use correct word order: Question word + auxiliary verb + subject + main verb"
    },
  ],

  reflectionPrompt: "Which WH-question word is easiest for you to use? Which is hardest? Why?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
