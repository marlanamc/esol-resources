import { PrismaClient } from '@prisma/client';
import { futureConditionalContent } from '../src/content/grammar/future-conditional';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Future Conditional grammar guide...');

  await prisma.activity.upsert({
    where: { id: "future-conditional" },
    update: {
      content: JSON.stringify(futureConditionalContent),
      title: "Future Conditional Guide",
      type: "guide",
      category: "grammar",
      description: "Master first conditional for planning wellness goals, managing stress, and expressing cause-and-effect relationships.",
    },
    create: {
      id: "future-conditional",
      title: "Future Conditional Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(futureConditionalContent),
      description: "Master first conditional for planning wellness goals, managing stress, and expressing cause-and-effect relationships.",
    },
  });

  console.log('✅ Future Conditional guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
