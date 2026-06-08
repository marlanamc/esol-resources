import { COURSE_MAP_UNITS } from "@/lib/course-map-data";

function buildVocabCourseMapLevelLookup(): Map<string, number> {
  const map = new Map<string, number>();

  for (const unit of COURSE_MAP_UNITS) {
    for (const week of unit.weeks) {
      for (const item of week.items) {
        const activityId = item.activityId;
        if (!activityId?.startsWith("vocab-")) continue;
        if (!map.has(activityId)) {
          map.set(activityId, week.number);
        }
      }
    }
  }

  return map;
}

const VOCAB_COURSE_MAP_LEVEL_BY_ACTIVITY_ID = buildVocabCourseMapLevelLookup();

export function getVocabCourseMapLevelNumber(activityId: string): number | null {
  if (!activityId.startsWith("vocab-")) return null;
  if (activityId === "vocab-daily-review") return null;

  const coreId = activityId
    .replace(/^vocab-/, "")
    .replace(/-(packet|flashcards|matching|fillblank)$/, "");

  return VOCAB_COURSE_MAP_LEVEL_BY_ACTIVITY_ID.get(`vocab-${coreId}`) ?? null;
}

export function formatCourseMapLevelLabel(levelNumber: number): string {
  return `Level ${levelNumber}`;
}
