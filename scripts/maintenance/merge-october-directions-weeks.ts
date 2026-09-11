/**
 * Second pass of the Sept 2026 restructure: October only has four teaching
 * weeks, so the two directions-themed weeks are merged into one.
 *
 *  - week-6 ("Getting Around + Digital Safety") absorbs week-7 ("Getting There").
 *    The oct-w2 vocab set and both guides stay required; the oct-w3 set drops to
 *    optional practice. Both weeks' only games were content-less placeholders.
 *  - week-7 is removed, so every later week renumbers down by one (35 total).
 *    Week IDs are deliberately left alone: ClassReveal rows key on weekId.
 *  - Verb quizzes are re-derived so week N holds verb-quiz-(N-2), keeping Quiz 1
 *    in Week 3. The two review weeks carry their quizzes as optional extras.
 *
 * Rewrites src/lib/course-map-data.ts in place. Re-run prisma/seed-course-map.ts after.
 */
import fs from "node:fs";
import path from "node:path";
import {
  COURSE_MAP_UNITS,
  type CourseMapItemDef,
  type CourseUnitDef,
} from "@/lib/course-map-data";
import { GUIDED_VERB_QUIZ_PLAN } from "@/data/verb-quiz-plan";

const DEST = path.resolve("src/lib/course-map-data.ts");
const units: CourseUnitDef[] = JSON.parse(JSON.stringify(COURSE_MAP_UNITS));

const unit2 = units.find((u) => u.id === "unit-2");
if (!unit2) throw new Error("unit-2 missing");

const w6 = unit2.weeks.find((w) => w.id === "week-6");
const w7 = unit2.weeks.find((w) => w.id === "week-7");
if (!w6 || !w7) throw new Error("week-6 / week-7 missing");

const isQuiz = (item: CourseMapItemDef) => item.id.startsWith("verb-quiz-");
const isPlaceholder = (item: CourseMapItemDef) => !item.activityId && !item.href;

/** Look up by activityId: week-6/week-7 item ids are crossed against their activities. */
type VocabUi = NonNullable<CourseMapItemDef["vocabUi"]>;

const byActivity = (items: CourseMapItemDef[], activityId: string, vocabUi: VocabUi) => {
  const found = items.find((i) => i.activityId === activityId && i.vocabUi === vocabUi);
  if (!found) throw new Error(`no item for ${activityId}/${vocabUi}`);
  return found;
};
const byId = (items: CourseMapItemDef[], id: string) => {
  const found = items.find((i) => i.id === id);
  if (!found) throw new Error(`item ${id} missing`);
  return { ...found };
};

/**
 * Rebuild a vocab item with an id that matches the activity it points at,
 * correcting the pre-existing week-6/week-7 id-vs-activity mismatch.
 */
const vocabItem = (
  source: CourseMapItemDef,
  activityId: string,
  vocabUi: VocabUi,
  slot: string,
  order: number
): CourseMapItemDef => ({
  id: `${activityId}-${vocabUi}`,
  activityId,
  slot,
  wrappedGame: true,
  activityType: "game",
  vocabUi,
  order,
  title: source.title,
});

const w6Items = w6.items;
const w7Items = w7.items;

// ── Merge: the Movement Verbs set (vocab-oct-w2) and both guides stay
//    required; the Protect Yourself set (vocab-oct-w3) drops to optional. ────
w6.title = "Getting Around: Directions + Digital Safety";
w6.goal = "Give and follow directions, and stay safe online while getting around town.";
w6.items = [
  vocabItem(byActivity(w7Items, "vocab-oct-w2", "flashcards"), "vocab-oct-w2", "flashcards", "required", 0),
  { ...byId(w6Items, "your-week-in-english"), slot: "required", order: 1 },
  { ...byId(w7Items, "getting-there-directions"), slot: "required", order: 2 },
  vocabItem(byActivity(w7Items, "vocab-oct-w2", "matching"), "vocab-oct-w2", "matching", "required", 3),
  vocabItem(byActivity(w7Items, "vocab-oct-w2", "fill-blank"), "vocab-oct-w2", "fill-blank", "required", 4),
  { ...byId(w6Items, "verb-quiz-4"), slot: "required", order: 5 },
  vocabItem(byActivity(w6Items, "vocab-oct-w3", "flashcards"), "vocab-oct-w3", "flashcards", "extra", 6),
  vocabItem(byActivity(w6Items, "vocab-oct-w3", "matching"), "vocab-oct-w3", "matching", "extra", 7),
  vocabItem(byActivity(w6Items, "vocab-oct-w3", "fill-blank"), "vocab-oct-w3", "fill-blank", "extra", 8),
];

