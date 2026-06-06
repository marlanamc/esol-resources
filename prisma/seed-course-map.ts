/**
 * Seeds CourseUnit, CourseWeek, and CourseMapItem.
 * Safe to re-run — uses upsert throughout.
 * Edit src/lib/course-map-data.ts to change the map, then re-run this seed.
 */
import { PrismaClient } from '@prisma/client';
import { COURSE_MAP_UNITS } from '../src/lib/course-map-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🗺️  Seeding course map structure...\n');

  let unitCount = 0;
  let weekCount = 0;
  let itemCount = 0;

  for (const unit of COURSE_MAP_UNITS) {
    await prisma.courseUnit.upsert({
      where: { id: unit.id },
      update: { number: unit.number, title: unit.title, month: unit.month ?? null },
      create: { id: unit.id, number: unit.number, title: unit.title, month: unit.month ?? null },
    });
    unitCount++;

    for (const week of unit.weeks) {
      await prisma.courseWeek.upsert({
        where: { id: week.id },
        update: { number: week.number, title: week.title, goal: week.goal ?? null, unitId: unit.id },
        create: { id: week.id, unitId: unit.id, number: week.number, title: week.title, goal: week.goal ?? null },
      });
      weekCount++;

      for (const item of week.items) {
        await prisma.courseMapItem.upsert({
          where: { id: item.id },
          update: {
            weekId: week.id,
            activityId: item.activityId ?? null,
            href: item.href ?? null,
            slot: item.slot,
            order: item.order,
            wrappedGame: item.wrappedGame,
            activityType: item.activityType,
            title: item.title,
          },
          create: {
            id: item.id,
            weekId: week.id,
            activityId: item.activityId ?? null,
            href: item.href ?? null,
            slot: item.slot,
            order: item.order,
            wrappedGame: item.wrappedGame,
            activityType: item.activityType,
            title: item.title,
          },
        });
        itemCount++;
      }
    }
  }

  const activeItemIds = COURSE_MAP_UNITS.flatMap((unit) =>
    unit.weeks.flatMap((week) => week.items.map((item) => item.id))
  );
  const pruned = await prisma.courseMapItem.deleteMany({
    where: { id: { notIn: activeItemIds } },
  });
  if (pruned.count > 0) {
    console.log(`  🧹 Removed ${pruned.count} stale course map item(s)`);
  }

  console.log(`  ✅ ${unitCount} units`);
  console.log(`  ✅ ${weekCount} weeks`);
  console.log(`  ✅ ${itemCount} items`);
  console.log('\n✨ Course map seeded successfully.');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
