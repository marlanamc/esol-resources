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
  { verbs: ["be", "have"] }, // W4 Verb Forms + Past Simple
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

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Quiz 1 lands on the Friday of course Week 4 (Oct 5 - Oct 9, 2026), alongside
// the Verb Forms guide. Weeks 1-2 are a light on-ramp and Week 3 is a Parts of
// Speech review, so none of them has a quiz.
const firstQuizDueDate = new Date(2026, 9, 9, 12, 0, 0, 0);

export const GUIDED_VERB_QUIZ_PLAN: GuidedVerbQuizPlanItem[] = QUIZ_VERB_SETS.map(
  ({ verbs, reviewVerb }, index) => {
    const quizNumber = index + 1;
    return {
      quizNumber,
      activityId: `verb-quiz-${quizNumber}`,
      verbs: reviewVerb ? [...verbs, reviewVerb] : [...verbs],
      ...(reviewVerb ? { reviewVerb } : {}),
      levelNumber: quizNumber,
      dueDate: formatDate(addDays(firstQuizDueDate, index * 7)),
    };
  }
);

export function getGuidedVerbQuizTitle(quizNumber: number): string {
  const item = GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber);
  if (!item) return `Verb Quiz ${quizNumber}`;
  const newVerbs = item.verbs.filter((verb) => verb !== item.reviewVerb).join(" + ");
  return item.reviewVerb
    ? `Verb Quiz ${quizNumber}: ${newVerbs} · review: ${item.reviewVerb}`
    : `Verb Quiz ${quizNumber}: ${newVerbs}`;
}

export function getGuidedVerbQuizActivityId(quizNumber: number): string | null {
  return GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber)?.activityId ?? null;
}
