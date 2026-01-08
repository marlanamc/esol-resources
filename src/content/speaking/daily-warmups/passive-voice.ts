import type { SpeakingActivityContent } from "@/types/activity";

export const passiveVoiceDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Passive Voice Practice (use after 4/28)",
  description: "Practice passive voice. Focus: when to use passive vs active voice.",

  keyPhrases: [
    { phrase: "It was built in...", example: "The bridge was built in 1950." },
    { phrase: "I was born in...", example: "I was born in Mexico in 1985." },
    { phrase: "It's made of...", example: "This table is made of wood." },
    { phrase: "The meeting has been canceled.", example: "Unfortunately, the meeting has been canceled." },
    { phrase: "I was told that...", example: "I was told that the office is closed today." },
    { phrase: "The car is being repaired.", example: "My car is being repaired right now." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 3 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using passive voice", required: true },
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
        "It was [past participle] in [year/place]...",
        "I was [past participle] in [year/place]...",
        "It's made of [material]...",
        "[Subject] has been [past participle]...",
        "I was told that [clause]...",
        "[Subject] is being [past participle]...",
        "By [time], [subject] will have been [past participle]..."
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
        "built", "created", "made", "designed", "constructed", "founded", "established",
        "repaired", "updated", "changed", "improved", "renovated", "expanded",
        "canceled", "postponed", "scheduled", "confirmed", "approved", "rejected",
        "process", "handle", "manage", "organize", "coordinate", "implement"
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
      text: "Where were you born? Where was your hometown founded? Describe some things that were built there.",
      context: "Practice simple past passive: 'I was born in...' 'The city was founded in...' 'This building was constructed in...'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Describe something that was made or created in your country. What is it made of? How is it made?",
      context: "Use passive to describe processes: 'Coffee is grown in the mountains. The beans are roasted and then ground.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "Tell me about a time something went wrong (a mistake was made, something was forgotten, you were misunderstood).",
      context: "Example: 'My appointment was scheduled for the wrong day' or 'I was given incorrect information.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Describe the hiring process at a job. Use passive voice: 'Applications are reviewed...' 'Candidates are interviewed...'",
      context: "Practice: 'Applications are submitted online. Resumes are screened. Selected candidates are called for interviews.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "What changes have been made in your neighborhood recently? What is being built or renovated?",
      context: "Present perfect passive: 'A new park has been created' or Present continuous passive: 'The road is being repaired.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "By next year, what will have been accomplished in your community or workplace?",
      context: "Future perfect passive: 'By next summer, the new school will have been built' or 'The project will have been completed.'"
    },
  ],

  reflectionPrompt: "When is passive voice useful? Give an example from your own life where you would use passive voice.",
  reflectionMinLength: 40,
  minPromptsRequired: 3,
  released: false
};
