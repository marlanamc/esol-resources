import { PrismaClient } from '@prisma/client';
import type { GrammarHospitalContent } from '../src/types/activity';
import {
  advancedCases,
  beginnerCases,
  cases,
  intermediateCases,
} from './grammar-hospital-cases';

const prisma = new PrismaClient();

const ACTIVITY_TITLE = 'Grammar Hospital — Helper Verb Repair';

const content: GrammarHospitalContent = {
  type: 'grammar-hospital',
  title: ACTIVITY_TITLE,
  description:
    "Diagnose what's wrong with each sentence, choose the right helper, and repair it. Levels: Beginner (do / does / be), Intermediate (past simple, present perfect, agreement), Advanced (modals, embedded questions, tag questions). Open the gear icon to change difficulty.",
  level: 'beginner',
  cases,
  participationPoints: 5,
  released: true,
};

async function main() {
  const counts = {
    beginner: beginnerCases.length,
    intermediate: intermediateCases.length,
    advanced: advancedCases.length,
  };
  console.log(
    `Seeding ${ACTIVITY_TITLE}…  total ${cases.length} cases ` +
      `(beginner ${counts.beginner} · intermediate ${counts.intermediate} · advanced ${counts.advanced})`
  );

  const data = {
    title: ACTIVITY_TITLE,
    description: content.description ?? null,
    content: JSON.stringify(content),
    type: 'game',
    ui: 'grammar-hospital',
    category: 'games',
    level: 'beginner',
    isReleased: true,
  };

  const existing = await prisma.activity.findFirst({ where: { title: ACTIVITY_TITLE } });

  if (existing) {
    await prisma.activity.update({ where: { id: existing.id }, data });
    console.log(`Updated existing activity: ${existing.id}`);
  } else {
    const created = await prisma.activity.create({ data });
    console.log(`Created new activity: ${created.id}`);
  }

  console.log('\nDone! Grammar Hospital deck refreshed with all three tiers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
