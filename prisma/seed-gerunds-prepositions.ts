import { PrismaClient } from '@prisma/client';
import { gerundsPrepositionsContent } from '../src/content/grammar/gerunds-prepositions';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gerunds After Prepositions grammar guide...');

  await prisma.activity.upsert({
    where: { id: "gerunds-prepositions" },
    update: {
      content: JSON.stringify(gerundsPrepositionsContent),
      title: "Gerunds After Prepositions Guide",
      type: "guide",
      category: "grammar",
      description: "Master gerunds after prepositions: interested in, good at, by + -ing, thank you for. Essential for job applications.",
    },
    create: {
      id: "gerunds-prepositions",
      title: "Gerunds After Prepositions Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(gerundsPrepositionsContent),
      description: "Master gerunds after prepositions: interested in, good at, by + -ing, thank you for. Essential for job applications.",
    },
  });

  console.log('✅ Gerunds After Prepositions guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
