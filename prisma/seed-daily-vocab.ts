import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Daily Vocab Review activity...')

  const activityId = 'vocab-daily-review'

  await prisma.activity.upsert({
    where: { id: activityId },
    update: {
      title: 'Daily Vocab Review',
      description: 'Your year-long vocab bank is ready whenever you want a short phone-sized study session.',
      type: 'word-list',
      category: 'vocabulary',
      isReleased: true,
      content: JSON.stringify({ description: 'Daily Vocab Review' }),
    },
    create: {
      id: activityId,
      title: 'Daily Vocab Review',
      description: 'Your year-long vocab bank is ready whenever you want a short phone-sized study session.',
      type: 'word-list',
      category: 'vocabulary',
      isReleased: true,
      content: JSON.stringify({ description: 'Daily Vocab Review' }),
    },
  })

  console.log('Successfully seeded Daily Vocab Review activity.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
