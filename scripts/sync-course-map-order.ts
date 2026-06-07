/**
 * Sync CourseMapItem.order from src/lib/course-map-data.ts without touching other fields.
 * Safe to re-run when course-map-data order changes and full seed is blocked.
 */
import { PrismaClient } from "@prisma/client";
import { COURSE_MAP_UNITS } from "../src/lib/course-map-data.js";

const prisma = new PrismaClient();

async function main() {
  let updated = 0;

  for (const unit of COURSE_MAP_UNITS) {
    for (const week of unit.weeks) {
      for (const item of week.items) {
        const result = await prisma.courseMapItem.updateMany({
          where: { id: item.id },
          data: { order: item.order },
        });
        updated += result.count;
      }
    }
  }

  console.log(`✅ Synced order for ${updated} course map item(s).`);
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
