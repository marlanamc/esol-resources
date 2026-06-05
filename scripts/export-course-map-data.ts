import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const p = new PrismaClient();

async function main() {
  const units = await p.courseUnit.findMany({
    orderBy: { number: 'asc' },
    include: {
      weeks: {
        orderBy: { number: 'asc' },
        include: { items: { orderBy: { order: 'asc' } } },
      },
    },
  });

  const data = units.map((u) => ({
    id: u.id,
    number: u.number,
    title: u.title,
    ...(u.month ? { month: u.month } : {}),
    weeks: u.weeks.map((w) => ({
      id: w.id,
      number: w.number,
      title: w.title,
      ...(w.goal ? { goal: w.goal } : {}),
      items: w.items.map((i) => ({
        id: i.id,
        ...(i.activityId ? { activityId: i.activityId } : {}),
        ...(i.href ? { href: i.href } : {}),
        slot: i.slot,
        order: i.order,
        wrappedGame: i.wrappedGame,
        activityType: i.activityType,
        title: i.title,
      })),
    })),
  }));

  const out = [
    `export interface CourseMapItemDef {`,
    `  id: string;`,
    `  activityId?: string;`,
    `  href?: string;`,
    `  slot: string;`,
    `  order: number;`,
    `  wrappedGame: boolean;`,
    `  activityType: string;`,
    `  title: string;`,
    `}`,
    ``,
    `export interface CourseWeekDef {`,
    `  id: string;`,
    `  number: number;`,
    `  title: string;`,
    `  goal?: string;`,
    `  items: CourseMapItemDef[];`,
    `}`,
    ``,
    `export interface CourseUnitDef {`,
    `  id: string;`,
    `  number: number;`,
    `  title: string;`,
    `  month?: string;`,
    `  weeks: CourseWeekDef[];`,
    `}`,
    ``,
    `export const COURSE_MAP_UNITS: CourseUnitDef[] = ${JSON.stringify(data, null, 2)};`,
    ``,
  ].join('\n');

  const dest = path.resolve('src/lib/course-map-data.ts');
  fs.writeFileSync(dest, out);
  console.log(`✅ Written to ${dest} (${units.length} units)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
