import { PrismaClient } from '@prisma/client';
import { MINIMAL_PAIR_CONTRASTS, type MinimalPairContrastId } from '@/lib/minimal-pairs-data';
import { PRONUNCIATION_SENTENCE_LISTENING_SETS } from '@/data/pronunciation-sentence-listening';
import type { PronunciationActivityMetadata } from '@/types/activity';

const prisma = new PrismaClient();

const MINIMAL_PAIR_ORDER: Record<MinimalPairContrastId, number> = {
  'short-i-long-e': 1,
  'b-v': 2,
  'r-l': 3,
  'sh-ch': 4,
  's-th': 5,
  'v-w': 6,
  'p-b': 7,
};

function createMinimalPairsMeta(contrastId: MinimalPairContrastId): PronunciationActivityMetadata {
  const contrast = MINIMAL_PAIR_CONTRASTS.find((entry) => entry.id === contrastId);
  return {
    skillFamily: 'minimal-pairs',
    practiceMode: 'listening',
    targetLabel: contrast?.label ?? contrastId,
    targetDescription: contrast?.description ?? 'hear the difference between similar English sounds',
    recommendedOrder: MINIMAL_PAIR_ORDER[contrastId],
  };
}

async function main() {
  // Base seed creates the primary instructor as role "admin" (marlie).
  const teacher = await prisma.user.findFirst({
    where: { role: { in: ['admin', 'teacher'] } },
    select: { id: true },
  });

  if (!teacher) {
    throw new Error('No teacher/admin account found. Run base seed first.');
  }

  console.log('Seeding pronunciation expansion activities...');

  for (const contrast of MINIMAL_PAIR_CONTRASTS) {
    const title = `${contrast.label} Listening`;
    await prisma.activity.upsert({
      where: { id: `pron-${contrast.id}-listening` },
      update: {
        title,
        description: contrast.description,
        type: 'game',
        ui: 'minimal-pairs',
        category: 'pronunciation',
        level: 'beginner',
        isReleased: true,
        content: JSON.stringify({
          type: 'minimal-pairs',
          contrastId: contrast.id,
          difficulty: 'mixed',
          roundSize: 12,
          meta: createMinimalPairsMeta(contrast.id),
        }),
        createdBy: teacher.id,
      },
      create: {
        id: `pron-${contrast.id}-listening`,
        title,
        description: contrast.description,
        type: 'game',
        ui: 'minimal-pairs',
        category: 'pronunciation',
        level: 'beginner',
        isReleased: true,
        content: JSON.stringify({
          type: 'minimal-pairs',
          contrastId: contrast.id,
          difficulty: 'mixed',
          roundSize: 12,
          meta: createMinimalPairsMeta(contrast.id),
        }),
        createdBy: teacher.id,
      },
    });
  }

  const edData = {
    title: '-ed Sounds Game',
    description: 'Master the three pronunciations of -ed endings: /t/, /d/, and /ɪd/.',
    type: 'game',
    ui: 'ed-pronunciation',
    category: 'pronunciation',
    level: 'beginner',
    isReleased: true,
    content: JSON.stringify({
      type: 'ed-pronunciation',
      mode: 'mixed',
      difficulty: 'mixed',
    }),
    createdBy: teacher.id,
  } as const;

  const existingEd = await prisma.activity.findFirst({
    where: {
      OR: [
        { id: 'ed-pronunciation' },
        { title: '-ed Sounds Game' },
      ],
    },
    select: { id: true },
  });

  if (existingEd) {
    await prisma.activity.update({
      where: { id: existingEd.id },
      data: edData,
    });
  } else {
    await prisma.activity.create({
      data: {
        id: 'ed-pronunciation',
        ...edData,
      },
    });
  }

  const sentenceSeeds = [
    { id: 'pronunciation-sentences-lab', title: 'Sentence Listening Lab', key: null },
    { id: 'pron-sentences-short-i-long-e', title: 'Short i vs Long e in Sentences', key: 'short-i-long-e' as const },
    { id: 'pron-sentences-b-v', title: 'B vs V in Sentences', key: 'b-v' as const },
    { id: 'pron-sentences-r-l', title: 'R vs L in Sentences', key: 'r-l' as const },
    { id: 'pron-sentences-sh-ch', title: 'Sh vs Ch in Sentences', key: 'sh-ch' as const },
    { id: 'pron-sentences-s-th', title: 'S vs Th in Sentences', key: 's-th' as const },
    { id: 'pron-sentences-v-w', title: 'V vs W in Sentences', key: 'v-w' as const },
    { id: 'pron-mixed-review', title: 'Pronunciation Mixed Review', key: 'mixed-review' as const },
  ];

  for (const seed of sentenceSeeds) {
    const set = seed.key
      ? PRONUNCIATION_SENTENCE_LISTENING_SETS[seed.key]
      : {
          targetSound: 'Sentence listening',
          instructions: 'Choose a track, listen to the sentence, then choose the line you heard.',
          roundSize: 5,
          setKeys: ['short-i-long-e', 'b-v', 'r-l', 'sh-ch', 's-th', 'v-w', 'mixed-review'],
          sentences: [],
          meta: {
            skillFamily: 'sentence-listening',
            practiceMode: 'sentence-context',
            targetLabel: 'Sentence listening lab',
            targetDescription: 'listen to short sentences with target sounds in context',
          } satisfies PronunciationActivityMetadata,
        };
    await prisma.activity.upsert({
      where: { id: seed.id },
      update: {
        title: seed.title,
        description: set.meta?.targetDescription ?? 'Listen to short sentences and choose the transcript you heard.',
        type: 'game',
        ui: 'pronunciation-listening',
        category: 'pronunciation',
        level: 'beginner',
        isReleased: true,
        content: JSON.stringify({
          type: 'pronunciation-listening',
          ...set,
        }),
        createdBy: teacher.id,
      },
      create: {
        id: seed.id,
        title: seed.title,
        description: set.meta?.targetDescription ?? 'Listen to short sentences and choose the transcript you heard.',
        type: 'game',
        ui: 'pronunciation-listening',
        category: 'pronunciation',
        level: 'beginner',
        isReleased: true,
        content: JSON.stringify({
          type: 'pronunciation-listening',
          ...set,
        }),
        createdBy: teacher.id,
      },
    });
  }

  console.log('Pronunciation expansion activities are ready.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
