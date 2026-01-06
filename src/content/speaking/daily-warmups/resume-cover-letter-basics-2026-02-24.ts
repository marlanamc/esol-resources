import type { SpeakingActivityContent } from "@/types/activity";

export const resumeCoverLetterBasics_2026_02_24: SpeakingActivityContent = {
  type: "speaking",
  title: "2/24/26: Resume & Cover Letter Basics (Modals)",
  description: "Practice using modals (must, should, can, may, could) for professional communication about resumes, cover letters, and job requirements",

  keyPhrases: [
    { phrase: "I must include...", example: "I must include my contact information at the top of my resume." },
    { phrase: "You should list...", example: "You should list your most recent job first." },
    { phrase: "Can I ask...?", example: "Can I ask you to review my resume before I send it?" },
    { phrase: "Could you please...?", example: "Could you please give me feedback on my cover letter?" },
    { phrase: "May I use... as a reference?", example: "May I use you as a reference for this job?" },
    { phrase: "I have to...", example: "I have to submit my application by Friday." },
  ],

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Resume requirements: What information must you include on a resume? What should you include but is optional?",
      context: "Use modals: I must include... I should also add... I can include... You have to put..."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Asking for help: You need help with your resume. Use 3 different polite questions to ask someone for help.",
      context: "Practice: Can you...? Could you...? Would you...? May I ask you to...?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Cover letter advice: Give your partner 4 pieces of advice about writing a cover letter using different modals.",
      context: "Use: You should... You must... You have to... You could... You may want to..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Reference request role-play: Call your former boss and politely ask if you may use them as a reference.",
      context: "Include: polite greeting, explain the job, use 'may' or 'could', thank them. Boston tip: Mention MA WorkSource or MassHire if it's a workforce program."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Application requirements: Talk about a job application you completed. What did you have to submit? What could you skip?",
      context: "I had to submit... I must have... I could choose whether to... I should have included..."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Resume review: Your partner shows you their resume. Give feedback using at least 4 different modals with different levels of strength.",
      context: "Vary strength: You must change... (strong) / You should consider... (medium) / You could try... (soft suggestion) / You may want to... (very soft)"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Professional email: You submitted your resume to a Boston company (hospital, restaurant, store). Practice calling to follow up. Use 3+ polite modals.",
      context: "Example: Could you tell me if... May I ask about... I would like to... Should I send...?"
    },
  ],

  reflectionPrompt: "Which modal (must/should/can/may/could) is hardest to use correctly when asking for professional help? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 3,
  released: false
};
