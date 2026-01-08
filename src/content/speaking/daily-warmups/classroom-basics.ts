import type { SpeakingActivityContent } from "@/types/activity";

export const classroomBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/6/26: Classroom & School Language",
  description: "Practice asking for help and clarification. Focus: polite classroom phrases.",

  keyPhrases: [
    { phrase: "Could you please repeat that?", example: "I'm sorry, could you please repeat that?" },
    { phrase: "I don't understand.", example: "I don't understand. Can you explain it again?" },
    { phrase: "Can you say that more slowly?", example: "Excuse me, can you say that more slowly?" },
    { phrase: "How do you spell...?", example: "How do you spell your name?" },
    { phrase: "What does ___ mean?", example: "What does 'assignment' mean?" },
    { phrase: "May I ask a question?", example: "Excuse me, may I ask a question?" },
    { phrase: "I have a question about...", example: "I have a question about homework." },
  ],

  soloMode: {
    title: "Solo Mode (10 minutes)",
    subtitle: "Do this first while students arrive.",
    checklist: [
      { id: "s1", text: "Choose at least 2 prompt(s) below", required: true },
      { id: "s2", text: "Write 3 sentences using the classroom Key Phrases", required: true },
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
        "Could you please...?",
        "I don't understand...",
        "Can you say that more slowly?",
        "How do you spell...?",
        "What does ___ mean?",
        "May I ask...?",
        "I have a question about..."
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
        "understand", "repeat", "slowly", "spell", "mean", "question", "explain",
        "could", "may", "can", "excuse me", "sorry", "please", "thank you",
        "homework", "assignment", "test", "class", "teacher", "student", "word"
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
      text: "Practice asking your teacher for help. What will you say when you don't understand something?",
      context: "Use phrases like: 'I don't understand', 'Could you repeat that?', 'Can you explain this?'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "You missed class last week. What questions will you ask your teacher or classmates?",
      context: "Think about: What did we do? What's the homework? When is the test?"
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "You need to leave class early today for an event. What will you tell your teacher?",
      context: "Practice polite explanations: 'I need to leave early today because...' or 'I have an event at...'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "The teacher is speaking too fast and you're confused. What are THREE different ways to ask for clarification?",
      context: "Examples: 'Could you speak more slowly?', 'I'm sorry, I didn't catch that', 'What does that word mean?'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Parts of Speech - Content Words: Describe your classroom using all 4 content words (nouns, verbs, adjectives, adverbs).",
      context: "Example: 'Students (noun) sit (verb) at comfortable (adjective) desks. They listen (verb) carefully (adverb) to the teacher (noun).'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Parts of Speech Challenge: Make 3 sentences about school. Then identify the parts: circle nouns, underline verbs, highlight adjectives and adverbs.",
      context: "Example: 'My teacher explains grammar clearly.' (teacher=noun, explains=verb, grammar=noun, clearly=adverb)"
    },
    {
      id: "prompt-7",
      level: "advanced",
      text: "Parts of Speech Game: Describe your English learning journey using at least 2 of each content word (2 nouns, 2 verbs, 2 adjectives, 2 adverbs).",
      context: "Track them: I (pronoun) studied (verb) English (noun) slowly (adverb) at first (adverb). Now I speak (verb) more confidently (adverb) in difficult (adjective) conversations (noun)."
    },
  ],

  reflectionPrompt: "Which classroom phrase is hardest for you to say? Why do you think that is?",
  reflectionMinLength: 30,
  minPromptsRequired: 2,
  released: false
};
