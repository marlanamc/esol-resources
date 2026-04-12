/**
 * Gerunds & Infinitives Pattern Groups
 * Organized for pattern-first discovery learning
 * Students see examples first, then learn the rule
 */

import type {
  GerundInfinitiveGroup,
  GerundInfinitivePattern
} from '@/types/gerund-infinitive';

// =============================================================================
// FOUNDATION LEVEL: INTRO GROUPS (Pattern Recognition)
// =============================================================================

/**
 * GROUP 0A: GERUNDS INTRO (Foundation - unlocked by default)
 * Easy pattern recognition: identify -ing forms used as nouns
 * Students just need to recognize the gerund pattern, not choose between forms
 */
export const GROUP_0A: GerundInfinitiveGroup = {
  id: 'group-0a',
  title: 'What is a Gerund?',
  shortTitle: '1. Gerunds Intro',
  pattern: 'Gerund = verb + -ing used like a noun. It can be the subject or come after a preposition.',
  patternExample: 'Cooking at home saves money',
  colorClass: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  difficulty: 1,
  phase: 'foundation',
  prerequisite: null,
  memoryTrick: '-ing names the activity as a thing.',
  bigPicture:
    'Sometimes an action has to act like a noun in the sentence. Verb + -ing is one common way English does that.\nThis level trains your eye to spot that -ing shape.',
  icon: '🏊',
  patterns: [
    {
      id: 'gerund-subject',
      trigger: '___ is/are',
      correctForm: 'gerund',
      category: 'subject',
      memoryTrick: 'When -ing starts the sentence as the subject, it\'s a gerund!',
      examples: [
        { sentence: "___ is great exercise.", blank: 'Swimming', context: 'Health' },
        { sentence: "___ helps you relax.", blank: 'Reading', context: 'Hobbies' },
        { sentence: "___ takes practice.", blank: 'Cooking', context: 'Skills' },
        { sentence: "___ is my favorite hobby.", blank: 'Dancing', context: 'Hobbies' },
        { sentence: "___ can be dangerous.", blank: 'Texting while driving', context: 'Safety' },
        { sentence: "___ makes me happy.", blank: 'Singing', context: 'Emotions' }
      ]
    },
    {
      id: 'gerund-object-love',
      trigger: 'love/like/hate',
      correctForm: 'gerund',
      category: 'verb-gerund',
      memoryTrick: 'After love/like/hate, the -ing names what you love/like/hate!',
      examples: [
        { sentence: "I love ___.", blank: 'cooking', context: 'Hobbies' },
        { sentence: "She likes ___ in the morning.", blank: 'running', context: 'Exercise' },
        { sentence: "He hates ___ early.", blank: 'waking up', context: 'Daily life' },
        { sentence: "We love ___ movies together.", blank: 'watching', context: 'Entertainment' },
        { sentence: "They like ___ new places.", blank: 'exploring', context: 'Travel' },
        { sentence: "I hate ___ in traffic.", blank: 'sitting', context: 'Commute' }
      ]
    },
    {
      id: 'gerund-after-prep',
      trigger: 'preposition + ___',
      correctForm: 'gerund',
      category: 'preposition',
      memoryTrick: 'After words like for, about, in, at → always use -ing!',
      examples: [
        { sentence: "Thanks for ___.", blank: 'helping', context: 'Polite' },
        { sentence: "I'm good at ___.", blank: 'listening', context: 'Skills' },
        { sentence: "She's afraid of ___.", blank: 'flying', context: 'Fears' },
        { sentence: "Think about ___ a break.", blank: 'taking', context: 'Advice' },
        { sentence: "Before ___, wash your hands.", blank: 'eating', context: 'Health' },
        { sentence: "After ___, I felt better.", blank: 'exercising', context: 'Health' }
      ]
    },
    {
      id: 'gerund-go-activity',
      trigger: 'go ___',
      correctForm: 'gerund',
      category: 'go-activity',
      memoryTrick: 'GO + activity always uses -ing! Go swimming, go shopping...',
      examples: [
        { sentence: "Let's go ___!", blank: 'swimming', context: 'Activity' },
        { sentence: "We went ___ yesterday.", blank: 'shopping', context: 'Activity' },
        { sentence: "Do you want to go ___?", blank: 'hiking', context: 'Invitation' },
        { sentence: "They go ___ every weekend.", blank: 'camping', context: 'Hobbies' },
        { sentence: "I love going ___.", blank: 'dancing', context: 'Entertainment' },
        { sentence: "She goes ___ on Saturdays.", blank: 'walking', context: 'Exercise' }
      ]
    },
    {
      id: 'gerund-enjoy-finish',
      trigger: 'enjoy/finish',
      correctForm: 'gerund',
      category: 'verb-gerund',
      memoryTrick: 'Enjoy and finish always take -ing!',
      examples: [
        { sentence: "I enjoy ___ books.", blank: 'reading', context: 'Hobbies' },
        { sentence: "She finished ___ her homework.", blank: 'doing', context: 'School' },
        { sentence: "We enjoy ___ together.", blank: 'cooking', context: 'Family' },
        { sentence: "He finished ___ the report.", blank: 'writing', context: 'Work' },
        { sentence: "I really enjoy ___ to music.", blank: 'listening', context: 'Relaxation' },
        { sentence: "Have you finished ___?", blank: 'eating', context: 'Meal' }
      ]
    }
  ]
};

/**
 * GROUP 0B: INFINITIVES INTRO (Foundation)
 * Easy pattern recognition: identify to + verb forms
 * Students just need to recognize the infinitive pattern
 */
export const GROUP_0B: GerundInfinitiveGroup = {
  id: 'group-0b',
  title: 'What is an Infinitive?',
  shortTitle: '2. Infinitives Intro',
  pattern: 'Infinitive = to + base verb. It often shows a goal or the next step.',
  patternExample: 'She plans to apply next week',
  colorClass: 'bg-blue-100 border-blue-300 text-blue-900',
  difficulty: 1,
  phase: 'foundation',
  prerequisite: null,
  memoryTrick: 'to + verb = where you are headed.',
  bigPicture:
    'English often uses to + verb to show a goal, plan, or purpose—what you want to do next.\nHere you learn to recognize that chunk, not random letters.',
  icon: '🎯',
  patterns: [
    {
      id: 'inf-want-need',
      trigger: 'want/need',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      memoryTrick: 'Want and need point to what you WILL do = to + verb!',
      examples: [
        { sentence: "I want ___ English.", blank: 'to learn', context: 'Goals' },
        { sentence: "She needs ___ early.", blank: 'to leave', context: 'Schedule' },
        { sentence: "We want ___ you.", blank: 'to help', context: 'Kindness' },
        { sentence: "He needs ___ more water.", blank: 'to drink', context: 'Health' },
        { sentence: "I want ___ a doctor.", blank: 'to become', context: 'Career' },
        { sentence: "They need ___ the project.", blank: 'to finish', context: 'Work' }
      ]
    },
    {
      id: 'inf-hope-plan',
      trigger: 'hope/plan',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      memoryTrick: 'Hope and plan are about the FUTURE = to + verb!',
      examples: [
        { sentence: "I hope ___ you soon.", blank: 'to see', context: 'Social' },
        { sentence: "She plans ___ next year.", blank: 'to travel', context: 'Travel' },
        { sentence: "We hope ___ the exam.", blank: 'to pass', context: 'School' },
        { sentence: "He plans ___ a house.", blank: 'to buy', context: 'Goals' },
        { sentence: "I hope ___ a job.", blank: 'to find', context: 'Career' },
        { sentence: "They plan ___ married.", blank: 'to get', context: 'Life' }
      ]
    },
    {
      id: 'inf-adj-happy',
      trigger: 'happy/ready/easy',
      correctForm: 'infinitive',
      category: 'adjective',
      memoryTrick: 'Adjectives like happy, ready, easy + TO + verb!',
      examples: [
        { sentence: "I'm happy ___ you.", blank: 'to help', context: 'Polite' },
        { sentence: "She's ready ___ the test.", blank: 'to take', context: 'School' },
        { sentence: "It's easy ___ this.", blank: 'to understand', context: 'Learning' },
        { sentence: "We're happy ___ here.", blank: 'to be', context: 'Feelings' },
        { sentence: "He's ready ___.", blank: 'to go', context: 'Departure' },
        { sentence: "It's hard ___ early.", blank: 'to wake up', context: 'Daily life' }
      ]
    },
    {
      id: 'inf-purpose',
      trigger: 'in order to / to (purpose)',
      correctForm: 'infinitive',
      category: 'purpose',
      memoryTrick: 'TO shows WHY you do something (purpose)!',
      examples: [
        { sentence: "I study hard ___ good grades.", blank: 'to get', context: 'School' },
        { sentence: "She exercises ___ healthy.", blank: 'to stay', context: 'Health' },
        { sentence: "We save money ___ a house.", blank: 'to buy', context: 'Goals' },
        { sentence: "He wakes early ___ traffic.", blank: 'to avoid', context: 'Commute' },
        { sentence: "I'm calling ___ about the job.", blank: 'to ask', context: 'Work' },
        { sentence: "She went out ___ lunch.", blank: 'to buy', context: 'Daily life' }
      ]
    },
    {
      id: 'inf-decide-agree',
      trigger: 'decide/agree',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      memoryTrick: 'Decide and agree lead to ACTION = to + verb!',
      examples: [
        { sentence: "I decided ___ early.", blank: 'to leave', context: 'Decision' },
        { sentence: "She agreed ___ us.", blank: 'to help', context: 'Cooperation' },
        { sentence: "We decided ___ at home.", blank: 'to stay', context: 'Plans' },
        { sentence: "He agreed ___ the terms.", blank: 'to accept', context: 'Business' },
        { sentence: "I decided ___ a new car.", blank: 'to buy', context: 'Purchase' },
        { sentence: "They agreed ___ together.", blank: 'to work', context: 'Teamwork' }
      ]
    }
  ]
};

// =============================================================================
// FOUNDATION LEVEL: CORE PATTERN GROUPS
// =============================================================================

/**
 * GROUP 1: AFTER PREPOSITION = GERUND
 * The golden rule: after a preposition, ALWAYS use gerund
 */
export const GROUP_1: GerundInfinitiveGroup = {
  id: 'group-1',
  title: 'After Preposition = Gerund',
  shortTitle: '9. Prepositions',
  pattern: 'After any preposition, use -ing. Do not put to + verb right after a preposition.',
  patternExample: 'She is interested in taking classes',
  colorClass: 'bg-terracotta-100 border-terracotta-300 text-terracotta-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Prep spotted? Next verb shape is -ing.',
  bigPicture:
    'A preposition cannot be followed by to + base verb right away.\nAfter a preposition, the verb takes -ing.',
  icon: '🔑',
  patterns: [
    {
      id: 'prep-in',
      trigger: 'interested in',
      correctForm: 'gerund',
      category: 'preposition',
      commonError: 'interested in to learn',
      examples: [
        { sentence: "I'm interested in ___ Spanish.", blank: 'learning', context: 'Education' },
        { sentence: "She's interested in ___ about other cultures.", blank: 'learning', context: 'General' },
        { sentence: "Are you interested in ___ us for dinner?", blank: 'joining', context: 'Social' },
        { sentence: "He's interested in ___ guitar.", blank: 'playing', context: 'Hobbies' },
        { sentence: "We're interested in ___ the project.", blank: 'completing', context: 'Work' },
        { sentence: "They're interested in ___ more about it.", blank: 'finding out', context: 'General' }
      ]
    },
    {
      id: 'prep-at',
      trigger: 'good at',
      correctForm: 'gerund',
      category: 'preposition',
      commonError: 'good at to solve',
      examples: [
        { sentence: "I'm good at ___ problems.", blank: 'solving', context: 'Job interview' },
        { sentence: "She's good at ___ to people.", blank: 'talking', context: 'Workplace' },
        { sentence: "He's not good at ___ directions.", blank: 'following', context: 'General' },
        { sentence: "She's good at ___ quickly.", blank: 'adapting', context: 'Skills' },
        { sentence: "He's good at ___ decisions.", blank: 'making', context: 'Leadership' },
        { sentence: "I'm good at ___ attention to details.", blank: 'paying', context: 'Work' }
      ]
    },
    {
      id: 'prep-for',
      trigger: 'thank you for',
      correctForm: 'gerund',
      category: 'preposition',
      commonError: 'thank you for to help',
      examples: [
        { sentence: "Thank you for ___ me.", blank: 'helping', context: 'Polite' },
        { sentence: "Thank you for ___ by.", blank: 'stopping', context: 'Social' },
        { sentence: "Thank you for ___ so quickly.", blank: 'responding', context: 'Workplace' },
        { sentence: "Thank you for ___ the time.", blank: 'taking', context: 'Polite' },
        { sentence: "Thank you for ___ me with this.", blank: 'assisting', context: 'Workplace' },
        { sentence: "Thank you for ___ to the meeting.", blank: 'coming', context: 'Social' }
      ]
    },
    {
      id: 'prep-about',
      trigger: 'think about',
      correctForm: 'gerund',
      category: 'preposition',
      examples: [
        { sentence: "I'm thinking about ___ a new car.", blank: 'buying', context: 'Decision' },
        { sentence: "She's thinking about ___ to a new city.", blank: 'moving', context: 'Life decision' },
        { sentence: "Have you thought about ___ online classes?", blank: 'taking', context: 'Education' },
        { sentence: "He's thinking about ___ his job.", blank: 'changing', context: 'Career' },
        { sentence: "We're thinking about ___ a vacation.", blank: 'taking', context: 'Travel' },
        { sentence: "I've been thinking about ___ back to school.", blank: 'going', context: 'Education' }
      ]
    },
    {
      id: 'prep-of',
      trigger: 'tired of',
      correctForm: 'gerund',
      category: 'preposition',
      commonError: 'tired of to wait',
      examples: [
        { sentence: "I'm tired of ___ for the bus.", blank: 'waiting', context: 'Transportation' },
        { sentence: "She's tired of ___ the same thing every day.", blank: 'eating', context: 'Daily life' },
        { sentence: "He's tired of ___ late hours.", blank: 'working', context: 'Job' },
        { sentence: "I'm tired of ___ the same mistakes.", blank: 'making', context: 'Frustration' },
        { sentence: "She's tired of ___ excuses.", blank: 'hearing', context: 'Frustration' },
        { sentence: "We're tired of ___ in traffic.", blank: 'sitting', context: 'Transportation' }
      ]
    },
    {
      id: 'prep-without',
      trigger: 'without',
      correctForm: 'gerund',
      category: 'preposition',
      examples: [
        { sentence: "He left without ___ goodbye.", blank: 'saying', context: 'Social' },
        { sentence: "You can't succeed without ___ hard.", blank: 'working', context: 'Motivation' },
        { sentence: "She did it without ___ anyone.", blank: 'telling', context: 'General' },
        { sentence: "I can't sleep without ___ the door locked.", blank: 'checking', context: 'Habit' },
        { sentence: "Don't leave without ___ your room.", blank: 'cleaning', context: 'Home' },
        { sentence: "She passed the test without ___ much.", blank: 'studying', context: 'Education' }
      ]
    },
    {
      id: 'prep-before',
      trigger: 'before',
      correctForm: 'gerund',
      category: 'preposition',
      examples: [
        { sentence: "Wash your hands before ___.", blank: 'eating', context: 'Health' },
        { sentence: "Think before ___.", blank: 'speaking', context: 'Advice' },
        { sentence: "Check your work before ___ it.", blank: 'submitting', context: 'School/Work' },
        { sentence: "Stretch before ___.", blank: 'exercising', context: 'Health' },
        { sentence: "Read the instructions before ___.", blank: 'starting', context: 'General' },
        { sentence: "Save your file before ___ the program.", blank: 'closing', context: 'Tech' }
      ]
    },
    {
      id: 'prep-after',
      trigger: 'after',
      correctForm: 'gerund',
      category: 'preposition',
      examples: [
        { sentence: "I feel better after ___.", blank: 'exercising', context: 'Health' },
        { sentence: "Let's talk after ___ the movie.", blank: 'watching', context: 'Social' },
        { sentence: "She relaxes after ___ home.", blank: 'coming', context: 'Daily life' },
        { sentence: "He always showers after ___.", blank: 'running', context: 'Exercise' },
        { sentence: "Call me after ___ from work.", blank: 'getting', context: 'Daily life' },
        { sentence: "We'll discuss it after ___ the report.", blank: 'reading', context: 'Work' }
      ]
    },
    // Personal Response Questions - "by" preposition
    {
      id: 'personal-by-health',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you usually stay focused during a busy week?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I stay focused by writing a short to-do list',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-english',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you build your English outside class?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I build my English by listening to short podcasts',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-commute',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you usually get ready for an interview or important meeting?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I get ready by reviewing my notes',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-money',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you save money on groceries or transportation?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I save money by cooking at home',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-friends',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you build trust with new coworkers or classmates?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I build trust by showing up on time',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-relax',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you calm down after a stressful day?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I calm down by taking a short walk',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-learn',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you learn a new skill at work or at home?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I learn new skills by practicing every day',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-by-celebrate',
      trigger: 'by',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'How do you usually celebrate good news?',
      patternHint: 'by + gerund',
      exampleAnswer: 'I celebrate by having dinner with my family',
      requiredPattern: /by\s+\w+ing/i,
      examples: []
    },
    // Personal Response Questions - "in/at" adjective+preposition patterns
    {
      id: 'personal-interested-in',
      trigger: 'interested in',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What skill are you interested in learning next?',
      patternHint: 'interested in + gerund',
      exampleAnswer: 'I\'m interested in learning bookkeeping',
      requiredPattern: /interested\s+in\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-good-at',
      trigger: 'good at',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What are you good at doing at work or at home?',
      patternHint: 'good at + gerund',
      exampleAnswer: 'I\'m good at organizing busy schedules',
      requiredPattern: /good\s+at\s+\w+ing/i,
      examples: []
    },
    // Personal Response Questions - "about" patterns
    {
      id: 'personal-thinking-about',
      trigger: 'thinking about',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What are you thinking about doing next month?',
      patternHint: 'thinking about + gerund',
      exampleAnswer: 'I\'m thinking about taking a short class',
      requiredPattern: /thinking\s+about\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-dream-about',
      trigger: 'dream about',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What do you dream about doing in the next few years?',
      patternHint: 'dream about + gerund',
      exampleAnswer: 'I dream about opening my own business',
      requiredPattern: /dream\s+about\s+\w+ing/i,
      examples: []
    },
    // Personal Response Questions - "of" patterns
    {
      id: 'personal-tired-of',
      trigger: 'tired of',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What task are you tired of doing every week?',
      patternHint: 'tired of + gerund',
      exampleAnswer: 'I\'m tired of waiting on hold with customer service',
      requiredPattern: /tired\s+of\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-proud-of',
      trigger: 'proud of',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What are you proud of achieving recently?',
      patternHint: 'proud of + gerund',
      exampleAnswer: 'I\'m proud of finishing my training program',
      requiredPattern: /proud\s+of\s+\w+ing/i,
      examples: []
    },
    // Personal Response Questions - "before/after" patterns
    {
      id: 'personal-before',
      trigger: 'before',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What do you always do before leaving for work or school?',
      patternHint: 'before + gerund',
      exampleAnswer: 'I check my calendar before leaving home',
      requiredPattern: /before\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-after',
      trigger: 'after',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What do you usually do after getting home?',
      patternHint: 'after + gerund',
      exampleAnswer: 'I make dinner after getting home',
      requiredPattern: /after\s+\w+ing/i,
      examples: []
    },
    // Personal Response Questions - "without" patterns
    {
      id: 'personal-without',
      trigger: 'without',
      correctForm: 'gerund',
      category: 'preposition',
      question: 'What routine can you not imagine living without?',
      patternHint: 'without + gerund',
      exampleAnswer: 'I can\'t imagine my mornings without checking the news',
      requiredPattern: /without\s+\w+ing/i,
      examples: []
    }
  ]
};

