import { getGuidedVerbQuizActivityId, getGuidedVerbQuizTitle } from "@/data/verb-quiz-plan";

export type CourseMapActivityType =
  | "guide"
  | "game"
  | "quiz"
  | "pronunciation"
  | "writing"
  | "speaking"
  | "review"
  | "catch-up"
  | "assessment";

export type CourseMapActivityStatus = "available" | "locked" | "completed" | "planned";

export interface CourseMapActivity {
  id: string;
  title: string;
  activityType: CourseMapActivityType;
  status: CourseMapActivityStatus;
  activityId?: string;
  href?: string;
  wrappedGame?: boolean;
}

export interface CourseMapLevel {
  levelNumber: number;
  levelTitle: string;
  levelGoal?: string;
  requiredActivities: CourseMapActivity[];
  extraPractice?: CourseMapActivity[];
}

export interface CourseMapUnit {
  unitNumber: number;
  unitTitle: string;
  month: string;
  levels: CourseMapLevel[];
}

const guide = (
  id: string,
  title: string,
  hrefOrActivityId?: string,
  status: CourseMapActivityStatus = "available"
): CourseMapActivity => ({
  id,
  title,
  activityType: "guide",
  status,
  ...(hrefOrActivityId?.startsWith("/") ? { href: hrefOrActivityId } : hrefOrActivityId ? { activityId: hrefOrActivityId } : {}),
});

const game = (
  id: string,
  title: string,
  activityId?: string,
  status: CourseMapActivityStatus = "available",
  wrappedGame = true
): CourseMapActivity => ({
  id,
  title,
  activityType: "game",
  status,
  wrappedGame,
  ...(activityId ? { activityId } : {}),
});

const quiz = (num: number): CourseMapActivity => {
  const activityId = getGuidedVerbQuizActivityId(num);
  return {
    id: `verb-quiz-${num}`,
    title: getGuidedVerbQuizTitle(num),
    activityType: "quiz",
    status: "available",
    ...(activityId ? { activityId } : {}),
  };
};

const planned = (
  id: string,
  title: string,
  activityType: CourseMapActivityType,
  status: CourseMapActivityStatus = "available"
): CourseMapActivity => ({ id, title, activityType, status });

const pronunciation = (
  id: string,
  title: string,
  activityId?: string,
  status: CourseMapActivityStatus = "available"
): CourseMapActivity => ({
  id,
  title,
  activityType: "pronunciation",
  status,
  wrappedGame: true,
  ...(activityId ? { activityId } : {}),
});

