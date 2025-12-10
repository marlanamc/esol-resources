const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProgress() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'marlie' },
            select: {
                id: true,
                name: true,
                points: true,
                weeklyPoints: true,
                currentStreak: true,
            }
        });

        if (!user) {
            console.log('❌ User "marlie" not found');
            return;
        }

        console.log('✅ User found:', user);
        console.log('\n📊 Gamification Stats:');
        console.log(`  Total Points: ${user.points}`);
        console.log(`  Weekly Points: ${user.weeklyPoints}`);
        console.log(`  Current Streak: ${user.currentStreak}`);

        // Check activity progress
        const progressEntries = await prisma.activityProgress.findMany({
            where: { userId: user.id },
            include: {
                activity: {
                    select: {
                        title: true,
                        type: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        console.log(`\n📝 Activity Progress (${progressEntries.length} activities):`);
        if (progressEntries.length === 0) {
            console.log('  No progress entries found');
        } else {
            progressEntries.forEach((entry) => {
                console.log(`  - ${entry.activity.title}: ${entry.progress}% (${entry.status})`);
                console.log(`    Updated: ${entry.updatedAt}`);
            });
        }

        // Check submissions
        const submissions = await prisma.submission.findMany({
            where: { userId: user.id },
            include: {
                activity: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        console.log(`\n📤 Recent Submissions (${submissions.length}):`);
        if (submissions.length === 0) {
            console.log('  No submissions found');
        } else {
            submissions.forEach((sub) => {
                console.log(`  - ${sub.activity.title}: ${sub.status} (Score: ${sub.score ?? 'N/A'})`);
                console.log(`    Completed: ${sub.completedAt || 'Not completed'}`);
            });
        }

        // Check points ledger
        const recentPoints = await prisma.pointsLedger.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        console.log(`\n💰 Recent Points (${recentPoints.length} entries):`);
        if (recentPoints.length === 0) {
            console.log('  No points entries found');
        } else {
            recentPoints.forEach((entry) => {
                console.log(`  - ${entry.reason}: +${entry.points} points`);
                console.log(`    ${entry.createdAt}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkProgress();
