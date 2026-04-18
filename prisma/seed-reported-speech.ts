import { PrismaClient } from '@prisma/client';
import { reportedSpeechContent } from '../src/content/grammar/reported-speech';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Reported Speech grammar guide...');

  await prisma.activity.upsert({
    where: { id: "reported-speech" },
    update: {
      content: JSON.stringify(reportedSpeechContent),
      title: "Reported Speech Guide",
      type: "guide",
      category: "grammar",
      description: "Healthcare-themed reported speech: clinic-day journey with photos and dialogues for MyChart, reception, exam rooms, pharmacy, and discharge. Say vs tell, tense backshift, and commands.",
    },
    create: {
      id: "reported-speech",
      title: "Reported Speech Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(reportedSpeechContent),
      description: "Healthcare-themed reported speech: clinic-day journey with photos and dialogues for MyChart, reception, exam rooms, pharmacy, and discharge. Say vs tell, tense backshift, and commands.",
    },
  });

  console.log('✅ Reported Speech guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
