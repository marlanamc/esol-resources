// =========================================================
// Self-Directed ESOL — Content model (mirrors the real app)
// =========================================================
const LEARNER = {
  name: "Amara",
  initial: "A",
  streak: 9,
  longestStreak: 14,
  points: 2480,
  wordsLearned: 142,
  level: 3,
  levelTitle: "Rising Speaker",
  xp: 760,
  xpForLevel: 1000,
  week: [true, true, true, true, true, true, false], // Mon..Sun; today (Sun) in progress
  todayLabel: ["M", "T", "W", "T", "F", "S", "S"],
  dailyGoal: 4,
  dailyDone: 2,
  dailyReward: 50,
  weeklyGoal: 4,
  weeklyDone: 3,
  rank: 2,
};

const CATEGORIES = [
  { id: "grammar",  label: "Grammar",       tone: "grammar", icon: "blocks",   blurb: "Tenses, conditionals & more", count: 24 },
  { id: "vocab",    label: "Vocabulary",    tone: "vocab",   icon: "cards",    blurb: "Words for daily life",        count: 18 },
  { id: "games",    label: "Games",         tone: "games",   icon: "gamepad",  blurb: "Learn while you play",        count: 12 },
  { id: "pron",     label: "Pronunciation", tone: "pron",    icon: "mic",      blurb: "Sounds & minimal pairs",      count: 9  },
  { id: "quiz",     label: "Quizzes",       tone: "quiz",    icon: "target",   blurb: "Check what you know",         count: 15 },
  { id: "speak",    label: "Speaking",      tone: "speak",   icon: "chat",     blurb: "Real-world conversations",    count: 11 },
];

// Self-directed track — stages with browsable activities (hybrid model)
const STAGES = [
  {
    n: 1, title: "Getting Started", caption: "The basics, one step at a time",
    items: [
      { id: "present-simple", title: "Present Simple", cat: "grammar", type: "guide", mins: 8, done: true },
      { id: "vocab-1", title: "Unit 1 · Getting to Know You", cat: "vocab", type: "vocab", mins: 6, done: true },
      { id: "minimal-pairs", title: "Minimal Pairs Lab", cat: "pron", type: "game", mins: 5, done: true },
      { id: "verb-forms", title: "Verb Forms Practice", cat: "games", type: "game", mins: 7, done: true },
    ],
  },
  {
    n: 2, title: "Building Up", caption: "Talk about everyday life",
    items: [
      { id: "present-continuous", title: "Present Continuous", cat: "grammar", type: "guide", mins: 9, done: true },
      { id: "vocab-2", title: "Unit 2 · Daily Life in the Community", cat: "vocab", type: "vocab", mins: 6, done: true },
      { id: "count-nouns", title: "Countable vs Uncountable", cat: "grammar", type: "practice", mins: 6, done: false, current: true },
      { id: "shopping-game", title: "At the Market", cat: "games", type: "game", mins: 5, done: false },
    ],
  },
  {
    n: 3, title: "Going Deeper", caption: "Stories, the past & choices",
    items: [
      { id: "past-simple", title: "Past Simple", cat: "grammar", type: "guide", mins: 9, done: false },
      { id: "vocab-3", title: "Unit 3 · Community Participation", cat: "vocab", type: "vocab", mins: 6, done: false },
      { id: "tenses-review", title: "Simple Tenses Review", cat: "quiz", type: "quiz", mins: 8, done: false },
      { id: "conditionals", title: "Zero & First Conditionals", cat: "grammar", type: "guide", mins: 10, done: false },
    ],
  },
  {
    n: 4, title: "Express Yourself", caption: "Advice, opinions & retelling",
    items: [
      { id: "modals", title: "Modals: Advice & Caution", cat: "grammar", type: "guide", mins: 10, done: false },
      { id: "reported", title: "Reported Speech", cat: "grammar", type: "guide", mins: 11, done: false },
      { id: "speaking-housing", title: "Speaking: Housing", cat: "speak", type: "speak", mins: 7, done: false },
    ],
  },
  {
    n: 5, title: "Real World", caption: "Work, health & getting things done",
    items: [
      { id: "medical", title: "Medical Instructions", cat: "vocab", type: "vocab", mins: 8, done: false },
      { id: "phrasal-work", title: "Workplace Phrasal Verbs", cat: "vocab", type: "vocab", mins: 9, done: false },
      { id: "finance-speak", title: "Speaking: Money & Finance", cat: "speak", type: "speak", mins: 8, done: false },
    ],
  },
];

