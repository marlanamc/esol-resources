/**
 * One-off restructure for the Sept 2026 term (3 September weeks, starting Sept 15).
 *
 *  - Unit 1 (September) drops from 4 weeks to 3, with a light Week 1, a
 *    sub-proof Week 2 (vocab + Parts of Speech only), and Verb Quiz 1 in Week 3.
 *  - week-4 (Past Simple + Past Continuous) moves to Unit 2 (October) as a
 *    bundle with its vocab, picking up the -ed endings pronunciation.
 *  - "Questions That Get Real Answers" moves into Unit 2 week-5.
 *  - Verb quizzes shift 2 weeks later: week N holds verb-quiz-(N-2), so the
 *    sequence runs weeks 3-34 as required plus 35/36 as optional extras.
 *
 * Rewrites src/lib/course-map-data.ts in place. Re-run prisma/seed-course-map.ts after.
 */
import fs from "node:fs";
import path from "node:path";
import {
  COURSE_MAP_UNITS,
  type CourseMapItemDef,
  type CourseUnitDef,
  type CourseWeekDef,
} from "@/lib/course-map-data";
import { GUIDED_VERB_QUIZ_PLAN } from "@/data/verb-quiz-plan";

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

const unit1 = unit("unit-1");
const unit2 = unit("unit-2");
const w1 = week(unit1, "week-1");
const w2 = week(unit1, "week-2");
const w3 = week(unit1, "week-3");
const w4 = week(unit1, "week-4");
const w5 = week(unit2, "week-5");

// ── Week 1: light on-ramp, no quiz, no V3 ────────────────────────────────────
w1.title = "Start the Class";
w1.goal = "Get comfortable in the app and warm up the tenses you already know.";
w1.items = [
  at("vocab-sep-w1-flashcards", "required", 0),
  at("welcome-how-to-use-app", "required", 1),
  {
    ...at("welcome-back-tenses-review", "required", 2),
    title: "Welcome Back: Simple & Continuous Review",
  },
  {
    ...at("timeline-tenses-week1-intro", "required", 3),
    activityId: "timeline-tenses-week1-easy",
    title: "Timeline Tenses: Easy Start",
  },
  at("vocab-sep-w1-matching", "required", 4),
  at("vocab-sep-w1-fill-blank", "required", 5),
];

// ── Week 2: substitute week — vocab and the Parts of Speech guide only ───────
w2.title = "Parts of Speech";
w2.goal = "Learn the basic building blocks of English: nouns, verbs, adjectives, and more.";
w2.items = [
  at("vocab-sep-w2-flashcards", "required", 0),
  at("parts-of-speech-mini-guide", "required", 1),
  at("vocab-sep-w2-matching", "required", 2),
  at("vocab-sep-w2-fill-blank", "required", 3),
];

// ── Week 3: verb forms overview + the first verb quiz ───────────────────────
w3.title = "Verb Forms + Verb Quiz 1";
w3.goal = "Learn the five verb form codes (V1 to V3) and take your first verb quiz.";
w3.items = [
  at("vocab-sep-w3-flashcards", "required", 0),
  at("verb-forms-overview", "required", 1),
  {
    id: "all-verb-tenses-overview",
    href: "/grammar-reader/all-verb-tenses-overview",
    slot: "required",
    order: 2,
    wrappedGame: false,
    activityType: "guide",
    title: "All Verb Tenses Overview",
  },
  at("vocab-sep-w3-matching", "required", 3),
  at("vocab-sep-w3-fill-blank", "required", 4),
  at("verb-quiz-1", "required", 5),
  at("timeline-verb-forms-review", "extra", 6),
  at("parts-of-speech-discovery", "extra", 7),
  at("parts-of-speech-library", "extra", 8),
  at("helper-verb-repair", "extra", 9),
];

// ── week-4 moves to October, gaining -ed endings next to Past Simple ────────
w4.title = "Telling the Story: Past Simple + Past Continuous";
for (const item of w4.items) {
  if (item.id === "vocab-sep-w4-fill-blank") item.order = 6;
  if (item.id === "verb-quiz-4") item.order = 7;
}
w4.items.push(at("ed-endings-intro", "required", 5));
w4.items.push(at("ed-endings-game-extra", "extra", 8));
w4.items.sort((a, b) => a.order - b.order);

unit1.weeks = [w1, w2, w3];
unit2.weeks = [w4, ...unit2.weeks];

// ── "Questions That Get Real Answers" joins Daily Life in the Community ─────
for (const item of w5.items) {
  if (item.order >= 2) item.order += 1;
}
w5.items.push(at("questions-real-answers", "required", 2));
w5.items.sort((a, b) => a.order - b.order);

// ── Verb quizzes shift two weeks later across the whole year ────────────────
const planByNumber = new Map(GUIDED_VERB_QUIZ_PLAN.map((q) => [q.quizNumber, q]));
const isQuiz = (item: CourseMapItemDef) => item.id.startsWith("verb-quiz-");

for (const u of units) {
  for (const w of u.weeks) {
    const quizNumber = w.number - 2;

    if (quizNumber < 1) {
      w.items = w.items.filter((item) => !isQuiz(item));
      continue;
    }

    const plan = planByNumber.get(quizNumber);
    if (!plan) continue;

    const title = `Verb Quiz ${quizNumber}: ${plan.verbs[0]} + ${plan.verbs[1]}`;
    const existing = w.items.filter(isQuiz);

    if (existing.length > 1) {
      throw new Error(`Week ${w.number} has ${existing.length} verb quizzes`);
    }

    if (existing.length === 1) {
      const item = existing[0];
      item.id = `verb-quiz-${quizNumber}`;
      item.activityId = `verb-quiz-${quizNumber}`;
      item.title = title;
      continue;
    }

    // Weeks 35-36 are review / post-test weeks: keep the quiz optional so it
    // never has to sit after the Post-Test Window (see audit-course-map-order).
    const maxOrder = w.items.reduce((max, item) => Math.max(max, item.order), -1);
    w.items.push({
      id: `verb-quiz-${quizNumber}`,
      activityId: `verb-quiz-${quizNumber}`,
      slot: "extra",
      order: maxOrder + 1,
      wrappedGame: false,
      activityType: "quiz",
      title,
    });
  }
}

const header = fs.readFileSync(DEST, "utf8").split("export const COURSE_MAP_UNITS")[0];
fs.writeFileSync(
  DEST,
  `${header}export const COURSE_MAP_UNITS: CourseUnitDef[] = ${JSON.stringify(units, null, 2)};\n`
);

const weekCount = units.reduce((n, u) => n + u.weeks.length, 0);
console.log(`Rewrote ${path.relative(process.cwd(), DEST)}`);
console.log(`  Unit 1: ${unit1.weeks.length} weeks  Unit 2: ${unit2.weeks.length} weeks  total: ${weekCount}`);