/**
 * GROUP 1B: WHICH PREPOSITION?
 * Drills which preposition goes with common phrases (interested in, good at, tired of, etc.)
 * Prerequisite: group-1 (after learning "preposition = gerund")
 */
export const GROUP_1B: GerundInfinitiveGroup = {
  id: 'group-1b',
  title: 'Which Preposition?',
  shortTitle: '10. Which Preposition?',
  pattern: 'Some adjectives need one fixed preposition. Learn the chunk; after it, always use -ing.',
  patternExample: 'afraid of making a mistake',
  colorClass: 'bg-terracotta-100 border-terracotta-300 text-terracotta-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Memorize adjective + prep as one bite.',
  bigPicture:
    'Here you are not choosing -ing vs to—the verb after the prep is always -ing.\nYour job is which preposition goes with that adjective (interested in, good at, tired of…).',
  icon: '📌',
  patterns: [
    // === ORIGINAL PATTERNS (kept) ===
    {
      id: 'prep-choice-in',
      trigger: 'interested',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'in',
      commonError: 'interested FOR/AT',
      errorExplanation: 'English says interested in, not *for/at.',
      memoryTrick: 'Interested IN = you want to get INto something!',
      examples: [
        { sentence: "I'm interested ___ learning Spanish.", blank: 'in', context: 'Education' },
        { sentence: "She's interested ___ taking the job.", blank: 'in', context: 'Career' },
        { sentence: "Are you interested ___ joining us?", blank: 'in', context: 'Social' },
        { sentence: "He's interested ___ buying a car.", blank: 'in', context: 'Decision' },
        { sentence: "We're interested ___ hearing your ideas.", blank: 'in', context: 'Work' },
        { sentence: "Are you interested ___ visiting the museum?", blank: 'in', context: 'Invitation' }
      ]
    },
    {
      id: 'prep-choice-at',
      trigger: 'good',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'at',
      commonError: 'good IN/FOR',
      errorExplanation: 'Use good at + -ing for skills.',
      memoryTrick: 'Good AT = you hit the target AT that skill!',
      examples: [
        { sentence: "I'm good ___ solving problems.", blank: 'at', context: 'Job interview' },
        { sentence: "She's good ___ learning languages.", blank: 'at', context: 'Skills' },
        { sentence: "He's not good ___ following directions.", blank: 'at', context: 'General' },
        { sentence: "She's good ___ playing piano.", blank: 'at', context: 'Skills' },
        { sentence: "I'm good ___ remembering names.", blank: 'at', context: 'Social' },
        { sentence: "He's good ___ keeping secrets.", blank: 'at', context: 'Personal' }
      ]
    },
    {
      id: 'prep-choice-for',
      trigger: 'thank you',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'for',
      commonError: 'thank you TO/OF',
      errorExplanation: 'Say thank you for + -ing.',
      memoryTrick: 'Thank you FOR = FOR what reason? The help!',
      examples: [
        { sentence: "Thank you ___ helping me.", blank: 'for', context: 'Polite' },
        { sentence: "Thank you ___ stopping by.", blank: 'for', context: 'Social' },
        { sentence: "Thank you ___ responding so quickly.", blank: 'for', context: 'Workplace' },
        { sentence: "Thank you ___ being so patient.", blank: 'for', context: 'Customer service' },
        { sentence: "Thank you ___ taking the time to meet.", blank: 'for', context: 'Business' },
        { sentence: "Thank you ___ inviting me to the party.", blank: 'for', context: 'Social' }
      ]
    },
    {
      id: 'prep-choice-of-tired',
      trigger: 'tired',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      commonError: 'tired FROM/WITH',
      errorExplanation: 'Tired of = fed up with; tired from = exhausted by.',
      memoryTrick: 'Tired OF = you want to get rid OF it!',
      examples: [
        { sentence: "I'm tired ___ waiting for the bus.", blank: 'of', context: 'Transportation' },
        { sentence: "She's tired ___ eating the same thing.", blank: 'of', context: 'Daily life' },
        { sentence: "He's tired ___ working late hours.", blank: 'of', context: 'Job' },
        { sentence: "I'm tired ___ explaining this again.", blank: 'of', context: 'Frustration' },
        { sentence: "She's tired ___ hearing excuses.", blank: 'of', context: 'Relationship' },
        { sentence: "We're tired ___ dealing with this problem.", blank: 'of', context: 'Work' }
      ]
    },
    {
      id: 'prep-choice-about-excited',
      trigger: 'excited',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'about',
      commonError: 'excited FOR/WITH',
      errorExplanation: 'Excited about + -ing for activities.',
      memoryTrick: 'Excited ABOUT = thinking ABOUT what\'s coming!',
      examples: [
        { sentence: "I'm excited ___ starting my new job.", blank: 'about', context: 'Career' },
        { sentence: "She's excited ___ learning to drive.", blank: 'about', context: 'Skills' },
        { sentence: "We're excited ___ traveling to Paris.", blank: 'about', context: 'Travel' },
        { sentence: "He's excited ___ meeting his favorite singer.", blank: 'about', context: 'Entertainment' },
        { sentence: "They're excited ___ moving to a new house.", blank: 'about', context: 'Life change' },
        { sentence: "I'm excited ___ trying the new restaurant.", blank: 'about', context: 'Food' }
      ]
    },
    // === NEW PATTERNS ===
    {
      id: 'prep-choice-of-afraid',
      trigger: 'afraid',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      commonError: 'afraid TO (infinitive)',
      errorExplanation: 'Here: afraid of + -ing.',
      memoryTrick: 'Afraid OF = OF what? The scary thing!',
      examples: [
        { sentence: "I'm afraid ___ making mistakes.", blank: 'of', context: 'Speaking anxiety' },
        { sentence: "She's afraid ___ failing the test.", blank: 'of', context: 'School' },
        { sentence: "He's afraid ___ losing his job.", blank: 'of', context: 'Career' },
        { sentence: "They're afraid ___ missing the flight.", blank: 'of', context: 'Travel' },
        { sentence: "I'm afraid ___ saying the wrong thing.", blank: 'of', context: 'Social' },
        { sentence: "She's afraid ___ being alone.", blank: 'of', context: 'Personal' }
      ]
    },
    {
      id: 'prep-choice-about-worried',
      trigger: 'worried',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'about',
      commonError: 'worried FOR/OF',
      errorExplanation: 'Worried about + -ing.',
      memoryTrick: 'Worried ABOUT = thinking ABOUT problems!',
      examples: [
        { sentence: "She's worried ___ losing her job.", blank: 'about', context: 'Career stress' },
        { sentence: "I'm worried ___ making the wrong decision.", blank: 'about', context: 'Life choices' },
        { sentence: "They're worried ___ not having enough money.", blank: 'about', context: 'Finances' },
        { sentence: "He's worried ___ being late for the interview.", blank: 'about', context: 'Job' },
        { sentence: "I'm worried ___ forgetting my lines.", blank: 'about', context: 'Performance' },
        { sentence: "She's worried ___ getting lost.", blank: 'about', context: 'Travel' }
      ]
    },
    {
      id: 'prep-choice-of-proud',
      trigger: 'proud',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      commonError: 'proud FOR/ABOUT',
      errorExplanation: 'English: proud of + -ing.',
      memoryTrick: 'Proud OF = ownership OF your achievement!',
      examples: [
        { sentence: "He's proud ___ finishing school.", blank: 'of', context: 'Achievement' },
        { sentence: "I'm proud ___ learning a new language.", blank: 'of', context: 'Skills' },
        { sentence: "She's proud ___ getting the promotion.", blank: 'of', context: 'Career' },
        { sentence: "We're proud ___ completing the project.", blank: 'of', context: 'Work' },
        { sentence: "He's proud ___ helping his community.", blank: 'of', context: 'Volunteer' },
        { sentence: "I'm proud ___ running my first marathon.", blank: 'of', context: 'Sports' }
      ]
    },
    {
      id: 'prep-choice-for-sorry',
      trigger: 'sorry',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'for',
      commonError: 'sorry ABOUT/OF',
      errorExplanation: 'Sorry for + -ing when you apologize for an action.',
      memoryTrick: 'Sorry FOR = FOR what action? What you did!',
      examples: [
        { sentence: "I'm sorry ___ being late.", blank: 'for', context: 'Apologizing' },
        { sentence: "She's sorry ___ forgetting your birthday.", blank: 'for', context: 'Social' },
        { sentence: "He's sorry ___ not calling sooner.", blank: 'for', context: 'Communication' },
        { sentence: "I'm sorry ___ interrupting you.", blank: 'for', context: 'Meeting' },
        { sentence: "We're sorry ___ causing any confusion.", blank: 'for', context: 'Customer service' },
        { sentence: "She's sorry ___ missing your party.", blank: 'for', context: 'Social' }
      ]
    },
    {
      id: 'prep-choice-for-responsible',
      trigger: 'responsible',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'for',
      commonError: 'responsible OF/TO',
      errorExplanation: 'Responsible for + -ing (the task).',
      memoryTrick: 'Responsible FOR = FOR what task? Your duty!',
      examples: [
        { sentence: "Who's responsible ___ cleaning up?", blank: 'for', context: 'Workplace' },
        { sentence: "I'm responsible ___ managing the team.", blank: 'for', context: 'Job' },
        { sentence: "She's responsible ___ training new employees.", blank: 'for', context: 'Workplace' },
        { sentence: "He's responsible ___ handling customer complaints.", blank: 'for', context: 'Customer service' },
        { sentence: "We're responsible ___ making sure everything runs smoothly.", blank: 'for', context: 'Management' },
        { sentence: "You're responsible ___ submitting the report on time.", blank: 'for', context: 'Deadline' }
      ]
    },
    {
      id: 'prep-choice-from-different',
      trigger: 'different',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'from',
      commonError: 'different TO/THAN',
      errorExplanation: 'Standard: different from.',
      memoryTrick: 'Different FROM = separated FROM the original!',
      examples: [
        { sentence: "This is different ___ what I expected.", blank: 'from', context: 'Comparison' },
        { sentence: "Living here is different ___ living in my country.", blank: 'from', context: 'Culture' },
        { sentence: "Working remotely is different ___ working in an office.", blank: 'from', context: 'Job' },
        { sentence: "Driving a truck is different ___ driving a car.", blank: 'from', context: 'Skills' },
        { sentence: "Teaching online is different ___ teaching in person.", blank: 'from', context: 'Education' },
        { sentence: "Cooking for one is different ___ cooking for a family.", blank: 'from', context: 'Daily life' }
      ]
    },
    {
      id: 'prep-choice-for-famous',
      trigger: 'famous',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'for',
      commonError: 'famous OF/BY',
      errorExplanation: 'Famous for + -ing.',
      memoryTrick: 'Famous FOR = FOR what reason? Their talent!',
      examples: [
        { sentence: "The restaurant is famous ___ making great tacos.", blank: 'for', context: 'Food' },
        { sentence: "She's famous ___ singing beautiful songs.", blank: 'for', context: 'Entertainment' },
        { sentence: "This city is famous ___ having amazing beaches.", blank: 'for', context: 'Travel' },
        { sentence: "He's famous ___ breaking world records.", blank: 'for', context: 'Sports' },
        { sentence: "This company is famous ___ creating innovative products.", blank: 'for', context: 'Business' },
        { sentence: "She's famous ___ writing bestselling novels.", blank: 'for', context: 'Literature' }
      ]
    },
    {
      id: 'prep-choice-at-bad',
      trigger: 'bad',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'at',
      commonError: 'bad IN/FOR',
      errorExplanation: 'Bad at + -ing (same pattern as good at).',
      memoryTrick: 'Bad AT = same as good AT, just the opposite skill level!',
      examples: [
        { sentence: "I'm bad ___ remembering names.", blank: 'at', context: 'Self-description' },
        { sentence: "He's bad ___ keeping secrets.", blank: 'at', context: 'Personal' },
        { sentence: "She's bad ___ waking up early.", blank: 'at', context: 'Daily life' },
        { sentence: "I'm bad ___ following instructions.", blank: 'at', context: 'Work' },
        { sentence: "He's bad ___ saving money.", blank: 'at', context: 'Finances' },
        { sentence: "We're bad ___ making quick decisions.", blank: 'at', context: 'Personality' }
      ]
    },
    {
      id: 'prep-choice-about-crazy',
      trigger: 'crazy',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'about',
      commonError: 'crazy FOR/WITH',
      errorExplanation: 'Crazy about + -ing.',
      memoryTrick: 'Crazy ABOUT = can\'t stop thinking ABOUT it!',
      examples: [
        { sentence: "He's crazy ___ watching soccer.", blank: 'about', context: 'Sports' },
        { sentence: "She's crazy ___ collecting stamps.", blank: 'about', context: 'Hobbies' },
        { sentence: "They're crazy ___ trying new restaurants.", blank: 'about', context: 'Food' },
        { sentence: "I'm crazy ___ learning new languages.", blank: 'about', context: 'Education' },
        { sentence: "He's crazy ___ playing video games.", blank: 'about', context: 'Entertainment' },
        { sentence: "She's crazy ___ hiking in the mountains.", blank: 'about', context: 'Outdoors' }
      ]
    },
    {
      id: 'prep-choice-of-capable',
      trigger: 'capable',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      commonError: 'capable TO (infinitive)',
      errorExplanation: 'Capable of + -ing (not capable to).',
      memoryTrick: 'Capable OF = full OF ability!',
      examples: [
        { sentence: "She's capable ___ managing the team.", blank: 'of', context: 'Professional' },
        { sentence: "I'm capable ___ learning new skills.", blank: 'of', context: 'Self-improvement' },
        { sentence: "Are you capable ___ finishing this by Friday?", blank: 'of', context: 'Deadline' },
        { sentence: "He's capable ___ handling difficult situations.", blank: 'of', context: 'Leadership' },
        { sentence: "The system is capable ___ processing 1000 requests per second.", blank: 'of', context: 'Technology' },
        { sentence: "She's capable ___ speaking four languages.", blank: 'of', context: 'Skills' }
      ]
    }
  ]
};

