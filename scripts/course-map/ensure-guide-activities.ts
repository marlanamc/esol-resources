/**
 * Every grammar guide on the course map needs a released Activity row: the reader
 * only saves the finished-guide checkmark against an activityId, and it blocks
 * students from a guide whose row is unreleased. prisma/seed-grammar-only.ts stops
 * at Week 5, so this fills the rest. Resolves rows the way the reader page does.
 * Preview by default; --apply writes. Safe to re-run.
 */
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import { getGrammarGuide } from '@/lib/grammar-guide-registry';
import { lookupGrammarGuideActivity } from '@/lib/grammar-guide-activity';
import { prisma } from '@/lib/database/prisma';
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const apply = process.argv.includes('--apply');
async function main() {
  const slugs = [...new Map(COURSE_MAP_UNITS.flatMap(u => u.weeks.flatMap(w => w.items
    .filter(i => i.href?.startsWith('/grammar-reader/'))
    .map(i => [i.href!.split('/').pop()!.split('?')[0], w.number] as const)))).entries()];
  const toCreate: { slug: string; week: number }[] = [];
  const toRelease: { id: string; week: number }[] = [];
  for (const [slug, week] of slugs) {
    const guide = getGrammarGuide(slug);
    if (!guide) throw new Error(`No registry entry for ${slug}`);
    const row = await lookupGrammarGuideActivity(guide.activityTitle, slug);
    if (!row) toCreate.push({ slug, week });
    else if (!row.isReleased) toRelease.push({ id: row.id, week });
  }
  toCreate.forEach(({ slug, week }) => console.log(`W${week}: create ${slug}-guide`));
  toRelease.forEach(({ id, week }) => console.log(`W${week}: release ${id}`));
  if (!toCreate.length && !toRelease.length) return console.log('Every course-map guide has a released activity row.');
  if (!apply) return console.log(`Preview only (${toCreate.length} to create, ${toRelease.length} to release). Use --apply to write.`);
  requireSafeDbTarget('create and release course-map guide activities');
  const teacher = await prisma.user.findFirst({ where: { role: 'teacher' }, select: { id: true } });
  for (const { slug } of toCreate) {
    const guide = getGrammarGuide(slug)!;
    const fields = { title: guide.activityTitle, description: guide.metaDescription, type: 'guide', category: 'grammar', level: 'intermediate', content: JSON.stringify(await guide.loadContent()), isReleased: true };
    await prisma.activity.upsert({ where: { id: `${slug}-guide` }, update: fields, create: { id: `${slug}-guide`, ...fields, createdBy: teacher?.id } });
  }
  for (const { id } of toRelease) await prisma.activity.update({ where: { id }, data: { isReleased: true } });
  for (const [slug] of slugs) {
    const row = await lookupGrammarGuideActivity(getGrammarGuide(slug)!.activityTitle, slug);
    if (!row?.isReleased) throw new Error(`Verification failed: ${slug}`);
  }
  console.log(`Done: ${toCreate.length} created, ${toRelease.length} released. Verified every course-map guide. Student progress untouched.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
