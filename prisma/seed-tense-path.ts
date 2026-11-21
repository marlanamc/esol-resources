import { PrismaClient } from "@prisma/client";
import { PRACTICE } from "../src/lib/content-kind";
import { requireSafeDbTarget } from "../scripts/lib/require-safe-db-target.js";

const prisma = new PrismaClient();

export const TENSE_PATH_ACTIVITY_ID = "tense-path";

// One Practice Library game. Questions come from the Timeline Tenses banks in
// code, so this row only stores the type and the "Extra practice" link.
async function main() {
  requireSafeDbTarget("seed the Tense Path game");

  const teacher = await prisma.user.findFirst({ where: { role: "teacher" }, select: { id: true } });
  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher before seeding Tense Path.");
  }

  // The original Timeline Tenses game stays as it is; Tense Path links to it.
  const timelineGame = await prisma.activity.findFirst({
    where: { ui: "timeline-tenses", title: "Timeline Tenses", deletedAt: null },
    select: { id: true },
  });
  if (!timelineGame) {
    console.warn("Timeline Tenses activity not found; the Extra practice link will be hidden.");
  }

  const data = {
    title: "Tense Path",
    description: "Level up through the tenses with stamp timelines: learn a rule, pass Round 1, master Round 2.",
    content: JSON.stringify({
      type: "tense-path",
      ...(timelineGame ? { extraPracticeActivityId: timelineGame.id } : {}),
    }),
    type: "game",
    ui: "tense-path",
    category: "games",
    level: "intermediate",
    isReleased: true,
    contentKind: PRACTICE,
    createdBy: teacher.id,
  };

  await prisma.activity.upsert({
    where: { id: TENSE_PATH_ACTIVITY_ID },
    update: data,
    create: { id: TENSE_PATH_ACTIVITY_ID, ...data },
  });
  console.log(`Synced ${TENSE_PATH_ACTIVITY_ID}${timelineGame ? ` (extra practice → ${timelineGame.id})` : ""}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
