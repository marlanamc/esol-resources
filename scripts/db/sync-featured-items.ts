
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const MARLIE_CODE = "ESOL3";
  const DANIEL_CODE = "G54UEU";

  console.log("--- Starting Synchronization and Deduplication ---");

  // 1. Get Class IDs
  const marlieClass = await prisma.class.findUnique({
    where: { code: MARLIE_CODE },
    include: { assignments: { where: { isFeatured: true } } }
  });

  const danielClass = await prisma.class.findUnique({
    where: { code: DANIEL_CODE },
    include: { assignments: { where: { isFeatured: true } } }
  });

  if (!marlieClass || !danielClass) {
    throw new Error("One or both classes not found");
  }

  console.log(`Found Marlie's Class: ${marlieClass.id}`);
  console.log(`Found Daniel's Class: ${danielClass.id}`);

  // 2. Deduplicate Marlie's Class (ESOL3)
  console.log("\n--- Deduplicating Marlie's Class ---");
  const marlieAssignments = marlieClass.assignments;
  const activityMap = new Map<string, typeof marlieAssignments[0]>();
  const toDelete: string[] = [];

  // Sort by createdAt desc to keep the newest
  const sortedMarlieAssignments = [...marlieAssignments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  for (const asgn of sortedMarlieAssignments) {
    if (activityMap.has(asgn.activityId)) {
      toDelete.push(asgn.id);
    } else {
      activityMap.set(asgn.activityId, asgn);
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicates from Marlie's class: ${toDelete.join(", ")}`);
    await prisma.assignment.deleteMany({
      where: { id: { in: toDelete } }
    });
  } else {
    console.log("No duplicates found in Marlie's class.");
  }

  const uniqueMarlieActivities = Array.from(activityMap.values());
  console.log(`Marlie's class now has ${uniqueMarlieActivities.length} unique featured assignments.`);

  // 3. Synchronize Daniel's Class (G54UEU)
  console.log("\n--- Synchronizing Daniel's Class ---");
  const danielAssignments = danielClass.assignments;
  const marlieActivityIds = new Set(uniqueMarlieActivities.map(a => a.activityId));
  const danielActivityIds = new Set(danielAssignments.map(a => a.activityId));

  // Remove assignments in Daniel's that are NOT featured in Marlie's
  const toRemoveFromDaniel = danielAssignments
    .filter(a => !marlieActivityIds.has(a.activityId))
    .map(a => a.id);

  if (toRemoveFromDaniel.length > 0) {
    console.log(`Removing ${toRemoveFromDaniel.length} assignments from Daniel's class: ${toRemoveFromDaniel.join(", ")}`);
    await prisma.assignment.deleteMany({
      where: { id: { in: toRemoveFromDaniel } }
    });
  }

  // Add assignments to Daniel's that ARE featured in Marlie's but missing in Daniel's
  const toAddToDaniel = uniqueMarlieActivities.filter(a => !danielActivityIds.has(a.activityId));

  for (const asgn of toAddToDaniel) {
    console.log(`Adding assignment for activity ${asgn.activityId} to Daniel's class`);
    await prisma.assignment.create({
      data: {
        classId: danielClass.id,
        activityId: asgn.activityId,
        title: asgn.title,
        instructions: asgn.instructions,
        isFeatured: true,
        dueDate: asgn.dueDate
      }
    });
  }

  // Handle case where Daniel has the same activity but it's not the same assignment record
  // Actually, we want Daniel's list to MATCH exactly Marlie's unique activities.
  // Let's just make Daniel's featured list IDENTICAL in terms of activityIds.

  console.log("\n--- Synchronization Complete ---");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
