import type { SpeakingActivityContent } from "@/types/activity";

export const symptomsDuration_2026_04_16: SpeakingActivityContent = {
  type: "speaking",
  title: "4/16/26: Symptoms + Duration",
  description: "Practice describing symptoms clearly and talking about how long they have lasted (for/since)",

  keyPhrases: [
    { phrase: "I have (a headache/a cough)...", example: "I have a headache and a sore throat." },
    { phrase: "I've had it for...", example: "I've had it for three days." },
    { phrase: "I've had it since...", example: "I've had it since Monday." },
    { phrase: "It hurts here.", example: "It hurts here (point)." },
    { phrase: "It's getting better/worse.", example: "It's getting worse at night." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Symptoms speed chat: Choose 2 symptoms and explain them to your partner.",
      context: "Examples: cough, fever, stomachache, back pain, headache, allergy."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Duration practice: Answer 5 questions using for/since.",
      context: "How long have you had it? / Since when? / For how many days?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Doctor questions: Ask 4 follow-up questions.",
      context: "Examples: Any fever? Any allergies? What makes it worse? Did you take medicine?"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Advice: Give 2 recommendations for common symptoms (rest, water, medicine, appointment).",
      context: "Use: should/could, It's a good idea to..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Teach-back: Repeat the plan in your own words after your partner gives advice.",
      context: "Use: So, I should..., And I shouldn't..."
    },
  ],

  reflectionPrompt: "Which is easier for you: for or since? Give one example of each.",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};