/**
 * GROUP 1D: COMBO CHALLENGE
 * The ultimate test: choose BOTH the correct preposition AND the correct verb form.
 * Uses patterns from GROUP_1B but requires two answers per sentence.
 */
export const GROUP_1D: GerundInfinitiveGroup = {
  id: 'group-1d',
  title: 'Combo Challenge',
  shortTitle: '11. Combo Challenge',
  pattern: 'Two blanks: choose the preposition first. The word after it is always -ing.',
  patternExample: 'interested in learning',
  colorClass: 'bg-purple-100 border-purple-300 text-purple-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Lock the prep chunk, then add -ing.',
  bigPicture:
    'Same rule as before, with two steps: pick the right preposition with the adjective, then put the verb in -ing.\nPrep first; -ing second.',
  icon: '🎯',
  patterns: [
    {
      id: 'combo-interested',
      trigger: 'interested',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'in',
      examples: [
        { sentence: "I'm interested ___ ___ (learn) Spanish.", blank: 'in learning', context: 'Education' },
        { sentence: "She's interested ___ ___ (take) the job.", blank: 'in taking', context: 'Career' },
        { sentence: "Are you interested ___ ___ (join) us?", blank: 'in joining', context: 'Social' },
        { sentence: "He's interested ___ ___ (buy) a house.", blank: 'in buying', context: 'Life decisions' },
        { sentence: "We're interested ___ ___ (hear) your ideas.", blank: 'in hearing', context: 'Work' },
        { sentence: "They're interested ___ ___ (invest) in the project.", blank: 'in investing', context: 'Business' }
      ]
    },
    {
      id: 'combo-good',
      trigger: 'good',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'at',
      examples: [
        { sentence: "She's good ___ ___ (solve) problems.", blank: 'at solving', context: 'Skills' },
        { sentence: "I'm not good ___ ___ (remember) names.", blank: 'at remembering', context: 'Personal' },
        { sentence: "He's good ___ ___ (cook) Italian food.", blank: 'at cooking', context: 'Hobbies' },
        { sentence: "They're good ___ ___ (find) solutions.", blank: 'at finding', context: 'Work' },
        { sentence: "Are you good ___ ___ (speak) in public?", blank: 'at speaking', context: 'Skills' },
        { sentence: "She's good ___ ___ (manage) her time.", blank: 'at managing', context: 'Productivity' }
      ]
    },
    {
      id: 'combo-tired',
      trigger: 'tired',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      examples: [
        { sentence: "I'm tired ___ ___ (wait) for the bus.", blank: 'of waiting', context: 'Daily life' },
        { sentence: "She's tired ___ ___ (eat) the same food.", blank: 'of eating', context: 'Routine' },
        { sentence: "He's tired ___ ___ (work) overtime.", blank: 'of working', context: 'Job' },
        { sentence: "We're tired ___ ___ (hear) excuses.", blank: 'of hearing', context: 'Frustration' },
        { sentence: "I'm tired ___ ___ (explain) this.", blank: 'of explaining', context: 'Communication' },
        { sentence: "They're tired ___ ___ (deal) with the problem.", blank: 'of dealing', context: 'Stress' }
      ]
    },
    {
      id: 'combo-excited',
      trigger: 'excited',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'about',
      examples: [
        { sentence: "I'm excited ___ ___ (start) my new job.", blank: 'about starting', context: 'Career' },
        { sentence: "She's excited ___ ___ (travel) to Japan.", blank: 'about traveling', context: 'Travel' },
        { sentence: "He's excited ___ ___ (meet) the team.", blank: 'about meeting', context: 'Work' },
        { sentence: "We're excited ___ ___ (move) to the new house.", blank: 'about moving', context: 'Life change' },
        { sentence: "They're excited ___ ___ (try) the new restaurant.", blank: 'about trying', context: 'Food' },
        { sentence: "I'm excited ___ ___ (learn) to drive.", blank: 'about learning', context: 'Skills' }
      ]
    },
    {
      id: 'combo-afraid',
      trigger: 'afraid',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      examples: [
        { sentence: "I'm afraid ___ ___ (make) mistakes.", blank: 'of making', context: 'Anxiety' },
        { sentence: "She's afraid ___ ___ (fail) the exam.", blank: 'of failing', context: 'School' },
        { sentence: "He's afraid ___ ___ (lose) his job.", blank: 'of losing', context: 'Career' },
        { sentence: "They're afraid ___ ___ (miss) the flight.", blank: 'of missing', context: 'Travel' },
        { sentence: "I'm afraid ___ ___ (say) the wrong thing.", blank: 'of saying', context: 'Social' },
        { sentence: "She's afraid ___ ___ (be) alone.", blank: 'of being', context: 'Personal' }
      ]
    },
    {
      id: 'combo-sorry',
      trigger: 'sorry',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'for',
      examples: [
        { sentence: "I'm sorry ___ ___ (be) late.", blank: 'for being', context: 'Apologizing' },
        { sentence: "She's sorry ___ ___ (forget) your birthday.", blank: 'for forgetting', context: 'Social' },
        { sentence: "He's sorry ___ ___ (not call) sooner.", blank: 'for not calling', context: 'Communication' },
        { sentence: "I'm sorry ___ ___ (interrupt) you.", blank: 'for interrupting', context: 'Meeting' },
        { sentence: "We're sorry ___ ___ (cause) any trouble.", blank: 'for causing', context: 'Customer service' },
        { sentence: "She's sorry ___ ___ (miss) the party.", blank: 'for missing', context: 'Social' }
      ]
    },
    {
      id: 'combo-proud',
      trigger: 'proud',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'of',
      examples: [
        { sentence: "I'm proud ___ ___ (finish) the project.", blank: 'of finishing', context: 'Achievement' },
        { sentence: "She's proud ___ ___ (learn) a new skill.", blank: 'of learning', context: 'Growth' },
        { sentence: "He's proud ___ ___ (get) the promotion.", blank: 'of getting', context: 'Career' },
        { sentence: "We're proud ___ ___ (help) our community.", blank: 'of helping', context: 'Volunteer' },
        { sentence: "They're proud ___ ___ (complete) the marathon.", blank: 'of completing', context: 'Sports' },
        { sentence: "I'm proud ___ ___ (overcome) my fears.", blank: 'of overcoming', context: 'Personal' }
      ]
    },
    {
      id: 'combo-worried',
      trigger: 'worried',
      correctForm: 'gerund',
      category: 'preposition-choice',
      correctPreposition: 'about',
      examples: [
        { sentence: "I'm worried ___ ___ (lose) my job.", blank: 'about losing', context: 'Career' },
        { sentence: "She's worried ___ ___ (make) a mistake.", blank: 'about making', context: 'Anxiety' },
        { sentence: "He's worried ___ ___ (be) late.", blank: 'about being', context: 'Time' },
        { sentence: "We're worried ___ ___ (not have) enough money.", blank: 'about not having', context: 'Finances' },
        { sentence: "They're worried ___ ___ (get) lost.", blank: 'about getting', context: 'Travel' },
        { sentence: "I'm worried ___ ___ (forget) my lines.", blank: 'about forgetting', context: 'Performance' }
      ]
    }
  ]
};

/**
 * GROUP 1C: "TO" PREPOSITION TRAP
 * In some phrases, "to" is a PREPOSITION, not an infinitive marker.
 * Common traps: look forward to, be used to, get used to, be committed to
 */
export const GROUP_1C: GerundInfinitiveGroup = {
  id: 'group-1c',
  title: 'The "TO" Trap',
  shortTitle: '21. The "TO" Trap',
  pattern: 'In phrases like look forward to or be used to, to belongs to the chunk, not to + infinitive. After that to, use -ing.',
  patternExample: 'We look forward to meeting the new teacher',
  colorClass: 'bg-amber-100 border-amber-300 text-amber-900',
  difficulty: 3,
  phase: 'mastery',
  prerequisite: null,
  memoryTrick: 'Is to glued to the words before it? → -ing next.',
  bigPicture:
    'You already know: after a preposition, English uses -ing.\nIn these phrases, to works like a preposition—it is not starting a new to + verb. Learn the whole chunk, then put -ing after it.',
  icon: '🪤',
  patterns: [
    {
      id: 'trap-look-forward',
      trigger: 'look forward to',
      correctForm: 'gerund',
      category: 'to-preposition',
      commonError: 'look forward to see',
      memoryTrick: '"To" is a preposition here, not infinitive!',
      examples: [
        { sentence: "I look forward to ___ you.", blank: 'meeting', context: 'Business' },
        { sentence: "We look forward to ___ from you.", blank: 'hearing', context: 'Email' },
        { sentence: "She looks forward to ___ home.", blank: 'going', context: 'Travel' },
        { sentence: "I look forward to ___ the weekend.", blank: 'spending', context: 'Plans' },
        { sentence: "They look forward to ___ the concert.", blank: 'attending', context: 'Events' },
        { sentence: "He looks forward to ___ his family.", blank: 'seeing', context: 'Family' }
      ]
    },
    {
      id: 'trap-be-used-to',
      trigger: 'be used to',
      correctForm: 'gerund',
      category: 'to-preposition',
      commonError: 'used to wake (confusion with past habit)',
      memoryTrick: '"Be used to" = accustomed to = preposition!',
      examples: [
        { sentence: "I'm used to ___ up early.", blank: 'waking', context: 'Daily life' },
        { sentence: "She's used to ___ alone.", blank: 'living', context: 'Lifestyle' },
        { sentence: "He's not used to ___ in traffic.", blank: 'driving', context: 'Daily life' },
        { sentence: "I'm used to ___ long hours.", blank: 'working', context: 'Work' },
        { sentence: "She's used to ___ spicy food.", blank: 'eating', context: 'Food' },
        { sentence: "He's used to ___ in public.", blank: 'speaking', context: 'Skills' }
      ]
    },
    {
      id: 'trap-get-used-to',
      trigger: 'get used to',
      correctForm: 'gerund',
      category: 'to-preposition',
      commonError: 'get used to live',
      memoryTrick: '"Get used to" = becoming accustomed = preposition!',
      examples: [
        { sentence: "I'll get used to ___ here.", blank: 'living', context: 'Moving' },
        { sentence: "She's getting used to ___ early.", blank: 'waking', context: 'New job' },
        { sentence: "He needs to get used to ___ in English.", blank: 'speaking', context: 'Language learning' },
        { sentence: "It takes time to get used to ___ in a new city.", blank: 'living', context: 'Relocation' },
        { sentence: "She's getting used to ___ the new software.", blank: 'using', context: 'Work' },
        { sentence: "I'm getting used to ___ without sugar.", blank: 'drinking coffee', context: 'Habits' }
      ]
    },
    {
      id: 'trap-committed-to',
      trigger: 'committed to',
      correctForm: 'gerund',
      category: 'to-preposition',
      memoryTrick: '"Committed to" = dedicated to = preposition!',
      examples: [
        { sentence: "I'm committed to ___ my goals.", blank: 'achieving', context: 'Goals' },
        { sentence: "She's committed to ___ better.", blank: 'doing', context: 'Self-improvement' },
        { sentence: "They're committed to ___ the environment.", blank: 'protecting', context: 'Environment' },
        { sentence: "He's committed to ___ his health.", blank: 'improving', context: 'Wellness' },
        { sentence: "We're committed to ___ quality service.", blank: 'providing', context: 'Work' },
        { sentence: "She's committed to ___ her education.", blank: 'completing', context: 'Education' }
      ]
    }
  ]
};

/**
 * GROUP 2A: GERUND VERBS
 * Verbs that always take gerund: enjoy, finish, avoid, consider, suggest, keep, quit, miss
 */
