import type { SpeakingActivityContent } from "@/types/activity";

export const gerundsInfinitivesDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Gerunds & Infinitives Review (use after 3/5)",
  description: "Practice gerunds vs infinitives. Focus: when to use gerunds vs infinitives.",

  keyPhrases: [
    { phrase: "I enjoy...", example: "I enjoy reading books and listening to music." },
    { phrase: "I want to...", example: "I want to improve my English speaking skills." },
    { phrase: "I'm thinking about...", example: "I'm thinking about changing jobs." },
    { phrase: "I hope to...", example: "I hope to visit my family next year." },
    { phrase: "I've decided to...", example: "I've decided to take more English classes." },
    { phrase: "I can't help...", example: "I can't help worrying about my test." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 3 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing gerunds and infinitives", required: true },
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
        "I love [verb-ing]...",
        "I want to [verb]...",
        "I'm planning to [verb]...",
        "I hope to [verb]...",
        "I've decided to [verb]...",
        "I can't help [verb-ing]...",
        "I'm thinking about [verb-ing]..."
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
        "enjoy", "love", "like", "want", "plan", "hope", "decide", "try", "stop", "start",
        "remember", "forget", "consider", "refuse", "give up", "practice", "learn", "improve",
        "reading", "cooking", "exercising", "studying", "working", "traveling", "meeting"
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
      text: "What do you enjoy doing in your free time? What activities do you love doing?",
      context: "Use gerunds after 'enjoy', 'love', 'like': 'I enjoy cooking' or 'I love spending time with family.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "What do you want to achieve this year? What are you planning to do?",
      context: "Use infinitives after 'want', 'plan', 'hope', 'need': 'I want to get a better job' or 'I'm planning to move.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What have you stopped doing recently? What have you started doing? What should you quit doing?",
      context: "Practice: 'I stopped smoking' (quit the habit) vs 'I stopped to smoke' (paused to smoke). 'I started exercising.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Complete these sentences: 'I can't stand...', 'I'm considering...', 'I've given up trying to...', 'I refuse to...'",
      context: "Gerunds: can't stand, consider, give up. Infinitives: refuse, decide, fail. Mix them in your answers!"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "What's something you remember doing as a child? What's something you'll never forget to do?",
      context: "Tricky! 'Remember doing' = recall the past. 'Remember to do' = don't forget future action. Same with 'forget'!"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Using perfect tenses: What have you been trying to do? What had you wanted to achieve before coming here?",
      context: "Combine perfect tenses with gerunds/infinitives: 'I have been trying to learn English' or 'I had wanted to study abroad.'"
    },
  ],

  reflectionPrompt: "Which is harder for you - gerunds or infinitives? Give an example of each.",
  reflectionMinLength: 40,
  minPromptsRequired: 3,
  released: false
};
