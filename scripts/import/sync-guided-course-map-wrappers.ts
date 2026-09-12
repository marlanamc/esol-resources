import { PrismaClient } from "@prisma/client";
import type { GrammarHospitalContent } from "@/types/activity";
import {
  numbersThroughTrillionsContent,
  partsOfSpeechDiscoveryContent,
} from "./guided-course-map-content";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

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
      contentKind: "map",
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
      contentKind: "map",
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
      contentKind: "map",
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
      contentKind: "map",
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

  // contentKind MUST be "map" on every wrapper the Course Map links to.
  // getVisibleMap only attaches an item's activityId when the activity is
  // contentKind=map (src/lib/course-map.ts) — otherwise the tile renders but
  // is inert, with no error anywhere to explain why.
  const grammarHospitalWrappers: Array<{
    id: string;
    title: string;
    description: string;
    content: GrammarHospitalContent;
  }> = [
    {
      id: "grammar-hospital-helper-repair-guided",
      title: "Grammar Hospital: Helper Verb Repair",
      description:
        "Guided Course Map version. Starts with beginner helper-verb repair and no difficulty selector.",
      content: {
        ...grammarHospitalContent,
        courseMapPreset: true,
        courseMapTitle: "Grammar Hospital: Helper Verb Repair",
        courseMapDirections: "Fix helper-verb sentences.",
        defaultSettings: {
          tier: "beginner",
          complexity: 2,
          focuses: ["do-does", "be-vs-do"],
        },
      },
    },
    {
      // Week 1 extra practice: the two errors every beginner makes — a dropped
      // third-person -s, and BE standing in for DO. Five cases a sitting.
      id: "grammar-hospital-first-aid-guided",
      title: "Grammar Hospital: First Aid",
      description:
        "Guided Course Map version for Week 1. Five short sentences: missing third-person -s and is/does mix-ups.",
      content: {
        ...grammarHospitalContent,
        courseMapPreset: true,
        courseMapTitle: "Fix the Sentence",
        courseMapDirections: "Five sentences. Find what's wrong, then fix it.",
        roundSize: 5,
        defaultSettings: {
          tier: "beginner",
          complexity: 2,
          focuses: ["subject-verb-agreement", "be-vs-do"],
        },
      },
    },
  ];

  for (const wrapper of grammarHospitalWrappers) {
    const fields = {
      title: wrapper.title,
      description: wrapper.description,
      type: "game",
      category: "games",
      level: "beginner",
      ui: "grammar-hospital",
      isReleased: true,
      contentKind: "map",
      content: JSON.stringify(wrapper.content),
      createdBy: teacher.id,
    };

    await prisma.activity.upsert({
      where: { id: wrapper.id },
      update: fields,
      create: { id: wrapper.id, ...fields },
    });

    console.log(`Synced guided wrapper: ${wrapper.id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
