import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Timeline Tenses Game activity...');

  const activityData = {
    title: 'Timeline Tenses',
    description: 'Visualize verb tenses on a timeline. Draw timelines from sentences or fill in verbs from timeline diagrams.',
    content: JSON.stringify({
      type: 'timeline-tenses',
    }),
    type: 'game',
    ui: 'timeline-tenses',
    category: 'games',
    level: 'intermediate',
    isReleased: true,
  };

  // Check if activity already exists
  const existing = await prisma.activity.findFirst({
    where: { title: 'Timeline Tenses' },
  });

  if (existing) {
    await prisma.activity.update({
      where: { id: existing.id },
      data: activityData,
    });
    console.log(`Updated existing activity: ${existing.id}`);
  } else {
    const created = await prisma.activity.create({
      data: activityData,
    });
    console.log(`Created new activity: ${created.id}`);
  }

  console.log('\nDone! Timeline Tenses game is now available in the games category.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
