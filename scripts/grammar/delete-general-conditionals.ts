import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('delete general conditionals guide');

async function main() {
  console.log('🗑️  Deleting general conditionals guide...\n');

  try {
    const deleted = await prisma.activity.delete({
      where: { id: 'conditionals-zero-first' },
    });
    console.log(`✅ Deleted: ${deleted.title} (conditionals-zero-first)`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.log('⚠️  Already deleted');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
