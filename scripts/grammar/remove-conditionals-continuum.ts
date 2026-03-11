import { PrismaClient } from '@prisma/client';

const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('remove conditionals continuum guide');

async function main() {
  console.log('🧹 Removing Conditionals Continuum Guide...');

  const id = 'conditionals-continuum-guide';

  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        submissions: true,
        assignments: true,
      }
    });

    if (activity) {
      console.log(`\nFound activity: ${activity.title} (${id})`);
      console.log(`  - ${activity.submissions.length} submissions`);
      console.log(`  - ${activity.assignments.length} assignments`);

      // Delete related records first
      if (activity.assignments.length > 0) {
        await prisma.assignment.deleteMany({
          where: { activityId: id }
        });
        console.log(`  ✅ Deleted ${activity.assignments.length} assignments`);
      }

      if (activity.submissions.length > 0) {
        await prisma.submission.deleteMany({
          where: { activityId: id }
        });
        console.log(`  ✅ Deleted ${activity.submissions.length} submissions`);
      }

      // Delete the activity
      await prisma.activity.delete({
        where: { id }
      });
      console.log(`  ✅ Deleted activity: ${activity.title}`);
    } else {
      console.log(`  ⏭️  Activity not found: ${id}`);
    }
  } catch (error) {
    console.error(`  ❌ Error deleting ${id}:`, error);
  }

  console.log('\n✨ Cleanup complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
