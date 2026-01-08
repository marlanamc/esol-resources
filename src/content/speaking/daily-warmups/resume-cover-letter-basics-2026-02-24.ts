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

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 3 prompt(s) below", required: true },
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
        "I must include...",
        "You should list...",
        "Can I ask...?",
        "Could you please...?",
        "May I use... as a reference?",
        "I have to..."
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
        "must", "should", "can", "may", "could", "resume", "cover letter",
        "reference", "application", "profession", "polite", "email"
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
