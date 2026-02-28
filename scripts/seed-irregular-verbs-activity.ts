import { prisma } from '@/lib/prisma';

/**
 * Seed script to create a test Irregular Verbs Game activity
 * Run with: npx tsx scripts/seed-irregular-verbs-activity.ts
 */

async function main() {
  console.log('🌱 Seeding Irregular Verbs Game activity...');

  try {
    // Create or update the activity
    const activity = await prisma.activity.upsert({
      where: { id: 'irregular-verbs-game' },
      update: {
        title: 'Irregular Verbs Pattern Game',
        description: 'Master irregular verbs by learning their patterns. Complete groups sequentially to unlock new patterns.',
        type: 'game',
        category: 'games',
        ui: 'irregular-verbs',
        content: JSON.stringify({
          type: 'irregular-verbs',
          roundSize: 10,
          exerciseTypes: ['fill-in-blank', 'multiple-choice', 'sentence-completion', 'pattern-sorting', 'speed-matching']
        })
      },
      create: {
        id: 'irregular-verbs-game',
        title: 'Irregular Verbs Pattern Game',
        description: 'Master irregular verbs by learning their patterns. Complete groups sequentially to unlock new patterns.',
        type: 'game',
        category: 'games',
        ui: 'irregular-verbs',
        content: JSON.stringify({
          type: 'irregular-verbs',
          roundSize: 10,
          exerciseTypes: ['fill-in-blank', 'multiple-choice', 'sentence-completion', 'pattern-sorting', 'speed-matching']
        })
      }
    });

    console.log('✅ Activity created/updated:', activity.id);
    console.log(`   Title: ${activity.title}`);
    console.log(`   Type: ${activity.type}`);
    console.log(`   UI: ${activity.ui}`);
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Add this activity to an assignment in the teacher dashboard');
    console.log('2. Navigate to the activity as a student to test');
    console.log('3. Complete Group 1 with 80%+ accuracy to unlock Group 2a');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding activity:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
