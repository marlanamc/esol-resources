const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Reset weekly points for all students
 * Run this every Tuesday to start a new week (Tuesday - Monday cycle)
 */
async function resetWeeklyPoints() {
    try {
        console.log('🔄 Resetting weekly points...\n');

        // Get current rankings before reset
        const currentRankings = await prisma.user.findMany({
            where: {
                role: 'student',
                weeklyPoints: { gt: 0 },
                // Exclude test user
                username: { not: 'marlie' }
            },
            orderBy: { weeklyPoints: 'desc' },
            select: {
                id: true,
                name: true,
                weeklyPoints: true,
            }
        });

        console.log('📊 Last Week\'s Rankings:');
        currentRankings.forEach((student, idx) => {
            console.log(`  ${idx + 1}. ${student.name}: ${student.weeklyPoints} points`);
        });

        // Update each user's lastWeekRank
        for (let i = 0; i < currentRankings.length; i++) {
            await prisma.user.update({
                where: { id: currentRankings[i].id },
                data: { lastWeekRank: i + 1 },
            });
        }

        // Reset weekly points for all students
        const result = await prisma.user.updateMany({
            where: { role: 'student' },
            data: { weeklyPoints: 0 },
        });

        console.log(`\n✅ Reset complete! ${result.count} students' weekly points reset to 0`);
        console.log('📅 New week started (Tuesday - Monday cycle)');
        console.log(`   Current time: ${new Date().toLocaleString()}`);

    } catch (error) {
        console.error('❌ Error resetting weekly points:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetWeeklyPoints();
