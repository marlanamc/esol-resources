import type { SpeakingActivityContent } from "@/types/activity";

export const healthcareBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "4/14/26: Healthcare & Doctor Visits",
  description: "Practice talking about health, doctor appointments, and medical situations",

  keyPhrases: [
    { phrase: "I have an appointment with...", example: "I have an appointment with Dr. Smith at 2pm." },
    { phrase: "I've been feeling...", example: "I've been feeling sick for three days." },
    { phrase: "How long have you had...?", example: "How long have you had this pain?" },
    { phrase: "I need to make an appointment.", example: "I need to make an appointment for next week." },
    { phrase: "By next week, I will have...", example: "By next week, I will have finished my medicine." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Describe the last time you went to the doctor. What was wrong?",
      context: "Think about your symptoms and what the doctor told you."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "You need to call the doctor's office to make an appointment. What will you say?",
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Using present perfect: Tell me about a health problem you have had recently. How long have you had it?",
      context: "Practice: 'I have had a headache for two days' or 'I have been coughing since Monday.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Using past perfect: Before you saw the doctor last time, what symptoms had you experienced? What had you tried?",
      context: "Example: 'Before I went to the doctor, I had taken medicine for a week, but it hadn't helped.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Using future perfect: By the end of next month, what health goals will you have achieved?",
      context: "Example: 'By the end of January, I will have lost 5 pounds' or 'I will have quit smoking.'"
    },
  ],

  reflectionPrompt: "Which perfect tense did you practice? What made it challenging?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
