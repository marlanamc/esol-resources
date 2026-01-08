import type { SpeakingActivityContent } from "@/types/activity";

export const reportedSpeechDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Reported Speech Practice (use after 5/5)",
  description: "Practice using reported speech (he said, she told me, they asked) to relay information and conversations - use after reported speech is taught on 5/5",

  keyPhrases: [
    { phrase: "He/She said (that)...", example: "The doctor said that I need to rest." },
    { phrase: "He/She told me (that)...", example: "My landlord told me that the rent will increase." },
    { phrase: "He/She asked if...", example: "The nurse asked if I had any allergies." },
    { phrase: "He/She asked me to...", example: "My boss asked me to work overtime." },
    { phrase: "He/She wanted to know...", example: "The pharmacist wanted to know my date of birth." },
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
        "He/She said (that)...",
        "He/She told me (that)...",
        "He/She asked if...",
        "He/She asked me to...",
        "He/She wanted to know..."
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
        "doctor", "nurse", "boss", "landlord", "interview", "MyChart",
        "said", "told", "asked", "wanted", "message", "advice"
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
      text: "Doctor visit: Tell me what the doctor said during your last appointment. What did they tell you to do?",
      context: "Use reported speech: The doctor said that I have high blood pressure. She told me to eat less salt. She asked if I exercise regularly."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Workplace message: Your boss called you. Relay the message to your coworker. What did your boss say?",
      context: "Example: My boss called. He said that we have a meeting tomorrow. He told me to bring my notes. He asked if I finished the report."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "MyChart message: You received a message from your doctor's office through MyChart. What did they say? What did they ask you to do?",
      context: "They said that my test results are ready. They told me to schedule a follow-up. They asked me to call if I have questions."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Phone call relay: You called your landlord about a repair. Tell your roommate what the landlord said.",
      context: "Reported speech: I called the landlord. He said that he will send someone tomorrow. He told me to be home between 9-12. He asked if the problem is urgent."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Job interview: Tell me about your last job interview. What did the interviewer ask? What did you say? What did they tell you?",
      context: "They asked me about my experience. I told them that I had worked in retail for three years. They said that they would call me within a week."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Tense changes: Your friend gave you advice yesterday. Report what they said, changing the tenses correctly.",
      context: "Direct: 'You should see a doctor. It might be serious.' Reported: She said that I should see a doctor. She said it might be serious."
    },
  ],

  reflectionPrompt: "When using reported speech, what's most challenging: changing 'I' to 'he/she', changing the tense, or remembering when to use 'said' vs 'told'?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
