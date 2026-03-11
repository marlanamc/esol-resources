import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../scripts/lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('delete conditional guides');

async function main() {
  console.log('Deleting conditional guides from database...');

  const activityIds = [
    'conditionals-second-third',
    'conditionals-continuum-guide',
    'future-conditional'
  ];

  for (const id of activityIds) {
    const deleted = await prisma.activity.delete({
      where: { id },
    }).catch(() => null);

    if (deleted) {
      console.log(`✅ Deleted: ${id}`);
    } else {
      console.log(`⚠️  Not found or already deleted: ${id}`);
    }
  }

  console.log('✅ Conditional guides removed successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
