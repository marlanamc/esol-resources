import type { SpeakingActivityContent } from "@/types/activity";

export const professionalMessages_2026_03_12: SpeakingActivityContent = {
  type: "speaking",
  title: "3/12/26: Career Path Stories (Past Perfect Continuous)",
  description: "Practice career storytelling. Focus: past perfect continuous for career journey narration.",

  keyPhrases: [
    { phrase: "I had been working as...", example: "I had been working as a cleaner for three years when I got a new job." },
    { phrase: "I had been looking for...", example: "I had been looking for a better job for six months before I found this one." },
    { phrase: "I had been trying to...", example: "I had been trying to learn English before I came to the U.S." },
    { phrase: "Before I..., I had been...", example: "Before I moved to Boston, I had been studying computer programming." },
    { phrase: "How long had you been...?", example: "How long had you been working there before you quit?" },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences mixing past perfect continuous and past simple", required: true },
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
        "I had been working as [job] for [time]...",
        "I had been looking for [opportunity] for [time]...",
        "I had been trying to [verb] before [event]...",
        "Before I [past action], I had been [past continuous]...",
        "How long had you been [verb-ing]...?",
        "I had been [past continuous] when [event]...",
        "I had been [past continuous] at [time]...",
        "[Event] happened while I had been [verb-ing]..."
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
        "career", "job", "work", "position", "change", "transition", "move",
        "company", "organization", "industry", "field", "opportunity",
        "experience", "skills", "background", "education", "training",
        "promotion", "raise", "resign", "quit", "search", "apply"
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
      text: "Tell your job history: How long had you been working at your last job before you left or changed jobs?",
      context: "Past perfect continuous: 'I had been working at a restaurant for two years before I found my current job.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Before you got your current job (or before you came to the U.S.), what had you been doing for work?",
      context: "Use 'had been + -ing': 'I had been working as a teacher in my country. I had been teaching elementary school for five years.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Tell a job search story: How long had you been looking for work before you got an interview? What had you been doing to prepare?",
      context: "Past perfect continuous: 'I had been applying to jobs for three months before I got my first interview. I had been practicing my English every day.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Explain a career change: What had you been doing before you decided to change careers or look for a different type of job?",
      context: "Example: 'I had been working in construction, but I had been feeling tired every day. So I decided to look for office work.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Before you started ESOL classes, how long had you been trying to improve your English? What had you been doing to learn?",
      context: "Past perfect continuous: 'I had been watching YouTube videos for a year. I had been asking my coworkers to teach me new words.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare present perfect continuous (ongoing now) and past perfect continuous (was ongoing before): What have you been doing vs. what had you been doing before a specific change?",
      context: "Present perfect continuous: 'I have been working at Target since January.' Past perfect continuous: 'Before that, I had been working at Walmart for three years.'"
    },
  ],

  reflectionPrompt: "How comfortable are you using past perfect continuous (had been + -ing) to tell your career story? How is it different from past perfect (had worked)?",
  reflectionMinLength: 35,
  minPromptsRequired: 2,
  released: false
};
