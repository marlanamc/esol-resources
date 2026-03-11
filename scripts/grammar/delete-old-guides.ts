import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('delete old guides');

async function main() {
  console.log('🗑️  Deleting old redundant guides...\n');

  // Old guides to delete
  const oldGuideIds = [
    // Old gerunds/infinitives guides
    'verbs-plus-gerunds',
    'gerunds-prepositions',
    'gerunds-infinitives-patterns-guide',
    'infinitives-vs-gerunds',

    // Old conditionals guides
    'conditionals-continuum-guide',
    'conditionals-review',

    // Old past perfect guides
    'past-perfect-guide',
    'past-perfect', // Old version, we have past-perfect-jobs now
  ];

  for (const id of oldGuideIds) {
    try {
      const deleted = await prisma.activity.delete({
        where: { id },
      });
      console.log(`✅ Deleted: ${deleted.title} (${id})`);
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log(`⚠️  Not found: ${id} (already deleted)`);
      } else {
        console.error(`❌ Error deleting ${id}:`, error.message);
      }
    }
  }

  console.log('\n✨ Cleanup complete!');

  // Show remaining guides
  const remaining = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'Conditionals' } },
        { title: { contains: 'Gerunds' } },
        { title: { contains: 'Infinitives' } },
        { title: { contains: 'Past Perfect' } },
      ],
      type: 'guide',
    },
    select: {
      id: true,
      title: true,
      isReleased: true,
    },
    orderBy: {
      title: 'asc',
    },
  });

  console.log('\n📚 Remaining guides:');
  remaining.forEach(guide => {
    const status = guide.isReleased ? '🟢 Released' : '🔴 Unreleased';
    console.log(`${status} - ${guide.title} (${guide.id})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
