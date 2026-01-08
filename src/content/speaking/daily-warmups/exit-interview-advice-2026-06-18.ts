import type { SpeakingActivityContent } from "@/types/activity";

export const exitInterviewAdvice_2026_06_18: SpeakingActivityContent = {
  type: "speaking",
  title: "6/18/26: Exit Interview + Advice for New Students",
  description: "Reflect on progress, give feedback, and practice advice language for new students",

  keyPhrases: [
    { phrase: "I feel more confident about...", example: "I feel more confident about speaking at work." },
    { phrase: "The hardest thing was...", example: "The hardest thing was pronunciation." },
    { phrase: "The most helpful activity was...", example: "The most helpful activity was role-plays." },
    { phrase: "I recommend...", example: "I recommend practicing every day." },
    { phrase: "If you want to improve, you should...", example: "If you want to improve, you should speak as much as possible." },
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
        "I feel more confident about...",
        "The hardest thing was...",
        "The most helpful activity was...",
        "I recommend...",
        "If you want to improve, you should..."
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
        "confident", "progress", "pronunciation", "advice", "feedback",
        "practice", "role-plays", "tips", "support", "goals"
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
      text: "Exit interview: Answer 5 questions about your experience this year.",
      context: "What did you like? What was hard? What helped you?"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Advice for new students: Give 3 tips and explain why.",
      context: "Use: You should..., Don't be afraid to..., It's helpful to..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Program feedback: What do you want more of next year? What should change?",
      context: "Use: I'd like more..., I suggest..., It would be better if..."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Role-play: Teacher asks follow-up questions. Student answers with details.",
      context: "Use: for example, because, one reason is..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Celebrate: Share one success and give a compliment to a classmate.",
      context: "Use: I'm proud of..., I noticed that you..."
    },
  ],

  reflectionPrompt: "What is one thing you will keep doing to practice English after today?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
