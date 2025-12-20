import type { SpeakingActivityContent } from "@/types/activity";

export const myChartCallingOffice_2026_05_05: SpeakingActivityContent = {
  type: "speaking",
  title: "5/5/26: MyChart / Calling the Office",
  description: "Practice messaging or calling a clinic: explaining a problem, requesting help, and confirming details",

  keyPhrases: [
    { phrase: "I need to make an appointment for...", example: "I need to make an appointment for next week." },
    { phrase: "I have a question about my results.", example: "I have a question about my test results." },
    { phrase: "Could you help me with...?", example: "Could you help me with a refill?" },
    { phrase: "My date of birth is...", example: "My date of birth is 10/12/1989." },
    { phrase: "Let me confirm...", example: "Let me confirm: Tuesday at 2pm." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Phone call role-play: Make an appointment. Include your name, DOB, and reason.",
      context: "Partner plays receptionist and asks follow-up questions."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "MyChart message: Write 3–4 sentences about a problem and what you need. Read it aloud.",
      context: "Include: greeting, problem, request, thanks."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Refill request: Ask for a refill and explain when you will run out.",
      context: "Use: I will run out on..., I need a refill for..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Confirmation practice: Repeat an appointment time, location, and what to bring.",
      context: "Use clarification: Did you say...? What should I bring?"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Problem-solving: Your appointment was canceled. Call to reschedule and ask what to do next.",
      context: "Use: I was told that..., Could we reschedule...?, What are the next steps?"
    },
  ],

  reflectionPrompt: "What information do you need to share when you call a clinic (name, DOB, reason, dates)?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};

