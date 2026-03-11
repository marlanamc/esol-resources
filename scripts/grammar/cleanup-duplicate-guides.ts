import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('cleanup duplicate guides');

async function main() {
  console.log('🧹 Cleaning up duplicate stub guides...');

  // Delete old stub guides that have externalUrl (these are duplicates of full-content guides)
  const duplicateIds = [
    'present-perfect-guide',
    'past-perfect-guide',
    'present-simple-guide',
    'past-simple-guide',
    'future-simple-guide',
    'present-continuous-guide',
    'past-continuous-guide',
    'future-continuous-guide',
    'simple-tenses-review-guide',
    'continuous-tenses-review-guide',
    'future-perfect-guide',
    'present-perfect-continuous-guide',
    'past-perfect-continuous-guide',
    'future-perfect-continuous-guide',
    'perfect-tenses-review-guide',
    'perfect-continuous-tenses-review-guide',
  ];

  const result = await prisma.activity.deleteMany({
    where: {
      id: {
        in: duplicateIds,
      },
    },
  });

  console.log(`✅ Deleted ${result.count} duplicate stub guides`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
