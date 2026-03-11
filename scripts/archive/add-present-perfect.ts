import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('replace activities with present perfect guide');

async function main() {
  console.log('🧹 Cleaning up placeholder activities...');

  // Delete all existing activities
  await prisma.activity.deleteMany({});
  console.log('✅ Removed all placeholder activities');

  console.log('📚 Adding Present Perfect guide...');

  // Add the Present Perfect guide
  const presentPerfectGuide = await prisma.activity.create({
    data: {
      title: 'Present Perfect Guide',
      description: 'Complete guide to Present Perfect tense with numbered sections for easy navigation. Includes meaning, past participles, forms (positive, negative, questions), and time expressions (for/since, already/yet/just, ever/never) with interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify({
        url: '/present-perfect-complete-guide.html',
        sections: [
          'Section 1: When Do We Use Present Perfect?',
          'Section 2: Understanding Past Participles',
          'Section 3: Present Perfect vs. Past Simple',
          'Section 4: Positive Form',
          'Section 5: Negative Form',
          'Section 6: Question Form',
          'Section 7: For & Since',
          'Section 8: Already, Yet & Just',
          'Section 9: Ever & Never',
          'Section 10: Mixed Practice',
          'Section 11: Summary'
        ],
        features: [
          'Numbered sections for easy navigation',
          'Interactive exercises with instant feedback',
          'Hover-to-reveal practice sections',
          'Print-friendly format',
          '9 comprehensive exercises'
        ]
      })
    }
  });

  console.log('✅ Added Present Perfect guide:', presentPerfectGuide.title);
  console.log('\n✨ Dashboard updated successfully!');
  console.log('\nYou can now view the activity at: /dashboard/activities');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
