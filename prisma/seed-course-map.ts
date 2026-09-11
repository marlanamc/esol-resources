/**
 * Seeds CourseUnit, CourseWeek, and CourseMapItem.
 * Safe to re-run — uses upsert throughout.
 * Edit src/lib/course-map-data.ts to change the map, then re-run this seed.
 *
 * Ordering matters here:
 *  1. Stale items, then stale weeks, then stale units are removed first. A week
 *     that is no longer in the map has to go before the upserts run, because
 *     CourseWeek carries @@unique([unitId, number]) and a removed week would
 *     otherwise still be holding the number a later week is moving into.
 *     Deleting a week cascades to its items and its ClassReveal rows.
 *  2. Weeks are then written in two passes — parked on temporary numbers, then
 *     set to their real ones — so renumbering can never collide mid-flight.
 */
import { PrismaClient } from '@prisma/client';
import { COURSE_MAP_UNITS } from '../src/lib/course-map-data.js';

const prisma = new PrismaClient();

/** Well above any real week number, so parked values can never collide. */
const TEMP_NUMBER_OFFSET = 1000;

async function main() {
  console.log('🗺️  Seeding course map structure...\n');

  const activeUnitIds = COURSE_MAP_UNITS.map((unit) => unit.id);
  const activeWeeks = COURSE_MAP_UNITS.flatMap((unit) =>
    unit.weeks.map((week) => ({ unit, week }))
  );
  const activeWeekIds = activeWeeks.map(({ week }) => week.id);
  const activeItemIds = activeWeeks.flatMap(({ week }) => week.items.map((item) => item.id));

  // ── 1. Prune anything no longer in the map ────────────────────────────────
  const prunedItems = await prisma.courseMapItem.deleteMany({
    where: { id: { notIn: activeItemIds } },
  });
  if (prunedItems.count > 0) {
    console.log(`  🧹 Removed ${prunedItems.count} stale course map item(s)`);
  }

  const staleWeeks = await prisma.courseWeek.findMany({
    where: { id: { notIn: activeWeekIds } },
    select: { id: true, title: true },
  });
  if (staleWeeks.length > 0) {
    const staleWeekIds = staleWeeks.map((w) => w.id);
    const orphanedReveals = await prisma.classReveal.count({
      where: { weekId: { in: staleWeekIds } },
    });
    await prisma.courseWeek.deleteMany({ where: { id: { in: staleWeekIds } } });
    console.log(
      `  🧹 Removed ${staleWeeks.length} stale week(s): ${staleWeeks.map((w) => w.id).join(', ')}` +
        (orphanedReveals > 0 ? ` (and ${orphanedReveals} reveal row(s) pointing at them)` : '')
    );
  }

  const prunedUnits = await prisma.courseUnit.deleteMany({
    where: { id: { notIn: activeUnitIds } },
  });
  if (prunedUnits.count > 0) {
    console.log(`  🧹 Removed ${prunedUnits.count} stale unit(s)`);
  }

  // ── 2. Units ──────────────────────────────────────────────────────────────
  for (const unit of COURSE_MAP_UNITS) {
    await prisma.courseUnit.upsert({
      where: { id: unit.id },
      update: { number: unit.number, title: unit.title, month: unit.month ?? null },
      create: { id: unit.id, number: unit.number, title: unit.title, month: unit.month ?? null },
    });
  }
  console.log(`  ✅ ${COURSE_MAP_UNITS.length} units`);

  // ── 3. Weeks, parked on temporary numbers to dodge the unique constraint ──
  for (const [index, { unit, week }] of activeWeeks.entries()) {
    const parked = TEMP_NUMBER_OFFSET + index;
    await prisma.courseWeek.upsert({
      where: { id: week.id },
      update: { number: parked, title: week.title, goal: week.goal ?? null, unitId: unit.id },
      create: { id: week.id, unitId: unit.id, number: parked, title: week.title, goal: week.goal ?? null },
    });
  }
  for (const { week } of activeWeeks) {
    await prisma.courseWeek.update({ where: { id: week.id }, data: { number: week.number } });
  }
  console.log(`  ✅ ${activeWeeks.length} weeks`);

  // ── 4. Items ──────────────────────────────────────────────────────────────
  const validActivityIds = new Set(
    (await prisma.activity.findMany({ select: { id: true } })).map((row) => row.id)
  );

  let itemCount = 0;
  let skippedActivityLinks = 0;

  for (const { week } of activeWeeks) {
    for (const item of week.items) {
      const activityId =
        item.activityId && validActivityIds.has(item.activityId) ? item.activityId : null;
      if (item.activityId && !activityId) {
        skippedActivityLinks++;
        console.log(`  ⚠️  ${item.id}: activity "${item.activityId}" not found`);
      }

      const fields = {
        weekId: week.id,
        activityId,
        href: item.href ?? null,
        vocabUi: item.vocabUi ?? null,
        slot: item.slot,
        order: item.order,
        wrappedGame: item.wrappedGame,
        activityType: item.activityType,
        title: item.title,
      };

      await prisma.courseMapItem.upsert({
        where: { id: item.id },
        update: fields,
        create: { id: item.id, ...fields },
      });
      itemCount++;
    }
  }
  console.log(`  ✅ ${itemCount} items`);

  if (skippedActivityLinks > 0) {
    console.log(`  ⚠️  ${skippedActivityLinks} item(s) kept without activityId (activity not seeded yet)`);
  }
  console.log('\n✨ Course map seeded successfully.');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
