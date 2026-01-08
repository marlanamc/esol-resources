import type { SpeakingActivityContent } from "@/types/activity";

export const finalPresentationRehearsal_2026_06_16: SpeakingActivityContent = {
  type: "speaking",
  title: "6/16/26: Final Presentation Rehearsal",
  description: "Rehearse a short end-of-year talk and practice asking and answering questions",

  keyPhrases: [
    { phrase: "My goal is...", example: "My goal is to get a better job." },
    { phrase: "I've learned...", example: "I've learned how to advocate for myself." },
    { phrase: "One example is...", example: "One example is calling the doctor to make an appointment." },
    { phrase: "My next step is...", example: "My next step is to study for a certification." },
    { phrase: "Do you have any questions?", example: "Do you have any questions?" },
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
        "My goal is...",
        "I've learned...",
        "One example is...",
        "My next step is...",
        "Do you have any questions?"
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
        "goal", "learned", "example", "next step", "presentation",
        "practice", "confidence", "feedback", "details", "questions"
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
      level: "intermediate",
      text: "Plan your talk (60–90 seconds): goal, what you learned, one success, next steps.",
      context: "Write 4 bullet points only."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Rehearse with a partner. Partner asks 2 questions.",
      context: "Practice clear answers and follow-up questions."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Improve: Add one detail (a number, date, time, or example).",
      context: "Example: 'I studied 2 times a week.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Small group rehearsal: Present to 3–4 classmates and answer questions.",
      context: "Focus on volume, pace, and eye contact."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Feedback round: Give one compliment and one suggestion to a partner.",
      context: "Use: I liked..., Next time you could..."
    },
  ],

  reflectionPrompt: "What part of your presentation do you want to improve before the final day?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
