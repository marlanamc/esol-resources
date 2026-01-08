import type { SpeakingActivityContent } from "@/types/activity";

export const careerBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/24/26: Resume & Cover Letter Basics",
  description: "Practice resume and cover letter language. Focus: describing skills and experience clearly.",

  keyPhrases: [
    { phrase: "I'm looking for a job in...", example: "I'm looking for a job in healthcare." },
    { phrase: "I have experience in...", example: "I have experience in customer service." },
    { phrase: "My goal is to...", example: "My goal is to become a manager." },
    { phrase: "I've been working as...", example: "I've been working as a cashier for two years." },
    { phrase: "What are your strengths?", example: "What are your strengths and weaknesses?" },
    { phrase: "I'm interested in learning...", example: "I'm interested in learning new skills." },
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
        "I'm looking for a job in [field]...",
        "I have experience in [area]...",
        "My goal is to [goal]...",
        "I've been working as [job] for [time]...",
        "I'm interested in learning [skill]...",
        "I'm good at [skill] because..."
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
        "experience", "skills", "strength", "goal", "job", "work", "career",
        "resume", "cover letter", "interview", "manager", "team", "company",
        "reliable", "responsible", "hard-working", "customer service", "teamwork"
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
      text: "Resume section practice: What is your most recent job? What were your main responsibilities?",
      context: "Use 3 bullet-style sentences: 'I worked as...' 'I was responsible for...' 'I helped...'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Skills talk: Name 3 skills you have for a job and give one example for each.",
      context: "Examples: teamwork, reliability, customer service, patience, problem-solving."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Cover letter language: Why do you want this job? Why are you a good fit?",
      context: "Use: I'm interested in..., I have experience in..., I enjoy..., I’m reliable because..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Resume gaps/challenges: What challenges have you faced in finding work? What is one solution you tried?",
      context: "Examples: language, schedule, childcare, transportation, credentials."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Tell a success story: Describe a time you solved a problem at work. What happened and what was the result?",
      context: "Use: At first..., then..., so..., as a result..."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Short elevator pitch (30 seconds): Introduce yourself for a job, including experience + a strength + your goal.",
      context: "End with a question: 'Could you tell me more about the schedule/training/next steps?'"
    },
  ],

  reflectionPrompt: "What career topic was easiest to talk about? What was most difficult? Why?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
