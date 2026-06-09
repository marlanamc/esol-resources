import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TITLE = 'Verb Speed Round';

async function main() {
  console.log('🚀 Importing Verb Speed Round game...\n');

  const teacher = await prisma.user.findFirst({ where: { role: 'teacher' } });
  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    return;
  }
  console.log(`✓ Found teacher: ${teacher.name}\n`);

  const existing = await prisma.activity.findFirst({
    where: { title: TITLE, type: 'game' },
  });
  if (existing) {
    console.log(`⏭️  "${TITLE}" already exists (${existing.id}). Updating content payload…`);
    await prisma.activity.update({
      where: { id: existing.id },
      data: {
        ui: 'verb-speed-round',
        content: JSON.stringify({ type: 'verb-speed-round', verbsPerRound: 10 }),
      },
    });
    console.log('✅ Updated.\n');
    return;
  }

  const activity = await prisma.activity.create({
    data: {
      title: TITLE,
      description:
        'Race through 10 random irregular verbs. Type the past (V2) and past participle (V3). Build a combo, earn points.',
      type: 'game',
      category: 'games',
      ui: 'verb-speed-round',
      level: 'intermediate',
      content: JSON.stringify({ type: 'verb-speed-round', verbsPerRound: 10 }),
      createdBy: teacher.id,
    },
  });

  console.log(`✅ Created "${TITLE}" (${activity.id})\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
