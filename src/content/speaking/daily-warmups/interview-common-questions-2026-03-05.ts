import type { SpeakingActivityContent } from "@/types/activity";

export const interviewCommonQuestions_2026_03_05: SpeakingActivityContent = {
  type: "speaking",
  title: "3/5/26: Interview Questions (Gerunds & Infinitives)",
  description: "Practice interview language. Focus: gerunds vs infinitives in interview questions.",

  keyPhrases: [
    { phrase: "I enjoy...", example: "I enjoy helping customers and solving problems." },
    { phrase: "I'm good at...", example: "I'm good at working with a team." },
    { phrase: "I want to / hope to...", example: "I want to learn new skills. I hope to grow with the company." },
    { phrase: "I need to / plan to...", example: "I need to improve my computer skills." },
    { phrase: "I'd like to...", example: "I'd like to ask about the schedule." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing gerunds and infinitives about your skills and goals", required: true },
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
        "I enjoy [verb-ing]...",
        "I'm good at [verb-ing]...",
        "I want to [verb]...",
        "I hope to [verb]...",
        "I need to [verb]...",
        "I plan to [verb]...",
        "I'd like to [verb]..."
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
        "enjoy", "good at", "skilled", "experience", "background", "qualifications",
        "want", "hope", "plan", "goal", "objective", "target", "achieve",
        "need", "improve", "learn", "develop", "grow", "advance", "promote",
        "career", "job", "work", "position", "role", "team", "company", "organization"
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
      text: "Answer: What do you enjoy doing at work? What are you good at?",
      context: "Use GERUNDS: I enjoy helping people. I'm good at working with numbers. I enjoy learning new things."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Answer: Why do you want this job? What do you hope to achieve?",
      context: "Use INFINITIVES: I want to learn new skills. I hope to grow in my career. I'd like to work with a good team."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Answer: What are your career goals? What do you plan to do in the next 5 years?",
      context: "Mix INFINITIVES: I plan to finish my degree. I want to become a manager. I hope to start my own business."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Answer: What tasks do you dislike doing? What do you avoid doing if possible?",
      context: "Use GERUNDS: I dislike working late nights. I avoid missing deadlines. I don't enjoy doing repetitive tasks."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Contrast gerunds and infinitives: What do you enjoy doing (gerund) vs. What do you want to do (infinitive) in your next job?",
      context: "I enjoy talking to customers (gerund = like doing). I want to earn more money (infinitive = goal/purpose)."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complex interview answer: I started... (gerund), but I decided to... (infinitive), so I stopped... (gerund) and began to... (infinitive).",
      context: "Example: I started working in retail, but I decided to change careers, so I stopped applying to stores and began to look for office jobs."
    },
  ],

  reflectionPrompt: "When answering interview questions, which is easier to use: gerunds (enjoy -ing) or infinitives (want to)? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
