import { PrismaClient } from '@prisma/client';
import { medicineLabelsInsuranceContent } from '../src/content/grammar/medicine-labels-insurance';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Medicine Labels & Insurance Cards grammar guide...');

  await prisma.activity.upsert({
    where: { id: "medicine-labels-insurance" },
    update: {
      content: JSON.stringify(medicineLabelsInsuranceContent),
      title: "Reading Medicine Labels & Insurance Cards",
      type: "guide",
      category: "grammar",
      description: "A practical literacy guide for adult ESOL learners: read medicine labels (imperatives, modals, dosage, warnings), understand OTC vs. prescription, decode insurance cards, navigate US insurance types, and use empowerment language at the pharmacy and doctor's office.",
      isReleased: true,
    },
    create: {
      id: "medicine-labels-insurance",
      title: "Reading Medicine Labels & Insurance Cards",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(medicineLabelsInsuranceContent),
      description: "A practical literacy guide for adult ESOL learners: read medicine labels (imperatives, modals, dosage, warnings), understand OTC vs. prescription, decode insurance cards, navigate US insurance types, and use empowerment language at the pharmacy and doctor's office.",
      isReleased: true,
    },
  });

  console.log('✅ Medicine Labels & Insurance Cards guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
