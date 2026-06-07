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
}

export interface CourseWeekDef {
  id: string;
  number: number;
  title: string;
  goal?: string;
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
        "goal": "Get comfortable in the app, learn the five verb form codes, and take Verb Quiz 1.",
        "items": [
          {
            "id": "vocab-sep-w1-flashcards",
            "activityId": "vocab-sep-w1",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits — Flash Cards"
          },
          {
            "id": "welcome-how-to-use-app",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Welcome / How to Use the App"
          },
          {
            "id": "welcome-back-tenses-review",
            "href": "/grammar-reader/welcome-back-tenses-review",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Welcome Back: Simple & Continuous Review + V3 Preview"
          },
          {
            "id": "verb-forms-overview",
            "href": "/grammar-reader/verb-forms-overview",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Verb Forms: V1 → V3"
          },
          {
            "id": "timeline-tenses-week1-intro",
            "activityId": "timeline-tenses-simple",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Simple & Continuous"
          },
          {
            "id": "vocab-sep-w1-matching",
            "activityId": "vocab-sep-w1",
            "vocabUi": "matching",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits — Matching"
          },
          {
            "id": "vocab-sep-w1-fill-blank",
            "activityId": "vocab-sep-w1",
            "vocabUi": "fill-blank",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits — Fill in the Blank"
          },
          {
            "id": "verb-quiz-1",
            "activityId": "verb-quiz-1",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 1: be + have"
          }
        ]
      },
      {
        "id": "week-2",
        "number": 2,
        "title": "Parts of Speech + App Habit",
        "goal": "Learn the basic building blocks of English and start the weekly app routine.",
        "items": [
          {
            "id": "vocab-sep-w2-flashcards",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Key Verbs — Flash Cards"
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
            "id": "parts-of-speech-discovery",
            "activityId": "parts-of-speech-discovery-guided",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Parts of Speech Discovery Game"
          },
          {
            "id": "vocab-sep-w2-matching",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Key Verbs — Matching"
          },
          {
            "id": "helper-verb-repair",
            "activityId": "grammar-hospital-helper-repair-guided",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grammar Hospital: Helper Verb Repair"
          },
          {
            "id": "vowel-names-a-e-i",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "pronunciation",
            "title": "Vowel Names Practice: A / E / I"
          },
          {
            "id": "vocab-sep-w2-fill-blank",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 6,
            "title": "Vocab: Key Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-2",
            "activityId": "verb-quiz-2",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 2: do + make"
          },
          {
            "id": "parts-of-speech-library",
            "activityId": "parts-of-speech-game",
            "slot": "extra",
            "order": 8,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Full Parts of Speech Practice Library"
          }
        ]
      },
      {
        "id": "week-3",
        "number": 3,
        "title": "Verb Forms + Past -ed Sounds",
        "goal": "Practice verb forms in context and learn the three -ed ending sounds.",
        "items": [
          {
            "id": "vocab-sep-w3-flashcards",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Action Words — Flash Cards"
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
            "id": "timeline-verb-forms-review",
            "activityId": "timeline-tenses-simple",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Verb Forms Review"
          },
          {
            "id": "vocab-sep-w3-matching",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Action Words — Matching"
          },
          {
            "id": "ed-endings-intro",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "required",
            "order": 4,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Intro: /t/ /d/ /id/"
          },
          {
            "id": "vocab-sep-w3-fill-blank",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Vocab: Action Words — Fill in the Blank"
          },
          {
            "id": "verb-quiz-3",
            "activityId": "verb-quiz-3",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 3: go + come"
          },
          {
            "id": "ed-endings-game-extra",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "extra",
            "order": 7,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Game"
          }
        ]
      },
      {
        "id": "week-4",
        "number": 4,
        "title": "Past Simple + Past Continuous: Telling the Story",
        "goal": "Use past simple for finished actions and past continuous for what was already in progress.",
        "items": [
          {
            "id": "vocab-sep-w4-flashcards",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Personal Journey Verbs — Flash Cards"
          },
          {
            "id": "past-simple-past-continuous-guide",
            "href": "/grammar-reader/past-simple-past-continuous",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Simple + Past Continuous: Telling the Story"
          },
          {
            "id": "have-you-ever-speaking",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Conversation Practice: Telling Your Story"
          },
          {
            "id": "vocab-sep-w4-matching",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Personal Journey Verbs — Matching"
          },
          {
            "id": "lived-worked-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"When I came to the U.S.\""
          },
          {
            "id": "vocab-sep-w4-fill-blank",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Vocab: Personal Journey Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-4",
            "activityId": "verb-quiz-4",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 4: find + buy"
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
        "id": "week-5",
        "number": 5,
        "title": "Community Routines: Just, Already, Yet",
        "items": [
          {
            "id": "vocab-oct-w1-flashcards",
            "activityId": "vocab-oct-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Schedule Verbs — Flash Cards"
          },
          {
            "id": "just-already-yet",
            "href": "/grammar-reader/just-already-yet",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Just, Already, Yet"
          },
          {
            "id": "question-word-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Question Word Practice Game"
          },
          {
            "id": "vocab-oct-w1-matching",
            "activityId": "vocab-oct-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Schedule Verbs — Matching"
          },
          {
            "id": "vocab-oct-w1-fill-blank",
            "activityId": "vocab-oct-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Schedule Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-5",
            "activityId": "verb-quiz-5",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 5: keep + build"
          }
        ]
      },
      {
        "id": "week-6",
        "number": 6,
        "title": "Getting Around + Digital Safety",
        "items": [
          {
            "id": "vocab-oct-w2-flashcards",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Protect Yourself Verbs — Flash Cards"
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
            "id": "map-directions-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Map / Directions Practice Game"
          },
          {
            "id": "vocab-oct-w2-matching",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Protect Yourself Verbs — Matching"
          },
          {
            "id": "vocab-oct-w2-fill-blank",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Protect Yourself Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-6",
            "activityId": "verb-quiz-6",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 6: pay + hold"
          }
        ]
      },
      {
        "id": "week-7",
        "number": 7,
        "title": "Getting There: Directions + Community",
        "items": [
          {
            "id": "vocab-oct-w3-flashcards",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Movement Verbs — Flash Cards"
          },
          {
            "id": "getting-there-directions",
            "href": "/grammar-reader/getting-there-directions",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Getting There: Directions + Imperatives"
          },
          {
            "id": "scam-or-safe-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Directions Practice Game"
          },
          {
            "id": "vocab-oct-w3-matching",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Movement Verbs — Matching"
          },
          {
            "id": "vocab-oct-w3-fill-blank",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Movement Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-7",
            "activityId": "verb-quiz-7",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 7: break + leave"
          }
        ]
      },
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
            "title": "Vocab: Communication Verbs — Flash Cards"
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
            "title": "Vocab: Communication Verbs — Matching"
          },
          {
            "id": "vocab-oct-w4-fill-blank",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Communication Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-8",
            "activityId": "verb-quiz-8",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 8: sell + cut"
          }
        ]
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
            "title": "Vocab: Action Verbs — Flash Cards"
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
            "id": "volunteering-scenario-practice",
            "slot": "required",
            "order": 2,
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
            "order": 3,
            "title": "Vocab: Action Verbs — Matching"
          },
          {
            "id": "vocab-nov-w1-fill-blank",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Action Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-9",
            "activityId": "verb-quiz-9",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 9: freeze + steal"
          }
        ]
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
            "title": "Vocab: Discussion Verbs — Flash Cards"
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
            "title": "Vocab: Discussion Verbs — Matching"
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
            "title": "Vocab: Discussion Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-10",
            "activityId": "verb-quiz-10",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 10: call + fix"
          }
        ]
      },
      {
        "id": "week-11",
        "number": 11,
        "title": "Voting + Contacting Officials",
        "items": [
          {
            "id": "vocab-nov-w3-flashcards",
            "activityId": "vocab-nov-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Civic Verbs — Flash Cards"
          },
          {
            "id": "lets-make-a-suggestion",
            "href": "/grammar-reader/lets-make-a-suggestion",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Let's Make a Suggestion"
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
            "id": "vocab-nov-w3-matching",
            "activityId": "vocab-nov-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Civic Verbs — Matching"
          },
          {
            "id": "vocab-nov-w3-fill-blank",
            "activityId": "vocab-nov-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Civic Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-11",
            "activityId": "verb-quiz-11",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 11: sleep + wake"
          }
        ]
      },
      {
        "id": "week-12",
        "number": 12,
        "title": "Community Issue Case Study",
        "items": [
          {
            "id": "vocab-nov-w4-flashcards",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Problem-Solving Verbs — Flash Cards"
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
            "id": "community-problem-scenario",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Community Problem Scenario Game"
          },
          {
            "id": "vocab-nov-w4-matching",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Problem-Solving Verbs — Matching"
          },
          {
            "id": "if-we-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If we..., we will...\""
          },
          {
            "id": "vocab-nov-w4-fill-blank",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Vocab: Problem-Solving Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-12",
            "activityId": "verb-quiz-12",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 12: eat + drink"
          }
        ]
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
        "number": 13,
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
            "title": "Vocab: Money Verbs — Flash Cards"
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
            "title": "Vocab: Money Verbs — Matching"
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
            "title": "Vocab: Money Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-13",
            "activityId": "verb-quiz-13",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 13: sit + spend"
          }
        ],
        "goal": "Talk about how long you have lived, worked, and kept the same phone plan while hunting for something cheaper."
      },
      {
        "id": "week-14",
        "number": 14,
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
            "title": "Vocab: Financial Action Verbs — Flash Cards"
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
            "title": "Vocab: Financial Action Verbs — Matching"
          },
          {
            "id": "vocab-dec-w2-fill-blank",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Financial Action Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-14",
            "activityId": "verb-quiz-14",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 14: cost + lend"
          }
        ],
        "goal": "Compare prices, phone plans, and apartment listings when stretching a paycheck."
      },
      {
        "id": "week-15",
        "number": 15,
        "title": "How Much / How Many: Countable + Uncountable",
        "goal": "Use much, many, a lot of, a few, and a little when feeding a family on a budget.",
        "items": [
          {
            "id": "how-much-how-many",
            "href": "/grammar-reader/how-much-how-many",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "How Much / How Many: Countable + Uncountable"
          },
          {
            "id": "countable-uncountable-game",
            "activityId": "countable-uncountable-nouns",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Countable vs Uncountable Practice"
          },
          {
            "id": "grocery-budget-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Grocery Budget Practice"
          },
          {
            "id": "verb-quiz-15-dec",
            "activityId": "verb-quiz-15",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 15: give + send"
          }
        ]
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
            "title": "Vocab: Renter Verbs — Flash Cards"
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
            "title": "Vocab: Renter Verbs — Matching"
          },
          {
            "id": "vocab-jan-w1-fill-blank",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Renter Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-16",
            "activityId": "verb-quiz-16",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 16: write + submit"
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
        ]
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
            "title": "Vocab: Decision Verbs — Flash Cards"
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
            "title": "Vocab: Decision Verbs — Matching"
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
            "title": "Vocab: Decision Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-17",
            "activityId": "verb-quiz-17",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 17: work + apply"
          }
        ]
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
            "title": "Vocab: Maintenance Verbs — Flash Cards"
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
            "title": "Vocab: Maintenance Verbs — Matching"
          },
          {
            "id": "vocab-jan-w3-fill-blank",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Maintenance Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-18",
            "activityId": "verb-quiz-18",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 18: meet + speak"
          }
        ]
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
            "title": "Vocab: Resolution Verbs — Flash Cards"
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
            "title": "Vocab: Resolution Verbs — Matching"
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
            "title": "Vocab: Resolution Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-19",
            "activityId": "verb-quiz-19",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 19: tell + say"
          }
        ]
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
            "title": "Vocab: Jobs Foundations — Flash Cards"
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
            "title": "Vocab: Jobs Foundations — Matching"
          },
          {
            "id": "vocab-feb-3-5-fill-blank",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Jobs Foundations — Fill in the Blank"
          },
          {
            "id": "verb-quiz-20",
            "activityId": "verb-quiz-20",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 20: hear + understand"
          }
        ]
      },
      {
        "id": "week-21",
        "number": 21,
        "title": "Workplace Rules + Must, Have To, Should",
        "items": [
          {
            "id": "vocab-feb-10-12-flashcards",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Rules & Obligation at Work — Flash Cards"
          },
          {
            "id": "must-have-to-should-at-work",
            "href": "/grammar-reader/must-have-to-should-at-work",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Must, Have to, Should at Work"
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
            "title": "Vocab: Rules & Obligation at Work — Matching"
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
            "title": "Vocab: Rules & Obligation at Work — Fill in the Blank"
          },
          {
            "id": "verb-quiz-21",
            "activityId": "verb-quiz-21",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 21: see + run"
          }
        ]
      },
      {
        "id": "week-22",
        "number": 22,
        "title": "Second Conditional + Catch-Up",
        "items": [
          {
            "id": "second-conditional-what-would-you-do",
            "href": "/grammar-reader/second-conditional-what-would-you-do",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Second Conditional: What Would You Do?"
          },
          {
            "id": "catch-up-path-february",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-february",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-february",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "verb-quiz-22",
            "activityId": "verb-quiz-22",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 22: win + catch"
          }
        ]
      },
      {
        "id": "week-23",
        "number": 23,
        "title": "Phrasal Verbs at Work + Workplace Rights",
        "items": [
          {
            "id": "vocab-feb-24-26-flashcards",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Workplace Phrasal Verbs — Flash Cards"
          },
          {
            "id": "phrasal-verbs-at-work",
            "href": "/grammar-reader/phrasal-verbs-at-work",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Phrasal Verbs at Work"
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
            "title": "Vocab: Workplace Phrasal Verbs — Matching"
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
            "title": "Vocab: Workplace Phrasal Verbs — Fill in the Blank"
          },
          {
            "id": "verb-quiz-23",
            "activityId": "verb-quiz-23",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 23: confirm + stand"
          }
        ]
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
            "title": "Vocab: Experience & Timelines — Flash Cards"
          },
          {
            "id": "present-perfect-how-long",
            "href": "/grammar-reader/present-perfect-how-long",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect + How Long"
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
            "title": "Vocab: Experience & Timelines — Matching"
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
            "title": "Vocab: Experience & Timelines — Fill in the Blank"
          },
          {
            "id": "verb-quiz-24",
            "activityId": "verb-quiz-24",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 24: choose + report"
          }
        ]
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
            "title": "Vocab: Skills & Qualifications — Flash Cards"
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
            "title": "Vocab: Skills & Qualifications — Matching"
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
            "title": "Vocab: Skills & Qualifications — Fill in the Blank"
          },
          {
            "id": "verb-quiz-25",
            "activityId": "verb-quiz-25",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 25: wear + begin"
          }
        ]
      },
      {
        "id": "week-26",
        "number": 26,
        "title": "Work Experience + Advocacy",
        "items": [
          {
            "id": "vocab-mar-17-19-flashcards",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Communication & Feedback — Flash Cards"
          },
          {
            "id": "vocab-mar-24-26-flashcards",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 1,
            "title": "Vocab: Small Talk at Work — Flash Cards"
          },
          {
            "id": "enjoy-doing-want-to-do",
            "href": "/grammar-reader/enjoy-doing-want-to-do",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Enjoy Doing vs. Want to Do"
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
            "title": "Vocab: Communication & Feedback — Matching"
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
            "id": "vocab-mar-24-26-matching",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 6,
            "title": "Vocab: Small Talk at Work — Matching"
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
            "title": "Vocab: Communication & Feedback — Fill in the Blank"
          },
          {
            "id": "vocab-mar-24-26-fill-blank",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 9,
            "title": "Vocab: Small Talk at Work — Fill in the Blank"
          },
          {
            "id": "verb-quiz-26",
            "activityId": "verb-quiz-26",
            "slot": "required",
            "order": 10,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 26: teach + fight"
          }
        ]
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
            "title": "Vocab: Feedback & Decision-Making — Flash Cards"
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
            "title": "Vocab: Feedback & Decision-Making — Matching"
          },
          {
            "id": "vocab-mar-31-apr-2-fill-blank",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Vocab: Feedback & Decision-Making — Fill in the Blank"
          },
          {
            "id": "verb-quiz-27",
            "activityId": "verb-quiz-27",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 27: put + hurt"
          }
        ]
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
            "title": "Vocab: Symptoms & Expectations — Flash Cards"
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
            "title": "Vocab: Symptoms & Expectations — Matching"
          },
          {
            "id": "vocab-apr-7-9-fill-blank",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Symptoms & Expectations — Fill in the Blank"
          },
          {
            "id": "verb-quiz-28",
            "activityId": "verb-quiz-28",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 28: hit + quit"
          }
        ]
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
            "title": "Vocab: Symptoms & Care — Flash Cards"
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
            "title": "Vocab: Symptoms & Care — Matching"
          },
          {
            "id": "vocab-apr-14-16-fill-blank",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Symptoms & Care — Fill in the Blank"
          },
          {
            "id": "verb-quiz-29",
            "activityId": "verb-quiz-29",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 29: get + know"
          }
        ]
      },
      {
        "id": "week-30",
        "number": 30,
        "title": "The Doctor Said + Catch-Up",
        "items": [
          {
            "id": "doctor-said-reported-speech",
            "href": "/grammar-reader/doctor-said-reported-speech",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "The Doctor Said: Reported Speech"
          },
          {
            "id": "catch-up-path-april",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-april",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-april",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "verb-quiz-30",
            "activityId": "verb-quiz-30",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 30: read + think"
          }
        ]
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
            "title": "Vocab: Health Advice & Habits — Flash Cards"
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
            "title": "Vocab: Health Advice & Habits — Matching"
          },
          {
            "id": "vocab-apr-28-30-fill-blank",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Health Advice & Habits — Fill in the Blank"
          },
          {
            "id": "verb-quiz-31",
            "activityId": "verb-quiz-31",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 31: drive + ride"
          }
        ]
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
        "title": "I Used to + Wellness",
        "items": [
          {
            "id": "vocab-may-5-7-flashcards",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Your Body & Wellness — Flash Cards"
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
            "title": "Vocab: Your Body & Wellness — Matching"
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
            "title": "Vocab: Your Body & Wellness — Fill in the Blank"
          },
          {
            "id": "verb-quiz-32",
            "activityId": "verb-quiz-32",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 32: feel + grow"
          }
        ]
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
            "title": "Vocab: Daily Care & Nutrition — Flash Cards"
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
            "title": "Vocab: Daily Care & Nutrition — Matching"
          },
          {
            "id": "vocab-may-12-14-fill-blank",
            "activityId": "vocab-may-12-14",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 3,
            "title": "Vocab: Daily Care & Nutrition — Fill in the Blank"
          },
          {
            "id": "verb-quiz-33",
            "activityId": "verb-quiz-33",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 33: take + bring"
          }
        ]
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
            "title": "Vocab: Life Skills & Habits — Flash Cards"
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
            "title": "Vocab: Life Skills & Habits — Matching"
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
            "title": "Vocab: Life Skills & Habits — Fill in the Blank"
          },
          {
            "id": "verb-quiz-34",
            "activityId": "verb-quiz-34",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 34: fall + lose"
          }
        ]
      },
      {
        "id": "week-35",
        "number": 35,
        "title": "Gerunds + Infinitives + Packed Week",
        "items": [
          {
            "id": "vocab-may-26-28-flashcards",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Holistic Health Review — Flash Cards"
          },
          {
            "id": "gerunds-infinitives-full-review",
            "href": "/grammar-reader/gerunds-infinitives-full-review",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Gerunds + Infinitives: Full Review"
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
            "title": "Vocab: Holistic Health Review — Matching"
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
            "title": "Vocab: Holistic Health Review — Fill in the Blank"
          }
        ]
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
            "title": "Vocab: Wrap-Up & Next Steps — Flash Cards"
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
            "title": "Vocab: Wrap-Up & Next Steps — Matching"
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
            "title": "Vocab: Wrap-Up & Next Steps — Fill in the Blank"
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
          }
        ]
      }
    ]
  }
]
;
