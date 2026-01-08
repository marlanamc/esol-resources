import type { SpeakingActivityContent } from "@/types/activity";

export const perfectTensesPracticeDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "2/5/26: Past Continuous vs Past Simple",
  description: "Practice past tenses. Focus: past continuous for background vs past simple for completed actions.",

  keyPhrases: [
    { phrase: "While I was...", example: "While I was cooking dinner, power went out." },
    { phrase: "When... happened, I was...", example: "When my landlord called, I was sleeping." },
    { phrase: "I was... when...", example: "I was taking a shower when someone knocked on the door." },
    { phrase: "While... was happening, ...", example: "While repair person was fixing heat, I was waiting in kitchen." },
    { phrase: "At 8pm yesterday, I was...", example: "At 8pm yesterday, I was riding the Red Line home from work." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing past continuous and past simple", required: true },
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
        "While I was...",
        "When... happened, I was...",
        "I was... when...",
        "While... was happening, ...",
        "At [time] yesterday, I was..."
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
        "while", "when", "was", "were", "-ing", "happened", "suddenly", "interrupted",
        "cooking", "sleeping", "working", "driving", "studying", "watching", "listening",
        "called", "knocked", "arrived", "started", "finished", "stopped", "broke"
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
      text: "What were you doing at 7am this morning? At 12pm? At 6pm yesterday?",
      context: "Use past continuous: I was sleeping at 7am. I was eating lunch at 12pm. I was taking the bus at 6pm."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Tell about an interruption: While you were doing something, what happened that stopped you?",
      context: "Example: While I was studying, my friend called. While I was making dinner, I ran out of salt."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Housing problem with background: Tell about a problem at home. What were you doing when you noticed the problem?",
      context: "When + past simple / past continuous: When the heat stopped, I was watching TV. While I was cooking, the stove broke."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "MBTA story: While you were riding the T or bus, what happened? OR: What were you doing when the train/bus arrived?",
      context: "While I was waiting at Park Street, the Green Line came. I was reading when we arrived at my stop."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Describe last night: What were you doing at different times? Did anything interrupt you?",
      context: "At 7pm, I was making dinner. While I was eating, my neighbor knocked. At 9pm, I was doing homework when I got tired."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Complex problem story: Tell about a housing or bill problem. Use at least 3 while/when sentences to give background details.",
      context: "Example: While I was looking at my Eversource bill, I saw a mistake. When I called them, I was very nervous. They were checking my account when the call dropped."
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Two things at once: What were you and your family/roommates doing at the same time last weekend?",
      context: "While I was cleaning, my roommate was cooking. When I finished, she was still washing dishes. We were both working when our friend arrived."
    },
  ],

  reflectionPrompt: "What's harder: using while or when correctly, or remembering to use was/were + -ing for the background action?",
  reflectionMinLength: 35,
  minPromptsRequired: 3,
  released: false
};
