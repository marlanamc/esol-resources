/** Place weekly warm-ups without releasing content or changing class schedules. */
import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';
import { mkdir, writeFile } from 'node:fs/promises';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
import { requireSafeDbTarget } from '../lib/require-safe-db-target';
loadEnvConfig(process.cwd());
async function main() {
  const prisma = new PrismaClient();
  try {
    const weeks = await prisma.courseWeek.findMany({ include: { items: true } });
    const desired = COURSE_MAP_UNITS.flatMap(unit => unit.weeks).flatMap(week =>
      week.items.filter(item => item.activityId === 'word-rescue').map(item => ({ weekId: week.id, item })));
    if (desired.some(node => !weeks.some(week => week.id === node.weekId))) throw new Error('A course-map week is missing; no changes applied.');
    if (!await prisma.activity.findUnique({ where: { id: 'word-rescue' } })) throw new Error('Word Rescue must already exist.');
    console.log(JSON.stringify({ apply: process.argv.includes('--apply'), weeks: desired.length, existing: weeks.flatMap(week => week.items).filter(item => item.activityId === 'word-rescue').length }));
    if (!process.argv.includes('--apply')) return;
    requireSafeDbTarget('place Word Rescue first without changing releases');
    await mkdir('output/word-rescue', { recursive: true });
    await writeFile(`output/word-rescue/release-backup-placement-${Date.now()}.json`, JSON.stringify(weeks.flatMap(week => week.items.filter(item => item.activityId === 'word-rescue')), null, 2));
    await prisma.$transaction(async tx => {
      for (const { weekId, item } of desired) {
        const week = weeks.find(week => week.id === weekId)!;
        const order = Math.min(0, ...week.items.filter(row => row.id !== item.id).map(row => row.order)) - 1;
        const data = { weekId, activityId: 'word-rescue', href: item.href, slot: 'required', order, wrappedGame: false, activityType: 'pronunciation', title: item.title };
        await tx.courseMapItem.upsert({ where: { id: item.id }, update: data, create: { id: item.id, ...data } });
      }
    });
    const actual = await prisma.courseWeek.findMany({ where: { id: { in: desired.map(node => node.weekId) } }, include: { items: { orderBy: { order: 'asc' } } } });
    if (!actual.every(week => week.items[0]?.id === `${week.id}-word-rescue`)) throw new Error('First-position verification failed.');
    console.log(`Verified Word Rescue first in ${actual.length} weeks. Releases and schedules unchanged.`);
  } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
