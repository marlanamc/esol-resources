export interface CourseMapItemDef {
  id: string;
  activityId?: string;
  href?: string;
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
        "goal": "Log in, learn the app, and get comfortable.",
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
            "id": "vocab-sep-w1",
            "activityId": "vocab-sep-w1",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Digital Habits"
          },
          {
            "id": "chromebook-scavenger-hunt",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Chromebook Scavenger Hunt"
          },
          {
            "id": "app-login-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "assessment",
            "title": "App Login Practice"
          },
          {
            "id": "pre-test-window",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "assessment",
            "title": "Pre-Test Window"
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
            "id": "vocab-sep-w2",
            "activityId": "vocab-sep-w2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Key Verbs"
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
            "id": "vowel-names-a-e-i",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "pronunciation",
            "title": "Vowel Names Practice: A / E / I"
          },
          {
            "id": "verb-quiz-1",
            "activityId": "verb-quiz-1",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 1: be + have"
          }
        ]
      },
      {
        "id": "week-3",
        "number": 3,
        "title": "Verb Forms + Past -ed Sounds",
        "goal": "Learn the 5 verb forms and start noticing past tense endings.",
        "items": [
          {
            "id": "past-simple-guide-extra",
            "href": "/grammar-reader/past-simple",
            "slot": "extra",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Simple Guide"
          },
          {
            "id": "vocab-sep-w3",
            "activityId": "vocab-sep-w3",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Action Words"
          },
          {
            "id": "verb-forms-mini-guide",
            "href": "/grammar-reader/simple-tenses-review",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Verb Forms Guide"
          },
          {
            "id": "ed-endings-game-extra",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "extra",
            "order": 1,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Game"
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
            "id": "ed-endings-intro",
            "activityId": "cmlkjcabs00000ezpkp32c6lz",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "-ed Endings Intro: /t/ /d/ /id/"
          },
          {
            "id": "verb-quiz-2",
            "activityId": "verb-quiz-2",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 2: do + make"
          }
        ]
      },
      {
        "id": "week-4",
        "number": 4,
        "title": "Life Experience",
        "goal": "Use simple present and present perfect frames to talk about life.",
        "items": [
          {
            "id": "vocab-sep-w4",
            "activityId": "vocab-sep-w4",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Personal Journey Verbs"
          },
          {
            "id": "present-simple-guide-extra",
            "href": "/grammar-reader/present-simple",
            "slot": "extra",
            "order": 0,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Simple Guide"
          },
          {
            "id": "present-perfect-life-experience",
            "href": "/grammar-reader/present-perfect",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect Guide"
          },
          {
            "id": "present-perfect-light-extra",
            "href": "/grammar-reader/present-perfect",
            "slot": "extra",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect Guide"
          },
          {
            "id": "have-you-ever-speaking",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Have You Ever...? Speaking Practice"
          },
          {
            "id": "verb-quiz-3",
            "activityId": "verb-quiz-3",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 3: go + come"
          },
          {
            "id": "lived-worked-writing",
            "slot": "required",
            "order": 4,
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
            "id": "vocab-oct-w1",
            "activityId": "vocab-oct-w1",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Schedule Verbs"
          },
          {
            "id": "info-questions-mini",
            "href": "/grammar-reader/information-questions",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Information Questions Guide"
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
            "id": "verb-quiz-4",
            "activityId": "verb-quiz-4",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 4: find + buy"
          }
        ]
      },
      {
        "id": "week-6",
        "number": 6,
        "title": "Transportation + Directions",
        "items": [
          {
            "id": "vocab-oct-w2",
            "activityId": "vocab-oct-w2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Movement Verbs"
          },
          {
            "id": "imperatives-mini-guide",
            "href": "/grammar-reader/imperatives-declaratives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Imperatives Guide"
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
            "id": "verb-quiz-5",
            "activityId": "verb-quiz-5",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 5: keep + build"
          }
        ]
      },
      {
        "id": "week-7",
        "number": 7,
        "title": "Digital Safety + Forms",
        "items": [
          {
            "id": "vocab-oct-w3",
            "activityId": "vocab-oct-w3",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Protect Yourself Verbs"
          },
          {
            "id": "can-should-must-mini",
            "href": "/grammar-reader/modals-obligation-permission",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Can / Should / Must Guide"
          },
          {
            "id": "scam-or-safe-practice",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Scam or Safe? Practice"
          },
          {
            "id": "verb-quiz-6",
            "activityId": "verb-quiz-6",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 6: pay + hold"
          }
        ]
      },
      {
        "id": "week-8",
        "number": 8,
        "title": "Phone English + Family Connection",
        "items": [
          {
            "id": "vocab-oct-w4",
            "activityId": "vocab-oct-w4",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Communication Verbs"
          },
          {
            "id": "present-perfect-spiral",
            "href": "/grammar-reader/present-perfect",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect Spiral Practice"
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
            "id": "verb-quiz-7",
            "activityId": "verb-quiz-7",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 7: break + leave"
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
            "id": "vocab-nov-w1",
            "activityId": "vocab-nov-w1",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Action Verbs"
          },
          {
            "id": "gerunds-prepositions-light",
            "href": "/grammar-reader/gerunds-infinitives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Gerunds After Prepositions"
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
            "id": "verb-quiz-8",
            "activityId": "verb-quiz-8",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 8: sell + burst"
          }
        ]
      },
      {
        "id": "week-10",
        "number": 10,
        "title": "Public Meetings + Suggestions",
        "items": [
          {
            "id": "vocab-nov-w2",
            "activityId": "vocab-nov-w2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Discussion Verbs"
          },
          {
            "id": "suggestions-mini",
            "href": "/grammar-reader/modals-obligation-permission",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Suggestions Guide: should / could / let's"
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
            "id": "short-i-long-e-lab",
            "activityId": "pron-short-i-long-e-listening",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Short i vs Long e Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-9",
            "activityId": "verb-quiz-9",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 9: freeze + leak"
          }
        ]
      },
      {
        "id": "week-11",
        "number": 11,
        "title": "Voting + Contacting Officials",
        "items": [
          {
            "id": "vocab-nov-w3",
            "activityId": "vocab-nov-w3",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Civic Verbs"
          },
          {
            "id": "contact-official-practice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Contact an Official Practice"
          },
          {
            "id": "verb-quiz-10",
            "activityId": "verb-quiz-10",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 10: call + fix"
          }
        ]
      },
      {
        "id": "week-12",
        "number": 12,
        "title": "Community Issue Case Study",
        "items": [
          {
            "id": "vocab-nov-w4",
            "activityId": "vocab-nov-w4",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Problem-Solving Verbs"
          },
          {
            "id": "community-problem-scenario",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Community Problem Scenario Game"
          },
          {
            "id": "verb-quiz-11",
            "activityId": "verb-quiz-11",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 11: sleep + wake"
          },
          {
            "id": "if-we-writing",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If we..., we will...\""
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
        "title": "Smart Spending + Big Numbers",
        "items": [
          {
            "id": "vocab-dec-w1",
            "activityId": "vocab-dec-w1",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Money Verbs"
          },
          {
            "id": "numbers-through-trillions",
            "activityId": "numbers-through-trillions-guided",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Numbers Through Trillions"
          },
          {
            "id": "comparatives-superlatives-mini",
            "href": "/grammar-reader/superlatives-quantifiers",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Comparatives + Superlatives Guide"
          },
          {
            "id": "compare-prices-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "game",
            "title": "Compare Prices Practice"
          },
          {
            "id": "verb-quiz-12",
            "activityId": "verb-quiz-12",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 12: eat + drink"
          }
        ]
      },
      {
        "id": "week-14",
        "number": 14,
        "title": "Bills, Fees, Returns + Scams",
        "items": [
          {
            "id": "vocab-dec-w2",
            "activityId": "vocab-dec-w2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Financial Action Verbs"
          },
          {
            "id": "quantifiers-mini",
            "href": "/grammar-reader/superlatives-quantifiers",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Quantifiers Guide"
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
            "id": "verb-quiz-13",
            "activityId": "verb-quiz-13",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 13: sit + spend"
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
        "id": "week-15",
        "number": 15,
        "title": "Housing Basics",
        "items": [
          {
            "id": "vocab-jan-w1",
            "activityId": "vocab-jan-w1",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Renter Verbs"
          },
          {
            "id": "parts-of-speech-refresh",
            "href": "/grammar-reader/parts-of-speech",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Parts of Speech Refresh"
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
            "id": "verb-quiz-14",
            "activityId": "verb-quiz-14",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 14: cost + lend"
          }
        ]
      },
      {
        "id": "week-16",
        "number": 16,
        "title": "Comparing Housing Options",
        "items": [
          {
            "id": "vocab-jan-w2",
            "activityId": "vocab-jan-w2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Decision Verbs"
          },
          {
            "id": "superlatives-quantifiers-review",
            "href": "/grammar-reader/superlatives-quantifiers",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Superlatives + Quantifiers Review"
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
            "id": "housing-description-writing",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Housing Description Writing"
          },
          {
            "id": "verb-quiz-15",
            "activityId": "verb-quiz-15",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 15: give + send"
          }
        ]
      },
      {
        "id": "week-17",
        "number": 17,
        "title": "Landlord Calls + Repair Requests",
        "items": [
          {
            "id": "vocab-jan-w3",
            "activityId": "vocab-jan-w3",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Maintenance Verbs"
          },
          {
            "id": "housing-info-questions",
            "href": "/grammar-reader/information-questions",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Information Questions for Housing"
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
            "id": "helper-verb-repair",
            "activityId": "grammar-hospital-helper-repair-guided",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Grammar Hospital: Helper Verb Repair"
          },
          {
            "id": "verb-quiz-16",
            "activityId": "verb-quiz-16",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 16: write + submit"
          }
        ]
      },
      {
        "id": "week-18",
        "number": 18,
        "title": "Housing Problems + Solutions",
        "items": [
          {
            "id": "vocab-jan-w4",
            "activityId": "vocab-jan-w4",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Resolution Verbs"
          },
          {
            "id": "past-simple-continuous-review",
            "href": "/grammar-reader/past-continuous",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Simple vs Past Continuous Review"
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
            "id": "what-happened-writing",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"What happened?\""
          },
          {
            "id": "verb-quiz-17",
            "activityId": "verb-quiz-17",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 17: work + apply"
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
        "id": "week-19",
        "number": 19,
        "title": "Resume + Workplace Basics",
        "items": [
          {
            "id": "vocab-feb-3-5",
            "activityId": "vocab-feb-3-5",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Jobs Foundations"
          },
          {
            "id": "resume-language-practice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Resume Language Practice"
          },
          {
            "id": "verb-quiz-18",
            "activityId": "verb-quiz-18",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 18: meet + speak"
          }
        ]
      },
      {
        "id": "week-20",
        "number": 20,
        "title": "Work Stories + Schedules",
        "items": [
          {
            "id": "vocab-feb-10-12",
            "activityId": "vocab-feb-10-12",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Workplace Phrasal Verbs"
          },
          {
            "id": "past-perfect-mini",
            "href": "/grammar-reader/past-perfect",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Past Perfect Guide"
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
            "id": "v-w-lab",
            "activityId": "pron-v-w-listening",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "V vs W Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-19",
            "activityId": "verb-quiz-19",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 19: tell + say"
          }
        ]
      },
      {
        "id": "week-21",
        "number": 21,
        "title": "Vacation Catch-Up",
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
          }
        ]
      },
      {
        "id": "week-22",
        "number": 22,
        "title": "Workplace Rights + Obligation",
        "items": [
          {
            "id": "vocab-feb-24-26",
            "activityId": "vocab-feb-24-26",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Experience & Timelines"
          },
          {
            "id": "workplace-obligation-modals",
            "href": "/grammar-reader/modals-obligation-permission",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Modals: Have to / Must / Can / Should"
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
            "id": "verb-quiz-20",
            "activityId": "verb-quiz-20",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 20: hear + understand"
          },
          {
            "id": "at-work-have-to-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"At work, I have to...\""
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
        "id": "week-23",
        "number": 23,
        "title": "Job Applications + Interviews",
        "items": [
          {
            "id": "vocab-mar-3-5",
            "activityId": "vocab-mar-3-5",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Skills & Qualifications"
          },
          {
            "id": "gerunds-after-prepositions",
            "href": "/grammar-reader/gerunds-infinitives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Gerunds After Prepositions"
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
            "id": "s-th-lab",
            "activityId": "pron-s-th-listening",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "S vs Th Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-21",
            "activityId": "verb-quiz-21",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 21: forward + respond"
          }
        ]
      },
      {
        "id": "week-24",
        "number": 24,
        "title": "Career Stories",
        "items": [
          {
            "id": "vocab-mar-10-12",
            "activityId": "vocab-mar-10-12",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Rules & Obligation"
          },
          {
            "id": "pp-ppc-career",
            "href": "/grammar-reader/present-perfect-continuous",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Present Perfect + Present Perfect Continuous Guide"
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
            "id": "how-long-speaking",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Speaking: \"How long have you been...?\""
          },
          {
            "id": "verb-quiz-22",
            "activityId": "verb-quiz-22",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 22: reply + schedule"
          }
        ]
      },
      {
        "id": "week-25",
        "number": 25,
        "title": "Work Experience + Advocacy",
        "items": [
          {
            "id": "vocab-mar-17-19",
            "activityId": "vocab-mar-17-19",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Communication & Feedback"
          },
          {
            "id": "vocab-mar-24-26",
            "activityId": "vocab-mar-24-26",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Rights, Rules & Advocacy"
          },
          {
            "id": "pp-ppc-spiral",
            "activityId": "timeline-tenses-perfect-pair",
            "slot": "required",
            "order": 2,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Present Perfect / PPC Spiral"
          },
          {
            "id": "workplace-advocacy-scenarios",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Workplace Advocacy Scenarios"
          },
          {
            "id": "worked-been-working-writing",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"I have worked...\" / \"I have been working...\""
          },
          {
            "id": "verb-quiz-23",
            "activityId": "verb-quiz-23",
            "slot": "required",
            "order": 5,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 23: confirm + stand"
          }
        ]
      },
      {
        "id": "week-26",
        "number": 26,
        "title": "Pay Stubs + Wage Math",
        "items": [
          {
            "id": "vocab-mar-31-apr-2",
            "activityId": "vocab-mar-31-apr-2",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Small Talk & Social Conversation"
          },
          {
            "id": "infinitives-vs-gerunds",
            "href": "/grammar-reader/gerunds-infinitives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Infinitives vs Gerunds"
          },
          {
            "id": "verb-quiz-24",
            "activityId": "verb-quiz-24",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 24: choose + report"
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
        "id": "week-27",
        "number": 27,
        "title": "Healthcare Basics",
        "items": [
          {
            "id": "vocab-apr-7-9",
            "activityId": "vocab-apr-7-9",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Symptoms & Expectations"
          },
          {
            "id": "advice-modals-imperatives",
            "href": "/grammar-reader/modals-health-advice-caution-consent",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Advice Modals + Imperatives"
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
            "id": "verb-quiz-25",
            "activityId": "verb-quiz-25",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 25: document + contact"
          }
        ]
      },
      {
        "id": "week-28",
        "number": 28,
        "title": "Symptoms + Clinic Visits",
        "items": [
          {
            "id": "vocab-apr-14-16",
            "activityId": "vocab-apr-14-16",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Symptoms & Care"
          },
          {
            "id": "doctor-conversation-practice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "Doctor Conversation Practice"
          },
          {
            "id": "advice-modals-review",
            "href": "/grammar-reader/modals-health-advice-caution-consent",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Advice Modals Review"
          },
          {
            "id": "verb-quiz-26",
            "activityId": "verb-quiz-26",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 26: chat + discuss"
          }
        ]
      },
      {
        "id": "week-29",
        "number": 29,
        "title": "Vacation Catch-Up",
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
          }
        ]
      },
      {
        "id": "week-30",
        "number": 30,
        "title": "Pharmacy + Notices",
        "items": [
          {
            "id": "vocab-apr-28-30",
            "activityId": "vocab-apr-28-30",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Health Advice & Habits"
          },
          {
            "id": "passive-voice-mini",
            "href": "/grammar-reader/passive-voice",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Passive Voice Guide"
          },
          {
            "id": "medicine-labels-pharmacy",
            "href": "/grammar-reader/medicine-labels-insurance",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Medicine Labels / Pharmacy Notices"
          },
          {
            "id": "mychart-message-practice",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "MyChart Message Practice"
          },
          {
            "id": "verb-quiz-27",
            "activityId": "verb-quiz-27",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 27: mention + ask"
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
        "id": "week-31",
        "number": 31,
        "title": "Wellness Routines + Follow-Up",
        "items": [
          {
            "id": "vocab-may-5-7",
            "activityId": "vocab-may-5-7",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Your Body & Wellness"
          },
          {
            "id": "reported-speech-mini",
            "href": "/grammar-reader/reported-speech",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Reported Speech Guide"
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
            "id": "p-b-lab",
            "activityId": "pron-p-b-listening",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "P vs B Minimal Pair Lab"
          },
          {
            "id": "verb-quiz-28",
            "activityId": "verb-quiz-28",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 28: talk + comply"
          }
        ]
      },
      {
        "id": "week-32",
        "number": 32,
        "title": "Nutrition + Charts",
        "items": [
          {
            "id": "vocab-may-12-14",
            "activityId": "vocab-may-12-14",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Daily Care & Nutrition"
          },
          {
            "id": "used-to-be-used-to",
            "href": "/grammar-reader/used-to-would-rather",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Used To / Be Used To / Get Used To"
          },
          {
            "id": "verb-quiz-29",
            "activityId": "verb-quiz-29",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 29: get + know"
          }
        ]
      },
      {
        "id": "week-33",
        "number": 33,
        "title": "Stress, Sleep + Healthy Habits",
        "items": [
          {
            "id": "vocab-may-19-21",
            "activityId": "vocab-may-19-21",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Life Skills & Habits"
          },
          {
            "id": "healthy-habits-scenario",
            "slot": "required",
            "order": 1,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Healthy Habits Scenario Game"
          },
          {
            "id": "sleep-better-writing",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Short Writing: \"If I sleep better, I will...\""
          },
          {
            "id": "verb-quiz-30",
            "activityId": "verb-quiz-30",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 30: read + think"
          }
        ]
      },
      {
        "id": "week-34",
        "number": 34,
        "title": "Community Wellness + Speaking Games",
        "items": [
          {
            "id": "vocab-may-26-28",
            "activityId": "vocab-may-26-28",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Holistic Health Review"
          },
          {
            "id": "verbs-gerunds-review",
            "href": "/grammar-reader/gerunds-infinitives",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Verbs + Gerunds Review"
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
            "id": "b-v-refresh",
            "activityId": "pron-b-v-listening",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "B vs V Refresh"
          },
          {
            "id": "verb-quiz-31",
            "activityId": "verb-quiz-31",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "quiz",
            "title": "Verb Quiz 31: drive + ride"
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
        "id": "week-35",
        "number": 35,
        "title": "Year in Review + Post-Test",
        "items": [
          {
            "id": "vocab-jun-2-4",
            "activityId": "vocab-jun-2-4",
            "slot": "required",
            "order": 0,
            "wrappedGame": true,
            "activityType": "game",
            "title": "Vocab: Wrap-Up & Next Steps"
          },
          {
            "id": "full-verb-tenses-overview",
            "href": "/grammar-reader/all-verb-tenses-overview",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "guide",
            "title": "Full Verb Tenses Overview Guide"
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
            "id": "mixed-pronunciation-review",
            "activityId": "pron-mixed-review",
            "slot": "required",
            "order": 3,
            "wrappedGame": true,
            "activityType": "pronunciation",
            "title": "Mixed Pronunciation Review"
          },
          {
            "id": "post-test-window",
            "slot": "required",
            "order": 4,
            "wrappedGame": false,
            "activityType": "assessment",
            "title": "Post-Test Window"
          }
        ]
      },
      {
        "id": "week-36",
        "number": 36,
        "title": "Celebrate + Keep Learning",
        "items": [
          {
            "id": "final-reflection-writing",
            "slot": "required",
            "order": 0,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Final Reflection: \"I have learned...\""
          },
          {
            "id": "future-goals-writing",
            "slot": "required",
            "order": 1,
            "wrappedGame": false,
            "activityType": "writing",
            "title": "Future Goals Writing"
          },
          {
            "id": "practice-library-tour",
            "slot": "required",
            "order": 2,
            "wrappedGame": false,
            "activityType": "review",
            "title": "Practice Library Tour"
          },
          {
            "id": "end-of-year-party",
            "slot": "required",
            "order": 3,
            "wrappedGame": false,
            "activityType": "speaking",
            "title": "End-of-Year Party"
          }
        ]
      }
    ]
  }
];