// The recommended "next step" (hybrid: surfaced, not forced)
const NEXT_UP = { stage: 2, id: "count-nouns", title: "Countable vs Uncountable", cat: "grammar", type: "practice", mins: 6, progress: 40 };

const DAILY_VOCAB = { id: "daily-vocab", title: "Daily Vocab Review", cat: "vocab", words: 8, streakSafe: true };

// Achievements — gamification is front & center in independent mode
const ACHIEVEMENTS = [
  { id: "first-steps", name: "First Steps",   desc: "Finish your first activity",     icon: "boot",    earned: true,  tone: "grammar" },
  { id: "word-50",     name: "Word Collector", desc: "Learn 50 new words",            icon: "cards",   earned: true,  tone: "vocab" },
  { id: "streak-7",    name: "Week Warrior",   desc: "Keep a 7-day streak",            icon: "flame",   earned: true,  tone: "quiz" },
  { id: "commuter",    name: "Commuter",       desc: "Study 10 times on the go",       icon: "train",   earned: true,  tone: "pron",  reflects: "on the bus & train" },
  { id: "night-owl",   name: "Night Owl",      desc: "Study 5 evenings in a row",      icon: "moon",    earned: false, progress: 80, tone: "games", reflects: "games before bed" },
  { id: "grammar-guru",name: "Grammar Guru",   desc: "Finish every verb tense",        icon: "blocks",  earned: false, progress: 55, tone: "grammar" },
  { id: "word-200",    name: "Word Master",    desc: "Learn 200 words",                icon: "star",    earned: false, progress: 71, tone: "vocab" },
  { id: "perfect-quiz",name: "Sharpshooter",   desc: "Score 100% on a quiz",           icon: "target",  earned: false, progress: 0,  tone: "quiz" },
];

const CERTIFICATES = [
  { id: "stage-1", name: "Stage 1 Complete", caption: "Getting Started", earned: true },
  { id: "stage-2", name: "Stage 2 Complete", caption: "Building Up", earned: false, progress: 50 },
];

const LEADERBOARD = [
  { rank: 1, name: "Diego",  pts: 2710, you: false },
  { rank: 2, name: "Amara",  pts: 2480, you: true },
  { rank: 3, name: "Mei",    pts: 2390, you: false },
  { rank: 4, name: "Yusuf",  pts: 2050, you: false },
  { rank: 5, name: "Priya",  pts: 1920, you: false },
];

// Sample interactive activity content (flashcards + a check question)
const ACTIVITY_DEMO = {
  title: "Unit 2 · Daily Life",
  cat: "vocab",
  cards: [
    { word: "neighborhood", hint: "the area around your home", example: "I live in a friendly neighborhood." },
    { word: "appointment", hint: "a planned time to meet", example: "I have a doctor's appointment at 3." },
    { word: "errand", hint: "a short trip to do a task", example: "I need to run a few errands today." },
  ],
  check: {
    q: "Which word means a short trip to do a task?",
    options: ["neighborhood", "errand", "appointment"],
    answer: 1,
  },
};

Object.assign(window, {
  LEARNER, CATEGORIES, STAGES, NEXT_UP, DAILY_VOCAB,
  ACHIEVEMENTS, CERTIFICATES, LEADERBOARD, ACTIVITY_DEMO,
});
