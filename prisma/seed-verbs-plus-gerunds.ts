import { PrismaClient } from '@prisma/client';
import { verbsPlusGerundsContent } from '../src/content/grammar/verbs-plus-gerunds';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Verbs + Gerunds grammar guide...');

  await prisma.activity.upsert({
    where: { id: "verbs-plus-gerunds" },
    update: {
      content: JSON.stringify(verbsPlusGerundsContent),
      title: "Verbs + Gerunds Guide",
      type: "guide",
      category: "grammar",
      description: "Master verbs that take gerunds: avoid, enjoy, finish, keep, stop, quit, and more. Essential for discussing habits and wellness goals.",
    },
    create: {
      id: "verbs-plus-gerunds",
      title: "Verbs + Gerunds Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(verbsPlusGerundsContent),
      description: "Master verbs that take gerunds: avoid, enjoy, finish, keep, stop, quit, and more. Essential for discussing habits and wellness goals.",
    },
  });

  console.log('✅ Verbs + Gerunds guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