export const GROUP_2A: GerundInfinitiveGroup = {
  id: 'group-2a',
  title: 'Gerund Verbs',
  shortTitle: '5. Gerund Verbs',
  pattern: 'These verbs name an activity you do or experience — not mainly a future plan. After them, use -ing.',
  patternExample: 'I enjoy reading on the bus',
  colorClass: 'bg-sage-100 border-sage-300 text-sage-900',
  difficulty: 2,
  phase: 'core-verbs',
  prerequisite: null,
  memoryTrick: 'Name the activity → -ing.',
  bigPicture:
    'Some verbs talk about what you are doing or experiencing right now.\nAfter those verbs, English usually puts verb + -ing (the activity as a thing).',
  icon: '😊',
  patterns: [
    {
      id: 'verb-enjoy',
      trigger: 'enjoy',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'enjoy to read',
      examples: [
        { sentence: "I enjoy ___ books.", blank: 'reading', context: 'Hobbies' },
        { sentence: "She enjoys ___ in the park.", blank: 'walking', context: 'Exercise' },
        { sentence: "We enjoy ___ new recipes.", blank: 'trying', context: 'Cooking' },
        { sentence: "He enjoys ___ music.", blank: 'listening to', context: 'Hobbies' },
        { sentence: "I enjoy ___ with my friends.", blank: 'cooking', context: 'Social' },
        { sentence: "They enjoy ___ on weekends.", blank: 'hiking', context: 'Recreation' }
      ]
    },
    {
      id: 'verb-finish',
      trigger: 'finish',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'finish to write',
      examples: [
        { sentence: "I finished ___ the report.", blank: 'writing', context: 'Work' },
        { sentence: "Have you finished ___ the dishes?", blank: 'washing', context: 'Home' },
        { sentence: "She finished ___ the project.", blank: 'editing', context: 'Work' },
        { sentence: "He finished ___ his homework.", blank: 'doing', context: 'School' },
        { sentence: "We finished ___ at 9 PM.", blank: 'eating', context: 'Daily life' },
        { sentence: "I just finished ___ that book.", blank: 'reading', context: 'Hobbies' }
      ]
    },
    {
      id: 'verb-avoid',
      trigger: 'avoid',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "I avoid ___ sugar.", blank: 'eating', context: 'Health' },
        { sentence: "She avoids ___ late at night.", blank: 'driving', context: 'Safety' },
        { sentence: "Try to avoid ___ mistakes.", blank: 'making', context: 'Advice' },
        { sentence: "He avoids ___ about politics.", blank: 'talking', context: 'Social' },
        { sentence: "We avoid ___ in rush hour.", blank: 'traveling', context: 'Transportation' },
        { sentence: "I avoid ___ junk food.", blank: 'buying', context: 'Health' }
      ]
    },
    {
      id: 'verb-consider',
      trigger: 'consider',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "Have you considered ___ to a bigger apartment?", blank: 'moving', context: 'Housing' },
        { sentence: "I'm considering ___ a new job.", blank: 'finding', context: 'Career' },
        { sentence: "She's considering ___ nursing school.", blank: 'attending', context: 'Education' },
        { sentence: "We're considering ___ a vacation.", blank: 'taking', context: 'Travel' },
        { sentence: "He's considering ___ his car.", blank: 'selling', context: 'Decision' },
        { sentence: "I'm considering ___ a master's degree.", blank: 'pursuing', context: 'Education' }
      ]
    },
    {
      id: 'verb-suggest',
      trigger: 'suggest',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "I suggest ___ the train.", blank: 'taking', context: 'Travel' },
        { sentence: "She suggested ___ the museum.", blank: 'visiting', context: 'Social' },
        { sentence: "He suggested ___ early.", blank: 'leaving', context: 'Planning' },
        { sentence: "The doctor suggested ___ more exercise.", blank: 'getting', context: 'Health' },
        { sentence: "I suggest ___ a break.", blank: 'taking', context: 'Advice' },
        { sentence: "She suggested ___ Italian food.", blank: 'trying', context: 'Dining' }
      ]
    },
    {
      id: 'verb-keep',
      trigger: 'keep',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "Keep ___ hard!", blank: 'working', context: 'Encouragement' },
        { sentence: "She kept ___ the same thing.", blank: 'saying', context: 'Conversation' },
        { sentence: "Keep ___ your English.", blank: 'practicing', context: 'Learning' },
        { sentence: "Keep ___ left at the corner.", blank: 'turning', context: 'Directions' },
        { sentence: "He kept ___ his keys.", blank: 'losing', context: 'Frustration' },
        { sentence: "Keep ___ until you succeed.", blank: 'trying', context: 'Encouragement' }
      ]
    },
    {
      id: 'verb-quit',
      trigger: 'quit',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "He quit ___ last year.", blank: 'smoking', context: 'Health' },
        { sentence: "She quit ___ her old job.", blank: 'doing', context: 'Career' },
        { sentence: "I quit ___ so much coffee.", blank: 'drinking', context: 'Health' },
        { sentence: "They quit ___ to the gym.", blank: 'going', context: 'Exercise' },
        { sentence: "He quit ___ piano lessons.", blank: 'taking', context: 'Education' },
        { sentence: "I quit ___ fast food.", blank: 'eating', context: 'Health' }
      ]
    },
    {
      id: 'verb-miss',
      trigger: 'miss',
      correctForm: 'gerund',
      category: 'verb-gerund',
      examples: [
        { sentence: "I miss ___ time with my family.", blank: 'spending', context: 'Personal' },
        { sentence: "She misses ___ in her hometown.", blank: 'living', context: 'Nostalgia' },
        { sentence: "He misses ___ soccer with his friends.", blank: 'playing', context: 'Hobbies' },
        { sentence: "I miss ___ breakfast with you.", blank: 'having', context: 'Personal' },
        { sentence: "She misses ___ her old school.", blank: 'attending', context: 'Nostalgia' },
        { sentence: "We miss ___ movies together.", blank: 'watching', context: 'Social' }
      ]
    },
    // Personal Response Questions - Gerund verbs
    {
      id: 'personal-enjoy',
      trigger: 'enjoy',
      correctForm: 'gerund',
      category: 'verb-gerund',
      question: 'What do you enjoy doing after work or class?',
      patternHint: 'enjoy + gerund',
      exampleAnswer: 'I enjoy cooking dinner with my family',
      requiredPattern: /enjoy\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-avoid',
      trigger: 'avoid',
      correctForm: 'gerund',
      category: 'verb-gerund',
      question: 'What do you avoid doing at work because it wastes time?',
      patternHint: 'avoid + gerund',
      exampleAnswer: 'I avoid checking email during meetings',
      requiredPattern: /avoid\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-consider',
      trigger: 'consider',
      correctForm: 'gerund',
      category: 'verb-gerund',
      question: 'What major change are you considering making this year?',
      patternHint: 'consider + gerund',
      exampleAnswer: 'I\'m considering changing my schedule',
      requiredPattern: /consider\w*\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-keep',
      trigger: 'keep',
      correctForm: 'gerund',
      category: 'verb-gerund',
      question: 'What do you keep doing even when progress feels slow?',
      patternHint: 'keep + gerund',
      exampleAnswer: 'I keep practicing pronunciation every day',
      requiredPattern: /keep\s+\w+ing/i,
      examples: []
    },
    {
      id: 'personal-miss',
      trigger: 'miss',
      correctForm: 'gerund',
      category: 'verb-gerund',
      question: 'What do you miss doing with family or friends?',
      patternHint: 'miss + gerund',
      exampleAnswer: 'I miss eating dinner with my grandparents',
      requiredPattern: /miss\s+\w+ing/i,
      examples: []
    }
  ]
};

/**
 * GROUP 2B: INFINITIVE VERBS
 * Verbs that always take infinitive: want, hope, plan, decide, need, learn, offer, agree
 */
export const GROUP_2B: GerundInfinitiveGroup = {
  id: 'group-2b',
  title: 'Infinitive Verbs',
  shortTitle: '6. Infinitive Verbs',
  pattern: 'These verbs point to a goal, a decision, or what happens next. After them, use to + base verb.',
  patternExample: 'I want to finish my certificate',
  colorClass: 'bg-sky-100 border-sky-300 text-sky-900',
  difficulty: 2,
  phase: 'core-verbs',
  prerequisite: null,
  memoryTrick: 'Point to the next step → to + verb.',
  bigPicture:
    'Other verbs talk about what you want, plan, or decide to do next.\nAfter those verbs, English usually puts to + base verb (the goal or next action).',
  icon: '🎯',
  patterns: [
    {
      id: 'verb-want',
      trigger: 'want',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'want reading',
      examples: [
        { sentence: "I want ___ Spanish.", blank: 'to learn', context: 'Education' },
        { sentence: "She wants ___ Japan.", blank: 'to visit', context: 'Travel' },
        { sentence: "They want ___ a house.", blank: 'to buy', context: 'Life goals' },
        { sentence: "He wants ___ a doctor.", blank: 'to become', context: 'Career' },
        { sentence: "We want ___ you at the party.", blank: 'to see', context: 'Social' },
        { sentence: "I want ___ more exercise.", blank: 'to get', context: 'Health' }
      ]
    },
    {
      id: 'verb-hope',
      trigger: 'hope',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "I hope ___ you at the party.", blank: 'to see', context: 'Social' },
        { sentence: "She hopes ___ a good job.", blank: 'to find', context: 'Career' },
        { sentence: "We hope ___ soon.", blank: 'to hear', context: 'Communication' },
        { sentence: "He hopes ___ the exam.", blank: 'to pass', context: 'Education' },
        { sentence: "I hope ___ there on time.", blank: 'to get', context: 'General' },
        { sentence: "They hope ___ married next year.", blank: 'to get', context: 'Life events' }
      ]
    },
    {
      id: 'verb-plan',
      trigger: 'plan',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'plan studying',
      examples: [
        { sentence: "I plan ___ nursing next year.", blank: 'to study', context: 'Education' },
        { sentence: "She plans ___ next month.", blank: 'to move', context: 'Housing' },
        { sentence: "They plan ___ married in June.", blank: 'to get', context: 'Life events' },
        { sentence: "We plan ___ Europe this summer.", blank: 'to visit', context: 'Travel' },
        { sentence: "He plans ___ a new business.", blank: 'to start', context: 'Career' },
        { sentence: "I plan ___ early tomorrow.", blank: 'to leave', context: 'General' }
      ]
    },
    {
      id: 'verb-decide',
      trigger: 'decide',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "She decided ___ a new apartment.", blank: 'to rent', context: 'Housing' },
        { sentence: "I decided ___ early.", blank: 'to leave', context: 'Decision' },
        { sentence: "He decided ___ the job offer.", blank: 'to accept', context: 'Career' },
        { sentence: "We decided ___ Spanish.", blank: 'to learn', context: 'Education' },
        { sentence: "She decided ___ a new car.", blank: 'to buy', context: 'Decision' },
        { sentence: "They decided ___ the meeting.", blank: 'to postpone', context: 'Work' }
      ]
    },
    {
      id: 'verb-need',
      trigger: 'need',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'need practicing',
      examples: [
        { sentence: "I need ___ my English.", blank: 'to practice', context: 'Learning' },
        { sentence: "She needs ___ early today.", blank: 'to leave', context: 'Work' },
        { sentence: "You need ___ more water.", blank: 'to drink', context: 'Health' },
        { sentence: "He needs ___ a break.", blank: 'to take', context: 'Work' },
        { sentence: "We need ___ the report by Friday.", blank: 'to finish', context: 'Work' },
        { sentence: "I need ___ some sleep.", blank: 'to get', context: 'Health' }
      ]
    },
    {
      id: 'verb-learn',
      trigger: 'learn',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "I'm learning ___ a car.", blank: 'to drive', context: 'Skills' },
        { sentence: "She learned ___ when she was young.", blank: 'to swim', context: 'Skills' },
        { sentence: "He's learning ___ French.", blank: 'to speak', context: 'Language' },
        { sentence: "We're learning ___ with stress.", blank: 'to cope', context: 'Life skills' },
        { sentence: "I learned ___ chess last year.", blank: 'to play', context: 'Hobbies' },
        { sentence: "She's learning ___ a guitar.", blank: 'to play', context: 'Music' }
      ]
    },
    {
      id: 'verb-offer',
      trigger: 'offer',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "She offered ___ me.", blank: 'to help', context: 'Kindness' },
        { sentence: "He offered ___ me to the station.", blank: 'to drive', context: 'Help' },
        { sentence: "They offered ___ for dinner.", blank: 'to pay', context: 'Social' },
        { sentence: "I offered ___ the presentation.", blank: 'to give', context: 'Work' },
        { sentence: "She offered ___ her notes.", blank: 'to share', context: 'Education' },
        { sentence: "He offered ___ me a ride.", blank: 'to give', context: 'Kindness' }
      ]
    },
    {
      id: 'verb-agree',
      trigger: 'agree',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "She agreed ___ us.", blank: 'to help', context: 'Cooperation' },
        { sentence: "They agreed ___ the project together.", blank: 'to work on', context: 'Work' },
        { sentence: "He agreed ___ the terms.", blank: 'to accept', context: 'Business' },
        { sentence: "I agreed ___ early.", blank: 'to meet', context: 'Planning' },
        { sentence: "We agreed ___ the price.", blank: 'to reduce', context: 'Business' },
        { sentence: "She agreed ___ the proposal.", blank: 'to consider', context: 'Work' }
      ]
    },
    {
      id: 'verb-refuse',
      trigger: 'refuse',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      examples: [
        { sentence: "She refused ___ the question.", blank: 'to answer', context: 'Conversation' },
        { sentence: "He refused ___ overtime.", blank: 'to work', context: 'Work' },
        { sentence: "They refused ___ the deal.", blank: 'to accept', context: 'Business' },
        { sentence: "I refused ___ in the rain.", blank: 'to go', context: 'Decision' },
        { sentence: "She refused ___ help.", blank: 'to accept', context: 'Independence' },
        { sentence: "He refused ___ the invitation.", blank: 'to accept', context: 'Social' }
      ]
    },
    // Personal Response Questions - Infinitive verbs
    {
      id: 'personal-want',
      trigger: 'want',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What do you want to improve this year?',
      patternHint: 'want + to + verb',
      exampleAnswer: 'I want to improve my workplace English',
      requiredPattern: /want\s+to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-hope',
      trigger: 'hope',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What do you hope to do after you finish this course?',
      patternHint: 'hope + to + verb',
      exampleAnswer: 'I hope to apply for a better job',
      requiredPattern: /hope\s+to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-plan',
      trigger: 'plan',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What do you plan to do for yourself this week?',
      patternHint: 'plan + to + verb',
      exampleAnswer: 'I plan to update my resume',
      requiredPattern: /plan\s+to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-need',
      trigger: 'need',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What do you need to finish before tonight?',
      patternHint: 'need + to + verb',
      exampleAnswer: 'I need to send two work emails',
      requiredPattern: /need\s+to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-learn',
      trigger: 'learn',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What skill would you like to learn to do better?',
      patternHint: 'learn + to + verb',
      exampleAnswer: 'I would like to learn to speak more confidently',
      requiredPattern: /learn\s+to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-decide',
      trigger: 'decide',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      question: 'What did you recently decide to change?',
      patternHint: 'decide + to + verb',
      exampleAnswer: 'I decided to start going to bed earlier',
      requiredPattern: /decide\w*\s+to\s+\w+/i,
      examples: []
    }
  ]
};

/**
 * GROUP 2C: MIXED VERB CHALLENGE (Core Verbs)
 * Students choose gerund vs infinitive from the main verb before the blank.
 * Mixes patterns from GROUP_2A and GROUP_2B to create contrast.
 */
