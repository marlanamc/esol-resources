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
  console.log('🔄 Starting verb quiz date update...\n');

  // Read the quizzes.json file
  const quizzesPath = path.join(process.cwd(), 'ESOL_LMS', 'quizzes.json');
  const quizzesData: QuizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

  let updateCount = 0;
  let notFoundCount = 0;

  // Process each week
  const weekEntries = Object.entries(quizzesData);
  for (let i = 0; i < weekEntries.length; i++) {
    const [weekName, weekData] = weekEntries[i];
    const quizNumber = i + 1;
    const title = `Verb Quiz ${quizNumber}`;

    // Find the existing quiz
    const existing = await prisma.activity.findFirst({
      where: {
        title: title,
        type: 'quiz'
      }
    });

    if (!existing) {
      console.log(`❌ Verb Quiz ${quizNumber} not found in database`);
      notFoundCount++;
      continue;
    }

    // Parse existing content and update the due_date
    const content = JSON.parse(existing.content as string);
    const oldDate = content.due_date;
    content.due_date = weekData.due_date;

    // Update the activity
    await prisma.activity.update({
      where: { id: existing.id },
      data: {
        content: JSON.stringify(content)
      }
    });

    console.log(`✅ Updated Verb Quiz ${quizNumber}: ${oldDate} → ${weekData.due_date}`);
    updateCount++;
  }

  console.log('\n📊 Update Summary:');
  console.log(`   ✅ Updated: ${updateCount} quizzes`);
  console.log(`   ❌ Not found: ${notFoundCount} quizzes`);
  console.log('\n✨ Update complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during update:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
