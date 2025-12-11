import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface VerbData {
  v1: string;
  v1_3rd: string;
  v1_ing: string;
  v2: string;
  v3: string;
}

interface WeekData {
  due_date: string;
  verbs: Record<string, VerbData>;
}

interface QuizzesData {
  [week: string]: WeekData;
}

async function main() {
  console.log('🚀 Starting verb quiz import...\n');

  // Read the quizzes.json file
  const quizzesPath = path.join(process.cwd(), 'ESOL_LMS', 'quizzes.json');
  const quizzesData: QuizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

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

  // Process each week
  for (const [weekName, weekData] of Object.entries(quizzesData)) {
    const title = `${weekName} - Irregular Verb Quiz`;

    // Check if this quiz already exists
    const existing = await prisma.activity.findFirst({
      where: {
        title: title,
        type: 'quiz'
      }
    });

    if (existing) {
      console.log(`⏭️  Skipping ${weekName} (already exists)`);
      skipCount++;
      continue;
    }

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        title: title,
        description: `Complete the irregular verb forms for this week's verbs. Test your knowledge of V1 (3rd person), V1-ing, V2 (past), and V3 (past participle).`,
        type: 'quiz',
        category: 'quizzes',
        level: 'intermediate',
        content: JSON.stringify({
          type: 'verb-quiz',
          week: weekName,
          due_date: weekData.due_date,
          verbs: weekData.verbs
        }),
        createdBy: teacher.id
      }
    });

    console.log(`✅ Created ${weekName} (Activity ID: ${activity.id})`);
    console.log(`   - Due date: ${weekData.due_date}`);
    console.log(`   - Verbs: ${Object.keys(weekData.verbs).join(', ')}`);
    importCount++;

    // Create a calendar event for the due date
    try {
      await prisma.calendarEvent.create({
        data: {
          title: `${weekName} Quiz Due`,
          description: `Irregular Verb Quiz - ${Object.keys(weekData.verbs).join(', ')}`,
          date: new Date(weekData.due_date),
          type: 'quiz',
          createdBy: teacher.id
        }
      });
      console.log(`   📅 Calendar event created\n`);
    } catch (error) {
      console.log(`   ⚠️  Could not create calendar event (may already exist)\n`);
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${importCount} quizzes`);
  console.log(`   ⏭️  Skipped: ${skipCount} quizzes (already existed)`);
  console.log(`   📝 Total in file: ${Object.keys(quizzesData).length} quizzes`);
  console.log('\n✨ Import complete!\n');

  // Show sample query to verify
  console.log('📋 Sample query to verify:');
  const sampleQuiz = await prisma.activity.findFirst({
    where: {
      type: 'quiz',
      content: {
        contains: '"type":"verb-quiz"'
      }
    },
    select: {
      id: true,
      title: true,
    }
  });

  if (sampleQuiz) {
    console.log(`   Found quiz: ${sampleQuiz.title} (ID: ${sampleQuiz.id})`);
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
