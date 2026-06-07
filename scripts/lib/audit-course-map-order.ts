import { COURSE_MAP_UNITS } from "@/lib/course-map-data";

export type CourseMapOrderFinding = {
  weekNumber: number;
  weekTitle: string;
  issues: string[];
};

type MapItem = (typeof COURSE_MAP_UNITS)[number]["weeks"][number]["items"][number];

function requiredItems(week: (typeof COURSE_MAP_UNITS)[number]["weeks"][number]): MapItem[] {
  return week.items.filter((item) => item.slot === "required").sort((a, b) => a.order - b.order);
}

function isStandardVocabWeek(items: MapItem[]): boolean {
  const flashcardItems = items.filter((item) => item.vocabUi === "flashcards");
  return (
    flashcardItems.length === 1 &&
    items.some((item) => item.activityType === "guide") &&
    items.some((item) => item.id.startsWith("verb-quiz-"))
  );
}

export function auditCourseMapOrder(): CourseMapOrderFinding[] {
  const findings: CourseMapOrderFinding[] = [];

  for (const unit of COURSE_MAP_UNITS) {
    for (const week of unit.weeks) {
      const items = requiredItems(week);
      if (!isStandardVocabWeek(items)) continue;

      const issues: string[] = [];
      const flashcards = items.find((item) => item.vocabUi === "flashcards");
      const guide = items.find((item) => item.activityType === "guide");
      const verbQuizzes = items.filter((item) => item.id.startsWith("verb-quiz-"));
      const lastItem = items[items.length - 1];

      if (flashcards && items[0]?.id !== flashcards.id) {
        issues.push(`Flash cards should be first (found "${items[0]?.title}" instead)`);
      }
      if (guide && items[1]?.id !== guide.id) {
        issues.push(`Grammar guide should be second (found "${items[1]?.title}" instead)`);
      }
      const trailingVerbQuiz = verbQuizzes[verbQuizzes.length - 1];
      if (trailingVerbQuiz && lastItem?.id !== trailingVerbQuiz.id) {
        issues.push(`Verb quiz should be last (found "${lastItem?.title}" instead)`);
      }

      const orders = items.map((item) => item.order);
      if (new Set(orders).size !== orders.length) {
        issues.push("Duplicate order values within required items");
      }

      if (issues.length > 0) {
        findings.push({
          weekNumber: week.number,
          weekTitle: week.title,
          issues,
        });
      }
    }
  }

  return findings;
}
