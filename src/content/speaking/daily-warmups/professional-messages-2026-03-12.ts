import type { SpeakingActivityContent } from "@/types/activity";

export const professionalMessages_2026_03_12: SpeakingActivityContent = {
  type: "speaking",
  title: "3/12/26: Career Advisor Appointment + Professional Messages",
  description: "Practice scheduling with a career advisor and sending professional messages (work + interview follow-up)",

  keyPhrases: [
    { phrase: "Hello, this is ___ from ___.", example: "Hello, this is Marla from the evening class." },
    { phrase: "I'm writing to...", example: "I'm writing to request a schedule change." },
    { phrase: "Could we reschedule to...?", example: "Could we reschedule to Thursday at 3pm?" },
    { phrase: "I won't be able to...", example: "I won't be able to come in today because I'm sick." },
    { phrase: "Thank you for your time.", example: "Thank you for your time and support." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Appointment role-play: Call to schedule a career advisor appointment.",
      context: "Include: your name, reason, best days/times, and confirmation."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Email appointment request: Write 3–4 sentences to request a career advisor meeting, then read it aloud.",
      context: "Include: greeting, request, availability, and thanks."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Work message: You will be late or absent. Write a short professional message and read it aloud.",
      context: "Include: apology, reason (simple), and next step."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Thank-you message: After an interview or meeting, write a short thank-you email and read it aloud.",
      context: "Include: thank you + one detail from the meeting + interest/next step."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Fix a message: Your partner’s message is too informal. Make it more professional.",
      context: "Replace slang, add greeting/closing, make the request clear."
    },
  ],

  reflectionPrompt: "What makes a message professional (greeting, clear request, polite closing)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: true
};
