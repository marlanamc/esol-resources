import { COURSE_MAP_UNITS } from "@/lib/course-map-data";
import { getWeeklyQuizSchedule } from "@/lib/weekly-quiz-schedule";
import { QUIZ_VERB_SETS } from "@/data/verb-quiz-sets";

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
