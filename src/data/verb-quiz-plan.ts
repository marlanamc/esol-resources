import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";

export type GuidedVerbQuizPlanItem = {
  quizNumber: number;
  activityId: string;
  /** New focus verbs first, then the review verb (if any) last. */
  verbs: string[];
  /** A verb from an earlier quiz brought back for spaced review. */
  reviewVerb?: string;
  levelNumber: number;
  dueDate: string;
};

type QuizVerbSet = { verbs: [string, string]; reviewVerb?: string };

// Quiz N sits in course Week N+3. Pairs follow the week's topic, the most
// common irregular verbs come first, and from Week 19 (Quiz 16) each quiz adds
// one review verb, except the catch-up Weeks 21 and 29 (Quizzes 18 and 26).
// Quizzes 32-34 are optional extras in the final review week.
const QUIZ_VERB_SETS: QuizVerbSet[] = [
  { verbs: ["be", "have"] }, // W4 Foundations: Learn How to Learn
  { verbs: ["do", "make"] }, // W5 Routines + Questions
  { verbs: ["go", "come"] }, // W6 Directions
  { verbs: ["tell", "say"] }, // W7 Phone + Family
  { verbs: ["take", "bring"] }, // W8 Volunteering
  { verbs: ["meet", "speak"] }, // W9 Public Meetings
  { verbs: ["write", "send"] }, // W10 Contacting Officials
  { verbs: ["think", "know"] }, // W11 Community Issue
  { verbs: ["cost", "spend"] }, // W12 Money + Compare Prices
  { verbs: ["buy", "sell"] }, // W13 Comparatives / Financial
  { verbs: ["eat", "drink"] }, // W14 Grocery
  { verbs: ["see", "find"] }, // W15 Housing Basics
  { verbs: ["choose", "let"] }, // W16 Comparing Housing
  { verbs: ["break", "hold"] }, // W17 Landlord Calls + Repairs
  { verbs: ["hear", "leave"] }, // W18 Housing Problems
  { verbs: ["become", "lead"], reviewVerb: "go" }, // W19 Resume (past perfect)
  { verbs: ["wear", "keep"], reviewVerb: "leave" }, // W20 Workplace Rules
  { verbs: ["win", "fly"] }, // W21 Second Conditional + Catch-Up
  { verbs: ["get", "put"], reviewVerb: "bring" }, // W22 Phrasal Verbs at Work
  { verbs: ["understand", "mean"], reviewVerb: "speak" }, // W23 Interviews
  { verbs: ["grow", "build"], reviewVerb: "do" }, // W24 Career Progress
  { verbs: ["teach", "show"], reviewVerb: "think" }, // W25 Work Experience
  { verbs: ["pay", "give"], reviewVerb: "write" }, // W26 Passive Voice + Pay Stubs
  { verbs: ["feel", "sleep"], reviewVerb: "eat" }, // W27 Healthcare Basics
  { verbs: ["fall", "hurt"], reviewVerb: "take" }, // W28 Symptoms + Clinic
  { verbs: ["sit", "stand"] }, // W29 Reported Speech + Catch-Up
  { verbs: ["forget", "read"], reviewVerb: "know" }, // W30 Third Conditional + Pharmacy
  { verbs: ["run", "ride"], reviewVerb: "drink" }, // W31 I Used to + Wellness
  { verbs: ["drive", "wake"], reviewVerb: "come" }, // W32 Get Used to
  { verbs: ["lose", "cut"], reviewVerb: "break" }, // W33 Conditionals + One Bad Week
  { verbs: ["begin", "quit"], reviewVerb: "choose" }, // W34 Gerunds + Infinitives
  { verbs: ["steal", "freeze"] }, // W35 optional
  { verbs: ["catch", "fight"] }, // W35 optional
  { verbs: ["hit", "lend"] }, // W35 optional
];

export const GUIDED_VERB_QUIZ_PLAN: GuidedVerbQuizPlanItem[] = QUIZ_VERB_SETS.map(
  ({ verbs, reviewVerb }, index) => {
    const quizNumber = index + 1;
    return {
      quizNumber,
      activityId: `verb-quiz-${quizNumber}`,
      verbs: reviewVerb ? [...verbs, reviewVerb] : [...verbs],
      ...(reviewVerb ? { reviewVerb } : {}),
      levelNumber: quizNumber,
      dueDate: getWeeklyQuizSchedule(Math.min(quizNumber + 3, 35))!.dueAt.toISOString().slice(0, 10),
    };
  }
);

export function getGuidedVerbQuizTitle(quizNumber: number): string {
  return `Weekly Quiz ${quizNumber}`;
}

export function getGuidedVerbQuizActivityId(quizNumber: number): string | null {
  return GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber)?.activityId ?? null;
}