unit2.weeks = unit2.weeks.filter((w) => w.id !== "week-7");

// ── Renumber every week contiguously; IDs stay put ─────────────────────────
let n = 0;
for (const unit of units) {
  for (const week of unit.weeks) week.number = ++n;
}
const totalWeeks = n;

// ── Re-derive verb quiz placement: week N holds verb-quiz-(N-2) ────────────
const planByNumber = new Map(GUIDED_VERB_QUIZ_PLAN.map((q) => [q.quizNumber, q]));
const titleFor = (quizNumber: number) => {
  const plan = planByNumber.get(quizNumber);
  if (!plan) throw new Error(`no quiz plan entry for ${quizNumber}`);
  return `Verb Quiz ${quizNumber}: ${plan.verbs[0]} + ${plan.verbs[1]}`;
};

for (const unit of units) {
  for (const week of unit.weeks) {
    week.items = week.items.filter((item) => !isQuiz(item));
    const quizNumber = week.number - 2;
    if (quizNumber < 1) continue;

    const maxOrder = week.items.reduce((max, item) => Math.max(max, item.order), -1);
    week.items.push({
      id: `verb-quiz-${quizNumber}`,
      activityId: `verb-quiz-${quizNumber}`,
      slot: "required",
      order: maxOrder + 1,
      wrappedGame: false,
      activityType: "quiz",
      title: titleFor(quizNumber),
    });
  }
}

// The final week is the review / post-test week. Its quizzes stay optional so
// a verb quiz never has to sit after the Post-Test Window (see audit-course-map-order),
// and any quiz left over past the final week rides along as extra practice.
const reviewWeeks = units.flatMap((u) => u.weeks).filter((w) => w.number >= totalWeeks);
for (const week of reviewWeeks) {
  for (const item of week.items) if (isQuiz(item)) item.slot = "extra";
}

const finalWeek = units.flatMap((u) => u.weeks).find((w) => w.number === totalWeeks);
if (finalWeek) {
  const placed = new Set(
    units.flatMap((u) => u.weeks).flatMap((w) => w.items.filter(isQuiz).map((i) => i.id))
  );
  for (const plan of GUIDED_VERB_QUIZ_PLAN) {
    const id = `verb-quiz-${plan.quizNumber}`;
    if (placed.has(id)) continue;
    const maxOrder = finalWeek.items.reduce((max, item) => Math.max(max, item.order), -1);
    finalWeek.items.push({
      id,
      activityId: id,
      slot: "extra",
      order: maxOrder + 1,
      wrappedGame: false,
      activityType: "quiz",
      title: titleFor(plan.quizNumber),
    });
  }
}

// Renumber `order` so required items run 0..k-1 and extras follow contiguously.
for (const unit of units) {
  for (const week of unit.weeks) {
    const sorted = [...week.items].sort((a, b) => a.order - b.order);
    const required = sorted.filter((i) => i.slot === "required");
    const extras = sorted.filter((i) => i.slot !== "required");
    week.items = [...required, ...extras];
    week.items.forEach((item, index) => {
      item.order = index;
    });
  }
}

const header = fs.readFileSync(DEST, "utf8").split("export const COURSE_MAP_UNITS")[0];
fs.writeFileSync(
  DEST,
  `${header}export const COURSE_MAP_UNITS: CourseUnitDef[] = ${JSON.stringify(units, null, 2)};\n`
);

console.log(`Rewrote ${path.relative(process.cwd(), DEST)}`);
for (const unit of units) {
  console.log(`  Unit ${unit.number} ${String(unit.month).padEnd(10)} weeks ${unit.weeks.map((w) => w.number).join(", ")}`);
}
console.log(`  total weeks: ${totalWeeks}`);
const dropped = units.flatMap((u) => u.weeks).flatMap((w) => w.items).filter(isPlaceholder).length;
console.log(`  placeholder items remaining: ${dropped}`);
