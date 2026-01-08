import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceRightsScenarios_2026_03_17: SpeakingActivityContent = {
  type: "speaking",
  title: "3/17/26: Workplace Rights Scenarios (Present Perfect Continuous)",
  description: "Practice discussing workplace rights using present perfect continuous to explain ongoing problems and how long they've been happening",

  keyPhrases: [
    { phrase: "I have been experiencing...", example: "I have been experiencing problems with my schedule." },
    { phrase: "This has been happening...", example: "This has been happening for three weeks." },
    { phrase: "How long have you been...?", example: "How long have you been working without breaks?" },
    { phrase: "I have been trying to...", example: "I have been trying to talk to my manager about this." },
    { phrase: "We have been waiting for...", example: "We have been waiting for a response since last month." },
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
        "I have been experiencing...",
        "This has been happening...",
        "How long have you been...?",
        "I have been trying to...",
        "We have been waiting for..."
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
        "have been", "present perfect continuous", "problem", "schedule", "breaks",
        "manager", "document", "talk", "policy", "response"
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
      text: "Describe a workplace problem using present perfect continuous. How long has this been happening?",
      context: "Use: I have been experiencing... This has been happening for... I have been working without breaks for two months."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Workplace rights scenario: You haven't been getting breaks. Explain the problem using present perfect continuous and ask for a solution.",
      context: "I have been working 8-hour shifts without breaks for three weeks. This has been very difficult. I have been feeling exhausted."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Ask your manager: How long has this policy been in place? How long have other workers been dealing with this?",
      context: "Use questions: How long have you been aware of this? How long has the company been doing this?"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Explain your efforts: What have you been doing to try to fix this problem? Who have you been talking to?",
      context: "I have been documenting every incident. I have been talking to my coworkers. I have been trying to speak with my supervisor."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Compare past simple and present perfect continuous: What happened vs. What has been happening?",
      context: "Past simple: My boss yelled at me yesterday. Present perfect continuous: My boss has been yelling at me for months."
    },
  ],

  reflectionPrompt: "When discussing workplace problems, how does present perfect continuous help you explain ongoing issues? How is it different from past simple?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
