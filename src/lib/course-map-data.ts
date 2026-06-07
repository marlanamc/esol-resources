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
            "id": "welcome-how-to-use-app",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Welcome / How to Use the App"
          },
          {
            "id": "vocab-sep-w1-flashcards",
            "activityId": "vocab-sep-w1",
            "vocabUi": "flashcards",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits — Flash Cards"
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
            "id": "vocab-sep-w1-matching",
            "activityId": "vocab-sep-w1",
            "vocabUi": "matching",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits — Matching"
          },
          {
            "id": "verb-forms-overview",
            "href": "/grammar-reader/verb-forms-overview",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Verb Forms: V1 → V3"
          },
          {
            "id": "timeline-tenses-week1-intro",
            "activityId": "timeline-tenses-simple",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Simple & Continuous"
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
            "id": "parts-of-speech-library",
            "activityId": "parts-of-speech-game",
            "slot": "extra",
            "order": 0,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Full Parts of Speech Practice Library"
          },
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
            "id": "vocab-sep-w2-matching",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Key Verbs — Matching"
          },
          {
            "id": "vocab-sep-w2-fill-blank",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Key Verbs — Fill in the Blank"
          },
          {
            "id": "parts-of-speech-mini-guide",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Guide"
          },
          {
            "id": "parts-of-speech-discovery",
            "activityId": "parts-of-speech-discovery-guided",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Parts of Speech Discovery Game"
          },
          {
            "id": "helper-verb-repair",
            "activityId": "grammar-hospital-helper-repair-guided",
            "slot": "required",
            "order": 7,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grammar Hospital: Helper Verb Repair"
          },
          {
            "id": "vowel-names-a-e-i",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "pronunciation",
            "title": "Vowel Names Practice: A / E / I"
          },
          {
            "id": "verb-quiz-2",
            "activityId": "verb-quiz-2",
            "slot": "required",
            "order": 9,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 2: do + make"
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
            "id": "vocab-sep-w3-matching",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Action Words — Matching"
          },
          {
            "id": "vocab-sep-w3-fill-blank",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Action Words — Fill in the Blank"
          },
          {
            "id": "ed-endings-game-extra",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "extra",
            "order": 5,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Game"
          },
          {
            "id": "timeline-verb-forms-review",
            "activityId": "timeline-tenses-simple",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Verb Forms Review"
          },
          {
            "id": "ed-endings-intro",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Intro: /t/ /d/ /id/"
          },
          {
            "id": "verb-quiz-3",
            "activityId": "verb-quiz-3",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 3: go + come"
          },
          {
            "id": "questions-real-answers",
            "href": "/grammar-reader/questions-real-answers",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Questions That Get Real Answers"
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
            "id": "vocab-sep-w4-matching",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Personal Journey Verbs — Matching"
          },
          {
            "id": "vocab-sep-w4-fill-blank",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Personal Journey Verbs — Fill in the Blank"
          },
          {
            "id": "past-simple-past-continuous-guide",
            "href": "/grammar-reader/past-simple-past-continuous",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Simple + Past Continuous: Telling the Story"
          },
          {
            "id": "have-you-ever-speaking",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Have You Ever...? Speaking Practice"
          },
          {
            "id": "verb-quiz-4",
            "activityId": "verb-quiz-4",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 4: find + buy"
          },
          {
            "id": "lived-worked-writing",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"I have lived...\" / \"I have worked...\""
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
        "title": "Community Places + Daily Routines",
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
            "id": "vocab-oct-w1-matching",
            "activityId": "vocab-oct-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "question-word-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Question Word Practice Game"
          },
          {
            "id": "verb-quiz-5",
            "activityId": "verb-quiz-5",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 5: keep + build"
          },
          {
            "id": "just-already-yet",
            "href": "/grammar-reader/just-already-yet",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Just, Already, Yet"
          }
        ]
      },
      {
        "id": "week-6",
        "number": 6,
        "title": "Transportation + Directions",
        "items": [
          {
            "id": "vocab-oct-w2-flashcards",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Movement Verbs — Flash Cards"
          },
          {
            "id": "vocab-oct-w2-matching",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Movement Verbs — Matching"
          },
          {
            "id": "vocab-oct-w2-fill-blank",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Movement Verbs — Fill in the Blank"
          },
          {
            "id": "map-directions-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Map / Directions Practice Game"
          },
          {
            "id": "verb-quiz-6",
            "activityId": "verb-quiz-6",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 6: pay + hold"
          },
          {
            "id": "your-week-in-english",
            "href": "/grammar-reader/your-week-in-english",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Your Week in English"
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
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Protect Yourself Verbs — Flash Cards"
          },
          {
            "id": "vocab-oct-w3-matching",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Protect Yourself Verbs — Matching"
          },
          {
            "id": "vocab-oct-w3-fill-blank",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Protect Yourself Verbs — Fill in the Blank"
          },
          {
            "id": "scam-or-safe-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Scam or Safe? Practice"
          },
          {
            "id": "verb-quiz-7",
            "activityId": "verb-quiz-7",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 7: break + leave"
          },
          {
            "id": "getting-there-directions",
            "href": "/grammar-reader/getting-there-directions",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Getting There: Directions + Imperatives"
          }
        ]
      },
      {
        "id": "week-8",
        "number": 8,
        "title": "Phone English + Family Connection",
        "items": [
          {
            "id": "can-should-must",
            "href": "/grammar-reader/can-should-must",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Can, Should, Must"
          },
          {
            "id": "vocab-oct-w4-flashcards",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 1,
            "title": "Vocab: Communication Verbs — Flash Cards"
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
            "order": 5,
            "title": "Vocab: Communication Verbs — Fill in the Blank"
          },
          {
            "id": "b-v-minimal-pair",
            "activityId": "pron-b-v-listening",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-8",
            "activityId": "verb-quiz-8",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 8: sell + burst"
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
            "id": "vocab-nov-w1-matching",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "volunteering-scenario-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Volunteering Scenario Practice"
          },
          {
            "id": "verb-quiz-9",
            "activityId": "verb-quiz-9",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 9: freeze + leak"
          },
          {
            "id": "have-you-ever",
            "href": "/grammar-reader/have-you-ever",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Have You Ever...?"
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
            "id": "vocab-nov-w2-matching",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Discussion Verbs — Matching"
          },
          {
            "id": "vocab-nov-w2-fill-blank",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Discussion Verbs — Fill in the Blank"
          },
          {
            "id": "public-meeting-language",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Public Meeting Language Practice"
          },
          {
            "id": "verb-quiz-10",
            "activityId": "verb-quiz-10",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 10: call + fix"
          },
          {
            "id": "what-are-you-good-at",
            "href": "/grammar-reader/what-are-you-good-at",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "What Are You Good At?"
          },
          {
            "id": "short-i-long-e-lab",
            "activityId": "pron-short-i-long-e-listening",
            "slot": "required",
            "order": 8,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Short i vs Long e Minimal Pair Lab"
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
            "id": "vocab-nov-w3-matching",
            "activityId": "vocab-nov-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "contact-official-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Contact an Official Practice"
          },
          {
            "id": "verb-quiz-11",
            "activityId": "verb-quiz-11",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 11: sleep + wake"
          },
          {
            "id": "lets-make-a-suggestion",
            "href": "/grammar-reader/lets-make-a-suggestion",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Let's Make a Suggestion"
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
            "id": "vocab-nov-w4-matching",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Problem-Solving Verbs — Matching"
          },
          {
            "id": "vocab-nov-w4-fill-blank",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Problem-Solving Verbs — Fill in the Blank"
          },
          {
            "id": "community-problem-scenario",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Community Problem Scenario Game"
          },
          {
            "id": "if-we-writing",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If we..., we will...\""
          },
          {
            "id": "verb-quiz-12",
            "activityId": "verb-quiz-12",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 12: eat + drink"
          },
          {
            "id": "zero-first-conditional",
            "href": "/grammar-reader/zero-first-conditional",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Zero + First Conditional: If This, Then That"
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
            "id": "how-long-for-since-guide",
            "href": "/grammar-reader/how-long-for-since",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "How Long + For and Since"
          },
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
            "id": "vocab-dec-w1-matching",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Money Verbs — Matching"
          },
          {
            "id": "vocab-dec-w1-fill-blank",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Money Verbs — Fill in the Blank"
          },
          {
            "id": "numbers-through-trillions",
            "activityId": "numbers-through-trillions-guided",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Numbers Through Trillions"
          },
          {
            "id": "compare-prices-practice",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Compare Prices Practice"
          },
          {
            "id": "verb-quiz-13",
            "activityId": "verb-quiz-13",
            "slot": "required",
            "order": 7,
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
            "id": "more-less-the-most",
            "href": "/grammar-reader/more-less-the-most",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "More, Less, the Most: Comparatives + Superlatives"
          },
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
            "id": "vocab-dec-w2-matching",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "bv-shorti-longe-review",
            "activityId": "pron-mixed-review",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V / Short i Long e Review"
          },
          {
            "id": "verb-quiz-14",
            "activityId": "verb-quiz-14",
            "slot": "required",
            "order": 6,
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
            "id": "countable-uncountable-game",
            "activityId": "countable-uncountable-nouns",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Countable vs Uncountable Practice"
          },
          {
            "id": "grocery-budget-practice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Grocery Budget Practice"
          },
          {
            "id": "verb-quiz-15-dec",
            "activityId": "verb-quiz-15",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 15: give + send"
          },
          {
            "id": "how-much-how-many",
            "href": "/grammar-reader/how-much-how-many",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "How Much / How Many: Countable + Uncountable"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-5",
    "number": 5,
    "title": "Housing",
    "month": "January",
    "weeks": [
      {
        "id": "week-16",
        "number": 16,
        "title": "Housing Basics",
        "items": [
          {
            "id": "parts-of-speech-refresh-extra",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "extra",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Refresh"
          },
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
            "id": "vocab-jan-w1-matching",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "r-l-lab",
            "activityId": "pron-r-l-listening",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "R vs L Minimal Pair Lab"
          },
          {
            "id": "asking-right-questions-housing",
            "href": "/grammar-reader/asking-right-questions-housing",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Asking the Right Questions About Housing"
          }
        ]
      },
      {
        "id": "week-17",
        "number": 17,
        "title": "Comparing Housing Options",
        "items": [
          {
            "id": "have-to-dont-have-to-cant",
            "href": "/grammar-reader/have-to-dont-have-to-cant",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Have to, Don't Have to, Can't"
          },
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
            "id": "vocab-jan-w2-matching",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Decision Verbs — Matching"
          },
          {
            "id": "vocab-jan-w2-fill-blank",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Decision Verbs — Fill in the Blank"
          },
          {
            "id": "compare-apartments",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Compare Apartments Practice"
          },
          {
            "id": "housing-description-writing",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Housing Description Writing"
          },
          {
            "id": "verb-quiz-16",
            "activityId": "verb-quiz-16",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 16: write + submit"
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
            "id": "vocab-jan-w3-matching",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "repair-request-phone",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Phone English: Repair Request"
          },
          {
            "id": "verb-quiz-17",
            "activityId": "verb-quiz-17",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 17: work + apply"
          },
          {
            "id": "need-to-find-a-place-infinitives",
            "href": "/grammar-reader/need-to-find-a-place-infinitives",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I Need to Find a Place: Infinitives"
          }
        ]
      },
      {
        "id": "week-19",
        "number": 19,
        "title": "Housing Problems + Solutions",
        "items": [
          {
            "id": "it-was-happening-when",
            "href": "/grammar-reader/it-was-happening-when",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "It Was Happening When: Past Tenses in Housing Stories"
          },
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
            "id": "vocab-jan-w4-matching",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Resolution Verbs — Matching"
          },
          {
            "id": "vocab-jan-w4-fill-blank",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Resolution Verbs — Fill in the Blank"
          },
          {
            "id": "housing-problem-scenario",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Housing Problem Scenario"
          },
          {
            "id": "verb-quiz-18",
            "activityId": "verb-quiz-18",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 18: meet + speak"
          },
          {
            "id": "what-happened-writing",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"What happened?\""
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
            "id": "vocab-feb-3-5-matching",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "resume-language-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Resume Language Practice"
          },
          {
            "id": "verb-quiz-19",
            "activityId": "verb-quiz-19",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 19: tell + say"
          },
          {
            "id": "past-perfect",
            "href": "/grammar-reader/past-perfect",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Perfect: What Had Already Happened"
          }
        ]
      },
      {
        "id": "week-21",
        "number": 21,
        "title": "Work Stories + Schedules",
        "items": [
          {
            "id": "must-have-to-should-at-work",
            "href": "/grammar-reader/must-have-to-should-at-work",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Must, Have to, Should at Work"
          },
          {
            "id": "vocab-feb-10-12-flashcards",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 1,
            "title": "Vocab: Workplace Phrasal Verbs — Flash Cards"
          },
          {
            "id": "vocab-feb-10-12-matching",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 3,
            "title": "Vocab: Workplace Phrasal Verbs — Matching"
          },
          {
            "id": "vocab-feb-10-12-fill-blank",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 5,
            "title": "Vocab: Workplace Phrasal Verbs — Fill in the Blank"
          },
          {
            "id": "work-schedule-practice",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Work Schedule Practice"
          },
          {
            "id": "v-w-lab",
            "activityId": "pron-v-w-listening",
            "slot": "required",
            "order": 7,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "V vs W Minimal Pair Lab"
          }
        ]
      },
      {
        "id": "week-22",
        "number": 22,
        "title": "Second Conditional + Catch-Up",
        "items": [
          {
            "id": "catch-up-path-february",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-february",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-february",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "verb-quiz-20",
            "activityId": "verb-quiz-20",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 20: hear + understand"
          },
          {
            "id": "second-conditional-what-would-you-do",
            "href": "/grammar-reader/second-conditional-what-would-you-do",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Second Conditional: What Would You Do?"
          }
        ]
      },
      {
        "id": "week-23",
        "number": 23,
        "title": "Workplace Rights + Obligation",
        "items": [
          {
            "id": "vocab-feb-24-26-flashcards",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Experience & Timelines — Flash Cards"
          },
          {
            "id": "vocab-feb-24-26-matching",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Experience & Timelines — Matching"
          },
          {
            "id": "vocab-feb-24-26-fill-blank",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Experience & Timelines — Fill in the Blank"
          },
          {
            "id": "workplace-rights-scenario",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Workplace Rights Scenario Game"
          },
          {
            "id": "at-work-have-to-writing",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"At work, I have to...\""
          },
          {
            "id": "verb-quiz-21",
            "activityId": "verb-quiz-21",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 21: forward + respond"
          },
          {
            "id": "phrasal-verbs-at-work",
            "href": "/grammar-reader/phrasal-verbs-at-work",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Phrasal Verbs at Work"
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
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Skills & Qualifications — Flash Cards"
          },
          {
            "id": "vocab-mar-3-5-matching",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Skills & Qualifications — Matching"
          },
          {
            "id": "vocab-mar-3-5-fill-blank",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Skills & Qualifications — Fill in the Blank"
          },
          {
            "id": "interview-language-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Interview Language Practice"
          },
          {
            "id": "s-th-lab",
            "activityId": "pron-s-th-listening",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "S vs Th Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-22",
            "activityId": "verb-quiz-22",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 22: reply + schedule"
          },
          {
            "id": "present-perfect-how-long",
            "href": "/grammar-reader/present-perfect-how-long",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect + How Long"
          }
        ]
      },
      {
        "id": "week-25",
        "number": 25,
        "title": "Career Stories",
        "items": [
          {
            "id": "vocab-mar-10-12-flashcards",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Rules & Obligation — Flash Cards"
          },
          {
            "id": "vocab-mar-10-12-matching",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Rules & Obligation — Matching"
          },
          {
            "id": "vocab-mar-10-12-fill-blank",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Rules & Obligation — Fill in the Blank"
          },
          {
            "id": "timeline-perfect-continuous",
            "activityId": "timeline-tenses-perfect-continuous",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Perfect + Continuous"
          },
          {
            "id": "how-long-speaking",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Speaking: \"How long have you been...?\""
          },
          {
            "id": "ive-been-working",
            "href": "/grammar-reader/ive-been-working",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I've Been Working: Present Perfect Continuous"
          },
          {
            "id": "verb-quiz-23",
            "activityId": "verb-quiz-23",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 23: confirm + stand"
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
            "id": "vocab-mar-17-19-matching",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Communication & Feedback — Matching"
          },
          {
            "id": "vocab-mar-17-19-fill-blank",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Communication & Feedback — Fill in the Blank"
          },
          {
            "id": "vocab-mar-24-26-flashcards",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 5,
            "title": "Vocab: Rights, Rules & Advocacy — Flash Cards"
          },
          {
            "id": "vocab-mar-24-26-matching",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 7,
            "title": "Vocab: Rights, Rules & Advocacy — Matching"
          },
          {
            "id": "vocab-mar-24-26-fill-blank",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 9,
            "title": "Vocab: Rights, Rules & Advocacy — Fill in the Blank"
          },
          {
            "id": "pp-ppc-spiral",
            "activityId": "timeline-tenses-perfect-pair",
            "slot": "required",
            "order": 10,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Present Perfect / PPC Spiral"
          },
          {
            "id": "verb-quiz-24",
            "activityId": "verb-quiz-24",
            "slot": "required",
            "order": 11,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 24: choose + report"
          },
          {
            "id": "workplace-advocacy-scenarios",
            "slot": "required",
            "order": 12,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Workplace Advocacy Scenarios"
          },
          {
            "id": "worked-been-working-writing",
            "slot": "required",
            "order": 13,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"I have worked...\" / \"I have been working...\""
          },
          {
            "id": "enjoy-doing-want-to-do",
            "href": "/grammar-reader/enjoy-doing-want-to-do",
            "slot": "required",
            "order": 14,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Enjoy Doing vs. Want to Do"
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
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "flashcards",
            "order": 0,
            "title": "Vocab: Small Talk & Social Conversation — Flash Cards"
          },
          {
            "id": "vocab-mar-31-apr-2-matching",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Small Talk & Social Conversation — Matching"
          },
          {
            "id": "vocab-mar-31-apr-2-fill-blank",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Small Talk & Social Conversation — Fill in the Blank"
          },
          {
            "id": "verb-quiz-25",
            "activityId": "verb-quiz-25",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 25: document + contact"
          },
          {
            "id": "passive-voice-what-was-done",
            "href": "/grammar-reader/passive-voice-what-was-done",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Passive Voice: What Was Done"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-8",
    "number": 8,
    "title": "Health",
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
            "id": "vocab-apr-7-9-matching",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "sh-ch-lab",
            "activityId": "pron-sh-ch-listening",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Sh vs Ch Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-26",
            "activityId": "verb-quiz-26",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 26: chat + discuss"
          },
          {
            "id": "should-shouldnt-health-advice",
            "href": "/grammar-reader/should-shouldnt-health-advice",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "You Should, You Shouldn't: Health Advice"
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
            "id": "vocab-apr-14-16-matching",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "doctor-conversation-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Doctor Conversation Practice"
          },
          {
            "id": "stop-taking-or-stop-to-take",
            "href": "/grammar-reader/stop-taking-or-stop-to-take",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Stop Taking It or Stop to Take It?"
          }
        ]
      },
      {
        "id": "week-30",
        "number": 30,
        "title": "The Doctor Said + Catch-Up",
        "items": [
          {
            "id": "catch-up-path-april",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Catch-Up Path"
          },
          {
            "id": "missing-quiz-make-up-april",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "catch-up",
            "title": "Missing Quiz Make-Up"
          },
          {
            "id": "optional-review-games-april",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Optional Review Games"
          },
          {
            "id": "verb-quiz-27",
            "activityId": "verb-quiz-27",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 27: mention + ask"
          },
          {
            "id": "doctor-said-reported-speech",
            "href": "/grammar-reader/doctor-said-reported-speech",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "The Doctor Said: Reported Speech"
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
            "id": "vocab-apr-28-30-matching",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
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
            "id": "mychart-message-practice",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "MyChart Message Practice"
          },
          {
            "id": "verb-quiz-28",
            "activityId": "verb-quiz-28",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 28: talk + comply"
          },
          {
            "id": "third-conditional-what-would-have-happened",
            "href": "/grammar-reader/third-conditional-what-would-have-happened",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Third Conditional: What Would Have Happened"
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
            "id": "vocab-may-5-7-matching",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Your Body & Wellness — Matching"
          },
          {
            "id": "vocab-may-5-7-fill-blank",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Your Body & Wellness — Fill in the Blank"
          },
          {
            "id": "mychart-follow-up",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "MyChart Follow-Up Practice"
          },
          {
            "id": "verb-quiz-29",
            "activityId": "verb-quiz-29",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 29: get + know"
          },
          {
            "id": "p-b-lab",
            "activityId": "pron-p-b-listening",
            "slot": "required",
            "order": 7,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "P vs B Minimal Pair Lab"
          },
          {
            "id": "i-used-to-but-now-i",
            "href": "/grammar-reader/i-used-to-but-now-i",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "I Used to, but Now I..."
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
            "order": 4,
            "title": "Vocab: Daily Care & Nutrition — Fill in the Blank"
          },
          {
            "id": "verb-quiz-30",
            "activityId": "verb-quiz-30",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 30: read + think"
          },
          {
            "id": "be-used-to-get-used-to",
            "href": "/grammar-reader/be-used-to-get-used-to",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Be Used to / Get Used to"
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
            "id": "vocab-may-19-21-matching",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Life Skills & Habits — Matching"
          },
          {
            "id": "vocab-may-19-21-fill-blank",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Life Skills & Habits — Fill in the Blank"
          },
          {
            "id": "healthy-habits-scenario",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Healthy Habits Scenario Game"
          },
          {
            "id": "sleep-better-writing",
            "slot": "required",
            "order": 6,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If I sleep better, I will...\""
          },
          {
            "id": "verb-quiz-31",
            "activityId": "verb-quiz-31",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 31: drive + ride"
          },
          {
            "id": "all-four-conditionals-quick-tour",
            "href": "/grammar-reader/all-four-conditionals-quick-tour",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "All Four Conditionals: A Quick Tour"
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
            "id": "vocab-may-26-28-matching",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Holistic Health Review — Matching"
          },
          {
            "id": "vocab-may-26-28-fill-blank",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Holistic Health Review — Fill in the Blank"
          },
          {
            "id": "speaking-game",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Speaking Game"
          },
          {
            "id": "b-v-refresh",
            "activityId": "pron-b-v-listening",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V Refresh"
          },
          {
            "id": "gerunds-infinitives-full-review",
            "href": "/grammar-reader/gerunds-infinitives-full-review",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Gerunds + Infinitives: Full Review"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-10",
    "number": 10,
    "title": "Future Academic Goals",
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
            "id": "vocab-jun-2-4-matching",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "matching",
            "order": 2,
            "title": "Vocab: Wrap-Up & Next Steps — Matching"
          },
          {
            "id": "vocab-jun-2-4-fill-blank",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "wrappedGame": true,
            "activityType": "game",
            "vocabUi": "fill-blank",
            "order": 4,
            "title": "Vocab: Wrap-Up & Next Steps — Fill in the Blank"
          },
          {
            "id": "final-reflection-writing-jun-extra",
            "slot": "extra",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Final Reflection: \"I have learned...\""
          },
          {
            "id": "timeline-full-year-challenge",
            "activityId": "timeline-tenses-all-challenge",
            "slot": "required",
            "order": 5,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Timeline Tenses: Full Year Challenge"
          },
          {
            "id": "future-goals-writing-jun-extra",
            "slot": "extra",
            "order": 5,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Future Goals Writing"
          },
          {
            "id": "mixed-pronunciation-review",
            "activityId": "pron-mixed-review",
            "slot": "required",
            "order": 6,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Mixed Pronunciation Review"
          },
          {
            "id": "practice-library-tour-jun-extra",
            "slot": "extra",
            "order": 6,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Practice Library Tour"
          },
          {
            "id": "post-test-window",
            "slot": "required",
            "order": 7,
            "wrappedGame": false,
            "activityType": "assessment",
            "title": "Post-Test Window"
          },
          {
            "id": "end-of-year-party-jun-extra",
            "slot": "extra",
            "order": 7,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "End-of-Year Party"
          },
          {
            "id": "all-the-tenses-year-in-review",
            "href": "/grammar-reader/all-the-tenses-year-in-review",
            "slot": "required",
            "order": 8,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "All the Tenses: A Year in Review"
          }
        ]
      }
    ]
  }
]
;
