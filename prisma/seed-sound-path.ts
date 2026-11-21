import { PrismaClient } from "@prisma/client";
import { MAP } from "../src/lib/content-kind";
import { requireSafeDbTarget } from "../scripts/lib/require-safe-db-target.js";

const prisma = new PrismaClient();

export const SOUND_PATH_ACTIVITY_ID = "sound-path";

// One Pronunciation game, shown next to the -ed Sounds Game. Words come from
// the -ed verb list in code, so this row only stores the type and the
// "Extra practice" link to the original game.
async function main() {
  requireSafeDbTarget("seed the Sound Path game");

  const teacher = await prisma.user.findFirst({ where: { role: "teacher" }, select: { id: true } });
  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher before seeding Sound Path.");
  }

  // The original -ed Sounds game stays as it is; Sound Path links to it.
  const edGame =
    (await prisma.activity.findFirst({
      where: { ui: "ed-pronunciation", title: "-ed Sounds Game", deletedAt: null },
      select: { id: true },
    })) ??
    (await prisma.activity.findFirst({
      where: { ui: "ed-pronunciation", deletedAt: null },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    }));
  if (!edGame) {
    console.warn("-ed Sounds Game not found; the Extra practice link will be hidden.");
  }

  const data = {
    title: "Sound Path: -ed Endings",
    description: "Level up from hearing the extra clap to sorting every -ed word: learn a rule, pass Round 1, master Round 2.",
    content: JSON.stringify({
      type: "sound-path",
      ...(edGame ? { extraPracticeActivityId: edGame.id } : {}),
    }),
    type: "game",
    ui: "sound-path",
    category: "pronunciation",
    level: "beginner",
    isReleased: true,
    // "map" so the Course Map shows it (week 11). Only the map reads
    // contentKind; the Practice Library / Pronunciation lists still show it.
    contentKind: MAP,
    createdBy: teacher.id,
  };

  await prisma.activity.upsert({
    where: { id: SOUND_PATH_ACTIVITY_ID },
    update: data,
    create: { id: SOUND_PATH_ACTIVITY_ID, ...data },
  });
  console.log(`Synced ${SOUND_PATH_ACTIVITY_ID}${edGame ? ` (extra practice → ${edGame.id})` : ""}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
