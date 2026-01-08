import type { SpeakingActivityContent } from "@/types/activity";

export const jobApplicationTalkThrough_2026_03_10: SpeakingActivityContent = {
  type: "speaking",
  title: "3/10/26: Job Application Talk-Through (Present Perfect Continuous)",
  description: "Practice job search language. Focus: present perfect continuous for ongoing activities.",

  keyPhrases: [
    { phrase: "I have been looking for...", example: "I have been looking for a full-time job for three months." },
    { phrase: "I have been working as...", example: "I have been working as a cashier since January." },
    { phrase: "How long have you been...?", example: "How long have you been searching for a job?" },
    { phrase: "I have been applying to...", example: "I have been applying to restaurants and stores every week." },
    { phrase: "I have been trying to...", example: "I have been trying to get an interview at Target." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using present perfect continuous", required: true },
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
        "I have been [verb-ing] for [time]...",
        "How long have you been [verb-ing]...?",
        "I have been working as [position] since [time]...",
        "I have been applying to [places] every [frequency]...",
        "I have been trying to [verb]...",
        "I have been [present perfect] vs I had been [past perfect]..."
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
        "looking", "searching", "applying", "interview", "job", "career", "position",
        "work", "experience", "skills", "qualifications", "resume", "cover letter",
        "company", "organization", "industry", "field", "opportunity", "challenge",
        "progress", "duration", "timeline", "achievement", "success", "rejection"
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
      text: "How long have you been looking for a job? How long have you been working (if you have a job)?",
      context: "Present perfect continuous: 'I have been looking for a job for two months.' or 'I have been working at Market Basket since 2024.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What have you been doing to find a job? Where have you been applying?",
      context: "Use present perfect continuous: 'I have been checking Indeed every day. I have been applying to CVS, Walgreens, and Stop & Shop.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What skills have you been practicing or learning to get a better job?",
      context: "Present perfect continuous: 'I have been studying English at ESOL class. I have been practicing my computer skills on YouTube.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "If you have a job: How long have you been working there? What have you been doing in that position?",
      context: "Use 'have been + -ing': 'I have been working at Dunkin' for six months. I have been making coffee, cleaning, and helping customers.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What challenges have you been facing in your job search? What has been difficult?",
      context: "Present perfect continuous: 'I have been having trouble with interviews. I have been getting nervous when they ask questions.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare: What did you do in your last job (past simple) vs. What have you been doing lately to find work (present perfect continuous)?",
      context: "Past simple: 'I worked as a cleaner.' Present perfect continuous: 'I have been looking for office work. I have been taking computer classes.'"
    },
  ],

  reflectionPrompt: "How comfortable are you using present perfect continuous (have been + -ing) to talk about your job search? How is it different from present perfect (have worked)?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