export const GROUP_2C: GerundInfinitiveGroup = {
  id: 'group-2c',
  title: 'Mixed Verb Challenge',
  shortTitle: '7. Mixed Verbs',
  pattern: 'Look at the main verb before the blank. Activity-style verbs take -ing; goal-style verbs take to + verb.',
  patternExample: 'I enjoy cooking, but I plan to cook less on weekdays',
  colorClass: 'bg-purple-100 border-purple-300 text-purple-900',
  difficulty: 2,
  phase: 'core-verbs',
  prerequisite: null,
  memoryTrick: 'Find the verb before ___. That verb picks the form.',
  bigPicture:
    'Here the same exercise mixes both kinds of verbs.\nDo not guess the ending—look at the verb right before the blank; it tells you -ing or to + verb.',
  icon: '🔀',
  patterns: [
    // Gerund verbs mixed in
    {
      id: 'mix-enjoy',
      trigger: 'enjoy',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'enjoy to read',
      memoryTrick: 'Enjoy the moment = -ing',
      examples: [
        { sentence: "I enjoy ___ on weekends.", blank: 'relaxing', context: 'Hobbies' },
        { sentence: "She enjoys ___ new cultures.", blank: 'learning about', context: 'Travel' },
        { sentence: "We enjoy ___ dinner together.", blank: 'having', context: 'Family' },
        { sentence: "He enjoys ___ early.", blank: 'waking up', context: 'Morning person' },
        { sentence: "They enjoy ___ board games.", blank: 'playing', context: 'Entertainment' },
        { sentence: "I enjoy ___ to podcasts.", blank: 'listening', context: 'Commute' }
      ]
    },
    {
      id: 'mix-want',
      trigger: 'want',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'want reading',
      memoryTrick: 'Want points to the future = to + verb',
      examples: [
        { sentence: "I want ___ a new language.", blank: 'to learn', context: 'Goals' },
        { sentence: "She wants ___ her own business.", blank: 'to start', context: 'Career' },
        { sentence: "We want ___ the world.", blank: 'to see', context: 'Travel' },
        { sentence: "He wants ___ a doctor.", blank: 'to become', context: 'Career' },
        { sentence: "They want ___ a house.", blank: 'to buy', context: 'Life goals' },
        { sentence: "I want ___ healthier.", blank: 'to eat', context: 'Health' }
      ]
    },
    {
      id: 'mix-finish',
      trigger: 'finish',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'finish to write',
      memoryTrick: 'Finish what you were doing = -ing',
      examples: [
        { sentence: "I need to finish ___ this email.", blank: 'writing', context: 'Work' },
        { sentence: "She finished ___ the dishes.", blank: 'washing', context: 'Home' },
        { sentence: "Have you finished ___ that book?", blank: 'reading', context: 'Books' },
        { sentence: "We finished ___ the project.", blank: 'working on', context: 'Work' },
        { sentence: "He finished ___ his coffee.", blank: 'drinking', context: 'Morning' },
        { sentence: "I just finished ___.", blank: 'eating', context: 'Meal' }
      ]
    },
    {
      id: 'mix-decide',
      trigger: 'decide',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'decide leaving',
      memoryTrick: 'Decide what TO do next = to + verb',
      examples: [
        { sentence: "I decided ___ early today.", blank: 'to leave', context: 'Decision' },
        { sentence: "She decided ___ the job offer.", blank: 'to accept', context: 'Career' },
        { sentence: "We decided ___ at home.", blank: 'to stay', context: 'Plans' },
        { sentence: "He decided ___ a new car.", blank: 'to buy', context: 'Purchase' },
        { sentence: "They decided ___ to Spain.", blank: 'to move', context: 'Life change' },
        { sentence: "I decided ___ cooking classes.", blank: 'to take', context: 'Learning' }
      ]
    },
    {
      id: 'mix-avoid',
      trigger: 'avoid',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'avoid to make',
      memoryTrick: 'Avoid what\'s happening = -ing',
      examples: [
        { sentence: "Try to avoid ___ mistakes.", blank: 'making', context: 'Advice' },
        { sentence: "I avoid ___ late at night.", blank: 'eating', context: 'Health' },
        { sentence: "She avoids ___ about politics.", blank: 'talking', context: 'Social' },
        { sentence: "We avoid ___ in rush hour.", blank: 'driving', context: 'Commute' },
        { sentence: "He avoids ___ caffeine.", blank: 'drinking', context: 'Health' },
        { sentence: "They avoid ___ on weekdays.", blank: 'going out', context: 'Routine' }
      ]
    },
    {
      id: 'mix-hope',
      trigger: 'hope',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'hope seeing',
      memoryTrick: 'Hope for the future = to + verb',
      examples: [
        { sentence: "I hope ___ you at the party.", blank: 'to see', context: 'Social' },
        { sentence: "She hopes ___ a good job.", blank: 'to find', context: 'Career' },
        { sentence: "We hope ___ the exam.", blank: 'to pass', context: 'School' },
        { sentence: "He hopes ___ abroad someday.", blank: 'to travel', context: 'Dreams' },
        { sentence: "They hope ___ married next year.", blank: 'to get', context: 'Life' },
        { sentence: "I hope ___ better soon.", blank: 'to feel', context: 'Health' }
      ]
    },
    {
      id: 'mix-consider',
      trigger: 'consider',
      correctForm: 'gerund',
      category: 'verb-gerund',
      commonError: 'consider to move',
      memoryTrick: 'Consider what you\'re thinking about = -ing',
      examples: [
        { sentence: "Have you considered ___ abroad?", blank: 'studying', context: 'Education' },
        { sentence: "I'm considering ___ jobs.", blank: 'changing', context: 'Career' },
        { sentence: "She's considering ___ to Canada.", blank: 'moving', context: 'Life change' },
        { sentence: "We're considering ___ a pet.", blank: 'getting', context: 'Family' },
        { sentence: "He's considering ___ his own business.", blank: 'starting', context: 'Entrepreneurship' },
        { sentence: "They're considering ___ the house.", blank: 'selling', context: 'Real estate' }
      ]
    },
    {
      id: 'mix-plan',
      trigger: 'plan',
      correctForm: 'infinitive',
      category: 'verb-infinitive',
      commonError: 'plan studying',
      memoryTrick: 'Plan for what\'s TO come = to + verb',
      examples: [
        { sentence: "I plan ___ medicine.", blank: 'to study', context: 'Education' },
        { sentence: "She plans ___ her parents.", blank: 'to visit', context: 'Family' },
        { sentence: "We plan ___ a vacation.", blank: 'to take', context: 'Travel' },
        { sentence: "He plans ___ at 7 AM.", blank: 'to arrive', context: 'Schedule' },
        { sentence: "They plan ___ married in June.", blank: 'to get', context: 'Wedding' },
        { sentence: "I plan ___ a marathon next year.", blank: 'to run', context: 'Fitness' }
      ]
    }
  ]
};

/**
 * GROUP 3A: ADJECTIVE + INFINITIVE
 * Adjectives followed by infinitive: happy, ready, important, easy, difficult
 */
export const GROUP_3A: GerundInfinitiveGroup = {
  id: 'group-3a',
  title: 'Adjective + Infinitive',
  shortTitle: '13. Adjective + Infinitive',
  pattern: 'After many adjectives (happy, ready, easy, important…), the next verb is to + base verb.',
  patternExample: "I'm ready to start the interview",
  colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'How you feel or what is next → often to + verb.',
  bigPicture:
    'Many feeling and state adjectives are followed by to + base verb: what you are willing, ready, or able to do next.\nThis level focuses on that adjective + to pattern.',
  icon: '😃',
  patterns: [
    {
      id: 'adj-happy',
      trigger: 'happy',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "I'm happy ___ you.", blank: 'to help', context: 'Polite' },
        { sentence: "She's happy ___ here.", blank: 'to be', context: 'Workplace' },
        { sentence: "We're happy ___ you.", blank: 'to meet', context: 'Introduction' },
        { sentence: "He's happy ___ the news.", blank: 'to hear', context: 'General' },
        { sentence: "I'm happy ___ you again.", blank: 'to see', context: 'Greeting' },
        { sentence: "They're happy ___ with the result.", blank: 'to be', context: 'General' }
      ]
    },
    {
      id: 'adj-ready',
      trigger: 'ready',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "I'm ready ___ now.", blank: 'to go', context: 'General' },
        { sentence: "She's ready ___ the test.", blank: 'to take', context: 'Education' },
        { sentence: "Are you ready ___ dinner?", blank: 'to eat', context: 'Home' },
        { sentence: "We're ready ___ the project.", blank: 'to start', context: 'Work' },
        { sentence: "He's ready ___ a decision.", blank: 'to make', context: 'Decision' },
        { sentence: "Are you ready ___?", blank: 'to order', context: 'Restaurant' }
      ]
    },
    {
      id: 'adj-important',
      trigger: 'important',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "It's important ___ on time.", blank: 'to arrive', context: 'Work' },
        { sentence: "It's important ___ regularly.", blank: 'to exercise', context: 'Health' },
        { sentence: "It's important ___ enough sleep.", blank: 'to get', context: 'Health' },
        { sentence: "It's important ___ honest.", blank: 'to be', context: 'Values' },
        { sentence: "It's important ___ before the deadline.", blank: 'to finish', context: 'Work' },
        { sentence: "It's important ___ from mistakes.", blank: 'to learn', context: 'Growth' }
      ]
    },
    {
      id: 'adj-easy',
      trigger: 'easy',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "This book is easy ___.", blank: 'to read', context: 'Education' },
        { sentence: "The recipe is easy ___.", blank: 'to follow', context: 'Cooking' },
        { sentence: "English is easy ___.", blank: 'to learn', context: 'Language' },
        { sentence: "The app is easy ___.", blank: 'to use', context: 'Tech' },
        { sentence: "The directions are easy ___.", blank: 'to follow', context: 'General' },
        { sentence: "This song is easy ___.", blank: 'to sing', context: 'Music' }
      ]
    },
    {
      id: 'adj-difficult',
      trigger: 'difficult',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "This problem is difficult ___.", blank: 'to solve', context: 'Work' },
        { sentence: "The instructions are difficult ___.", blank: 'to understand', context: 'General' },
        { sentence: "That song is difficult ___.", blank: 'to sing', context: 'Music' },
        { sentence: "The test was difficult ___.", blank: 'to pass', context: 'Education' },
        { sentence: "It's difficult ___ in a new country.", blank: 'to live', context: 'Life' },
        { sentence: "This word is difficult ___.", blank: 'to pronounce', context: 'Language' }
      ]
    },
    {
      id: 'adj-afraid',
      trigger: 'afraid',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "I'm afraid ___ heights.", blank: 'to climb', context: 'Fears' },
        { sentence: "She's afraid ___ alone.", blank: 'to travel', context: 'Travel' },
        { sentence: "He was afraid ___ the truth.", blank: 'to tell', context: 'Communication' },
        { sentence: "I'm afraid ___ wrong.", blank: 'to be', context: 'Uncertainty' },
        { sentence: "She's afraid ___ in public.", blank: 'to speak', context: 'Nervousness' },
        { sentence: "He's afraid ___ his job.", blank: 'to lose', context: 'Career' }
      ]
    },
    {
      id: 'adj-excited',
      trigger: 'excited',
      correctForm: 'infinitive',
      category: 'adjective',
      examples: [
        { sentence: "I'm excited ___ you.", blank: 'to see', context: 'Greeting' },
        { sentence: "She's excited ___ her new job.", blank: 'to start', context: 'Career' },
        { sentence: "We're excited ___ to Paris.", blank: 'to travel', context: 'Travel' },
        { sentence: "He's excited ___ the results.", blank: 'to share', context: 'Work' },
        { sentence: "I'm excited ___ the concert.", blank: 'to attend', context: 'Entertainment' },
        { sentence: "They're excited ___ the project.", blank: 'to begin', context: 'Work' }
      ]
    }
  ]
};

/**
 * GROUP 3B: NOUN + INFINITIVE
 * Nouns followed by infinitive: ability, chance, time, decision
 */
export const GROUP_3B: GerundInfinitiveGroup = {
  id: 'group-3b',
  title: 'Noun + Infinitive',
  shortTitle: '14. Noun + Infinitive',
  pattern: 'Nouns like chance, time, ability, and decision are often followed by to + verb.',
  patternExample: 'the chance to apply this month',
  colorClass: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Opportunity or next step → to + verb.',
  bigPicture:
    'Words like chance, time, way, and ability often introduce what could happen or what to do next.\nEnglish usually uses to + verb for that next step or possibility.',
  icon: '📋',
  patterns: [
    {
      id: 'noun-ability',
      trigger: 'ability',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "I have the ability ___ three languages.", blank: 'to speak', context: 'Job interview' },
        { sentence: "She has the ability ___ under pressure.", blank: 'to work', context: 'Work' },
        { sentence: "He has the ability ___ people.", blank: 'to lead', context: 'Leadership' },
        { sentence: "She has the ability ___ quickly.", blank: 'to adapt', context: 'Skills' },
        { sentence: "He has the ability ___ complex problems.", blank: 'to solve', context: 'Work' },
        { sentence: "I have the ability ___ with different cultures.", blank: 'to communicate', context: 'Skills' }
      ]
    },
    {
      id: 'noun-chance',
      trigger: 'chance',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "This is your chance ___ something new.", blank: 'to learn', context: 'Opportunity' },
        { sentence: "I didn't have a chance ___ goodbye.", blank: 'to say', context: 'Social' },
        { sentence: "She got a chance ___ abroad.", blank: 'to study', context: 'Education' },
        { sentence: "It's a great chance ___ your skills.", blank: 'to improve', context: 'Career' },
        { sentence: "I never had a chance ___ her.", blank: 'to meet', context: 'Social' },
        { sentence: "This is your chance ___ a difference.", blank: 'to make', context: 'Opportunity' }
      ]
    },
    {
      id: 'noun-time',
      trigger: 'time',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "I don't have time ___ today.", blank: 'to cook', context: 'Daily life' },
        { sentence: "It's time ___ now.", blank: 'to go', context: 'General' },
        { sentence: "Do you have time ___ me?", blank: 'to help', context: 'Request' },
        { sentence: "I need time ___ a decision.", blank: 'to make', context: 'Decision' },
        { sentence: "There's no time ___ this again.", blank: 'to explain', context: 'Urgency' },
        { sentence: "Do you have time ___ lunch?", blank: 'to have', context: 'Social' }
      ]
    },
    {
      id: 'noun-decision',
      trigger: 'decision',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "She made the decision ___ back to school.", blank: 'to go', context: 'Education' },
        { sentence: "His decision ___ was final.", blank: 'to leave', context: 'Decision' },
        { sentence: "It was a difficult decision ___.", blank: 'to make', context: 'General' },
        { sentence: "The decision ___ was unanimous.", blank: 'to proceed', context: 'Work' },
        { sentence: "I made the decision ___ my job.", blank: 'to quit', context: 'Career' },
        { sentence: "Their decision ___ the project surprised everyone.", blank: 'to cancel', context: 'Work' }
      ]
    },
    {
      id: 'noun-opportunity',
      trigger: 'opportunity',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "I had the opportunity ___ the CEO.", blank: 'to meet', context: 'Career' },
        { sentence: "This is a great opportunity ___.", blank: 'to grow', context: 'Career' },
        { sentence: "She missed the opportunity ___ for the scholarship.", blank: 'to apply', context: 'Education' },
        { sentence: "He had the opportunity ___ abroad.", blank: 'to work', context: 'Career' },
        { sentence: "This is your opportunity ___.", blank: 'to shine', context: 'Encouragement' },
        { sentence: "We have the opportunity ___ something new.", blank: 'to try', context: 'General' }
      ]
    },
    {
      id: 'noun-way',
      trigger: 'way',
      correctForm: 'infinitive',
      category: 'noun',
      examples: [
        { sentence: "That's the best way ___ the problem.", blank: 'to solve', context: 'Problem-solving' },
        { sentence: "There's no way ___ it in one day.", blank: 'to finish', context: 'Work' },
        { sentence: "What's the best way ___ Spanish?", blank: 'to learn', context: 'Education' },
        { sentence: "The best way ___ is to practice daily.", blank: 'to improve', context: 'Learning' },
        { sentence: "There's no way ___ this mistake.", blank: 'to fix', context: 'Problem' },
        { sentence: "What's the easiest way ___ there?", blank: 'to get', context: 'Directions' }
      ]
    }
  ]
};

/**
 * GROUP 3C: PURPOSE INFINITIVES
 * Using infinitive to express purpose or reason
 */
