import type { SpeakingActivityContent } from "@/types/activity";

export const longTermCareerGoals_2026_03_19: SpeakingActivityContent = {
  type: "speaking",
  title: "3/19/26: Long-Term Career Goals (Future Perfect Continuous)",
  description: "Practice future perfect continuous. Focus: duration and ongoing nature of future goals.",

  keyPhrases: [
    { phrase: "By next year, I will have been...", example: "By next year, I will have been living in the U.S. for five years." },
    { phrase: "By [time], I will have been...", example: "By December, I will have been studying English for three years." },
    { phrase: "In [time], I will have been...", example: "In two years, I will have been working at my company for a decade." },
    { phrase: "Will you have been...?", example: "Will you have been working there long enough to get a raise?" },
    { phrase: "I will have been...", example: "I will have been saving money for two years by then." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using future perfect continuous", required: true },
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
        "By [time], I will have been [verb-ing] for [duration]...",
        "In [time], I will have been [verb-ing]...",
        "Will you have been [verb-ing]...?",
        "I will have been [verb-ing] since [time]...",
        "By [time], I will have [past participle]...",
        "I will have been working toward [goal]..."
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
        "career", "goals", "future", "milestone", "achievement", "accomplishment",
        "long-term", "duration", "timeline", "progress", "development",
        "education", "learning", "skills", "experience", "growth", "advancement",
        "by next year", "in five years", "by december", "since", "until"
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
      text: "By the end of this year (December 2026), how long will you have been living in Boston? How long will you have been learning English?",
      context: "Future perfect continuous: 'By December, I will have been living in Boston for four years. I will have been learning English for three years.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "If you stay at your current job (or in your current field), how long will you have been working there by next year?",
      context: "Use 'will have been + -ing': 'By next June, I will have been working at Dunkin' for two years.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "By the time you get a promotion or a better job, how long will you have been working in that field?",
      context: "Future perfect continuous: 'By the time I become a manager, I will have been working in retail for five years.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "By the time you finish ESOL classes (or reach your English goal), how long will you have been studying English?",
      context: "Example: 'By the time I finish Level 5, I will have been taking ESOL classes for two years. I will have been practicing speaking for hundreds of hours.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Think about a long-term work goal. By the time you achieve it, how long will you have been working toward it?",
      context: "Future perfect continuous: 'I want to become a nurse. By the time I graduate from nursing school, I will have been preparing for four years.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare all three perfect continuous tenses: Past (had been + -ing), Present (have been + -ing), Future (will have been + -ing). Give one example of each about your career.",
      context: "Past: 'I had been working in a factory before I came here.' Present: 'I have been studying computers for six months.' Future: 'By 2028, I will have been working in IT for five years.'"
    },
  ],

  reflectionPrompt: "How do you feel about using future perfect continuous (will have been + -ing)? Which perfect continuous tense is hardest: past, present, or future? Why?",
  reflectionMinLength: 40,
  minPromptsRequired: 2,
  released: false
};
