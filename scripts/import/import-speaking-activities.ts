import { PrismaClient } from '@prisma/client';
import { housingBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/housing-basics';
import { bankingBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/banking-basics';
import { workplaceBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/workplace-basics';
import { healthcareBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/healthcare-basics';
import { transportationBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/transportation-basics';
import { foodBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/food-basics';
import { perfectTensesPracticeDailyWarmup } from '../../src/content/speaking/daily-warmups/perfect-tenses-practice';
import { classroomBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/classroom-basics';
import { careerBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/career-basics';
import { wellnessBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/wellness-basics';
import { gerundsInfinitivesDailyWarmup } from '../../src/content/speaking/daily-warmups/gerunds-infinitives';
import { perfectContinuousDailyWarmup } from '../../src/content/speaking/daily-warmups/perfect-continuous';
import { newYearGoalsDailyWarmup } from '../../src/content/speaking/daily-warmups/new-year-goals';
import { passiveVoiceDailyWarmup } from '../../src/content/speaking/daily-warmups/passive-voice';
import { reportedSpeechDailyWarmup } from '../../src/content/speaking/daily-warmups/reported-speech';
import { usedToStructuresDailyWarmup } from '../../src/content/speaking/daily-warmups/used-to-structures';

const prisma = new PrismaClient();

// Activities to import
const speakingActivities = [
  {
    id: 'speaking-housing-basics',
    content: housingBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-banking-basics',
    content: bankingBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-workplace-basics',
    content: workplaceBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-healthcare-basics',
    content: healthcareBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-transportation-basics',
    content: transportationBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-food-basics',
    content: foodBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-perfect-tenses',
    content: perfectTensesPracticeDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-classroom-basics',
    content: classroomBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-career-basics',
    content: careerBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-wellness-basics',
    content: wellnessBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-gerunds-infinitives',
    content: gerundsInfinitivesDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-perfect-continuous',
    content: perfectContinuousDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-new-year-goals',
    content: newYearGoalsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-passive-voice',
    content: passiveVoiceDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-reported-speech',
    content: reportedSpeechDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-used-to-structures',
    content: usedToStructuresDailyWarmup,
    level: 'advanced',
  },
];

async function main() {
  console.log('🗣️  Starting speaking activities import...\n');

  // Get the teacher user (assuming there's a teacher account)
  const teacher = await prisma.user.findFirst({
    where: { role: 'teacher' }
  });

  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    return;
  }

  console.log(`✓ Found teacher: ${teacher.name}\n`);

  let importCount = 0;
  let skipCount = 0;

  // Process each speaking activity
  for (const activity of speakingActivities) {
    // Check if this activity already exists
    const existing = await prisma.activity.findUnique({
      where: { id: activity.id }
    });

    if (existing) {
      console.log(`⏭️  Skipping ${activity.content.title} (already exists)`);
      skipCount++;
      continue;
    }

    // Create the activity
    const created = await prisma.activity.create({
      data: {
        id: activity.id,
        title: activity.content.title,
        description: activity.content.description || '',
        type: 'speaking',
        category: 'speaking',
        level: activity.level,
        content: JSON.stringify(activity.content),
        createdBy: teacher.id
      }
    });

    console.log(`✅ Created ${activity.content.title}`);
    console.log(`   - ID: ${created.id}`);
    console.log(`   - Level: ${activity.level}`);
    console.log(`   - Prompts: ${activity.content.prompts.length}`);
    console.log(`   - Key Phrases: ${activity.content.keyPhrases?.length || 0}\n`);
    importCount++;
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${importCount} speaking activities`);
  console.log(`   ⏭️  Skipped: ${skipCount} activities (already existed)`);
  console.log(`   📝 Total activities: ${speakingActivities.length}`);
  console.log('\n✨ Import complete!\n');

  // Show sample query to verify
  console.log('📋 Sample query to verify:');
  const sampleActivity = await prisma.activity.findFirst({
    where: {
      type: 'speaking',
    },
    select: {
      id: true,
      title: true,
      category: true,
    }
  });

  if (sampleActivity) {
    console.log(`   Found activity: ${sampleActivity.title} (ID: ${sampleActivity.id})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
