import rescueWeeks from '../data/word-rescue-weekly.generated.json';

export interface CourseMapItemDef {
  id: string;
  activityId?: string;
  href?: string;
  vocabUi?: "flashcards" | "matching" | "fill-blank";
  slot: string;
  order: number;
  wrappedGame: boolean;
  activityType: string;
  title: string;
  /** Short chip shown next to the item on the map, e.g. "Challenge". */
  badge?: string;
}

export interface CourseWeekDef {
  id: string;
  number: number;
  title: string;
  goal?: string;
  /** Short retrieval practice for teachers and the weekly planning reference. */
  reviewPractice?: string;
  /** Teacher-led reuse of a previous set, not an additional scored app assignment. */
  vocabularyReviewWeek?: number;
  items: CourseMapItemDef[];
}

export interface CourseUnitDef {
  id: string;
  number: number;
  title: string;
  month?: string;
  weeks: CourseWeekDef[];
}

export const COURSE_MAP_UNITS: CourseUnitDef[] = [
  {
    "id": "unit-1",
    "number": 1,
    "title": "Getting to Know You",
    "month": "September",
    "weeks": [
      {
        "id": "week-1",
        "number": 1,
        "title": "Start the Class",
        "goal": "Find your path in the app, meet your classmates, and try a gentle English warm-up.",
        "items": [
          {
            "id": "vocab-sep-w1-flashcards",
            "activityId": "vocab-sep-w1",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Introductions: Flash Cards"
          },
          {
            "id": "welcome-back-tenses-review",
            "href": "/grammar-reader/welcome-back-tenses-review",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Welcome Back: Simple & Continuous Review"
          },
          {
            "id": "timeline-check-simple",
            "activityId": "timeline-tenses-simple",
            "title": "Timeline Check: Simple Tenses",
            "slot": "extra",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game"
          },
          {
            "id": "timeline-check-continuous",
            "activityId": "timeline-tenses-continuous",
            "title": "Timeline Check: Continuous Tenses",
            "slot": "extra",
            "order": 7,
            "wrappedGame": true,
            "activityType": "game"
          },
          {
            "id": "vocab-sep-w1-matching",
            "activityId": "vocab-sep-w1",
            "vocabUi": "matching",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Introductions: Matching"
          },
          {
            "id": "vocab-sep-w1-fill-blank",
            "activityId": "vocab-sep-w1",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Introductions: Fill in the Blank"
          },
          {
            "id": "timeline-check-simple-continuous",
            "activityId": "timeline-tenses-simple-continuous",
            "title": "Timeline Check: Simple + Continuous",
            "slot": "extra",
            "order": 8,
            "wrappedGame": true,
            "activityType": "game",
            "badge": "Challenge"
          },
          {
            "id": "timeline-tenses-week1-intro",
            "activityId": "timeline-tenses-week1-easy",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Easy Start"
          },
          {
            "id": "grammar-hospital-first-aid",
            "activityId": "grammar-hospital-first-aid-guided",
            "slot": "extra",
            "order": 9,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grammar Hospital: First Aid"
          }
        ]
      },
      {
        "id": "week-2",
        "number": 2,
        "title": "Parts of Speech",
        "goal": "Learn the basic building blocks of English: nouns, verbs, adjectives, and more.",
        "items": [
          {
            "id": "vocab-sep-w2-flashcards",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Say It & Spell It: Flash Cards"
          },
          {
            "id": "parts-of-speech-mini-guide",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Guide"
          },
          {
            "id": "parts-of-speech-word-sort",
            "activityId": "parts-of-speech-word-sort-guided",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Verbs"
          },
          {
            "id": "vocab-sep-w2-matching",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Say It & Spell It: Matching"
          },
          {
            "id": "vocab-sep-w2-fill-blank",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Say It & Spell It: Fill in the Blank"
          },
          {
            "id": "action-description-game",
            "activityId": "action-or-description",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "order": 5,
            "title": "Action or Description?"
          },
          {
            "id": "parts-of-speech-word-sort-nouns",
            "activityId": "parts-of-speech-word-sort-nouns-guided",
            "slot": "extra",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Nouns"
          },
          {
            "id": "parts-of-speech-word-sort-pronouns",
            "activityId": "parts-of-speech-word-sort-pronouns-guided",
            "slot": "extra",
            "order": 7,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Pronouns"
          },
          {
            "id": "parts-of-speech-word-sort-articles",
            "activityId": "parts-of-speech-word-sort-articles-guided",
            "slot": "extra",
            "order": 8,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Articles"
          }
        ]
      },
      {
        "id": "week-3",
        "number": 3,
        "title": "Parts of Speech Review",
        "goal": "Review nouns and verbs in one short lesson. Other word jobs can wait until another week.",
        "items": [
          {
            "id": "vocab-sep-w4-flashcards",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Personal Journey Verbs: Flash Cards"
          },
          {
            "id": "parts-of-speech-mini-guide-review",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Guide",
            "badge": "Review"
          },
          {
            "id": "parts-of-speech-discovery",
            "activityId": "parts-of-speech-game",
            "href": "/activity/parts-of-speech-game?lesson=nouns-verbs",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Jobs: Nouns and Verbs"
          },
          {
            "id": "parts-of-speech-word-sort-review",
            "activityId": "parts-of-speech-word-sort-guided",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Verbs",
            "badge": "Review"
          },
          {
            "id": "vocab-sep-w4-matching",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 4,
            "title": "Personal Journey Verbs: Matching"
          },
          {
            "id": "action-description-game-review",
            "activityId": "action-or-description",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "order": 5,
            "title": "Action or Description?",
            "badge": "Review"
          },
          {
            "id": "vocab-sep-w4-fill-blank",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 6,
            "title": "Personal Journey Verbs: Fill in the Blank"
          },
          {
            "id": "parts-of-speech-word-sort-nouns-review",
            "activityId": "parts-of-speech-word-sort-nouns-guided",
            "slot": "extra",
            "order": 7,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Nouns",
            "badge": "Review"
          },
          {
            "id": "parts-of-speech-word-sort-pronouns-review",
            "activityId": "parts-of-speech-word-sort-pronouns-guided",
            "slot": "extra",
            "order": 8,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Pronouns",
            "badge": "Review"
          },
          {
            "id": "parts-of-speech-word-sort-articles-review",
            "activityId": "parts-of-speech-word-sort-articles-guided",
            "slot": "extra",
            "order": 9,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Word Sort: Articles",
            "badge": "Review"
          },
          {
            "id": "parts-of-speech-library",
            "activityId": "parts-of-speech-game",
            "slot": "extra",
            "order": 10,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Word Jobs: More Lessons"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-2",
    "number": 2,
    "title": "Daily Life in the Community",
    "month": "October",
    "weeks": [
      {
        "id": "week-4",
        "number": 4,
        "title": "Foundations: Learn How to Learn",
        "goal": "Build your foundation: learn verb forms, practice parts of speech, use your reference sheet, and make a small English study routine. Work one section at a time; after state testing, return to where you left off.",
        "items": [
          {
            "id": "vocab-oct-learning-flashcards",
            "activityId": "vocab-oct-learning",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Learning English: Flash Cards"
          },
          {
            "id": "verb-forms-overview",
            "href": "/grammar-reader/verb-forms-overview",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Verb Forms + Your Study Toolkit"
          },
          {
            "id": "vocab-oct-learning-matching",
            "activityId": "vocab-oct-learning",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Learning English: Matching"
          },
          {
            "id": "parts-of-speech-week-4",
            "activityId": "parts-of-speech-game",
            "href": "/activity/parts-of-speech-game?lesson=week-4-describing",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Week 4: Adjectives and Articles"
          },
          {
            "id": "vocab-oct-learning-fill-blank",
            "activityId": "vocab-oct-learning",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Learning English: Fill in the Blank"
          },
          {
            "id": "verb-quiz-1",
            "activityId": "verb-quiz-1",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 4 Quiz",
            "badge": "Guided"
          },
          {
            "id": "have-you-ever-speaking",
            "slot": "extra",
            "order": 8,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Conversation Practice: Telling Your Story"
          },
          {
            "id": "lived-worked-writing",
            "slot": "extra",
            "order": 9,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"When I came to the U.S.\""
          },
          {
            "id": "ed-endings-intro",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "extra",
            "order": 10,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Intro: /t/ /d/ /id/"
          },
          {
            "id": "ed-endings-game-extra",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "extra",
            "order": 11,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Game"
          },
          {
            "id": "helper-verb-repair",
            "activityId": "grammar-hospital-helper-repair-guided",
            "slot": "extra",
            "order": 12,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grammar Hospital: Helper Verb Repair"
          },
          {
            "id": "grammar-reference-scavenger-hunt",
            "slot": "extra",
            "order": 13,
            "wrappedGame": false,
            "activityType": "worksheet",
            "title": "Scavenger Hunt: Find It in Your Reference Sheet"
          }
        ]
      },
      {
        "id": "week-5",
        "number": 5,
        "title": "Digital Habits + Community Routines",
        "items": [
          {
            "id": "vocab-sep-w3-flashcards",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Digital Habits: Flash Cards"
          },
          {
            "id": "questions-real-answers",
            "href": "/grammar-reader/questions-real-answers",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Questions That Get Real Answers"
          },
          {
            "id": "be-or-do-questions",
            "activityId": "be-or-do-questions",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Be or Do?"
          },
          {
            "id": "question-word-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Question Word Practice Game"
          },
          {
            "id": "vocab-sep-w3-matching",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 4,
            "title": "Digital Habits: Matching"
          },
          {
            "id": "vocab-sep-w3-fill-blank",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Digital Habits: Fill in the Blank"
          },
          {
            "id": "parts-of-speech-week-5",
            "activityId": "parts-of-speech-game",
            "href": "/activity/parts-of-speech-game?lesson=week-5-subjects",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Week 5: Subjects and Verbs"
          },
          {
            "id": "verb-quiz-2",
            "activityId": "verb-quiz-2",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 5 Quiz"
          },
          {
            "id": "vocab-oct-w1-flashcards",
            "activityId": "vocab-oct-w1",
            "slot": "extra",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 8,
            "title": "Schedule Verbs: Flash Cards"
          },
          {
            "id": "vocab-oct-w1-matching",
            "activityId": "vocab-oct-w1",
            "slot": "extra",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 9,
            "title": "Schedule Verbs: Matching"
          },
          {
            "id": "vocab-oct-w1-fill-blank",
            "activityId": "vocab-oct-w1",
            "slot": "extra",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 10,
            "title": "Schedule Verbs: Fill in the Blank"
          }
        ],
        "goal": "Practice Digital Habits vocabulary, ask useful questions, and identify subjects and verbs."
      },
      {
        "id": "week-6",
        "number": 6,
        "title": "Getting Around: Directions + Digital Safety",
        "items": [
          {
            "id": "vocab-oct-w2-flashcards",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Transportation and Directions: Flash Cards"
          },
          {
            "id": "your-week-in-english",
            "href": "/grammar-reader/your-week-in-english",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Your Week in English"
          },
          {
            "id": "vocab-oct-w2-matching",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Transportation and Directions: Matching"
          },
          {
            "id": "vocab-oct-w2-fill-blank",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Transportation and Directions: Fill in the Blank"
          },
          {
            "id": "parts-of-speech-week-6",
            "activityId": "parts-of-speech-game",
            "href": "/activity/parts-of-speech-game?lesson=week-7-adverbs",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Week 6: Adjectives and Adverbs"
          },
          {
            "id": "verb-quiz-3",
            "activityId": "verb-quiz-3",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 6 Quiz"
          },
          {
            "id": "advisor-bulletin-scavenger-hunt",
            "slot": "extra",
            "order": 10,
            "wrappedGame": false,
            "activityType": "worksheet",
            "title": "Community Resources Scavenger Hunt"
          },
          {
            "id": "job-history-used-to-speaking",
            "slot": "extra",
            "order": 11,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Job History: What I Used to Do"
          }
        ],
        "goal": "I can describe my routine and give simple directions.",
        "reviewPractice": "Ask W5 questions about W1 routines."
      },
      {
        "id": "week-11",
        "number": 7,
        "title": "Our Voice, Our Vote",
        "goal": "I can describe a general result and a possible future result with if.",
        "items": [
          {
            "id": "vocab-oct-w5-flashcards",
            "activityId": "vocab-oct-w5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Voting and Community Voice: Flash Cards"
          },
          {
            "id": "zero-first-conditional",
            "href": "/grammar-reader/zero-first-conditional",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Zero + First Conditional: If This, Then That"
          },
          {
            "id": "contact-official-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Contact an Official Practice"
          },
          {
            "id": "vocab-oct-w5-matching",
            "activityId": "vocab-oct-w5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Voting and Community Voice: Matching"
          },
          {
            "id": "vocab-oct-w5-fill-blank",
            "activityId": "vocab-oct-w5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Voting and Community Voice: Fill in the Blank"
          },
          {
            "id": "verb-quiz-7",
            "activityId": "verb-quiz-7",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 7 Quiz"
          },
          {
            "id": "political-ads-fact-opinion",
            "slot": "extra",
            "order": 6,
            "wrappedGame": false,
            "activityType": "worksheet",
            "title": "Political Ads: Fact or Opinion?"
          },
          {
            "id": "lets-make-a-suggestion",
            "href": "/grammar-reader/lets-make-a-suggestion",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Let's Make a Suggestion"
          },
          {
            "id": "community-issue-discussion",
            "slot": "extra",
            "order": 8,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Community Issue Case Study: Discussion"
          }
        ],
        "reviewPractice": "Recall W6 present simple. Teach will + base verb before the first conditional."
      }
    ]
  },
  {
    "id": "unit-3",
    "number": 3,
    "title": "Community Participation",
    "month": "November",
    "weeks": [
      {
        "id": "week-8",
        "number": 8,
        "title": "Phone English + Family Connection",
        "items": [
          {
            "id": "vocab-oct-w4-flashcards",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Phone Communication: Flash Cards"
          },
          {
            "id": "can-should-must",
            "href": "/grammar-reader/can-should-must",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Can, Should, Must"
          },
          {
            "id": "b-v-minimal-pair",
            "activityId": "pron-b-v-listening",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V Minimal Pair Lab"
          },
          {
            "id": "vocab-oct-w4-matching",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Phone Communication: Matching"
          },
          {
            "id": "vocab-oct-w4-fill-blank",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Phone Communication: Fill in the Blank"
          },
          {
            "id": "verb-quiz-4",
            "activityId": "verb-quiz-4",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 8 Quiz"
          }
        ],
        "goal": "I can use can, should, and must in a short phone conversation.",
        "reviewPractice": "Recall W5 questions and W7 future results."
      },
      {
        "id": "week-9",
        "number": 9,
        "title": "Helping + Volunteering",
        "items": [
          {
            "id": "vocab-nov-w1-flashcards",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Volunteering: Flash Cards"
          },
          {
            "id": "have-you-ever",
            "href": "/grammar-reader/have-you-ever",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Have You Ever...?"
          },
          {
            "id": "just-already-yet",
            "href": "/grammar-reader/just-already-yet",
            "slot": "extra",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Just, Already, Yet",
            "badge": "Challenge"
          },
          {
            "id": "volunteering-scenario-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Volunteering Scenario Practice"
          },
          {
            "id": "vocab-nov-w1-matching",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 4,
            "title": "Volunteering: Matching"
          },
          {
            "id": "vocab-nov-w1-fill-blank",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Volunteering: Fill in the Blank"
          },
          {
            "id": "verb-quiz-5",
            "activityId": "verb-quiz-5",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 9 Quiz"
          }
        ],
        "goal": "I can ask about an experience and follow up with a past-simple question.",
        "reviewPractice": "Recall W4 V3 forms and W1 past simple for follow-up questions."
      },
      {
        "id": "week-10",
        "number": 10,
        "title": "Public Meetings + Suggestions",
        "items": [
          {
            "id": "vocab-nov-w2-flashcards",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Meetings and Suggestions: Flash Cards"
          },
          {
            "id": "what-are-you-good-at",
            "href": "/grammar-reader/what-are-you-good-at",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "What Are You Good At?"
          },
          {
            "id": "public-meeting-language",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Public Meeting Language Practice"
          },
          {
            "id": "vocab-nov-w2-matching",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Meetings and Suggestions: Matching"
          },
          {
            "id": "short-i-long-e-lab",
            "activityId": "pron-short-i-long-e-listening",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Short i vs Long e Minimal Pair Lab"
          },
          {
            "id": "vocab-nov-w2-fill-blank",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Meetings and Suggestions: Fill in the Blank"
          },
          {
            "id": "verb-quiz-6",
            "activityId": "verb-quiz-6",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 10 Quiz"
          }
        ],
        "goal": "I can describe what I am good at and interested in.",
        "reviewPractice": "Recall W8 can and W9 have you ever."
      }
    ]
  },
  {
    "id": "unit-4",
    "number": 4,
    "title": "Consumer Smarts",
    "month": "December",
    "weeks": [
      {
        "id": "week-13",
        "number": 11,
        "title": "How Long + For and Since",
        "items": [
          {
            "id": "vocab-dec-w1-flashcards",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Spending and Budgeting: Flash Cards"
          },
          {
            "id": "how-long-for-since-guide",
            "href": "/grammar-reader/how-long-for-since",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "How Long + For and Since"
          },
          {
            "id": "numbers-through-trillions",
            "activityId": "numbers-through-trillions-guided",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Numbers Through Trillions"
          },
          {
            "id": "vocab-dec-w1-matching",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Spending and Budgeting: Matching"
          },
          {
            "id": "compare-prices-practice",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Compare Prices Practice"
          },
          {
            "id": "vocab-dec-w1-fill-blank",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Spending and Budgeting: Fill in the Blank"
          },
          {
            "id": "verb-quiz-9",
            "activityId": "verb-quiz-9",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 11 Quiz"
          }
        ],
        "goal": "I can say how long something has continued using for and since.",
        "reviewPractice": "Recall W9 have/has + V3 and W4 verb forms."
      },
      {
        "id": "week-14",
        "number": 12,
        "title": "More, Less, the Most: Comparatives + Superlatives",
        "items": [
          {
            "id": "vocab-dec-w2-flashcards",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Returns and Financial Problems: Flash Cards"
          },
          {
            "id": "more-less-the-most",
            "href": "/grammar-reader/more-less-the-most",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "More, Less, the Most: Comparatives + Superlatives"
          },
          {
            "id": "bv-shorti-longe-review",
            "activityId": "pron-mixed-review",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V / Short i Long e Review"
          },
          {
            "id": "vocab-dec-w2-matching",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Returns and Financial Problems: Matching"
          },
          {
            "id": "vocab-dec-w2-fill-blank",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Returns and Financial Problems: Fill in the Blank"
          },
          {
            "id": "verb-quiz-10",
            "activityId": "verb-quiz-10",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 12 Quiz"
          }
        ],
        "goal": "I can compare two prices and identify the best option.",
        "reviewPractice": "Recall W11 money vocabulary and W6 routines."
      },
      {
        "id": "week-15",
        "number": 13,
        "title": "How Much / How Many: Countable + Uncountable",
        "goal": "I can ask about quantities using how much and how many.",
        "items": [
          {
            "id": "week-13-core-flashcards",
            "activityId": "vocab-dec-groceries",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grocery Shopping: Quantity, Value, and Waste: Flash Cards"
          },
          {
            "id": "how-much-how-many",
            "href": "/grammar-reader/how-much-how-many",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "How Much / How Many: Countable + Uncountable"
          },
          {
            "id": "countable-uncountable-game",
            "activityId": "countable-uncountable-nouns",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Countable vs Uncountable Practice"
          },
          {
            "id": "grocery-budget-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Grocery Budget Practice"
          },
          {
            "id": "week-13-core-matching",
            "activityId": "vocab-dec-groceries",
            "vocabUi": "matching",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grocery Shopping: Quantity, Value, and Waste: Matching"
          },
          {
            "id": "week-13-core-fill-blank",
            "activityId": "vocab-dec-groceries",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grocery Shopping: Quantity, Value, and Waste: Fill in the Blank"
          },
          {
            "id": "verb-quiz-11",
            "activityId": "verb-quiz-11",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 13 Quiz"
          }
        ],
        "reviewPractice": "Reuse W12 spending vocabulary. Complete the six core vocabulary items for this week; familiar words are deliberate new practice."
      },
      {
        "id": "week-16-econ",
        "number": 14,
        "title": "Understanding the News for Econ",
        "goal": "I can make a prediction about a simple chart.",
        "items": [
          {
            "id": "vocab-dec-w3-flashcards",
            "activityId": "vocab-dec-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Understanding Economic News: Flash Cards"
          },
          {
            "id": "reading-econ-news",
            "href": "/grammar-reader/reading-econ-news",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Understanding the News for Econ: Headlines + Charts"
          },
          {
            "id": "vocab-dec-w3-matching",
            "activityId": "vocab-dec-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Understanding Economic News: Matching"
          },
          {
            "id": "vocab-dec-w3-fill-blank",
            "activityId": "vocab-dec-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Understanding Economic News: Fill in the Blank"
          },
          {
            "id": "econ-news-headlines-practice",
            "slot": "extra",
            "order": 4,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Bring Your Own Headline: Discussion"
          },
          {
            "id": "econ-news-short-writing",
            "slot": "extra",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"Prices are higher than...\""
          }
        ],
        "reviewPractice": "Recall W7 if + present → will + base verb and W12 comparisons."
      },
      {
        "id": "week-15b",
        "number": 15,
        "title": "Fall Review + Class Party",
        "goal": "I can use familiar fall grammar in a short personal story.",
        "items": [
          {
            "id": "week-15-core-flashcards",
            "activityId": "vocab-dec-fall-review",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Fall Review: Six Useful Words and Phrases: Flash Cards"
          },
          {
            "id": "fall-review-six-tenses",
            "href": "/grammar-reader/fall-review-six-tenses",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Fall Review: Six Tenses You Know"
          },
          {
            "id": "catch-up-path-december",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-december",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-december",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "week-15-core-matching",
            "activityId": "vocab-dec-fall-review",
            "vocabUi": "matching",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Fall Review: Six Useful Words and Phrases: Matching"
          },
          {
            "id": "week-15-core-fill-blank",
            "activityId": "vocab-dec-fall-review",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Fall Review: Six Useful Words and Phrases: Fill in the Blank"
          },
          {
            "id": "verb-quiz-8",
            "activityId": "verb-quiz-8",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 15 Quiz"
          },
          {
            "id": "class-party-december",
            "slot": "extra",
            "order": 8,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Class Party"
          },
          {
            "id": "all-verb-tenses-overview-review",
            "href": "/grammar-reader/all-verb-tenses-overview",
            "slot": "extra",
            "order": 9,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "All Verb Tenses Overview",
            "badge": "Challenge"
          }
        ],
        "reviewPractice": "Reuse fall vocabulary and W14 future plans. Complete the six core vocabulary items for this week; familiar words are deliberate new practice."
      }
    ]
  },
  {
    "id": "unit-5",
    "number": 5,
    "title": "Housing & Renting",
    "month": "January",
    "weeks": [
      {
        "id": "week-16",
        "number": 16,
        "title": "Housing Basics",
        "items": [
          {
            "id": "vocab-jan-w1-flashcards",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Housing Basics: Flash Cards"
          },
          {
            "id": "asking-right-questions-housing",
            "href": "/grammar-reader/asking-right-questions-housing",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Asking the Right Questions About Housing"
          },
          {
            "id": "r-l-lab",
            "activityId": "pron-r-l-listening",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "R vs L Minimal Pair Lab"
          },
          {
            "id": "vocab-jan-w1-matching",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Housing Basics: Matching"
          },
          {
            "id": "vocab-jan-w1-fill-blank",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Housing Basics: Fill in the Blank"
          },
          {
            "id": "verb-quiz-12",
            "activityId": "verb-quiz-12",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 16 Quiz"
          },
          {
            "id": "parts-of-speech-refresh-extra",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "extra",
            "order": 6,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Refresh"
          }
        ],
        "goal": "I can ask a polite question about a rental listing.",
        "reviewPractice": "Recall W5 word order and W12 comparisons."
      },
      {
        "id": "week-17",
        "number": 17,
        "title": "Comparing Housing Options",
        "items": [
          {
            "id": "vocab-jan-w2-flashcards",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Comparing Housing Options: Flash Cards"
          },
          {
            "id": "have-to-dont-have-to-cant",
            "href": "/grammar-reader/have-to-dont-have-to-cant",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Have to, Don't Have to, Can't"
          },
          {
            "id": "compare-apartments",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Compare Apartments Practice"
          },
          {
            "id": "vocab-jan-w2-matching",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Comparing Housing Options: Matching"
          },
          {
            "id": "housing-description-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Housing Description Writing"
          },
          {
            "id": "vocab-jan-w2-fill-blank",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Comparing Housing Options: Fill in the Blank"
          },
          {
            "id": "verb-quiz-13",
            "activityId": "verb-quiz-13",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 17 Quiz"
          }
        ],
        "goal": "I can distinguish housing rules from optional choices.",
        "reviewPractice": "Recall W8 rules and W16 polite questions."
      },
      {
        "id": "week-18",
        "number": 18,
        "title": "Landlord Calls + Repair Requests",
        "items": [
          {
            "id": "vocab-jan-w3-flashcards",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Landlord Calls and Repair Requests: Flash Cards"
          },
          {
            "id": "need-to-find-a-place-infinitives",
            "href": "/grammar-reader/need-to-find-a-place-infinitives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I Need to Find a Place: Infinitives"
          },
          {
            "id": "repair-request-phone",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Phone English: Repair Request"
          },
          {
            "id": "vocab-jan-w3-matching",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Landlord Calls and Repair Requests: Matching"
          },
          {
            "id": "vocab-jan-w3-fill-blank",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Landlord Calls and Repair Requests: Fill in the Blank"
          },
          {
            "id": "verb-quiz-14",
            "activityId": "verb-quiz-14",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 18 Quiz"
          }
        ],
        "goal": "I can explain a housing need using need to, want to, or hope to.",
        "reviewPractice": "Recall W16 polite questions and W17 obligations."
      },
      {
        "id": "week-19",
        "number": 19,
        "title": "Housing Problems + Solutions",
        "items": [
          {
            "id": "vocab-jan-w4-flashcards",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Resolving Housing Problems: Flash Cards"
          },
          {
            "id": "it-was-happening-when",
            "href": "/grammar-reader/it-was-happening-when",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "It Was Happening When: Past Tenses in Housing Stories"
          },
          {
            "id": "housing-problem-scenario",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Housing Problem Scenario"
          },
          {
            "id": "vocab-jan-w4-matching",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Resolving Housing Problems: Matching"
          },
          {
            "id": "what-happened-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"What happened?\""
          },
          {
            "id": "vocab-jan-w4-fill-blank",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Resolving Housing Problems: Fill in the Blank"
          },
          {
            "id": "verb-quiz-15",
            "activityId": "verb-quiz-15",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 19 Quiz"
          }
        ],
        "goal": "I can describe what was happening when a housing problem occurred.",
        "reviewPractice": "Recall W1 past simple/continuous and W18 repair words."
      }
    ]
  },
  {
    "id": "unit-6",
    "number": 6,
    "title": "Workforce Preparation",
    "month": "February",
    "weeks": [
      {
        "id": "week-20",
        "number": 20,
        "title": "Resume + Workplace Basics",
        "items": [
          {
            "id": "vocab-feb-3-5-flashcards",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Work Experience and Expectations: Flash Cards"
          },
          {
            "id": "past-perfect",
            "href": "/grammar-reader/past-perfect",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Perfect: What Had Already Happened"
          },
          {
            "id": "resume-language-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Resume Language Practice"
          },
          {
            "id": "vocab-feb-3-5-matching",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Work Experience and Expectations: Matching"
          },
          {
            "id": "vocab-feb-3-5-fill-blank",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Work Experience and Expectations: Fill in the Blank"
          },
          {
            "id": "verb-quiz-16",
            "activityId": "verb-quiz-16",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 20 Quiz"
          }
        ],
        "goal": "I can show which of two past events happened first.",
        "reviewPractice": "Recall W4 V3 and W19 past events."
      },
      {
        "id": "week-21",
        "number": 21,
        "title": "Used to: Past Jobs and Routines",
        "items": [
          {
            "id": "vocab-feb-10-12-flashcards",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Past Jobs and Workplace Routines: Flash Cards"
          },
          {
            "id": "i-used-to-but-now-i",
            "href": "/grammar-reader/i-used-to-but-now-i",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I Used to, but Now I..."
          },
          {
            "id": "work-schedule-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Work Schedule Practice"
          },
          {
            "id": "vocab-feb-10-12-matching",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Past Jobs and Workplace Routines: Matching"
          },
          {
            "id": "v-w-lab",
            "activityId": "pron-v-w-listening",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "V vs W Minimal Pair Lab"
          },
          {
            "id": "vocab-feb-10-12-fill-blank",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Past Jobs and Workplace Routines: Fill in the Blank"
          },
          {
            "id": "verb-quiz-17",
            "activityId": "verb-quiz-17",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 21 Quiz"
          },
          {
            "id": "must-have-to-should-at-work",
            "href": "/grammar-reader/must-have-to-should-at-work",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Must, Have to, Should at Work",
            "badge": "Optional reference"
          }
        ],
        "goal": "I can compare a past job routine with my routine now.",
        "reviewPractice": "Review W8/W17 rules briefly: required, recommended, prohibited, optional."
      },
      {
        "id": "week-22",
        "number": 22,
        "title": "Second Conditional + Catch-Up",
        "items": [
          {
            "id": "week-22-core-flashcards",
            "activityId": "vocab-mar-31-apr-2",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Workplace Conversation and Clarification: Flash Cards"
          },
          {
            "id": "second-conditional-what-would-you-do",
            "href": "/grammar-reader/second-conditional-what-would-you-do",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Second Conditional: What Would You Do?"
          },
          {
            "id": "catch-up-path-february",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-february",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-february",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "week-22-core-matching",
            "activityId": "vocab-mar-31-apr-2",
            "vocabUi": "matching",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Workplace Conversation and Clarification: Matching"
          },
          {
            "id": "week-22-core-fill-blank",
            "activityId": "vocab-mar-31-apr-2",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Workplace Conversation and Clarification: Fill in the Blank"
          },
          {
            "id": "verb-quiz-18",
            "activityId": "verb-quiz-18",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 22 Quiz"
          }
        ],
        "goal": "I can answer a hypothetical question with if and would.",
        "reviewPractice": "Recall W7 first conditional. Short core lesson, then protected catch-up time. Complete the six core vocabulary items for this week; familiar words are deliberate new practice."
      },
      {
        "id": "week-23",
        "number": 23,
        "title": "Enjoy Doing vs. Want to Do at Work",
        "items": [
          {
            "id": "vocab-feb-24-26-flashcards",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Shifts and Attendance: Flash Cards"
          },
          {
            "id": "enjoy-doing-want-to-do",
            "href": "/grammar-reader/enjoy-doing-want-to-do",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Enjoy Doing vs. Want to Do"
          },
          {
            "id": "workplace-rights-scenario",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Workplace Rights Scenario Game"
          },
          {
            "id": "vocab-feb-24-26-matching",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Shifts and Attendance: Matching"
          },
          {
            "id": "at-work-have-to-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"At work, I have to...\""
          },
          {
            "id": "vocab-feb-24-26-fill-blank",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Shifts and Attendance: Fill in the Blank"
          },
          {
            "id": "verb-quiz-19",
            "activityId": "verb-quiz-19",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 23 Quiz"
          },
          {
            "id": "phrasal-verbs-at-work",
            "href": "/grammar-reader/phrasal-verbs-at-work",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Phrasal Verbs at Work",
            "badge": "Optional reference"
          }
        ],
        "goal": "I can describe what I enjoy doing and what I want to do at work.",
        "reviewPractice": "Recall W10 preposition + -ing and W18 to + verb. Keep phrasal verbs in vocabulary and speaking."
      }
    ]
  },
  {
    "id": "unit-7",
    "number": 7,
    "title": "Career Awareness",
    "month": "March",
    "weeks": [
      {
        "id": "week-24",
        "number": 24,
        "title": "Job Applications + Interviews",
        "items": [
          {
            "id": "vocab-mar-3-5-flashcards",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Job Applications and Interviews: Flash Cards"
          },
          {
            "id": "present-perfect-how-long",
            "href": "/grammar-reader/present-perfect-how-long",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Just, Already, Yet: The Job Search"
          },
          {
            "id": "interview-language-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Interview Language Practice"
          },
          {
            "id": "vocab-mar-3-5-matching",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Job Applications and Interviews: Matching"
          },
          {
            "id": "s-th-lab",
            "activityId": "pron-s-th-listening",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "S vs Th Minimal Pair Lab"
          },
          {
            "id": "vocab-mar-3-5-fill-blank",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Job Applications and Interviews: Fill in the Blank"
          },
          {
            "id": "verb-quiz-20",
            "activityId": "verb-quiz-20",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 24 Quiz"
          }
        ],
        "goal": "I can report job-search progress with already and yet.",
        "reviewPractice": "Recall W9/W11 present perfect and W23 phrasal verbs."
      },
      {
        "id": "week-25",
        "number": 25,
        "title": "Career Progress + Skills",
        "items": [
          {
            "id": "vocab-mar-10-12-flashcards",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Career Progress and Pay: Flash Cards"
          },
          {
            "id": "ive-been-working",
            "href": "/grammar-reader/ive-been-working",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I've Been Working: Present Perfect Continuous"
          },
          {
            "id": "timeline-perfect-continuous",
            "activityId": "timeline-tenses-perfect-continuous",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Perfect + Continuous"
          },
          {
            "id": "vocab-mar-10-12-matching",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Career Progress and Pay: Matching"
          },
          {
            "id": "how-long-speaking",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Speaking: \"How long have you been...?\""
          },
          {
            "id": "vocab-mar-10-12-fill-blank",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Career Progress and Pay: Fill in the Blank"
          },
          {
            "id": "verb-quiz-21",
            "activityId": "verb-quiz-21",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 25 Quiz"
          }
        ],
        "goal": "I can describe an activity continuing up to now.",
        "reviewPractice": "Recall W24 present perfect and W11 for/since."
      },
      {
        "id": "week-26",
        "number": 26,
        "title": "Past Perfect Continuous + Work Experience",
        "items": [
          {
            "id": "vocab-mar-17-19-flashcards",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Workplace Rights and Concerns: Flash Cards"
          },
          {
            "id": "past-perfect-continuous-work",
            "href": "/grammar-reader/past-perfect-continuous-work",
            "title": "Past Perfect Continuous: Before the Job Changed",
            "order": 2,
            "slot": "required",
            "wrappedGame": false,
            "activityType": "guide"
          },
          {
            "id": "pp-ppc-spiral",
            "activityId": "timeline-tenses-perfect-pair",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Present Perfect / PPC Spiral"
          },
          {
            "id": "vocab-mar-17-19-matching",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 4,
            "title": "Workplace Rights and Concerns: Matching"
          },
          {
            "id": "workplace-advocacy-scenarios",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Workplace Advocacy Scenarios"
          },
          {
            "id": "worked-been-working-writing",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"I have worked...\" / \"I have been working...\""
          },
          {
            "id": "vocab-mar-17-19-fill-blank",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 8,
            "title": "Workplace Rights and Concerns: Fill in the Blank"
          },
          {
            "id": "verb-quiz-22",
            "activityId": "verb-quiz-22",
            "slot": "required",
            "order": 10,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 26 Quiz"
          }
        ],
        "goal": "I can describe how long an activity had continued before a past event.",
        "reviewPractice": "Compare W25 duration up to now with W20 earlier-past events. Reuse familiar verbs."
      },
      {
        "id": "week-27",
        "number": 27,
        "title": "Passive Voice + Pay Stubs",
        "items": [
          {
            "id": "vocab-mar-31-apr-2-flashcards",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Feedback and Decisions: Flash Cards"
          },
          {
            "id": "passive-voice-what-was-done",
            "href": "/grammar-reader/passive-voice-what-was-done",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Passive Voice: What Was Done"
          },
          {
            "id": "vocab-mar-31-apr-2-matching",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Feedback and Decisions: Matching"
          },
          {
            "id": "vocab-mar-31-apr-2-fill-blank",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Feedback and Decisions: Fill in the Blank"
          },
          {
            "id": "verb-quiz-23",
            "activityId": "verb-quiz-23",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 27 Quiz"
          }
        ],
        "goal": "I can explain three items on a sample pay stub using passive sentences.",
        "reviewPractice": "Recall W20 V3 forms. Revisit W25 pay words: gross pay, deductions, benefits."
      }
    ]
  },
  {
    "id": "unit-8",
    "number": 8,
    "title": "Health & Healthcare",
    "month": "April",
    "weeks": [
      {
        "id": "week-28",
        "number": 28,
        "title": "Healthcare Basics",
        "items": [
          {
            "id": "vocab-apr-7-9-flashcards",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Describing Symptoms and Getting Care: Flash Cards"
          },
          {
            "id": "should-shouldnt-health-advice",
            "href": "/grammar-reader/should-shouldnt-health-advice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "You Should, You Shouldn't: Health Advice"
          },
          {
            "id": "sh-ch-lab",
            "activityId": "pron-sh-ch-listening",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Sh vs Ch Minimal Pair Lab"
          },
          {
            "id": "vocab-apr-7-9-matching",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Describing Symptoms and Getting Care: Matching"
          },
          {
            "id": "vocab-apr-7-9-fill-blank",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Describing Symptoms and Getting Care: Fill in the Blank"
          },
          {
            "id": "verb-quiz-24",
            "activityId": "verb-quiz-24",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 28 Quiz"
          }
        ],
        "goal": "I can give advice and distinguish it from a stronger warning.",
        "reviewPractice": "Recall W8 advice and W17 rules."
      },
      {
        "id": "week-29",
        "number": 29,
        "title": "Symptoms + Clinic Visits",
        "items": [
          {
            "id": "vocab-apr-14-16-flashcards",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Recovery and Changing Habits: Flash Cards"
          },
          {
            "id": "stop-taking-or-stop-to-take",
            "href": "/grammar-reader/stop-taking-or-stop-to-take",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Stop Taking It or Stop to Take It?"
          },
          {
            "id": "doctor-conversation-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Doctor Conversation Practice"
          },
          {
            "id": "vocab-apr-14-16-matching",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Recovery and Changing Habits: Matching"
          },
          {
            "id": "vocab-apr-14-16-fill-blank",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Recovery and Changing Habits: Fill in the Blank"
          },
          {
            "id": "verb-quiz-25",
            "activityId": "verb-quiz-25",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 29 Quiz"
          }
        ],
        "goal": "I can explain the difference between stop doing and stop to do.",
        "reviewPractice": "Recall W23 enjoy doing / want to do; revise one sentence after feedback."
      },
      {
        "id": "week-30",
        "number": 30,
        "title": "The Doctor Said + Catch-Up",
        "items": [
          {
            "id": "week-30-core-flashcards",
            "activityId": "vocab-apr-w30-review",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Doctor Follow-Up: Six-Item Review: Flash Cards"
          },
          {
            "id": "doctor-said-reported-speech",
            "href": "/grammar-reader/doctor-said-reported-speech",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "The Doctor Said: Reported Speech"
          },
          {
            "id": "catch-up-path-april",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-april",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-april",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "week-30-core-matching",
            "activityId": "vocab-apr-w30-review",
            "vocabUi": "matching",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Doctor Follow-Up: Six-Item Review: Matching"
          },
          {
            "id": "week-30-core-fill-blank",
            "activityId": "vocab-apr-w30-review",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Doctor Follow-Up: Six-Item Review: Fill in the Blank"
          },
          {
            "id": "verb-quiz-26",
            "activityId": "verb-quiz-26",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 30 Quiz"
          }
        ],
        "goal": "I can report one statement and one instruction from a conversation.",
        "reviewPractice": "Recall W18 to + verb and W19 past forms. Short core lesson, then protected catch-up time. Complete the six core vocabulary items for this week; familiar words are deliberate new practice."
      },
      {
        "id": "week-31",
        "number": 31,
        "title": "Third Conditional + Pharmacy",
        "items": [
          {
            "id": "vocab-apr-28-30-flashcards",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Pharmacy Communication: Flash Cards"
          },
          {
            "id": "third-conditional-what-would-have-happened",
            "href": "/grammar-reader/third-conditional-what-would-have-happened",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Third Conditional: What Would Have Happened"
          },
          {
            "id": "mychart-message-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "MyChart Message Practice"
          },
          {
            "id": "vocab-apr-28-30-matching",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Pharmacy Communication: Matching"
          },
          {
            "id": "vocab-apr-28-30-fill-blank",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Pharmacy Communication: Fill in the Blank"
          },
          {
            "id": "verb-quiz-27",
            "activityId": "verb-quiz-27",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 31 Quiz"
          }
        ],
        "goal": "I can describe an imagined different result in the past.",
        "reviewPractice": "Recall W20 had + V3 and W22 hypothetical results."
      }
    ]
  },
  {
    "id": "unit-9",
    "number": 9,
    "title": "Holistic Wellness",
    "month": "May",
    "weeks": [
      {
        "id": "week-32",
        "number": 32,
        "title": "Future Perfect + Wellness Goals",
        "items": [
          {
            "id": "vocab-may-5-7-flashcards",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Treatment and Wellness Goals: Flash Cards"
          },
          {
            "id": "future-perfect-goals",
            "href": "/grammar-reader/future-perfect-goals",
            "title": "Future Perfect: Goals and Milestones",
            "order": 1,
            "slot": "required",
            "wrappedGame": false,
            "activityType": "guide"
          },
          {
            "id": "mychart-follow-up",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "MyChart Follow-Up Practice"
          },
          {
            "id": "vocab-may-5-7-matching",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Treatment and Wellness Goals: Matching"
          },
          {
            "id": "p-b-lab",
            "activityId": "pron-p-b-listening",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "P vs B Minimal Pair Lab"
          },
          {
            "id": "vocab-may-5-7-fill-blank",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Treatment and Wellness Goals: Fill in the Blank"
          },
          {
            "id": "verb-quiz-28",
            "activityId": "verb-quiz-28",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 32 Quiz"
          }
        ],
        "goal": "I can describe a goal that will be completed by a future date.",
        "reviewPractice": "Recall W14 will + base verb and W20 V3. Focus on one small completed milestone."
      },
      {
        "id": "week-33",
        "number": 33,
        "title": "Be Used to + Still Adjusting",
        "items": [
          {
            "id": "vocab-may-12-14-flashcards",
            "activityId": "vocab-may-12-14",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Stress and Adjustment: Flash Cards"
          },
          {
            "id": "be-used-to-get-used-to",
            "href": "/grammar-reader/be-used-to-get-used-to",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Be Used to / Get Used to"
          },
          {
            "id": "vocab-may-12-14-matching",
            "activityId": "vocab-may-12-14",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Stress and Adjustment: Matching"
          },
          {
            "id": "vocab-may-12-14-fill-blank",
            "activityId": "vocab-may-12-14",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Stress and Adjustment: Fill in the Blank"
          },
          {
            "id": "verb-quiz-29",
            "activityId": "verb-quiz-29",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 33 Quiz"
          }
        ],
        "goal": "I can describe what feels familiar and what I am still adjusting to.",
        "reviewPractice": "Recall W21 used to; contrast past habits with familiarity now. Review preposition + -ing."
      },
      {
        "id": "week-34",
        "number": 34,
        "title": "All Four Conditionals + One Bad Week",
        "items": [
          {
            "id": "vocab-may-19-21-flashcards",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Food, Remedies, and Recovery: Flash Cards"
          },
          {
            "id": "all-four-conditionals-quick-tour",
            "href": "/grammar-reader/all-four-conditionals-quick-tour",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "All Four Conditionals: A Quick Tour"
          },
          {
            "id": "healthy-habits-scenario",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Healthy Habits Scenario Game"
          },
          {
            "id": "vocab-may-19-21-matching",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Food, Remedies, and Recovery: Matching"
          },
          {
            "id": "sleep-better-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If I sleep better, I will...\""
          },
          {
            "id": "vocab-may-19-21-fill-blank",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Food, Remedies, and Recovery: Fill in the Blank"
          },
          {
            "id": "verb-quiz-30",
            "activityId": "verb-quiz-30",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 34 Quiz"
          }
        ],
        "goal": "I can choose a conditional that matches the situation.",
        "reviewPractice": "Recall W7/W22/W31 conditionals; add a short W23/W29 verb-pattern warm-up."
      },
      {
        "id": "week-35",
        "number": 35,
        "title": "Future Perfect Continuous + Year-End Progress",
        "items": [
          {
            "id": "vocab-may-26-28-flashcards",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Reflecting on Progress: Flash Cards"
          },
          {
            "id": "future-perfect-continuous-progress",
            "href": "/grammar-reader/future-perfect-continuous-progress",
            "title": "Future Perfect Continuous: Looking Back from June",
            "order": 1,
            "slot": "required",
            "wrappedGame": false,
            "activityType": "guide"
          },
          {
            "id": "speaking-game",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Speaking Game"
          },
          {
            "id": "vocab-may-26-28-matching",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Reflecting on Progress: Matching"
          },
          {
            "id": "b-v-refresh",
            "activityId": "pron-b-v-listening",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V Refresh"
          },
          {
            "id": "vocab-may-26-28-fill-blank",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Reflecting on Progress: Fill in the Blank"
          },
          {
            "id": "verb-quiz-31",
            "activityId": "verb-quiz-31",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 35 Quiz"
          },
          {
            "id": "gerunds-infinitives-full-review",
            "href": "/grammar-reader/gerunds-infinitives-full-review",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Gerunds + Infinitives: Full Review",
            "badge": "Optional reference"
          }
        ],
        "goal": "I can say how long an activity will have continued by a future date.",
        "reviewPractice": "Recall W32 completed results and W25/W26 duration. Use one future duration pattern."
      }
    ]
  },
  {
    "id": "unit-10",
    "number": 10,
    "title": "Year in Review & Next Steps",
    "month": "June",
    "weeks": [
      {
        "id": "week-36",
        "number": 36,
        "title": "All the Tenses: A Year in Review",
        "items": [
          {
            "id": "vocab-jun-2-4-flashcards",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Next Steps: Flash Cards"
          },
          {
            "id": "all-the-tenses-year-in-review",
            "href": "/grammar-reader/all-the-tenses-year-in-review",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "All the Tenses: A Year in Review"
          },
          {
            "id": "timeline-full-year-challenge",
            "activityId": "timeline-tenses-all-challenge",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Full Year Challenge"
          },
          {
            "id": "vocab-jun-2-4-matching",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Next Steps: Matching"
          },
          {
            "id": "mixed-pronunciation-review",
            "activityId": "pron-mixed-review",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Mixed Pronunciation Review"
          },
          {
            "id": "vocab-jun-2-4-fill-blank",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Next Steps: Fill in the Blank"
          },
          {
            "id": "post-test-window",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "assessment",
            "title": "Post-Test Window"
          },
          {
            "id": "final-reflection-writing-jun-extra",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Final Reflection: \"I have learned...\""
          },
          {
            "id": "future-goals-writing-jun-extra",
            "slot": "extra",
            "order": 8,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Future Goals Writing"
          },
          {
            "id": "practice-library-tour-jun-extra",
            "slot": "extra",
            "order": 9,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Practice Library Tour"
          },
          {
            "id": "end-of-year-party-jun-extra",
            "slot": "extra",
            "order": 10,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "End-of-Year Party"
          },
          {
            "id": "verb-quiz-32",
            "activityId": "verb-quiz-32",
            "slot": "extra",
            "order": 11,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 36 Bonus Quiz 1"
          },
          {
            "id": "verb-quiz-33",
            "activityId": "verb-quiz-33",
            "slot": "extra",
            "order": 12,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 36 Bonus Quiz 2"
          },
          {
            "id": "verb-quiz-34",
            "activityId": "verb-quiz-34",
            "slot": "extra",
            "order": 13,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Week 36 Bonus Quiz 3"
          }
        ],
        "goal": "I can describe events, results, and durations across past, present, and future.",
        "reviewPractice": "Review W26, W32, and W35 alongside earlier tenses. Future continuous is preview only."
      }
    ]
  }
];

// Keep pronunciation practice attached to the vocabulary already selected for each week.
for (const unit of COURSE_MAP_UNITS) {
  for (const week of unit.weeks) {
    const vocabulary = week.items.find(item => rescueWeeks.some(set => item.activityId === `vocab-${set.id}`));
    const collection = rescueWeeks.find(set => vocabulary?.activityId === `vocab-${set.id}`);
    if (!collection) continue;
    const order = Math.min(0, ...week.items.map(item => item.order));
    for (const item of week.items) if (item.order >= order) item.order += 1;
    week.items.unshift({
      id: `${week.id}-word-rescue`, activityId: 'word-rescue',
      href: `/activity/word-rescue?collection=${encodeURIComponent(collection.id)}&fromMap=1&returnTo=${encodeURIComponent(`/dashboard/map?week=${week.number}#week-${week.number}`)}`,
      slot: 'required', order,
      wrappedGame: false, activityType: 'pronunciation', title: `Word Lab · ${collection.words.length} words`,
    });
  }
}