export const GROUP_3C: GerundInfinitiveGroup = {
  id: 'group-3c',
  title: 'Purpose: Why? To...',
  shortTitle: '15. Purpose: To...',
  pattern: 'Answer why with to + verb. Same idea as purpose: reason for the action.',
  patternExample: 'I take the bus to save money',
  colorClass: 'bg-violet-100 border-violet-300 text-violet-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Say the reason in one chunk: to + verb.',
  bigPicture:
    'When you say why someone does something, English often uses to + base verb for the reason or goal.\nWhy? → to + verb.',
  icon: '🎯',
  patterns: [
    {
      id: 'purpose-study',
      trigger: 'study',
      correctForm: 'infinitive',
      category: 'purpose',
      examples: [
        { sentence: "I study English ___ my career.", blank: 'to advance', context: 'Education' },
        { sentence: "She studies hard ___ good grades.", blank: 'to get', context: 'School' },
        { sentence: "We study ___ more about the world.", blank: 'to learn', context: 'Education' },
        { sentence: "He studied all night ___ the test.", blank: 'to pass', context: 'School' },
        { sentence: "I'm studying Spanish ___ with clients.", blank: 'to communicate', context: 'Work' },
        { sentence: "She studies medicine ___ a doctor.", blank: 'to become', context: 'Career' }
      ]
    },
    {
      id: 'purpose-save',
      trigger: 'save money',
      correctForm: 'infinitive',
      category: 'purpose',
      examples: [
        { sentence: "I'm saving money ___ a house.", blank: 'to buy', context: 'Life goals' },
        { sentence: "She saved money ___ college.", blank: 'to pay for', context: 'Education' },
        { sentence: "We're saving money ___ to Europe.", blank: 'to travel', context: 'Travel' },
        { sentence: "He saves money ___ emergencies.", blank: 'to prepare for', context: 'Planning' },
        { sentence: "They saved money ___ their own business.", blank: 'to start', context: 'Career' },
        { sentence: "I save money every month ___ my future.", blank: 'to invest in', context: 'Finance' }
      ]
    },
    {
      id: 'purpose-come-go',
      trigger: 'came/went',
      correctForm: 'infinitive',
      category: 'purpose',
      examples: [
        { sentence: "I came here ___ you.", blank: 'to see', context: 'Social' },
        { sentence: "She went to the store ___ milk.", blank: 'to buy', context: 'Daily life' },
        { sentence: "We came here ___ English.", blank: 'to learn', context: 'Education' },
        { sentence: "He went to the gym ___ out.", blank: 'to work', context: 'Exercise' },
        { sentence: "They came to America ___ a better life.", blank: 'to find', context: 'Immigration' },
        { sentence: "I went to the library ___ in quiet.", blank: 'to study', context: 'School' }
      ]
    },
    {
      id: 'purpose-work',
      trigger: 'work',
      correctForm: 'infinitive',
      category: 'purpose',
      examples: [
        { sentence: "I work hard ___ my family.", blank: 'to support', context: 'Work' },
        { sentence: "She works two jobs ___ ends meet.", blank: 'to make', context: 'Finance' },
        { sentence: "We work together ___ goals.", blank: 'to achieve', context: 'Teamwork' },
        { sentence: "He's working extra hours ___ a promotion.", blank: 'to earn', context: 'Career' },
        { sentence: "I work every day ___ my bills.", blank: 'to pay', context: 'Life' },
        { sentence: "She works at night ___ care of her kids during the day.", blank: 'to take', context: 'Family' }
      ]
    },
    {
      id: 'purpose-use',
      trigger: 'use',
      correctForm: 'infinitive',
      category: 'purpose',
      examples: [
        { sentence: "I use this app ___ vocabulary.", blank: 'to practice', context: 'Learning' },
        { sentence: "She uses a calendar ___ track of appointments.", blank: 'to keep', context: 'Organization' },
        { sentence: "We use email ___ with colleagues.", blank: 'to communicate', context: 'Work' },
        { sentence: "He uses a knife ___ vegetables.", blank: 'to cut', context: 'Cooking' },
        { sentence: "They use social media ___ customers.", blank: 'to reach', context: 'Business' },
        { sentence: "I use this tool ___ problems.", blank: 'to solve', context: 'Work' }
      ]
    },
    {
      id: 'purpose-in-order-to',
      trigger: 'in order to',
      correctForm: 'infinitive',
      category: 'purpose',
      memoryTrick: '"In order to" = formal way to show purpose (same as "to")',
      examples: [
        { sentence: "I wake up early in order ___ on time.", blank: 'to arrive', context: 'Work' },
        { sentence: "She practiced every day in order ___ fluent.", blank: 'to become', context: 'Learning' },
        { sentence: "We left early in order ___ traffic.", blank: 'to avoid', context: 'Transportation' },
        { sentence: "He studied hard in order ___ the exam.", blank: 'to pass', context: 'School' },
        { sentence: "They moved to the city in order ___ better jobs.", blank: 'to find', context: 'Career' },
        { sentence: "I'm calling in order ___ an appointment.", blank: 'to make', context: 'General' }
      ]
    },
    // Personal Response Questions - Purpose
    {
      id: 'personal-purpose-city',
      trigger: 'purpose',
      correctForm: 'infinitive',
      category: 'purpose',
      question: 'Why do people in your area use public transportation?',
      patternHint: 'to + verb',
      exampleAnswer: 'People use it to save money',
      requiredPattern: /to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-purpose-english',
      trigger: 'purpose',
      correctForm: 'infinitive',
      category: 'purpose',
      question: 'Why are you learning English right now?',
      patternHint: 'to + verb',
      exampleAnswer: 'I\'m learning English to communicate better at work',
      requiredPattern: /to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-purpose-save',
      trigger: 'purpose',
      correctForm: 'infinitive',
      category: 'purpose',
      question: 'Why do people keep a calendar or reminder app?',
      patternHint: 'to + verb',
      exampleAnswer: 'They use it to remember appointments',
      requiredPattern: /to\s+\w+/i,
      examples: []
    },
    {
      id: 'personal-purpose-technology',
      trigger: 'purpose',
      correctForm: 'infinitive',
      category: 'purpose',
      question: 'Why do you use your phone most often during the day?',
      patternHint: 'to + verb',
      exampleAnswer: 'I use my phone to check messages from work',
      requiredPattern: /to\s+\w+/i,
      examples: []
    }
  ]
};

/**
 * GROUP 4: GO + GERUND
 * Recreational activities with "go": go swimming, go shopping, go hiking
 * MOVED EARLY: Very intuitive daily-life pattern!
 */
export const GROUP_4: GerundInfinitiveGroup = {
  id: 'group-4',
  title: 'GO + Gerund',
  shortTitle: '4. Go + Gerund',
  pattern: 'For everyday activities, say go shopping, go swimming — go + -ing. Avoid go to swim for these.',
  patternExample: 'We go shopping on Saturday mornings',
  colorClass: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  difficulty: 1,
  phase: 'foundation',
  prerequisite: null,
  memoryTrick: 'go + fun activity = go + -ing.',
  bigPicture:
    'For common free-time activities, English usually says go + -ing (go swimming), not go to swim.\nIt is a fixed, everyday habit—learn the chunk.',
  icon: '🏃',
  patterns: [
    {
      id: 'go-swimming',
      trigger: 'go swimming',
      correctForm: 'gerund',
      category: 'go-activity',
      commonError: 'go to swim',
      examples: [
        { sentence: "Let's go ___ at the pool.", blank: 'swimming', context: 'Recreation' },
        { sentence: "We went ___ in the ocean.", blank: 'swimming', context: 'Vacation' },
        { sentence: "Do you want to go ___?", blank: 'swimming', context: 'Invitation' },
        { sentence: "I love to go ___ in the summer.", blank: 'swimming', context: 'Hobbies' },
        { sentence: "They went ___ every day on vacation.", blank: 'swimming', context: 'Travel' },
        { sentence: "She wants to go ___ this weekend.", blank: 'swimming', context: 'Weekend' }
      ]
    },
    {
      id: 'go-shopping',
      trigger: 'go shopping',
      correctForm: 'gerund',
      category: 'go-activity',
      commonError: 'go to shop',
      examples: [
        { sentence: "I need to go ___ for groceries.", blank: 'shopping', context: 'Daily life' },
        { sentence: "Let's go ___ this weekend.", blank: 'shopping', context: 'Social' },
        { sentence: "She went ___ for new clothes.", blank: 'shopping', context: 'Shopping' },
        { sentence: "We're going ___ for furniture.", blank: 'shopping', context: 'Home' },
        { sentence: "Do you want to go ___ with me?", blank: 'shopping', context: 'Invitation' },
        { sentence: "He hates going ___ for clothes.", blank: 'shopping', context: 'Preferences' }
      ]
    },
    {
      id: 'go-hiking',
      trigger: 'go hiking',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "We're going ___ in the mountains.", blank: 'hiking', context: 'Outdoor' },
        { sentence: "Do you want to go ___ tomorrow?", blank: 'hiking', context: 'Invitation' },
        { sentence: "They went ___ last weekend.", blank: 'hiking', context: 'Weekend' },
        { sentence: "I go ___ every month.", blank: 'hiking', context: 'Hobby' },
        { sentence: "Let's go ___ this trail.", blank: 'hiking', context: 'Outdoor' },
        { sentence: "She loves going ___ with her dog.", blank: 'hiking', context: 'Hobbies' }
      ]
    },
    {
      id: 'go-fishing',
      trigger: 'go fishing',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "My dad and I go ___ every summer.", blank: 'fishing', context: 'Family' },
        { sentence: "Let's go ___ at the lake.", blank: 'fishing', context: 'Outdoor' },
        { sentence: "He went ___ early this morning.", blank: 'fishing', context: 'Activity' }
      ]
    },
    {
      id: 'go-running',
      trigger: 'go running',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "I go ___ every morning.", blank: 'running', context: 'Exercise' },
        { sentence: "Want to go ___ with me?", blank: 'running', context: 'Invitation' },
        { sentence: "She went ___ in the park.", blank: 'running', context: 'Exercise' },
        { sentence: "He went ___ before work.", blank: 'running', context: 'Routine' },
        { sentence: "Let's go ___ together.", blank: 'running', context: 'Social' },
        { sentence: "They go ___ three times a week.", blank: 'running', context: 'Fitness' }
      ]
    },
    {
      id: 'go-dancing',
      trigger: 'go dancing',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "Let's go ___ tonight!", blank: 'dancing', context: 'Social' },
        { sentence: "We went ___ on Saturday.", blank: 'dancing', context: 'Weekend' },
        { sentence: "Do you like going ___?", blank: 'dancing', context: 'Hobbies' }
      ]
    },
    {
      id: 'go-camping',
      trigger: 'go camping',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "We're going ___ this summer.", blank: 'camping', context: 'Vacation' },
        { sentence: "Have you ever gone ___?", blank: 'camping', context: 'Experience' },
        { sentence: "Let's go ___ in the mountains.", blank: 'camping', context: 'Outdoor' }
      ]
    },
    {
      id: 'go-walking',
      trigger: 'go walking',
      correctForm: 'gerund',
      category: 'go-activity',
      examples: [
        { sentence: "We go ___ every evening.", blank: 'walking', context: 'Exercise' },
        { sentence: "Have you ever gone ___ in the park?", blank: 'walking', context: 'Experience' },
        { sentence: "Let's go ___ after dinner.", blank: 'walking', context: 'Activity' }
      ]
    }
  ]
};

/**
 * GROUP 5: SUBJECT = GERUND
 * When the verb is the subject of the sentence
 * MOVED EARLY: This is intuitive and builds confidence!
 */
export const GROUP_5: GerundInfinitiveGroup = {
  id: 'group-5',
  title: 'Subject = Gerund',
  shortTitle: '3. Subject Gerunds',
  pattern: 'When the action is the subject, start with verb + -ing. It names the activity like a noun.',
  patternExample: 'Learning English takes patience',
  colorClass: 'bg-purple-100 border-purple-300 text-purple-900',
  difficulty: 1,
  phase: 'foundation',
  prerequisite: null,
  memoryTrick: 'Action in the subject slot → gerund.',
  bigPicture:
    'The subject slot needs something noun-like; a gerund names the action so it can go first.\nSame -ing idea as the gerund intro—now at the front of the sentence.',
  icon: '🔤',
  patterns: [
    {
      id: 'subj-swimming',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ is excellent exercise.", blank: 'Swimming', context: 'Exercise' },
        { sentence: "___ is my favorite hobby.", blank: 'Swimming', context: 'Hobbies' },
        { sentence: "___ in the ocean is refreshing.", blank: 'Swimming', context: 'Recreation' },
        { sentence: "___ helps me relax.", blank: 'Swimming', context: 'Wellness' },
        { sentence: "___ laps every day builds endurance.", blank: 'Swimming', context: 'Fitness' },
        { sentence: "___ before breakfast energizes me.", blank: 'Swimming', context: 'Routine' }
      ]
    },
    {
      id: 'subj-learning',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ a new language takes time.", blank: 'Learning', context: 'Education' },
        { sentence: "___ English is important for my career.", blank: 'Learning', context: 'Career' },
        { sentence: "___ from mistakes is valuable.", blank: 'Learning', context: 'Life lesson' },
        { sentence: "___ new skills keeps you competitive.", blank: 'Learning', context: 'Career' },
        { sentence: "___ to cook saves money.", blank: 'Learning', context: 'Daily life' },
        { sentence: "___ never stops.", blank: 'Learning', context: 'Philosophy' }
      ]
    },
    {
      id: 'subj-cooking',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ at home saves money.", blank: 'Cooking', context: 'Daily life' },
        { sentence: "___ is relaxing for me.", blank: 'Cooking', context: 'Hobbies' },
        { sentence: "___ healthy meals is important.", blank: 'Cooking', context: 'Health' },
        { sentence: "___ together brings families closer.", blank: 'Cooking', context: 'Social' },
        { sentence: "___ from scratch takes more time.", blank: 'Cooking', context: 'Daily life' },
        { sentence: "___ new recipes is fun.", blank: 'Trying', context: 'Cooking' }
      ]
    },
    {
      id: 'subj-reading',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ is a great way to learn.", blank: 'Reading', context: 'Education' },
        { sentence: "___ before bed helps me sleep.", blank: 'Reading', context: 'Daily life' },
        { sentence: "___ in English improves vocabulary.", blank: 'Reading', context: 'Language' },
        { sentence: "___ opens new worlds.", blank: 'Reading', context: 'General' },
        { sentence: "___ daily expands your knowledge.", blank: 'Reading', context: 'Education' },
        { sentence: "___ for pleasure reduces stress.", blank: 'Reading', context: 'Wellness' }
      ]
    },
    {
      id: 'subj-working',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ from home has many benefits.", blank: 'Working', context: 'Work' },
        { sentence: "___ long hours is exhausting.", blank: 'Working', context: 'Work' },
        { sentence: "___ in a team requires communication.", blank: 'Working', context: 'Work' },
        { sentence: "___ overtime pays extra.", blank: 'Working', context: 'Job' },
        { sentence: "___ abroad was a great experience.", blank: 'Working', context: 'Career' },
        { sentence: "___ part-time allows flexibility.", blank: 'Working', context: 'Lifestyle' }
      ]
    },
    {
      id: 'subj-traveling',
      trigger: 'subject position',
      correctForm: 'gerund',
      category: 'subject',
      examples: [
        { sentence: "___ broadens the mind.", blank: 'Traveling', context: 'Life' },
        { sentence: "___ alone can be challenging.", blank: 'Traveling', context: 'Travel' },
        { sentence: "___ is my dream.", blank: 'Traveling', context: 'Goals' },
        { sentence: "___ light makes trips easier.", blank: 'Traveling', context: 'Practical' },
        { sentence: "___ by train is relaxing.", blank: 'Traveling', context: 'Transport' },
        { sentence: "___ teaches you about different cultures.", blank: 'Traveling', context: 'Education' }
      ]
    }
  ]
};

/**
 * GROUP 6A: BOTH FORMS OK (Same Meaning)
 * Verbs that take both gerund and infinitive with the same meaning
 * STREAMLINED: Quick intro before the harder "meaning changes" group
 * Verbs: begin, start, continue, like, love, hate, prefer
 */
