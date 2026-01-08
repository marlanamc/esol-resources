import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceSmallTalkSafeTopics_2026_03_31: SpeakingActivityContent = {
  type: "speaking",
  title: "3/31/26: Workplace Small Talk (Phrasal Verbs)",
  description: "Practice workplace small talk using common phrasal verbs (show up, catch up, get along with, run into, look forward to, wrap up)",

  keyPhrases: [
    { phrase: "catch up", example: "It's nice to catch up with you! We should catch up more often." },
    { phrase: "show up", example: "What time did you show up today? I showed up early." },
    { phrase: "get along with", example: "Do you get along with everyone on your team?" },
    { phrase: "run into", example: "I ran into Maria at the coffee shop yesterday." },
    { phrase: "look forward to", example: "I'm looking forward to the long weekend!" },
    { phrase: "get back to (work)", example: "I should get back to work. Talk later!" },
    { phrase: "hang out", example: "Do you ever hang out with coworkers after work?" },
    { phrase: "work out (exercise)", example: "I try to work out after work. Do you work out?" },
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
        "catch up",
        "show up",
        "get along with",
        "run into",
        "look forward to",
        "get back to (work)",
        "hang out",
        "work out (exercise)"
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
        "small talk", "phrasal verbs", "co-worker", "plan", "meeting", "weekend",
        "coffee", "exercise", "schedule", "relationship", "follow up", "share"
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
      text: "Use 'catch up' and 'show up' in small talk: Talk about arriving at work and catching up with a coworker.",
      context: "Example: 'Hi! What time did you show up today? I showed up at 8. It's nice to catch up with you—we're both always so busy!'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Use 'get along with' and 'hang out': Ask about workplace relationships and socializing.",
      context: "Example: 'Do you get along with everyone on your team? Do you ever hang out with coworkers after work?'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'run into' and 'look forward to': Talk about unexpected meetings and upcoming plans.",
      context: "Example: 'I ran into Sarah at Market Basket yesterday! Are you looking forward to the weekend? I'm looking forward to sleeping in!'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use 'work out' (exercise) and 'get back to' (return to work): Talk about exercise habits and end the conversation.",
      context: "Example: 'Do you work out after work? I try to work out three times a week. Anyway, I should get back to work. Talk later!'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Full small talk conversation: Use at least 4 different phrasal verbs (show up, catch up, get along with, run into, look forward to, hang out, work out, get back to).",
      context: "Example: 'Hey! What time did you show up? I got here early. Do you get along with the new manager? I ran into him at Dunkin' yesterday. Anyway, I should get back to work. Let's catch up more later!'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Phrasal verbs in context: Use 'figure out' (solve/understand), 'come up' (be mentioned), 'fill in for' (replace someone).",
      context: "Example: 'Did you figure out the new schedule? My name didn't come up on the list. Can you fill in for me on Thursday?'"
    },
  ],

  reflectionPrompt: "Which phrasal verb is most useful for workplace small talk? Which one is hardest to remember?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
