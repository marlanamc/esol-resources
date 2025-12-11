import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting verb quizzes...\n');

  // Delete all verb quiz activities
  const deleteResult = await prisma.activity.deleteMany({
    where: {
      type: 'quiz',
      content: {
        contains: '"type":"verb-quiz"'
      }
    }
  });

  console.log(`✅ Deleted ${deleteResult.count} verb quiz activities\n`);

  // Delete associated calendar events
  const calendarResult = await prisma.calendarEvent.deleteMany({
    where: {
      title: {
        contains: 'Quiz Due'
      },
      type: 'quiz'
    }
  });

  console.log(`✅ Deleted ${calendarResult.count} calendar events\n`);

  console.log('✨ Cleanup complete! You can now run the import script again.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
