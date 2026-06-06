import { PrismaClient } from "@prisma/client";
import type { PartsOfSpeechContent } from "@/types/parts-of-speech";
import type { GrammarHospitalContent } from "@/types/activity";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

const partsOfSpeechDiscoveryContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Parts of Speech Discovery Game",
  courseMapDirections: "Start here: learn verbs first. This version is already set up for you.",
  groupId: "pos-1-verbs",
  roundMode: "round1",
  roundOverrides: {
    foundation: {
      rounds: {
        round1: {
          roundSize: 6,
          exerciseTypes: ["photo-sort", "pattern-choice", "swipe-sort"],
        },
      },
    },
  },
};

const numbersThroughTrillionsContent = {
  type: "numbers-game",
  courseMapPreset: true,
  courseMapTitle: "Numbers Through Trillions",
  courseMapDirections: "Practice big round numbers. The category is already chosen for this level.",
  category: "Round Numbers (1,000 | 5 million | 1 billion)",
};

async function main() {
  requireSafeDbTarget("sync guided Course Map wrappers");

  const teacher = await prisma.user.findFirst({
    where: { role: "teacher" },
    select: { id: true },
  });

  if (!teacher) {
    throw new Error("No teacher account found. Create or seed a teacher before syncing wrappers.");
  }

  await prisma.activity.upsert({
    where: { id: "parts-of-speech-discovery-guided" },
    update: {
      title: "Parts of Speech Discovery Game",
      description: "Guided Course Map version. Starts directly with verbs, Round 1, with no settings to choose.",
      type: "game",
      category: "games",
      level: "beginner",
      ui: "parts-of-speech",
      isReleased: true,
      content: JSON.stringify(partsOfSpeechDiscoveryContent),
      createdBy: teacher.id,
    },
    create: {
      id: "parts-of-speech-discovery-guided",
      title: "Parts of Speech Discovery Game",
      description: "Guided Course Map version. Starts directly with verbs, Round 1, with no settings to choose.",
      type: "game",
      category: "games",
      level: "beginner",
      ui: "parts-of-speech",
      isReleased: true,
      content: JSON.stringify(partsOfSpeechDiscoveryContent),
      createdBy: teacher.id,
    },
  });

  console.log("Synced guided wrapper: parts-of-speech-discovery-guided");

  await prisma.activity.upsert({
    where: { id: "numbers-through-trillions-guided" },
    update: {
      title: "Numbers Through Trillions",
      description: "Guided Course Map version. Starts directly with big round numbers and no category selector.",
      type: "game",
      category: "numbers",
      level: "beginner",
      ui: "numbers",
      isReleased: true,
      content: JSON.stringify(numbersThroughTrillionsContent),
      createdBy: teacher.id,
    },
    create: {
      id: "numbers-through-trillions-guided",
      title: "Numbers Through Trillions",
      description: "Guided Course Map version. Starts directly with big round numbers and no category selector.",
      type: "game",
      category: "numbers",
      level: "beginner",
      ui: "numbers",
      isReleased: true,
      content: JSON.stringify(numbersThroughTrillionsContent),
      createdBy: teacher.id,
    },
  });

  console.log("Synced guided wrapper: numbers-through-trillions-guided");

  const grammarHospitalSource = await prisma.activity.findFirst({
    where: {
      OR: [
        { id: "cmph2yk3b00000eflkmepetr3" },
        { title: "Grammar Hospital — Helper Verb Repair" },
      ],
    },
    select: { content: true },
  });

  if (!grammarHospitalSource) {
    throw new Error("Could not find the existing Grammar Hospital source activity.");
  }

  const grammarHospitalContent = JSON.parse(grammarHospitalSource.content) as GrammarHospitalContent;
  const guidedGrammarHospitalContent: GrammarHospitalContent = {
    ...grammarHospitalContent,
    courseMapPreset: true,
    courseMapTitle: "Grammar Hospital: Helper Verb Repair",
    courseMapDirections: "Fix helper-verb sentences.",
    defaultSettings: {
      tier: "beginner",
      complexity: 2,
      focuses: ["do-does", "be-vs-do"],
    },
  };

  await prisma.activity.upsert({
    where: { id: "grammar-hospital-helper-repair-guided" },
    update: {
      title: "Grammar Hospital: Helper Verb Repair",
      description: "Guided Course Map version. Starts with beginner helper-verb repair and no difficulty selector.",
      type: "game",
      category: "games",
      level: "beginner",
      ui: "grammar-hospital",
      isReleased: true,
      content: JSON.stringify(guidedGrammarHospitalContent),
      createdBy: teacher.id,
    },
    create: {
      id: "grammar-hospital-helper-repair-guided",
      title: "Grammar Hospital: Helper Verb Repair",
      description: "Guided Course Map version. Starts with beginner helper-verb repair and no difficulty selector.",
      type: "game",
      category: "games",
      level: "beginner",
      ui: "grammar-hospital",
      isReleased: true,
      content: JSON.stringify(guidedGrammarHospitalContent),
      createdBy: teacher.id,
    },
  });

  console.log("Synced guided wrapper: grammar-hospital-helper-repair-guided");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
