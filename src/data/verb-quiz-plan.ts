export type GuidedVerbQuizPlanItem = {
  quizNumber: number;
  activityId: string;
  verbs: [string, string];
  levelNumber: number;
  dueDate: string;
};

const QUIZ_VERB_PAIRS: Array<[string, string]> = [
  ["be", "have"],
  ["do", "make"],
  ["go", "come"],
  ["find", "buy"],
  ["keep", "build"],
  ["pay", "hold"],
  ["break", "leave"],
  ["sell", "cut"],
  ["freeze", "steal"],
  ["call", "fix"],
  ["sleep", "wake"],
  ["eat", "drink"],
  ["sit", "spend"],
  ["cost", "lend"],
  ["give", "send"],
  ["write", "submit"],
  ["work", "apply"],
  ["meet", "speak"],
  ["tell", "say"],
  ["hear", "understand"],
  ["see", "run"],
  ["win", "catch"],
  ["confirm", "stand"],
  ["choose", "report"],
  ["wear", "begin"],
  ["teach", "fight"],
  ["put", "hurt"],
  ["hit", "quit"],
  ["get", "know"],
  ["read", "think"],
  ["drive", "ride"],
  ["feel", "grow"],
  ["take", "bring"],
  ["fall", "lose"],
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

const firstQuizDueDate = new Date(2026, 8, 18, 12, 0, 0, 0);

export const GUIDED_VERB_QUIZ_PLAN: GuidedVerbQuizPlanItem[] = QUIZ_VERB_PAIRS.map(
  (verbs, index) => {
    const quizNumber = index + 1;
    return {
      quizNumber,
      activityId: `verb-quiz-${quizNumber}`,
      verbs,
      levelNumber: quizNumber,
      dueDate: formatDate(addDays(firstQuizDueDate, index * 7)),
    };
  }
);

export function getGuidedVerbQuizTitle(quizNumber: number): string {
  const item = GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber);
  if (!item) return `Verb Quiz ${quizNumber}`;
  return `Verb Quiz ${quizNumber}: ${item.verbs.join(" + ")}`;
}

export function getGuidedVerbQuizActivityId(quizNumber: number): string | null {
  return GUIDED_VERB_QUIZ_PLAN.find((quiz) => quiz.quizNumber === quizNumber)?.activityId ?? null;
}
