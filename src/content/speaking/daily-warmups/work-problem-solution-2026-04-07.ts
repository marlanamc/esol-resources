import type { SpeakingActivityContent } from "@/types/activity";

export const workProblemSolution_2026_04_07: SpeakingActivityContent = {
  type: "speaking",
  title: "4/7/26: Work Problems & Changes (Used To Structures)",
  description: "Practice talking about work problems and changes using 'used to' (past habits), 'be used to' (be accustomed to), and 'get used to' (become accustomed to)",

  keyPhrases: [
    { phrase: "I used to... (past habit)", example: "I used to work nights, but now I work days. We used to have longer breaks." },
    { phrase: "I'm (not) used to... (accustomed)", example: "I'm not used to working weekends. I'm used to doing it a different way." },
    { phrase: "I'm getting used to... (becoming accustomed)", example: "I'm getting used to the new schedule. It's hard, but I'm getting used to it." },
    { phrase: "I can't get used to... (can't adjust)", example: "I can't get used to waking up at 5am. I can't get used to the noise." },
    { phrase: "It used to be... (past state)", example: "It used to be easier. The policy used to be different." },
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
        "I used to... (past habit)",
        "I'm (not) used to... (accustomed)",
        "I'm getting used to... (becoming accustomed)",
        "I can't get used to... (can't adjust)",
        "It used to be... (past state)"
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
        "work", "shift", "schedule", "change", "adjust", "habit",
        "computer", "kitchen", "noise", "mask", "manager"
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
      text: "Talk about your past job using 'used to': What did you use to do? What was different?",
      context: "I used to work at a restaurant. I used to start at 6am. I used to work weekends. We used to have 30-minute breaks."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Talk about changes at your current job: What used to be different? What changed?",
      context: "Example: 'The schedule used to be posted on Monday. Now it's posted on Friday. It used to be easier to request days off.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'I'm (not) used to...': What is hard to adjust to at work? What are you comfortable with?",
      context: "I'm not used to working 10-hour shifts. I'm used to taking the bus, but now I drive. I'm not used to the new computer system."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'I'm getting used to...': What are you learning to adjust to at work?",
      context: "I'm getting used to my new schedule. I'm getting used to the noise in the kitchen. It's hard, but I'm getting used to waking up early."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Compare 'used to' (past) and 'be used to' (accustomed): What did you use to do vs. What are you used to now?",
      context: "PAST: 'I used to work part-time.' ACCUSTOMED NOW: 'Now I'm used to working full-time.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full work story using all 3 structures: 'used to' (past), 'be used to' (accustomed), and 'get used to' (adjusting).",
      context: "Example: 'I used to work in retail, but I changed to an office job. At first, I wasn't used to sitting all day. But I'm getting used to it now. I'm also getting used to the new computer programs.'"
    },
  ],

  reflectionPrompt: "Which is easier: talking about the past with 'used to' or talking about adjusting with 'getting used to'? Why?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
