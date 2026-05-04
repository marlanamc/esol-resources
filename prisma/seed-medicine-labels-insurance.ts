import { PrismaClient } from '@prisma/client';
import { medicineLabelsInsuranceContent } from '../src/content/grammar/medicine-labels-insurance';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Medicine Labels & Insurance Cards grammar guide...');

  await prisma.activity.upsert({
    where: { id: 'medicine-labels-insurance' },
    update: {
      content: JSON.stringify(medicineLabelsInsuranceContent),
      title: 'Medicine Labels & Insurance Cards Guide',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      description:
        'Read medicine labels, warnings, dosage instructions, pharmacy questions, insurance cards, and common U.S. insurance terms with real-world practice.',
      isReleased: true,
    },
    create: {
      id: 'medicine-labels-insurance',
      title: 'Medicine Labels & Insurance Cards Guide',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(medicineLabelsInsuranceContent),
      description:
        'Read medicine labels, warnings, dosage instructions, pharmacy questions, insurance cards, and common U.S. insurance terms with real-world practice.',
      isReleased: true,
    },
  });

  console.log('Medicine Labels & Insurance Cards guide seeded successfully.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
