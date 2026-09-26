/**
 * One-off follow-up to restructure-sept-2026-course-map.ts (Sept 2026 term).
 *
 * The class needed more time on Parts of Speech, and Digital Habits vocab came
 * too early, so:
 *  - Week 3 becomes a Parts of Speech review week with the Personal Journey
 *    Verbs vocab (moved from Week 4) and "Review" copies of the Week 2 items.
 *  - Week 4 picks up Verb Forms + Verb Quiz 1 and the Digital Habits vocab
 *    (moved from Week 3). Its speaking, writing, and -ed endings drop to extras.
 *  - Verb quizzes shift one more week later: week N holds verb-quiz-(N-3), so
 *    the sequence runs weeks 4-34 as required plus 32-34 as Week 35 extras.
 *
 * Rewrites src/lib/course-map-data.ts in place. Re-run prisma/seed-course-map.ts
 * and scripts/import/sync-guided-verb-quizzes.ts after.
 */
import fs from "node:fs";
import path from "node:path";
import {
  COURSE_MAP_UNITS,
  type CourseMapItemDef,
  type CourseUnitDef,
  type CourseWeekDef,
} from "@/lib/course-map-data";
import { GUIDED_VERB_QUIZ_PLAN, getGuidedVerbQuizTitle } from "@/data/verb-quiz-plan";

const DEST = path.resolve("src/lib/course-map-data.ts");

// Snapshot every item from the pre-change map so moved items keep their exact shape.
const originalItems = new Map<string, CourseMapItemDef>();
for (const unit of COURSE_MAP_UNITS) {
  for (const week of unit.weeks) {
    for (const item of week.items) originalItems.set(item.id, item);
  }
}

function take(id: string): CourseMapItemDef {
  const found = originalItems.get(id);
  if (!found) throw new Error(`No such course map item: ${id}`);
  return { ...found };
}

/** Spread-then-override keeps the original key order for a clean diff. */
function at(id: string, slot: string, order: number): CourseMapItemDef {
  return { ...take(id), slot, order };
}

/** Item ids are primary keys, so a repeat of a Week 2 item needs its own id. */
function review(id: string, slot: string, order: number): CourseMapItemDef {
  return { ...at(id, slot, order), id: `${id}-review`, badge: "Review" };
}

const units: CourseUnitDef[] = JSON.parse(JSON.stringify(COURSE_MAP_UNITS));
const unit = (id: string): CourseUnitDef => {
  const found = units.find((u) => u.id === id);
  if (!found) throw new Error(`No such unit: ${id}`);
  return found;
};
const week = (u: CourseUnitDef, id: string): CourseWeekDef => {
  const found = u.weeks.find((w) => w.id === id);
  if (!found) throw new Error(`No such week: ${id}`);
  return found;
};

const w3 = week(unit("unit-1"), "week-3");
const w4 = week(unit("unit-2"), "week-4");

// ── Week 3: Parts of Speech review, Personal Journey Verbs vocab ────────────
w3.title = "Parts of Speech Review";
w3.goal = "Take another week with the building blocks of English: nouns, verbs, adjectives, and more.";
w3.items = [
  at("vocab-sep-w4-flashcards", "required", 0),
  review("parts-of-speech-mini-guide", "required", 1),
  review("parts-of-speech-word-sort", "required", 2),
  at("vocab-sep-w4-matching", "required", 3),
  review("action-description-game", "required", 4),
  at("vocab-sep-w4-fill-blank", "required", 5),
  at("parts-of-speech-discovery", "required", 6),
  review("parts-of-speech-word-sort-nouns", "extra", 7),
  review("parts-of-speech-word-sort-pronouns", "extra", 8),
  review("parts-of-speech-word-sort-articles", "extra", 9),
  at("parts-of-speech-library", "extra", 10),
];

