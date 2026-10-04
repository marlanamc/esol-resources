/**
 * Sync every verb-quiz item title in src/lib/course-map-data.ts with
 * weekQuizTitle() ("Week 5 Quiz"), after quizzes move between weeks.
 * Item ids and weeks are left alone. Safe to re-run.
 *
 * Re-run prisma/seed-course-map.ts and scripts/import/sync-guided-verb-quizzes.ts after.
 */
import fs from "node:fs";
import path from "node:path";
import { COURSE_MAP_UNITS, type CourseUnitDef } from "@/lib/course-map-data";
import { weekQuizTitle } from "@/lib/weekly-quiz";

const DEST = path.resolve("src/lib/course-map-data.ts");
const QUIZ_ID = /^verb-quiz-(\d+)$/;

const units: CourseUnitDef[] = JSON.parse(JSON.stringify(COURSE_MAP_UNITS));
let changed = 0;

for (const unit of units) {
  for (const week of unit.weeks) {
    const quizzes = week.items.filter((item) => QUIZ_ID.test(item.id));
    for (const item of quizzes) {
      const bonus = quizzes.length > 1 ? quizzes.indexOf(item) + 1 : undefined;
      // The first quiz is taken together in class; keep saying so on the map.
      const title = weekQuizTitle(week.number, bonus) + (item.id === "verb-quiz-1" ? " — Together in Class" : "");
      if (item.title !== title) {
        item.title = title;
        changed++;
      }
    }
  }
}

const header = fs.readFileSync(DEST, "utf8").split("export const COURSE_MAP_UNITS")[0];
fs.writeFileSync(
  DEST,
  `${header}export const COURSE_MAP_UNITS: CourseUnitDef[] = ${JSON.stringify(units, null, 2)};\n`
);

console.log(`Updated ${changed} verb quiz title(s) in ${path.relative(process.cwd(), DEST)}`);
