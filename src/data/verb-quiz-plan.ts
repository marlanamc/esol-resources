import { COURSE_MAP_UNITS } from "@/lib/course-map-data";
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

// Quiz numbers are stable activity identities, not course week numbers.
// Resolve placement and due dates from the course map; preserve saved submissions.
// Quizzes 32-34 are optional extras in the final review week.
const QUIZ_VERB_SETS: QuizVerbSet[] = [
  { verbs: ["be", "have"] },
  { verbs: ["do", "make"] },
  { verbs: ["go", "come"] },
  { verbs: ["tell", "say"] },
  { verbs: ["take", "bring"] },
  { verbs: ["meet", "speak"] },
  { verbs: ["write", "send"] },
  { verbs: ["think", "know"] },
  { verbs: ["cost", "spend"] },
  { verbs: ["buy", "sell"] },
  { verbs: ["eat", "drink"] },
  { verbs: ["see", "find"] },
  { verbs: ["choose", "let"] },
  { verbs: ["break", "hold"] },
  { verbs: ["hear", "leave"] },
  { verbs: ["become", "lead"], reviewVerb: "go" },
  { verbs: ["wear", "keep"], reviewVerb: "leave" },
  { verbs: ["win", "fly"] },
  { verbs: ["get", "put"], reviewVerb: "bring" },
  { verbs: ["understand", "mean"], reviewVerb: "speak" },
  { verbs: ["grow", "build"], reviewVerb: "do" },
  { verbs: ["teach", "show"], reviewVerb: "think" },
  { verbs: ["pay", "give"], reviewVerb: "write" },
  { verbs: ["feel", "sleep"], reviewVerb: "eat" },
  { verbs: ["fall", "hurt"], reviewVerb: "take" },
  { verbs: ["sit", "stand"] },
  { verbs: ["forget", "read"], reviewVerb: "know" },
  { verbs: ["run", "ride"], reviewVerb: "drink" },
  { verbs: ["drive", "wake"], reviewVerb: "come" },
  { verbs: ["lose", "cut"], reviewVerb: "break" },
  { verbs: ["begin", "quit"], reviewVerb: "choose" },
  { verbs: ["steal", "freeze"] },
  { verbs: ["catch", "fight"] },
  { verbs: ["hit", "lend"] },
];

export const GUIDED_VERB_QUIZ_PLAN: GuidedVerbQuizPlanItem[] = QUIZ_VERB_SETS.map(
  ({ verbs, reviewVerb }, index) => {
    const quizNumber = index + 1;
    const week = COURSE_MAP_UNITS.flatMap(unit => unit.weeks).find(week =>
      week.items.some(item => item.activityId === `verb-quiz-${quizNumber}`));
    if (!week) throw new Error(`No course week for verb quiz ${quizNumber}`);
    return {
      quizNumber,
      activityId: `verb-quiz-${quizNumber}`,
      verbs: reviewVerb ? [...verbs, reviewVerb] : [...verbs],
      ...(reviewVerb ? { reviewVerb } : {}),
      levelNumber: quizNumber,
      dueDate: getWeeklyQuizSchedule(week.number)!.dueAt.toISOString().slice(0, 10),
    };
  }
);

export function getGuidedVerbQuizTitle(quizNumber: number): string {
  return `Weekly Quiz ${quizNumber}`;
}

export function getGuidedVerbQuizActivityId(quizNumber: number): string | null {
  return GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber)?.activityId ?? null;
}