// ── Week 4: Verb Forms + Past Simple, Digital Habits vocab, Verb Quiz 1 ─────
w4.title = "Verb Forms + Past Simple";
w4.goal = "Learn the verb form codes (V1 to V3) and use V2 to tell a story in the past.";
w4.items = [
  at("vocab-sep-w3-flashcards", "required", 0),
  at("verb-forms-overview", "required", 1),
  at("past-simple-past-continuous-guide", "required", 2),
  at("vocab-sep-w3-matching", "required", 3),
  at("vocab-sep-w3-fill-blank", "required", 4),
  // Renamed to verb-quiz-1 by the shift below.
  at("verb-quiz-2", "required", 5),
  at("all-verb-tenses-overview", "extra", 6),
  at("have-you-ever-speaking", "extra", 7),
  at("lived-worked-writing", "extra", 8),
  at("ed-endings-intro", "extra", 9),
  at("ed-endings-game-extra", "extra", 10),
  at("helper-verb-repair", "extra", 11),
];

// ── Verb quizzes shift one more week later across the whole year ────────────
const QUIZ_OFFSET = 3;
const planByNumber = new Map(GUIDED_VERB_QUIZ_PLAN.map((q) => [q.quizNumber, q]));
const isQuiz = (item: CourseMapItemDef) => item.id.startsWith("verb-quiz-");
const quizTitle = (quizNumber: number) => {
  if (!planByNumber.has(quizNumber)) throw new Error(`No verb quiz plan for quiz ${quizNumber}`);
  return getGuidedVerbQuizTitle(quizNumber);
};
const lastQuizNumber = Math.max(...GUIDED_VERB_QUIZ_PLAN.map((q) => q.quizNumber));
const allWeeks = units.flatMap((u) => u.weeks);
const finalWeek = allWeeks[allWeeks.length - 1];

for (const w of allWeeks) {
  if (w === finalWeek) continue;
  const quizNumber = w.number - QUIZ_OFFSET;
  const existing = w.items.filter(isQuiz);

  if (quizNumber < 1) {
    w.items = w.items.filter((item) => !isQuiz(item));
    continue;
  }
  if (existing.length !== 1) {
    throw new Error(`Week ${w.number} has ${existing.length} verb quizzes, expected 1`);
  }

  const item = existing[0];
  item.id = `verb-quiz-${quizNumber}`;
  item.activityId = `verb-quiz-${quizNumber}`;
  item.title = quizTitle(quizNumber);
}

// The review / post-test week keeps every leftover quiz as an optional extra.
const firstLeftover = finalWeek.number - QUIZ_OFFSET;
const nonQuizItems = finalWeek.items.filter((item) => !isQuiz(item));
let nextOrder = nonQuizItems.reduce((max, item) => Math.max(max, item.order), -1) + 1;
const leftoverQuizzes: CourseMapItemDef[] = [];
for (let quizNumber = firstLeftover; quizNumber <= lastQuizNumber; quizNumber++) {
  leftoverQuizzes.push({
    id: `verb-quiz-${quizNumber}`,
    activityId: `verb-quiz-${quizNumber}`,
    slot: "extra",
    order: nextOrder++,
    wrappedGame: false,
    activityType: "quiz",
    title: quizTitle(quizNumber),
  });
}
finalWeek.items = [...nonQuizItems, ...leftoverQuizzes];

// Every item id must stay unique across the map (CourseMapItem.id is the PK).
const seen = new Set<string>();
for (const w of allWeeks) {
  for (const item of w.items) {
    if (seen.has(item.id)) throw new Error(`Duplicate course map item id: ${item.id}`);
    seen.add(item.id);
  }
}

const header = fs.readFileSync(DEST, "utf8").split("export const COURSE_MAP_UNITS")[0];
fs.writeFileSync(
  DEST,
  `${header}export const COURSE_MAP_UNITS: CourseUnitDef[] = ${JSON.stringify(units, null, 2)};\n`
);

console.log(`Rewrote ${path.relative(process.cwd(), DEST)}`);
console.log(`  Week 3: ${w3.title} (${w3.items.length} items)`);
console.log(`  Week 4: ${w4.title} (${w4.items.length} items)`);
console.log(`  Week ${finalWeek.number} extras: quizzes ${firstLeftover}-${lastQuizNumber}`);
