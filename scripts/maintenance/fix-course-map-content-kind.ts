/**
 * Repair course-map items whose linked Activity is not contentKind=map.
 *
 * The trap: getVisibleMap() (src/lib/course-map.ts) only surfaces an item's
 * activityId when the linked activity has contentKind === "map". If it doesn't,
 * the activityId is stripped from the payload while status stays "available" —
 * so the tile renders as an inert, unclickable card with no error anywhere.
 * A whole week can also disappear for independent/admin viewers, since a week
 * only counts as "published" if at least one item is contentKind=map.
 *
 * This script only ever promotes practice -> map on activities that are already
 * referenced by a CourseMapItem. It never deletes and never demotes, so it is
 * safe to run against production.
 *
 * Usage:
 *   npx tsx scripts/maintenance/fix-course-map-content-kind.ts            # dry run
 *   npx tsx scripts/maintenance/fix-course-map-content-kind.ts --apply    # writes
 */
import { PrismaClient } from "@prisma/client";
import { MAP } from "../../src/lib/content-kind";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

async function main() {
  const stale = await prisma.courseMapItem.findMany({
    where: {
      activityId: { not: null },
      activity: { contentKind: { not: MAP } },
    },
    select: {
      title: true,
      activityId: true,
      week: { select: { number: true, id: true } },
      activity: { select: { id: true, title: true, contentKind: true } },
    },
    orderBy: { order: "asc" },
  });

  if (stale.length === 0) {
    console.log("No mis-tagged course map activities. Nothing to do.");
    return;
  }

  console.log(`Found ${stale.length} course map item(s) with contentKind != "${MAP}":\n`);
  for (const item of stale) {
    console.log(
      `  week ${item.week.number}  ${item.activity?.id}  ` +
        `[${item.activity?.contentKind}]  ${item.title}`
    );
  }

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to promote these to contentKind=map.");
    return;
  }

  const ids = [...new Set(stale.map((i) => i.activityId!).filter(Boolean))];
  const result = await prisma.activity.updateMany({
    where: { id: { in: ids } },
    data: { contentKind: MAP },
  });

  console.log(`\nUpdated ${result.count} activit${result.count === 1 ? "y" : "ies"} to contentKind=${MAP}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
