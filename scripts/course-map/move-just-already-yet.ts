/** Targeted curriculum sync; stable item IDs preserve completion and rewards. */
import { PrismaClient } from '@prisma/client';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const db = new PrismaClient();
async function main() {
  const weeks = COURSE_MAP_UNITS.flatMap(unit => unit.weeks).filter(week => [5, 8].includes(week.number));
  console.log('Move Just, Already, Yet from Week 5 to Week 8, after Have You Ever.');
  if (!process.argv.includes('--apply')) return;
  requireSafeDbTarget('move Just Already Yet to November');
  await db.$transaction(async tx => {
    for (const week of weeks) {
      await tx.courseWeek.update({ where: {id: week.id}, data: {goal: week.goal} });
      for (const item of week.items) {
        await tx.courseMapItem.update({ where: {id: item.id}, data: {weekId: week.id, order: item.order} });
      }
    }
  });
  const item = await db.courseMapItem.findUniqueOrThrow({where: {id: 'just-already-yet'}});
  if (item.weekId !== weeks.find(week => week.number === 8)!.id || item.order !== 2) throw new Error('Move verification failed');
  console.log('Verified: Week 8, after the present-perfect introduction. Existing activity, progress, and points preserved.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
