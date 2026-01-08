import type { SpeakingActivityContent } from "@/types/activity";

export const futureGoalsMoneyMilestones_2026_02_12: SpeakingActivityContent = {
  type: "speaking",
  title: "2/12/26: Future Goals & Money Milestones (Future Perfect)",
  description: "Practice using future perfect tense (will have + past participle) to talk about goals, achievements, and predictions by a specific deadline",

  keyPhrases: [
    { phrase: "By [time], I will have...", example: "By June, I will have saved $500." },
    { phrase: "By next year, I will have...", example: "By next year, I will have paid off my credit card." },
    { phrase: "By the time..., I will have...", example: "By the time I graduate, I will have finished all my classes." },
    { phrase: "In [time period], I will have...", example: "In six months, I will have moved to a new apartment." },
    { phrase: "Will you have... by...?", example: "Will you have saved enough money by December?" },
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
        "By [time], I will have...",
        "By next year, I will have...",
        "By the time..., I will have...",
        "In [time period], I will have...",
        "Will you have... by...?"
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
        "save", "pay", "bills", "housing", "goal", "timeframe",
        "deadline", "future", "learned", "credit", "tenant rights"
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
      text: "By the end of this year (December 2026), what will you have achieved with money or housing?",
      context: "Use future perfect: 'By December, I will have saved $1000. I will have paid off my phone bill.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "By next month, what bills will you have paid? What expenses will you have finished?",
      context: "Future perfect: 'By the end of March, I will have paid my rent, my electricity bill, and my internet bill.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Set a 6-month goal. By August 2026, what will you have accomplished with housing or work?",
      context: "Example: 'By August, I will have found a new apartment in Jamaica Plain. I will have saved money for the security deposit and first month's rent.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Think about debt or bills. By the end of the year, what will you have paid off? What won't you have finished yet?",
      context: "Use positive and negative: 'By December, I will have paid off my medical bills. But I won't have finished paying my student loans yet.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "By the time you move to your next apartment, what will you have learned about housing in Boston?",
      context: "Future perfect: 'By the time I move, I will have learned about tenant rights. I will have checked three different neighborhoods.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare past perfect and future perfect: What had you never done before coming to Boston? What will you have accomplished by next year?",
      context: "Past perfect (before): 'I had never rented an apartment before I came here.' Future perfect (by deadline): 'By next year, I will have lived in Boston for 5 years. I will have improved my credit score.'"
    },
  ],

  reflectionPrompt: "How comfortable are you using future perfect (will have + past participle) to talk about goals by a specific deadline? Is it easier or harder than past perfect?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
