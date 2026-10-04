/** Removes two optional tense guides from Week 4. The guides themselves stay in the grammar library. */
import { PrismaClient } from '@prisma/client';
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const db = new PrismaClient();
const ITEM_IDS = ['past-simple-past-continuous-guide', 'all-verb-tenses-overview'];
async function main() {
  const items = await db.courseMapItem.findMany({ where: { id: { in: ITEM_IDS } }, include: { week: { select: { number: true } } } });
  for (const item of items) console.log(`  Week ${item.week.number}  ${item.slot}  ${item.title}  (${item.id})`);
  if (items.length === 0) { console.log('Nothing to remove.'); return; }
  if (items.some(item => item.week.number !== 4 || item.slot !== 'extra')) throw new Error('Unexpected item location; refusing to delete.');
  if (!process.argv.includes('--apply')) { console.log(`\nDry run. Re-run with --apply to remove ${items.length} item(s).`); return; }
  requireSafeDbTarget('remove Week 4 tense guides');
  const { count } = await db.courseMapItem.deleteMany({ where: { id: { in: ITEM_IDS } } });
  console.log(`\nRemoved ${count} item(s) from Week 4.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
