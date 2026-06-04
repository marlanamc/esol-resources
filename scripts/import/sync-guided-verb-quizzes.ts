import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { GUIDED_VERB_QUIZ_PLAN, getGuidedVerbQuizTitle } from "@/data/verb-quiz-plan";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

type VerbData = {
  v1: string;
  v1_3rd: string;
  v1_ing: string;
  v2: string;
  v3: string;
  definition?: string;
};

type WeekData = {
  due_date: string;
  verbs: Record<string, VerbData>;
};

type QuizzesData = Record<string, WeekData>;

const prisma = new PrismaClient();

function loadVerbBank(): Record<string, VerbData> {
  const jsonPath = path.join(process.cwd(), "src/content/quizzes/verb-conjugations.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as QuizzesData;
  const verbBank: Record<string, VerbData> = {};

  for (const week of Object.values(data)) {
    for (const [verb, forms] of Object.entries(week.verbs)) {
      verbBank[verb] = forms;
    }
  }

  return verbBank;
}

async function main() {
  requireSafeDbTarget("sync guided two-verb quizzes");

  const teacher = await prisma.user.findFirst({
    where: { role: "teacher" },
    select: { id: true },
  });

  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher before syncing quizzes.");
  }

  const verbBank = loadVerbBank();
  const missingVerbs = GUIDED_VERB_QUIZ_PLAN.flatMap((quiz) => quiz.verbs).filter(
    (verb) => !verbBank[verb]
  );

  if (missingVerbs.length > 0) {
    throw new Error(`Missing verb forms for: ${Array.from(new Set(missingVerbs)).join(", ")}`);
  }

  for (const quiz of GUIDED_VERB_QUIZ_PLAN) {
    const title = getGuidedVerbQuizTitle(quiz.quizNumber);
    const verbs = Object.fromEntries(quiz.verbs.map((verb) => [verb, verbBank[verb]]));
    const content = {
      type: "verb-quiz",
      week: `Level ${quiz.levelNumber}`,
      due_date: quiz.dueDate,
      verbs,
    };

    await prisma.activity.upsert({
      where: { id: quiz.activityId },
      update: {
        title,
        description: "Complete the verb forms for this week's two focus verbs.",
        type: "quiz",
        category: "quizzes",
        level: "intermediate",
        content: JSON.stringify(content),
        isReleased: true,
        createdBy: teacher.id,
      },
      create: {
        id: quiz.activityId,
        title,
        description: "Complete the verb forms for this week's two focus verbs.",
        type: "quiz",
        category: "quizzes",
        level: "intermediate",
        content: JSON.stringify(content),
        isReleased: true,
        createdBy: teacher.id,
      },
    });

    console.log(`Synced ${title}`);
  }

  console.log(`\nDone. Synced ${GUIDED_VERB_QUIZ_PLAN.length} guided two-verb quizzes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