export const GUIDED_COURSE_MAP_UNITS: CourseMapUnit[] = [
  {
    unitNumber: 1,
    unitTitle: "Getting to Know You",
    month: "September",
    levels: [
      {
        levelNumber: 1,
        levelTitle: "Start the Class",
        levelGoal: "Log in, learn the app, and get comfortable.",
        requiredActivities: [
          planned("welcome-how-to-use-app", "Welcome / How to Use the App", "guide"),
          game("vocab-sep-w1", "Vocab: Digital Habits", "vocab-sep-w1", "available"),
          planned("chromebook-scavenger-hunt", "Chromebook Scavenger Hunt", "game"),
          planned("app-login-practice", "App Login Practice", "assessment"),
          planned("pre-test-window", "Pre-Test Window", "assessment"),
        ],
      },
      {
        levelNumber: 2,
        levelTitle: "Parts of Speech + App Habit",
        levelGoal: "Learn the basic building blocks of English and start the weekly app routine.",
        requiredActivities: [
          game("vocab-sep-w2", "Vocab: Key Verbs", "vocab-sep-w2", "available"),
          guide("parts-of-speech-mini-guide", "Parts of Speech Guide", "/grammar-reader/parts-of-speech", "available"),
          game("parts-of-speech-discovery", "Parts of Speech Discovery Game", "parts-of-speech-discovery-guided", "available"),
          planned("vowel-names-a-e-i", "Vowel Names Practice: A / E / I", "pronunciation"),
          quiz(1),
        ],
        extraPractice: [game("parts-of-speech-library", "Full Parts of Speech Practice Library", "parts-of-speech-game", "available", false)],
      },
      {
        levelNumber: 3,
        levelTitle: "Verb Forms + Past -ed Sounds",
        levelGoal: "Learn the 5 verb forms and start noticing past tense endings.",
        requiredActivities: [
          game("vocab-sep-w3", "Vocab: Action Words", "vocab-sep-w3", "available"),
          guide("verb-forms-mini-guide", "Verb Forms Guide", "/grammar-reader/simple-tenses-review", "available"),
          game("timeline-verb-forms-review", "Timeline Tenses: Verb Forms Review", "timeline-tenses-simple", "available"),
          pronunciation("ed-endings-intro", "-ed Endings Intro: /t/ /d/ /id/", "cmlkjcabs00000ezpkp32c6lz", "available"),
          quiz(2),
        ],
        extraPractice: [
          guide("past-simple-guide-extra", "Past Simple Guide", "/grammar-reader/past-simple", "available"),
          pronunciation("ed-endings-game-extra", "-ed Endings Game", "cmlkjcabs00000ezpkp32c6lz", "available"),
        ],
      },
      {
        levelNumber: 4,
        levelTitle: "Life Experience",
        levelGoal: "Use simple present and present perfect frames to talk about life.",
        requiredActivities: [
          game("vocab-sep-w4", "Vocab: Personal Journey Verbs", "vocab-sep-w4", "available"),
          guide("present-perfect-life-experience", "Present Perfect Guide", "/grammar-reader/present-perfect", "available"),
          planned("have-you-ever-speaking", "Have You Ever...? Speaking Practice", "speaking"),
          quiz(3),
          planned("lived-worked-writing", "Short Writing: \"I have lived...\" / \"I have worked...\"", "writing"),
        ],
        extraPractice: [
          guide("present-simple-guide-extra", "Present Simple Guide", "/grammar-reader/present-simple", "available"),
          guide("present-perfect-light-extra", "Present Perfect Guide", "/grammar-reader/present-perfect", "available"),
        ],
      },
    ],
  },
  {
    unitNumber: 2,
    unitTitle: "Daily Life in the Community",
    month: "October",
    levels: [
      {
        levelNumber: 5,
        levelTitle: "Community Places + Daily Routines",
        requiredActivities: [
          game("vocab-oct-w1", "Vocab: Schedule Verbs", "vocab-oct-w1", "available"),
          guide("info-questions-mini", "Information Questions Guide", "/grammar-reader/information-questions", "available"),
          game("question-word-practice", "Question Word Practice Game", undefined, "available"),
          quiz(4),
        ],
      },
      {
        levelNumber: 6,
        levelTitle: "Transportation + Directions",
        requiredActivities: [
          game("vocab-oct-w2", "Vocab: Movement Verbs", "vocab-oct-w2", "available"),
          guide("imperatives-mini-guide", "Imperatives Guide", "/grammar-reader/imperatives-declaratives", "available"),
          game("map-directions-practice", "Map / Directions Practice Game"),
          quiz(5),
        ],
      },
      {
        levelNumber: 7,
        levelTitle: "Digital Safety + Forms",
        requiredActivities: [
          game("vocab-oct-w3", "Vocab: Protect Yourself Verbs", "vocab-oct-w3", "available"),
          guide("can-should-must-mini", "Can / Should / Must Guide", "/grammar-reader/modals-obligation-permission", "available"),
          game("scam-or-safe-practice", "Scam or Safe? Practice"),
          quiz(6),
        ],
      },
      {
        levelNumber: 8,
        levelTitle: "Phone English + Family Connection",
        requiredActivities: [
          game("vocab-oct-w4", "Vocab: Communication Verbs", "vocab-oct-w4", "available"),
          guide("present-perfect-spiral", "Present Perfect Spiral Practice", "/grammar-reader/present-perfect", "available"),
          pronunciation("b-v-minimal-pair", "B vs V Minimal Pair Lab", "pron-b-v-listening", "available"),
          quiz(7),
        ],
      },
    ],
  },
  {
    unitNumber: 3,
    unitTitle: "Community Participation",
    month: "November",
    levels: [
      {
        levelNumber: 9,
        levelTitle: "Helping + Volunteering",
        requiredActivities: [
          game("vocab-nov-w1", "Vocab: Action Verbs", "vocab-nov-w1", "available"),
          guide("gerunds-prepositions-light", "Gerunds After Prepositions", "/grammar-reader/gerunds-infinitives", "available"),
          planned("volunteering-scenario-practice", "Volunteering Scenario Practice", "speaking"),
          quiz(8),
        ],
      },
      {
        levelNumber: 10,
        levelTitle: "Public Meetings + Suggestions",
        requiredActivities: [
          game("vocab-nov-w2", "Vocab: Discussion Verbs", "vocab-nov-w2", "available"),
          guide("suggestions-mini", "Suggestions Guide: should / could / let's", "/grammar-reader/modals-obligation-permission", "available"),
          planned("public-meeting-language", "Public Meeting Language Practice", "speaking"),
          pronunciation("short-i-long-e-lab", "Short i vs Long e Minimal Pair Lab", "pron-short-i-long-e-listening", "available"),
          quiz(9),
        ],
      },
      {
        levelNumber: 11,
        levelTitle: "Voting + Contacting Officials",
        requiredActivities: [
          game("vocab-nov-w3", "Vocab: Civic Verbs", "vocab-nov-w3", "available"),
          planned("contact-official-practice", "Contact an Official Practice", "writing"),
          quiz(10),
        ],
      },
      {
        levelNumber: 12,
        levelTitle: "Community Issue Case Study",
        requiredActivities: [
          game("vocab-nov-w4", "Vocab: Problem-Solving Verbs", "vocab-nov-w4", "available"),
          game("community-problem-scenario", "Community Problem Scenario Game"),
          quiz(11),
          planned("if-we-writing", "Short Writing: \"If we..., we will...\"", "writing"),
        ],
      },
    ],
  },
  {
    unitNumber: 4,
    unitTitle: "Consumer Smarts",
    month: "December",
    levels: [
      {
        levelNumber: 13,
        levelTitle: "Smart Spending + Big Numbers",
        requiredActivities: [
          game("vocab-dec-w1", "Vocab: Money Verbs", "vocab-dec-w1", "available"),
          game("numbers-through-trillions", "Numbers Through Trillions", "numbers-through-trillions-guided", "available"),
          guide("comparatives-superlatives-mini", "Comparatives + Superlatives Guide", "/grammar-reader/superlatives-quantifiers", "available"),
          planned("compare-prices-practice", "Compare Prices Practice", "game"),
          quiz(12),
        ],
      },
      {
        levelNumber: 14,
        levelTitle: "Bills, Fees, Returns + Scams",
        requiredActivities: [
          game("vocab-dec-w2", "Vocab: Financial Action Verbs", "vocab-dec-w2", "available"),
          guide("quantifiers-mini", "Quantifiers Guide", "/grammar-reader/superlatives-quantifiers", "available"),
          pronunciation("bv-shorti-longe-review", "B vs V / Short i Long e Review", "pron-mixed-review", "available"),
          quiz(13),
        ],
      },
    ],
  },
  {
    unitNumber: 5,
    unitTitle: "Housing",
    month: "January",
    levels: [
      {
        levelNumber: 15,
        levelTitle: "Housing Basics",
        requiredActivities: [
          game("vocab-jan-w1", "Vocab: Renter Verbs", "vocab-jan-w1", "available"),
          guide("parts-of-speech-refresh", "Parts of Speech Refresh", "/grammar-reader/parts-of-speech", "available"),
          pronunciation("r-l-lab", "R vs L Minimal Pair Lab", "pron-r-l-listening", "available"),
          quiz(14),
        ],
      },
      {
        levelNumber: 16,
        levelTitle: "Comparing Housing Options",
        requiredActivities: [
          game("vocab-jan-w2", "Vocab: Decision Verbs", "vocab-jan-w2", "available"),
          guide("superlatives-quantifiers-review", "Superlatives + Quantifiers Review", "/grammar-reader/superlatives-quantifiers", "available"),
          planned("compare-apartments", "Compare Apartments Practice", "game"),
          planned("housing-description-writing", "Housing Description Writing", "writing"),
          quiz(15),
        ],
      },
      {
        levelNumber: 17,
        levelTitle: "Landlord Calls + Repair Requests",
        requiredActivities: [
          game("vocab-jan-w3", "Vocab: Maintenance Verbs", "vocab-jan-w3", "available"),
          guide("housing-info-questions", "Information Questions for Housing", "/grammar-reader/information-questions", "available"),
          planned("repair-request-phone", "Phone English: Repair Request", "speaking"),
          game("helper-verb-repair", "Grammar Hospital: Helper Verb Repair", "grammar-hospital-helper-repair-guided", "available"),
          quiz(16),
        ],
      },
      {
        levelNumber: 18,
        levelTitle: "Housing Problems + Solutions",
        requiredActivities: [
          game("vocab-jan-w4", "Vocab: Resolution Verbs", "vocab-jan-w4", "available"),
          guide("past-simple-continuous-review", "Past Simple vs Past Continuous Review", "/grammar-reader/past-continuous", "available"),
          planned("housing-problem-scenario", "Housing Problem Scenario", "speaking"),
          planned("what-happened-writing", "Short Writing: \"What happened?\"", "writing"),
          quiz(17),
        ],
      },
    ],
  },
  {
    unitNumber: 6,
    unitTitle: "Workforce Preparation",
    month: "February",
    levels: [
      {
        levelNumber: 19,
        levelTitle: "Resume + Workplace Basics",
        requiredActivities: [
          game("vocab-feb-3-5", "Vocab: Jobs Foundations", "vocab-feb-3-5", "available"),
          planned("resume-language-practice", "Resume Language Practice", "writing"),
          quiz(18),
        ],
      },
      {
        levelNumber: 20,
        levelTitle: "Work Stories + Schedules",
        requiredActivities: [
          game("vocab-feb-10-12", "Vocab: Workplace Phrasal Verbs", "vocab-feb-10-12", "available"),
          guide("past-perfect-mini", "Past Perfect Guide", "/grammar-reader/past-perfect", "available"),
          planned("work-schedule-practice", "Work Schedule Practice", "game"),
          pronunciation("v-w-lab", "V vs W Minimal Pair Lab", "pron-v-w-listening", "available"),
          quiz(19),
        ],
      },
      {
        levelNumber: 21,
        levelTitle: "Vacation Catch-Up",
        requiredActivities: [
          planned("catch-up-path-february", "Catch-Up Path", "catch-up"),
          planned("missing-quiz-make-up-february", "Missing Quiz Make-Up", "catch-up"),
          planned("optional-review-games-february", "Optional Review Games", "review"),
        ],
      },
      {
        levelNumber: 22,
        levelTitle: "Workplace Rights + Obligation",
        requiredActivities: [
          game("vocab-feb-24-26", "Vocab: Experience & Timelines", "vocab-feb-24-26", "available"),
          guide("workplace-obligation-modals", "Modals: Have to / Must / Can / Should", "/grammar-reader/modals-obligation-permission", "available"),
          game("workplace-rights-scenario", "Workplace Rights Scenario Game"),
          quiz(20),
          planned("at-work-have-to-writing", "Short Writing: \"At work, I have to...\"", "writing"),
        ],
      },
    ],
  },
  {
    unitNumber: 7,
    unitTitle: "Career Awareness",
    month: "March",
    levels: [
      {
        levelNumber: 23,
        levelTitle: "Job Applications + Interviews",
        requiredActivities: [
          game("vocab-mar-3-5", "Vocab: Skills & Qualifications", "vocab-mar-3-5", "available"),
          guide("gerunds-after-prepositions", "Gerunds After Prepositions", "/grammar-reader/gerunds-infinitives", "available"),
          planned("interview-language-practice", "Interview Language Practice", "speaking"),
          pronunciation("s-th-lab", "S vs Th Minimal Pair Lab", "pron-s-th-listening", "available"),
          quiz(21),
        ],
      },
      {
        levelNumber: 24,
        levelTitle: "Career Stories",
        requiredActivities: [
          game("vocab-mar-10-12", "Vocab: Rules & Obligation", "vocab-mar-10-12", "available"),
          guide("pp-ppc-career", "Present Perfect + Present Perfect Continuous Guide", "/grammar-reader/present-perfect-continuous", "available"),
          game("timeline-perfect-continuous", "Timeline Tenses: Perfect + Continuous", "timeline-tenses-perfect-continuous", "available"),
          planned("how-long-speaking", "Speaking: \"How long have you been...?\"", "speaking"),
          quiz(22),
        ],
      },
      {
        levelNumber: 25,
        levelTitle: "Work Experience + Advocacy",
        requiredActivities: [
          game("vocab-mar-17-19", "Vocab: Communication & Feedback", "vocab-mar-17-19", "available"),
          game("vocab-mar-24-26", "Vocab: Rights, Rules & Advocacy", "vocab-mar-24-26", "available"),
          game("pp-ppc-spiral", "Present Perfect / PPC Spiral", "timeline-tenses-perfect-pair", "available"),
          planned("workplace-advocacy-scenarios", "Workplace Advocacy Scenarios", "speaking"),
          planned("worked-been-working-writing", "Short Writing: \"I have worked...\" / \"I have been working...\"", "writing"),
          quiz(23),
        ],
      },
      {
        levelNumber: 26,
        levelTitle: "Pay Stubs + Wage Math",
        requiredActivities: [
          game("vocab-mar-31-apr-2", "Vocab: Small Talk & Social Conversation", "vocab-mar-31-apr-2", "available"),
          guide("infinitives-vs-gerunds", "Infinitives vs Gerunds", "/grammar-reader/gerunds-infinitives", "available"),
          quiz(24),
        ],
      },
    ],
  },
  {
    unitNumber: 8,
    unitTitle: "Health",
    month: "April",
    levels: [
      {
        levelNumber: 27,
        levelTitle: "Healthcare Basics",
        requiredActivities: [
          game("vocab-apr-7-9", "Vocab: Symptoms & Expectations", "vocab-apr-7-9", "available"),
          guide("advice-modals-imperatives", "Advice Modals + Imperatives", "/grammar-reader/modals-health-advice-caution-consent", "available"),
          pronunciation("sh-ch-lab", "Sh vs Ch Minimal Pair Lab", "pron-sh-ch-listening", "available"),
          quiz(25),
        ],
      },
      {
        levelNumber: 28,
        levelTitle: "Symptoms + Clinic Visits",
        requiredActivities: [
          game("vocab-apr-14-16", "Vocab: Symptoms & Care", "vocab-apr-14-16", "available"),
          planned("doctor-conversation-practice", "Doctor Conversation Practice", "speaking"),
          guide("advice-modals-review", "Advice Modals Review", "/grammar-reader/modals-health-advice-caution-consent", "available"),
          quiz(26),
        ],
      },
      {
        levelNumber: 29,
        levelTitle: "Vacation Catch-Up",
        requiredActivities: [
          planned("catch-up-path-april", "Catch-Up Path", "catch-up"),
          planned("missing-quiz-make-up-april", "Missing Quiz Make-Up", "catch-up"),
          planned("optional-review-games-april", "Optional Review Games", "review"),
        ],
      },
      {
        levelNumber: 30,
        levelTitle: "Pharmacy + Notices",
        requiredActivities: [
          game("vocab-apr-28-30", "Vocab: Health Advice & Habits", "vocab-apr-28-30", "available"),
          guide("passive-voice-mini", "Passive Voice Guide", "/grammar-reader/passive-voice", "available"),
          guide("medicine-labels-pharmacy", "Medicine Labels / Pharmacy Notices", "/grammar-reader/medicine-labels-insurance", "available"),
          planned("mychart-message-practice", "MyChart Message Practice", "writing"),
          quiz(27),
        ],
      },
    ],
  },
  {
    unitNumber: 9,
    unitTitle: "Holistic Wellness",
    month: "May",
    levels: [
      {
        levelNumber: 31,
        levelTitle: "Wellness Routines + Follow-Up",
        requiredActivities: [
          game("vocab-may-5-7", "Vocab: Your Body & Wellness", "vocab-may-5-7", "available"),
          guide("reported-speech-mini", "Reported Speech Guide", "/grammar-reader/reported-speech", "available"),
          planned("mychart-follow-up", "MyChart Follow-Up Practice", "writing"),
          pronunciation("p-b-lab", "P vs B Minimal Pair Lab", "pron-p-b-listening", "available"),
          quiz(28),
        ],
      },
      {
        levelNumber: 32,
        levelTitle: "Nutrition + Charts",
        requiredActivities: [
          game("vocab-may-12-14", "Vocab: Daily Care & Nutrition", "vocab-may-12-14", "available"),
          guide("used-to-be-used-to", "Used To / Be Used To / Get Used To", "/grammar-reader/used-to-would-rather", "available"),
          quiz(29),
        ],
      },
      {
        levelNumber: 33,
        levelTitle: "Stress, Sleep + Healthy Habits",
        requiredActivities: [
          game("vocab-may-19-21", "Vocab: Life Skills & Habits", "vocab-may-19-21", "available"),
          game("healthy-habits-scenario", "Healthy Habits Scenario Game"),
          planned("sleep-better-writing", "Short Writing: \"If I sleep better, I will...\"", "writing"),
          quiz(30),
        ],
      },
      {
        levelNumber: 34,
        levelTitle: "Community Wellness + Speaking Games",
        requiredActivities: [
          game("vocab-may-26-28", "Vocab: Holistic Health Review", "vocab-may-26-28", "available"),
          guide("verbs-gerunds-review", "Verbs + Gerunds Review", "/grammar-reader/gerunds-infinitives", "available"),
          planned("speaking-game", "Speaking Game", "speaking"),
          pronunciation("b-v-refresh", "B vs V Refresh", "pron-b-v-listening", "available"),
          quiz(31),
        ],
      },
    ],
  },
  {
    unitNumber: 10,
    unitTitle: "Future Academic Goals",
    month: "June",
    levels: [
      {
        levelNumber: 35,
        levelTitle: "Year in Review + Post-Test",
        requiredActivities: [
          game("vocab-jun-2-4", "Vocab: Wrap-Up & Next Steps", "vocab-jun-2-4", "available"),
          guide("full-verb-tenses-overview", "Full Verb Tenses Overview Guide", "/grammar-reader/all-verb-tenses-overview", "available"),
          game("timeline-full-year-challenge", "Timeline Tenses: Full Year Challenge", "timeline-tenses-all-challenge", "available"),
          pronunciation("mixed-pronunciation-review", "Mixed Pronunciation Review", "pron-mixed-review", "available"),
          planned("post-test-window", "Post-Test Window", "assessment"),
        ],
      },
      {
        levelNumber: 36,
        levelTitle: "Celebrate + Keep Learning",
        requiredActivities: [
          planned("final-reflection-writing", "Final Reflection: \"I have learned...\"", "writing"),
          planned("future-goals-writing", "Future Goals Writing", "writing"),
          planned("practice-library-tour", "Practice Library Tour", "review"),
          planned("end-of-year-party", "End-of-Year Party", "speaking"),
        ],
      },
    ],
  },
];

export function getGuidedCourseMapActivityIds(): string[] {
  return Array.from(
    new Set(
      GUIDED_COURSE_MAP_UNITS.flatMap((unit) =>
        unit.levels.flatMap((level) => [
          ...level.requiredActivities,
          ...(level.extraPractice ?? []),
        ])
      )
        .map((activity) => activity.activityId)
        .filter((activityId): activityId is string => Boolean(activityId))
    )
  );
}
