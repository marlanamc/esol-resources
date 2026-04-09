/**
 * Import the Parts of Speech Pattern Discovery Game
 *
 * Usage: npx tsx scripts/import/import-parts-of-speech-game.ts
 *    or: npm run import:parts-of-speech
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GAME_CONTENT = {
  type: 'parts-of-speech',
  roundSize: 10,
};

async function importGame() {
  try {
    console.log('🎮 Importing Parts of Speech Pattern Discovery Game...\n');

    const teacher = await prisma.user.findFirst({
      where: { role: 'teacher' },
    });

    if (!teacher) {
      console.error('❌ No teacher account found. Please create a teacher account first.');
      process.exit(1);
    }

    const existing = await prisma.activity.findUnique({
      where: { id: 'parts-of-speech-game' },
    });

    const baseData = {
      title: 'Parts of Speech Discovery Game',
      description:
        'Learn all 8 parts of speech through discovery-based exercises. Master nouns, verbs, adjectives, adverbs, prepositions, conjunctions, pronouns, and articles — then see how they connect to grammar patterns like gerunds and infinitives.',
      type: 'game',
      category: 'games',
      level: 'beginner',
      ui: 'parts-of-speech',
      content: JSON.stringify(GAME_CONTENT),
    };

    if (existing) {
      const updated = await prisma.activity.update({
        where: { id: 'parts-of-speech-game' },
        data: baseData,
      });
      console.log('✅ Activity updated:', updated.id);
    } else {
      const created = await prisma.activity.create({
        data: {
          id: 'parts-of-speech-game',
          ...baseData,
          createdBy: teacher.id,
        },
      });
      console.log('✅ Activity created:', created.id);
    }

    console.log('   Title: Parts of Speech Discovery Game');
    console.log('   Type:  game');
    console.log('   UI:    parts-of-speech');
    console.log('\n🔗 Access at: /activity/parts-of-speech-game');
    console.log('\n✨ Import complete!\n');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importGame();
