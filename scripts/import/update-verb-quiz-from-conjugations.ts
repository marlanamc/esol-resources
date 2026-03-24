/**
 * Overwrites one verb quiz activity's `content.verbs` (and week/due_date) from
 * `src/content/quizzes/verb-conjugations.json`, matching quiz number to entry order
 * (Quiz 1 = first week block, Quiz 12 = 12th block).
 *
 * Usage: npx tsx scripts/import/update-verb-quiz-from-conjugations.ts [quizNumber]
 * Default quizNumber: 12
 *
 * Hosted / production-like URLs (e.g. db.prisma.io) are blocked by db-guard unless you run:
 *
 *   ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=<hostname-from-error> npm run import:verb-quiz-sync -- 12
 *
 * Local dev (localhost) runs without those variables.
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const { requireSafeDbTarget, parseActiveDbTarget } = require("../lib/require-safe-db-target");
const prisma = new PrismaClient();

type VerbData = {
  v1: string;
  v1_3rd: string;
  v1_ing: string;
  v2: string;
  v3: string;
};

type WeekData = {
  due_date: string;
  verbs: Record<string, VerbData>;
};

type QuizzesData = Record<string, WeekData>;

async function main() {
  const quizNumber = Math.max(1, parseInt(process.argv[2] ?? "12", 10) || 12);
  try {
    requireSafeDbTarget(`update verb quiz ${quizNumber} from conjugations JSON`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ALLOW_PROD_DB_MUTATION")) {
      try {
        const target = parseActiveDbTarget();
        console.error("\nYour POSTGRES_URL points at a production-like host, so the script stopped on purpose.");
        console.error("To update this quiz on that database anyway, copy and run:\n");
        console.error(
          `  ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=${target.hostname} npm run import:verb-quiz-sync -- ${quizNumber}\n`
        );
      } catch {
        // parseActiveDbTarget may throw if URL missing; original error is enough
      }
    }
    throw err;
  }

  const jsonPath = path.join(process.cwd(), "src/content/quizzes/verb-conjugations.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw) as QuizzesData;
  const entries = Object.entries(data);
  const idx = quizNumber - 1;
  if (idx < 0 || idx >= entries.length) {
    console.error(`Quiz ${quizNumber} out of range (file has ${entries.length} week blocks).`);
    process.exit(1);
  }

  const [weekName, weekData] = entries[idx];
  const title = `Verb Quiz ${quizNumber}`;

  const activity = await prisma.activity.findFirst({
    where: { title, type: "quiz" },
  });

  if (!activity) {
    console.error(`No activity found with title "${title}" and type quiz.`);
    process.exit(1);
  }

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(activity.content) as Record<string, unknown>;
  } catch {
    console.error("Existing activity content is not valid JSON.");
    process.exit(1);
  }

  const nextContent = {
    ...parsed,
    type: "verb-quiz",
    week: weekName,
    due_date: weekData.due_date,
    verbs: weekData.verbs,
  };

  await prisma.activity.update({
    where: { id: activity.id },
    data: { content: JSON.stringify(nextContent) },
  });

  console.log(`✅ Updated "${title}" (${weekName})`);
  console.log(`   Verbs: ${Object.keys(weekData.verbs).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
