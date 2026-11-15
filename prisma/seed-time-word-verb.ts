import { PrismaClient } from "@prisma/client";
import { MAP } from "../src/lib/content-kind";
import { requireSafeDbTarget } from "../scripts/lib/require-safe-db-target.js";

const prisma = new PrismaClient();

// Week 10 extra practice: "Time Words: Which Verb?" (Fill in the Blank game).
// Follows Station 3 of the Week 10 modified Tuesday stations: look at the time
// word, then pick V2 (specified time) or have/has + V3 (unspecified time).
// Items 1-8 are Station 3 part B; 9-14 are new. `**...**` marks the time word
// (highlighted in the game). contentKind must be "map" or the Course Map hides
// the item. Run db:seed:course-map afterwards to link it into Week 10.
const TIME_WORD_VERB_ID = "time-word-verb-week10";

const S = (word: string) => `**${word}** = one time you can point to → **V2**`;
const U = (word: string, helper: "have" | "has") => `**${word}** = no one day → **${helper} + V3**`;

const SENTENCES = [
  { text: "I _____ my cousin **yesterday**.", options: ["saw", "have seen"], answer: "saw", explanation: S("yesterday") },
  { text: "She _____ Boston **two times**.", options: ["visited", "has visited"], answer: "has visited", explanation: U("two times", "has") },
  { text: "We _____ to the U.S. **in 2021**.", options: ["came", "have come"], answer: "came", explanation: S("in 2021") },
  { text: "My son _____ a plane **many times**.", options: ["took", "has taken"], answer: "has taken", explanation: U("many times", "has") },
  { text: "He _____ his job **three years ago**.", options: ["started", "has started"], answer: "started", explanation: S("three years ago") },
  { text: "**Last night**, we _____ pizza.", options: ["ate", "have eaten"], answer: "ate", explanation: S("last night") },
  { text: "I _____ that movie **twice**.", options: ["saw", "have seen"], answer: "have seen", explanation: U("twice", "have") },
  { text: "My friends _____ my house **on Saturday**.", options: ["visited", "have visited"], answer: "visited", explanation: S("on Saturday") },
  { text: "My daughter _____ that book **three times**.", options: ["read", "has read"], answer: "has read", explanation: U("three times", "has") },
  { text: "_____ you **ever** _____ sushi?", options: ["Did … eat", "Have … eaten"], answer: "Have … eaten", explanation: "**ever** = any time in your life → **Have you + V3**" },
  { text: "**When** _____ you _____ to Boston?", options: ["did … move", "have … moved"], answer: "did … move", explanation: "**When?** asks for one time → **did + V1**" },
  { text: "She _____ her keys **last week**.", options: ["lost", "has lost"], answer: "lost", explanation: S("last week") },
  { text: "They _____ that restaurant **before**.", options: ["tried", "have tried"], answer: "have tried", explanation: U("before", "have") },
  { text: "I _____ my sister **when I was a child**.", options: ["visited", "have visited"], answer: "visited", explanation: S("when I was a child") },
];

const CONTENT = {
  revealExplanation: true,
  ruleCard: {
    title: "Look at the time word",
    prompt: "Can you put your finger on **one day**?",
    columns: [
      { label: "Yes", result: "V2", examples: "three years ago, yesterday, in 2019" },
      { label: "No", result: "have/has + V3", examples: "ever, never, twice, many times" },
    ],
  },
  sentences: SENTENCES.map((s, i) => ({
    id: i + 1,
    text: s.text,
    options: s.options,
    correctAnswers: [s.answer],
    explanation: s.explanation,
  })),
};

async function main() {
  requireSafeDbTarget("seed the Time Words: Which Verb? game");

  const teacher = await prisma.user.findFirst({ where: { role: "teacher" }, select: { id: true } });
  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher first.");
  }

  const data = {
    title: "Time Words: Which Verb?",
    description: "Look at the time word. Then pick the verb: V2 (yesterday, last week) or have/has + V3 (ever, twice, many times).",
    content: JSON.stringify(CONTENT),
    type: "game",
    ui: "fill-in-blank",
    category: "games",
    level: "intermediate",
    isReleased: true,
    deletedAt: null,
    contentKind: MAP,
    createdBy: teacher.id,
  };
  await prisma.activity.upsert({ where: { id: TIME_WORD_VERB_ID }, update: data, create: { id: TIME_WORD_VERB_ID, ...data } });
  console.log(`Synced ${TIME_WORD_VERB_ID} (${SENTENCES.length} questions)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