export const GROUP_6A: GerundInfinitiveGroup = {
  id: 'group-6a',
  title: 'Both Forms OK',
  shortTitle: '19. Both Forms OK',
  pattern: 'A few verbs allow -ing or to + verb with the same basic meaning. This level uses: begin, start, continue, like, love, hate, and prefer. With these verbs, either form often sounds natural.',
  patternExample: 'It started raining / It started to rain',
  colorClass: 'bg-violet-100 border-violet-300 text-violet-900',
  difficulty: 3,
  phase: 'mastery',
  prerequisite: null,
  memoryTrick: 'Same idea—either form often works.',
  bigPicture:
    'Verbs in this lesson: begin, start, continue, like, love, hate, prefer.\nAfter these verbs, -ing and to + verb often mean the same thing.\nYour job is to recognize the pattern—not to stress over which one is better.',
  icon: '🔀',
  patterns: [
    {
      id: 'both-begin',
      trigger: 'begin',
      correctForm: 'both',
      category: 'both-ok',
      memoryTrick: 'BEGIN is flexible - use whichever sounds natural!',
      examples: [
        { sentence: "It began ___. (both OK)", blank: 'raining / to rain', context: 'Weather' },
        { sentence: "She began ___ English last year.", blank: 'studying / to study', context: 'Education' },
        { sentence: "The movie began ___.", blank: 'playing / to play', context: 'Entertainment' }
      ]
    },
    {
      id: 'both-start',
      trigger: 'start',
      correctForm: 'both',
      category: 'both-ok',
      memoryTrick: 'START works just like BEGIN - both forms accepted!',
      examples: [
        { sentence: "I started ___. (both OK)", blank: 'working / to work', context: 'Work' },
        { sentence: "She started ___ more.", blank: 'exercising / to exercise', context: 'Health' },
        { sentence: "We started ___ Spanish.", blank: 'learning / to learn', context: 'Education' }
      ]
    },
    {
      id: 'both-continue',
      trigger: 'continue',
      correctForm: 'both',
      category: 'both-ok',
      memoryTrick: 'CONTINUE is also flexible - no wrong choice here!',
      examples: [
        { sentence: "She continued ___. (both OK)", blank: 'studying / to study', context: 'Education' },
        { sentence: "He continued ___ hard.", blank: 'working / to work', context: 'Work' },
        { sentence: "The rain continued ___.", blank: 'falling / to fall', context: 'Weather' }
      ]
    },
    {
      id: 'both-like-love-hate',
      trigger: 'like/love/hate',
      correctForm: 'both',
      category: 'both-ok',
      memoryTrick: 'LIKE, LOVE, HATE, PREFER = all flexible with same meaning!',
      examples: [
        { sentence: "I like ___. (both OK)", blank: 'swimming / to swim', context: 'Hobbies' },
        { sentence: "She loves ___ in the park.", blank: 'walking / to walk', context: 'Exercise' },
        { sentence: "He hates ___ in traffic.", blank: 'driving / to drive', context: 'Daily life' },
        { sentence: "I prefer ___ at home.", blank: 'eating / to eat', context: 'Food' }
      ]
    }
  ]
};

/**
 * GROUP 6B: MEANING CHANGES (stop, remember, try)
 * Verbs where using gerund vs infinitive changes the meaning
 * THE BOSS LEVEL for meaning distinction!
 */
export const GROUP_6B: GerundInfinitiveGroup = {
  id: 'group-6b',
  title: 'Meaning Changes',
  shortTitle: '20. Meaning Changes',
  pattern: 'For stop, remember, and try, -ing and to + verb are not interchangeable. Decide what the sentence means, then choose the form.',
  patternExample: 'stop working = quit; stop to eat = pause in order to eat',
  colorClass: 'bg-amber-100 border-amber-300 text-amber-900',
  difficulty: 3,
  phase: 'mastery',
  prerequisite: null,
  memoryTrick: 'What is happening? Then pick -ing or to.',
  bigPicture:
    'This level is different from Both forms OK. Here, the form changes the message (quit vs pause, memory vs reminder, experiment vs effort).\nRead the situation in the sentence first—then match the form to that meaning.',
  icon: '⚠️',
  patterns: [
    {
      id: 'special-stop-gerund',
      trigger: 'stop + gerund',
      correctForm: 'gerund',
      category: 'meaning-change',
      memoryTrick: 'stop + gerund = QUIT the habit',
      examples: [
        { sentence: "I stopped ___. (quit the habit)", blank: 'smoking', context: 'Health', explanation: 'I quit smoking - the habit ended' },
        { sentence: "He stopped ___ junk food.", blank: 'eating', context: 'Health', explanation: 'He quit eating junk food' },
        { sentence: "She stopped ___ TV late at night.", blank: 'watching', context: 'Daily life', explanation: 'She quit watching TV late' },
        { sentence: "I stopped ___ to the gym.", blank: 'going', context: 'Exercise', explanation: 'I quit going to the gym' },
        { sentence: "She stopped ___ sugar.", blank: 'eating', context: 'Health', explanation: 'She quit eating sugar' },
        { sentence: "He stopped ___ overtime.", blank: 'working', context: 'Work', explanation: 'He quit working overtime' }
      ]
    },
    {
      id: 'special-stop-infinitive',
      trigger: 'stop + infinitive',
      correctForm: 'infinitive',
      category: 'meaning-change',
      memoryTrick: 'stop + infinitive = PAUSE to do something',
      examples: [
        { sentence: "I stopped ___. (paused to do it)", blank: 'to buy coffee', context: 'Daily life', explanation: 'I was walking, paused, bought coffee' },
        { sentence: "She stopped ___ the phone.", blank: 'to answer', context: 'Communication', explanation: 'She paused her work to answer' },
        { sentence: "We stopped ___ a photo.", blank: 'to take', context: 'Travel', explanation: 'We paused our walk to take a photo' },
        { sentence: "He stopped ___ some gas.", blank: 'to get', context: 'Transport', explanation: 'He paused his trip to get gas' },
        { sentence: "I stopped ___ directions.", blank: 'to ask', context: 'Navigation', explanation: 'I paused to ask for help' },
        { sentence: "They stopped ___ rest.", blank: 'to take', context: 'Travel', explanation: 'They paused their journey to rest' }
      ]
    },
    {
      id: 'special-remember-gerund',
      trigger: 'remember + gerund',
      correctForm: 'gerund',
      category: 'meaning-change',
      memoryTrick: 'remember + gerund = PAST memory',
      examples: [
        { sentence: "I remember ___ you at the party.", blank: 'meeting', context: 'Social', explanation: 'I have a memory of when we met (PAST)' },
        { sentence: "She remembers ___ Paris as a child.", blank: 'visiting', context: 'Travel', explanation: 'She has memories of visiting Paris (PAST)' },
        { sentence: "Do you remember ___ that movie?", blank: 'watching', context: 'Entertainment', explanation: 'Do you recall watching it? (PAST)' },
        { sentence: "I remember ___ that song.", blank: 'hearing', context: 'Music', explanation: 'I recall hearing it before (PAST)' },
        { sentence: "He remembers ___ his first day of school.", blank: 'starting', context: 'Memory', explanation: 'He has a memory of that day (PAST)' },
        { sentence: "Do you remember ___ me your number?", blank: 'giving', context: 'Past', explanation: 'Recall giving it? (PAST)' }
      ]
    },
    {
      id: 'special-remember-infinitive',
      trigger: 'remember + infinitive',
      correctForm: 'infinitive',
      category: 'meaning-change',
      memoryTrick: 'remember + infinitive = FUTURE duty (don\'t forget!)',
      examples: [
        { sentence: "Remember ___ your mother.", blank: 'to call', context: 'Family', explanation: 'Don\'t forget to call! (FUTURE action)' },
        { sentence: "Remember ___ your keys.", blank: 'to take', context: 'Daily life', explanation: 'Don\'t forget before leaving! (FUTURE)' },
        { sentence: "Remember ___ your homework.", blank: 'to do', context: 'School', explanation: 'Don\'t forget to do it! (FUTURE)' },
        { sentence: "Remember ___ the door when you leave.", blank: 'to lock', context: 'Safety', explanation: 'Don\'t forget to lock it! (FUTURE)' },
        { sentence: "Remember ___ the report by Friday.", blank: 'to submit', context: 'Work', explanation: 'Don\'t forget the deadline! (FUTURE)' },
        { sentence: "Remember ___ the milk.", blank: 'to buy', context: 'Shopping', explanation: 'Don\'t forget at the store! (FUTURE)' }
      ]
    },
    {
      id: 'special-try-gerund',
      trigger: 'try + gerund',
      correctForm: 'gerund',
      category: 'meaning-change',
      memoryTrick: 'try + gerund = EXPERIMENT (see if it works)',
      examples: [
        { sentence: "If you're tired, try ___ coffee.", blank: 'drinking', context: 'Health', explanation: 'Experiment: see if coffee helps' },
        { sentence: "Try ___ the computer.", blank: 'restarting', context: 'Tech', explanation: 'Experiment: see if restarting fixes it' },
        { sentence: "Try ___ a different approach.", blank: 'using', context: 'Problem-solving', explanation: 'Experiment: see if this approach works' },
        { sentence: "Try ___ the window.", blank: 'opening', context: 'Temperature', explanation: 'Experiment: see if it cools down' },
        { sentence: "Try ___ garlic in the recipe.", blank: 'adding', context: 'Cooking', explanation: 'Experiment: see if it tastes better' },
        { sentence: "Try ___ earlier.", blank: 'waking up', context: 'Routine', explanation: 'Experiment: see if you have more energy' }
      ]
    },
    {
      id: 'special-try-infinitive',
      trigger: 'try + infinitive',
      correctForm: 'infinitive',
      category: 'meaning-change',
      memoryTrick: 'try + infinitive = MAKE AN EFFORT (attempt)',
      examples: [
        { sentence: "I'm trying ___ Spanish.", blank: 'to learn', context: 'Education', explanation: 'Making an effort to learn' },
        { sentence: "He tried ___ the door.", blank: 'to open', context: 'Action', explanation: 'He attempted to open it' },
        { sentence: "She's trying ___ weight.", blank: 'to lose', context: 'Health', explanation: 'She\'s making an effort' },
        { sentence: "I'm trying ___ more vegetables.", blank: 'to eat', context: 'Health', explanation: 'Making an effort to eat better' },
        { sentence: "He tried ___ her attention.", blank: 'to get', context: 'Social', explanation: 'He attempted to get her attention' },
        { sentence: "We're trying ___ on time.", blank: 'to arrive', context: 'Punctuality', explanation: 'Making an effort to be punctual' }
      ]
    }
  ]
};

/**
 * GROUP 7: "TO" AS PREPOSITION TRAP
 * The final boss: when "to" is a preposition, not an infinitive marker
 */
export const GROUP_7: GerundInfinitiveGroup = {
  id: 'group-7',
  title: 'Advanced "TO" Traps',
  shortTitle: '22. Advanced TO Traps',
  pattern: 'In more formal phrases (object to, admit to, devoted to…), to is a preposition. After it, use -ing.',
  patternExample: 'object to working overtime',
  colorClass: 'bg-rose-100 border-rose-300 text-rose-900',
  difficulty: 3,
  phase: 'mastery',
  prerequisite: null,
  memoryTrick: 'Treat to like any prep in that phrase → -ing.',
  bigPicture:
    'These are advanced collocations you often see in school, work, or formal English.\nSame idea as the other “to trap” level: learn the phrase as a unit; the verb after to takes -ing.',
  icon: '🎓',
  patterns: [
    {
      id: 'trap-object-to',
      trigger: 'object to',
      correctForm: 'gerund',
      category: 'to-preposition',
      memoryTrick: 'Object TO = oppose = preposition!',
      examples: [
        { sentence: "She objects to ___ overtime.", blank: 'working', context: 'Work', explanation: '"to" is a preposition → gerund' },
        { sentence: "He objects to ___ told what to do.", blank: 'being', context: 'Authority', explanation: '"to" is a preposition → gerund' },
        { sentence: "They object to ___ more taxes.", blank: 'paying', context: 'Politics', explanation: '"to" is a preposition → gerund' },
        { sentence: "I object to ___ treated this way.", blank: 'being', context: 'Fairness', explanation: '"to" is a preposition → gerund' },
        { sentence: "She objects to ___ in meetings.", blank: 'interrupting', context: 'Etiquette', explanation: '"to" is a preposition → gerund' },
        { sentence: "He objects to ___ the rules.", blank: 'changing', context: 'Policy', explanation: '"to" is a preposition → gerund' }
      ]
    },
    {
      id: 'trap-admit-to',
      trigger: 'admit to',
      correctForm: 'gerund',
      category: 'to-preposition',
      memoryTrick: 'Admit TO = confess to = preposition!',
      examples: [
        { sentence: "He admitted to ___ the money.", blank: 'stealing', context: 'Crime', explanation: '"to" is a preposition → gerund' },
        { sentence: "She admitted to ___ a mistake.", blank: 'making', context: 'Honesty', explanation: '"to" is a preposition → gerund' },
        { sentence: "They admitted to ___ about the results.", blank: 'lying', context: 'Truth', explanation: '"to" is a preposition → gerund' },
        { sentence: "I admit to ___ nervous.", blank: 'feeling', context: 'Honesty', explanation: '"to" is a preposition → gerund' },
        { sentence: "She admitted to ___ the letter.", blank: 'reading', context: 'Privacy', explanation: '"to" is a preposition → gerund' },
        { sentence: "He admitted to ___ wrong.", blank: 'being', context: 'Apology', explanation: '"to" is a preposition → gerund' }
      ]
    },
    {
      id: 'trap-accustomed-to',
      trigger: 'accustomed to',
      correctForm: 'gerund',
      category: 'to-preposition',
      memoryTrick: 'Accustomed TO = formal "used to" = preposition!',
      examples: [
        { sentence: "I'm accustomed to ___ hard.", blank: 'working', context: 'Work', explanation: '"to" is a preposition → gerund' },
        { sentence: "She's accustomed to ___ in hot weather.", blank: 'living', context: 'Climate', explanation: '"to" is a preposition → gerund' },
        { sentence: "He's accustomed to ___ his own schedule.", blank: 'making', context: 'Work', explanation: '"to" is a preposition → gerund' },
        { sentence: "I'm accustomed to ___ early.", blank: 'getting up', context: 'Routine', explanation: '"to" is a preposition → gerund' },
        { sentence: "She's accustomed to ___ alone.", blank: 'traveling', context: 'Independence', explanation: '"to" is a preposition → gerund' },
        { sentence: "He's accustomed to ___ long hours.", blank: 'working', context: 'Career', explanation: '"to" is a preposition → gerund' }
      ]
    },
    {
      id: 'trap-devoted-to',
      trigger: 'devoted to',
      correctForm: 'gerund',
      category: 'to-preposition',
      memoryTrick: 'Devoted TO = dedicated to = preposition!',
      examples: [
        { sentence: "She's devoted to ___ others.", blank: 'helping', context: 'Service', explanation: '"to" is a preposition → gerund' },
        { sentence: "He's devoted to ___ his family.", blank: 'supporting', context: 'Family', explanation: '"to" is a preposition → gerund' },
        { sentence: "They're devoted to ___ awareness.", blank: 'raising', context: 'Activism', explanation: '"to" is a preposition → gerund' },
        { sentence: "She's devoted to ___ her students.", blank: 'teaching', context: 'Education', explanation: '"to" is a preposition → gerund' },
        { sentence: "He's devoted to ___ the environment.", blank: 'protecting', context: 'Causes', explanation: '"to" is a preposition → gerund' },
        { sentence: "I'm devoted to ___ better.", blank: 'getting', context: 'Self-improvement', explanation: '"to" is a preposition → gerund' }
      ]
    }
  ]
};

// =============================================================================
// CHECKPOINT REVIEW GROUPS
// Mini-reviews to consolidate learning before moving to harder content
// =============================================================================

/**
 * CHECKPOINT 1: Mixed review
 * Reviews: Gerunds Intro, Infinitives Intro, Subject Gerunds, Go + Gerund, Gerund Verbs, Infinitive Verbs, Mixed Verbs
 * Unlocks: Preposition Rules section
 */
export const CHECKPOINT_1: GerundInfinitiveGroup = {
  id: 'checkpoint-1',
  title: 'Checkpoint 1: Mixed review',
  shortTitle: '8. 🏁 Checkpoint 1',
  pattern: 'Sentences from your earlier levels: intro patterns, go + -ing, subject -ing, plus gerund verbs and infinitive verbs. Use the word before the blank to choose -ing or to + verb.',
  patternExample: 'Same skills, mixed together',
  colorClass: 'bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-300 text-emerald-900',
  difficulty: 2,
  phase: 'core-verbs',
  prerequisite: null,
  memoryTrick: 'Read the trigger or verb before the blank first.',
  icon: '🏁',
  isCheckpoint: true,
  reviewsGroups: ['group-0a', 'group-0b', 'group-5', 'group-4', 'group-2a', 'group-2b', 'group-2c'],
  patterns: [] // Checkpoint uses patterns from reviewsGroups
};

