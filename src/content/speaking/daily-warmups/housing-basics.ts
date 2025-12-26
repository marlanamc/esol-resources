import type { SpeakingActivityContent } from "@/types/activity";

export const housingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/13/26: Describing Your Home (Information Questions)",
  description: "Practice asking and answering information questions (WH-questions) about housing using Who, What, Where, When, Why, and How",

  keyPhrases: [
    { phrase: "Where do you live?", example: "Where do you live? / I live in Jamaica Plain." },
    { phrase: "How many...?", example: "How many bedrooms does it have? / It has two bedrooms." },
    { phrase: "What is... like?", example: "What is your neighborhood like? / It's quiet and safe." },
    { phrase: "Why did you choose...?", example: "Why did you choose this apartment? / Because the rent is affordable." },
    { phrase: "When did you move in?", example: "When did you move in? / I moved in last year." },
    { phrase: "Who do you live with?", example: "Who do you live with? / I live with my family." },
  ],

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
  released: true
};
