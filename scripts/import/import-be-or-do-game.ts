import { PrismaClient } from '@prisma/client';
import { parseBeOrDoRounds } from '../../src/components/games/matching-game-parse';
import {
  BE_OR_DO_ACTIVITY_ID,
  BE_OR_DO_CONTENT,
  BE_OR_DO_DESCRIPTION,
  BE_OR_DO_TITLE,
} from '../../src/content/games/be-or-do-questions';

/**
 * Seeds the Week 5 "Be or Do?" question game. Writes to whatever DATABASE_URL
 * points at.
 *
 * Usage: npm run import:be-or-do
 */
const prisma = new PrismaClient();

async function main() {
  console.log(`🚀 Importing "${BE_OR_DO_TITLE}" question game...\n`);

  const teacher = await prisma.user.findFirst({
    where: { role: { in: ['admin', 'teacher'] } },
  });
  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    process.exit(1);
  }

  const fields = {
    title: BE_OR_DO_TITLE,
    description: BE_OR_DO_DESCRIPTION,
    type: 'game',
    category: 'games',
    ui: 'matching',
    level: 'beginner',
    contentKind: 'map',
    content: BE_OR_DO_CONTENT,
    isReleased: true,
  };

  const activity = await prisma.activity.upsert({
    where: { id: BE_OR_DO_ACTIVITY_ID },
    update: fields,
    create: { id: BE_OR_DO_ACTIVITY_ID, ...fields, createdBy: teacher.id },
  });

  const rounds = parseBeOrDoRounds(BE_OR_DO_CONTENT);
  const cardCount = rounds.reduce((sum, round) => sum + round.cards.length, 0);
  console.log(`✅ Seeded "${BE_OR_DO_TITLE}" (${activity.id})`);
  console.log(`   ${rounds.length} rounds, ${cardCount} cards`);
  console.log(`   → /activity/${BE_OR_DO_ACTIVITY_ID}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