/**
 * CHECKPOINT 2: Mixed review (preposition focus)
 * Reviews: foundation + core verbs + preposition rules (group-1, 1b, 1d)
 * Unlocks: Adjective/Noun + Infinitive section
 */
export const CHECKPOINT_2: GerundInfinitiveGroup = {
  id: 'checkpoint-2',
  title: 'Checkpoint 2: Mixed review (prepositions)',
  shortTitle: '12. 🏁 Checkpoint 2',
  pattern: 'Sentences from levels you already did, with extra weight on preposition chunks. After a preposition, use -ing. Read the trigger or adjective before the blank.',
  patternExample: 'Same skills, preposition-heavy mix',
  colorClass: 'bg-gradient-to-r from-terracotta-100 to-purple-100 border-terracotta-300 text-terracotta-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Chunk the prep, then -ing after it.',
  icon: '🏁',
  isCheckpoint: true,
  reviewsGroups: ['group-0a', 'group-0b', 'group-5', 'group-4', 'group-2a', 'group-2b', 'group-2c', 'group-1', 'group-1b', 'group-1d'],
  patterns: [] // Checkpoint uses patterns from reviewsGroups
};

/**
 * GROUP 8A: MAKING SUGGESTIONS
 * Preposition-based suggestion phrases that all take gerunds
 * "How about / What about / Have you thought of" + gerund
 */
export const GROUP_8A: GerundInfinitiveGroup = {
  id: 'group-8a',
  title: 'Making Suggestions',
  shortTitle: '16. Making Suggestions',
  pattern: 'How about, what about, and thought of end with a preposition. Next word: -ing.',
  patternExample: 'How about taking the earlier bus?',
  colorClass: 'bg-teal-100 border-teal-300 text-teal-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'About / of = preposition → -ing next.',
  bigPicture:
    'These suggestion phrases end with a preposition (about, of).\nSame golden rule: after a preposition, use -ing—not to + verb.',
  icon: '💡',
  patterns: [
    {
      id: 'suggestion-how-about',
      trigger: 'How about',
      correctForm: 'gerund',
      category: 'suggestion',
      commonError: 'How about to go',
      errorExplanation: 'About is a prep → -ing, not to + verb.',
      memoryTrick: '"About" = preposition → -ing. How about GOING? How about TRYING?',
      examples: [
        { sentence: "How about ___ the landlord about the leak?", blank: 'calling', context: 'Housing' },
        { sentence: "How about ___ for jobs online?", blank: 'looking', context: 'Employment' },
        { sentence: "How about ___ a coffee break?", blank: 'taking', context: 'Work' },
        { sentence: "How about ___ public transportation to save money?", blank: 'taking', context: 'Finances' },
        { sentence: "How about ___ the meeting to Thursday?", blank: 'moving', context: 'Work' },
        { sentence: "How about ___ home early if you feel sick?", blank: 'going', context: 'Health' }
      ]
    },
    {
      id: 'suggestion-what-about',
      trigger: 'What about',
      correctForm: 'gerund',
      category: 'suggestion',
      commonError: 'What about to take',
      errorExplanation: 'About → -ing only.',
      memoryTrick: 'What about = How about. Same "about" = same preposition = same -ing rule.',
      examples: [
        { sentence: "What about ___ to the free clinic?", blank: 'going', context: 'Health' },
        { sentence: "What about ___ him for advice?", blank: 'asking', context: 'Problem-solving' },
        { sentence: "What about ___ earlier to avoid traffic?", blank: 'leaving', context: 'Transportation' },
        { sentence: "What about ___ the project into smaller tasks?", blank: 'breaking', context: 'Work' },
        { sentence: "What about ___ your manager for a raise?", blank: 'asking', context: 'Employment' },
        { sentence: "What about ___ a used car instead of a new one?", blank: 'buying', context: 'Finances' }
      ]
    },
    {
      id: 'suggestion-thought-of',
      trigger: 'Have you thought of',
      correctForm: 'gerund',
      category: 'suggestion',
      commonError: 'Have you thought of to invest',
      errorExplanation: 'Of is a prep → -ing next.',
      memoryTrick: '"Of" = preposition = -ing! Have you thought OF INVESTING? "Of" always signals gerund.',
      examples: [
        { sentence: "Have you thought of ___ for citizenship?", blank: 'applying', context: 'Immigration' },
        { sentence: "Have you thought of ___ English classes at the library?", blank: 'taking', context: 'Education' },
        { sentence: "Have you thought of ___ to a cheaper neighborhood?", blank: 'moving', context: 'Housing' },
        { sentence: "Have you thought of ___ your own business?", blank: 'starting', context: 'Career' },
        { sentence: "Have you thought of ___ your credit report?", blank: 'checking', context: 'Finance' },
        { sentence: "Have you thought of ___ HR about the issue?", blank: 'emailing', context: 'Work' }
      ]
    },
    {
      id: 'personal-suggestion',
      trigger: 'How about / What about / Have you thought of',
      correctForm: 'gerund',
      category: 'suggestion',
      question: 'What suggestion would you give a classmate who is always late?',
      patternHint: 'How about + gerund / What about + gerund',
      exampleAnswer: 'How about leaving home fifteen minutes earlier?',
      requiredPattern: /(how\s+about|what\s+about|thought\s+of)\s+\w+ing/i,
      examples: []
    }
  ]
};

/**
 * GROUP 8B: USE FOR... / USE TO... (PURPOSE CONTRAST)
 * Both "use X for + gerund" and "use X to + infinitive" express purpose
 * Students learn to identify the structural cue (preposition vs infinitive marker)
 */
export const GROUP_8B: GerundInfinitiveGroup = {
  id: 'group-8b',
  title: 'Use for... / Use to...',
  shortTitle: '17. Use for/to: Purpose',
  pattern: 'for + -ing and to + verb can both show purpose. Watch the word before the blank.',
  patternExample: 'I use this app for tracking expenses',
  colorClass: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Let for vs to tell you -ing vs base verb.',
  bigPicture:
    'You can express purpose with for + -ing or with to + base verb.\nRead the word before the blank: for is a preposition (-ing); to here starts the infinitive (base verb).',
  icon: '🔧',
  patterns: [
    {
      id: 'purpose-use-for',
      trigger: 'use [noun] for',
      correctForm: 'gerund',
      category: 'purpose-contrast',
      commonError: 'use this for to open',
      errorExplanation: 'For is a prep → -ing. No for to.',
      memoryTrick: '"For" = preposition → gerund rule. What is it FOR? FOR + -ing.',
      examples: [
        { sentence: "I use this tool for ___ the pipes.", blank: 'fixing', context: 'Home Repair' },
        { sentence: "She uses this app for ___ her budget.", blank: 'tracking', context: 'Finance' },
        { sentence: "I use this planner for ___ my work schedule.", blank: 'organizing', context: 'Work' },
        { sentence: "They use the library for ___ in peace.", blank: 'studying', context: 'Education' },
        { sentence: "I use a dictionary app for ___ unfamiliar words.", blank: 'checking', context: 'Language Learning' },
        { sentence: "She uses public transit for ___ to work without driving.", blank: 'getting', context: 'Transportation' }
      ]
    },
    {
      id: 'purpose-use-to',
      trigger: 'use [noun] to',
      correctForm: 'infinitive',
      category: 'purpose-contrast',
      commonError: 'use laptop to sending',
      errorExplanation: 'Use X to + verb: to starts the infinitive.',
      memoryTrick: '"To" here is the infinitive marker. Use it TO DO something. What do you want to accomplish?',
      examples: [
        { sentence: "She uses her laptop ___ job applications.", blank: 'to submit', context: 'Employment' },
        { sentence: "He uses a dictionary ___ new vocabulary words.", blank: 'to learn', context: 'Education' },
        { sentence: "We use email ___ with our manager.", blank: 'to communicate', context: 'Work' },
        { sentence: "I use my phone ___ the bus schedule.", blank: 'to check', context: 'Transportation' },
        { sentence: "They use a price-comparison app ___ money on groceries.", blank: 'to save', context: 'Finances' },
        { sentence: "She uses a calendar app ___ medical appointments.", blank: 'to remember', context: 'Health' }
      ]
    },
    {
      id: 'purpose-contrast-choice',
      trigger: 'use X for/to',
      correctForm: 'both',
      category: 'purpose-contrast',
      commonError: 'confusing for -ing with to infinitive',
      errorExplanation: 'for → -ing; to → base verb.',
      memoryTrick: 'FOR → -ING. TO → base verb. The structural cue is right there in the sentence!',
      examples: [
        { sentence: "I use this key for ___ the front door.", blank: 'locking', context: 'Housing' },
        { sentence: "I use this key ___ the front door.", blank: 'to lock', context: 'Housing' },
        { sentence: "She uses the community board for ___ local jobs.", blank: 'finding', context: 'Community' },
        { sentence: "She uses the community board ___ local jobs.", blank: 'to find', context: 'Community' },
        { sentence: "He uses translation apps for ___ letters from the school.", blank: 'reading', context: 'Education' },
        { sentence: "He uses translation apps ___ letters from the school.", blank: 'to read', context: 'Education' }
      ]
    },
    {
      id: 'personal-purpose-contrast',
      trigger: 'use X for / use X to',
      correctForm: 'both',
      category: 'purpose-contrast',
      question: 'What do you use your phone for during a normal workday?',
      patternHint: 'use [thing] for + gerund / use [thing] to + verb',
      exampleAnswer: 'I use my phone for checking my schedule',
      requiredPattern: /use\s+.+\s+(for\s+\w+ing|to\s+\w+)/i,
      examples: []
    }
  ]
};

/**
 * CHECKPOINT 3: Pre-Mastery Review
 * Reviews: Everything before the mastery level
 * Unlocks: Mastery section (exceptions & nuances)
 */
export const CHECKPOINT_3: GerundInfinitiveGroup = {
  id: 'checkpoint-3',
  title: 'Checkpoint: Ready for Mastery?',
  shortTitle: '18. 🏁 Checkpoint 3',
  pattern: 'Review all main patterns before the meaning-change and exception levels.',
  patternExample: 'Comprehensive review of core patterns',
  colorClass: 'bg-gradient-to-r from-yellow-100 to-indigo-100 border-yellow-300 text-yellow-900',
  difficulty: 2,
  phase: 'development',
  prerequisite: null,
  memoryTrick: 'Trigger first; form second.',
  icon: '🏁',
  isCheckpoint: true,
  reviewsGroups: ['group-0a', 'group-0b', 'group-5', 'group-4', 'group-2a', 'group-2b', 'group-2c', 'group-1', 'group-1b', 'group-1d', 'group-3a', 'group-3b', 'group-3c', 'group-8a', 'group-8b'],
  patterns: [] // Checkpoint uses patterns from reviewsGroups
};

/**
 * All pattern groups in order
 *
 * NEW STRUCTURE:
 * PHASE 1: FOUNDATION (Recognize patterns, build confidence)
 * PHASE 2: CORE RULES (Learn the main verb rules)
 * PHASE 2B: MIXED CHALLENGE (choose gerund vs infinitive)
 * CHECKPOINT 1: Mixed review
 * PHASE 3: PREPOSITION TRACK (prep + -ing; collocations; combo)
 * CHECKPOINT 2: Mixed review (preposition focus)
 * PHASE 4: BEYOND VERBS
 * CHECKPOINT 3: Pre-Mastery Review
 * PHASE 5: MASTERY (The hard stuff)
 */
export const GI_GROUPS: GerundInfinitiveGroup[] = [
  // === PHASE 1: FOUNDATION (Recognize patterns, build confidence) ===
  GROUP_0A,       // 1. Gerunds Intro - recognize -ing as noun
  GROUP_0B,       // 2. Infinitives Intro - recognize to + verb
  GROUP_5,        // 3. Subject Gerunds - "Swimming is fun" (MOVED UP - easy & intuitive!)
  GROUP_4,        // 4. Go + Gerund - "go swimming" (MOVED UP - common daily-life pattern!)

  // === PHASE 2: CORE RULES (Learn the main verb rules) ===
  GROUP_2A,       // 5. Gerund Verbs (enjoy, finish, avoid)
  GROUP_2B,       // 6. Infinitive Verbs (want, hope, plan)

  // === PHASE 2B: MIXED CHALLENGE (apply gerund vs infinitive choice) ===
  GROUP_2C,       // 7. Mixed Verb Challenge - THE KEY LEVEL!

  // === CHECKPOINT 1: Mixed review (foundation + core verb levels) ===
  CHECKPOINT_1,   // 8. 🏁 Checkpoint 1 - mixed sentences from earlier levels

  // === PHASE 3: PREPOSITION TRACK ===
  GROUP_1,        // 9. Prepositions → Gerund - the golden rule
  GROUP_1B,       // 10. Which Preposition? - adj+prep collocations (difficulty 2)
  GROUP_1D,       // 11. Combo Challenge - preposition + gerund together (difficulty 2)

  // === CHECKPOINT 2: Mixed review (preposition focus) ===
  CHECKPOINT_2,   // 12. 🏁 Checkpoint 2 - mixed sentences, extra preposition practice

  // === PHASE 4: BEYOND VERBS (Adjectives, Nouns, Purpose) ===
  GROUP_3A,       // 13. Adjective + Infinitive - happy to help
  GROUP_3B,       // 14. Noun + Infinitive - time to go
  GROUP_3C,       // 15. Purpose: To... - showing purpose/reason
  GROUP_8A,       // 16. Making Suggestions - How about/What about/Have you tried/Have you thought of
  GROUP_8B,       // 17. Use for/to: Purpose Contrast - gerund vs infinitive for purpose

  // === CHECKPOINT 3: Pre-Mastery Review ===
  CHECKPOINT_3,   // 18. 🏁 Checkpoint 3 - Final review before mastery

  // === PHASE 5: COMMUNICATION & MASTERY ===
  GROUP_6A,       // 19. Both Forms OK - begin/start/continue (streamlined)
  GROUP_6B,       // 20. Meaning Changes - stop/remember/try ⚠️ BOSS LEVEL
  GROUP_1C,       // 21. The "TO" Trap - look forward to + -ing ⚠️
  GROUP_7         // 22. Advanced TO Traps - mastery level 🎓
];

/**
 * Special group IDs for review and final challenge
 */
export const GI_REVIEW_GROUP_ID = 'review';
export const GI_FINAL_GROUP_ID = 'final';

/**
 * Helper function to get a group by ID
 */
export function getGIGroupById(groupId: string): GerundInfinitiveGroup | undefined {
  return GI_GROUPS.find(group => group.id === groupId);
}

/**
 * Helper function to get patterns from a group
 */
export function getPatternsFromGroup(groupId: string): GerundInfinitivePattern[] {
  const group = getGIGroupById(groupId);
  return group?.patterns ?? [];
}

/**
 * Helper function to get next group in sequence
 */
export function getNextGIGroup(currentGroupId: string): GerundInfinitiveGroup | undefined {
  const currentIndex = GI_GROUPS.findIndex(g => g.id === currentGroupId);
  return currentIndex >= 0 ? GI_GROUPS[currentIndex + 1] : undefined;
}

/**
 * Helper function to get group index
 */
export function getGIGroupIndex(groupId: string): number {
  return GI_GROUPS.findIndex(g => g.id === groupId);
}

/**
 * Get all patterns across all groups (for review/final)
 */
export function getAllPatterns(): GerundInfinitivePattern[] {
  return GI_GROUPS.flatMap(group => group.patterns);
}

/**
 * Statistics about pattern groups
 */
export const GI_GROUPS_STATS = {
  totalGroups: GI_GROUPS.length,
  totalPatterns: GI_GROUPS.reduce((sum, group) => sum + group.patterns.length, 0),
  groupsByDifficulty: {
    1: GI_GROUPS.filter(g => g.difficulty === 1).length,
    2: GI_GROUPS.filter(g => g.difficulty === 2).length,
    3: GI_GROUPS.filter(g => g.difficulty === 3).length
  }
};
