import { prisma } from '@/lib/prisma';

async function main() {
  try {
    // Find the user marlie
    const user = await prisma.user.findUnique({
      where: { username: 'marlie' }
    });

    if (!user) {
      console.log('User "marlie" not found');
      return;
    }

    console.log(`Found user: ${user.username} (ID: ${user.id})`);

    // Clear activity progress for gerund-infinitive
    const deletedProgress = await prisma.activityProgress.deleteMany({
      where: {
        userId: user.id,
        activityId: 'gerund-infinitive-game'
      }
    });

    console.log(`Deleted ${deletedProgress.count} activity progress record(s)`);

    // Clear any submissions for the gerund-infinitive game
    const deletedSubmissions = await prisma.submission.deleteMany({
      where: {
        userId: user.id,
        activity: {
          id: 'gerund-infinitive-game'
        }
      }
    });

    console.log(`Deleted ${deletedSubmissions.count} submission(s)`);

    console.log('\n✅ All gerund-infinitive progress cleared for marlie');
    console.log('They can now start fresh!');
  } catch (error) {
    console.error('Error clearing progress:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
