import { PrismaClient } from '@prisma/client';
import { presentSimpleContent } from '../src/content/grammar/present-simple';
import { pastSimpleContent } from '../src/content/grammar/past-simple';
import { futureSimpleContent } from '../src/content/grammar/future-simple';
import { presentContinuousContent } from '../src/content/grammar/present-continuous';
import { pastContinuousContent } from '../src/content/grammar/past-continuous';
import { futureContinuousContent } from '../src/content/grammar/future-continuous';
import { presentPerfectContent } from '../src/content/grammar/present-perfect';
import { simpleTensesReviewContent } from '../src/content/grammar/simple-tenses-review';
import { continuousTensesReviewContent } from '../src/content/grammar/continuous-tenses-review';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up existing activities...');

  // Delete all existing activities
  await prisma.activity.deleteMany({});
  console.log('✅ Removed all existing activities');

  console.log('\n📚 Adding Simple Tense Guides...');

  // Present Simple
  const presentSimple = await prisma.activity.create({
    data: {
      title: 'Present Simple Guide',
      description: 'Learn Present Simple tense with step-by-step lessons covering meaning, usage, positive/negative/question forms, time expressions, and interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(presentSimpleContent)
    }
  });
  console.log('✅ Added:', presentSimple.title);

  // Past Simple
  const pastSimple = await prisma.activity.create({
    data: {
      title: 'Past Simple Guide',
      description: 'Master Past Simple tense including regular and irregular verbs, positive/negative/question forms, and time expressions with interactive practice.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(pastSimpleContent)
    }
  });
  console.log('✅ Added:', pastSimple.title);

  // Future Simple
  const futureSimple = await prisma.activity.create({
    data: {
      title: 'Future Simple Guide',
      description: 'Learn Future Simple (will) for predictions, promises, and spontaneous decisions with clear examples and interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(futureSimpleContent)
    }
  });
  console.log('✅ Added:', futureSimple.title);

  console.log('\n📚 Adding Continuous Tense Guides...');

  // Present Continuous
  const presentContinuous = await prisma.activity.create({
    data: {
      title: 'Present Continuous Guide',
      description: 'Learn Present Continuous for actions happening now and temporary situations with step-by-step lessons and practice exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(presentContinuousContent)
    }
  });
  console.log('✅ Added:', presentContinuous.title);

  // Past Continuous
  const pastContinuous = await prisma.activity.create({
    data: {
      title: 'Past Continuous Guide',
      description: 'Master Past Continuous for actions in progress in the past and interrupted actions with interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(pastContinuousContent)
    }
  });
  console.log('✅ Added:', pastContinuous.title);

  // Future Continuous
  const futureContinuous = await prisma.activity.create({
    data: {
      title: 'Future Continuous Guide',
      description: 'Learn Future Continuous for actions that will be in progress at specific future times with clear examples and practice.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(futureContinuousContent)
    }
  });
  console.log('✅ Added:', futureContinuous.title);

  console.log('\n📚 Adding Perfect Tenses...');

  // Present Perfect
  const presentPerfect = await prisma.activity.create({
    data: {
      title: 'Present Perfect Guide',
      description: 'Master Present Perfect for life experiences, recent actions, and unfinished time periods with clear explanations and practice.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(presentPerfectContent)
    }
  });
  console.log('✅ Added:', presentPerfect.title);

  console.log('\n📚 Adding Review Guides...');

  // Simple Tenses Review
  const simpleTensesReview = await prisma.activity.create({
    data: {
      title: 'Simple Tenses Review',
      description: 'Comprehensive review of Present Simple, Past Simple, and Future Simple tenses with comparison exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(simpleTensesReviewContent)
    }
  });
  console.log('✅ Added:', simpleTensesReview.title);

  // Continuous Tenses Review
  const continuousTensesReview = await prisma.activity.create({
    data: {
      title: 'Continuous Tenses Review',
      description: 'Comprehensive review of Present Continuous, Past Continuous, and Future Continuous tenses with comparison exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(continuousTensesReviewContent)
    }
  });
  console.log('✅ Added:', continuousTensesReview.title);

  console.log('\n🎮 Adding Games...');

  // Numbers Game
  const numbersGameContent = JSON.stringify({
    type: 'numbers-game',
    category: 'Basic Numbers (0-99)'
  });

  const numbersGame = await prisma.activity.create({
    data: {
      id: 'numbers-game',
      title: 'Numbers to English Words',
      description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
      category: 'numbers',
      type: 'game',
      level: 'beginner',
      content: numbersGameContent,
    }
  });
  console.log('✅ Added:', numbersGame.title);

  console.log('\n✨ Dashboard updated successfully!');
  console.log(`\nAdded ${9} grammar guides:`);
  console.log('  - 3 Simple tenses (Present, Past, Future)');
  console.log('  - 3 Continuous tenses (Present, Past, Future)');
  console.log('  - 1 Perfect tense (Present Perfect)');
  console.log('  - 2 Review guides (Simple Tenses, Continuous Tenses)');
  console.log(`\nAdded 1 game:`);
  console.log('  - Numbers to English Words');
  console.log('\nYou can now view all activities at: /dashboard');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
