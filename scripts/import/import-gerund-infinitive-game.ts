/**
 * Import the Gerunds & Infinitives Patterns Game
 *
 * Usage: npx tsx scripts/import/import-gerund-infinitive-game.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GAME_CONTENT = {
  type: 'gerund-infinitive',
  roundSize: 10,
};

async function importGame() {
  try {
    console.log('🎮 Importing Gerunds & Infinitives Patterns Game...\n');

    const teacher = await prisma.user.findFirst({
      where: { role: 'teacher' },
    });

    if (!teacher) {
      console.error('❌ No teacher account found. Please create a teacher account first.');
      process.exit(1);
    }

    const existing = await prisma.activity.findUnique({
      where: { id: 'gerund-infinitive-game' },
    });

    const baseData = {
      title: 'Gerunds & Infinitives Patterns Game',
      description:
        'Master the six core gerund and infinitive patterns through interactive exercises. Learn when to use -ing vs to + verb, practice with verbs like enjoy, want, avoid, and decide, and build accuracy through pattern-based challenges.',
      type: 'game',
      category: 'games',
      level: 'intermediate',
      ui: 'gerund-infinitive',
      content: JSON.stringify(GAME_CONTENT),
    };

    if (existing) {
      const updated = await prisma.activity.update({
        where: { id: 'gerund-infinitive-game' },
        data: baseData,
      });
      console.log('✅ Activity updated:', updated.id);
    } else {
      const created = await prisma.activity.create({
        data: {
          id: 'gerund-infinitive-game',
          ...baseData,
          createdBy: teacher.id,
        },
      });
      console.log('✅ Activity created:', created.id);
    }

    console.log('   Title: Gerunds & Infinitives Patterns Game');
    console.log('   Type: game');
    console.log('   Category: games');
    console.log('   UI: gerund-infinitive');
    console.log('\n🔗 Access at: /activity/gerund-infinitive-game');
    console.log('\n✨ Import complete!\n');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importGame();
