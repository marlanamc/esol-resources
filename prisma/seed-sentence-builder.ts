import { PrismaClient } from "@prisma/client";
import { MAP } from "../src/lib/content-kind";
import { SENTENCE_BUILDER_DECKS } from "../src/content/sentence-builder";
import { requireSafeDbTarget } from "../scripts/lib/require-safe-db-target.js";

const prisma = new PrismaClient();

// One game Activity per worksheet deck. contentKind must be "map" or the
// Course Map silently hides the item. Run db:seed:course-map afterwards to
// link new decks into their week.
async function main() {
  requireSafeDbTarget("seed Sentence Builder decks");

  const teacher = await prisma.user.findFirst({ where: { role: "teacher" }, select: { id: true } });
  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher before seeding Sentence Builder.");
  }

  for (const deck of SENTENCE_BUILDER_DECKS) {
    const data = {
      title: deck.content.title,
      description: deck.content.description ?? null,
      content: JSON.stringify(deck.content),
      type: "game",
      ui: "sentence-builder",
      category: "games",
      level: "beginner",
      isReleased: true,
      contentKind: MAP,
      createdBy: teacher.id,
    };
    await prisma.activity.upsert({ where: { id: deck.id }, update: data, create: { id: deck.id, ...data } });
    console.log(`Synced ${deck.id} (week ${deck.week}, ${deck.content.rounds.length} rounds)`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
