/**
 * Activity rows for the Oct 2026 grammar progression audit. The course-map items
 * and week goals sync on deploy (prisma/seed-course-map.ts runs in `npm run build`);
 * this covers what that seed does not: the Activity rows guides save progress to.
 * Run after the PR deploys. Preview by default; --apply writes.
 */
import { PrismaClient } from '@prisma/client';
import { getGrammarGuide } from '../../src/lib/grammar-guide-registry';
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const db = new PrismaClient();
const OLD_W24_TITLE = 'Present Perfect + How Long';
const FALL_SLUG = 'fall-review-six-tenses';
async function main() {
  const newW24Title = getGrammarGuide('present-perfect-how-long')!.activityTitle;
  const fallTitle = getGrammarGuide(FALL_SLUG)!.activityTitle;
  console.log(`Week 15: create the "${fallTitle}" guide activity (${FALL_SLUG}-guide), released.`);
  console.log(`Week 24: rename the guide activity "${OLD_W24_TITLE}" -> "${newW24Title}".`);
  if (!process.argv.includes('--apply')) return console.log('Preview only. Use --apply to write.');
  requireSafeDbTarget('grammar progression activity sync');
  const teacher = await db.user.findFirst({ where: { role: 'teacher' }, select: { id: true } });
  await db.$transaction(async tx => {
    // Guide progress saves against an Activity row found by title or `<slug>-guide`.
    const activity = { title: fallTitle, type: 'guide', category: 'grammar', level: 'intermediate', content: JSON.stringify({ externalUrl: `/grammar-reader/${FALL_SLUG}` }), isReleased: true };
    await tx.activity.upsert({ where: { id: `${FALL_SLUG}-guide` }, update: activity, create: { id: `${FALL_SLUG}-guide`, ...activity, createdBy: teacher?.id } });
    await tx.activity.updateMany({ where: { title: OLD_W24_TITLE, type: 'guide', category: 'grammar' }, data: { title: newW24Title } });
  });
  const renamed = await db.activity.count({ where: { title: newW24Title, type: 'guide' } });
  if (!renamed) throw new Error(`No guide activity titled "${newW24Title}" after the rename`);
  console.log('Verified. Existing progress and points preserved.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
