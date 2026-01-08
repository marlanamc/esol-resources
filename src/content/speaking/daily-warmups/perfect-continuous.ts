import type { SpeakingActivityContent } from "@/types/activity";

export const perfectContinuousDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Perfect Continuous Tenses Review (use after 3/19)",
  description: "Practice perfect continuous tenses. Focus: duration and ongoing nature of actions.",

  keyPhrases: [
    { phrase: "I have been...", example: "I have been studying English for three years." },
    { phrase: "How long have you been...?", example: "How long have you been living here?" },
    { phrase: "I had been...", example: "I had been working there for five years before I quit." },
    { phrase: "By next year, I will have been...", example: "By next June, I will have been teaching for ten years." },
    { phrase: "I've been trying to...", example: "I've been trying to find a new job for months." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 4 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using perfect continuous tenses", required: true },
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
        "I had been [verb-ing] before [event]...",
        "By [time], I will have been [verb-ing]...",
        "I've been trying to [verb]...",
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
        "studying", "working", "living", "practicing", "learning", "trying", "improving",
        "for years", "for months", "since", "lately", "recently", "continuously",
        "duration", "period", "timeline", "progress", "development", "achievement"
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
      level: "advanced",
      text: "PRESENT PERFECT CONTINUOUS: What have you been doing to improve your English? How long have you been studying?",
      context: "Emphasize duration and ongoing action: 'I have been taking classes for six months' or 'I have been practicing every day.'"
    },
    {
      id: "prompt-2",
      level: "advanced",
      text: "PRESENT PERFECT CONTINUOUS: What have you been working on lately? What have you been thinking about?",
      context: "Use for recent continuous activities: 'I have been looking for a new apartment' or 'I have been feeling stressed.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "PAST PERFECT CONTINUOUS: Tell me about a time you were exhausted. What had you been doing? How long had you been doing it?",
      context: "Show an action that continued before a past event: 'When I got sick, I had been working 60 hours a week for three months.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "PAST PERFECT CONTINUOUS: Describe a moment of realization. What had you been doing wrong? What had you been missing?",
      context: "Example: 'I realized I had been pronouncing that word incorrectly for years' or 'I had been misunderstanding the instructions.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "FUTURE PERFECT CONTINUOUS: By the end of this year, how long will you have been living in the U.S.? Learning English?",
      context: "Calculate duration into the future: 'By December, I will have been living here for two years and six months.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "FUTURE PERFECT CONTINUOUS: Imagine five years from now. What will you have been doing? What activities will you have been pursuing?",
      context: "Example: 'By 2030, I will have been working in healthcare for fifteen years, and I will have been raising my children.'"
    },
  ],

  reflectionPrompt: "Which perfect continuous tense is most challenging? Why? Give an example of when you would use it.",
  reflectionMinLength: 50,
  minPromptsRequired: 4,
  released: false
};
