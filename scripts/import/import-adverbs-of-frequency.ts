/**
 * Script to import the "Adverbs of Frequency" activity (matching + fill in the blank)
 *
 * Usage: npx tsx scripts/import/import-adverbs-of-frequency.ts
 */

import { PrismaClient } from '@prisma/client';
import type { VocabularyContent } from '@/types/activity/vocabulary';

const prisma = new PrismaClient();

const ACTIVITY_ID = 'adverbs-of-frequency';
const TITLE = 'How Often? Adverbs of Frequency';
const DESCRIPTION =
  'Match frequency words to real-life examples, then practice where they go in a sentence.';

const content: VocabularyContent = {
  type: 'vocabulary',
  matching: {
    pairs: [
      { id: 1, term: 'always', definition: 'every time — I always bring my binder.' },
      { id: 2, term: 'usually / normally', definition: 'almost every time — I usually take the bus.' },
      { id: 3, term: 'often', definition: 'many times — We often study together.' },
      { id: 4, term: 'sometimes', definition: 'some of the time — I sometimes work on Saturdays.' },
      { id: 5, term: 'occasionally', definition: 'not often — We occasionally meet after class.' },
      { id: 6, term: 'seldom / rarely', definition: 'almost never — She rarely misses class.' },
      { id: 7, term: 'hardly ever', definition: 'almost never — He hardly ever watches TV.' },
      { id: 8, term: 'never', definition: 'no time — I never leave without my keys.' },
    ],
  },
  fillInBlank: {
    sentences: [
      {
        id: 'freq-1',
        text: 'I _____ walk to work. (every time, no exceptions)',
        blanks: ['always'],
        correctAnswers: ['always'],
        options: ['always', 'never', 'occasionally'],
        explanation: 'Always means every time, with no exceptions.',
      },
      {
        id: 'freq-2',
        text: 'I am _____ early for class. (the frequency word goes after "am")',
        blanks: ['usually'],
        correctAnswers: ['usually'],
        options: ['usually', 'hardly ever', 'sometimes'],
        explanation: 'After be (am/is/are), the frequency word comes right after it: I am usually early.',
      },
      {
        id: 'freq-3',
        text: 'I have _____ been to that office before. (the frequency word goes after the helping verb)',
        blanks: ['never'],
        correctAnswers: ['never'],
        options: ['never', 'often', 'usually'],
        explanation: 'After the first helping verb (have/has/will), the frequency word goes right after it: I have never been there.',
      },
      {
        id: 'freq-4',
        text: 'We _____ meet after class, maybe once a month. (not often)',
        blanks: ['occasionally'],
        correctAnswers: ['occasionally'],
        options: ['occasionally', 'always', 'usually'],
        explanation: 'Occasionally means not often, before the main verb.',
      },
      {
        id: 'freq-5',
        text: 'She _____ misses class. (almost never, but not 100%)',
        blanks: ['rarely'],
        correctAnswers: ['rarely'],
        options: ['rarely', 'often', 'always'],
        explanation: 'Rarely/seldom means almost never, before the main verb.',
      },
    ],
  },
};

async function main() {
  console.log('🚀 Importing "How Often? Adverbs of Frequency" activity...\n');

  const teacher = await prisma.user.findFirst({
    where: { role: { in: ['admin', 'teacher'] } },
  });
  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    process.exit(1);
  }
  console.log(`✓ Found teacher: ${teacher.name ?? teacher.username}\n`);

  const activity = await prisma.activity.upsert({
    where: { id: ACTIVITY_ID },
    update: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'vocabulary',
      category: 'grammar',
      contentKind: 'map',
      content: JSON.stringify(content),
      isReleased: true,
    },
    create: {
      id: ACTIVITY_ID,
      title: TITLE,
      description: DESCRIPTION,
      type: 'vocabulary',
      category: 'grammar',
      contentKind: 'map',
      content: JSON.stringify(content),
      isReleased: true,
      createdBy: teacher.id,
    },
  });

  console.log(`✅ Seeded "${TITLE}" (${activity.id})`);
  console.log(`   → /activity/${ACTIVITY_ID}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
