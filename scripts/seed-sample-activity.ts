import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample activity data for reports...');

  // Get the teacher account
  const teacher = await prisma.user.findFirst({
    where: { role: 'teacher', username: 'teacher' },
  });

  if (!teacher) {
    console.error('❌ Teacher account not found. Please run the main seed first.');
    return;
  }

  // Get teacher's classes
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    include: {
      enrollments: {
        include: { student: true },
      },
    },
  });

  if (classes.length === 0) {
    console.error('❌ No classes found for teacher. Please create classes first.');
    return;
  }

  console.log(`📚 Found ${classes.length} classes for teacher`);

  // Get some activities
  const activities = await prisma.activity.findMany({
    take: 10,
    where: { deletedAt: null },
  });

  if (activities.length === 0) {
    console.error('❌ No activities found. Please create some activities first.');
    return;
  }

  console.log(`🎯 Found ${activities.length} activities`);

  // Get all students from teacher's classes
  const students = classes.flatMap((cls) =>
    cls.enrollments.map((e) => e.student)
  );

  if (students.length === 0) {
    console.error('❌ No students enrolled in classes.');
    return;
  }

  console.log(`👥 Found ${students.length} students`);

  // Generate points ledger entries for the last 7 days
  const now = new Date();
  const daysAgo = 7;
  let entriesCreated = 0;

  for (let day = 0; day < daysAgo; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    // Each student does 1-5 activities per day
    for (const student of students) {
      const numActivities = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < numActivities; i++) {
        const activity =
          activities[Math.floor(Math.random() * activities.length)];
        const points = Math.floor(Math.random() * 15) + 5; // 5-20 points

        await prisma.pointsLedger.create({
          data: {
            userId: student.id,
            points,
            source: 'activity',
            reason: activity.title,
            createdAt: date,
          },
        });

        // Also update user's total points
        await prisma.user.update({
          where: { id: student.id },
          data: {
            points: { increment: points },
            weeklyPoints: { increment: points },
          },
        });

        entriesCreated++;
      }
    }
  }

  console.log(`✅ Created ${entriesCreated} activity entries in PointsLedger`);
  console.log('🎉 Sample data seeded! Check the reports page now.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
