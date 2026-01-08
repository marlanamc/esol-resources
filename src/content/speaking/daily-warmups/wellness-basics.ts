import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "5/12/26: Wellness & Self-Care (Used To Structures)",
  description: "Practice used to structures. Focus: used to (past habits), be used to (accustomed), get used to (adjusting).",
  keyPhrases: [
    { phrase: "I used to... (past habit)", example: "I used to eat junk food every day. I used to stay up late." },
    { phrase: "I'm (not) used to... (accustomed)", example: "I'm not used to exercising regularly. I'm used to drinking coffee in morning." },
    { phrase: "I'm getting used to... (becoming accustomed)", example: "I'm getting used to going to bed earlier. I'm getting used to eating healthier." },
    { phrase: "I can't get used to... (can't adjust)", example: "I can't get used to waking up at 5am. I can't get used to meditation yet." },
    { phrase: "It used to be... (past state)", example: "It used to be hard to quit sugar. It used to be difficult to find time for exercise." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using 'used to' for past habits", required: true },
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
        "used to", "be used to", "get used to", "accustomed", "adjust",
        "exercise", "diet", "sleep", "wake up", "stress", "routine",
        "healthy", "unhealthy", "habit", "change", "lifestyle",
        "morning", "evening", "daily", "weekly", "before", "now"
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
      text: "Talk about your past wellness habits using 'used to': What did you use to do? What did you use to eat?",
      context: "I used to eat fast food every day. I used to stay up until midnight. I used to drink soda instead of water. I didn't use to exercise."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Talk about wellness changes: What used to be hard that is easier now? What used to be easy that is harder now?",
      context: "Example: 'It used to be hard to wake up early, but now it's easier. It used to be easy to eat junk food, but now I choose healthier options.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'I'm (not) used to...': What wellness habits are you comfortable with? What is still difficult?",
      context: "I'm used to drinking water all day. I'm not used to meditating yet. I'm used to going to bed at 10pm. I'm not used to saying no to people."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'I'm getting used to...': What new wellness habits are you adjusting to?",
      context: "I'm getting used to eating breakfast every day. I'm getting used to exercising in the morning. It's hard, but I'm getting used to limiting screen time."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Compare 'used to' (past) and 'be used to' (accustomed): What did you use to do vs. What are you used to now?",
      context: "PAST: 'I used to skip meals.' ACCUSTOMED NOW: 'Now I'm used to eating three meals a day.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full wellness story using all 3 structures: 'used to' (past), 'be used to' (accustomed), and 'get used to' (adjusting).",
      context: "Example: 'I used to have terrible sleep habits. I would stay up late scrolling on my phone. Now I'm used to a bedtime routine. I'm getting used to putting my phone away at 9pm. I'm also getting used to waking up without an alarm.'"
    },
  ],

  reflectionPrompt: "Which wellness change is hardest to adjust to? Are you getting used to it, or can't you get used to it yet?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
