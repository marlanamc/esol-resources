import { PrismaClient } from '@prisma/client';
import { infinitivesVsGerundsContent } from '../src/content/grammar/infinitives-vs-gerunds';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Infinitives vs Gerunds grammar guide...');

  await prisma.activity.upsert({
    where: { id: "infinitives-vs-gerunds" },
    update: {
      content: JSON.stringify(infinitivesVsGerundsContent),
      title: "Infinitives vs Gerunds Guide",
      type: "guide",
      category: "grammar",
      description: "Master when to use infinitives (to + verb) vs gerunds (-ing): decide to, enjoy -ing, stop meanings.",
    },
    create: {
      id: "infinitives-vs-gerunds",
      title: "Infinitives vs Gerunds Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(infinitivesVsGerundsContent),
      description: "Master when to use infinitives (to + verb) vs gerunds (-ing): decide to, enjoy -ing, stop meanings.",
    },
  });

  console.log('✅ Infinitives vs Gerunds guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
